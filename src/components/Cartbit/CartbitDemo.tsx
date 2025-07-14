import React, { useState } from 'react';
import { useCartbit, CartbitTooltip, useProfiChallenge } from './index';

export const CartbitDemo: React.FC = () => {
  const { addMessage, state } = useCartbit();
  const { triggerChallenge } = useProfiChallenge();
  const [demoState, setDemoState] = useState({
    level: 1,
    score: 0,
    health: 100,
    hasWeapon: false,
  });

  const handleAction = (action: string) => {
    switch (action) {
      case 'move':
        setDemoState(prev => ({ ...prev, score: prev.score + 10 }));
        addMessage({
          type: 'info',
          message: 'Du hast dich bewegt!',
          context: 'Score +10',
        });
        break;
      
      case 'collect':
        setDemoState(prev => ({ ...prev, hasWeapon: true }));
        addMessage({
          type: 'success',
          message: 'Waffe gesammelt!',
          context: 'Du kannst jetzt angreifen.',
        });
        break;
      
      case 'attack':
        if (demoState.hasWeapon) {
          setDemoState(prev => ({ ...prev, score: prev.score + 50 }));
          triggerChallenge('Gegner besiegt', 5);
        } else {
          addMessage({
            type: 'error',
            message: 'Du brauchst eine Waffe zum Angreifen!',
            context: 'Sammle zuerst eine Waffe.',
          });
        }
        break;
      
      case 'heal':
        setDemoState(prev => ({ ...prev, health: Math.min(100, prev.health + 25) }));
        addMessage({
          type: 'success',
          message: 'Gesundheit wiederhergestellt!',
          context: 'Health +25',
        });
        break;
      
      case 'levelup':
        setDemoState(prev => ({ ...prev, level: prev.level + 1 }));
        triggerChallenge('Level aufgestiegen', 10);
        addMessage({
          type: 'success',
          message: `Level ${demoState.level + 1} erreicht!`,
          context: 'Neue Herausforderungen warten!',
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🎮 Battle64 Demo</h1>
          <p className="text-gray-300">Cartbit Profi-Modus Demonstration</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{demoState.level}</div>
            <div className="text-sm text-gray-300">Level</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{demoState.score}</div>
            <div className="text-sm text-gray-300">Score</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{demoState.health}</div>
            <div className="text-sm text-gray-300">Health</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{state.xpEarned}</div>
            <div className="text-sm text-gray-300">Profi-XP</div>
          </div>
        </div>

        {/* Game Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <CartbitTooltip
            message="Bewege dich im Spiel"
            context="Erhöht deinen Score um 10 Punkte"
          >
            <button
              onClick={() => handleAction('move')}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg p-4 font-medium transition-colors"
            >
              🚶‍♂️ Bewegen
            </button>
          </CartbitTooltip>

          <CartbitTooltip
            message="Sammle eine Waffe"
            context="Benötigt für Angriffe"
          >
            <button
              onClick={() => handleAction('collect')}
              className="bg-green-600 hover:bg-green-700 rounded-lg p-4 font-medium transition-colors"
            >
              ⚔️ Waffe sammeln
            </button>
          </CartbitTooltip>

          <CartbitTooltip
            message="Greife einen Gegner an"
            context="Du brauchst eine Waffe dafür"
          >
            <button
              onClick={() => handleAction('attack')}
              className="bg-red-600 hover:bg-red-700 rounded-lg p-4 font-medium transition-colors"
            >
              ⚔️ Angreifen
            </button>
          </CartbitTooltip>

          <CartbitTooltip
            message="Stelle deine Gesundheit wieder her"
            context="Heilt dich um 25 Punkte"
          >
            <button
              onClick={() => handleAction('heal')}
              className="bg-purple-600 hover:bg-purple-700 rounded-lg p-4 font-medium transition-colors"
            >
              💊 Heilen
            </button>
          </CartbitTooltip>

          <CartbitTooltip
            message="Steige ein Level auf"
            context="Erhöht die Schwierigkeit"
          >
            <button
              onClick={() => handleAction('levelup')}
              className="bg-yellow-600 hover:bg-yellow-700 rounded-lg p-4 font-medium transition-colors"
            >
              ⬆️ Level Up
            </button>
          </CartbitTooltip>

          <CartbitTooltip
            message="Simuliere einen Fehler"
            context="Zeigt Cartbit im Error-Only Modus"
          >
            <button
              onClick={() => addMessage({
                type: 'error',
                message: 'Ein unerwarteter Fehler ist aufgetreten!',
                context: 'Bitte versuche es erneut.',
              })}
              className="bg-gray-600 hover:bg-gray-700 rounded-lg p-4 font-medium transition-colors"
            >
              🐛 Fehler simulieren
            </button>
          </CartbitTooltip>
        </div>

        {/* Mode Information */}
        <div className="bg-white/10 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Aktueller Modus: {state.settings.mode}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Modus-Eigenschaften:</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Sichtbar: {state.settings.isVisible ? 'Ja' : 'Nein'}</li>
                <li>• Animationen: {state.settings.showAnimations ? 'An' : 'Aus'}</li>
                <li>• Auto-Start: {state.settings.autoStart ? 'An' : 'Aus'}</li>
                <li>• Tooltips: {state.settings.showTooltips ? 'An' : 'Aus'}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Profi-Modus Features:</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• XP-System für selbstständiges Spielen</li>
                <li>• Reduzierte Ablenkungen</li>
                <li>• Automatisches Ausblenden von Nachrichten</li>
                <li>• Challenge-System</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white/5 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Anleitung:</h3>
          <div className="text-sm text-gray-300 space-y-2">
            <p>1. <strong>Modus wechseln:</strong> Klicke auf das ⚙️-Symbol unten links</p>
            <p>2. <strong>Profi-Modus testen:</strong> Wähle "Profi-Modus" in den Einstellungen</p>
            <p>3. <strong>XP sammeln:</strong> Führe Aktionen aus, um Profi-XP zu erhalten</p>
            <p>4. <strong>Tooltips:</strong> Hover über Buttons für Hilfe (außer im deaktivierten Modus)</p>
            <p>5. <strong>Nachrichten:</strong> Verschiedene Modus zeigen unterschiedliche Nachrichten</p>
          </div>
        </div>
      </div>
    </div>
  );
};