# 🎮 Battle64 - Saisonale Events & Belohnungen

Ein dynamisches saisonales Event-System für Battle64, das thematische Inhalte mit zeitlich limitierten Belohnungen, Events und Community-Aktivitäten kombiniert.

## 🌟 Features

### 📅 Saisonale Events
- **🌸 Frühling (März–Mai)**: "Pixelblüten-Cup"
- **☀️ Sommer (Juni–August)**: "Sommerrennen 64"
- **🍂 Herbst (September–November)**: "Retro Harvest Run"
- **❄️ Winter (Dezember–Februar)**: "64 Ice Trophy"

### 🎃 Feiertagsspecials
- **🎃 Halloween**: "Haunted Kart Challenge"
- **🎄 Weihnachten**: "Frost Cup" mit Ice Maps
- **🎆 Neujahr**: "Time Attack of the Year"
- **❤️ Valentinstag**: "Duell der Herzen" (Team-Speedruns)
- **📅 N64-Anniversary**: "Retro All-Star Cup"

### 🎁 Belohnungssystem
- **Profilrahmen**: Exklusive animierte Rahmen (z.B. "Pumpkin Aura", "Snow Glow")
- **Sticker & Icons**: Jahreszeiten-Motive mit Animationen
- **Titel**: Spezielle Titel (z.B. "Harvest Hero", "Glitch-o-Lantern")
- **XP-Boni**: Temporäre Multiplikatoren für bestimmte Aktionen
- **Sammler-Boni**: Spezial-Tauschaktionen für saisonale Spiele

### 🏆 Ränge & Trophäen
- **Saisonsieger**: Höchste XP in einem Cup
- **Event-König**: Teilnahme an allen Season-Specials
- **Jahresübersicht**: Gewonnene saisonale Trophäen im Profil

## 🚀 Installation

### Voraussetzungen
- Node.js (Version 14 oder höher)
- npm oder yarn

### Setup
```bash
# Repository klonen
git clone <repository-url>
cd battle64-seasonal-events

# Dependencies installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env

# Server starten
npm start

# Für Entwicklung
npm run dev
```

### Umgebungsvariablen (.env)
```env
PORT=3000
NODE_ENV=development
```

## 📚 API Dokumentation

### Basis-URL
```
http://localhost:3000/api/seasonal-events
```

### Endpoints

#### 🏠 Alle Events abrufen
```http
GET /api/seasonal-events
```

**Query Parameter:**
- `type`: Filter nach Event-Typ (`season` oder `holiday`)
- `season`: Filter nach Jahreszeit (`spring`, `summer`, `autumn`, `winter`)
- `holiday`: Filter nach Feiertag (`halloween`, `christmas`, `newyear`, `valentine`, `n64anniversary`)
- `active`: Nur aktive Events (`true`)
- `upcoming`: Nur kommende Events (`true`)
- `days`: Anzahl Tage für kommende Events (Standard: 7)

**Beispiel:**
```bash
curl "http://localhost:3000/api/seasonal-events?active=true"
```

#### 🎯 Aktuelle Events
```http
GET /api/seasonal-events/current
```

**Response:**
```json
{
  "success": true,
  "data": {
    "activeEvents": [...],
    "currentSeasonal": {...},
    "currentHoliday": {...},
    "currentSeason": "spring",
    "currentHolidayType": null
  }
}
```

#### 📅 Kommende Events
```http
GET /api/seasonal-events/upcoming?days=7
```

#### 📊 Event-Statistiken
```http
GET /api/seasonal-events/statistics/overview
```

#### 🗓️ Event-Kalender
```http
GET /api/seasonal-events/calendar/2024/3
```

#### 🎁 Event-Belohnungen
```http
GET /api/seasonal-events/{eventId}/rewards
```

#### 🏆 Event-Herausforderungen
```http
GET /api/seasonal-events/{eventId}/challenges
```

#### 🗺️ Event-Maps
```http
GET /api/seasonal-events/{eventId}/maps
```

#### 💡 Empfehlungen
```http
GET /api/seasonal-events/recommendations?favoriteSeason=spring&prepareForEvents=true
```

## 🎨 Event-Themen & Design

### Farbpaletten
- **Frühling**: Pink (#FF69B4) + Hellgrün (#98FB98)
- **Sommer**: Gold (#FFD700) + Himmelblau (#87CEEB)
- **Herbst**: Dunkelorange (#FF8C00) + Braun (#8B4513)
- **Winter**: Himmelblau (#87CEEB) + Weiß (#FFFFFF)

### UI-Elemente
- **Kalender-Markierungen**: Feiertags-Events farbig hervorgehoben
- **Spezialbanner**: Countdown-Anzeigen für kommende Events
- **Sound & Grafik**: Passende Chiptune-Loops für jede Saison

## 🔧 Automatisierung

### Event-Aktivierung
Das System prüft automatisch:
- Aktuelles Datum und Jahreszeit
- Feiertagskalender
- Event-Start- und Enddaten
- Aktiviert entsprechende Inhalte, Maps & Designs

### Status-Check
```http
POST /api/seasonal-events/check-status
```

## 📦 Datenstruktur

### SeasonalEvent Model
```javascript
{
  id: "uuid",
  name: "Event Name",
  description: "Event Description",
  type: "season" | "holiday",
  season: "spring" | "summer" | "autumn" | "winter",
  holiday: "halloween" | "christmas" | "newyear" | "valentine" | "n64anniversary",
  startDate: "YYYY-MM-DD",
  endDate: "YYYY-MM-DD",
  duration: 30,
  isActive: false,
  theme: {
    primaryColor: "#FF69B4",
    secondaryColor: "#98FB98",
    backgroundImage: "spring_flowers.png",
    uiElements: {...}
  },
  rewards: [...],
  challenges: [...],
  maps: [...],
  soundtrack: "spring_chip_tune.mp3"
}
```

### Reward Model
```javascript
{
  id: "uuid",
  name: "Reward Name",
  type: "profile_frame" | "sticker" | "title" | "xp_bonus" | "collector_bonus",
  rarity: "common" | "rare" | "epic" | "legendary",
  eventId: "event-uuid",
  unlockCondition: {...},
  isUnlocked: false,
  effects: {...}
}
```

## 🧪 Tests

```bash
# Tests ausführen
npm test

# Tests mit Coverage
npm run test:coverage
```

## 📈 Monitoring & Logging

### Health Check
```http
GET /health
```

### Logs
- Request-Logging für alle API-Calls
- Event-Status-Änderungen
- Fehlerbehandlung mit detaillierten Fehlermeldungen

## 🔄 Import/Export

### Events exportieren
```http
GET /api/seasonal-events/export/all
```

### Events importieren
```http
POST /api/seasonal-events/import
Content-Type: application/json

{
  "eventsJson": "[...]"
}
```

## 🚀 Deployment

### Production
```bash
# Build für Production
npm run build

# Start Production Server
NODE_ENV=production npm start
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 🎮 Battle64 Team

Entwickelt für die Battle64 Community mit ❤️ und Nostalgie für die N64-Ära.

---

**🎯 Ziel**: Saisonale Events schaffen dynamische Highlights im Jahresverlauf und verknüpfen Feiertage, Retro-Games und Belohnungssysteme zu einem motivierenden Erlebnis durch das ganze Jahr.