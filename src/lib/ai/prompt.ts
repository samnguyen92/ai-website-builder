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
  build_credibility: "build credibility and trust with the target audience",
};

const TYPOGRAPHY_MAP: Record<string, string> = {
  clean_modern:          "Clean and modern — geometric sans-serifs (e.g., Inter, Plus Jakarta Sans, DM Sans)",
  elegant_editorial:     "Elegant and editorial — high-contrast serifs with light sans (e.g., Playfair Display + Lato)",
  technical_bold:        "Technical and bold — monospaced or industrial typefaces (e.g., Space Grotesk, IBM Plex Mono)",
  friendly_rounded:      "Friendly and rounded — warm rounded fonts (e.g., Nunito, Poppins, Quicksand)",
  professional_corporate: "Professional and corporate — authoritative and clean (e.g., Roboto, Source Sans, Montserrat)",
  ai_suggest:            "AI-suggested — choose the most contextually appropriate pairing based on the business and style",
};

// ═════════════════════════════════════════════════════════════════════════════
// AGENT 1: Wireframer Agent
// ═════════════════════════════════════════════════════════════════════════════

export function buildWireframeSystemPrompt(): string {
  return `You are a Senior Information Architect and UX Planner. Your job is to draft a sitemap and structural section flow for all pages of a website concept.

You must return a single valid JSON object containing only a "sitemap" array where each page contains its "slug", "label", and a simple string list of "sections". Do not include markdown formatting or explanations.

CRITICAL STRUCTURAL CONSTRAINTS:
1. Diversity of Layout: You must ensure a high-fidelity layout. No two adjacent sections on any page should be of the same type.
2. For example, never place two similar card grids next to each other. Insert a divider section like a Stats count, a CTA Banner, or a Testimonial slider in between to create a balanced rhythm.
3. Creative Section Selection: Do not restrict yourself to generic section names. Design custom, specific section names tailored to the business offerings (e.g. "Photography Portfolio Gallery", "Pricing Memberships", "Classes Catalog", "Services List", "Team Bios", "FAQ Outlines", "Contact Form", "Hero Banner", "Stats Counters", "CTA Banner"). Every page should end with a footer section or map where appropriate.`;
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
Return ONLY this JSON structure (no markdown wrapper, no other text):
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

// ═════════════════════════════════════════════════════════════════════════════
// AGENT 2: Stylist Agent
// ═════════════════════════════════════════════════════════════════════════════

export function buildExpansionSystemPrompt(): string {
  return `You are an expert Brand Stylist. Your task is to take a website wireframe sitemap structure and generate the color palette (including explicit contrast-compliant button state defaults and hovers), typography settings, tagline, vibe summary, and corporate icon sets.

You must return a single valid JSON object. Do not add any code fences or markdown wrappers.`;
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
      : "Suggest a fresh, professional color palette (primary, secondary, accent, background, surface, text, text_muted) that fits the business personality and style tags.";

  return `Complete the brand styling system concept for "${quiz.business_name}" based on the following pre-determined sitemap wireframe structure:

${wireframeJson}

## Intended Brand Identity
- **Business Description**: ${quiz.products_services}
- **Style Tags**: ${quiz.style_tags.join(", ")}
- **Typography Style Preference**: ${typographyStyle}
- **Color Direction**: ${colorInstruction}

## Required Output Format
Return ONLY a valid JSON object matching the following structure (no markdown wrappers, no text outside JSON):
{
  "business_name": "${quiz.business_name}",
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "text": "#hex",
    "text_muted": "#hex",
    "btn_primary_bg": "#hex",
    "btn_primary_text": "#hex",
    "btn_hover_primary_bg": "#hex",
    "btn_hover_primary_text": "#hex",
    "btn_secondary_border": "#hex",
    "btn_secondary_text": "#hex",
    "btn_hover_secondary_bg": "#hex",
    "btn_hover_secondary_text": "#hex",
    "btn_tertiary_text": "#hex"
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
  "icon_style": "duotone-colored",
  "icon_set": [
    { "label": "About", "symbol": "🏛️" },
    { "label": "Services", "symbol": "⚡" },
    { "label": "Contact", "symbol": "✉️" },
    { "label": "Blog", "symbol": "📝" },
    { "label": "Pricing", "symbol": "💰" },
    { "label": "Team", "symbol": "👥" },
    { "label": "FAQ", "symbol": "❓" },
    { "label": "Booking", "symbol": "📅" }
  ],
  "tagline": "A punchy brand one-liner",
  "vibe_summary": "Description of why these colors/fonts represent the brand."
}

IMPORTANT: Select an "icon_style" from one of: "duotone-colored", "minimal-line", "solid-bold", or "glassmorphic" based on the aesthetic direction.`;
}

// ═════════════════════════════════════════════════════════════════════════════
// AGENT 3: Section Styler & Demo Copy Agent
// ═════════════════════════════════════════════════════════════════════════════

export function buildSectionStylerSystemPrompt(): string {
  return `You are a Senior UI Engineer and Website Copywriter. Your task is to review the sitemap structure, then output:
1. "sitemap": An updated sitemap array where each section in a page has an explicit, contrast-safe color scheme (bg_color, text_color, heading_color, accent_color, and button colors) selected contextually.
2. "demo_content": Highly customized real marketing copy, headlines, features, pricing items, FAQs, and testimonials specific to this business (no lorem-ipsum!).

CRITICAL STYLING CONTRAST RULES:
1. Readability: For every section, the text_color and heading_color MUST have high contrast against the bg_color. Never use dark text on dark backgrounds, or white text on white backgrounds.
2. Dark Sections: If a section has a dark bg_color (like primary/dark colors), then heading_color and text_color MUST be light (like white #ffffff or light gray).
3. Buttons: btn_primary_text must have high contrast against btn_primary_bg. btn_secondary_text must contrast against bg_color.
4. Card Container Legibility: Inside the page sections, card-like containers will be rendered with translucent dark surfaces (for dark backgrounds) or solid light surfaces (for light backgrounds). Therefore:
   - If bg_color is dark, text_color and heading_color must be light/white so they show up clearly.
   - If bg_color is light, text_color and heading_color must be dark/charcoal so they show up clearly.`;
}

export function buildSectionStylerUserPrompt(quiz: QuizPayload, wireframeJson: string): string {
  return `Write the dynamic copy and generate contrast-safe section color schemes for "${quiz.business_name}".

## Wireframe Structure
${wireframeJson}

## Required JSON Output
Return ONLY this JSON object structure (no markdown wrappers, no text outside JSON):
{
  "sitemap": [
    {
      "slug": "home",
      "label": "Home",
      "sections": [
        {
          "name": "Hero",
          "bg_color": "#hex",
          "text_color": "#hex",
          "heading_color": "#hex",
          "accent_color": "#hex",
          "btn_primary_bg": "#hex",
          "btn_primary_text": "#hex",
          "btn_secondary_border": "#hex",
          "btn_secondary_text": "#hex"
        }
      ]
    }
  ],
  "demo_content": {
    "hero": {
      "title": "A headline tailored to the business niche",
      "subtitle": "A subheadline description explaining value prop",
      "cta_primary": "Get Started",
      "cta_secondary": "Explore more"
    },
    "features": [
      { "title": "Feature 1 Title", "desc": "Feature description text", "num": "01" },
      { "title": "Feature 2 Title", "desc": "Feature description text", "num": "02" },
      { "title": "Feature 3 Title", "desc": "Feature description text", "num": "03" }
    ],
    "stats": [
      { "value": "e.g. 500+", "label": "e.g. Happy Clients" },
      { "value": "e.g. 10+", "label": "e.g. Years Experience" },
      { "value": "e.g. 99%", "label": "e.g. Success Rate" }
    ],
    "cta": {
      "title": "A compelling call-to-action title",
      "subtitle": "A short sub-line of text urging conversion",
      "button_text": "Join Now"
    },
    "pricing": [
      { "name": "Basic", "price": "$19", "desc": "Best for starters", "items": ["Item A", "Item B"] },
      { "name": "Pro", "price": "$49", "desc": "Best value", "items": ["Item A", "Item B", "Item C"] }
    ],
    "faq": [
      { "q": "Common Question 1?", "a": "Bespoke answer matching this company" },
      { "q": "Common Question 2?", "a": "Bespoke answer matching this company" }
    ],
    "team": [
      { "name": "First Last", "role": "Title", "bio": "Brief role bio description", "emoji": "👤" },
      { "name": "First Last", "role": "Title", "bio": "Brief role bio description", "emoji": "👩‍💻" }
    ],
    "services": [
      { "title": "Service 1", "desc": "Detailed service description", "tag": "Popular", "emoji": "🎨" },
      { "title": "Service 2", "desc": "Detailed service description", "tag": "Featured", "emoji": "⚡" }
    ],
    "products": [
      { "name": "Product 1", "price": "$49.00", "cat": "Category", "rating": "5★", "emoji": "📦" },
      { "name": "Product 2", "price": "$99.00", "cat": "Category", "rating": "4★", "emoji": "🛠️" }
    ],
    "testimonials": [
      { "quote": "Client feedback quote specific to this domain.", "author": "Author Name, Job" },
      { "quote": "Client feedback quote specific to this domain.", "author": "Author Name, Job" }
    ],
    "blog": [
      { "title": "Useful industry article headline", "date": "July 8, 2026", "read": "5 min read", "emoji": "⚡" },
      { "title": "Another article headline", "date": "June 30, 2026", "read": "7 min read", "emoji": "💡" }
    ]
  }
}`;
}

// ═════════════════════════════════════════════════════════════════════════════
// AGENT 4: Section Coder Agent
// ═════════════════════════════════════════════════════════════════════════════

export function buildSectionCoderSystemPrompt(): string {
  return `You are a Senior UI/UX Engineer and Expert Web Developer. Your task is to generate customized, responsive, inline-styled HTML blocks for a specific page of a website concept.

You must return a single JSON object where keys represent the section indices (e.g. "0", "1", "2") and values are the generated HTML/CSS markup string. Do not include markdown code blocks or explanations outside of the JSON.

CRITICAL MARKUP DESIGN RULES:
1. Dynamic Styling: The design system is set by the colors and fonts parameters. You MUST write custom inline styles (e.g., using flexbox, CSS grid, custom padding/margins, borders, gradients, and font-family declarations) to design the markup.
2. Section Vibe: Design beautiful, custom, non-generic layouts. Make cards with borders, hover transitions (via simple inline styles or micro-animations), badges, lists, and grids.
3. Content Integration: Inject the custom tagline, brand icons, and copywriting text from the copy dictionary into the corresponding section markup.
4. Contrast Rule: Ensure high color contrast. If the section background is dark, the text must be white/light. If the section background is light, the text must be dark charcoal.
5. No External Assets: Use Unicode emojis or SVG shapes for icons. Do not load external JavaScript scripts.`;
}

export function buildSectionCoderUserPrompt(quiz: QuizPayload, pageSlug: string, sectionsListJson: string, styleJson: string, copyJson: string): string {
  return `Generate custom inline-styled HTML markup for all sections of the page "${pageSlug}" for the brand "${quiz.business_name}".

## Targeted Page
Page Slug: "${pageSlug}"

## Page Section Structures (with Section Color Tokens)
${sectionsListJson}

## Brand Style Settings
${styleJson}

## Marketing Niche Copywriting (Demo Content)
${copyJson}

## Output JSON Schema
Return ONLY a valid JSON object matching this structure (no markdown wrappers):
{
  "custom_code": {
    "0": "<div style=\\"background: #121212; padding: 80px 40px; font-family: 'Inter', sans-serif;\\">...</div>",
    "1": "<div style=\\"background: #ffffff; padding: 60px 40px;\\">...</div>"
  }
}

Important: Generate a unique styled HTML block for every section index in the page sections list. Each key MUST be the index string (e.g. "0", "1", "2").`;
}
