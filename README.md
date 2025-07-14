# N64-Nexus - Battle64 Modulscanner

🎮 **Dein Battle64 Modulscanner für die perfekte Retro-Sammlung**

Ein modernes Web-App zur Sammlungsvalidierung von N64-Modulen und anderen Retro-Spielen durch KI-gestützte Bilderkennung und OCR.

## ✨ Features

### 📱 Modulscanner
- **Cover-Scan**: Automatische Erkennung von Spielen durch Cover-Bilder
- **Barcode-Scan**: Unterstützung für Barcode-Erkennung (falls vorhanden)
- **Text-OCR**: Texterkennung für Modul-Labels und Verpackungstext
- **KI-Erkennung**: Intelligente Spielerkennung durch visuelle Merkmale

### 🏆 Sammlungsverwaltung
- **Automatische Integration**: Gescannte Spiele werden direkt zur Sammlung hinzugefügt
- **Verifikationsstatus**: Unterscheidung zwischen "Verifiziert durch Scan" und "Manuell hinzugefügt"
- **Duplikatwarnung**: Verhindert doppelte Einträge
- **Detaillierte Infos**: Spielname, Jahr, Entwickler, Region, Seltenheit, Marktwert

### 🎯 Gamification
- **Punktesystem**: Sammle Punkte für gescannte Module
- **Achievements**: "Scan-Experte" ab 25 Modulen, weitere Titel verfügbar
- **Statistiken**: Detaillierte Übersicht über deine Sammlung
- **Level-System**: Steige auf und erreiche neue Ziele

### 🎨 Retro-Design
- **Retrofokussiertes UI**: Authentisches Retro-Gaming-Design
- **Scan-Animationen**: Visuelle Effekte mit Scanlinien und Pixeleffekten
- **Chiptune-Feedback**: Audio-Feedback im Retro-Stil
- **Responsive Design**: Funktioniert auf Desktop und Mobile

## 🚀 Installation

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn

### Setup
```bash
# Repository klonen
git clone <repository-url>
cd n64-nexus

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# App öffnen
# Öffne http://localhost:3000 in deinem Browser
```

### Build für Produktion
```bash
npm run build
npm run preview
```

## 🛠️ Technologie-Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Kamera**: React Webcam
- **OCR**: Tesseract.js
- **Icons**: Lucide React
- **Animationen**: Framer Motion
- **Build Tool**: Vite

## 📱 Verwendung

### 1. Spiel scannen
1. Navigiere zum Scanner-Bereich
2. Wähle den Scan-Modus (Cover, Barcode, oder Text)
3. Halte das N64-Modul oder die Verpackung vor die Kamera
4. Bestätige das Foto
5. Warte auf die KI-Erkennung

### 2. Sammlung verwalten
- **Hinzufügen**: Bestätige nach dem Scan "Zur Sammlung hinzufügen"
- **Nur Infos**: Wähle "Nur Infos anzeigen" für Details ohne Hinzufügung
- **Verwaltung**: Überprüfe deine Sammlung im Sammlerbereich

### 3. Statistiken einsehen
- **Profil**: Sieh deine Achievements und Statistiken
- **Sammlung**: Filtere und sortiere deine Spiele
- **Punkte**: Verfolge deinen Fortschritt

## 🎮 Gamification-System

### Achievements
- **Scan-Experte**: 25 Module gescannt
- **Sammler**: 50 Spiele in Sammlung
- **Raritäten-Jäger**: 10 seltene Spiele
- **Wertvoll**: Sammlung im Wert von €5000

### Punkte-System
- **Basis-Punkt**: +1 für jedes gescannte Modul
- **Seltenheits-Bonus**: Zusätzliche Punkte für seltene Spiele
- **Reihen-Bonus**: Bonus für komplette Spielreihen

## 🔧 Konfiguration

### Umgebungsvariablen
```env
VITE_API_URL=your-api-url
VITE_OCR_LANGUAGE=eng
VITE_CAMERA_QUALITY=0.8
```

### Anpassungen
- **Farben**: Bearbeite `tailwind.config.js` für andere Farbschemata
- **Datenbank**: Erweitere die Mock-Daten in den Komponenten
- **OCR**: Konfiguriere Tesseract.js für andere Sprachen

## 📁 Projektstruktur

```
src/
├── components/          # React-Komponenten
│   ├── Navigation.tsx   # Hauptnavigation
│   ├── GameResult.tsx   # Scan-Ergebnis-Anzeige
│   └── ScanFrame.tsx    # Kamera-Scan-Rahmen
├── pages/              # Seiten-Komponenten
│   ├── Home.tsx        # Startseite
│   ├── Scanner.tsx     # Hauptscanner
│   ├── Collection.tsx  # Sammlungsverwaltung
│   └── Profile.tsx     # Benutzerprofil
├── App.tsx             # Haupt-App-Komponente
├── main.tsx           # App-Einstiegspunkt
└── index.css          # Globale Styles
```

## 🎯 Roadmap

### Phase 1 (Aktuell)
- ✅ Basis-Scanner-Funktionalität
- ✅ Sammlungsverwaltung
- ✅ Gamification-System
- ✅ Retro-UI-Design

### Phase 2 (Geplant)
- 🔄 Backend-Integration
- 🔄 Echte Datenbank-Anbindung
- 🔄 Multi-User-Support
- 🔄 Social Features

### Phase 3 (Zukunft)
- 🔄 Mobile App (React Native)
- 🔄 AR-Scanning
- 🔄 Marktplatz-Integration
- 🔄 Community-Features

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe `LICENSE` für Details.

## 🙏 Danksagungen

- **Nintendo** für die großartigen N64-Spiele
- **Tesseract.js** für die OCR-Funktionalität
- **Tailwind CSS** für das Styling-Framework
- **React Community** für die großartigen Tools

---

**N64-Nexus** - Verbinde Realität mit Retro! 🎮✨