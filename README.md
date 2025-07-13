# Battle64 - Admin Panel & Steuerzentrale

🛠️ **Komponente: Battle64 – Admin-Panel & Steuerzentrale**

Das Admin-Panel ist das zentrale Backend-Dashboard für die Verwaltung von Nutzern, Events, Medaillen, Moderation und App-Einstellungen. Nur für Administratoren sichtbar und zugänglich.

## 🎯 Features

### 🔐 A. ZUGANG & RECHTE
- **Admin-Accounts** mit 2FA-Unterstützung
- **Rollenbasierte Rechteverwaltung**:
  - Superadmin (alle Funktionen)
  - Event-Manager (nur Eventsteuerung)
  - Moderator (Kommentar- und Galerie-Kontrolle)

### 👥 B. NUTZERKONTROLLE
- **Nutzerliste** mit Suchfunktion
- **Status-Management**: Aktiv / Gesperrt / Verifiziert
- **Nutzerprofil-Übersicht** (Punkte, Medaillen, Letzte Aktivität)
- **Aktionen**: Sperren / Entsperren / Punkte zurücksetzen / Titel zuweisen
- **DSGVO-Funktionen**: Accountdaten exportieren oder löschen

### 📅 C. EVENTVERWALTUNG
- **Event erstellen, starten, stoppen**
- **Parameter**: Spiel, Kategorie, Plattform, Zeitraum
- **Screenshotpflicht** aktivieren/deaktivieren
- **Regeln eingeben & ändern**
- **Countdown & Liveschaltung**
- **Archivierung**: Event abschließen & ins Archiv verschieben

### 🏅 D. PUNKTESYSTEM & RÄNGE
- **Manuelle Punktevergabe** (z.B. bei Spezial-Events)
- **Medaillen zuweisen oder entfernen**
- **Neue Titel definieren** (z.B. "Goldener Collector")
- **XP-Kurven einstellen** (Levelsystem)

### 🖼️ E. CONTENT-MODERATION
- **Gemeldete Inhalte anzeigen** (Fanart, Kommentare, Screenshots)
- **Kommentar löschen oder genehmigen**
- **User benachrichtigen bei Verstoß**
- **Meldestatistik** (z.B. Top 5 Melder, meistgemeldete User)

### 📊 F. ANALYTIK & INSIGHT
- **Dashboard**: Aktive Nutzer heute / Woche / Monat
- **Beliebteste Spiele**
- **Meistgenutzte Events**
- **Upload-Zahlen** (Fanart / Screenshots / Merch)
- **User-Monitor**: Wer hat wie viele Punkte erhalten?
- **Aktivste Teams**
- **Neue Nutzer** (mit Aktivitätslevel)

### ⚙️ G. SYSTEMVERWALTUNG
- **Einstellungen** für App-Farben / Animationen / Sounds
- **Feature-Toggles** (z.B. Livestreaming an/aus)
- **Wartungsmodus** aktivieren
- **Versionsverwaltung** (z.B. "Battle64 v1.3.2")
- **DSGVO-Funktionen** global kontrollieren

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js (Version 18 oder höher)
- npm oder yarn

### Installation
```bash
# Repository klonen
git clone <repository-url>
cd battle64-admin-panel

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Build für Produktion
npm run build
```

### Demo-Zugang
- **Benutzer**: `admin`
- **Passwort**: `battle64`

## 🎨 Design

- **Retro-Gaming Theme** mit Dunkelgrau und kontrastierenden Pixel-Farben
- **Responsive Design** für Desktop & Tablet
- **Pixel-Art Icons** für jede Rubrik
- **Custom Scrollbars** im Retro-Stil
- **Animations** und Glow-Effekte

### Farbpalette
- **Retro-Dark**: `#1a1a1a` (Hintergrund)
- **Retro-Green**: `#00ff41` (Primärfarbe)
- **Retro-Blue**: `#0080ff` (Sekundärfarbe)
- **Retro-Red**: `#ff0040` (Warnungen)
- **Retro-Yellow**: `#ffff00` (Highlights)

## 📁 Projektstruktur

```
src/
├── components/
│   ├── AdminLayout.tsx      # Haupt-Layout mit Sidebar
│   ├── Login.tsx           # Login-Komponente mit 2FA
│   ├── Dashboard.tsx       # Haupt-Dashboard
│   ├── UserManagement.tsx  # Nutzerverwaltung
│   ├── EventManagement.tsx # Event-Verwaltung
│   ├── PointsSystem.tsx    # Punkte- und Medaillensystem
│   ├── ContentModeration.tsx # Content-Moderation
│   ├── Analytics.tsx       # Analytics & Insights
│   └── SystemSettings.tsx  # Systemeinstellungen
├── contexts/
│   └── AuthContext.tsx     # Authentifizierung & Berechtigungen
├── main.tsx               # App-Einstiegspunkt
├── App.tsx               # Haupt-App-Komponente
├── index.css             # Globale Styles
└── vite-env.d.ts         # Vite TypeScript-Definitionen
```

## 🔧 Technologie-Stack

- **React 18** mit TypeScript
- **Vite** als Build-Tool
- **React Router** für Navigation
- **Tailwind CSS** für Styling
- **Lucide React** für Icons
- **Recharts** für Diagramme (optional)

## 🛡️ Sicherheit

- **2FA-Unterstützung** für Admin-Login
- **Rollenbasierte Zugriffskontrolle** (RBAC)
- **Session-Management** mit localStorage
- **DSGVO-konforme** Datenverwaltung
- **Sichere API-Endpunkte** (Mock-Implementierung)

## 📱 Responsive Design

Das Admin-Panel ist vollständig responsive und optimiert für:
- **Desktop** (1920x1080 und höher)
- **Tablet** (768px - 1024px)
- **Mobile** (320px - 767px)

## 🎮 Gaming-Features

### Unterstützte Spiele
- Mario Kart 64
- GoldenEye 007
- Super Mario 64
- Zelda: Ocarina of Time
- Und weitere N64-Klassiker

### Event-Typen
- **Turniere** mit automatischen Brackets
- **Speedrun-Events** mit Zeitmessung
- **Community-Events** mit Fanart-Wettbewerben
- **Spezial-Events** mit Bonus-Punkten

## 🔄 Entwicklung

### Scripts
```bash
npm run dev          # Entwicklungsserver starten
npm run build        # Produktions-Build erstellen
npm run preview      # Build-Vorschau
npm run lint         # ESLint ausführen
npm run lint:fix     # ESLint-Fehler automatisch beheben
```

### Code-Style
- **TypeScript** für Type Safety
- **ESLint** für Code-Qualität
- **Prettier** für konsistente Formatierung
- **Tailwind CSS** für Utility-First Styling

## 🚀 Deployment

### Produktions-Build
```bash
npm run build
```

Der Build wird im `dist/` Verzeichnis erstellt und kann auf jedem statischen Web-Server deployed werden.

### Empfohlene Hosting-Optionen
- **Vercel** (einfach, kostenlos)
- **Netlify** (einfach, kostenlos)
- **GitHub Pages** (kostenlos)
- **AWS S3 + CloudFront** (skalierbar)

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 🎯 Roadmap

### Version 1.4 (Geplant)
- [ ] Live-Chat-System für Admins
- [ ] Erweiterte Analytics mit Charts
- [ ] Bulk-Operations für Nutzer
- [ ] API-Integration mit Backend

### Version 1.5 (Geplant)
- [ ] Mobile App für Admins
- [ ] Push-Benachrichtigungen
- [ ] Erweiterte DSGVO-Funktionen
- [ ] Multi-Language Support

## 📞 Support

Bei Fragen oder Problemen:
- Erstelle ein Issue im GitHub Repository
- Kontaktiere das Battle64-Team
- Dokumentation: [Wiki](link-to-wiki)

---

**Battle64 Admin Panel** - Die ultimative Steuerzentrale für Retro-Gaming-Communities! 🎮✨