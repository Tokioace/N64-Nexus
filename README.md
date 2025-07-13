# 🧠 Battle64 Quiz System

Ein interaktives Quiz-System für N64-Enthusiasten mit Belohnungssystem, Duell-Modus und umfangreichem Wissenstest über Nintendo 64 Spiele, Retro-Geschichte und mehr.

## 🎯 Features

### 📚 Quiz-Kategorien
- **🎮 Spielwissen**: Fragen zu N64-Spielen (Mario Kart 64, Super Mario 64, Zelda, etc.)
- **📅 Release-Historie**: Wann erschien welches Spiel?
- **🧑‍🎨 Fanart-Quiz**: Erkennung von N64-Charakteren und Künstlern
- **🎼 Musik & Sounds**: Audiofragen zu Soundtracks und Soundeffekten
- **🐞 Glitches & Speedruns**: Berühmte Tricks und Techniken
- **🎉 Saison-Quiz**: Spezielle Feiertags- und Saisonfragen

### 🎮 Quiz-Modi
- **Einzelspieler**: Tagesquiz und Themenquiz
- **Duell-Modus**: 1v1 Quiz-Battles (Beta)
- **Gruppenmodus**: Team vs Team (geplant)

### 🎁 Belohnungssystem
- **XP-System**: +10 XP pro richtige Antwort, +100 XP für perfekte Quiz
- **Trophäen & Titel**: Sammle Achievements und steige auf
- **Leaderboard**: Tages-, Wochen- und Allzeit-Ranglisten

## 🚀 Installation

### Voraussetzungen
- Node.js (Version 18 oder höher)
- npm oder yarn

### Setup
```bash
# Repository klonen
git clone <repository-url>
cd battle64-quiz-system

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Build für Produktion
npm run build
```

## 🛠️ Technologie-Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Animationen**: Framer Motion

## 📁 Projektstruktur

```
src/
├── components/          # React-Komponenten
│   ├── Header.tsx      # Navigation und User-Info
│   └── QuizQuestion.tsx # Einzelne Quiz-Fragen
├── contexts/           # React Context für State Management
│   ├── QuizContext.tsx # Quiz-Session Management
│   └── UserContext.tsx # User-Profile und XP-System
├── data/              # Statische Daten
│   └── questions.ts   # Quiz-Fragen-Datenbank
├── pages/             # Seiten-Komponenten
│   ├── HomePage.tsx   # Startseite mit Kategorien
│   ├── QuizPage.tsx   # Quiz-Session
│   ├── DuelPage.tsx   # Duell-Modus
│   ├── LeaderboardPage.tsx # Ranglisten
│   └── ProfilePage.tsx # User-Profil
├── types/             # TypeScript-Definitionen
│   └── quiz.ts        # Quiz-bezogene Typen
├── App.tsx            # Haupt-App-Komponente
├── main.tsx           # React Entry Point
└── index.css          # Globale Styles
```

## 🎨 Design-System

### Farben
- **N64 Purple**: `#8B5CF6` - Hauptfarbe
- **N64 Blue**: `#3B82F6` - Akzentfarbe
- **N64 Green**: `#10B981` - Erfolg
- **N64 Red**: `#EF4444` - Fehler
- **N64 Yellow**: `#F59E0B` - Warnung

### Typografie
- **Pixel Font**: "Press Start 2P" für Überschriften
- **Retro Font**: "Courier New" für Text

### Animationen
- **Pixel Bounce**: Hover-Effekte
- **Glitch**: Fehler-Animationen
- **Countdown**: Timer-Animationen
- **Score Pop**: Punkte-Animationen

## 🎯 Quiz-System

### Frage-Typen
1. **Multiple Choice**: Standard-Fragen mit 4 Optionen
2. **True/False**: Wahr/Falsch-Fragen
3. **Image Recognition**: Bild-Erkennung
4. **Audio Questions**: Musik- und Sound-Erkennung

### Schwierigkeitsgrade
- **Einfach**: 10 Punkte
- **Mittel**: 15 Punkte
- **Schwer**: 20 Punkte

### Zeitlimit
- 30 Sekunden pro Frage
- Auto-Submit bei Zeitablauf

## 🏆 Achievement-System

### Verfügbare Achievements
- **First Quiz**: Erstes Quiz absolviert
- **Perfect Score**: 100% in einem Quiz
- **Speed Demon**: Quiz in unter 2 Minuten
- **Quiz-Meister 64**: Top 1 im Monat
- **Retro-Brain**: Alle Kategorien >90%
- **Duell Champion**: 10 Duelle gewonnen
- **Daily Streak**: 7 Tage in Folge

## 📊 Leaderboard-System

### Ranglisten-Typen
- **Tages-Rangliste**: Beste Spieler des Tages
- **Wochen-Rangliste**: Beste Spieler der Woche
- **Allzeit-Rangliste**: Beste Spieler aller Zeiten

### Bewertungskriterien
- Gesamtpunktzahl
- Level
- XP
- Quiz-Anzahl

## 🔧 Entwicklung

### Scripts
```bash
npm run dev          # Entwicklungsserver
npm run build        # Produktions-Build
npm run preview      # Build-Vorschau
npm run lint         # ESLint-Check
npm run type-check   # TypeScript-Check
```

### Code-Style
- TypeScript für Type Safety
- ESLint für Code-Qualität
- Prettier für Formatierung
- Tailwind CSS für Styling

## 🚧 Geplante Features

### Phase 2
- [ ] Echte Multiplayer-Duelle
- [ ] Team-Modus (4v4)
- [ ] Turnier-System
- [ ] Chat-System

### Phase 3
- [ ] Mobile App
- [ ] Offline-Modus
- [ ] Custom Quiz-Erstellung
- [ ] Social Features

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## 📝 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details.

## 🙏 Credits

- **Nintendo 64**: Alle Spiele und Charaktere sind Eigentum von Nintendo
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Press Start 2P)
- **Design**: Inspiriert von Retro-Gaming-Ästhetik

---

**Viel Spaß beim Quizzen! 🎮✨**