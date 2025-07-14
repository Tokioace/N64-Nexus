# 🎮 Battle64 Quiz & Minigames

Ein unterhaltsames Quizsystem und Minigames rund um N64-Wissen, Konsolen, Charaktere und Spieleklassiker. Spieler verdienen Punkte für richtige Antworten und können sich mit anderen messen.

## ✨ Features

### 🧠 Quiz-System
- **Multiple Choice Fragen** - Klassische Quiz-Fragen zu N64-Spielen
- **Wahr/Falsch Fragen** - Schnelle Wissensabfrage
- **Bildbasierte Fragen** - Screenshots zuordnen (Platzhalter)
- **Reihenfolgenfragen** - Chronologische Anordnung von Spielen/Events

### 🎯 Quiz-Modi
- **Klassisches Quiz** - 10 zufällige Fragen
- **Tägliche Challenge** - 5 Fragen, jeden Tag neu
- **Speed Quiz** - 10 Sekunden pro Frage
- **Wöchentlicher Wettkampf** - 20 Fragen für Community-Ranking

### 🏆 Belohnungssystem
- **Punkte-System** - Punkte für richtige Antworten
- **Level-System** - Aufstieg durch Punkte sammeln
- **Errungenschaften** - Medaillen für besondere Leistungen
- **Rangliste** - Vergleich mit anderen Spielern

### 🎮 Minigames
- **N64 Emoji-Quiz** - Spiele anhand von Emojis erraten
- **Sound Memory** - Soundeffekte zuordnen (Coming Soon)
- **Match the Cartridge** - Fake-Covers echten Spielen zuordnen (Coming Soon)
- **Character Puzzle** - N64-Charaktere-Puzzles (Coming Soon)

### 📱 Mobile-First Design
- Responsive Design für alle Geräte
- Touch-optimierte Bedienung
- Flüssige Animationen und Übergänge
- Moderne UI mit N64-Theme

## 🚀 Installation & Start

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn

### Installation
```bash
# Repository klonen
git clone <repository-url>
cd battle64-quiz

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
│   └── Layout.tsx      # Haupt-Layout mit Navigation
├── contexts/           # React Context für State Management
│   ├── QuizContext.tsx # Quiz-Session Management
│   └── UserContext.tsx # User-State und Progress
├── data/              # Statische Daten
│   └── questions.ts   # Quiz-Fragen Datenbank
├── pages/             # Seiten-Komponenten
│   ├── HomePage.tsx   # Startseite
│   ├── QuizPage.tsx   # Quiz-Interface
│   ├── QuizResultPage.tsx # Ergebnis-Anzeige
│   ├── LeaderboardPage.tsx # Rangliste
│   ├── ProfilePage.tsx # Benutzer-Profil
│   └── MinigamesPage.tsx # Minigames
├── types/             # TypeScript Typdefinitionen
│   └── index.ts       # Alle Typen
├── App.tsx            # Haupt-App-Komponente
├── main.tsx           # App-Einstiegspunkt
└── index.css          # Globale Styles
```

## 🎯 Quiz-Kategorien

- **Allgemein** - Grundlegendes N64-Wissen
- **Charaktere** - N64-Spielcharaktere
- **Spiele** - N64-Spiele und deren Details
- **Hardware** - Konsolen, Controller, Zubehör
- **Musik** - Soundtracks und Komponisten
- **Geschichte** - Historische Fakten
- **Trivia** - Interessante Details

## 🏅 Errungenschaften

- **Erster Quiz** - Absolviere deinen ersten Quiz
- **Perfekte Runde** - Erreiche eine perfekte Punktzahl
- **Geschwindigkeitsdämon** - Beantworte 10 Fragen in unter 30 Sekunden
- **Wissensmeister** - Beantworte 100 Fragen korrekt
- **Tägliche Serie** - Spiele 7 Tage in Folge

## 🔐 Legalität

- Keine echten ROM-Dateien oder Soundtracks
- Alle Fragen basieren auf öffentlich zugänglichem Wissen
- Bildfragen sind Screenshot-inspiriert oder AI-generiert
- Respektiert geistige Eigentumsrechte

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
- **Tailwind CSS** für Styling

## 🎮 Spielmodi im Detail

### Klassisches Quiz
- 10 zufällige Fragen aus allen Kategorien
- Verschiedene Schwierigkeitsgrade
- Punkte basierend auf Schwierigkeit
- Kein Zeitlimit

### Tägliche Challenge
- 5 Fragen, jeden Tag neu
- Konsistente Fragen für alle Spieler
- Spezielle Belohnungen
- Community-Vergleich

### Speed Quiz
- 10 Sekunden pro Frage
- Bonus-Punkte für Schnelligkeit
- Adrenalin-Faktor
- Perfekt für schnelle Runden

## 📊 Statistiken & Fortschritt

- **Persönliche Statistiken** - Genauigkeit, Quizzes gespielt, etc.
- **Kategorie-Fortschritt** - Detaillierte Auswertung pro Kategorie
- **Level-System** - Aufstieg durch Punkte sammeln
- **Errungenschaften** - Sammle alle Medaillen

## 🔮 Zukünftige Features

- **Multiplayer-Modi** - Live-Quiz mit anderen Spielern
- **Erweiterte Minigames** - Mehr interaktive Spiele
- **Community-Features** - Quiz erstellen und teilen
- **Offline-Modus** - Spielen ohne Internet
- **Push-Benachrichtigungen** - Tägliche Erinnerungen

## 🤝 Beitragen

Beiträge sind willkommen! Bitte erstelle einen Pull Request oder öffne ein Issue für Verbesserungsvorschläge.

## 📄 Lizenz

MIT License - siehe LICENSE-Datei für Details.

---

**Viel Spaß beim Spielen! 🎮✨**