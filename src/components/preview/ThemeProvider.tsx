"use client";

import { useEffect } from "react";
import type { AIOutput } from "@/lib/ai/schema";

interface Props {
  payload: AIOutput;
  children: React.ReactNode;
}

export function ThemeProvider({ payload, children }: Props) {
  useEffect(() => {
    const root = document.documentElement;
    const { colors, typography } = payload;

    // Inject color variables
    root.style.setProperty("--ai-primary",    colors.primary);
    root.style.setProperty("--ai-secondary",  colors.secondary);
    root.style.setProperty("--ai-accent",     colors.accent);
    root.style.setProperty("--ai-bg",         colors.background);
    root.style.setProperty("--ai-surface",    colors.surface);
    root.style.setProperty("--ai-text",       colors.text);
    root.style.setProperty("--ai-text-muted", colors.text_muted);

    // Inject font families
    root.style.setProperty("--ai-font-heading", `'${typography.heading.family}', sans-serif`);
    root.style.setProperty("--ai-font-body",    `'${typography.body.family}', sans-serif`);

    // Load Google Fonts dynamically
    const loadFont = (url: string, id: string) => {
      if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.id   = id;
        link.rel  = "stylesheet";
        link.href = url;
        document.head.appendChild(link);
      }
    };
    loadFont(typography.heading.google_font_url, "ai-font-heading");
    loadFont(typography.body.google_font_url,    "ai-font-body");

    return () => {
      // Cleanup on unmount
      root.style.removeProperty("--ai-primary");
      root.style.removeProperty("--ai-secondary");
      root.style.removeProperty("--ai-accent");
      root.style.removeProperty("--ai-bg");
      root.style.removeProperty("--ai-surface");
      root.style.removeProperty("--ai-text");
      root.style.removeProperty("--ai-text-muted");
    };
  }, [payload]);

  return (
    <div
      style={{
        backgroundColor: payload.colors.background,
        color: payload.colors.text,
        fontFamily: `'${payload.typography.body.family}', sans-serif`,
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}
