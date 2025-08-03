import React, { useState, useEffect, useRef } from 'react'
import { useMap, MapEvent, CountryStats } from '../contexts/MapContext'
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
  Target
} from 'lucide-react'

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

// Simple world map component (placeholder for actual map implementation)
const WorldMap: React.FC<{
  events: MapEvent[]
  countryStats: CountryStats[]
  onCountryClick: (countryCode: string) => void
  onEventClick: (event: MapEvent) => void
  selectedCountry: string | null
}> = ({ events, countryStats, onCountryClick, onEventClick, selectedCountry }) => {
  const { t } = useLanguage()

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-600">
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t('map.worldMap')}
            </h3>
            <div className="text-sm text-slate-300">
              {events.length} {t('map.activeEvents')}
            </div>
          </div>
        </div>
      </div>

      {/* Simplified World Map with Country Regions */}
      <div className="w-full h-full flex items-center justify-center p-8 pt-20">
        <div className="grid grid-cols-4 gap-4 w-full max-w-4xl">
          {countryStats.map((country) => (
            <button
              key={country.countryCode}
              onClick={() => onCountryClick(country.countryCode)}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                selectedCountry === country.countryCode
                  ? 'border-yellow-500 bg-yellow-500/20'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
              }`}
            >
              <div className="text-2xl mb-2">{country.flag}</div>
              <div className="text-sm font-medium text-white">{country.country}</div>
              <div className="text-xs text-slate-400 mt-1">
                <div className="flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" />
                  {country.activeUsers}
                </div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {country.totalEvents}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Event Markers */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
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
    </div>
  )
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
    setUserLocation
  } = useMap()

  const [isHostingModalOpen, setIsHostingModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null)
  const [gameFilter, setGameFilter] = useState('')
  const [distanceFilter, setDistanceFilter] = useState(30)
  const [showFilters, setShowFilters] = useState(false)

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
    try {
      await joinEvent(eventId)
      // Show success message
    } catch (error) {
      console.error('Failed to join event:', error)
    }
  }

  const filteredEvents = allEvents.filter(event => {
    if (gameFilter && event.game !== gameFilter) return false
    return true
  })

  const games = [...new Set(allEvents.map(event => event.game))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-600 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-yellow-400">Battle64 Map</h1>
                <p className="text-slate-400 text-sm">{t('map.subtitle')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {t('map.filters')}
              </button>
              
              {user && (
                <button
                  onClick={() => setIsHostingModalOpen(true)}
                  className="px-6 py-2 bg-yellow-600 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t('map.hostEvent')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      {showFilters && (
        <div className="bg-slate-800/30 border-b border-slate-600 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-300">{t('map.game')}:</label>
                <select
                  value={gameFilter}
                  onChange={(e) => setGameFilter(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm"
                >
                  <option value="">{t('map.allGames')}</option>
                  {games.map((game) => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-300">{t('map.distance')}:</label>
                <select
                  value={distanceFilter}
                  onChange={(e) => setDistanceFilter(parseInt(e.target.value))}
                  className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm"
                >
                  <option value={10}>10 km</option>
                  <option value={30}>30 km</option>
                  <option value={50}>50 km</option>
                  <option value={100}>100 km</option>
                  <option value={0}>{t('map.noLimit')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Landscape Layout */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Filters & Stats */}
          <div className="lg:col-span-1 space-y-4">
            {/* User Location Status */}
            {userLocation && (
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {t('map.yourLocation')}
                </h3>
                <div className="text-sm text-slate-300 space-y-1">
                  <div>{userLocation.region}, {userLocation.country}</div>
                  <div className="text-slate-400">{userLocation.postalCode}</div>
                </div>
              </div>
            )}

            {/* Nearby Events */}
            <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {t('map.nearbyEvents')}
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {nearbyEvents.length === 0 ? (
                  <p className="text-slate-400 text-sm">{t('map.noNearbyEvents')}</p>
                ) : (
                  nearbyEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="font-medium text-white text-sm">{event.title}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {event.game} • {event.currentPlayers}/{event.maxPlayers} {t('map.players')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Country Stats */}
            <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t('map.globalStats')}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>{t('map.totalUsers')}:</span>
                  <span>{countryStats.reduce((sum, country) => sum + country.activeUsers, 0)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{t('map.totalEvents')}:</span>
                  <span>{countryStats.reduce((sum, country) => sum + country.totalEvents, 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center - World Map */}
          <div className="lg:col-span-2">
            <WorldMap
              events={filteredEvents}
              countryStats={countryStats}
              onCountryClick={selectCountry}
              onEventClick={setSelectedEvent}
              selectedCountry={selectedCountry}
            />
          </div>

          {/* Right Sidebar - Selected Event/Country Details */}
          <div className="lg:col-span-1 space-y-4">
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
                  
                  <div className="text-sm text-slate-300">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4" />
                      {selectedEvent.date.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4" />
                      {selectedEvent.date.toLocaleTimeString()}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4" />
                      {selectedEvent.location.region}, {selectedEvent.location.country}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {selectedEvent.currentPlayers}/{selectedEvent.maxPlayers} {t('map.players')}
                    </div>
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
            ) : selectedCountry ? (
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {t('map.countryDetails')}
                </h3>
                {(() => {
                  const country = countryStats.find(c => c.countryCode === selectedCountry)
                  if (!country) return null
                  
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{country.flag}</span>
                        <div>
                          <div className="font-medium text-white">{country.country}</div>
                          <div className="text-sm text-slate-400">{country.countryCode}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-slate-300">
                          <span>{t('map.activeUsers')}:</span>
                          <span>{country.activeUsers}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>{t('map.totalEvents')}:</span>
                          <span>{country.totalEvents}</span>
                        </div>
                      </div>

                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        {t('map.countryForum')}
                      </button>
                    </div>
                  )
                })()}
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
            <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
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
                        {event.game} • {event.location.country}
                      </div>
                    </div>
                  ))
                )}
              </div>
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