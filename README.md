# 🎮 N64 Quiz Show

Eine interaktive Quiz-App mit 90er-Jahre TV-Show-Design, die dein Wissen über Nintendo 64 Spiele testet!

## ✨ Features

### 🎯 Quiz-Funktionen
- **5 tägliche Fragen** zu N64-Spielen, Charakteren, Hardware und Geschichte
- **Multiple Choice** mit sofortiger Bewertung
- **Sofortige Erklärungen** nach jeder Antwort
- **Timer-Funktion** für Geschwindigkeits-Challenges

### 🏆 Gamification
- **Punktesystem**: 100 Punkte pro richtige Antwort
- **Badge-System** mit verschiedenen Achievements:
  - 🏆 Erster Sieg
  - ⭐ Perfektionist (100% Score)
  - ⚡ Geschwindigkeitsdämon (unter 60 Sekunden)
  - 🎮 N64-Experte (5 Siege in Folge)
  - 🧠 Wissensmeister (50 richtige Antworten)

### 📊 Statistiken & Ranglisten
- **Persönliche Statistiken**: Spiele gespielt, Gesamtpunktzahl, Durchschnitt, Bestleistung
- **Rangliste**: Top 5 Spieler mit Highscores
- **Detaillierte Auswertung** nach jedem Quiz

### 🎨 Design
- **90er-Jahre TV-Show Ästhetik** (Who Wants to be a Millionaire-Stil)
- **Retro-Farben** und Gradienten
- **Responsive Design** für Desktop und Mobile
- **Animierte Übergänge** und visuelle Effekte

## 🚀 Installation & Start

### Voraussetzungen
- Node.js (Version 14 oder höher)
- npm oder yarn

### Setup
1. **Dependencies installieren:**
   ```bash
   npm install
   ```

2. **App starten:**
   ```bash
   npm start
   ```

3. **Im Browser öffnen:**
   ```
   http://localhost:3000
   ```

## 🎮 Verwendung

1. **Quiz starten**: Klicke auf eine Antwort-Option
2. **Sofortige Bewertung**: Sieh sofort, ob deine Antwort richtig war
3. **Erklärung lesen**: Lerne mehr über die richtige Antwort
4. **Weiter**: Gehe zur nächsten Frage oder beende das Quiz
5. **Ergebnisse**: Sieh deine Punktzahl und verdiente Badges
6. **Statistiken**: Überprüfe deine Leistung und Ranglistenposition

## 🏗️ Projektstruktur

```
src/
├── components/
│   ├── QuizScreen.tsx      # Haupt-Quiz-Komponente
│   └── QuizScreen.css      # 90er-Jahre TV-Show Styles
├── data/
│   └── quizData.ts         # Quiz-Fragen und Badges
├── types/
│   └── quiz.ts            # TypeScript Interfaces
├── App.tsx                # Haupt-App-Komponente
├── App.css               # App-Styles
└── index.tsx             # App-Einstiegspunkt
```

## 🎯 Quiz-Kategorien

- **Spiele**: Super Mario 64, Zelda, GoldenEye 007, etc.
- **Charaktere**: Link, Mario, und andere N64-Helden
- **Hardware**: Reality Coprocessor, Rumble Pak, etc.
- **Geschichte**: Veröffentlichungsdaten, Launch-Titel, etc.

## 🔧 Technische Details

- **React 18** mit TypeScript
- **Moderne CSS** mit Flexbox und Grid
- **Responsive Design** für alle Bildschirmgrößen
- **State Management** mit React Hooks
- **90er-Jahre Ästhetik** mit CSS-Gradienten und Schatten

## 🎨 Design-Inspiration

Das Design ist inspiriert von klassischen 90er-Jahre TV-Shows wie:
- "Who Wants to be a Millionaire"
- "Jeopardy!"
- Retro-Gaming-Interfaces

## 📱 Browser-Kompatibilität

- Chrome (empfohlen)
- Firefox
- Safari
- Edge

## 🤝 Beitragen

Falls du Verbesserungen vorschlagen möchtest:
1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Erstelle einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

---

**Viel Spaß beim Quizzen! 🎮✨**