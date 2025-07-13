export interface Game {
  id: string;
  title: string;
  platform: 'N64' | 'SNES' | 'NES' | 'GB' | 'GBA';
  category: string;
  imageUrl?: string;
}

export type EventCategory = 
  | 'Speedrun' 
  | 'Sammlung' 
  | 'Fanart' 
  | 'Gruppenzeit' 
  | 'Glitch-Only'
  | 'Challenge'
  | 'Tournament';

export type PlatformType = 
  | 'PAL' 
  | 'NTSC' 
  | 'Konsole' 
  | 'Emulator' 
  | 'Glitch' 
  | 'No Glitch';

export type ScoringType = 
  | 'Schnellste Zeit' 
  | 'Meiste Punkte' 
  | 'Top-Bewertung'
  | 'Sammel-Challenge'
  | 'Kreativ-Wettbewerb';

export interface RewardTier {
  position: number;
  xp: number;
  medals?: number;
  title?: string;
}

export interface EventSettings {
  screenshotRequired: boolean;
  livestreamAllowed: boolean;
  minimumLevel: number;
  aiGlitchDetection: boolean;
  teamScoring: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  game: Game;
  category: EventCategory;
  platform: PlatformType;
  startTime: Date;
  endTime: Date;
  scoringType: ScoringType;
  rewards: RewardTier[];
  settings: EventSettings;
  status: 'draft' | 'published' | 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  participants?: EventParticipant[];
}

export interface EventParticipant {
  id: string;
  userId: string;
  username: string;
  score?: number;
  time?: string;
  screenshotUrl?: string;
  videoUrl?: string;
  submittedAt?: Date;
  verified: boolean;
  position?: number;
}

export interface EventFormData {
  title: string;
  description: string;
  gameId: string;
  category: EventCategory;
  platform: PlatformType;
  startTime: Date;
  endTime: Date;
  scoringType: ScoringType;
  rewards: RewardTier[];
  settings: EventSettings;
}