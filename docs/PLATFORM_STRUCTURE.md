# Battle64 Platform & Fairness Structure

## 📋 Übersicht

Das Battle64 Platform & Fairness Structure System implementiert eine hierarchische Kategorisierung für Speedrun-Wettbewerbe, die Transparenz und Fairness zwischen verschiedenen Spielplattformen und Glitch-Nutzung gewährleistet.

## 🏗️ Architektur

### Hierarchische Kategorisierung

```
Region (Oberkategorie)
├── PAL 🇪🇺
└── NTSC 🇺🇸
    └── Plattform (Unterkategorie)
        ├── Original-Konsole 🎮
        ├── PC/Emulator 💻
        └── Mobile Emulator 📱
            └── Fairness-Ebene (Emulator-spezifisch)
                ├── Normal 🟩 (Glitchfrei)
                └── Glitch 🟥 (Glitches erlaubt)
```

### Kategorie-Kombinationen

| Region | Plattform | Fairness-Level | Kategorie-ID | Anzeigename |
|--------|-----------|----------------|--------------|-------------|
| PAL | Original-Konsole | - | `PAL_original_console` | 🇪🇺 Original-Konsole |
| NTSC | Original-Konsole | - | `NTSC_original_console` | 🇺🇸 Original-Konsole |
| PAL | PC/Emulator | Normal | `PAL_pc_emulator_normal` | 🇪🇺💻🟩 PC/Emulator / Glitchfrei |
| PAL | PC/Emulator | Glitch | `PAL_pc_emulator_glitch` | 🇪🇺💻🟥 PC/Emulator / Glitchrun |
| NTSC | PC/Emulator | Normal | `NTSC_pc_emulator_normal` | 🇺🇸💻🟩 PC/Emulator / Glitchfrei |
| NTSC | PC/Emulator | Glitch | `NTSC_pc_emulator_glitch` | 🇺🇸💻🟥 PC/Emulator / Glitchrun |
| PAL | Mobile Emulator | Normal | `PAL_mobile_emulator_normal` | 🇪🇺📱🟩 Mobile Emulator / Glitchfrei |
| PAL | Mobile Emulator | Glitch | `PAL_mobile_emulator_glitch` | 🇪🇺📱🟥 Mobile Emulator / Glitchrun |
| NTSC | Mobile Emulator | Normal | `NTSC_mobile_emulator_normal` | 🇺🇸📱🟩 Mobile Emulator / Glitchfrei |
| NTSC | Mobile Emulator | Glitch | `NTSC_mobile_emulator_glitch` | 🇺🇸📱🟥 Mobile Emulator / Glitchrun |

## 🎯 Kernfunktionen

### 1. Kategorie-Management

#### CategorySystem Klasse
```typescript
// Kategorie validieren
const validation = CategorySystem.validateCategory(category);
if (!validation.valid) {
  console.log('Fehler:', validation.errors);
}

// Kategorie-ID generieren
const categoryId = CategorySystem.generateCategoryId(category);

// Anzeigename generieren
const displayName = CategorySystem.getCategoryDisplayName(category);

// Icons generieren
const icons = CategorySystem.getCategoryIcons(category);
```

#### Unterstützte Operationen
- ✅ Kategorie-Validierung
- ✅ Eindeutige ID-Generierung
- ✅ Benutzerfreundliche Anzeigenamen
- ✅ Icon- und CSS-Klassen-Generierung
- ✅ Plattform-Erkennung (Original-Konsole vs. Emulator)
- ✅ Fairness-Level-Validierung

### 2. Event-Management

#### EventService Klasse
```typescript
// Event erstellen
const event = eventService.createEvent({
  name: 'Battle64 Championship',
  allowedCategories: [/* Kategorien */],
  startDate: new Date(),
  endDate: new Date(),
  maxParticipants: 100,
  glitchDetectionEnabled: true
});

// Teilnehmer registrieren
const participant = eventService.registerParticipant(
  eventId, userId, username, category
);

// Run einreichen
const submission = eventService.submitRun(
  eventId, userId, category, time, videoUrl, glitchDeclaration
);
```

#### Event-Features
- ✅ Kategorie-basierte Teilnehmerregistrierung
- ✅ Automatische Validierung
- ✅ Teilnehmerlimits
- ✅ Zeitbasierte Event-Aktivität
- ✅ Glitch-Erklärung für Emulator-Kategorien

### 3. Leaderboard-System

#### Automatische Kategorisierung
- Submissions werden automatisch nach Kategorien gruppiert
- Separate Ranglisten für jede Kategorie
- Globale und kategorie-spezifische Statistiken

#### Visualisierung
- Icon-basierte Kategorie-Erkennung
- Farbcodierung für Glitchruns
- Verifikations-Status-Anzeige
- Video-Links für Submissions

## 🎨 UI-Komponenten

### CategorySelector
```typescript
<CategorySelector
  value={selectedCategory}
  onChange={setCategory}
  allowedCategories={event.allowedCategories}
  showValidation={true}
/>
```

**Features:**
- Schrittweise Kategorie-Auswahl (Region → Plattform → Fairness)
- Automatische Validierung
- Visuelle Icons und Farben
- Hilfe-Text und Richtlinien

### Leaderboard
```typescript
<Leaderboard
  submissions={submissions}
  selectedCategory={category}
  onCategoryChange={setCategory}
  showAllCategories={true}
/>
```

**Features:**
- Kategorie-Filterung
- Ranglisten mit Medaillen-Platzierung
- Zeit-Formatierung
- Status-Indikatoren (Verifiziert, Glitchrun, Video)

### RunSubmissionForm
```typescript
const form = new RunSubmissionForm();
form.setFormData({
  category: selectedCategory,
  time: '02:30.45',
  videoUrl: 'https://youtube.com/watch?v=...',
  glitchDeclaration: false
});
```

**Features:**
- Zeit-Format-Validierung (MM:SS.mm)
- Video-URL-Validierung
- Glitch-Erklärung für Emulator-Kategorien
- Umfassende Fehlerbehandlung

## 📊 Datenmodelle

### CategoryConfig
```typescript
interface CategoryConfig {
  region: GameRegion;           // PAL | NTSC
  platform: Platform;           // ORIGINAL_CONSOLE | PC_EMULATOR | MOBILE_EMULATOR
  fairnessLevel?: FairnessLevel; // NORMAL | GLITCH (nur bei Emulatoren)
}
```

### RunSubmission
```typescript
interface RunSubmission {
  id: string;
  userId: string;
  eventId: string;
  category: CategoryConfig;
  time: number;                 // Millisekunden
  videoUrl?: string;
  glitchDeclaration: boolean;   // Nutzer-Selbsterklärung
  submissionDate: Date;
  verified: boolean;
  disqualified: boolean;
  disqualificationReason?: string;
}
```

### EventConfig
```typescript
interface EventConfig {
  id: string;
  name: string;
  description: string;
  allowedCategories: CategoryConfig[];
  startDate: Date;
  endDate: Date;
  maxParticipants?: number;
  glitchDetectionEnabled: boolean;
  adminOnly: boolean;
}
```

## 🔧 Installation & Setup

### 1. Abhängigkeiten installieren
```bash
npm install
```

### 2. TypeScript kompilieren
```bash
npm run build
```

### 3. Demo ausführen
```bash
npm run demo
```

### 4. Entwicklung
```bash
npm run dev
```

## 🚀 Verwendung

### Grundlegende Integration

```typescript
import { EventService } from './src/services/EventService';
import { CategorySystem, GameRegion, Platform, FairnessLevel } from './src/models/CategorySystem';

// Service initialisieren
const eventService = new EventService();

// Event erstellen
const event = eventService.createEvent({
  name: 'Mein Battle64 Event',
  allowedCategories: [
    { region: GameRegion.PAL, platform: Platform.ORIGINAL_CONSOLE },
    { region: GameRegion.NTSC, platform: Platform.PC_EMULATOR, fairnessLevel: FairnessLevel.NORMAL }
  ],
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Tage
  glitchDetectionEnabled: true
});

// Teilnehmer registrieren
const participant = eventService.registerParticipant(
  event.id,
  'user123',
  'SpeedRunner',
  { region: GameRegion.PAL, platform: Platform.ORIGINAL_CONSOLE }
);

// Run einreichen
const submission = eventService.submitRun(
  event.id,
  'user123',
  participant.category,
  125000, // 2:05.00
  'https://youtube.com/watch?v=...',
  false // Keine Glitches
);

// Leaderboard generieren
const leaderboard = eventService.generateLeaderboard(event.id);
```

### React-Integration

```typescript
import React, { useState } from 'react';
import { CategorySelector } from './src/components/CategorySelector';
import { Leaderboard } from './src/components/Leaderboard';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryConfig | undefined>();
  const [submissions, setSubmissions] = useState<RunSubmission[]>([]);

  return (
    <div>
      <CategorySelector
        value={selectedCategory}
        onChange={setSelectedCategory}
        allowedCategories={event.allowedCategories}
      />
      
      <Leaderboard
        submissions={submissions}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    </div>
  );
}
```

## 📋 Fairness-Regeln

### Erlaubte Glitches
- ✅ Sequence Breaks
- ✅ Wall-Clips
- ✅ Speed-Glitches
- ✅ Item-Skips

### Verbotene Exploits
- ❌ Softlocks
- ❌ Spiel-Abstürze
- ❌ Unendliche Leben/Energie
- ❌ Level-Überspringen ohne legitime Methoden

### Verifikation
- 📹 Video-Beweis empfohlen
- 🔍 Admin-Überprüfung erforderlich
- ⏳ Automatische KI-Erkennung (geplant)
- ✅ Verifikations-Status in Leaderboard

## 🔮 Zukünftige Erweiterungen

### KI-basierte Glitch-Erkennung
- Automatische Analyse von Video-Submissions
- Erkennung bekannter Glitches und Exploits
- Reduzierung der manuellen Verifikationsarbeit

### Erweiterte Kategorien
- Platform-spezifische Subkategorien
- Hardware-spezifische Kategorien (Controller-Typ)
- Community-voted Kategorien

### Admin-Tools
- Event-Management Dashboard
- Submission-Verifikation Interface
- Benutzer-Management
- Statistiken und Analytics

### Mobile App
- Native Mobile-Anwendung
- Offline-Funktionalität
- Push-Benachrichtigungen
- Social Features

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Implementiere deine Änderungen
4. Füge Tests hinzu
5. Erstelle einen Pull Request

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

## 🆘 Support

Bei Fragen oder Problemen:
- Erstelle ein Issue auf GitHub
- Kontaktiere das N64-Nexus Team
- Konsultiere die Dokumentation

---

**Entwickelt mit ❤️ für die Battle64 Speedrun-Community**