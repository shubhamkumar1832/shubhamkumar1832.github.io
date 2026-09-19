import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `npm run build` writes a plain HTML site to ./out,
  // which is what GitHub Pages serves.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
