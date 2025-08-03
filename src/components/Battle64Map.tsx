import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { useMap as useMapContext, MapEvent, CountryStats } from '../contexts/MapContext'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  MapPin, 
  Plus, 
  Users, 
  Calendar, 
  Clock, 
  Globe, 
  Filter, 
  Search,
  X,
  Gamepad2,
  MessageCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Target,
  Navigation,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react'

// Fix for default Leaflet markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Enhanced emoji-based custom icons with retro N64 styling
const createEmojiIcon = (emoji: string, isPulsing: boolean = false) => {
  return L.divIcon({
    className: 'custom-emoji-icon',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, #1e293b, #334155);
        border: 3px solid #eab308;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(234, 179, 8, 0.4);
        position: relative;
        ${isPulsing ? 'animation: pulse-glow 2s infinite;' : ''}
      ">
        ${emoji}
        ${isPulsing ? '<div style="position: absolute; inset: -6px; border-radius: 50%; background: radial-gradient(circle, rgba(234, 179, 8, 0.3) 0%, transparent 70%); animation: pulse-ring 2s infinite;"></div>' : ''}
      </div>
      <style>
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 12px rgba(234, 179, 8, 0.4); }
          50% { transform: scale(1.1); box-shadow: 0 6px 20px rgba(234, 179, 8, 0.8); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      </style>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  })
}

// N64-themed emoji icons
const eventIcon = createEmojiIcon('🎮', true)
const userIcon = createEmojiIcon('👤')
const myLocationIcon = createEmojiIcon('🟢')

interface EventHostingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (eventData: any) => void
  clickedLocation?: { lat: number; lng: number } | null
}

const EventHostingModal: React.FC<EventHostingModalProps> = ({ isOpen, onClose, onSubmit, clickedLocation }) => {
  const { t } = useLanguage()
  const { user } = useUser()
  const [formData, setFormData] = useState({
    game: '',
    title: '',
    description: '',
    date: '',
    time: '',
    location: {
      country: 'Germany',
      region: '',
      postalCode: '',
      coordinates: clickedLocation || { lat: 52.5200, lng: 13.4050 }
    },
    maxPlayers: 4,
    isPublic: true,
    inviteCode: ''
  })

  // Update coordinates when clickedLocation changes
  useEffect(() => {
    if (clickedLocation) {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: clickedLocation
        }
      }))
    }
  }, [clickedLocation])

  const games = [
    'Mario Kart 64',
    'Super Smash Bros',
    'GoldenEye 007',
    'Mario Party',
    'Super Mario 64',
    'The Legend of Zelda: Ocarina of Time',
    'Mario Tennis',
    'F-Zero X',
    'Jet Force Gemini'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const eventData = {
      ...formData,
      hostId: user.id,
      hostName: user.name,
      date: new Date(`${formData.date}T${formData.time}`),
      status: 'upcoming' as const
    }

    onSubmit(eventData)
    onClose()
    
    // Reset form
    setFormData({
      game: '',
      title: '',
      description: '',
      date: '',
      time: '',
      location: {
        country: 'Germany',
        region: '',
        postalCode: '',
        coordinates: { lat: 52.5200, lng: 13.4050 }
      },
      maxPlayers: 4,
      isPublic: true,
      inviteCode: ''
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-yellow-500/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-600 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-yellow-400">{t('map.hostEvent')}</h2>
                {clickedLocation && (
                  <p className="text-sm text-slate-400">
                    📍 {clickedLocation.lat.toFixed(4)}, {clickedLocation.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Game Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('map.selectGame')}
              </label>
              <select
                value={formData.game}
                onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">{t('map.chooseGame')}</option>
                {games.map((game) => (
                  <option key={game} value={game}>{game}</option>
                ))}
              </select>
            </div>

            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('map.eventTitle')}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder={t('map.eventTitlePlaceholder')}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('map.description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder={t('map.descriptionPlaceholder')}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('map.date')}
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('map.time')}
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('map.region')}
                </label>
                <input
                  type="text"
                  value={formData.location.region}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location, region: e.target.value }
                  })}
                  required
                  placeholder={t('map.regionPlaceholder')}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('map.postalCode')}
                </label>
                <input
                  type="text"
                  value={formData.location.postalCode}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location, postalCode: e.target.value }
                  })}
                  required
                  placeholder={t('map.postalCodePlaceholder')}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Max Players */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('map.maxPlayers')}
              </label>
              <select
                value={formData.maxPlayers}
                onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value={2}>2 {t('map.players')}</option>
                <option value={3}>3 {t('map.players')}</option>
                <option value={4}>4 {t('map.players')}</option>
                <option value={6}>6 {t('map.players')}</option>
                <option value={8}>8 {t('map.players')}</option>
              </select>
            </div>

            {/* Privacy Settings */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                {t('map.privacy')}
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="privacy"
                    checked={formData.isPublic}
                    onChange={() => setFormData({ ...formData, isPublic: true })}
                    className="mr-2 text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-slate-300">{t('map.publicEvent')}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="privacy"
                    checked={!formData.isPublic}
                    onChange={() => setFormData({ ...formData, isPublic: false })}
                    className="mr-2 text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-slate-300">{t('map.privateEvent')}</span>
                </label>
              </div>
              {!formData.isPublic && (
                <input
                  type="text"
                  value={formData.inviteCode}
                  onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                  placeholder={t('map.inviteCodePlaceholder')}
                  className="mt-2 w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors font-medium"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                {t('map.createEvent')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Component to handle map click events for hosting
const MapClickHandler: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    }
  })
  return null
}

// Component to handle map center updates
const MapCenterUpdater: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  
  return null
}

const Battle64Map: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useUser()
  const { 
    nearbyEvents, 
    allEvents, 
    countryStats, 
    selectedCountry, 
    createEvent, 
    joinEvent, 
    selectCountry,
    userLocation,
    setUserLocation,
    getEventsInRadius,
    calculateDistance
  } = useMapContext()

  const [isHostingModalOpen, setIsHostingModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null)
  const [gameFilter, setGameFilter] = useState('')
  const [distanceFilter, setDistanceFilter] = useState(30)
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.1657, 10.4515])
  const [mapZoom, setMapZoom] = useState(6)
  const [showRadius, setShowRadius] = useState(true)
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)

  // Request location permission on component mount
  useEffect(() => {
    if (navigator.geolocation && user && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            userId: user.id,
            country: 'Germany', // Would be determined by reverse geocoding
            region: 'Unknown',
            postalCode: '00000',
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            isVisible: true,
            lastUpdated: new Date()
          }
          setUserLocation(location)
          setMapCenter([position.coords.latitude, position.coords.longitude])
          setMapZoom(10)
        },
        (error) => {
          console.log('Location access denied:', error)
        }
      )
    }
  }, [user, userLocation, setUserLocation])

  const handleCreateEvent = async (eventData: any) => {
    try {
      await createEvent(eventData)
      // Show success notification
      alert(t('map.hostedSuccessfully'))
    } catch (error) {
      console.error('Failed to create event:', error)
    }
  }

  const handleJoinEvent = async (eventId: string) => {
    if (!userLocation) {
      alert(t('map.locationRequired'))
      return
    }

    const event = allEvents.find(e => e.id === eventId)
    if (!event) return

    const distance = calculateDistance(userLocation.coordinates, event.location.coordinates)
    if (distanceFilter > 0 && distance > distanceFilter) {
      alert(t('map.eventTooFar').replace('{distance}', distance.toFixed(1)).replace('{limit}', distanceFilter.toString()))
      return
    }

    try {
      await joinEvent(eventId)
      alert(t('map.youJoined'))
    } catch (error) {
      console.error('Failed to join event:', error)
    }
  }

  const filteredEvents = allEvents.filter(event => {
    if (gameFilter && event.game !== gameFilter) return false
    if (userLocation && distanceFilter > 0) {
      const distance = calculateDistance(userLocation.coordinates, event.location.coordinates)
      if (distance > distanceFilter) return false
    }
    return true
  })

  const nearbyFilteredEvents = userLocation && distanceFilter > 0 
    ? getEventsInRadius(userLocation.coordinates, distanceFilter)
    : nearbyEvents

  const games = [...new Set(allEvents.map(event => event.game))]

  const handleMapClick = (lat: number, lng: number) => {
    if (user) {
      setClickedLocation({ lat, lng })
      setIsHostingModalOpen(true)
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Enhanced Header with N64 styling */}
      <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-sm border-b-2 border-yellow-500/50 p-4 h-20 flex items-center shadow-xl">
        <div className="max-w-full mx-auto w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
                <MapPin className="w-7 h-7 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-yellow-400 tracking-wide">Battle64 Map</h1>
                <p className="text-slate-400 text-sm">{t('map.subtitle')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Radius Toggle */}
              {userLocation && (
                <button
                  onClick={() => setShowRadius(!showRadius)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    showRadius 
                      ? 'bg-yellow-600 text-black' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {showRadius ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span className="ml-1 hidden sm:inline">{t('map.radiusDisplay')}</span>
                </button>
              )}

              {/* Overlay Toggle */}
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  showOverlay 
                    ? 'bg-yellow-600 text-black' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Filters */}
              <div className="hidden md:flex items-center gap-2 text-sm">
                <select
                  value={gameFilter}
                  onChange={(e) => setGameFilter(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">{t('map.allGames')}</option>
                  {games.map((game) => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
                
                <select
                  value={distanceFilter}
                  onChange={(e) => setDistanceFilter(parseInt(e.target.value))}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-yellow-500"
                >
                  <option value={10}>10 km</option>
                  <option value={30}>30 km</option>
                  <option value={100}>100 km</option>
                  <option value={0}>{t('map.noLimit')}</option>
                </select>
              </div>
              
              {user && (
                <button
                  onClick={() => setIsHostingModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('map.hostEvent')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Enhanced Landscape Layout */}
      <div className="flex h-[calc(100vh-5rem)] relative">
        {/* Optional Left Overlay Panel */}
        {showOverlay && (
          <div className="absolute left-4 top-4 bottom-4 w-80 bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-xl p-4 overflow-y-auto z-10 shadow-2xl">
            {/* User Location Status */}
            {userLocation && (
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500 rounded-lg p-3 mb-4">
                <h3 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {t('map.yourLocation')}
                </h3>
                <div className="text-xs text-slate-300 space-y-1">
                  <div>{userLocation.region}, {userLocation.country}</div>
                  <div className="text-slate-400">{userLocation.postalCode}</div>
                  {showRadius && (
                    <div className="text-yellow-400 font-medium">
                      {t('map.yourRadius').replace('{radius}', distanceFilter.toString())}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Global Statistics */}
            <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500 rounded-lg p-3 mb-4">
              <h3 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t('map.globalStats')}
              </h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>{t('map.totalUsers')}:</span>
                  <span className="font-bold text-yellow-400">{countryStats.reduce((sum, country) => sum + country.activeUsers, 0)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{t('map.totalEvents')}:</span>
                  <span className="font-bold text-yellow-400">{countryStats.reduce((sum, country) => sum + country.totalEvents, 0)}</span>
                </div>
              </div>
            </div>

            {/* Country Stats */}
            <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500 rounded-lg p-3 mb-4">
              <h3 className="text-sm font-semibold text-yellow-400 mb-2">{t('map.countryStats')}</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {countryStats.map((country) => (
                  <button
                    key={country.countryCode}
                    onClick={() => selectCountry(country.countryCode)}
                    className={`w-full p-2 rounded border transition-all text-left ${
                      selectedCountry === country.countryCode
                        ? 'border-yellow-500 bg-yellow-500/20'
                        : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{country.flag}</span>
                        <span className="text-xs font-medium text-white">{country.country}</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {country.activeUsers}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Nearby Events */}
            <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t('map.nearbyEvents')} ({distanceFilter}km)
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {nearbyFilteredEvents.length === 0 ? (
                  <p className="text-slate-400 text-xs">{t('map.noNearbyEvents')}</p>
                ) : (
                  nearbyFilteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-2 bg-slate-700/50 rounded cursor-pointer hover:bg-slate-700 transition-colors border border-slate-600 hover:border-yellow-500"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="font-medium text-white text-xs">{event.title}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {event.game} • {event.currentPlayers}/{event.maxPlayers} {t('map.players')}
                      </div>
                      {userLocation && (
                        <div className="text-xs text-green-400 mt-1">
                          {calculateDistance(userLocation.coordinates, event.location.coordinates).toFixed(1)}km {t('map.away')}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Center - Enhanced Interactive Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapCenterUpdater center={mapCenter} zoom={mapZoom} />
            <MapClickHandler onMapClick={handleMapClick} />

            {/* User Location Marker with Radius Circles */}
            {userLocation && (
              <>
                <Marker 
                  position={[userLocation.coordinates.lat, userLocation.coordinates.lng]}
                  icon={myLocationIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <strong>{t('map.yourLocation')}</strong><br />
                      {userLocation.region}, {userLocation.country}
                    </div>
                  </Popup>
                </Marker>
                
                {/* Radius Circles */}
                {showRadius && (
                  <>
                    <Circle
                      center={[userLocation.coordinates.lat, userLocation.coordinates.lng]}
                      radius={10000} // 10km
                      pathOptions={{
                        color: '#eab308',
                        weight: 2,
                        opacity: 0.6,
                        fillOpacity: 0.1,
                        fillColor: '#eab308'
                      }}
                    />
                    <Circle
                      center={[userLocation.coordinates.lat, userLocation.coordinates.lng]}
                      radius={30000} // 30km
                      pathOptions={{
                        color: '#f59e0b',
                        weight: 2,
                        opacity: 0.4,
                        fillOpacity: 0.05,
                        fillColor: '#f59e0b'
                      }}
                    />
                    <Circle
                      center={[userLocation.coordinates.lat, userLocation.coordinates.lng]}
                      radius={100000} // 100km
                      pathOptions={{
                        color: '#d97706',
                        weight: 1,
                        opacity: 0.3,
                        fillOpacity: 0.02,
                        fillColor: '#d97706'
                      }}
                    />
                  </>
                )}
              </>
            )}

            {/* Enhanced Event Markers with Pulsing Animation */}
            {filteredEvents.map((event) => (
              <Marker 
                key={event.id}
                position={[event.location.coordinates.lat, event.location.coordinates.lng]}
                icon={eventIcon}
                eventHandlers={{
                  click: () => setSelectedEvent(event)
                }}
              >
                <Popup>
                  <div className="min-w-48 p-2">
                    <h4 className="font-bold text-lg mb-1 text-yellow-600">{event.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 font-medium">{event.game}</p>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {event.date.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        {event.date.toLocaleTimeString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        {event.currentPlayers}/{event.maxPlayers} {t('map.players')}
                      </div>
                    </div>
                    {event.description && (
                      <p className="text-sm mt-2 p-2 bg-gray-100 rounded border">{event.description}</p>
                    )}
                    {user && event.hostId !== user.id && event.currentPlayers < event.maxPlayers && (
                      <button
                        onClick={() => handleJoinEvent(event.id)}
                        className="w-full mt-2 px-3 py-1 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500 transition-colors"
                      >
                        {t('map.joinEvent')}
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Enhanced Map Legend */}
          <div className="absolute bottom-4 left-4 bg-slate-800/95 backdrop-blur-sm rounded-xl p-4 border border-slate-600 shadow-2xl">
            <div className="flex flex-col gap-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="font-medium">{t('map.pulsing')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>{t('map.activeUsers')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>{t('map.yourLocation')}</span>
              </div>
              {!user && (
                <div className="text-xs text-yellow-400 mt-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                  {t('map.clickToHost')}
                </div>
              )}
            </div>
          </div>

          {/* Click to Host Hint */}
          {user && !showOverlay && (
            <div className="absolute top-4 left-4 bg-yellow-600/90 text-black px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
              💡 {t('map.clickToHost')}
            </div>
          )}
        </div>

        {/* Optional Right Sidebar - Event Details */}
        {selectedEvent && (
          <div className="absolute right-4 top-4 bottom-4 w-80 bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-xl p-4 overflow-y-auto z-10 shadow-2xl">
            <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  {t('map.eventDetails')}
                </h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-white text-lg">{selectedEvent.title}</div>
                  <div className="text-sm text-yellow-400 font-medium">{selectedEvent.game}</div>
                </div>
                
                <div className="text-sm text-slate-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    {selectedEvent.date.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-400" />
                    {selectedEvent.date.toLocaleTimeString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-400" />
                    {selectedEvent.location.region}, {selectedEvent.location.country}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    {selectedEvent.currentPlayers}/{selectedEvent.maxPlayers} {t('map.players')}
                  </div>
                  {userLocation && (
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-orange-400" />
                      {calculateDistance(userLocation.coordinates, selectedEvent.location.coordinates).toFixed(1)}km {t('map.away')}
                    </div>
                  )}
                </div>

                {selectedEvent.description && (
                  <div className="text-sm text-slate-300 bg-slate-700/50 p-3 rounded border border-slate-600">
                    {selectedEvent.description}
                  </div>
                )}

                <div className="text-sm text-slate-400">
                  {t('map.hostedBy')}: <span className="text-yellow-400 font-medium">{selectedEvent.hostName}</span>
                </div>

                {user && selectedEvent.hostId !== user.id && selectedEvent.currentPlayers < selectedEvent.maxPlayers && (
                  <button
                    onClick={() => handleJoinEvent(selectedEvent.id)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all transform hover:scale-105 shadow-lg"
                  >
                    {t('map.joinEvent')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Event Hosting Modal */}
      <EventHostingModal
        isOpen={isHostingModalOpen}
        onClose={() => {
          setIsHostingModalOpen(false)
          setClickedLocation(null)
        }}
        onSubmit={handleCreateEvent}
        clickedLocation={clickedLocation}
      />
    </div>
  )
}

export default Battle64Map