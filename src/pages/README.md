# ModulScannerScreen Component

Ein React TypeScript Component für das Scannen von N64-Cartridges mit Kamera-Funktionalität.

## Features

### 🎮 Kamera-Scanning
- Echte Kamera-Integration für das Scannen von N64-Cartridges
- Automatische Bildaufnahme während des Scans
- Scan-Animation mit grüner LED-Anzeige

### 📊 Informationsanzeige
- **Spielname**: Automatische Erkennung des Spiels
- **Region**: PAL/NTSC Erkennung mit farbigen Badges
- **Zustand**: Bewertung (Excellent/Good/Fair/Poor)
- **Marktwert**: Aktueller Schätzwert in Euro
- **Trivia**: Interessante Fakten zum Spiel
- **Verifizierung**: "Echt" oder "Scan erforderlich"

### 🎯 Benutzeroptionen
- **Zur Sammlung hinzufügen**: Speichert das Modul in der Sammlung
- **Nur Infos anzeigen**: Zeigt nur die Informationen ohne Speicherung
- **Neuer Scan**: Startet einen neuen Scan-Vorgang

### 🎨 Retro-Design
- Interface im Stil eines alten Scanners
- Grüne LED-Anzeige mit verschiedenen Status
- Vintage-Farbschema (Grün auf Schwarz)
- Animierte Scan-Linie und Effekte

## Verwendung

```tsx
import ModulScannerScreen from './pages/ModulScannerScreen';

function App() {
  return (
    <div className="App">
      <ModulScannerScreen />
    </div>
  );
}
```

## Technische Details

### Abhängigkeiten
- React 18+
- TypeScript
- WebRTC für Kamera-Zugriff

### Browser-Kompatibilität
- Moderne Browser mit WebRTC-Unterstützung
- HTTPS erforderlich für Kamera-Zugriff

### Mock-Datenbank
Das Component enthält eine integrierte Mock-Datenbank mit beliebten N64-Spielen:
- Super Mario 64
- The Legend of Zelda: Ocarina of Time
- GoldenEye 007
- Mario Kart 64

## Installation

1. Stelle sicher, dass React und TypeScript installiert sind
2. Kopiere die Dateien `ModulScannerScreen.tsx` und `ModulScannerScreen.css` in dein Projekt
3. Importiere das Component in deiner App

## Anpassung

### Neue Spiele hinzufügen
Erweitere das `cartridgeDatabase` Array in der Komponente:

```tsx
const cartridgeDatabase: CartridgeInfo[] = [
  // ... bestehende Spiele
  {
    name: 'Neues Spiel',
    region: 'PAL',
    condition: 'Excellent',
    marketValue: 50,
    trivia: 'Interessante Fakten zum Spiel...',
    authenticity: 'Echt'
  }
];
```

### Styling anpassen
Bearbeite die `ModulScannerScreen.css` Datei für eigene Farben und Effekte.

## Lizenz

MIT License - Battle64 Team