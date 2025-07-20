export interface N64Game {
  id: string;
  title: string;
  titleGerman?: string;
  genre: string;
  releaseYear: number;
  region: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'ultra-rare';
  values: {
    moduleOnly: number; // Nur Modul
    withBox: number; // Mit Verpackung
    complete: number; // Komplett (Box + Anleitung + Modul)
  };
  description?: string;
}

export interface CollectedGame {
  gameId: string;
  condition: 'mint' | 'used';
  hasBox: boolean;
  hasManual: boolean;
  hasModule: boolean;
  notes?: string;
  addedDate: string;
}

export const n64Games: N64Game[] = [
  // Common Games (Häufig)
  {
    id: 'super-mario-64',
    title: 'Super Mario 64',
    genre: 'Jump & Run',
    releaseYear: 1996,
    region: 'PAL',
    rarity: 'common',
    values: {
      moduleOnly: 25,
      withBox: 45,
      complete: 60
    }
  },
  {
    id: 'mario-kart-64',
    title: 'Mario Kart 64',
    genre: 'Rennspiel',
    releaseYear: 1997,
    region: 'PAL',
    rarity: 'common',
    values: {
      moduleOnly: 30,
      withBox: 55,
      complete: 75
    }
  },
  {
    id: 'goldeneye-007',
    title: 'GoldenEye 007',
    genre: 'Shooter',
    releaseYear: 1997,
    region: 'PAL',
    rarity: 'common',
    values: {
      moduleOnly: 35,
      withBox: 60,
      complete: 85
    }
  },
  {
    id: 'super-smash-bros',
    title: 'Super Smash Bros.',
    genre: 'Kampfspiel',
    releaseYear: 1999,
    region: 'PAL',
    rarity: 'common',
    values: {
      moduleOnly: 40,
      withBox: 70,
      complete: 95
    }
  },
  {
    id: 'zelda-ocarina-of-time',
    title: 'The Legend of Zelda: Ocarina of Time',
    titleGerman: 'Zelda: Ocarina of Time',
    genre: 'Adventure',
    releaseYear: 1998,
    region: 'PAL',
    rarity: 'common',
    values: {
      moduleOnly: 45,
      withBox: 80,
      complete: 110
    }
  },
  {
    id: 'mario-party',
    title: 'Mario Party',
    genre: 'Party',
    releaseYear: 1999,
    region: 'PAL',
    rarity: 'common',
    values: {
      moduleOnly: 35,
      withBox: 65,
      complete: 90
    }
  },
  {
    id: 'donkey-kong-64',
    title: 'Donkey Kong 64',
    genre: 'Jump & Run',
    releaseYear: 1999,
    region: 'PAL',
    rarity: 'common',
    values: {
      moduleOnly: 30,
      withBox: 55,
      complete: 80
    }
  },
  {
    id: 'mario-party-2',
    title: 'Mario Party 2',
    genre: 'Party',
    releaseYear: 2000,
    region: 'PAL',
    rarity: 'common',
    values: {
      moduleOnly: 40,
      withBox: 75,
      complete: 105
    }
  },

  // Uncommon Games (Ungewöhnlich)
  {
    id: 'banjo-kazooie',
    title: 'Banjo-Kazooie',
    genre: 'Jump & Run',
    releaseYear: 1998,
    region: 'PAL',
    rarity: 'uncommon',
    values: {
      moduleOnly: 50,
      withBox: 90,
      complete: 125
    }
  },
  {
    id: 'perfect-dark',
    title: 'Perfect Dark',
    genre: 'Shooter',
    releaseYear: 2000,
    region: 'PAL',
    rarity: 'uncommon',
    values: {
      moduleOnly: 45,
      withBox: 85,
      complete: 120
    }
  },
  {
    id: 'paper-mario',
    title: 'Paper Mario',
    genre: 'RPG',
    releaseYear: 2001,
    region: 'PAL',
    rarity: 'uncommon',
    values: {
      moduleOnly: 80,
      withBox: 140,
      complete: 190
    }
  },
  {
    id: 'banjo-tooie',
    title: 'Banjo-Tooie',
    genre: 'Jump & Run',
    releaseYear: 2000,
    region: 'PAL',
    rarity: 'uncommon',
    values: {
      moduleOnly: 60,
      withBox: 110,
      complete: 150
    }
  },
  {
    id: 'zelda-majoras-mask',
    title: "The Legend of Zelda: Majora's Mask",
    titleGerman: "Zelda: Majora's Mask",
    genre: 'Adventure',
    releaseYear: 2000,
    region: 'PAL',
    rarity: 'uncommon',
    values: {
      moduleOnly: 70,
      withBox: 130,
      complete: 180
    }
  },
  {
    id: 'mario-party-3',
    title: 'Mario Party 3',
    genre: 'Party',
    releaseYear: 2001,
    region: 'PAL',
    rarity: 'uncommon',
    values: {
      moduleOnly: 65,
      withBox: 120,
      complete: 165
    }
  },
  {
    id: 'f-zero-x',
    title: 'F-Zero X',
    genre: 'Rennspiel',
    releaseYear: 1998,
    region: 'PAL',
    rarity: 'uncommon',
    values: {
      moduleOnly: 55,
      withBox: 100,
      complete: 140
    }
  },
  {
    id: 'star-fox-64',
    title: 'Star Fox 64',
    titleGerman: 'Lylat Wars',
    genre: 'Shooter',
    releaseYear: 1997,
    region: 'PAL',
    rarity: 'uncommon',
    values: {
      moduleOnly: 50,
      withBox: 95,
      complete: 135
    }
  },

  // Rare Games (Selten)
  {
    id: 'conkers-bad-fur-day',
    title: "Conker's Bad Fur Day",
    genre: 'Jump & Run',
    releaseYear: 2001,
    region: 'PAL',
    rarity: 'rare',
    values: {
      moduleOnly: 150,
      withBox: 280,
      complete: 380
    }
  },
  {
    id: 'harvest-moon-64',
    title: 'Harvest Moon 64',
    genre: 'Simulation',
    releaseYear: 1999,
    region: 'NTSC',
    rarity: 'rare',
    values: {
      moduleOnly: 120,
      withBox: 220,
      complete: 300
    }
  },
  {
    id: 'mario-tennis',
    title: 'Mario Tennis',
    genre: 'Sport',
    releaseYear: 2000,
    region: 'PAL',
    rarity: 'rare',
    values: {
      moduleOnly: 80,
      withBox: 150,
      complete: 210
    }
  },
  {
    id: 'pokemon-stadium',
    title: 'Pokémon Stadium',
    genre: 'Kampfspiel',
    releaseYear: 2000,
    region: 'PAL',
    rarity: 'rare',
    values: {
      moduleOnly: 70,
      withBox: 130,
      complete: 180
    }
  },
  {
    id: 'pokemon-stadium-2',
    title: 'Pokémon Stadium 2',
    genre: 'Kampfspiel',
    releaseYear: 2001,
    region: 'PAL',
    rarity: 'rare',
    values: {
      moduleOnly: 85,
      withBox: 160,
      complete: 220
    }
  },
  {
    id: 'diddy-kong-racing',
    title: 'Diddy Kong Racing',
    genre: 'Rennspiel',
    releaseYear: 1997,
    region: 'PAL',
    rarity: 'rare',
    values: {
      moduleOnly: 60,
      withBox: 115,
      complete: 160
    }
  },
  {
    id: 'kirby-64',
    title: 'Kirby 64: The Crystal Shards',
    titleGerman: 'Kirby 64',
    genre: 'Jump & Run',
    releaseYear: 2000,
    region: 'PAL',
    rarity: 'rare',
    values: {
      moduleOnly: 90,
      withBox: 170,
      complete: 240
    }
  },

  // Very Rare Games (Sehr selten)
  {
    id: 'bomberman-64-second-attack',
    title: 'Bomberman 64: The Second Attack',
    genre: 'Action',
    releaseYear: 2000,
    region: 'NTSC',
    rarity: 'very-rare',
    values: {
      moduleOnly: 300,
      withBox: 550,
      complete: 750
    }
  },
  {
    id: 'chameleon-twist-2',
    title: 'Chameleon Twist 2',
    genre: 'Jump & Run',
    releaseYear: 1999,
    region: 'NTSC',
    rarity: 'very-rare',
    values: {
      moduleOnly: 250,
      withBox: 450,
      complete: 650
    }
  },
  {
    id: 'ogre-battle-64',
    title: 'Ogre Battle 64: Person of Lordly Caliber',
    genre: 'Strategie',
    releaseYear: 2000,
    region: 'NTSC',
    rarity: 'very-rare',
    values: {
      moduleOnly: 200,
      withBox: 380,
      complete: 520
    }
  },
  {
    id: 'worms-armageddon',
    title: 'Worms Armageddon',
    genre: 'Strategie',
    releaseYear: 1999,
    region: 'PAL',
    rarity: 'very-rare',
    values: {
      moduleOnly: 180,
      withBox: 320,
      complete: 450
    }
  },
  {
    id: 'rayman-2',
    title: 'Rayman 2: The Great Escape',
    titleGerman: 'Rayman 2',
    genre: 'Jump & Run',
    releaseYear: 1999,
    region: 'PAL',
    rarity: 'very-rare',
    values: {
      moduleOnly: 160,
      withBox: 290,
      complete: 400
    }
  },

  // Ultra Rare Games (Ultra selten)
  {
    id: 'bomberman-64-sculptors-cut',
    title: "Bomberman 64: Sculptor's Cut",
    genre: 'Action',
    releaseYear: 2000,
    region: 'NTSC',
    rarity: 'ultra-rare',
    values: {
      moduleOnly: 800,
      withBox: 1500,
      complete: 2200
    }
  },
  {
    id: 'clayfighter-sculptors-cut',
    title: "ClayFighter: Sculptor's Cut",
    genre: 'Kampfspiel',
    releaseYear: 1998,
    region: 'NTSC',
    rarity: 'ultra-rare',
    values: {
      moduleOnly: 1200,
      withBox: 2200,
      complete: 3200
    }
  },
  {
    id: 'international-superstar-soccer-2000',
    title: 'International Superstar Soccer 2000',
    titleGerman: 'ISS 2000',
    genre: 'Sport',
    releaseYear: 2000,
    region: 'PAL',
    rarity: 'ultra-rare',
    values: {
      moduleOnly: 400,
      withBox: 750,
      complete: 1100
    }
  },
  {
    id: 'snowboard-kids-2',
    title: 'Snowboard Kids 2',
    genre: 'Sport',
    releaseYear: 1999,
    region: 'NTSC',
    rarity: 'ultra-rare',
    values: {
      moduleOnly: 600,
      withBox: 1100,
      complete: 1600
    }
  },
  {
    id: 'stunt-racer-64',
    title: 'Stunt Racer 64',
    genre: 'Rennspiel',
    releaseYear: 2000,
    region: 'NTSC',
    rarity: 'ultra-rare',
    values: {
      moduleOnly: 350,
      withBox: 650,
      complete: 950
    }
  },

  // Additional Common Games
  {
    id: 'wave-race-64',
    title: 'Wave Race 64',
    genre: 'Rennspiel',
    releaseYear: 1996,
    region: 'PAL',
    rarity: 'common',
    values: {
      moduleOnly: 20,
      withBox: 40,
      complete: 55
    }
  },
  {
    id: 'pilotwings-64',
    title: 'Pilotwings 64',
    genre: 'Simulation',
    releaseYear: 1996,
    region: 'PAL',
    rarity: 'common',
    values: {
      moduleOnly: 25,
      withBox: 45,
      complete: 65
    }
  },
  {
    id: 'mario-golf',
    title: 'Mario Golf',
    genre: 'Sport',
    releaseYear: 1999,
    region: 'PAL',
    rarity: 'common',
    values: {
      moduleOnly: 30,
      withBox: 55,
      complete: 75
    }
  },
  {
    id: '1080-snowboarding',
    title: '1080° Snowboarding',
    genre: 'Sport',
    releaseYear: 1998,
    region: 'PAL',
    rarity: 'common',
    values: {
      moduleOnly: 25,
      withBox: 45,
      complete: 65
    }
  },

  // Additional Uncommon Games
  {
    id: 'yoshi-story',
    title: "Yoshi's Story",
    genre: 'Jump & Run',
    releaseYear: 1998,
    region: 'PAL',
    rarity: 'uncommon',
    values: {
      moduleOnly: 45,
      withBox: 80,
      complete: 115
    }
  },
  {
    id: 'super-mario-party',
    title: 'Mario Party',
    genre: 'Party',
    releaseYear: 1999,
    region: 'PAL',
    rarity: 'uncommon',
    values: {
      moduleOnly: 35,
      withBox: 65,
      complete: 90
    }
  },
  {
    id: 'excitebike-64',
    title: 'Excitebike 64',
    genre: 'Rennspiel',
    releaseYear: 2000,
    region: 'PAL',
    rarity: 'uncommon',
    values: {
      moduleOnly: 40,
      withBox: 75,
      complete: 105
    }
  },
  {
    id: 'jet-force-gemini',
    title: 'Jet Force Gemini',
    genre: 'Shooter',
    releaseYear: 1999,
    region: 'PAL',
    rarity: 'uncommon',
    values: {
      moduleOnly: 55,
      withBox: 100,
      complete: 140
    }
  },

  // Additional Rare Games
  {
    id: 'sin-punishment',
    title: 'Sin and Punishment',
    genre: 'Shooter',
    releaseYear: 2000,
    region: 'NTSC',
    rarity: 'rare',
    values: {
      moduleOnly: 100,
      withBox: 180,
      complete: 250
    }
  },
  {
    id: 'custom-robo',
    title: 'Custom Robo',
    genre: 'Action',
    releaseYear: 1999,
    region: 'NTSC',
    rarity: 'rare',
    values: {
      moduleOnly: 90,
      withBox: 160,
      complete: 220
    }
  },
  {
    id: 'space-station-silicon-valley',
    title: 'Space Station Silicon Valley',
    genre: 'Puzzle',
    releaseYear: 1998,
    region: 'PAL',
    rarity: 'rare',
    values: {
      moduleOnly: 75,
      withBox: 140,
      complete: 190
    }
  },
  {
    id: 'beetle-adventure-racing',
    title: 'Beetle Adventure Racing',
    genre: 'Rennspiel',
    releaseYear: 1999,
    region: 'PAL',
    rarity: 'rare',
    values: {
      moduleOnly: 65,
      withBox: 120,
      complete: 165
    }
  },

  // Additional Very Rare Games
  {
    id: 'rakuga-kids',
    title: 'Rakuga Kids',
    genre: 'Kampfspiel',
    releaseYear: 1998,
    region: 'PAL',
    rarity: 'very-rare',
    values: {
      moduleOnly: 200,
      withBox: 350,
      complete: 480
    }
  },
  {
    id: 'goemon-great-adventure',
    title: "Goemon's Great Adventure",
    genre: 'Jump & Run',
    releaseYear: 1999,
    region: 'NTSC',
    rarity: 'very-rare',
    values: {
      moduleOnly: 180,
      withBox: 320,
      complete: 450
    }
  },
  {
    id: 'mischief-makers',
    title: 'Mischief Makers',
    genre: 'Jump & Run',
    releaseYear: 1997,
    region: 'PAL',
    rarity: 'very-rare',
    values: {
      moduleOnly: 150,
      withBox: 280,
      complete: 380
    }
  }
];

// Helper functions
export const getRarityColor = (rarity: N64Game['rarity']): string => {
  switch (rarity) {
    case 'common': return 'text-green-400';
    case 'uncommon': return 'text-blue-400';
    case 'rare': return 'text-purple-400';
    case 'very-rare': return 'text-orange-400';
    case 'ultra-rare': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

export const getRarityLabel = (rarity: N64Game['rarity']): string => {
  switch (rarity) {
    case 'common': return 'Häufig';
    case 'uncommon': return 'Ungewöhnlich';
    case 'rare': return 'Selten';
    case 'very-rare': return 'Sehr selten';
    case 'ultra-rare': return 'Ultra selten';
    default: return 'Unbekannt';
  }
};

export const getGameValue = (game: N64Game, collectedGame: CollectedGame): number => {
  const { hasBox, hasManual, hasModule } = collectedGame;
  
  if (hasModule && hasBox && hasManual) {
    return game.values.complete;
  } else if (hasModule && hasBox) {
    return game.values.withBox;
  } else if (hasModule) {
    return game.values.moduleOnly;
  }
  
  return 0;
};

export const searchGames = (games: N64Game[], query: string): N64Game[] => {
  if (!query) return games;
  
  const lowercaseQuery = query.toLowerCase();
  return games.filter(game => 
    game.title.toLowerCase().includes(lowercaseQuery) ||
    game.titleGerman?.toLowerCase().includes(lowercaseQuery) ||
    game.genre.toLowerCase().includes(lowercaseQuery)
  );
};

export const filterByRarity = (games: N64Game[], rarity: string): N64Game[] => {
  if (!rarity || rarity === 'all') return games;
  return games.filter(game => game.rarity === rarity);
};

export const filterByGenre = (games: N64Game[], genre: string): N64Game[] => {
  if (!genre || genre === 'all') return games;
  return games.filter(game => game.genre === genre);
};

export const getUniqueGenres = (games: N64Game[]): string[] => {
  const genres = games.map(game => game.genre);
  return Array.from(new Set(genres)).sort();
};

export const getCollectorLevel = (collectedCount: number): { level: number; title: string; nextLevel?: { count: number; title: string } } => {
  const levels = [
    { min: 0, max: 4, level: 1, title: 'Rookie Sammler' },
    { min: 5, max: 9, level: 2, title: 'Anfänger' },
    { min: 10, max: 19, level: 3, title: 'Enthusiast' },
    { min: 20, max: 29, level: 4, title: 'Sammler' },
    { min: 30, max: 49, level: 5, title: 'Retro Kenner' },
    { min: 50, max: 74, level: 6, title: 'Mario Experte' },
    { min: 75, max: 99, level: 7, title: 'Zelda Meister' },
    { min: 100, max: 149, level: 8, title: 'Elite Sammler' },
    { min: 150, max: 199, level: 9, title: 'Master Sammler' },
    { min: 200, max: Infinity, level: 10, title: 'N64 Legende' }
  ];
  
  const currentLevel = levels.find(l => collectedCount >= l.min && collectedCount <= l.max);
  const nextLevelIndex = levels.findIndex(l => l === currentLevel) + 1;
  const nextLevel = nextLevelIndex < levels.length ? levels[nextLevelIndex] : undefined;
  
  return {
    level: currentLevel?.level || 1,
    title: currentLevel?.title || 'Rookie Sammler',
    nextLevel: nextLevel ? { count: nextLevel.min, title: nextLevel.title } : undefined
  };
};