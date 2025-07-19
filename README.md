# 🏁 Battle64 Speedrun Arena

Eine aufregende Speedrun-App rund um N64-Klassiker! Teste deine Geschwindigkeit, verbessere deine Zeiten und fordere andere Speedrunner heraus. Spaß steht im Vordergrund!

## ⚡ Hauptfeatures - Speedrunning im Fokus!

### 🏃‍♂️ Speedrun-Challenges
- **Speed Typing** - Tippe N64-Spieletitel so schnell wie möglich!
- **Lightning Reflexes** - Teste deine Speedrunner-Reflexe
- **Button Sequence** - Merke dir Controller-Button-Sequenzen
- **Pattern Rush** - Erkenne N64-Muster in Lichtgeschwindigkeit

### 🏆 Speedrun-Features
- **Live-Timer** - Präzise Zeitmessung bis zur Millisekunde
- **Personal Bests** - Verfolge deine Rekordzeiten
- **Leaderboards** - Vergleiche dich mit anderen Speedrunnern
- **Achievement-System** - Sammle Speedrun-Errungenschaften

### 🎮 Speedrun-Medien
- **Video-Aufzeichnung** - Zeichne deine besten Runs auf
- **Screenshot-Galerie** - Teile deine Erfolgsmomente
- **Community-Features** - Tausche dich mit anderen Speedrunnern aus
- **Verifikation** - Bestätige deine Rekordzeiten

### 🎯 Spaß-Features
- **Motivational Messages** - Täglich neue Speedrun-Motivation
- **Live-Events** - Teilnahme an Community-Speedrun-Events
- **Quick-Start** - Sofortiger Zugang zu deinen Lieblings-N64-Spielen
- **Retro-Design** - Authentisches N64-Feeling mit modernen Features

## 🚀 Installation & Start

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn

### Installation
```bash
# Repository klonen
git clone <repository-url>
cd battle64-speedrun-arena

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter `http://localhost:3000` verfügbar.

### Build für Produktion
```bash
npm run build
```

## 🎨 Technologie-Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Animationen**: Framer Motion

## 📁 Projektstruktur

```
src/
├── components/          # Wiederverwendbare Komponenten
│   ├── HomeScreenRetro.tsx    # Speedrun-fokussierte Startseite
│   ├── SpeedrunLeaderboard.tsx # Speedrun-Ranglisten
│   └── Layout.tsx             # Haupt-Layout
├── contexts/           # React Context für State Management
│   ├── UserContext.tsx        # User-State mit Speedrun-Daten
│   ├── MediaContext.tsx       # Speedrun-Medien Management
│   └── EventContext.tsx       # Speedrun-Events
├── pages/             # Seiten-Komponenten
│   ├── HomeScreenRetro.tsx    # Speedrun Arena Startseite
│   ├── MinigamesPage.tsx      # Speed-Challenges
│   ├── SpeedrunMediaPage.tsx  # Speedrun-Medien & Aufzeichnungen
│   ├── LeaderboardPage.tsx    # Ranglisten
│   └── ProfilePage.tsx        # Speedrunner-Profil
├── types/             # TypeScript Typdefinitionen
│   └── index.ts       # Alle Typen inkl. Speedrun-Daten
├── App.tsx            # Haupt-App-Komponente
└── main.tsx           # App-Einstiegspunkt
```

## 🏁 Speedrun-Modi

### Speed Challenges
- **Speed Typing** - Schnellstes Tippen von N64-Spieletiteln
- **Reaction Time** - Reflextest für Speedrunner
- **Memory Sequence** - Controller-Button-Sequenzen merken
- **Pattern Match** - Schnelle Mustererkennung

### Live-Events
- **Time Trials** - Gemeinschaftliche Zeitfahrten
- **Daily Challenges** - Täglich neue Speedrun-Herausforderungen
- **Weekly Competitions** - Wöchentliche Wettkämpfe
- **Community Events** - Spezielle Community-Veranstaltungen

## 🏅 Speedrun-Errungenschaften

- **Speed Demon** - 10 Sub-2-Minuten-Runs abschließen
- **Lightning Fast** - Reaktionszeit unter 200ms erreichen
- **Perfect Sequence** - Fehlerlose Button-Sequenz Level 10+
- **Typing Master** - 5 Speed-Typing-Challenges unter 10 Sekunden
- **Streak Master** - 7 Tage in Folge Challenges abschließen

## 🎯 N64-Spiele im Fokus

- **Mario Kart 64** - Rainbow Road Rush und mehr
- **Super Mario 64** - Klassische Speedrun-Strecken
- **GoldenEye 007** - Agenten-Missionen auf Zeit
- **Zelda: Ocarina of Time** - Epische Abenteuer-Speedruns
- **Super Smash Bros** - Schnelle Kämpfe
- **Mario Party** - Party-Game-Challenges

## 📊 Speedrun-Statistiken

- **Personal Records** - Alle deine besten Zeiten
- **Challenge Progress** - Fortschritt in verschiedenen Challenges
- **Community Ranking** - Deine Position in der Community
- **Achievement Tracking** - Verfolge deine Errungenschaften

## 🛠️ Entwicklung

### Verfügbare Scripts
```bash
npm run dev          # Entwicklungsserver starten
npm run build        # Produktions-Build erstellen
npm run preview      # Produktions-Build lokal testen
npm run lint         # ESLint ausführen
npm run type-check   # TypeScript-Typen prüfen
```

### Code-Struktur
- **TypeScript** für Typsicherheit
- **ESLint** für Code-Qualität
- **Prettier** für konsistente Formatierung
- **Tailwind CSS** für modernes Styling

## 🎮 Speedrun-Features im Detail

### Speedrun Arena (Hauptseite)
- Motivierende Speedrun-Nachrichten
- Live-Event-Anzeige mit aktuellen Leadern
- Quick-Start-Buttons für sofortiges Speedrunning
- Persönliche Statistiken und Fortschritt
- Schnelle Spielauswahl

### Speed Challenges
- Präzise Zeitmessung
- Persönliche Rekordverfolgung
- Verschiedene Schwierigkeitsgrade
- Sofortige Rückmeldung
- Motivierende Belohnungen

### Speedrun Media
- Video-Aufzeichnung deiner Runs
- Screenshot-Galerie
- Community-Sharing
- Verifikationssystem
- Admin-Panel für Medien-Management

## 🔮 Zukünftige Speedrun-Features

- **Live-Streaming** - Direkte Übertragung deiner Runs
- **Multiplayer-Races** - Echtzeit-Rennen gegen andere
- **Custom Challenges** - Erstelle eigene Speed-Challenges
- **Tournament Mode** - Organisierte Speedrun-Turniere
- **Mobile App** - Speedrunning unterwegs
- **VR-Integration** - Immersive Speedrun-Erlebnisse

## 🏆 Warum Speedrunning Spaß macht

- **Ständige Verbesserung** - Jeder Run kann ein neuer Rekord werden
- **Community** - Teile deine Leidenschaft mit anderen
- **Nostalgie** - Erlebe N64-Klassiker neu
- **Herausforderung** - Teste deine Grenzen
- **Belohnungen** - Sammle Achievements und Rekorde

## 🤝 Beitragen

Speedrunner-Community-Beiträge sind willkommen! Erstelle einen Pull Request oder öffne ein Issue für:
- Neue Speed-Challenges
- Verbesserungen der Timer-Genauigkeit
- Community-Features
- Bug-Fixes und Optimierungen

## 📄 Lizenz

MIT License - siehe LICENSE-Datei für Details.

---

**Ready to break some records? Let's speedrun! 🏁⚡🎮**