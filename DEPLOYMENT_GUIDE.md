# Battle64 - Deployment Guide

## 🚀 Deployment-Anleitung

### Voraussetzungen
- Node.js (Version 18 oder höher)
- npm oder yarn
- Git

### 1. Projekt klonen und Dependencies installieren

```bash
git clone <repository-url>
cd battle64-quiz
npm install
```

### 2. Build erstellen

```bash
npm run build
```

Der Build-Prozess erstellt einen `dist/` Ordner mit allen optimierten Dateien.

### 3. Deployment-Optionen

#### Option A: Netlify
1. Verbinde dein GitHub-Repository mit Netlify
2. Build-Einstellungen:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. Deploy!

#### Option B: Vercel
1. Verbinde dein GitHub-Repository mit Vercel
2. Vercel erkennt automatisch das Vite-Projekt
3. Deploy!

#### Option C: GitHub Pages
1. Installiere gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Füge in `package.json` hinzu:
   ```json
   {
     "homepage": "https://yourusername.github.io/battle64-quiz",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

#### Option D: Eigener Server
1. Build erstellen:
   ```bash
   npm run build
   ```

2. `dist/` Ordner auf deinen Webserver hochladen

3. Webserver für SPA konfigurieren (alle Routen zu `index.html` weiterleiten)

### 4. Umgebungsvariablen (Optional)

Erstelle eine `.env` Datei für produktionsspezifische Einstellungen:

```env
VITE_APP_TITLE=Battle64 Quiz
VITE_API_URL=https://api.battle64.com
VITE_ENABLE_SOUNDS=true
```

### 5. Build-Optimierungen

#### Vite-Konfiguration erweitern
```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          icons: ['lucide-react']
        }
      }
    }
  }
})
```

### 6. Performance-Tipps

#### Lazy Loading
```typescript
// Lazy load heavy components
const RetroIntroAnimation = lazy(() => import('./components/RetroIntroAnimation'));
```

#### Service Worker (Optional)
```javascript
// public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('battle64-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/static/js/bundle.js',
        '/static/css/main.css'
      ]);
    })
  );
});
```

### 7. Troubleshooting

#### Häufige Probleme:

1. **CSS-Import-Fehler**
   ```
   @import must precede all other statements
   ```
   **Lösung:** @import-Statements an den Anfang der CSS-Datei verschieben

2. **Tailwind-Klassen nicht gefunden**
   ```
   The `to-white/2` class does not exist
   ```
   **Lösung:** Verwende `to-white/[0.02]` für sehr niedrige Opacity-Werte

3. **Framer Motion Bundle-Größe**
   **Lösung:** Nur benötigte Komponenten importieren:
   ```typescript
   import { motion } from 'framer-motion';
   ```

4. **Audio-Kontext-Fehler**
   **Lösung:** Audio-Kontext nur nach User-Interaktion initialisieren

### 8. CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 9. Monitoring und Analytics

#### Fehler-Tracking
```typescript
// src/utils/errorTracking.ts
export const trackError = (error: Error, context?: string) => {
  console.error('Battle64 Error:', error, context);
  // Hier können Sie Sentry, LogRocket, etc. integrieren
};
```

#### Performance-Monitoring
```typescript
// src/utils/performance.ts
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name}: ${end - start}ms`);
};
```

### 10. SEO-Optimierung

#### Meta-Tags in `index.html`
```html
<meta name="description" content="Battle64 Quiz - Nintendo 64 Wissen testen">
<meta name="keywords" content="Nintendo 64, Quiz, Retro Gaming, N64">
<meta property="og:title" content="Battle64 Quiz">
<meta property="og:description" content="Teste dein Nintendo 64 Wissen!">
<meta property="og:image" content="/og-image.jpg">
```

### 11. Sicherheit

#### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
">
```

### 12. Testing vor Deployment

```bash
# Linting
npm run lint

# Type-Checking
npm run type-check

# Build-Test
npm run build

# Preview des Builds
npm run preview
```

---

## 🎯 Deployment-Checkliste

- [ ] Dependencies installiert
- [ ] Build erfolgreich
- [ ] Alle Routes funktionieren
- [ ] Responsive Design getestet
- [ ] Audio-Effekte funktionieren
- [ ] Performance optimiert
- [ ] SEO-Tags gesetzt
- [ ] Fehler-Tracking konfiguriert
- [ ] CI/CD Pipeline eingerichtet

---

**Die Battle64-App ist jetzt bereit für das Deployment! 🚀**

Bei Problemen oder Fragen zur Deployment-Konfiguration, überprüfen Sie die Build-Logs und stellen Sie sicher, dass alle Dependencies korrekt installiert sind.