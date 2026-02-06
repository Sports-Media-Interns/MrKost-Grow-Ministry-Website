import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

const UPSTASH_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const useUpstash = Boolean(UPSTASH_REST_URL && UPSTASH_REST_TOKEN);

/* ------------------------------------------------------------------ */
/*  Upstash Rate Limiter (Production)                                  */
/* ------------------------------------------------------------------ */

let upstashRatelimit: Ratelimit | null = null;

if (useUpstash) {
  const redis = new Redis({
    url: UPSTASH_REST_URL!,
    token: UPSTASH_REST_TOKEN!,
  });

  // Using sliding window algorithm: 5 requests per 60 seconds
  upstashRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
    prefix: "gm:ratelimit",
  });
}

/* ------------------------------------------------------------------ */
/*  In-Memory Rate Limiter (Development Fallback)                      */
/* ------------------------------------------------------------------ */

const MAX_ENTRIES = 10_000;
const CLEANUP_INTERVAL_MS = 60_000;

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateMap = new Map<string, RateLimitEntry>();
let lastCleanup = Date.now();

function cleanup(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, entry] of rateMap) {
    if (now > entry.resetTime) {
      rateMap.delete(key);
    }
  }

  if (rateMap.size > MAX_ENTRIES) {
    const excess = rateMap.size - MAX_ENTRIES;
    const keys = rateMap.keys();
    for (let i = 0; i < excess; i++) {
      const next = keys.next();
      if (!next.done) rateMap.delete(next.value);
    }
  }
}

function inMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  cleanup();

  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

/* ------------------------------------------------------------------ */
/*  Unified Rate Limiter                                               */
/* ------------------------------------------------------------------ */

/**
 * Rate limiter that uses Upstash Redis in production (when configured)
 * and falls back to in-memory for local development.
 *
 * Note: When Upstash is active, the `limit` and `windowMs` params are
 * ignored -- Upstash uses a fixed sliding window (5 req / 60s) configured
 * at module init. The params only apply to the in-memory fallback.
 *
 * Environment variables required for production:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */
export async function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): Promise<{ allowed: boolean; remaining: number }> {
  // Use Upstash in production if configured
  // Note: Upstash uses a fixed 5/60s sliding window; per-call params are ignored
  if (useUpstash && upstashRatelimit) {
    try {
      const result = await upstashRatelimit.limit(key);
      return {
        allowed: result.success,
        remaining: result.remaining,
      };
    } catch (error) {
      console.warn("[RateLimit] Upstash error, falling back to in-memory:", error);
      // Fall through to in-memory on error
    }
  }

  // In-memory fallback for development or if Upstash fails
  return inMemoryRateLimit(key, limit, windowMs);
}

/**
 * Synchronous rate limiter for backwards compatibility.
 * Uses in-memory only (for tests and non-async contexts).
 * @deprecated Use the async rateLimit function instead.
 */
export function rateLimitSync(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): { allowed: boolean; remaining: number } {
  return inMemoryRateLimit(key, limit, windowMs);
}

/**
 * Extract client IP from request headers.
 *
 * Security: Prefer x-real-ip (set by Vercel edge, not spoofable) over
 * x-forwarded-for (can be spoofed by clients when no trusted proxy strips it).
 * On Vercel, x-real-ip is always the true connecting client IP.
 */
export function getClientIp(request: Request): string {
  // x-real-ip is set by Vercel's edge network -- most trustworthy
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  // x-forwarded-for may contain a proxy chain; only trust when behind a known proxy
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // Take the rightmost non-private IP (closest to the proxy), not the leftmost
    // which can be spoofed by the client
    const ips = forwarded.split(",").map((ip) => ip.trim());
    // On Vercel, the last IP before Vercel's own is the client IP
    // For single-proxy setups, first IP is usually correct
    // We take the first IP as Vercel already strips spoofed headers
    if (process.env.VERCEL) {
      return ips[0];
    }
    // Outside Vercel, take the last IP (closest to our server, hardest to spoof)
    return ips[ips.length - 1];
  }

  return "unknown";
}

/** Exposed for testing only. */
export function _resetRateMap(): void {
  rateMap.clear();
  lastCleanup = Date.now();
}
