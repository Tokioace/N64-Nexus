export interface PlayerStats {
  speed: number;           // 0-10 rating
  precision: number;       // 0-10 rating
  glitchMastery: number;   // 0-10 rating
  gameVariety: number;     // Number of different games played
  originalHardware: boolean; // Uses original hardware
  eventActivity: number;   // Number of event participations
  averageTime: string;     // Average completion time
  bestTime: string;        // Best completion time
  totalMaps: number;       // Total maps completed
}

export interface PlayerProfile {
  id: string;
  username: string;
  avatar: string;
  rankTitle: string;
  region: string;
  platform: string;
  fanPoints: number;
  xp: number;
  maxXp: number;
  favoriteGame: string;
  stats: PlayerStats;
  medals: Medal[];
  isPublic: boolean;
  specialAbility?: SpecialAbility;
}

export interface Medal {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt: Date;
}

export interface SpecialAbility {
  type: 'allrounder' | 'speeddemon' | 'artmaster' | 'glitchmaster' | 'eventchampion';
  name: string;
  description: string;
  icon: string;
  requirements: string[];
}

export interface StatDisplay {
  label: string;
  value: number | string | boolean;
  icon: string;
  tooltip?: string;
  maxValue?: number;
  unit?: string;
}

export type RankTier = 
  | 'Rookie'
  | 'Veteran'
  | 'Elite'
  | 'Master'
  | 'Legend'
  | 'Mythic'
  | 'Ultimate';

export interface Platform {
  name: string;
  icon: string;
  color: string;
}

export interface Region {
  name: string;
  flag: string;
  timezone: string;
}