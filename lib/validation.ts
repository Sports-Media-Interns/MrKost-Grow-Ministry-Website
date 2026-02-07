import { sanitizeString } from "./sanitize";

/** Custom error class for input validation failures (maps to HTTP 400). */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/** Shared email regex -- requires TLD of 2+ chars, rejects a@b.c */
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;

/** Validate and sanitize a name field (2–200 chars). */
export function validateName(value: unknown): string {
  const name = typeof value === "string" ? sanitizeString(value) : "";
  if (!name || name.length < 2 || name.length > 200) {
    throw new ValidationError("Name is required (2-200 characters)");
  }
  return name;
}

/** Validate and sanitize an email address (RFC 5321: max 254 chars). */
export function validateEmail(value: unknown): string {
  const email = typeof value === "string" ? sanitizeString(value).trim() : "";
  if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
    throw new ValidationError("Valid email address is required");
  }
  return email;
}

/** Validate and sanitize a phone number (7–15 digits, optional +/()/-/space formatting). */
export function validatePhone(value: unknown): string {
  const phone = typeof value === "string" ? sanitizeString(value).trim() : "";
  if (!phone) {
    throw new ValidationError("Valid phone number is required (7-15 digits)");
  }
  // Only allow digits and common phone formatting chars
  if (!/^[+\d\s().-]+$/.test(phone)) {
    throw new ValidationError("Phone number contains invalid characters");
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) {
    throw new ValidationError("Valid phone number is required (7-15 digits)");
  }
  return phone;
}

/** Validate a message field (10–5000 chars). */
export function validateMessage(value: unknown): string {
  const message = typeof value === "string" ? sanitizeString(value) : "";
  if (!message || message.length < 10 || message.length > 5000) {
    throw new ValidationError("Message is required (10-5000 characters)");
  }
  return message;
}

/** Sanitize an optional string field. Returns empty string if not provided. */
export function optionalString(value: unknown): string {
  return typeof value === "string" ? sanitizeString(value) : "";
}

/** Check if an error is a validation error (for 400 responses). */
export function isValidationError(err: unknown): boolean {
  return err instanceof ValidationError;
}
