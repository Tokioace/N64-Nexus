import { FavoriteItem } from '@/types/favorites';

export const demoFavorites: Omit<FavoriteItem, 'id' | 'addedAt' | 'updatedAt'>[] = [
  // Games
  {
    type: 'game',
    title: 'Mario Kart 64',
    description: 'Klassisches Rennspiel für die Nintendo 64 mit ikonischen Charakteren und Strecken',
    imageUrl: 'https://via.placeholder.com/150x200/8b5cf6/ffffff?text=MK64',
    url: '/games/mario-kart-64',
    tags: ['Racing', 'Multiplayer', 'Klassiker', 'Nintendo'],
    isPublic: true,
    metadata: {
      publisher: 'Nintendo',
      releaseYear: 1996,
      genre: ['Racing', 'Party'],
      platform: 'Nintendo 64',
      rating: 9.2
    }
  },
  {
    type: 'game',
    title: 'Jet Force Gemini',
    description: 'Action-Adventure mit einzigartigem Gameplay und beeindruckender Grafik',
    imageUrl: 'https://via.placeholder.com/150x200/3b82f6/ffffff?text=JFG',
    url: '/games/jet-force-gemini',
    tags: ['Action', 'Adventure', 'Rare', 'Sci-Fi'],
    isPublic: true,
    metadata: {
      publisher: 'Rare',
      releaseYear: 1999,
      genre: ['Action', 'Adventure', 'Third-Person Shooter'],
      platform: 'Nintendo 64',
      rating: 8.7
    }
  },
  {
    type: 'game',
    title: 'Super Mario 64',
    description: 'Revolutionäres 3D-Platformer das die Gaming-Welt veränderte',
    imageUrl: 'https://via.placeholder.com/150x200/22c55e/ffffff?text=SM64',
    url: '/games/super-mario-64',
    tags: ['Platformer', '3D', 'Revolutionär', 'Mario'],
    isPublic: true,
    metadata: {
      publisher: 'Nintendo',
      releaseYear: 1996,
      genre: ['Platformer', 'Adventure'],
      platform: 'Nintendo 64',
      rating: 9.6
    }
  },

  // Tracks
  {
    type: 'track',
    title: 'Rainbow Road',
    description: 'Die legendäre Regenbogen-Strecke - eine der schwierigsten Rennstrecken aller Zeiten',
    imageUrl: 'https://via.placeholder.com/150x200/3b82f6/ffffff?text=RR',
    url: '/tracks/rainbow-road',
    tags: ['Schwierig', 'Legendär', 'Regenbogen', 'Mario Kart'],
    isPublic: true,
    metadata: {
      game: 'Mario Kart 64',
      difficulty: 'expert',
      bestTime: '2:15.432',
      worldRecord: '2:08.123'
    }
  },
  {
    type: 'track',
    title: 'Wario Stadium',
    description: 'Die längste Strecke in Mario Kart 64 mit vielen Sprüngen und Kurven',
    imageUrl: 'https://via.placeholder.com/150x200/f59e0b/000000?text=WS',
    url: '/tracks/wario-stadium',
    tags: ['Lange Strecke', 'Wario', 'Stadion', 'Sprünge'],
    isPublic: true,
    metadata: {
      game: 'Mario Kart 64',
      difficulty: 'hard',
      bestTime: '3:45.123',
      worldRecord: '3:32.456'
    }
  },

  // Events
  {
    type: 'event',
    title: 'GlitchCup #3',
    description: 'Speedrunning-Turnier für Mario Kart 64 mit internationalen Teilnehmern',
    imageUrl: 'https://via.placeholder.com/150x200/f59e0b/000000?text=GC3',
    url: '/events/glitchcup-3',
    tags: ['Speedrun', 'Turnier', 'Mario Kart', 'International'],
    isPublic: true,
    metadata: {
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-02-17'),
      organizer: 'Speedrun Community',
      participants: 128,
      maxParticipants: 256,
      status: 'upcoming'
    }
  },
  {
    type: 'event',
    title: 'Retro Gaming Convention 2024',
    description: 'Die größte Retro-Gaming-Messe Deutschlands mit Ausstellern und Turnieren',
    imageUrl: 'https://via.placeholder.com/150x200/ec4899/ffffff?text=RGC',
    url: '/events/retro-gaming-convention-2024',
    tags: ['Messe', 'Retro', 'Deutschland', 'Turniere'],
    isPublic: true,
    metadata: {
      startDate: new Date('2024-06-20'),
      endDate: new Date('2024-06-22'),
      organizer: 'Retro Gaming Deutschland',
      participants: 2048,
      maxParticipants: 5000,
      status: 'upcoming'
    }
  },

  // Fanart
  {
    type: 'fanart',
    title: 'Mario & Luigi Fanart',
    description: 'Kunstwerk von @PixelArtist - Pixel Art im klassischen Stil',
    imageUrl: 'https://via.placeholder.com/150x200/22c55e/ffffff?text=Art',
    url: '/fanart/mario-luigi',
    tags: ['Fanart', 'Mario', 'Luigi', 'Pixel Art'],
    isPublic: true,
    metadata: {
      artist: '@PixelArtist',
      game: 'Super Mario Bros',
      tags: ['Pixel Art', 'Retro'],
      likes: 342
    }
  },
  {
    type: 'fanart',
    title: 'N64 Controller Collection',
    description: 'Fotografische Sammlung aller Nintendo 64 Controller-Varianten',
    imageUrl: 'https://via.placeholder.com/150x200/6366f1/ffffff?text=N64',
    url: '/fanart/n64-controller-collection',
    tags: ['Fotografie', 'Controller', 'Sammlung', 'Hardware'],
    isPublic: true,
    metadata: {
      artist: '@RetroCollector',
      game: 'Hardware',
      tags: ['Fotografie', 'Hardware'],
      likes: 156
    }
  },

  // Users
  {
    type: 'user',
    title: 'Speedrunner Pro',
    description: 'Professioneller Speedrunner mit Weltrekorden in Mario Kart 64',
    imageUrl: 'https://via.placeholder.com/150x200/ef4444/ffffff?text=SP',
    url: '/users/speedrunner-pro',
    tags: ['Speedrunner', 'Profi', 'Weltrekorde', 'Mario Kart'],
    isPublic: true,
    metadata: {
      username: 'Speedrunner Pro',
      avatar: 'https://via.placeholder.com/64x64/ef4444/ffffff?text=SP',
      followers: 15420,
      following: 234,
      mutualFriends: 12
    }
  },

  // Quiz
  {
    type: 'quiz',
    title: 'N64 Trivia Master',
    description: 'Teste dein Wissen über Nintendo 64 Spiele und Hardware',
    imageUrl: 'https://via.placeholder.com/150x200/8b5cf6/ffffff?text=Quiz',
    url: '/quiz/n64-trivia-master',
    tags: ['Quiz', 'Trivia', 'N64', 'Wissen'],
    isPublic: true,
    metadata: {
      category: 'Nintendo 64',
      difficulty: 'hard',
      questions: 50,
      bestScore: 42
    }
  },

  // Trade
  {
    type: 'trade',
    title: 'Mario Kart 64 Cartridge',
    description: 'Originale Mario Kart 64 Cartridge in sehr gutem Zustand',
    imageUrl: 'https://via.placeholder.com/150x200/22c55e/ffffff?text=Trade',
    url: '/trade/mario-kart-64-cartridge',
    tags: ['Cartridge', 'Original', 'Mario Kart', 'Sammler'],
    isPublic: true,
    metadata: {
      trader: '@RetroCollector',
      itemType: 'Cartridge',
      condition: 'like-new',
      price: 45,
      location: 'Berlin, Deutschland'
    }
  }
];

export const demoLists = [
  {
    name: 'Lieblingsstrecken',
    description: 'Meine bevorzugten Rennstrecken aus verschiedenen Spielen',
    color: '#3b82f6',
    isPublic: true
  },
  {
    name: 'Speedrun-Ziele',
    description: 'Spiele die ich speedrunnen möchte',
    color: '#ef4444',
    isPublic: false
  },
  {
    name: 'Kauf später',
    description: 'Spiele die ich mir noch kaufen möchte',
    color: '#f59e0b',
    isPublic: false
  },
  {
    name: 'Glitch-Ideen',
    description: 'Interessante Glitches und Exploits zum Ausprobieren',
    color: '#22c55e',
    isPublic: true
  }
];