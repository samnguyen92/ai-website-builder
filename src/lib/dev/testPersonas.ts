import type { QuizState } from "@/hooks/useQuizState";

/** A set of realistic test personas to cycle through */
const PERSONAS: Omit<QuizState, "email">[] = [
  {
    business_name: "Nova Digital Studio",
    products_services:
      "We design and build premium digital experiences for startups and scale-ups. From brand identity to full-stack web apps, we help founders launch with confidence and stand out from day one.",
    website_goal: ["get_leads", "showcase_work"],
    target_customers: "Tech startup founders, Series A companies, B2B SaaS",
    competitor_urls: "https://linear.app, https://vercel.com",
    website_type: "portfolio",
    sitemap: {
      page_count: 5,
      pages_description: "Homepage, About, Services, Case Studies, Contact",
    },
    style_tags: ["Premium", "Minimal", "Modern"],
    color_direction: { mode: "suggest" },
    typography_style: "clean_modern",
  },
  {
    business_name: "Bloom Wellness Co.",
    products_services:
      "Holistic wellness products and online coaching for women 30–50. We sell organic supplements, guided meditation courses, and 1-on-1 health coaching programs focused on hormonal balance and energy.",
    website_goal: ["sell_products", "build_credibility"],
    target_customers: "Women 30–50, health-conscious, disposable income, interested in natural wellness",
    competitor_urls: "https://goop.com",
    website_type: "ecommerce",
    sitemap: {
      page_count: 6,
      pages_description: "Homepage, Shop, About, Blog, Coaching, Contact",
    },
    style_tags: ["Warm", "Elegant", "Feminine"],
    color_direction: { mode: "suggest" },
    typography_style: "elegant_editorial",
  },
  {
    business_name: "IronCore Gym",
    products_services:
      "Premium strength training facility in Ho Chi Minh City. We offer personal training, group classes (HIIT, CrossFit, powerlifting), and nutrition coaching for serious athletes and beginners alike.",
    website_goal: ["get_bookings", "build_credibility"],
    target_customers: "Ages 20–40, professionals and athletes in HCMC, motivated, results-driven",
    competitor_urls: "",
    website_type: "info_brochure",
    sitemap: {
      page_count: 4,
      pages_description: "Homepage, Classes, Personal Training, Booking",
    },
    style_tags: ["Bold", "Technical", "Masculine"],
    color_direction: {
      mode: "existing",
      colors: { primary: "#1a1a1a", secondary: "#e63946", accent: "#f1faee" },
    },
    typography_style: "technical_bold",
  },
  {
    business_name: "Kết Nối Legal",
    products_services:
      "Vietnamese law firm specializing in corporate law, M&A advisory, and foreign investment consulting. We help international companies navigate Vietnam's legal landscape with clarity and speed.",
    website_goal: ["get_leads", "brand_story"],
    target_customers: "Foreign investors, multinational corporations, startup founders expanding to Vietnam",
    competitor_urls: "https://indochinalegal.com",
    website_type: "info_brochure",
    sitemap: {
      page_count: 5,
      pages_description: "Homepage, Practice Areas, About Us, Team, Contact",
    },
    style_tags: ["Trustworthy", "Elegant", "Secure"],
    color_direction: { mode: "suggest" },
    typography_style: "professional_corporate",
  },
  {
    business_name: "Pixel & Grain Photography",
    products_services:
      "Commercial and portrait photographer based in Hanoi. Specializing in brand campaigns, editorial shoots, and lifestyle photography for fashion and hospitality clients across Southeast Asia.",
    website_goal: ["showcase_work", "get_leads"],
    target_customers: "Fashion brands, hospitality groups, marketing agencies in SEA",
    competitor_urls: "",
    website_type: "portfolio",
    sitemap: {
      page_count: 4,
      pages_description: "Homepage, Portfolio, About, Contact",
    },
    style_tags: ["Creative", "Minimal", "Premium"],
    color_direction: {
      mode: "existing",
      colors: { primary: "#0a0a0a", secondary: "#f5f5f0", accent: "#c9a96e" },
    },
    typography_style: "elegant_editorial",
  },
];

/** Returns a random test persona */
export function getNextTestPersona(): Omit<QuizState, "email"> {
  const randomIndex = Math.floor(Math.random() * PERSONAS.length);
  return PERSONAS[randomIndex];
}
