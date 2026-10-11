import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/ui",
  async redirects() {
    return [
      {
        basePath: false,
        destination: "/ui",
        permanent: false,
        source: "/",
      },
      {
        destination: "/shaddercn",
        permanent: false,
        source: "/",
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
  transpilePackages: ["@shaddercn/ui", "@shaddercn/registry"],
};

export default withMDX(nextConfig);
