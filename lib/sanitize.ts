/**
 * Sanitize a string by removing HTML tags and trimming whitespace.
 * Prevents XSS when forwarding data to webhooks.
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[<>"'&]/g, (char) => {
      const entities: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "&": "&amp;",
      };
      return entities[char] || char;
    })
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
