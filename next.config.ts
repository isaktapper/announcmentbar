import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Allow production builds to successfully complete even if
    // there are ESLint errors in the project. This is useful when
    // migrating large codebases or when lint fixes will be handled
    // incrementally.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Enable production builds to finish even when there are
    // type errors (will still surface during development).
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
