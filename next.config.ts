import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // GitHub Pages project sites are served from /<repo>; set by the deploy workflow.
  basePath: process.env.PAGES_BASE_PATH || undefined,
};

export default nextConfig;
