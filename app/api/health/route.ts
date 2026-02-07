import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  getHealthCheckToken,
  getUpstashRedisUrl,
  getUpstashRedisToken,
  getSupabaseUrl,
  getSupabaseServiceRoleKey,
  getGhlApiToken,
} from "@/lib/env";

export async function GET(request: NextRequest) {
  // Authenticate: require bearer token in production, optional in dev
  const token = getHealthCheckToken();
  if (token) {
    const auth = request.headers.get("authorization") || "";
    const expected = `Bearer ${token}`;
    const isValid =
      auth.length === expected.length &&
      timingSafeEqual(Buffer.from(auth), Buffer.from(expected));
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Health check token not configured" }, { status: 500 });
  }

  // Rate limit health checks (10 per minute)
  const ip = getClientIp(request);
  const { allowed } = await rateLimit(`health:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const checks: Record<string, "ok" | "unavailable"> = {};

  // Check Upstash Redis connectivity
  const redisUrl = getUpstashRedisUrl();
  const redisToken = getUpstashRedisToken();
  if (redisUrl) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3_000);
      const res = await fetch(`${redisUrl}/ping`, {
        headers: { Authorization: `Bearer ${redisToken}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      checks.redis = res.ok ? "ok" : "unavailable";
    } catch {
      checks.redis = "unavailable";
    }
  }

  // Check Supabase connectivity
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseServiceRoleKey();
  if (supabaseUrl && supabaseKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3_000);
      const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      checks.supabase = res.ok ? "ok" : "unavailable";
    } catch {
      checks.supabase = "unavailable";
    }
  }

  // Check GHL API connectivity
  const ghlToken = getGhlApiToken();
  if (ghlToken) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3_000);
      const res = await fetch("https://services.leadconnectorhq.com/locations/search", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ghlToken}`,
          Version: "2021-07-28",
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      checks.ghl = res.status !== 401 ? "ok" : "unavailable";
    } catch {
      checks.ghl = "unavailable";
    }
  }

  const allOk = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json({
    status: allOk ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    checks,
  });
}
