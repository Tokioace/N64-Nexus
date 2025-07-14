# ArchivScreen Component

Ein React TypeScript Component für die Anzeige persönlicher Highlights mit Pixel-Vibe Design.

## 🎯 Funktionen

### Kernfunktionen
- **Persönliche Highlights Anzeige**: Top-Speedruns, Lieblingsfotos, Fanarts
- **Sortierung nach Typ**: Rekorde (🏆), Screenshots (📸), Artworks (🎨)
- **Teilen-Funktion**: Für soziale Medien oder in der App
- **Chronologische Timeline**: Mit Jahresübersicht

### Design Features
- **Pixel-Vibe Design**: Leicht animierte Archivkisten-/Modulregal-Optik
- **Zwei Ansichtsmodi**: Grid-Ansicht und Timeline-Ansicht
- **Responsive Design**: Optimiert für Desktop und Mobile
- **Smooth Animations**: Fade-in, slide, hover und pulse Effekte

## 📦 Installation & Verwendung

### 1. Komponente importieren
```tsx
import ArchivScreen from './ArchivScreen';
```

### 2. Grundlegende Verwendung
```tsx
<ArchivScreen />
```

### 3. Mit Custom Handlers
```tsx
<ArchivScreen 
  onShare={(item) => {
    // Custom sharing logic
    console.log('Sharing:', item);
  }}
  onItemClick={(item) => {
    // Custom click logic
    console.log('Clicked:', item);
  }}
/>
```

## 🎨 Design Details

### Farbschema
- **Hintergrund**: Dunkler Gradient (#1a1a2e → #16213e → #0f3460)
- **Akzentfarbe**: Gold (#ffd700) für Highlights und Borders
- **Text**: Weiß mit verschiedenen Transparenzen für Hierarchie

### Typ-spezifische Farben
- **Rekorde**: Gold (#FFD700)
- **Screenshots**: Hellblau (#87CEEB)
- **Artworks**: Pink (#FF69B4)

### Animationen
- **Fade-in Effects**: Staggered loading für verschiedene Elemente
- **Hover Effects**: Scale, translate und glow Effekte
- **Timeline Markers**: Pulsierende Animation
- **Pixel Art Overlay**: Subtile Textur-Effekte

## 📱 Responsive Features

### Desktop (>768px)
- Grid-Layout mit 3+ Spalten
- Vollständige Filter-Leiste
- Hover-Effekte aktiv

### Mobile (≤768px)
- Single-Column Grid
- Vertikale Filter-Anordnung
- Touch-optimierte Buttons

## 🔧 Customization

### Datenstruktur
```tsx
interface ArchiveItem {
  id: string;
  title: string;
  description: string;
  type: 'record' | 'screenshot' | 'artwork';
  date: Date;
  imageUrl?: string;
  data?: any; // Zusätzliche Daten für Rekorde etc.
}
```

### Props
```tsx
interface ArchivScreenProps {
  onShare?: (item: ArchiveItem) => void;
  onItemClick?: (item: ArchiveItem) => void;
}
```

## 🎮 Beispiel-Daten

Die Komponente enthält Mock-Daten für:
- Speedrun Weltrekorde
- Persönliche Bestzeiten
- Epic Screenshots
- Glitch-Funde
- Mario/Luigi Fanart

## 🚀 Erweiterte Features

### Sharing-Funktionalität
- Native Web Share API Support
- Fallback zu Clipboard-Copy
- Custom Share Handler möglich

### Timeline-Ansicht
- Gruppierung nach Jahren
- Visuelle Timeline mit Markern
- Smooth Scroll-Animationen

### Filter-System
- Typ-Filter (Alle/Rekorde/Screenshots/Artworks)
- Jahr-Filter (Alle Jahre oder spezifisches Jahr)
- View-Mode Toggle (Grid/Timeline)

## 🎨 CSS-Klassen

### Haupt-Container
- `.archiv-screen`: Haupt-Container
- `.archiv-header`: Header-Bereich
- `.archiv-filters`: Filter-Kontrollen
- `.archiv-content`: Content-Bereich

### Grid-Ansicht
- `.archiv-grid`: Grid-Container
- `.archiv-item`: Einzelne Archiv-Items
- `.item-header`: Item-Header
- `.item-content`: Item-Content

### Timeline-Ansicht
- `.archiv-timeline`: Timeline-Container
- `.timeline-year`: Jahr-Gruppe
- `.timeline-item`: Timeline-Item
- `.timeline-marker`: Timeline-Marker

## 🔮 Zukünftige Erweiterungen

- [ ] Drag & Drop für Item-Reihenfolge
- [ ] Erweiterte Filter (Tags, Kategorien)
- [ ] Export-Funktionalität (PDF, JSON)
- [ ] Dark/Light Mode Toggle
- [ ] Offline-Support mit LocalStorage
- [ ] Bildergalerie-Modus
- [ ] Suchfunktion
- [ ] Favoriten-System

## 📄 Lizenz

Dieser Code ist für Bildungs- und Entwicklungszwecke erstellt.