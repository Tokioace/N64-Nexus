# N64-Nexus 🎮

Eine React Native App für wöchentliche N64-Speedrun-Events.

## 🚀 Features

### EventScreen Modul
- **Live Events**: Wöchentliche "Speedrun Saturday" Events (18:00-22:00 Uhr)
- **Zeit-Einreichung**: Upload von Screenshots mit Zeiten und Region-Auswahl
- **Live Leaderboard**: Echtzeitaktualisierung mit Punktesystem
- **Live Chat**: Nur während Events aktiv
- **Event-Verlauf**: Archiv vergangener Events mit Top 3

## 🎨 Design
- Retro-Gaming-Atmosphäre mit dunklem Theme
- N64-inspirierte Farbpalette
- Moderne UI mit Material Design Icons
- Responsive Layout für alle Bildschirmgrößen

## 🛠️ Technologie
- **React Native** mit Expo
- **React Native Paper** für UI Components
- **Expo Image Picker** für Foto-Upload
- **Material Icons** für bessere UX
- **Mock-Daten** für Demo (bereit für echte Backend-Integration)

## 📱 Installation & Start

```bash
# Dependencies installieren
npm install

# App starten
npm start
# oder
npx expo start

# iOS Simulator
npm run ios

# Android Emulator
npm run android
```

## 📋 Aktuelle Features

### ✅ Implementiert
- Event-Übersicht mit Live-Status
- Timer/Countdown System
- Zeit-Upload mit Foto-Beweis
- Leaderboard mit Region-Filtern
- Live-Chat System
- Event-History Archiv

### 🔄 Geplant
- Backend-Integration (Supabase/Firebase)
- Benutzer-Authentifizierung
- Push-Notifications
- Streaming-Integration
- Turniere & Brackets

## 📁 Projektstruktur

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
    └── mockData.js             # Demo-Daten
```

## 🎯 Verwendung

Die App startet automatisch mit dem EventScreen. Alle Funktionen sind voll funktionsfähig mit Mock-Daten:

1. **Event-Status**: Wechselt automatisch basierend auf aktueller Zeit
2. **Zeit einreichen**: Funktioniert mit Kamera/Galerie (nur während Events)
3. **Leaderboard**: Sortiert automatisch nach bester Zeit
4. **Live-Chat**: Messaging-System (nur während Events)
5. **Event-Verlauf**: Zeigt vergangene Events

## 📖 Dokumentation

Ausführliche Dokumentation im `EventScreen_Documentation.md` File.

## 🤝 Contribution

Bereit für Erweiterungen und Backend-Integration!

---

**Viel Spaß beim Speedrunning! 🏎️**