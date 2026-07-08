import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { QuizPayloadSchema, AIOutputSchema, type QuizPayload } from "@/lib/ai/schema";
import {
  buildWireframeSystemPrompt,
  buildWireframeUserPrompt,
  buildExpansionSystemPrompt,
  buildExpansionUserPrompt,
  buildSectionStylerSystemPrompt,
  buildSectionStylerUserPrompt,
  buildSectionCoderSystemPrompt,
  buildSectionCoderUserPrompt,
} from "@/lib/ai/prompt";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export const maxDuration = 60;

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": "https://align.design",
    "X-Title": "Align Website Design Agent",
  },
});

/** Helper to run text LLM completions with fallback options if a model is offline/unavailable */
async function generateLLMText({
  messages,
  temperature,
  responseFormat,
}: {
  messages: any[];
  temperature: number;
  responseFormat?: any;
}): Promise<string> {
  const modelFallbackQueue = [
    process.env.OPENROUTER_TEXT_MODEL ?? "deepseek/deepseek-v4-flash",
    "deepseek/deepseek-v4-flash",
    "google/gemini-2.5-flash",
  ];

  // Clean the :free suffix if present, adding clean paid version to front of the queue
  const envModel = process.env.OPENROUTER_TEXT_MODEL;
  if (envModel && envModel.endsWith(":free")) {
    const paidModel = envModel.replace(":free", "");
    if (!modelFallbackQueue.includes(paidModel)) {
      modelFallbackQueue.unshift(paidModel);
    }
  }

  let lastError: any = null;
  for (const model of modelFallbackQueue) {
    try {
      console.log(`[generateLLMText] Invoking text agent model: ${model}`);
      const completion = await openrouter.chat.completions.create({
        model: model.replace(/[^\x00-\x7F]/g, "-"),
        response_format: responseFormat,
        temperature,
        messages,
      }, {
        timeout: 12000, // 12 seconds timeout to prevent hanging on slow queues
      });
      const content = completion.choices[0]?.message?.content;
      if (content) {
        return content;
      }
    } catch (err: any) {
      console.warn(`[generateLLMText] Model ${model} failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw new Error(`All text generation agent models failed. Last error: ${lastError?.message || lastError}`);
}


/** Shared helper to generate an image using a fallback list of OpenRouter image models */
async function callOpenRouterImageAPI(prompt: string, models: string[]): Promise<string | null> {
  for (const model of models) {
    try {
      console.log(`[ImageAPI] Generating asset using model: ${model}`);
      const res = await fetch("https://openrouter.ai/api/v1/images", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[ImageAPI] Model ${model} returned error status ${res.status}:`, errText);
        continue; // try next fallback model
      }

      const data = await res.json();
      const imgData = data.data?.[0];
      if (imgData?.b64_json) {
        let mime = "image/png";
        const b64 = imgData.b64_json;
        if (b64.startsWith("UklGR")) mime = "image/webp";
        else if (b64.startsWith("/9j/")) mime = "image/jpeg";
        else if (b64.startsWith("iVBOR")) mime = "image/png";
        return `data:${mime};base64,${b64}`;
      }
      if (imgData?.url) {
        return imgData.url;
      }
    } catch (err) {
      console.warn(`[ImageAPI] Exception for model ${model}:`, err);
    }
  }
  return null; // all models failed
}

async function generateLogo(businessName: string): Promise<string | null> {
  const primaryModel = process.env.OPENROUTER_IMAGE_MODEL ?? "google/gemini-2.5-flash-image";
  const models = [
    primaryModel,
    "google/gemini-2.5-flash-image",
    "recraft/recraft-v3",
    "black-forest-labs/flux.2-flex",
  ];
  return callOpenRouterImageAPI(
    `A beautiful clean flat vector logo icon, visual symbol representing a company named "${businessName}". Minimal geometry, high quality, solid white background. Do not write any text, words, or letters.`,
    models
  );
}

async function generateImage(prompt: string): Promise<string | null> {
  const primaryModel = process.env.OPENROUTER_IMAGE_MODEL ?? "google/gemini-2.5-flash-image";
  const models = [
    primaryModel,
    "google/gemini-2.5-flash-image",
    "recraft/recraft-v3",
    "black-forest-labs/flux.2-flex",
  ];
  return callOpenRouterImageAPI(prompt, models);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createSupabaseAdmin();

    let leadId: string;
    let quiz: QuizPayload;

    // ─── Step-based Incremental Multi-Agent Generation ───────────────────────
    if (body.step) {
      const step = parseInt(body.step);
      const targetLeadId = body.leadId;
      if (!targetLeadId) {
        return NextResponse.json({ error: "Missing leadId for step generation" }, { status: 400 });
      }

      const { data: lead, error: fetchError } = await supabase
        .from("leads")
        .select("*")
        .eq("id", targetLeadId)
        .single();

      if (fetchError || !lead) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      }

      const quizPayload = lead.quiz_payload as QuizPayload;
      const aiData = (lead.ai_payload || {}) as any;

      try {
        if (step === 1) {
          console.log(`[generate] Step 1 starting for lead ${targetLeadId}: Wireframe Planner`);
          const wireframeRaw = await generateLLMText({
            temperature: 0.2,
            responseFormat: { type: "json_object" },
            messages: [
              { role: "system", content: buildWireframeSystemPrompt() },
              { role: "user",   content: buildWireframeUserPrompt(quizPayload) },
            ],
          });
          const wireframeParsed = JSON.parse(wireframeRaw);
          
          aiData.sitemap = wireframeParsed.sitemap;
          aiData.wireframe_raw = wireframeRaw;

          await supabase
            .from("leads")
            .update({ ai_payload: aiData })
            .eq("id", targetLeadId);

          return NextResponse.json({ success: true, sitemap: wireframeParsed.sitemap });
        }

        else if (step === 2) {
          console.log(`[generate] Step 2 starting for lead ${targetLeadId}: Branding Stylist`);
          const wireframeRaw = aiData.wireframe_raw;
          if (!wireframeRaw) {
            return NextResponse.json({ error: "Missing step 1 wireframe layout data" }, { status: 400 });
          }

          const styleRaw = await generateLLMText({
            temperature: 0.7,
            responseFormat: { type: "json_object" },
            messages: [
              { role: "system", content: buildExpansionSystemPrompt() },
              { role: "user",   content: buildExpansionUserPrompt(quizPayload, wireframeRaw) },
            ],
          });
          const styleParsed = JSON.parse(styleRaw);

          aiData.business_name = styleParsed.business_name || quizPayload.business_name;
          aiData.colors = styleParsed.colors;
          aiData.typography = styleParsed.typography;
          aiData.icon_style = styleParsed.icon_style || "duotone-colored";
          aiData.icon_set = styleParsed.icon_set;
          aiData.tagline = styleParsed.tagline || "";
          aiData.vibe_summary = styleParsed.vibe_summary || "";
          aiData.style_raw = styleRaw;

          await supabase
            .from("leads")
            .update({ ai_payload: aiData })
            .eq("id", targetLeadId);

          return NextResponse.json({ success: true, colors: aiData.colors, typography: aiData.typography });
        }

        else if (step === 3) {
          console.log(`[generate] Step 3 starting for lead ${targetLeadId}: Content Copywriter`);
          const wireframeRaw = aiData.wireframe_raw;
          const styleRaw = aiData.style_raw;
          if (!wireframeRaw || !styleRaw) {
            return NextResponse.json({ error: "Missing step 1 or step 2 data" }, { status: 400 });
          }

          const stylerRaw = await generateLLMText({
            temperature: 0.6,
            responseFormat: { type: "json_object" },
            messages: [
              { role: "system", content: buildSectionStylerSystemPrompt() },
              { role: "user",   content: buildSectionStylerUserPrompt(quizPayload, wireframeRaw, styleRaw) },
            ],
          });
          const stylerParsed = JSON.parse(stylerRaw);

          aiData.sitemap = stylerParsed.sitemap || aiData.sitemap;
          aiData.demo_content = stylerParsed.demo_content || {};
          aiData.styler_raw = stylerRaw;

          await supabase
            .from("leads")
            .update({ ai_payload: aiData })
            .eq("id", targetLeadId);

          return NextResponse.json({ success: true, demo_content: aiData.demo_content });
        }

        else if (step === 4) {
          console.log(`[generate] Step 4 starting for lead ${targetLeadId}: Section Coder`);
          const stylerRaw = aiData.styler_raw;
          const styleRaw = aiData.style_raw;
          if (!stylerRaw || !styleRaw) {
            return NextResponse.json({ error: "Missing content styler or style data" }, { status: 400 });
          }

          const coderRaw = await generateLLMText({
            temperature: 0.5,
            responseFormat: { type: "json_object" },
            messages: [
              { role: "system", content: buildSectionCoderSystemPrompt() },
              { role: "user",   content: buildSectionCoderUserPrompt(quizPayload, stylerRaw, styleRaw, JSON.stringify(aiData.demo_content || {})) },
            ],
          });
          const coderParsed = JSON.parse(coderRaw);

          aiData.custom_code = coderParsed.custom_code || {};

          await supabase
            .from("leads")
            .update({ ai_payload: aiData })
            .eq("id", targetLeadId);

          return NextResponse.json({ success: true });
        }

        else if (step === 5) {
          console.log(`[generate] Step 5 starting for lead ${targetLeadId}: Logo & Hero Assets`);
          
          // Generate moodboard images instantly using Unsplash curated niches based on style tags
          const tags = (quizPayload.style_tags || []).map(t => t.toLowerCase());
          let moodImages = [
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
          ];
          if (tags.includes("premium") || tags.includes("elegant") || tags.includes("trustworthy") || tags.includes("secure")) {
            moodImages = [
              "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
            ];
          } else if (tags.includes("creative") || tags.includes("bold") || tags.includes("playful")) {
            moodImages = [
              "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
            ];
          } else if (tags.includes("warm") || tags.includes("handcrafted")) {
            moodImages = [
              "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80"
            ];
          }
          aiData.moodboard_images = moodImages;

          const [logoRes, heroRes] = await Promise.allSettled([
            generateLogo(aiData.business_name || quizPayload.business_name),
            generateImage(`A clean high-quality modern website hero section graphic for a brand named "${aiData.business_name || quizPayload.business_name}". Minimal flat design UI, premium business branding mockup background, no text.`),
          ]);

          if (logoRes.status === "fulfilled" && logoRes.value) {
            aiData.logo_url = logoRes.value;
          }
          if (heroRes.status === "fulfilled" && heroRes.value) {
            aiData.hero_image_url = heroRes.value;
          }

          // Validate payload structure
          const validated = AIOutputSchema.safeParse(aiData);
          if (!validated.success) {
            console.error("Step 5 payload Zod schema mismatch:", validated.error.flatten());
            throw new Error(`LLM output schema mismatch inside step 5: ${JSON.stringify(validated.error.flatten())}`);
          }

          // Finalize lead record
          await supabase
            .from("leads")
            .update({ status: "complete", ai_payload: validated.data })
            .eq("id", targetLeadId);

          console.log(`[generate] Lead ${targetLeadId} successfully finalized via step sequence`);
          return NextResponse.json({ success: true, aiData: validated.data });
        }

        return NextResponse.json({ error: "Invalid step index number" }, { status: 400 });

      } catch (err: any) {
        const message = err instanceof Error ? err.message : "Step processing error";
        console.error(`[generate] Error during Step ${step} execution for lead ${targetLeadId}:`, message);
        await supabase
          .from("leads")
          .update({ status: "error", error_message: message })
          .eq("id", targetLeadId);
        return NextResponse.json({ error: message }, { status: 500 });
      }
    }

    // ─── Case A: Register Only Request (Quiz submitted, returns leadId immediately) ──
    if (body.registerOnly) {
      const parseResult = QuizPayloadSchema.safeParse(body.quiz);
      if (!parseResult.success) {
        return NextResponse.json(
          { error: "Invalid quiz payload", details: parseResult.error.flatten() },
          { status: 400 }
        );
      }
      quiz = parseResult.data;

      const { data: newLead, error: insertError } = await supabase
        .from("leads")
        .insert({
          email: quiz.email,
          quiz_payload: quiz,
          status: "pending",
        })
        .select("id")
        .single();

      if (insertError || !newLead) {
        console.error("Supabase insert error:", insertError);
        return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
      }

      return NextResponse.json({ leadId: newLead.id, status: "pending" });
    }

    // ─── Case B: Revision Request (leadId + comment provided) ─────────────────
    if (body.leadId && body.comment !== undefined) {
      leadId = body.leadId;
      const { data: existing, error: fetchError } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();

      if (fetchError || !existing) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      }

      const existingQuiz = existing.quiz_payload as QuizPayload;
      const currentCount = existingQuiz.regenerate_count ?? 0;

      if (currentCount >= 2) {
        return NextResponse.json(
          { error: "Maximum regeneration limit (2 times) reached" },
          { status: 400 }
        );
      }

      // Update quiz payload with comments and increased count
      quiz = {
        ...existingQuiz,
        regenerate_count: currentCount + 1,
        comments: [...(existingQuiz.comments ?? []), body.comment.trim()],
      };

      // Set lead status back to pending & save the updated quiz payload
      const { error: updateError } = await supabase
        .from("leads")
        .update({
          status: "pending",
          quiz_payload: quiz,
          error_message: null,
        })
        .eq("id", leadId);

      if (updateError) {
        console.error("Supabase update error:", updateError);
        return NextResponse.json({ error: "Failed to update lead for regeneration" }, { status: 500 });
      }

      console.log(`[generate] revision request for lead ${leadId} (attempt ${quiz.regenerate_count}/2)`);
    }
    // ─── Case C: Run registered generation for leadId ───────────────────────
    else if (body.leadId) {
      leadId = body.leadId;
      const { data: existing, error: fetchError } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();

      if (fetchError || !existing) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      }

      quiz = existing.quiz_payload as QuizPayload;
      console.log(`[generate] run registered generation for lead ${leadId}`);
    }
    // ─── Case D: Legacy Direct Fresh Generation Request ───────────────────────
    else {
      const parseResult = QuizPayloadSchema.safeParse(body);
      if (!parseResult.success) {
        return NextResponse.json(
          { error: "Invalid quiz payload", details: parseResult.error.flatten() },
          { status: 400 }
        );
      }
      quiz = parseResult.data;

      const { data: newLead, error: insertError } = await supabase
        .from("leads")
        .insert({
          email: quiz.email,
          quiz_payload: quiz,
          status: "pending",
        })
        .select("id")
        .single();

      if (insertError || !newLead) {
        console.error("Supabase insert error:", insertError);
        return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
      }

      leadId = newLead.id as string;
    }

    // ─── Stream response to client ───────────────────────────────────────────
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Send leadId back immediately to trigger redirect & polling
        controller.enqueue(
          encoder.encode(JSON.stringify({ leadId, status: "pending" }) + "\n")
        );

        try {
          // ==========================================
          // AGENT 1: Wireframing (Sitemap & Layouts flow)
          // ==========================================
          console.log(`[generate] starting Agent 1: Wireframe layout planner`);
          const wireframeRaw = await generateLLMText({
            temperature: 0.2, // low temperature for strict constraint adherence
            responseFormat: { type: "json_object" },
            messages: [
              { role: "system", content: buildWireframeSystemPrompt() },
              { role: "user",   content: buildWireframeUserPrompt(quiz) },
            ],
          });
          console.log(`[generate] Agent 1 wireframe layout generated:`, wireframeRaw);

          // ==========================================
          // AGENT 2: Styling & Brand Identity Design
          // ==========================================
          console.log(`[generate] starting Agent 2: Branding strategist`);
          const styleRaw = await generateLLMText({
            temperature: 0.7,
            responseFormat: { type: "json_object" },
            messages: [
              { role: "system", content: buildExpansionSystemPrompt() },
              { role: "user",   content: buildExpansionUserPrompt(quiz, wireframeRaw) },
            ],
          });
          const styleParsed = JSON.parse(styleRaw);
          console.log(`[generate] Agent 2 branding system generated`);

          // ==========================================
          // AGENT 3: Section Styler & Copywriter (Dynamic Copy + Section Colors)
          // ==========================================
          console.log(`[generate] starting Agent 3: Section designer & copywriter`);
          const stylerRaw = await generateLLMText({
            temperature: 0.6,
            responseFormat: { type: "json_object" },
            messages: [
              { role: "system", content: buildSectionStylerSystemPrompt() },
              { role: "user",   content: buildSectionStylerUserPrompt(quiz, wireframeRaw, styleRaw) },
            ],
          });
          const stylerParsed = JSON.parse(stylerRaw);
          console.log(`[generate] Agent 3 copywriter & section styler complete`);

          // ==========================================
          // AGENT 4: Section Coder Agent (Dynamic Inline Styled HTML/CSS Layouts)
          // ==========================================
          console.log(`[generate] starting Agent 4: Section Coder Agent`);
          const coderRaw = await generateLLMText({
            temperature: 0.5,
            responseFormat: { type: "json_object" },
            messages: [
              { role: "system", content: buildSectionCoderSystemPrompt() },
              { role: "user",   content: buildSectionCoderUserPrompt(quiz, stylerRaw, styleRaw, JSON.stringify(stylerParsed.demo_content || {})) },
            ],
          });
          const coderParsed = JSON.parse(coderRaw);
          console.log(`[generate] Agent 4 coding complete`);

          // Merge all results into final parsed payload
          const finalParsed = {
            business_name: styleParsed.business_name || quiz.business_name,
            colors: styleParsed.colors,
            typography: styleParsed.typography,
            icon_style: styleParsed.icon_style || "duotone-colored",
            icon_set: styleParsed.icon_set,
            tagline: styleParsed.tagline || "",
            vibe_summary: styleParsed.vibe_summary || "",
            sitemap: stylerParsed.sitemap || [],
            demo_content: stylerParsed.demo_content || {},
            custom_code: coderParsed.custom_code || {},
          };

          // Validate against expanded Zod schema
          const validated = AIOutputSchema.safeParse(finalParsed);
          if (!validated.success) {
            console.error("Zod schema validation failed. Raw inputs:", finalParsed);
            throw new Error(
              `LLM schema mismatch: ${JSON.stringify(validated.error.flatten())}`
            );
          }

          const aiData = validated.data;

          // ==========================================
          // STEP 3: Concurrently generate Logo, Hero banner, and Moodboard images
          // ==========================================
          console.log(`[generate] starting logo and hero image generations for "${aiData.business_name}"`);
          
          // Generate moodboard images instantly using Unsplash curated niches based on style tags
          const tags = (quiz.style_tags || []).map(t => t.toLowerCase());
          let moodImages = [
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
          ];
          if (tags.includes("premium") || tags.includes("elegant") || tags.includes("trustworthy") || tags.includes("secure")) {
            moodImages = [
              "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
            ];
          } else if (tags.includes("creative") || tags.includes("bold") || tags.includes("playful")) {
            moodImages = [
              "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
            ];
          } else if (tags.includes("warm") || tags.includes("handcrafted")) {
            moodImages = [
              "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80"
            ];
          }
          aiData.moodboard_images = moodImages;

          // Call ONLY the logo and hero image concurrent calls
          const [logoRes, heroRes] = await Promise.allSettled([
            generateLogo(aiData.business_name),
            generateImage(`A clean high-quality modern website hero section graphic for a brand named "${aiData.business_name}". Minimal flat design UI, premium business branding mockup background, no text.`),
          ]);

          // Set logo
          if (logoRes.status === "fulfilled" && logoRes.value) {
            aiData.logo_url = logoRes.value;
          }
          // Set hero image
          if (heroRes.status === "fulfilled" && heroRes.value) {
            aiData.hero_image_url = heroRes.value;
          }

          // D. Save completed payload to Supabase
          await supabase
            .from("leads")
            .update({ status: "complete", ai_payload: aiData })
            .eq("id", leadId);

          console.log(`[generate] lead ${leadId} complete`);

          try {
            controller.enqueue(
              encoder.encode(JSON.stringify({ status: "complete" }) + "\n")
            );
          } catch {
            // Client navigated away
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          console.error(`[generate] lead ${leadId} error:`, message);

          await supabase
            .from("leads")
            .update({ status: "error", error_message: message })
            .eq("id", leadId);

          try {
            controller.enqueue(
              encoder.encode(JSON.stringify({ status: "error", error: message }) + "\n")
            );
          } catch {
            // Client navigated away
          }
        } finally {
          try { controller.close(); } catch { /* already closed */ }
        }
      },
      cancel() {
        console.log(`[generate] client disconnected stream for lead ${leadId}`);
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("Unhandled error in /api/generate:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
