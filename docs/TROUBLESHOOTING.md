# Troubleshooting

## Port 3000 Already in Use

The Next.js dev server automatically selects the next available port when 3000 is occupied. Check the terminal output after running `npm run dev` to see which port was assigned.

## Mapbox Map Not Loading

Verify that `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` is set in `.env.local` and contains a valid Mapbox access token. The token must have the correct scopes for the styles being used.

## reCAPTCHA Not Working

Two environment variables are required:

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` -- used client-side to render the reCAPTCHA widget
- `RECAPTCHA_SECRET_KEY` -- used server-side to verify tokens

Confirm both are present in `.env.local` and match the keys from the Google reCAPTCHA admin console.

## GA4 Not Tracking

Verify that `NEXT_PUBLIC_GA4_MEASUREMENT_ID` is set in `.env.local`. The value should start with `G-`. Analytics events will not fire in development unless explicitly configured.

## Contact Form Submission Fails

1. Confirm `GHL_WEBHOOK_URL` is set in `.env.local` and points to a valid GoHighLevel webhook.
2. Check the server logs (`npm run dev` terminal) for error details -- look for `400`, `502`, or network errors.

## Build Fails with Type Errors

Run the TypeScript compiler in check-only mode to surface the specific errors:

```bash
npx tsc --noEmit
```

Fix all reported issues before attempting the build again.

## CSS Not Loading / Stale Styles

Clear the Next.js build cache and restart the dev server:

```bash
npm run clean
npm run dev
```

This removes the `.next` directory and forces a fresh build.
