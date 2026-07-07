"use client";

import { useState } from "react";
import type { AIOutput } from "@/lib/ai/schema";

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

interface Props {
  payload: AIOutput;
}

export function PageConcept({ payload }: Props) {
  const { colors, typography, sitemap, tagline, business_name, logo_url, hero_image_url, moodboard_images } = payload;
  const [activeTab, setActiveTab] = useState(sitemap[0]?.slug || "home");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  const currentTab = sitemap.find((p) => p.slug === activeTab) || sitemap[0];
  const pageSections = currentTab?.sections || ["Hero", "Features Grid", "CTA Banner"];

  // ─── Section Renderers supporting 3 design concepts (Concept 0, 1, 2) ─────

  function RenderHero({ conceptIndex }: { conceptIndex: number }) {
    // Concept 2: Minimal card outline layout
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "60px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center" }}>
          <div style={{
            background: colors.surface,
            border: `1.5px solid ${colors.primary}`,
            borderRadius: 16,
            padding: "40px 30px",
            maxWidth: 720,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.primary }}>
              ✦ {currentTab?.label || "Overview"} Page Concept ✦
            </span>
            <h2 style={{
              fontFamily: `'${typography.heading.family}', sans-serif`,
              fontWeight: 800,
              fontSize: 36,
              color: colors.text,
              margin: 0,
            }}>
              {activeTab === "home" ? tagline : `Welcome to Our ${currentTab?.label}`}
            </h2>
            <p style={{ fontSize: 13, color: colors.text_muted, lineHeight: 1.6, maxWidth: 520, margin: 0 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div style={{ display: "flex", gap: 10, width: "100%", justifyContent: "center", marginTop: 8 }}>
              <input type="email" placeholder="Enter your business email" style={{ padding: "10px 14px", borderRadius: 6, border: `1.5px solid ${colors.text_muted}22`, background: colors.background, color: colors.text, fontSize: 12, minWidth: 220 }} />
              <button style={{ background: colors.primary, color: "#fff", border: "none", borderRadius: 6, padding: "10px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                Notify Me
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
            ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.75)), url(${hero_image_url})`
            : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary || colors.primary})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
          <div style={{
            display: "inline-flex",
            background: `${colors.primary}22`,
            border: `1px solid ${colors.primary}44`,
            borderRadius: 9999,
            padding: "6px 16px",
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
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
            color: "#ffffff",
            maxWidth: 700,
          }}>
            {activeTab === "home" ? tagline : `Welcome to Our ${currentTab?.label}`}
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, maxWidth: 500 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            <button style={{ background: colors.accent, color: getContrastColor(colors.accent), border: "none", borderRadius: 8, padding: "14px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.3)" }}>
              Get Started Now
            </button>
            <button style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, padding: "14px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Explore Services
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
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{
            display: "inline-flex",
            background: `${colors.primary}12`,
            border: `1px solid ${colors.primary}25`,
            borderRadius: 9999,
            padding: "5px 12px",
            width: "fit-content",
            fontSize: 11,
            fontWeight: 600,
            color: colors.primary,
          }}>
            ✦ {currentTab?.label || "Overview"} Page
          </div>
          <h2 style={{
            fontFamily: `'${typography.heading.family}', sans-serif`,
            fontWeight: 700,
            fontSize: 42,
            lineHeight: 1.15,
            color: colors.text,
          }}>
            {activeTab === "home" ? tagline : `Welcome to Our ${currentTab?.label}`}
          </h2>
          <p style={{ fontSize: 13, color: colors.text_muted, lineHeight: 1.6, maxWidth: 440 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button style={{ background: colors.accent, color: getContrastColor(colors.accent), border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Get Started Now
            </button>
            <button style={{ background: "transparent", color: colors.text, border: `1.5px solid ${colors.text_muted}`, borderRadius: 8, padding: "10px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Learn More
            </button>
          </div>
        </div>

        {hero_image_url && (
          <div style={{ width: "100%", height: 300, borderRadius: 12, overflow: "hidden", background: colors.surface, border: `1px solid ${colors.surface}33` }}>
            <img src={hero_image_url} alt="AI Hero Graphic" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
      </div>
    );
  }

  function RenderFeaturesGrid({ conceptIndex }: { conceptIndex: number }) {
    // Concept 2: Offset staggered grid with numbers
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "60px 40px", display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: colors.primary }}>Core Capabilities</p>
              <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: colors.text, marginTop: 6 }}>
                Why clients trust us
              </h3>
            </div>
            <span style={{ fontSize: 12, color: colors.text_muted, maxWidth: 280 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 12 }}>
            {[
              { num: "01", title: "Strategy Audit", desc: "Detailed breakdown of competitor tactics." },
              { num: "02", title: "Visual Direction", desc: "Premium tokens and color system mappings." },
              { num: "03", title: "Full-Scale Launch", desc: "Structured build concepts ready to deploy." }
            ].map((ft, idx) => (
              <div key={idx} style={{
                background: colors.surface,
                borderLeft: `4px solid ${colors.primary}`,
                borderTop: `1px solid ${colors.text_muted}15`,
                borderRight: `1px solid ${colors.text_muted}15`,
                borderBottom: `1px solid ${colors.text_muted}15`,
                borderRadius: "0 10px 10px 0",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: colors.primary }}>{ft.num}</span>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: colors.text, margin: 0 }}>{ft.title}</h4>
                <p style={{ fontSize: 12, color: colors.text_muted, lineHeight: 1.6, margin: 0 }}>{ft.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 1: Alternating rows
    if (conceptIndex === 1) {
      return (
        <div style={{ padding: "60px 40px", display: "flex", flexDirection: "column", gap: 50 }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: colors.primary }}>Our Process</p>
            <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: colors.text, marginTop: 8 }}>How we work</h3>
          </div>
          {[
            { step: "01", title: "Discovery Phase", emoji: "🔍", side: "left" },
            { step: "02", title: "Design Concept", emoji: "📐", side: "right" },
          ].map((item, idx) => {
            const isLeft = item.side === "left";
            return (
              <div key={idx} style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 40,
                alignItems: "center",
                direction: isLeft ? "ltr" : "rtl",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left", direction: "ltr" }}>
                  <span style={{ fontSize: 32, fontWeight: 800, color: `${colors.primary}33` }}>{item.step}</span>
                  <h4 style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>{item.title}</h4>
                  <p style={{ fontSize: 13, color: colors.text_muted, lineHeight: 1.6 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                  </p>
                </div>
                <div style={{
                  height: 180,
                  borderRadius: 12,
                  background: `${colors.primary}10`,
                  border: `1px solid ${colors.text_muted}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 48,
                }}>
                  {item.emoji}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Concept 0: 3-column grid cards (Default)
    return (
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.primary }}>Capabilities</p>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: colors.text, marginTop: 8 }}>
            Core offerings
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { title: "Forensic Accounting", emoji: "📊" },
            { title: "Business Advisory", emoji: "💼" },
            { title: "Finance & Budgeting", emoji: "🛡️" },
          ].map((item, idx) => (
            <div key={idx} style={{
              background: colors.surface,
              borderRadius: 10,
              border: `1px solid ${colors.text_muted}15`,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: `${colors.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {item.emoji}
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{item.title}</h4>
              <p style={{ fontSize: 12, color: colors.text_muted, lineHeight: 1.6 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function RenderStats({ conceptIndex }: { conceptIndex: number }) {
    // Concept 2: Unified card with bold dividers
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "40px" }}>
          <div style={{
            background: colors.surface,
            borderRadius: 14,
            border: `2px solid ${colors.primary}`,
            padding: "30px 40px",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
            gap: 30,
            alignItems: "center",
          }}>
            <div>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: colors.text, margin: 0 }}>Metrics That Matter</h4>
              <p style={{ fontSize: 12, color: colors.text_muted, marginTop: 6, margin: 0 }}>Our accomplishments verified.</p>
            </div>
            {["120+", "15 Min", "100%"].map((val, idx) => (
              <div key={idx} style={{
                textAlign: "center",
                borderLeft: `2.5px solid ${colors.primary}`,
                paddingLeft: 20,
              }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: colors.primary }}>{val}</span>
                <p style={{ fontSize: 10, color: colors.text_muted, marginTop: 4, textTransform: "uppercase", margin: 0 }}>
                  {["Members", "Response Time", "Accuracy"][idx]}
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
          background: colors.surface,
          margin: "24px 40px",
          borderRadius: 12,
          border: `1px solid ${colors.text_muted}15`,
        }}>
          {[
            { value: "99%", label: "Satisfaction" },
            { value: "24h", label: "Response Time" },
            { value: "10k+", label: "Happy Clients" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: `3px solid ${colors.primary}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 16,
                color: colors.text,
              }}>
                {item.value}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: 11, color: colors.text_muted, margin: 0 }}>Verified stats</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Concept 0: standard vertical counters (Default)
    return (
      <div style={{
        background: colors.surface,
        margin: "24px 40px",
        borderRadius: 12,
        border: `1px solid ${colors.text_muted}15`,
        padding: "24px 0",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        textAlign: "center",
      }}>
        {[
          { num: "4.8★", label: "Client Rating" },
          { num: "50+", label: "Projects Delivered" },
          { num: "24/7", label: "Support Avail" },
          { num: "0% Fail", label: "Reliability Rate" },
        ].map((st, i) => (
          <div key={i} style={{ borderRight: i < 3 ? `1px solid ${colors.text_muted}22` : "none" }}>
            <p style={{
              fontFamily: `'${typography.heading.family}', sans-serif`,
              fontWeight: 700,
              fontSize: 28,
              color: colors.primary,
              margin: 0,
            }}>{st.num}</p>
            <p style={{ fontSize: 10, color: colors.text_muted, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{st.label}</p>
          </div>
        ))}
      </div>
    );
  }

  function RenderCTABanner({ conceptIndex }: { conceptIndex: number }) {
    // Concept 2: Glassmorphic alert panel layout
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "40px" }}>
          <div style={{
            background: colors.primary,
            border: `1px solid ${colors.text_muted}15`,
            borderRadius: 16,
            padding: "36px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: colors.accent, textTransform: "uppercase", letterSpacing: "0.05em" }}>Next Step</span>
              <h4 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginTop: 4, margin: 0 }}>Have custom guidelines or brand needs?</h4>
            </div>
            <button style={{
              background: colors.accent,
              color: getContrastColor(colors.accent),
              border: "none",
              borderRadius: 6,
              padding: "12px 24px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}>
              Talk to Designer
            </button>
          </div>
        </div>
      );
    }

    // Concept 1: Inline split CTA
    if (conceptIndex === 1) {
      return (
        <div style={{
          background: colors.surface,
          border: `1px solid ${colors.text_muted}15`,
          margin: "30px 40px",
          borderRadius: 16,
          padding: "40px 50px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 30,
          alignItems: "center",
        }}>
          <div>
            <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 26, color: colors.text, margin: 0 }}>
              Subscribe to newsletter
            </h3>
            <p style={{ fontSize: 13, color: colors.text_muted, marginTop: 8, margin: 0 }}>
              Get weekly branding recommendations and UI design tokens.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <input type="email" placeholder="Your Email Address" style={{ flex: 1, padding: "12px", borderRadius: 8, border: `1px solid ${colors.text_muted}22`, background: colors.background, color: colors.text, fontSize: 13 }} />
            <button style={{ background: colors.accent, color: getContrastColor(colors.accent), border: "none", borderRadius: 8, padding: "0 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              Subscribe
            </button>
          </div>
        </div>
      );
    }

    // Concept 0: centered layout block (Default)
    return (
      <div style={{
        background: colors.primary,
        color: "#ffffff",
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
          margin: 0,
        }}>
          Ready to scale your business?
        </h3>
        <p style={{ fontSize: 13, opacity: 0.85, maxWidth: 460, margin: 0 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
        </p>
        <button style={{
          background: "#ffffff",
          color: colors.primary,
          border: "none",
          borderRadius: 8,
          padding: "12px 28px",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          marginTop: 8,
        }}>
          Book Appointment
        </button>
      </div>
    );
  }

  function RenderPricing({ conceptIndex }: { conceptIndex: number }) {
    // Concept 2: Monthly/Annual switcher cards
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: colors.text }}>Transparent Pricing</h3>
            {/* Toggle Switch switcher */}
            <div style={{ display: "inline-flex", background: `${colors.primary}12`, padding: 4, borderRadius: 8, marginTop: 14 }}>
              <button
                onClick={() => setBillingPeriod("monthly")}
                style={{
                  background: billingPeriod === "monthly" ? colors.primary : "transparent",
                  color: billingPeriod === "monthly" ? "#fff" : colors.text_muted,
                  border: "none", borderRadius: 6, padding: "6px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annual")}
                style={{
                  background: billingPeriod === "annual" ? colors.primary : "transparent",
                  color: billingPeriod === "annual" ? "#fff" : colors.text_muted,
                  border: "none", borderRadius: 6, padding: "6px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                }}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, width: "100%", maxWidth: 640 }}>
            {[
              { name: "Team Tier", monthly: "$89", annual: "$71", items: ["3 Active seats", "Standard assets export"] },
              { name: "Pro Plan", monthly: "$189", annual: "$151", items: ["Unlimited seats", "Priority custom sitemaps"] }
            ].map((p, idx) => (
              <div key={idx} style={{
                background: colors.surface,
                border: `1px solid ${colors.text_muted}15`,
                borderRadius: 12,
                padding: 30,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: 0 }}>{p.name}</h4>
                <p style={{ fontSize: 32, fontWeight: 800, color: colors.text, margin: 0 }}>
                  {billingPeriod === "monthly" ? p.monthly : p.annual}
                  <span style={{ fontSize: 12, color: colors.text_muted, fontWeight: 400 }}>/mo</span>
                </p>
                <hr style={{ borderColor: `${colors.text_muted}10`, margin: "8px 0" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12, color: colors.text_muted }}>
                  {p.items.map((it, i) => <div key={i}>✓ {it}</div>)}
                </div>
                <button style={{ background: colors.primary, color: "#fff", border: "none", borderRadius: 6, padding: "10px", fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%", marginTop: 12 }}>
                  Subscribe
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 1: Horizontal spotlight recommendation plan
    if (conceptIndex === 1) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: colors.primary }}>Recommended Plan</p>
            <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 26, color: colors.text, marginTop: 4 }}>Get the best value</h3>
          </div>
          <div style={{
            background: colors.surface,
            borderRadius: 16,
            border: `2px solid ${colors.primary}`,
            padding: 40,
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 40,
            alignItems: "center",
          }}>
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <h4 style={{ fontSize: 20, fontWeight: 700, color: colors.text, margin: 0 }}>Pro Unlimited Package</h4>
                <span style={{ background: colors.accent, color: getContrastColor(colors.accent), fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 9999 }}>POPULAR</span>
              </div>
              <p style={{ fontSize: 13, color: colors.text_muted, marginTop: 8, lineHeight: 1.6, margin: 0 }}>
                Ideal for teams requiring custom branding layouts and continuous Figma exports.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20, fontSize: 12, color: colors.text_muted }}>
                <div>✓ Custom typography settings</div>
                <div>✓ 5 Parallel image jobs</div>
                <div>✓ Absolute SVG sitemaps</div>
                <div>✓ 24/7 Priority consults</div>
              </div>
            </div>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 44, fontWeight: 800, color: colors.text, margin: 0 }}>$199<span style={{ fontSize: 16, fontWeight: 400, color: colors.text_muted }}>/mo</span></p>
              <button style={{ background: colors.primary, color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%" }}>
                Select Plan
              </button>
              <p style={{ fontSize: 10, color: colors.text_muted, margin: 0 }}>Cancel anytime. No lock-in contracts.</p>
            </div>
          </div>
        </div>
      );
    }

    // Concept 0: 3 columns card grid (Default)
    return (
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: colors.primary }}>Pricing Plans</p>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: colors.text, marginTop: 6 }}>
            Simple plans for everyone
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { name: "Starter", price: "$49", desc: "Basic sitemap & concept layout" },
            { name: "Professional", price: "$149", desc: "Complete high-fidelity style guide" },
            { name: "Enterprise", price: "$299", desc: "Fully tailored branding concept" },
          ].map((plan, idx) => {
            const isFeatured = idx === 1;
            return (
              <div key={idx} style={{
                background: colors.surface,
                borderRadius: 12,
                border: isFeatured ? `2px solid ${colors.primary}` : `1px solid ${colors.text_muted}15`,
                padding: 30,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                transform: isFeatured ? "scale(1.03)" : "none",
              }}>
                <p style={{ fontSize: 13, color: colors.text_muted, fontWeight: 600, margin: 0 }}>{plan.name}</p>
                <p style={{ fontSize: 36, fontWeight: 700, color: colors.text, margin: 0 }}>{plan.price}<span style={{ fontSize: 14, fontWeight: 400, color: colors.text_muted }}>/mo</span></p>
                <p style={{ fontSize: 11, color: colors.text_muted, margin: 0 }}>{plan.desc}</p>
                <hr style={{ borderColor: `${colors.text_muted}15` }} />
                <ul style={{ fontSize: 11, color: colors.text_muted, listStyle: "none", display: "flex", flexDirection: "column", gap: 8, padding: 0, margin: 0 }}>
                  <li>✓ 10 Questionnaire items</li>
                  <li>✓ AI Palette Suggestion</li>
                  <li>✓ Sitemap Tree layout</li>
                  <li>✓ Max 2 Regenerations</li>
                </ul>
                <button style={{
                  background: isFeatured ? colors.accent : "transparent",
                  color: isFeatured ? getContrastColor(colors.accent) : colors.text,
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

  function RenderFAQ({ conceptIndex }: { conceptIndex: number }) {
    // Concept 2: Outlined boxes matrix tabs
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 26, textAlign: "center", color: colors.text }}>
            FAQ Matrix
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { q: "Is the logo generated unique?", a: "Yes, our pipeline creates bespoke vector branding tokens using Google Gemini." },
              { q: "Can I upgrade my subscription?", a: "Absolutely. Select any of the pricing cards above to upgrade directly." },
              { q: "What is your revision policy?", a: "We support up to 2 full regenerations via client sitemap feedback comment logs." },
              { q: "Do you export SVG assets?", a: "All generated visuals and maps can be saved directly in standard formats." },
            ].map((item, idx) => (
              <div key={idx} style={{
                background: colors.surface,
                border: `1.5px solid ${colors.primary}22`,
                borderRadius: 10,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: colors.primary }}>Q: {item.q}</span>
                <p style={{ fontSize: 12, color: colors.text_muted, lineHeight: 1.5, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 1: Two-column grid (Sidebar category left, Questions right)
    if (conceptIndex === 1) {
      return (
        <div style={{ padding: "50px 40px", display: "grid", gridTemplateColumns: "200px 1fr", gap: 30 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: colors.primary }}>Help Center</p>
            <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 24, color: colors.text, marginTop: 4 }}>Common Queries</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "How do sitemaps connect?",
              "What model runs image jobs?",
              "Can I run test random personas?",
            ].map((q, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${colors.text_muted}10`, paddingBottom: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: 0 }}>{q}</p>
                <p style={{ fontSize: 12, color: colors.text_muted, marginTop: 6, margin: 0 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 0: standard Accordions list (Default)
    return (
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24, maxWidth: 640, margin: "0 auto" }}>
        <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 26, textAlign: "center", color: colors.text, margin: 0 }}>
          Frequently Asked Questions
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            "How does the AI generate my website concept?",
            "Can I import this style guide into Figma?",
            "What if I need to change my answers?",
            "How many revisions are allowed?",
          ].map((q, i) => (
            <div key={i} style={{
              background: colors.surface,
              borderRadius: 10,
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              border: `1px solid ${colors.text_muted}10`,
            }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>{q}</span>
              <span style={{ fontSize: 14, color: colors.text_muted }}>+</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function RenderTeam({ conceptIndex }: { conceptIndex: number }) {
    const teamMembers = [
      { name: "John Doe", role: "Design Lead", emoji: "👤" },
      { name: "Jane Smith", role: "AI Engineer", emoji: "👩‍💻" },
      { name: "Cody Fisher", role: "Product Manager", emoji: "👨‍💼" },
      { name: "Alice Cooper", role: "Branding Consultant", emoji: "👩‍💼" }
    ];

    // Concept 2: Staggered wide profile cards (2 columns wide profile rows)
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 32 }}>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, textAlign: "center", color: colors.text }}>
            Our Leaders
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {teamMembers.slice(0, 2).map((m, i) => (
              <div key={i} style={{
                background: colors.surface,
                border: `1px solid ${colors.text_muted}15`,
                borderRadius: 12,
                padding: 24,
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${colors.primary}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  {m.emoji}
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: 0 }}>{m.name}</h4>
                  <p style={{ fontSize: 11, color: colors.primary, fontWeight: 600, marginTop: 2, margin: 0 }}>{m.role}</p>
                  <p style={{ fontSize: 12, color: colors.text_muted, marginTop: 6, margin: 0 }}>Experienced strategist leading brand deployment concept tokens.</p>
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
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, textAlign: "center", color: colors.text }}>
            Expert Advisors
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {teamMembers.slice(0, 3).map((m, i) => (
              <div key={i} style={{
                background: colors.surface,
                border: `2px solid ${colors.primary}`,
                borderRadius: 10,
                padding: "24px 16px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}>
                <div style={{ fontSize: 32 }}>{m.emoji}</div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: colors.text, margin: 0 }}>{m.name}</h4>
                <span style={{ background: `${colors.primary}15`, color: colors.primary, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
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
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 32 }}>
        <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, textAlign: "center", color: colors.text, margin: 0 }}>
          Meet Our Team
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {teamMembers.map((member, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: colors.surface, border: `1px solid ${colors.primary}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {member.emoji}
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: colors.text, margin: 0 }}>{member.name}</p>
              <p style={{ fontSize: 11, color: colors.text_muted, margin: 0 }}>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function RenderGallery({ conceptIndex }: { conceptIndex: number }) {
    const imagesToUse = moodboard_images && moodboard_images.length > 0
      ? moodboard_images.slice(0, 6)
      : Array.from({ length: 6 }).map(() => "");

    // Concept 2: Staggered horizontal scrolling carousel mockup cards layout
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: colors.text, margin: 0 }}>
              Visual Stylescape
            </h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ width: 32, height: 32, borderRadius: "50%", background: colors.surface, border: `1px solid ${colors.text_muted}15`, color: colors.text, fontSize: 12, cursor: "pointer" }}>←</button>
              <button style={{ width: 32, height: 32, borderRadius: "50%", background: colors.surface, border: `1px solid ${colors.text_muted}15`, color: colors.text, fontSize: 12, cursor: "pointer" }}>→</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 10 }}>
            {imagesToUse.map((img, i) => (
              <div key={i} style={{
                width: 220,
                height: 140,
                borderRadius: 10,
                overflow: "hidden",
                background: colors.surface,
                border: `1px solid ${colors.text_muted}15`,
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
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, textAlign: "center", color: colors.text, margin: 0 }}>
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
                  background: colors.surface,
                  border: `1px solid ${colors.text_muted}15`,
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
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
        <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, textAlign: "center", color: colors.text, margin: 0 }}>
          Visual Gallery
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {imagesToUse.map((img, i) => (
            <div key={i} style={{
              height: 160,
              borderRadius: 10,
              overflow: "hidden",
              background: colors.surface,
              border: `1px solid ${colors.text_muted}15`,
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

  function RenderShopProductGrid({ conceptIndex }: { conceptIndex: number }) {
    const products = [
      { name: "Premium Branding Kit", price: "$99.00", cat: "Branding", rating: "5★", emoji: "🎨" },
      { name: "Fullstack Web App Template", price: "$149.00", cat: "Development", rating: "5★", emoji: "⚡" },
      { name: "UX Wireframing Guide", price: "$29.00", cat: "Design Resources", rating: "4★", emoji: "📐" },
      { name: "Custom Icon Pack (SVG)", price: "$19.00", cat: "Design Resources", rating: "4★", emoji: "✨" },
      { name: "Consulting Session (1 Hr)", price: "$120.00", cat: "Consulting", rating: "5★", emoji: "📞" },
      { name: "Tailwind UI Components", price: "$79.00", cat: "Development", rating: "4★", emoji: "📦" },
    ];

    // Concept 2: Single product spotlight detailed view (Spotlight hero display detailed view)
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "50px 40px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 40, alignItems: "center" }}>
          {/* Left: Product image */}
          <div style={{
            height: 280,
            borderRadius: 12,
            background: `${colors.primary}10`,
            border: `1px solid ${colors.text_muted}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 80,
          }}>
            🎨
          </div>
          {/* Right: Product details description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: colors.primary, textTransform: "uppercase" }}>Featured Product</span>
            <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 800, fontSize: 28, color: colors.text, margin: 0 }}>
              Premium Branding Kit
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: colors.primary, fontWeight: 700 }}>★★★★★</span>
              <span style={{ fontSize: 11, color: colors.text_muted }}>(24 client reviews)</span>
            </div>
            <p style={{ fontSize: 32, fontWeight: 800, color: colors.text, margin: 0 }}>$99.00</p>
            <p style={{ fontSize: 13, color: colors.text_muted, lineHeight: 1.6, margin: 0 }}>
              Get our complete corporate visual guidelines guide bundle, including vector templates, palettes presets, and font pairing recommendations.
            </p>
            {/* Mock options */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: colors.text_muted, fontWeight: 600 }}>Color option:</span>
              {["#000", colors.primary, colors.accent].map((col, idx) => (
                <span key={idx} style={{ width: 16, height: 16, borderRadius: "50%", background: col, border: "2px solid #fff", cursor: "pointer" }} />
              ))}
            </div>
            <button style={{
              background: colors.primary,
              color: "#fff",
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
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${colors.text_muted}10`, paddingBottom: 16 }}>
            <div>
              <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 24, color: colors.text, margin: 0 }}>Store Catalog</h3>
              <p style={{ fontSize: 12, color: colors.text_muted, marginTop: 4, margin: 0 }}>Showing all 6 premium mock listings</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {["All Items", "Design", "Dev", "Consulting"].map((btn, i) => (
                <button key={i} style={{
                  background: i === 0 ? colors.primary : "transparent",
                  color: i === 0 ? "#fff" : colors.text_muted,
                  border: `1.5px solid ${i === 0 ? colors.primary : `${colors.text_muted}22`}`,
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}>
                  {btn}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {products.slice(0, 4).map((p, i) => (
              <div key={i} style={{
                background: colors.surface,
                border: `1px solid ${colors.text_muted}15`,
                borderRadius: 12,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}>
                <div style={{ height: 130, background: `${colors.primary}08`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
                  {p.emoji}
                </div>
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: colors.text, margin: 0 }}>{p.name}</h4>
                  <p style={{ fontSize: 12, fontWeight: 800, color: colors.primary, marginTop: "auto", margin: 0 }}>{p.price}</p>
                  <button style={{
                    background: `${colors.primary}12`,
                    color: colors.primary,
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
      <div style={{ padding: "50px 40px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 30 }}>
        {/* Sidebar filters */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, borderRight: `1px solid ${colors.text_muted}15`, paddingRight: 20 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: colors.primary, marginBottom: 12 }}>Categories</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: colors.text_muted }}>
              {["All Items", "Design Resources", "Development", "Branding", "Consulting"].map((cat, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", cursor: "pointer", color: i === 0 ? colors.text : colors.text_muted }}>
                  <span>{cat}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>({[12, 4, 3, 2, 3][i]})</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: colors.primary, marginBottom: 12 }}>Filter by Price</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ height: 4, background: `${colors.primary}20`, borderRadius: 2, position: "relative" }}>
                <div style={{ position: "absolute", left: "20%", right: "30%", height: "100%", background: colors.primary }} />
                <div style={{ position: "absolute", left: "20%", top: -4, width: 12, height: 12, borderRadius: "50%", background: "#fff", border: `2px solid ${colors.primary}` }} />
                <div style={{ position: "absolute", right: "30%", top: -4, width: 12, height: 12, borderRadius: "50%", background: "#fff", border: `2px solid ${colors.primary}` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: colors.text_muted, marginTop: 8 }}>
                <span>Min: $10</span>
                <span>Max: $300</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product listing grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${colors.text_muted}10`, paddingBottom: 12 }}>
            <p style={{ fontSize: 12, color: colors.text_muted, margin: 0 }}>Showing 6 products</p>
            <select style={{ background: colors.surface, color: colors.text, border: `1px solid ${colors.text_muted}22`, borderRadius: 6, padding: "4px 8px", fontSize: 11 }}>
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {products.map((p, i) => (
              <div key={i} style={{
                background: colors.surface,
                border: `1px solid ${colors.text_muted}15`,
                borderRadius: 10,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}>
                <div style={{ height: 120, background: `${colors.primary}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
                  {p.emoji}
                </div>
                <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <span style={{ fontSize: 9, color: colors.primary, fontWeight: 700 }}>{p.cat}</span>
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: colors.text, lineHeight: 1.4, margin: 0 }}>{p.name}</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>{p.price}</span>
                    <span style={{ fontSize: 10, color: colors.text_muted }}>{p.rating}</span>
                  </div>
                  <button style={{
                    background: colors.primary,
                    color: "#fff",
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

  function RenderServicesList({ conceptIndex }: { conceptIndex: number }) {
    const listItems = [
      { title: "Brand Identity Design", desc: "Logo design, color guidelines, typography mappings, and stationery sets.", tag: "Popular", emoji: "🎨" },
      { title: "Custom Website Development", desc: "Responsive full-stack builds using modern server-side tech and headless CMS integrations.", tag: "Featured", emoji: "⚡" },
      { title: "SEO Optimization & Auditing", desc: "Detailed keyword mapping and technical speed indexing optimization.", tag: "SEO", emoji: "📈" },
      { title: "Consulting & Strategy", desc: "Weekly consulting sessions to scale up conversions.", tag: "New", emoji: "📞" }
    ];

    // Concept 2: 2x2 grid offset list layout
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: colors.text, margin: 0 }}>
            Our Specializations
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {listItems.map((item, idx) => (
              <div key={idx} style={{
                background: colors.surface,
                border: `1px solid ${colors.text_muted}12`,
                borderRadius: 12,
                padding: 24,
                display: "flex",
                gap: 16,
              }}>
                <span style={{ fontSize: 28 }}>{item.emoji}</span>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: colors.text, margin: 0 }}>{item.title}</h4>
                  <p style={{ fontSize: 12, color: colors.text_muted, marginTop: 6, lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
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
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 26, color: colors.text, margin: 0 }}>Solutions Overview</h3>
            <span style={{ fontSize: 12, color: colors.primary, fontWeight: 700, cursor: "pointer" }}>View all solutions →</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {listItems.slice(0, 3).map((item, i) => (
              <div key={i} style={{
                background: colors.surface,
                padding: 20,
                borderRadius: 10,
                border: `1.5px solid ${colors.text_muted}10`,
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: colors.primary }}>{item.tag}</span>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: colors.text, marginTop: 8, margin: 0 }}>{item.title}</h4>
                <p style={{ fontSize: 12, color: colors.text_muted, marginTop: 8, lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 0: standard vertical list rows (Default)
    return (
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
        <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: colors.text, margin: 0 }}>
          What We Offer
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {listItems.slice(0, 3).map((srv, idx) => (
            <div key={idx} style={{
              background: colors.surface,
              borderRadius: 10,
              padding: 24,
              border: `1px solid ${colors.text_muted}15`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
            }}>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: 0 }}>{srv.title}</h4>
                <p style={{ fontSize: 12, color: colors.text_muted, marginTop: 6, lineHeight: 1.5, margin: 0 }}>{srv.desc}</p>
              </div>
              <span style={{
                background: `${colors.primary}12`,
                border: `1px solid ${colors.primary}25`,
                borderRadius: 9999,
                padding: "4px 12px",
                fontSize: 10,
                color: colors.primary,
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

  function RenderBlogGrid({ conceptIndex }: { conceptIndex: number }) {
    const posts = [
      { title: "Building landing pages converting in 2026", date: "July 7, 2026", read: "5 min read", emoji: "⚡" },
      { title: "Secrets of custom variables in modern CSS", date: "June 28, 2026", read: "8 min read", emoji: "🎨" },
      { title: "Typography choices dictating brand conversion rate", date: "May 14, 2026", read: "4 min read", emoji: "✍️" },
    ];

    // Concept 2: Text-only minimal list of rows with custom date and link icon
    if (conceptIndex === 2) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 26, color: colors.text, margin: 0 }}>
            Read Publications
          </h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {posts.map((post, idx) => (
              <div key={idx} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 0",
                borderBottom: `1px solid ${colors.text_muted}15`,
              }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: colors.text_muted, width: 80 }}>{post.date}</span>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: colors.text, margin: 0 }}>{post.title}</h4>
                </div>
                <span style={{ fontSize: 12, color: colors.primary, fontWeight: 700, cursor: "pointer" }}>Read Article →</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Concept 1: Left featured large article, right simple rows
    if (conceptIndex === 1) {
      return (
        <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 26, color: colors.text, margin: 0 }}>
            Branding Resources
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 30, marginTop: 12 }}>
            {/* Left featured column */}
            <div style={{
              background: colors.surface,
              border: `1px solid ${colors.text_muted}15`,
              borderRadius: 12,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}>
              <span style={{ fontSize: 10, color: colors.primary, fontWeight: 700 }}>FEATURED ARTICLE</span>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: colors.text, margin: 0 }}>{posts[0].title}</h4>
              <p style={{ fontSize: 13, color: colors.text_muted, lineHeight: 1.6, margin: 0 }}>
                A deep dive analysis exploring design token layouts, responsive constraints, and typography metrics that optimize layout readability.
              </p>
              <button style={{ background: colors.primary, color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", width: "fit-content", fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
                Read Guide
              </button>
            </div>
            {/* Right stack column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {posts.slice(1, 3).map((post, i) => (
                <div key={i} style={{ background: colors.surface, padding: 16, borderRadius: 10, border: `1px solid ${colors.text_muted}10` }}>
                  <span style={{ fontSize: 9, color: colors.text_muted }}>{post.date}</span>
                  <h5 style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginTop: 4, margin: 0 }}>{post.title}</h5>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Concept 0: 3 columns article cards (Default)
    return (
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 32 }}>
        <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, textAlign: "center", color: colors.text, margin: 0 }}>
          Latest Insights &amp; Articles
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {posts.map((post, idx) => (
            <div key={idx} style={{
              background: colors.surface,
              border: `1px solid ${colors.text_muted}15`,
              borderRadius: 12,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{ height: 140, background: `${colors.primary}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
                {post.emoji}
              </div>
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: colors.text_muted }}>
                  <span>{post.date}</span>
                  <span>{post.read}</span>
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: colors.text, lineHeight: 1.4, margin: 0 }}>{post.title}</h4>
                <p style={{ fontSize: 12, color: colors.text_muted, lineHeight: 1.6, marginTop: 4, margin: 0 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function RenderMapLocation() {
    return (
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
        <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 26, color: colors.text, margin: 0 }}>
          Find Us Here
        </h3>
        <div style={{
          height: 240,
          borderRadius: 12,
          background: `${colors.primary}10`,
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
            📍 <span>HCMC Office, District 1</span>
          </div>
        </div>
      </div>
    );
  }

  function RenderContactForm() {
    return (
      <div style={{ padding: "50px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, color: colors.text, margin: 0 }}>
            Get in touch
          </h3>
          <p style={{ fontSize: 13, color: colors.text_muted, lineHeight: 1.6, margin: 0 }}>
            Have questions about the generated concept? Send us a message and our team will get back to you shortly.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: colors.text_muted, marginTop: 12 }}>
            <p style={{ margin: 0 }}>📍 HCMC, Vietnam</p>
            <p style={{ margin: 0 }}>✉️ hello@align.vn</p>
            <p style={{ margin: 0 }}>📞 +84 (0) 123 456 789</p>
          </div>
        </div>
        <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input type="text" placeholder="Your Name" style={{ padding: 12, borderRadius: 6, border: `1px solid ${colors.text_muted}22`, background: colors.surface, color: colors.text, fontSize: 12 }} />
            <input type="email" placeholder="Email Address" style={{ padding: 12, borderRadius: 6, border: `1px solid ${colors.text_muted}22`, background: colors.surface, color: colors.text, fontSize: 12 }} />
          </div>
          <textarea placeholder="Message Details..." rows={4} style={{ padding: 12, borderRadius: 6, border: `1px solid ${colors.text_muted}22`, background: colors.surface, color: colors.text, fontSize: 12, resize: "none" }} />
          <button style={{ background: colors.primary, color: "#fff", border: "none", borderRadius: 6, padding: "10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Send Message
          </button>
        </form>
      </div>
    );
  }

  function RenderTestimonials() {
    return (
      <div style={{ padding: "50px 40px", display: "flex", flexDirection: "column", gap: 32 }}>
        <h3 style={{ fontFamily: `'${typography.heading.family}', sans-serif`, fontWeight: 700, fontSize: 28, textAlign: "center", color: colors.text, margin: 0 }}>
          What clients say
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            { quote: "Align generated a beautiful sitemap and palette that matched our vibe in seconds. Extremely helpful!", author: "Sarah Connor, CEO at Nova" },
            { quote: "The option to regenerate based on design comments made iterating on the style guide incredibly smooth.", author: "Marcus Aurelius, Founder" },
          ].map((t, i) => (
            <div key={i} style={{
              background: colors.surface,
              borderRadius: 12,
              border: `1px solid ${colors.text_muted}15`,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}>
              <div style={{ color: colors.primary, fontSize: 16 }}>★★★★★</div>
              <p style={{ fontSize: 12, color: colors.text, lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>&quot;{t.quote}&quot;</p>
              <p style={{ fontSize: 11, color: colors.text_muted, fontWeight: 600, marginTop: 8, margin: 0 }}>{t.author}</p>
            </div>
          ))}
        </div>
      </div>
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
          paddingBottom: 60,
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
                <div style={{ width: 28, height: 28, borderRadius: 6, background: colors.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>
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
              color: "#fff",
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
            {pageSections.map((secName, idx) => {
              // Calculate concept index based on activeTab name + index to rotate dynamically through 3 options
              const conceptIndex = (idx + activeTab.length) % 3;
              const Renderer = resolveSectionRenderer(secName);
              return (
                <div key={idx} style={{ borderBottom: `1px solid ${colors.text_muted}10` }}>
                  <Renderer conceptIndex={conceptIndex} />
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
