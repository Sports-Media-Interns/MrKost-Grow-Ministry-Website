# API Reference

All API routes are located under `/api/` and accept `POST` requests with JSON bodies.

---

## POST /api/contact

Validates and forwards a contact form submission to the GoHighLevel CRM webhook.

### Request Body

| Field            | Type   | Required | Constraints                  |
| ---------------- | ------ | -------- | ---------------------------- |
| `name`           | string | Yes      | 2-200 characters             |
| `email`          | string | Yes      | Valid email address           |
| `phone`          | string | Yes      | 7-15 digits                  |
| `organization`   | string | No       |                              |
| `service`        | string | Yes      |                              |
| `message`        | string | Yes      | 10-5000 characters           |
| `recaptchaToken` | string | No       | Google reCAPTCHA v3 token     |

### Responses

| Status | Body                                          | Description                                |
| ------ | --------------------------------------------- | ------------------------------------------ |
| 200    | `{ "success": true }`                         | Payload validated and forwarded to webhook |
| 400    | `{ "error": "<validation details>" }`         | Request body failed validation             |
| 429    | `{ "error": "Too many requests" }`            | Rate limit exceeded (5 req/min)            |
| 500    | `{ "error": "Internal server error" }`        | Unexpected server-side failure             |
| 502    | `{ "error": "Webhook error" }`                | GoHighLevel webhook did not respond OK     |

---

## POST /api/lead

Validates and forwards a lead capture submission to the GoHighLevel CRM webhook. Supports additional whitelisted fields beyond the core set.

### Request Body

| Field   | Type   | Required | Constraints          |
| ------- | ------ | -------- | -------------------- |
| `type`  | string | Yes      |                      |
| `name`  | string | Yes      | 2-200 characters     |
| `email` | string | Yes      | Valid email address   |
| `phone` | string | No       |                      |
| `source`| string | No       | Defaults to `type`   |

#### Whitelisted Extra Fields

The following optional fields are forwarded if present:

`organization`, `service`, `destinations`, `groupSize`, `travelDates`, `duration`, `notes`

### Responses

| Status | Body                                          | Description                                |
| ------ | --------------------------------------------- | ------------------------------------------ |
| 200    | `{ "success": true }`                         | Payload validated and forwarded to webhook |
| 400    | `{ "error": "<validation details>" }`         | Request body failed validation             |
| 429    | `{ "error": "Too many requests" }`            | Rate limit exceeded (5 req/min)            |
| 500    | `{ "error": "Internal server error" }`        | Unexpected server-side failure             |
| 502    | `{ "error": "Webhook error" }`                | GoHighLevel webhook did not respond OK     |

---

## Rate Limiting

All API endpoints enforce a limit of **5 requests per minute per IP address**. Requests that exceed this limit receive a `429` response.

## Authentication

The API is public and requires no authentication. Abuse prevention relies on:

- **reCAPTCHA v3** token verification (where provided)
- **IP-based rate limiting** (5 req/min)
