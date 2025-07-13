/**
 * Basic Usage Example für Battle64 Platform & Fairness Structure
 * 
 * Zeigt die grundlegende Verwendung des Systems
 */

import { EventService } from '../src/services/EventService';
import { 
  CategorySystem, 
  GameRegion, 
  Platform, 
  FairnessLevel,
  CategoryConfig 
} from '../src/models/CategorySystem';

// ============================================================================
// BEISPIEL 1: Grundlegende Kategorie-Verwendung
// ============================================================================

console.log('🎯 BEISPIEL 1: Grundlegende Kategorie-Verwendung');
console.log('=' .repeat(50));

// Kategorie erstellen
const palConsoleCategory: CategoryConfig = {
  region: GameRegion.PAL,
  platform: Platform.ORIGINAL_CONSOLE
};

const ntscEmulatorGlitchCategory: CategoryConfig = {
  region: GameRegion.NTSC,
  platform: Platform.PC_EMULATOR,
  fairnessLevel: FairnessLevel.GLITCH
};

// Kategorie-Informationen anzeigen
console.log('PAL Original-Konsole:');
console.log(`  ID: ${CategorySystem.generateCategoryId(palConsoleCategory)}`);
console.log(`  Name: ${CategorySystem.getCategoryDisplayName(palConsoleCategory)}`);
console.log(`  Icons: ${CategorySystem.getCategoryIcons(palConsoleCategory).join(' ')}`);
console.log(`  CSS-Klassen: ${CategorySystem.getCategoryCssClasses(palConsoleCategory).join(' ')}`);
console.log(`  Ist Original-Konsole: ${CategorySystem.isOriginalConsole(palConsoleCategory)}`);
console.log(`  Ist Emulator: ${CategorySystem.isEmulator(palConsoleCategory)}`);
console.log(`  Fairness-Level erforderlich: ${CategorySystem.requiresFairnessLevel(palConsoleCategory)}`);

console.log('\nNTSC PC-Emulator Glitchrun:');
console.log(`  ID: ${CategorySystem.generateCategoryId(ntscEmulatorGlitchCategory)}`);
console.log(`  Name: ${CategorySystem.getCategoryDisplayName(ntscEmulatorGlitchCategory)}`);
console.log(`  Icons: ${CategorySystem.getCategoryIcons(ntscEmulatorGlitchCategory).join(' ')}`);
console.log(`  CSS-Klassen: ${CategorySystem.getCategoryCssClasses(ntscEmulatorGlitchCategory).join(' ')}`);
console.log(`  Ist Original-Konsole: ${CategorySystem.isOriginalConsole(ntscEmulatorGlitchCategory)}`);
console.log(`  Ist Emulator: ${CategorySystem.isEmulator(ntscEmulatorGlitchCategory)}`);
console.log(`  Fairness-Level erforderlich: ${CategorySystem.requiresFairnessLevel(ntscEmulatorGlitchCategory)}`);

// ============================================================================
// BEISPIEL 2: Kategorie-Validierung
// ============================================================================

console.log('\n\n✅ BEISPIEL 2: Kategorie-Validierung');
console.log('=' .repeat(50));

const testCategories = [
  // Gültige Kategorien
  { region: GameRegion.PAL, platform: Platform.ORIGINAL_CONSOLE },
  { region: GameRegion.NTSC, platform: Platform.PC_EMULATOR, fairnessLevel: FairnessLevel.NORMAL },
  { region: GameRegion.PAL, platform: Platform.MOBILE_EMULATOR, fairnessLevel: FairnessLevel.GLITCH },
  
  // Ungültige Kategorien
  { region: GameRegion.PAL, platform: Platform.MOBILE_EMULATOR }, // Fehlt Fairness-Level
  { region: 'INVALID' as GameRegion, platform: Platform.ORIGINAL_CONSOLE }, // Ungültige Region
  { region: GameRegion.NTSC, platform: Platform.ORIGINAL_CONSOLE, fairnessLevel: FairnessLevel.GLITCH } // Fairness-Level bei Original-Konsole
];

testCategories.forEach((category, index) => {
  const validation = CategorySystem.validateCategory(category as CategoryConfig);
  console.log(`\nTest ${index + 1}: ${validation.valid ? '✅' : '❌'}`);
  console.log(`  Kategorie: ${CategorySystem.getCategoryDisplayName(category as CategoryConfig)}`);
  
  if (!validation.valid) {
    console.log('  Fehler:');
    validation.errors.forEach(error => console.log(`    - ${error}`));
  }
});

// ============================================================================
// BEISPIEL 3: Event-Management
// ============================================================================

console.log('\n\n🏆 BEISPIEL 3: Event-Management');
console.log('=' .repeat(50));

// EventService initialisieren
const eventService = new EventService();

// Event erstellen
const event = eventService.createEvent({
  name: 'Battle64 Speedrun Challenge',
  description: 'Ein spannendes Speedrun-Event für alle Plattformen!',
  allowedCategories: [
    { region: GameRegion.PAL, platform: Platform.ORIGINAL_CONSOLE },
    { region: GameRegion.NTSC, platform: Platform.ORIGINAL_CONSOLE },
    { region: GameRegion.PAL, platform: Platform.PC_EMULATOR, fairnessLevel: FairnessLevel.NORMAL },
    { region: GameRegion.NTSC, platform: Platform.PC_EMULATOR, fairnessLevel: FairnessLevel.GLITCH }
  ],
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 Tage
  maxParticipants: 50,
  glitchDetectionEnabled: true,
  adminOnly: false
});

console.log(`Event erstellt: ${event.name}`);
console.log(`Event-ID: ${event.id}`);
console.log(`Erlaubte Kategorien: ${event.allowedCategories.length}`);

// Teilnehmer registrieren
try {
  const participant1 = eventService.registerParticipant(
    event.id,
    'user_001',
    'SpeedRunner_Pro',
    { region: GameRegion.PAL, platform: Platform.ORIGINAL_CONSOLE }
  );
  console.log(`✅ ${participant1.username} registriert für ${CategorySystem.getCategoryDisplayName(participant1.category)}`);

  const participant2 = eventService.registerParticipant(
    event.id,
    'user_002',
    'GlitchMaster',
    { region: GameRegion.NTSC, platform: Platform.PC_EMULATOR, fairnessLevel: FairnessLevel.GLITCH }
  );
  console.log(`✅ ${participant2.username} registriert für ${CategorySystem.getCategoryDisplayName(participant2.category)}`);

} catch (error) {
  console.log(`❌ Registrierungsfehler: ${error}`);
}

// Runs einreichen
try {
  const submission1 = eventService.submitRun(
    event.id,
    'user_001',
    { region: GameRegion.PAL, platform: Platform.ORIGINAL_CONSOLE },
    125000, // 2:05.00
    'https://youtube.com/watch?v=demo1',
    false // Keine Glitches
  );
  console.log(`✅ Run von SpeedRunner_Pro eingereicht: ${formatTime(submission1.time)}`);

  const submission2 = eventService.submitRun(
    event.id,
    'user_002',
    { region: GameRegion.NTSC, platform: Platform.PC_EMULATOR, fairnessLevel: FairnessLevel.GLITCH },
    118000, // 1:58.00
    'https://youtube.com/watch?v=demo2',
    true // Glitches verwendet
  );
  console.log(`✅ Run von GlitchMaster eingereicht: ${formatTime(submission2.time)} (Glitchrun)`);

} catch (error) {
  console.log(`❌ Submission-Fehler: ${error}`);
}

// ============================================================================
// BEISPIEL 4: Leaderboard und Statistiken
// ============================================================================

console.log('\n\n🏁 BEISPIEL 4: Leaderboard und Statistiken');
console.log('=' .repeat(50));

// Event-Statistiken anzeigen
const stats = eventService.getEventStatistics(event.id);
console.log('📊 Event-Statistiken:');
console.log(`  Teilnehmer: ${stats.totalParticipants}`);
console.log(`  Submissions: ${stats.totalSubmissions}`);
console.log(`  Verifiziert: ${stats.verifiedSubmissions}`);
console.log(`  Disqualifiziert: ${stats.disqualifiedSubmissions}`);

// Kategorie-Aufteilung
console.log('\n📋 Kategorie-Aufteilung:');
Object.entries(stats.participantsByCategory).forEach(([categoryId, count]) => {
  console.log(`  ${categoryId}: ${count} Teilnehmer`);
});

// Leaderboard für alle Kategorien
console.log('\n🏆 Leaderboard:');
const allCategories = CategorySystem.getAllPossibleCategories();

allCategories.forEach(category => {
  const leaderboard = eventService.generateLeaderboard(event.id, category);
  
  if (leaderboard.length > 0) {
    console.log(`\n${CategorySystem.getCategoryIcons(category).join('')} ${CategorySystem.getCategoryDisplayName(category)}`);
    console.log('-'.repeat(40));
    
    leaderboard.forEach((submission, index) => {
      const glitchIcon = submission.glitchDeclaration ? '🟥' : '🟩';
      const verifiedIcon = submission.verified ? '✅' : '⏳';
      
      console.log(`${index + 1}. ${formatTime(submission.time)} ${glitchIcon} ${verifiedIcon}`);
    });
  }
});

// ============================================================================
// BEISPIEL 5: Alle möglichen Kategorien
// ============================================================================

console.log('\n\n📋 BEISPIEL 5: Alle möglichen Kategorien');
console.log('=' .repeat(50));

const allPossibleCategories = CategorySystem.getAllPossibleCategories();
console.log(`Gesamt: ${allPossibleCategories.length} Kategorien\n`);

allPossibleCategories.forEach((category, index) => {
  const categoryId = CategorySystem.generateCategoryId(category);
  const displayName = CategorySystem.getCategoryDisplayName(category);
  const icons = CategorySystem.getCategoryIcons(category).join('');
  
  console.log(`${index + 1}. ${icons} ${displayName}`);
  console.log(`   ID: ${categoryId}`);
  console.log(`   Original-Konsole: ${CategorySystem.isOriginalConsole(category)}`);
  console.log(`   Emulator: ${CategorySystem.isEmulator(category)}`);
  console.log(`   Fairness erforderlich: ${CategorySystem.requiresFairnessLevel(category)}`);
  console.log('');
});

// ============================================================================
// HILFSFUNKTIONEN
// ============================================================================

function formatTime(timeMs: number): string {
  const totalSeconds = Math.floor(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((timeMs % 1000) / 10);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

console.log('\n🎉 Basic Usage Example abgeschlossen!');
console.log('\n💡 Nächste Schritte:');
console.log('  - Integriere das System in deine Anwendung');
console.log('  - Verwende die React-Komponenten für die UI');
console.log('  - Erweitere um Datenbank-Persistierung');
console.log('  - Implementiere Benutzer-Authentifizierung');