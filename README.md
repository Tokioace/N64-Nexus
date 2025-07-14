# SpeedRun - Speedrunning Platform

Eine moderne React + TypeScript Plattform für Speedrunning und Gaming Events mit Dark Mode Support und responsivem Design.

## 🚀 Features

- **Moderne Architektur**: React 18 + TypeScript + Vite
- **Responsive Design**: Optimiert für Desktop und Mobile
- **Dark Mode**: Automatische Theme-Umschaltung
- **Routing**: React Router für Navigation
- **Komponenten-basiert**: Wiederverwendbare UI-Komponenten
- **Performance**: Optimiert mit modernen React Patterns
- **TypeScript**: Vollständige Typisierung für bessere Entwicklererfahrung

## 📁 Projektstruktur

```
src/
├── components/          # UI-Komponenten
│   ├── Layout.tsx      # Haupt-Layout
│   ├── Sidebar.tsx     # Navigation
│   ├── DarkModeToggle.tsx
│   └── *.css           # Komponenten-spezifische Styles
├── pages/              # Seiten-Komponenten
│   ├── HomePage.tsx    # Startseite
│   ├── ProfilePage.tsx # Benutzerprofil
│   ├── SpeedrunsPage.tsx # Speedrunning
│   ├── EventsPage.tsx  # Events
│   ├── LeaderboardPage.tsx # Rangliste
│   └── *.css           # Seiten-spezifische Styles
├── contexts/           # React Contexts
│   └── ThemeContext.tsx # Dark Mode Context
├── router/             # Routing
│   └── AppRouter.tsx   # Haupt-Router
├── utils/              # Hilfsfunktionen
│   ├── ScoreManager.ts # XP und Level-Logik
│   └── StorageManager.ts # Lokale Datenspeicherung
├── styles/             # Globale Styles
│   ├── index.css       # CSS-Variablen und Reset
│   └── App.css         # App-spezifische Styles
├── assets/             # Bilder, Icons, etc.
├── App.tsx             # Haupt-App-Komponente
└── main.tsx            # Einstiegspunkt
```

## 🛠️ Installation

1. **Dependencies installieren:**
   ```bash
   npm install
   ```

2. **Entwicklungsserver starten:**
   ```bash
   npm run dev
   ```

3. **Build für Produktion:**
   ```bash
   npm run build
   ```

4. **Code linting:**
   ```bash
   npm run lint
   ```

## 🎨 Design System

### CSS-Variablen
Das Projekt verwendet CSS-Variablen für konsistentes Theming:

```css
:root {
  --primary-color: #3b82f6;
  --bg-primary: #ffffff;
  --text-primary: #1e293b;
  /* ... weitere Variablen */
}

.dark {
  --primary-color: #60a5fa;
  --bg-primary: #0f172a;
  --text-primary: #f8fafc;
  /* ... Dark Mode Variablen */
}
```

### Komponenten
- **Layout**: Haupt-Layout mit Sidebar
- **Sidebar**: Navigation mit Dark Mode Toggle
- **Cards**: Wiederverwendbare Karten-Komponenten
- **Buttons**: Konsistente Button-Styles
- **Forms**: Formular-Komponenten

## 🔧 Technische Details

### Performance-Optimierungen
- **React.memo**: Für Komponenten mit häufigen Re-Renders
- **useCallback/useMemo**: Für teure Berechnungen
- **Lazy Loading**: Für Code-Splitting
- **CSS-in-JS**: Vermieden für bessere Performance

### TypeScript Features
- **Strict Mode**: Aktiviert für bessere Typsicherheit
- **Interface-first**: Alle Datenstrukturen typisiert
- **Generic Types**: Für wiederverwendbare Komponenten
- **Utility Types**: Für bessere Type Safety

### State Management
- **React Context**: Für globalen Theme-State
- **Local State**: Für komponenten-spezifische Daten
- **LocalStorage**: Für Persistierung

## 📱 Responsive Design

Das Projekt ist vollständig responsive und unterstützt:
- **Desktop**: Optimiert für große Bildschirme
- **Tablet**: Angepasst für mittlere Bildschirme
- **Mobile**: Touch-optimiert für kleine Bildschirme

### Breakpoints
```css
@media (max-width: 768px) {
  /* Mobile Styles */
}
```

## 🎯 Best Practices

### Code-Organisation
- **Feature-basiert**: Komponenten nach Funktionalität gruppiert
- **Separation of Concerns**: Styles, Logik und UI getrennt
- **Consistent Naming**: Einheitliche Namenskonventionen
- **Type Safety**: Vollständige TypeScript-Integration

### Performance
- **Bundle Splitting**: Automatisch durch Vite
- **Tree Shaking**: Unused Code wird entfernt
- **Optimized Imports**: Nur benötigte Module importiert
- **Efficient Re-renders**: React.memo und useCallback

### Accessibility
- **Semantic HTML**: Korrekte HTML-Struktur
- **ARIA Labels**: Für Screen Reader
- **Keyboard Navigation**: Vollständig navigierbar
- **Color Contrast**: WCAG-konform

## 🚀 Deployment

### Vercel (Empfohlen)
1. Repository zu Vercel verbinden
2. Automatisches Deployment bei Push
3. Optimiert für React + Vite

### Netlify
1. Build-Kommando: `npm run build`
2. Publish-Directory: `dist`
3. Environment-Variablen setzen

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔍 Debugging

### Development Tools
- **React DevTools**: Für Komponenten-Debugging
- **TypeScript**: Für Type-Checking
- **ESLint**: Für Code-Qualität
- **Vite DevTools**: Für Build-Optimierung

### Common Issues
1. **Import Errors**: Pfad-Aliase überprüfen
2. **Type Errors**: TypeScript-Konfiguration prüfen
3. **Style Issues**: CSS-Variablen validieren
4. **Build Errors**: Dependencies aktualisieren

## 📈 Monitoring

### Performance Metrics
- **Bundle Size**: Überwacht mit Vite
- **Load Time**: Lighthouse Scores
- **Runtime Performance**: React Profiler
- **User Experience**: Core Web Vitals

## 🤝 Contributing

1. Fork das Repository
2. Feature-Branch erstellen
3. Änderungen committen
4. Pull Request erstellen
5. Code Review durchführen

### Commit Convention
```
feat: neue Feature
fix: Bug-Fix
docs: Dokumentation
style: Formatierung
refactor: Code-Refactoring
test: Tests
chore: Wartung
```

## 📄 Lizenz

MIT License - siehe LICENSE-Datei für Details.

## 🆘 Support

Bei Fragen oder Problemen:
1. Issues auf GitHub erstellen
2. Dokumentation durchsuchen
3. Community-Forum nutzen

---

**Entwickelt mit ❤️ und modernen Web-Technologien**