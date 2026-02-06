/**
 * Sanitize a string by removing HTML tags and trimming whitespace.
 * Uses sanitize-html for robust XSS prevention (handles nested tags,
 * malformed HTML, and encoding tricks that regex-based approaches miss).
 */
import sanitizeHtml from "sanitize-html";

export function sanitizeString(input: string): string {
  const cleaned = sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: "discard",
  })
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();

  // Decode &amp; that sanitize-html introduces from bare & in plain text
  // (CRM data like "John & Jane's Church" should stay as literal text)
  // NOTE: Do NOT decode &lt; &gt; -- those represent stripped HTML and
  // decoding them could re-introduce XSS in HTML contexts.
  return cleaned.replace(/&amp;/g, "&");
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
