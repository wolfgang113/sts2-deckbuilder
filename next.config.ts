import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: '/sts2-deckbuilder',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
