# EventScreen Modul - N64-Nexus

## 📦 Übersicht

Das **EventScreen** Modul ist das Herzstück für die wöchentlichen N64-Speedrun-Events ("Speedrun Saturday"). Es bietet eine vollständige Plattform für die Teilnahme an Events, die Einreichung von Zeiten, Live-Chat und Leaderboards.

## 🚀 Funktionen

### 1. **Event-Übersicht**
- **Aktuelles Event**: Zeigt das laufende Event (z.B. "F-Zero X – Silence")
- **Zeitplan**: Samstag 18:00 – 22:00 Uhr
- **Live-Status**: Dynamischer LIVE-Badge mit verschiedenen Zuständen:
  - 🔴 **LIVE**: Event läuft gerade
  - 🟡 **BALD**: Event startet in wenigen Stunden
  - 🟢 **BEENDET**: Event ist vorbei
  - ⚪ **WARTET**: Countdown bis zum nächsten Event

### 2. **Zeit-Upload**
- **Zeitformat**: Unterstützt mm:ss.ff oder h:mm:ss.ff
- **Foto-Upload**: Screenshot als Beweis mit Kamera oder Galerie
- **Regionen**: PAL, NTSC, JP Dropdown-Auswahl
- **Kommentare**: Optionale Beschreibung des Laufs
- **Validierung**: Automatische Überprüfung der Zeitformate

### 3. **Leaderboard**
- **Echtzeitaktualisierung**: Sofortige Sortierung nach bester Zeit
- **Positionsanzeige**: Gold/Silber/Bronze Icons für Top 3
- **Punktesystem**: 
  - 1. Platz: 10 Punkte
  - 2. Platz: 8 Punkte
  - 3. Platz: 6 Punkte
  - 4. Platz: 4 Punkte
  - 5. Platz: 2 Punkte
  - 6. Platz: 1 Punkt
- **Region-Filter**: Separate Tabs für Gesamt, PAL, NTSC, JP
- **Beweis-Bilder**: Anklickbare Miniaturansichten mit Vollbild-Modal

### 4. **Live-Chat**
- **Nur während Events**: Aktiv von 18:00-22:00 Uhr
- **Echtzeitkommentare**: Sofortiges Messaging-System
- **Benutzeridentifikation**: Unterschiedliche Farben für verschiedene User
- **Auto-Scroll**: Automatisches Scrollen zu neuen Nachrichten
- **Zeichenlimit**: 200 Zeichen pro Nachricht

### 5. **Event-Verlauf**
- **Archiv**: Vorherige Events mit Top 3 Gewinnern
- **Ausklappbar**: Platzsparende Darstellung
- **Detailansicht**: Spiel, Track, Datum und Gewinner
- **Zeitstempel**: Formatierte Datumsanzeige

## 🎨 Design-Features

### Retro-Design
- **Dunkles Theme**: Retro-Gaming-Atmosphäre
- **Farbschema**: 
  - Primary: `#FF6B35` (Orange)
  - Accent: `#4ECDC4` (Türkis)
  - Background: `#1A1A1A` (Schwarz)
  - Surface: `#2D2D2D` (Dunkelgrau)
- **Gradients**: Moderne Farbverläufe für Header
- **Icons**: Material Design Icons für bessere UX

### Responsive Layout
- **Cards**: Modulare Kartenstruktur
- **Flexible Layouts**: Anpassung an verschiedene Bildschirmgrößen
- **Touch-Optimiert**: Große Buttons und Touch-Targets

## 🔧 Technische Implementierung

### Architektur
```
src/
├── screens/
│   └── EventScreen.js          # Hauptkomponente
├── components/
│   ├── EventHeader.js          # Event-Info mit LIVE-Badge
│   ├── EventTimer.js           # Countdown/Timer
│   ├── TimeSubmission.js       # Zeit-Upload Formular
│   ├── Leaderboard.js          # Rangliste mit Filtern
│   ├── LiveChat.js             # Chat-System
│   └── EventHistory.js         # Vergangene Events
├── hooks/
│   └── useEventTimer.js        # Timer-Logik
└── utils/
    └── mockData.js             # Mock-Daten
```

### State Management
- **React Hooks**: useState, useEffect für lokales State
- **Custom Hooks**: useEventTimer für Event-Timing
- **Props**: Component-übergreifende Datenübertragung

### Timing-System
```javascript
// Automatische Erkennung der Event-Zeit
const isEventActive = dayOfWeek === 6 && (hour >= 18 && hour < 22);

// Countdown-Berechnung
const timeUntilNext = calculateTimeUntilSaturday18();
```

## 📱 Verwendung

### Installation
```bash
npm install
npm start
```

### Expo starten
```bash
npx expo start
```

### Demo-Daten
Die App verwendet Mock-Daten für die Demonstration:
- **Aktuelles Event**: F-Zero X – Silence
- **Beispiel-Submissions**: 4 vorgefertigte Zeiten
- **Chat-Nachrichten**: Beispiel-Unterhaltungen
- **Event-History**: 3 vergangene Events

## 🔗 Integration

### Backend-Integration
Für Produktionsumgebung ersetzen Sie die Mock-Daten durch echte API-Calls:

```javascript
// Beispiel für echte API-Integration
const loadSubmissions = async () => {
  try {
    const response = await fetch('/api/submissions');
    const data = await response.json();
    setSubmissions(data);
  } catch (error) {
    console.error('Fehler beim Laden der Submissions:', error);
  }
};
```

### Empfohlene Backend-Services
- **Supabase**: Realtime-Datenbank für Live-Updates
- **Firebase**: Echtzeit-Chat und Authentifizierung
- **Custom REST API**: Für komplexere Geschäftslogik

### Authentifizierung
```javascript
// Beispiel für User-Context
const currentUser = useContext(AuthContext);
// Ersetzen Sie 'CurrentUser' durch echte Benutzerdaten
```

## 🎯 Erweiterte Features

### Mögliche Erweiterungen
1. **Push-Notifications**: Benachrichtigungen für Event-Start
2. **Benutzerprofile**: Persönliche Statistiken und Erfolge
3. **Streaming-Integration**: Twitch/YouTube-Streams einbetten
4. **Turniere**: Mehrtägige Turniere mit Brackets
5. **Moderations-Tools**: Admin-Panel für Event-Verwaltung

### Performance-Optimierungen
- **Lazy Loading**: Komponenten bei Bedarf laden
- **Memoization**: React.memo für Performance
- **Image Caching**: Optimierte Bildverwaltung
- **Realtime Subscriptions**: Effiziente Live-Updates

## 📊 Monitoring

### Metriken
- **Event-Teilnahme**: Anzahl aktiver Benutzer
- **Submission-Rate**: Eingereichte Zeiten pro Event
- **Chat-Aktivität**: Nachrichten pro Minute
- **Verweildauer**: Zeit im Event-Screen

### Error Handling
- **Graceful Degradation**: Fallbacks für Offline-Modus
- **Retry Logic**: Automatische Wiederholungen bei Fehlern
- **User Feedback**: Klare Fehlermeldungen

## 🛠️ Entwicklung

### Lokale Entwicklung
```bash
# Entwicklungsserver starten
npm start

# iOS Simulator
npm run ios

# Android Emulator
npm run android
```

### Testing
```bash
# Unit Tests
npm test

# E2E Tests
npm run test:e2e
```

## 📋 Checkliste

### Produktionsbereitschaft
- [ ] Echte Backend-Integration
- [ ] Authentifizierung implementiert
- [ ] Error Handling vervollständigt
- [ ] Performance optimiert
- [ ] Tests geschrieben
- [ ] Dokumentation aktualisiert

### Deployment
- [ ] Expo Build konfiguriert
- [ ] Store-Listings erstellt
- [ ] Beta-Tests durchgeführt
- [ ] Release-Notes verfasst

## 🎉 Fazit

Das EventScreen Modul bietet eine vollständige Lösung für N64-Speedrun-Events mit:
- ✅ Benutzerfreundlichem Interface
- ✅ Echtzeit-Funktionalität
- ✅ Retro-Gaming-Atmosphäre
- ✅ Modularer Architektur
- ✅ Erweiterbarkeit

**Viel Spaß bei den Speedrun Saturdays! 🏎️🎮**