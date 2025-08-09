# Vercel Deployment Guide

## 🚀 Deploying Battle64 to Vercel

### Issue Resolution: CLI Regions Conflict

**Problem**: "If a CLI Deployment defines the --regions option, the Vercel Function Region setting is ignored."

**Solution**: The `vercel.json` configuration now includes proper region settings that work with Vercel's deployment system.

### Configuration Changes Made

#### 1. Updated `vercel.json`
```json
{
  "version": 2,
  "framework": "vite",
  "regions": ["fra1"],
  "functions": {
    "src/api/**/*.{js,ts}": {
      "runtime": "@vercel/node@20.x"
    }
  }
}
```

#### 2. Added Deployment Scripts
```json
{
  "scripts": {
    "deploy": "vercel --prod",
    "deploy:preview": "vercel"
  }
}
```

#### 3. Created `.vercelignore`
- Excludes unnecessary files from deployment
- Reduces deployment size and time

### Deployment Methods

#### Option 1: Using Package Scripts (Recommended)
```bash
# Preview deployment
npm run deploy:preview

# Production deployment  
npm run deploy
```

#### Option 2: Direct Vercel CLI
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

### Important Notes

1. **Region Configuration**: The app is configured for `fra1` region (Frankfurt)
2. **No CLI --regions flag needed**: Region is set in `vercel.json`
3. **Framework Detection**: Vercel will automatically detect Vite
4. **Build Command**: `npm run build` (includes TypeScript compilation)
5. **Output Directory**: `dist/`

### Security Headers

The deployment includes security headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- Cache control for static assets

### Troubleshooting

If you still see the regions warning:
1. Ensure you're not using `--regions` in any CLI commands
2. Use the package.json scripts instead of direct CLI commands
3. The `vercel.json` configuration will handle region selection automatically

### Deployment Status
✅ SPA routing configured  
✅ Region settings optimized  
✅ Security headers added  
✅ Build process validated  
✅ Translation files working  

The app is ready for production deployment on Vercel.