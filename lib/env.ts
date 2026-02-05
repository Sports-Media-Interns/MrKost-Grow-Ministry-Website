/**
 * Environment variable accessors with runtime validation.
 */

/** Server-only: GoHighLevel webhook URL */
export function getGhlWebhookUrl(): string {
  const url = process.env.GHL_WEBHOOK_URL || "";
  if (!url) {
    console.error("[env] GHL_WEBHOOK_URL is not configured");
  }
  return url;
}

/** Server-only: reCAPTCHA secret key for server-side verification */
export function getRecaptchaSecretKey(): string {
  return process.env.RECAPTCHA_SECRET_KEY || "";
}

/** Public: reCAPTCHA site key */
export function getRecaptchaSiteKey(): string {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
}

/** Public: Mapbox access token */
export function getMapboxToken(): string {
  return process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
}

/** Public: GA4 measurement ID */
export function getGA4MeasurementId(): string {
  return process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "";
}

/**
 * Validate that required environment variables are set.
 * Call this during build or server start.
 */
export function validateEnv(): { valid: boolean; missing: string[] } {
  const required = ["GHL_WEBHOOK_URL"];
  const recommended = [
    "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN",
    "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
    "NEXT_PUBLIC_GA4_MEASUREMENT_ID",
  ];

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

  return { valid: missing.length === 0, missing };
}
