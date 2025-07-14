# 🎮 Battle64 - Retro N64 Experience

Eine moderne React-App mit authentischen Retro-N64-Soundeffekten und Design.

## ✨ Features

- 🎵 **Vollständige Sound-Integration** mit Retro-N64-Style Effekten
- 🎨 **Authentisches Retro-Design** inspiriert von klassischen N64-Spielen
- 🏆 **Achievement-System** mit Sound-Feedback
- 📊 **Level-System** mit Level-Up-Sounds
- 🔊 **Hintergrundmusik** mit Loop-Funktion
- 🎛️ **Lautstärke-Kontrolle** und Stummschaltung
- 📱 **Responsive Design** für alle Geräte
- ⚡ **Smooth Animations** und Übergänge

## 🎵 Soundeffekte

Die App verwendet einen fortschrittlichen SoundManager mit folgenden Features:

### UI Sounds:
- **Sidebar öffnen/schließen** - Retro-Swish-Sounds
- **Button-Klicks** - 8-bit Click-Effekte
- **Hover-Effekte** - Subtile Audio-Feedback

### Game Sounds:
- **Achievement freigeschaltet** - Triumph-Sounds
- **Level-Up** - Erfolgs-Fanfaren
- **Hintergrundmusik** - Loopende Retro-Tracks

## 🚀 Installation

1. **Repository klonen:**
```bash
git clone <repository-url>
cd battle64
```

2. **Dependencies installieren:**
```bash
npm install
```

3. **Sound-Dateien hinzufügen:**
   - Erstelle den Ordner `public/sounds/`
   - Füge die benötigten Sound-Dateien hinzu (siehe `public/sounds/README.md`)

4. **Entwicklungsserver starten:**
```bash
npm run dev
```

5. **App öffnen:**
   - Gehe zu `http://localhost:3000`

## 📁 Projektstruktur

```
battle64/
├── src/
│   ├── components/
│   │   ├── Battle64App.tsx      # Haupt-App-Komponente
│   │   └── Sidebar.tsx          # Sidebar mit Navigation
│   └── utils/
│       └── SoundManager.ts      # Audio-Management
├── pages/
│   ├── _app.tsx                 # Next.js App-Wrapper
│   ├── index.tsx                # Hauptseite
│   └── api/sounds/[...path].ts  # Sound-API
├── public/
│   └── sounds/                  # Sound-Dateien
├── styles/
│   └── globals.css              # Globale Styles
└── package.json
```

## 🎵 SoundManager Features

### Grundfunktionen:
```typescript
import { playSound, playBackgroundMusic, toggleMute } from '../utils/SoundManager';

// Einzelne Sounds abspielen
playSound('/sounds/button-click.mp3');

// Hintergrundmusik starten
playBackgroundMusic('/sounds/bg-theme.mp3');

// Stummschaltung umschalten
toggleMute();
```

### Erweiterte Features:
- **Singleton-Pattern** für konsistente Audio-Verwaltung
- **Automatische Fehlerbehandlung** für fehlende Dateien
- **Volume-Kontrolle** mit Persistierung
- **Browser-Kompatibilität** mit Fallbacks

## 🎨 Design-System

### Farbpalette:
- **Primär**: `#00ff88` (Neon-Grün)
- **Sekundär**: `#1a1a2e` (Dunkel-Blau)
- **Akzent**: `#0f3460` (Navy-Blau)
- **Text**: `#ffffff` (Weiß)

### Typografie:
- **Font**: `Courier New` (Monospace)
- **Stil**: Retro, 8-bit, N64-Inspiriert

### Animationen:
- **Hover-Effekte** mit Glow-Effekten
- **Smooth Transitions** für alle Interaktionen
- **Floating Elements** für Retro-Feeling

## 🔧 Konfiguration

### Sound-Einstellungen:
```typescript
// Standard-Volume (0.0 - 1.0)
const defaultVolume = 0.6;

// Hintergrundmusik-Volume (reduziert)
const bgMusicVolume = 0.3;
```

### Browser-Kompatibilität:
- **Chrome/Edge**: Vollständige Unterstützung
- **Firefox**: Vollständige Unterstützung
- **Safari**: Benötigt User-Interaktion für Audio
- **Mobile**: Touch-Optimiert

## 🎯 Verwendung

### Sidebar öffnen/schließen:
- Klicke auf den Hamburger-Button (oben links)
- Soundeffekte werden automatisch abgespielt

### Kampf starten:
- Klicke auf "🎮 Kampf starten"
- Score erhöht sich um 10 Punkte
- Level-Up bei 100 Punkten

### Achievements:
- **"Erste Schritte"** bei 50 Punkten
- **"Kampfmeister"** bei 100 Punkten

### Audio-Kontrolle:
- **Stummschaltung**: Button in der Hauptansicht
- **Lautstärke**: Slider unter den Aktionen

## 🛠️ Entwicklung

### Neue Sounds hinzufügen:
1. Sound-Datei in `public/sounds/` platzieren
2. In der entsprechenden Komponente importieren:
```typescript
const newSound = '/sounds/new-sound.mp3';
playSound(newSound);
```

### Neue Komponenten:
1. Komponente in `src/components/` erstellen
2. SoundManager importieren
3. Soundeffekte für Interaktionen hinzufügen

## 📱 Responsive Design

- **Desktop**: Vollständige Funktionalität
- **Tablet**: Angepasste Sidebar
- **Mobile**: Touch-optimierte Buttons

## 🎵 Sound-Quellen

Empfohlene Quellen für Retro-Sounds:
- [Freesound.org](https://freesound.org/) - Kostenlose Soundeffekte
- [OpenGameArt.org](https://opengameart.org/) - Retro Gaming Sounds
- [BeepBox.co](https://www.beepbox.co/) - Online 8-bit Generator

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Implementiere deine Änderungen
4. Füge Soundeffekte für neue Features hinzu
5. Erstelle einen Pull Request

## 📄 Lizenz

MIT License - siehe LICENSE-Datei für Details.

## 🎮 Nächste Schritte

- [ ] Mehr Soundeffekte hinzufügen
- [ ] Erweiterte Achievement-System
- [ ] Multiplayer-Funktionen
- [ ] Speicher-System
- [ ] Erweiterte Animationen

---

**Viel Spaß beim Spielen! 🎮✨**