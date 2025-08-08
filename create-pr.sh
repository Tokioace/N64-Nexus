#!/bin/bash

set -euo pipefail

echo "🔧 Creating PR for routing + static assets fix..."

BRANCH="cursor/fix-vercel-routes-static-assets"

# Configure git user if needed
if ! git config user.email >/dev/null; then
  git config user.email "ci@cursor.local"
fi
if ! git config user.name >/dev/null; then
  git config user.name "Cursor Bot"
fi

# Create branch
echo "🌿 Creating branch: $BRANCH"
(git rev-parse --verify $BRANCH >/dev/null 2>&1 && git checkout $BRANCH) || git checkout -b $BRANCH

# Stage changes
echo "📦 Staging changes..."
git add vercel.json PR_DESCRIPTION.md COMMIT_MESSAGE.txt

# Commit changes
echo "💾 Committing changes..."
if git diff --cached --quiet; then
  echo "No changes to commit."
else
  git commit -F COMMIT_MESSAGE.txt
fi

# Push to remote
echo "🚀 Pushing to remote..."
git push -u origin "$BRANCH"

echo "✅ Changes pushed successfully!"
echo ""
echo "📋 PR Summary:"
echo "- vercel.json: routes-only, filesystem-first, SPA fallback"
echo "- Stops 401 on vendor chunks & manifest"
echo "- Fixes mount crash (forwardRef due to missing React import)"
echo ""
echo "🔗 Next steps:"
echo "1. Open a PR from branch: $BRANCH"
echo "2. Use PR_DESCRIPTION.md as the description"
echo "3. Merge after verifying deployment on Vercel"