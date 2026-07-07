import { z } from "zod";

// ─── Input Schema (what the quiz sends) ─────────────────────────────────────

export const WebsiteGoalEnum = z.enum([
  "get_leads",
  "sell_products",
  "brand_story",
  "get_bookings",
  "showcase_work",
  "build_credibility",
]);

export const WebsiteTypeEnum = z.enum([
  "info_brochure",
  "landing_page",
  "ecommerce",
  "portfolio",
]);

export const StyleTagEnum = z.enum([
  "Modern", "Playful", "Premium", "Bold", "Warm", "Minimal",
  "Technical", "Handcrafted", "Secure", "Trustworthy",
  "Elegant", "Creative", "Tough", "Feminine", "Masculine",
]);

export const TypographyStyleEnum = z.enum([
  "clean_modern",
  "elegant_editorial",
  "technical_bold",
  "friendly_rounded",
  "professional_corporate",
  "ai_suggest",
]);

export const ColorDirectionSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("existing"),
    colors: z.object({
      primary:   z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
      secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
      accent:    z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
    }),
  }),
  z.object({ mode: z.literal("suggest") }),
]);

export const QuizPayloadSchema = z.object({
  // Q1
  business_name: z.string().min(1).max(100),
  // Q2
  products_services: z.string().min(10).max(1500),
  // Q3 (multi-select)
  website_goal: z.array(WebsiteGoalEnum).min(1),
  // Q4 (optional)
  target_customers: z.string().max(500).optional().default(""),
  // Q5 (optional)
  competitor_urls: z.string().max(500).optional().default(""),
  // Q6
  website_type: WebsiteTypeEnum,
  // Q7
  sitemap: z.object({
    page_count: z.number().int().min(1).max(20),
    pages_description: z.string().max(1000),
  }),
  // Q8
  style_tags: z.array(StyleTagEnum).min(1).max(5),
  // Q9
  color_direction: ColorDirectionSchema,
  // Q10
  typography_style: TypographyStyleEnum,
  // Email gate
  email: z.string().email(),
  // Dev / Regeneration
  regenerate_count: z.number().int().min(0).max(2).optional().default(0),
  comments: z.array(z.string()).optional().default([]),
});

export type QuizPayload = z.infer<typeof QuizPayloadSchema>;

// ─── Output Schema (what the LLM must return) ────────────────────────────────

const HexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a 6-digit hex color");

export const AIOutputSchema = z.object({
  business_name: z.string(),
  colors: z.object({
    primary:    HexColorSchema,
    secondary:  HexColorSchema,
    accent:     HexColorSchema,
    background: HexColorSchema,
    surface:    HexColorSchema,
    text:       HexColorSchema,
    text_muted: HexColorSchema,
  }),
  typography: z.object({
    heading: z.object({
      family: z.string(),
      weight: z.string(),
      google_font_url: z.string().url(),
    }),
    body: z.object({
      family: z.string(),
      weight: z.string(),
      google_font_url: z.string().url(),
    }),
  }),
  icon_set: z.array(z.object({
    label: z.string(),
    symbol: z.string(), // Unicode emoji or text symbol
  })).min(6).max(12),
  sitemap: z.array(z.object({
    slug:     z.string(),
    label:    z.string(),
    sections: z.array(z.string()),
  })).min(1),
  logo_url:          z.string().optional().nullable(),
  moodboard_images:  z.array(z.string()).optional().default([]),
  hero_image_url:    z.string().optional().nullable(),
  tagline:           z.string().max(200).transform((s) => s.slice(0, 200)),
  vibe_summary:      z.string().max(1000).transform((s) => s.slice(0, 1000)),
});

export type AIOutput = z.infer<typeof AIOutputSchema>;
