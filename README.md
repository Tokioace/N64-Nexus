# 🏁 Battle64 Nexus - Event Card & Live Ticker System

Ein modernes React-basiertes System für Retro-Gaming-Events mit Echtzeit-Updates und Live-Kommunikation.

## 🎯 Features

### 📋 Event Card (Vorschauelement)
- **Retro-Modulkarte** mit schimmerndem Pixelrahmen
- **Live-Countdown** bis zum Event-Ende
- **Event-Informationen**: Plattform, Emulator, Glitch-Einstellungen
- **Interaktive Buttons**: Teilnehmen, Screenshot, Details
- **Hover-Effekte** mit Vorschau der aktuellen Bestzeit
- **Status-Badges**: Aktiv, Beendet, Bald

### 📡 Live Ticker (Eventdetails)
- **Echtzeit-Updates** mit verschiedenen Event-Typen
- **Retro-Scanline-Effekt** für authentisches Feeling
- **Auto-Scroll** mit manueller Pausierung
- **Livestream-Banner** für aktive Streamer
- **Admin-Posts** hervorgehoben
- **Pixelart-Animationen** für neue Einträge

## 🚀 Installation & Start

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Build für Production
npm run build

# Preview Production Build
npm run preview
```

## 🎮 Verwendung

### Event Card
```typescript
const event = {
  id: 'rainbow-raceway-001',
  name: 'Rainbow Raceway Time Trial',
  startDate: new Date('2024-07-19T10:00:00'),
  endDate: new Date('2024-07-21T10:00:00'),
  platform: 'NTSC',
  emulator: 'Emulator',
  glitchFree: true,
  game: 'Mario Kart 64',
  reward: { xp: 300, medal: 'Goldmedaille' },
  participants: 146,
  screenshots: 121,
  status: 'active'
}

<EventCard event={event} />
```

### Live Ticker
```typescript
const tickerItems = [
  { id: 1, time: '14:12', user: 'RetroKing93', action: 'hat eine neue Zeit eingereicht: 2:11.45', type: 'submission' },
  { id: 2, time: '14:15', user: 'PixelHero', action: 'Neuer Screenshot verfügbar', type: 'screenshot' },
  { id: 3, time: '14:17', user: 'SpeedDemon', action: 'läuft live! 🔥', type: 'livestream' }
]

<LiveTicker items={tickerItems} />
```

## 🎨 Design System

### Farben
- **Primary**: `#00ff00` (Grün)
- **Secondary**: `#ff00ff` (Magenta)
- **Accent**: `#ffff00` (Gelb)
- **Background**: `#000000` (Schwarz)
- **Card BG**: `#1a1a1a` (Dunkelgrau)

### Schriftarten
- **Titel**: Press Start 2P (Pixelart)
- **Text**: VT323 (Terminal-Style)

### Effekte
- **Scanlines**: Retro-CRT-Effekt
- **Glow**: Neon-Glühen bei Hover
- **Pixel Borders**: Authentische Pixelrahmen
- **Animations**: Flip-In, Blink, Scroll

## 📱 Responsive Design

Das System ist vollständig responsive und funktioniert auf:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔧 Technologie Stack

- **React 18** mit TypeScript
- **Vite** für schnelle Entwicklung
- **Framer Motion** für Animationen
- **date-fns** für Datum/Zeit-Handling
- **CSS3** mit Custom Properties

## 🛡️ Datenschutz

- Live-Ticker zeigt keine sensiblen Informationen
- Livestreams nur sichtbar bei Nutzer-Zustimmung
- Keine Standortdaten oder persönliche Infos

## 🎯 Nächste Schritte

- [ ] Backend-Integration für echte Live-Daten
- [ ] WebSocket-Verbindung für Echtzeit-Updates
- [ ] Screenshot-Upload-Funktionalität
- [ ] Event-Archiv und Bestenlisten
- [ ] Benutzer-Authentifizierung
- [ ] Admin-Panel für Event-Management

## 📄 Lizenz

MIT License - Siehe LICENSE Datei für Details.

---

**Entwickelt für die Battle64 Community** 🏁