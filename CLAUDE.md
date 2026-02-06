# CLAUDE.md — Grow Ministry Website

## Project Overview

Public-facing website for Grow Ministry, a veteran-owned (SDVOSB) digital agency serving churches and faith-based organizations. Built with Next.js 15 App Router, React 19, TypeScript 5, and Tailwind CSS 4.

## Tech Stack

- **Framework:** Next.js 15.3.2 (App Router, server components default)
- **Language:** TypeScript 5 (strict mode)
- **UI:** React 19 + Tailwind CSS 4 + shadcn/ui (New York style) + Radix UI
- **Icons:** Lucide React
- **3D:** Three.js (WebGL shader animations on homepage hero)
- **Maps:** Mapbox GL JS (travel page, 30+ markers)
- **Animations:** Framer Motion + canvas-confetti
- **CRM:** GoHighLevel webhooks (lead capture)
- **Analytics:** Google Analytics 4 (via env var `NEXT_PUBLIC_GA4_MEASUREMENT_ID`)
- **Security:** reCAPTCHA v3 (server-side verification), Upstash Redis rate limiting, sanitize-html, nonce-based CSP via middleware
- **Monitoring:** Sentry (client + server + edge), session replay on errors
- **Database:** Supabase (RLS enabled, service_role only)
- **Testing:** Vitest + React Testing Library + jsdom + Playwright (E2E)
- **CI/CD:** GitHub Actions (lint, type check, test, build, E2E, deploy)
- **Fonts:** Inter (sans) + Playfair Display (headings), loaded via `next/font/google`

## Project Structure

```
app/                    → Pages (App Router)
  layout.tsx            → Root layout: fonts, GA4 scripts, skip-to-content, Navbar, CookieConsent, ExitIntent, Chatbot
  page.tsx              → Home page
  globals.css           → Tailwind @theme, CSS variables, gradient-button animations
  about/page.tsx        → About page (CEO bio, certifications, timeline)
  contact/              → Contact page + form + booking calendar
  services/             → Services + interactive explorer + pricing
  travel/               → Travel page + trip planner wizard + destination tabs
  faq/                  → FAQ page + accordion
  [legal pages]         → privacy-policy, terms, cookie-policy, copyright-policy, sitemap
  api/contact/route.ts  → Contact form API (rate-limited, sanitized, reCAPTCHA verified)
  api/lead/route.ts     → Lead capture API (rate-limited, sanitized, whitelisted fields)

components/ui/          → Reusable components
  navbar.tsx            → Header nav (mobile hamburger + desktop links, aria-expanded)
  footer-column.tsx     → 4-column footer with social links
  chatbot.tsx           → Chat interface with knowledge base (aria-live, role="log")
  cookie-consent.tsx    → Cookie banner → sends to GHL webhook
  exit-intent.tsx       → Exit popup → sends to GHL webhook (role="dialog")
  shader-animation.tsx  → Three.js WebGL (homepage hero)
  travel-map.tsx        → Mapbox GL interactive map (token via env var)
  service-modal.tsx     → Service detail modal with form
  gradient-button.tsx   → Animated gradient CTA button
  pricing.tsx           → Pricing card with number flow animation

hooks/                  → Custom hooks
  use-media-query.ts    → Responsive breakpoint detection
  use-focus-trap.ts     → Focus trap for modals/dialogs (a11y)

middleware.ts             → Nonce-based CSP generation per request

lib/                    → Utilities
  utils.ts              → cn() — Tailwind class merge helper
  rate-limit.ts         → Upstash Redis rate limiter with in-memory fallback
  sanitize.ts           → sanitize-html based XSS prevention for payloads
  env.ts                → Zod-based environment variable validation and accessors
  recaptcha.ts          → reCAPTCHA v3 server-side verification
  recaptcha-client.ts   → Shared reCAPTCHA client-side script loader + token getter
  social-links.ts       → Shared social media links array
  ghl.ts                → GoHighLevel CRM API client
  supabase.ts           → Supabase admin client
  validation.ts         → Input validators (name, email, phone, message)

docs/                   → Documentation
  API.md                → API endpoint reference
  TESTING.md            → Test setup and conventions
  TROUBLESHOOTING.md    → Common issues and solutions

__tests__/              → Test files (Vitest)
  unit/api/             → API validation tests
  unit/hooks/           → Hook tests
  unit/lib/             → Utility tests

.github/                → GitHub configuration
  workflows/ci.yml      → CI pipeline (lint, type check, test, build, E2E)
  workflows/deploy.yml  → CD pipeline (Vercel preview + production)
  ISSUE_TEMPLATE/       → Bug report and feature request templates
  pull_request_template.md → PR template
```

## Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout — global metadata, GA4 (env var), skip-to-content, nav, footer |
| `app/globals.css` | Design tokens (CSS vars), Tailwind theme mapping, gradient animations |
| `components.json` | shadcn/ui config (New York style, Lucide icons) |
| `.env.local` | Environment variables (git-ignored) |
| `.env.example` | Template with all required/optional env vars documented |
| `vitest.config.ts` | Test runner configuration |

## Development Commands

```bash
pnpm dev             # Dev server (clears .next cache first)
pnpm dev:fast        # Dev server without cache clear
pnpm build           # Production build
pnpm start           # Serve production build
pnpm lint            # ESLint
pnpm clean           # Delete .next cache
pnpm test            # Run tests once (CI)
pnpm test:watch      # Run tests in watch mode
pnpm test:e2e        # Run Playwright E2E tests
```

## Environment Variables

All secrets and API keys are stored in `.env.local` (never committed). See `.env.example` for the full list:

| Variable | Scope | Purpose |
|----------|-------|---------|
| `GHL_WEBHOOK_URL` | Server | GoHighLevel webhook for API routes |
| `GHL_API_TOKEN` | Server | GoHighLevel API bearer token |
| `GHL_LOCATION_ID` | Server | GoHighLevel location ID |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Client | Mapbox GL map token |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Client | reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | Server | reCAPTCHA v3 server verification |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Client | Google Analytics 4 ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Client | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Supabase service role key |
| `UPSTASH_REDIS_REST_URL` | Server | Upstash Redis for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Server | Upstash Redis auth token |
| `NEXT_PUBLIC_SENTRY_DSN` | Client | Sentry error tracking DSN |
| `HEALTH_CHECK_TOKEN` | Server | Bearer token for /api/health endpoint |

## Coding Standards

### Component Patterns
- Pages are **server components** by default (for SEO metadata exports)
- Interactive features use `"use client"` directive in separate files
- Client components are co-located with their page (e.g., `travel/trip-planner.tsx`)
- Shared components live in `components/ui/`

### Styling
- Use Tailwind utility classes, not inline styles
- Design tokens are CSS custom properties in `globals.css` → mapped to Tailwind via `@theme`
- Color palette: `primary` (#161821), `accent` (#c1c5b3), `muted` (#f0f1ec)
- Heading font: `font-[family-name:var(--font-playfair)]`
- Body font: `font-sans` (Inter, configured in theme)
- Use `cn()` from `lib/utils.ts` for conditional class merging

### Security
- All API routes use rate limiting (5 req/min per IP)
- All user input is sanitized before webhook forwarding
- reCAPTCHA v3 tokens are verified server-side
- API keys and secrets are loaded from environment variables
- Nonce-based CSP configured in `middleware.ts` with `strict-dynamic`
- Lead API uses field whitelisting (no mass assignment)

### Accessibility
- Skip-to-content link in root layout
- `aria-expanded` on mobile menu toggle
- `aria-current="page"` on active nav links
- `role="log"` and `aria-live="polite"` on chatbot messages
- `role="dialog"` and `aria-modal` on modals/popups with focus traps
- All interactive elements have `aria-label`
- Form inputs have associated `<label>` elements

### Naming
- Page files: `app/[route]/page.tsx`
- Client components: descriptive kebab-case (e.g., `trip-planner.tsx`, `contact-form.tsx`)
- UI components: kebab-case in `components/ui/`

### Imports
- Use `@/` path alias (maps to project root)
- Example: `import { GradientButton } from "@/components/ui/gradient-button"`

### SEO
- Every page exports a `metadata` object with title, description, keywords, openGraph, twitter
- Title template: `%s | Grow Ministry` (set in root layout)
- Key pages include JSON-LD structured data via `<script type="application/ld+json">`

## Git Workflow

- Main branch: `main`
- CI/CD: GitHub Actions runs lint, type check, test, and build on all PRs
- `.env.local` is git-ignored
- Build output (`.next/`) is git-ignored

## Testing

- Framework: Vitest + React Testing Library + jsdom
- Test location: `__tests__/` directory
- Coverage: `lib/`, `components/ui/`, `app/api/`, `hooks/` — 70% CI threshold
- Run: `pnpm test` (CI) or `pnpm test:watch` (watch)
- E2E: Playwright — `pnpm test:e2e`
