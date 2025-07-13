# Battle64 Event Calendar & Reminder Module

🎮 Ein interaktiver Event-Kalender für die Battle64 Gaming-Community mit Erinnerungsfunktionen und Nostalgie-Design.

## 📋 Übersicht

Der Battle64 Event Calendar ist eine moderne Web-Anwendung, die das Turnier-Feeling der N64-Ära mit digitalen Funktionen verbindet. Nutzer können Events entdecken, daran teilnehmen, Erinnerungen setzen und sich über neue Challenges informieren.

## ✨ Features

### 📅 Kalenderansichten
- **Monatsübersicht**: Klassischer Kalenderstil mit Event-Indikatoren
- **Listenansicht**: Sortierbare Event-Liste mit erweiterten Filtern
- **Filter**: Nach Kategorien (Speedrun, Fanart, Glitch, Teams)
- **Meine Events**: Persönliche Event-Übersicht

### 🔔 Erinnerungsfunktion
- **Benachrichtigungseinstellungen**: 1 Tag/Stunde vorher, beim Start/Ende
- **Mehrere Kanäle**: Push, In-App, E-Mail
- **Automatische Aktivierung**: Bei Event-Teilnahme
- **Countdown-Timer**: Live-Updates bis zum Event-Start

### 🌟 Persönliche Features
- **Event-Abos**: Abonnieren von Eventreihen
- **Top-Events**: Hervorgehobene Events
- **Statistiken**: Übersicht über Teilnahmen und Erinnerungen
- **Benachrichtigungen**: In-App Notification-System

### 🎨 Design
- **Retro-Pixel-Design**: Nostalgisches N64-Feeling
- **Farbkodierung**: Events nach Kategorien
- **Animierte Elemente**: Countdown-Timer und Hover-Effekte
- **Responsive**: Optimiert für Desktop und Mobile

## 🚀 Installation

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn

### Setup
```bash
# Repository klonen
git clone <repository-url>
cd battle64-event-kalender

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Build für Produktion
npm run build
```

### Dependencies
```json
{
  "react": "^18.2.0",
  "date-fns": "^2.30.0",
  "lucide-react": "^0.263.1",
  "framer-motion": "^10.16.4",
  "tailwindcss": "^3.3.3"
}
```

## 📁 Projektstruktur

```
src/
├── components/          # React-Komponenten
│   ├── Calendar.tsx     # Hauptkalender-Komponente
│   ├── EventCard.tsx    # Event-Karten
│   ├── EventList.tsx    # Listenansicht
│   └── ReminderSettings.tsx # Erinnerungseinstellungen
├── types/               # TypeScript-Definitionen
│   └── event.ts         # Event-bezogene Typen
├── data/                # Mock-Daten
│   └── mockEvents.ts    # Beispiel-Events
├── utils/               # Hilfsfunktionen
│   └── dateUtils.ts     # Datum-Utilities
├── App.tsx              # Haupt-App-Komponente
└── main.tsx             # App-Einstiegspunkt
```

## 🎯 Verwendung

### Event-Kategorien
- **🏃 Speedrun**: Zeitbasierte Challenges
- **🎨 Fanart**: Kreative Wettbewerbe
- **🐛 Glitch**: Bug-Entdeckung
- **👥 Teams**: Team-basierte Events
- **🎮 Custom**: Benutzerdefinierte Events

### Plattformen
- **NTSC**: Amerikanische Versionen
- **PAL**: Europäische Versionen
- **Console**: Original-Hardware
- **Emulator**: Emulator-basiert

### Erinnerungstypen
- **1 Tag vorher**: 24h Vorankündigung
- **1 Stunde vorher**: 60min Countdown
- **Beim Start**: Event-Start-Benachrichtigung
- **Beim Ende**: Upload-Erinnerung

## 🔧 Konfiguration

### Tailwind CSS
Das Projekt verwendet Tailwind CSS mit custom Battle64-Farben:

```css
.battle64-primary: #FF6B35    /* Orange */
.battle64-secondary: #4ECDC4  /* Teal */
.battle64-accent: #45B7D1     /* Blue */
.battle64-speedrun: #E74C3C   /* Red */
.battle64-fanart: #3498DB     /* Blue */
.battle64-glitch: #9B59B6     /* Purple */
.battle64-teams: #F39C12      /* Orange */
```

### Google Fonts
- **Press Start 2P**: Pixel-Font für Überschriften
- **VT323**: Retro-Font für Text

## 📱 Responsive Design

Die Anwendung ist vollständig responsive und optimiert für:
- **Desktop**: Vollständige Funktionalität
- **Tablet**: Angepasste Layouts
- **Mobile**: Touch-optimierte Bedienung

## 🔮 Zukünftige Features

### Geplante Erweiterungen
- **ICS-Export**: Kalenderabgleich mit Google/Apple
- **Event-Series**: Abonnieren von Eventreihen
- **XP-System**: Belohnungen für Teilnahme
- **Social Features**: Kommentare und Bewertungen
- **Backend-Integration**: Echte Event-Datenbank

### Technische Verbesserungen
- **PWA**: Progressive Web App
- **Offline-Support**: Lokale Datenspeicherung
- **Push-Notifications**: Native Browser-Benachrichtigungen
- **Performance**: Lazy Loading und Optimierungen

## 🤝 Beitragen

### Entwicklung
1. Fork des Repositories
2. Feature-Branch erstellen
3. Änderungen committen
4. Pull Request erstellen

### Code-Stil
- TypeScript für alle neuen Dateien
- ESLint für Code-Qualität
- Prettier für Formatierung
- Komponenten-basierte Architektur

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

## 👥 Team

Entwickelt für die Battle64 Gaming-Community mit ❤️ und Nostalgie.

---

**Battle64 Event Calendar** - Wo Nostalgie auf Innovation trifft! 🎮✨