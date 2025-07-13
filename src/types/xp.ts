export interface XPHistory {
  id: string;
  amount: number;
  source: string;
  timestamp: Date;
  description: string;
}

export interface LevelReward {
  level: number;
  title: string;
  description: string;
  type: 'profile_frame' | 'icon' | 'private_events' | 'beta_access' | 'fanart_contests';
  unlocked: boolean;
}

export interface UserLevel {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  xpHistory: XPHistory[];
  rewards: LevelReward[];
}

export type XPSource = 
  | 'event_participation'
  | 'event_placement_1st'
  | 'event_placement_2nd'
  | 'event_placement_3rd'
  | 'fanart_upload'
  | 'fanart_top5'
  | 'trade_completed'
  | 'quiz_won'
  | 'friendship_badge';

export interface XPReward {
  source: XPSource;
  amount: number;
  description: string;
  maxPerEvent?: boolean;
}

export const XP_REWARDS: Record<XPSource, XPReward> = {
  event_participation: { source: 'event_participation', amount: 50, description: 'Event Teilnahme', maxPerEvent: true },
  event_placement_1st: { source: 'event_placement_1st', amount: 100, description: '1. Platz' },
  event_placement_2nd: { source: 'event_placement_2nd', amount: 75, description: '2. Platz' },
  event_placement_3rd: { source: 'event_placement_3rd', amount: 50, description: '3. Platz' },
  fanart_upload: { source: 'fanart_upload', amount: 30, description: 'Fanart hochgeladen' },
  fanart_top5: { source: 'fanart_top5', amount: 100, description: 'Fanart in Top 5' },
  trade_completed: { source: 'trade_completed', amount: 100, description: 'Tausch abgeschlossen' },
  quiz_won: { source: 'quiz_won', amount: 50, description: 'Quiz gewonnen' },
  friendship_badge: { source: 'friendship_badge', amount: 20, description: 'Freundschaftsabzeichen' }
};

export const LEVEL_CURVE: number[] = [
  0,    // Level 1
  100,  // Level 2
  300,  // Level 3
  600,  // Level 4
  1000, // Level 5
  1500, // Level 6
  2100, // Level 7
  2800, // Level 8
  3600, // Level 9
  4500, // Level 10
  5500, // Level 11
  6600, // Level 12
  7800, // Level 13
  9100, // Level 14
  10500, // Level 15
  12000, // Level 16
  13600, // Level 17
  15300, // Level 18
  17100, // Level 19
  19000  // Level 20
];

export const LEVEL_REWARDS: LevelReward[] = [
  { level: 5, title: 'Retro Commander', description: 'Neue Profilrahmen freigeschaltet', type: 'profile_frame', unlocked: false },
  { level: 7, title: 'Pixel Master', description: 'Neue Icons verfügbar', type: 'icon', unlocked: false },
  { level: 10, title: 'Elite Gamer', description: 'Zugriff auf private Events', type: 'private_events', unlocked: false },
  { level: 15, title: 'Beta Tester', description: 'Beta-Zugang zu neuen Features', type: 'beta_access', unlocked: false },
  { level: 20, title: 'Community Creator', description: 'Eigene Fanart-Wettbewerbe erstellen', type: 'fanart_contests', unlocked: false }
];

export const LEVEL_COLORS = {
  1: '#4CAF50',   // Grün
  2: '#4CAF50',
  3: '#4CAF50',
  4: '#4CAF50',
  5: '#FFC107',   // Gelb
  6: '#FFC107',
  7: '#FFC107',
  8: '#FFC107',
  9: '#FFC107',
  10: '#FF5722',  // Rot
  11: '#FF5722',
  12: '#FF5722',
  13: '#FF5722',
  14: '#FF5722',
  15: '#9C27B0',  // Violett
  16: '#9C27B0',
  17: '#9C27B0',
  18: '#9C27B0',
  19: '#9C27B0',
  20: '#9C27B0'
};