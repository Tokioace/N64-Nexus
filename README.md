# Battle64 - Retro neu entfacht

Eine moderne Web-Plattform für N64-Fans und Millennials, die mit der Nintendo 64-Ära aufgewachsen sind.

## 🎮 Features

### 📦 Sammlung
- Katalogisiere deine physischen N64-Spiele
- Sammle animierte Cartridge-Belohnungen
- Bewerte Spiele nach Gameplay, Musik und Nostalgie
- Verfolge deinen Fortschritt und deine Sammlung

### 🏁 Events & Turniere
- Regelmäßige Speedrun-Events mit Live-Bestenlisten
- Getrennte Ranglisten für PAL- und NTSC-Versionen
- Live-Chat während Events
- Foto-Upload für Zeitnachweise

### 💬 Community
- Live-Chat während Eventzeiten
- Freundesliste und Nutzerprofile
- Sammlerkarte für regionale Events
- Community-Aktivitäten und Achievements

### 🎯 Quiz & Minigames
- Cover-Erkennungs-Quiz
- Sound-Rate-Quiz
- N64-Trivia
- Punkte-System und Leaderboards

## 🎨 Design

Das Design orientiert sich an der 90s/Y2K-Ästhetik:
- Neonfarbene Schaltflächen und Glow-Effekte
- Dunkler Hintergrund mit Gradienten
- Retro-Icons und Pixel-Controller
- Inspiriert von N64-Ära Werbungen

## 🚀 Technologie

- **Frontend**: Next.js 14 mit TypeScript
- **Styling**: Tailwind CSS mit Custom 90s/Y2K Design
- **Animationen**: Framer Motion
- **Icons**: Lucide React
- **UI-Komponenten**: Headless UI

## 📦 Installation

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd battle64
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

4. **Browser öffnen**
   ```
   http://localhost:3000
   ```

## 🏗️ Projektstruktur

```
battle64/
├── src/
│   ├── app/
│   │   ├── globals.css          # 90s/Y2K Styling
│   │   ├── layout.tsx           # Root Layout
│   │   └── page.tsx             # Landing Page
│   └── components/
│       ├── Navigation.tsx       # Hauptnavigation
│       ├── Collection.tsx       # Sammlungsverwaltung
│       ├── Events.tsx           # Events & Turniere
│       ├── Community.tsx        # Community & Chat
│       └── Quiz.tsx             # Quiz & Minigames
├── public/                      # Statische Assets
└── package.json
```

## 🎯 Komponenten

### Navigation
- Responsive Navigation mit 90s-Design
- Mobile Menu mit Animationen
- Neon-Glow-Effekte

### Collection
- Spiel-Katalogisierung
- Animated Cartridge-Rewards
- PAL/NTSC Filter
- Fortschritts-Tracking

### Events
- Live-Events mit Leaderboards
- Region-spezifische Ranglisten
- Event-Status (Live, Upcoming, Completed)
- Teilnahme-System

### Community
- Live-Chat während Events
- Freundesliste
- Benutzerprofile mit Achievements
- Online-Status

### Quiz
- Verschiedene Quiz-Typen (Cover, Sound, Trivia)
- Punkte-System
- Fortschritts-Tracking
- Ergebnis-Anzeige

## 🎨 Design-System

### Farben
- **Neon-Blau**: `#00ffff` - Hauptakzentfarbe
- **Neon-Pink**: `#ff00ff` - Sekundärakzent
- **Neon-Grün**: `#00ff00` - Erfolg/Online
- **Neon-Gelb**: `#ffff00` - Warnung/Highlights

### CSS-Klassen
- `.neon-button` - Glänzende Buttons mit Hover-Effekten
- `.retro-card` - Karten mit Glow-Effekten
- `.neon-text` - Text mit Neon-Glow
- `.glow-effect` - Animierte Glow-Animation
- `.cartridge-animation` - Bounce-Animation für Cartridges

## 🔧 Entwicklung

### Scripts
```bash
npm run dev          # Entwicklungsserver
npm run build        # Production Build
npm run start        # Production Server
npm run lint         # ESLint
```

### Customization
- Farben in `globals.css` anpassen
- Neue Komponenten in `src/components/` erstellen
- Animationen mit Framer Motion erweitern

## 📱 Responsive Design

Die Plattform ist vollständig responsive:
- Mobile-first Ansatz
- Tablet-optimierte Layouts
- Desktop-Erweiterungen
- Touch-freundliche Interaktionen

## 🎮 Rechtliche Hinweise

- Keine Original-ROMs oder Markennutzung
- Nur User-generierter Content
- Name "Battle64" wurde rechtlich geprüft
- Konform mit EUIPO und DPMA

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

## 🎯 Roadmap

- [ ] Backend-Integration
- [ ] User-Authentication
- [ ] Real-time Chat
- [ ] Event-Creation
- [ ] Mobile App
- [ ] Achievement-System
- [ ] Leaderboards
- [ ] Social Features

---

**Battle64** - Die N64-Community für Millennials 🎮✨
