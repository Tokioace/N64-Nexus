import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
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
  
  // Actions
  setUserLocation: (location: UserLocation) => void
  createEvent: (eventData: Omit<MapEvent, 'id' | 'createdAt' | 'participants' | 'currentPlayers'>) => Promise<string>
  joinEvent: (eventId: string) => Promise<boolean>
  leaveEvent: (eventId: string) => Promise<boolean>
  updateMapView: (center: { lat: number; lng: number }, zoom: number) => void
  selectCountry: (countryCode: string | null) => void
  refreshNearbyEvents: () => Promise<void>
  
  // Geo-matching
  getEventsInRadius: (coordinates: { lat: number; lng: number }, radiusKm: number) => MapEvent[]
  calculateDistance: (coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }) => number
}

const MapContext = createContext<MapContextType | undefined>(undefined)

// Sample data for development
const sampleCountryStats: CountryStats[] = [
  { country: 'Germany', countryCode: 'DE', activeUsers: 487, totalEvents: 25, flag: '🇩🇪' },
  { country: 'United States', countryCode: 'US', activeUsers: 1251, totalEvents: 68, flag: '🇺🇸' },
  { country: 'Japan', countryCode: 'JP', activeUsers: 894, totalEvents: 46, flag: '🇯🇵' },
  { country: 'United Kingdom', countryCode: 'GB', activeUsers: 360, totalEvents: 20, flag: '🇬🇧' },
  { country: 'France', countryCode: 'FR', activeUsers: 299, totalEvents: 16, flag: '🇫🇷' },
  { country: 'Canada', countryCode: 'CA', activeUsers: 272, totalEvents: 13, flag: '🇨🇦' },
  { country: 'Australia', countryCode: 'AU', activeUsers: 192, totalEvents: 9, flag: '🇦🇺' },
  { country: 'Brazil', countryCode: 'BR', activeUsers: 156, totalEvents: 6, flag: '🇧🇷' },
  { country: 'Italy', countryCode: 'IT', activeUsers: 143, totalEvents: 7, flag: '🇮🇹' },
  { country: 'Spain', countryCode: 'ES', activeUsers: 128, totalEvents: 5, flag: '🇪🇸' },
  { country: 'Netherlands', countryCode: 'NL', activeUsers: 95, totalEvents: 4, flag: '🇳🇱' },
  { country: 'Sweden', countryCode: 'SE', activeUsers: 78, totalEvents: 3, flag: '🇸🇪' },
]

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
    setUserLocation,
    createEvent,
    joinEvent,
    leaveEvent,
    updateMapView,
    selectCountry,
    refreshNearbyEvents,
    getEventsInRadius,
    calculateDistance
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