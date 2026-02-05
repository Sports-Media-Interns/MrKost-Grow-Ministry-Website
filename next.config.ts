import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  async headers() {
    return [
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
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google.com https://www.gstatic.com https://widgets.leadconnectorhq.com`,
              "style-src 'self' 'unsafe-inline' https://api.mapbox.com",
              "img-src 'self' data: blob: https://*.mapbox.com https://www.googletagmanager.com",
              "font-src 'self' data:",
              "connect-src 'self' https://*.mapbox.com https://www.google-analytics.com https://www.googletagmanager.com https://services.leadconnectorhq.com https://widgets.leadconnectorhq.com https://link.fastpaydirect.com https://www.google.com https://www.google.com/recaptcha/",
              "worker-src 'self' blob:",
              "child-src blob:",
              "frame-src https://www.google.com https://www.recaptcha.net https://api.leadconnectorhq.com https://link.fastpaydirect.com https://widgets.leadconnectorhq.com",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
