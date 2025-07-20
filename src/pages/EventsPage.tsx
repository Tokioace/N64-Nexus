import React, { useState } from 'react'
import { useEvent } from '../contexts/EventContext'
import { useUser } from '../contexts/UserContext'
import { 
  Trophy, 
  Calendar, 
  Users, 
  Clock, 
  Target,
  Award,
  Gamepad2,
  MapPin,
  Star
} from 'lucide-react'

const EventsPage: React.FC = () => {
  const { events, activeEvents, joinEvent, leaveEvent, loading } = useEvent()
  const { user } = useUser()
  const [selectedTab, setSelectedTab] = useState<'active' | 'upcoming' | 'completed'>('active')

  const getEventStatus = (event: any) => {
    const now = new Date()
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)

    if (now >= startDate && now <= endDate) {
      return 'active'
    } else if (now < startDate) {
      return 'upcoming'
    } else {
      return 'completed'
    }
  }

  const getTimeRemaining = (event: any) => {
    const now = new Date()
    const endDate = new Date(event.endDate)
    const timeLeft = endDate.getTime() - now.getTime()
    
    if (timeLeft <= 0) return 'Beendet'
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h verbleibend`
    if (hours > 0) return `${hours}h ${minutes}m verbleibend`
    return `${minutes}m verbleibend`
  }

  const filteredEvents = events.filter(event => {
    const status = getEventStatus(event)
    return status === selectedTab
  })

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      alert('Bitte logge dich ein, um an Events teilzunehmen!')
      return
    }
    
    const success = await joinEvent(eventId)
    if (success) {
      alert('Erfolgreich zum Event angemeldet!')
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-slate-100 mb-2">
          Battle64 Events
        </h1>
        <p className="text-slate-400 text-lg">
          Turniere, Challenges und Community-Events
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-800 rounded-lg p-1 inline-flex">
          {[
            { key: 'active', label: 'Aktiv', icon: Trophy, color: 'text-green-400' },
            { key: 'upcoming', label: 'Kommend', icon: Calendar, color: 'text-blue-400' },
            { key: 'completed', label: 'Beendet', icon: Award, color: 'text-gray-400' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                selectedTab === tab.key
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="simple-tile text-center">
          <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">
            {events.filter(e => getEventStatus(e) === 'active').length}
          </div>
          <div className="text-sm text-slate-400">Aktive Events</div>
        </div>
        
        <div className="simple-tile text-center">
          <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">
            {events.filter(e => getEventStatus(e) === 'upcoming').length}
          </div>
          <div className="text-sm text-slate-400">Kommende Events</div>
        </div>
        
        <div className="simple-tile text-center">
          <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">
            {events.reduce((sum, event) => sum + event.participants, 0)}
          </div>
          <div className="text-sm text-slate-400">Teilnehmer gesamt</div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {filteredEvents.length === 0 ? (
          <div className="simple-tile text-center py-12">
            <Trophy className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-300 mb-2">
              Keine {selectedTab === 'active' ? 'aktiven' : selectedTab === 'upcoming' ? 'kommenden' : 'beendeten'} Events
            </h3>
            <p className="text-slate-400">
              {selectedTab === 'active' && 'Momentan sind keine Events aktiv. Schau später wieder vorbei!'}
              {selectedTab === 'upcoming' && 'Keine Events geplant. Neue Events werden bald angekündigt!'}
              {selectedTab === 'completed' && 'Noch keine Events beendet.'}
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const status = getEventStatus(event)
            const timeRemaining = getTimeRemaining(event)
            
            return (
              <div key={event.id} className="simple-tile simple-tile-large">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : status === 'upcoming'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {status === 'active' && '🔴 LIVE'}
                        {status === 'upcoming' && '📅 KOMMEND'}
                        {status === 'completed' && '✅ BEENDET'}
                      </div>
                      <span className="text-sm text-slate-400">{timeRemaining}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">{event.title}</h3>
                    <p className="text-slate-400 mb-4">{event.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Gamepad2 className="w-4 h-4 text-purple-400" />
                        <span className="text-slate-300">{event.game}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-orange-400" />
                        <span className="text-slate-300">{event.category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-300">
                          {event.participants} / {event.maxParticipants || '∞'} Teilnehmer
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300">{event.region}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                    {status === 'active' && (
                      <button 
                        onClick={() => handleJoinEvent(event.id)}
                        disabled={loading}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white 
                                 font-medium rounded-lg transition-colors duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Lädt...' : 'Teilnehmen'}
                      </button>
                    )}
                    {status === 'upcoming' && (
                      <button 
                        onClick={() => handleJoinEvent(event.id)}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white 
                                 font-medium rounded-lg transition-colors duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Lädt...' : 'Vormerken'}
                      </button>
                    )}
                    <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 
                                     font-medium rounded-lg transition-colors duration-200">
                      Details
                    </button>
                  </div>
                </div>
                
                {/* Event Rules & Prizes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-600">
                  <div>
                    <h4 className="font-medium text-slate-200 mb-3 flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-2" />
                      Regeln
                    </h4>
                    <ul className="space-y-1">
                      {event.rules.map((rule, index) => (
                        <li key={index} className="text-sm text-slate-400 flex items-start">
                          <span className="text-yellow-400 mr-2">•</span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-200 mb-3 flex items-center">
                      <Award className="w-4 h-4 text-purple-400 mr-2" />
                      Preise
                    </h4>
                    <ul className="space-y-1">
                      {event.prizes.map((prize, index) => (
                        <li key={index} className="text-sm text-slate-400 flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          {prize}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-12">
        <p className="text-slate-400 text-sm mb-4">
          Verpasse keine Events! Melde dich für Push-Benachrichtigungen an.
        </p>
        <button className="px-6 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 
                         text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-200 text-sm">
          🔔 Benachrichtigungen aktivieren
        </button>
      </div>
    </div>
  )
}

export default EventsPage