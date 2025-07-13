# 🎮 Battle64 News Feed & Announcement System

Ein retro-inspiriertes News-Feed System für die Battle64 Community, gestaltet wie ein digitales N64-Magazin.

## 🚀 Features

### 📰 News-Feed
- **Verschiedene Post-Typen**: Offizielle Ankündigungen, Spieler-Highlights, Fanart, Events, Retro-Tipps
- **Interaktive Features**: Likes, Kommentare, Teilen
- **Filter-System**: Nach Typ, Autor, Gruppen und mehr
- **Retro-Design**: N64-inspirierte Pixel-Ästhetik mit Glow-Effekten

### ⚙️ Admin-Panel
- **Rollenbasierte Berechtigung**: Nur Admins und Editoren können Posts erstellen
- **Vollständige Post-Verwaltung**: Titel, Inhalt, Bilder, Videos
- **Scheduling**: Geplante Veröffentlichungen
- **Push-Benachrichtigungen**: Optionale Benachrichtigungen bei Veröffentlichung
- **Sichtbarkeits-Kontrolle**: Global, Regional, Event- oder Gruppen-spezifisch

### 🎨 Design
- **Retro-N64-Theme**: Pixelart-Design mit authentischen N64-Farben
- **Responsive**: Funktioniert auf Desktop und Mobile
- **Animierte Elemente**: Glow-Effekte, Hover-Animationen
- **Typografie**: Pixel-Fonts und Monospace-Schriften

## 🛠️ Technologie-Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS mit Custom N64-Theme
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Datum/Zeit**: date-fns
- **Build Tool**: Vite

## 📦 Installation

1. **Dependencies installieren**:
   ```bash
   npm install
   ```

2. **Entwicklungsserver starten**:
   ```bash
   npm run dev
   ```

3. **Browser öffnen**: http://localhost:3000

## 🎯 Verwendung

### News Feed
- **Filter anzeigen**: Klicke auf "🔧 Filter anzeigen"
- **Posts interagieren**: Like, Kommentar, Teilen
- **Schnellfilter**: Verwende die vordefinierten Filter-Buttons

### Admin Panel
- **Zugriff**: Nur für Admins und Editoren verfügbar
- **Post erstellen**: Fülle das Formular aus und klicke "📤 Post veröffentlichen"
- **Scheduling**: Setze ein Datum für geplante Veröffentlichungen
- **Sichtbarkeit**: Wähle zwischen Global, Regional, Event oder Gruppen-spezifisch

## 🎨 Design-System

### Farben
- **N64-Blau**: `#0066CC` - Hauptfarbe
- **N64-Rot**: `#CC0000` - Events, Warnungen
- **N64-Grün**: `#00CC00` - Erfolge, Tipps
- **N64-Gold**: `#FFD700` - Highlights
- **N64-Silber**: `#C0C0C0` - Offizielle Posts

### Typografie
- **Pixel-Font**: "Press Start 2P" für Überschriften
- **Monospace**: "Courier New" für Text

### Komponenten
- **N64-Card**: Standard-Karten-Design
- **N64-Button**: Retro-Button mit 3D-Effekt
- **News-Banner**: Farbkodierte Post-Container

## 📱 Responsive Design

Das System ist vollständig responsive und funktioniert auf:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔧 Entwicklung

### Scripts
```bash
npm run dev          # Entwicklungsserver
npm run build        # Production Build
npm run preview      # Build Vorschau
npm run lint         # ESLint Check
npm run lint:fix     # ESLint Auto-Fix
```

### Projektstruktur
```
src/
├── components/          # React Komponenten
│   ├── Header.tsx      # Navigation & User Info
│   ├── NewsFeed.tsx    # Haupt-Feed
│   ├── NewsPost.tsx    # Einzelner Post
│   ├── FilterPanel.tsx # Filter-System
│   └── AdminPanel.tsx  # Admin-Interface
├── context/            # React Context
│   └── NewsContext.tsx # State Management
├── types/              # TypeScript Definitionen
│   └── index.ts        # Interface Definitions
├── App.tsx             # Haupt-App
├── main.tsx            # Entry Point
└── index.css           # Global Styles
```

## 🎮 Demo-Daten

Das System enthält Demo-Posts für alle Kategorien:
- 📢 Offizielle Ankündigungen
- 🏆 Spieler-Highlights (Sergio's Platin-Orden)
- 🖼️ Fanart & Speedruns
- 🕹️ Events
- 💡 Retro-Tipps

## 🔮 Zukünftige Features

- **API-Integration**: Backend-Anbindung
- **Push-Notifications**: Echte Browser-Benachrichtigungen
- **Markdown-Support**: Erweiterte Text-Formatierung
- **Bild-Upload**: Direkte Bild-Upload-Funktion
- **Analytics**: Detaillierte Statistiken
- **Dark/Light Mode**: Theme-Wechsel

## 📄 Lizenz

MIT License - Siehe LICENSE Datei für Details.

## 👥 Team

Entwickelt für die Battle64 Community mit ❤️ und Nostalgie für das Nintendo 64.

---

**🎮 Ready Player One - Battle64 News Feed ist online! 🎮**