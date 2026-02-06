/**
 * Client-side reCAPTCHA utilities.
 * Shared across cookie-consent, exit-intent, and service-modal.
 */

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""

/** Ensure the reCAPTCHA script is loaded (no-op if already present). */
export function loadRecaptchaScript(): void {
  if (typeof document === "undefined" || !RECAPTCHA_SITE_KEY) return
  if (document.querySelector(`script[src*="recaptcha/api.js"]`)) return
  const script = document.createElement("script")
  script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
  script.async = true
  document.head.appendChild(script)
}

/** Get a reCAPTCHA token if the script is available, otherwise return empty string. */
export async function getRecaptchaToken(action: string): Promise<string> {
  try {
    if (typeof window !== "undefined" && (window as Window & { grecaptcha?: { execute: (key: string, options: { action: string }) => Promise<string> } }).grecaptcha) {
      return await (window as Window & { grecaptcha: { execute: (key: string, options: { action: string }) => Promise<string> } }).grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
    }
  } catch {
    console.warn(`[GrowMinistry] reCAPTCHA execution failed for ${action}`)
  }
  return ""
}

export { RECAPTCHA_SITE_KEY }
