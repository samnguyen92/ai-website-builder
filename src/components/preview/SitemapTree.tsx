"use client";

import type { AIOutput } from "@/lib/ai/schema";

interface Props {
  sitemap: AIOutput["sitemap"];
  primaryColor: string;
}

export function SitemapTree({ sitemap, primaryColor }: Props) {
  // Homepage
  const homePage = sitemap.find((p) => p.slug === "home") || sitemap[0];
  // Sub-pages (max 4 to fit clean)
  const childPages = sitemap.filter((p) => p.slug !== homePage?.slug).slice(0, 4);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      padding: "20px 0",
      gap: 30,
      fontFamily: "var(--font-aeonik)",
      position: "relative",
    }}>

      {/* Root Node (Homepage) */}
      <div style={{
        background: "#1E1E1E",
        border: `2px solid ${primaryColor}`,
        borderRadius: 12,
        padding: "16px 32px",
        color: "#fff",
        fontSize: 15,
        fontWeight: 600,
        textAlign: "center",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        zIndex: 10,
        position: "relative",
      }}>
        🏠 {homePage?.label || "Homepage"}
        <span style={{ display: "block", fontSize: 10, color: "rgba(255,255,255,0.40)", marginTop: 2 }}>/home</span>
      </div>

      {/* ─── SVG Connector Lines ─── */}
      {childPages.length > 0 && (
        <svg style={{
          position: "absolute",
          top: 66, // position perfectly under the root node
          left: 0,
          width: "100%",
          height: 50,
          pointerEvents: "none",
          zIndex: 1,
        }}>
          {/* Main vertical line dropping from home */}
          <line x1="50%" y1="0" x2="50%" y2="25" stroke="rgba(255,255,255,0.20)" strokeWidth="2" />
          
          {/* Horizontal line spreading to kids */}
          {/* We connect from the first child center to the last child center */}
          <path
            d={`M calc(100% / ${childPages.length * 2}) 25 L calc(100% - 100% / ${childPages.length * 2}) 25`}
            stroke="rgba(255,255,255,0.20)"
            strokeWidth="2"
            fill="none"
          />

          {/* Vertical drops for each child */}
          {childPages.map((_, idx) => {
            const fraction = (idx * 2 + 1) / (childPages.length * 2) * 100;
            return (
              <line
                key={idx}
                x1={`${fraction}%`}
                y1="25"
                x2={`${fraction}%`}
                y2="50"
                stroke="rgba(255,255,255,0.20)"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      )}

      {/* Children Nodes Row */}
      {childPages.length > 0 && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          gap: 20,
          marginTop: 20, // space below connector drops
          zIndex: 5,
        }}>
          {childPages.map((page, idx) => {
            // First page (usually Services) branches down to sub-services
            const isServicesPage = idx === 0;

            return (
              <div key={page.slug} style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}>
                {/* Node Box */}
                <div style={{
                  background: "#1E1E1E",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 10,
                  padding: "12px 20px",
                  color: "#fff",
                  fontSize: 13,
                  textAlign: "center",
                  width: "100%",
                  maxWidth: 180,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}>
                  <p style={{ fontWeight: 600 }}>{page.label}</p>
                  <p style={{ fontSize: 9, color: "rgba(255,255,255,0.40)", marginTop: 2 }}>/{page.slug}</p>
                </div>

                {/* Optional Sub-Services branching inside Services column */}
                {isServicesPage && (
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    position: "relative",
                  }}>
                    {/* SVG Connector for Subtree */}
                    <svg style={{ width: "100%", height: 30, pointerEvents: "none" }}>
                      <line x1="50%" y1="0" x2="50%" y2="15" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                      <line x1="25%" y1="15" x2="75%" y2="15" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                      <line x1="25%" y1="15" x2="25%" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                      <line x1="75%" y1="15" x2="75%" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                    </svg>

                    <div style={{ display: "flex", width: "100%", gap: 10 }}>
                      <div style={{
                        flex: 1,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 8,
                        padding: "8px 10px",
                        color: "rgba(255,255,255,0.7)",
                        fontSize: 11,
                        textAlign: "center",
                      }}>
                        Forensic Accounting
                      </div>
                      <div style={{
                        flex: 1,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 8,
                        padding: "8px 10px",
                        color: "rgba(255,255,255,0.7)",
                        fontSize: 11,
                        textAlign: "center",
                      }}>
                        Business Advisory
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
