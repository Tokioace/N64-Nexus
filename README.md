# SeasonEventsScreen Component

Eine moderne React TypeScript Komponente für die Anzeige saisonaler Events in einem Rennspiel.

## Features

### 🎯 Hauptfunktionen
- **Übersicht aller Events**: Anzeige aktueller, geplanter und vergangener saisonaler Events
- **Themenspezifische Events**: Halloween, Weihnachten, Sommer-Rennen, Frühling und Winter
- **Belohnungssystem**: Anzeige von Badges, Skins, Karten und Währungen mit Seltenheitsgraden
- **Kalenderintegration**: Countdown für Registrierungsfristen und Event-Zeitpläne

### 🎨 Design Features
- **Dynamisches Farbschema**: Automatische Anpassung der Farben basierend auf der aktuellen Jahreszeit
- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile
- **Moderne UI**: Glassmorphism-Effekte, Hover-Animationen und Smooth Transitions
- **Themenindikatoren**: Visuelle Darstellung der aktuellen Saison

### 🎮 Event Management
- **Status-Anzeige**: Aktiv, Geplant, Vergangen
- **Teilnehmer-Tracking**: Fortschrittsbalken mit aktueller Teilnehmerzahl
- **Registrierung**: Ein-Klick-Registrierung für kommende Events
- **Detailansicht**: Modal mit vollständigen Event-Informationen

## Installation

```bash
npm install
```

## Verwendung

```tsx
import SeasonEventsScreen from './SeasonEventsScreen';

function App() {
  return (
    <div className="App">
      <SeasonEventsScreen />
    </div>
  );
}
```

## Komponenten-Struktur

### Interfaces

```typescript
interface SeasonalEvent {
  id: string;
  name: string;
  theme: 'halloween' | 'christmas' | 'summer' | 'spring' | 'winter';
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  description: string;
  rewards: Reward[];
  isActive: boolean;
  isUpcoming: boolean;
  participants: number;
  maxParticipants: number;
}

interface Reward {
  id: string;
  name: string;
  type: 'badge' | 'skin' | 'card' | 'currency';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  imageUrl: string;
  description: string;
}
```

### Theme-System

Die Komponente erkennt automatisch die aktuelle Jahreszeit und passt das Farbschema entsprechend an:

- **Halloween** (Oktober): Orange, Braun, Gold
- **Weihnachten** (Dezember): Rot, Grün, Gold
- **Sommer** (Juni-August): Pink, Türkis, Gelb
- **Frühling** (März-Mai): Pink, Hellgrün, Rosa
- **Winter** (Standard): Himmelblau, Weiß, Gold

## CSS-Klassen

### Hauptcontainer
- `.season-events-screen`: Hauptcontainer der Komponente
- `.header`: Header-Bereich mit Titel und Theme-Indikator
- `.events-container`: Container für die Event-Karten

### Event-Karten
- `.event-card`: Basis-Styling für Event-Karten
- `.event-card.active`: Aktive Events mit Pulsier-Animation
- `.event-card.upcoming`: Geplante Events mit gestricheltem Rahmen
- `.event-card:hover`: Hover-Effekte

### Modal
- `.event-details-modal`: Modal-Overlay
- `.modal-content`: Modal-Inhalt
- `.modal-header`: Modal-Header mit Titel und Schließen-Button
- `.modal-body`: Modal-Body mit Event-Details

### Responsive Design
- Mobile-first Ansatz
- Breakpoints bei 768px und 480px
- Flexible Grid-Layouts
- Angepasste Touch-Targets

## Anpassung

### Neue Themes hinzufügen

```typescript
const getThemeColors = (theme: string) => {
  switch (theme) {
    case 'neues-theme':
      return {
        primary: '#HEXCODE',
        secondary: '#HEXCODE',
        accent: '#HEXCODE',
        background: '#HEXCODE',
        text: '#HEXCODE'
      };
    // ... weitere Cases
  }
};
```

### Event-Daten erweitern

```typescript
const mockEvents: SeasonalEvent[] = [
  {
    id: 'neues-event',
    name: 'Event Name',
    theme: 'halloween',
    startDate: new Date('2024-XX-XX'),
    endDate: new Date('2024-XX-XX'),
    registrationDeadline: new Date('2024-XX-XX'),
    description: 'Event Beschreibung',
    rewards: [
      // Belohnungen hier definieren
    ],
    isActive: false,
    isUpcoming: true,
    participants: 0,
    maxParticipants: 1000
  }
];
```

## Browser-Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Lizenz

MIT License