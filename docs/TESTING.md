# Testing Guide

## Test Stack

- **Vitest** -- test runner and assertion library
- **React Testing Library** -- component rendering and DOM queries
- **jsdom** -- browser environment simulation

## Running Tests

```bash
# Watch mode (re-runs on file changes)
npx vitest

# Single run (CI / pre-commit)
npx vitest run

# Single run with coverage report
npx vitest run --coverage
```

## Test File Locations

All test files live in the `__tests__/` directory at the project root.

## Naming Convention

Test files use the suffix `.test.ts` for utility/logic tests and `.test.tsx` for component tests.

## Coverage Target

Aim for **80% coverage** on critical paths (API routes, form validation, lead capture logic). Non-critical UI-only code does not need to meet this threshold.
