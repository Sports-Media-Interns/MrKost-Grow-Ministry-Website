import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google.com https://www.gstatic.com https://widgets.leadconnectorhq.com https://stcdn.leadconnectorhq.com`,
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
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and images
    {
      source: "/((?!_next/static|_next/image|favicon.ico|images|icon.png|robots.txt|sitemap.xml).*)",
      missing: [{ type: "header", key: "next-router-prefetch" }],
    },
  ],
};
