# 🎮 Battle64 - Retro Gaming Platform

Eine moderne Retro-Gaming-Plattform mit einem durchdachten Benachrichtigungssystem und Trophäensystem, das die Nostalgie der 64-Bit-Ära mit zeitgemäßer UX verbindet.

## 🚀 Features

### 🔔 Benachrichtigungssystem
- **In-App Banner** mit retro-styling
- **Push Notifications** (bei Erlaubnis)
- **E-Mail Benachrichtigungen** (optional)
- **Event-Center** mit Historie der letzten 30 Tage
- **Filteroptionen** nach Kategorien
- **Soundeffekte** mit Pixel-"Pling!"
- **DSGVO-konform** mit explizitem Opt-In

### 🏆 Trophäensystem
- **4 Raritäten**: Bronze, Silber, Gold, Platin
- **6 Kategorien**: Speedrun, Fanart, Quiz, Sammlung, Team, Spezial
- **Animierte Freischaltungen** mit Glanz- und Soundeffekten
- **Fortschrittsanzeige** pro Kategorie
- **XP-System** mit Belohnungen
- **Sammlungsverfolgung** mit Statistiken

### 🎨 Design
- **Retro-Metalloptik** für Trophäen
- **Leuchtende Farben** und Glanzanimationen
- **Responsive Design** für alle Geräte
- **Smooth Animations** mit Framer Motion
- **Custom Scrollbars** im Retro-Stil

## 📦 Installation

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Production Build
npm run build

# Build Preview
npm run preview
```

## 🛠️ Technologie-Stack

- **React 18** mit TypeScript
- **Vite** für schnelle Entwicklung
- **Zustand** für State Management
- **Styled Components** für Styling
- **Framer Motion** für Animationen
- **React Icons** für Icons
- **Date-fns** für Datumsformatierung

## 📁 Projektstruktur

```
src/
├── components/
│   ├── notifications/
│   │   ├── NotificationBell.tsx
│   │   ├── NotificationDropdown.tsx
│   │   └── NotificationItem.tsx
│   └── trophies/
│       ├── TrophyDisplay.tsx
│       ├── TrophyCollection.tsx
│       └── TrophyUnlockAnimation.tsx
├── stores/
│   ├── notificationStore.ts
│   └── trophyStore.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🎯 Benachrichtigungstypen

| Typ | Icon | Beschreibung |
|-----|------|--------------|
| `EVENT` | 🎮 | Neue Events veröffentlicht |
| `RANKING` | 🏆 | Neue Platzierung in Rangliste |
| `FANART` | 🎨 | Fanart hochgeladen/bewertet |
| `LEVEL_UP` | ⭐ | Level-Up / neue Trophäe |
| `TROPHY` | 🏅 | Neue Trophäe freigeschaltet |
| `COMMENT` | 💬 | Kommentar erhalten |
| `FRIEND_REQUEST` | 👥 | Freundschaftsanfrage |
| `TRADE` | 🔄 | Trade-Anfrage / Statusänderung |

## 🏆 Trophäen-Kategorien

| Kategorie | Beschreibung | Farbe |
|-----------|--------------|-------|
| `SPEEDRUN` | Speedrun-Events | 🔴 Rot |
| `FANART` | Fanart-Wettbewerbe | 🟣 Lila |
| `QUIZ` | Quiz-Challenges | 🔵 Blau |
| `COLLECTION` | Sammel-Events | 🟢 Grün |
| `TEAM` | Team-Challenges | 🟠 Orange |
| `SPECIAL` | Spezial-Events | 🟢 Türkis |

## 🎨 Customization

### Farben anpassen
Die Hauptfarben können in `src/index.css` angepasst werden:

```css
:root {
  --primary-color: #ff6b35;
  --secondary-color: #f7931e;
  --background-dark: #1a1a2e;
  --background-medium: #16213e;
  --background-light: #0f3460;
}
```

### Trophäen-Styling
Trophäen-Farben können in den jeweiligen Komponenten angepasst werden:

```typescript
const getTrophyBackground = (rarity: TrophyRarity): string => {
  const backgrounds = {
    [TrophyRarity.BRONZE]: 'linear-gradient(135deg, #cd7f32, #b8860b)',
    [TrophyRarity.SILVER]: 'linear-gradient(135deg, #c0c0c0, #a9a9a9)',
    [TrophyRarity.GOLD]: 'linear-gradient(135deg, #ffd700, #ffb347)',
    [TrophyRarity.PLATINUM]: 'linear-gradient(135deg, #e5e4e2, #bcc6cc)'
  };
  return backgrounds[rarity];
};
```

## 🔧 API Integration

Das System ist für die Integration mit einer Backend-API vorbereitet:

```typescript
// Beispiel für API-Calls
const api = {
  notifications: {
    get: () => fetch('/api/notifications'),
    markAsRead: (id: string) => fetch(`/api/notifications/${id}/read`, { method: 'PUT' }),
    create: (notification: Notification) => fetch('/api/notifications', { 
      method: 'POST', 
      body: JSON.stringify(notification) 
    })
  },
  trophies: {
    get: () => fetch('/api/trophies'),
    unlock: (trophyId: string) => fetch(`/api/trophies/${trophyId}/unlock`, { method: 'POST' })
  }
};
```

## 📱 PWA Features

- **Service Worker** für Offline-Funktionalität
- **Web App Manifest** für App-Installation
- **Push Notifications** Support
- **Responsive Design** für alle Bildschirmgrößen

## 🎵 Sound System

Das System unterstützt verschiedene Soundeffekte:

- **Notification Sound**: Pixel-"Pling!" bei neuen Benachrichtigungen
- **Trophy Unlock**: Verschiedene Sounds je nach Rarität
- **Fallback**: Web Audio API für Browser ohne Audio-Support

## 🔒 DSGVO Compliance

- **Opt-In** für Push Notifications
- **Opt-In** für E-Mail Benachrichtigungen
- **Lokale Speicherung** mit Zustand Persist
- **Benutzer-Kontrolle** über alle Einstellungen

## 🚀 Deployment

```bash
# Production Build erstellen
npm run build

# Build testen
npm run preview

# Deployment (z.B. mit Vercel)
vercel --prod
```

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 🙏 Danksagungen

- **React Team** für das fantastische Framework
- **Vite Team** für das schnelle Build-Tool
- **Framer Motion** für die wunderschönen Animationen
- **React Icons** für die umfangreiche Icon-Bibliothek

---

**Battle64** - Wo Retro auf Moderne trifft! 🎮✨