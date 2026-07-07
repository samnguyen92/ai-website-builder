"use client";

import type { QuizPayload } from "@/lib/ai/schema";

type ColorDirection = QuizPayload["color_direction"];

const ACCENT = "#BD410C";

interface Props { value: ColorDirection; onChange: (v: ColorDirection) => void; }

export function StepColorDirection({ value, onChange }: Props) {
  const isExisting = value.mode === "existing";
  const colors     = isExisting ? value.colors : { primary: "#1C7ED6", secondary: "#FFFFFF", accent: "#1F2937" };

  const setColor = (field: "primary" | "secondary" | "accent", hex: string) => {
    if (value.mode === "existing") {
      onChange({ mode: "existing", colors: { ...value.colors, [field]: hex } });
    }
  };

  const pillBase: React.CSSProperties = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 32,
    paddingRight: 32,
    borderRadius: 9999,
    cursor: "pointer",
    border: "none",
    transition: "background 0.2s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 className="q-heading">Do you already have brand colors?</h2>
      <p className="q-subtitle">
        Choose the direction that best matches how you want people to feel when they visit your website.
      </p>

      {/* Toggle row */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          id="color-mode-existing"
          type="button"
          onClick={() => onChange({ mode: "existing", colors: { primary: "#1C7ED6", secondary: "#FFFFFF", accent: "#1F2937" } })}
          style={{
            ...pillBase,
            background: isExisting ? ACCENT : "rgba(255,255,255,0.06)",
            border: isExisting ? `1px solid ${ACCENT}` : "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <span className="q-subtitle" style={{ fontFamily: "var(--font-aeonik)", color: "white" }}>Yes, I have brand colors</span>
        </button>
        <button
          id="color-mode-suggest"
          type="button"
          onClick={() => onChange({ mode: "suggest" })}
          style={{
            ...pillBase,
            background: !isExisting ? ACCENT : "rgba(255,255,255,0.06)",
            border: !isExisting ? `1px solid ${ACCENT}` : "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <span className="q-subtitle" style={{ fontFamily: "var(--font-aeonik)", color: "white" }}>No, suggest colors for me</span>
        </button>
      </div>

      {/* Color pickers (conditional) */}
      {isExisting && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            padding: 20,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 16,
          }}
        >
          {(["primary", "secondary", "accent"] as const).map((field) => (
            <div key={field} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textTransform: "capitalize" }}>
                {field} color
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                <input
                  id={`color-${field}`}
                  type="color"
                  value={colors[field]}
                  onChange={(e) => setColor(field, e.target.value)}
                  style={{ width: 28, height: 28, borderRadius: 6, cursor: "pointer", background: "transparent", border: 0, padding: 0 }}
                />
                <input
                  type="text"
                  value={colors[field]}
                  onChange={(e) => { const v = e.target.value; if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setColor(field, v); }}
                  style={{ flex: 1, background: "transparent", color: "white", fontSize: 13, outline: "none", border: "none", minWidth: 0 }}
                  maxLength={7}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
