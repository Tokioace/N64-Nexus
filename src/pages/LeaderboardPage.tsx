import React, { useState } from 'react'
import { useEvent } from '../contexts/EventContext'
import { useUser } from '../contexts/UserContext'
import EventLeaderboard from '../components/EventLeaderboard'
import { 
  Trophy, 
  Calendar, 
  Target,
  Users,
  Medal
} from 'lucide-react'

const LeaderboardPage: React.FC = () => {
  const { events, getLeaderboard } = useEvent()
  const { user } = useUser()
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  // Get active events with leaderboard data
  const activeEventsWithLeaderboard = events.filter(event => {
    const now = new Date()
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)
    return now >= startDate && now <= endDate && getLeaderboard(event.id).length > 0
  })

  // If no event is selected, show the first active event with data
  const currentEventId = selectedEvent || (activeEventsWithLeaderboard[0]?.id)

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

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-slate-100 mb-2">
          Battle64 Bestenliste
        </h1>
        <p className="text-slate-400 text-lg">
          Die besten Zeiten und Rekorde unserer Community
        </p>
      </div>

      {/* Event Selection */}
      {activeEventsWithLeaderboard.length > 1 && (
        <div className="simple-tile mb-8">
          <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Event auswählen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeEventsWithLeaderboard.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  currentEventId === event.id
                    ? 'border-blue-400 bg-blue-400/10'
                    : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className={`w-4 h-4 ${
                    currentEventId === event.id ? 'text-blue-400' : 'text-slate-400'
                  }`} />
                  <span className="font-medium text-slate-100">{event.title}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3" />
                    <span>{event.game}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{getLeaderboard(event.id).length}</span>
                  </div>
                </div>
                <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium inline-block ${
                  getEventStatus(event) === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {getEventStatus(event) === 'active' ? '🔴 LIVE' : '✅ BEENDET'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {currentEventId ? (
        <EventLeaderboard
          eventId={currentEventId}
          eventTitle={events.find(e => e.id === currentEventId)?.title || 'Event'}
          entries={getLeaderboard(currentEventId).map(participation => ({
            id: participation.id,
            userId: participation.userId,
            username: participation.username,
            time: participation.time || '0:00.000',
            position: 1, // Will be calculated in the component
            submissionDate: participation.submissionDate,
            documentationType: participation.documentationType || 'photo',
            mediaUrl: participation.mediaUrl,
            livestreamUrl: participation.livestreamUrl,
            verified: participation.verified,
            notes: participation.notes
          }))}
          currentUserId={user?.id}
        />
      ) : (
        <div className="simple-tile text-center py-12">
          <Medal className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-300 mb-2">
            Noch keine Leaderboard-Daten verfügbar
          </h3>
          <p className="text-slate-400">
            Sobald Spieler ihre Zeiten einreichen, werden hier die Bestenlisten angezeigt.
          </p>
        </div>
      )}
    </div>
  )
}

export default LeaderboardPage