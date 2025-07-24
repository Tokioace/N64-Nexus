# Battle64 Branding Implementation

## Übersicht
Diese Implementierung fügt das neue Battle64-Branding mit Maskottchen und stilisiertem Schriftzug auf der Homepage (/) und der Retro-Seite (/retro) hinzu.

## Implementierte Features

### 1. Maskottchen Integration
- **Position**: Links neben dem "Battle64"-Text
- **Dateiformat**: Transparentes PNG
- **Pfad**: `/public/mascot.png`
- **Responsive Größen**: 
  - Mobile: h-12 (48px)
  - Tablet: h-16 (64px) 
  - Desktop: h-20 (80px)
  - Retro-Seite: h-16/h-20/h-24 (64px/80px/96px)

### 2. "Battle64" Schriftzug
- **Stil**: N64-inspirierter Retro-Look
- **Farbverlauf**: Blau-Violett-Verlauf (#4A90E2 → #7B68EE → #9370DB)
- **Effekte**: 
  - Text-Schatten für 3D-Effekt
  - Glow-Effekt mit CSS-Pseudo-Elementen
  - Hover-Animation mit Puls-Effekt
- **Responsiv**: Automatische Anpassung für alle Bildschirmgrößen

### 3. "Welcome back" Text
- **i18n-kompatibel**: Verwendet `t('home.welcomeBack')`
- **Position**: Zentriert unterhalb des Battle64-Logos
- **Styling**: Dezent in grauer Farbe

## Geänderte Dateien

### `/src/components/HomeScreenRetro.tsx`
- Header-Sektion komplett überarbeitet
- Flex-Layout für Maskottchen + Schriftzug
- Welcome-back Text hinzugefügt

### `/src/pages/HomePage.tsx`
- Welcome Section mit neuem Branding
- Konsistente Implementierung mit Retro-Seite
- Responsive Anpassungen beibehalten

### `/src/index.css`
- Neue `.battle64-title` CSS-Klasse
- N64-inspirierte Styling-Effekte
- Responsive Breakpoints
- Hover-Animationen

## i18n-Unterstützung

Die Implementierung nutzt den bestehenden i18n-Schlüssel:
```javascript
t('home.welcomeBack')
```

Dieser ist bereits in allen 13 unterstützten Sprachen verfügbar:
- Deutsch: "Willkommen zurück"
- Englisch: "Welcome back"
- Französisch: "Bon retour"
- Und 10 weitere Sprachen...

## Mascot-Bild Setup

1. Platzieren Sie Ihr Battle64-Maskottchen-Bild als `/public/mascot.png`
2. Empfohlene Spezifikationen:
   - Format: Transparentes PNG
   - Größe: 256x256px oder höher
   - Seitenverhältnis: Quadratisch bevorzugt
   - Qualität: Hoch für Retina-Displays

## Technische Details

### CSS-Klassen
- `.battle64-title`: Haupt-Styling für den Schriftzug
- Gradient-Text mit `background-clip: text`
- Multi-Layer-Schatten für 3D-Effekt
- Pseudo-Elemente für Glow-Effekt

### Responsive Design
- Automatische Skalierung des Maskottchens
- Angepasste Schriftgrößen für alle Geräte
- Konsistente Abstände und Proportionen

### Browser-Kompatibilität
- Webkit-Präfixe für Gradient-Text
- Fallbacks für ältere Browser
- Optimiert für moderne Browser

## Verwendung

Das neue Branding wird automatisch auf folgenden Seiten angezeigt:
- **Homepage** (`/`): Mit vollständigem News-Feed-Layout
- **Retro-Seite** (`/retro`): Mit Tile-basiertem Layout

Beide Implementierungen sind pixelgenau identisch und vollständig responsiv.

## Wartung

- Mascot-Bild kann jederzeit durch Ersetzen von `/public/mascot.png` aktualisiert werden
- CSS-Styling kann in `/src/index.css` angepasst werden
- i18n-Texte werden automatisch aus dem bestehenden System geladen

## Status
✅ **Implementierung abgeschlossen**
- Maskottchen-Integration
- Stilisierter "Battle64"-Schriftzug
- "Welcome back"-Text mit i18n
- Responsive Design
- Konsistente Darstellung auf beiden Seiten