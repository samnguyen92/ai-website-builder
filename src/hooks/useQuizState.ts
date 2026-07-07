"use client";

import { useState, useCallback } from "react";
import type { QuizPayload } from "@/lib/ai/schema";

export type QuizState = Omit<Partial<QuizPayload>, "color_direction"> & {
  color_direction?: QuizPayload["color_direction"];
};

const TOTAL_STEPS = 11; // 10 questions + email gate

export function useQuizState() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<QuizState>({
    website_goal: [],
    style_tags: [],
    sitemap: { page_count: 1, pages_description: "" },
    color_direction: { mode: "suggest" },
  });

  const update = useCallback(<K extends keyof QuizState>(key: K, value: QuizState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const next = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS)), []);
  const back = useCallback(() => setStep((s) => Math.max(s - 1, 1)), []);

  /** Dev-only: bulk-load a full persona and jump to a specific step */
  const fillAll = useCallback((persona: Omit<QuizState, "email">, jumpTo = 11) => {
    setState((prev) => ({ ...prev, ...persona }));
    setStep(jumpTo);
  }, []);

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  return { step, state, update, next, back, progress, TOTAL_STEPS, fillAll };
}
