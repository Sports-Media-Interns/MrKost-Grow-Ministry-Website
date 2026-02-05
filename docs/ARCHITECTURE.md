# Architecture

System architecture and design decisions for the Grow Ministry website.

## Table of Contents

- [System Overview](#system-overview)
- [Component Architecture](#component-architecture)
- [Data Flow](#data-flow)
- [Technology Decisions](#technology-decisions)
- [Security Model](#security-model)
- [Design System](#design-system)
- [Key Design Decisions](#key-design-decisions)

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Next.js App Router                     │ │
│  │                                                          │ │
│  │  ┌──────────────┐   ┌──────────────────────────────────┐│ │
│  │  │ Server       │   │ Client Components                ││ │
│  │  │ Components   │   │                                  ││ │
│  │  │              │   │  Chatbot    Travel Map           ││ │
│  │  │  Pages       │   │  Trip Planner  Pricing Toggle   ││ │
│  │  │  Layouts     │   │  Contact Form  Exit Intent      ││ │
│  │  │  Metadata    │   │  Cookie Consent  FAQ Accordion  ││ │
│  │  │  JSON-LD     │   │  Shader Animation  Navbar       ││ │
│  │  └──────────────┘   └──────────────────────────────────┘│ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                                │
│                    ┌─────────┴──────────┐                    │
│                    │  External Services  │                    │
│                    │                     │                    │
│                    │  GoHighLevel CRM    │                    │
│                    │  Google Analytics   │                    │
│                    │  Mapbox GL          │                    │
│                    │  Google Fonts       │                    │
│                    └────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Rendering Strategy

The site uses Next.js 15 App Router with a hybrid rendering approach:

| Component Type | Rendering | Why |
|---------------|-----------|-----|
| Page layouts | Server | SEO metadata, initial HTML |
| Static content sections | Server | No interactivity needed |
| Navigation | Client | Mobile menu state, scroll detection |
| Forms | Client | User input, validation, submission |
| Maps | Client | Mapbox GL requires DOM access |
| Animations | Client | Three.js, Framer Motion need browser APIs |
| Chatbot | Client | Conversation state management |
| Popups | Client | User interaction triggers |

### Component Hierarchy

```
RootLayout (server)
├── <Script> — Google Analytics 4
├── Navbar (client) — Navigation with mobile toggle
├── {children} — Page content (server)
│   └── [Page-specific client components]
├── CookieConsent (client) — Cookie banner with GHL webhook
├── ExitIntent (client) — Exit popup with GHL webhook
└── Chatbot (client) — Chat interface
```

### Page Structure Pattern

Each page follows this pattern:

```tsx
// app/[route]/page.tsx (SERVER component)

import type { Metadata } from "next";

// 1. SEO metadata export
export const metadata: Metadata = {
  title: "Page Title",
  description: "...",
  keywords: [...],
  openGraph: {...},
  twitter: {...},
};

// 2. Page component
export default function PageName() {
  return (
    <main>
      {/* JSON-LD structured data */}
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero section */}
      <section>...</section>

      {/* Content sections */}
      <section>...</section>

      {/* Client components imported as needed */}
      <ClientComponent />

      {/* CTA section */}
      <section>...</section>

      {/* Footer */}
      <Footer4Col />
    </main>
  );
}
```

---

## Data Flow

### Lead Capture Flow

```
User interaction (exit intent / cookie consent / form)
    │
    ▼
Client component captures data
    │
    ▼
fetch() POST to GoHighLevel webhook URL
    │
    ▼
GoHighLevel CRM processes lead
    │
    ▼
localStorage flag set to prevent repeat popups
```

### Analytics Flow

```
Page load
    │
    ▼
next/script loads gtag.js (afterInteractive strategy)
    │
    ▼
GA4 config sent with measurement ID
    │
    ▼
Page views tracked automatically by GA4
```

### Chatbot Flow

```
User clicks chat icon
    │
    ▼
Chatbot opens with greeting
    │
    ▼
Pre-defined conversation tree:
  ├── Services inquiry → service details → CTA
  ├── Pricing question → pricing info → CTA
  ├── Contact request → contact info display
  └── General question → helpful response → CTA
```

---

## Technology Decisions

### Why Next.js 15 App Router?

- Server-side rendering for SEO (critical for a marketing site)
- Metadata API for per-page SEO without manual `<head>` management
- React Server Components reduce client-side JavaScript
- Built-in image optimization via `next/image`
- File-based routing matches the flat page structure

### Why Tailwind CSS 4?

- CSS-first configuration (no `tailwind.config.js`)
- `@theme` directive maps CSS variables directly to Tailwind utilities
- Smaller runtime than CSS-in-JS alternatives
- Utility-first approach enables rapid UI development

### Why shadcn/ui?

- Copy-paste components (no black-box dependency)
- Built on Radix UI primitives (accessible by default)
- Customizable via CSS variables and Tailwind
- New York style variant for a clean, professional look

### Why Three.js?

- Hero section requires GPU-accelerated shader animations
- Creates a premium visual impression for a tech company website
- WebGL provides smooth 60fps animations

### Why Mapbox GL?

- 30+ interactive destination markers on the travel page
- Fly-to animations on marker click
- Custom popups with rich HTML content
- Better developer experience than Google Maps for marker-heavy use cases

### Why GoHighLevel?

- Client's existing CRM platform
- Webhook-based integration requires no server-side code
- Handles lead routing, email sequences, and follow-up automatically

---

## Security Model

### Current State

| Area | Status | Notes |
|------|--------|-------|
| Environment variables | Partial | GHL webhook is `NEXT_PUBLIC_` (exposed to client) |
| Input validation | Client-only | Forms validate on client, no server validation |
| CORS | N/A | No API routes |
| Authentication | N/A | Public website, no user accounts |
| Content Security | Basic | No CSP headers configured |
| HTTPS | Enforced | Via Vercel deployment |
| Cookie consent | Implemented | Banner with accept/decline |

### Planned Improvements

- Move webhook URL to server-side API route
- Add security headers in `next.config.ts` (CSP, HSTS, X-Frame-Options)
- Add server-side form validation
- Make GA4 conditional on cookie consent

---

## Design System

### Color Palette

```
Primary:     #161821  (dark navy)     — headings, backgrounds, CTAs
Foreground:  #f8f9f7  (off-white)     — text on primary
Accent:      #c1c5b3  (sage green)    — highlights, icons, badges
Muted:       #f0f1ec  (light gray)    — alternate section backgrounds
Muted FG:    #5c5e64  (medium gray)   — body text, descriptions
Border:      #e2e3de  (light border)  — card borders, dividers
Destructive: #dc2626  (red)           — error states
```

### Typography

| Role | Font | CSS |
|------|------|-----|
| Body | Inter | `font-sans` (default) |
| Headings | Playfair Display | `font-[family-name:var(--font-playfair)]` |

### Spacing & Layout

- Max content width: `max-w-screen-xl` (1280px)
- Section padding: `py-24 px-4`
- Card border radius: `rounded-xl`
- Card pattern: `border border-border bg-background rounded-xl p-6`
- Grid: Responsive columns using `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### Button Variants

| Variant | Component | Usage |
|---------|-----------|-------|
| Primary CTA | `<GradientButton>` | Main calls-to-action |
| Secondary CTA | `<GradientButton variant="variant">` | Secondary actions |
| Standard | `<Button>` (shadcn/ui) | Form submissions, UI actions |

---

## Key Design Decisions

### 1. No Backend API

**Decision:** Frontend-only with external webhook integration.

**Rationale:** The site is a marketing presence, not a web application. Form submissions go directly to GoHighLevel CRM via webhooks. This eliminates server infrastructure, reduces complexity, and leverages the client's existing CRM investment.

**Trade-off:** Webhook URL is exposed in client-side code. Future improvement: add a thin API route as a proxy.

### 2. Co-located Client Components

**Decision:** Client components live alongside their page, not in `components/ui/`.

**Rationale:** Page-specific interactive components (trip planner, contact form, FAQ accordion) are tightly coupled to their page. Co-location makes dependencies clear and avoids orphaned components.

**Pattern:** `app/travel/trip-planner.tsx` is only used by `app/travel/page.tsx`.

### 3. CSS Variables Over Tailwind Config

**Decision:** Design tokens defined as CSS custom properties, mapped through `@theme`.

**Rationale:** Tailwind CSS 4 encourages CSS-first configuration. CSS variables enable runtime theming (dark mode) and work with non-Tailwind contexts (Three.js, Mapbox popups).

### 4. Static Content Over CMS

**Decision:** All page content is hardcoded in TSX files.

**Rationale:** Content changes are infrequent and managed by the development team. A CMS adds complexity, cost, and latency without sufficient benefit for the current content volume. If content updates become frequent, a headless CMS (Sanity, Contentful) could be integrated.
