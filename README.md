# 🎮 N64-Nexus | Battle64 Gallery

Eine umfassende Galerie-Plattform für N64-Enthusiasten, die Fanart, Screenshots und seltene Sammlerstücke aus der goldenen Ära des Nintendo 64 vereint.

## 🌟 Features

### 🖼️ Galerie-Kategorien
- **🎨 Fanart**: Handgezeichnete und digitale Kunstwerke
- **📷 Screenshots**: Gameplay-Momente und Meilensteine
- **🧸 Sammlerstücke & Merchandise**: Seltene Figuren, Controller, Game-Cases und mehr

### 🏆 Community-System
- **Seltenheitsbewertung**: Community-basierte Bewertung mit 1-5 Sternen
- **Punktesystem**: Automatische Punktevergabe basierend auf Seltenheit
- **Collector-Titel**: 
  - 🌱 Beginner (0-100 Punkte)
  - ⭐ Collector (101-500 Punkte)
  - 🎖️ Archivist (501-1000 Punkte)
  - 🏆 Legendary Collector (1000+ Punkte)

### 📊 Toplisten
- **💎 Top 10 Collectors**: Höchste Punktezahl
- **🧸 Merchandise-Meister**: Beste Bewertungsquote
- **🔍 Hidden Gems**: Seltene Items mit wenigen Votes, aber hohem Schnitt

### 💬 Community-Funktionen
- **Kommentarbereich**: Fragen & Austausch
- **Kontaktfunktion**: Nachrichten zwischen aktiven Usern
- **Favoriten-Sammlung**: Persönliche "Regal"-Ansicht
- **Verkaufsoption**: Nicht-verbindliche Verkaufsanzeige

### 🎨 Design & UX
- **Retro-Design**: 90er-Jahre N64-Ästhetik
- **Animierte Elemente**: Glitzernde Bewertungen, Hover-Effekte
- **Responsive Design**: Optimiert für alle Geräte
- **Polygon-Rahmen**: Authentische 90er-Werbeanzeigen-Optik

## 🚀 Installation

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn

### Setup
```bash
# Repository klonen
git clone https://github.com/your-username/n64-nexus.git
cd n64-nexus

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter `http://localhost:3000` verfügbar.

## 🛠️ Technologie-Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animationen**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Routing**: React Router DOM

## 📁 Projektstruktur

```
src/
├── components/
│   ├── Battle64Gallery.tsx    # Haupt-Galerie-Komponente
│   ├── GalleryItemCard.tsx    # Einzelne Item-Karten
│   ├── Header.tsx             # Navigation & Header
│   ├── TopLists.tsx           # Toplisten & Rankings
│   ├── UploadModal.tsx        # Upload-Formular
│   └── GalleryTab.tsx         # Tab-Navigation
├── types/
│   └── index.ts               # TypeScript-Definitionen
├── App.tsx                    # Haupt-App-Komponente
├── main.tsx                   # React-Entry-Point
└── index.css                  # Globale Styles
```

## 🎯 Verwendung

### Item hochladen
1. Klicke auf "Item hochladen" Button
2. Wähle eine Kategorie (Fanart/Screenshots/Merchandise)
3. Lade ein Bild hoch
4. Fülle Titel und Beschreibung aus
5. Optional: Herkunft, Tags und Verkaufsoption hinzufügen
6. Hochladen

### Bewertungssystem
- Jedes Item erhält standardmäßig 1 Stern (5 Punkte)
- Community kann Items mit 1-5 Sternen bewerten
- Punktevergabe: 1 Stern = 5 Punkte, 5 Sterne = 50 Punkte

### Collector-Titel
- **Beginner**: 0-100 Punkte
- **Collector**: 101-500 Punkte  
- **Archivist**: 501-1000 Punkte
- **Legendary Collector**: 1000+ Punkte

## 🔐 Datenschutz & Sicherheit

- **Bild-Metadaten**: Automatische Bereinigung (kein Standort etc.)
- **Kein Verkauf**: Battle64 ist keine Kaufplattform
- **Kontakt nur über Kommentare**: Rechtlich sichere Kommunikation
- **Optional Verkaufsanzeige**: Nicht-verbindliche Kennzeichnung

## 🎨 Customization

### Farben anpassen
Die N64-Farbpalette kann in `tailwind.config.js` angepasst werden:

```javascript
colors: {
  'n64-purple': '#663399',
  'n64-blue': '#0066CC',
  'n64-green': '#00CC66',
  'n64-red': '#CC0033',
  'n64-yellow': '#FFCC00',
  // ...
}
```

### Animationen
Custom-Animationen sind in `tailwind.config.js` definiert:

```javascript
animation: {
  'glow': 'glow 2s ease-in-out infinite alternate',
  'sparkle': 'sparkle 1.5s ease-in-out infinite',
  'float': 'float 3s ease-in-out infinite',
}
```

## 📝 Scripts

```bash
# Entwicklung
npm run dev          # Startet Entwicklungsserver
npm run build        # Production-Build
npm run preview      # Preview des Production-Builds

# Code-Qualität
npm run lint         # ESLint-Check
npm run lint:fix     # ESLint-Autofix
```

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 🙏 Danksagungen

- Nintendo für die unvergessliche N64-Ära
- Die N64-Community für die Inspiration
- Alle Retro-Gaming-Enthusiasten weltweit

---

**N64-Nexus** - Wo Nostalgie auf Community trifft! 🎮✨