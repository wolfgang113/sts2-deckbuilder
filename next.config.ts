import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  assetPrefix: isGitHubPages ? '/sts2-deckbuilder/' : '.',
  basePath: isGitHubPages ? '/sts2-deckbuilder' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
