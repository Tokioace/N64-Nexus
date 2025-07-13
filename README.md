# Battle64 - N64 Gaming Community

Eine moderne N64 Gaming Community mit Nutzerprofilen und Fortschrittssystem, entwickelt mit React, TypeScript und Tailwind CSS.

## 🎮 Features

### Nutzerprofil & Fortschrittssystem
- **Benutzerkonten**: Username, Profilbild, Sammler-Level
- **Fortschrittsanzeige**: Dynamische Punkteübersicht mit täglichen, wöchentlichen und Gesamtpunkten
- **Medaillen & Auszeichnungen**: Sammle Medaillen für verschiedene Aktivitäten
- **Lieblingsspiele**: Bearbeitbare Liste mit bis zu 5 Lieblingsspielen
- **Öffentliche Profilansicht**: Kurz-URL zum Teilen des Profils

### Datenschutz & DSGVO-Compliance
- **Lokale Speicherung**: Alle Daten werden nur lokal gespeichert
- **Opt-in Consent**: Benutzer müssen der Datenspeicherung zustimmen
- **Datenschutz-Einstellungen**: Kontrolle über die Sichtbarkeit von Profildaten
- **Datenexport**: Möglichkeit zur Exportierung aller persönlichen Daten
- **Datenlöschung**: Vollständige Löschung aller gespeicherten Daten

### Fortschrittssystem
- **Punktevergabe**:
  - Sammlungseinträge: 10 Punkte
  - Zeitrennen: 25 Punkte
  - Events: 50 Punkte
  - Quiz: 15 Punkte
  - Minigames: 20 Punkte
  - Täglicher Login: 5 Punkte
  - Wöchentliche Herausforderungen: 100 Punkte

- **Sammler-Level**: 17 Level von 0 bis 16 mit steigenden Anforderungen
- **Medaillen**: Bronze, Silber, Gold, Platin und Legendär

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn

### Installation
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

### Verfügbare Scripts
- `npm run dev` - Startet den Entwicklungsserver
- `npm run build` - Erstellt einen Produktions-Build
- `npm run preview` - Zeigt eine Vorschau des Builds
- `npm run lint` - Führt ESLint aus
- `npm run lint:fix` - Behebt automatisch ESLint-Probleme

## 📁 Projektstruktur

```
src/
├── components/          # React-Komponenten
│   ├── ConsentBanner.tsx
│   └── Header.tsx
├── pages/              # Seitenkomponenten
│   ├── DashboardPage.tsx
│   ├── ProfilePage.tsx
│   └── WelcomePage.tsx
├── services/           # Business Logic
│   ├── storage.ts      # Lokale Speicherung
│   └── progressService.ts # Fortschrittssystem
├── types/              # TypeScript-Definitionen
│   └── index.ts
├── App.tsx             # Haupt-App-Komponente
├── main.tsx           # React-Einstiegspunkt
└── index.css          # Globale Styles
```

## 🎯 Verwendung

### Erste Schritte
1. Öffne die Anwendung im Browser
2. Akzeptiere die Datenschutz-Einstellungen
3. Erstelle dein Profil mit einem Benutzernamen
4. Starte mit den ersten Aktivitäten

### Dashboard
- Übersicht über deine Fortschritte
- Schnellaktionen für Demo-Zwecke
- Level-Fortschrittsbalken
- Letzte Aktivitäten und Medaillen

### Profil
- Bearbeite deine Profildaten
- Füge Lieblingsspiele hinzu
- Verwalte Datenschutz-Einstellungen
- Exportiere oder lösche deine Daten

## 🔧 Technische Details

### Technologie-Stack
- **Frontend**: React 18 mit TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint

### Datenspeicherung
- **Lokale Speicherung**: localStorage für alle Benutzerdaten
- **GDPR-Compliance**: Opt-in Consent, Datenexport, Datenlöschung
- **Keine Server-Kommunikation**: Alle Daten bleiben auf dem Gerät

### Fortschrittssystem
- **Punkteberechnung**: Automatische Berechnung basierend auf Aktivitäten
- **Level-System**: 17 Level mit steigenden Anforderungen
- **Medaillen-System**: Automatische Vergabe bei Erfüllung von Bedingungen
- **Tägliche Serien**: Verfolgung von Login-Serien

## 🏆 Medaillen-System

### Verfügbare Medaillen
- **Erste Schritte** (Bronze): Erstes Spiel zur Sammlung hinzugefügt
- **Sammler-Meister** (Silber): 50 Spiele gesammelt
- **Speedrunner** (Gold): 10 Zeitrennen abgeschlossen
- **Quiz-König** (Gold): 100 Quiz-Fragen beantwortet
- **Event-Champion** (Silber): An 5 Events teilgenommen
- **Oldschool-Sammler** (Platin): 20 Spiele aus 1996-2001 gesammelt
- **Täglicher Besucher** (Bronze): 7 Tage in Folge eingeloggt
- **Level 10** (Gold): Sammler-Level 10 erreicht

## 🔒 Datenschutz

### DSGVO-Compliance
- **Recht auf Information**: Klare Datenschutzerklärung
- **Recht auf Zustimmung**: Opt-in für Datenspeicherung
- **Recht auf Datenübertragbarkeit**: Export aller persönlichen Daten
- **Recht auf Löschung**: Vollständige Datenlöschung
- **Recht auf Einschränkung**: Kontrolle über Datensichtbarkeit

### Datenspeicherung
- Alle Daten werden nur lokal im Browser gespeichert
- Keine Übertragung an externe Server
- Daten bleiben auf dem Gerät des Benutzers
- Keine Klarnamenpflicht

## 🎨 Design

### Farbpalette
- **N64 Purple**: #6B46C1 (Hauptfarbe)
- **N64 Blue**: #3182CE (Sekundärfarbe)
- **N64 Green**: #38A169 (Erfolg)
- **N64 Yellow**: #D69E2E (Warnung)
- **N64 Red**: #E53E3E (Fehler)

### UI-Komponenten
- Moderne, responsive Design
- Retro-Gaming-Inspiration
- Zugängliche Benutzeroberfläche
- Mobile-First Ansatz

## 🚧 Entwicklung

### Hinzufügen neuer Features
1. Erstelle neue Komponenten in `src/components/`
2. Füge neue Seiten in `src/pages/` hinzu
3. Erweitere die Typen in `src/types/index.ts`
4. Implementiere Business Logic in `src/services/`

### Styling
- Verwende Tailwind CSS Klassen
- Nutze die vordefinierten Komponenten-Klassen
- Halte dich an die Farbpalette

## 📝 Lizenz

MIT License - Siehe LICENSE-Datei für Details.

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## 📞 Support

Bei Fragen oder Problemen erstelle ein Issue im Repository.

---

**Battle64** - Deine N64 Gaming Community mit modernem Fortschrittssystem! 🎮