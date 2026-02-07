import { NextResponse } from "next/server";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateMessage,
  optionalString,
  ValidationError,
} from "@/lib/validation";
import { withApiHandler } from "@/lib/api-handler";
import { processContact } from "@/lib/services/contact-service";
import type { ContactPayload } from "@/lib/types";

function validateContact(data: unknown): ContactPayload {
  if (!data || typeof data !== "object") {
    throw new ValidationError("Invalid request body");
  }

  const body = data as Record<string, unknown>;

  const name = validateName(body.name);
  const email = validateEmail(body.email);
  const phone = validatePhone(body.phone);
  const organization = optionalString(body.organization);
  const service = optionalString(body.service);
  const message = validateMessage(body.message);
  const recaptchaToken =
    typeof body.recaptchaToken === "string" ? body.recaptchaToken : "";

  if (!service) {
    throw new ValidationError("Service selection is required");
  }

  return { name, email, phone, organization, service, message, recaptchaToken };
}

export const POST = withApiHandler(
  {
    scope: "contact-api",
    rateLimitPrefix: "contact",
    recaptchaAction: "contact_form",
  },
  async ({ body, log, referer }) => {
    const validated = validateContact(body);

    const result = await processContact(validated, { referer, log });

    return NextResponse.json({ success: true, contactId: result.contactId });
  }
);
