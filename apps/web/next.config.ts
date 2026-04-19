import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@courseadvice/db",
    "@courseadvice/auth",
    "@courseadvice/types",
    "@courseadvice/ui",
  ],
};

export default nextConfig;
