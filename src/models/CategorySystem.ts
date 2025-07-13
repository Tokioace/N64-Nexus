/**
 * Hierarchische Plattform- & Fairnessstruktur für Battle64-Speedruns
 * 
 * Dieses Modul definiert die Kategorisierung von Speedrun-Teilnehmern
 * basierend auf Region, Plattform und Glitch-Nutzung.
 */

// ============================================================================
// ENUMERATIONS
// ============================================================================

export enum GameRegion {
  PAL = 'PAL',    // Europäische Version
  NTSC = 'NTSC'   // Nordamerikanische Version
}

export enum Platform {
  ORIGINAL_CONSOLE = 'original_console',  // 🎮 Echte N64-Hardware
  PC_EMULATOR = 'pc_emulator',           // 💻 PC/Emulator (Project64, RetroArch)
  MOBILE_EMULATOR = 'mobile_emulator'    // 📱 Mobile Emulatoren
}

export enum FairnessLevel {
  NORMAL = 'normal',      // 🟩 Keine Glitches/Exploits
  GLITCH = 'glitch'       // 🟥 Glitches/Sequence Breaks erlaubt
}

// ============================================================================
// INTERFACES
// ============================================================================

export interface CategoryConfig {
  region: GameRegion;
  platform: Platform;
  fairnessLevel?: FairnessLevel; // Optional, nur bei Emulatoren relevant
}

export interface RunSubmission {
  id: string;
  userId: string;
  eventId: string;
  category: CategoryConfig;
  time: number; // Zeit in Millisekunden
  videoUrl?: string;
  glitchDeclaration: boolean; // Nutzer bestätigt Glitch-Status
  submissionDate: Date;
  verified: boolean;
  disqualified: boolean;
  disqualificationReason?: string;
}

export interface EventConfig {
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

export interface LeaderboardEntry {
  rank: number;
  run: RunSubmission;
  category: CategoryConfig;
  displayName: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export class CategorySystem {
  
  /**
   * Generiert eine eindeutige Kategorie-ID
   */
  static generateCategoryId(config: CategoryConfig): string {
    const base = `${config.region}_${config.platform}`;
    return config.fairnessLevel ? `${base}_${config.fairnessLevel}` : base;
  }

  /**
   * Prüft ob eine Kategorie für Original-Konsolen gilt
   */
  static isOriginalConsole(config: CategoryConfig): boolean {
    return config.platform === Platform.ORIGINAL_CONSOLE;
  }

  /**
   * Prüft ob eine Kategorie für Emulatoren gilt
   */
  static isEmulator(config: CategoryConfig): boolean {
    return config.platform === Platform.PC_EMULATOR || 
           config.platform === Platform.MOBILE_EMULATOR;
  }

  /**
   * Prüft ob Fairness-Level für eine Kategorie erforderlich ist
   */
  static requiresFairnessLevel(config: CategoryConfig): boolean {
    return this.isEmulator(config);
  }

  /**
   * Validiert eine Kategorie-Konfiguration
   */
  static validateCategory(config: CategoryConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!Object.values(GameRegion).includes(config.region)) {
      errors.push('Ungültige Region');
    }

    if (!Object.values(Platform).includes(config.platform)) {
      errors.push('Ungültige Plattform');
    }

    if (this.requiresFairnessLevel(config) && !config.fairnessLevel) {
      errors.push('Fairness-Level ist für Emulator-Kategorien erforderlich');
    }

    if (!this.requiresFairnessLevel(config) && config.fairnessLevel) {
      errors.push('Fairness-Level ist nur für Emulator-Kategorien relevant');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Generiert alle möglichen Kategorien
   */
  static getAllPossibleCategories(): CategoryConfig[] {
    const categories: CategoryConfig[] = [];

    // Original-Konsole Kategorien (kein Fairness-Level)
    Object.values(GameRegion).forEach(region => {
      categories.push({
        region,
        platform: Platform.ORIGINAL_CONSOLE
      });
    });

    // Emulator-Kategorien (mit Fairness-Level)
    Object.values(GameRegion).forEach(region => {
      Object.values(Platform).forEach(platform => {
        if (platform !== Platform.ORIGINAL_CONSOLE) {
          Object.values(FairnessLevel).forEach(fairnessLevel => {
            categories.push({
              region,
              platform,
              fairnessLevel
            });
          });
        }
      });
    });

    return categories;
  }

  /**
   * Generiert einen benutzerfreundlichen Kategorienamen
   */
  static getCategoryDisplayName(config: CategoryConfig): string {
    const regionNames = {
      [GameRegion.PAL]: 'PAL',
      [GameRegion.NTSC]: 'NTSC'
    };

    const platformNames = {
      [Platform.ORIGINAL_CONSOLE]: 'Original-Konsole',
      [Platform.PC_EMULATOR]: 'PC/Emulator',
      [Platform.MOBILE_EMULATOR]: 'Mobile Emulator'
    };

    const fairnessNames = {
      [FairnessLevel.NORMAL]: 'Glitchfrei',
      [FairnessLevel.GLITCH]: 'Glitchrun'
    };

    let name = `${regionNames[config.region]} / ${platformNames[config.platform]}`;
    
    if (config.fairnessLevel) {
      name += ` / ${fairnessNames[config.fairnessLevel]}`;
    }

    return name;
  }

  /**
   * Generiert CSS-Klassen für Styling
   */
  static getCategoryCssClasses(config: CategoryConfig): string[] {
    const classes = [
      `region-${config.region.toLowerCase()}`,
      `platform-${config.platform.toLowerCase()}`
    ];

    if (config.fairnessLevel) {
      classes.push(`fairness-${config.fairnessLevel.toLowerCase()}`);
    }

    return classes;
  }

  /**
   * Generiert Icons für die Kategorie
   */
  static getCategoryIcons(config: CategoryConfig): string[] {
    const icons: string[] = [];

    // Region-Icons
    const regionIcons = {
      [GameRegion.PAL]: '🇪🇺',
      [GameRegion.NTSC]: '🇺🇸'
    };

    // Plattform-Icons
    const platformIcons = {
      [Platform.ORIGINAL_CONSOLE]: '🎮',
      [Platform.PC_EMULATOR]: '💻',
      [Platform.MOBILE_EMULATOR]: '📱'
    };

    // Fairness-Icons
    const fairnessIcons = {
      [FairnessLevel.NORMAL]: '🟩',
      [FairnessLevel.GLITCH]: '🟥'
    };

    icons.push(regionIcons[config.region]);
    icons.push(platformIcons[config.platform]);

    if (config.fairnessLevel) {
      icons.push(fairnessIcons[config.fairnessLevel]);
    }

    return icons;
  }
}