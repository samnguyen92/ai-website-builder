"use client";

import { useQuizState } from "@/hooks/useQuizState";
import { StepBusinessName }    from "./steps/StepBusinessName";
import { StepProductsServices } from "./steps/StepProductsServices";
import { StepWebsiteGoal }     from "./steps/StepWebsiteGoal";
import { StepTargetCustomers } from "./steps/StepTargetCustomers";
import { StepCompetitors }     from "./steps/StepCompetitors";
import { StepWebsiteType }     from "./steps/StepWebsiteType";
import { StepSitemap }         from "./steps/StepSitemap";
import { StepWebStyle }        from "./steps/StepWebStyle";
import { StepColorDirection }  from "./steps/StepColorDirection";
import { StepTypographyStyle } from "./steps/StepTypographyStyle";
import { EmailGate }           from "./EmailGate";
import { DevPanel }            from "@/components/dev/DevPanel";

/* ─── Figma-derived constants ────────────────────────────────────────────────*/
const ACCENT = "#BD410C";

const STEP_LABELS: Record<number, string> = {
  1:  "Discovery – About you",
  2:  "Discovery – Products / Services",
  3:  "Discovery – Website Main Goal",
  4:  "Discovery – Customers",
  5:  "Discovery – Inspiration & Competitors",
  6:  "Website Design – Type of Website",
  7:  "Website Design – Sitemap",
  8:  "Website Design – Web Style",
  9:  "Website Design – Color Direction",
  10: "Website Design – Typography Direction",
  11: "Unlock Concept",
};

function canContinue(step: number, state: ReturnType<typeof useQuizState>["state"]): boolean {
  switch (step) {
    case 1:  return !!state.business_name?.trim();
    case 2:  return (state.products_services?.trim().length ?? 0) >= 10;
    case 3:  return (state.website_goal?.length ?? 0) > 0;
    case 4:  return true;
    case 5:  return true;
    case 6:  return !!state.website_type;
    case 7:  return (state.sitemap?.pages_description?.trim().length ?? 0) > 0;
    case 8:  return (state.style_tags?.length ?? 0) > 0;
    case 9:  return !!state.color_direction;
    case 10: return !!state.typography_style;
    default: return true;
  }
}

/* ─── Align Logo (Figma asset) ───────────────────────────────────────*/
function AlignLogo() {
  return (
    <img
      src="/align-logo-1.svg"
      alt="Align Logo"
      style={{ width: 59, height: 41, objectFit: "contain" }}
    />
  );
}

/* ─── Main component ─────────────────────────────────────────────────────────*/
export function QuizShell() {
  const { step, state, update, next, back, progress, fillAll } = useQuizState();

  const isEmailStep    = step === 11;
  const isLastQuestion = step === 10;
  const canGoNext      = canContinue(step, state);

  return (
    <div className="min-h-screen bg-[#121212] relative overflow-hidden">

      {/* ── Dev panel (only renders in development) ────────────────────────*/}
      {process.env.NODE_ENV === "development" && (
        <DevPanel onFillRandom={(persona, step) => fillAll(persona, step)} />
      )}

      {/* ── Noise grain overlay ─────────────────────────────────────────────*/}
      <div className="noise-overlay" aria-hidden="true" />

      {/* ── White glow blob (Figma: left:402, top:788, 661px, blur 312px) ──*/}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 661,
          height: 661,
          left: "28%",
          top: 600,
          background: "rgba(255,255,255,0.55)",
          filter: "blur(312px)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── All content above noise/glow ──────────────────────────────────*/}
      <div className="relative z-10">

        {/* ── Nav (Figma: left:44, top:0, height:79px) ────────────────────*/}
        <nav
          style={{
            height: 79,
            paddingLeft: 44,
            paddingRight: 44,
            display: "flex",
            alignItems: "center",
          }}
        >
          <AlignLogo />
        </nav>

        {/* ── Main content column (Figma: left:53, top:190, width:1360) ───*/}
        <div
          style={{
            paddingLeft: "clamp(20px, 3.68vw, 53px)",
            paddingRight: "clamp(20px, 3.68vw, 53px)",
            paddingBottom: 80,
            maxWidth: 1466,
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 50 }}>

            {/* ── Progress (Figma: 24px label + 4px bar, gap:8) ───────────*/}
            {!isEmailStep && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span
                  className="q-subtitle"
                  style={{ fontFamily: "var(--font-aeonik)" }}
                >
                  Question {step} of 10
                </span>
                <div
                  style={{
                    width: "100%",
                    height: 4,
                    background: "white",
                    borderRadius: 9999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: ACCENT,
                      borderRadius: 9999,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>
            )}

            {/* ── Category pill (Figma: border white, px-32 py-16, 24px) ──*/}
            {!isEmailStep && (
              <div style={{ display: "inline-flex" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    paddingLeft: 32,
                    paddingRight: 32,
                    paddingTop: 16,
                    paddingBottom: 16,
                    borderRadius: 9999,
                    border: "1px solid white",
                  }}
                >
                  <span
                    className="q-subtitle"
                    style={{ fontFamily: "var(--font-aeonik)", color: "white" }}
                  >
                    {STEP_LABELS[step]}
                  </span>
                </div>
              </div>
            )}

            {/* ── Card (Figma: rgba(255,255,255,0.05), purple border, 24px radius, shadow) */}
            <div
              style={{
                width: "100%",
                background: "rgba(255,254,254,0.05)",
                borderRadius: 24,
                border: "1px solid rgba(97,94,255,0.20)",
                boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)",
                overflow: "hidden",
              }}
            >
              {/* Card inner padding (Figma: 33px) */}
              <div style={{ padding: 33 }}>

                {/* ── Step content ───────────────────────────────────────*/}
                <div style={{ marginBottom: 48 }}>
                  {step === 1  && <StepBusinessName value={state.business_name ?? ""} onChange={(v) => update("business_name", v)} onNext={next} />}
                  {step === 2  && <StepProductsServices value={state.products_services ?? ""} onChange={(v) => update("products_services", v)} />}
                  {step === 3  && <StepWebsiteGoal value={state.website_goal ?? []} onChange={(v) => update("website_goal", v)} />}
                  {step === 4  && <StepTargetCustomers value={state.target_customers ?? ""} onChange={(v) => update("target_customers", v)} />}
                  {step === 5  && <StepCompetitors value={state.competitor_urls ?? ""} onChange={(v) => update("competitor_urls", v)} />}
                  {step === 6  && <StepWebsiteType value={state.website_type} onChange={(v) => update("website_type", v)} />}
                  {step === 7  && (
                    <StepSitemap
                      pageCount={state.sitemap?.page_count ?? 1}
                      pagesDescription={state.sitemap?.pages_description ?? ""}
                      onPageCountChange={(n) => update("sitemap", { ...state.sitemap!, page_count: n })}
                      onPagesDescriptionChange={(s) => update("sitemap", { ...state.sitemap!, pages_description: s })}
                    />
                  )}
                  {step === 8  && <StepWebStyle value={state.style_tags ?? []} onChange={(v) => update("style_tags", v)} />}
                  {step === 9  && <StepColorDirection value={state.color_direction ?? { mode: "suggest" }} onChange={(v) => update("color_direction", v)} />}
                  {step === 10 && <StepTypographyStyle value={state.typography_style} onChange={(v) => update("typography_style", v)} />}
                  {step === 11 && <EmailGate quizState={state} />}
                </div>

                {/* ── Back / Continue (Figma: w:253 h:65, font 40px, rounded-full) */}
                {!isEmailStep && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                    {/* Back */}
                    <button
                      id="quiz-back"
                      type="button"
                      onClick={back}
                      disabled={step === 1}
                      style={{
                        width: "clamp(140px, 17.57vw, 253px)",
                        height: "clamp(52px, 4.51vw, 65px)",
                        background: "white",
                        borderRadius: 9999,
                        border: "none",
                        cursor: step === 1 ? "not-allowed" : "pointer",
                        opacity: step === 1 ? 0.3 : 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "opacity 0.2s, transform 0.15s",
                      }}
                      onMouseEnter={(e) => { if (step !== 1) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                    >
                      <span className="q-btn-label" style={{ color: ACCENT }}>Back</span>
                    </button>

                    {/* Continue */}
                    <button
                      id="quiz-continue"
                      type="button"
                      onClick={next}
                      disabled={!canGoNext}
                      style={{
                        width: "clamp(140px, 17.57vw, 253px)",
                        height: "clamp(52px, 4.51vw, 65px)",
                        background: canGoNext ? ACCENT : "rgba(189,65,12,0.40)",
                        borderRadius: 9999,
                        border: "none",
                        cursor: canGoNext ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.2s, transform 0.15s",
                      }}
                      onMouseEnter={(e) => { if (canGoNext) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                    >
                      <span className="q-btn-label" style={{ color: "white" }}>
                        {isLastQuestion ? "Unlock Concept" : "Continue"}
                      </span>
                    </button>

                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
