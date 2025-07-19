export interface N64RacingTrack {
  id: string
  name: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  length: number // in meters
  worldRecord: {
    time: string
    player: string
    date: string
    video?: string
  }
  personalBest?: {
    time: string
    date: string
  }
}

export interface N64RacingGame {
  id: string
  title: string
  releaseYear: number
  developer: string
  rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'ultra-rare'
  speedrunCategories: string[]
  tracks: N64RacingTrack[]
  boxartUrl?: string
  description: string
  activeSpeedrunners: number
}

export const n64RacingGames: N64RacingGame[] = [
  {
    id: 'mario-kart-64',
    title: 'Mario Kart 64',
    releaseYear: 1997,
    developer: 'Nintendo',
    rarity: 'common',
    speedrunCategories: ['150cc All Cups', 'Time Trials', 'Battle Mode', 'Any%'],
    description: 'Das legendäre Kart-Rennspiel mit den ikonischsten Strecken der N64-Ära.',
    activeSpeedrunners: 2847,
    tracks: [
      {
        id: 'luigi-raceway',
        name: 'Luigi Raceway',
        difficulty: 'easy',
        length: 1024,
        worldRecord: {
          time: '1:52.863',
          player: 'abney317',
          date: '2023-11-15',
          video: 'https://www.youtube.com/watch?v=example1'
        }
      },
      {
        id: 'moo-moo-farm',
        name: 'Moo Moo Farm',
        difficulty: 'easy',
        length: 967,
        worldRecord: {
          time: '1:35.962',
          player: 'Weatherton',
          date: '2023-08-22'
        }
      },
      {
        id: 'koopa-troopa-beach',
        name: 'Koopa Troopa Beach',
        difficulty: 'medium',
        length: 1156,
        worldRecord: {
          time: '1:47.315',
          player: 'Matthias',
          date: '2023-10-03'
        }
      },
      {
        id: 'kalimari-desert',
        name: 'Kalimari Desert',
        difficulty: 'medium',
        length: 1245,
        worldRecord: {
          time: '2:03.847',
          player: 'Beck Abney',
          date: '2023-09-11'
        }
      },
      {
        id: 'toads-turnpike',
        name: "Toad's Turnpike",
        difficulty: 'hard',
        length: 1398,
        worldRecord: {
          time: '1:49.052',
          player: 'VAJ',
          date: '2023-12-01'
        }
      },
      {
        id: 'frappe-snowland',
        name: 'Frappe Snowland',
        difficulty: 'medium',
        length: 1187,
        worldRecord: {
          time: '2:07.934',
          player: 'MR',
          date: '2023-07-19'
        }
      },
      {
        id: 'choco-mountain',
        name: 'Choco Mountain',
        difficulty: 'hard',
        length: 1289,
        worldRecord: {
          time: '2:16.436',
          player: 'TAS',
          date: '2023-11-28'
        }
      },
      {
        id: 'mario-raceway',
        name: 'Mario Raceway',
        difficulty: 'easy',
        length: 1034,
        worldRecord: {
          time: '1:30.162',
          player: 'Dan',
          date: '2023-06-14'
        }
      },
      {
        id: 'wario-stadium',
        name: 'Wario Stadium',
        difficulty: 'expert',
        length: 1567,
        worldRecord: {
          time: '2:09.713',
          player: 'Lacey',
          date: '2023-10-27'
        }
      },
      {
        id: 'sherbet-land',
        name: 'Sherbet Land',
        difficulty: 'hard',
        length: 1423,
        worldRecord: {
          time: '2:35.041',
          player: 'Connor',
          date: '2023-05-30'
        }
      },
      {
        id: 'royal-raceway',
        name: 'Royal Raceway',
        difficulty: 'medium',
        length: 1678,
        worldRecord: {
          time: '2:56.319',
          player: 'Beck Abney',
          date: '2023-09-08'
        }
      },
      {
        id: 'bowsers-castle',
        name: "Bowser's Castle",
        difficulty: 'expert',
        length: 1445,
        worldRecord: {
          time: '3:01.842',
          player: 'Weatherton',
          date: '2023-11-03'
        }
      },
      {
        id: 'dk-jungle-parkway',
        name: 'DK Jungle Parkway',
        difficulty: 'hard',
        length: 1589,
        worldRecord: {
          time: '2:58.317',
          player: 'abney317',
          date: '2023-08-15'
        }
      },
      {
        id: 'yoshi-valley',
        name: 'Yoshi Valley',
        difficulty: 'expert',
        length: 1324,
        worldRecord: {
          time: '3:06.834',
          player: 'MR',
          date: '2023-12-05'
        }
      },
      {
        id: 'banshee-boardwalk',
        name: 'Banshee Boardwalk',
        difficulty: 'hard',
        length: 1456,
        worldRecord: {
          time: '2:43.058',
          player: 'VAJ',
          date: '2023-07-22'
        }
      },
      {
        id: 'rainbow-road',
        name: 'Rainbow Road',
        difficulty: 'expert',
        length: 2000,
        worldRecord: {
          time: '5:54.173',
          player: 'Matthias',
          date: '2023-10-31'
        }
      }
    ]
  },
  {
    id: 'diddy-kong-racing',
    title: 'Diddy Kong Racing',
    releaseYear: 1997,
    developer: 'Rare',
    rarity: 'common',
    speedrunCategories: ['Any%', '100%', 'Adventure Mode', 'Time Trials'],
    description: 'Rares Antwort auf Mario Kart mit Hovercrafts, Flugzeugen und innovativen Strecken.',
    activeSpeedrunners: 1243,
    tracks: [
      {
        id: 'ancient-lake',
        name: 'Ancient Lake',
        difficulty: 'easy',
        length: 1187,
        worldRecord: {
          time: '1:43.62',
          player: 'TheTrueBrawler',
          date: '2023-09-14'
        }
      },
      {
        id: 'fossil-canyon',
        name: 'Fossil Canyon',
        difficulty: 'medium',
        length: 1289,
        worldRecord: {
          time: '1:52.89',
          player: 'Swordless Link',
          date: '2023-11-08'
        }
      },
      {
        id: 'jungle-falls',
        name: 'Jungle Falls',
        difficulty: 'medium',
        length: 1156,
        worldRecord: {
          time: '1:24.73',
          player: 'Pyrmon',
          date: '2023-07-30'
        }
      },
      {
        id: 'hot-top-volcano',
        name: 'Hot Top Volcano',
        difficulty: 'hard',
        length: 1367,
        worldRecord: {
          time: '2:01.45',
          player: 'TheTrueBrawler',
          date: '2023-10-12'
        }
      },
      {
        id: 'everfrost-peak',
        name: 'Everfrost Peak',
        difficulty: 'hard',
        length: 1445,
        worldRecord: {
          time: '1:48.91',
          player: 'Swordless Link',
          date: '2023-08-17'
        }
      },
      {
        id: 'walrus-cove',
        name: 'Walrus Cove',
        difficulty: 'medium',
        length: 1234,
        worldRecord: {
          time: '2:05.38',
          player: 'Pyrmon',
          date: '2023-12-02'
        }
      },
      {
        id: 'snowball-valley',
        name: 'Snowball Valley',
        difficulty: 'expert',
        length: 1567,
        worldRecord: {
          time: '1:59.72',
          player: 'TheTrueBrawler',
          date: '2023-06-25'
        }
      },
      {
        id: 'sherbet-island',
        name: 'Sherbet Island',
        difficulty: 'hard',
        length: 1398,
        worldRecord: {
          time: '1:33.84',
          player: 'Swordless Link',
          date: '2023-09-03'
        }
      },
      {
        id: 'crescent-island',
        name: 'Crescent Island',
        difficulty: 'medium',
        length: 1289,
        worldRecord: {
          time: '1:54.67',
          player: 'Pyrmon',
          date: '2023-11-19'
        }
      },
      {
        id: 'pirate-lagoon',
        name: 'Pirate Lagoon',
        difficulty: 'hard',
        length: 1456,
        worldRecord: {
          time: '1:28.95',
          player: 'TheTrueBrawler',
          date: '2023-07-08'
        }
      },
      {
        id: 'treasure-caves',
        name: 'Treasure Caves',
        difficulty: 'expert',
        length: 1523,
        worldRecord: {
          time: '1:41.23',
          player: 'Swordless Link',
          date: '2023-10-26'
        }
      },
      {
        id: 'windmill-plains',
        name: 'Windmill Plains',
        difficulty: 'easy',
        length: 1098,
        worldRecord: {
          time: '1:35.47',
          player: 'Pyrmon',
          date: '2023-08-31'
        }
      },
      {
        id: 'greenwood-village',
        name: 'Greenwood Village',
        difficulty: 'medium',
        length: 1267,
        worldRecord: {
          time: '1:43.89',
          player: 'TheTrueBrawler',
          date: '2023-12-10'
        }
      },
      {
        id: 'boulder-canyon',
        name: 'Boulder Canyon',
        difficulty: 'hard',
        length: 1389,
        worldRecord: {
          time: '2:12.56',
          player: 'Swordless Link',
          date: '2023-05-18'
        }
      },
      {
        id: 'haunted-woods',
        name: 'Haunted Woods',
        difficulty: 'expert',
        length: 1634,
        worldRecord: {
          time: '2:07.34',
          player: 'Pyrmon',
          date: '2023-10-31'
        }
      },
      {
        id: 'spaceland-alpha',
        name: 'Spaceland Alpha',
        difficulty: 'expert',
        length: 1789,
        worldRecord: {
          time: '2:34.91',
          player: 'TheTrueBrawler',
          date: '2023-09-27'
        }
      }
    ]
  },
  {
    id: 'f-zero-x',
    title: 'F-Zero X',
    releaseYear: 1998,
    developer: 'Nintendo',
    rarity: 'uncommon',
    speedrunCategories: ['Jack Cup', 'Queen Cup', 'King Cup', 'Joker Cup', 'X Cup'],
    description: 'Futuristische Hochgeschwindigkeitsrennen mit 30 Fahrzeugen gleichzeitig auf der Strecke.',
    activeSpeedrunners: 892,
    tracks: [
      {
        id: 'mute-city-i',
        name: 'Mute City I',
        difficulty: 'easy',
        length: 1456,
        worldRecord: {
          time: '1:29.847',
          player: 'CGN',
          date: '2023-11-22'
        }
      },
      {
        id: 'big-blue',
        name: 'Big Blue',
        difficulty: 'medium',
        length: 1634,
        worldRecord: {
          time: '1:42.315',
          player: 'yoshifan',
          date: '2023-10-15'
        }
      },
      {
        id: 'sand-ocean',
        name: 'Sand Ocean',
        difficulty: 'medium',
        length: 1523,
        worldRecord: {
          time: '1:38.924',
          player: 'CGN',
          date: '2023-09-08'
        }
      },
      {
        id: 'death-wind-i',
        name: 'Death Wind I',
        difficulty: 'hard',
        length: 1789,
        worldRecord: {
          time: '2:03.672',
          player: 'yoshifan',
          date: '2023-12-03'
        }
      },
      {
        id: 'port-town-i',
        name: 'Port Town I',
        difficulty: 'medium',
        length: 1367,
        worldRecord: {
          time: '1:33.158',
          player: 'CGN',
          date: '2023-08-19'
        }
      },
      {
        id: 'red-canyon-i',
        name: 'Red Canyon I',
        difficulty: 'hard',
        length: 1678,
        worldRecord: {
          time: '1:51.743',
          player: 'yoshifan',
          date: '2023-07-11'
        }
      }
    ]
  },
  {
    id: 'san-francisco-rush',
    title: 'San Francisco Rush: Extreme Racing',
    releaseYear: 1997,
    developer: 'Atari Games',
    rarity: 'uncommon',
    speedrunCategories: ['Circuit Mode', 'Practice Mode', 'Stunt Mode'],
    description: 'Arcade-Rennspiel mit verrückten Stunts und realistischen San Francisco Straßen.',
    activeSpeedrunners: 456,
    tracks: [
      {
        id: 'financial-district',
        name: 'Financial District',
        difficulty: 'medium',
        length: 1834,
        worldRecord: {
          time: '2:45.892',
          player: 'RushMaster',
          date: '2023-10-28'
        }
      },
      {
        id: 'presidio',
        name: 'Presidio',
        difficulty: 'hard',
        length: 1967,
        worldRecord: {
          time: '3:12.456',
          player: 'SFSpeedster',
          date: '2023-09-15'
        }
      },
      {
        id: 'alcatraz',
        name: 'Alcatraz',
        difficulty: 'expert',
        length: 2145,
        worldRecord: {
          time: '3:34.721',
          player: 'RushMaster',
          date: '2023-11-07'
        }
      },
      {
        id: 'nob-hill',
        name: 'Nob Hill',
        difficulty: 'medium',
        length: 1723,
        worldRecord: {
          time: '2:28.634',
          player: 'SFSpeedster',
          date: '2023-08-22'
        }
      },
      {
        id: 'lombard-street',
        name: 'Lombard Street',
        difficulty: 'hard',
        length: 1589,
        worldRecord: {
          time: '2:56.183',
          player: 'RushMaster',
          date: '2023-12-01'
        }
      },
      {
        id: 'golden-gate',
        name: 'Golden Gate',
        difficulty: 'expert',
        length: 2234,
        worldRecord: {
          time: '4:02.947',
          player: 'SFSpeedster',
          date: '2023-07-30'
        }
      }
    ]
  },
  {
    id: 'star-wars-episode-i-racer',
    title: 'Star Wars Episode I: Racer',
    releaseYear: 1999,
    developer: 'LucasArts',
    rarity: 'common',
    speedrunCategories: ['Boonta Eve Classic', 'Any%', '100%', 'All Tracks'],
    description: 'Podracing aus Star Wars Episode I mit authentischen Charakteren und Strecken.',
    activeSpeedrunners: 734,
    tracks: [
      {
        id: 'boonta-eve-classic',
        name: 'Boonta Eve Classic',
        difficulty: 'medium',
        length: 1834,
        worldRecord: {
          time: '3:47.923',
          player: 'PodracerPro',
          date: '2023-11-14'
        }
      },
      {
        id: 'beedo-wild',
        name: "Beedo's Wild Ride",
        difficulty: 'hard',
        length: 1967,
        worldRecord: {
          time: '4:12.567',
          player: 'JediRacer',
          date: '2023-10-09'
        }
      },
      {
        id: 'aquilaris-classic',
        name: 'Aquilaris Classic',
        difficulty: 'medium',
        length: 1723,
        worldRecord: {
          time: '3:28.891',
          player: 'PodracerPro',
          date: '2023-09-21'
        }
      },
      {
        id: 'malastare-100',
        name: 'Malastare 100',
        difficulty: 'expert',
        length: 2145,
        worldRecord: {
          time: '5:23.456',
          player: 'JediRacer',
          date: '2023-12-08'
        }
      },
      {
        id: 'vengeance',
        name: 'Vengeance',
        difficulty: 'expert',
        length: 2234,
        worldRecord: {
          time: '4:56.732',
          player: 'PodracerPro',
          date: '2023-08-17'
        }
      },
      {
        id: 'spice-mine-run',
        name: 'Spice Mine Run',
        difficulty: 'hard',
        length: 1889,
        worldRecord: {
          time: '4:34.218',
          player: 'JediRacer',
          date: '2023-07-25'
        }
      }
    ]
  },
  {
    id: 'wave-race-64',
    title: 'Wave Race 64',
    releaseYear: 1996,
    developer: 'Nintendo',
    rarity: 'common',
    speedrunCategories: ['Championship Mode', 'Time Trials', 'Stunt Mode'],
    description: 'Realistisches Jetski-Rennspiel mit revolutionärer Wasserphysik.',
    activeSpeedrunners: 298,
    tracks: [
      {
        id: 'drake-lake',
        name: 'Drake Lake',
        difficulty: 'easy',
        length: 1234,
        worldRecord: {
          time: '2:12.456',
          player: 'WaveRider',
          date: '2023-10-14'
        }
      },
      {
        id: 'sunset-bay',
        name: 'Sunset Bay',
        difficulty: 'medium',
        length: 1456,
        worldRecord: {
          time: '2:34.789',
          player: 'AquaSpeed',
          date: '2023-09-08'
        }
      },
      {
        id: 'marine-fortress',
        name: 'Marine Fortress',
        difficulty: 'hard',
        length: 1678,
        worldRecord: {
          time: '3:01.234',
          player: 'WaveRider',
          date: '2023-11-22'
        }
      },
      {
        id: 'port-blue',
        name: 'Port Blue',
        difficulty: 'expert',
        length: 1834,
        worldRecord: {
          time: '3:28.567',
          player: 'AquaSpeed',
          date: '2023-08-30'
        }
      }
    ]
  },
  {
    id: 'beetle-adventure-racing',
    title: 'Beetle Adventure Racing',
    releaseYear: 1999,
    developer: 'Paradigm Entertainment',
    rarity: 'uncommon',
    speedrunCategories: ['Adventure Mode', 'Single Race', 'Battle Mode'],
    description: 'Einzigartiges Rennspiel mit VW Käfer und riesigen, explorablen Strecken.',
    activeSpeedrunners: 167,
    tracks: [
      {
        id: 'coventry-cove',
        name: 'Coventry Cove',
        difficulty: 'medium',
        length: 2456,
        worldRecord: {
          time: '4:23.789',
          player: 'BeetleMaster',
          date: '2023-10-19'
        }
      },
      {
        id: 'mount-mayhem',
        name: 'Mount Mayhem',
        difficulty: 'hard',
        length: 2789,
        worldRecord: {
          time: '5:12.456',
          player: 'VWRacer',
          date: '2023-09-27'
        }
      },
      {
        id: 'infernal-isle',
        name: 'Infernal Isle',
        difficulty: 'expert',
        length: 3123,
        worldRecord: {
          time: '6:01.234',
          player: 'BeetleMaster',
          date: '2023-11-15'
        }
      },
      {
        id: 'sunset-sands',
        name: 'Sunset Sands',
        difficulty: 'medium',
        length: 2234,
        worldRecord: {
          time: '4:45.678',
          player: 'VWRacer',
          date: '2023-08-11'
        }
      },
      {
        id: 'metro-madness',
        name: 'Metro Madness',
        difficulty: 'hard',
        length: 2567,
        worldRecord: {
          time: '5:34.912',
          player: 'BeetleMaster',
          date: '2023-12-05'
        }
      },
      {
        id: 'wicked-woods',
        name: 'Wicked Woods',
        difficulty: 'expert',
        length: 2890,
        worldRecord: {
          time: '6:23.456',
          player: 'VWRacer',
          date: '2023-07-18'
        }
      }
    ]
  },
  {
    id: 'excitebike-64',
    title: 'Excitebike 64',
    releaseYear: 2000,
    developer: 'Left Field Productions',
    rarity: 'common',
    speedrunCategories: ['Season Mode', 'Exhibition', 'Desert', 'Indoor'],
    description: 'Motocross-Rennspiel mit Stunt-System und Track-Editor.',
    activeSpeedrunners: 234,
    tracks: [
      {
        id: 'desert-heat',
        name: 'Desert Heat',
        difficulty: 'medium',
        length: 1567,
        worldRecord: {
          time: '2:34.567',
          player: 'MotoMaster',
          date: '2023-10-22'
        }
      },
      {
        id: 'hillside-havoc',
        name: 'Hillside Havoc',
        difficulty: 'hard',
        length: 1789,
        worldRecord: {
          time: '3:12.890',
          player: 'BikeRider',
          date: '2023-09-14'
        }
      },
      {
        id: 'indoor-insanity',
        name: 'Indoor Insanity',
        difficulty: 'expert',
        length: 1234,
        worldRecord: {
          time: '2:01.456',
          player: 'MotoMaster',
          date: '2023-11-28'
        }
      },
      {
        id: 'swamp-stomp',
        name: 'Swamp Stomp',
        difficulty: 'hard',
        length: 1678,
        worldRecord: {
          time: '2:56.123',
          player: 'BikeRider',
          date: '2023-08-07'
        }
      }
    ]
  },
  {
    id: 'snowboard-kids',
    title: 'Snowboard Kids',
    releaseYear: 1997,
    developer: 'Racdym',
    rarity: 'uncommon',
    speedrunCategories: ['Story Mode', 'Battle Race', 'Time Attack'],
    description: 'Cartoon-Snowboard-Rennspiel mit Items und verrückten Tricks.',
    activeSpeedrunners: 189,
    tracks: [
      {
        id: 'grass-valley',
        name: 'Grass Valley',
        difficulty: 'easy',
        length: 1345,
        worldRecord: {
          time: '2:23.456',
          player: 'SnowPro',
          date: '2023-10-16'
        }
      },
      {
        id: 'big-snowman',
        name: 'Big Snowman',
        difficulty: 'medium',
        length: 1567,
        worldRecord: {
          time: '2:45.789',
          player: 'BoardMaster',
          date: '2023-09-29'
        }
      },
      {
        id: 'quicksand-valley',
        name: 'Quicksand Valley',
        difficulty: 'hard',
        length: 1789,
        worldRecord: {
          time: '3:12.345',
          player: 'SnowPro',
          date: '2023-11-11'
        }
      },
      {
        id: 'ninja-land',
        name: 'Ninja Land',
        difficulty: 'expert',
        length: 1923,
        worldRecord: {
          time: '3:34.678',
          player: 'BoardMaster',
          date: '2023-08-25'
        }
      }
    ]
  }
]

export const getN64RacingGameById = (id: string) => 
  n64RacingGames.find(game => game.id === id)

export const getTrackById = (gameId: string, trackId: string) => {
  const game = getN64RacingGameById(gameId)
  return game?.tracks.find(track => track.id === trackId)
}

export const getAllTracks = () => 
  n64RacingGames.flatMap(game => 
    game.tracks.map(track => ({ ...track, gameId: game.id, gameTitle: game.title }))
  )

export const getRandomTrack = (gameId?: string) => {
  if (gameId) {
    const game = getN64RacingGameById(gameId)
    if (game && game.tracks.length > 0) {
      return game.tracks[Math.floor(Math.random() * game.tracks.length)]
    }
  }
  const allTracks = getAllTracks()
  return allTracks[Math.floor(Math.random() * allTracks.length)]
}

export const getTotalActiveSpeedrunners = () => 
  n64RacingGames.reduce((total, game) => total + game.activeSpeedrunners, 0)

export const getDifficultyColor = (difficulty: N64RacingTrack['difficulty']) => {
  switch (difficulty) {
    case 'easy': return 'text-green-400'
    case 'medium': return 'text-yellow-400'
    case 'hard': return 'text-orange-400'
    case 'expert': return 'text-red-400'
    default: return 'text-gray-400'
  }
}

export const getDifficultyBgColor = (difficulty: N64RacingTrack['difficulty']) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-600/20 border-green-600/50'
    case 'medium': return 'bg-yellow-600/20 border-yellow-600/50'
    case 'hard': return 'bg-orange-600/20 border-orange-600/50'
    case 'expert': return 'bg-red-600/20 border-red-600/50'
    default: return 'bg-gray-600/20 border-gray-600/50'
  }
}