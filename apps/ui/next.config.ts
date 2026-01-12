import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/ui",
  async redirects() {
    return [
      {
        destination: "/docs",
        permanent: false,
        source: "/",
      },
      // Keep /shaddercn as a friendly entrypoint
      {
        destination: "/docs",
        permanent: false,
        source: "/shaddercn",
      },
    ];
  },
  async rewrites() {
    return [
      {
        destination: "/api/raw/docs/:path*",
        source: "/docs/:path*.md",
      },
    ];
  },
  transpilePackages: ["@shaddercn/ui"],
};

export default withMDX(nextConfig);
