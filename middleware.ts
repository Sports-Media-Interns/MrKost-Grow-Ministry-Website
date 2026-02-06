import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Generate a unique nonce for each request
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const isDev = process.env.NODE_ENV === "development";

  // Sentry CSP report URI (project-specific ingest)
  const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN || "";
  const sentryReportUri = sentryDsn
    ? `https://o4509383042367488.ingest.us.sentry.io/api/4509383045316608/security/?sentry_key=${sentryDsn.split("@")[0]?.split("//")[1] || ""}`
    : "";

  // Build CSP with nonce replacing unsafe-inline for scripts
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""} https://api.mapbox.com https://www.googletagmanager.com https://www.google.com https://www.gstatic.com https://widgets.leadconnectorhq.com https://stcdn.leadconnectorhq.com https://services.leadconnectorhq.com`,
    "style-src 'self' 'unsafe-inline' https://api.mapbox.com https://stcdn.leadconnectorhq.com https://fonts.bunny.net",
    "img-src 'self' data: blob: https://*.mapbox.com https://www.googletagmanager.com https://images.leadconnectorhq.com https://stcdn.leadconnectorhq.com",
    "font-src 'self' data: https://stcdn.leadconnectorhq.com https://fonts.bunny.net",
    "connect-src 'self' https://*.mapbox.com https://www.google-analytics.com https://www.googletagmanager.com https://services.leadconnectorhq.com https://widgets.leadconnectorhq.com https://stcdn.leadconnectorhq.com https://link.fastpaydirect.com https://www.google.com https://www.google.com/recaptcha/ https://*.sentry.io https://*.msgsndr.com",
    "worker-src 'self' blob:",
    "child-src blob:",
    "object-src 'none'",
    "frame-src https://www.google.com https://www.recaptcha.net https://api.leadconnectorhq.com https://link.fastpaydirect.com https://widgets.leadconnectorhq.com",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ];

  // Add CSP violation reporting to Sentry (production only)
  if (sentryReportUri && !isDev) {
    directives.push(`report-uri ${sentryReportUri}`);
  }

  const csp = directives.join("; ");

  // Set the nonce in a request header so layout.tsx can read it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Set CSP header on the response
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|images|downloads).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
