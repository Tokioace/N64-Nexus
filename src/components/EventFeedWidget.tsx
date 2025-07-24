import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Trophy, 
  Medal, 
  Crown, 
  Clock, 
  Camera, 
  Video, 
  Radio,
  Users,
  Gamepad2,
  ChevronUp,
  ChevronDown,
  Play,
  Pause
} from 'lucide-react'
import { EventParticipation } from '../types'

interface EventFeedWidgetProps {
  eventTitle: string
  eventGame: string
  participants: number
  timeRemaining: string
  leaderboard: EventParticipation[]
  isExpanded: boolean
  onToggleExpanded: () => void
}

interface WinnerMediaDisplayProps {
  winner: EventParticipation
  t: (key: string) => string
}

const WinnerMediaDisplay: React.FC<WinnerMediaDisplayProps> = ({ winner, t }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)

  useEffect(() => {
    // Auto-play video if it's the winner's media
    if (winner.documentationType === 'video' && winner.mediaUrl) {
      const video = document.getElementById('winner-video') as HTMLVideoElement
      if (video) {
        video.play().catch(console.error)
      }
    }
  }, [winner])

  if (!winner.mediaUrl && !winner.livestreamUrl) {
    return (
      <div className="bg-slate-800/30 rounded-lg p-4 text-center">
        <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">{t('home.noMediaAvailable')}</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/30 rounded-lg p-3 relative">
      {winner.documentationType === 'photo' && winner.mediaUrl && (
        <div className="text-center">
          <img 
            src={winner.mediaUrl} 
                            alt={`${t('home.winner')} Screenshot von ${winner.username}`}
            className="w-full max-h-32 object-cover rounded-lg mb-2"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzNCI+PC9yZWN0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TY3JlZW5zaG90<L3RleHQ+PC9zdmc+'
            }}
          />
          <div className="flex items-center justify-center space-x-1 text-xs text-slate-400">
            <Camera className="w-3 h-3" />
            <span>{t('home.screenshot')}</span>
          </div>
        </div>
      )}
      
      {winner.documentationType === 'video' && winner.mediaUrl && (
        <div className="text-center relative">
          <video 
            id="winner-video"
            src={winner.mediaUrl}
            className="w-full max-h-32 object-cover rounded-lg mb-2"
            autoPlay
            loop
            muted
            playsInline
            onError={() => {
              console.error(t('media.error'))
            }}
          />
          <div className="absolute top-1 right-1 bg-black bg-opacity-50 rounded p-1">
            <div className="flex items-center space-x-1">
              <Video className="w-3 h-3 text-white" />
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-1 text-xs text-slate-400">
            <Video className="w-3 h-3" />
            <span>{t('home.video')}</span>
          </div>
        </div>
      )}
      
      {winner.documentationType === 'livestream' && winner.livestreamUrl && (
        <div className="text-center">
          <a 
            href={winner.livestreamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-400/30 rounded-lg p-4 mb-2 hover:from-purple-600/30 hover:to-purple-700/30 transition-all"
          >
            <Radio className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-medium">{t('home.livestreamProof')}</p>
            <p className="text-xs text-purple-400 mt-1">Klicken zum Anschauen</p>
          </a>
          <div className="flex items-center justify-center space-x-2 text-sm text-slate-400">
            <Radio className="w-4 h-4" />
            <span>{t('home.livestream')}</span>
          </div>
        </div>
      )}
      
      <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500/30 to-yellow-600/30 backdrop-blur-sm rounded-lg px-2 py-1 border border-yellow-400/30">
        <div className="flex items-center space-x-1">
          <Crown className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-bold text-yellow-400">#1</span>
        </div>
      </div>
    </div>
  )
}

const EventFeedWidget: React.FC<EventFeedWidgetProps> = ({
  eventTitle,
  eventGame,
  participants,
  timeRemaining,
  leaderboard,
  isExpanded,
  onToggleExpanded
}) => {
  const { t } = useLanguage()
  
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-4 h-4 text-yellow-400" />
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />
      case 3:
        return <Medal className="w-4 h-4 text-amber-600" />
      default:
        return <div className="w-4 h-4 flex items-center justify-center text-slate-400 font-bold text-xs">#{position}</div>
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
    .filter(entry => entry.time) // Only entries with times
    .sort((a, b) => {
      const timeA = a.time!.split(':')
      const timeB = b.time!.split(':')
      
      const minutesA = parseInt(timeA[0])
      const secondsA = parseFloat(timeA[1])
      const totalA = minutesA * 60 + secondsA
      
      const minutesB = parseInt(timeB[0])
      const secondsB = parseFloat(timeB[1])
      const totalB = minutesB * 60 + secondsB
      
      return totalA - totalB
    })
    .slice(0, 3) // Top 3 only

  const winner = sortedLeaderboard[0]

  return (
    <div className="event-tile bg-gradient-to-br from-red-600/20 to-pink-600/20 border-l-4 border-red-400">
      <div className="event-card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Trophy className="event-icon text-red-400" />
            <h2 className="text-xl font-bold text-slate-100">{t('home.liveEvents')}</h2>
          </div>
          <button
            onClick={onToggleExpanded}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-300" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-300" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Event Info */}
        <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-600/30">
          <div className="flex items-center justify-between mb-3">
            <div className="event-status-live">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>{t('events.status.live')}</span>
            </div>
            <span className="text-sm text-slate-300 font-medium">{timeRemaining}</span>
          </div>
          <h3 className="font-bold text-slate-100 mb-3 text-lg">{eventTitle}</h3>
          
          <div className="event-tile-separator"></div>
          
          <div className="flex items-center justify-between text-base">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="event-icon text-blue-400" />
                <span className="event-participants-text">
                  {participants > 0 ? `${participants} ${participants === 1 ? 'Teilnehmer' : 'Teilnehmer'}` : 'Keine Teilnehmer'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Gamepad2 className="event-icon text-purple-400" />
                <span className="event-game-mode-text">{eventGame}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Winner's Media (Always visible if available) */}
        {winner && (winner.mediaUrl || winner.livestreamUrl) && (
          <div>
            <div className="event-tile-separator"></div>
            <h4 className="text-base font-semibold text-slate-200 mb-3 flex items-center">
              <Crown className="event-icon text-yellow-400 mr-2" />
              {t('home.winner')}
            </h4>
            <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-400/20 rounded-lg p-3">
              <WinnerMediaDisplay winner={winner} t={t} />
              <div className="mt-3 text-center">
                <div className="text-base font-semibold text-slate-100">{winner.username}</div>
                <div className="leaderboard-time text-yellow-400">{winner.time}</div>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Compact Display */}
        {sortedLeaderboard.length > 0 && (
          <div>
            <div className="event-tile-separator"></div>
            <h4 className="text-base font-semibold text-slate-200 mb-3">{t('home.topLeaderboard')}</h4>
            <div className="space-y-3">
              {sortedLeaderboard.map((entry, index) => {
                const position = index + 1
                return (
                  <div key={entry.id} className="leaderboard-entry">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getRankIcon(position)}
                        <span className="text-base font-medium text-slate-200">{entry.username}</span>
                        {entry.verified && (
                          <div className="verification-badge" title={t('home.verified')}>
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`leaderboard-time ${getRankColor(position)}`}>
                          {entry.time}
                        </span>
                        {entry.mediaUrl && (
                          <div className="flex items-center space-x-1">
                            {entry.documentationType === 'photo' && <Camera className="w-4 h-4 text-slate-400" />}
                            {entry.documentationType === 'video' && <Video className="w-4 h-4 text-slate-400" />}
                            {entry.documentationType === 'livestream' && <Radio className="w-4 h-4 text-slate-400" />}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* No participants message */}
        {sortedLeaderboard.length === 0 && (
          <div className="text-center py-4">
            <Trophy className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">{t('home.noTimesSubmitted')}</p>
            <p className="text-slate-500 text-xs">{t('home.beTheFirst')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventFeedWidget