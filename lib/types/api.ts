/**
 * Shared TypeScript interfaces for API routes and integrations.
 */

/** Payload shape for the contact form API (POST /api/contact). */
export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  organization: string;
  service: string;
  message: string;
  recaptchaToken: string;
}

/** Payload shape for the lead capture API (POST /api/lead). */
export interface LeadPayload {
  type: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  recaptchaToken: string;
  // Whitelisted extra fields (matching ALLOWED_EXTRA_FIELDS in lead/route.ts)
  organization?: string;
  service?: string;
  serviceName?: string;
  destinations?: string;
  groupSize?: string | number;
  travelDates?: string;
  travelMonth?: string;
  travelYear?: string;
  duration?: string;
  notes?: string;
  specialNeeds?: string;
  churchName?: string;
  offer?: string;
  tripType?: string;
  region?: string;
  [key: string]: unknown;
}

/** Standard API response returned by contact and lead endpoints. */
export interface ApiResponse {
  success: boolean;
  contactId?: string;
  error?: string;
}

/** Parameters accepted by createGHLContact(). */
export interface CreateContactParams {
  firstName: string;
  lastName?: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  tags: string[];
  source: string;
}

/** Shape of the JSON response from the GoHighLevel contacts API. */
export interface GHLContactResponse {
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  error?: string;
}
