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
- **Security:** reCAPTCHA v3 (server-side verification), rate limiting, input sanitization, CSP headers
- **Testing:** Vitest + React Testing Library + jsdom
- **CI/CD:** GitHub Actions (lint, type check, test, build)
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

lib/                    → Utilities
  utils.ts              → cn() — Tailwind class merge helper
  rate-limit.ts         → In-memory rate limiter for API routes
  sanitize.ts           → HTML/XSS sanitization for webhook payloads
  env.ts                → Environment variable validation and accessors
  recaptcha.ts          → reCAPTCHA v3 server-side verification

docs/                   → Documentation
  API.md                → API endpoint reference
  TESTING.md            → Test setup and conventions
  TROUBLESHOOTING.md    → Common issues and solutions

__tests__/              → Test files (Vitest)
  unit/api/             → API validation tests
  unit/hooks/           → Hook tests
  unit/lib/             → Utility tests

.github/                → GitHub configuration
  workflows/ci.yml      → CI pipeline (lint, type check, test, build)
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
npm run dev          # Dev server (clears .next cache first)
npm run dev:fast     # Dev server without cache clear
npm run build        # Production build
npm start            # Serve production build
npm run lint         # ESLint
npm run clean        # Delete .next cache
npx vitest           # Run tests in watch mode
npx vitest run       # Run tests once (CI)
```

## Environment Variables

All secrets and API keys are stored in `.env.local` (never committed). See `.env.example` for the full list:

| Variable | Scope | Purpose |
|----------|-------|---------|
| `GHL_WEBHOOK_URL` | Server | GoHighLevel webhook for API routes |
| `NEXT_PUBLIC_GHL_WEBHOOK_URL` | Client | GoHighLevel webhook for client-side forms |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Client | Mapbox GL map token |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Client | reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | Server | reCAPTCHA v3 server verification |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Client | Google Analytics 4 ID |

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
- CSP header configured in `next.config.ts`
- Lead API uses field whitelisting (no mass assignment)

### Accessibility
- Skip-to-content link in root layout
- `aria-expanded` on mobile menu toggle
- `role="log"` and `aria-live="polite"` on chatbot messages
- `role="dialog"` and `aria-modal` on modals/popups
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
- Coverage target: 80% on critical paths
- Run: `npx vitest run` (CI) or `npx vitest` (watch)
