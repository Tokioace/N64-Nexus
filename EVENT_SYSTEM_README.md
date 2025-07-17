# 🎮 Battle64 Event-System

Ein vollständiges Event-System für die Battle64-App mit wöchentlichen und saisonalen Events im N64-Stil.

## 📋 Übersicht

Das Event-System bietet:
- **Automatische Event-Erkennung** basierend auf Datum/Zeit
- **Event-Kalender** mit Monatsansicht
- **Event-Detailseiten** mit Countdown und Belohnungen
- **Teilnahme-Tracking** mit Fortschrittsanzeige
- **Belohnungssystem** mit XP, Badges und Items
- **Responsive Design** im N64-Retro-Stil

## 🏗️ Architektur

### Komponenten-Struktur
```
src/
├── components/Event/
│   ├── EventCard.tsx           # Event-Karten (3 Varianten)
│   ├── EventDetail.tsx         # Detailansicht für Events
│   ├── EventCalendar.tsx       # Kalender mit Event-Übersicht
│   └── UpcomingEventsWidget.tsx # Widget für Homepage
├── contexts/
│   └── EventContext.tsx        # Event-State-Management
├── data/
│   └── events.json            # Event-Daten
├── pages/
│   └── EventsPage.tsx         # Hauptseite für Events
├── types/
│   └── index.ts               # Event-TypeScript-Definitionen
└── utils/
    └── eventUtils.ts          # Utility-Funktionen
```

### Event-Datenmodell
```typescript
interface GameEvent {
  id: string
  title: string
  game: string
  type: 'Speedrun' | 'Time Trial' | 'Challenge' | 'Collection' | 'Anniversary'
  startDate: string
  endDate: string
  description: string
  rewards: string[]
  image: string
  difficulty?: 'easy' | 'medium' | 'hard'
  category?: string
  maxParticipants?: number
}
```

## 🎯 Features

### 1. Event-Typen
- **Speedrun**: Geschwindigkeits-Challenges
- **Time Trial**: Zeitrennen
- **Challenge**: Spezielle Herausforderungen
- **Collection**: Sammel-Events
- **Anniversary**: Jubiläums-Events

### 2. Event-Status
- **Aktiv**: Event läuft gerade
- **Kommend**: Event startet bald
- **Beendet**: Event ist vorbei

### 3. Belohnungssystem
- **XP**: Erfahrungspunkte
- **Badges**: Spezielle Abzeichen
- **Tokens**: Event-spezifische Währung
- **Cosmetics**: Kosmetische Items

### 4. Ansichtsmodi
- **Grid**: Karten-Layout
- **List**: Kompakte Liste
- **Calendar**: Kalender-Ansicht

## 🎨 Design-Features

### N64-Stil
- **3D-Effekte**: Polygon-basierte Schatten
- **Retro-Farben**: N64-Farbpalette
- **Animationen**: Glitch-Effekte und Übergänge
- **Typografie**: Retro-Gaming-Schriften

### Responsive Design
- **Mobile-First**: Optimiert für alle Geräte
- **Touch-Friendly**: Große Buttons und Bereiche
- **Adaptive Layout**: Flexible Grid-Systeme

## 🔧 Verwendung

### Event-Widget auf Homepage
```tsx
import UpcomingEventsWidget from '../components/Event/UpcomingEventsWidget'

<UpcomingEventsWidget
  onViewAllEvents={() => navigate('/events')}
  onViewEventDetails={(eventId) => navigate(`/events?event=${eventId}`)}
/>
```

### Event-Kalender
```tsx
import EventCalendar from '../components/Event/EventCalendar'

<EventCalendar
  onEventClick={handleEventClick}
  onDateClick={handleDateClick}
/>
```

### Event-Details
```tsx
import EventDetail from '../components/Event/EventDetail'

<EventDetail
  event={selectedEvent}
  onBack={handleBack}
  onJoinEvent={handleJoin}
/>
```

## 📊 Event-Verwaltung

### Events hinzufügen
Neue Events in `src/data/events.json` hinzufügen:
```json
{
  "id": "event009",
  "title": "Neues Event",
  "game": "Super Mario 64",
  "type": "Speedrun",
  "startDate": "2025-03-01T00:00:00Z",
  "endDate": "2025-03-08T23:59:59Z",
  "description": "Event-Beschreibung",
  "rewards": ["100XP", "Special Badge"],
  "image": "/assets/events/new_event.png",
  "difficulty": "medium",
  "category": "Platformer",
  "maxParticipants": 200
}
```

### Event-Context verwenden
```tsx
import { useEvents } from '../contexts/EventContext'

const { 
  events, 
  activeEvents, 
  upcomingEvents,
  joinEvent,
  getTimeRemaining 
} = useEvents()
```

### Utility-Funktionen
```tsx
import { eventUtils } from '../utils/eventUtils'

// Event-Status prüfen
const isActive = eventUtils.isEventActive(event)
const timeLeft = eventUtils.getTimeRemaining(event)

// Events filtern und sortieren
const filteredEvents = eventUtils.filterEventsByType(events, 'Speedrun')
const sortedEvents = eventUtils.sortEventsByPriority(events)
```

## 🚀 Erweiterungsmöglichkeiten

### API-Integration
- REST-API für Event-Verwaltung
- Real-time Updates via WebSocket
- Cloud-basierte Event-Daten

### Discord-Integration
- Bot-Benachrichtigungen
- Automatische Event-Ankündigungen
- Community-Features

### Erweiterte Features
- Event-Leaderboards
- Team-Events
- Event-Serien
- Belohnungs-Shop

## 🎮 Event-Beispiele

### Mario Kart 64 Birthday Bash
- **Typ**: Speedrun
- **Dauer**: 7 Tage
- **Belohnungen**: 50XP, Golden Kart Badge
- **Schwierigkeit**: Medium

### Halloween Haunted Valley
- **Typ**: Time Trial
- **Dauer**: 6 Tage
- **Belohnungen**: 66XP, Spooky Badge, Ghost Token
- **Schwierigkeit**: Hard

### Zelda Anniversary
- **Typ**: Anniversary
- **Dauer**: 7 Tage
- **Belohnungen**: 100XP, Triforce Master Badge
- **Schwierigkeit**: Medium

## 🔒 Sicherheit & Performance

### Daten-Validierung
- Event-Daten werden validiert
- Sichere Teilnahme-Tracking
- Schutz vor Manipulation

### Performance-Optimierung
- Lazy Loading für Event-Bilder
- Efficient Re-rendering
- Optimierte Countdown-Timer

## 📱 Mobile Optimierung

### Touch-Interfaces
- Große Buttons für Touch-Bedienung
- Swipe-Gesten für Kalender
- Responsive Event-Karten

### Performance
- Reduzierte Animationen auf mobilen Geräten
- Optimierte Bilder für verschiedene Auflösungen
- Efficient Memory Management

## 🎯 Zukunft

### Geplante Features
- [ ] Event-Editor für Admins
- [ ] Push-Benachrichtigungen
- [ ] Event-Statistiken
- [ ] Social Features
- [ ] Event-Replay-System

### Technische Verbesserungen
- [ ] TypeScript-Verbesserungen
- [ ] Test-Coverage
- [ ] Performance-Monitoring
- [ ] Accessibility-Features

---

**Entwickelt für Battle64 - Das ultimative N64-Gaming-Erlebnis! 🎮**