"use client";

import { use, useState, useEffect } from "react";
import { useGenerationStatus } from "@/hooks/useGenerationStatus";
import { StyleGuidePanel } from "@/components/preview/StyleGuidePanel";
import { SitemapTree } from "@/components/preview/SitemapTree";
import { PageConcept } from "@/components/preview/PageConcept";

/* ─── Loading animation ───────────────── */
function LoadingState({ currentStep }: { currentStep: number }) {
  const steps = [
    { text: "Planning website sitemap structure", id: 1 },
    { text: "Generating color palettes & typography", id: 2 },
    { text: "Writing copywriting content", id: 3 },
    { text: "Custom-coding section components", id: 4 },
    { text: "Creating logo & brand graphics", id: 5 },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0d0d", fontFamily: "var(--font-aeonik)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, padding: 32, textAlign: "center" }}>
        
        {/* Glow pulsing circle */}
        <div style={{
          width: 140,
          height: 140,
          position: "relative",
          background: "#BD410C",
          boxShadow: "0px 5px 120px rgba(189, 65, 12, 0.5)",
          borderRadius: "50%",
          outline: "6px #BD410C solid",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "pulseGlow 2s ease-in-out infinite alternate",
        }}>
          <div style={{ width: 80, height: 67, position: "relative" }}>
            <div style={{ width: 55, height: 55, left: 13, top: 9, position: "absolute", background: "#ffffff", borderRadius: 4, transform: "rotate(45deg)", boxShadow: "0px 4px 6px rgba(0,0,0,0.2) inset" }} />
            <div style={{ width: 30, height: 30, left: 51, top: -1, position: "absolute", background: "#ffffff", borderRadius: 3, transform: "rotate(45deg)", boxShadow: "0px 4px 6px rgba(0,0,0,0.2) inset" }} />
            <div style={{ width: 26, height: 26, left: -1, top: -1, position: "absolute", background: "#ffffff", borderRadius: 3, transform: "rotate(45deg)", boxShadow: "0px 4px 6px rgba(0,0,0,0.2) inset" }} />
          </div>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 48px)",
          fontWeight: 400,
          color: "#ffffff",
          lineHeight: 1.15,
          margin: 0,
        }}>
          Building your concept...
        </h1>

        {/* Dynamic sequential step checklist */}
        <div style={{
          width: "100%",
          maxWidth: 380,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 16,
          textAlign: "left",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: 24,
          borderRadius: 16,
        }}>
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            let badgeBg = "rgba(255,255,255,0.06)";
            let badgeColor = "rgba(255,255,255,0.3)";
            let textColor = "rgba(255,255,255,0.4)";
            let symbol: React.ReactNode = idx + 1;

            if (isCompleted) {
              badgeBg = "rgba(40,200,64,0.15)";
              badgeColor = "#28c840";
              textColor = "rgba(255,255,255,0.85)";
              symbol = "✓";
            } else if (isCurrent) {
              badgeBg = "#BD410C";
              badgeColor = "#ffffff";
              textColor = "#ffffff";
              symbol = "⚡";
            }

            return (
              <div
                key={step.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  opacity: isCompleted || isCurrent ? 1 : 0.4,
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: badgeBg,
                  color: badgeColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 11,
                  fontWeight: 700,
                }}>
                  {symbol}
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: textColor }}>
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulseGlow {
          from { transform: scale(0.98); box-shadow: 0px 5px 60px rgba(189, 65, 12, 0.4); }
          to { transform: scale(1.02); box-shadow: 0px 5px 140px rgba(189, 65, 12, 0.7); }
        }
      `}</style>
    </div>
  );
}

/* ─── Error state ────────────────────────────────────────────────────────────*/
function ErrorState({ message }: { message: string | null }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 32, background: "#0d0d0d" }}>
      <div style={{ fontSize: 40 }}>⚠️</div>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#fff", fontWeight: 600, fontSize: 18, fontFamily: "var(--font-aeonik)" }}>Something went wrong</p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 6, maxWidth: 360 }}>{message ?? "Our AI encountered an error. Please try again."}</p>
      </div>
      <a href="/" style={{ padding: "12px 24px", borderRadius: 9999, background: "#BD410C", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
        ← Start over
      </a>
    </div>
  );
}

/* ─── Preview page ───────────────────────────────────────────────────────────*/
export default function PreviewPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = use(params);
  const { status, payload, errorMessage, regenerateCount, refetch } = useGenerationStatus(leadId);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Trigger the step-by-step generation process on loading page mount if state is pending
  useEffect(() => {
    if (status === "pending") {
      let isAborted = false;
      const startGeneration = async () => {
        try {
          console.log("[PreviewPage] Starting step-by-step generation pipeline for lead:", leadId);
          
          // Step 1: Wireframe Planner
          if (!isAborted) {
            setCurrentStep(0);
            const res1 = await fetch("/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ leadId, step: 1 }),
            });
            if (!res1.ok) throw new Error("Step 1 (Wireframe) failed");
          }

          // Step 2: Branding Stylist
          if (!isAborted) {
            setCurrentStep(1);
            const res2 = await fetch("/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ leadId, step: 2 }),
            });
            if (!res2.ok) throw new Error("Step 2 (Branding Style) failed");
          }

          // Step 3: Content Copywriter
          if (!isAborted) {
            setCurrentStep(2);
            const res3 = await fetch("/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ leadId, step: 3 }),
            });
            if (!res3.ok) throw new Error("Step 3 (Copywriting Content) failed");
          }

          // Step 4: Section Coder (Codes "home" page sections first)
          if (!isAborted) {
            setCurrentStep(3);
            const res4 = await fetch("/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ leadId, step: 4, page: "home" }),
            });
            if (!res4.ok) throw new Error("Step 4 (Section Coder) failed");
          }

          // Step 5: Logo & Hero Assets (Finalizes Lead Status to complete)
          if (!isAborted) {
            setCurrentStep(4);
            const res5 = await fetch("/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ leadId, step: 5 }),
            });
            if (!res5.ok) throw new Error("Step 5 (Visual Assets Creation) failed");
            
            // Mark step as completed so all checkmarks show up
            setCurrentStep(5);
          }
        } catch (err: any) {
          console.error("[PreviewPage] Step-by-step generation error:", err);
          // Wait briefly, then let the page status handle error triggers
        }
      };

      startGeneration();

      return () => {
        isAborted = true;
      };
    }
  }, [leadId, status]);

  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleRegenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || submitting || regenerateCount >= 2) return;

    setSubmitting(true);
    setActionError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          comment: comment.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Regeneration failed");
      }

      window.location.reload();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  if (status === "pending" || status === "idle") return <LoadingState currentStep={currentStep} />;
  if (status === "error") return <ErrorState message={errorMessage} />;
  if (!payload) return <ErrorState message="No payload received." />;

  const isLimitReached = regenerateCount >= 2;
  const attemptsLeft = Math.max(0, 2 - regenerateCount);

  return (
    <div style={{ minHeight: "100vh", background: "#121212", color: "#ffffff", paddingBottom: 80, fontFamily: "var(--font-aeonik), sans-serif" }}>

      {/* ── Noise grain overlay ── */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* ── Glow blob ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          left: "50%",
          top: 0,
          transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.06)",
          filter: "blur(200px)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 10 }}>

        {/* ── Top Bar ── */}
        <header style={{
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/align-logo-1.svg" alt="Align Logo" style={{ width: 40, height: 28, objectFit: "contain" }} />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Align</span>
          </div>
          <div style={{
            fontSize: 12, fontWeight: 600, color: "#BD410C",
            border: "1px solid rgba(189,65,12,0.3)",
            borderRadius: 9999, padding: "6px 14px",
            background: "rgba(189,65,12,0.10)",
          }}>
            ✦ Concept Ready — {payload.business_name}
          </div>
        </header>

        {/* ── Page Intro Heading ── */}
        <div style={{ padding: "60px 40px 40px", textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9999, padding: "8px 18px", fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 20 }}>
            🎉 Yes! Your concept is ready
          </div>
          <h1 style={{ fontSize: "clamp(32px, 4.4vw, 56px)", fontWeight: 400, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
            Here&apos;s a first look at your site
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.60)", lineHeight: 1.6 }}>
            Built from your answers. Click the pages to explore. Here is a first look at your website structure, including sitemap, style scape, and sample page layout.
          </p>

          {/* Jump-to nav pills */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32 }}>
            {["Stylescape / Moodboard", "Sitemap", "Simple Page Concept"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/\s+/g, "")}`}
                style={{
                  padding: "8px 18px",
                  borderRadius: 9999,
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.70)",
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>

        {/* ── Main Content containers (Figma layout: dark containers) ── */}
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 40px", display: "flex", flexDirection: "column", gap: 40 }}>

          {/* SECTION 1: Stylescape/Moodboard */}
          <section id="stylescape/moodboard" style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 24,
            padding: 40,
          }}>
            <h2 style={{ fontSize: 28, fontWeight: 400, color: "#fff", marginBottom: 8 }}>Stylescape/ Moodboard</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.40)", marginBottom: 24 }}>This style escape gives your website visual direction before we move into detailed design.</p>

            <StyleGuidePanel payload={payload} />
          </section>

          {/* SECTION 2: Sitemap */}
          <section id="sitemap" style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 24,
            padding: 40,
          }}>
            <h2 style={{ fontSize: 28, fontWeight: 400, color: "#fff", marginBottom: 8 }}>Sitemap</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.40)", marginBottom: 24 }}>This visual chart outlines the navigation structure for your high-fidelity concept.</p>

            <SitemapTree sitemap={payload.sitemap} primaryColor={payload.colors.primary} />
          </section>

          {/* SECTION 3: Simple Page Concepts */}
          <section id="simplepageconcept" style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 24,
            padding: 40,
          }}>
            <h2 style={{ fontSize: 28, fontWeight: 400, color: "#fff", marginBottom: 8 }}>Simple Page Concepts</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.40)", marginBottom: 24 }}>These are early low-fidelity page concepts.</p>

            <PageConcept payload={payload} leadId={leadId} refetchStatus={refetch} />
          </section>

          {/* SECTION 4: Refinement Panel / Comments & Regenerate (at the bottom) */}
          <section style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: 32,
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 500, color: "#fff" }}>Refine Design Concept</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.50)", marginTop: 4 }}>
                  Describe what you want to change (colors, style mood, pages description) and click regenerate.
                </p>
              </div>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: isLimitReached ? "#EF4444" : "#BD410C",
                background: isLimitReached ? "rgba(239,68,68,0.1)" : "rgba(189,65,12,0.1)",
                border: `1px solid ${isLimitReached ? "#EF4444" : "#BD410C"}`,
                padding: "6px 14px",
                borderRadius: 8,
              }}>
                {isLimitReached ? "Regeneration limit reached" : `Attempts left: ${attemptsLeft}/2`}
              </div>
            </div>

            <form onSubmit={handleRegenerate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Change primary color to deep green, make button labels rounded, and replace Gallery page with Booking page..."
                disabled={submitting || isLimitReached}
                rows={3}
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: 14,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  outline: "none",
                  fontFamily: "inherit",
                  resize: "none",
                }}
              />

              {actionError && (
                <p style={{ fontSize: 13, color: "#EF4444" }}>⚠️ {actionError}</p>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <a href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.40)", textDecoration: "underline" }}>
                  ← Back to Quiz
                </a>

                <button
                  type="submit"
                  disabled={submitting || !comment.trim() || isLimitReached}
                  style={{
                    padding: "14px 32px",
                    background: submitting || !comment.trim() || isLimitReached ? "rgba(255,255,255,0.1)" : "#BD410C",
                    color: submitting || !comment.trim() || isLimitReached ? "rgba(255,255,255,0.3)" : "#fff",
                    border: "none",
                    borderRadius: 9999,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: submitting || !comment.trim() || isLimitReached ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "background 0.2s",
                  }}
                >
                  {submitting ? (
                    <>
                      <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.30)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                      Regenerating...
                    </>
                  ) : (
                    "Regenerate Concept ✦"
                  )}
                </button>
              </div>
            </form>
          </section>

        </div>
      </div>
    </div>
  );
}
