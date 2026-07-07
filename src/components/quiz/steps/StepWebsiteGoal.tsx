"use client";

import type { QuizPayload } from "@/lib/ai/schema";

type Goal = QuizPayload["website_goal"][number];

const GOALS: { value: Goal; label: string; description: string; emoji: string }[] = [
  { value: "get_leads",         label: "Get leads / enquiries",   description: "Contact forms, calls, quotes",    emoji: "📣" },
  { value: "sell_products",     label: "Sell products online",    description: "Store, cart, checkout",           emoji: "🛍️" },
  { value: "brand_story",       label: "Tell my brand story",     description: "Credibility & presence",          emoji: "📖" },
  { value: "get_bookings",      label: "Get bookings",            description: "Appointments & reservations",     emoji: "📅" },
  { value: "showcase_work",     label: "Showcase Work",           description: "Showcase work or projects",       emoji: "🖼️" },
  { value: "build_credibility", label: "Build Credibility",       description: "Build Trust From Target Audience",emoji: "⭐" },
];

interface Props { value: Goal[]; onChange: (v: Goal[]) => void; }

export function StepWebsiteGoal({ value, onChange }: Props) {
  const toggle = (goal: Goal) =>
    value.includes(goal)
      ? onChange(value.filter((g) => g !== goal))
      : onChange([...value, goal]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 className="q-heading">What should this website do for you?</h2>
      <p className="q-subtitle">Your #1 goal. It decides what the homepage pushes visitors toward.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {GOALS.map((goal) => {
          const sel = value.includes(goal.value);
          return (
            <button
              key={goal.value}
              id={`goal-${goal.value}`}
              type="button"
              onClick={() => toggle(goal.value)}
              className={`q-tile${sel ? " selected" : ""}`}
            >
              {/* Check circle */}
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
              <span style={{ fontSize: 28, display: "block", marginBottom: 16 }}>{goal.emoji}</span>
              <p style={{ fontFamily: "var(--font-aeonik)", fontSize: 18, fontWeight: 400, color: "white", marginBottom: 4 }}>{goal.label}</p>
              <p style={{ fontSize: 13, color: sel ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.45)" }}>{goal.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
