import type { QuizPayload } from "./schema";

const WEBSITE_TYPE_MAP: Record<string, string> = {
  info_brochure: "a multi-page informational/brochure website",
  landing_page:  "a single focused landing page with one clear call-to-action",
  ecommerce:     "an e-commerce store with product listings and checkout",
  portfolio:     "a portfolio/showcase website highlighting work and projects",
};

const WEBSITE_GOAL_MAP: Record<string, string> = {
  get_leads:        "generate leads and enquiries (contact forms, calls, quotes)",
  sell_products:    "sell products online with a store and checkout",
  brand_story:      "tell the brand story and build credibility/presence",
  get_bookings:     "get bookings, appointments, and reservations",
  showcase_work:    "showcase work and past projects",
  build_credibility:"build credibility and trust with the target audience",
};

const TYPOGRAPHY_MAP: Record<string, string> = {
  clean_modern:          "Clean and modern — geometric sans-serifs (e.g., Inter, Plus Jakarta Sans, DM Sans)",
  elegant_editorial:     "Elegant and editorial — high-contrast serifs with light sans (e.g., Playfair Display + Lato)",
  technical_bold:        "Technical and bold — monospaced or industrial typefaces (e.g., Space Grotesk, IBM Plex Mono)",
  friendly_rounded:      "Friendly and rounded — warm rounded fonts (e.g., Nunito, Poppins, Quicksand)",
  professional_corporate: "Professional and corporate — authoritative and clean (e.g., Roboto, Source Sans, Montserrat)",
  ai_suggest:            "AI-suggested — choose the most contextually appropriate pairing based on the business and style",
};

// ─── STEP 1: Wireframing Prompts ──────────────────────────────────────────────

export function buildWireframeSystemPrompt(): string {
  return `You are a Senior Information Architect and UX Planner. Your job is to draft a sitemap and structural section flow for all pages of a website concept.

You must return a single valid JSON object containing only a "sitemap" array. Do not include markdown formatting or explanations.

CRITICAL STRUCTURAL CONSTRAINTS:
1. Diversity of Layout: You must ensure a high-fidelity layout. No two adjacent sections on any page should be of the same type.
2. For example, never place "Features Grid" directly next to "Features Grid" or "Services List". Insert a divider section like "Stats", "CTA Banner", or "Testimonials" in between to create a balanced rhythm.
3. Available section types:
   - "Hero"
   - "Features Grid"
   - "Pricing"
   - "FAQ"
   - "Testimonials"
   - "CTA Banner"
   - "Gallery"
   - "Team"
   - "Stats"
   - "Contact Form"
   - "Services List"
   - "Map / Location"
   - "Blog Grid"
   - "Shop Product Grid"`;
}

export function buildWireframeUserPrompt(quiz: QuizPayload): string {
  const goals = quiz.website_goal.map((g) => WEBSITE_GOAL_MAP[g]).join(", ");
  const websiteType = WEBSITE_TYPE_MAP[quiz.website_type];
  const commentsSection = quiz.comments && quiz.comments.length > 0
    ? `\n## REVISION REQUEST
This is a revision request. Please refine the section list and layout flow based on these comments:
${quiz.comments.map((c, i) => `[Revision ${i + 1}]: ${c}`).join("\n")}
`
    : "";

  return `Create a sitemap and section wireframe layout flow for:
- Business: ${quiz.business_name}
- Offerings: ${quiz.products_services}
- Website Type: ${websiteType}
- Goals: ${goals}
- Target customer: ${quiz.target_customers || "General public"}
- Suggested pages: ${quiz.sitemap.page_count} pages description: "${quiz.sitemap.pages_description}"
${commentsSection}
Return ONLY this JSON structure:
{
  "sitemap": [
    {
      "slug": "home",
      "label": "Home",
      "sections": ["Hero", "Stats", "Features Grid", "CTA Banner"]
    }
  ]
}`;
}

// ─── STEP 2: Branding & Design Expansion Prompts ─────────────────────────────

export function buildExpansionSystemPrompt(): string {
  return `You are an expert Brand Strategist and UI/UX Designer. Your task is to take a pre-defined website wireframe structure and generate the complete design system token concept (colors, typography, tagline, vibe summary, and icons).

You must return a single valid JSON object that strictly conforms to the requested schema. Do not add any text or code fences outside the JSON.`;
}

export function buildExpansionUserPrompt(quiz: QuizPayload, wireframeJson: string): string {
  const typographyStyle = TYPOGRAPHY_MAP[quiz.typography_style];
  const colorInstruction =
    quiz.color_direction.mode === "existing"
      ? `Use the client's existing brand colors as the foundation:
  - Primary: ${quiz.color_direction.colors.primary}
  - Secondary: ${quiz.color_direction.colors.secondary}
  - Accent: ${quiz.color_direction.colors.accent}
  Derive the background, surface, text, and text_muted colors to complement these.`
      : "Suggest a fresh, professional color palette that fits the business personality and style tags.";

  return `Complete the website design concept for "${quiz.business_name}" based on the following pre-determined sitemap wireframe structure:

${wireframeJson}

## Intended Brand Identity
- **Business Description**: ${quiz.products_services}
- **Style Tags**: ${quiz.style_tags.join(", ")}
- **Typography Style Preference**: ${typographyStyle}
- **Color Direction**: ${colorInstruction}

## Required JSON Output
Return ONLY this JSON structure (no markdown, no text outside the JSON):
{
  "business_name": "${quiz.business_name}",
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "text": "#hex",
    "text_muted": "#hex"
  },
  "typography": {
    "heading": {
      "family": "Font Name",
      "weight": "700",
      "google_font_url": "https://fonts.googleapis.com/css2?family=..."
    },
    "body": {
      "family": "Font Name",
      "weight": "400",
      "google_font_url": "https://fonts.googleapis.com/css2?family=..."
    }
  },
  "icon_set": [
    { "label": "About", "symbol": "🏛️" },
    { "label": "Services", "symbol": "⚡" },
    { "label": "Contact", "symbol": "✉️" },
    { "label": "Blog", "symbol": "📝" },
    { "label": "Portfolio", "symbol": "🖼️" },
    { "label": "Pricing", "symbol": "💰" },
    { "label": "Team", "symbol": "👥" },
    { "label": "FAQ", "symbol": "❓" },
    { "label": "Booking", "symbol": "📅" }
  ],
  "sitemap": <Insert the exact "sitemap" array from the wireframe input above>,
  "tagline": "A punchy one-liner for ${quiz.business_name}",
  "vibe_summary": "2-3 sentences describing the design direction and why these choices fit the brand."
}

IMPORTANT: The icon_set must contain 6-12 items. Each item must have a "label" (short, 1-2 words) and a "symbol" (a single relevant Unicode emoji). Choose icons relevant to the specific business.`;
}
