# Battle64 - Tauschbörse & Marktplatz

💱 Eine moderne, sichere und benutzerfreundliche Plattform für N64 Sammler zum Tauschen und Verkaufen von Spielen, Merchandise und Sammlerstücken.

## 🎯 Features

### 🛒 Marktplatzbereiche
- **🎮 Spiele & Module** - Originale und geprüfte Repros
- **🧢 Merchandise** - Figuren, Poster, Kleidung
- **🎒 Zubehör** - Controller, Speicherkarten, Konsolen
- **🧑‍🎨 Fanprodukte** - Handgemachte Objekte, Artbooks
- **💬 Gesuche** - Tauschgesuche & Kaufwünsche

### 🔁 Tauschsystem
- **Punktebasierter Tausch** - Sammle Tauschpunkte durch Aktivitäten
- **Sichere Transaktionen** - Bewertungssystem und Betrugsschutz
- **Integrierter Chat** - Direkte Kommunikation zwischen Sammlern
- **Tauschhistorie** - Übersicht aller Tauschaktivitäten

### 🎨 Design & UX
- **Retro-Vitrinen-Optik** - Liebevoll gestaltetes Retro-Design
- **Responsive Design** - Optimiert für alle Geräte
- **Smooth Animations** - Framer Motion für flüssige Übergänge
- **Intuitive Navigation** - Benutzerfreundliche Bedienung

## 🚀 Installation

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn

### Setup
```bash
# Repository klonen
git clone <repository-url>
cd battle64-marketplace

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm start
```

Die Anwendung ist dann unter `http://localhost:3000` verfügbar.

## 🛠️ Technologie-Stack

- **Frontend Framework**: React 18 mit TypeScript
- **State Management**: Zustand
- **Styling**: Styled Components
- **Animationen**: Framer Motion
- **Routing**: React Router DOM
- **Icons**: React Icons
- **Formulare**: React Hook Form

## 📁 Projektstruktur

```
src/
├── components/          # React Komponenten
│   ├── Header.tsx      # Navigation und Suche
│   ├── Marketplace.tsx # Hauptmarktplatz
│   ├── ItemCard.tsx    # Artikel-Karten
│   ├── ItemDetail.tsx  # Artikel-Details
│   ├── FilterPanel.tsx # Filter-Sidebar
│   ├── SortDropdown.tsx # Sortierung
│   ├── TradingCenter.tsx # Tauschbörse
│   ├── Wishlist.tsx    # Wunschliste
│   ├── UserProfile.tsx # Benutzerprofil
│   └── Chat.tsx        # Chat-System
├── store/              # State Management
│   └── marketplaceStore.ts
├── types/              # TypeScript Definitionen
│   └── index.ts
├── App.tsx             # Haupt-App-Komponente
└── index.tsx           # Einstiegspunkt
```

## 🎮 Verwendung

### Marktplatz durchsuchen
1. Verwende die Suchleiste für spezifische Artikel
2. Nutze die Filter-Sidebar für präzise Suche
3. Sortiere nach verschiedenen Kriterien
4. Klicke auf Artikel für Details

### Artikel tauschen
1. Wähle einen Artikel aus
2. Klicke auf "Tauschen"
3. Wähle deine Angebote aus
4. Verhandle über den integrierten Chat
5. Bestätige den Tausch

### Wunschliste verwalten
1. Markiere interessante Artikel
2. Erhalte Benachrichtigungen bei passenden Angeboten
3. Verwalte deine Gesuche

## 🎨 Design-System

### Farben
- **Primär**: #64b5f6 (Blau)
- **Sekundär**: #1976d2 (Dunkelblau)
- **Akzent**: #ffd700 (Gold für Punkte)
- **Hintergrund**: Gradient von #1e3c72 zu #2a5298

### Typografie
- **Font**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Größen**: Responsive Skalierung
- **Gewicht**: 400 (normal), 600 (semibold), 700 (bold)

### Komponenten
- **Karten**: Glasmorphismus-Effekt mit Blur
- **Buttons**: Gradient-Hintergründe mit Hover-Effekten
- **Badges**: Farbkodierte Status-Anzeigen
- **Icons**: React Icons für konsistente Darstellung

## 🔧 Entwicklung

### Scripts
```bash
npm start          # Entwicklungsserver starten
npm run build      # Produktions-Build erstellen
npm test           # Tests ausführen
npm run eject      # Create React App konfigurieren
```

### Code-Stil
- TypeScript für Typsicherheit
- ESLint für Code-Qualität
- Prettier für Formatierung
- Styled Components für CSS-in-JS

### State Management
Das Projekt verwendet Zustand für globales State Management:
- Marketplace Items
- Filter und Suche
- Benutzer-Daten
- Tausch-Offers
- Chat-System
- Benachrichtigungen

## 🚀 Deployment

### Produktions-Build
```bash
npm run build
```

### Deployment-Optionen
- **Vercel**: Automatisches Deployment
- **Netlify**: Drag & Drop Deployment
- **AWS S3**: Statisches Hosting
- **GitHub Pages**: Kostenloses Hosting

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Implementiere deine Änderungen
4. Schreibe Tests
5. Erstelle einen Pull Request

## 📝 Lizenz

Dieses Projekt steht unter der MIT-Lizenz.

## 🎯 Roadmap

### Phase 1 (Aktuell)
- ✅ Grundlegende Marktplatz-Funktionalität
- ✅ Filter und Suche
- ✅ Artikel-Details
- ✅ Responsive Design

### Phase 2 (Geplant)
- 🔄 Tausch-System implementieren
- 🔄 Chat-Funktionalität
- 🔄 Benutzer-Authentifizierung
- 🔄 Bewertungssystem

### Phase 3 (Zukunft)
- 📋 Mobile App
- 📋 Push-Benachrichtigungen
- 📋 Erweiterte Analytics
- 📋 API für Drittanbieter

## 📞 Support

Bei Fragen oder Problemen:
- Erstelle ein Issue im GitHub Repository
- Kontaktiere das Entwicklungsteam
- Schaue in die Dokumentation

---

**Battle64** - Wo Sammler zusammenkommen! 🎮✨