# Vercel Deployment Guide for Battle64

## 🚀 Quick Deployment Steps

### 1. **Vercel Configuration**
The app is now configured for Vite React Router deployment with the correct `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. **Build Configuration**
- **Framework**: Vite (not Next.js)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x or higher

### 3. **Environment Variables**
No environment variables are required for the current setup since we're using mock data.

### 4. **Deployment Commands**

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build locally (optional)
npm run preview
```

### 5. **Vercel Project Settings**

In your Vercel dashboard, ensure these settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 6. **Common Issues & Solutions**

#### Issue: "Request Failed" Error
- **Cause**: Vercel trying to deploy as Next.js
- **Solution**: Update framework preset to "Vite" in Vercel dashboard

#### Issue: 404 on Forum Routes
- **Cause**: Missing SPA redirect rules
- **Solution**: The `vercel.json` rewrites handle this automatically

#### Issue: Build Failures
- **Cause**: TypeScript errors or missing dependencies
- **Solution**: Run `npm run build` locally first to check for errors

### 7. **Manual Deployment Steps**

1. **Connect Repository**:
   - Go to Vercel Dashboard
   - Import your GitHub repository
   - Select the correct branch

2. **Configure Build Settings**:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

### 8. **Local Testing**

Before deploying, test the production build locally:

```bash
npm run build
npm run preview
```

Then visit `http://localhost:4173` to test the production build.

### 9. **Features Working After Deployment**

- ✅ Home Screen with retro N64 tiles
- ✅ Forum System (Community Nexus)
- ✅ User Profiles with achievements
- ✅ All navigation routes
- ✅ Responsive design
- ✅ Client-side routing

### 10. **Troubleshooting**

If deployment still fails:

1. Check Vercel build logs for specific errors
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility
4. Test build locally with `npm run build`

The app should now deploy successfully on Vercel as a static Vite React application! 🎮