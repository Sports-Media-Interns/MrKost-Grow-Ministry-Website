// Type re-export only — the TravelMap component has been merged into
// travel-map-wrapper.tsx to prevent Sentry's withSentryConfig from creating
// a separate webpack chunk that gets corrupted.
// This file exists for backward-compatible type imports.
export type { TravelLocation } from "./travel-map-wrapper"
