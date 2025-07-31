import React, { useState, useEffect } from 'react'
import { useEvent } from '../contexts/EventContext'
import { useLanguage } from '../contexts/LanguageContext'
import { usePoints } from '../contexts/PointsContext'
import { useUser } from '../contexts/UserContext'
import { Link } from 'react-router-dom'
import { 
  Trophy, 
  Medal, 
  Crown, 
  Camera, 
  Video, 
  Radio,
  Users,
  Gamepad2,
  ChevronRight,
  Timer
} from 'lucide-react'
import { EventParticipation, GameEvent } from '../types'
import { InteractionBar } from './InteractionComponents'

interface EventCardProps {
  event: GameEvent
  leaderboard: EventParticipation[]
  timeRemaining: string
}

const EventCard: React.FC<EventCardProps> = ({ event, leaderboard, timeRemaining }) => {
  const { t } = useLanguage()
  
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
      case 2:
        return <Medal className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
      case 3:
        return <Medal className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
      default:
        return <div className="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center text-slate-400 font-bold text-xs">#{position}</div>
    }
  }

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return 'text-yellow-400'
      case 2:
        return 'text-gray-400'
      case 3:
        return 'text-amber-500'
      default:
        return 'text-slate-400'
    }
  }

  // Sort leaderboard and get top 3
  const sortedLeaderboard = [...leaderboard]
    .filter(entry => entry.time)
    .sort((a, b) => {
      const parseTime = (timeStr: string) => {
        const parts = timeStr.split(':')
        if (parts.length === 2) {
          return parseFloat(parts[0]) * 60 + parseFloat(parts[1])
        }
        return parseFloat(timeStr)
      }
      return parseTime(a.time!) - parseTime(b.time!)
    })
    .slice(0, 3)

  const getEventGradient = (eventId: string) => {
    // Using retro feature icon colors from HomeScreenRetro
    switch (eventId) {
      case 'mk64-luigis-raceway':
        return 'from-green-500/20 to-green-600/20 border-l-4 border-green-400'
      case 'sfr-downtown':
        return 'from-orange-500/20 to-orange-600/20 border-l-4 border-orange-400'
      case 'dkr-ancient-lake':
        return 'from-cyan-500/20 to-cyan-600/20 border-l-4 border-cyan-400'
      default:
        return 'from-purple-500/20 to-purple-600/20 border-l-4 border-purple-400'
    }
  }

  const getGameIcon = (gameTitle: string) => {
    if (gameTitle.includes('Mario Kart')) return '🏎️'
    if (gameTitle.includes('San Francisco')) return '🏙️'
    if (gameTitle.includes('Diddy Kong')) return '🦍'
    return '🎮'
  }

  return (
    <div className={`simple-tile bg-gradient-to-br ${getEventGradient(event.id)} mb-4`}>
      {/* Mobile-optimized header with single line layout */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="text-lg sm:text-2xl flex-shrink-0">{getGameIcon(event.game)}</div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-lg font-bold text-slate-100 truncate leading-tight">{event.title}</h3>
            <p className="text-xs sm:text-sm text-slate-400 truncate">{event.game} • {event.category}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 mb-1">
            <div className="w-1 h-1 bg-green-400 rounded-full"></div>
            <span className="text-xs sm:text-sm font-medium text-green-400">{t('events.status.live')}</span>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-300">
            <Timer className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-mono whitespace-nowrap">{timeRemaining}</span>
          </div>
        </div>
      </div>

      {/* Compact Top 3 Times - Always show all 3 positions */}
      <div className="mb-2 sm:mb-3">
        <h4 className="text-xs sm:text-sm font-semibold text-slate-200 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
          <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
          {t('home.topLeaderboard')}
        </h4>
        {sortedLeaderboard.length > 0 ? (
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            {/* Always render 3 positions, show placeholder if no data */}
            {[0, 1, 2].map((index) => {
              const entry = sortedLeaderboard[index]
              const position = index + 1
              
              if (!entry) {
                // Show placeholder for missing positions
                return (
                  <div key={`placeholder-${position}`} className="bg-slate-800/20 rounded-lg p-2 sm:p-3 text-center">
                    <div className="flex justify-center mb-1 sm:mb-2">
                      {getRankIcon(position)}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mb-1 truncate">-</div>
                    <div className="text-xs font-mono font-bold text-slate-600 mb-1">-:--</div>
                    <div className="h-3 sm:h-4"></div>
                  </div>
                )
              }
              
              return (
                <div key={entry.id} className="bg-slate-800/30 rounded-lg p-2 sm:p-3 text-center">
                  <div className="flex justify-center mb-1 sm:mb-2">
                    {getRankIcon(position)}
                  </div>
                  <div className="text-xs text-slate-200 font-medium mb-1 truncate" title={entry.username}>{entry.username}</div>
                  <div className={`text-xs font-mono font-bold ${getRankColor(position)} mb-1`}>
                    {entry.time}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {entry.verified && (
                      <div className="w-1 h-1 bg-green-400 rounded-full" title={t('home.verified')}></div>
                    )}
                    {entry.mediaUrl && (
                      <div className="flex items-center">
                        {entry.documentationType === 'photo' && <Camera className="w-2 h-2 sm:w-3 sm:h-3 text-slate-400" />}
                        {entry.documentationType === 'video' && <Video className="w-2 h-2 sm:w-3 sm:h-3 text-slate-400" />}
                        {entry.documentationType === 'livestream' && <Radio className="w-2 h-2 sm:w-3 sm:h-3 text-slate-400" />}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-4 sm:py-6 bg-slate-800/30 rounded-lg">
            <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-slate-500 mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-slate-400 mb-1">{t('home.noTimesSubmitted')}</p>
            <p className="text-xs text-slate-500">{t('home.beTheFirst')}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
                  {/* Event Stats */}
          <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
              <span className="text-slate-300">{event.participants} {t('events.participants')}</span>
            </div>
            
            {/* Interaction Bar - Compact between participants and join */}
            <div className="flex items-center gap-2">
              <InteractionBar 
                contentType="event"
                contentId={event.id}
                showComments={true}
                compact={true}
              />
              <Link 
                to="/events" 
                className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors ml-2"
              >
                <span>{t('events.join')}</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Winner's Media Preview - Compact on mobile */}
        <div>
          {sortedLeaderboard.length > 0 && sortedLeaderboard[0].mediaUrl && (
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1 sm:gap-2">
                <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                <span className="truncate">{t('home.winner')} - {sortedLeaderboard[0].username}</span>
              </h4>
              <div className="relative bg-slate-800/30 rounded-lg overflow-hidden">
                {sortedLeaderboard[0].documentationType === 'photo' && (
                  <img 
                    src={sortedLeaderboard[0].mediaUrl!} 
                    alt={`Winner screenshot by ${sortedLeaderboard[0].username}`}
                    className="w-full h-16 sm:h-24 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzNCI+PC9yZWN0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TY3JlZW5zaG90PC90ZXh0Pjwvc3ZnPg=='
                    }}
                  />
                )}
                {sortedLeaderboard[0].documentationType === 'video' && (
                  <div className="relative">
                    <video 
                      src={sortedLeaderboard[0].mediaUrl!}
                      className="w-full h-16 sm:h-24 object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                    <div className="absolute top-1 right-1 bg-black bg-opacity-50 rounded px-1 py-0.5">
                      <Video className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                    </div>
                  </div>
                )}
                {sortedLeaderboard[0].documentationType === 'livestream' && (
                  <div className="h-16 sm:h-24 flex items-center justify-center bg-gradient-to-r from-purple-600/20 to-purple-700/20">
                    <div className="text-center">
                      <Radio className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-1" />
                      <p className="text-xs text-purple-400">{t('media.livestream')}</p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1 sm:p-2">
                  <div className="text-xs text-white font-bold">{sortedLeaderboard[0].time}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const EventFeedWidget: React.FC = () => {
  const { activeEvents, getLeaderboard, shouldAwardParticipationPoints, markParticipationPointsAwarded, getEventPositionPoints, markPositionPointsAwarded } = useEvent()
  const { t } = useLanguage()
  const { awardPoints } = usePoints()
  const { user } = useUser()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000) // Update every second for countdown
    return () => clearInterval(timer)
  }, [])

  // Award points for event participation and positions
  useEffect(() => {
    if (!user) return

    // Award participation points
    activeEvents.forEach(event => {
      if (shouldAwardParticipationPoints(event.id, user.id)) {
        const leaderboard = getLeaderboard(event.id)
        const userParticipation = leaderboard.find(p => p.userId === user.id)
        
        if (userParticipation) {
          awardPoints('event.participation', `Participated in ${event.title}`)
            .then(success => {
              if (success) {
                markParticipationPointsAwarded(event.id, user.id)
              }
            })
        }
      }
    })

    // Award position points for completed events or current standings
    activeEvents.forEach(event => {
      const positionPoints = getEventPositionPoints(event.id)
      const userPositionPoint = positionPoints.find(p => p.userId === user.id)
      
      if (userPositionPoint) {
        const positionKey = `event.position.${userPositionPoint.position}` as keyof import('../types').PointsConfig
        awardPoints(positionKey, `${userPositionPoint.position}${userPositionPoint.position === 1 ? 'st' : userPositionPoint.position === 2 ? 'nd' : userPositionPoint.position === 3 ? 'rd' : 'th'} place in ${event.title}`)
          .then(success => {
            if (success) {
              markPositionPointsAwarded(event.id, user.id, userPositionPoint.position)
            }
          })
      }
    })
  }, [user, activeEvents, awardPoints, shouldAwardParticipationPoints, markParticipationPointsAwarded, getEventPositionPoints, markPositionPointsAwarded, getLeaderboard])

  const getEventTimeRemaining = (event: GameEvent) => {
    const now = currentTime
    const endTime = new Date(event.endDate)
    const timeLeft = endTime.getTime() - now.getTime()
    
    if (timeLeft <= 0) return t('events.ended')
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
    return `${minutes}m ${seconds}s`
  }

  if (activeEvents.length === 0) {
    return (
      <div className="simple-tile bg-gradient-to-br from-sky-600/20 to-blue-600/20 border-l-4 border-sky-400">
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400 flex-shrink-0" />
          <h2 className="text-responsive-lg font-bold text-sky-400">
            Live Event
          </h2>
        </div>
        <div className="text-center py-4 sm:py-8">
          <div className="mb-4">
            <Gamepad2 className="w-8 h-8 sm:w-12 sm:h-12 text-slate-500 mx-auto" />
          </div>
          <p className="text-responsive-sm text-slate-400 mb-4">{t('home.noLiveEvent')}</p>
          <Link 
            to="/events" 
            className="inline-block px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-sky-500/20 to-blue-500/20 text-sky-400 hover:from-sky-500/30 hover:to-blue-500/30 transition-all duration-300 text-responsive-sm w-full sm:w-auto text-center border border-sky-500/30 font-bold"
          >
            Join now!!!
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="bg-gradient-to-r from-slate-800/90 via-slate-700/90 to-slate-800/90 rounded-xl p-3 sm:p-4 border border-sky-500/30">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-sky-400" />
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-1 h-1 bg-sky-500 rounded-full"></div>
                <h2 className="text-xl sm:text-3xl font-bold text-sky-400">
                  Live Event
                </h2>
                <div className="w-1 h-1 bg-sky-500 rounded-full"></div>
              </div>
              <div className="text-xs text-sky-400 font-semibold tracking-wider uppercase">
                Join now!!!
              </div>
            </div>
            
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-sky-400" />
          </div>
          
          <div className="bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-purple-600/20 rounded-lg p-2 border border-purple-500/30">
            <p className="text-sm sm:text-lg font-bold text-purple-300 tracking-wide">
              {t('events.practiceChampionshipSubtitle')}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
              <span className="text-xs sm:text-sm text-green-400 font-medium">30 Tage Championship • 30 Days Championship</span>
              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
            </div>
          </div>
          
          {/* Motivational call to action */}
          <div className="mt-3 bg-gradient-to-r from-yellow-600/20 via-orange-600/20 to-yellow-600/20 rounded-lg p-2 border border-yellow-500/30">
            <p className="text-yellow-300 font-bold text-xs sm:text-sm">
              🏆 ZEIGE DEINE SKILLS • SHOW YOUR SKILLS • MUESTRA TUS HABILIDADES 🏆
            </p>
          </div>
        </div>
      </div>

      {activeEvents.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          leaderboard={getLeaderboard(event.id)}
          timeRemaining={getEventTimeRemaining(event)}
        />
      ))}

      <div className="text-center">
        <Link 
          to="/events" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-sky-600/20 to-blue-600/20 border border-sky-400/30 text-sky-400 hover:bg-gradient-to-r hover:from-sky-600/30 hover:to-blue-600/30 transition-all"
        >
          <Trophy className="w-5 h-5" />
          <span>{t('home.showAllEvents')}</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}

export default EventFeedWidget