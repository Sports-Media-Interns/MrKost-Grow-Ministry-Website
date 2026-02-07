# Contributing Guide

Guidelines for contributing to the Grow Ministry website.

---

## Code of Conduct

All contributors are expected to uphold the following standards:

- **Be respectful.** Treat everyone with courtesy and professionalism regardless of background, experience level, or perspective.
- **Be constructive.** Provide actionable feedback. Critique the work, not the person.
- **Be collaborative.** Share knowledge, help others learn, and work toward shared goals.
- **Be accountable.** Own your mistakes, learn from them, and help the team improve.
- **Be mission-aligned.** This project serves faith-based organizations. All contributions should respect and support that mission.

Unacceptable behavior includes harassment, personal attacks, trolling, and any conduct that creates a hostile environment. Issues should be reported to info@growministry.com.

---

## Getting Started

1. Read the [Setup Guide](SETUP.md) to configure your development environment
2. Read the [Architecture](ARCHITECTURE.md) to understand the system design
3. Follow the coding standards below for all changes

---

## How to Submit Issues

### Bug Reports

Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser and OS
- Screenshots (if visual)
- Console errors (if applicable)

### Feature Requests

Include:
- Description of the feature
- Use case and business value
- Proposed implementation approach (optional)
- Mockups or wireframes (if available)

---

## How to Submit Changes

### Branch Naming

```
feature/short-description    # New features
fix/short-description        # Bug fixes
docs/short-description       # Documentation changes
refactor/short-description   # Code improvements
```

### Pull Request Process

1. Create a branch from `main`
2. Make your changes following the coding standards below
3. Verify the build passes: `npm run build`
4. Run the linter: `npm run lint`
5. Create a pull request with a clear description
6. Request review from a team member

### PR Description Template

```markdown
## What Changed
Brief description of the changes.

## Why
Reason for the change (link to issue if applicable).

## Testing
Steps to verify the changes work correctly.

## Screenshots
Before/after screenshots for visual changes.
```

---

## Coding Standards

### TypeScript

- **Strict mode** is enabled - all code must pass strict type checking
- Use explicit types for function parameters and return values
- Prefer `interface` over `type` for object shapes
- Use `import type` for type-only imports

```tsx
// Good
import type { Metadata } from "next";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

// Avoid
const props: any = {};
```

### React Components

- **Server components** by default (no directive needed)
- Add `"use client"` only when the component needs browser APIs, state, or event handlers
- Export components as named exports (not default) for UI components
- Page components use default export (Next.js requirement)

```tsx
// Server component (default)
export default function AboutPage() { ... }

// Client component (when needed)
"use client";
export function ContactForm() { ... }
```

### File Organization

- Page-specific client components live next to their page:
  ```
  app/travel/
  ├── page.tsx              # Server component (page)
  ├── trip-planner.tsx      # Client component (page-specific)
  └── destination-tabs.tsx  # Client component (page-specific)
  ```
- Shared components live in `components/ui/`
- Custom hooks live in `hooks/`
- Utility functions live in `lib/`

### Styling

- Use Tailwind CSS utility classes
- Use the design system tokens (not raw hex values):
  ```tsx
  // Good
  <p className="text-muted-foreground">...</p>
  <div className="bg-primary text-primary-foreground">...</div>

  // Avoid
  <p style={{ color: "#5c5e64" }}>...</p>
  <div className="bg-[#161821] text-[#f8f9f7]">...</div>
  ```
- Use `cn()` from `lib/utils.ts` for conditional classes:
  ```tsx
  import { cn } from "@/lib/utils";
  <div className={cn("base-class", isActive && "active-class")} />
  ```
- Heading font: `font-[family-name:var(--font-playfair)]`
- Section pattern: `py-24 px-4` with `mx-auto max-w-screen-xl`

### Imports

- Use the `@/` path alias for all project imports:
  ```tsx
  // Good
  import { GradientButton } from "@/components/ui/gradient-button";
  import { cn } from "@/lib/utils";

  // Avoid
  import { GradientButton } from "../../components/ui/gradient-button";
  ```
- Order imports: React/Next → external libraries → project imports → types

### SEO

Every page must export a `metadata` object:

```tsx
export const metadata: Metadata = {
  title: "Page Title",  // Uses template: "%s | Grow Ministry"
  description: "Description for search engines (150-160 chars).",
  keywords: ["relevant", "keywords"],
  openGraph: {
    title: "OG Title",
    description: "OG Description",
    url: "https://growministry.com/page-path",
  },
  twitter: {
    title: "Twitter Title",
    description: "Twitter Description",
  },
};
```

Key pages should also include JSON-LD structured data for rich search results.

---

## Commit Messages

Use clear, descriptive commit messages:

```
Add trip planner wizard to travel page

Wire contact form to GoHighLevel webhook

Fix mobile nav not closing on link click

Update pricing card layout for small screens
```

Format:
- Start with a verb (Add, Fix, Update, Remove, Refactor)
- Use imperative mood ("Add feature" not "Added feature")
- Keep the first line under 72 characters
- Add a blank line and details if needed

---

## Testing

### Before Submitting

1. **Build check:** `npm run build` must complete with zero errors
2. **Lint check:** `npm run lint` must pass
3. **Visual check:** Test all affected pages in the browser
4. **Responsive check:** Test at mobile (375px), tablet (768px), and desktop (1280px+) widths
5. **Cross-browser:** Test in Chrome and at least one other browser (Firefox, Safari, Edge)

### What to Test

- Navigation links work correctly
- Forms accept input and validate
- Interactive components respond to user actions
- Images load and display at correct sizes
- Animations play smoothly
- Content is readable at all viewport sizes

---

## Code Review Guidelines

### For Reviewers

- Check that the build passes
- Verify TypeScript types are correct (no `any`)
- Confirm Tailwind classes use design system tokens
- Check for accessibility (semantic HTML, alt text, keyboard navigation)
- Verify SEO metadata is present on new pages
- Look for hardcoded values that should be variables
- Confirm responsive behavior at key breakpoints

### For Authors

- Respond to all review comments
- Make requested changes in new commits (don't force-push during review)
- Re-request review after addressing feedback
