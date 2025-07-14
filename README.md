# FreundeslisteScreen - Retro ICQ/N64 Style Friend List

Ein React TypeScript Component mit Retro-Messenger-Design im Stil von ICQ und N64-Freundeslisten.

## 🎮 Features

### Freundesliste
- **Avatar & Rang Anzeige**: Jeder Freund hat einen Emoji-Avatar und einen speziellen Rang
- **Statusanzeige**: Online, Abwesend, Offline mit farbigen Indikatoren
- **Letzte Aktivität**: Zeigt "vor X Minuten/Stunden" für offline Freunde
- **Speedrun Einladung**: Button zum Einladen zu Speedruns (nur für online Freunde)

### Freund hinzufügen
- **Code-basiert**: Freund über Freundescode hinzufügen
- **Benutzersuche**: Freund über Benutzername suchen
- **Eigener Code**: Anzeige und Kopieren des eigenen Freundescodes

### Design
- **Retro ICQ/N64 Stil**: Grüne Terminal-Ästhetik mit Glow-Effekten
- **Animierte Elemente**: Pulsierende Statusindikatoren und Hover-Effekte
- **Responsive Design**: Funktioniert auf Desktop und Mobile
- **Glitch-Effekte**: Retro-Gaming-Feeling

## 🚀 Installation & Verwendung

### Voraussetzungen
```bash
npm install react react-dom
npm install --save-dev @types/react @types/react-dom typescript
```

### Komponente verwenden
```tsx
import FreundeslisteScreen from './FreundeslisteScreen';

function App() {
  const handleInviteToSpeedrun = (friendId: string) => {
    // API-Call für Speedrun-Einladung
    console.log(`Einladung an Freund ${friendId} gesendet`);
  };

  const handleAddFriend = (code: string) => {
    // API-Call für Freund hinzufügen
    console.log(`Freund mit Code ${code} hinzugefügt`);
  };

  return (
    <FreundeslisteScreen
      onInviteToSpeedrun={handleInviteToSpeedrun}
      onAddFriend={handleAddFriend}
    />
  );
}
```

## 📁 Dateien

- `FreundeslisteScreen.tsx` - Hauptkomponente
- `FreundeslisteScreen.css` - Retro-Styling
- `App.tsx` - Beispiel-Integration
- `App.css` - Basis-Styling

## 🎨 Design-Details

### Farbpalette
- **Primär**: #00ff00 (Grün) - Terminal-Style
- **Sekundär**: #ffff00 (Gelb) - Akzente
- **Hintergrund**: Dunkler Gradient (#1a1a2e → #16213e → #0f3460)
- **Status**: 
  - Online: #00ff00 (Grün)
  - Abwesend: #ffff00 (Gelb)
  - Offline: #ff0000 (Rot)

### Typografie
- **Font**: Courier New (Monospace)
- **Effekte**: Text-Shadows, Glow-Effekte, Glitch-Animationen

### Interaktionen
- **Hover-Effekte**: Buttons und Karten heben sich an
- **Status-Animation**: Pulsierende Online-Indikatoren
- **Glitch-Effekt**: Titel reagiert auf Hover

## 🔧 Anpassung

### Freundesdaten anpassen
```tsx
const [friends, setFriends] = useState<Friend[]>([
  {
    id: '1',
    name: 'DeinFreund',
    avatar: '🎮',
    rank: 'Speed Master',
    status: 'online',
    isOnline: true
  }
  // Weitere Freunde...
]);
```

### Styling anpassen
Die CSS-Variablen in `FreundeslisteScreen.css` können angepasst werden:
- Farben
- Schriftgrößen
- Abstände
- Animationen

## 📱 Responsive Design

Das Design ist vollständig responsive und passt sich automatisch an:
- **Desktop**: Horizontale Layouts
- **Tablet**: Angepasste Abstände
- **Mobile**: Vertikale Layouts, größere Touch-Targets

## 🎯 Zukünftige Erweiterungen

- [ ] Chat-Funktionalität
- [ ] Benachrichtigungen
- [ ] Freundesgruppen
- [ ] Spielestatistiken
- [ ] Custom Avatare
- [ ] Dark/Light Mode Toggle

## 📄 Lizenz

MIT License - Frei verwendbar für private und kommerzielle Projekte.