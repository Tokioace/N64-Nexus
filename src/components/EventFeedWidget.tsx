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
  Timer,
  Play,
  ZoomIn
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

  // Format time to MM:SS.sss with consistent 3 decimal places
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '-:--.---'
    
    // If already in MM:SS.sss format, ensure 3 decimal places
    if (timeStr.includes(':') && timeStr.includes('.')) {
      const [timePart, decimalPart] = timeStr.split('.')
      const paddedDecimal = (decimalPart || '000').padEnd(3, '0').substring(0, 3)
      return `${timePart}.${paddedDecimal}`
    }
    
    // Convert seconds to MM:SS.sss format
    const totalSeconds = parseFloat(timeStr)
    if (isNaN(totalSeconds)) return timeStr
    
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    
    return `${minutes}:${seconds.toFixed(3).padStart(6, '0')}`
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

  // Removed game icons for cleaner, more professional appearance

  // Extract game name and track name from title - optimized without emojis
  const parseEventTitle = (title: string) => {
    // Remove emojis from the title first
    const cleanTitle = title.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim()
    
    // For titles like "Mario Kart 64: Luigi's Raceway"
    const parts = cleanTitle.split(':')
    if (parts.length >= 2) {
      return {
        gameName: parts[0].trim(),
        trackName: parts[1].trim()
      }
    }
    // If no colon separator, use the full title as game name
    return {
      gameName: cleanTitle,
      trackName: `${event.category}`
    }
  }

  const { gameName, trackName } = parseEventTitle(event.title)

  return (
    <div className={`simple-tile bg-gradient-to-br ${getEventGradient(event.id)} mb-3 shadow-lg hover:shadow-xl transition-shadow duration-300`} 
         style={{ marginBottom: '10px', paddingBottom: '16px' }}>
      <div className="event-card-content" style={{ paddingBottom: '0px' }}>
        {/* Section 1: Event Title & Status - Optimized Layout */}
        <div className="border-b border-slate-600/30 pb-3 mb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Title Section - Two Line Layout - No Icons */}
            <div className="min-w-0 flex-1">
              {/* First line: Game Name - Consistent alignment */}
              <h3 className="text-sm font-bold text-slate-100 leading-tight mb-1" 
                  style={{ 
                    fontSize: '13px',
                    lineHeight: '1.2',
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    textAlign: 'left',
                    marginLeft: '0'
                  }}>{gameName}</h3>
              
              {/* Second line: Track/Mode Name - Consistent alignment */}
              <p className="text-xs text-slate-400 leading-tight" 
                 style={{ 
                   fontSize: '11px',
                   lineHeight: '1.2',
                   wordBreak: 'break-word',
                   whiteSpace: 'normal',
                   textAlign: 'left',
                   marginLeft: '0'
                 }}>{trackName}</p>
            </div>
            
            {/* Live Status and Time - Right-aligned, not overlapping */}
            <div className="flex flex-col items-end gap-1 text-xs flex-shrink-0 ml-2">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium text-green-400 text-xs">{t('events.status.live')}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Timer className="w-3 h-3" />
                <span className="font-mono text-xs">{timeRemaining}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Winner with Media */}
        <div className="border-b border-slate-600/30 pb-4 mb-4">
          {sortedLeaderboard.length > 0 && (
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-200 mb-3 flex items-center gap-1 sm:gap-2">
                <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                <span className="truncate" title={sortedLeaderboard[0].username}>{t('home.winner')} - {sortedLeaderboard[0].username}</span>
                {sortedLeaderboard[0].verified && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title={t('home.verified')}></div>
                )}
              </h4>
              
              {sortedLeaderboard[0].mediaUrl ? (
                <div className="relative bg-slate-800/30 rounded-lg overflow-hidden border border-yellow-400/20 group">
                  {sortedLeaderboard[0].documentationType === 'photo' && (
                    <div className="relative">
                      <img 
                        src={sortedLeaderboard[0].mediaUrl!} 
                        alt={`Winner screenshot by ${sortedLeaderboard[0].username}`}
                        className="w-full h-24 sm:h-32 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzNCI+PC9yZWN0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TY3JlZW5zaG90PC90ZXh0Pjwvc3ZnPg=='
                        }}
                        onClick={() => window.open(sortedLeaderboard[0].mediaUrl!, '_blank')}
                      />
                      <div className="absolute top-2 right-2 bg-black/70 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div className="absolute top-2 left-2 bg-black/60 rounded px-2 py-1">
                        <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-white inline mr-1" />
                        <span className="text-white text-xs">{t('media.photo')}</span>
                      </div>
                    </div>
                  )}
                  {sortedLeaderboard[0].documentationType === 'video' && (
                    <div className="relative">
                      <video 
                        src={sortedLeaderboard[0].mediaUrl!}
                        className="w-full h-24 sm:h-32 object-cover cursor-pointer"
                        autoPlay
                        loop
                        muted
                        playsInline
                        onClick={() => window.open(sortedLeaderboard[0].mediaUrl!, '_blank')}
                      />
                      <div className="absolute top-2 right-2 bg-black/70 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div className="absolute top-2 left-2 bg-black/60 rounded px-2 py-1">
                        <Video className="w-3 h-3 sm:w-4 sm:h-4 text-white inline mr-1" />
                        <span className="text-white text-xs">{t('media.video')}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                    </div>
                  )}
                  {sortedLeaderboard[0].documentationType === 'livestream' && (
                    <div className="h-24 sm:h-32 flex items-center justify-center bg-gradient-to-r from-purple-600/30 to-red-600/30 cursor-pointer hover:from-purple-600/40 hover:to-red-600/40 transition-all duration-200"
                         onClick={() => {
                           if (sortedLeaderboard[0].livestreamUrl) {
                             window.open(sortedLeaderboard[0].livestreamUrl, '_blank')
                           }
                         }}>
                      <div className="text-center">
                        <Radio className="w-5 h-5 sm:w-7 sm:h-7 text-red-400 mx-auto mb-2 animate-pulse" />
                        <p className="text-sm text-red-400 font-medium">🔴 {t('media.livestream')}</p>
                        <p className="text-xs text-purple-300 mt-1">{t('home.clickToWatch')}</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 sm:p-3">
                    <div className="flex items-center justify-center">
                      <div className="text-lg sm:text-xl text-yellow-400 font-bold" style={{ 
                      fontFamily: '"Roboto Mono", "Courier New", monospace',
                      fontSize: 'clamp(14px, 4vw, 18px)'
                    }}>{formatTime(sortedLeaderboard[0].time!)}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-24 sm:h-32 flex items-center justify-center bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-600/50" title={t('media.noMediaTooltip')}>
                  <div className="text-center">
                    <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-300 font-medium">{t('home.noMediaSubmitted')}</p>
                    <div className="text-lg sm:text-xl text-yellow-400 font-bold mt-2" style={{ 
                      fontFamily: '"Roboto Mono", "Courier New", monospace',
                      fontSize: 'clamp(14px, 4vw, 18px)'
                    }}>{formatTime(sortedLeaderboard[0].time!)}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 3: Top 3 Leaderboard */}
        <div className="border-b border-slate-600/30 pb-4 mb-3">
          <h4 className="text-xs sm:text-sm font-semibold text-slate-200 mb-3 flex items-center gap-1 sm:gap-2">
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            {t('home.topLeaderboard')}
          </h4>
          {sortedLeaderboard.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[0, 1, 2].map((index) => {
                const entry = sortedLeaderboard[index]
                const position = index + 1
                
                if (!entry) {
                  return (
                    <div key={`placeholder-${position}`} className="bg-slate-800/20 rounded-lg p-2 sm:p-3 text-center border border-slate-700/30">
                      <div className="flex justify-center mb-2">
                        {getRankIcon(position)}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mb-2 truncate">-</div>
                      {/* Centered placeholder time display */}
                      <div className="text-xs font-bold text-slate-600 mb-2 flex justify-center items-center" style={{ 
                        fontFamily: '"Roboto Mono", "Courier New", monospace',
                        fontSize: 'clamp(11px, 3vw, 13px)',
                        textAlign: 'center'
                      }}>-:--.---</div>
                      <div className="h-4"></div>
                    </div>
                  )
                }
                
                const getBorderStyle = (position: number) => {
                  switch (position) {
                    case 1:
                      return 'border-2 border-yellow-400/60 shadow-lg shadow-yellow-400/20 bg-gradient-to-b from-yellow-500/10 to-slate-800/30'
                    case 2:
                      return 'border-2 border-gray-400/60 shadow-lg shadow-gray-400/20 bg-gradient-to-b from-gray-500/10 to-slate-800/30'
                    case 3:
                      return 'border-2 border-amber-500/60 shadow-lg shadow-amber-500/20 bg-gradient-to-b from-amber-500/10 to-slate-800/30'
                    default:
                      return 'border border-slate-600/30'
                  }
                }
                
                return (
                  <div key={entry.id} className={`rounded-lg p-2 sm:p-3 text-center hover:border-slate-500/50 transition-all duration-300 ${getBorderStyle(position)}`}>
                    <div className="flex justify-center mb-2">
                      {getRankIcon(position)}
                    </div>
                    <div 
                      className="text-xs text-slate-200 font-medium mb-2 truncate cursor-help overflow-hidden" 
                      title={entry.username}
                      style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {entry.username}
                    </div>
                    {/* Centered time display - both horizontally and vertically */}
                    <div className={`text-sm font-bold ${getRankColor(position)} mb-2 flex justify-center items-center`} style={{ 
                      fontFamily: '"Roboto Mono", "Courier New", monospace',
                      fontSize: 'clamp(12px, 3.5vw, 14px)',
                      textAlign: 'center'
                    }}>
                      {formatTime(entry.time!)}
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      {entry.verified && (
                        <div className="w-3 h-3 bg-green-400 rounded-full" title={t('home.verified')}></div>
                      )}
                      {entry.mediaUrl && (
                        <div className="flex items-center" title={`${entry.documentationType === 'photo' ? 'Photo' : entry.documentationType === 'video' ? t('media.video') : t('media.livestream')} available`}>
                          {entry.documentationType === 'photo' && <Camera className="w-4 h-4 text-slate-400" />}
                          {entry.documentationType === 'video' && <Video className="w-4 h-4 text-slate-400" />}
                          {entry.documentationType === 'livestream' && <Radio className="w-4 h-4 text-slate-400" />}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6 bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-600/50">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500 mx-auto mb-3" />
              <p className="text-sm text-slate-400 mb-1 font-medium">{t('home.noTimesSubmitted')}</p>
              <p className="text-xs text-slate-500">{t('home.beTheFirst')}</p>
            </div>
          )}
        </div>

        {/* Section 4: Participants & Join - Compact layout with optimized spacing */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-300">{event.participants} {t('events.participants')}</span>
          </div>
          
          <Link 
            to="/events" 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-600/20 to-green-500/20 border border-green-500/40 text-green-400 hover:from-green-600/30 hover:to-green-500/30 hover:border-green-400/60 hover:scale-105 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl"
          >
            <span>{t('events.join')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Section 5: Interaction Bar - Bottom left positioned, optimized spacing */}
        <div className="interaction-bar">
          <InteractionBar 
            contentType="event"
            contentId={event.id}
            showComments={true}
            compact={true}
          />
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
        <div className="text-center mb-6">
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