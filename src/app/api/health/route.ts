import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, { ok: boolean; message: string; latencyMs?: number }> = {};

  // ─── 1. Supabase connection ─────────────────────────────────────────────────
  try {
    const t0 = Date.now();
    const supabase = createSupabaseAdmin();
    const { count, error } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    results.supabase = {
      ok: true,
      message: `Connected ✓  (${count ?? 0} leads in table)`,
      latencyMs: Date.now() - t0,
    };
  } catch (err) {
    results.supabase = {
      ok: false,
      message: err instanceof Error ? err.message : "Unknown Supabase error",
    };
  }

  // ─── 2. OpenRouter connection ───────────────────────────────────────────────
  try {
    const t0 = Date.now();
    const openrouter = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY!,
      defaultHeaders: {
        "HTTP-Referer": "https://align.design",
        "X-Title": "Align - Health Check",
      },
    });

    const rawModel = process.env.OPENROUTER_TEXT_MODEL ?? "deepseek/deepseek-chat-v3-0324:free";
    // Sanitize: replace any non-ASCII chars (e.g. en-dash from copy-paste) with plain hyphen
    const model = rawModel.replace(/[^\x00-\x7F]/g, "-");

    const completion = await openrouter.chat.completions.create({
      model,
      max_tokens: 5,
      messages: [{ role: "user", content: 'Reply with the single word "ok".' }],
    });

    const reply = completion.choices[0]?.message?.content?.trim() ?? "(empty)";
    results.openrouter = {
      ok: true,
      message: `Connected ✓  model=${completion.model}  reply="${reply}"`,
      latencyMs: Date.now() - t0,
    };
  } catch (err) {
    results.openrouter = {
      ok: false,
      message: err instanceof Error ? err.message : "Unknown OpenRouter error",
    };
  }

  const allOk = Object.values(results).every((r) => r.ok);
  return NextResponse.json({ ok: allOk, results }, { status: allOk ? 200 : 502 });
}
