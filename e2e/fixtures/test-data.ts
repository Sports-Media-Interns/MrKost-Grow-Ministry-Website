/**
 * Test data factories for E2E tests.
 *
 * Each factory returns a fresh object with realistic placeholder values.
 * Use `randomEmail()` and `randomPhone()` when uniqueness matters
 * (e.g. avoiding duplicate-submission guards).
 */

let emailCounter = 0;

/** Generate a unique test email address. */
export function randomEmail(): string {
  emailCounter += 1;
  const timestamp = Date.now();
  return `test+${timestamp}-${emailCounter}@example.org`;
}

/** Generate a random US-style phone number in (555) XXX-XXXX format. */
export function randomPhone(): string {
  const digits = () =>
    String(Math.floor(Math.random() * 900) + 100); // 3-digit segment
  return `(555) ${digits()}-${Math.floor(Math.random() * 9000) + 1000}`;
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  service: string;
  message: string;
}

/** Create a complete set of contact-form field values. */
export function createContactData(
  overrides: Partial<ContactData> = {}
): ContactData {
  return {
    name: "Jane Doe",
    email: randomEmail(),
    phone: "(555) 987-6543",
    organization: "Hope Church",
    service: "Website Development & SEO",
    message: "We need a new website for our church.",
    ...overrides,
  };
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  type: string;
  source: string;
}

/** Create a complete set of lead-capture field values. */
export function createLeadData(overrides: Partial<LeadData> = {}): LeadData {
  return {
    name: "John Smith",
    email: randomEmail(),
    phone: randomPhone(),
    type: "church",
    source: "website",
    ...overrides,
  };
}
