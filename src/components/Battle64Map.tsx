import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
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
  Navigation
} from 'lucide-react'

// Fix for default Leaflet markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons for different marker types
const createCustomIcon = (color: string, symbol: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">${symbol}</div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

const eventIcon = createCustomIcon('#EAB308', '🎮')
const userIcon = createCustomIcon('#3B82F6', '👤')
const myLocationIcon = createCustomIcon('#10B981', '📍')

interface EventHostingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (eventData: any) => void
}

const EventHostingModal: React.FC<EventHostingModalProps> = ({ isOpen, onClose, onSubmit }) => {
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
      coordinates: { lat: 52.5200, lng: 13.4050 }
    },
    maxPlayers: 4,
    isPublic: true,
    inviteCode: ''
  })

  const games = [
    'Mario Kart 64',
    'Super Smash Bros',
    'GoldenEye 007',
    'Mario Party',
    'Super Mario 64',
    'The Legend of Zelda: Ocarina of Time',
    'Mario Tennis',
    'F-Zero X'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const eventData = {
      hostId: user.id,
      hostName: user.username,
      game: formData.game,
      title: formData.title,
      description: formData.description,
      date: new Date(`${formData.date}T${formData.time}`),
      location: formData.location,
      maxPlayers: formData.maxPlayers,
      isPublic: formData.isPublic,
      inviteCode: formData.isPublic ? undefined : formData.inviteCode,
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-600 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              {t('map.hostEvent')}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
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
                    className="mr-2"
                  />
                  <span className="text-slate-300">{t('map.publicEvent')}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="privacy"
                    checked={!formData.isPublic}
                    onChange={() => setFormData({ ...formData, isPublic: false })}
                    className="mr-2"
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
                className="flex-1 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-yellow-600 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
              >
                {t('map.createEvent')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Component to handle map click events
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
      // Show success message
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
      // Show success message
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
    // Optional: Handle map clicks for future features
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Header - Fixed height */}
      <div className="bg-slate-800/50 border-b border-slate-600 p-3 h-16 flex items-center">
        <div className="max-w-full mx-auto w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-yellow-400">Battle64 Map</h1>
                <p className="text-slate-400 text-xs">{t('map.subtitle')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Filters */}
              <div className="flex items-center gap-2 text-sm">
                <select
                  value={gameFilter}
                  onChange={(e) => setGameFilter(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs"
                >
                  <option value="">{t('map.allGames')}</option>
                  {games.map((game) => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
                
                <select
                  value={distanceFilter}
                  onChange={(e) => setDistanceFilter(parseInt(e.target.value))}
                  className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs"
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
                  className="px-4 py-1.5 bg-yellow-600 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-1 text-sm"
                >
                  <Plus className="w-3 h-3" />
                  {t('map.hostEvent')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Landscape Layout */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Stats & Events */}
        <div className="w-80 bg-slate-800/30 border-r border-slate-600 p-4 overflow-y-auto">
          {/* User Location Status */}
          {userLocation && (
            <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 mb-4">
              <h3 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                {t('map.yourLocation')}
              </h3>
              <div className="text-xs text-slate-300 space-y-1">
                <div>{userLocation.region}, {userLocation.country}</div>
                <div className="text-slate-400">{userLocation.postalCode}</div>
              </div>
            </div>
          )}

          {/* Global Statistics */}
          <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 mb-4">
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
          <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 mb-4">
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
          <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3">
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
                    className="p-2 bg-slate-700/50 rounded cursor-pointer hover:bg-slate-700 transition-colors"
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

        {/* Center - Interactive Map */}
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

            {/* User Location Marker */}
            {userLocation && (
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
            )}

            {/* Event Markers */}
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
                  <div className="min-w-48">
                    <h4 className="font-bold text-sm mb-1">{event.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{event.game}</p>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.date.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.date.toLocaleTimeString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.currentPlayers}/{event.maxPlayers} {t('map.players')}
                      </div>
                    </div>
                    {event.description && (
                      <p className="text-xs mt-2 p-2 bg-gray-100 rounded">{event.description}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
            <div className="flex items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                {t('map.upcomingEvents')}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                {t('map.activeUsers')}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                {t('map.yourLocation')}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Event Details */}
        <div className="w-80 bg-slate-800/30 border-l border-slate-600 p-4 overflow-y-auto">
          {selectedEvent ? (
            <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                {t('map.eventDetails')}
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-white">{selectedEvent.title}</div>
                  <div className="text-sm text-slate-400">{selectedEvent.game}</div>
                </div>
                
                <div className="text-sm text-slate-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {selectedEvent.date.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedEvent.date.toLocaleTimeString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedEvent.location.region}, {selectedEvent.location.country}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {selectedEvent.currentPlayers}/{selectedEvent.maxPlayers} {t('map.players')}
                  </div>
                  {userLocation && (
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4" />
                      {calculateDistance(userLocation.coordinates, selectedEvent.location.coordinates).toFixed(1)}km {t('map.away')}
                    </div>
                  )}
                </div>

                {selectedEvent.description && (
                  <div className="text-sm text-slate-300 bg-slate-700/50 p-3 rounded">
                    {selectedEvent.description}
                  </div>
                )}

                <div className="text-sm text-slate-400">
                  {t('map.hostedBy')}: {selectedEvent.hostName}
                </div>

                {user && selectedEvent.hostId !== user.id && selectedEvent.currentPlayers < selectedEvent.maxPlayers && (
                  <button
                    onClick={() => handleJoinEvent(selectedEvent.id)}
                    className="w-full px-4 py-2 bg-yellow-600 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    {t('map.joinEvent')}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                {t('map.welcome')}
              </h3>
              <div className="text-sm text-slate-300 space-y-2">
                <p>{t('map.welcomeDescription')}</p>
                <ul className="space-y-1 text-slate-400">
                  <li>• {t('map.clickCountry')}</li>
                  <li>• {t('map.viewEvents')}</li>
                  <li>• {t('map.hostYourOwn')}</li>
                </ul>
              </div>
            </div>
          )}

          {/* All Events List */}
          <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 mt-4">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              {t('map.allEvents')}
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredEvents.length === 0 ? (
                <p className="text-slate-400 text-sm">{t('map.noEvents')}</p>
              ) : (
                filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-2 bg-slate-700/30 rounded cursor-pointer hover:bg-slate-700/50 transition-colors"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="font-medium text-white text-sm">{event.title}</div>
                    <div className="text-xs text-slate-400">
                      {event.game} • {event.location.country} • {event.currentPlayers}/{event.maxPlayers}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Hosting Modal */}
      <EventHostingModal
        isOpen={isHostingModalOpen}
        onClose={() => setIsHostingModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
    </div>
  )
}

export default Battle64Map