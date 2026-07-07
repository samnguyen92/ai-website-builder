"use client";

import { useState, useEffect, useRef } from "react";
import type { AIOutput } from "@/lib/ai/schema";

type GenerationStatus = {
  status: "idle" | "pending" | "complete" | "error";
  payload: AIOutput | null;
  errorMessage: string | null;
  regenerateCount: number;
};

export function useGenerationStatus(leadId: string | null) {
  const [state, setState] = useState<GenerationStatus>({
    status: leadId ? "pending" : "idle",
    payload: null,
    errorMessage: null,
    regenerateCount: 0,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!leadId) return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/status/${leadId}`);
        if (!res.ok) return;
        const data = await res.json();

        if (data.status === "complete") {
          setState({
            status: "complete",
            payload: data.payload,
            errorMessage: null,
            regenerateCount: data.regenerateCount ?? 0,
          });
          clearInterval(intervalRef.current!);
        } else if (data.status === "error") {
          setState({
            status: "error",
            payload: null,
            errorMessage: data.errorMessage,
            regenerateCount: data.regenerateCount ?? 0,
          });
          clearInterval(intervalRef.current!);
        }
      } catch {
        // network hiccup — keep polling
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [leadId]);

  return state;
}
