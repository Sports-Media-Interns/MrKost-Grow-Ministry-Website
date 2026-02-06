import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Authenticate: require bearer token if HEALTH_CHECK_TOKEN is set
  const token = process.env.HEALTH_CHECK_TOKEN;
  if (token) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${token}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Rate limit health checks (10 per minute)
  const ip = getClientIp(request);
  const { allowed } = await rateLimit(`health:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const checks: Record<string, "ok" | "unavailable"> = {};

  // Check Upstash Redis connectivity
  if (process.env.UPSTASH_REDIS_REST_URL) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3_000);
      const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/ping`, {
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      checks.redis = res.ok ? "ok" : "unavailable";
    } catch {
      checks.redis = "unavailable";
    }
  }

  // Check Supabase connectivity
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3_000);
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
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
  if (process.env.GHL_API_TOKEN) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3_000);
      const res = await fetch("https://services.leadconnectorhq.com/locations/search", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.GHL_API_TOKEN}`,
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
