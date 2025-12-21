import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/f/**',
      },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
    rules: {
      "*.md": { loaders: [] }, // tells Turbopack to ignore markdown files
    },
  },
};

export default nextConfig;
