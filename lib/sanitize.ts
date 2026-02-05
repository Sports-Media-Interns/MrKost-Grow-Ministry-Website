/**
 * Sanitize a string by removing HTML tags and trimming whitespace.
 * For CRM/webhook data, we strip dangerous tags but keep normal text as-is.
 * No entity encoding since CRM stores plain text, not HTML.
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // strip script tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "") // strip style tags
    .replace(/<[^>]*>/g, "") // strip remaining HTML tags
    .replace(/javascript:/gi, "") // remove javascript: URIs
    .replace(/on\w+\s*=/gi, "") // remove event handlers
    .trim();
}

/**
 * Sanitize all string values in a flat object.
 */
export function sanitizePayload<T extends Record<string, unknown>>(
  obj: T
): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    if (typeof result[key] === "string") {
      (result as Record<string, unknown>)[key] = sanitizeString(
        result[key] as string
      );
    }
  }
  return result;
}
