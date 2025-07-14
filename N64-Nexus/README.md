# N64 Nexus

Ein Vite-React-Projekt für N64 Nexus.

## Entwicklung

```bash
npm install
npm run dev
```

## Build für Production

```bash
npm run build
```

## Deployment auf Vercel

Das Projekt ist für Vercel-Deployment konfiguriert:

- `vite.config.js` mit `base: '/'` für korrekte Pfad-Behandlung
- `vercel.json` mit Rewrite-Regeln für SPA-Routing
- Build-Konfiguration optimiert für Vercel

## Wichtige Konfigurationen

### vite.config.js
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // wichtig für Vercel!
  plugins: [react()],
});
```

### vercel.json
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
