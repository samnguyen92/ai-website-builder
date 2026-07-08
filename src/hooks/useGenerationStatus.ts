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

  const fetchOnce = async () => {
    if (!leadId) return;
    try {
      const res = await fetch(`/api/status/${leadId}`);
      if (!res.ok) return;
      const data = await res.json();
      setState({
        status: data.status,
        payload: data.payload,
        errorMessage: data.errorMessage || null,
        regenerateCount: data.regenerateCount ?? 0,
      });
      return data;
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!leadId) return;

    const poll = async () => {
      const data = await fetchOnce();
      if (data && (data.status === "complete" || data.status === "error")) {
        clearInterval(intervalRef.current!);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [leadId]);

  return { ...state, refetch: fetchOnce };
}
