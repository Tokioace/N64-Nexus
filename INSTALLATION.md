# 🚀 Battle64 Installation & Setup

## Schnellstart (Empfohlen)

### 1. Einfache HTML-Demo
Die einfachste Möglichkeit, Battle64 zu testen:

```bash
# Öffne die index.html Datei in deinem Browser
open index.html
# oder
firefox index.html
# oder
chrome index.html
```

### 2. Next.js Version (Vollständig)
Für die vollständige Next.js-Version:

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# App öffnen
# Gehe zu http://localhost:3000
```

## 🎵 Sound-Dateien hinzufügen

### Option 1: Eigene Sounds erstellen
1. **BeepBox** (Online 8-bit Generator):
   - Gehe zu [beepbox.co](https://www.beepbox.co/)
   - Erstelle 8-bit Sounds
   - Exportiere als MP3
   - Benenne die Dateien entsprechend um

2. **Audacity** (Kostenloser Audio-Editor):
   - Lade [Audacity](https://www.audacityteam.org/) herunter
   - Erstelle neue Tracks
   - Verwende 8-bit Effekte
   - Exportiere als MP3

### Option 2: Kostenlose Sounds herunterladen
Empfohlene Quellen:
- [Freesound.org](https://freesound.org/) - Suche nach "8-bit", "retro", "game"
- [OpenGameArt.org](https://opengameart.org/) - Retro Gaming Sounds
- [Zapsplat.com](https://www.zapsplat.com/) - 8-bit Collections

### Benötigte Sound-Dateien:
```
public/sounds/
├── sidebar-open.mp3      # 0.1-0.5s, UI Sound
├── sidebar-close.mp3     # 0.1-0.5s, UI Sound
├── button-click.mp3      # 0.1-0.3s, Click Sound
├── achievement-unlocked.mp3  # 0.5-1s, Triumph Sound
├── level-up.mp3          # 0.5-1s, Success Sound
└── bg-theme.mp3          # 1-3min, Loop Music
```

## 🔧 Konfiguration

### Sound-Einstellungen anpassen
In `src/utils/SoundManager.ts`:

```typescript
// Standard-Volume (0.0 - 1.0)
private volume: number = 0.6;

// Hintergrundmusik-Volume (reduziert)
this.bgMusic.volume = this.volume * 0.3;
```

### Neue Sounds hinzufügen
1. Sound-Datei in `public/sounds/` platzieren
2. In der Komponente importieren:

```typescript
const newSound = '/sounds/new-sound.mp3';
playSound(newSound);
```

## 🌐 Browser-Kompatibilität

### Vollständige Unterstützung:
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Edge 79+
- ✅ Safari 11+ (mit User-Interaktion)

### Mobile Browser:
- ✅ iOS Safari (mit Touch-Interaktion)
- ✅ Chrome Mobile
- ✅ Firefox Mobile

### Bekannte Einschränkungen:
- ⚠️ Safari benötigt User-Interaktion für Audio
- ⚠️ Einige Mobile Browser haben Audio-Limits

## 🛠️ Entwicklung

### Projektstruktur verstehen:
```
battle64/
├── index.html              # Einfache Demo
├── src/
│   ├── components/         # React-Komponenten
│   └── utils/             # Utilities (SoundManager)
├── pages/                 # Next.js Pages
├── public/sounds/         # Sound-Dateien
└── styles/               # Globale Styles
```

### Neue Features hinzufügen:
1. Komponente in `src/components/` erstellen
2. SoundManager importieren
3. Soundeffekte für Interaktionen hinzufügen
4. Styling mit Retro-N64-Theme

### Debugging:
```javascript
// Browser-Konsole öffnen (F12)
// Sound-Fehler werden als Warnungen angezeigt
console.warn("Sound konnte nicht abgespielt werden:", e);
```

## 🎨 Design anpassen

### Farbpalette ändern:
```css
/* Primärfarbe (Neon-Grün) */
--primary-color: #00ff88;

/* Hintergrund (Dunkel-Blau) */
--bg-color: #1a1a2e;

/* Akzentfarbe (Navy-Blau) */
--accent-color: #0f3460;
```

### Animationen anpassen:
```css
/* Hover-Effekt Geschwindigkeit */
transition: all 0.3s ease;

/* Glow-Effekt Intensität */
box-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
```

## 📱 Responsive Design

### Breakpoints:
- **Desktop**: > 768px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

### Mobile Optimierungen:
- Touch-optimierte Buttons
- Angepasste Sidebar
- Responsive Grid-Layout

## 🔒 Sicherheit & Performance

### Audio-Best-Practices:
- ✅ User-Interaktion vor Audio-Play
- ✅ Fehlerbehandlung für fehlende Dateien
- ✅ Volume-Kontrolle
- ✅ Stummschaltung

### Performance-Optimierungen:
- ✅ Lazy Loading für Sounds
- ✅ Audio-Caching
- ✅ Effiziente Event-Listener

## 🐛 Troubleshooting

### Häufige Probleme:

**1. Sounds werden nicht abgespielt:**
```bash
# Prüfe Browser-Konsole (F12)
# Stelle sicher, dass User-Interaktion erfolgt ist
# Prüfe Sound-Datei-Pfade
```

**2. Hintergrundmusik startet nicht:**
```javascript
// Warte auf User-Interaktion
document.addEventListener('click', () => {
    playBackgroundMusic('/sounds/bg-theme.mp3');
});
```

**3. Mobile Audio-Probleme:**
```javascript
// Verwende Touch-Events
document.addEventListener('touchstart', handleAudio);
```

**4. Next.js Build-Fehler:**
```bash
# Dependencies neu installieren
rm -rf node_modules package-lock.json
npm install

# TypeScript-Fehler beheben
npm run build
```

## 📚 Weiterführende Ressourcen

### Audio-Entwicklung:
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Howler.js](https://howlerjs.com/) - Audio Library
- [Tone.js](https://tonejs.github.io/) - Web Audio Framework

### Retro-Game-Design:
- [N64 Style Guide](https://n64squid.com/homebrew/development/n64-style-guide/)
- [8-bit Design Patterns](https://www.gamasutra.com/view/feature/132500/retro_game_usability.php)

### Sound-Design:
- [Game Audio Tutorial](https://www.gamasutra.com/view/feature/132500/game_audio_implementation.php)
- [8-bit Music Theory](https://www.youtube.com/c/8bitMusicTheory)

---

**Viel Spaß beim Entwickeln! 🎮✨**