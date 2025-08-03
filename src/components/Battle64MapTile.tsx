import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useMap } from '../contexts/MapContext'
import { useUser } from '../contexts/UserContext'
import { MapPin, Users, Calendar, Plus, Globe } from 'lucide-react'

const Battle64MapTile: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useLanguage()
  const { user } = useUser()
  const { nearbyEvents, countryStats, userLocation } = useMap()
  const navigate = useNavigate()

  const totalUsers = countryStats.reduce((sum, country) => sum + country.activeUsers, 0)
  const totalEvents = countryStats.reduce((sum, country) => sum + country.totalEvents, 0)

  const handleOpenMap = () => {
    navigate('/map')
  }

  const handleHostEvent = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate('/map')
    // The map component will handle opening the hosting modal
  }

  return (
    <div className={`simple-tile bg-slate-800/50 border-slate-600 cursor-pointer hover:bg-slate-800/70 transition-colors ${className}`} onClick={handleOpenMap}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-yellow-400">Battle64 Map</h3>
            <p className="text-sm text-slate-400">{t('home.map.subtitle')}</p>
          </div>
        </div>
        
        {user && (
          <button
            onClick={handleHostEvent}
            className="px-3 py-1.5 bg-yellow-600 text-black text-sm font-semibold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            {t('map.hostEvent')}
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-white">{totalUsers}</div>
          <div className="text-xs text-slate-400">{t('map.activeUsers')}</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-white">{totalEvents}</div>
          <div className="text-xs text-slate-400">{t('map.totalEvents')}</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-white">{nearbyEvents.length}</div>
          <div className="text-xs text-slate-400">{t('map.nearbyEvents').replace(' (30km)', '')}</div>
        </div>
      </div>

      {/* User Location */}
      {userLocation && (
        <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-slate-300">{t('map.yourLocation')}: </span>
            <span className="text-white">{userLocation.region}, {userLocation.country}</span>
          </div>
        </div>
      )}

      {/* Nearby Events Preview */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {t('map.nearbyEvents')}
        </h4>
        
        {nearbyEvents.length === 0 ? (
          <div className="text-sm text-slate-400 py-2">
            {t('map.noNearbyEvents')}
          </div>
        ) : (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {nearbyEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="p-2 bg-slate-700/30 rounded text-sm">
                <div className="font-medium text-white truncate">{event.title}</div>
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>{event.game}</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {event.currentPlayers}/{event.maxPlayers}
                  </span>
                </div>
              </div>
            ))}
            {nearbyEvents.length > 3 && (
              <div className="text-xs text-slate-400 text-center py-1">
                +{nearbyEvents.length - 3} {t('common.more')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Country Flags Preview */}
      <div className="mt-4 pt-3 border-t border-slate-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">{t('map.globalStats')}</span>
          </div>
          <div className="flex items-center gap-1">
            {countryStats.slice(0, 6).map((country) => (
              <span key={country.countryCode} className="text-lg" title={country.country}>
                {country.flag}
              </span>
            ))}
            {countryStats.length > 6 && (
              <span className="text-xs text-slate-400 ml-1">+{countryStats.length - 6}</span>
            )}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-4 text-center">
        <div className="text-xs text-slate-400">
          {t('map.clickCountry')} • {t('map.viewEvents')} • {t('map.hostYourOwn')}
        </div>
      </div>
    </div>
  )
}

export default Battle64MapTile