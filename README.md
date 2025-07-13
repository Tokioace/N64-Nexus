# 🎮 Battle64 Nexus - Profilkarte & Spielerstats

Eine React-Komponente für Battle64-Profile mit Spielerstatistiken im PES-Stil, inspiriert von der Nintendo 64-Ära.

## 🚀 Features

### 📊 Profilkarte
- **Avatar-System** mit Pixel-Art-Stil
- **Rangtitel** und **XP-System** mit animierten Fortschrittsbalken
- **Medaillen-System** mit verschiedenen Seltenheiten (Bronze, Silber, Gold, Platinum)
- **Fanpunkte** und **Lieblingsspiel** Anzeige
- **Region** und **Plattform** Informationen
- **Galerie** und **Freundschaftsfunktionen**

### 📈 Spielerstatistiken (PES-Stil)
- **Geschwindigkeit** (0-10 Rating mit Sternen)
- **Präzision** (Time-Trial Performance)
- **Glitch-Kompetenz** (Beherrschung von Exploits)
- **Spielvielfalt** (Anzahl verschiedener Spiele)
- **Original-Hardware** Status
- **Eventaktivität** (Teilnahmehäufigkeit)

### 🏆 Spezialfähigkeiten
- **Allrounder**: Überdurchschnittlich in 3+ Kategorien
- **Speeddemon**: Bester Zeitfaktor
- **Artmaster**: Meistbewertete Fanarts
- **Glitchmaster**: Glitch-Experte
- **Eventchampion**: Event-Sieger

## 🎨 Design

- **Retro N64-Design** mit authentischen Farben und Schatten
- **Animierte Übergänge** mit Framer Motion
- **Responsive Design** für alle Bildschirmgrößen
- **Tooltips** für detaillierte Informationen
- **Datenschutz-Einstellungen** (öffentlich/privat)

## 🛠️ Installation

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Build erstellen
npm run build
```

## 📁 Projektstruktur

```
src/
├── components/
│   ├── Battle64Profile.tsx    # Hauptkomponente
│   ├── Battle64Profile.css
│   ├── ProfileCard.tsx        # Profilkarte
│   ├── ProfileCard.css
│   ├── PlayerStats.tsx        # Spielerstatistiken
│   └── PlayerStats.css
├── types/
│   └── battle64.ts           # TypeScript Interfaces
├── App.tsx                   # Hauptanwendung
├── App.css
├── main.tsx                  # Einstiegspunkt
└── index.css                 # Globale Styles
```

## 🎯 Verwendung

```tsx
import Battle64Profile from './components/Battle64Profile';
import { PlayerProfile } from './types/battle64';

const profile: PlayerProfile = {
  id: '1',
  username: 'RetroKing93',
  avatar: 'avatar-url',
  rankTitle: 'Elite',
  region: 'Deutschland',
  platform: 'Nintendo 64',
  fanPoints: 2847,
  xp: 7840,
  maxXp: 10000,
  favoriteGame: 'Super Mario 64',
  stats: {
    speed: 8.3,
    precision: 9.6,
    glitchMastery: 5.5,
    gameVariety: 13,
    originalHardware: true,
    eventActivity: 24,
    averageTime: '2:44',
    bestTime: '2:10',
    totalMaps: 7
  },
  medals: [...],
  isPublic: true,
  specialAbility: {...}
};

function App() {
  return (
    <Battle64Profile
      profile={profile}
      onTogglePrivacy={(isPublic) => console.log('Privacy:', isPublic)}
      onViewGallery={() => console.log('View Gallery')}
      onAddFriend={() => console.log('Add Friend')}
    />
  );
}
```

## 🎨 Anpassung

### Farben
Die Farben können in `src/index.css` angepasst werden:

```css
:root {
  --n64-gray: #4a4a4a;
  --n64-gold: #ffd700;
  --n64-green: #00ff00;
  /* ... weitere Farben */
}
```

### Statistiken
Neue Statistiken können in `src/types/battle64.ts` hinzugefügt werden:

```typescript
export interface PlayerStats {
  speed: number;
  precision: number;
  // Neue Statistik hinzufügen
  newStat: number;
}
```

## 🔧 Technologien

- **React 18** mit TypeScript
- **Framer Motion** für Animationen
- **Vite** als Build-Tool
- **CSS Custom Properties** für Theming
- **Responsive Design** mit CSS Grid/Flexbox

## 📱 Browser-Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## 📄 Lizenz

MIT License - siehe LICENSE Datei für Details.

## 🎮 Battle64 Community

Teil der Battle64 Retro Gaming Community - wo Nostalgie auf moderne Web-Technologie trifft! 🕹️✨