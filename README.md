# 🏁 Battle64 Gruppen-Speedruns

Ein innovatives Team-Modus-System für N64-Speedrunning-Events, das die Nostalgie der Retro-Gaming-Ära mit moderner Team-Dynamik verbindet.

## 🎮 Features

### 👥 Team Management
- **Team-Erstellung**: Gründet Teams mit 2-4 Spielern
- **Rollen-System**: Captain und Member mit unterschiedlichen Berechtigungen
- **Team-Logos**: Wählbare Pixelstil-Logos im Retro-Design
- **Team-Chat**: Echtzeit-Kommunikation während Events

### 🏆 Event System
- **Team-Events**: Spezielle Events für Gruppenwettbewerbe
- **Live-Rankings**: Echtzeit-Updates der Team-Platzierungen
- **Zeit-Einreichung**: Screenshot-basierte Zeitbestätigung
- **Event-Status**: Upcoming, Active, Completed

### 🏅 Achievements & Medaillen
- **Team Titan**: Erster Team-Sieg
- **Golden Group**: 3 Podestplätze
- **Speed Demon**: Team-Zeit unter 2 Stunden
- **Team Veteran**: 10 Team-Events

### 📊 Statistiken & Rankings
- **Live-Leaderboards**: Echtzeit-Team- und Spieler-Rankings
- **Persönliche Statistiken**: Detaillierte Erfolgsübersicht
- **Team-Historie**: Vergangene Events und Platzierungen
- **Filter-Optionen**: Nach Region, Zeitraum, Spiel

## 🚀 Installation

### Voraussetzungen
- Node.js (v16 oder höher)
- npm oder yarn

### Backend Setup
```bash
# Dependencies installieren
npm install

# Server starten
npm run server
```

### Frontend Setup
```bash
# In das Client-Verzeichnis wechseln
cd client

# Dependencies installieren
npm install

# Development Server starten
npm start
```

### Vollständige Installation
```bash
# Alle Dependencies installieren (Backend + Frontend)
npm run install-all

# Entwicklungsumgebung starten
npm run dev
```

## 🛠️ Technologie-Stack

### Backend
- **Express.js**: RESTful API
- **Socket.IO**: Echtzeit-Kommunikation
- **Node.js**: Server-Runtime
- **UUID**: Eindeutige IDs

### Frontend
- **React**: UI Framework
- **Styled Components**: CSS-in-JS Styling
- **Framer Motion**: Animationen
- **React Router**: Navigation
- **Socket.IO Client**: Echtzeit-Updates
- **React Hot Toast**: Benachrichtigungen

## 📁 Projektstruktur

```
battle64-gruppen-speedruns/
├── server/
│   ├── index.js              # Hauptserver
│   ├── routes/
│   │   ├── teams.js          # Team-API
│   │   ├── events.js         # Event-API
│   │   └── users.js          # User-API
│   └── socket/
│       └── teamSocket.js     # Socket.IO Handler
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── Header.js     # Navigation
│   │   ├── pages/
│   │   │   ├── Home.js       # Startseite
│   │   │   ├── TeamEvents.js # Event-Übersicht
│   │   │   ├── TeamManagement.js # Team-Verwaltung
│   │   │   ├── EventDetails.js   # Event-Details
│   │   │   ├── UserProfile.js    # Benutzerprofil
│   │   │   └── Leaderboard.js    # Ranglisten
│   │   ├── App.js            # Hauptkomponente
│   │   └── index.js          # Entry Point
│   └── public/
│       └── index.html        # HTML Template
├── package.json              # Backend Dependencies
└── README.md                 # Dokumentation
```

## 🎯 Verwendung

### 1. Team Erstellen
- Navigiere zu "Teams" im Hauptmenü
- Fülle das Team-Erstellungsformular aus
- Wähle Team-Logo und maximale Mitgliederzahl
- Werde automatisch zum Captain ernannt

### 2. Event Teilnahme
- Durchsuche verfügbare Events
- Registriere dein Team für ein Event
- Warte auf Event-Start
- Reiche deine Zeit während des Events ein

### 3. Live-Tracking
- Verfolge Live-Rankings während des Events
- Kommuniziere mit deinem Team über den Chat
- Erhalte Motivationsnachrichten basierend auf Fortschritt

### 4. Ergebnisse & Achievements
- Sieh finale Platzierungen nach Event-Ende
- Sammle Achievements für besondere Leistungen
- Überprüfe deine Statistiken im Profil

## 🎨 Design-Features

### Retro-Gaming-Ästhetik
- **Pixelstil-Fonts**: Press Start 2P für Überschriften
- **Neon-Farben**: Grüne (#00ff41) und blaue (#00cc33) Akzente
- **Scanlines**: Retro-CRT-Effekt
- **Glow-Effekte**: Leuchtende Rahmen und Schatten

### Responsive Design
- **Mobile-First**: Optimiert für alle Bildschirmgrößen
- **Touch-Friendly**: Große Buttons und Touch-Targets
- **Flexible Layouts**: Grid-basierte responsive Strukturen

## 🔧 API Endpoints

### Teams
- `POST /api/teams/create` - Team erstellen
- `GET /api/teams` - Alle Teams abrufen
- `POST /api/teams/:id/join` - Team beitreten
- `POST /api/teams/:id/submit-time` - Zeit einreichen

### Events
- `POST /api/events/create` - Event erstellen
- `GET /api/events` - Events abrufen
- `POST /api/events/:id/register` - Für Event registrieren
- `GET /api/events/:id/leaderboard` - Event-Rangliste

### Users
- `POST /api/users/register` - Benutzer registrieren
- `GET /api/users/:id` - Benutzerprofil abrufen
- `GET /api/users/:id/achievements` - Achievements abrufen

## 🚀 Deployment

### Production Build
```bash
# Frontend build
cd client
npm run build

# Backend starten
cd ..
npm start
```

### Environment Variables
```env
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=production
```

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📝 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe `LICENSE` für Details.

## 🎮 Nächste Schritte

### Geplante Features
- **Voice Chat**: Sprachkommunikation für Teams
- **Tournament Mode**: Turnier-System mit Bracket
- **Spectator Mode**: Zuschauer-Modus für Events
- **Mobile App**: Native iOS/Android App
- **Twitch Integration**: Stream-Integration
- **Discord Bot**: Discord-Bot für Team-Management

### Technische Verbesserungen
- **Database Integration**: PostgreSQL/MongoDB
- **Authentication**: JWT-basierte Authentifizierung
- **File Upload**: Cloud Storage für Screenshots
- **Caching**: Redis für Performance
- **Testing**: Unit und Integration Tests

## 📞 Support

Bei Fragen oder Problemen:
- Erstelle ein Issue auf GitHub
- Kontaktiere das Entwicklungsteam
- Schaue in die Dokumentation

---

**Battle64 Gruppen-Speedruns** - Wo Retro-Gaming auf moderne Team-Dynamik trifft! 🏁🎮