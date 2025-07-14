# Battle64 - Spielstatistik- & Fortschrittsverfolgungssystem

🎮 Ein umfassendes System zur Verfolgung von Spielstatistiken, Fortschritten und Zielen für Retro-Gaming-Enthusiasten.

## 🚀 Features

### 📊 Spielstatistiken
- **Persönliche Bestzeiten** pro Spiel und Strecke
- **Globale Platzierungen** und Community-Vergleiche
- **Detaillierte Streckenzeiten** mit Lap-Analysen
- **Plattform- & Region-Tracking** (N64, PC, Emulator / PAL, NTSC)

### 🎯 Ziel- & Fortschrittssystem
- **Persönliche Ziele** mit automatischer Fortschrittsverfolgung
- **Challenge-Modus** gegen Freunde
- **Meilenstein-Planer** mit Benachrichtigungen
- **Fortschrittsringe** mit Farbkodierung (Rot/Gelb/Grün)

### 📈 Visualisierung & Analytics
- **Retro-Style Charts** mit Arcade-Design
- **Fortschrittskurven** und Zeitverbesserungen
- **Vergleichs-Tooltips** ("+2,3s gegenüber letzter Woche")
- **Export-Funktionen** für Social Media

### 🏆 Achievement-System
- **Statistik-Siegel** für besondere Leistungen
- **Kontinuitäts-Belohnungen** für regelmäßige Verbesserungen
- **Raritäts-System** (Common, Rare, Epic, Legendary)
- **Fortschritts-Tracking** für unvollständige Achievements

## 🛠️ Technologie-Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS mit Custom Retro-Theme
- **Charts**: Recharts für Datenvisualisierung
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **State Management**: React Context API

## 🎨 Design-System

### Farbpalette
- **Retro Purple**: `#8B5CF6` - Hauptfarbe
- **Retro Pink**: `#EC4899` - Akzentfarbe
- **Retro Green**: `#10B981` - Erfolge
- **Retro Yellow**: `#F59E0B` - Warnungen
- **Retro Red**: `#EF4444` - Fehler
- **Retro Blue**: `#3B82F6` - Informationen
- **Retro Cyan**: `#06B6D4` - Highlights

### Typografie
- **Arcade Font**: "Press Start 2P" für Überschriften
- **Retro Font**: "Courier New" für Text

### Animationen
- **Glow-Effekte** für wichtige Elemente
- **Hover-Transformationen** für Interaktivität
- **Progress-Animationen** für Fortschrittsbalken

## 📁 Projektstruktur

```
src/
├── components/          # Wiederverwendbare UI-Komponenten
│   ├── Navigation.tsx   # Hauptnavigation
│   ├── StatCard.tsx     # Statistik-Karten
│   ├── GameCard.tsx     # Spiel-Karten
│   ├── ProgressChart.tsx # Fortschritts-Charts
│   └── AchievementCard.tsx # Achievement-Karten
├── pages/              # Hauptseiten
│   ├── Dashboard.tsx   # Übersichts-Dashboard
│   ├── GameStats.tsx   # Spiel-spezifische Statistiken
│   ├── Goals.tsx       # Ziel-Management
│   ├── History.tsx     # Run-Verlauf
│   └── Profile.tsx     # Benutzer-Profil
├── contexts/           # React Context
│   └── GameDataContext.tsx # Globaler State
├── types/              # TypeScript-Definitionen
│   └── index.ts        # Interface-Definitionen
└── index.css           # Globale Styles
```

## 🚀 Installation & Setup

1. **Dependencies installieren**:
   ```bash
   npm install
   ```

2. **Entwicklungsserver starten**:
   ```bash
   npm run dev
   ```

3. **Build für Produktion**:
   ```bash
   npm run build
   ```

## 📊 Datenmodelle

### User
```typescript
interface User {
  id: string
  username: string
  avatar: string
  joinDate: Date
  totalGames: number
  totalRuns: number
}
```

### Game
```typescript
interface Game {
  id: string
  name: string
  platform: 'N64' | 'PC' | 'Emulator'
  region: 'PAL' | 'NTSC'
  releaseYear: number
  coverImage: string
  totalRuns: number
  personalBest?: Run
  globalRank?: number
}
```

### Run
```typescript
interface Run {
  id: string
  gameId: string
  userId: string
  totalTime: number // in Millisekunden
  trackTimes: TrackTime[]
  date: Date
  platform: 'N64' | 'PC' | 'Emulator'
  region: 'PAL' | 'NTSC'
  screenshot?: string
  video?: string
  notes?: string
  isPersonalBest: boolean
  isWorldRecord: boolean
}
```

### Goal
```typescript
interface Goal {
  id: string
  userId: string
  gameId: string
  trackId?: string
  targetTime: number
  currentBest?: number
  deadline?: Date
  isCompleted: boolean
  progress: number // 0-100
  type: 'personal' | 'challenge'
  challengeOpponent?: string
}
```

## 🎯 Verwendung

### Dashboard
- **Übersicht** aller wichtigen Statistiken
- **Letzte Spiele** mit Quick-Access
- **Aktive Ziele** mit Fortschrittsanzeige
- **Erfolge** und Achievements

### Spielstatistiken
- **Detaillierte Analysen** pro Spiel
- **Streckenzeiten-Vergleiche** (PB vs. WR)
- **Fortschritts-Charts** über Zeit
- **Run-Historie** mit Screenshots/Videos

### Ziel-Management
- **Neue Ziele** erstellen
- **Fortschritt** automatisch verfolgen
- **Challenge-Modus** gegen Freunde
- **Deadline-Management**

### Verlauf
- **Chronologische Run-Liste**
- **Filter-Optionen** (Spiel, Zeitraum, Plattform)
- **Export-Funktionen**
- **Markierung** wichtiger Runs

## 🔧 Konfiguration

### Tailwind CSS
Das Projekt verwendet ein custom Retro-Gaming-Theme mit:
- Custom Farben für Retro-Ästhetik
- Arcade-Fonts für authentisches Feeling
- Glow-Animationen für wichtige Elemente
- Responsive Design für alle Geräte

### Charts
Recharts wird für alle Datenvisualisierungen verwendet:
- Line Charts für Fortschrittskurven
- Bar Charts für Streckenvergleiche
- Custom Tooltips mit Retro-Styling
- Responsive Container für mobile Optimierung

## 🎮 Mock-Daten

Das System enthält umfangreiche Mock-Daten für:
- **3 Spiele**: Mario Kart 64, Super Mario 64, GoldenEye 007
- **Beispiel-Runs** mit detaillierten Streckenzeiten
- **Achievements** in verschiedenen Raritäten
- **Ziele** mit Fortschritts-Tracking

## 🚀 Nächste Schritte

### Geplante Features
- [ ] **Backend-Integration** mit REST API
- [ ] **Real-time Updates** für Live-Statistiken
- [ ] **Social Features** (Freunde, Leaderboards)
- [ ] **Mobile App** (React Native)
- [ ] **Export-Funktionen** (PDF, CSV)
- [ ] **Video-Integration** für Run-Analysen

### Performance-Optimierungen
- [ ] **Lazy Loading** für große Datenmengen
- [ ] **Caching-Strategien** für bessere Performance
- [ ] **Virtual Scrolling** für Run-Historie
- [ ] **Image Optimization** für Screenshots

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Implementiere deine Änderungen
4. Schreibe Tests für neue Features
5. Erstelle einen Pull Request

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz.

---

**Battle64** - Wo Retro-Gaming auf moderne Statistiken trifft! 🏁