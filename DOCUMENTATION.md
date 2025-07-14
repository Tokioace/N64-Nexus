# Battle64 - Favoriten- & Bookmark-System Dokumentation

## 📋 Übersicht

Battle64 ist eine moderne Web-Anwendung für Retro-Gaming-Enthusiasten, die ein umfassendes Favoriten- und Bookmark-System bietet. Das System ermöglicht es Spielern, ihre liebsten Inhalte zu organisieren, zu kategorisieren und mit der Community zu teilen.

## 🎯 Hauptfunktionen

### A. FAVORITENTYPEN

Das System unterstützt verschiedene Inhaltstypen:

- **🎮 Spiele** (z.B. Mario Kart 64, Jet Force Gemini)
- **🛣️ Strecken** (z.B. Rainbow Road)
- **🖼️ Fanart & Screenshots**
- **🗓️ Events** (z.B. GlitchCup #3)
- **👤 Andere User**
- **📚 Quiz-Serien**
- **🧩 Tauschangebote**

### B. FAVORITEN-ÜBERSICHT

- **Zugriff**: Über Profil oder Schnellzugriff
- **Funktionen**: Sortierung, Filterung, Suche
- **Ansichten**: Raster- und Listenansicht
- **Organisation**: Listen und Kategorien

### C. BENACHRICHTIGUNGEN & INTEGRATION

- Event-Erinnerungen
- Neue Inhalte-Benachrichtigungen
- Freundes-Aktivitäten
- Wöchentliche Zusammenfassungen

## 🛠️ Technische Architektur

### Tech Stack

- **Frontend**: React 18 mit TypeScript
- **Styling**: Tailwind CSS mit custom retro theme
- **State Management**: Zustand mit Persistierung
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Build Tool**: Vite

### Projektstruktur

```
src/
├── components/          # Wiederverwendbare UI-Komponenten
├── features/           # Feature-spezifische Komponenten
│   └── favorites/      # Favoriten-System
├── pages/              # Seiten-Komponenten
├── stores/             # Zustand-Management
├── types/              # TypeScript Typdefinitionen
├── utils/              # Utility-Funktionen
└── styles/             # Globale Styles und Themes
```

## 🚀 Installation & Setup

### Voraussetzungen

- Node.js 18+ 
- npm oder yarn

### Installation

1. **Repository klonen**:
   ```bash
   git clone <repository-url>
   cd battle64
   ```

2. **Installation ausführen**:
   ```bash
   ./install.sh
   ```
   
   Oder manuell:
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**:
   ```bash
   npm run dev
   ```

### Verfügbare Befehle

- `npm run dev` - Startet Entwicklungsserver
- `npm run build` - Erstellt Produktions-Build
- `npm run preview` - Zeigt Produktions-Build an
- `npm run lint` - Führt Linting durch
- `npm run type-check` - TypeScript-Typüberprüfung

## 📁 Komponenten-Dokumentation

### 1. FavoritesStore (`src/stores/favoritesStore.ts`)

Zentraler Zustand-Manager für das Favoriten-System.

**Hauptfunktionen:**
- `addFavorite()` - Favorit hinzufügen
- `removeFavorite()` - Favorit entfernen
- `toggleFavorite()` - Favorit umschalten
- `createList()` - Neue Liste erstellen
- `getFilteredFavorites()` - Gefilterte Favoriten abrufen

**Persistierung:**
- Automatische Speicherung im localStorage
- Wiederherstellung beim App-Start

### 2. FavoriteButton (`src/features/favorites/FavoriteButton.tsx`)

Wiederverwendbare Komponente für Favoriten-Buttons.

**Props:**
- `favorite` - Favoriten-Objekt
- `size` - Größe (sm, md, lg)
- `className` - Zusätzliche CSS-Klassen

**Features:**
- Animierte Zustandsänderungen
- Tooltip-Unterstützung
- Responsive Design

### 3. FavoritesOverview (`src/features/favorites/FavoritesOverview.tsx`)

Hauptkomponente für die Favoriten-Übersicht.

**Features:**
- Grid- und Listenansicht
- Suchfunktion
- Filter nach Typ
- Sortierung (Datum, Name, Typ)
- Responsive Design

### 4. FavoritesLists (`src/features/favorites/FavoritesLists.tsx`)

Verwaltung von Favoriten-Listen und Kategorien.

**Features:**
- Listen erstellen/bearbeiten/löschen
- Farbkodierung
- Öffentliche/private Listen
- Drag & Drop (geplant)

### 5. NotificationSettings (`src/features/favorites/NotificationSettings.tsx`)

Einstellungen für Benachrichtigungen.

**Einstellungen:**
- Globale Aktivierung/Deaktivierung
- Event-Erinnerungen
- Neue Inhalte
- Freundes-Aktivitäten
- Wöchentliche Zusammenfassungen

## 🎨 Design-System

### Farbpalette

**Primärfarben:**
- `n64-purple` - Hauptfarbe (Nintendo 64 lila)
- `n64-blue` - Sekundärfarbe
- `n64-green` - Erfolg/Aktionen
- `n64-yellow` - Warnungen/Events
- `n64-red` - Fehler/Favoriten

**Neutrale Farben:**
- `retro-gray` - Graustufen für UI-Elemente

### Typografie

- **Hauptschrift**: Courier New (Retro-Feeling)
- **Pixel-Schrift**: Press Start 2P (für Überschriften)

### Komponenten-Klassen

- `.retro-card` - Basis-Karten-Design
- `.game-box` - Spiel-Box-Styling
- `.memory-card` - Memory-Card-Animation
- `.favorite-button` - Favoriten-Button-Styling
- `.type-badge` - Typ-Badges

### Animationen

- `cartridge-fly` - Cartridge-Flug-Animation
- `star-twinkle` - Stern-Flimmern
- `memory-card` - Memory-Card-Animation

## 📊 Datenstrukturen

### FavoriteItem Interface

```typescript
interface FavoriteItem {
  id: string;
  type: FavoriteType;
  title: string;
  description?: string;
  imageUrl?: string;
  url: string;
  addedAt: Date;
  updatedAt: Date;
  tags: string[];
  isPublic: boolean;
  metadata: Record<string, any>;
}
```

### FavoriteList Interface

```typescript
interface FavoriteList {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  favoriteIds: string[];
  color?: string;
  icon?: string;
}
```

## 🔧 Konfiguration

### Environment Variables

Erstelle eine `.env` Datei:

```env
VITE_APP_NAME=Battle64
VITE_APP_VERSION=1.0.0
```

### Tailwind Konfiguration

Die `tailwind.config.js` enthält:
- Custom Farben für Retro-Gaming-Theme
- Custom Animationen
- Responsive Breakpoints
- Custom Fonts

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

## 📱 Responsive Design

Das System ist vollständig responsive und unterstützt:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔒 Sicherheit

### Datenpersistierung

- Lokale Speicherung im Browser
- Keine sensiblen Daten
- Verschlüsselung (geplant)

### Validierung

- TypeScript für Typsicherheit
- Runtime-Validierung für Benutzereingaben
- XSS-Schutz durch React

## 🚀 Deployment

### Produktions-Build

```bash
npm run build
```

### Deployment-Optionen

1. **Vercel** (empfohlen)
2. **Netlify**
3. **GitHub Pages**
4. **Eigener Server**

### Environment Setup

Für Produktion:
```env
NODE_ENV=production
VITE_APP_NAME=Battle64
VITE_APP_VERSION=1.0.0
```

## 🔮 Roadmap

### Geplante Features

- [ ] Drag & Drop für Listen
- [ ] Erweiterte Suchfunktionen
- [ ] Social Sharing
- [ ] Offline-Unterstützung
- [ ] Progressive Web App (PWA)
- [ ] Backend-Integration
- [ ] Real-time Benachrichtigungen
- [ ] Erweiterte Statistiken

### Performance-Optimierungen

- [ ] Code Splitting
- [ ] Lazy Loading
- [ ] Image Optimization
- [ ] Bundle Size Optimization

## 🤝 Beitragen

### Entwicklungsumgebung einrichten

1. Repository forken
2. Feature-Branch erstellen
3. Änderungen implementieren
4. Tests schreiben
5. Pull Request erstellen

### Coding Standards

- TypeScript für alle neuen Dateien
- ESLint für Code-Qualität
- Prettier für Formatierung
- Conventional Commits

## 📞 Support

### Häufige Probleme

1. **Installation schlägt fehl**
   - Node.js Version prüfen (18+)
   - npm Cache löschen: `npm cache clean --force`

2. **Build-Fehler**
   - Dependencies neu installieren: `rm -rf node_modules && npm install`
   - TypeScript-Fehler prüfen: `npm run type-check`

3. **Styling-Probleme**
   - Tailwind CSS neu kompilieren
   - Browser-Cache löschen

### Kontakt

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: [support@battle64.com]

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details.

---

**Battle64** - Dein digitales Sammelalbum der Retro-Zeit 🎮