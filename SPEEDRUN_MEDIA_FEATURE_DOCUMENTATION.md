# 📸🎥 Speedrun Media Capture & Verification Feature

## Überblick

Das **Speedrun Media Capture & Verification Feature** ermöglicht es Nutzern, ihre Speedruns direkt über die App als Foto, Video oder Livestream aufzunehmen und hochzuladen. Das System ist vollständig DSGVO-konform und bietet umfassende Verifizierungs- und Moderationsfunktionen.

## 🎯 Hauptfunktionen

### 1. Authentifizierte Medienaufnahme
- **Nur über die App**: Medien können nur über die offizielle App aufgenommen werden
- **Automatische Metadaten**: Jede Aufnahme wird automatisch mit Datum, Uhrzeit, Spielname, Event-ID und Benutzer-ID versehen
- **Event-Zeitfenster**: Aufnahmen sind nur während offizieller Event-Zeiten möglich (Backend-gesteuert)

### 2. Medientypen
- 📸 **Screenshots**: Pflichtfeld für jeden Run mit Zeitstempel
- 📹 **Videoaufnahmen**: Optional, ideal für Rang #1 pro Woche
- 🔴 **Livestream-Links**: Optional, DSGVO-konform via Drittintegration

### 3. DSGVO-Konformität
- **Aktive Zustimmung**: Nutzer müssen explizit zustimmen für Video/Livestream-Uploads
- **Datenschutz-Hinweise**: Klare Informationen über Datenverarbeitung
- **Widerrufsrecht**: Nutzer können Zustimmung jederzeit widerrufen
- **Löschfunktion**: Vollständige Datenlöschung auf Anfrage

## 🏗️ Technische Implementierung

### Neue TypeScript-Typen

```typescript
interface MediaMeta {
  id: string
  userId: string
  gameId: string
  eventId?: string
  type: 'photo' | 'video' | 'stream'
  url: string
  timestamp: string
  isEventRun: boolean
  isPublic: boolean
  isVerified: boolean
  comment?: string
  gameTime?: string
  metadata: {
    deviceInfo?: string
    resolution?: string
    duration?: number
    fileSize?: number
  }
  votes: {
    likes: number
    dislikes: number
    userVote?: 'like' | 'dislike'
  }
  reports: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}
```

### Komponenten-Architektur

#### 1. **MediaContext** (`src/contexts/MediaContext.tsx`)
- Zentrale Zustandsverwaltung für alle Medien
- Funktionen für Upload, Voting, Reporting, Verifikation
- Integration mit User- und Event-Kontexten
- Lokale Speicherung mit localStorage

#### 2. **MediaCaptureComponent** (`src/components/MediaCaptureComponent.tsx`)
- Hauptkomponente für Medienaufnahme
- Kamera-/Mikrofon-Zugriff über WebRTC
- Foto-Aufnahme mit Canvas-API
- Video-Aufnahme mit MediaRecorder-API
- DSGVO-Zustimmungsformulare
- Event-Zeitfenster-Validierung

#### 3. **MediaGallery** (`src/components/MediaGallery.tsx`)
- Anzeige aller Medien in Grid-Layout
- Filter- und Sortieroptionen
- Voting-System (Like/Dislike)
- Report-Funktionalität
- Responsive Design

#### 4. **SpeedrunLeaderboard** (`src/components/SpeedrunLeaderboard.tsx`)
- Ranglisten-Integration mit Medien
- Automatische Zeit-Parsing und Sortierung
- Verschiedene Leaderboard-Typen (täglich, wöchentlich, Event)
- Medien-Vorschau in Rangliste
- Verifizierungs-Status-Anzeige

#### 5. **MediaAdminPanel** (`src/components/MediaAdminPanel.tsx`)
- Admin-Interface für Medienmoderation
- Batch-Verifikation und -Ablehnung
- Erweiterte Filter- und Suchfunktionen
- Report-Management
- Statistik-Dashboard

#### 6. **SpeedrunMediaPage** (`src/pages/SpeedrunMediaPage.tsx`)
- Haupt-Demo-Seite mit allen Features
- Tab-basierte Navigation
- Spiel- und Event-Auswahl
- Integrierte Komponenten-Demonstration

## 🔧 Konfiguration

### MediaCaptureSettings
```typescript
interface MediaCaptureSettings {
  allowPhoto: boolean          // Foto-Aufnahme erlauben
  allowVideo: boolean          // Video-Aufnahme erlauben
  allowStream: boolean         // Stream-Links erlauben
  maxVideoDuration: number     // Max. Video-Länge (Sekunden)
  maxFileSize: number          // Max. Dateigröße (Bytes)
  requiredFields: string[]     // Pflichtfelder
  eventTimeWindow?: {          // Event-Zeitfenster
    start: Date
    end: Date
  }
}
```

### Standard-Konfiguration
- **Foto-Aufnahme**: Aktiviert
- **Video-Aufnahme**: Aktiviert
- **Stream-Links**: Aktiviert
- **Max. Video-Dauer**: 5 Minuten (300 Sekunden)
- **Max. Dateigröße**: 100 MB
- **Pflichtfelder**: `['gameTime', 'gameId']`

## 🎮 Benutzerführung

### Medienaufnahme-Workflow
1. **Anmeldung**: Nutzer muss eingeloggt sein
2. **Spiel auswählen**: Dropdown mit verfügbaren Spielen
3. **Event auswählen**: Optional, nur aktive Events
4. **Modus wählen**: Foto, Video oder Upload
5. **Spielzeit eingeben**: Pflichtfeld für Rangliste
6. **Kommentar hinzufügen**: Optional
7. **Datenschutz-Einstellungen**: Öffentlich/Privat
8. **DSGVO-Zustimmung**: Bei Video/öffentlichen Medien
9. **Aufnahme starten**: Kamera-/Mikrofon-Zugriff
10. **Upload**: Automatische Verarbeitung und Metadaten-Erstellung

### Ranglisten-Integration
- **Automatische Sortierung**: Nach Spielzeit (MM:SS oder HH:MM:SS)
- **Nur beste Zeit**: Pro Nutzer wird nur die beste Zeit gewertet
- **Verifizierung**: Nur verifizierte Medien zählen für offizielle Ranglisten
- **Event-Bonus**: Event-Runs erhalten zusätzliche Punkte
- **Community-Voting**: Beliebte Runs werden hervorgehoben

## 🛡️ Sicherheit & Datenschutz

### DSGVO-Compliance
- **Rechtsgrundlage**: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)
- **Transparenz**: Klare Informationen über Datenverarbeitung
- **Zweckbindung**: Medien nur für Speedrun-Verifikation
- **Datensparsamkeit**: Minimale Metadaten-Erfassung
- **Speicherdauer**: Löschung nach Event-Ende oder auf Nutzeranfrage
- **Betroffenenrechte**: Auskunft, Berichtigung, Löschung, Widerspruch

### Technische Sicherheit
- **Client-seitige Validierung**: Dateigröße, Format, Dauer
- **Metadaten-Verifikation**: Automatische Zeitstempel-Prüfung
- **Anti-Manipulation**: Geräte-Fingerprinting, Hash-Verifikation
- **Rate-Limiting**: Schutz vor Spam und Missbrauch
- **Content-Moderation**: Automatische und manuelle Prüfung

## 📊 Monitoring & Analytics

### Erfasste Metriken
- **Upload-Statistiken**: Anzahl, Größe, Typ pro Zeitraum
- **Verifikations-Rate**: Anteil genehmigter vs. abgelehnter Medien
- **Community-Engagement**: Votes, Kommentare, Shares
- **Performance**: Upload-Geschwindigkeit, Fehlerrate
- **Compliance**: DSGVO-Löschanfragen, Widerrufe

### Admin-Dashboard
- **Pending-Queue**: Medien zur Überprüfung
- **Report-Management**: Gemeldete Inhalte
- **Nutzer-Statistiken**: Top-Uploader, Aktivste Nutzer
- **System-Health**: Speicherplatz, Performance-Metriken

## 🚀 Deployment & Skalierung

### Infrastruktur-Anforderungen
- **Speicher**: Skalierbare Blob-Storage (AWS S3, Azure Blob)
- **CDN**: Globale Content-Delivery für Medien
- **Transcoding**: Video-Optimierung für verschiedene Geräte
- **Backup**: Redundante Speicherung kritischer Medien
- **Monitoring**: Real-time Überwachung und Alerting

### Performance-Optimierungen
- **Lazy Loading**: Medien werden bei Bedarf geladen
- **Thumbnail-Generation**: Automatische Vorschaubilder
- **Compression**: Verlustfreie Komprimierung
- **Caching**: Browser- und Server-seitiges Caching
- **Progressive Upload**: Chunked Upload für große Dateien

## 🔄 Wartung & Updates

### Regelmäßige Aufgaben
- **Medien-Bereinigung**: Löschung abgelaufener/nicht-verifizierter Medien
- **Backup-Verifikation**: Integrität der Sicherungen prüfen
- **Performance-Monitoring**: Ladezeiten und Fehlerrate überwachen
- **Compliance-Audit**: DSGVO-Konformität regelmäßig prüfen

### Update-Prozess
1. **Staging-Tests**: Neue Features in Testumgebung
2. **Graduelle Rollouts**: Stufenweise Einführung
3. **Rollback-Plan**: Schnelle Rücknahme bei Problemen
4. **Nutzer-Kommunikation**: Transparente Änderungsmitteilungen

## 📋 Checkliste für Produktions-Deployment

### Vor dem Launch
- [ ] **DSGVO-Compliance**: Rechtliche Prüfung abgeschlossen
- [ ] **Sicherheits-Audit**: Penetrationstests durchgeführt
- [ ] **Performance-Tests**: Lastests unter realen Bedingungen
- [ ] **Backup-Strategie**: Vollständige Datensicherung implementiert
- [ ] **Monitoring**: Alerting und Dashboards eingerichtet
- [ ] **Dokumentation**: Admin-Handbuch und Nutzer-Guides
- [ ] **Support-Training**: Team für Nutzer-Support geschult

### Nach dem Launch
- [ ] **Monitoring**: Kontinuierliche Überwachung der KPIs
- [ ] **Feedback-Sammlung**: Nutzer-Feedback systematisch erfassen
- [ ] **Bug-Tracking**: Issues priorisieren und beheben
- [ ] **Feature-Requests**: Community-Wünsche evaluieren
- [ ] **Compliance-Monitoring**: DSGVO-Konformität aufrechterhalten

## 🎯 Zukunftige Erweiterungen

### Geplante Features
- **KI-basierte Verifikation**: Automatische Zeit-Erkennung in Screenshots
- **Blockchain-Verifikation**: Unveränderliche Zeitstempel
- **AR/VR-Integration**: Immersive Speedrun-Erfahrungen
- **Social Features**: Freunde-System, Challenges
- **Erweiterte Analytics**: Detaillierte Performance-Metriken

### Community-Features
- **Kommentar-System**: Diskussionen zu Runs
- **Achievement-System**: Belohnungen für Uploads
- **Turniere**: Organisierte Speedrun-Wettbewerbe
- **Streaming-Integration**: Direkte Twitch/YouTube-Anbindung
- **Mobile App**: Native iOS/Android-Anwendung

---

## 📞 Support & Kontakt

Bei Fragen oder Problemen mit dem Speedrun Media Feature:

- **Technischer Support**: tech-support@battle64.com
- **Datenschutz-Anfragen**: privacy@battle64.com
- **Community-Management**: community@battle64.com
- **Bug-Reports**: GitHub Issues oder support@battle64.com

---

*Dieses Feature wurde entwickelt von der Battle64 Community und steht unter der MIT-Lizenz. Alle Rechte vorbehalten.*