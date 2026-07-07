"use client";

interface Props { value: string; onChange: (v: string) => void; }

export function StepCompetitors({ value, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 className="q-heading">Any websites you like or competitors to review?</h2>
      <p className="q-subtitle">
        Competitors or brands whose sites you admire. Helps us match a vibe you already like.
        Optional — leave blank if nothing comes to mind.
      </p>
      <input
        id="competitor-urls"
        type="text"
        className="q-input"
        style={{ minHeight: 128, paddingTop: 24 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com, https://another.com"
      />
    </div>
  );
}
