import { validateEnv } from "@/lib/env";

export function register() {
  const { valid, missing } = validateEnv();

  if (!valid && process.env.NODE_ENV === "production") {
    throw new Error(
      `[startup] Cannot start in production with missing env vars: ${missing.join(", ")}`
    );
  }
}
