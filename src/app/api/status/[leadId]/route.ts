import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const { leadId } = await params;

  if (!leadId) {
    return NextResponse.json({ error: "Missing leadId" }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("leads")
    .select("id, status, ai_payload, error_message, created_at, quiz_payload")
    .eq("id", leadId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  // Safe cast for quiz_payload
  const quizPayload = data.quiz_payload as Record<string, any> | null;

  return NextResponse.json({
    leadId: data.id,
    status: data.status,
    payload: data.ai_payload ?? null,
    errorMessage: data.error_message ?? null,
    createdAt: data.created_at,
    regenerateCount: quizPayload?.regenerate_count ?? 0,
  });
}
