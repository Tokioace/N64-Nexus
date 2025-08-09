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
echo ""
echo "🛠️  Changes made:"
echo "- Added crossorigin='use-credentials' to manifest link"
echo "- Added proper CORS and Content-Type headers in vercel.json"
echo "- Updated service worker to handle manifest requests specifically"
echo "- Added fallback manifest in service worker"
echo "- Updated Vite PWA configuration"
echo ""
echo "If the issue persists, check:"
echo "- Vercel deployment logs for any authentication middleware"
echo "- Browser network tab for specific error details"
echo "- Whether any password protection is enabled on the domain"