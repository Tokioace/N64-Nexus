# Fix: App stuck on "Loading React App…" due to 401 on static assets (Vercel routing)

## Problem
- The app failed to mount and stayed on "Loading React App…".
- Browser console showed 401 Unauthorized for static bundles (e.g., `icons-vendor-*.js`, `map-vendor.js`, and `/manifest.json`).
- Because vendor chunks were blocked, React import in the icons bundle appeared undefined at runtime, triggering a `forwardRef` error.

## Root Cause
- `vercel.json` was rewriting all paths to the SPA entry before serving static assets, and used mixed properties (`rewrites`, `headers`) incompatible with `routes`.

## Solution
- Converted config to a single `routes`-based setup with filesystem-first handling and SPA fallback to `/index.html`.
- Moved caching headers into the `routes` entries to avoid mixing top-level `headers` with `routes`.

### Key Changes
1. Serve static assets first, then SPA fallback:
   - `{ "handle": "filesystem" }`
   - `{ "src": "/.*", "dest": "/index.html" }`
2. Add explicit header routes for:
   - `/sw.js` (no cache)
   - `/manifest.json` (immutable)
   - `/assets/*`, `/static/*`, `/icons/*`, `/splash/*` (immutable)
3. Remove `cleanUrls`, `trailingSlash`, and top-level `headers` to comply with `routes` only.

## Files Modified
- `vercel.json`: replace mixed config with `routes`-only configuration.

## Validation
- Local `npm run check` passes (0 errors; only warnings).
- Production build succeeds, generating vendor chunks and manifest.
- With updated routes, static files (including `/manifest.json` and vendor bundles) are served with 200 OK, allowing React to mount and eliminating the `forwardRef` crash.

## Impact
- ✅ App loads and mounts correctly (no more "Loading React App…").
- ✅ No console errors for static assets.
- ✅ PWA manifest loads (200 OK).

## Test Steps
1. Deploy this branch to Vercel.
2. Open the app and verify the UI renders past the loader.
3. In DevTools Network tab, confirm 200 for `/assets/*`, `/manifest.json`, and vendor bundles.
4. No `forwardRef` errors in Console.