# 🎮 Battle64 - N64 Spielbewertung & Katalogsystem

Battle64 ist eine moderne, Community-gestützte Plattform für Nintendo 64 Sammler und Enthusiasten. Das System ermöglicht es Nutzern, ihre N64-Sammlung zu verwalten, Spiele zu bewerten und mit anderen Sammlern in Kontakt zu treten.

## ✨ Features

### 🎯 Hauptfunktionen
- **Spielekatalog**: Umfassende Datenbank aller N64-Titel mit Metadaten
- **Bewertungssystem**: 4-Kategorien-Bewertung (Gameplay, Grafik, Musik, Nostalgie)
- **Persönliche Sammlung**: Verwalten Sie Ihre Spiele mit Status und Zustand
- **Community-Features**: Reviews, Likes und Community-Rankings
- **PAL/NTSC Differenzierung**: Region-spezifische Bewertungen und Sammlungen

### 🎨 Benutzeroberfläche
- **Modernes Design**: Material-UI basierte, responsive Benutzeroberfläche
- **Spielkarten**: Visuelle Darstellung mit Cover-Bildern und Bewertungen
- **Filter & Suche**: Erweiterte Suchfunktionen nach Genre, Region, Jahr
- **Mobile Optimiert**: Vollständig responsive für alle Geräte

### 🔒 Sicherheit & Legalität
- **Keine ROMs**: Keine illegalen Inhalte oder BIOS-Dateien
- **Fanart Covers**: Automatisch generierte oder Fanart Cover-Bilder
- **Markenschutz**: Respektiert Nintendo's geistige Eigentumsrechte

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js (v16 oder höher)
- npm oder yarn
- SQLite (für die Datenbank)

### Backend Setup
```bash
# Backend-Dependencies installieren
cd server
npm install

# Entwicklungsserver starten
npm run dev
```

### Frontend Setup
```bash
# Frontend-Dependencies installieren
cd client
npm install

# Entwicklungsserver starten
npm start
```

### Vollständige Installation
```bash
# Alle Dependencies installieren
npm run install-all

# Entwicklungsumgebung starten (Backend + Frontend)
npm run dev
```

## 📁 Projektstruktur

```
battle64-rating-system/
├── server/                 # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── routes/        # API-Routen
│   │   ├── database/      # Datenbank-Setup
│   │   └── types/         # TypeScript-Definitionen
│   └── data/              # SQLite-Datenbank
├── client/                # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/    # React-Komponenten
│   │   ├── pages/         # Seiten-Komponenten
│   │   ├── services/      # API-Services
│   │   ├── contexts/      # React Contexts
│   │   ├── types/         # TypeScript-Definitionen
│   │   └── utils/         # Hilfsfunktionen
│   └── public/            # Statische Dateien
└── README.md
```

## 🛠️ Technologie-Stack

### Backend
- **Node.js** mit **Express.js**
- **TypeScript** für Typsicherheit
- **SQLite** als Datenbank
- **JWT** für Authentifizierung
- **bcryptjs** für Passwort-Hashing
- **multer** für Datei-Uploads

### Frontend
- **React 19** mit **TypeScript**
- **Material-UI** für UI-Komponenten
- **React Router** für Navigation
- **TanStack Query** für Server-State-Management
- **Axios** für HTTP-Requests

## 📊 Datenbank-Schema

### Haupttabellen
- **users**: Benutzer-Profile und Authentifizierung
- **games**: Spiele-Metadaten und Cover-Informationen
- **ratings**: Bewertungen mit 4-Kategorien-System
- **collections**: Persönliche Sammlungen mit Status
- **reviews**: Community-Reviews mit Like-System

### Bewertungssystem
Jedes Spiel kann in 4 Kategorien bewertet werden:
- **Gameplay** (1-5 Sterne)
- **Grafik** (1-5 Sterne)
- **Musik/Sound** (1-5 Sterne)
- **Nostalgie** (1-5 Sterne)

Die Gesamtbewertung wird automatisch berechnet.

## 🎮 Verwendung

### Registrierung & Anmeldung
1. Registrieren Sie sich mit Benutzername, E-Mail und Passwort
2. Melden Sie sich an, um Zugriff auf alle Features zu erhalten

### Spielekatalog
1. Durchsuchen Sie den Katalog nach Spielen
2. Verwenden Sie Filter für Genre, Region, Jahr
3. Sortieren Sie nach Bewertung, Titel oder Popularität

### Bewertungen
1. Klicken Sie auf den Stern-Button bei einem Spiel
2. Bewerten Sie in allen 4 Kategorien
3. Fügen Sie optional einen Kommentar hinzu

### Sammlung
1. Fügen Sie Spiele zu Ihrer Sammlung hinzu
2. Markieren Sie den Status (Besitzt, Will ich, Getauscht)
3. Dokumentieren Sie den Zustand (Lose, Komplett, Versiegelt)

## 🔧 Entwicklung

### API-Endpunkte
- `GET /api/games` - Spielekatalog abrufen
- `POST /api/ratings` - Bewertung erstellen
- `POST /api/collections` - Zur Sammlung hinzufügen
- `GET /api/auth/me` - Aktuellen Benutzer abrufen

### Umgebungsvariablen
```env
# Backend (.env)
PORT=3001
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000

# Frontend (.env)
REACT_APP_API_URL=http://localhost:3001/api
```

## 🤝 Beitragen

1. Fork das Repository
2. Erstellen Sie einen Feature-Branch
3. Committen Sie Ihre Änderungen
4. Pushen Sie zum Branch
5. Öffnen Sie einen Pull Request

## 📝 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) für Details.

## 🙏 Danksagungen

- Nintendo für die großartigen N64-Spiele
- Die N64-Community für die Inspiration
- Alle Open-Source-Entwickler, deren Bibliotheken verwendet werden

## 📞 Support

Bei Fragen oder Problemen:
- Öffnen Sie ein Issue auf GitHub
- Kontaktieren Sie das Entwicklungsteam

---

**Battle64** - Bewahren Sie die Nostalgie der N64-Ära! 🎮✨