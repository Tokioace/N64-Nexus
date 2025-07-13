# 🎮 Battle64 - Direktnachrichten & Inbox System

Ein retro-stylisiertes Messaging-System im Stil der 90er Jahre für die Battle64 Gaming-Plattform.

## ✨ Features

### 📥 Inbox-Funktionen
- **Übersicht**: Liste aller Konversationen nach Aktualität sortiert
- **Vorschau**: Letzte Nachricht & Absenderbild/Icon
- **Filter**: Alle / Ungelesen / Freunde / Markiert
- **Suche**: Nach Benutzern und Gruppen suchen

### 💬 Chat-Funktionen
- **Nachrichtentypen**: Text, Emoji, Bilder, Sticker, Links
- **Schnellantworten**: Vordefinierte Antworten („Danke!", „Top!", etc.)
- **Interaktionen**: Like, Markieren als wichtig, Melden
- **Gruppenchats**: Bis zu 10 Mitglieder mit Benennung
- **Retro-Sounds**: Chiptune-Soundeffekte bei Nachrichteneingang

### 🛡️ Privatsphäre & Sicherheit
- **Blockieren/Melden**: Unerwünschte Nutzer blockieren
- **Einstellungen**: Wer darf mir schreiben? (Alle/Freunde/Niemand)
- **Auto-Löschung**: Chatverlauf nach X Tagen automatisch löschen
- **DSGVO-konform**: Daten exportierbar und löschbar

### 🎨 Retro-Design
- **90er-Aesthetic**: Stil von MSN, ICQ, ICQ
- **Pixel-Typografie**: Press Start 2P Font
- **Farbthemen**: Individualisierbare Retro-Farben
- **Animationen**: Smooth Transitions und Hover-Effekte

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn

### Installation
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

### Entwicklung
```bash
# Linting
npm run lint

# Linting mit Auto-Fix
npm run lint:fix
```

## 🏗️ Projektstruktur

```
src/
├── components/          # React Komponenten
│   ├── MessagingSystem.tsx    # Hauptkomponente
│   ├── Inbox.tsx              # Inbox-Liste
│   ├── ChatWindow.tsx         # Chat-Fenster
│   ├── MessageBubble.tsx      # Einzelne Nachrichten
│   ├── QuickReplies.tsx       # Schnellantworten
│   └── StickerPicker.tsx      # Sticker-Auswahl
├── types/              # TypeScript Interfaces
│   └── messaging.ts
├── data/               # Mock-Daten
│   └── mockData.ts
├── App.tsx             # Haupt-App
├── main.tsx            # Entry Point
└── index.css           # Globale Styles
```

## 🎯 Verwendung

### Konversation starten
1. Klicke auf eine Konversation in der Inbox
2. Oder starte eine neue über das Profil eines Users

### Nachrichten senden
- **Text**: Einfach in das Eingabefeld tippen
- **Sticker**: Smiley-Button klicken und Sticker auswählen
- **Schnellantworten**: Vordefinierte Buttons verwenden
- **Enter**: Nachricht senden
- **Shift+Enter**: Neue Zeile

### Interaktionen
- **Like**: Herz-Symbol bei Nachrichten
- **Wichtig markieren**: Stern-Symbol für wichtige Nachrichten
- **Melden**: Drei-Punkte-Menü → Melden
- **Markieren**: Pin-Symbol bei Konversationen

## 🎨 Anpassung

### Farbthemen
Die Farben können in `tailwind.config.js` angepasst werden:

```javascript
colors: {
  'retro-blue': '#0066CC',
  'retro-green': '#00CC66',
  'retro-purple': '#9933CC',
  // ... weitere Farben
}
```

### Sticker hinzufügen
Neue Sticker in `src/data/mockData.ts` hinzufügen:

```javascript
stickers: [
  { id: 'new-sticker', name: 'Neuer Sticker', url: '🎮', category: 'gaming' }
]
```

## 🔧 Technologie-Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Daten**: date-fns für Zeitformatierung
- **Build**: Vite
- **Linting**: ESLint

## 📱 Browser-Support

- Chrome (empfohlen)
- Firefox
- Safari
- Edge

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## 📄 Lizenz

MIT License - siehe LICENSE Datei für Details.

## 🎮 Battle64 Integration

Dieses Messaging-System ist speziell für die Battle64 Gaming-Plattform entwickelt und integriert sich nahtlos in das bestehende Game-Universum.

---

**Entwickelt mit ❤️ für die Battle64 Community**