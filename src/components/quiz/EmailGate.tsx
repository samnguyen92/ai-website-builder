"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuizState } from "@/hooks/useQuizState";
import type { QuizPayload } from "@/lib/ai/schema";

const ACCENT = "#BD410C";

interface Props { quizState: QuizState; }

export function EmailGate({ quizState }: Props) {
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const payload: QuizPayload = { ...(quizState as QuizPayload), email };
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registerOnly: true,
          quiz: payload,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Generation registration failed");
      }

      const data = await res.json();
      router.push(`/preview/${data.leadId}`);
      return;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Ready badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${ACCENT}22`, border: `1px solid ${ACCENT}44`, borderRadius: 9999, padding: "8px 16px", width: "fit-content" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT, animation: "pulse 2s infinite" }} />
        <span style={{ fontSize: 13, color: ACCENT, fontFamily: "var(--font-aeonik)" }}>Ready to generate</span>
      </div>

      <h2 className="q-heading">Unlock your website concept</h2>
      <p className="q-subtitle">Enter your email to receive your AI-generated style guide and sitemap preview.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <input
          id="email-gate"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          disabled={loading}
          className="q-input"
          style={{ minHeight: 80, paddingTop: 20 }}
        />
        {error && <p style={{ color: "#f87171", fontSize: 13 }}>{error}</p>}

        <button
          type="submit"
          id="unlock-concept"
          disabled={loading || !email}
          style={{
            padding: "20px 32px",
            background: loading || !email ? "rgba(189,65,12,0.40)" : ACCENT,
            border: "none",
            borderRadius: 9999,
            cursor: loading || !email ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "background 0.2s",
          }}
        >
          {loading ? (
            <>
              <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.30)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
              <span className="q-btn-label" style={{ color: "white" }}>Generating your concept…</span>
            </>
          ) : (
            <span className="q-btn-label" style={{ color: "white" }}>Unlock My Concept →</span>
          )}
        </button>
      </form>

      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.40)", textAlign: "center" }}>
        No spam. Your concept will be ready in seconds.
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
      `}</style>
    </div>
  );
}
