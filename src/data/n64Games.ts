export interface N64Game {
  id: string
  title: string
  region: 'PAL' | 'NTSC' | 'NTSC-J'
  releaseYear: number
  genre: string
  rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'ultra-rare'
  estimatedValue: {
    module: number
    withBox: number
    complete: number
  }
  boxartUrl?: string
}

export const n64Games: N64Game[] = [
  // Popular/Common Games
  {
    id: 'super-mario-64',
    title: 'Super Mario 64',
    region: 'PAL',
    releaseYear: 1996,
    genre: 'Platform',
    rarity: 'common',
    estimatedValue: {
      module: 25,
      withBox: 80,
      complete: 120
    }
  },
  {
    id: 'mario-kart-64',
    title: 'Mario Kart 64',
    region: 'PAL',
    releaseYear: 1997,
    genre: 'Racing',
    rarity: 'common',
    estimatedValue: {
      module: 30,
      withBox: 90,
      complete: 140
    }
  },
  {
    id: 'zelda-ocarina-of-time',
    title: 'The Legend of Zelda: Ocarina of Time',
    region: 'PAL',
    releaseYear: 1998,
    genre: 'Adventure',
    rarity: 'common',
    estimatedValue: {
      module: 35,
      withBox: 100,
      complete: 160
    }
  },
  {
    id: 'zelda-majoras-mask',
    title: 'The Legend of Zelda: Majora\'s Mask',
    region: 'PAL',
    releaseYear: 2000,
    genre: 'Adventure',
    rarity: 'uncommon',
    estimatedValue: {
      module: 50,
      withBox: 150,
      complete: 220
    }
  },
  {
    id: 'goldeneye-007',
    title: 'GoldenEye 007',
    region: 'PAL',
    releaseYear: 1997,
    genre: 'Shooter',
    rarity: 'common',
    estimatedValue: {
      module: 25,
      withBox: 85,
      complete: 130
    }
  },
  {
    id: 'super-smash-bros',
    title: 'Super Smash Bros.',
    region: 'PAL',
    releaseYear: 1999,
    genre: 'Fighting',
    rarity: 'common',
    estimatedValue: {
      module: 40,
      withBox: 110,
      complete: 170
    }
  },
  {
    id: 'donkey-kong-64',
    title: 'Donkey Kong 64',
    region: 'PAL',
    releaseYear: 1999,
    genre: 'Platform',
    rarity: 'common',
    estimatedValue: {
      module: 30,
      withBox: 95,
      complete: 150
    }
  },
  {
    id: 'banjo-kazooie',
    title: 'Banjo-Kazooie',
    region: 'PAL',
    releaseYear: 1998,
    genre: 'Platform',
    rarity: 'uncommon',
    estimatedValue: {
      module: 45,
      withBox: 120,
      complete: 190
    }
  },
  {
    id: 'banjo-tooie',
    title: 'Banjo-Tooie',
    region: 'PAL',
    releaseYear: 2000,
    genre: 'Platform',
    rarity: 'uncommon',
    estimatedValue: {
      module: 55,
      withBox: 140,
      complete: 220
    }
  },
  {
    id: 'paper-mario',
    title: 'Paper Mario',
    region: 'PAL',
    releaseYear: 2001,
    genre: 'RPG',
    rarity: 'uncommon',
    estimatedValue: {
      module: 60,
      withBox: 160,
      complete: 250
    }
  },
  {
    id: 'mario-party',
    title: 'Mario Party',
    region: 'PAL',
    releaseYear: 1999,
    genre: 'Party',
    rarity: 'common',
    estimatedValue: {
      module: 35,
      withBox: 100,
      complete: 160
    }
  },
  {
    id: 'mario-party-2',
    title: 'Mario Party 2',
    region: 'PAL',
    releaseYear: 2000,
    genre: 'Party',
    rarity: 'common',
    estimatedValue: {
      module: 40,
      withBox: 110,
      complete: 170
    }
  },
  {
    id: 'mario-party-3',
    title: 'Mario Party 3',
    region: 'PAL',
    releaseYear: 2001,
    genre: 'Party',
    rarity: 'uncommon',
    estimatedValue: {
      module: 50,
      withBox: 130,
      complete: 200
    }
  },
  {
    id: 'f-zero-x',
    title: 'F-Zero X',
    region: 'PAL',
    releaseYear: 1998,
    genre: 'Racing',
    rarity: 'uncommon',
    estimatedValue: {
      module: 35,
      withBox: 100,
      complete: 160
    }
  },
  {
    id: 'star-fox-64',
    title: 'Star Fox 64',
    region: 'PAL',
    releaseYear: 1997,
    genre: 'Shooter',
    rarity: 'common',
    estimatedValue: {
      module: 30,
      withBox: 90,
      complete: 140
    }
  },
  {
    id: 'perfect-dark',
    title: 'Perfect Dark',
    region: 'PAL',
    releaseYear: 2000,
    genre: 'Shooter',
    rarity: 'uncommon',
    estimatedValue: {
      module: 40,
      withBox: 110,
      complete: 170
    }
  },
  {
    id: 'diddy-kong-racing',
    title: 'Diddy Kong Racing',
    region: 'PAL',
    releaseYear: 1997,
    genre: 'Racing',
    rarity: 'common',
    estimatedValue: {
      module: 25,
      withBox: 80,
      complete: 130
    }
  },
  {
    id: 'wave-race-64',
    title: 'Wave Race 64',
    region: 'PAL',
    releaseYear: 1996,
    genre: 'Racing',
    rarity: 'common',
    estimatedValue: {
      module: 20,
      withBox: 70,
      complete: 110
    }
  },
  {
    id: 'pilotwings-64',
    title: 'Pilotwings 64',
    region: 'PAL',
    releaseYear: 1996,
    genre: 'Simulation',
    rarity: 'common',
    estimatedValue: {
      module: 20,
      withBox: 65,
      complete: 100
    }
  },
  {
    id: 'yoshi-story',
    title: 'Yoshi\'s Story',
    region: 'PAL',
    releaseYear: 1998,
    genre: 'Platform',
    rarity: 'common',
    estimatedValue: {
      module: 25,
      withBox: 75,
      complete: 120
    }
  },
  // Rare Games
  {
    id: 'conkers-bad-fur-day',
    title: 'Conker\'s Bad Fur Day',
    region: 'PAL',
    releaseYear: 2001,
    genre: 'Platform',
    rarity: 'rare',
    estimatedValue: {
      module: 120,
      withBox: 300,
      complete: 450
    }
  },
  {
    id: 'harvest-moon-64',
    title: 'Harvest Moon 64',
    region: 'PAL',
    releaseYear: 1999,
    genre: 'Simulation',
    rarity: 'rare',
    estimatedValue: {
      module: 80,
      withBox: 200,
      complete: 320
    }
  },
  {
    id: 'ogre-battle-64',
    title: 'Ogre Battle 64',
    region: 'PAL',
    releaseYear: 2000,
    genre: 'Strategy',
    rarity: 'rare',
    estimatedValue: {
      module: 100,
      withBox: 250,
      complete: 400
    }
  },
  {
    id: 'bomberman-64-second-attack',
    title: 'Bomberman 64: The Second Attack',
    region: 'PAL',
    releaseYear: 2000,
    genre: 'Action',
    rarity: 'very-rare',
    estimatedValue: {
      module: 200,
      withBox: 500,
      complete: 800
    }
  },
  {
    id: 'sculptors-cut',
    title: 'Bomberman 64: Sculptor\'s Cut',
    region: 'NTSC',
    releaseYear: 2000,
    genre: 'Action',
    rarity: 'ultra-rare',
    estimatedValue: {
      module: 800,
      withBox: 2000,
      complete: 3500
    }
  },
  {
    id: 'clayfighter-sculptors-cut',
    title: 'ClayFighter: Sculptor\'s Cut',
    region: 'NTSC',
    releaseYear: 1998,
    genre: 'Fighting',
    rarity: 'ultra-rare',
    estimatedValue: {
      module: 600,
      withBox: 1500,
      complete: 2500
    }
  },
  {
    id: 'worms-armageddon',
    title: 'Worms Armageddon',
    region: 'PAL',
    releaseYear: 1999,
    genre: 'Strategy',
    rarity: 'rare',
    estimatedValue: {
      module: 90,
      withBox: 220,
      complete: 350
    }
  },
  {
    id: 'pokemon-stadium',
    title: 'Pokémon Stadium',
    region: 'PAL',
    releaseYear: 2000,
    genre: 'RPG',
    rarity: 'common',
    estimatedValue: {
      module: 30,
      withBox: 85,
      complete: 140
    }
  },
  {
    id: 'pokemon-stadium-2',
    title: 'Pokémon Stadium 2',
    region: 'PAL',
    releaseYear: 2001,
    genre: 'RPG',
    rarity: 'uncommon',
    estimatedValue: {
      module: 45,
      withBox: 120,
      complete: 190
    }
  },
  {
    id: 'pokemon-snap',
    title: 'Pokémon Snap',
    region: 'PAL',
    releaseYear: 1999,
    genre: 'Simulation',
    rarity: 'common',
    estimatedValue: {
      module: 25,
      withBox: 80,
      complete: 130
    }
  },
  // Additional popular games
  {
    id: 'resident-evil-2',
    title: 'Resident Evil 2',
    region: 'PAL',
    releaseYear: 1999,
    genre: 'Survival Horror',
    rarity: 'uncommon',
    estimatedValue: {
      module: 60,
      withBox: 150,
      complete: 240
    }
  },
  {
    id: 'turok-dinosaur-hunter',
    title: 'Turok: Dinosaur Hunter',
    region: 'PAL',
    releaseYear: 1997,
    genre: 'Shooter',
    rarity: 'common',
    estimatedValue: {
      module: 20,
      withBox: 60,
      complete: 100
    }
  },
  {
    id: 'turok-2',
    title: 'Turok 2: Seeds of Evil',
    region: 'PAL',
    releaseYear: 1998,
    genre: 'Shooter',
    rarity: 'common',
    estimatedValue: {
      module: 25,
      withBox: 70,
      complete: 110
    }
  },
  {
    id: 'doom-64',
    title: 'Doom 64',
    region: 'PAL',
    releaseYear: 1997,
    genre: 'Shooter',
    rarity: 'uncommon',
    estimatedValue: {
      module: 45,
      withBox: 120,
      complete: 190
    }
  },
  {
    id: 'quake-64',
    title: 'Quake 64',
    region: 'PAL',
    releaseYear: 1998,
    genre: 'Shooter',
    rarity: 'uncommon',
    estimatedValue: {
      module: 50,
      withBox: 130,
      complete: 200
    }
  },
  {
    id: 'mortal-kombat-trilogy',
    title: 'Mortal Kombat Trilogy',
    region: 'PAL',
    releaseYear: 1996,
    genre: 'Fighting',
    rarity: 'common',
    estimatedValue: {
      module: 30,
      withBox: 85,
      complete: 140
    }
  },
  {
    id: 'killer-instinct-gold',
    title: 'Killer Instinct Gold',
    region: 'PAL',
    releaseYear: 1996,
    genre: 'Fighting',
    rarity: 'common',
    estimatedValue: {
      module: 25,
      withBox: 75,
      complete: 120
    }
  },
  {
    id: 'wwf-no-mercy',
    title: 'WWF No Mercy',
    region: 'PAL',
    releaseYear: 2000,
    genre: 'Sports',
    rarity: 'uncommon',
    estimatedValue: {
      module: 40,
      withBox: 110,
      complete: 170
    }
  },
  {
    id: 'tony-hawk-pro-skater',
    title: 'Tony Hawk\'s Pro Skater',
    region: 'PAL',
    releaseYear: 1999,
    genre: 'Sports',
    rarity: 'common',
    estimatedValue: {
      module: 20,
      withBox: 65,
      complete: 105
    }
  },
  {
    id: 'tony-hawk-pro-skater-2',
    title: 'Tony Hawk\'s Pro Skater 2',
    region: 'PAL',
    releaseYear: 2001,
    genre: 'Sports',
    rarity: 'common',
    estimatedValue: {
      module: 25,
      withBox: 70,
      complete: 115
    }
  },
  {
    id: 'tony-hawk-pro-skater-3',
    title: 'Tony Hawk\'s Pro Skater 3',
    region: 'PAL',
    releaseYear: 2002,
    genre: 'Sports',
    rarity: 'uncommon',
    estimatedValue: {
      module: 35,
      withBox: 90,
      complete: 150
    }
  },
  {
    id: 'excitebike-64',
    title: 'Excitebike 64',
    region: 'PAL',
    releaseYear: 2000,
    genre: 'Racing',
    rarity: 'common',
    estimatedValue: {
      module: 20,
      withBox: 60,
      complete: 100
    }
  },
  {
    id: 'kirby-64',
    title: 'Kirby 64: The Crystal Shards',
    region: 'PAL',
    releaseYear: 2001,
    genre: 'Platform',
    rarity: 'common',
    estimatedValue: {
      module: 30,
      withBox: 85,
      complete: 140
    }
  },
  {
    id: 'rayman-2',
    title: 'Rayman 2: The Great Escape',
    region: 'PAL',
    releaseYear: 1999,
    genre: 'Platform',
    rarity: 'common',
    estimatedValue: {
      module: 25,
      withBox: 75,
      complete: 120
    }
  },
  {
    id: 'castlevania-64',
    title: 'Castlevania',
    region: 'PAL',
    releaseYear: 1999,
    genre: 'Action',
    rarity: 'uncommon',
    estimatedValue: {
      module: 50,
      withBox: 130,
      complete: 200
    }
  },
  {
    id: 'castlevania-legacy-of-darkness',
    title: 'Castlevania: Legacy of Darkness',
    region: 'PAL',
    releaseYear: 1999,
    genre: 'Action',
    rarity: 'rare',
    estimatedValue: {
      module: 80,
      withBox: 200,
      complete: 320
    }
  },
  {
    id: 'jet-force-gemini',
    title: 'Jet Force Gemini',
    region: 'PAL',
    releaseYear: 1999,
    genre: 'Action',
    rarity: 'uncommon',
    estimatedValue: {
      module: 35,
      withBox: 95,
      complete: 150
    }
  },
  {
    id: 'blast-corps',
    title: 'Blast Corps',
    region: 'PAL',
    releaseYear: 1997,
    genre: 'Action',
    rarity: 'uncommon',
    estimatedValue: {
      module: 30,
      withBox: 85,
      complete: 140
    }
  },
  {
    id: 'mischief-makers',
    title: 'Mischief Makers',
    region: 'PAL',
    releaseYear: 1997,
    genre: 'Platform',
    rarity: 'rare',
    estimatedValue: {
      module: 70,
      withBox: 180,
      complete: 290
    }
  },
  {
    id: 'rocket-robot-on-wheels',
    title: 'Rocket: Robot on Wheels',
    region: 'PAL',
    releaseYear: 1999,
    genre: 'Platform',
    rarity: 'rare',
    estimatedValue: {
      module: 90,
      withBox: 220,
      complete: 350
    }
  },
  {
    id: 'space-station-silicon-valley',
    title: 'Space Station Silicon Valley',
    region: 'PAL',
    releaseYear: 1998,
    genre: 'Platform',
    rarity: 'rare',
    estimatedValue: {
      module: 100,
      withBox: 250,
      complete: 400
    }
  },
  {
    id: 'glover',
    title: 'Glover',
    region: 'PAL',
    releaseYear: 1998,
    genre: 'Platform',
    rarity: 'uncommon',
    estimatedValue: {
      module: 40,
      withBox: 110,
      complete: 170
    }
  },
  {
    id: 'chameleon-twist',
    title: 'Chameleon Twist',
    region: 'PAL',
    releaseYear: 1997,
    genre: 'Platform',
    rarity: 'rare',
    estimatedValue: {
      module: 80,
      withBox: 200,
      complete: 320
    }
  },
  {
    id: 'chameleon-twist-2',
    title: 'Chameleon Twist 2',
    region: 'PAL',
    releaseYear: 1999,
    genre: 'Platform',
    rarity: 'very-rare',
    estimatedValue: {
      module: 150,
      withBox: 400,
      complete: 650
    }
  },
  {
    id: 'snowboard-kids',
    title: 'Snowboard Kids',
    region: 'PAL',
    releaseYear: 1998,
    genre: 'Racing',
    rarity: 'uncommon',
    estimatedValue: {
      module: 45,
      withBox: 120,
      complete: 190
    }
  },
  {
    id: 'snowboard-kids-2',
    title: 'Snowboard Kids 2',
    region: 'PAL',
    releaseYear: 1999,
    genre: 'Racing',
    rarity: 'rare',
    estimatedValue: {
      module: 90,
      withBox: 230,
      complete: 370
    }
  },
  {
    id: 'beetle-adventure-racing',
    title: 'Beetle Adventure Racing',
    region: 'PAL',
    releaseYear: 1999,
    genre: 'Racing',
    rarity: 'uncommon',
    estimatedValue: {
      module: 35,
      withBox: 95,
      complete: 150
    }
  },
  {
    id: 'rush-2049',
    title: 'San Francisco Rush 2049',
    region: 'PAL',
    releaseYear: 2000,
    genre: 'Racing',
    rarity: 'uncommon',
    estimatedValue: {
      module: 40,
      withBox: 110,
      complete: 170
    }
  }
]

export const getTotalN64Games = () => n64Games.length

export const getGamesByRarity = (rarity: N64Game['rarity']) => 
  n64Games.filter(game => game.rarity === rarity)

export const getGameByTitle = (title: string) => 
  n64Games.find(game => game.title.toLowerCase().includes(title.toLowerCase()))

export const searchGames = (query: string) => 
  n64Games.filter(game => 
    game.title.toLowerCase().includes(query.toLowerCase()) ||
    game.genre.toLowerCase().includes(query.toLowerCase())
  )

export const getRarityColor = (rarity: N64Game['rarity']) => {
  switch (rarity) {
    case 'common': return 'text-gray-400'
    case 'uncommon': return 'text-green-400'
    case 'rare': return 'text-blue-400'
    case 'very-rare': return 'text-purple-400'
    case 'ultra-rare': return 'text-yellow-400'
    default: return 'text-gray-400'
  }
}

export const getRarityBgColor = (rarity: N64Game['rarity']) => {
  switch (rarity) {
    case 'common': return 'bg-gray-600/20 border-gray-600/50'
    case 'uncommon': return 'bg-green-600/20 border-green-600/50'
    case 'rare': return 'bg-blue-600/20 border-blue-600/50'
    case 'very-rare': return 'bg-purple-600/20 border-purple-600/50'
    case 'ultra-rare': return 'bg-yellow-600/20 border-yellow-600/50'
    default: return 'bg-gray-600/20 border-gray-600/50'
  }
}