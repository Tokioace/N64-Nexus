import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from './UserContext'
import { useLanguage } from './LanguageContext'

// Types for the Map Context
export interface MapEvent {
  id: string
  hostId: string
  hostName: string
  game: string
  title: string
  description: string
  date: Date
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
  { country: 'Germany', countryCode: 'DE', activeUsers: 482, totalEvents: 23, flag: '🇩🇪' },
  { country: 'United States', countryCode: 'US', activeUsers: 1247, totalEvents: 67, flag: '🇺🇸' },
  { country: 'Japan', countryCode: 'JP', activeUsers: 892, totalEvents: 45, flag: '🇯🇵' },
  { country: 'United Kingdom', countryCode: 'GB', activeUsers: 356, totalEvents: 19, flag: '🇬🇧' },
  { country: 'France', countryCode: 'FR', activeUsers: 298, totalEvents: 15, flag: '🇫🇷' },
  { country: 'Canada', countryCode: 'CA', activeUsers: 267, totalEvents: 12, flag: '🇨🇦' },
  { country: 'Australia', countryCode: 'AU', activeUsers: 189, totalEvents: 8, flag: '🇦🇺' },
  { country: 'Brazil', countryCode: 'BR', activeUsers: 156, totalEvents: 6, flag: '🇧🇷' },
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
  }
]

export const MapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser()
  const { t } = useLanguage()
  
  // State
  const [userLocation, setUserLocationState] = useState<UserLocation | null>(null)
  const [allEvents, setAllEvents] = useState<MapEvent[]>(sampleEvents)
  const [nearbyEvents, setNearbyEvents] = useState<MapEvent[]>([])
  const [countryStats, setCountryStats] = useState<CountryStats[]>(sampleCountryStats)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 51.1657, lng: 10.4515 }) // Center of Germany
  const [mapZoom, setMapZoom] = useState(6)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
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
  const getEventsInRadius = (coordinates: { lat: number; lng: number }, radiusKm: number): MapEvent[] => {
    return allEvents.filter(event => {
      const distance = calculateDistance(coordinates, event.location.coordinates)
      return distance <= radiusKm && event.status === 'upcoming'
    })
  }

  // Update nearby events when user location changes
  useEffect(() => {
    if (userLocation) {
      const nearby = getEventsInRadius(userLocation.coordinates, 30) // 30km radius
      setNearbyEvents(nearby)
    }
  }, [userLocation, allEvents])

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

export const useMap = () => {
  const context = useContext(MapContext)
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider')
  }
  return context
}