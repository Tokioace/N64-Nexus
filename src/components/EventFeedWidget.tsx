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
          <div className="bg-slate-700 rounded-lg p-4 mb-2">
            <Radio className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-xs text-slate-400">{t('home.livestreamProof')}</p>
          </div>
          <div className="flex items-center justify-center space-x-1 text-xs text-slate-400">
            <Radio className="w-3 h-3" />
            <span>{t('home.livestream')}</span>
          </div>
        </div>
      )}
      
      <div className="absolute top-2 left-2 bg-yellow-500/20 backdrop-blur-sm rounded px-2 py-1">
        <div className="flex items-center space-x-1">
          <Crown className="w-3 h-3 text-yellow-400" />
          <span className="text-xs font-bold text-yellow-400">#1</span>
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
    <div className="n64-tile n64-tile-large bg-gradient-to-br from-red-600/20 to-pink-600/20 border-l-4 border-red-400">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6 text-red-400" />
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

      <div className="space-y-4">
        {/* Event Info */}
        <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-600/30">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
              🔴 LIVE
            </span>
            <span className="text-xs text-slate-400">{timeRemaining}</span>
          </div>
          <h3 className="font-bold text-slate-100 mb-2">{eventTitle}</h3>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300">{participants}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Gamepad2 className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">{eventGame}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Winner's Media (Always visible if available) */}
        {winner && (winner.mediaUrl || winner.livestreamUrl) && (
          <div>
            <h4 className="text-sm font-medium text-slate-200 mb-2 flex items-center">
              <Crown className="w-4 h-4 text-yellow-400 mr-1" />
                              {t('home.winner')}
            </h4>
                            <WinnerMediaDisplay winner={winner} t={t} />
            <div className="mt-2 text-center">
              <div className="text-sm font-medium text-slate-100">{winner.username}</div>
              <div className="text-lg font-mono font-bold text-yellow-400">{winner.time}</div>
            </div>
          </div>
        )}

        {/* Top 3 Compact Display */}
        {sortedLeaderboard.length > 0 && (
          <div>
                          <h4 className="text-sm font-medium text-slate-200 mb-2">{t('home.topLeaderboard')}</h4>
            <div className="space-y-2">
              {sortedLeaderboard.map((entry, index) => {
                const position = index + 1
                return (
                  <div key={entry.id} className="flex items-center justify-between p-2 rounded bg-slate-800/20">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(position)}
                      <span className="text-sm text-slate-300">{entry.username}</span>
                      {entry.verified && (
                        <div className="w-2 h-2 bg-green-400 rounded-full" title={t('home.verified')}></div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-mono font-bold ${getRankColor(position)}`}>
                        {entry.time}
                      </span>
                      {entry.mediaUrl && (
                        <div className="flex items-center space-x-1">
                          {entry.documentationType === 'photo' && <Camera className="w-3 h-3 text-slate-400" />}
                          {entry.documentationType === 'video' && <Video className="w-3 h-3 text-slate-400" />}
                          {entry.documentationType === 'livestream' && <Radio className="w-3 h-3 text-slate-400" />}
                        </div>
                      )}
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