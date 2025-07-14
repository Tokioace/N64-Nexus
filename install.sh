#!/bin/bash

echo "🎮 Battle64 - Cartbit Profi-Modus Installation"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert. Bitte installiere Node.js zuerst."
    echo "   Besuche: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm ist nicht installiert. Bitte installiere npm zuerst."
    exit 1
fi

echo "✅ Node.js und npm sind installiert"

# Install dependencies
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
    echo "🔧 Erstelle .env Datei..."
    cat > .env << EOF
# Battle64 Cartbit Environment Variables
VITE_APP_TITLE=Battle64 - Cartbit Profi-Modus
VITE_APP_VERSION=1.0.0
EOF
    echo "✅ .env Datei erstellt"
fi

echo ""
echo "🎉 Installation abgeschlossen!"
echo ""
echo "🚀 Starte die Entwicklungsumgebung:"
echo "   npm run dev"
echo ""
echo "📖 Öffne http://localhost:3000 in deinem Browser"
echo ""
echo "📚 Weitere Informationen findest du in der README.md"
echo ""
echo "🎮 Viel Spaß beim Testen des Cartbit Profi-Modus!"