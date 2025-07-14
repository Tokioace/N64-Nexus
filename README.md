# Battle64 Newsfeed Birthday Special

Ein Retro-gaming Profil-System inspiriert von Pro Evolution Soccer und Tekken mit N64-Design.

## ProfilScreen Komponente

Die `ProfilScreen` Komponente (`src/pages/ProfilScreen.tsx`) bietet ein vollständiges Spielerprofil mit:

### Features:
- **Spieleravatar** (rund) oben links
- **Spielername, Rangtitel und XP-Leiste** mit animiertem Fortschrittsbalken
- **Statistik-Bereich** mit Icons:
  - Gespielte Spiele
  - Speedrun-Bestzeiten
  - Seltenheitswert der Sammlung (visualisiert mit Sternen)
- **Speedrun-Bestzeiten** Liste mit Spiel, Zeit, Kategorie und Datum
- **Sammlerstandorte** mit optionaler Kartenansicht
- **Achievements** mit Icons, Titeln und Seltenheitsgraden

### Design:
- **Retro-Interface** inspiriert von Pro Evolution Soccer und Tekken
- **N64-Farbpalette**: Dunkle Blautöne, Orange-Akzente, Scanline-Effekt
- **Visualisierungen**: Sterne, Balken, Icons für bessere UX
- **Responsive Design** für mobile Geräte
- **Hover-Effekte** und Animationen

### Technische Details:
- **TypeScript** für Typsicherheit
- **React Hooks** (useState, useEffect)
- **Modulare CSS** mit Retro-Styling
- **Mock-Daten** für Demo-Zwecke
- **Error Handling** für Avatar-Bilder

## Installation und Start

```bash
# Dependencies installieren
npm install

# React-App starten
npm run client

# Server starten (separat)
npm run dev
```

## Verwendung

```tsx
import ProfilScreen from './src/pages/ProfilScreen';

function App() {
  return <ProfilScreen />;
}
```

## Datenstruktur

Die Komponente verwendet TypeScript-Interfaces für:
- `Player`: Hauptspielerdaten
- `PlayerStats`: Statistiken
- `SpeedrunTime`: Speedrun-Zeiten
- `Achievement`: Achievements
- `CollectionLocation`: Sammlerstandorte

## Anpassung

Die Mock-Daten in `ProfilScreen.tsx` können durch echte API-Calls ersetzt werden. Die Komponente ist vollständig konfigurierbar über Props.