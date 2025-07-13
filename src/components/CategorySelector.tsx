/**
 * Category Selector Component für Battle64 Speedrun Events
 * 
 * Ermöglicht die Auswahl von Region, Plattform und Fairness-Level
 */

import React, { useState, useEffect } from 'react';
import { 
  CategoryConfig, 
  GameRegion, 
  Platform, 
  FairnessLevel, 
  CategorySystem 
} from '../models/CategorySystem';

interface CategorySelectorProps {
  value?: CategoryConfig;
  onChange: (category: CategoryConfig) => void;
  disabled?: boolean;
  showValidation?: boolean;
  allowedCategories?: CategoryConfig[];
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  disabled = false,
  showValidation = false,
  allowedCategories
}) => {
  const [selectedRegion, setSelectedRegion] = useState<GameRegion | ''>('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | ''>('');
  const [selectedFairness, setSelectedFairness] = useState<FairnessLevel | ''>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Initialisiere mit vorhandenem Wert
  useEffect(() => {
    if (value) {
      setSelectedRegion(value.region);
      setSelectedPlatform(value.platform);
      setSelectedFairness(value.fairnessLevel || '');
    }
  }, [value]);

  // Validiere und aktualisiere Kategorie
  useEffect(() => {
    if (selectedRegion && selectedPlatform) {
      const category: CategoryConfig = {
        region: selectedRegion as GameRegion,
        platform: selectedPlatform as Platform,
        fairnessLevel: selectedFairness ? (selectedFairness as FairnessLevel) : undefined
      };

      // Validiere Kategorie
      const validation = CategorySystem.validateCategory(category);
      setValidationErrors(validation.errors);

      // Prüfe ob Kategorie erlaubt ist
      if (allowedCategories && allowedCategories.length > 0) {
        const isAllowed = allowedCategories.some(allowed => 
          CategorySystem.generateCategoryId(allowed) === CategorySystem.generateCategoryId(category)
        );
        if (!isAllowed) {
          setValidationErrors(prev => [...prev, 'Diese Kategorie ist für dieses Event nicht erlaubt']);
        }
      }

      // Nur aktualisieren wenn keine Fehler
      if (validation.valid) {
        onChange(category);
      }
    }
  }, [selectedRegion, selectedPlatform, selectedFairness, allowedCategories, onChange]);

  const handleRegionChange = (region: GameRegion) => {
    setSelectedRegion(region);
  };

  const handlePlatformChange = (platform: Platform) => {
    setSelectedPlatform(platform);
    // Reset Fairness-Level wenn Original-Konsole gewählt wird
    if (platform === Platform.ORIGINAL_CONSOLE) {
      setSelectedFairness('');
    }
  };

  const handleFairnessChange = (fairness: FairnessLevel) => {
    setSelectedFairness(fairness);
  };

  const getAvailableFairnessLevels = (): FairnessLevel[] => {
    if (selectedPlatform === Platform.ORIGINAL_CONSOLE) {
      return [];
    }
    return Object.values(FairnessLevel);
  };

  const isCategoryAllowed = (category: CategoryConfig): boolean => {
    if (!allowedCategories || allowedCategories.length === 0) {
      return true;
    }
    return allowedCategories.some(allowed => 
      CategorySystem.generateCategoryId(allowed) === CategorySystem.generateCategoryId(category)
    );
  };

  return (
    <div className="category-selector">
      <h3 className="text-lg font-semibold mb-4">🏆 Kategorie auswählen</h3>
      
      {/* Region Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">1️⃣ Region</label>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(GameRegion).map(region => (
            <button
              key={region}
              type="button"
              onClick={() => handleRegionChange(region)}
              disabled={disabled}
              className={`
                p-3 border-2 rounded-lg text-center transition-all
                ${selectedRegion === region 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 hover:border-gray-400'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="text-2xl mb-1">
                {region === GameRegion.PAL ? '🇪🇺' : '🇺🇸'}
              </div>
              <div className="font-medium">{region}</div>
              <div className="text-xs text-gray-600">
                {region === GameRegion.PAL ? 'Europäische Version' : 'Nordamerikanische Version'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Platform Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">2️⃣ Plattform</label>
        <div className="grid grid-cols-3 gap-3">
          {Object.values(Platform).map(platform => (
            <button
              key={platform}
              type="button"
              onClick={() => handlePlatformChange(platform)}
              disabled={disabled || !selectedRegion}
              className={`
                p-3 border-2 rounded-lg text-center transition-all
                ${selectedPlatform === platform 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-gray-300 hover:border-gray-400'
                }
                ${(disabled || !selectedRegion) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="text-2xl mb-1">
                {platform === Platform.ORIGINAL_CONSOLE ? '🎮' : 
                 platform === Platform.PC_EMULATOR ? '💻' : '📱'}
              </div>
              <div className="font-medium">
                {platform === Platform.ORIGINAL_CONSOLE ? 'Original-Konsole' :
                 platform === Platform.PC_EMULATOR ? 'PC/Emulator' : 'Mobile Emulator'}
              </div>
              <div className="text-xs text-gray-600">
                {platform === Platform.ORIGINAL_CONSOLE ? 'Echte N64-Hardware' :
                 platform === Platform.PC_EMULATOR ? 'Project64, RetroArch' : 'Mobile Gaming'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fairness Level Selection (nur für Emulatoren) */}
      {selectedPlatform && selectedPlatform !== Platform.ORIGINAL_CONSOLE && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">3️⃣ Fairness-Ebene</label>
          <div className="grid grid-cols-2 gap-3">
            {getAvailableFairnessLevels().map(fairness => (
              <button
                key={fairness}
                type="button"
                onClick={() => handleFairnessChange(fairness)}
                disabled={disabled}
                className={`
                  p-3 border-2 rounded-lg text-center transition-all
                  ${selectedFairness === fairness 
                    ? 'border-purple-500 bg-purple-50 text-purple-700' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="text-2xl mb-1">
                  {fairness === FairnessLevel.NORMAL ? '🟩' : '🟥'}
                </div>
                <div className="font-medium">
                  {fairness === FairnessLevel.NORMAL ? 'Glitchfrei' : 'Glitchrun'}
                </div>
                <div className="text-xs text-gray-600">
                  {fairness === FairnessLevel.NORMAL ? 'Keine Glitches/Exploits' : 'Glitches erlaubt'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Category Display */}
      {selectedRegion && selectedPlatform && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Ausgewählte Kategorie:</h4>
          <div className="flex items-center space-x-2 text-lg">
            {CategorySystem.getCategoryIcons({
              region: selectedRegion as GameRegion,
              platform: selectedPlatform as Platform,
              fairnessLevel: selectedFairness ? (selectedFairness as FairnessLevel) : undefined
            }).map((icon, index) => (
              <span key={index} className="text-2xl">{icon}</span>
            ))}
            <span className="font-semibold">
              {CategorySystem.getCategoryDisplayName({
                region: selectedRegion as GameRegion,
                platform: selectedPlatform as Platform,
                fairnessLevel: selectedFairness ? (selectedFairness as FairnessLevel) : undefined
              })}
            </span>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {showValidation && validationErrors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">⚠️ Validierungsfehler:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">ℹ️ Kategorie-Info:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Original-Konsole:</strong> Echte N64-Hardware - keine Fairness-Ebene erforderlich</li>
          <li>• <strong>Emulatoren:</strong> Fairness-Ebene muss angegeben werden</li>
          <li>• <strong>Glitchruns:</strong> Sind erlaubt, aber getrennt bewertet</li>
          <li>• <strong>Exploits:</strong> Die zu Softlocks führen = Disqualifikation</li>
        </ul>
      </div>
    </div>
  );
};