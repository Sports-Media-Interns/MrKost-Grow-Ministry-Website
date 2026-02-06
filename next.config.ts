import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Standalone output for Docker only (set DOCKER_BUILD=1 in Dockerfile)
  ...(process.env.DOCKER_BUILD ? { output: "standalone" as const } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent webpack from bundling mapbox-gl — loaded from CDN instead
      config.externals = [...(config.externals || []), { "mapbox-gl": "mapboxgl" }];
    }
    return config;
  },
  async headers() {
    return [
      // Global security headers
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // CSP is set dynamically in middleware.ts with nonce-based script-src
        ],
      },
      // Immutable cache for hashed Next.js build assets
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Long cache for static images
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      // Cache for downloadable PDFs
      {
        source: "/downloads/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      // Cache for favicon and icon
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000",
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // Suppress Sentry CLI logs unless auth token is present
  silent: !process.env.SENTRY_AUTH_TOKEN,

  // Source maps: don't expose to clients, only upload to Sentry
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
