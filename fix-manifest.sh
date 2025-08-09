#!/bin/bash

echo "🔧 Battle64 Manifest Fix Deployment Script"
echo "=========================================="

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

# Wait a moment for deployment
sleep 10

# Clear Vercel cache
echo "🗑️  Clearing Vercel cache..."
vercel env ls | grep -q "VERCEL_TOKEN" && vercel purge --token $VERCEL_TOKEN || echo "⚠️  VERCEL_TOKEN not found, skipping cache purge"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔍 To test the manifest fix:"
echo "1. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)"
echo "2. Open DevTools -> Network tab"
echo "3. Reload the page and check that manifest.webmanifest returns 200 OK"
echo "4. Check Console for any service worker registration errors"
echo ""
echo "🛠️  Changes made:"
echo "- Added crossorigin='use-credentials' to manifest link"
echo "- Fixed CORS and Content-Type headers in vercel.json (using application/json)"
echo "- Updated service worker to handle manifest requests specifically"
echo "- Added fallback manifest in service worker"
echo "- Disabled Vite PWA plugin to prevent conflicts"
echo "- Fixed MIME type from 'application/manifest+json' to 'application/json'"
echo ""
echo "If the issue persists, check:"
echo "- Browser console for specific error messages"
echo "- Network tab for 401/MIME type errors"
echo "- Whether any password protection is enabled on the domain"
echo "- Service worker registration in browser DevTools -> Application -> Service Workers"