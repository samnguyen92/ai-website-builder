import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { QuizPayloadSchema, AIOutputSchema, type QuizPayload } from "@/lib/ai/schema";
import {
  buildWireframeSystemPrompt,
  buildWireframeUserPrompt,
  buildExpansionSystemPrompt,
  buildExpansionUserPrompt,
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
    "recraft/recraft-v3",
    "black-forest-labs/flux.2-flex",
    "openai/gpt-image-1-mini",
  ];
  return callOpenRouterImageAPI(
    `A beautiful clean flat vector logo mark for a company named "${businessName}". Premium UI branding icon, minimal geometry, high quality, solid white background, no text.`,
    models
  );
}

async function generateImage(prompt: string): Promise<string | null> {
  const primaryModel = process.env.OPENROUTER_IMAGE_MODEL ?? "google/gemini-2.5-flash-image";
  const models = [
    primaryModel,
    "recraft/recraft-v3",
    "black-forest-labs/flux.2-flex",
    "openai/gpt-image-1-mini",
  ];
  return callOpenRouterImageAPI(prompt, models);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createSupabaseAdmin();

    let leadId: string;
    let quiz: QuizPayload;

    // ─── Case A: Revision Request (leadId + comment provided) ─────────────────
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
    // ─── Case B: Fresh Generation Request ────────────────────────────────────
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
          const rawModel =
            process.env.OPENROUTER_TEXT_MODEL ?? "deepseek/deepseek-chat-v3-0324:free";

          // ==========================================
          // STEP 1: Wireframing (Sitemap & Layouts flow)
          // ==========================================
          console.log(`[generate] starting Step 1: Wireframe layout logic`);
          const wireframeCompletion = await openrouter.chat.completions.create({
            model: rawModel.replace(/[^\x00-\x7F]/g, "-"),
            response_format: { type: "json_object" },
            temperature: 0.2, // low temperature for strict constraint adherence
            messages: [
              { role: "system", content: buildWireframeSystemPrompt() },
              { role: "user",   content: buildWireframeUserPrompt(quiz) },
            ],
          });

          const wireframeRaw = wireframeCompletion.choices[0]?.message?.content ?? '{"sitemap":[]}';
          console.log(`[generate] Step 1 wireframe layout generated:`, wireframeRaw);

          // ==========================================
          // STEP 2: Branding & Design expansion
          // ==========================================
          console.log(`[generate] starting Step 2: Branding expansion`);
          const expansionCompletion = await openrouter.chat.completions.create({
            model: rawModel.replace(/[^\x00-\x7F]/g, "-"),
            response_format: { type: "json_object" },
            temperature: 0.7,
            messages: [
              { role: "system", content: buildExpansionSystemPrompt() },
              { role: "user",   content: buildExpansionUserPrompt(quiz, wireframeRaw) },
            ],
          });

          const raw = expansionCompletion.choices[0]?.message?.content ?? "{}";
          const parsed = JSON.parse(raw);

          // Validate against expanded Zod schema
          const validated = AIOutputSchema.safeParse(parsed);
          if (!validated.success) {
            throw new Error(
              `LLM schema mismatch: ${JSON.stringify(validated.error.flatten())}`
            );
          }

          const aiData = validated.data;

          // ==========================================
          // STEP 3: Concurrently generate Logo, Hero banner, and Moodboard images
          // ==========================================
          console.log(`[generate] starting logo, hero & moodboard image generations for "${aiData.business_name}"`);
          const [logoRes, heroRes, mood1Res, mood2Res, mood3Res] = await Promise.allSettled([
            generateLogo(aiData.business_name),
            generateImage(`A clean high-quality modern website hero section graphic for a brand named "${aiData.business_name}". Minimal flat design UI, premium business branding mockup background, no text.`),
            generateImage(`Abstract flat vector layout mockup asset representing brand style for "${aiData.business_name}". Minimal geometry, solid colors, color scheme: ${aiData.colors.primary} and ${aiData.colors.secondary}`),
            generateImage(`Modern minimal flat illustration graphic design asset representing services offered by "${aiData.business_name}". Solid background, no text.`),
            generateImage(`Clean brand identity token graphic layout representing "${aiData.business_name}". Premium UI interface moodboard element, solid white background, flat aesthetic, no text.`)
          ]);

          // Set logo
          if (logoRes.status === "fulfilled" && logoRes.value) {
            aiData.logo_url = logoRes.value;
          }
          // Set hero image
          if (heroRes.status === "fulfilled" && heroRes.value) {
            aiData.hero_image_url = heroRes.value;
          }
          // Assemble moodboard images
          const moodImages: string[] = [];
          if (mood1Res.status === "fulfilled" && mood1Res.value) moodImages.push(mood1Res.value);
          if (mood2Res.status === "fulfilled" && mood2Res.value) moodImages.push(mood2Res.value);
          if (mood3Res.status === "fulfilled" && mood3Res.value) moodImages.push(mood3Res.value);
          aiData.moodboard_images = moodImages;

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
