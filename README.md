# 🎮 Battle64 - FAQ & Regelwerk Komponente

Eine moderne, interaktive FAQ und Regelwerk-Komponente für die Battle64 Gaming-Community, gestaltet im Retro-Gaming-Stil.

## 📋 Übersicht

Diese Komponente bietet neue Battle64-Nutzer eine umfassende Anleitung mit:
- **📚 Regelwerk**: Detaillierte Regeln für Speedruns, Fairplay, Fanart und Community-Verhalten
- **❓ FAQ-System**: Häufig gestellte Fragen mit Suchfunktion und Kategoriefilterung
- **🎨 Retro-Design**: Authentisches 80er/90er Jahre Gaming-Interface
- **📱 Responsive**: Optimiert für Desktop und Mobile-Geräte

## ✨ Features

### Regelwerk
- **Kategorisierte Regeln**: Speedruns, Fairplay, Fanart, Community, Datenschutz
- **Interaktive Accordion-Ansicht**: Einfache Navigation durch Regelkategorien
- **Pixel-Icons**: Retro-Gaming-Symbolik für jede Kategorie
- **Wichtige Hinweise**: Klare Konsequenzen bei Regelverstößen

### FAQ-System
- **Intelligente Suche**: Durchsucht Fragen, Antworten und Tags
- **Kategoriefilter**: Filterung nach Themenbereichen
- **Feedback-System**: "War diese Antwort hilfreich?" mit Kommentarfunktion
- **Tag-System**: Schnelle Navigation durch verwandte Themen

### Design & UX
- **Retro-Pixel-Design**: Authentisches Gaming-Interface
- **Smooth Animations**: Framer Motion für flüssige Übergänge
- **Responsive Layout**: Optimiert für alle Bildschirmgrößen
- **Accessibility**: Barrierefreie Navigation und Bedienung

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn

### Installation
```bash
# Repository klonen
git clone [repository-url]
cd battle64-faq-rulebook

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

### Build für Produktion
```bash
# Produktions-Build erstellen
npm run build

# Build preview starten
npm run preview
```

## 📁 Projektstruktur

```
battle64-faq-rulebook/
├── src/
│   ├── components/
│   │   ├── Rulebook.tsx      # Regelwerk-Komponente
│   │   └── FAQ.tsx           # FAQ-Komponente
│   ├── App.tsx               # Haupt-App-Komponente
│   ├── main.tsx              # App-Einstiegspunkt
│   ├── index.css             # Globale Styles
│   └── App.css               # App-spezifische Styles
├── public/
├── index.html                # HTML-Template
├── package.json              # Dependencies & Scripts
├── tsconfig.json             # TypeScript-Konfiguration
├── vite.config.ts            # Vite-Konfiguration
└── README.md                 # Projekt-Dokumentation
```

## 🎨 Design-System

### Farbpalette
- **Primary**: `#00ff00` (Neon-Grün)
- **Secondary**: `#ff6b35` (Orange)
- **Accent**: `#4ecdc4` (Türkis)
- **Background**: `#1a1a1a` (Dunkelgrau)
- **Text**: `#ffffff` (Weiß)
- **Border**: `#333333` (Grau)

### Typografie
- **Headers**: 'Press Start 2P' (Pixel-Font)
- **Body**: 'VT323' (Terminal-Font)

### Komponenten
- **Retro Cards**: Pixel-bordered containers
- **Accordion**: Expandable content sections
- **Search Input**: Styled search field
- **Buttons**: Pixel-art button design

## 🔧 Konfiguration

### Regelwerk anpassen
Die Regeln können in `src/components/Rulebook.tsx` bearbeitet werden:

```typescript
const ruleCategories: RuleCategory[] = [
  {
    id: 'speedruns',
    title: 'Speedruns',
    icon: '🕹️',
    rules: [
      {
        id: 'sr-1',
        title: 'Regel-Titel',
        content: 'Regel-Beschreibung',
        icon: '📸'
      }
    ]
  }
]
```

### FAQ erweitern
FAQ-Einträge können in `src/components/FAQ.tsx` hinzugefügt werden:

```typescript
const faqData: FAQItem[] = [
  {
    id: 'unique-id',
    question: 'Deine Frage?',
    answer: 'Deine Antwort.',
    category: 'Kategorie',
    icon: '✨',
    tags: ['tag1', 'tag2']
  }
]
```

## 📱 Integration

### Als React-Komponente
```tsx
import Rulebook from './components/Rulebook'
import FAQ from './components/FAQ'

function App() {
  return (
    <div>
      <Rulebook />
      <FAQ />
    </div>
  )
}
```

### Routing-Integration
```tsx
import { Routes, Route } from 'react-router-dom'

<Routes>
  <Route path="/rules" element={<Rulebook />} />
  <Route path="/faq" element={<FAQ />} />
</Routes>
```

## 🎯 Verwendung in Battle64

### Hauptmenü-Integration
- **Regeln & Verhaltenskodex**: Direktlink zum Regelwerk
- **Hilfe & FAQ**: FAQ-Bereich für Support

### Account-Erstellung
- **Regel-Akzeptierung**: Checkbox "Ich akzeptiere die Regeln"
- **Erste Schritte**: Automatische Weiterleitung zum FAQ

### Kontextuelle Links
- **Fanart-Upload**: "Regeln für Fanart anzeigen"
- **Event-Teilnahme**: "Event-Regeln lesen"
- **Speedrun-Einreichung**: "Speedrun-Richtlinien"

## 🔄 Updates & Wartung

### Regeln aktualisieren
1. Bearbeite die `ruleCategories` in `Rulebook.tsx`
2. Füge Update-Datum hinzu
3. Kommuniziere Änderungen an die Community

### FAQ erweitern
1. Neue Einträge in `faqData` hinzufügen
2. Kategorien bei Bedarf erweitern
3. Tags für bessere Suche verwenden

### Design anpassen
- CSS-Variablen in `index.css` bearbeiten
- Neue Komponenten in separaten Dateien erstellen
- Responsive Breakpoints anpassen

## 🤝 Community-Beitrag

### Feedback-System
- FAQ-Feedback wird gesammelt
- Regeln können kommentiert werden
- Community-Vorschläge werden berücksichtigt

### Moderation
- Regelverstöße melden
- FAQ-Verbesserungen vorschlagen
- Design-Feedback geben

## 📄 Lizenz

MIT License - Siehe LICENSE-Datei für Details.

## 🙏 Credits

- **Design**: Retro-Gaming inspiriert von klassischen Konsolen
- **Icons**: Emoji-basierte Pixel-Icons
- **Fonts**: Google Fonts (Press Start 2P, VT323)
- **Framework**: React + TypeScript + Vite

---

**Battle64 Community** - Gemeinsam für faire und unterhaltsame Retro-Gaming-Erlebnisse! 🎮✨