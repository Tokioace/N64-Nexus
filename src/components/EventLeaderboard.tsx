import React, { useState } from 'react'
import { useLanguage, getLocaleString } from '../contexts/LanguageContext'
import { safeFormatTime } from '../utils/timeUtils'
import BestLapShowcase from './BestLapShowcase'
import { 
  Trophy, 
  Medal, 
  Crown, 
  Clock, 
  Camera, 
  Video, 
  Radio,
  ExternalLink,
  Verified,
  AlertCircle,
  RefreshCw,
  Users,
  X,
  Play,
  Pause
} from 'lucide-react'

interface EventLeaderboardEntry {
  id: string
  userId: string
  username: string
  time: string
  position: number
  submissionDate: Date
  documentationType: 'photo' | 'video' | 'livestream'
  mediaUrl?: string
  livestreamUrl?: string
  verified: boolean
  notes?: string
}

interface EventLeaderboardProps {
  eventId: string
  eventTitle: string
  entries: EventLeaderboardEntry[]
  currentUserId?: string
  onRefresh?: () => void
  isLoading?: boolean
  eventGame?: string
  bestLap?: {
    time: string
    username: string
    mediaUrl?: string
    mediaType: 'photo' | 'video' | 'livestream'
    livestreamUrl?: string
    verified: boolean
  }
}

interface MediaViewerProps {
  entry: EventLeaderboardEntry
  isOpen: boolean
  onClose: () => void
}

const MediaViewer: React.FC<MediaViewerProps> = ({ entry, isOpen, onClose }) => {
  const { t } = useLanguage()
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)

  if (!isOpen) return null

  const handleVideoToggle = () => {
    const video = document.getElementById('media-video') as HTMLVideoElement
    if (video) {
      if (isVideoPlaying) {
        video.pause()
      } else {
        video.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-600">
          <div>
            <h3 className="text-xl font-bold text-slate-100">{entry.username}</h3>
            <p className="text-slate-400">{t('eventLeaderboard.time')}: {entry.time}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4">
          {entry.documentationType === 'photo' && entry.mediaUrl && (
            <div className="text-center">
              <img 
                src={entry.mediaUrl} 
                alt={t('eventLeaderboard.screenshotFrom', { username: entry.username })}
                className="max-w-full max-h-[60vh] mx-auto rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNCI+PC9yZWN0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TY3JlZW5zaG90IG5pY2h0IHZlcmbDvGdiYXI8L3RleHQ+PC9zdmc+'
                }}
              />
            </div>
          )}
          
          {entry.documentationType === 'video' && entry.mediaUrl && (
            <div className="text-center relative">
              <video 
                id="media-video"
                src={entry.mediaUrl}
                className="max-w-full max-h-[60vh] mx-auto rounded-lg"
                controls
                autoPlay
                loop
                onError={() => {

                }}
              />
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-lg p-2">
                <button
                  onClick={handleVideoToggle}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {isVideoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
              </div>
            </div>
          )}
          
          {entry.documentationType === 'livestream' && entry.livestreamUrl && (
            <div className="text-center">
              <div className="bg-slate-700 rounded-lg p-8">
                <Radio className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-100 mb-2">{t('eventLeaderboard.livestream')}</h4>
                <p className="text-slate-400 mb-4">{t('eventLeaderboard.livestreamProofText')}</p>
                <a
                  href={entry.livestreamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t('eventLeaderboard.watchStream')}</span>
                </a>
              </div>
            </div>
          )}
          
          {entry.notes && (
            <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
              <h4 className="text-sm font-medium text-slate-200 mb-2">{t('eventLeaderboard.notes')}:</h4>
              <p className="text-sm text-slate-400">{entry.notes}</p>
            </div>
          )}
          
          <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              {entry.documentationType === 'photo' && <Camera className="w-4 h-4" />}
              {entry.documentationType === 'video' && <Video className="w-4 h-4" />}
              {entry.documentationType === 'livestream' && <Radio className="w-4 h-4" />}
              <span>
                {entry.documentationType === 'photo' && t('eventLeaderboard.screenshot')}
                {entry.documentationType === 'video' && t('eventLeaderboard.video')}
                {entry.documentationType === 'livestream' && t('eventLeaderboard.livestream')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {entry.verified ? (
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
    </div>
  )
}

const EventLeaderboard: React.FC<EventLeaderboardProps> = ({
  eventId: _eventId,
  eventTitle,
  entries,
  currentUserId,
  onRefresh,
  isLoading = false,
  eventGame,
  bestLap
}) => {
  const { t, currentLanguage } = useLanguage()
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)
  const [mediaViewerEntry, setMediaViewerEntry] = useState<EventLeaderboardEntry | null>(null)

  const formatTime = (time: string) => {
    return safeFormatTime(time)
  }

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-slate-400 font-bold">#{position}</div>
    }
  }

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return 'from-yellow-500/20 to-yellow-600/20 border-l-yellow-400'
      case 2:
        return 'from-gray-400/20 to-gray-500/20 border-l-gray-400'
      case 3:
        return 'from-amber-500/20 to-amber-600/20 border-l-amber-500'
      default:
        return 'from-slate-600/20 to-slate-700/20 border-l-slate-500'
    }
  }

  const getDocumentationIcon = (type: 'photo' | 'video' | 'livestream') => {
    switch (type) {
      case 'photo':
        return <Camera className="w-4 h-4" />
      case 'video':
        return <Video className="w-4 h-4" />
      case 'livestream':
        return <Radio className="w-4 h-4" />
    }
  }

  const getDocumentationLabel = (type: 'photo' | 'video' | 'livestream') => {
    switch (type) {
      case 'photo':
        return t('eventLeaderboard.screenshot')
      case 'video':
        return t('eventLeaderboard.video')
      case 'livestream':
        return t('eventLeaderboard.livestream')
    }
  }

  const handleMediaClick = (entry: EventLeaderboardEntry) => {
    if (entry.mediaUrl || entry.livestreamUrl) {
      setMediaViewerEntry(entry)
    }
  }

  const sortedEntries = [...entries].sort((a, b) => {
    // Sort by time (assuming MM:SS.mmm format)
    const timeA = a.time.split(':')
    const timeB = b.time.split(':')
    
    const minutesA = parseInt(timeA[0])
    const secondsA = parseFloat(timeA[1])
    const totalA = minutesA * 60 + secondsA
    
    const minutesB = parseInt(timeB[0])
    const secondsB = parseFloat(timeB[1])
    const totalB = minutesB * 60 + secondsB
    
    return totalA - totalB
  }).map((entry, index) => ({
    ...entry,
    position: index + 1
  }))

  const currentUserEntry = currentUserId 
    ? sortedEntries.find(entry => entry.userId === currentUserId)
    : null

  if (entries.length === 0) {
    return (
      <div className="simple-tile text-center py-8">
        <Trophy className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-300 mb-2">{t('eventLeaderboard.noTimes')}</h3>
        <p className="text-slate-400 text-sm">
          {t('home.beTheFirst')}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Best Lap Showcase */}
      {bestLap && eventGame && (
        <BestLapShowcase
          eventTitle={eventTitle}
          eventGame={eventGame}
          bestLap={bestLap}
          className="w-full"
        />
      )}

      {/* Header */}
      <div className="simple-tile">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center">
              <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
              {t('eventLeaderboard.title')}
            </h2>
            <p className="text-slate-400 mt-1">{eventTitle}</p>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 text-slate-300 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4 text-sm text-slate-400">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{entries.length} {t('eventLeaderboard.participants')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Verified className="w-4 h-4" />
            <span>{entries.filter(e => e.verified).length} {t('eventLeaderboard.verified')}</span>
          </div>
        </div>
      </div>

      {/* Current User Position (if participating) */}
      {currentUserEntry && (
        <div className={`simple-tile bg-gradient-to-r ${getRankColor(currentUserEntry.position)} border-l-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-slate-100 mb-1">{t('eventLeaderboard.yourPosition')}</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getRankIcon(currentUserEntry.position)}
                  <span className="text-2xl font-bold text-slate-100">
                    #{currentUserEntry.position}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="leaderboard-time text-slate-100" aria-label={`Your race time: ${formatTime(currentUserEntry.time)}`}>
                    {formatTime(currentUserEntry.time)}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  {getDocumentationIcon(currentUserEntry.documentationType)}
                  <span className="text-slate-300">
                    {getDocumentationLabel(currentUserEntry.documentationType)}
                  </span>
                  {currentUserEntry.verified && (
                    <Verified className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedEntries.slice(0, 3).map((entry) => (
          <div
            key={entry.id}
            className={`event-tile bg-gradient-to-br ${getRankColor(entry.position)} border-l-4 cursor-pointer hover:scale-105 transition-transform`}
            onClick={() => handleMediaClick(entry)}
          >
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                {getRankIcon(entry.position)}
              </div>
              
              {entry.position === 1 && (
                <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30 rounded-lg p-2">
                  <Crown className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                  <div className="text-xs font-semibold text-yellow-400">{t('events.mobile.winner')}</div>
                </div>
              )}
              
              <h3 className="font-bold text-slate-100 text-lg">{entry.username}</h3>
              <div className="leaderboard-time text-slate-100 mb-3" aria-label={`Race time: ${formatTime(entry.time)} for ${entry.username}`}>
                {formatTime(entry.time)}
              </div>
              <div className="event-tile-separator"></div>
              <div className="flex items-center justify-center space-x-3 text-base text-slate-300">
                {getDocumentationIcon(entry.documentationType)}
                <span>{getDocumentationLabel(entry.documentationType)}</span>
                {entry.verified && (
                  <div className="verification-badge">
                    <Verified className="w-4 h-4" />
                  </div>
                )}
              </div>
              {(entry.mediaUrl || entry.livestreamUrl) && (
                <div className="mt-2 text-sm text-slate-300 font-medium">
                  {t('eventLeaderboard.clickToView')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard */}
      {sortedEntries.length > 3 && (
        <div className="event-tile">
          <h3 className="text-xl font-semibold text-slate-100 mb-6 flex items-center">
            <Trophy className="event-icon text-yellow-400 mr-2" />
            {t('eventLeaderboard.fullLeaderboard')}
          </h3>
          <div className="space-y-3">
            {sortedEntries.map((entry) => (
              <div
                key={entry.id}
                className={`leaderboard-entry cursor-pointer ${
                  entry.userId === currentUserId
                    ? 'bg-slate-600/15 border-slate-400/40'
                    : 'hover:border-slate-500'
                } ${selectedEntry === entry.id ? 'ring-2 ring-slate-400' : ''}`}
                onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
              >
                <div className="leaderboard-user-info">
                  <div className="flex items-center space-x-3">
                    {getRankIcon(entry.position)}
                    <div>
                      <div className="flex items-center space-x-3">
                        <span 
                          className="leaderboard-username" 
                          title={entry.username.length > 12 ? entry.username : undefined}
                        >
                          {entry.username}
                        </span>
                        {entry.verified && (
                          <div className="verification-badge" title={t('eventLeaderboard.verified')}>
                            <Verified className="w-4 h-4" />
                          </div>
                        )}
                        {!entry.verified && (
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="text-sm text-slate-400 mt-1">
                        {new Date(entry.submissionDate).toLocaleDateString(getLocaleString(currentLanguage), {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="leaderboard-time-container">
                  <div className="flex items-center space-x-3">
                    <Clock className="event-icon text-slate-400" />
                    <span className="leaderboard-time text-slate-100" aria-label={`Race time: ${formatTime(entry.time)}`}>
                      {formatTime(entry.time)}
                      <span className="sr-only">for {entry.username}</span>
                    </span>
                                     </div>
                   <div className="flex items-center space-x-3 text-base text-slate-400">
                     {getDocumentationIcon(entry.documentationType)}
                     <span>{getDocumentationLabel(entry.documentationType)}</span>
                     {(entry.mediaUrl || entry.livestreamUrl) && (
                       <button
                         onClick={(e) => {
                           e.stopPropagation()
                           handleMediaClick(entry)
                         }}
                         className="text-slate-300 hover:text-slate-100 underline font-medium"
                       >
                         {t('eventLeaderboard.view')}
                       </button>
                     )}
                   </div>
                 </div>

                {/* Expanded Details */}
                {selectedEntry === entry.id && (
                  <div className="mt-4 pt-4 border-t border-slate-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-200 mb-2">{t('eventLeaderboard.documentation')}</h4>
                        <div className="flex items-center space-x-2 text-sm">
                          {getDocumentationIcon(entry.documentationType)}
                          <span className="text-slate-300">
                            {getDocumentationLabel(entry.documentationType)}
                          </span>
                        </div>
                        {(entry.mediaUrl || entry.livestreamUrl) && (
                          <button
                            onClick={() => handleMediaClick(entry)}
                            className="inline-flex items-center space-x-1 text-slate-300 hover:text-slate-100 text-sm mt-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>{t('eventLeaderboard.viewMedia')}</span>
                          </button>
                        )}
                      </div>
                      {entry.notes && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-200 mb-2">{t('eventLeaderboard.notes')}</h4>
                          <p className="text-sm text-slate-400">{entry.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Viewer Modal */}
      {mediaViewerEntry && (
        <MediaViewer
          entry={mediaViewerEntry}
          isOpen={!!mediaViewerEntry}
          onClose={() => setMediaViewerEntry(null)}
        />
      )}
    </div>
  )
}

export default EventLeaderboard