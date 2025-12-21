import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  swcMinify: true,
  reactStrictMode: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "**.stripe.com",
      },
      {
        protocol: "https",
        hostname: "**.clerk.com",
      },
    ],
    // Optimize for large audiences
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable caching
    minimumCacheTTL: 31536000, // 1 year for immutable assets
  },

  // Compression and optimization
  compress: true,
  poweredByHeader: false,

  // Output optimization
  output: "standalone",

  // Enable webpack optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              filename: "chunks/vendor.[hash].js",
              test: /node_modules/,
              chunks: "all",
              priority: 20,
            },
            // Clerk auth chunk
            clerk: {
              filename: "chunks/clerk.[hash].js",
              test: /@clerk/,
              chunks: "all",
              priority: 25,
            },
            // Common chunk
            common: {
              minChunks: 2,
              priority: 10,
              chunks: "async",
              name: "common",
            },
          },
        },
      };
    }
    return config;
  },

  // Enable experimental optimizations
  experimental: {
    // Optimized package imports
    optimizePackageImports: [
      "@clerk/nextjs",
      "@radix-ui/react-*",
      "lucide-react",
    ],
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=120",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Rewrites for API routes
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: "/api/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
