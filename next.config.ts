import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from "@next/bundle-analyzer";

const analyzeBundles = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Standalone output for Docker only (set DOCKER_BUILD=1 in Dockerfile)
  ...(process.env.DOCKER_BUILD ? { output: "standalone" as const } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  webpack: (config) => {
    // Skip parsing mapbox-gl (loaded via CDN, not webpack). Without noParse,
    // Sentry's withSentryConfig wrapper corrupts webpack chunk module
    // resolution for mapbox-gl. Three.js must NOT be in noParse since
    // shader-animation.tsx uses dynamic import("three") which webpack must transform.
    config.module = config.module || {};
    const existing = config.module.noParse;
    const noParsePatterns = [/mapbox-gl/];
    if (Array.isArray(existing)) {
      config.module.noParse = [...existing, ...noParsePatterns];
    } else if (existing instanceof RegExp) {
      config.module.noParse = [existing, ...noParsePatterns];
    } else if (typeof existing === "function") {
      const prev = existing;
      config.module.noParse = (content: string) =>
        prev(content) || noParsePatterns.some((p) => p.test(content));
    } else {
      config.module.noParse = noParsePatterns;
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

export default withSentryConfig(analyzeBundles(nextConfig), {
  // Suppress Sentry CLI logs unless auth token is present
  silent: !process.env.SENTRY_AUTH_TOKEN,

  // Source maps: don't expose to clients, only upload to Sentry
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // Prevent Sentry from wrapping App Router files with instrumentation modules.
  // This avoids "sentry-wrapper-module" virtual modules corrupting webpack
  // chunk resolution for heavy libraries (Three.js, Mapbox GL).
  webpack: {
    autoInstrumentAppDirectory: false,
    treeshake: {
      removeDebugLogging: true,
    },
  },
  widenClientFileUpload: false,
});
