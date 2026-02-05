import { sanitizeString } from "./sanitize";

/** Shared email regex for all form validation. */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validate and sanitize a name field (2–200 chars). */
export function validateName(value: unknown): string {
  const name = typeof value === "string" ? sanitizeString(value) : "";
  if (!name || name.length < 2 || name.length > 200) {
    throw new Error("Name is required (2-200 characters)");
  }
  return name;
}

/** Validate and sanitize an email address. */
export function validateEmail(value: unknown): string {
  const email = typeof value === "string" ? sanitizeString(value).trim() : "";
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new Error("Valid email address is required");
  }
  return email;
}

/** Validate and sanitize a phone number (7–15 digits). Returns sanitized string. */
export function validatePhone(value: unknown): string {
  const phone = typeof value === "string" ? sanitizeString(value).trim() : "";
  const digits = phone.replace(/\D/g, "");
  if (!phone || digits.length < 7 || digits.length > 15) {
    throw new Error("Valid phone number is required (7-15 digits)");
  }
  return phone;
}

/** Validate a message field (10–5000 chars). */
export function validateMessage(value: unknown): string {
  const message = typeof value === "string" ? sanitizeString(value) : "";
  if (!message || message.length < 10 || message.length > 5000) {
    throw new Error("Message is required (10-5000 characters)");
  }
  return message;
}

/** Sanitize an optional string field. Returns empty string if not provided. */
export function optionalString(value: unknown): string {
  return typeof value === "string" ? sanitizeString(value) : "";
}

/** Check if an error message is a validation error (for 400 responses). */
export function isValidationError(message: string): boolean {
  return (
    message.includes("required") ||
    message.includes("Valid") ||
    message.includes("Invalid")
  );
}
