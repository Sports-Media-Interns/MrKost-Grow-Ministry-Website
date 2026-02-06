/**
 * CSRF protection via Origin/Referer header validation.
 * Rejects POST requests from unknown origins.
 */
import type { NextRequest } from "next/server";

/** Allowed origins for API requests */
const ALLOWED_ORIGINS = new Set([
  "https://growministry.com",
  "https://www.growministry.com",
]);

/**
 * Validate that a POST request originates from our own domain.
 * Returns null if valid, or an error message if invalid.
 */
export function validateOrigin(request: NextRequest): string | null {
  // Skip in development/test
  if (process.env.NODE_ENV !== "production") return null;

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Origin header is most reliable (sent on all POST cross-origin requests)
  if (origin) {
    if (ALLOWED_ORIGINS.has(origin)) return null;
    return `Forbidden origin: ${origin}`;
  }

  // Fallback to Referer (always present for same-site requests)
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      if (ALLOWED_ORIGINS.has(refererOrigin)) return null;
    } catch {
      // Malformed referer
    }
    return "Forbidden referer";
  }

  // No origin or referer -- likely a direct API call (curl, Postman)
  // Block in production since legitimate browser requests always include these
  return "Missing origin header";
}
