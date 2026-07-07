import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Align – AI Website Design Agent",
  description: "Answer 10 questions and get a fully AI-generated website concept: color palette, typography, and sitemap — in seconds.",
  keywords: ["AI website design", "website concept generator", "branding AI"],
  openGraph: {
    title: "Align – AI Website Design Agent",
    description: "Get your AI-generated website concept in seconds.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
