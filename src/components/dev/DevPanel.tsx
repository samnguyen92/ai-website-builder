"use client";

import { useState } from "react";
import { getNextTestPersona } from "@/lib/dev/testPersonas";
import type { QuizState } from "@/hooks/useQuizState";

type ConnectionStatus = {
  ok: boolean;
  message: string;
  latencyMs?: number;
};

type HealthResult = {
  ok: boolean;
  results: {
    supabase: ConnectionStatus;
    openrouter: ConnectionStatus;
  };
};

interface Props {
  onFillRandom: (persona: Omit<QuizState, "email">, jumpToStep: number) => void;
}

export function DevPanel({ onFillRandom }: Props) {
  const [open, setOpen]       = useState(false);
  const [health, setHealth]   = useState<HealthResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [filled, setFilled]   = useState<string | null>(null);

  const testConnections = async () => {
    setTesting(true);
    setHealth(null);
    try {
      const res  = await fetch("/api/health");
      const data = await res.json();
      setHealth(data);
    } catch {
      setHealth({
        ok: false,
        results: {
          supabase:   { ok: false, message: "Network error — could not reach /api/health" },
          openrouter: { ok: false, message: "Network error — could not reach /api/health" },
        },
      });
    } finally {
      setTesting(false);
    }
  };

  const fillRandom = () => {
    const persona = getNextTestPersona();
    onFillRandom(persona, 11); // jump straight to email gate (step 11)
    setFilled(persona.business_name as string);
    setTimeout(() => setFilled(null), 3000);
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, fontFamily: "monospace" }}>

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Dev Tools"
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "#1a1a1a",
          border: "1px solid #333",
          color: "#f59e0b",
          fontSize: 18,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          marginLeft: "auto",
          transition: "transform 0.2s",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
        }}
      >
        ⚙
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: 52,
            right: 0,
            width: 340,
            background: "#111",
            border: "1px solid #2a2a2a",
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #222", paddingBottom: 10 }}>
            <span style={{ color: "#f59e0b", fontSize: 14 }}>⚡</span>
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Dev Tools</span>
            <span style={{ marginLeft: "auto", color: "#555", fontSize: 11 }}>development only</span>
          </div>

          {/* Fill Random button */}
          <button
            onClick={fillRandom}
            style={{
              width: "100%",
              padding: "10px 16px",
              background: "#BD410C",
              border: "none",
              borderRadius: 10,
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "brightness 0.2s",
            }}
          >
            <span style={{ fontSize: 16 }}>🎲</span>
            Fill Random Data → Email Gate
          </button>

          {filled && (
            <div style={{ background: "rgba(189,65,12,0.15)", border: "1px solid rgba(189,65,12,0.30)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#f97316" }}>
              ✓ Loaded: <strong>{filled}</strong>
            </div>
          )}

          {/* Test Connections button */}
          <button
            onClick={testConnections}
            disabled={testing}
            style={{
              width: "100%",
              padding: "10px 16px",
              background: testing ? "#1a1a1a" : "#1e1e1e",
              border: "1px solid #2a2a2a",
              borderRadius: 10,
              color: testing ? "#666" : "#ccc",
              fontSize: 13,
              fontWeight: 600,
              cursor: testing ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 16 }}>{testing ? "⏳" : "🔌"}</span>
            {testing ? "Testing connections…" : "Test Connections"}
          </button>

          {/* Health results */}
          {health && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(["supabase", "openrouter"] as const).map((key) => {
                const r = health.results[key];
                return (
                  <div
                    key={key}
                    style={{
                      background: r.ok ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                      border: `1px solid ${r.ok ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
                      borderRadius: 10,
                      padding: "10px 12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>
                        {r.ok ? "✅" : "❌"} {key}
                      </span>
                      {r.latencyMs && (
                        <span style={{ color: "#666", fontSize: 11 }}>{r.latencyMs}ms</span>
                      )}
                    </div>
                    <p style={{ color: r.ok ? "#10b981" : "#f87171", fontSize: 11, lineHeight: 1.5, wordBreak: "break-word" }}>
                      {r.message}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <p style={{ color: "#333", fontSize: 10, textAlign: "center" }}>
            This panel is only visible in development
          </p>
        </div>
      )}
    </div>
  );
}
