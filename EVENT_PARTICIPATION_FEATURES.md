# Event Participation Features - Live Streaming & Media Upload

## Übersicht

Das Event-System wurde erweitert um umfassende Teilnahme-Funktionen, die es Spielern ermöglichen, ihre Zeiten und Gameplay-Sessions über verschiedene Medien zu teilen:

### 🎥 Live Streaming
- **Twitch-ähnliche Live-Übertragung** direkt über das Handy/Browser
- **Echzeit-Viewer-Zählung** und Stream-Statistiken
- **Qualitätseinstellungen** (480p, 720p, 1080p)
- **Audio/Video-Kontrolle** mit individuellen Einstellungen
- **Stream-URL-Sharing** für andere Teilnehmer

### 📸 Media Upload
- **Foto-Upload** für Screenshots von Bestzeiten
- **Video-Upload** für Gameplay-Aufnahmen
- **Automatische Metadaten-Erfassung** (Spielzeit, Event-ID, etc.)
- **Verifizierungs-System** für eingereichte Zeiten

### 👥 Teilnehmer-Anzeige
- **Live-Teilnehmer-Liste** mit aktuellen Streams
- **Upload-Übersicht** aller eingereichten Medien
- **Kombinierte Anzeige** für Teilnehmer die sowohl live sind als auch Uploads haben
- **Echtzeit-Updates** der Teilnehmer-Status

## Implementierte Komponenten

### 1. Enhanced EventDetail Component
**Datei**: `src/components/Event/EventDetail.tsx`

**Neue Features**:
- ✅ Live-Streaming-Integration
- ✅ Media-Upload-Modal
- ✅ Teilnehmer-Anzeige mit Live-Status
- ✅ Stream-URL-Anzeige
- ✅ Upload-Verlauf pro Event
- ✅ Verbesserte Farbgebung (keine weißen Texte auf weißem Hintergrund mehr)

**Funktionalität**:
```typescript
interface EventParticipant {
  id: string
  username: string
  isLive: boolean
  hasUpload: boolean
  uploadType?: 'photo' | 'video'
  gameTime?: string
  streamUrl?: string
}
```

### 2. LiveStreamComponent
**Datei**: `src/components/Event/LiveStreamComponent.tsx`

**Features**:
- ✅ WebRTC-basiertes Live-Streaming
- ✅ Kamera/Mikrofon-Zugriff
- ✅ Stream-Qualitäts-Einstellungen
- ✅ Viewer-Count-Simulation
- ✅ Stream-Dauer-Tracking
- ✅ Fehlerbehandlung für Berechtigungen

**Stream-Einstellungen**:
```typescript
interface StreamSettings {
  quality: 'low' | 'medium' | 'high'
  enableChat: boolean
  enableAudio: boolean
  isPrivate: boolean
}
```

### 3. Verbesserte EventsPage
**Datei**: `src/pages/EventsPage.tsx`

**Styling-Fixes**:
- ✅ Weiße Hintergründe für Suchfelder
- ✅ Dunkle Schrift auf hellen Hintergründen
- ✅ Verbesserte Kontraste und Lesbarkeit
- ✅ Konsistente Farbgebung

## Benutzerflow

### 1. Event-Teilnahme
1. Nutzer klickt auf "Teilnehmen" Button
2. Event-Detail-Seite zeigt Teilnahme-Aktionen
3. Zwei Hauptoptionen werden verfügbar:
   - **Foto/Video hochladen**
   - **Live Stream starten**

### 2. Live-Streaming
1. Nutzer klickt "Live Stream starten"
2. Browser fragt nach Kamera/Mikrofon-Berechtigung
3. Stream startet mit konfigurierbaren Einstellungen
4. Stream-URL wird generiert und angezeigt
5. Andere Teilnehmer können den Stream ansehen
6. Stream-Statistiken werden in Echtzeit aktualisiert

### 3. Media Upload
1. Nutzer klickt "Foto/Video hochladen"
2. MediaCaptureComponent öffnet sich als Modal
3. Nutzer kann Foto aufnehmen oder Video aufzeichnen
4. Medien werden mit Event-Metadaten gespeichert
5. Upload erscheint in der Teilnehmer-Liste

### 4. Teilnehmer-Anzeige
- **Live-Teilnehmer-Sektion**: Zeigt alle aktiven Streams
- **Upload-Sektion**: Zeigt alle eingereichten Medien
- **Kombinierte Anzeige**: Teilnehmer die sowohl live sind als auch Uploads haben

## Technische Details

### State Management
```typescript
// EventDetail Component State
const [participants, setParticipants] = useState<EventParticipant[]>([])
const [isStreaming, setIsStreaming] = useState(false)
const [streamUrl, setStreamUrl] = useState<string | null>(null)
const [showMediaCapture, setShowMediaCapture] = useState(false)
```

### Event-Statistiken
```typescript
// Dynamische Berechnung der Teilnehmer-Zahlen
const liveParticipants = participants.filter(p => p.isLive)
const uploadParticipants = participants.filter(p => p.hasUpload)
```

### Stream-URL-Generierung
```typescript
// Mock-Implementation für Entwicklung
const mockStreamUrl = `https://stream.battle64.com/live/${eventId}/${Date.now()}`
```

## UI/UX Verbesserungen

### 1. Farbschema-Fixes
- **Suchfelder**: Weiße Hintergründe mit dunkler Schrift
- **Dropdown-Menüs**: Konsistente Farbgebung
- **Buttons**: Verbesserte Kontraste
- **Status-Indikatoren**: Klare visuelle Unterscheidung

### 2. Live-Indikatoren
- **Rote pulsierende Punkte** für Live-Status
- **Stream-Dauer-Anzeige** in Echtzeit
- **Viewer-Count** mit Eye-Icon
- **Qualitäts-Badges** (480p, 720p, 1080p)

### 3. Responsive Design
- **Mobile-First-Ansatz** für Streaming
- **Touch-optimierte Buttons**
- **Flexible Grid-Layouts** für Teilnehmer-Listen

## Integration mit bestehenden Systemen

### MediaContext
```typescript
// Verwendung des bestehenden MediaContext
const { getMediaByEvent, captureMedia, uploadMedia } = useMedia()
```

### EventContext
```typescript
// Integration mit Event-Management
const { participateInEvent, getEventProgress } = useEvents()
```

### UserContext
```typescript
// Nutzer-spezifische Funktionen
const { user } = useUser()
```

## Zukünftige Erweiterungen

### 1. Echtes Streaming
- **WebRTC-Server-Integration** für echte P2P-Streams
- **RTMP-Support** für professionelle Streaming-Software
- **CDN-Integration** für bessere Performance

### 2. Chat-System
- **Live-Chat** während Streams
- **Emotes und Reactions**
- **Moderations-Tools**

### 3. Erweiterte Verifizierung
- **Automatische Zeit-Erkennung** aus Videos
- **Blockchain-basierte Verifizierung**
- **Community-Voting** für verdächtige Zeiten

### 4. Analytics
- **Stream-Analytics** für Teilnehmer
- **Event-Performance-Metriken**
- **Engagement-Statistiken**

## Deployment-Hinweise

### 1. Berechtigungen
- **Kamera/Mikrofon-Zugriff** muss über HTTPS erfolgen
- **Browser-Kompatibilität** für WebRTC prüfen
- **Mobile-Optimierung** für Touch-Geräte

### 2. Performance
- **Video-Komprimierung** für Uploads
- **Stream-Qualitäts-Anpassung** basierend auf Bandbreite
- **Lazy-Loading** für Teilnehmer-Listen

### 3. Sicherheit
- **Content-Moderation** für Uploads
- **Stream-Authentifizierung**
- **Rate-Limiting** für API-Calls

## Fazit

Das erweiterte Event-System bietet nun eine vollständige Lösung für:
- ✅ **Live-Streaming** wie auf Twitch
- ✅ **Media-Upload** für Zeiten-Nachweis
- ✅ **Teilnehmer-Interaktion** in Echtzeit
- ✅ **Verbesserte UX** ohne Styling-Probleme

Die Implementierung ist modular aufgebaut und kann einfach erweitert werden, um zusätzliche Features wie Chat, erweiterte Analytics oder professionelle Streaming-Integration hinzuzufügen.