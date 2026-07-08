"use client";

// ─── Individual high-fidelity skeleton section shapes ───────────────────────

function SkeletonBlock({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{ backgroundColor: "rgba(255,255,255,0.07)", ...style }}
    />
  );
}

function SkeletonText({ width = "100%", height = "12px", className = "" }: { width?: string; height?: string; className?: string }) {
  return <SkeletonBlock className={className} style={{ width, height, borderRadius: "6px" }} />;
}

function SkeletonButton({ width = "120px" }: { width?: string }) {
  return <SkeletonBlock style={{ width, height: "40px", borderRadius: "8px", flexShrink: 0 }} />;
}

// HERO
function SectionHero() {
  return (
    <div className="px-6 py-10 flex flex-col gap-5 items-center text-center">
      <SkeletonBlock style={{ width: "80%", height: "52px", borderRadius: "10px" }} />
      <SkeletonBlock style={{ width: "60%", height: "52px", borderRadius: "10px" }} />
      <SkeletonBlock style={{ width: "70%", height: "20px", borderRadius: "6px" }} />
      <SkeletonBlock style={{ width: "55%", height: "20px", borderRadius: "6px" }} />
      <div className="flex gap-3 mt-2">
        <SkeletonButton width="140px" />
        <SkeletonButton width="110px" />
      </div>
      <SkeletonBlock style={{ width: "100%", height: "220px", borderRadius: "14px", marginTop: "8px" }} />
    </div>
  );
}

// FEATURES GRID
function SectionFeaturesGrid() {
  return (
    <div className="px-6 py-8 flex flex-col gap-5">
      <div className="flex flex-col gap-2 items-center">
        <SkeletonText width="40%" />
        <SkeletonText width="60%" height="14px" />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-3 p-4 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
            <SkeletonBlock style={{ width: "36px", height: "36px", borderRadius: "8px" }} />
            <SkeletonText width="70%" height="13px" />
            <SkeletonText width="100%" />
            <SkeletonText width="90%" />
          </div>
        ))}
      </div>
    </div>
  );
}

// PRICING
function SectionPricing() {
  return (
    <div className="px-6 py-8 flex flex-col gap-5">
      <div className="flex flex-col gap-2 items-center">
        <SkeletonText width="30%" height="14px" />
        <SkeletonText width="55%" height="18px" />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`flex flex-col gap-3 p-5 rounded-xl ${i === 1 ? "ring-1 ring-white/20" : ""}`}
               style={{ backgroundColor: i === 1 ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)" }}>
            <SkeletonText width="50%" height="11px" />
            <SkeletonText width="60%" height="22px" />
            <hr style={{ borderColor: "rgba(255,255,255,0.08)", margin: "4px 0" }} />
            {[0, 1, 2, 3].map((j) => (
              <div key={j} className="flex items-center gap-2">
                <SkeletonBlock style={{ width: "14px", height: "14px", borderRadius: "50%" }} />
                <SkeletonText width="75%" height="11px" />
              </div>
            ))}
            <SkeletonButton width="100%" />
          </div>
        ))}
      </div>
    </div>
  );
}

// FAQ
function SectionFAQ() {
  return (
    <div className="px-6 py-8 flex flex-col gap-4">
      <SkeletonText width="35%" height="16px" className="mx-auto" />
      <div className="flex flex-col gap-3 mt-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
            <SkeletonText width="70%" height="13px" />
            <SkeletonBlock style={{ width: "20px", height: "20px", borderRadius: "4px", flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// TESTIMONIALS
function SectionTestimonials() {
  return (
    <div className="px-6 py-8 flex flex-col gap-5">
      <SkeletonText width="40%" height="14px" className="mx-auto" />
      <div className="grid grid-cols-2 gap-4 mt-2">
        {[0, 1].map((i) => (
          <div key={i} className="p-5 rounded-xl flex flex-col gap-3" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
            <SkeletonText width="100%" />
            <SkeletonText width="90%" />
            <SkeletonText width="75%" />
            <div className="flex items-center gap-3 mt-2">
              <SkeletonBlock style={{ width: "36px", height: "36px", borderRadius: "50%" }} />
              <div className="flex flex-col gap-1.5">
                <SkeletonText width="90px" height="11px" />
                <SkeletonText width="70px" height="10px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// CTA BANNER
function SectionCTABanner() {
  return (
    <div className="px-6 py-6">
      <div className="rounded-2xl p-8 flex items-center justify-between gap-6" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex flex-col gap-2 flex-1">
          <SkeletonText width="65%" height="18px" />
          <SkeletonText width="80%" />
        </div>
        <SkeletonButton width="140px" />
      </div>
    </div>
  );
}

// GALLERY
function SectionGallery() {
  return (
    <div className="px-6 py-8 flex flex-col gap-5">
      <SkeletonText width="35%" height="14px" className="mx-auto" />
      <div className="grid grid-cols-3 gap-3 mt-2">
        {[180, 140, 160, 150, 180, 130].map((h, i) => (
          <SkeletonBlock key={i} style={{ height: `${h}px`, borderRadius: "10px" }} />
        ))}
      </div>
    </div>
  );
}

// TEAM
function SectionTeam() {
  return (
    <div className="px-6 py-8 flex flex-col gap-5">
      <SkeletonText width="30%" height="14px" className="mx-auto" />
      <div className="grid grid-cols-4 gap-4 mt-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-3 items-center">
            <SkeletonBlock style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
            <SkeletonText width="80%" height="12px" />
            <SkeletonText width="60%" height="10px" />
          </div>
        ))}
      </div>
    </div>
  );
}

// STATS
function SectionStats() {
  return (
    <div className="px-6 py-8">
      <div className="grid grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
            <SkeletonText width="60%" height="28px" />
            <SkeletonText width="80%" height="11px" />
          </div>
        ))}
      </div>
    </div>
  );
}

// CONTACT FORM
function SectionContactForm() {
  return (
    <div className="px-6 py-8 flex flex-col gap-5">
      <SkeletonText width="30%" height="16px" />
      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <SkeletonText width="50%" height="10px" />
            <SkeletonBlock style={{ height: "40px", borderRadius: "8px" }} />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <SkeletonText width="30%" height="10px" />
        <SkeletonBlock style={{ height: "80px", borderRadius: "8px" }} />
      </div>
      <SkeletonButton width="150px" />
    </div>
  );
}

// HEADER / NAV
function SectionHeader() {
  return (
    <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <SkeletonBlock style={{ width: "90px", height: "28px", borderRadius: "8px" }} />
      <div className="flex gap-4">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonText key={i} width="60px" height="12px" />
        ))}
      </div>
      <SkeletonButton width="100px" />
    </div>
  );
}

// FOOTER
function SectionFooter() {
  return (
    <div className="px-6 py-8 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="grid grid-cols-3 gap-6 mb-6">
        {[0, 1, 2].map((col) => (
          <div key={col} className="flex flex-col gap-3">
            <SkeletonText width="60%" height="12px" />
            {[0, 1, 2, 3].map((row) => (
              <SkeletonText key={row} width={`${55 + row * 10}%`} height="10px" />
            ))}
          </div>
        ))}
      </div>
      <hr style={{ borderColor: "rgba(255,255,255,0.06)" }} />
      <div className="flex justify-between mt-4">
        <SkeletonText width="30%" height="10px" />
        <SkeletonText width="20%" height="10px" />
      </div>
    </div>
  );
}

// BLOG GRID
function SectionBlogGrid() {
  return (
    <div className="px-6 py-8 flex flex-col gap-5">
      <SkeletonText width="25%" height="14px" />
      <div className="grid grid-cols-3 gap-4 mt-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-3 rounded-xl overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
            <SkeletonBlock style={{ height: "130px", borderRadius: "0" }} />
            <div className="p-3 flex flex-col gap-2">
              <SkeletonText width="50%" height="10px" />
              <SkeletonText width="85%" height="13px" />
              <SkeletonText width="90%" />
              <SkeletonText width="70%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// SERVICES LIST
function SectionServicesList() {
  return (
    <div className="px-6 py-8 flex flex-col gap-4">
      <SkeletonText width="30%" height="14px" />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 items-start p-4 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
          <SkeletonBlock style={{ width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0 }} />
          <div className="flex flex-col gap-2 flex-1">
            <SkeletonText width="40%" height="13px" />
            <SkeletonText width="85%" />
            <SkeletonText width="70%" />
          </div>
        </div>
      ))}
    </div>
  );
}

// MAP / LOCATION
function SectionMapLocation() {
  return (
    <div className="px-6 py-8 flex flex-col gap-4">
      <SkeletonText width="25%" height="14px" />
      <SkeletonBlock style={{ height: "180px", borderRadius: "14px" }} />
      <div className="flex gap-3 items-start mt-1">
        <SkeletonBlock style={{ width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0 }} />
        <div className="flex flex-col gap-2 flex-1">
          <SkeletonText width="55%" height="13px" />
          <SkeletonText width="40%" />
        </div>
      </div>
    </div>
  );
}

// ─── Section registry ─────────────────────────────────────────────────────────

const SECTION_MAP: Record<string, React.ComponentType> = {
  "Hero":           SectionHero,
  "Features Grid":  SectionFeaturesGrid,
  "Pricing":        SectionPricing,
  "FAQ":            SectionFAQ,
  "Testimonials":   SectionTestimonials,
  "CTA Banner":     SectionCTABanner,
  "Gallery":        SectionGallery,
  "Team":           SectionTeam,
  "Stats":          SectionStats,
  "Contact Form":   SectionContactForm,
  "Header / Nav":   SectionHeader,
  "Footer":         SectionFooter,
  "Blog Grid":      SectionBlogGrid,
  "Services List":  SectionServicesList,
  "Map / Location": SectionMapLocation,
};

function resolveSectionComponent(sectionName: string): React.ComponentType {
  // Exact match
  if (SECTION_MAP[sectionName]) return SECTION_MAP[sectionName];
  // Fuzzy match
  const key = Object.keys(SECTION_MAP).find((k) =>
    k.toLowerCase().includes(sectionName.toLowerCase()) ||
    sectionName.toLowerCase().includes(k.toLowerCase().split(" ")[0])
  );
  return key ? SECTION_MAP[key] : SectionFeaturesGrid;
}

// ─── Public component ─────────────────────────────────────────────────────────

import type { AIOutput } from "@/lib/ai/schema";

interface Props {
  sitemap: AIOutput["sitemap"];
  colors: AIOutput["colors"];
}

export function SkeletonLayout({ sitemap, colors }: Props) {
  return (
    <div className="space-y-8">
      {sitemap.map((page) => (
        <div key={page.slug} className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: colors.surface }}>
          {/* Page label */}
          <div className="flex items-center gap-3 px-6 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(0,0,0,0.2)" }}>
            <div className="flex gap-1.5">
              {["#ff5f57", "#ffbd2e", "#28c840"].map((c) => (
                <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span className="text-xs font-mono" style={{ color: colors.text_muted }}>
              /{page.slug === "home" ? "" : page.slug}
            </span>
            <span className="text-xs font-medium ml-auto px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.accent + "22", color: colors.accent }}>
              {page.label}
            </span>
          </div>

          {/* Sections */}
          <div style={{ backgroundColor: colors.background }}>
            {page.sections.map((section, idx) => {
              const SectionComponent = resolveSectionComponent(section.name);
              return (
                <div key={idx} className="relative group">
                  {/* Section label */}
                  <div
                    className="absolute top-3 left-6 z-10 text-xs font-mono px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: colors.accent, color: "#fff" }}
                  >
                    {section.name}
                  </div>
                  <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                    <SectionComponent />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
