# Battle64 - Sicherheits- & Datenschutzcenter

🔐 Ein umfassendes Sicherheits- und Datenschutzcenter für die Battle64 Gaming-Community im Retro-Terminal-Stil.

## 🎯 Übersicht

Das Battle64 Sicherheits- & Datenschutzcenter bietet Spielern vollständige Kontrolle über ihre Daten, Sichtbarkeit und Schutzmechanismen – transparent, rechtssicher und im authentischen Retro-Stil aufbereitet.

## ✨ Features

### 🛡️ Sicherheitsfunktionen
- **Zwei-Faktor-Authentifizierung (2FA)** via App/SMS
- **Sicherheitsfragen** als Notfallzugang
- **Login-Verlauf** mit Standortanzeige
- **Geräteverwaltung** (aktive Logins anzeigen & beenden)
- **Auto-Logout** bei Inaktivität (einstellbar)
- **Meldesystem** für verdächtige Profile/Inhalte
- **Sichere Handelsmechanik** mit Bewertungspflicht
- **Benachrichtigungen** bei unüblichen Aktivitäten
- **Kindersicherung** mit Inhaltsfilterung und Zeitlimits

### 🕵️ Datenschutzeinstellungen
- **Sichtbarkeit** für Profil, Fanart, Sammlung, Highscores
- **Datennutzung** für Matchmaking und Community-Statistiken
- **DSGVO-konforme** Datenverarbeitung
- **Daten-Download** aller persönlichen Daten
- **Account-Löschung** mit 30-Tage-Wartezeit
- **Transparente Datenschutzerklärung** in einfacher Sprache

### 🎨 Design & UX
- **Retro-Terminal-Optik** mit grüner Schrift
- **Authentische Tastensounds** und Animationen
- **Responsive Design** für alle Geräte
- **Intuitive Navigation** mit Tab-System
- **Real-time Status-Updates**

## 🚀 Installation

### Voraussetzungen
- Node.js (v14 oder höher)
- npm oder yarn

### Setup
```bash
# Repository klonen
git clone <repository-url>
cd battle64-security-center

# Dependencies installieren
npm install

# Umgebungsvariablen setzen (optional)
cp .env.example .env

# Server starten
npm start

# Für Entwicklung
npm run dev
```

### Datenbank-Setup
Die SQLite-Datenbank wird automatisch erstellt und initialisiert beim ersten Start.

## 📁 Projektstruktur

```
battle64-security-center/
├── public/                 # Frontend-Dateien
│   ├── index.html         # Haupt-HTML-Datei
│   ├── styles.css         # Retro-Terminal-Styling
│   └── script.js          # Frontend-Logik
├── src/
│   ├── database/
│   │   └── SecurityDatabase.js    # Datenbank-Layer
│   ├── services/
│   │   └── SecurityService.js     # Business-Logik
│   └── routes/
│       └── securityRoutes.js      # API-Routen
├── data/                  # SQLite-Datenbank
├── exports/               # Daten-Exporte
├── server.js              # Express-Server
└── package.json
```

## 🔧 API-Endpunkte

### Sicherheitseinstellungen
- `GET /api/security/settings/security/:userId` - Sicherheitseinstellungen abrufen
- `PUT /api/security/settings/security/:userId` - Sicherheitseinstellungen aktualisieren

### Datenschutzeinstellungen
- `GET /api/security/settings/privacy/:userId` - Datenschutzeinstellungen abrufen
- `PUT /api/security/settings/privacy/:userId` - Datenschutzeinstellungen aktualisieren

### Sicherheitsfragen
- `POST /api/security/security-questions/:userId` - Sicherheitsfragen einrichten
- `POST /api/security/security-questions/:userId/verify` - Sicherheitsfragen verifizieren

### Login-Historie
- `GET /api/security/login-history/:userId` - Login-Verlauf abrufen
- `POST /api/security/login-history/:userId` - Login-Versuch hinzufügen

### Session-Management
- `GET /api/security/sessions/:userId` - Aktive Sessions abrufen
- `POST /api/security/sessions/:userId` - Neue Session erstellen
- `DELETE /api/security/sessions/:sessionToken` - Session beenden

### Meldungen
- `POST /api/security/reports` - Meldung erstellen
- `GET /api/security/reports/:userId` - Benutzer-Meldungen abrufen

### Daten-Export
- `POST /api/security/data-export/:userId` - Daten-Export initiieren
- `GET /api/security/data-export/:exportToken` - Export-Status abrufen

### Account-Löschung
- `POST /api/security/account-deletion/:userId` - Account-Löschung initiieren
- `POST /api/security/account-deletion/confirm/:confirmationToken` - Löschung bestätigen

### Sicherheits-Scan
- `POST /api/security/security-scan/:userId` - Sicherheits-Scan durchführen
- `GET /api/security/security-report/:userId` - Sicherheitsbericht generieren

## 🎮 Verwendung

### Frontend
1. Öffnen Sie `http://localhost:3000` im Browser
2. Klicken Sie auf "STARTEN" im Welcome-Screen
3. Navigieren Sie zwischen den Tabs "SICHERHEIT" und "DATENSCHUTZ"
4. Konfigurieren Sie Ihre Einstellungen
5. Nutzen Sie den "Sicherheits-Scan" für Empfehlungen

### API
```javascript
// Beispiel: Sicherheitseinstellungen abrufen
fetch('/api/security/settings/security/user123')
  .then(response => response.json())
  .then(settings => console.log(settings));

// Beispiel: Sicherheits-Scan durchführen
fetch('/api/security/security-scan/user123', {
  method: 'POST'
})
  .then(response => response.json())
  .then(results => console.log(results));
```

## 🔒 Sicherheitsfeatures

### Verschlüsselung
- Alle Passwörter und Antworten werden mit SHA-256 gehashed
- Session-Tokens werden kryptographisch sicher generiert
- Sichere Datenübertragung über HTTPS (in Produktion)

### Datenschutz
- DSGVO-konforme Datenverarbeitung
- Transparente Datenschutzerklärung
- Recht auf Datenlöschung (30-Tage-Wartezeit)
- Anonymisierte Statistiken

### Monitoring
- Login-Verlauf mit Standort-Tracking
- Verdächtige Aktivitäten-Erkennung
- Automatische Benachrichtigungen
- Session-Management

## 🎨 Customization

### Styling anpassen
Die Retro-Terminal-Optik kann in `public/styles.css` angepasst werden:

```css
/* Hauptfarben ändern */
:root {
  --terminal-green: #00ff00;
  --terminal-bg: #000;
  --terminal-border: #003300;
}
```

### Neue Features hinzufügen
1. Datenbank-Schema in `SecurityDatabase.js` erweitern
2. Business-Logik in `SecurityService.js` implementieren
3. API-Routen in `securityRoutes.js` hinzufügen
4. Frontend-Komponenten in `script.js` erstellen

## 🧪 Testing

```bash
# Tests ausführen
npm test

# Linting
npm run lint

# Build für Produktion
npm run build
```

## 📊 Monitoring

### Logs
- Alle Sicherheitsereignisse werden geloggt
- Login-Versuche werden protokolliert
- Datenzugriffe werden dokumentiert

### Metriken
- Aktive Sessions
- Sicherheits-Scores
- Datenschutz-Compliance
- Benutzer-Aktivität

## 🤝 Contributing

1. Fork des Repositories
2. Feature-Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Änderungen committen (`git commit -m 'Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 🆘 Support

Bei Fragen oder Problemen:

- **E-Mail**: support@battle64.com
- **Datenschutz**: datenschutz@battle64.com
- **Telefon**: +49 30 12345678

## 🔄 Changelog

### v1.0.0 (2024-01-15)
- Initiale Version des Sicherheits- & Datenschutzcenters
- Retro-Terminal-Design
- Vollständige DSGVO-Compliance
- Umfassende Sicherheitsfeatures
- API für alle Funktionen

---

**Battle64 Security & Privacy Center** - Sichere, transparente und benutzerfreundliche Datenschutzkontrolle für die Gaming-Community. 🎮🔐