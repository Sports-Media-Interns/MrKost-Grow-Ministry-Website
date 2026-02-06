import { getRecaptchaSecretKey } from "./env";

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  "error-codes"?: string[];
}

/**
 * Verify a reCAPTCHA v3 token server-side.
 * Fails closed: verification errors reject the request.
 */
export async function verifyRecaptcha(
  token: string,
  expectedAction?: string
): Promise<{ success: boolean; score: number }> {
  const secretKey = getRecaptchaSecretKey();

  // Skip verification only in development when no key is configured
  if (!secretKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[reCAPTCHA] No secret key configured -- skipping in dev mode");
      return { success: true, score: 1.0 };
    }
    console.error("[reCAPTCHA] No secret key configured in production");
    return { success: false, score: 0 };
  }

  if (!token) {
    return { success: false, score: 0 };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    const data: RecaptchaResponse = await response.json();

    if (!data.success) {
      console.error("[reCAPTCHA] Verification failed:", data["error-codes"]);
      return { success: false, score: 0 };
    }

    if (expectedAction && data.action !== expectedAction) {
      console.error(
        `[reCAPTCHA] Action mismatch: expected ${expectedAction}, got ${data.action}`
      );
      return { success: false, score: 0 };
    }

    // Score below 0.5 is likely a bot (Google recommends 0.5+)
    if (data.score < 0.5) {
      console.warn(`[reCAPTCHA] Low score: ${data.score}`);
      return { success: false, score: data.score };
    }

    return { success: true, score: data.score };
  } catch (error) {
    // Fail closed: verification errors reject the request
    console.error("[reCAPTCHA] Verification error (fail-closed):", error);
    return { success: false, score: 0 };
  }
}
