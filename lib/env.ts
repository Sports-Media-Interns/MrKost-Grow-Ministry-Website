/**
 * Environment variable validation and accessors.
 * Uses Zod schemas for build-time type safety and runtime validation.
 */
import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

// Helper: accepts empty string or valid URL
const optionalUrl = z.string().refine(
  (val) => val === "" || /^https?:\/\//.test(val),
  { message: "Must be empty or a valid URL" }
).default("");

const serverSchema = z.object({
  GHL_WEBHOOK_URL: optionalUrl,
  GHL_API_TOKEN: z.string().default(""),
  GHL_LOCATION_ID: z.string().default(""),
  RECAPTCHA_SECRET_KEY: z.string().default(""),
  UPSTASH_REDIS_REST_URL: optionalUrl,
  UPSTASH_REDIS_REST_TOKEN: z.string().default(""),
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  SUPABASE_SERVICE_ROLE_KEY: z.string().default(""),
  HEALTH_CHECK_TOKEN: z.string().default(""),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().default(""),
  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string().default(""),
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: z.string().default(""),
  NEXT_PUBLIC_SENTRY_DSN: z.string().default(""),
});

/* ------------------------------------------------------------------ */
/*  Parsed env (lazy singleton)                                        */
/* ------------------------------------------------------------------ */

let _serverEnv: z.infer<typeof serverSchema> | null = null;
let _clientEnv: z.infer<typeof clientSchema> | null = null;

function getServerEnv() {
  if (!_serverEnv) {
    _serverEnv = serverSchema.parse(process.env);
  }
  return _serverEnv;
}

function getClientEnv() {
  if (!_clientEnv) {
    _clientEnv = clientSchema.parse(process.env);
  }
  return _clientEnv;
}

/** Reset cached env (for testing only) */
export function _resetEnvCache() {
  _serverEnv = null;
  _clientEnv = null;
}

/* ------------------------------------------------------------------ */
/*  Accessors (drop-in replacements for previous API)                  */
/* ------------------------------------------------------------------ */

/** Server-only: GoHighLevel webhook URL */
export function getGhlWebhookUrl(): string {
  const url = getServerEnv().GHL_WEBHOOK_URL;
  if (!url) {
    console.error("[env] GHL_WEBHOOK_URL is not configured");
  }
  return url;
}

/** Server-only: reCAPTCHA secret key for server-side verification */
export function getRecaptchaSecretKey(): string {
  return getServerEnv().RECAPTCHA_SECRET_KEY;
}

/** Public: reCAPTCHA site key */
export function getRecaptchaSiteKey(): string {
  return getClientEnv().NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
}

/** Public: Mapbox access token */
export function getMapboxToken(): string {
  return getClientEnv().NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
}

/** Public: GA4 measurement ID */
export function getGA4MeasurementId(): string {
  return getClientEnv().NEXT_PUBLIC_GA4_MEASUREMENT_ID;
}

/* ------------------------------------------------------------------ */
/*  Validation (call at startup)                                       */
/* ------------------------------------------------------------------ */

/**
 * Validate that required environment variables are set.
 * Call this during build or server start.
 */
export function validateEnv(): { valid: boolean; missing: string[] } {
  const required = [
    "GHL_WEBHOOK_URL",
    "RECAPTCHA_SECRET_KEY",
  ] as const;
  const recommended = [
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN",
    "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
    "NEXT_PUBLIC_GA4_MEASUREMENT_ID",
  ] as const;

  const missing = required.filter((key) => !process.env[key]);
  const missingRecommended = recommended.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`[env] Missing required env vars: ${missing.join(", ")}`);
  }
  if (missingRecommended.length > 0) {
    console.warn(
      `[env] Missing recommended env vars: ${missingRecommended.join(", ")}`
    );
  }

  return { valid: missing.length === 0, missing: [...missing] };
}
