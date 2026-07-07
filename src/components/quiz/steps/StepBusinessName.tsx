"use client";

interface StepProps {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}

export function StepBusinessName({ value, onChange, onNext }: StepProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Heading — 64px / SVN-Aeonik / 400 */}
      <h2 className="q-heading">What&apos;s your business called?</h2>

      {/* Subtitle — 24px / SVN-Aeonik */}
      <p className="q-subtitle">
        We&apos;ll use this as the working name across your concept.
      </p>

      {/* Input — 128px tall, rgba bg, orange border */}
      <input
        id="business-name"
        type="text"
        className="q-input"
        style={{ minHeight: 128, paddingTop: 24 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && value.trim() && onNext()}
        placeholder="e.g. Apple Consulting"
      />
    </div>
  );
}
