export interface Player {
  id: string;
  name: string;
  avatar: string;
  rank: string;
  xp: number;
  maxXp: number;
  level: number;
  stats: PlayerStats;
  achievements: Achievement[];
  collectionRarity: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  speedrunBestTimes: SpeedrunTime[];
  collectionRarity: number;
}

export interface SpeedrunTime {
  game: string;
  time: string;
  category: string;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface CollectionLocation {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  items: number;
  rarity: number;
}