Title: Merge origin/Features into main — synchronize divergence (122 ahead / 34 behind)

Summary
- This PR merges the long-lived `origin/Features` branch into `main` to bring `main` fully up to date with recent feature work.
- Divergence at time of merge: `origin/Features` was 122 commits ahead and 34 behind `main`.
- Latest prior state on `main`: after PR #340 (React 19 forwardRef compatibility).

Merge strategy
- Prefer feature branch for application code (components, contexts, hooks, services, pages, translations).
- Keep `main` for critical build/runtime configuration to avoid deployment or tooling regressions:
  - package.json
  - package-lock.json
  - tsconfig.json
  - vercel.json
  - vite.config.ts

Conflicts and resolutions (high level)
- Config files: resolved in favor of `main` (kept current working build setup).
- App code and translations: resolved in favor of `origin/Features` to bring in latest features and content.
- Representative conflicted files (non-exhaustive):
  - index.html, src/App.tsx, multiple components/pages/contexts, translations in all supported languages, vite.config.ts, tsconfig.json, vercel.json.

Post-merge fixes (to ensure clean build)
1) Translation syntax corrections
   - Several language files had malformed entries for `media.uploadedOn` that broke TypeScript parse.
   - Fixed keys across: de, en, fr, hi, it, ko, pt, ru, tr (others already fine).

2) TypeScript project references
   - Restored `tsconfig.node.json` (referenced by `tsconfig.json`) so `tsc` can compile configuration files cleanly.

3) Test compilation scope
   - Excluded test files from the TypeScript build (`*.test.ts[x]`, `*.spec.ts[x]`, and `src/test/**`) to avoid missing dev-only test deps during production build.

4) Accessibility tooling
   - `src/utils/accessibilityMonitor.ts` dynamically imports `axe-core`. Added `axe-core` as a dev dependency so bundling succeeds.
   - Added an ambient module declaration for `axe-core` to satisfy types.

Build status
- `npm run build` completes successfully with PWA output and compression.
- Note: `axe-core` adds ~589 kB pre-gzip to a chunk; consider lazy-loading and code-splitting further if bundle size is a concern.

Risk assessment and follow-ups
- Verify critical UI flows (auth, home, events, media upload, marketplace, forum) in preview/prod.
- Consider moving `axe-core` import behind a development-only guard to keep production bundles lean.
- Revisit test setup: either re-include tests with proper dev deps and a separate test tsconfig, or keep excluded from prod build only.
- Monitor Vercel / Netlify routes after merge; configs were kept from `main` intentionally to preserve working routing.

Checklist
- [x] Merge conflicts resolved with defined policy
- [x] Builds successfully: `npm run build`
- [x] TypeScript checks pass in build
- [x] Translations compile across all languages
- [x] Main branch pushed and synchronized

References
- Previous PR on `main`: #340 (React 19 forwardRef compatibility)

# Fix App Startup Issue - Missing PointsProvider

## Problem
The Battle64 N64 Community app was failing to start due to a missing React context provider. Multiple components were trying to use the `usePoints` hook from `PointsContext`, but the `PointsProvider` was not included in the provider hierarchy.

## Solution
Added the missing `PointsProvider` to the React context provider hierarchy in `src/App.tsx`.

### Changes Made
1. **Added import**: `import { PointsProvider } from './contexts/PointsContext'`
2. **Wrapped components**: Added `<PointsProvider>` wrapper in the correct position in the provider hierarchy

### Before
```tsx
<LanguageProvider>
  <UserProvider>
    <QuizProvider>
      <EventProvider>
        <MediaProvider>
          <ForumProvider>
            <Layout>
              {/* Routes */}
            </Layout>
          </ForumProvider>
        </MediaProvider>
      </EventProvider>
    </QuizProvider>
  </UserProvider>
</LanguageProvider>
```

### After
```tsx
<LanguageProvider>
  <UserProvider>
    <PointsProvider>  // ← Added this provider
      <QuizProvider>
        <EventProvider>
          <MediaProvider>
            <ForumProvider>
              <Layout>
                {/* Routes */}
              </Layout>
            </ForumProvider>
          </MediaProvider>
        </EventProvider>
      </QuizProvider>
    </PointsProvider>
  </UserProvider>
</LanguageProvider>
```

## Components Fixed
This fix resolves runtime errors in the following components that use the `usePoints` hook:
- `Layout.tsx` - Main layout with points display
- `PointsWidget.tsx` - Points display widget  
- `AchievementsPanel.tsx` - User achievements
- `N64FanLeaderboard.tsx` - Community leaderboard
- `PointsOverview.tsx` - Points overview page
- Various page components with points functionality

## Testing
1. ✅ Dependencies installed successfully (`npm install`)
2. ✅ TypeScript compilation passes
3. ✅ Build process completes without errors
4. ✅ All required context providers are now properly configured

## Files Modified
- `src/App.tsx` - Added PointsProvider import and provider wrapper

## Impact
- 🚀 App now starts without context provider errors
- 💡 Points system functionality is fully accessible across all components
- 🔧 Maintains existing functionality while fixing the startup issue
- 📱 No breaking changes to existing features