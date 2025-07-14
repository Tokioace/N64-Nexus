# XP Level Screen Component

Ein React TypeScript Component für ein RPG-Style Level- und Erfahrungssystem mit schimmernden Effekten und klassischem RPG-Design.

## Features

### 🎮 Hauptfunktionen
- **Aktuelles Level & XP Anzeige**: Zeigt das aktuelle Level, XP-Fortschritt und das nächste Ziel
- **Animierter Fortschrittsbalken**: Mit Glanzeffekt und Farbverlauf (Blau/Violett/Gold)
- **Level-Belohnungen**: Zeigt Items, Titel und Skins für jedes Level an
- **Level-Up Historie**: Übersicht über vergangene Level-Ups mit Belohnungen
- **Responsive Design**: Funktioniert auf Desktop und Mobile

### 🎨 Design Features
- **RPG-Style Design**: Inspiriert von klassischen RPG-Spielen
- **Schimmernde Effekte**: Animierte Glanzeffekte und Shimmer-Animationen
- **Farbpalette**: Blau (#4a90e2), Violett (#9b59b6), Gold (#f39c12)
- **Glasmorphismus**: Moderne Glassmorphism-Effekte mit Backdrop-Blur
- **Smooth Animationen**: Sanfte Übergänge und Hover-Effekte

## Installation

```bash
npm install react react-dom
npm install --save-dev @types/react @types/react-dom
```

## Verwendung

### Grundlegende Verwendung

```tsx
import React, { useState } from 'react';
import XPLevelScreen from './XPLevelScreen';

function App() {
  const [showXPScreen, setShowXPScreen] = useState(false);

  return (
    <div>
      <button onClick={() => setShowXPScreen(true)}>
        XP Screen öffnen
      </button>

      {showXPScreen && (
        <XPLevelScreen
          currentLevel={4}
          currentXP={1250}
          xpToNextLevel={2000}
          totalXP={8750}
          onClose={() => setShowXPScreen(false)}
        />
      )}
    </div>
  );
}
```

### Props Interface

```tsx
interface XPLevelScreenProps {
  currentLevel: number;      // Aktuelles Level
  currentXP: number;         // Aktuelle XP im Level
  xpToNextLevel: number;     // XP benötigt für nächstes Level
  totalXP: number;           // Gesamte XP
  onClose?: () => void;      // Callback beim Schließen
}
```

## Komponenten-Struktur

### XPLevelScreen.tsx
- Hauptkomponente mit allen Features
- TypeScript Interfaces für Type Safety
- Sample-Daten für Belohnungen und Historie
- Responsive Design

### XPLevelScreen.css
- Vollständige CSS-Styles mit RPG-Theme
- Animierte Effekte und Transitions
- Responsive Breakpoints
- Custom Scrollbar Styling

## Belohnungssystem

Das Component unterstützt verschiedene Belohnungstypen:

```tsx
interface LevelReward {
  id: string;
  type: 'item' | 'title' | 'skin';
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
```

### Seltenheits-Farben
- **Common**: Grau (#9d9d9d)
- **Rare**: Blau (#0070dd)
- **Epic**: Violett (#a335ee)
- **Legendary**: Orange (#ff8000)

## Animationen

### Verfügbare Animationen
- `fadeIn`: Einblend-Animation beim Öffnen
- `shimmer`: Schimmernder Glanzeffekt
- `pulse`: Pulsierende Level-Nummer
- `progressGlow`: Glanzeffekt im Fortschrittsbalken

### CSS Keyframes
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

## Customization

### Farben anpassen
Die Hauptfarben können in der CSS-Datei angepasst werden:

```css
:root {
  --primary-blue: #4a90e2;
  --primary-purple: #9b59b6;
  --primary-gold: #f39c12;
}
```

### Belohnungen hinzufügen
Belohnungen können im `levelRewards` Objekt hinzugefügt werden:

```tsx
const levelRewards: Record<number, LevelReward[]> = {
  6: [
    {
      id: '9',
      type: 'item',
      name: 'Mythical Sword',
      description: 'A sword of legends',
      icon: '⚔️',
      rarity: 'legendary'
    }
  ]
};
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Demo

Führe die Demo-Komponente aus, um alle Features zu sehen:

```tsx
import Demo from './Demo';

// In deiner App
<Demo />
```

## Lizenz

MIT License - Frei verwendbar für kommerzielle und private Projekte.

## Beitragen

Verbesserungen und Bug-Fixes sind willkommen! Bitte erstelle ein Issue oder Pull Request.