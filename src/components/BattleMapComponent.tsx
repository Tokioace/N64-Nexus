import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import { MapPin, Users, Calendar, Clock, Navigation, AlertCircle } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'
import { useBattleMap } from '../hooks/useBattleMap'
import { logger } from '../lib/logger'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React Leaflet
import L from 'leaflet'

const DefaultIcon = L.divIcon({
  html: `<div class="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
    <div class="w-2 h-2 bg-white rounded-full"></div>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  className: 'custom-div-icon'
})

L.Marker.prototype.options.icon = DefaultIcon

interface BattleMapComponentProps {
  className?: string
  height?: string
}

const BattleMapComponent: React.FC<BattleMapComponentProps> = ({
  className = '',
  height = 'h-96'
}) => {
  const { t } = useLanguage()
  const { user } = useUser()
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')
  const [gdprSettings, setGdprSettings] = useState({ locationEnabled: false, realtimeEnabled: false })

  const {
    events,
    participants,
    loading,
    error,
    joinEventAtLocation,
    leaveEvent,
    updateUserLocation,
    refresh
  } = useBattleMap(userLocation || undefined)

  // Load GDPR settings
  useEffect(() => {
    const storedSettings = localStorage.getItem('gdpr-settings')
    if (storedSettings) {
      const settings = JSON.parse(storedSettings)
      setGdprSettings(settings)
    }
  }, [])

  // Request location if permitted
  useEffect(() => {
    if (gdprSettings.locationEnabled && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          setUserLocation(location)
          updateUserLocation(location)
          setLocationPermission('granted')
          logger.info('User location obtained:', location)
        },
        (error) => {
          logger.error('Failed to get location:', error)
          setLocationPermission('denied')
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000
        }
      )
    }
  }, [gdprSettings.locationEnabled, updateUserLocation])

  const requestLocationPermission = async () => {
    if (!('geolocation' in navigator)) {
      alert(t('battleMap.location.notSupported'))
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000
        })
      })

      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
      
      setUserLocation(location)
      updateUserLocation(location)
      setLocationPermission('granted')

      // Update GDPR settings
      const newSettings = { ...gdprSettings, locationEnabled: true }
      setGdprSettings(newSettings)
      localStorage.setItem('gdpr-settings', JSON.stringify(newSettings))

      logger.info('Location permission granted:', location)
    } catch (error) {
      logger.error('Location permission denied:', error)
      setLocationPermission('denied')
    }
  }

  const handleJoinEvent = async (eventId: string) => {
    if (!userLocation) {
      alert(t('battleMap.location.required'))
      return
    }

    if (!user) {
      alert(t('auth.loginRequired'))
      return
    }

    try {
      await joinEventAtLocation(
        eventId,
        userLocation.latitude,
        userLocation.longitude,
        'User Location'
      )
      logger.info('Successfully joined event:', eventId)
    } catch (error: any) {
      logger.error('Failed to join event:', error)
      alert(error.message || t('common.error'))
    }
  }

  const handleLeaveEvent = async (eventId: string) => {
    try {
      await leaveEvent(eventId)
      logger.info('Successfully left event:', eventId)
    } catch (error: any) {
      logger.error('Failed to leave event:', error)
      alert(error.message || t('common.error'))
    }
  }

  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`
    }
    return `${km.toFixed(1)}km`
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (!gdprSettings.locationEnabled) {
    return (
      <div className={`${className} ${height} flex items-center justify-center bg-slate-800 rounded-lg`}>
        <div className="text-center p-8">
          <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold text-white mb-2">
            {t('battleMap.location.required')}
          </h3>
          <p className="text-gray-300 mb-6">
            {t('gdpr.location.description')}
          </p>
          <button
            onClick={requestLocationPermission}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            {t('gdpr.location.enable')}
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`${className} ${height} flex items-center justify-center bg-slate-800 rounded-lg`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error || !userLocation) {
    return (
      <div className={`${className} ${height} flex items-center justify-center bg-slate-800 rounded-lg`}>
        <div className="text-center p-8">
          <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
          <h3 className="text-lg font-semibold text-white mb-2">
            {error || t('battleMap.location.required')}
          </h3>
          <button
            onClick={refresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} space-y-4`}>
      {/* Map Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MapPin className="text-blue-400" size={24} />
          <h2 className="text-xl font-bold text-white">{t('battleMap.title')}</h2>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          <div className="flex items-center space-x-1">
            <Calendar size={16} />
            <span>{events.length} {t('battleMap.liveEvents')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users size={16} />
            <span>{participants.length} {t('battleMap.participants')}</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className={`${height} rounded-lg overflow-hidden border border-slate-700`}>
        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User Location Marker */}
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup>
              <div className="text-center">
                <Navigation className="mx-auto mb-2 text-blue-600" size={20} />
                <p className="font-semibold">{t('battleMap.yourLocation')}</p>
              </div>
            </Popup>
          </Marker>

          {/* Event Markers */}
          {events.map((event) => {
            if (!event.location) return null
            
            return (
              <React.Fragment key={event.id}>
                <Marker position={[event.location.latitude, event.location.longitude]}>
                  <Popup>
                    <div className="min-w-[200px]">
                      <h3 className="font-semibold mb-2">{event.title}</h3>
                      <div className="space-y-1 text-sm">
                        <p><strong>{t('events.game')}:</strong> {event.game}</p>
                        <p><strong>{t('events.track')}:</strong> {event.track}</p>
                        <p><strong>{t('events.time')}:</strong> {formatTime(event.start_time)}</p>
                        <p><strong>{t('battleMap.participants')}:</strong> {event.participant_count}</p>
                      </div>
                      <div className="mt-3 space-y-2">
                        <button
                          onClick={() => handleJoinEvent(event.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm font-semibold transition-colors"
                        >
                          {t('battleMap.joinEvent')}
                        </button>
                        <button
                          onClick={() => handleLeaveEvent(event.id)}
                          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded text-sm font-semibold transition-colors"
                        >
                          {t('battleMap.leaveEvent')}
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
                
                {/* Event Radius Circle */}
                <Circle
                  center={[event.location.latitude, event.location.longitude]}
                  radius={event.location.radius_km * 1000}
                  pathOptions={{
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.1,
                    weight: 2
                  }}
                />
              </React.Fragment>
            )
          })}

          {/* Participant Markers */}
          {participants.map((participant) => (
            <Marker key={participant.id} position={[participant.latitude, participant.longitude]}>
              <Popup>
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Users className="text-white" size={16} />
                  </div>
                  <p className="font-semibold">{participant.username}</p>
                  {participant.distance_km && (
                    <p className="text-sm text-gray-600">
                      {formatDistance(participant.distance_km)} {t('battleMap.distance')}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Calendar className="mx-auto mb-2" size={48} />
          <p>{t('battleMap.noEvents')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">{t('battleMap.liveEvents')}</h3>
          {events.map((event) => (
            <div key={event.id} className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">{event.title}</h4>
                  <p className="text-sm text-gray-300">{event.game} - {event.track}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{formatTime(event.start_time)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users size={12} />
                      <span>{event.participant_count}</span>
                    </span>
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleJoinEvent(event.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                  >
                    {t('battleMap.joinEvent')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BattleMapComponent