/**
 * Demo Application für Battle64 Platform & Fairness Structure
 * 
 * Zeigt die Funktionalität des hierarchischen Kategorie-Systems
 */

import { 
  EventService, 
  EventParticipant, 
  EventStatistics 
} from '../services/EventService';
import { 
  CategorySystem, 
  GameRegion, 
  Platform, 
  FairnessLevel,
  CategoryConfig,
  EventConfig,
  RunSubmission
} from '../models/CategorySystem';

export class Battle64DemoApp {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
    this.initializeDemoData();
  }

  /**
   * Initialisiert Demo-Daten
   */
  private initializeDemoData(): void {
    console.log('🎮 Initialisiere Battle64 Demo...');

    // Erstelle Demo-Events
    this.createDemoEvents();

    // Registriere Demo-Teilnehmer
    this.registerDemoParticipants();

    // Reiche Demo-Submissions ein
    this.submitDemoRuns();

    console.log('✅ Demo-Daten erfolgreich erstellt!');
  }

  /**
   * Erstellt Demo-Events
   */
  private createDemoEvents(): void {
    // Event 1: Alle Kategorien erlaubt
    const allCategoriesEvent = this.eventService.createEvent({
      name: '🏆 Battle64 Speedrun Championship 2024',
      description: 'Das ultimative Battle64 Speedrun Event mit allen Kategorien!',
      allowedCategories: CategorySystem.getAllPossibleCategories(),
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      maxParticipants: 100,
      glitchDetectionEnabled: true,
      adminOnly: false
    });

    // Event 2: Nur Original-Konsole
    const consoleOnlyEvent = this.eventService.createEvent({
      name: '🎮 Classic Console Challenge',
      description: 'Nur echte N64-Hardware erlaubt - für Puristen!',
      allowedCategories: [
        { region: GameRegion.PAL, platform: Platform.ORIGINAL_CONSOLE },
        { region: GameRegion.NTSC, platform: Platform.ORIGINAL_CONSOLE }
      ],
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-29'),
      maxParticipants: 50,
      glitchDetectionEnabled: false,
      adminOnly: false
    });

    // Event 3: Nur Glitchfrei
    const glitchFreeEvent = this.eventService.createEvent({
      name: '🟩 Glitch-Free Tournament',
      description: 'Nur saubere Runs ohne Glitches oder Exploits!',
      allowedCategories: [
        { region: GameRegion.PAL, platform: Platform.ORIGINAL_CONSOLE },
        { region: GameRegion.NTSC, platform: Platform.ORIGINAL_CONSOLE },
        { region: GameRegion.PAL, platform: Platform.PC_EMULATOR, fairnessLevel: FairnessLevel.NORMAL },
        { region: GameRegion.NTSC, platform: Platform.PC_EMULATOR, fairnessLevel: FairnessLevel.NORMAL },
        { region: GameRegion.PAL, platform: Platform.MOBILE_EMULATOR, fairnessLevel: FairnessLevel.NORMAL },
        { region: GameRegion.NTSC, platform: Platform.MOBILE_EMULATOR, fairnessLevel: FairnessLevel.NORMAL }
      ],
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-31'),
      maxParticipants: 75,
      glitchDetectionEnabled: true,
      adminOnly: false
    });

    console.log('📅 Demo-Events erstellt:');
    console.log(`  - ${allCategoriesEvent.name} (ID: ${allCategoriesEvent.id})`);
    console.log(`  - ${consoleOnlyEvent.name} (ID: ${consoleOnlyEvent.id})`);
    console.log(`  - ${glitchFreeEvent.name} (ID: ${glitchFreeEvent.id})`);
  }

  /**
   * Registriert Demo-Teilnehmer
   */
  private registerDemoParticipants(): void {
    const events = this.eventService.getActiveEvents();
    const event = events[0]; // Verwende das erste Event

    const participants = [
      { userId: 'user_001', username: 'SpeedRunner_Pro', category: { region: GameRegion.PAL, platform: Platform.ORIGINAL_CONSOLE } },
      { userId: 'user_002', username: 'GlitchMaster', category: { region: GameRegion.NTSC, platform: Platform.PC_EMULATOR, fairnessLevel: FairnessLevel.GLITCH } },
      { userId: 'user_003', username: 'ConsolePurist', category: { region: GameRegion.PAL, platform: Platform.ORIGINAL_CONSOLE } },
      { userId: 'user_004', username: 'EmulatorKing', category: { region: GameRegion.NTSC, platform: Platform.PC_EMULATOR, fairnessLevel: FairnessLevel.NORMAL } },
      { userId: 'user_005', username: 'MobileGamer', category: { region: GameRegion.PAL, platform: Platform.MOBILE_EMULATOR, fairnessLevel: FairnessLevel.GLITCH } },
      { userId: 'user_006', username: 'NTSC_Champion', category: { region: GameRegion.NTSC, platform: Platform.ORIGINAL_CONSOLE } },
      { userId: 'user_007', username: 'CleanRunner', category: { region: GameRegion.PAL, platform: Platform.PC_EMULATOR, fairnessLevel: FairnessLevel.NORMAL } },
      { userId: 'user_008', username: 'ExploitHunter', category: { region: GameRegion.NTSC, platform: Platform.MOBILE_EMULATOR, fairnessLevel: FairnessLevel.GLITCH } }
    ];

    participants.forEach(participant => {
      try {
        this.eventService.registerParticipant(
          event.id,
          participant.userId,
          participant.username,
          participant.category
        );
        console.log(`✅ ${participant.username} registriert für ${CategorySystem.getCategoryDisplayName(participant.category)}`);
      } catch (error) {
        console.log(`❌ Fehler bei Registrierung von ${participant.username}: ${error}`);
      }
    });
  }

  /**
   * Reicht Demo-Submissions ein
   */
  private submitDemoRuns(): void {
    const events = this.eventService.getActiveEvents();
    const event = events[0];

    const submissions = [
      { userId: 'user_001', time: 125000, glitchDeclaration: false, videoUrl: 'https://youtube.com/watch?v=demo1' },
      { userId: 'user_002', time: 118000, glitchDeclaration: true, videoUrl: 'https://youtube.com/watch?v=demo2' },
      { userId: 'user_003', time: 132000, glitchDeclaration: false, videoUrl: 'https://youtube.com/watch?v=demo3' },
      { userId: 'user_004', time: 121000, glitchDeclaration: false, videoUrl: 'https://youtube.com/watch?v=demo4' },
      { userId: 'user_005', time: 115000, glitchDeclaration: true, videoUrl: 'https://youtube.com/watch?v=demo5' },
      { userId: 'user_006', time: 128000, glitchDeclaration: false, videoUrl: 'https://youtube.com/watch?v=demo6' },
      { userId: 'user_007', time: 124000, glitchDeclaration: false, videoUrl: 'https://youtube.com/watch?v=demo7' },
      { userId: 'user_008', time: 112000, glitchDeclaration: true, videoUrl: 'https://youtube.com/watch?v=demo8' }
    ];

    submissions.forEach(submission => {
      try {
        const participant = this.eventService.getEventParticipants(event.id)
          .find(p => p.userId === submission.userId);
        
        if (participant) {
          this.eventService.submitRun(
            event.id,
            submission.userId,
            participant.category,
            submission.time,
            submission.videoUrl,
            submission.glitchDeclaration
          );
          console.log(`✅ Run von ${participant.username} eingereicht: ${this.formatTime(submission.time)}`);
        }
      } catch (error) {
        console.log(`❌ Fehler bei Submission: ${error}`);
      }
    });
  }

  /**
   * Zeigt Demo-Statistiken
   */
  public showDemoStatistics(): void {
    console.log('\n📊 BATTLE64 DEMO STATISTIKEN');
    console.log('=' .repeat(50));

    const events = this.eventService.getActiveEvents();
    
    events.forEach(event => {
      console.log(`\n🏆 ${event.name}`);
      console.log(`📅 ${event.startDate.toLocaleDateString()} - ${event.endDate.toLocaleDateString()}`);
      
      const stats = this.eventService.getEventStatistics(event.id);
      console.log(`👥 Teilnehmer: ${stats.totalParticipants}`);
      console.log(`📝 Submissions: ${stats.totalSubmissions}`);
      console.log(`✅ Verifiziert: ${stats.verifiedSubmissions}`);
      console.log(`🟥 Glitchruns: ${this.eventService.getEventSubmissions(event.id).filter(s => s.glitchDeclaration).length}`);
      console.log(`❌ Disqualifiziert: ${stats.disqualifiedSubmissions}`);

      // Zeige Kategorie-Aufteilung
      console.log('\n📋 Kategorie-Aufteilung:');
      Object.entries(stats.participantsByCategory).forEach(([categoryId, count]) => {
        const category = this.parseCategoryId(categoryId);
        if (category) {
          console.log(`  ${CategorySystem.getCategoryIcons(category).join('')} ${CategorySystem.getCategoryDisplayName(category)}: ${count}`);
        }
      });
    });
  }

  /**
   * Zeigt Leaderboards
   */
  public showLeaderboards(): void {
    console.log('\n🏁 BATTLE64 DEMO LEADERBOARDS');
    console.log('=' .repeat(50));

    const events = this.eventService.getActiveEvents();
    const event = events[0];

    // Zeige alle Kategorien
    const allCategories = CategorySystem.getAllPossibleCategories();
    
    allCategories.forEach(category => {
      const leaderboard = this.eventService.generateLeaderboard(event.id, category);
      
      if (leaderboard.length > 0) {
        console.log(`\n${CategorySystem.getCategoryIcons(category).join('')} ${CategorySystem.getCategoryDisplayName(category)}`);
        console.log('-'.repeat(40));
        
        leaderboard.slice(0, 5).forEach((submission, index) => {
          const participant = this.eventService.getEventParticipants(event.id)
            .find(p => p.userId === submission.userId);
          const username = participant ? participant.username : `Player_${submission.userId.slice(-4)}`;
          
          const glitchIcon = submission.glitchDeclaration ? '🟥' : '🟩';
          const verifiedIcon = submission.verified ? '✅' : '⏳';
          
          console.log(`${index + 1}. ${username} - ${this.formatTime(submission.time)} ${glitchIcon} ${verifiedIcon}`);
        });
      }
    });
  }

  /**
   * Demonstriert Kategorie-System
   */
  public demonstrateCategorySystem(): void {
    console.log('\n🎯 BATTLE64 KATEGORIE-SYSTEM DEMO');
    console.log('=' .repeat(50));

    // Zeige alle möglichen Kategorien
    console.log('\n📋 Alle möglichen Kategorien:');
    const allCategories = CategorySystem.getAllPossibleCategories();
    allCategories.forEach(category => {
      const categoryId = CategorySystem.generateCategoryId(category);
      const displayName = CategorySystem.getCategoryDisplayName(category);
      const icons = CategorySystem.getCategoryIcons(category).join('');
      const cssClasses = CategorySystem.getCategoryCssClasses(category).join(' ');
      
      console.log(`  ${icons} ${displayName}`);
      console.log(`    ID: ${categoryId}`);
      console.log(`    CSS: ${cssClasses}`);
      console.log(`    Original-Konsole: ${CategorySystem.isOriginalConsole(category)}`);
      console.log(`    Emulator: ${CategorySystem.isEmulator(category)}`);
      console.log(`    Fairness erforderlich: ${CategorySystem.requiresFairnessLevel(category)}`);
      console.log('');
    });

    // Demonstriere Validierung
    console.log('\n✅ Kategorie-Validierung:');
    const testCategories = [
      { region: GameRegion.PAL, platform: Platform.ORIGINAL_CONSOLE },
      { region: GameRegion.NTSC, platform: Platform.PC_EMULATOR, fairnessLevel: FairnessLevel.GLITCH },
      { region: GameRegion.PAL, platform: Platform.MOBILE_EMULATOR }, // Fehler: kein Fairness-Level
      { region: 'INVALID' as GameRegion, platform: Platform.ORIGINAL_CONSOLE } // Fehler: ungültige Region
    ];

    testCategories.forEach((category, index) => {
      const validation = CategorySystem.validateCategory(category as CategoryConfig);
      console.log(`  Test ${index + 1}: ${validation.valid ? '✅' : '❌'} ${CategorySystem.getCategoryDisplayName(category as CategoryConfig)}`);
      if (!validation.valid) {
        validation.errors.forEach(error => console.log(`    - ${error}`));
      }
    });
  }

  /**
   * Formatiert Zeit in lesbarem Format
   */
  private formatTime(timeMs: number): string {
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((timeMs % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  }

  /**
   * Parst Category-ID zurück zu CategoryConfig
   */
  private parseCategoryId(categoryId: string): CategoryConfig | null {
    const parts = categoryId.split('_');
    if (parts.length < 2) return null;

    const region = parts[0] as GameRegion;
    const platform = parts[1] as Platform;
    const fairnessLevel = parts[2] as FairnessLevel | undefined;

    if (!Object.values(GameRegion).includes(region) || !Object.values(Platform).includes(platform)) {
      return null;
    }

    return {
      region,
      platform,
      fairnessLevel
    };
  }

  /**
   * Startet die Demo
   */
  public runDemo(): void {
    console.log('🚀 Starte Battle64 Platform & Fairness Structure Demo...\n');
    
    this.demonstrateCategorySystem();
    this.showDemoStatistics();
    this.showLeaderboards();
    
    console.log('\n🎉 Demo abgeschlossen!');
    console.log('\n💡 Nächste Schritte:');
    console.log('  - Integriere das System in deine Battle64-Anwendung');
    console.log('  - Erweitere um KI-basierte Glitch-Erkennung');
    console.log('  - Füge Admin-Tools für Event-Management hinzu');
    console.log('  - Implementiere Benutzer-Authentifizierung');
  }
}

// Demo starten wenn direkt ausgeführt
if (require.main === module) {
  const demo = new Battle64DemoApp();
  demo.runDemo();
}