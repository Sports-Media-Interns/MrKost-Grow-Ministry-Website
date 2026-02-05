# Grow Ministry

**AI-Powered Digital Solutions for Churches & Ministries**

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![SDVOSB](https://img.shields.io/badge/SDVOSB-Certified-green)]()
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

Grow Ministry is the public-facing website for a veteran-owned, SDVOSB-certified digital agency serving faith-based organizations. The site showcases AI-powered services including CRM, social media management, AI telephone agents, website development, ministry travel, and branded merchandise.

---

## Features

### Completed
- 12-page responsive website with server-side rendering
- Interactive 3D WebGL shader animations (Three.js)
- Mapbox GL interactive travel map with 30+ destination markers
- Multi-step trip planner wizard (4-step flow)
- Destination browser with regional tab filtering
- AI chatbot interface with guided conversation flow
- Exit-intent popup with lead capture (GoHighLevel CRM integration)
- Cookie consent banner with preference management
- Service pricing with monthly/annual toggle and confetti animations
- FAQ accordion with category filtering
- Booking calendar integration
- Full SEO optimization with JSON-LD structured data on all pages
- Google Analytics 4 integration
- Responsive navigation with mobile hamburger menu
- 7 downloadable PDF white papers

### Planned
- Server-side form submission (contact, service modal)
- Programmatic sitemap.xml and robots.txt
- Test suite (unit, integration, e2e)
- Error boundaries and loading states

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| UI Library | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) + CSS custom properties |
| Component Primitives | [Radix UI](https://www.radix-ui.com/) (Label, Switch, Slot) |
| Component System | [shadcn/ui](https://ui.shadcn.com/) (New York style) |
| Icons | [Lucide React](https://lucide.dev/) |
| 3D Graphics | [Three.js](https://threejs.org/) (WebGL shader animations) |
| Maps | [Mapbox GL JS](https://www.mapbox.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Effects | [canvas-confetti](https://github.com/catdad/canvas-confetti) |
| Number Animation | [@number-flow/react](https://number-flow.barvian.me/) |
| CRM Integration | [GoHighLevel](https://www.gohighlevel.com/) (webhook) |
| Analytics | Google Analytics 4 |
| Fonts | Inter (sans), Playfair Display (display) via `next/font` |
| Linting | ESLint 9 + eslint-config-next |
| Build | SWC (via Next.js) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.17 or later
- [npm](https://www.npmjs.com/) 9+ (ships with Node.js)
- A [Mapbox](https://www.mapbox.com/) access token (for the travel map; currently hardcoded)
- A [GoHighLevel](https://www.gohighlevel.com/) webhook URL (for lead capture forms)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd Grow-Ministry-Website

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual values

# 4. Start the development server
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GHL_WEBHOOK_URL` | Yes | GoHighLevel webhook URL for lead capture (exit-intent, cookie consent) |

See [`.env.example`](.env.example) for a template with placeholder values.

> **Note:** The Google Analytics 4 measurement ID (`G-6BECJZFGLS`) and Mapbox access token are currently hardcoded. These should be moved to environment variables in a future update.

---

## Project Structure

```
Grow-Ministry-Website/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (fonts, analytics, global components)
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Tailwind config, CSS variables, gradient animations
│   ├── icon.png                  # Favicon
│   ├── about/page.tsx            # About page
│   ├── contact/
│   │   ├── page.tsx              # Contact page
│   │   ├── contact-form.tsx      # Contact form (client component)
│   │   └── booking-calendar.tsx  # Booking calendar (client component)
│   ├── services/
│   │   ├── page.tsx              # Services page
│   │   ├── services-interactive.tsx  # Interactive service explorer
│   │   └── services-pricing.tsx  # Pricing toggle component
│   ├── travel/
│   │   ├── page.tsx              # Travel ministry page
│   │   ├── trip-planner.tsx      # 4-step trip planner wizard
│   │   └── destination-tabs.tsx  # Regional destination browser
│   ├── faq/
│   │   ├── page.tsx              # FAQ page
│   │   └── faq-accordion.tsx     # Accordion component
│   ├── privacy-policy/page.tsx   # Privacy policy
│   ├── terms/page.tsx            # Terms of service
│   ├── cookie-policy/page.tsx    # Cookie policy
│   ├── copyright-policy/page.tsx # Copyright policy
│   └── sitemap/page.tsx          # HTML sitemap
├── components/ui/                # Reusable UI components
│   ├── navbar.tsx                # Main navigation
│   ├── footer-column.tsx         # 4-column footer
│   ├── chatbot.tsx               # AI chatbot interface
│   ├── cookie-consent.tsx        # Cookie consent banner
│   ├── exit-intent.tsx           # Exit-intent popup
│   ├── service-modal.tsx         # Service detail modal
│   ├── gradient-button.tsx       # Animated gradient button
│   ├── shader-animation.tsx      # Three.js WebGL animations
│   ├── travel-map.tsx            # Mapbox GL map
│   ├── travel-map-wrapper.tsx    # Map lazy-load wrapper
│   ├── pricing.tsx               # Pricing card component
│   ├── dock-tabs.tsx             # Tab navigation
│   ├── button.tsx                # Base button (shadcn/ui)
│   ├── label.tsx                 # Form label (Radix UI)
│   └── switch.tsx                # Toggle switch (Radix UI)
├── hooks/                        # Custom React hooks
│   └── use-media-query.ts        # Responsive breakpoint hook
├── lib/                          # Utility functions
│   └── utils.ts                  # Tailwind `cn()` merge utility
├── public/                       # Static assets
│   ├── downloads/                # 7 PDF white papers
│   └── images/                   # Logos, heroes, service images
├── docs/                         # Project documentation
│   ├── SETUP.md                  # Development environment guide
│   ├── ARCHITECTURE.md           # System architecture
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── CONTRIBUTING.md           # Contribution guidelines
│   └── CHANGELOG.md              # Version history
├── .env.example                  # Environment variable template
├── .env.local                    # Local environment variables (git-ignored)
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── postcss.config.mjs            # PostCSS configuration
├── components.json               # shadcn/ui configuration
├── CLAUDE.md                     # AI agent project context
├── LICENSE                       # License
└── README.md                     # This file
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (clears `.next` cache first) |
| `npm run dev:fast` | Start dev server without cache clear |
| `npm run build` | Create production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run clean` | Delete `.next` build cache |

---

## Architecture

The website follows Next.js 15 App Router conventions:

- **Server Components** (default): All pages render on the server for SEO and performance. Metadata exports on each page provide title, description, keywords, Open Graph, and Twitter Card tags.
- **Client Components** (`"use client"`): Interactive features like the chatbot, maps, trip planner, pricing toggle, and form components are client-side.
- **CSS Variables**: The design system uses CSS custom properties defined in `globals.css`, mapped through Tailwind's `@theme` directive for consistent theming.
- **No Backend API**: The site is frontend-only. Form submissions target external GoHighLevel webhooks via `fetch()` calls from client components.

For detailed architecture documentation, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#161821` | Dark navy — headings, buttons, backgrounds |
| `--primary-foreground` | `#f8f9f7` | Light text on primary backgrounds |
| `--accent` | `#c1c5b3` | Sage green — highlights, icons, badges |
| `--muted` | `#f0f1ec` | Light sections, alternate backgrounds |
| `--muted-foreground` | `#5c5e64` | Body text, secondary content |
| `--border` | `#e2e3de` | Card borders, dividers |

**Fonts:**
- **Inter** (`--font-inter`): Body text, UI elements
- **Playfair Display** (`--font-playfair`): Headings, display text — applied via `font-[family-name:var(--font-playfair)]`

---

## Deployment

The project is configured for deployment on [Vercel](https://vercel.com/). See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for full deployment instructions.

```bash
# Build and verify locally
npm run build
npm start
```

---

## Contributing

See [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) for contribution guidelines, coding standards, and PR process.

---

## License

This project is proprietary software owned by Dakdan Worldwide LLC. See [`LICENSE`](LICENSE) for details.

---

## Contact

- **Website:** [growministry.com](https://growministry.com)
- **Email:** info@growministry.com
- **Phone:** (970) 426-0844
- **Location:** Severance, Colorado

**Grow Ministry** is a [Dakdan Worldwide](https://dakdanworldwide.com) company. SDVOSB Certified | CAGE Code: 9W3P6 | UEI: H5BQG2J7JRB4
