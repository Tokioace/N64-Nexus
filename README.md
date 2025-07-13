# 🎮 RetroMemory - Rechtskonforme Retro-Gaming Community App

Eine Community-Plattform für Fans klassischer Konsolenspiele der 90er. Nutzer können ihre Spielesammlung verwalten, Bewertungen abgeben, an Wettbewerben teilnehmen und sich mit Gleichgesinnten austauschen.

## 🚀 Features

- **📚 Sammlung verwalten**: Verwalte deine Spielesammlung und teile sie mit der Community
- **⭐ Bewertungen**: Gib Bewertungen ab und entdecke neue Lieblingsspiele
- **🏆 Wettbewerbe**: Nimm an Community-Wettbewerben teil und gewinne Preise
- **👥 Community**: Tausche dich mit anderen Retro-Gaming Fans aus

## ⚖️ Rechtliche Konformität

Diese App wurde von Grund auf rechtlich sicher entwickelt und berücksichtigt alle relevanten Bestimmungen:

### ✅ Implementierte Rechtssicherheit:
- **Kein Markenschutz-Verstoß**: Name "RetroMemory" verwendet keine geschützten Marken
- **Rechtliche Disclaimers**: Automatische Anzeige beim ersten Start
- **Impressum**: Vollständig implementiert und zugänglich
- **Nutzungsrichtlinien**: Programmatisch integriert und durchgesetzt
- **Urheberrechtsschutz**: Keine ROMs, Logos oder geschützten Inhalte

### 📋 Rechtliche Texte (alle programmatisch integriert):
- **Startup-Disclaimer**: Wird beim ersten App-Start angezeigt
- **Impressum**: Vollständig implementiert mit allen notwendigen Angaben
- **Footer-Disclaimer**: Auf jeder Seite sichtbar
- **Nutzungsrichtlinien**: Für alle User-generierten Inhalte
- **App-Store-Beschreibung**: Rechtlich sichere Beschreibung verfügbar

## 🛠️ Installation & Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Produktions-Build erstellen
npm run build

# Produktion starten
npm start
```

## 📁 Projektstruktur

```
src/
├── constants/
│   └── legal.ts              # Alle rechtlichen Texte und Metadaten
├── components/
│   ├── LegalDisclaimer.tsx   # Rechtliche Hinweise-Komponente
│   └── ImpressumScreen.tsx   # Impressum-Bildschirm
├── pages/
│   ├── _app.tsx             # App-Wrapper mit Styles
│   └── index.tsx            # Hauptseite mit integrierter Rechtssicherheit
└── styles/
    └── globals.css          # Globale Styles (Gaming-Theme)
```

## 📝 Rechtliche Implementierung

### 1. Konstanten-basierte Verwaltung
Alle rechtlichen Texte werden in `src/constants/legal.ts` zentral verwaltet:

```typescript
export const LEGAL_CONSTANTS = {
  APP_NAME: 'RetroMemory',
  APP_DESCRIPTION: '...',
  LEGAL_DISCLAIMER: '...',
  IMPRESSUM_TEXT: '...',
  USAGE_GUIDELINES: {...}
};
```

### 2. Automatische Disclaimer-Anzeige
- Startup-Modal beim ersten Besuch
- Footer-Disclaimer auf jeder Seite
- Vollständige rechtliche Hinweise integriert

### 3. Impressum-Integration
- Vollständig implementierter Impressum-Screen
- Zugänglich über Footer-Link
- Alle notwendigen rechtlichen Angaben

### 4. Nutzungsrichtlinien
- Programmatische Durchsetzung der Richtlinien
- Warnhinweise für User-generierte Inhalte
- Schutz vor Urheberrechtsverletzungen

## 🔒 Sicherheitsmaßnahmen

- **Keine geschützten Inhalte**: ROMs, Logos, Musik oder Screenshots werden nicht bereitgestellt
- **User-generierte Inhalte**: Nutzer werden über Urheberrechte informiert
- **Markenrechtschutz**: Keine Verwendung geschützter Marken oder Namen
- **Unabhängige Plattform**: Klare Abgrenzung zu Nintendo und anderen Rechteinhabern

## 📱 App-Namen (Alternativen)

Verfügbare rechtssichere Namen:
- **RetroMemory** (gewählt)
- 64bitCollect
- Memory Kart
- ModulMeister
- Gen64
- PixelArena

## 🎨 Design

- **Gaming-Theme**: Retro-inspiriertes Design mit modernen Elementen
- **Responsive**: Funktioniert auf allen Geräten
- **Accessibility**: Benutzerfreundlich und zugänglich
- **Performance**: Optimiert für schnelle Ladezeiten

## 📄 Lizenz

MIT - Siehe LICENSE Datei für Details

## 📞 Kontakt

Bei Fragen zur rechtlichen Implementierung oder zur App wenden Sie sich an:
[Kontaktdaten hier einfügen]

---

**Wichtiger Hinweis**: Diese App ist ein privates Fanprojekt und steht in keiner Verbindung zu Nintendo oder anderen Rechteinhabern klassischer Konsolenspiele. Alle Marken gehören ihren jeweiligen Inhabern.