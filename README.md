# Battle64 - Highlight Archiv

🎮 **Ein digitales Retro-Trophäenbuch für deine besten Gaming-Momente**

Das Battle64 Highlight Archiv ist eine moderne Web-Anwendung, die es Nutzern ermöglicht, ihre besten Gaming-Momente dauerhaft zu speichern, zu kuratieren und zu präsentieren – als digitales Retro-Trophäenbuch mit Video-, Bild- und Statistikunterstützung.

## 🌟 Features

### 📂 Highlight-Typen
- **🎮 Beste Spielrunde** - Speedruns, Highscores, Rekorde
- **🖼️ Fanart** - Selbst erstellte Kunstwerke
- **🏆 Trophäe** - Level-Ups, Achievements, Meilensteine
- **🎤 Livestream** - Ausschnitte aus Live-Übertragungen
- **📅 Saison-Meilenstein** - Turniererfolge, Event-Gewinne

### 🗂️ Archiv-Funktionen
- **Chronologische & manuelle Sortierung**
- **Erweiterte Filter** (Typ, Spiel, Sichtbarkeit, Suche)
- **Grid- und Listen-Ansicht**
- **Angepinnte Highlights** für besondere Momente
- **Favoriten-System**

### 📥 Management
- **Privatsphäre-Einstellungen** (Privat, Freunde, Öffentlich)
- **Teilen-Funktion** (Social Media, Link)
- **Kommentar-System**
- **Statistik-Tracking** je nach Highlight-Typ

### 🎨 Design
- **Retro-Gaming Ästhetik** mit pixeligen Rahmen
- **Sticker-Icons** zur visuellen Einordnung
- **Camera-Click Sound** beim Öffnen von Highlights
- **Responsive Design** für alle Geräte

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn

### Installation
```bash
# Repository klonen
git clone <repository-url>
cd battle64-highlight-archive

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter `http://localhost:3000` verfügbar.

### Build für Produktion
```bash
npm run build
npm run preview
```

## 📁 Projektstruktur

```
src/
├── components/          # React-Komponenten
│   ├── Header.jsx      # Navigation & Logo
│   ├── HighlightArchive.jsx    # Hauptarchiv-Ansicht
│   ├── HighlightCard.jsx       # Einzelne Highlight-Karten
│   ├── HighlightDetail.jsx     # Detail-Ansicht
│   ├── FilterBar.jsx           # Filter & Sortierung
│   ├── AddHighlightModal.jsx   # Neues Highlight hinzufügen
│   └── Profile.jsx             # Benutzer-Profil
├── context/            # React Context
│   └── HighlightContext.jsx    # State Management
├── App.jsx             # Haupt-App-Komponente
├── main.jsx            # React Entry Point
└── index.css           # Globale Styles
```

## 🎯 Verwendung

### Highlight hinzufügen
1. Klicke auf "Highlight hinzufügen" im Archiv
2. Wähle den Typ (Beste Runde, Fanart, etc.)
3. Fülle Titel, Beschreibung und Spiel aus
4. Füge Bild- oder Video-URL hinzu
5. Setze Statistiken je nach Typ
6. Wähle Sichtbarkeit (Privat/Freunde/Öffentlich)

### Archiv verwalten
- **Filtern**: Nutze die Filter-Bar für Typ, Spiel, Sichtbarkeit
- **Sortieren**: Nach Datum, Titel, Spiel oder Typ
- **Favorisieren**: Herz-Icon für Lieblings-Highlights
- **Anpinnen**: Pin-Icon für besondere Highlights
- **Teilen**: Share-Icon für Social Media

### Profil & Statistiken
- Übersicht über alle Highlights
- Breakdown nach Typen und Sichtbarkeit
- Angepinntes Highlight-Showcase
- Account-Status (Kostenlos/Premium)

## 💎 Premium Features

**Kostenlos:**
- 10 Highlights
- Grundlegende Funktionen
- Lokale Speicherung

**Premium:**
- Unbegrenzte Highlights
- Video-Unterstützung
- Cloud-Backup
- Erweiterte Statistiken

## 🎨 Technologie-Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Daten**: LocalStorage (erweiterbar auf Backend)
- **Animationen**: Framer Motion
- **Datum**: date-fns

## 🔧 Konfiguration

### Tailwind CSS
Das Projekt verwendet eine custom Tailwind-Konfiguration mit:
- Retro-Gaming Farbpalette
- Custom Animationen (pixel-bounce, camera-click, glow)
- Retro-Schriftarten (Press Start 2P, VT323)

### Environment Variables
```env
# Für zukünftige Backend-Integration
VITE_API_URL=your-api-url
VITE_STORAGE_KEY=battle64-highlights
```

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder
```

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

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📝 Roadmap

### Version 1.1
- [ ] Backend-Integration
- [ ] User-Authentication
- [ ] Social Features (Follow, Like)
- [ ] Export-Funktionen

### Version 1.2
- [ ] Mobile App
- [ ] Offline-Support
- [ ] Erweiterte Statistiken
- [ ] Achievement-System

### Version 2.0
- [ ] Multiplayer-Features
- [ ] Tournament-Integration
- [ ] API für Third-Party-Apps
- [ ] Advanced Analytics

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) für Details.

## 🙏 Danksagungen

- **Retro-Gaming Community** für Inspiration
- **React & Tailwind Teams** für die großartigen Tools
- **N64-Nexus Community** für Feedback und Ideen

---

**Entwickelt mit ❤️ für die Retro-Gaming Community**

*Battle64 - Wo deine besten Momente für immer leben*