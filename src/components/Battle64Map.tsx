import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// Import marker clustering
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import { useMap as useMapContext, MapEvent } from '../contexts/MapContext'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  MapPin, 
  Plus, 
  Users, 
  Calendar, 
  Clock, 
  Globe, 
  X,
  Gamepad2,
  Target,
  Navigation,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  Info
} from 'lucide-react'

// Fix for default Leaflet markers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Enhanced emoji-based custom icons with balanced glow effects
const createEmojiIcon = (emoji: string, isPulsing: boolean = false, isNightMode: boolean = false, isHovered: boolean = false) => {
  const baseStyles = isNightMode ? {
    background: 'linear-gradient(135deg, #0B0F1E, #1F2633)',
    borderColor: '#eab308',
    glowColor: isHovered ? 'rgba(234, 179, 8, 0.9)' : 'rgba(234, 179, 8, 0.4)',
    shadowColor: isHovered ? 'rgba(234, 179, 8, 1.0)' : 'rgba(234, 179, 8, 0.6)'
  } : {
    background: 'linear-gradient(135deg, #1e293b, #334155)',
    borderColor: '#eab308',
    glowColor: isHovered ? 'rgba(234, 179, 8, 0.7)' : 'rgba(234, 179, 8, 0.3)',
    shadowColor: isHovered ? 'rgba(234, 179, 8, 0.8)' : 'rgba(234, 179, 8, 0.4)'
  }

  return L.divIcon({
    className: 'custom-emoji-icon',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: ${baseStyles.background};
        border: 3px solid ${baseStyles.borderColor};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 4px 12px ${baseStyles.glowColor}${isNightMode ? ', 0 0 20px ' + baseStyles.glowColor : ''};
        position: relative;
        ${isPulsing ? 'animation: balanced-pulse-glow 2.5s infinite;' : ''}
        ${isHovered ? 'animation: hover-glow 0.3s ease-out forwards;' : ''}
        ${isNightMode ? 'filter: drop-shadow(0 0 10px ' + baseStyles.shadowColor + ');' : ''}
        transition: all 0.3s ease;
      ">
        ${emoji}
        ${isPulsing ? `<div style="position: absolute; inset: -6px; border-radius: 50%; background: radial-gradient(circle, ${baseStyles.glowColor} 0%, transparent 70%); animation: balanced-pulse-ring 2.5s infinite;"></div>` : ''}
      </div>
      <style>
        @keyframes balanced-pulse-glow {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 4px 12px ${baseStyles.glowColor}${isNightMode ? ', 0 0 20px ' + baseStyles.glowColor : ''}; 
          }
          50% { 
            transform: scale(1.08); 
            box-shadow: 0 6px 18px ${baseStyles.shadowColor}${isNightMode ? ', 0 0 25px ' + baseStyles.shadowColor : ''}; 
          }
        }
        @keyframes hover-glow {
          0% { transform: scale(1); }
          100% { 
            transform: scale(1.12); 
            box-shadow: 0 8px 25px ${baseStyles.shadowColor}${isNightMode ? ', 0 0 35px ' + baseStyles.shadowColor : ''}; 
          }
        }
        @keyframes balanced-pulse-ring {
          0% { transform: scale(0.8); opacity: 0.7; }
          100% { transform: scale(2); opacity: 0; }
        }
      </style>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  })
}

// Create cluster icon for multiple events at same location
const createClusterIcon = (count: number, isNightMode: boolean = false) => {
  const baseStyles = isNightMode ? {
    background: 'linear-gradient(135deg, #7c2d12, #dc2626)',
    borderColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.8)',
    textColor: '#ffffff'
  } : {
    background: 'linear-gradient(135deg, #7c2d12, #dc2626)',
    borderColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    textColor: '#ffffff'
  }

  return L.divIcon({
    className: 'cluster-icon',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: ${baseStyles.background};
        border: 3px solid ${baseStyles.borderColor};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        color: ${baseStyles.textColor};
        box-shadow: 0 4px 15px ${baseStyles.glowColor}${isNightMode ? ', 0 0 25px ' + baseStyles.glowColor : ''};
        position: relative;
        animation: cluster-pulse 2s infinite;
        ${isNightMode ? 'filter: drop-shadow(0 0 12px ' + baseStyles.glowColor + ');' : ''}
      ">
        ${count}
        <div style="
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: radial-gradient(circle, ${baseStyles.glowColor} 0%, transparent 70%);
          animation: cluster-ring 2s infinite;
          z-index: -1;
        "></div>
      </div>
      <style>
        @keyframes cluster-pulse {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 4px 15px ${baseStyles.glowColor}${isNightMode ? ', 0 0 25px ' + baseStyles.glowColor : ''}; 
          }
          50% { 
            transform: scale(1.1); 
            box-shadow: 0 6px 20px ${baseStyles.glowColor}${isNightMode ? ', 0 0 35px ' + baseStyles.glowColor : ''}; 
          }
        }
        @keyframes cluster-ring {
          0% { transform: scale(0.9); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      </style>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  })
}

// Enhanced user location icon with stronger glow and pulsing
const createUserLocationIcon = (isNightMode: boolean = false) => {
  const baseStyles = isNightMode ? {
    background: 'linear-gradient(135deg, #065f46, #047857)',
    borderColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 1.0)',
    shadowColor: 'rgba(16, 185, 129, 0.8)',
    textColor: '#ffffff'
  } : {
    background: 'linear-gradient(135deg, #065f46, #047857)',
    borderColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.7)',
    shadowColor: 'rgba(16, 185, 129, 0.5)',
    textColor: '#ffffff'
  }

  return L.divIcon({
    className: 'user-location-icon',
    html: `
      <div style="
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: ${baseStyles.background};
        border: 3px solid ${baseStyles.borderColor};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 6px 20px ${baseStyles.glowColor}${isNightMode ? ', 0 0 35px ' + baseStyles.glowColor + ', 0 0 50px ' + baseStyles.shadowColor : ''};
        position: relative;
        animation: enhanced-pulse 2.5s infinite;
        ${isNightMode ? 'filter: drop-shadow(0 0 20px ' + baseStyles.glowColor + ');' : ''}
        z-index: 1000;
      ">
        🟢
        <div style="
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.9);
          color: ${baseStyles.textColor};
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          ${isNightMode ? 'border: 1px solid ' + baseStyles.borderColor + ';' : ''}
          animation: label-pulse 2.5s infinite;
        ">
          YOU
        </div>
        <div style="
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          background: radial-gradient(circle, ${baseStyles.glowColor} 0%, transparent 70%);
          animation: pulse-ring 2.5s infinite;
          z-index: -1;
        "></div>
      </div>
      <style>
        @keyframes enhanced-pulse {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 6px 20px ${baseStyles.glowColor}${isNightMode ? ', 0 0 35px ' + baseStyles.glowColor + ', 0 0 50px ' + baseStyles.shadowColor : ''}; 
          }
          50% { 
            transform: scale(1.15); 
            box-shadow: 0 8px 30px ${baseStyles.shadowColor}${isNightMode ? ', 0 0 45px ' + baseStyles.shadowColor + ', 0 0 65px ' + baseStyles.glowColor : ''}; 
          }
        }
        @keyframes label-pulse {
          0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.8; transform: translateX(-50%) scale(1.05); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      </style>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  })
}

  // N64-themed emoji icons - will be created dynamically based on night mode

interface EventFormData {
  game: string
  title: string
  description: string
  date: string
  time: string
  category: 'casual' | 'tournament' | 'speedrun' | 'meetup'
  location: {
    country: string
    region: string
    postalCode: string
    coordinates: { lat: number; lng: number }
  }
  maxPlayers: number
  isPublic: boolean
  inviteCode: string
}

interface EventSubmissionData {
  game: string
  title: string
  description: string
  date: Date
  category: 'casual' | 'tournament' | 'speedrun' | 'meetup'
  location: {
    country: string
    region: string
    postalCode: string
    coordinates: { lat: number; lng: number }
  }
  maxPlayers: number
  isPublic: boolean
  inviteCode?: string
  hostId: string
  hostName: string
  status: 'upcoming'
}

interface EventHostingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (eventData: EventSubmissionData) => void
  clickedLocation?: { lat: number; lng: number } | null
}

const EventHostingModal: React.FC<EventHostingModalProps> = ({ isOpen, onClose, onSubmit, clickedLocation }) => {
  const { t } = useLanguage()
  const { user } = useUser()
  const [formData, setFormData] = useState<EventFormData>({
    game: '',
    title: '',
    description: '',
    date: '',
    time: '',
    category: 'casual',
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
        hostName: user.username,
        date: new Date(`${formData.date}T${formData.time}`),
        status: 'upcoming' as const
      }

    try {
      onSubmit(eventData)
      onClose()
      
      // Reset form
      setFormData({
        game: '',
        title: '',
        description: '',
        date: '',
        time: '',
        category: 'casual',
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
    } catch (error) {
      console.error('Error submitting event:', error)
    }
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

            {/* Event Category */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('event.category')}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'casual' | 'tournament' | 'speedrun' | 'meetup' })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="casual">🎮 {t('event.type.casual')}</option>
                <option value="tournament">🏆 {t('event.type.tournament')}</option>
                <option value="speedrun">🏁 {t('event.type.speedrun')}</option>
                <option value="meetup">🤝 {t('event.type.meetup')}</option>
              </select>
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
  const [isNightMode, setIsNightMode] = useState(false)
  const [isLocationLoading, setIsLocationLoading] = useState(false)
  const [showLegend, setShowLegend] = useState(true)

  // Load night mode preference from localStorage
  useEffect(() => {
    const savedNightMode = localStorage.getItem('battle64.nightmode')
    if (savedNightMode) {
      setIsNightMode(JSON.parse(savedNightMode))
    }
  }, [])

  // Save night mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('battle64.nightmode', JSON.stringify(isNightMode))
  }, [isNightMode])

  // Enhanced location detection with reverse geocoding simulation
  const updateUserLocation = useCallback(async () => {
    if (!navigator.geolocation || !user) return

    setIsLocationLoading(true)
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Simulate reverse geocoding - in production, use a real service
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          // Simple region detection based on coordinates (for demo purposes)
          let country = 'Germany'
          let region = 'Unknown'
          let postalCode = '00000'
          
          // Basic coordinate-based region detection
          if (lat >= 47 && lat <= 55 && lng >= 5 && lng <= 15) {
            country = 'Germany'
            if (lat >= 52.3 && lat <= 52.7 && lng >= 13.0 && lng <= 13.8) {
              region = 'Berlin'
              postalCode = '10115'
            } else if (lat >= 48.0 && lat <= 48.3 && lng >= 11.3 && lng <= 11.8) {
              region = 'Munich'
              postalCode = '80331'
            } else if (lat >= 48.7 && lat <= 49.0 && lng >= 8.1 && lng <= 8.5) {
              region = 'Stuttgart'
              postalCode = '70173'
            }
          }
          
          const location = {
            userId: user.id,
            country,
            region,
            postalCode,
            coordinates: { lat, lng },
            isVisible: true,
            lastUpdated: new Date()
          }
          
          setUserLocation(location)
          setMapCenter([lat, lng])
          setMapZoom(10)
        } catch (error) {
          console.error('Error processing location:', error)
        } finally {
          setIsLocationLoading(false)
        }
      },
      (error) => {
        console.warn('Location access denied:', error.message)
        // Set a default location if user denies location access
        const defaultLocation = {
          userId: user.id,
          country: 'Germany',
          region: 'Berlin',
          postalCode: '10115',
          coordinates: {
            lat: 52.5200,
            lng: 13.4050
          },
          isVisible: false,
          lastUpdated: new Date()
        }
        setUserLocation(defaultLocation)
        setIsLocationLoading(false)
      },
      {
        timeout: 15000,
        enableHighAccuracy: true,
        maximumAge: 60000 // 1 minute
      }
    )
  }, [user, setUserLocation])

  // Request location permission on component mount
  useEffect(() => {
    if (user && !userLocation) {
      updateUserLocation()
    }
  }, [user, userLocation, updateUserLocation])

  const handleCreateEvent = async (eventData: EventSubmissionData) => {
    try {
      await createEvent(eventData)
      // Show success notification
      alert(t('map.hostedSuccessfully'))
    } catch (error) {
      console.error('Failed to create event:', error)
    }
  }

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      alert(t('auth.loginRequired') || 'Please log in to join events')
      return
    }

    if (!userLocation) {
      alert(t('map.locationRequired'))
      return
    }

    const event = allEvents.find(e => e.id === eventId)
    if (!event) {
      alert('Event not found')
      return
    }

    if (event.participants.includes(user.id)) {
      alert('You are already participating in this event')
      return
    }

    if (event.currentPlayers >= event.maxPlayers) {
      alert('Event is full')
      return
    }

    try {
      const distance = calculateDistance(userLocation.coordinates, event.location.coordinates)
      if (distanceFilter > 0 && distance > distanceFilter) {
        alert(t('map.eventTooFar').replace('{distance}', distance.toFixed(1)).replace('{limit}', distanceFilter.toString()))
        return
      }

      await joinEvent(eventId)
      alert(t('map.youJoined'))
    } catch (error) {
      console.error('Failed to join event:', error)
      alert('Failed to join event. Please try again.')
    }
  }

  const filteredEvents = allEvents.filter(event => {
    if (gameFilter && event.game !== gameFilter) return false
    if (userLocation && distanceFilter > 0) {
      try {
        const distance = calculateDistance(userLocation.coordinates, event.location.coordinates)
        if (distance > distanceFilter) return false
      } catch (error) {
        console.warn('Error calculating distance:', error)
        return false
      }
    }
    return true
  })

  const nearbyFilteredEvents = userLocation && distanceFilter > 0 
    ? getEventsInRadius(userLocation.coordinates, distanceFilter).filter(event => 
        gameFilter ? event.game === gameFilter : true
      )
    : nearbyEvents.filter(event => 
        gameFilter ? event.game === gameFilter : true
      )

  // Enhanced clustering logic for overlapping markers
  const clusteredEvents = useMemo(() => {
    const clusters: Array<{
      position: [number, number]
      events: MapEvent[]
      isCluster: boolean
    }> = []
    
    const processedEvents = new Set<string>()
    const CLUSTER_DISTANCE = 0.01 // ~1km clustering radius
    
    filteredEvents.forEach(event => {
      if (processedEvents.has(event.id)) return
      
      const eventCoords = [event.location.coordinates.lat, event.location.coordinates.lng] as [number, number]
      const nearbyEvents = filteredEvents.filter(otherEvent => {
        if (processedEvents.has(otherEvent.id) || otherEvent.id === event.id) return false
        
        const distance = Math.sqrt(
          Math.pow(event.location.coordinates.lat - otherEvent.location.coordinates.lat, 2) +
          Math.pow(event.location.coordinates.lng - otherEvent.location.coordinates.lng, 2)
        )
        
        return distance < CLUSTER_DISTANCE
      })
      
      if (nearbyEvents.length > 0) {
        // Create cluster with offset positioning
        const allEvents = [event, ...nearbyEvents]
        allEvents.forEach(e => processedEvents.add(e.id))
        
        // Calculate cluster center
        const centerLat = allEvents.reduce((sum, e) => sum + e.location.coordinates.lat, 0) / allEvents.length
        const centerLng = allEvents.reduce((sum, e) => sum + e.location.coordinates.lng, 0) / allEvents.length
        
        clusters.push({
          position: [centerLat, centerLng],
          events: allEvents,
          isCluster: true
        })
      } else {
        // Single event
        processedEvents.add(event.id)
        clusters.push({
          position: eventCoords,
          events: [event],
          isCluster: false
        })
      }
    })
    
    return clusters
  }, [filteredEvents])

  const games = [...new Set(allEvents.map(event => event.game))]

  // Create cluster icon
  const createClusterIcon = (count: number, isNightMode: boolean = false) => {
    const baseStyles = isNightMode ? {
      background: 'linear-gradient(135deg, #7c2d12, #dc2626)',
      borderColor: '#f59e0b',
      glowColor: 'rgba(245, 158, 11, 0.8)',
      textColor: '#ffffff'
    } : {
      background: 'linear-gradient(135deg, #7c2d12, #dc2626)',
      borderColor: '#f59e0b',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      textColor: '#ffffff'
    }

    return L.divIcon({
      className: 'event-cluster-icon',
      html: `
        <div style="
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: ${baseStyles.background};
          border: 3px solid ${baseStyles.borderColor};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          color: ${baseStyles.textColor};
          box-shadow: 0 4px 12px ${baseStyles.glowColor}${isNightMode ? ', 0 0 25px ' + baseStyles.glowColor : ''};
          animation: cluster-pulse 2s infinite;
          ${isNightMode ? 'filter: drop-shadow(0 0 15px ' + baseStyles.glowColor + ');' : ''}
        ">
          ${count}
        </div>
        <style>
          @keyframes cluster-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        </style>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    })
  }

  const handleMapClick = (lat: number, lng: number) => {
    if (user) {
      // Check if location is within reasonable hosting distance
      if (userLocation) {
        const distance = calculateDistance(userLocation.coordinates, { lat, lng })
        if (distance > 100) { // 100km max hosting distance
          alert(t('map.hostingTooFar') || 'Location too far from your position to host an event')
          return
        }
      }
      setClickedLocation({ lat, lng })
      setIsHostingModalOpen(true)
    } else {
      alert(t('auth.loginRequired') || 'Please log in to host events')
    }
  }

  return (
    <div className={`h-screen overflow-hidden transition-all duration-500 ${
      isNightMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-black' 
        : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    }`}>
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
              {/* Compact Menu Toggle */}
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                  showOverlay 
                    ? 'bg-yellow-600 text-black shadow-lg' 
                    : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600/80 hover:text-white'
                }`}
                title={showOverlay ? t('map.hideMenu') : t('map.showMenu')}
              >
                <Settings className="w-4 h-4" />
              </button>

                                              {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  {/* Quick Night Mode Toggle */}
                  <button
                    onClick={() => setIsNightMode(!isNightMode)}
                    className={`px-2 py-2 rounded-lg text-sm font-medium transition-all ${
                      isNightMode
                        ? 'bg-yellow-600 text-black'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                    title={isNightMode ? t('map.disableNightMode') : t('map.enableNightMode')}
                  >
                    🌙
                  </button>
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
        {/* Enhanced Slide-In Control Panel */}
        <div className={`absolute left-0 top-0 bottom-0 z-10 transition-all duration-300 ease-out ${
          showOverlay ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className={`w-80 h-full backdrop-blur-sm border-r p-4 overflow-y-auto shadow-2xl ${
            isNightMode 
              ? 'bg-slate-900/95 border-yellow-500/50 shadow-yellow-500/20' 
              : 'bg-slate-800/95 border-slate-600'
          }`}>
            {/* Panel Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-yellow-400">Battle64 Map Controls</h2>
              <button
                onClick={() => setShowOverlay(false)}
                className="p-1 hover:bg-slate-700 rounded transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Filters Section */}
            <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500 rounded-lg p-3 mb-4">
              <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {t('map.filters')}
              </h3>
              <div className="space-y-3">
                {/* Game Filter */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t('map.game')}
                  </label>
                  <select
                    value={gameFilter}
                    onChange={(e) => setGameFilter(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">{t('map.allGames')}</option>
                    {games.map((game) => (
                      <option key={game} value={game}>{game}</option>
                    ))}
                  </select>
                </div>
                
                {/* Distance Filter */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {t('map.distance')}
                  </label>
                  <select
                    value={distanceFilter}
                    onChange={(e) => setDistanceFilter(parseInt(e.target.value))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value={10}>10 km</option>
                    <option value={30}>30 km</option>
                    <option value={100}>100 km</option>
                    <option value={0}>{t('map.noLimit')}</option>
                  </select>
                </div>

                {/* View Options */}
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showRadius}
                      onChange={(e) => setShowRadius(e.target.checked)}
                      className="mr-2 text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-slate-300">{t('map.radiusDisplay')}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isNightMode}
                      onChange={(e) => setIsNightMode(e.target.checked)}
                      className="mr-2 text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-slate-300">🌙 {t('map.nightMode')}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* User Location Status */}
            {userLocation && (
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    {t('map.yourLocation')}
                  </h3>
                  <button
                    onClick={updateUserLocation}
                    disabled={isLocationLoading}
                    className={`p-1 rounded transition-colors ${
                      isLocationLoading 
                        ? 'text-slate-500 cursor-not-allowed' 
                        : 'text-slate-300 hover:text-yellow-400 hover:bg-slate-600'
                    }`}
                    title={t('map.updateLocation')}
                  >
                    <RefreshCw className={`w-3 h-3 ${isLocationLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div>{userLocation.region}, {userLocation.country}</div>
                  <div className="text-slate-400">{userLocation.postalCode}</div>
                  {showRadius && (
                    <div className="text-yellow-400 font-medium">
                      {t('map.yourRadius').replace('{radius}', distanceFilter.toString())}
                    </div>
                  )}
                  {isLocationLoading && (
                    <div className="text-blue-400 font-medium">
                      Updating location...
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
                {t('map.nearbyEvents').replace(' (30km)', '')} ({distanceFilter} km)
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
        </div>

        {/* Center - Enhanced Interactive Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            {/* Base map layer */}
            <TileLayer
              attribution={isNightMode ? '&copy; <a href="https://carto.com/attributions">CARTO</a>' : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
              url={isNightMode 
                ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
            />
            
            {/* White text overlay for night mode */}
            {isNightMode && (
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                opacity={0.9}
              />
            )}
            
            <MapCenterUpdater center={mapCenter} zoom={mapZoom} />
            <MapClickHandler onMapClick={handleMapClick} />

            {/* User Location Marker with Radius Circles */}
            {userLocation && (
              <>
                <Marker 
                  position={[userLocation.coordinates.lat, userLocation.coordinates.lng]}
                  icon={createUserLocationIcon(isNightMode)}
                >
                  <Popup className={isNightMode ? 'night-mode-popup' : ''}>
                    <div className={`text-center p-2 ${isNightMode ? 'bg-slate-800 text-white' : ''}`}>
                      <div className={`font-bold text-lg mb-1 ${isNightMode ? 'text-green-400' : 'text-green-600'}`}>
                        {t('map.youAreHere')}
                      </div>
                      <div className={`text-sm ${isNightMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        {userLocation.region}, {userLocation.country}
                      </div>
                      <div className={`text-xs mt-1 ${isNightMode ? 'text-slate-400' : 'text-gray-500'}`}>
                        {userLocation.postalCode}
                      </div>
                      {showRadius && (
                        <div className={`text-xs mt-2 ${isNightMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                          Search radius: {distanceFilter}km
                        </div>
                      )}
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

            {/* Enhanced Event Markers with Clustering */}
            {clusteredEvents.map((cluster, index) => (
              <Marker 
                key={`cluster-${index}`}
                position={cluster.position}
                icon={cluster.isCluster 
                  ? createClusterIcon(cluster.events.length, isNightMode)
                  : createEmojiIcon('🎮', true, isNightMode)
                }
                eventHandlers={{
                  click: () => {
                    if (cluster.isCluster) {
                      // For clusters, show the first event or open a selection dialog
                      setSelectedEvent(cluster.events[0])
                    } else {
                      setSelectedEvent(cluster.events[0])
                    }
                  }
                }}
              >
                <Popup className={isNightMode ? 'night-mode-popup' : ''}>
                  <div className={`min-w-48 p-2 ${isNightMode ? 'bg-slate-800 text-white' : ''}`}>
                    {cluster.isCluster ? (
                      <>
                        <h4 className={`font-bold text-lg mb-2 ${isNightMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                          {cluster.events.length} Events Here
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {cluster.events.map((event) => (
                            <div 
                              key={event.id}
                              className={`p-2 rounded cursor-pointer transition-colors ${
                                isNightMode 
                                  ? 'bg-slate-700 hover:bg-slate-600 border border-slate-600' 
                                  : 'bg-gray-100 hover:bg-gray-200 border'
                              }`}
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className={`font-medium ${isNightMode ? 'text-white' : 'text-gray-900'}`}>
                                {event.title}
                              </div>
                              <div className={`text-sm ${isNightMode ? 'text-yellow-400' : 'text-gray-600'}`}>
                                {event.game}
                              </div>
                              <div className={`text-xs ${isNightMode ? 'text-slate-300' : 'text-gray-500'}`}>
                                {event.currentPlayers}/{event.maxPlayers} players
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-bold text-lg ${isNightMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                            {cluster.events[0].title}
                          </h4>
                          {cluster.events[0].category && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              cluster.events[0].category === 'tournament' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              cluster.events[0].category === 'speedrun' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              cluster.events[0].category === 'meetup' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {cluster.events[0].category === 'tournament' ? '🏆' :
                               cluster.events[0].category === 'speedrun' ? '🏁' :
                               cluster.events[0].category === 'meetup' ? '🤝' : '🎮'}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm mb-2 font-medium ${isNightMode ? 'text-yellow-300' : 'text-gray-600'}`}>
                          {cluster.events[0].game}
                        </p>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className={`w-4 h-4 ${isNightMode ? 'text-blue-400' : 'text-blue-500'}`} />
                            <span className={isNightMode ? 'text-slate-300' : 'text-gray-700'}>
                              {cluster.events[0].date.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${isNightMode ? 'text-green-400' : 'text-green-500'}`} />
                            <span className={isNightMode ? 'text-slate-300' : 'text-gray-700'}>
                              {cluster.events[0].date.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className={`w-4 h-4 ${isNightMode ? 'text-purple-400' : 'text-purple-500'}`} />
                            <span className={isNightMode ? 'text-slate-300' : 'text-gray-700'}>
                              {cluster.events[0].currentPlayers}/{cluster.events[0].maxPlayers} {t('map.players')}
                            </span>
                          </div>
                          {userLocation && (
                            <div className="flex items-center gap-2">
                              <Navigation className={`w-4 h-4 ${isNightMode ? 'text-orange-400' : 'text-orange-500'}`} />
                              <span className={`${isNightMode ? 'text-green-400' : 'text-green-600'} font-medium`}>
                                {calculateDistance(userLocation.coordinates, cluster.events[0].location.coordinates).toFixed(1)}km {t('map.away')}
                              </span>
                            </div>
                          )}
                        </div>
                        {cluster.events[0].description && (
                          <p className={`text-sm mt-2 p-2 rounded border ${
                            isNightMode 
                              ? 'bg-slate-700 border-slate-600 text-slate-300' 
                              : 'bg-gray-100 border-gray-300 text-gray-700'
                          }`}>
                            {cluster.events[0].description}
                          </p>
                        )}
                        {user && cluster.events[0].hostId !== user.id && cluster.events[0].currentPlayers < cluster.events[0].maxPlayers && (
                          <button
                            onClick={() => handleJoinEvent(cluster.events[0].id)}
                            className={`w-full mt-2 px-3 py-2 font-semibold rounded transition-colors ${
                              userLocation && calculateDistance(userLocation.coordinates, cluster.events[0].location.coordinates) > distanceFilter && distanceFilter > 0
                                ? (isNightMode 
                                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                                  : 'bg-gray-400 text-gray-600 cursor-not-allowed')
                                : (isNightMode
                                  ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                                  : 'bg-yellow-600 text-black hover:bg-yellow-500')
                            }`}
                            disabled={!!(userLocation && calculateDistance(userLocation.coordinates, cluster.events[0].location.coordinates) > distanceFilter && distanceFilter > 0)}
                          >
                            {userLocation && calculateDistance(userLocation.coordinates, cluster.events[0].location.coordinates) > distanceFilter && distanceFilter > 0
                              ? t('map.tooFarToJoin')
                              : t('map.joinEvent')
                            }
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Compact Toggleable Legend */}
          <div className={`absolute bottom-4 left-4 transition-all duration-300`}>
            {/* Legend Toggle Button */}
            <button
              onClick={() => setShowLegend(!showLegend)}
              className={`mb-2 p-2 backdrop-blur-sm rounded-lg border shadow-lg transition-all duration-300 ${
                isNightMode 
                  ? 'bg-slate-900/90 border-yellow-500/50 text-yellow-400 hover:bg-slate-800/90' 
                  : 'bg-slate-800/90 border-slate-600 text-slate-300 hover:bg-slate-700/90'
              }`}
              title={showLegend ? t('map.hideLegend') : t('map.showLegend')}
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Compact Legend */}
            {showLegend && (
              <div className={`backdrop-blur-sm rounded-lg p-3 border shadow-lg transition-all duration-300 opacity-80 hover:opacity-100 ${
                isNightMode 
                  ? 'bg-slate-900/90 border-yellow-500/50 shadow-yellow-500/20' 
                  : 'bg-slate-800/90 border-slate-600'
              }`}>
                <div className="flex flex-col gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${
                      isNightMode ? 'bg-yellow-400 shadow-yellow-400/50 shadow-sm' : 'bg-yellow-500'
                    }`}></div>
                    <span className="font-medium">{t('map.pulsing')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      isNightMode ? 'bg-green-400 shadow-green-400/50 shadow-sm' : 'bg-green-500'
                    }`}></div>
                    <span>{t('map.yourLocation')}</span>
                  </div>
                  {isNightMode && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full shadow-red-400/50 shadow-sm"></div>
                      <span>Clusters</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Click to Host Hint */}
          {user && !showOverlay && (
            <div className={`absolute top-4 left-4 px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${
              isNightMode 
                ? 'bg-yellow-500/90 text-black border border-yellow-400' 
                : 'bg-yellow-600/90 text-black'
            }`}>
              <div className="flex items-center gap-2">
                <span className="animate-pulse">💡</span>
                <span>{t('map.clickToHost')}</span>
              </div>
              {userLocation && (
                <div className="text-xs mt-1 opacity-80">
                  Max. 100km from your location
                </div>
              )}
            </div>
          )}
        </div>

        {/* Optional Right Sidebar - Event Details */}
        {selectedEvent && (
          <div className={`absolute right-4 top-4 bottom-4 w-80 backdrop-blur-sm border rounded-xl p-4 overflow-y-auto z-10 shadow-2xl transition-all duration-300 ${
            isNightMode 
              ? 'bg-slate-900/95 border-yellow-500/50 shadow-yellow-500/20' 
              : 'bg-slate-800/95 border-slate-600'
          }`}>
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
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-white text-lg">{selectedEvent.title}</div>
                    {selectedEvent.category && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedEvent.category === 'tournament' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        selectedEvent.category === 'speedrun' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        selectedEvent.category === 'meetup' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {selectedEvent.category === 'tournament' ? '🏆 Tournament' :
                         selectedEvent.category === 'speedrun' ? '🏁 Speedrun' :
                         selectedEvent.category === 'meetup' ? '🤝 Meetup' : '🎮 Casual'}
                      </span>
                    )}
                  </div>
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