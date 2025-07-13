# 🎮 Battle64 Event Builder

Ein interaktives Admin-Tool zum Erstellen, Planen und Verwalten von kompetitiven Events, Turnieren und Community-Herausforderungen in Battle64.

## 🚀 Features

### 📝 Eventbasis
- **Event-Titel & Beschreibung** mit Markdown-Unterstützung
- **Spielauswahl** aus der N64-Datenbank
- **Kategorien**: Speedrun, Sammlung, Fanart, Gruppenzeit, Glitch-Only, Challenge, Tournament
- **Plattformwahl**: PAL, NTSC, Konsole, Emulator, Glitch, No Glitch
- **Start- & Endzeit** mit automatischem Countdown
- **Teilnahmebedingungen**: Screenshotpflicht, Livestream-Erlaubnis, Mindestlevel

### 🏁 Eventlogik & Automatik
- **Bewertungstypen**: Schnellste Zeit, Meiste Punkte, Top-Bewertung, Sammel-Challenge, Kreativ-Wettbewerb
- **Punkteverteilung**: Individuell konfigurierbare XP- und Medaillen-Belohnungen
- **Ergebnisfilter**: Screenshot-Verifizierung, KI-Glitch-Erkennung
- **Ranglisten**: Automatische Top-10-Generierung

### 📤 Eventausgabe & Teilnehmeransicht
- **Live-Vorschau** vor Veröffentlichung
- **Countdown** bis Event-Start
- **Upload-Bereich** für Screenshots/Videos
- **Automatische XP/Medaillen-Verteilung**
- **Archivierung** abgeschlossener Events

### 🎨 Design
- **Retro-Gaming-Aesthetic** im 64-Bit-Stil
- **Responsive Design** für alle Geräte
- **Farblich unterscheidbare Event-Arten**
- **Animierte Elemente** und Glitch-Effekte

## 🛠️ Technologie-Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS mit Custom Retro-Theme
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **Date Picker**: React DatePicker
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite

## 📦 Installation

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd battle64-event-builder
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
src/
├── components/          # React-Komponenten
│   ├── Layout.tsx      # Haupt-Layout mit Navigation
│   ├── Dashboard.tsx   # Admin-Dashboard
│   ├── EventBuilder.tsx # Event-Erstellung/Bearbeitung
│   ├── EventList.tsx   # Event-Übersicht
│   └── EventView.tsx   # Event-Details & Teilnehmer
├── store/              # State Management
│   └── eventStore.ts   # Zustand Store für Events
├── types/              # TypeScript-Definitionen
│   └── event.ts        # Event-bezogene Typen
├── App.tsx             # Haupt-App-Komponente
├── main.tsx            # React-Entry-Point
└── index.css           # Globale Styles
```

## 🎯 Verwendung

### 1. Dashboard
- Übersicht aller Events mit Statistiken
- Schnellaktionen für häufige Event-Typen
- Letzte Events und Teilnehmer-Zahlen

### 2. Event erstellen
- **Eventbasis**: Titel, Beschreibung, Spiel, Kategorie, Plattform, Zeiten
- **Eventlogik**: Bewertungstyp, Ergebnisfilter, Automatisierung
- **Belohnungen**: XP- und Medaillen-Verteilung pro Platz
- **Einstellungen**: Teilnahmebedingungen und Verifizierung

### 3. Event verwalten
- **Live-Vorschau** vor Veröffentlichung
- **Status-Management**: Draft → Published → Active → Completed → Archived
- **Teilnehmer-Verwaltung** mit Verifizierung
- **Ergebnis-Auswertung** und Ranglisten

### 4. Templates
- **Speedrun Template**: Schnellste Zeit, NTSC, Screenshot-Pflicht
- **Fanart Template**: Top-Bewertung, Konsole, Kreativ-Wettbewerb
- **Sammel Template**: Sammel-Challenge, Emulator, Punkte-System

## 🔐 Admin-Zugriff

- Nur Benutzer mit "Event-Manager" Rolle haben Zugriff
- Vollständige CRUD-Operationen für Events
- Teilnehmer-Verifizierung und -Verwaltung
- Event-Duplikation und -Archivierung

## 🎨 Customization

### Farben anpassen
```css
/* tailwind.config.js */
colors: {
  'n64-red': '#FF6B6B',
  'n64-blue': '#4ECDC4',
  'n64-green': '#45B7D1',
  'n64-yellow': '#FFE66D',
  'n64-purple': '#A8E6CF',
  'n64-orange': '#FF8C42',
  // ...
}
```

### Neue Event-Kategorien
```typescript
// src/types/event.ts
export type EventCategory = 
  | 'Speedrun' 
  | 'Sammlung' 
  | 'Fanart' 
  | 'Gruppenzeit' 
  | 'Glitch-Only'
  | 'Challenge'
  | 'Tournament'
  | 'NeueKategorie'; // Hier hinzufügen
```

## 🚀 Deployment

### Build für Produktion
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

## 🎮 Battle64 Community

Der Event Builder macht Battle64 dynamisch – jede Woche neue Challenges im Look eines Retro-Wettkampfs!

---

**Entwickelt mit ❤️ für die Battle64 Community**