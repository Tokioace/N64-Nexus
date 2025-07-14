# AchievementsScreen Component

Ein umfassender React TypeScript Component für die Anzeige von Errungenschaften mit retro Medaillen- und Pokaldesign.

## Features

### 🏆 Funktionalitäten
- **Übersicht aller freischaltbaren Errungenschaften** - Vollständige Liste aller verfügbaren Achievements
- **Sortierung nach verschiedenen Kriterien**:
  - Name (alphabetisch)
  - Spiel (Poker, Blackjack, Roulette, etc.)
  - Event-Typ (Turnier, Herausforderung, Täglich, Spezial)
  - Punktzahl (höchste zuerst)
  - Datum (neueste zuerst)
- **Filteroptionen**:
  - Nach Spiel filtern
  - Nach Event-Typ filtern
  - Nur freigeschaltete Achievements anzeigen
- **Fortschrittsbalken für Meta-Achievements** - Visueller Fortschritt für mehrstufige Achievements
- **Sound-Effekte** - Optional ein/ausschaltbar

### 🎨 Design
- **Retro Medaillen- und Pokaldesign** mit goldenen Akzenten
- **Animierte Icons** mit Glow-Effekten für freigeschaltete Achievements
- **Responsive Design** für Desktop und Mobile
- **Hover-Effekte** und Smooth Transitions
- **Glasmorphismus-Effekte** mit Backdrop-Filter

## Komponenten-Struktur

### Achievement Interface
```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  game: string;
  eventType: 'tournament' | 'challenge' | 'daily' | 'special';
  points: number;
  icon: string;
  unlockedAt?: Date;
  progress?: number; // 0-100 für Meta-Achievements
  isMeta?: boolean;
  isUnlocked: boolean;
}
```

### Hauptkomponenten
- **AchievementsScreen** - Hauptkomponente
- **Header** - Titel und Statistiken
- **Controls** - Sortier- und Filteroptionen
- **Achievement Cards** - Einzelne Achievement-Anzeige
- **Progress Bars** - Fortschrittsanzeige für Meta-Achievements

## Verwendung

### Grundlegende Verwendung
```tsx
import AchievementsScreen from './AchievementsScreen';

function App() {
  return (
    <div>
      <AchievementsScreen />
    </div>
  );
}
```

### Mit eigenen Daten
```tsx
import AchievementsScreen from './AchievementsScreen';

const customAchievements = [
  {
    id: 'custom-1',
    name: 'Mein Achievement',
    description: 'Beschreibung des Achievements',
    game: 'Poker',
    eventType: 'tournament',
    points: 150,
    icon: '🎯',
    isUnlocked: false,
  },
  // ... weitere Achievements
];

function App() {
  return (
    <div>
      <AchievementsScreen achievements={customAchievements} />
    </div>
  );
}
```

## Styling

### CSS-Klassen
- `.achievements-screen` - Hauptcontainer
- `.achievement-card` - Einzelne Achievement-Karte
- `.achievement-card.unlocked` - Freigeschaltetes Achievement
- `.achievement-card.locked` - Gesperrtes Achievement
- `.achievement-icon` - Achievement-Icon mit Animationen
- `.progress-bar` - Fortschrittsbalken für Meta-Achievements

### Anpassbare Farben
```css
:root {
  --primary-gold: #ffd700;
  --secondary-gold: #ffed4e;
  --background-dark: #1a1a2e;
  --background-medium: #16213e;
  --background-light: #0f3460;
}
```

## Event-Typen

| Typ | Icon | Beschreibung |
|-----|------|--------------|
| `tournament` | 🏆 | Turnier-basierte Achievements |
| `challenge` | 🎯 | Herausforderungs-Achievements |
| `daily` | 📅 | Tägliche Achievements |
| `special` | ⭐ | Spezielle Event-Achievements |

## Sound-Effekte

Der Component verwendet die Web Audio API für Sound-Effekte:
- **Achievement Unlock Sound** - Dreiton-Sequenz (800Hz → 600Hz → 1000Hz)
- **Optional ein/ausschaltbar** über Checkbox
- **Browser-Kompatibilität** mit Fallback für ältere Browser

## Responsive Design

### Breakpoints
- **Desktop**: Grid-Layout mit 3+ Spalten
- **Tablet**: 2 Spalten
- **Mobile**: 1 Spalte, angepasste Icon-Größen

### Mobile Optimierungen
- Kleinere Icons (60px statt 80px)
- Vertikale Statistik-Anzeige
- Gestapelte Kontrollelemente

## Browser-Support

- **Chrome/Edge**: Vollständig unterstützt
- **Firefox**: Vollständig unterstützt
- **Safari**: Vollständig unterstützt (mit WebKit-Prefix)
- **IE11**: Nicht unterstützt (Web Audio API)

## Performance

- **Lazy Loading** für große Achievement-Listen
- **Memoization** für Filter- und Sortieroperationen
- **CSS-Animationen** für bessere Performance
- **Optimierte Re-Renders** durch React Hooks

## Erweiterte Features

### Meta-Achievements
Achievements mit Fortschrittsbalken für mehrstufige Ziele:
```typescript
{
  id: 'meta-1',
  name: 'Serienmeister',
  description: 'Gewinne 5 Turniere in Folge',
  isMeta: true,
  progress: 60, // 60% abgeschlossen
  isUnlocked: false,
}
```

### Statistiken
- Anzahl freigeschalteter Achievements
- Gesamtpunktzahl
- Erweiterbar für weitere Statistiken

## Installation

1. Kopiere `AchievementsScreen.tsx` und `AchievementsScreen.css` in dein Projekt
2. Stelle sicher, dass React und TypeScript installiert sind
3. Importiere und verwende die Komponente

## Abhängigkeiten

- React 16.8+ (für Hooks)
- TypeScript 4.0+
- Moderne Browser mit Web Audio API Support

## Lizenz

MIT License - Frei verwendbar für kommerzielle und private Projekte.