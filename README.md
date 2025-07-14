# 🎮 Battle64 - Cartbit HelpBot

Eine interaktive Retro-Gaming-Community mit einem freundlichen HelpBot-Charakter namens **Cartbit** - inspiriert von N64-Cartridges, aber visuell eigenständig und rechtlich unbedenklich.

## 🤖 Cartbit - Der Retro-Helfer

Cartbit ist ein freundlicher Begleiter in Form einer leicht abstrahierten Cartridge mit Gesicht, Armen und Humor. Er hilft neuen und erfahrenen Nutzern beim Zurechtfinden in Battle64.

### ✨ Features

- **🎨 Retro-Design**: Türkis-gelbe Cartridge mit leuchtenden LEDs und funkelnder Antenne
- **🎭 Animationen**: Wackelt beim Reden, blinkt bei Benachrichtigungen, jubelt bei Erfolgen
- **💬 Intelligente Hilfe**: Versteht natürliche Sprache und bietet kontextbezogene Antworten
- **🎯 Quick Actions**: Schnellzugriff auf häufige Funktionen (Events, Regeln, Suche)
- **📱 Responsive**: Funktioniert auf Desktop und Mobile
- **🌙 Dark Mode**: Automatische Anpassung an System-Einstellungen

### 🎨 Design-Merkmale

- **Name**: "Cartbit" (Cartridge + Bit)
- **Farben**: Türkis (#00d4ff) + Gelb (#ffd700)
- **Form**: Runde Ecken, keine originalgetreue Nintendo-Form
- **Details**: Zwei leuchtende LEDs, stylische Retropixel-Schuhe & Handschuhe
- **Interaktivität**: Funkelnde Bit-Antenne bei Aktionen

## 🚀 Installation & Start

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

## 📁 Projektstruktur

```
battle64/
├── src/
│   ├── components/
│   │   └── Cartbit/
│   │       ├── Cartbit.tsx      # Hauptkomponente
│   │       └── Cartbit.css      # Styling
│   ├── App.tsx                  # Haupt-App
│   ├── App.css                  # App-Styling
│   ├── main.tsx                 # Entry Point
│   └── index.css                # Globale Styles
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🎯 Verwendung

### Basis-Integration

```tsx
import { Cartbit } from './components/Cartbit/Cartbit';

function App() {
  return (
    <div className="App">
      {/* Deine App-Inhalte */}
      
      {/* Cartbit HelpBot */}
      <Cartbit />
    </div>
  );
}
```

### Mit Minimize-Funktion

```tsx
import { Cartbit } from './components/Cartbit/Cartbit';
import { useState } from 'react';

function App() {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="App">
      <Cartbit 
        isMinimized={isMinimized}
        onToggleMinimize={() => setIsMinimized(!isMinimized)}
      />
    </div>
  );
}
```

## 🎮 Hilfe-Themen

Cartbit versteht folgende Themen und Keywords:

- **Events starten**: "event", "starten", "spiel", "neues event"
- **Glitchruns**: "glitchrun", "glitch", "speedrun", "schnell"
- **Regeln**: "regeln", "regel", "buch", "regelbuch"
- **Profil**: "profil", "bearbeiten", "einstellungen", "zahnrad"

## 🎨 Anpassung

### Farben ändern

```css
/* In Cartbit.css */
.cartbit-body {
  background: linear-gradient(135deg, #deine-farbe 0%, #andere-farbe 100%);
  border: 3px solid #deine-akzent-farbe;
}
```

### Neue Hilfe-Themen hinzufügen

```tsx
const helpTopics: HelpTopic[] = [
  // ... bestehende Themen
  {
    id: 'neues-thema',
    title: 'Neues Thema',
    content: 'Beschreibung des neuen Themas! 🎯',
    keywords: ['keyword1', 'keyword2', 'keyword3']
  }
];
```

## 🎵 Humor & Persönlichkeit

Cartbit hat eine eigene Persönlichkeit mit:

- **Zufällige Fakten**: "Wusstest du? Ich war mal in einem Toaster – Retroprobleme! 🔌"
- **Emotionale Reaktionen**: Jubelt bei Erfolgen, guckt verwirrt bei Fehlern
- **Retro-Referenzen**: Spricht über Bits, Pixels und Chiptunes

## 🔧 Technische Details

- **Framework**: React 18 + TypeScript
- **Animationen**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: CSS mit CSS Variables für Theming

## 🎯 Rechtliche Sicherheit

- ✅ Keine Nintendo-Logos oder Details übernommen
- ✅ Allgemeine Cartridge-Form abstrahiert
- ✅ Eigene Farbpalette (Türkis + Gelb)
- ✅ Schutzfähigkeit als eigene Figur gegeben

## 🚀 Roadmap

- [ ] Sprachunterstützung (Englisch, Französisch)
- [ ] Erweiterte Animationen
- [ ] Sound-Effekte (optional)
- [ ] Integration mit Backend-API
- [ ] Erweiterte KI-Funktionen

## 📝 Lizenz

MIT License - Siehe LICENSE-Datei für Details.

## 🤝 Beitragen

Beiträge sind willkommen! Bitte erstellen Sie ein Issue oder Pull Request.

---

**Battle64** - Wo Retro-Gaming auf moderne Hilfe trifft! 🎮✨