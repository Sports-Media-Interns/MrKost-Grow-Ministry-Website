# Development Setup Guide

Complete guide to setting up the Grow Ministry website for local development.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Available Commands](#available-commands)
- [Project Configuration](#project-configuration)
- [Editor Setup](#editor-setup)
- [Running Locally](#running-locally)
- [Debugging Tips](#debugging-tips)
- [File Naming Conventions](#file-naming-conventions)
- [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [ ] **Node.js** 18.17 or later — [Download](https://nodejs.org/)
- [ ] **npm** 9+ (included with Node.js)
- [ ] **Git** — [Download](https://git-scm.com/)
- [ ] A code editor ([VS Code](https://code.visualstudio.com/) recommended)

### Optional Accounts

- [GoHighLevel](https://www.gohighlevel.com/) — for CRM webhook integration (lead capture forms)
- [Mapbox](https://www.mapbox.com/) — for map access token (currently hardcoded)

---

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Grow-Ministry-Website
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all production and development dependencies defined in `package.json`.

### Step 3: Configure Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and set your values:

```env
# GoHighLevel webhook for lead capture
NEXT_PUBLIC_GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/YOUR_WEBHOOK_ID
```

> **Note:** The site will run without this variable, but exit-intent and cookie consent lead capture will not function.

### Step 4: Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with cache clear |
| `npm run dev:fast` | Start dev server without cache clear (faster startup) |
| `npm run build` | Create optimized production build |
| `npm start` | Serve production build locally |
| `npm run lint` | Run ESLint checks |
| `npm run clean` | Delete `.next` build cache |

### When to Use Each Dev Command

- **`npm run dev`** — Use after pulling new changes, switching branches, or when you encounter stale cache issues. It clears the `.next` directory before starting.
- **`npm run dev:fast`** — Use for regular development when you haven't changed configuration files. Skips cache clear for faster startup.

---

## Project Configuration

### TypeScript (`tsconfig.json`)

- **Target:** ES2017
- **Strict mode:** Enabled
- **Path aliases:** `@/*` maps to the project root
- **Module resolution:** Bundler (for Next.js SWC)

### Tailwind CSS (`app/globals.css`)

Tailwind CSS 4 is configured via PostCSS. The design system uses CSS custom properties:

- Theme colors are defined as CSS variables in `:root` and `.dark` selectors
- Variables are mapped to Tailwind via `@theme inline` directive
- The `@tailwindcss/typography` plugin is included for rich text styling

### shadcn/ui (`components.json`)

- **Style:** New York
- **RSC:** Enabled (React Server Components)
- **Icon library:** Lucide
- **Base color:** Neutral
- **CSS variables:** Enabled

### ESLint

Uses `eslint-config-next` for Next.js-specific linting rules.

---

## Editor Setup

### VS Code (Recommended)

Install these extensions for the best experience:

1. **Tailwind CSS IntelliSense** — autocomplete for Tailwind classes
2. **TypeScript Importer** — auto-import TypeScript modules
3. **ESLint** — inline linting
4. **Prettier** — code formatting (optional)

### Recommended VS Code Settings

```json
{
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "editor.quickSuggestions": {
    "strings": "on"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## Running Locally

### Development Mode

```bash
npm run dev
```

Features in development mode:
- Hot Module Replacement (HMR) for instant updates
- Error overlay with stack traces
- React strict mode (double-renders in dev to catch bugs)

### Production Preview

To test the production build locally:

```bash
npm run build
npm start
```

This builds optimized assets and starts the production server at [http://localhost:3000](http://localhost:3000).

---

## Debugging Tips

### Common Issues

#### Port 3000 Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

Then restart with `npm run dev`.

#### Stale Cache

If you see outdated content or styling issues:

```bash
npm run clean
npm run dev
```

#### TypeScript Errors After Dependency Update

```bash
rm -rf node_modules package-lock.json
npm install
```

#### Tailwind Classes Not Applying

Ensure the class exists in Tailwind CSS 4. Some v3 classes have changed:
- `bg-opacity-50` → `bg-black/50` (use slash notation)
- Custom colors use CSS variables, not `tailwind.config.js`

#### Three.js / WebGL Errors

The shader animation component (`components/ui/shader-animation.tsx`) requires WebGL support. If running in an environment without GPU acceleration:
- The component should gracefully degrade
- Check browser console for WebGL context errors

#### Map Not Loading

The Mapbox map requires a valid access token. The token is currently hardcoded in `components/ui/travel-map.tsx`. If the map shows a blank area, verify the token is valid.

---

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Pages | `app/[route]/page.tsx` | `app/about/page.tsx` |
| Client components | `kebab-case.tsx` | `trip-planner.tsx` |
| UI components | `kebab-case.tsx` in `components/ui/` | `gradient-button.tsx` |
| Hooks | `use-kebab-case.ts` in `hooks/` | `use-media-query.ts` |
| Utilities | `kebab-case.ts` in `lib/` | `utils.ts` |

---

## Next Steps

- Read [`ARCHITECTURE.md`](ARCHITECTURE.md) to understand the system design
- Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before making changes
- Read [`DEPLOYMENT.md`](DEPLOYMENT.md) for deployment procedures
