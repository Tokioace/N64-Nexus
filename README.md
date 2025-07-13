# Battle64 - Freundesliste & Private Challenges

Eine moderne React-Anwendung für N64-Gaming-Enthusiasten, die es ermöglicht, Freunde zu verwalten und private Challenges zu erstellen.

## 🎮 Features

### 👥 Freundesverwaltung
- **Freunde suchen & hinzufügen** via Username, ID oder QR-Code
- **Freundschaftsanfragen** senden, annehmen und ablehnen
- **Online-Status** und Aktivitätsanzeige
- **Freundschaftsabzeichen** (z.B. "Seit 100 Tagen verbunden")
- **Erweiterte Suche** und Filteroptionen

### ⚔️ Private Challenges
- **Speedrun-Challenges**: 1vs1 Geschwindigkeitswettbewerbe
- **Fanart-Duelle**: Kreative Kunst-Challenges mit Voting
- **Quiz-Challenges**: N64-Wissen testen
- **Automatische Bewertung** oder Community-Voting
- **XP- und Badge-Belohnungen**

### 🎨 Gruppenchallenges
- **Teams bis 4 Personen** bilden
- **Gruppen-Speedruns** und Fan-Wettbewerbe
- **Interne Gruppenchat-Funktion**
- **Teamlogo & Name** frei wählbar

### 🛡️ Sicherheit & Privatsphäre
- **Drei Sichtbarkeitsstufen**: Öffentlich, Nur Freunde, Privat
- **Meldefunktion** bei Missbrauch
- **Blockieren von Nutzern**
- **Privatsphäre-Einstellungen** für Challenge-Teilnahme

## 🚀 Installation & Start

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Build für Produktion
npm run build

# Build Vorschau
npm run preview
```

## 🛠️ Technologie-Stack

- **React 18** mit TypeScript
- **Vite** als Build-Tool
- **Tailwind CSS** für Styling
- **React Router** für Navigation
- **Lucide React** für Icons
- **Retro Gaming Design** mit N64-Farbschema

## 📱 Komponenten-Struktur

```
src/
├── components/
│   ├── Navbar.tsx              # Hauptnavigation
│   ├── FriendList.tsx          # Freundesliste
│   ├── FriendCard.tsx          # Einzelner Freund
│   ├── AddFriendModal.tsx      # Freund hinzufügen
│   ├── PrivacySettings.tsx     # Privatsphäre-Einstellungen
│   ├── Challenges.tsx          # Challenge-Übersicht
│   ├── ChallengeCard.tsx       # Einzelne Challenge
│   ├── CreateChallengeModal.tsx # Challenge erstellen
│   └── Profile.tsx             # Benutzerprofil
├── types.ts                    # TypeScript-Definitionen
├── App.tsx                     # Hauptkomponente
├── main.tsx                    # Einstiegspunkt
└── index.css                   # Globale Styles
```

## 🎨 Design-System

### Farben
- **N64-Purple**: `#6B46C1` - Hauptfarbe
- **N64-Blue**: `#3182CE` - Sekundärfarbe
- **N64-Green**: `#38A169` - Erfolg/Online
- **N64-Red**: `#E53E3E` - Fehler/Warnung
- **N64-Yellow**: `#D69E2E` - Highlights
- **Retro-Gray**: `#2D3748` - Hintergrund
- **Retro-Dark**: `#1A202C` - Dunkler Hintergrund

### Typografie
- **Gaming Font**: "Press Start 2P" für Überschriften
- **Retro Font**: "Courier New" für Body-Text

## 🔧 Konfiguration

### Tailwind CSS
Das Projekt verwendet ein erweitertes Tailwind-Design-System mit:
- Custom Farben für N64-Thema
- Gaming-spezifische Fonts
- Retro-Animationen
- Responsive Design

### TypeScript
Strenge TypeScript-Konfiguration mit:
- Strict Mode aktiviert
- Unused Locals/Parameters Warnungen
- React JSX Support

## 📋 Challenge-Typen

### 🏃 Speedrun
- **Ziel**: Schnellste Zeit erreichen
- **Beispiel**: "Wer schafft schneller 3 Runden DK Jungle?"
- **Bewertung**: Automatische Zeitmessung
- **Belohnung**: XP + Speed King Badge

### 🎨 Fanart
- **Ziel**: Beste kreative Arbeit
- **Beispiel**: "Zelda Fanart zum Thema 'Hero's Journey'"
- **Bewertung**: Community-Voting
- **Belohnung**: XP + Fan Artist Badge

### 🧠 Quiz
- **Ziel**: Höchste Punktzahl
- **Beispiel**: "N64-Trivia: 20 Fragen in 10 Minuten"
- **Bewertung**: Automatische Auswertung
- **Belohnung**: XP + Quiz Master Badge

## 🔒 Sicherheitsfeatures

- **Privatsphäre-Einstellungen** für alle Benutzer
- **Blockieren von Nutzern** mit automatischem Challenge-Abbruch
- **Meldefunktion** für unangemessene Inhalte
- **Inhaltsmoderation** für Challenge-Einreichungen

## 🚀 Roadmap

### Phase 1 ✅ (Aktuell)
- [x] Freundesverwaltung
- [x] Private Challenges
- [x] Grundlegende UI/UX
- [x] Privatsphäre-Einstellungen

### Phase 2 🔄 (Geplant)
- [ ] Gruppenchallenges
- [ ] Chat-System
- [ ] Push-Benachrichtigungen
- [ ] Mobile App

### Phase 3 📋 (Zukunft)
- [ ] Leaderboards
- [ ] Turniere
- [ ] Streaming-Integration
- [ ] Social Features

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details.

## 🎮 Battle64 Community

Battle64 wird zur sozialen Retro-Zentrale – vernetzt durch Wettkampf, Kunst und gemeinsame Erinnerungen an die goldenen Zeiten des N64-Gamings.

---

**Entwickelt mit ❤️ für die N64-Community**