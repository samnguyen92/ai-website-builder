"use client";

import type { QuizPayload } from "@/lib/ai/schema";

type TypographyStyle = QuizPayload["typography_style"];

const OPTIONS: { value: TypographyStyle; label: string }[] = [
  { value: "clean_modern",            label: "Clean and modern" },
  { value: "elegant_editorial",       label: "Elegant and editorial" },
  { value: "technical_bold",          label: "Technical and bold" },
  { value: "friendly_rounded",        label: "Friendly and rounded" },
  { value: "professional_corporate",  label: "Professional and corporate" },
  { value: "ai_suggest",              label: "Let Align suggest" },
];

interface Props { value: TypographyStyle | undefined; onChange: (v: TypographyStyle) => void; }

export function StepTypographyStyle({ value, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 className="q-heading">What typography style do you prefer?</h2>
      <p className="q-subtitle">Typography helps define the first impression of your website.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {OPTIONS.map((opt) => {
          const sel = value === opt.value;
          return (
            <button
              key={opt.value}
              id={`typography-${opt.value}`}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`q-tile${sel ? " selected" : ""}`}
              style={{ padding: "22px 24px" }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: sel ? "2px solid white" : "2px solid rgba(255,255,255,0.30)",
                  background: sel ? "rgba(255,255,255,0.20)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  color: "white",
                }}
              >
                {sel && "✓"}
              </span>
              <span style={{ fontFamily: "var(--font-aeonik)", fontSize: "clamp(15px, 1.11vw, 18px)", fontWeight: 400, color: "white" }}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
