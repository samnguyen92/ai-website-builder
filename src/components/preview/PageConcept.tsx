"use client";

import { useState } from "react";
import type { AIOutput } from "@/lib/ai/schema";

interface Props {
  payload: AIOutput;
}

interface SectionStyle {
  name: string;
  bg_color: string;
  text_color: string;
  heading_color: string;
  accent_color: string;
  btn_primary_bg: string;
  btn_primary_text: string;
  btn_secondary_border: string;
  btn_secondary_text: string;
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

export function PageConcept({ payload }: Props) {
  const { colors, typography, sitemap, tagline, business_name, logo_url, hero_image_url, moodboard_images, demo_content } = payload;
  const [activeTab, setActiveTab] = useState(sitemap[0]?.slug || "home");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  const currentTab = sitemap.find((p) => p.slug === activeTab) || sitemap[0];
  const pageSections = (currentTab?.sections || []) as unknown as SectionStyle[];

  // Helper to dynamically theme card backgrounds and texts inside a section to prevent contrast/visibility bugs
  function getCardStyle(sectionBg: string) {
    const isDarkSection = !isLightColor(sectionBg);
    const bg = isDarkSection ? "rgba(255,255,255,0.06)" : colors.surface;
    const border = isDarkSection ? "1px solid rgba(255,255,255,0.12)" : `1px solid ${colors.text_muted}15`;

    return {
      bg,
      border,
      heading: isDarkSection ? "#ffffff" : colors.text,
      text: isDarkSection ? "rgba(255,255,255,0.70)" : colors.text_muted,
    };
  }

  // Safe fallback copywriting dictionary in case payload.demo_content is undefined/partial
  const copy = {
    hero: {
      title: demo_content?.hero?.title || tagline || `Welcome to ${business_name}`,
      subtitle: demo_content?.hero?.subtitle || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.",
      cta_primary: demo_content?.hero?.cta_primary || "Get Started Now",
      cta_secondary: demo_content?.hero?.cta_secondary || "Learn More",
    },
    features: demo_content?.features || [
      { title: "Capability One", desc: "Lorem ipsum dolor sit amet, consectetur.", num: "01" },
      { title: "Capability Two", desc: "Lorem ipsum dolor sit amet, consectetur.", num: "02" },
      { title: "Capability Three", desc: "Lorem ipsum dolor sit amet, consectetur.", num: "03" }
    ],
    stats: demo_content?.stats || [
      { value: "100%", label: "Satisfaction Rate" },
      { value: "24/7", label: "Availability" },
      { value: "5★", label: "Average Rating" }
    ],
    cta: {
      title: demo_content?.cta?.title || "Ready to scale your business?",
      subtitle: demo_content?.cta?.subtitle || "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      button_text: demo_content?.cta?.button_text || "Book Appointment",
    },
    pricing: demo_content?.pricing || [
      { name: "Starter", price: "$49", desc: "Basic plan", items: ["10 items", "AI Palette suggestion"] },
      { name: "Pro Plan", price: "$149", desc: "Best value", items: ["Unlimited entries", "Sitemap trees"] }
    ],
    faq: demo_content?.faq || [
      { q: "How does it work?", a: "Our pipeline creates sitemaps and style guides." },
      { q: "Can I upgrade?", a: "Select any pricing cards above." }
    ],
    team: demo_content?.team || [
      { name: "John Doe", role: "Design Lead", bio: "Figma specialist", emoji: "👤" },
      { name: "Jane Smith", role: "AI Engineer", bio: "Agent orchestrator", emoji: "👩‍💻" }
    ],
    services: demo_content?.services || [
      { title: "Brand Identity Design", desc: "Logo and color systems", tag: "Popular", emoji: "🎨" },
      { title: "Website Development", desc: "Next.js builds", tag: "Featured", emoji: "⚡" }
    ],
    products: demo_content?.products || [
      { name: "Premium Branding Kit", price: "$99.00", cat: "Branding", rating: "5★", emoji: "🎨" },
      { name: "UX Wireframing Guide", price: "$29.00", cat: "Design", rating: "4★", emoji: "📐" }
    ],
    testimonials: demo_content?.testimonials || [
      { quote: "Align generated a beautiful sitemap and palette in seconds.", author: "Sarah Connor, Nova" },
      { quote: "Revisions are smooth and the text fits perfectly.", author: "Marcus Aurelius, Founder" }
    ],
    blog: demo_content?.blog || [
      { title: "Building pages converting in 2026", date: "July 8, 2026", read: "5 min", emoji: "⚡" },
      { title: "Typography pairings that convert", date: "June 30, 2026", read: "8 min", emoji: "✍️" }
    ]
  };

  // ─── Section Renderers supporting 3 design concepts (Concept 0, 1, 2) ─────

  function RenderHero({ conceptIndex, style }: { conceptIndex: number; style: SectionStyle }) {
    const bg = style.bg_color || colors.background;
    const text = style.text_color || colors.text;
    const heading = style.heading_color || colors.text;
    const accent = style.accent_color || colors.accent;
    const btnBg = style.btn_primary_bg || colors.primary;
    const btnText = style.btn_primary_text || "#ffffff";
    const btnBorder = style.btn_secondary_border || colors.text_muted;
    const btnSecText = style.btn_secondary_text || colors.text;

    const card = getCardStyle(bg);

    // Concept 2: Minimal card outline layout
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "60px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center", background: bg }}>
          <div style={{
            background: card.bg,
            border: `1.5px solid ${accent}`,
            borderRadius: 16,
            padding: "40px 30px",
            maxWidth: 720,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: accent }}>
              ✦ {currentTab?.label || "Overview"} Page Concept ✦
            </span>
            <h2 style={{
              fontFamily: `'${typography.heading.family}', sans-serif`,
              fontWeight: 800,
              fontSize: 36,
              color: card.heading,
              margin: 0,
            }}>
              {copy.hero.title}
            </h2>
            <p style={{ fontSize: 13, color: card.text, opacity: 0.85, lineHeight: 1.6, maxWidth: 520, margin: 0 }}>
              {copy.hero.subtitle}
            </p>
            <div style={{ display: "flex", gap: 10, width: "100%", justifyContent: "center", marginTop: 8 }}>
              <input type="email" placeholder="Enter your business email" style={{ padding: "10px 14px", borderRadius: 6, border: `1.5px solid ${colors.text_muted}22`, background: colors.background, color: colors.text, fontSize: 12, minWidth: 220 }} />
              <button style={{ background: btnBg, color: btnText, border: "none", borderRadius: 6, padding: "10px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                {copy.hero.cta_primary}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Concept 1: Centered background overlay style
    if (conceptIndex === 1) {
      return (
        <div style={{
          position: "relative",
          padding: "100px 40px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          overflow: "hidden",
          background: hero_image_url
            ? `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.80)), url(${hero_image_url})`
            : `linear-gradient(135deg, ${bg}, ${colors.surface})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
          <div style={{
            display: "inline-flex",
            background: `${accent}22`,
            border: `1px solid ${accent}44`,
            borderRadius: 9999,
            padding: "6px 16px",
            fontSize: 11,
            fontWeight: 700,
            color: hero_image_url ? "#fff" : text,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            ✦ {currentTab?.label || "Overview"} Page
          </div>
          <h2 style={{
            fontFamily: `'${typography.heading.family}', sans-serif`,
            fontWeight: 800,
            fontSize: 48,
            lineHeight: 1.1,
            color: hero_image_url ? "#ffffff" : heading,
            maxWidth: 700,
          }}>
            {copy.hero.title}
          </h2>
          <p style={{ fontSize: 14, color: hero_image_url ? "rgba(255,255,255,0.85)" : text, lineHeight: 1.6, maxWidth: 500 }}>
            {copy.hero.subtitle}
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            <button style={{ background: btnBg, color: btnText, border: "none", borderRadius: 8, padding: "14px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.3)" }}>
              {copy.hero.cta_primary}
            </button>
            <button style={{ background: "rgba(255,255,255,0.15)", color: hero_image_url ? "#fff" : btnSecText, border: `1px solid ${hero_image_url ? "rgba(255,255,255,0.25)" : btnBorder}`, borderRadius: 8, padding: "14px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {copy.hero.cta_secondary}
            </button>
          </div>
        </div>
      );
    }

    // Concept 0: 2-Column Split (Default)
    return (
      <div style={{
        padding: "60px 40px",
        display: "grid",
        gridTemplateColumns: hero_image_url ? "1.2fr 1fr" : "1fr",
        gap: 40,
        alignItems: "center",
        background: bg,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{
            display: "inline-flex",
            background: `${accent}12`,
            border: `1px solid ${accent}25`,
            borderRadius: 9999,
            padding: "5px 12px",
            width: "fit-content",
            fontSize: 11,
            fontWeight: 600,
            color: accent,
          }}>
            ✦ {currentTab?.label || "Overview"} Page
          </div>
          <h2 style={{
            fontFamily: `'${typography.heading.family}', sans-serif`,
            fontWeight: 700,
            fontSize: 42,
            lineHeight: 1.15,
            color: heading,
          }}>
            {copy.hero.title}
          </h2>
          <p style={{ fontSize: 13, color: text, lineHeight: 1.6, maxWidth: 440 }}>
            {copy.hero.subtitle}
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button style={{ background: btnBg, color: btnText, border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              {copy.hero.cta_primary}
            </button>
            <button style={{ background: "transparent", color: btnSecText, border: `1.5px solid ${btnBorder}`, borderRadius: 8, padding: "10px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              {copy.hero.cta_secondary}
            </button>
          </div>
        </div>

        {hero_image_url && (
          <div style={{ width: "100%", height: 300, borderRadius: 12, overflow: "hidden", background: card.bg, border: card.border }}>
            <img src={hero_image_url} alt="AI Hero Graphic" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
      </div>
    );
  }

  function RenderFeaturesGrid({ conceptIndex, style }: { conceptIndex: number; style: SectionStyle }) {
    const bg = style.bg_color || colors.surface;
    const text = style.text_color || colors.text_muted;
    const heading = style.heading_color || colors.text;
    const accent = style.accent_color || colors.accent;

    const card = getCardStyle(bg);

    // Concept 2: Offset staggered grid with numbers
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "60px 40px", display: "flex", flexDirection: "column", gap: 32, background: bg }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: accent }}>Capabilities</p>
              <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: heading, marginTop: 6 }}>
                Why clients trust us
              </h3>
            </div>
            <span style={{ fontSize: 12, color: text, maxWidth: 280 }}>
              Tailored solutions built specifically to handle brand workflows.
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 12 }}>
            {copy.features.map((ft, idx) => (
              <div key={idx} style={{
                background: card.bg,
                borderLeft: `4px solid ${accent}`,
                borderTop: card.border,
                borderRight: card.border,
                borderBottom: card.border,
                borderRadius: "0 10px 10px 0",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: accent }}>{ft.num || `0${idx + 1}`}</span>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: card.heading, margin: 0 }}>{ft.title}</h4>
                <p style={{ fontSize: 12, color: card.text, lineHeight: 1.6, margin: 0 }}>{ft.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 1: Alternating rows
    if (conceptIndex === 1) {
      return (
        <div style={{ padding: "60px 40px", display: "flex", flexDirection: "column", gap: 50, background: bg }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: accent }}>Our Process</p>
            <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: heading, marginTop: 8 }}>How we work</h3>
          </div>
          {copy.features.slice(0, 2).map((item, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div key={idx} style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 40,
                alignItems: "center",
                direction: isLeft ? "ltr" : "rtl",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left", direction: "ltr" }}>
                  <span style={{ fontSize: 32, fontWeight: 800, color: `${accent}33` }}>{item.num || `0${idx + 1}`}</span>
                  <h4 style={{ fontSize: 20, fontWeight: 700, color: heading }}>{item.title}</h4>
                  <p style={{ fontSize: 13, color: text, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
                <div style={{
                  height: 180,
                  borderRadius: 12,
                  background: `${accent}10`,
                  border: `1px solid ${colors.text_muted}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 48,
                }}>
                  {["🔍", "📐", "🚀"][idx]}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Concept 0: 3-column grid cards (Default)
    return (
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 32, background: bg }}>
        <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: accent }}>Capabilities</p>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: heading, marginTop: 8 }}>
            Core offerings
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {copy.features.map((item, idx) => (
            <div key={idx} style={{
              background: card.bg,
              borderRadius: 10,
              border: card.border,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {["📊", "💼", "🛡️"][idx % 3]}
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: card.heading }}>{item.title}</h4>
              <p style={{ fontSize: 12, color: card.text, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function RenderStats({ conceptIndex, style }: { conceptIndex: number; style: SectionStyle }) {
    const bg = style.bg_color || colors.surface;
    const text = style.text_color || colors.text_muted;
    const heading = style.heading_color || colors.primary;
    const accent = style.accent_color || colors.primary;

    const card = getCardStyle(bg);

    // Concept 2: Unified card with bold dividers
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "40px", background: bg }}>
          <div style={{
            background: card.bg,
            borderRadius: 14,
            border: `2px solid ${accent}`,
            padding: "30px 40px",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
            gap: 30,
            alignItems: "center",
          }}>
            <div>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: card.heading, margin: 0 }}>Metrics That Matter</h4>
              <p style={{ fontSize: 12, color: card.text, marginTop: 6, margin: 0 }}>Our accomplishments verified.</p>
            </div>
            {copy.stats.map((val, idx) => (
              <div key={idx} style={{
                textAlign: "center",
                borderLeft: `2.5px solid ${accent}`,
                paddingLeft: 20,
              }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: card.heading }}>{val.value}</span>
                <p style={{ fontSize: 10, color: card.text, marginTop: 4, textTransform: "uppercase", margin: 0 }}>
                  {val.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 1: Circle indicator badges
    if (conceptIndex === 1) {
      return (
        <div style={{
          padding: "40px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          gap: 20,
          background: bg,
        }}>
          {copy.stats.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: `3px solid ${accent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 16,
                color: heading,
              }}>
                {item.value}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: 11, color: text, margin: 0 }}>Verified stats</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Concept 0: standard vertical counters (Default)
    return (
      <div style={{
        background: bg,
        padding: "24px 0",
        display: "grid",
        gridTemplateColumns: `repeat(${copy.stats.length}, 1fr)`,
        textAlign: "center",
      }}>
        {copy.stats.map((st, i) => (
          <div key={i} style={{ borderRight: i < copy.stats.length - 1 ? `1px solid ${colors.text_muted}22` : "none" }}>
            <p style={{
              fontFamily: `'${typography.heading.family}', sans-serif`,
              fontWeight: 700,
              fontSize: 28,
              color: heading,
              margin: 0,
            }}>{st.value}</p>
            <p style={{ fontSize: 10, color: text, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{st.label}</p>
          </div>
        ))}
      </div>
    );
  }

  function RenderCTABanner({ conceptIndex, style }: { conceptIndex: number; style: SectionStyle }) {
    const bg = style.bg_color || colors.primary;
    const text = style.text_color || "#ffffff";
    const heading = style.heading_color || "#ffffff";
    const accent = style.accent_color || colors.accent;
    const btnBg = style.btn_primary_bg || "#ffffff";
    const btnText = style.btn_primary_text || colors.primary;

    const card = getCardStyle(bg);

    // Concept 2: Glassmorphic alert panel layout
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "40px", background: colors.background }}>
          <div style={{
            background: bg,
            border: `1px solid ${colors.text_muted}15`,
            borderRadius: 16,
            padding: "36px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.05em" }}>Next Step</span>
              <h4 style={{ fontSize: 20, fontWeight: 700, color: heading, marginTop: 4, margin: 0 }}>{copy.cta.title}</h4>
            </div>
            <button style={{
              background: btnBg,
              color: btnText,
              border: "none",
              borderRadius: 6,
              padding: "12px 24px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}>
              {copy.cta.button_text}
            </button>
          </div>
        </div>
      );
    }

    // Concept 1: Inline split CTA
    if (conceptIndex === 1) {
      return (
        <div style={{
          background: card.bg,
          border: card.border,
          margin: "30px 40px",
          borderRadius: 16,
          padding: "40px 50px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 30,
          alignItems: "center",
        }}>
          <div>
            <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 26, color: card.heading, margin: 0 }}>
              {copy.cta.title}
            </h3>
            <p style={{ fontSize: 13, color: card.text, marginTop: 8, margin: 0 }}>
              {copy.cta.subtitle}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <input type="email" placeholder="Your Email Address" style={{ flex: 1, padding: "12px", borderRadius: 8, border: `1px solid ${colors.text_muted}22`, background: colors.background, color: colors.text, fontSize: 13 }} />
            <button style={{ background: accent, color: getContrastColor(accent), border: "none", borderRadius: 8, padding: "0 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              {copy.cta.button_text}
            </button>
          </div>
        </div>
      );
    }

    // Concept 0: centered layout block (Default)
    return (
      <div style={{
        background: bg,
        color: text,
        padding: "50px 40px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}>
        <h3 style={{
          fontFamily: `'${typography.heading.family}', sans-serif`,
          fontWeight: 700,
          fontSize: 30,
          color: heading,
          margin: 0,
        }}>
          {copy.cta.title}
        </h3>
        <p style={{ fontSize: 13, opacity: 0.85, maxWidth: 460, margin: 0 }}>
          {copy.cta.subtitle}
        </p>
        <button style={{
          background: btnBg,
          color: btnText,
          border: "none",
          borderRadius: 8,
          padding: "12px 28px",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          marginTop: 8,
        }}>
          {copy.cta.button_text}
        </button>
      </div>
    );
  }

  function RenderPricing({ conceptIndex, style }: { conceptIndex: number; style: SectionStyle }) {
    const bg = style.bg_color || colors.background;
    const text = style.text_color || colors.text_muted;
    const heading = style.heading_color || colors.text;
    const accent = style.accent_color || colors.accent;
    const btnBg = style.btn_primary_bg || colors.primary;
    const btnText = style.btn_primary_text || "#ffffff";

    const card = getCardStyle(bg);

    // Concept 2: Monthly/Annual switcher cards
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24, alignItems: "center", background: bg }}>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: heading }}>Pricing Plans</h3>
            {/* Toggle Switch switcher */}
            <div style={{ display: "inline-flex", background: `${colors.primary}12`, padding: 4, borderRadius: 8, marginTop: 14 }}>
              <button
                onClick={() => setBillingPeriod("monthly")}
                style={{
                  background: billingPeriod === "monthly" ? colors.primary : "transparent",
                  color: billingPeriod === "monthly" ? getContrastColor(colors.primary) : colors.text_muted,
                  border: "none", borderRadius: 6, padding: "6px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annual")}
                style={{
                  background: billingPeriod === "annual" ? colors.primary : "transparent",
                  color: billingPeriod === "annual" ? getContrastColor(colors.primary) : colors.text_muted,
                  border: "none", borderRadius: 6, padding: "6px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                }}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, width: "100%", maxWidth: 640 }}>
            {copy.pricing.slice(0, 2).map((p, idx) => (
              <div key={idx} style={{
                background: card.bg,
                border: card.border,
                borderRadius: 12,
                padding: 30,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: card.heading, margin: 0 }}>{p.name}</h4>
                <p style={{ fontSize: 32, fontWeight: 800, color: card.heading, margin: 0 }}>
                  {billingPeriod === "monthly" ? p.price : `$${parseInt(p.price.replace("$", "")) * 8}`}
                  <span style={{ fontSize: 12, color: card.text, fontWeight: 400 }}>/mo</span>
                </p>
                <hr style={{ borderColor: `${colors.text_muted}10`, margin: "8px 0" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12, color: card.text }}>
                  {p.items.map((it, i) => <div key={i}>✓ {it}</div>)}
                </div>
                <button style={{ background: btnBg, color: btnText, border: "none", borderRadius: 6, padding: "10px", fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%", marginTop: 12 }}>
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 1: Horizontal spotlight recommendation plan
    if (conceptIndex === 1) {
      const topPlan = copy.pricing[1] || copy.pricing[0];
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24, background: bg }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: accent }}>Recommended Plan</p>
            <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 26, color: heading, marginTop: 4 }}>Get the best value</h3>
          </div>
          <div style={{
            background: card.bg,
            borderRadius: 16,
            border: `2px solid ${accent}`,
            padding: 40,
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 40,
            alignItems: "center",
          }}>
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <h4 style={{ fontSize: 20, fontWeight: 700, color: card.heading, margin: 0 }}>{topPlan.name}</h4>
                <span style={{ background: accent, color: getContrastColor(accent), fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 9999 }}>POPULAR</span>
              </div>
              <p style={{ fontSize: 13, color: card.text, marginTop: 8, lineHeight: 1.6, margin: 0 }}>
                {topPlan.desc}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20, fontSize: 12, color: card.text }}>
                {topPlan.items.map((it, idx) => (
                  <div key={idx}>✓ {it}</div>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 44, fontWeight: 800, color: card.heading, margin: 0 }}>{topPlan.price}<span style={{ fontSize: 16, fontWeight: 400, color: card.text }}>/mo</span></p>
              <button style={{ background: btnBg, color: btnText, border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%" }}>
                Select Plan
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Concept 0: 3 columns card grid (Default)
    return (
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 32, background: bg }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: accent }}>Pricing Plans</p>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: heading, marginTop: 6 }}>
            Simple plans for everyone
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${copy.pricing.length}, 1fr)`, gap: 20 }}>
          {copy.pricing.map((plan, idx) => {
            const isFeatured = idx === 1;
            return (
              <div key={idx} style={{
                background: card.bg,
                borderRadius: 12,
                border: isFeatured ? `2px solid ${accent}` : card.border,
                padding: 30,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                transform: isFeatured ? "scale(1.03)" : "none",
              }}>
                <p style={{ fontSize: 13, color: card.text, fontWeight: 600, margin: 0 }}>{plan.name}</p>
                <p style={{ fontSize: 36, fontWeight: 700, color: card.heading, margin: 0 }}>{plan.price}<span style={{ fontSize: 14, fontWeight: 400, color: card.text }}>/mo</span></p>
                <p style={{ fontSize: 11, color: card.text, margin: 0 }}>{plan.desc}</p>
                <hr style={{ borderColor: `${colors.text_muted}15` }} />
                <ul style={{ fontSize: 11, color: card.text, listStyle: "none", display: "flex", flexDirection: "column", gap: 8, padding: 0, margin: 0 }}>
                  {plan.items.map((item, idx) => <li key={idx}>✓ {item}</li>)}
                </ul>
                <button style={{
                  background: isFeatured ? accent : "transparent",
                  color: isFeatured ? getContrastColor(accent) : card.heading,
                  border: isFeatured ? "none" : `1px solid ${colors.text_muted}`,
                  borderRadius: 6,
                  padding: "10px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%",
                }}>
                  Choose Plan
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function RenderFAQ({ conceptIndex, style }: { conceptIndex: number; style: SectionStyle }) {
    const bg = style.bg_color || colors.background;
    const text = style.text_color || colors.text_muted;
    const heading = style.heading_color || colors.text;
    const accent = style.accent_color || colors.accent;

    const card = getCardStyle(bg);

    // Concept 2: Outlined boxes matrix tabs
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24, background: bg }}>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 26, textAlign: "center", color: heading }}>
            FAQ Matrix
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {copy.faq.map((item, idx) => (
              <div key={idx} style={{
                background: card.bg,
                border: `1.5px solid ${accent}22`,
                borderRadius: 10,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>Q: {item.q}</span>
                <p style={{ fontSize: 12, color: card.text, lineHeight: 1.5, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 1: Two-column grid (Sidebar category left, Questions right)
    if (conceptIndex === 1) {
      return (
        <div style={{ padding: "50px 40px", display: "grid", gridTemplateColumns: "200px 1fr", gap: 30, background: bg }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: accent }}>Help Center</p>
            <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 24, color: heading, marginTop: 4 }}>Common Queries</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {copy.faq.map((item, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${colors.text_muted}10`, paddingBottom: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: heading, margin: 0 }}>{item.q}</p>
                <p style={{ fontSize: 12, color: text, marginTop: 6, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 0: standard Accordions list (Default)
    return (
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24, maxWidth: 640, margin: "0 auto", background: bg }}>
        <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 26, textAlign: "center", color: heading, margin: 0 }}>
          Frequently Asked Questions
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {copy.faq.map((item, i) => (
            <div key={i} style={{
              background: card.bg,
              borderRadius: 10,
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              border: card.border,
            }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: card.heading }}>{item.q}</span>
              <span style={{ fontSize: 14, color: card.text }}>+</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function RenderTeam({ conceptIndex, style }: { conceptIndex: number; style: SectionStyle }) {
    const bg = style.bg_color || colors.background;
    const text = style.text_color || colors.text_muted;
    const heading = style.heading_color || colors.text;
    const accent = style.accent_color || colors.primary;

    const card = getCardStyle(bg);

    // Concept 2: Staggered wide profile cards (2 columns wide profile rows)
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 32, background: bg }}>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, textAlign: "center", color: heading }}>
            Our Leaders
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {copy.team.map((m, i) => (
              <div key={i} style={{
                background: card.bg,
                border: card.border,
                borderRadius: 12,
                padding: 24,
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${accent}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  {m.emoji}
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: card.heading, margin: 0 }}>{m.name}</h4>
                  <p style={{ fontSize: 11, color: accent, fontWeight: 600, marginTop: 2, margin: 0 }}>{m.role}</p>
                  <p style={{ fontSize: 12, color: card.text, marginTop: 6, margin: 0 }}>{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 1: 3 columns card badge frames
    if (conceptIndex === 1) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24, background: bg }}>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, textAlign: "center", color: heading }}>
            Expert Advisors
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {copy.team.slice(0, 3).map((m, i) => (
              <div key={i} style={{
                background: card.bg,
                border: `2px solid ${accent}`,
                borderRadius: 10,
                padding: "24px 16px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}>
                <div style={{ fontSize: 32 }}>{m.emoji}</div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: card.heading, margin: 0 }}>{m.name}</h4>
                <span style={{ background: `${accent}15`, color: accent, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 0: standard circular team grid (Default)
    return (
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 32, background: bg }}>
        <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, textAlign: "center", color: heading, margin: 0 }}>
          Meet Our Team
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(copy.team.length, 4)}, 1fr)`, gap: 20 }}>
          {copy.team.map((member, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: card.bg, border: `1px solid ${accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {member.emoji}
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: heading, margin: 0 }}>{member.name}</p>
              <p style={{ fontSize: 11, color: text, margin: 0 }}>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function RenderGallery({ conceptIndex, style }: { conceptIndex: number; style: SectionStyle }) {
    const bg = style.bg_color || colors.background;
    const heading = style.heading_color || colors.text;
    const accent = style.accent_color || colors.accent;

    const card = getCardStyle(bg);

    const imagesToUse = moodboard_images && moodboard_images.length > 0
      ? moodboard_images.slice(0, 6)
      : Array.from({ length: 6 }).map(() => "");

    // Concept 2: Staggered horizontal scrolling carousel mockup cards layout
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24, background: bg }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: heading, margin: 0 }}>
              Visual Stylescape
            </h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ width: 32, height: 32, borderRadius: "50%", background: card.bg, border: card.border, color: heading, fontSize: 12, cursor: "pointer" }}>←</button>
              <button style={{ width: 32, height: 32, borderRadius: "50%", background: card.bg, border: card.border, color: heading, fontSize: 12, cursor: "pointer" }}>→</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 10 }}>
            {imagesToUse.map((img, i) => (
              <div key={i} style={{
                width: 220,
                height: 140,
                borderRadius: 10,
                overflow: "hidden",
                background: card.bg,
                border: card.border,
                flexShrink: 0,
              }}>
                {img ? (
                  <img src={img} alt="Carousel item" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                    🖼️
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 1: Staggered height masonry blocks
    if (conceptIndex === 1) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24, background: bg }}>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, textAlign: "center", color: heading, margin: 0 }}>
            Branding Showcase
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, alignItems: "start" }}>
            {imagesToUse.map((img, i) => {
              const height = [140, 190, 160, 180, 130, 170][i];
              return (
                <div key={i} style={{
                  height,
                  borderRadius: 10,
                  overflow: "hidden",
                  background: card.bg,
                  border: card.border,
                }}>
                  {img ? (
                    <img src={img} alt="Moodboard detail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                      🖼️
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Concept 0: standard clean 3x2 grid (Default)
    return (
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24, background: bg }}>
        <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, textAlign: "center", color: heading, margin: 0 }}>
          Visual Gallery
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {imagesToUse.map((img, i) => (
            <div key={i} style={{
              height: 160,
              borderRadius: 10,
              overflow: "hidden",
              background: card.bg,
              border: card.border,
            }}>
              {img ? (
                <img src={img} alt="Gallery item" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                  🖼️
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function RenderShopProductGrid({ conceptIndex, style }: { conceptIndex: number; style: SectionStyle }) {
    const bg = style.bg_color || colors.background;
    const text = style.text_color || colors.text_muted;
    const heading = style.heading_color || colors.text;
    const accent = style.accent_color || colors.accent;
    const btnBg = style.btn_primary_bg || colors.primary;
    const btnText = style.btn_primary_text || "#ffffff";

    const card = getCardStyle(bg);

    // Concept 2: Single product spotlight detailed view (Spotlight hero display detailed view)
    if (conceptIndex === 2) {
      const topProd = copy.products[0];
      return (
        <div style={{ padding: "50px 40px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 40, alignItems: "center", background: bg }}>
          {/* Left: Product image */}
          <div style={{
            height: 280,
            borderRadius: 12,
            background: `${accent}10`,
            border: `1px solid ${colors.text_muted}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 80,
          }}>
            {topProd.emoji}
          </div>
          {/* Right: Product details description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: "uppercase" }}>Featured Product</span>
            <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 800, fontSize: 28, color: heading, margin: 0 }}>
              {topProd.name}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: accent, fontWeight: 700 }}>★★★★★</span>
              <span style={{ fontSize: 11, color: text }}>(24 client reviews)</span>
            </div>
            <p style={{ fontSize: 32, fontWeight: 800, color: heading, margin: 0 }}>{topProd.price}</p>
            <p style={{ fontSize: 13, color: text, lineHeight: 1.6, margin: 0 }}>
              Get our complete premium resource package detailed bundle matching the business category.
            </p>
            <button style={{
              background: btnBg,
              color: btnText,
              border: "none",
              borderRadius: 8,
              padding: "14px 28px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              marginTop: 10,
            }}>
              Add to Shopping Cart
            </button>
          </div>
        </div>
      );
    }

    // Concept 1: Full-width 4-column minimal catalog (No sidebar, top filters)
    if (conceptIndex === 1) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24, background: bg }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${colors.text_muted}10`, paddingBottom: 16 }}>
            <div>
              <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 24, color: heading, margin: 0 }}>Store Catalog</h3>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(copy.products.length, 4)}, 1fr)`, gap: 16 }}>
            {copy.products.slice(0, 4).map((p, i) => (
              <div key={i} style={{
                background: card.bg,
                border: card.border,
                borderRadius: 12,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}>
                <div style={{ height: 130, background: `${accent}08`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
                  {p.emoji}
                </div>
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: card.heading, margin: 0 }}>{p.name}</h4>
                  <p style={{ fontSize: 12, fontWeight: 800, color: accent, marginTop: "auto", margin: 0 }}>{p.price}</p>
                  <button style={{
                    background: `${accent}12`,
                    color: accent,
                    border: "none",
                    borderRadius: 6,
                    padding: "8px",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}>
                    Quick Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 0: Split-grid with filter sidebar (Default)
    return (
      <div style={{ padding: "50px 40px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 30, background: bg }}>
        {/* Sidebar filters */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, borderRight: `1px solid ${colors.text_muted}15`, paddingRight: 20 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: accent, marginBottom: 12 }}>Categories</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: text }}>
              {["All Items", "Core offerings", "Consulting", "Branding"].map((cat, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", cursor: "pointer", color: i === 0 ? heading : text }}>
                  <span>{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product listing grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {copy.products.map((p, i) => (
              <div key={i} style={{
                background: card.bg,
                border: card.border,
                borderRadius: 10,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}>
                <div style={{ height: 120, background: `${accent}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
                  {p.emoji}
                </div>
                <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <span style={{ fontSize: 9, color: accent, fontWeight: 700 }}>{p.cat}</span>
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: card.heading, lineHeight: 1.4, margin: 0 }}>{p.name}</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: card.heading }}>{p.price}</span>
                    <span style={{ fontSize: 10, color: card.text }}>{p.rating}</span>
                  </div>
                  <button style={{
                    background: btnBg,
                    color: btnText,
                    border: "none",
                    borderRadius: 6,
                    padding: "8px",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    marginTop: 8,
                  }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function RenderServicesList({ conceptIndex, style }: { conceptIndex: number; style: SectionStyle }) {
    const bg = style.bg_color || colors.background;
    const text = style.text_color || colors.text_muted;
    const heading = style.heading_color || colors.text;
    const accent = style.accent_color || colors.accent;

    const card = getCardStyle(bg);

    // Concept 2: 2x2 grid offset list layout
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24, background: bg }}>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: heading, margin: 0 }}>
            Our Specializations
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {copy.services.map((item, idx) => (
              <div key={idx} style={{
                background: card.bg,
                border: card.border,
                borderRadius: 12,
                padding: 24,
                display: "flex",
                gap: 16,
              }}>
                <span style={{ fontSize: 28 }}>{item.emoji}</span>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: card.heading, margin: 0 }}>{item.title}</h4>
                  <p style={{ fontSize: 12, color: card.text, marginTop: 6, lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 1: Service column grid with category tabs
    if (conceptIndex === 1) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 20, background: bg }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 26, color: heading, margin: 0 }}>Solutions Overview</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(copy.services.length, 3)}, 1fr)`, gap: 16 }}>
            {copy.services.slice(0, 3).map((item, i) => (
              <div key={i} style={{
                background: card.bg,
                padding: 20,
                borderRadius: 10,
                border: card.border,
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: accent }}>{item.tag}</span>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: card.heading, marginTop: 8, margin: 0 }}>{item.title}</h4>
                <p style={{ fontSize: 12, color: card.text, marginTop: 8, lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 0: standard vertical list rows (Default)
    return (
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24, background: bg }}>
        <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: heading, margin: 0 }}>
          What We Offer
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {copy.services.slice(0, 3).map((srv, idx) => (
            <div key={idx} style={{
              background: card.bg,
              borderRadius: 10,
              padding: 24,
              border: card.border,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
            }}>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: card.heading, margin: 0 }}>{srv.title}</h4>
                <p style={{ fontSize: 12, color: card.text, marginTop: 6, lineHeight: 1.5, margin: 0 }}>{srv.desc}</p>
              </div>
              <span style={{
                background: `${accent}12`,
                border: `1px solid ${accent}25`,
                borderRadius: 9999,
                padding: "4px 12px",
                fontSize: 10,
                color: accent,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}>
                {srv.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function RenderBlogGrid({ conceptIndex, style }: { conceptIndex: number; style: SectionStyle }) {
    const bg = style.bg_color || colors.background;
    const text = style.text_color || colors.text_muted;
    const heading = style.heading_color || colors.text;
    const accent = style.accent_color || colors.accent;

    const card = getCardStyle(bg);

    // Concept 2: Text-only minimal list of rows with custom date and link icon
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24, background: bg }}>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 26, color: heading, margin: 0 }}>
            Read Publications
          </h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {copy.blog.map((post, idx) => (
              <div key={idx} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 0",
                borderBottom: `1px solid ${colors.text_muted}15`,
              }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: text, width: 80 }}>{post.date}</span>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: heading, margin: 0 }}>{post.title}</h4>
                </div>
                <span style={{ fontSize: 12, color: accent, fontWeight: 700, cursor: "pointer" }}>Read Article →</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 1: Left featured large article, right simple rows
    if (conceptIndex === 1) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24, background: bg }}>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 26, color: heading, margin: 0 }}>
            Resources &amp; Press
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 30, marginTop: 12 }}>
            {/* Left featured column */}
            <div style={{
              background: card.bg,
              border: card.border,
              borderRadius: 12,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}>
              <span style={{ fontSize: 10, color: accent, fontWeight: 700 }}>FEATURED ARTICLE</span>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: card.heading, margin: 0 }}>{copy.blog[0].title}</h4>
              <p style={{ fontSize: 13, color: card.text, lineHeight: 1.6, margin: 0 }}>
                A deep dive analysis exploring design token layouts, responsive constraints, and typography metrics that optimize layout readability.
              </p>
            </div>
            {/* Right stack column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {copy.blog.slice(1, 3).map((post, i) => (
                <div key={i} style={{ background: card.bg, padding: 16, borderRadius: 10, border: card.border }}>
                  <span style={{ fontSize: 9, color: card.text }}>{post.date}</span>
                  <h5 style={{ fontSize: 13, fontWeight: 600, color: card.heading, marginTop: 4, margin: 0 }}>{post.title}</h5>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Concept 0: 3 columns article cards (Default)
    return (
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 32, background: bg }}>
        <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, textAlign: "center", color: heading, margin: 0 }}>
          Latest Insights &amp; Articles
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {copy.blog.map((post, idx) => (
            <div key={idx} style={{
              background: card.bg,
              border: card.border,
              borderRadius: 12,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{ height: 140, background: `${accent}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
                {post.emoji}
              </div>
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: card.text }}>
                  <span>{post.date}</span>
                  <span>{post.read}</span>
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: card.heading, lineHeight: 1.4, margin: 0 }}>{post.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function RenderMapLocation({ style }: { style: SectionStyle }) {
    const bg = style.bg_color || colors.background;
    const heading = style.heading_color || colors.text;
    const accent = style.accent_color || colors.accent;

    return (
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24, background: bg }}>
        <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 26, color: heading, margin: 0 }}>
          Find Us Here
        </h3>
        <div style={{
          height: 240,
          borderRadius: 12,
          background: `${accent}10`,
          border: `1px solid ${colors.text_muted}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Mock visual map styling */}
          <div style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.2, background: "radial-gradient(circle, #fff 10%, transparent 10%)", backgroundSize: "20px 20px" }} />
          <div style={{
            background: "#fff",
            color: "#000",
            padding: "10px 18px",
            borderRadius: 8,
            boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
            fontSize: 12,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
            zIndex: 10,
          }}>
            📍 <span>Headquarters Office</span>
          </div>
        </div>
      </div>
    );
  }

  function RenderContactForm({ style }: { style: SectionStyle }) {
    const bg = style.bg_color || colors.background;
    const text = style.text_color || colors.text_muted;
    const heading = style.heading_color || colors.text;
    const accent = style.accent_color || colors.accent;
    const btnBg = style.btn_primary_bg || colors.primary;
    const btnText = style.btn_primary_text || "#ffffff";

    return (
      <div style={{ padding: "50px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, background: bg }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: heading, margin: 0 }}>
            Get in touch
          </h3>
          <p style={{ fontSize: 13, color: text, lineHeight: 1.6, margin: 0 }}>
            Have questions about our custom sitemaps or branding tokens? Send us a message and our team will get back to you shortly.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: text, marginTop: 12 }}>
            <p style={{ margin: 0 }}>📍 HCMC, Vietnam</p>
            <p style={{ margin: 0 }}>✉️ hello@align.vn</p>
          </div>
        </div>
        <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input type="text" placeholder="Your Name" style={{ padding: 12, borderRadius: 6, border: `1px solid ${colors.text_muted}22`, background: colors.surface, color: colors.text, fontSize: 12 }} />
            <input type="email" placeholder="Email Address" style={{ padding: 12, borderRadius: 6, border: `1px solid ${colors.text_muted}22`, background: colors.surface, color: colors.text, fontSize: 12 }} />
          </div>
          <textarea placeholder="Message Details..." rows={4} style={{ padding: 12, borderRadius: 6, border: `1px solid ${colors.text_muted}22`, background: colors.surface, color: colors.text, fontSize: 12, resize: "none" }} />
          <button style={{ background: btnBg, color: btnText, border: "none", borderRadius: 6, padding: "10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Send Message
          </button>
        </form>
      </div>
    );
  }

  function RenderTestimonials({ style }: { style: SectionStyle }) {
    const bg = style.bg_color || colors.background;
    const text = style.text_color || colors.text_muted;
    const heading = style.heading_color || colors.text;
    const accent = style.accent_color || colors.primary;

    const card = getCardStyle(bg);

    return (
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 32, background: bg }}>
        <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, textAlign: "center", color: heading, margin: 0 }}>
          What clients say
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {copy.testimonials.slice(0, 2).map((t, i) => (
            <div key={i} style={{
              background: card.bg,
              borderRadius: 12,
              border: card.border,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}>
              <div style={{ color: accent, fontSize: 16 }}>★★★★★</div>
              <p style={{ fontSize: 12, color: card.heading, lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>&quot;{t.quote}&quot;</p>
              <p style={{ fontSize: 11, color: card.text, fontWeight: 600, marginTop: 8, margin: 0 }}>{t.author}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function RenderFooter({ conceptIndex }: { conceptIndex: number }) {
    const footerBg = colors.surface;
    const footerText = colors.text_muted;
    const footerHeading = colors.text;
    const borderCol = `${colors.text_muted}15`;

    // Concept 1: Rich Columns Footer
    if (conceptIndex === 1) {
      return (
        <footer style={{ background: footerBg, color: footerText, padding: "50px 40px", display: "flex", flexDirection: "column", gap: 32, borderTop: `1px solid ${borderCol}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 30 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {logo_url ? (
                  <img src={logo_url} alt="Logo" style={{ width: 22, height: 22, objectFit: "contain", borderRadius: 4 }} />
                ) : (
                  <div style={{ width: 22, height: 22, background: colors.primary, color: getContrastColor(colors.primary), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10, borderRadius: 4 }}>
                    {business_name.charAt(0)}
                  </div>
                )}
                <span style={{ fontWeight: 700, color: footerHeading, fontSize: 14 }}>{business_name}</span>
              </div>
              <p style={{ fontSize: 11, lineHeight: 1.5, margin: 0 }}>{tagline}</p>
            </div>
            <div>
              <h5 style={{ color: footerHeading, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 12, margin: 0 }}>Company</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: 11, cursor: "default" }}>
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h5 style={{ color: footerHeading, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 12, margin: 0 }}>Resources</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: 11, cursor: "default" }}>
                <li>Blog Posts</li>
                <li>Guides</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h5 style={{ color: footerHeading, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 12, margin: 0 }}>Legal</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: 11, cursor: "default" }}>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <hr style={{ borderColor: borderCol, margin: 0 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
            <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} {business_name}. All rights reserved.</p>
            <div style={{ display: "flex", gap: 14 }}>
              <span>🐦</span>
              <span>💼</span>
              <span>📸</span>
            </div>
          </div>
        </footer>
      );
    }

    // Concept 0: Clean / Minimal Footer (Default)
    return (
      <footer style={{ background: footerBg, color: footerText, padding: "30px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${borderCol}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {logo_url ? (
            <img src={logo_url} alt="Logo" style={{ width: 20, height: 20, objectFit: "contain", borderRadius: 4 }} />
          ) : (
            <div style={{ width: 20, height: 20, background: colors.primary, color: getContrastColor(colors.primary), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10, borderRadius: 4 }}>
              {business_name.charAt(0)}
            </div>
          )}
          <span style={{ fontSize: 12, fontWeight: 600, color: footerHeading }}>&copy; {new Date().getFullYear()} {business_name}</span>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 11 }}>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </footer>
    );
  }

  function resolveSectionRenderer(sectionName: string) {
    const name = sectionName.toLowerCase();
    if (name.includes("hero")) return RenderHero;
    if (name.includes("shop") || name.includes("product")) return RenderShopProductGrid;
    if (name.includes("pricing")) return RenderPricing;
    if (name.includes("faq")) return RenderFAQ;
    if (name.includes("team")) return RenderTeam;
    if (name.includes("gallery")) return RenderGallery;
    if (name.includes("contact")) return RenderContactForm;
    if (name.includes("testimonial")) return RenderTestimonials;
    if (name.includes("blog") || name.includes("article")) return RenderBlogGrid;
    if (name.includes("service") || name.includes("offer")) return RenderServicesList;
    if (name.includes("map") || name.includes("location")) return RenderMapLocation;
    if (name.includes("stat")) return RenderStats;
    if (name.includes("cta") || name.includes("banner")) return RenderCTABanner;

    // Default fallback
    return RenderFeaturesGrid;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>

      {/* ── Tabs selector (pills) ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "flex-start" }}>
        {sitemap.map((page) => {
          const isActive = page.slug === activeTab;
          return (
            <button
              key={page.slug}
              onClick={() => setActiveTab(page.slug)}
              style={{
                padding: "12px 28px",
                borderRadius: 9999,
                fontFamily: "var(--font-aeonik)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                background: isActive ? colors.accent : "rgba(255,255,255,0.06)",
                border: `1px solid ${isActive ? colors.accent : "rgba(255,255,255,0.12)"}`,
                color: isActive ? getContrastColor(colors.accent) : "rgba(255,255,255,0.70)",
                transition: "all 0.2s ease",
              }}
            >
              {page.label}
            </button>
          );
        })}
      </div>

      {/* ── Browser Frame container ── */}
      <div style={{
        background: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 25px 60px -15px rgba(0,0,0,0.8)",
        width: "100%",
      }}>
        {/* Browser Top Bar */}
        <div style={{
          background: "#1E1E1E",
          height: 44,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
        }}>
          <div style={{ display: "flex", gap: 6, position: "absolute", left: 16 }}>
            {["#ff5f57", "#ffbd2e", "#28c840"].map((c) => (
              <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <div style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: 6,
            fontSize: 11,
            color: "rgba(255,255,255,0.40)",
            padding: "5px 40px",
            margin: "0 auto",
            minWidth: 260,
            textAlign: "center",
            fontFamily: "monospace",
          }}>
            {activeTab === "home" ? `www.${business_name.toLowerCase().replace(/\s+/g, "")}.com` : `www.${business_name.toLowerCase().replace(/\s+/g, "")}.com/${activeTab}`}
          </div>
        </div>

        {/* Mock Page Content */}
        <div style={{
          background: colors.background,
          color: colors.text,
          fontFamily: `'${typography.body.family}', sans-serif`,
          minHeight: 600,
          paddingBottom: 0,
        }}>

          {/* Navigation Bar */}
          <nav style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 40px",
            borderBottom: `1px solid ${colors.surface}44`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {logo_url ? (
                <img src={logo_url} alt="Logo" style={{ width: 28, height: 28, borderRadius: 6, objectFit: "contain", background: "white" }} />
              ) : (
                <div style={{ width: 28, height: 28, borderRadius: 6, background: colors.primary, display: "flex", alignItems: "center", justifyContent: "center", color: getContrastColor(colors.primary), fontWeight: 700, fontSize: 13 }}>
                  {business_name.charAt(0)}
                </div>
              )}
              <span style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 15, color: colors.text }}>
                {business_name}
              </span>
            </div>
            <div style={{ display: "flex", gap: 24, fontSize: 13, fontWeight: 500, color: colors.text_muted }}>
              {sitemap.slice(0, 5).map((p) => (
                <span key={p.slug} style={{ cursor: "pointer", color: p.slug === activeTab ? colors.text : colors.text_muted }}>
                  {p.label}
                </span>
              ))}
            </div>
            <button style={{
              background: colors.primary,
              color: getContrastColor(colors.primary),
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}>
              Contact Us
            </button>
          </nav>

          {/* Render layout sections dynamically based on AI-generated sitemap structure */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {pageSections.map((sec, idx) => {
              const conceptIndex = (idx + activeTab.length) % 3;
              const sectionStyle: SectionStyle = typeof sec === "string" || !sec?.name
                ? {
                    name: (typeof sec === "string" ? sec : "") || "Features Grid",
                    bg_color: colors.background,
                    text_color: colors.text,
                    heading_color: colors.text,
                    accent_color: colors.accent,
                    btn_primary_bg: colors.primary,
                    btn_primary_text: getContrastColor(colors.primary),
                    btn_secondary_border: colors.text_muted,
                    btn_secondary_text: colors.text,
                  }
                : sec;
              const Renderer = resolveSectionRenderer(sectionStyle.name);
              return (
                <div key={idx} style={{ borderBottom: `1px solid ${colors.text_muted}10` }}>
                  <Renderer conceptIndex={conceptIndex} style={sectionStyle} />
                </div>
              );
            })}
          </div>

          {/* Appended Footer Concept Layout */}
          <RenderFooter conceptIndex={(activeTab.length + 1) % 2} />

        </div>
      </div>
    </div>
  );
}
