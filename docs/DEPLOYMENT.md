# Deployment Guide

How to deploy the Grow Ministry website to production.

---

## Hosting Platform

The site is designed for deployment on [Vercel](https://vercel.com/), which provides:

- Automatic builds from Git pushes
- Edge network CDN for global performance
- Automatic HTTPS via Let's Encrypt
- Preview deployments for pull requests
- Server-side rendering support for Next.js

---

## Prerequisites

- A [Vercel](https://vercel.com/) account
- The Git repository connected to Vercel
- Environment variables configured in Vercel dashboard

---

## Environment Variables

Configure these in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Value | Environments |
|----------|-------|-------------|
| `NEXT_PUBLIC_GHL_WEBHOOK_URL` | Your GoHighLevel webhook URL | Production, Preview |

---

## Deployment Steps

### Automatic Deployment (Recommended)

1. Push to the `main` branch
2. Vercel automatically detects the push, builds, and deploys
3. The production URL updates within a few minutes

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

### Manual Deployment

If you need to deploy without pushing to Git:

```bash
# Install Vercel CLI (one-time)
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## Build Process

Vercel runs the following automatically:

```bash
npm install        # Install dependencies
npm run build      # Next.js production build (next build)
```

### Build Output

The build produces:
- Static HTML for pages without dynamic data
- Server-rendered pages for routes with metadata
- Optimized JavaScript bundles (code-split per route)
- Optimized images (WebP/AVIF via `next/image`)

### Build Verification

Before pushing, verify the build succeeds locally:

```bash
npm run build
```

A successful build shows:

```
Route (app)                    Size     First Load JS
┌ ○ /                         XX kB    XXX kB
├ ○ /about                    XX kB    XXX kB
├ ○ /contact                  XX kB    XXX kB
...
✓ Compiled successfully
```

If the build fails, fix all errors before deploying. Common issues:
- TypeScript type errors
- Missing imports
- Invalid metadata exports

---

## Domain Configuration

### Custom Domain Setup

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add `growministry.com`
3. Add `www.growministry.com` (redirects to apex)
4. Update DNS records at your domain registrar:

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

### SSL/TLS

Vercel automatically provisions and renews SSL certificates via Let's Encrypt. No manual configuration needed.

---

## Post-Deployment Checklist

After each production deployment, verify:

- [ ] Home page loads correctly at `https://growministry.com`
- [ ] Navigation links work (all 12 pages)
- [ ] Images and hero banners display properly
- [ ] Three.js shader animation renders on homepage
- [ ] Travel map loads with markers
- [ ] Cookie consent banner appears for new visitors
- [ ] Exit-intent popup triggers on mouse leave (desktop)
- [ ] Chatbot opens and responds
- [ ] Contact form fields accept input
- [ ] Google Analytics tracking fires (check GA4 Realtime)
- [ ] Mobile navigation works (hamburger menu)
- [ ] PDF white papers download correctly
- [ ] JSON-LD structured data validates (use [Google Rich Results Test](https://search.google.com/test/rich-results))
- [ ] Page speed acceptable (use [PageSpeed Insights](https://pagespeed.web.dev/))

---

## Rollback

### Via Vercel Dashboard

1. Go to Vercel Dashboard → Project → Deployments
2. Find the last known good deployment
3. Click the three-dot menu → "Promote to Production"

### Via Git

```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

---

## Monitoring

### Google Analytics 4

- **Dashboard:** [analytics.google.com](https://analytics.google.com/)
- **Measurement ID:** `G-6BECJZFGLS`
- **Key metrics:** Page views, bounce rate, session duration, conversion events

### Vercel Analytics (Optional)

Enable in Vercel Dashboard → Project → Analytics for:
- Core Web Vitals (LCP, FID, CLS)
- Real-time visitor count
- Geographic distribution
- Device breakdown

### Error Monitoring

Sentry is configured for comprehensive error monitoring:
- **Client**: `sentry.client.config.ts` with PII redaction, session replay, and DOM breadcrumb sanitization
- **Server**: `sentry.server.config.ts` with PII redaction for exception values and breadcrumbs
- **Edge**: `sentry.edge.config.ts` with PII redaction for middleware errors
- CSP violation reports are sent to Sentry in production via `report-uri` directive
- Source maps are uploaded during build and deleted afterward to prevent exposure
- Sentry is integrated into API error handlers and ErrorBoundary components
- Additionally, Vercel's built-in error logs are available in the Functions tab

---

## Performance Optimization

### Current Optimizations

- Server-side rendering for initial page load
- `next/image` for automatic image optimization
- `next/font` for zero-layout-shift font loading
- `strategy="afterInteractive"` for GA4 (non-blocking)
- Code splitting per route (automatic via Next.js)

### Planned Optimizations

- Dynamic import for Three.js (`next/dynamic` with `ssr: false`)
- Image format conversion to WebP/AVIF
- Security headers via `next.config.ts`

---

## Staging Environment

Vercel automatically creates preview deployments for every Git branch:

1. Create a feature branch: `git checkout -b feature/my-change`
2. Push the branch: `git push origin feature/my-change`
3. Vercel builds a preview at `https://grow-ministry-website-<hash>.vercel.app`
4. Share the preview URL for review
5. Merge to `main` when approved → automatic production deployment
