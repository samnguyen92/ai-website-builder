"use client";

const EXAMPLE_TAGS = [
  "B2B","B2C","Local customers","National audience",
  "Small business","Founder / Business owners","Marketing Team",
  "Gen Z","Suite C","Consumers",
];

interface Props { value: string; onChange: (v: string) => void; }

export function StepTargetCustomers({ value, onChange }: Props) {
  const addTag = (tag: string) => {
    const ex = value.trim();
    onChange(ex ? `${ex}, ${tag}` : tag);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 className="q-heading">Who are your ideal customers?</h2>
      <p className="q-subtitle">
        Describe the people or businesses you want to reach. Optional, but it sharpens the tone.
        Age, type, what they care about.
      </p>
      <textarea
        id="target-customers"
        className="q-input"
        style={{ minHeight: 128 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Founders, business owners, CEOs, and CFOs of companies with 20–250 employees and annual revenues between $5M and $75M…"
      />
      <div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>Try these examples:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {EXAMPLE_TAGS.map((tag) => (
            <button key={tag} type="button" className="q-tag" onClick={() => addTag(tag)}>{tag}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
