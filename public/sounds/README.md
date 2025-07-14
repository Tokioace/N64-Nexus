# Battle64 Sound-Dateien

Dieser Ordner enthält alle Soundeffekte für die Battle64 App.

## Benötigte Sound-Dateien:

### UI Sounds:
- `sidebar-open.mp3` - Sound beim Öffnen der Sidebar
- `sidebar-close.mp3` - Sound beim Schließen der Sidebar  
- `button-click.mp3` - Sound bei Button-Klicks

### Game Sounds:
- `achievement-unlocked.mp3` - Sound beim Freischalten von Achievements
- `level-up.mp3` - Sound beim Level-Aufstieg
- `bg-theme.mp3` - Hintergrundmusik (loopend)

## Empfohlene Sound-Eigenschaften:

### UI Sounds:
- **Format**: MP3
- **Länge**: 0.1-0.5 Sekunden
- **Stil**: 8-bit, Retro, Synth
- **Lautstärke**: -12dB bis -6dB

### Game Sounds:
- **Format**: MP3
- **Länge**: 0.5-2 Sekunden
- **Stil**: 8-bit, Arcade, N64-Style
- **Lautstärke**: -10dB bis -4dB

### Hintergrundmusik:
- **Format**: MP3
- **Länge**: 1-3 Minuten (loopend)
- **Stil**: Retro Gaming, Synthwave, 8-bit
- **Lautstärke**: -20dB bis -15dB

## Quellen für Retro-Sounds:

1. **Freesound.org** - Kostenlose Soundeffekte
2. **OpenGameArt.org** - Retro Gaming Sounds
3. **Zapsplat.com** - 8-bit Sound Collections
4. **BeepBox.co** - Online 8-bit Sound Generator

## Beispiel-Sound-Generierung:

Du kannst auch eigene Sounds mit Tools wie:
- **Audacity** - Kostenloser Audio-Editor
- **BeepBox** - Online 8-bit Sound Generator
- **ChipTone** - Online Chiptune Generator
- **LMMS** - Kostenloser DAW mit Retro-Plugins

## Installation:

1. Lade die Sound-Dateien herunter
2. Platziere sie in diesem Ordner
3. Stelle sicher, dass die Dateinamen exakt mit den in der App verwendeten übereinstimmen

## Hinweis:

Falls keine Sound-Dateien vorhanden sind, wird die App trotzdem funktionieren, aber ohne Audio-Feedback.
Die SoundManager-Klasse behandelt fehlende Dateien gracefully und gibt nur Warnungen in der Konsole aus.