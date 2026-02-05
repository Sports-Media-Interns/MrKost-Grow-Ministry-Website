import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
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
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google.com https://www.gstatic.com https://widgets.leadconnectorhq.com https://stcdn.leadconnectorhq.com`,
              "style-src 'self' 'unsafe-inline' https://api.mapbox.com https://stcdn.leadconnectorhq.com",
              "img-src 'self' data: blob: https://*.mapbox.com https://www.googletagmanager.com https://images.leadconnectorhq.com https://stcdn.leadconnectorhq.com",
              "font-src 'self' data: https://stcdn.leadconnectorhq.com",
              "connect-src 'self' https://*.mapbox.com https://www.google-analytics.com https://www.googletagmanager.com https://services.leadconnectorhq.com https://widgets.leadconnectorhq.com https://stcdn.leadconnectorhq.com https://link.fastpaydirect.com https://www.google.com https://www.google.com/recaptcha/",
              "worker-src 'self' blob:",
              "child-src blob:",
              "frame-src https://www.google.com https://www.recaptcha.net https://api.leadconnectorhq.com https://link.fastpaydirect.com https://widgets.leadconnectorhq.com",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
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

export default nextConfig;
