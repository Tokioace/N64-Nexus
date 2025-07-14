import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Check, AlertTriangle, Info, Volume2, VolumeX } from 'lucide-react';
import { useCartbitStore } from '../../store/cartbitStore';
import { CartbitMode } from '../../types/cartbit';

interface CartbitSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartbitSettings: React.FC<CartbitSettingsProps> = ({ isOpen, onClose }) => {
  const { settings, setMode, updateSettings, resetToStandard, xpEarned } = useCartbitStore();
  const [selectedMode, setSelectedMode] = useState<CartbitMode>(settings.mode);

  const handleModeChange = (mode: CartbitMode) => {
    setSelectedMode(mode);
    setMode(mode);
  };

  const handleReset = () => {
    resetToStandard();
    setSelectedMode('standard');
  };

  const modeOptions = [
    {
      id: 'standard' as CartbitMode,
      title: 'Standard-Modus',
      description: 'Vollständige Cartbit-Hilfe mit Animationen und Sounds',
      icon: '🎮',
      color: 'border-green-500 bg-green-50',
    },
    {
      id: 'profi' as CartbitMode,
      title: 'Profi-Modus',
      description: 'Reduzierte Hilfe für erfahrene Spieler',
      icon: '👓',
      color: 'border-gray-500 bg-gray-50',
    },
    {
      id: 'text-only' as CartbitMode,
      title: 'Nur Text-Hilfe',
      description: 'Textbasierte Hilfe ohne Animationen',
      icon: '📝',
      color: 'border-blue-500 bg-blue-50',
    },
    {
      id: 'error-only' as CartbitMode,
      title: 'Nur bei Fehlern',
      description: 'Cartbit erscheint nur bei Problemen',
      icon: '⚠️',
      color: 'border-orange-500 bg-orange-50',
    },
    {
      id: 'disabled' as CartbitMode,
      title: 'Deaktiviert',
      description: 'Cartbit komplett ausschalten',
      icon: '🚫',
      color: 'border-red-500 bg-red-50',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-800">Cartbit-Einstellungen</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Mode Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Hilfe-Modus wählen</h3>
                <div className="space-y-3">
                  {modeOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleModeChange(option.id)}
                      className={`
                        w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
                        ${selectedMode === option.id ? option.color : 'border-gray-200 hover:border-gray-300'}
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{option.title}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                        {selectedMode === option.id && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* XP Display for Profi Mode */}
              {selectedMode === 'profi' && (
                <motion.div
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-yellow-600">🏆</span>
                    <span className="font-semibold text-yellow-800">Profi-XP: {xpEarned}</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Du erhältst XP dafür, dass du Hilfe nicht nutzt bei schwierigen Aufgaben!
                  </p>
                </motion.div>
              )}

              {/* Additional Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Weitere Einstellungen</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showTooltips}
                      onChange={(e) => updateSettings({ showTooltips: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Tooltips anzeigen</span>
                  </label>
                  
                  {selectedMode !== 'disabled' && (
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showAnimations}
                        onChange={(e) => updateSettings({ showAnimations: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Animationen aktivieren</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Reset Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleReset}
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                >
                  Zurücksetzen auf Standard
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};