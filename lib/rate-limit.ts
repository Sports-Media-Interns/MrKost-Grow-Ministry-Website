const MAX_ENTRIES = 10_000;
const CLEANUP_INTERVAL_MS = 60_000;

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateMap = new Map<string, RateLimitEntry>();
let lastCleanup = Date.now();

/** Remove expired entries to prevent memory leaks. */
function cleanup(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, entry] of rateMap) {
    if (now > entry.resetTime) {
      rateMap.delete(key);
    }
  }

  // Hard cap: if still too large, drop oldest entries
  if (rateMap.size > MAX_ENTRIES) {
    const excess = rateMap.size - MAX_ENTRIES;
    const keys = rateMap.keys();
    for (let i = 0; i < excess; i++) {
      const next = keys.next();
      if (!next.done) rateMap.delete(next.value);
    }
  }
}

/**
 * In-memory rate limiter for API routes.
 * Includes automatic cleanup to prevent memory leaks.
 */
export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
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

/** Extract client IP from request headers. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

/** Exposed for testing only. */
export function _resetRateMap(): void {
  rateMap.clear();
  lastCleanup = Date.now();
}
