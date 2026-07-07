"use client";

interface Props { value: string; onChange: (v: string) => void; }

export function StepProductsServices({ value, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 className="q-heading">What do you sell or offer?</h2>
      <p className="q-subtitle">
        In a sentence or two — what you do and who it&apos;s for. This shapes your headline and page copy.
      </p>
      <textarea
        id="products-services"
        className="q-input"
        style={{ minHeight: 128 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. We help business owners across South Carolina uncover the truth behind their numbers. Specializing in forensic accounting and business advisory, we trace transactions and provide clear, evidence-based findings."
      />
    </div>
  );
}
