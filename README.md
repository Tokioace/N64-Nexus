# Battle64 - Admin Post & Moderationstool

Ein umfassendes Admin-Tool für die Battle64 Community-Plattform, das Administratoren und Moderatoren bei der Kommunikation mit der Community, der Steuerung von Events und der Regelung von Inhalten unterstützt.

## 🎯 Features

### 📣 Admin-Post-Funktionen

- **Post-Arten**: Eventankündigungen, Feature-News, Regelupdates, Gewinnerposts, Geburtstags- oder Saison-Posts
- **Erweiterte Optionen**:
  - Bild-Upload mit Vorschau
  - Markdown-Unterstützung für Rich-Text
  - Zeitgesteuerte Veröffentlichung
  - Verlinkung zu Events, Fanart, Quiz, Sammlungen
  - Kategorie-Tags (Event, Systeminfo, Wartung, Ankündigung)
  - Mehrsprachige Unterstützung (DE/EN) mit Übersetzungsfeldern
- **Sichtbarkeit**: Öffentlicher Feed, Push-Benachrichtigungen, regionale/gruppenspezifische Posts
- **Bearbeitungsoptionen**: Entwurf speichern, Vorschau anzeigen, Posts fixieren

### 🛡️ Moderationstool

- **Inhaltsmoderation**: Fanart, Kommentare, Posts, Events markieren und moderieren
- **Begründungskatalog**: Dropdown mit vordefinierten Moderationsgründen
- **Benutzerkommunikation**: Nachrichten bei Löschung/Sperrung
- **Meldesystem**: Admin-Dashboard für Benutzer-Meldungen
- **Benutzerverwaltung**: Blockieren, Verwarnen von Nutzern
- **Historie**: Alle Aktionen zur Revisionssicherheit
- **Automatisierte Flags**: NSFW-Erkennung, Spam-Detection, Bot-Aktivitätserkennung

### 🎨 Design & Zugang

- **Adminbereich**: Separater Login mit Rollen-basierter Authentifizierung
- **Strukturierte Oberfläche**: Dashboard mit Posts, Meldungen, Nutzer, Tools
- **Visualisierung**: Adminposts mit gelbem "👑 Admin"-Badge
- **Benutzerrechte**: Admin (Volle Kontrolle), Moderator (Inhaltspflege), Editor (Beiträge erstellen)

## 🚀 Installation

### Voraussetzungen

- Node.js 18+ 
- npm oder yarn

### Setup

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd battle64-admin-tool
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

4. **Browser öffnen**
   ```
   http://localhost:3000
   ```

### Demo-Zugang

- **E-Mail**: admin@battle64.com
- **Passwort**: admin123

## 📁 Projektstruktur

```
battle64-admin-tool/
├── app/                    # Next.js App Router
│   ├── globals.css        # Globale Styles
│   ├── layout.tsx         # Root Layout
│   └── page.tsx           # Hauptseite
├── components/            # React Komponenten
│   ├── tabs/             # Tab-Komponenten
│   │   ├── PostsTab.tsx
│   │   ├── ModerationTab.tsx
│   │   ├── UsersTab.tsx
│   │   ├── ReportsTab.tsx
│   │   └── SettingsTab.tsx
│   ├── AdminDashboard.tsx
│   ├── LoginForm.tsx
│   ├── PostForm.tsx
│   ├── PostPreview.tsx
│   └── Sidebar.tsx
├── store/                 # State Management
│   └── adminStore.ts
├── types/                 # TypeScript Typen
│   └── admin.ts
├── package.json
├── tailwind.config.js
└── README.md
```

## 🛠️ Technologie-Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📋 Verwendung

### Admin Posts erstellen

1. **Anmelden** mit Admin-Zugangsdaten
2. **"Posts" Tab** auswählen
3. **"Neuer Post"** klicken
4. **Formular ausfüllen**:
   - Titel und Inhalt eingeben
   - Typ und Kategorie wählen
   - Sprache auswählen
   - Übersetzungen hinzufügen (optional)
   - Bild hochladen (optional)
   - Veröffentlichungszeit planen (optional)
   - Optionen setzen (Fixieren, Push-Benachrichtigung)
5. **Vorschau** anzeigen
6. **Speichern** oder **Veröffentlichen**

### Moderation durchführen

1. **"Moderation" Tab** auswählen
2. **Gemeldete Inhalte** durchsuchen
3. **Inhalt auswählen** und "Moderieren" klicken
4. **Aktion wählen**:
   - Genehmigen
   - Löschen
   - Verwarnen
   - Blockieren
5. **Begründung** auswählen
6. **Aktion bestätigen**

### Benutzer verwalten

1. **"Benutzer" Tab** auswählen
2. **Benutzer suchen** oder filtern
3. **Benutzerdetails** anzeigen
4. **Aktionen durchführen** (Verwarnen, Blockieren)

## 🔧 Konfiguration

### Umgebungsvariablen

Erstelle eine `.env.local` Datei:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Battle64 Admin Tool
```

### Tailwind CSS Anpassungen

Die Farben und Styling können in `tailwind.config.js` angepasst werden:

```javascript
theme: {
  extend: {
    colors: {
      battle64: {
        50: '#f0f9ff',
        // ... weitere Farben
      },
      admin: {
        primary: '#f59e0b',
        // ... weitere Admin-Farben
      }
    }
  }
}
```

## 🚀 Deployment

### Vercel (Empfohlen)

1. **Projekt auf GitHub** pushen
2. **Vercel Account** erstellen
3. **Projekt importieren**
4. **Umgebungsvariablen** setzen
5. **Deploy**

### Andere Plattformen

```bash
# Build erstellen
npm run build

# Production Server starten
npm start
```

## 🔒 Sicherheit

- **Authentifizierung**: Rollen-basierte Zugangskontrolle
- **Berechtigungen**: Admin, Moderator, Editor Rollen
- **Audit Trail**: Alle Moderationsaktionen werden protokolliert
- **Input Validation**: Alle Eingaben werden validiert
- **XSS Protection**: React's eingebaute XSS-Schutz

## 📊 Monitoring & Analytics

- **Dashboard-Statistiken**: Posts, Meldungen, Benutzer
- **Moderations-Historie**: Vollständige Aufzeichnung aller Aktionen
- **Performance-Monitoring**: Ladezeiten und Fehler
- **Benutzer-Aktivität**: Login-Historie und Aktionen

## 🤝 Beitragen

1. **Fork** das Repository
2. **Feature Branch** erstellen (`git checkout -b feature/AmazingFeature`)
3. **Änderungen committen** (`git commit -m 'Add some AmazingFeature'`)
4. **Branch pushen** (`git push origin feature/AmazingFeature`)
5. **Pull Request** erstellen

## 📝 Changelog

### v1.0.0 (2024-01-20)
- ✨ Initiale Version
- 🎯 Admin Post System
- 🛡️ Moderationstool
- 👥 Benutzerverwaltung
- ⚙️ Einstellungen

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 📞 Support

Bei Fragen oder Problemen:

- **Issues**: GitHub Issues verwenden
- **Email**: admin@battle64.com
- **Dokumentation**: Siehe Wiki

---

**Battle64 Admin Tool** - Das Rückgrat für professionelle Community-Verwaltung 🎮