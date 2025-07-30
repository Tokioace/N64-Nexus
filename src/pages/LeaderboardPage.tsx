/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { useEvent } from '../contexts/EventContext'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import EventLeaderboard from '../components/EventLeaderboard'
import N64FanLeaderboard from '../components/N64FanLeaderboard'
import { 
  Calendar, 
  Users,
  Medal,
  Star,
  Crown
} from 'lucide-react'

const LeaderboardPage: React.FC = () => {
  const { events, getLeaderboard } = useEvent()
  const { user } = useUser()
  const { t } = useLanguage()
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'n64fan' | 'events'>('n64fan')

  // Get active events with leaderboard data - show all active events
  const activeEventsWithLeaderboard = events.filter(event => {
    const now = new Date()
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)
    return now >= startDate && now <= endDate // Show all active events, even without participants
  })

  // If no event is selected, show the first active event
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

  const getEventIcon = (gameTitle: string) => {
    if (gameTitle.includes('Mario Kart')) return '🏎️'
    if (gameTitle.includes('San Francisco')) return '🏙️'
    if (gameTitle.includes('Diddy Kong')) return '🦍'
    return '🎮'
  }

  const getEventGradient = (eventId: string) => {
    switch (eventId) {
      case 'mk64-luigis-raceway':
        return 'from-green-600/20 to-emerald-600/20 border-green-400'
      case 'sfr-downtown':
        return 'from-orange-600/20 to-red-600/20 border-orange-400'
      case 'dkr-ancient-lake':
        return 'from-blue-600/20 to-cyan-600/20 border-blue-400'
      default:
        return 'from-purple-600/20 to-pink-600/20 border-purple-400'
    }
  }

  return (
    <div className="container-lg py-responsive space-responsive responsive-max-width responsive-overflow-hidden">
      {/* Header */}
      <div className="text-center mb-responsive responsive-max-width">
        <Star className="w-12 h-12 sm:w-16 sm:h-16 text-orange-400 mx-auto mb-4" />
        <h1 className="text-responsive-2xl font-bold text-slate-100 mb-2 responsive-word-break">
          {t('leaderboard.pageTitle')}
        </h1>
        <p className="text-responsive-base text-slate-400 responsive-word-break px-2">
          {t('leaderboard.pageSubtitle')}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="simple-tile mb-responsive responsive-max-width">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('n64fan')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'n64fan'
                ? 'bg-yellow-400 text-slate-900'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span className="hidden sm:inline">{t('leaderboard.globalLeaderboard')}</span>
            <span className="sm:hidden">N64Fan</span>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'events'
                ? 'bg-yellow-400 text-slate-900'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Event Leaderboards</span>
            <span className="sm:hidden">Events</span>
          </button>
        </div>
      </div>

      {/* N64Fan Leaderboard */}
      {activeTab === 'n64fan' && (
        <div className="responsive-max-width">
          <N64FanLeaderboard />
        </div>
      )}

      {/* Event Selection */}
      {activeTab === 'events' && activeEventsWithLeaderboard.length > 0 && (
        <div className="simple-tile mb-responsive responsive-max-width">
          <h2 className="text-responsive-lg font-bold text-slate-100 mb-4 flex items-center">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            <span className="responsive-word-break">
              {activeEventsWithLeaderboard.length === 1 ? t('events.currentEvent') : t('leaderboard.selectEvent')}
            </span>
          </h2>
          <div className="grid-auto-fit">
            {activeEventsWithLeaderboard.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left w-full bg-gradient-to-r ${getEventGradient(event.id)} ${
                  currentEventId === event.id
                    ? 'border-opacity-100 shadow-lg'
                    : 'border-opacity-50 hover:border-opacity-75'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="text-2xl">{getEventIcon(event.game)}</div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-100 text-sm sm:text-base responsive-word-break">{event.title}</div>
                    <div className="text-xs text-slate-400">{event.game} • {event.category}</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400 mb-2">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3 flex-shrink-0" />
                    <span>{getLeaderboard(event.id).length} {t('events.participants')}</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                  getEventStatus(event) === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {getEventStatus(event) === 'active' ? (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="hidden sm:inline">{t('events.status.live')}</span>
                      <span className="sm:hidden">Live</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Medal className="w-3 h-3" />
                      <span className="hidden sm:inline">{t('events.status.completed')}</span>
                      <span className="sm:hidden">Done</span>
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Event Leaderboard */}
      {activeTab === 'events' && currentEventId ? (
        <div className="responsive-max-width">
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
        </div>
      ) : activeTab === 'events' ? (
        <div className="simple-tile text-center py-8 sm:py-12 responsive-max-width">
          <Medal className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-slate-300 mb-2 responsive-word-break">
            {t('leaderboard.noData')}
          </h3>
          <p className="text-slate-400 responsive-word-break">
            {t('leaderboard.noDataDesc')}
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default LeaderboardPage