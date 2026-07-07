import type { Metadata } from "next";
import { QuizShell } from "@/components/quiz/QuizShell";

export const metadata: Metadata = {
  title: "Align – Get Your Free Website Concept",
  description: "Answer 10 quick questions and receive a fully AI-generated website concept in seconds.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#121212]">
      <QuizShell />
    </main>
  );
}
