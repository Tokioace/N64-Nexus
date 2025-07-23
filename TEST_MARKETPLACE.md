# 🧪 N64 Marketplace Test Guide

## ✅ Was bereits funktioniert:

1. **TypeScript Compilation**: ✅ Erfolgreich (keine Fehler mehr)
2. **Development Server**: ✅ Läuft auf http://localhost:5173
3. **Basis-Routing**: ✅ Seiten sind erreichbar
4. **Navigation**: ✅ Links in der Sidebar vorhanden

## 🔍 Test-Schritte zum Debuggen:

### 1. Basis-Funktionalität testen

**Schritt 1:** Öffne die Anwendung im Browser
```
http://localhost:5173
```

**Schritt 2:** Navigiere zum Marketplace
```
http://localhost:5173/marketplace
```

**Erwartetes Ergebnis:** 
- Marketplace-Seite lädt
- N64-Spiel-Anzeigen werden angezeigt
- Filter und Suchfunktionen sind sichtbar

### 2. Chat-Funktionalität testen

**Schritt 1:** Navigiere zum Chat
```
http://localhost:5173/chat
```

**Erwartetes Ergebnis:**
- Chat-Seite lädt
- Unterhaltungsliste wird angezeigt
- Leere Zustände sind sichtbar

### 3. Mögliche Probleme identifizieren:

#### Problem A: Seiten laden nicht
**Symptome:**
- Weiße Seite oder Fehler
- React-Fehler in der Konsole
- "Cannot read property" Fehler

**Lösung:** Context-Provider prüfen

#### Problem B: Daten werden nicht angezeigt
**Symptome:**
- Seite lädt, aber keine Inhalte
- "Keine Angebote gefunden" wird angezeigt
- Leere Listen

**Lösung:** Mock-Daten und State prüfen

#### Problem C: Navigation funktioniert nicht
**Symptome:**
- Links führen zu 404
- Sidebar-Links sind inaktiv
- Routing-Fehler

**Lösung:** Route-Konfiguration prüfen

#### Problem D: Übersetzungen fehlen
**Symptome:**
- Fehlende Texte oder Platzhalter
- "undefined" in der UI
- Sprachfehler

**Lösung:** Übersetzungsschlüssel prüfen

## 🛠️ Debugging-Kommandos:

### Browser-Konsole prüfen:
```javascript
// Öffne Browser-Entwicklertools (F12)
// Schaue nach Fehlern in der Konsole
console.log('React DevTools verfügbar?', window.__REACT_DEVTOOLS_GLOBAL_HOOK__)
```

### React DevTools verwenden:
1. Installiere React DevTools Browser-Extension
2. Schaue nach Context-Providern
3. Prüfe Component-State

### Netzwerk-Tab prüfen:
1. Schaue nach fehlgeschlagenen Requests
2. Prüfe ob alle Assets geladen werden
3. Schaue nach JavaScript-Fehlern

## 🔧 Häufige Fixes:

### Fix 1: Context-Provider-Reihenfolge
Stelle sicher, dass die Provider in der richtigen Reihenfolge sind:
```tsx
<LanguageProvider>
  <UserProvider>
    <MarketplaceProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </MarketplaceProvider>
  </UserProvider>
</LanguageProvider>
```

### Fix 2: Hook-Aufrufe
Stelle sicher, dass Hooks nur in Komponenten aufgerufen werden:
```tsx
// ✅ Korrekt
const MyComponent = () => {
  const { listings } = useMarketplace()
  return <div>...</div>
}

// ❌ Falsch
const { listings } = useMarketplace() // Außerhalb einer Komponente
```

### Fix 3: Übersetzungsschlüssel
Prüfe ob alle verwendeten Übersetzungsschlüssel existieren:
```tsx
// Prüfe in LanguageContext.tsx ob der Schlüssel existiert
'marketplace.title': 'N64 Marktplatz'
```

## 📝 Test-Protokoll:

Fülle aus, was funktioniert und was nicht:

- [ ] Marketplace-Seite lädt
- [ ] Spiel-Anzeigen werden angezeigt  
- [ ] Suchfunktion funktioniert
- [ ] Filter funktionieren
- [ ] Chat-Seite lädt
- [ ] Unterhaltungen werden angezeigt
- [ ] Navigation zwischen Seiten funktioniert
- [ ] Sprachenwechsel funktioniert
- [ ] Mobile Ansicht funktioniert

## 🚨 Notfall-Reset:

Falls nichts funktioniert:

1. **Server neu starten:**
```bash
# Terminal 1: Server stoppen (Ctrl+C)
# Terminal 1: Server neu starten
npm run dev
```

2. **Browser-Cache leeren:**
```bash
# Oder im Browser: Ctrl+Shift+R (Hard Refresh)
```

3. **Node Modules neu installieren:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

**Bitte teile mit, welche spezifischen Probleme du siehst, damit ich gezielt helfen kann!**