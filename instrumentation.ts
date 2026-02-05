import { validateEnv } from "@/lib/env";

export function register() {
  const { valid, missing } = validateEnv();

  if (!valid && process.env.NODE_ENV === "production") {
    // On Vercel preview deployments, warn instead of crashing
    if (process.env.VERCEL_ENV === "preview") {
      console.warn(
        `[startup] Preview deployment missing env vars: ${missing.join(", ")}`
      );
    } else {
      throw new Error(
        `[startup] Cannot start in production with missing env vars: ${missing.join(", ")}`
      );
    }
  }
}
