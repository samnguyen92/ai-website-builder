"use client";

import type { QuizPayload } from "@/lib/ai/schema";

type WebsiteType = QuizPayload["website_type"];

const OPTIONS: { value: WebsiteType; label: string; description: string; emoji: string }[] = [
  { value: "info_brochure", label: "Info / brochure site",  description: "A few pages about your business.", emoji: "🏠" },
  { value: "landing_page",  label: "Single landing page",   description: "One focused page, one action.",   emoji: "🎯" },
  { value: "ecommerce",     label: "E-commerce store",      description: "Sell products with checkout.",    emoji: "🛒" },
  { value: "portfolio",     label: "Portfolio",             description: "Showcase work or projects.",      emoji: "🖼️" },
];

interface Props { value: WebsiteType | undefined; onChange: (v: WebsiteType) => void; }

export function StepWebsiteType({ value, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 className="q-heading">What kind of website is this?</h2>
      <p className="q-subtitle">This sets the structure of your concept.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {OPTIONS.map((opt) => {
          const sel = value === opt.value;
          return (
            <button
              key={opt.value}
              id={`website-type-${opt.value}`}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`q-tile${sel ? " selected" : ""}`}
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
              <span style={{ fontSize: 28, display: "block", marginBottom: 20 }}>{opt.emoji}</span>
              <p style={{ fontFamily: "var(--font-aeonik)", fontSize: 18, fontWeight: 400, color: "white", marginBottom: 4 }}>{opt.label}</p>
              <p style={{ fontSize: 13, color: sel ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.45)" }}>{opt.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
