"use client";

import type { QuizPayload } from "@/lib/ai/schema";

type StyleTag = QuizPayload["style_tags"][number];

const TAGS: StyleTag[] = [
  "Modern","Playful","Premium","Bold","Warm",
  "Minimal","Technical","Handcrafted","Secure","Trustworthy",
  "Elegant","Creative","Tough","Feminine","Masculine",
];

interface Props { value: StyleTag[]; onChange: (v: StyleTag[]) => void; }

export function StepWebStyle({ value, onChange }: Props) {
  const toggle = (tag: StyleTag) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else if (value.length < 5) {
      onChange([...value, tag]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 className="q-heading">What style feels right for your brand?</h2>
      <p className="q-subtitle">
        Choose the direction that best matches how you want people to feel when they visit your website.
        {value.length >= 5 && (
          <span style={{ marginLeft: 8, color: "#BD410C" }}> Max 5 selected.</span>
        )}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {TAGS.map((tag) => {
          const sel = value.includes(tag);
          const maxed = value.length >= 5 && !sel;
          return (
            <button
              key={tag}
              id={`style-${tag.toLowerCase()}`}
              type="button"
              disabled={maxed}
              onClick={() => toggle(tag)}
              style={{
                padding: "14px 24px",
                borderRadius: 14,
                fontFamily: "var(--font-aeonik)",
                fontSize: "clamp(14px, 1.11vw, 16px)",
                fontWeight: 400,
                color: "white",
                background: sel ? "#BD410C" : "rgba(255,255,255,0.06)",
                border: sel ? "1px solid #BD410C" : "1px solid rgba(255,255,255,0.12)",
                cursor: maxed ? "not-allowed" : "pointer",
                opacity: maxed ? 0.35 : 1,
                transition: "all 0.15s ease",
                transform: sel ? "scale(1.04)" : "scale(1)",
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
