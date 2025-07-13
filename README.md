# 🏆 Battle64 Achievement & Trophy System

Ein umfassendes Achievement- und Trophäensystem mit Retro-Charme und Pokémon-ähnlichem Sammelreiz für die N64-Community.

## 🎯 Features

### 🏅 Achievement-Kategorien
- **🎮 Spielspezifisch**: Rainbow Road Master, N64 Drift Hero
- **🕹️ Plattformbezogen**: NTSC/PAL Speedrun Challenges
- **🧑‍🤝‍🧑 Community**: Fanart Kritiker, Community Helper
- **📦 Sammlerstücke**: Seltenstes Item Sammler, Retro Collector
- **🔁 Wiederholte Teilnahme**: Event Marathon, Weekly Champion
- **👑 Limitierte Challenges**: Oktoberfest-Champion 2025

### 🏆 Trophy-System
- **Bronze**: Häufige Achievements (Common)
- **Silber**: Ungewöhnliche Achievements (Uncommon)
- **Gold**: Seltene Achievements (Rare)
- **Platin**: Legendäre Achievements (Epic/Legendary)

### 🎨 UI-Komponenten
- **Achievement Album**: Digitales Sammelalbum im Retro-Inlay-Stil
- **Achievement Notification**: "You unlocked" Benachrichtigungen
- **Community Ticker**: Live-Feed seltener Achievements
- **Chat Notification**: Gruppenchat-Benachrichtigungen
- **Trophy Display**: Detaillierte Trophäen-Übersicht

### ⚙️ Technische Features
- **JSON-basierte Regeln**: Flexible Achievement-Logik
- **Server-basierte Automatik**: Automatische Freischaltung
- **Progress Tracking**: Fortschrittsanzeige für alle Achievements
- **XP-System**: Belohnungssystem mit Erfahrungspunkten
- **Datenschutz**: Öffentliche/private Achievement-Einstellungen

## 🚀 Installation

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Build erstellen
npm run build

# Produktionsserver starten
npm start
```

## 📁 Projektstruktur

```
src/
├── app/
│   ├── api/achievements/route.ts    # Achievement API
│   ├── demo/page.tsx                # Demo-Seite
│   └── page.tsx                     # Landing Page
├── components/achievements/
│   ├── AchievementAlbum.tsx         # Hauptalbum-Komponente
│   ├── AchievementNotification.tsx  # Unlock-Benachrichtigung
│   ├── CommunityTicker.tsx          # Community-Feed
│   ├── ChatNotification.tsx         # Chat-Benachrichtigung
│   ├── TrophyDisplay.tsx            # Trophäen-Übersicht
│   ├── AchievementGrid.tsx          # Grid-Ansicht
│   └── AchievementCard.tsx          # Einzelne Achievement-Karte
├── types/
│   └── achievement.ts               # TypeScript-Definitionen
├── utils/
│   ├── achievementLogic.ts          # Achievement-Logik
│   └── trophyCalculator.ts          # Statistiken-Berechnung
└── data/
    └── achievements.json            # Achievement-Daten
```

## 🎮 Demo

Besuche `/demo` um das System in Aktion zu erleben:

- **Achievement Album**: Durchsuche und filtere alle Achievements
- **Interaktive Demo**: Klicke auf Achievements um sie freizuschalten
- **Community Ticker**: Sieh seltene Achievements anderer Spieler
- **Chat Notifications**: Erlebe Gruppenchat-Benachrichtigungen

## 🔧 API-Endpunkte

### GET /api/achievements
Lädt alle Achievements und Benutzer-Fortschritt.

### POST /api/achievements
```json
{
  "action": "check_achievements",
  "data": {
    "userId": "user123",
    "eventType": "event_completion",
    "eventData": {
      "eventType": "mario_kart_64",
      "completed": 1
    }
  }
}
```

**Verfügbare Actions:**
- `check_achievements`: Prüft neue Achievements
- `update_progress`: Aktualisiert Fortschritt
- `unlock_achievement`: Schaltet Achievement frei
- `get_user_stats`: Lädt Benutzer-Statistiken

## 🎨 Customization

### Achievement hinzufügen
Füge neue Achievements in `src/data/achievements.json` hinzu:

```json
{
  "id": "custom_achievement",
  "title": "Custom Achievement",
  "description": "Beschreibung des Achievements",
  "category": "game-specific",
  "trophyType": "gold",
  "rarity": "rare",
  "xpReward": 500,
  "rules": [
    {
      "type": "count_based",
      "condition": "custom_condition",
      "value": 10
    }
  ],
  "isRepeatable": false,
  "isLimited": false,
  "icon": "🎯",
  "backgroundColor": "#4A90E2",
  "borderColor": "#FFD700",
  "status": "locked",
  "isPublic": true,
  "rewards": {
    "title": "Custom Title",
    "cosmetic": "custom_item"
  }
}
```

### Styling anpassen
Bearbeite `tailwind.config.js` für Custom-Farben und Animationen:

```javascript
theme: {
  extend: {
    colors: {
      'n64-purple': '#5A4A9F',
      'n64-blue': '#4A90E2',
      'bronze': '#CD7F32',
      'silver': '#C0C0C0',
      'gold': '#FFD700',
      'platinum': '#E5E4E2',
    },
    animation: {
      'trophy-glow': 'trophy-glow 2s ease-in-out infinite alternate',
      'shimmer': 'shimmer 2s linear infinite',
    }
  }
}
```

## 🏗️ Architektur

### Achievement-Logik
Das System verwendet eine regelbasierte Architektur:

1. **Event-basierte Trigger**: Spiele-Events lösen Achievement-Checks aus
2. **JSON-Regeln**: Flexible Bedingungen in JSON-Format
3. **Server-Validierung**: Sichere Überprüfung auf Server-Seite
4. **Progress Tracking**: Kontinuierliche Fortschrittsverfolgung

### Datenschutz
- Achievements können als `isPublic: false` markiert werden
- Private Achievements sind nur für den Benutzer sichtbar
- Community-Ticker zeigt nur öffentliche Achievements

## 🎯 Nächste Schritte

### Geplante Features
- [ ] Achievement-Sets und Collections
- [ ] Seasonal Events und Challenges
- [ ] Leaderboards und Rankings
- [ ] Achievement-Sharing auf Social Media
- [ ] Mobile App Integration
- [ ] Achievement-Badges für Profile

### Performance-Optimierungen
- [ ] Caching für Achievement-Daten
- [ ] Lazy Loading für große Achievement-Listen
- [ ] Optimierte Animationen
- [ ] Service Worker für Offline-Funktionalität

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 🙏 Credits

- **Design**: Retro-Gaming inspiriertes UI/UX
- **Icons**: Lucide React Icons
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Framework**: Next.js 14

---

**Entwickelt mit ❤️ für die N64-Community**