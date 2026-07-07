"use client";

import { useState } from "react";
import type { AIOutput } from "@/lib/ai/schema";

interface Props { payload: AIOutput }

/* ─── Helpers ────────────────────────────────────────────────────────────────*/
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B7280", marginBottom: 16 }}>
      {children}
    </p>
  );
}

function isLightColor(hex: string): boolean {
  if (!hex) return true;
  const cleanHex = hex.replace("#", "");
  let r = 0, g = 0, b = 0;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  } else {
    return true;
  }
  return (r * 299 + g * 587 + b * 114) / 1000 > 170;
}

function getContrastColor(hex: string): string {
  return isLightColor(hex) ? "#121212" : "#ffffff";
}

function Cell({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ padding: "24px 28px", ...style }}>
      {children}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────────*/
export function StyleGuidePanel({ payload }: Props) {
  const { business_name, colors, typography, icon_set, sitemap, tagline, vibe_summary } = payload;
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const borderColor = "#E5E7EB";
  
  // Theme Detection
  const isDarkTheme = !isLightColor(colors.background);
  const themeBg = isDarkTheme ? "#121212" : "#FFFFFF";
  const themeText = isDarkTheme ? "#FFFFFF" : "#111827";
  const themeMutedText = isDarkTheme ? "#9CA3AF" : "#6B7280";
  const themeBorder = isDarkTheme ? "1px solid rgba(255,255,255,0.08)" : `1px solid ${borderColor}`;

  // Derive color groups from AI palette
  const primaryColors  = [
    { hex: colors.primary, label: "Primary" },
    { hex: colors.secondary, label: "Secondary" },
    { hex: colors.accent, label: "Accent" },
  ];
  const neutralColors = [
    { hex: colors.background, label: "Background" },
    { hex: colors.surface, label: "Surface" },
    { hex: colors.text, label: "Text" },
    { hex: colors.text_muted, label: "Muted" },
  ];

  // All unique pages from sitemap
  const pageLabels = sitemap.map((p) => p.label).slice(0, 6);

  function ColorSwatch({ hex, label }: { hex: string; label: string }) {
    const isLight = isLightColor(hex);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ height: 52, borderRadius: 8, background: hex, border: isLight ? `1px solid ${isDarkTheme ? "rgba(255,255,255,0.15)" : borderColor}` : "none" }} />
        <p style={{ fontSize: 11, fontWeight: 600, color: themeText }}>{label}</p>
        <p style={{ fontSize: 10, fontFamily: "monospace", color: themeMutedText, textTransform: "uppercase" }}>{hex}</p>
      </div>
    );
  }

  return (
    <div style={{
      background: themeBg,
      borderRadius: 16,
      overflow: "hidden",
      border: themeBorder,
      fontFamily: "'Inter', 'DM Sans', sans-serif",
      color: themeText,
      transition: "background 0.3s ease, border 0.3s ease",
    }}>

      {/* ════════════════════════════════════════════════════════════════════
          ROW 1 — Brand Hero | Logo | Color Palette
      ═══════════════════════════════════════════════════════════════════════*/}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 2.5fr", borderBottom: themeBorder }}>

        {/* ── Brand Hero ──────────────────────────────────────────────────*/}
        <div style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          padding: "28px 28px 24px",
          position: "relative",
          overflow: "hidden",
          borderRight: themeBorder,
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "absolute", bottom: -30, left: -20, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

          <div style={{ position: "relative" }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>STYLEGUIDE</p>
            <h1 style={{
              fontFamily: `'${typography.heading.family}', sans-serif`,
              fontWeight: 700,
              fontSize: "clamp(28px, 3vw, 44px)",
              lineHeight: 1.05,
              color: "#FFFFFF",
              marginBottom: 12,
              wordBreak: "break-word",
            }}>
              {business_name}
            </h1>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.80)", maxWidth: 260 }}>
              {tagline}
            </p>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: "rgba(255,255,255,0.60)", marginTop: 12, maxWidth: 280 }}>
              {vibe_summary}
            </p>
          </div>
        </div>

        {/* ── Logo ────────────────────────────────────────────────────────*/}
        <Cell style={{ borderRight: themeBorder }}>
          <SectionLabel>Logo</SectionLabel>
          {/* Wordmark */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: colors.background,
              border: isLightColor(colors.background) ? `1px solid ${borderColor}` : "none",
              borderRadius: 10,
              padding: "10px 14px"
            }}>
              {payload.logo_url ? (
                <img
                  src={payload.logo_url}
                  alt={`${business_name} logo`}
                  style={{ width: 32, height: 32, borderRadius: 8, objectFit: "contain", background: "white" }}
                />
              ) : (
                <div style={{ width: 32, height: 32, borderRadius: 8, background: colors.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: getContrastColor(colors.primary), fontWeight: 700, fontSize: 14 }}>
                    {(business_name || "?").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 15, color: colors.text }}>
                {business_name}
              </span>
            </div>
          </div>

          <SectionLabel>Logo Variation</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { bg: colors.primary, text: getContrastColor(colors.primary), label: "On Primary" },
              { bg: colors.background, text: colors.text, label: "On Light" },
              { bg: colors.text, text: getContrastColor(colors.text), label: "On Dark" },
            ].map((v, idx) => (
              <div key={idx}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: v.bg,
                  border: isLightColor(v.bg) ? `1px solid ${borderColor}` : "none",
                  borderRadius: 8,
                  padding: "7px 12px"
                }}>
                {payload.logo_url ? (
                  <img
                    src={payload.logo_url}
                    alt={`${business_name} logo variation`}
                    style={{ width: 22, height: 22, borderRadius: 5, objectFit: "contain", background: "white" }}
                  />
                ) : (
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: isLightColor(v.bg) ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: v.text, fontWeight: 700, fontSize: 10 }}>{(business_name || "?").charAt(0)}</span>
                  </div>
                )}
                <span style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 11, color: v.text }}>{business_name}</span>
              </div>
            ))}
          </div>
        </Cell>

        {/* ── Color Palette ────────────────────────────────────────────────*/}
        <Cell>
          <SectionLabel>Color Palette</SectionLabel>
          <p style={{ fontSize: 11, fontWeight: 600, color: themeText, marginBottom: 10 }}>Primary</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
            {primaryColors.map((c) => <ColorSwatch key={c.label} hex={c.hex} label={c.label} />)}
          </div>
          <p style={{ fontSize: 11, fontWeight: 600, color: themeText, marginBottom: 10 }}>Neutral</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {neutralColors.map((c) => <ColorSwatch key={c.label} hex={c.hex} label={c.label} />)}
          </div>
        </Cell>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          ROW 2 — Typography | Icons | Buttons
      ═══════════════════════════════════════════════════════════════════════*/}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 2.5fr", borderBottom: themeBorder }}>

        {/* ── Typography ──────────────────────────────────────────────────*/}
        <Cell style={{ borderRight: themeBorder }}>
          <SectionLabel>Typography</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0 24px" }}>
            {/* Big Aa */}
            <div>
              <p style={{
                fontFamily: `'${typography.heading.family}', sans-serif`,
                fontWeight: typography.heading.weight,
                fontSize: 72,
                lineHeight: 1,
                color: colors.text,
              }}>Aa</p>
            </div>
            {/* Specimen info */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
              <p style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 18, color: themeText }}>{typography.heading.family}</p>
              <p style={{ fontSize: 11, color: themeMutedText, lineHeight: 1.5 }}>
                Heading font — weight {typography.heading.weight}
              </p>
              <p style={{ fontFamily: `'${typography.body.family}', sans-serif`, fontWeight: 700, fontSize: 12, color: themeText, marginTop: 6 }}>
                {typography.body.family}
              </p>
              <p style={{ fontSize: 11, color: themeMutedText }}>Body font — weight {typography.body.weight}</p>
            </div>
          </div>

          <div style={{ borderTop: themeBorder, marginTop: 16, paddingTop: 16, display: "flex", gap: 24 }}>
            {/* Heading scale */}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: themeMutedText, marginBottom: 10 }}>HEADING</p>
              <p style={{ fontSize: 9, color: themeMutedText, marginBottom: 4 }}>
                {typography.heading.family} {typography.heading.weight === "700" ? "Bold" : "Regular"}
              </p>
              {[
                { label: "H1 Heading", size: 32, lh: 40 },
                { label: "H2 Heading", size: 24, lh: 32 },
                { label: "H3 Heading", size: 18, lh: 28 },
                { label: "H4 Heading", size: 14, lh: 22 },
              ].map((h) => (
                <div key={h.label} style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: h.size, color: colors.text, lineHeight: `${h.lh}px` }}>{h.label}</span>
                  <span style={{ fontSize: 9, color: themeMutedText, whiteSpace: "nowrap" }}>{h.size}/{h.lh}</span>
                </div>
              ))}
            </div>

            {/* Body specimen */}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: themeMutedText, marginBottom: 10 }}>BODY TEXT</p>
              <p style={{ fontSize: 9, color: themeMutedText, marginBottom: 4 }}>
                {typography.body.family} Regular
              </p>
              <p style={{ fontFamily: `'${typography.body.family}', sans-serif`, fontSize: 11, lineHeight: 1.6, color: colors.text, marginBottom: 8 }}>
                {business_name} delivers results for clients every day.
                Clear communication, thoughtful design, and an eye for detail.
              </p>
              <p style={{ fontSize: 9, color: themeMutedText }}>Body 16/24</p>
              <p style={{ fontSize: 9, color: themeMutedText }}>Caption 14/20</p>
            </div>
          </div>
        </Cell>

        {/* ── Icons ───────────────────────────────────────────────────────*/}
        <Cell style={{ borderRight: themeBorder }}>
          <SectionLabel>Icons</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {(icon_set ?? []).slice(0, 9).map((icon) => (
              <div key={icon.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: `${colors.primary}18`,
                  border: `1px solid ${colors.primary}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22,
                }}>
                  {icon.symbol}
                </div>
                <p style={{ fontSize: 10, color: themeMutedText, textAlign: "center", fontWeight: 500 }}>{icon.label}</p>
              </div>
            ))}
          </div>
        </Cell>

        {/* ── Buttons ─────────────────────────────────────────────────────*/}
        <Cell>
          <SectionLabel>Buttons</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Primary */}
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", alignItems: "center", gap: 12 }}>
              <p style={{ fontSize: 11, color: themeText, fontWeight: 500 }}>Primary</p>
              <div>
                <p style={{ fontSize: 9, color: themeMutedText, marginBottom: 6 }}>Default</p>
                <button style={{ background: colors.primary, color: getContrastColor(colors.primary), border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "default", fontFamily: `'${typography.body.family}', sans-serif` }}>
                  Primary Button
                </button>
              </div>
              <div>
                <p style={{ fontSize: 9, color: themeMutedText, marginBottom: 6 }}>Hover</p>
                <button style={{ background: colors.accent, color: getContrastColor(colors.accent), border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "default", display: "flex", alignItems: "center", gap: 6, fontFamily: `'${typography.body.family}', sans-serif` }}>
                  Primary Button <span>→</span>
                </button>
              </div>
            </div>

            <div style={{ borderTop: themeBorder }} />

            {/* Secondary */}
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", alignItems: "center", gap: 12 }}>
              <p style={{ fontSize: 11, color: themeText, fontWeight: 500 }}>Secondary</p>
              <div>
                <p style={{ fontSize: 9, color: themeMutedText, marginBottom: 6 }}>Default</p>
                <button style={{ background: "transparent", color: colors.primary, border: `1.5px solid ${colors.primary}`, borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "default", fontFamily: `'${typography.body.family}', sans-serif` }}>
                  Secondary
                </button>
              </div>
              <div>
                <p style={{ fontSize: 9, color: themeMutedText, marginBottom: 6 }}>Hover</p>
                <button style={{ background: `${colors.primary}12`, color: colors.primary, border: `1.5px solid ${colors.primary}`, borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "default", display: "flex", alignItems: "center", gap: 6, fontFamily: `'${typography.body.family}', sans-serif` }}>
                  Secondary <span>→</span>
                </button>
              </div>
            </div>

            <div style={{ borderTop: themeBorder }} />

            {/* Tertiary */}
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", alignItems: "center", gap: 12 }}>
              <p style={{ fontSize: 11, color: themeText, fontWeight: 500 }}>Tertiary</p>
              <div>
                <p style={{ fontSize: 9, color: themeMutedText, marginBottom: 6 }}>Default</p>
                <button style={{ background: "none", color: colors.primary, border: "none", padding: "9px 0", fontSize: 13, fontWeight: 600, cursor: "default", display: "flex", alignItems: "center", gap: 4, fontFamily: `'${typography.body.family}', sans-serif` }}>
                  Link Button <span>→</span>
                </button>
              </div>
              <div>
                <p style={{ fontSize: 9, color: themeMutedText, marginBottom: 6 }}>Hover</p>
                <button style={{
                  background: "none",
                  color: isLightColor(colors.accent) ? colors.secondary || colors.primary : colors.accent,
                  border: "none",
                  borderBottom: `1.5px solid ${isLightColor(colors.accent) ? colors.secondary || colors.primary : colors.accent}`,
                  padding: "9px 0",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "default",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: `'${typography.body.family}', sans-serif`
                }}>
                  Link Button <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </Cell>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          ROW 3 — Components | Imagery Style | Spacing & Layout
      ═══════════════════════════════════════════════════════════════════════*/}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 2.5fr" }}>

        {/* ── Components ──────────────────────────────────────────────────*/}
        <Cell style={{ borderRight: themeBorder }}>
          <SectionLabel>Components</SectionLabel>

          {/* Mini Navigation */}
          <div style={{
            background: colors.background,
            border: isLightColor(colors.background) ? `1px solid ${borderColor}` : "none",
            borderRadius: 10,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {payload.logo_url ? (
                <img
                  src={payload.logo_url}
                  alt={`${business_name} logo`}
                  style={{ width: 24, height: 24, borderRadius: 6, objectFit: "contain", background: "white" }}
                />
              ) : (
                <div style={{ width: 24, height: 24, borderRadius: 6, background: colors.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: getContrastColor(colors.primary), fontSize: 10, fontWeight: 700 }}>{(business_name || "?").charAt(0)}</span>
                </div>
              )}
              <span style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 10, color: colors.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 60 }}>
                {business_name.split(" ")[0]}
              </span>
            </div>
            <div style={{ display: "flex", gap: 6, margin: "0 4px" }}>
              {pageLabels.slice(0, 3).map((l) => (
                <span key={l} style={{ fontSize: 8, color: colors.text_muted, fontWeight: 500, whiteSpace: "nowrap" }}>{l}</span>
              ))}
            </div>
            <div style={{ background: colors.primary, color: getContrastColor(colors.primary), borderRadius: 4, padding: "3px 8px", fontSize: 8, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
              Contact
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[
              { num: "20+", label: "Pages ready" },
              { num: "100%", label: "Responsive" },
              { num: "∞", label: "Customizable" },
            ].map((s) => (
              <div key={s.label} style={{
                background: colors.surface,
                border: isLightColor(colors.surface) ? `1px solid ${borderColor}` : `1px solid ${themeBorder}`,
                borderRadius: 8,
                padding: "12px 10px",
                textAlign: "center",
              }}>
                <div style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 20, color: colors.primary }}>{s.num}</div>
                <div style={{ fontSize: 9, color: colors.text_muted, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Cell>

        {/* ── Imagery Style ────────────────────────────────────────────────*/}
        <Cell style={{ borderRight: themeBorder }}>
          <SectionLabel>Imagery Style</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
            {payload.moodboard_images && payload.moodboard_images.length > 0 ? (
              payload.moodboard_images.slice(0, 6).map((imgUrl, i) => (
                <div
                  key={i}
                  onClick={() => setLightboxImg(imgUrl)}
                  style={{ height: 70, borderRadius: 8, overflow: "hidden", background: colors.surface, cursor: "zoom-in" }}
                >
                  <img src={imgUrl} alt={`Moodboard element ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))
            ) : (
              [0, 1, 2, 3, 4, 5].map((i) => {
                const shade = [colors.primary, colors.secondary, colors.accent, colors.surface, colors.primary, colors.accent][i];
                const opacity = [0.9, 0.7, 0.85, 0.5, 0.6, 0.75][i];
                return (
                  <div key={i} style={{
                    height: 70,
                    borderRadius: 8,
                    background: shade,
                    opacity,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    overflow: "hidden",
                  }}>
                    {["🏢", "👥", "📊", "🤝", "💡", "🎯"][i]}
                  </div>
                );
              })
            )}
          </div>
          <p style={{ fontSize: 10, color: themeMutedText, lineHeight: 1.6 }}>
            Bright, modern, and inspiring imagery.
            Focus on real-life products, solutions, and actions.
          </p>
        </Cell>

        {/* ── Spacing & Layout ─────────────────────────────────────────────*/}
        <Cell>
          <SectionLabel>Spacing &amp; Layout</SectionLabel>

          <p style={{ fontSize: 11, fontWeight: 600, color: themeText, marginBottom: 10 }}>Spacing system (8px base)</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 16 }}>
            {[4, 8, 16, 24, 32, 48, 64, 96].map((size) => {
              const h = Math.min(size * 0.7, 52);
              return (
                <div key={size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 20, height: h, background: `${colors.primary}30`, border: `1px solid ${colors.primary}50`, borderRadius: 3 }} />
                  <span style={{ fontSize: 8, color: themeMutedText }}>{size}px</span>
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: 11, fontWeight: 600, color: themeText, marginBottom: 10 }}>Layout grid</p>
          <p style={{ fontSize: 10, color: themeMutedText, marginBottom: 8 }}>Container width: 1200px</p>
          <div style={{ position: "relative", height: 36, background: isDarkTheme ? "#1E1E1E" : "#F9FAFB", border: `1px solid ${isDarkTheme ? "rgba(255,255,255,0.1)" : borderColor}`, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ display: "flex", height: "100%" }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{
                  flex: 1,
                  background: `${colors.primary}14`,
                  borderRight: i < 11 ? `1px solid ${colors.primary}25` : "none",
                }} />
              ))}
            </div>
          </div>
          <p style={{ fontSize: 9, color: themeMutedText, marginTop: 4 }}>12-column grid · 24px gutter · 48px margin</p>

          <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { label: "Mobile", width: "375px" },
              { label: "Tablet", width: "768px" },
              { label: "Desktop", width: "1200px" },
            ].map((bp) => (
              <div key={bp.label} style={{ background: `${colors.primary}10`, border: `1px solid ${colors.primary}25`, borderRadius: 6, padding: "4px 10px" }}>
                <span style={{ fontSize: 9, color: colors.primary, fontWeight: 600 }}>{bp.label}</span>
                <span style={{ fontSize: 9, color: themeMutedText, marginLeft: 4 }}>{bp.width}</span>
              </div>
            ))}
          </div>
        </Cell>
      </div>

      {/* ── Lightbox Modal for Moodboard Zoom ── */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            cursor: "zoom-out",
          }}
        >
          <img
            src={lightboxImg}
            alt="Full Size Zoom"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 12,
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              objectFit: "contain",
            }}
          />
          <button
            onClick={() => setLightboxImg(null)}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              color: "#fff",
              fontSize: 20,
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
      )}

    </div>
  );
}
