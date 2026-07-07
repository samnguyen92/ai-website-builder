import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // App shell tokens
        bg:         "var(--color-bg)",
        surface:    "var(--color-surface)",
        accent:     "var(--color-accent)",
        "text-base":"var(--color-text)",
        muted:      "var(--color-text-muted)",
        // AI-generated tokens
        "ai-primary":   "var(--ai-primary)",
        "ai-secondary": "var(--ai-secondary)",
        "ai-accent":    "var(--ai-accent)",
        "ai-bg":        "var(--ai-bg)",
        "ai-surface":   "var(--ai-surface)",
        "ai-text":      "var(--ai-text)",
        "ai-muted":     "var(--ai-text-muted)",
      },
      fontFamily: {
        heading: "var(--ai-font-heading)",
        body:    "var(--ai-font-body)",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
