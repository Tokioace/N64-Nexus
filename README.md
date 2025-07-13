# Battle64 - Screenshot-/Video-Nachweis über die App

## 📸 Über Battle64

Battle64 ist eine React Native App, die für faire Bedingungen bei Gaming-Events sorgt, indem Spieler ihre Highscores oder Speedruns nur direkt über die App einreichen können – per Live-Screenshot, Videoaufnahme oder Livestream. So wird die Gültigkeit von Datum, Uhrzeit und Echtheit gewährleistet.

## 🎯 Hauptfunktionen

### 📷 Screenshot-Aufnahme
- **Live-Screenshot** mit automatischem Zeitstempel (Datum + Uhrzeit in UTC)
- **Event-spezifische Einreichung** nur während aktiver Event-Zeiträume
- **Automatische Wasserzeichen** "Battle64 Event – Datum – Uhrzeit"
- **Metadaten-Erfassung**: Event-ID, Benutzer-ID, Plattform (PAL/NTSC)
- **Geräteinformationen** und optionaler Standort

### 🎥 Videoaufnahme
- **Kurze Videoaufnahmen** (max. 60 Sekunden)
- **Nur App-interne Aufnahme** (keine Uploads von externen Videos)
- **Ideal für Gameplay-Beweis** oder spannende Spielszenen
- **Automatische Metadaten-Speicherung** lokal mit Zeitpunkt, User, Event

### 🏆 Event-Management
- **Aktive Events** mit detaillierten Informationen
- **Teilnehmer-Management** (Beitreten/Verlassen)
- **Regeln und Preise** für jedes Event
- **Live-Ranglisten** mit aktuellen Bestleistungen

### 🔐 Sicherheit & Datenschutz
- **DSGVO-konform** mit expliziter Nutzerfreigabe
- **Keine Kameraaufnahmen** außerhalb der App möglich
- **Sicherheits-Hash** für jede Einreichung
- **Privatsphäre-Modus** für erweiterte Datenschutz-Einstellungen

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn
- Expo CLI
- iOS Simulator oder Android Emulator (optional)

### Installation

1. **Repository klonen**
```bash
git clone <repository-url>
cd battle64-app
```

2. **Dependencies installieren**
```bash
npm install
# oder
yarn install
```

3. **App starten**
```bash
npm start
# oder
yarn start
```

4. **Auf Gerät testen**
- **Expo Go App** auf Ihrem Smartphone installieren
- QR-Code scannen oder
- **iOS Simulator** oder **Android Emulator** verwenden

### Entwicklung

```bash
# iOS Simulator starten
npm run ios

# Android Emulator starten
npm run android

# Web-Version starten
npm run web
```

## 📱 App-Struktur

```
src/
├── components/          # Wiederverwendbare UI-Komponenten
├── context/            # React Context für State Management
│   ├── AuthContext.tsx     # Benutzer-Authentifizierung
│   ├── EventContext.tsx    # Event-Management
│   └── MediaContext.tsx    # Medien-Aufnahme & -Verarbeitung
├── screens/            # App-Bildschirme
│   ├── HomeScreen.tsx      # Hauptbildschirm
│   ├── EventScreen.tsx     # Event-Details
│   ├── CameraScreen.tsx    # Screenshot-Aufnahme
│   ├── VideoScreen.tsx     # Video-Aufnahme
│   ├── SubmissionScreen.tsx # Einreichung überprüfen
│   ├── LeaderboardScreen.tsx # Ranglisten
│   └── SettingsScreen.tsx   # Einstellungen & Auth
├── services/           # API-Services (TODO)
├── types/              # TypeScript Typdefinitionen
└── utils/              # Hilfsfunktionen
```

## 🎮 Verwendung

### 1. Registrierung & Anmeldung
- App öffnen und Konto erstellen
- Plattform auswählen (PAL/NTSC)
- Nutzungsbedingungen akzeptieren

### 2. Events entdecken
- Aktive Events auf dem Hauptbildschirm anzeigen
- Event-Details einsehen (Regeln, Preise, Teilnehmer)
- Event beitreten

### 3. Screenshot aufnehmen
- Event auswählen
- Kamera öffnen und Screenshot aufnehmen
- Automatische Wasserzeichen und Metadaten
- Einreichung überprüfen und bestätigen

### 4. Video aufnehmen
- Event auswählen
- Videoaufnahme starten (max. 60 Sek.)
- Aufnahme beenden und überprüfen
- Einreichung bestätigen

### 5. Ranglisten verfolgen
- Aktuelle Bestleistungen einsehen
- Event-spezifische Statistiken
- Eigene Platzierung verfolgen

## 🔧 Konfiguration

### Kamera-Einstellungen
- **Bildqualität**: Niedrig/Mittel/Hoch
- **Blitz**: An/Aus/Automatisch
- **Fokus**: Automatisch/Manuell

### Video-Einstellungen
- **Videoqualität**: 360p/480p/720p
- **Audio**: An/Aus
- **Stabilisierung**: An/Aus
- **Maximale Dauer**: 60 Sekunden

### App-Einstellungen
- **Benachrichtigungen**: Push-Benachrichtigungen
- **Auto-Save**: Automatisches Speichern
- **Datennutzung**: Niedrig/Mittel/Hoch
- **Privatsphäre-Modus**: Erweiterte DSGVO-Einstellungen

## 🛡️ Sicherheitsfeatures

### Automatische Metadaten
- **Zeitstempel**: UTC-Zeit mit Datum
- **Event-ID**: Verknüpfung mit spezifischem Event
- **Benutzer-ID**: Authentifizierter Benutzer
- **Plattform**: PAL/NTSC-Angabe
- **Geräteinformationen**: Device-Model, OS-Version
- **Standort**: Optional mit Benutzerfreigabe

### Wasserzeichen
- **Automatische Generierung**: "Battle64 Event – Datum – Uhrzeit"
- **Position**: Konfigurierbar (Standard: unten-rechts)
- **Unveränderlich**: Teil der Bild-/Video-Datei

### Hash-Verifizierung
- **SHA-256 Hash** für jede Einreichung
- **Manipulationsschutz** durch kryptographische Signatur
- **Verifizierung** der Datei-Integrität

## 📋 Technische Details

### Technologie-Stack
- **React Native** mit Expo
- **TypeScript** für Typsicherheit
- **React Navigation** für Navigation
- **React Native Paper** für UI-Komponenten
- **Expo Camera** für Medienaufnahme
- **Expo SecureStore** für sichere Datenspeicherung

### Berechtigungen
- **Kamera**: Screenshot- und Videoaufnahme
- **Mikrofon**: Audio bei Videoaufnahmen
- **Standort**: Optionale Metadaten
- **Medienbibliothek**: Speichern von Aufnahmen

### Datenschutz (DSGVO)
- **Explizite Einwilligung** für Medienaufnahme
- **Minimale Datenerhebung** nur für Event-Zwecke
- **Löschung auf Anfrage** möglich
- **Transparente Verarbeitung** mit klaren Nutzungsbedingungen

## 🔮 Zukünftige Features

### Livestream-Modul
- **App-interne Streaming** (ähnlich Twitch, aber intern)
- **Nur verifizierte User** dürfen streamen
- **Temporäre Sichtbarkeit** während Events
- **Keine dauerhafte Speicherung**

### KI-gestützte Bildprüfung
- **Echtheitsanalyse** von Screenshots
- **HUD-Element-Erkennung** für Gameplay-Validierung
- **Manipulationserkennung** von Fake-Zeiten

### Erweiterte Analytics
- **Event-Statistiken** für Organisatoren
- **Teilnehmer-Performance** Tracking
- **Trend-Analysen** für verschiedene Spiele

## 🤝 Beitragen

1. Fork des Repositories
2. Feature-Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 📞 Support

Bei Fragen oder Problemen:
- **Issues** auf GitHub erstellen
- **Dokumentation** in diesem README
- **Code-Kommentare** in den Source-Dateien

---

**Battle64** - Für faire Gaming-Events mit rechtssicheren Nachweisen! 🎮📸