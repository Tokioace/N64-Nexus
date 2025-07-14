#!/bin/bash

echo "🎮 Battle64 - Favoriten-System Installation"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert. Bitte installiere Node.js 18+ von https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js Version 18+ ist erforderlich. Aktuelle Version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) gefunden"

# Install dependencies
echo ""
echo "📦 Installiere Abhängigkeiten..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Abhängigkeiten erfolgreich installiert"
else
    echo "❌ Fehler beim Installieren der Abhängigkeiten"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "🔧 Erstelle .env Datei..."
    cat > .env << EOF
# Battle64 Environment Variables
VITE_APP_NAME=Battle64
VITE_APP_VERSION=1.0.0
EOF
    echo "✅ .env Datei erstellt"
fi

echo ""
echo "🎉 Installation abgeschlossen!"
echo ""
echo "🚀 Starte die Entwicklungsumgebung mit:"
echo "   npm run dev"
echo ""
echo "📚 Verfügbare Befehle:"
echo "   npm run dev      - Startet Entwicklungsserver"
echo "   npm run build    - Erstellt Produktions-Build"
echo "   npm run preview  - Zeigt Produktions-Build an"
echo "   npm run lint     - Führt Linting durch"
echo ""
echo "🌟 Battle64 Favoriten-System Features:"
echo "   • Verschiedene Inhaltstypen (Spiele, Strecken, Fanarts, Events, etc.)"
echo "   • Organisierte Listen und Kategorien"
echo "   • Retro Gaming UI Design"
echo "   • Benachrichtigungen und soziale Features"
echo "   • Vollständig responsive Design"
echo ""
echo "Viel Spaß beim Sammeln deiner Retro-Gaming-Favoriten! 🎮"