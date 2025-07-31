import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Trophy, 
  Play, 
  Pause, 
  Camera, 
  Video, 
  Radio,
  ExternalLink,
  Verified,
  AlertCircle,
  Clock,
  User
} from 'lucide-react'

interface BestLapData {
  time: string
  username: string
  mediaUrl?: string
  mediaType: 'photo' | 'video' | 'livestream'
  livestreamUrl?: string
  verified: boolean
}

interface BestLapShowcaseProps {
  eventTitle: string
  eventGame: string
  bestLap: BestLapData
  className?: string
}

const BestLapShowcase: React.FC<BestLapShowcaseProps> = ({
  eventTitle,
  eventGame,
  bestLap,
  className = ''
}) => {
  const { t } = useLanguage()
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)

  const handleVideoToggle = (videoId: string) => {
    const video = document.getElementById(videoId) as HTMLVideoElement
    if (video) {
      if (isVideoPlaying) {
        video.pause()
      } else {
        video.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  const getMediaTypeIcon = () => {
    switch (bestLap.mediaType) {
      case 'photo':
        return <Camera className="w-4 h-4" />
      case 'video':
        return <Video className="w-4 h-4" />
      case 'livestream':
        return <Radio className="w-4 h-4" />
    }
  }

  const getMediaTypeLabel = () => {
    switch (bestLap.mediaType) {
      case 'photo':
        return t('eventLeaderboard.screenshot')
      case 'video':
        return t('eventLeaderboard.video')
      case 'livestream':
        return t('eventLeaderboard.livestream')
    }
  }

  return (
    <div className={`bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-400/30 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-yellow-400/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-bold text-slate-100">
                {t('events.bestLap.title')}
              </h3>
            </div>
            <p className="text-sm text-slate-400">{eventTitle} - {eventGame}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-yellow-400">
              <Clock className="w-4 h-4" />
              <span className="text-xl font-bold">{bestLap.time}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-slate-300 mt-1">
              <User className="w-3 h-3" />
              <span>{bestLap.username}</span>
              {bestLap.verified ? (
                <Verified className="w-3 h-3 text-green-400" />
              ) : (
                <AlertCircle className="w-3 h-3 text-yellow-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Media Content */}
      <div className="relative">
        {bestLap.mediaType === 'photo' && bestLap.mediaUrl && (
          <div className="aspect-video bg-slate-800">
            <img 
              src={bestLap.mediaUrl} 
              alt={t('events.bestLap.photoAlt', { username: bestLap.username, time: bestLap.time })}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNCI+PC9yZWN0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CZXN0IExhcCBQaG90bzwvdGV4dD48L3N2Zz4='
              }}
            />
            {/* Overlay with lap time */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2 text-white">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="font-bold">{bestLap.time}</span>
              </div>
            </div>
          </div>
        )}

        {bestLap.mediaType === 'video' && bestLap.mediaUrl && (
          <div className="aspect-video bg-slate-800 relative">
            <video 
              id={`best-lap-video-${eventTitle.replace(/\s+/g, '-')}`}
              src={bestLap.mediaUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              onError={() => {
                console.error('Error loading best lap video')
              }}
            />
            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleVideoToggle(`best-lap-video-${eventTitle.replace(/\s+/g, '-')}`)}
                className="bg-black bg-opacity-50 rounded-full p-3 text-white hover:bg-opacity-75 transition-colors"
              >
                {isVideoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
            </div>
            {/* Lap time overlay */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2 text-white">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="font-bold">{bestLap.time}</span>
              </div>
            </div>
            {/* Loop indicator */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-75 rounded-lg px-2 py-1">
              <span className="text-xs text-white font-medium">∞ LOOP</span>
            </div>
          </div>
        )}

        {bestLap.mediaType === 'livestream' && bestLap.livestreamUrl && (
          <div className="aspect-video bg-slate-800 flex items-center justify-center">
            <div className="text-center p-8">
              <Radio className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-slate-100 mb-2">{t('events.bestLap.livestreamTitle')}</h4>
              <p className="text-slate-400 mb-4">{t('events.bestLap.livestreamDesc')}</p>
              <div className="mb-4">
                <div className="flex items-center justify-center space-x-2 text-yellow-400 mb-2">
                  <Trophy className="w-5 h-5" />
                  <span className="text-2xl font-bold">{bestLap.time}</span>
                </div>
                <p className="text-slate-300">by {bestLap.username}</p>
              </div>
              <a
                href={bestLap.livestreamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{t('events.bestLap.watchStream')}</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-800/50 border-t border-yellow-400/20">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-slate-300">
            {getMediaTypeIcon()}
            <span>{getMediaTypeLabel()}</span>
          </div>
          <div className="flex items-center space-x-2">
            {bestLap.verified ? (
              <>
                <Verified className="w-4 h-4 text-green-400" />
                <span className="text-green-400">{t('eventLeaderboard.verified')}</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400">{t('eventLeaderboard.unverified')}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BestLapShowcase