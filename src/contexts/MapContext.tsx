import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { logger } from '../lib/logger'
import { useUser } from './UserContext'

// Types for the Map Context
export interface MapEvent {
  id: string
  hostId: string
  hostName: string
  game: string
  title: string
  description: string
  date: Date
  category?: 'casual' | 'tournament' | 'speedrun' | 'meetup'
  location: {
    country: string
    region: string
    postalCode: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  maxPlayers: number
  currentPlayers: number
  participants: string[]
  isPublic: boolean
  inviteCode?: string
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  createdAt: Date
  // Enhanced battle tracking
  liveData?: {
    scores: { [playerId: string]: number }
    currentRound: number
    totalRounds: number
    startTime?: Date
    isLive: boolean
    spectators: number
  }
  prizes?: {
    first: string
    second: string
    third: string
  }
  skillRequirement?: number // Minimum skill rating to join
}

export interface UserLocation {
  userId: string
  country: string
  region: string
  postalCode: string
  coordinates: {
    lat: number
    lng: number
  }
  isVisible: boolean
  lastUpdated: Date
}

export interface CountryStats {
  country: string
  countryCode: string
  activeUsers: number
  totalEvents: number
  flag: string
  // Enhanced stats
  averageSkillRating: number
  topPlayers: string[]
  mostPopularGame: string
}

// New gamification interfaces
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'battles' | 'social' | 'exploration' | 'mastery' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  requirement: {
    type: 'battle_wins' | 'events_hosted' | 'distance_traveled' | 'games_mastered' | 'special'
    target: number
    game?: string
  }
  unlockedAt?: Date
  progress: number
}

export interface BattleStats {
  userId: string
  totalBattles: number
  wins: number
  losses: number
  winRate: number
  skillRating: number
  favoriteGame: string
  totalDistanceTraveled: number
  eventsHosted: number
  achievementsUnlocked: number
  currentStreak: number
  bestStreak: number
  gameStats: {
    [game: string]: {
      battles: number
      wins: number
      losses: number
      skillRating: number
      lastPlayed: Date
    }
  }
  recentMatches: Array<{
    eventId: string
    game: string
    result: 'win' | 'loss'
    score: number
    date: Date
    skillChange: number
  }>
}

export interface BattlePass {
  id: string
  season: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  tiers: Array<{
    tier: number
    xpRequired: number
    freeReward?: {
      type: 'achievement' | 'badge' | 'title' | 'cosmetic' | 'currency'
      item: string
    }
    premiumReward?: {
      type: 'achievement' | 'badge' | 'title' | 'cosmetic' | 'currency'
      item: string
    }
  }>
  userProgress: {
    currentXp: number
    currentTier: number
    isPremium: boolean
    unlockedRewards: string[]
  }
}

export interface LiveBattle {
  eventId: string
  title: string
  game: string
  players: Array<{
    id: string
    name: string
    score: number
    status: 'playing' | 'spectating' | 'disconnected'
  }>
  spectators: number
  currentRound: number
  totalRounds: number
  startTime: Date
  isStreamLive: boolean
  streamUrl?: string
}

interface MapContextType {
  // Map state
  userLocation: UserLocation | null
  nearbyEvents: MapEvent[]
  allEvents: MapEvent[]
  countryStats: CountryStats[]
  selectedCountry: string | null
  mapCenter: { lat: number; lng: number }
  mapZoom: number
  
  // Loading states
  isLoadingLocation: boolean
  isLoadingEvents: boolean
  
  // Enhanced gamification state
  userStats: BattleStats | null
  achievements: Achievement[]
  battlePass: BattlePass | null
  liveBattles: LiveBattle[]
  leaderboard: Array<{
    userId: string
    username: string
    skillRating: number
    wins: number
    favoriteGame: string
    country: string
  }>
  
  // Actions
  setUserLocation: (location: UserLocation) => void
  createEvent: (eventData: Omit<MapEvent, 'id' | 'createdAt' | 'participants' | 'currentPlayers'>) => Promise<string>
  joinEvent: (eventId: string) => Promise<boolean>
  leaveEvent: (eventId: string) => Promise<boolean>
  updateMapView: (center: { lat: number; lng: number }, zoom: number) => void
  selectCountry: (countryCode: string | null) => void
  refreshNearbyEvents: () => Promise<void>
  
  // Enhanced gamification actions
  updateBattleResult: (eventId: string, result: 'win' | 'loss', score: number) => Promise<void>
  unlockAchievement: (achievementId: string) => Promise<void>
  updateBattlePassProgress: (xpGained: number) => Promise<void>
  startLiveBattle: (eventId: string) => Promise<void>
  joinAsSpectator: (eventId: string) => Promise<void>
  
  // Geo-matching
  getEventsInRadius: (coordinates: { lat: number; lng: number }, radiusKm: number) => MapEvent[]
  calculateDistance: (coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }) => number
  
  // Advanced matchmaking
  findOptimalOpponents: (skillRating: number, game: string, maxDistance: number) => MapEvent[]
  getSuggestedEvents: () => MapEvent[]
}

const MapContext = createContext<MapContextType | undefined>(undefined)

// Sample enhanced data
const sampleCountryStats: CountryStats[] = [
  { country: 'Germany', countryCode: 'DE', activeUsers: 487, totalEvents: 25, flag: '🇩🇪', averageSkillRating: 1650, topPlayers: ['Mario64Master', 'BerlinBattler', 'GermanGamer'], mostPopularGame: 'Mario Kart 64' },
  { country: 'United States', countryCode: 'US', activeUsers: 1251, totalEvents: 68, flag: '🇺🇸', averageSkillRating: 1580, topPlayers: ['AmericanAce', 'USAChampion', 'StarSpangled'], mostPopularGame: 'Super Smash Bros' },
  { country: 'Japan', countryCode: 'JP', activeUsers: 894, totalEvents: 46, flag: '🇯🇵', averageSkillRating: 1720, topPlayers: ['NintendoNinja', 'TokyoTitan', 'SamuraiGamer'], mostPopularGame: 'Super Mario 64' },
  { country: 'United Kingdom', countryCode: 'GB', activeUsers: 360, totalEvents: 20, flag: '🇬🇧', averageSkillRating: 1590, topPlayers: ['BritishBeast', 'LondonLegend', 'UKUltimate'], mostPopularGame: 'GoldenEye 007' },
  { country: 'France', countryCode: 'FR', activeUsers: 299, totalEvents: 16, flag: '🇫🇷', averageSkillRating: 1610, topPlayers: ['FrenchFighter', 'ParisianPro', 'GallicGamer'], mostPopularGame: 'Mario Kart 64' },
  { country: 'Canada', countryCode: 'CA', activeUsers: 272, totalEvents: 13, flag: '🇨🇦', averageSkillRating: 1570, topPlayers: ['CanadianCrusher', 'MapleLeafMaster', 'NorthernNinja'], mostPopularGame: 'Super Smash Bros' },
  { country: 'Australia', countryCode: 'AU', activeUsers: 192, totalEvents: 9, flag: '🇦🇺', averageSkillRating: 1540, topPlayers: ['AussieAce', 'SydneySlayer', 'DownUnderDominator'], mostPopularGame: 'Mario Party' },
  { country: 'Brazil', countryCode: 'BR', activeUsers: 156, totalEvents: 6, flag: '🇧🇷', averageSkillRating: 1520, topPlayers: ['BrazilianBeast', 'SambaSlayer', 'CariocaChampion'], mostPopularGame: 'Mario Kart 64' },
  { country: 'Italy', countryCode: 'IT', activeUsers: 143, totalEvents: 7, flag: '🇮🇹', averageSkillRating: 1600, topPlayers: ['ItalianIcon', 'RomanRuler', 'VenetianVictor'], mostPopularGame: 'Super Mario 64' },
  { country: 'Spain', countryCode: 'ES', activeUsers: 128, totalEvents: 5, flag: '🇪🇸', averageSkillRating: 1560, topPlayers: ['SpanishStar', 'MadridMaster', 'IberianIcon'], mostPopularGame: 'F-Zero X' },
  { country: 'Netherlands', countryCode: 'NL', activeUsers: 95, totalEvents: 4, flag: '🇳🇱', averageSkillRating: 1640, topPlayers: ['DutchDominator', 'AmsterdamAce', 'HollandHero'], mostPopularGame: 'Mario Tennis' },
  { country: 'Sweden', countryCode: 'SE', activeUsers: 78, totalEvents: 3, flag: '🇸🇪', averageSkillRating: 1680, topPlayers: ['SwedishSlayer', 'StockholmStar', 'NordicNinja'], mostPopularGame: 'GoldenEye 007' },
]

// Sample achievements
const sampleAchievements: Achievement[] = [
  {
    id: 'first_victory',
    title: 'First Blood',
    description: 'Win your first battle',
    icon: '🏆',
    category: 'battles',
    rarity: 'common',
    points: 100,
    requirement: { type: 'battle_wins', target: 1 },
    progress: 0
  },
  {
    id: 'win_streak_5',
    title: 'Hot Streak',
    description: 'Win 5 battles in a row',
    icon: '🔥',
    category: 'battles',
    rarity: 'rare',
    points: 250,
    requirement: { type: 'battle_wins', target: 5 },
    progress: 0
  },
  {
    id: 'mario_kart_master',
    title: 'Kart Racing Legend',
    description: 'Win 50 Mario Kart 64 battles',
    icon: '🏎️',
    category: 'mastery',
    rarity: 'epic',
    points: 500,
    requirement: { type: 'battle_wins', target: 50, game: 'Mario Kart 64' },
    progress: 0
  },
  {
    id: 'globe_trotter',
    title: 'Globe Trotter',
    description: 'Travel 1000km for battles',
    icon: '🌍',
    category: 'exploration',
    rarity: 'rare',
    points: 300,
    requirement: { type: 'distance_traveled', target: 1000 },
    progress: 0
  },
  {
    id: 'event_host_legend',
    title: 'Event Master',
    description: 'Host 25 successful events',
    icon: '🎪',
    category: 'social',
    rarity: 'epic',
    points: 750,
    requirement: { type: 'events_hosted', target: 25 },
    progress: 0
  },
  {
    id: 'perfect_game',
    title: 'Perfection',
    description: 'Win a battle without losing a single round',
    icon: '💎',
    category: 'battles',
    rarity: 'legendary',
    points: 1000,
    requirement: { type: 'special', target: 1 },
    progress: 0
  }
]

// Sample battle pass
const sampleBattlePass: BattlePass = {
  id: 'season_1_2024',
  season: 'Season 1',
  title: 'N64 Legends',
  description: 'Celebrate the golden age of gaming',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-03-31'),
  tiers: [
    { tier: 1, xpRequired: 0, freeReward: { type: 'badge', item: 'Newcomer Badge' } },
    { tier: 2, xpRequired: 500, freeReward: { type: 'title', item: 'Battle Rookie' }, premiumReward: { type: 'cosmetic', item: 'Golden Controller Icon' } },
    { tier: 3, xpRequired: 1200, freeReward: { type: 'achievement', item: 'Season Warrior' } },
    { tier: 4, xpRequired: 2000, premiumReward: { type: 'cosmetic', item: 'N64 Avatar Frame' } },
    { tier: 5, xpRequired: 3000, freeReward: { type: 'currency', item: '500 Battle Coins' }, premiumReward: { type: 'cosmetic', item: 'Legendary Map Theme' } },
  ],
  userProgress: {
    currentXp: 750,
    currentTier: 2,
    isPremium: false,
    unlockedRewards: ['Newcomer Badge', 'Battle Rookie']
  }
}

const sampleEvents: MapEvent[] = [
  {
    id: '1',
    hostId: 'user1',
    hostName: 'Mario64Master',
    game: 'Mario Kart 64',
    title: 'Weekend Racing Tournament',
    description: 'Projektor vorhanden, bringt eure Controller mit!',
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    category: 'tournament',
    location: {
      country: 'Germany',
      region: 'Berlin',
      postalCode: '10115',
      coordinates: { lat: 52.5200, lng: 13.4050 }
    },
    maxPlayers: 4,
    currentPlayers: 2,
    participants: ['user1', 'user2'],
    isPublic: true,
    status: 'upcoming',
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    id: '2',
    hostId: 'user3',
    hostName: 'SmashBrosLegend',
    game: 'Super Smash Bros',
    title: 'Local Smash Meetup',
    description: 'Casual games, all skill levels welcome!',
    date: new Date(Date.now() + 86400000 * 5), // 5 days from now
    category: 'meetup',
    location: {
      country: 'Germany',
      region: 'Munich',
      postalCode: '80331',
      coordinates: { lat: 48.1351, lng: 11.5820 }
    },
    maxPlayers: 4,
    currentPlayers: 1,
    participants: ['user3'],
    isPublic: true,
    status: 'upcoming',
    createdAt: new Date(Date.now() - 43200000)
  },
  {
    id: '3',
    hostId: 'user4',
    hostName: 'GoldenEyePro',
    game: 'GoldenEye 007',
    title: 'Secret Agent Showdown',
    description: 'Four controller splitscreen madness! Snacks provided.',
    date: new Date(Date.now() + 86400000 * 3), // 3 days from now
    category: 'casual',
    location: {
      country: 'United States',
      region: 'New York',
      postalCode: '10001',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    maxPlayers: 4,
    currentPlayers: 3,
    participants: ['user4', 'user5', 'user6'],
    isPublic: true,
    status: 'upcoming',
    createdAt: new Date(Date.now() - 86400000 * 2)
  },
  {
    id: '4',
    hostId: 'user7',
    hostName: 'MarioPartyKing',
    game: 'Mario Party',
    title: 'Board Game Chaos Night',
    description: 'Pizza, friends, and mini-games! What more do you need?',
    date: new Date(Date.now() + 86400000 * 7), // 7 days from now
    location: {
      country: 'Japan',
      region: 'Tokyo',
      postalCode: '100-0001',
      coordinates: { lat: 35.6762, lng: 139.6503 }
    },
    maxPlayers: 4,
    currentPlayers: 2,
    participants: ['user7', 'user8'],
    isPublic: true,
    status: 'upcoming',
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    id: '5',
    hostId: 'user9',
    hostName: 'ZeldaMaster',
    game: 'The Legend of Zelda: Ocarina of Time',
    title: 'Speedrun Competition',
    description: 'Any% category, best time wins! Recording equipment available.',
    date: new Date(Date.now() + 86400000 * 4), // 4 days from now
    category: 'speedrun',
    location: {
      country: 'United Kingdom',
      region: 'London',
      postalCode: 'SW1A 1AA',
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    maxPlayers: 6,
    currentPlayers: 4,
    participants: ['user9', 'user10', 'user11', 'user12'],
    isPublic: true,
    status: 'upcoming',
    createdAt: new Date(Date.now() - 86400000 * 3)
  },
  {
    id: '6',
    hostId: 'user13',
    hostName: 'F-ZeroRacer',
    game: 'F-Zero X',
    title: 'High Speed Racing League',
    description: 'Mute City or bust! Bring your A-game.',
    date: new Date(Date.now() + 86400000 * 6), // 6 days from now
    location: {
      country: 'France',
      region: 'Paris',
      postalCode: '75001',
      coordinates: { lat: 48.8566, lng: 2.3522 }
    },
    maxPlayers: 4,
    currentPlayers: 1,
    participants: ['user13'],
    isPublic: true,
    status: 'upcoming',
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    id: '7',
    hostId: 'user14',
    hostName: 'TennisAce',
    game: 'Mario Tennis',
    title: 'Court Champions Tournament',
    description: 'Singles and doubles matches. Trophies for winners!',
    date: new Date(Date.now() + 86400000 * 8), // 8 days from now
    location: {
      country: 'Canada',
      region: 'Toronto',
      postalCode: 'M5H 2N2',
      coordinates: { lat: 43.6532, lng: -79.3832 }
    },
    maxPlayers: 8,
    currentPlayers: 5,
    participants: ['user14', 'user15', 'user16', 'user17', 'user18'],
    isPublic: true,
    status: 'upcoming',
    createdAt: new Date(Date.now() - 86400000 * 2)
  },
  {
    id: '8',
    hostId: 'user19',
    hostName: 'RetroGamer',
    game: 'Super Mario 64',
    title: 'Platforming Perfection',
    description: 'Star collecting competition! 120 stars or die trying.',
    date: new Date(Date.now() + 86400000 * 9), // 9 days from now
    location: {
      country: 'Australia',
      region: 'Sydney',
      postalCode: '2000',
      coordinates: { lat: -33.8688, lng: 151.2093 }
    },
    maxPlayers: 6,
    currentPlayers: 3,
    participants: ['user19', 'user20', 'user21'],
    isPublic: true,
    status: 'upcoming',
    createdAt: new Date(Date.now() - 86400000)
  }
]

// Sample user stats initialization
const initializeUserStats = (userId: string): BattleStats => ({
  userId,
  totalBattles: 0,
  wins: 0,
  losses: 0,
  winRate: 0,
  skillRating: 1500, // Starting rating
  favoriteGame: 'Mario Kart 64',
  totalDistanceTraveled: 0,
  eventsHosted: 0,
  achievementsUnlocked: 0,
  currentStreak: 0,
  bestStreak: 0,
  gameStats: {
    'Mario Kart 64': { battles: 0, wins: 0, losses: 0, skillRating: 1500, lastPlayed: new Date() },
    'Super Smash Bros': { battles: 0, wins: 0, losses: 0, skillRating: 1500, lastPlayed: new Date() },
    'GoldenEye 007': { battles: 0, wins: 0, losses: 0, skillRating: 1500, lastPlayed: new Date() },
    'Mario Party': { battles: 0, wins: 0, losses: 0, skillRating: 1500, lastPlayed: new Date() },
    'Super Mario 64': { battles: 0, wins: 0, losses: 0, skillRating: 1500, lastPlayed: new Date() },
    'The Legend of Zelda: Ocarina of Time': { battles: 0, wins: 0, losses: 0, skillRating: 1500, lastPlayed: new Date() },
    'Mario Tennis': { battles: 0, wins: 0, losses: 0, skillRating: 1500, lastPlayed: new Date() },
    'F-Zero X': { battles: 0, wins: 0, losses: 0, skillRating: 1500, lastPlayed: new Date() },
    'Jet Force Gemini': { battles: 0, wins: 0, losses: 0, skillRating: 1500, lastPlayed: new Date() }
  },
  recentMatches: []
})

// Sample leaderboard data
const sampleLeaderboard = [
  { userId: 'user1', username: 'Mario64Master', skillRating: 2150, wins: 87, favoriteGame: 'Mario Kart 64', country: 'Germany' },
  { userId: 'user2', username: 'NintendoNinja', skillRating: 2089, wins: 76, favoriteGame: 'Super Mario 64', country: 'Japan' },
  { userId: 'user3', username: 'GoldenEyePro', skillRating: 2034, wins: 69, favoriteGame: 'GoldenEye 007', country: 'United States' },
  { userId: 'user4', username: 'SmashBrosLegend', skillRating: 1987, wins: 64, favoriteGame: 'Super Smash Bros', country: 'United Kingdom' },
  { userId: 'user5', username: 'KartRacingKing', skillRating: 1923, wins: 58, favoriteGame: 'Mario Kart 64', country: 'France' },
  { userId: 'user6', username: 'ZeldaMaster', skillRating: 1876, wins: 52, favoriteGame: 'The Legend of Zelda: Ocarina of Time', country: 'Canada' },
  { userId: 'user7', username: 'F-ZeroRacer', skillRating: 1834, wins: 47, favoriteGame: 'F-Zero X', country: 'Australia' },
  { userId: 'user8', username: 'MarioPartyKing', skillRating: 1789, wins: 43, favoriteGame: 'Mario Party', country: 'Brazil' },
  { userId: 'user9', username: 'TennisAce', skillRating: 1745, wins: 38, favoriteGame: 'Mario Tennis', country: 'Italy' },
  { userId: 'user10', username: 'RetroGamer', skillRating: 1698, wins: 34, favoriteGame: 'Super Mario 64', country: 'Spain' }
]

export const MapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser()
  
  // State
  const [userLocation, setUserLocationState] = useState<UserLocation | null>(null)
  const [allEvents, setAllEvents] = useState<MapEvent[]>(sampleEvents)
  const [nearbyEvents, setNearbyEvents] = useState<MapEvent[]>([])
  const [countryStats] = useState<CountryStats[]>(sampleCountryStats)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 51.1657, lng: 10.4515 }) // Center of Germany
  const [mapZoom, setMapZoom] = useState(6)
  const [isLoadingLocation] = useState(false)
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)

  // Enhanced gamification state
  const [userStats, setUserStats] = useState<BattleStats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>(sampleAchievements)
  const [battlePass, setBattlePass] = useState<BattlePass | null>(sampleBattlePass)
  const [liveBattles, setLiveBattles] = useState<LiveBattle[]>([])
  const [leaderboard] = useState(sampleLeaderboard)

  // Initialize user stats when user logs in
  useEffect(() => {
    if (user && !userStats) {
      setUserStats(initializeUserStats(user.id))
    }
  }, [user, userStats])

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number => {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Get events within specified radius
  const getEventsInRadius = useCallback((coordinates: { lat: number; lng: number }, radiusKm: number): MapEvent[] => {
    return allEvents.filter(event => {
      const distance = calculateDistance(coordinates, event.location.coordinates)
      return distance <= radiusKm && event.status === 'upcoming'
    })
  }, [allEvents])

  // Update nearby events when user location changes
  useEffect(() => {
    if (userLocation) {
      const nearby = getEventsInRadius(userLocation.coordinates, 30) // 30km radius
      setNearbyEvents(nearby)
    }
  }, [userLocation, allEvents, getEventsInRadius])

  // Actions
  const setUserLocation = (location: UserLocation) => {
    setUserLocationState(location)
    setMapCenter(location.coordinates)
    setMapZoom(10)
  }

  const createEvent = async (eventData: Omit<MapEvent, 'id' | 'createdAt' | 'participants' | 'currentPlayers'>): Promise<string> => {
    if (!user) throw new Error('User must be logged in to create events')
    
    const newEvent: MapEvent = {
      ...eventData,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      participants: [user.id],
      currentPlayers: 1
    }
    
    setAllEvents(prev => [...prev, newEvent])
    return newEvent.id
  }

  const joinEvent = async (eventId: string): Promise<boolean> => {
    if (!user) return false
    
    setAllEvents(prev => prev.map(event => {
      if (event.id === eventId && event.currentPlayers < event.maxPlayers && !event.participants.includes(user.id)) {
        return {
          ...event,
          participants: [...event.participants, user.id],
          currentPlayers: event.currentPlayers + 1
        }
      }
      return event
    }))
    return true
  }

  const leaveEvent = async (eventId: string): Promise<boolean> => {
    if (!user) return false
    
    setAllEvents(prev => prev.map(event => {
      if (event.id === eventId && event.participants.includes(user.id)) {
        return {
          ...event,
          participants: event.participants.filter(id => id !== user.id),
          currentPlayers: event.currentPlayers - 1
        }
      }
      return event
    }))
    return true
  }

  const updateMapView = (center: { lat: number; lng: number }, zoom: number) => {
    setMapCenter(center)
    setMapZoom(zoom)
  }

  const selectCountry = (countryCode: string | null) => {
    setSelectedCountry(countryCode)
    if (countryCode) {
      // Update map view based on selected country
      const countryCoords: { [key: string]: { lat: number; lng: number; zoom: number } } = {
        'DE': { lat: 51.1657, lng: 10.4515, zoom: 6 },
        'US': { lat: 39.8283, lng: -98.5795, zoom: 4 },
        'JP': { lat: 36.2048, lng: 138.2529, zoom: 5 },
        'GB': { lat: 55.3781, lng: -3.4360, zoom: 6 },
        'FR': { lat: 46.2276, lng: 2.2137, zoom: 6 },
        'CA': { lat: 56.1304, lng: -106.3468, zoom: 4 },
        'AU': { lat: -25.2744, lng: 133.7751, zoom: 4 },
        'BR': { lat: -14.2350, lng: -51.9253, zoom: 4 }
      }
      
      const coords = countryCoords[countryCode]
      if (coords) {
        setMapCenter({ lat: coords.lat, lng: coords.lng })
        setMapZoom(coords.zoom)
      }
    }
  }

  const refreshNearbyEvents = async () => {
    setIsLoadingEvents(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoadingEvents(false)
  }

  const value: MapContextType = {
    userLocation,
    nearbyEvents,
    allEvents,
    countryStats,
    selectedCountry,
    mapCenter,
    mapZoom,
    isLoadingLocation,
    isLoadingEvents,
    userStats,
    achievements,
    battlePass,
    liveBattles,
    leaderboard,
    setUserLocation,
    createEvent,
    joinEvent,
    leaveEvent,
    updateMapView,
    selectCountry,
    refreshNearbyEvents,
    getEventsInRadius,
    calculateDistance,
    // Enhanced gamification actions
    updateBattleResult: async (eventId, result, score) => {
      if (!user) return
      logger.log(`Updating battle result for event ${eventId}: ${result}, score: ${score}`)
      
      const event = allEvents.find(e => e.id === eventId)
      if (!event) return
      
      // Update event live data
      setAllEvents(prev => prev.map(e => {
        if (e.id === eventId) {
          return {
            ...e,
            liveData: {
              scores: { ...e.liveData?.scores, [user.id]: score },
              currentRound: (e.liveData?.currentRound || 0) + 1,
              totalRounds: e.liveData?.totalRounds || 3,
              startTime: e.liveData?.startTime || new Date(),
              isLive: true,
              spectators: e.liveData?.spectators || 0
            }
          }
        }
        return e
      }))

      // Update user stats
      setUserStats(prev => {
        if (!prev) return null
        const newWins = result === 'win' ? prev.wins + 1 : prev.wins
        const newLosses = result === 'loss' ? prev.losses + 1 : prev.losses
        const newTotalBattles = prev.totalBattles + 1
        const skillChange = result === 'win' ? 15 : -8
        
        return {
          ...prev,
          totalBattles: newTotalBattles,
          wins: newWins,
          losses: newLosses,
          winRate: newTotalBattles > 0 ? (newWins / newTotalBattles) * 100 : 0,
          skillRating: Math.max(100, prev.skillRating + skillChange),
          currentStreak: result === 'win' ? prev.currentStreak + 1 : 0,
          bestStreak: result === 'win' ? Math.max(prev.bestStreak, prev.currentStreak + 1) : prev.bestStreak,
          gameStats: {
            ...prev.gameStats,
            [event.game]: {
              battles: (prev.gameStats[event.game]?.battles || 0) + 1,
              wins: (prev.gameStats[event.game]?.wins || 0) + (result === 'win' ? 1 : 0),
              losses: (prev.gameStats[event.game]?.losses || 0) + (result === 'loss' ? 1 : 0),
              skillRating: Math.max(100, (prev.gameStats[event.game]?.skillRating || 1500) + skillChange),
              lastPlayed: new Date()
            }
          },
          recentMatches: [
            {
              eventId,
              game: event.game,
              result,
              score,
              date: new Date(),
              skillChange
            },
            ...prev.recentMatches.slice(0, 9) // Keep last 10 matches
          ]
        }
      })

      // Check for achievement unlocks
      setAchievements(prev => prev.map(achievement => {
        if (achievement.unlockedAt) return achievement
        
        let shouldUnlock = false
        if (achievement.requirement.type === 'battle_wins') {
          const wins = userStats ? userStats.wins + (result === 'win' ? 1 : 0) : 0
          shouldUnlock = wins >= achievement.requirement.target
          if (achievement.requirement.game) {
            const gameWins = userStats?.gameStats[achievement.requirement.game]?.wins || 0
            shouldUnlock = gameWins + (result === 'win' && event.game === achievement.requirement.game ? 1 : 0) >= achievement.requirement.target
          }
        }
        
        return shouldUnlock ? { ...achievement, unlockedAt: new Date(), progress: achievement.requirement.target } : achievement
      }))

      // Update battle pass XP
      setBattlePass(prev => prev ? {
        ...prev,
        userProgress: {
          ...prev.userProgress,
          currentXp: prev.userProgress.currentXp + (result === 'win' ? 150 : 75)
        }
      } : null)
    },
    unlockAchievement: async (achievementId) => {
      logger.log(`Unlocking achievement: ${achievementId}`)
      setAchievements(prev => prev.map(achievement => {
        if (achievement.id === achievementId) {
          return { ...achievement, unlockedAt: new Date(), progress: achievement.requirement.target }
        }
        return achievement
      }))
      setUserStats(prev => prev ? {
        ...prev,
        achievementsUnlocked: prev.achievementsUnlocked + 1
      } : null)
    },
    updateBattlePassProgress: async (xpGained) => {
      logger.log(`Updating battle pass progress: ${xpGained} XP`)
      setBattlePass(prev => {
        if (!prev) return null
        const newXp = prev.userProgress.currentXp + xpGained
        let newTier = prev.userProgress.currentTier
        
        // Check for tier progression
        for (const tier of prev.tiers) {
          if (newXp >= tier.xpRequired && tier.tier > newTier) {
            newTier = tier.tier
          }
        }
        
        return {
          ...prev,
          userProgress: {
            ...prev.userProgress,
            currentXp: newXp,
            currentTier: newTier
          }
        }
      })
    },
    startLiveBattle: async (eventId) => {
      if (!user) return
      logger.log(`Starting live battle for event: ${eventId}`)
      const event = allEvents.find(e => e.id === eventId)
      if (!event) return
      
      setLiveBattles(prev => [...prev, {
        eventId,
        title: event.title,
        game: event.game,
        players: [{ id: user.id, name: user.username, score: 0, status: 'playing' }],
        spectators: 0,
        currentRound: 1,
        totalRounds: 3,
        startTime: new Date(),
        isStreamLive: true,
        streamUrl: `https://battle64.stream/${eventId}`
      }])
    },
    joinAsSpectator: async (eventId) => {
      logger.log(`Joining as spectator for event: ${eventId}`)
      setLiveBattles(prev => prev.map(battle => {
        if (battle.eventId === eventId) {
          return {
            ...battle,
            spectators: battle.spectators + 1
          }
        }
        return battle
      }))
    },
    // Advanced matchmaking
    findOptimalOpponents: (skillRating, game, maxDistance) => {
      if (!userLocation) return []
      return allEvents.filter(event => {
        if (event.status !== 'upcoming') return false
        if (event.game !== game) return false
        
        const distance = calculateDistance(userLocation.coordinates, event.location.coordinates)
        if (distance > maxDistance) return false
        
        // Consider skill requirement if set
        if (event.skillRequirement && Math.abs(skillRating - event.skillRequirement) > 200) return false
        
        return true
      }).sort((a, b) => {
        // Sort by skill compatibility and distance
        const distanceA = calculateDistance(userLocation.coordinates, a.location.coordinates)
        const distanceB = calculateDistance(userLocation.coordinates, b.location.coordinates)
        const skillDiffA = Math.abs(skillRating - (a.skillRequirement || 1500))
        const skillDiffB = Math.abs(skillRating - (b.skillRequirement || 1500))
        
        return (skillDiffA + distanceA * 0.1) - (skillDiffB + distanceB * 0.1)
      })
    },
    getSuggestedEvents: () => {
      if (!userStats || !userLocation) return allEvents.filter(e => e.status === 'upcoming').slice(0, 5)
      
      return allEvents.filter(event => {
        if (event.status !== 'upcoming') return false
        
        const distance = calculateDistance(userLocation.coordinates, event.location.coordinates)
        if (distance > 100) return false // Max 100km for suggestions
        
        // Prefer user's favorite games
        const gameStats = userStats.gameStats[event.game]
        if (gameStats && gameStats.battles > 0) return true
        
        // Include popular games in user's skill range
        if (event.skillRequirement) {
          return Math.abs(userStats.skillRating - event.skillRequirement) <= 300
        }
        
        return true
      }).sort((a, b) => {
        const distanceA = calculateDistance(userLocation.coordinates, a.location.coordinates)
        const distanceB = calculateDistance(userLocation.coordinates, b.location.coordinates)
        const gameStatsA = userStats.gameStats[a.game]
        const gameStatsB = userStats.gameStats[b.game]
        
        // Prioritize familiar games and closer events
        const scoreA = (gameStatsA?.battles || 0) * 10 - distanceA
        const scoreB = (gameStatsB?.battles || 0) * 10 - distanceB
        
        return scoreB - scoreA
      }).slice(0, 8)
    }
  }

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMap = () => {
  const context = useContext(MapContext)
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider')
  }
  return context
}