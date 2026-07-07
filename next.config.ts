import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow long-running API routes for AI generation
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
