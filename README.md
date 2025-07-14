# Battle64 - Cartbit Profi-Modus Komponente

🧩 Eine reduzierte, unaufdringliche Version von Cartbit für erfahrene Battle64-Spieler.

## 🎯 Übersicht

Der Cartbit Profi-Modus bietet Power-Usern Kontrolle und Ruhe – ohne auf Hilfe verzichten zu müssen, wenn es wirklich zählt. Diese Komponente implementiert verschiedene Hilfe-Modi, die an die Erfahrung und Präferenzen der Spieler angepasst werden können.

## ✨ Features

### 🔧 Modus-Aktivierung
- **Standard-Modus**: Vollständige Cartbit-Hilfe mit Animationen und Sounds
- **Profi-Modus**: Reduzierte Hilfe für erfahrene Spieler
- **Text-Only**: Textbasierte Hilfe ohne Animationen
- **Error-Only**: Cartbit erscheint nur bei Problemen
- **Deaktiviert**: Cartbit komplett ausschalten

### 🙈 Verhalten im Profi-Modus
- Cartbit bleibt ausgeblendet oder erscheint als minimiertes Icon
- Keine aktiven Meldungen außer auf Wunsch
- Kein Autostart bei App-Launch
- Nur Text-Einblendungen im Kontext
- Keine Pieptöne, keine Bewegungen

### 💡 Design & UX
- Graues Icon im Retro-Menü-Look (Symbol: kleine Cartridge mit Brille)
- Tooltip: "Cartbit ist im Profi-Modus – klick für Hilfe"
- Dezent in der UI platziert (unten rechts minimierbar)
- Kein ständiges "Aufpoppen" oder Ablenken

### 🏆 XP-System
- **Cartbit Challenge**: Optional erhält man Mini-XP dafür, Hilfe nicht zu nutzen bei schwierigen Aufgaben
- Gamification-Elemente für selbstständiges Spielen
- XP-Tracking und -Anzeige

## 🚀 Installation

```bash
npm install
npm run dev
```

## 📦 Verwendung

### Grundlegende Integration

```tsx
import { CartbitProvider, useCartbit, CartbitTooltip } from './components/Cartbit';

function App() {
  return (
    <CartbitProvider>
      <YourGameComponent />
    </CartbitProvider>
  );
}
```

### Modus wechseln

```tsx
import { useCartbit } from './components/Cartbit';

function SettingsComponent() {
  const { setMode } = useCartbit();
  
  const handleModeChange = (mode) => {
    setMode(mode); // 'standard' | 'profi' | 'text-only' | 'error-only' | 'disabled'
  };
  
  return (
    <button onClick={() => handleModeChange('profi')}>
      Profi-Modus aktivieren
    </button>
  );
}
```

### Nachrichten hinzufügen

```tsx
import { useCartbit } from './components/Cartbit';

function GameComponent() {
  const { addMessage } = useCartbit();
  
  const handleAction = () => {
    addMessage({
      type: 'info',
      message: 'Du kannst hier Fanart posten',
      context: 'Klicke auf den Upload-Button'
    });
  };
  
  return <button onClick={handleAction}>Aktion ausführen</button>;
}
```

### Tooltips verwenden

```tsx
import { CartbitTooltip } from './components/Cartbit';

function GameButton() {
  return (
    <CartbitTooltip
      message="Sammle eine Waffe"
      context="Benötigt für Angriffe"
    >
      <button>⚔️ Waffe sammeln</button>
    </CartbitTooltip>
  );
}
```

### Profi-Challenges

```tsx
import { useProfiChallenge } from './components/Cartbit';

function GameComponent() {
  const { triggerChallenge } = useProfiChallenge();
  
  const handleDifficultAction = () => {
    // Führe schwierige Aktion aus
    triggerChallenge('Gegner besiegt', 5); // +50 XP
  };
  
  return <button onClick={handleDifficultAction}>Schwierige Aktion</button>;
}
```

## 🏗️ Architektur

### Komponenten-Struktur

```
src/
├── components/
│   └── Cartbit/
│       ├── CartbitProvider.tsx    # Haupt-Provider
│       ├── CartbitIcon.tsx        # Minimiertes Icon
│       ├── CartbitSettings.tsx    # Einstellungen-Modal
│       ├── CartbitMessage.tsx     # Nachrichten & Tooltips
│       └── index.ts              # Export-Datei
├── store/
│   └── cartbitStore.ts           # Zustand-Management
└── types/
    └── cartbit.ts                # TypeScript-Definitionen
```

### State Management

Die Komponente verwendet Zustand für:
- **Settings**: Modus, Sichtbarkeit, Animationen, etc.
- **Messages**: Nachrichten-Queue und -Status
- **XP**: Profi-Modus XP-Tracking
- **UI State**: Minimiert-Status, Modal-Status

### Persistierung

Einstellungen werden automatisch im localStorage gespeichert:
- Modus-Einstellungen
- XP-Earned
- Letzte Aktivität

## 🎮 Demo

Die Demo-Anwendung zeigt alle Features:

1. **Modus-Test**: Wechsel zwischen verschiedenen Modi
2. **XP-System**: Sammle XP durch selbstständiges Spielen
3. **Tooltips**: Hover über Buttons für Hilfe
4. **Nachrichten**: Verschiedene Nachrichten-Typen
5. **Challenges**: Profi-Challenges auslösen

### Demo starten

```bash
npm run dev
```

Öffne http://localhost:3000 und teste die verschiedenen Modi!

## 🔧 Konfiguration

### Modus-spezifische Einstellungen

```typescript
const modeSettings = {
  standard: {
    isVisible: true,
    showAnimations: true,
    showSounds: true,
    autoStart: true,
    showTooltips: true,
  },
  profi: {
    isVisible: false,
    showAnimations: false,
    showSounds: false,
    autoStart: false,
    showTooltips: true,
  },
  // ... weitere Modi
};
```

### Anpassbare Nachrichten

```typescript
const welcomeMessages = {
  standard: {
    type: 'info',
    message: 'Willkommen bei Battle64! Ich bin Cartbit, dein Gaming-Assistent.',
    context: 'Ich helfe dir beim Spielen und Lernen neuer Features.',
  },
  profi: {
    type: 'info',
    message: 'Profi-Modus aktiviert! Du erhältst XP für selbstständiges Spielen.',
    context: 'Klicke auf mein Icon, wenn du Hilfe brauchst.',
  },
  // ... weitere Modi
};
```

## 🎨 Styling

Die Komponente verwendet Tailwind CSS und kann über CSS-Klassen angepasst werden:

```css
/* Custom Cartbit Icon */
.cartbit-icon {
  @apply fixed bottom-4 right-4 z-50;
}

/* Custom Message Styling */
.cartbit-message {
  @apply bg-white rounded-lg shadow-lg border;
}
```

## 📱 Responsive Design

- Mobile-first Ansatz
- Anpassbare Positionierung
- Touch-freundliche Interaktionen
- Responsive Tooltips

## 🔒 Sicherheit

- Keine sensiblen Daten in localStorage
- Sichere Persistierung nur von UI-Einstellungen
- Keine externen API-Calls

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## 📄 Lizenz

MIT License - siehe LICENSE-Datei für Details.

## 🆘 Support

Bei Fragen oder Problemen:
1. Überprüfe die Demo-Anwendung
2. Schaue in die TypeScript-Definitionen
3. Erstelle ein Issue im Repository

---

**Fazit**: Der Profi-Modus gibt Power-Usern Kontrolle und Ruhe – ohne auf Hilfe verzichten zu müssen, wenn es wirklich zählt. 🎮✨