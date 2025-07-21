import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
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
            <p className="text-slate-400">Zeit: {entry.time}</p>
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
                alt={`Screenshot von ${entry.username}`}
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
                  console.error(t('media.error'))
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
                <h4 className="text-lg font-medium text-slate-100 mb-2">Livestream</h4>
                <p className="text-slate-400 mb-4">Dieser Beweis wurde über einen Livestream erbracht</p>
                <a
                  href={entry.livestreamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Stream ansehen</span>
                </a>
              </div>
            </div>
          )}
          
          {entry.notes && (
            <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
              <h4 className="text-sm font-medium text-slate-200 mb-2">Notizen:</h4>
              <p className="text-sm text-slate-400">{entry.notes}</p>
            </div>
          )}
          
          <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              {entry.documentationType === 'photo' && <Camera className="w-4 h-4" />}
              {entry.documentationType === 'video' && <Video className="w-4 h-4" />}
              {entry.documentationType === 'livestream' && <Radio className="w-4 h-4" />}
              <span>
                {entry.documentationType === 'photo' && 'Screenshot'}
                {entry.documentationType === 'video' && 'Video'}
                {entry.documentationType === 'livestream' && 'Livestream'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {entry.verified ? (
                <>
                  <Verified className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Verifiziert</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400">Unverifiziert</span>
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
  eventId,
  eventTitle,
  entries,
  currentUserId,
  onRefresh,
  isLoading = false
}) => {
  const { t } = useLanguage()
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)
  const [mediaViewerEntry, setMediaViewerEntry] = useState<EventLeaderboardEntry | null>(null)

  const formatTime = (time: string) => {
    // Convert MM:SS.mmm to a more readable format if needed
    return time
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
        return 'Screenshot'
      case 'video':
        return 'Video'
      case 'livestream':
        return 'Livestream'
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
      {/* Header */}
      <div className="simple-tile">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center">
              <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
              Event Leaderboard
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
            <span>{entries.length} Teilnehmer</span>
          </div>
          <div className="flex items-center space-x-1">
            <Verified className="w-4 h-4" />
            <span>{entries.filter(e => e.verified).length} verifiziert</span>
          </div>
        </div>
      </div>

      {/* Current User Position (if participating) */}
      {currentUserEntry && (
        <div className="simple-tile bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-l-4 border-blue-400">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-slate-100 mb-1">Deine Position</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getRankIcon(currentUserEntry.position)}
                  <span className="text-2xl font-bold text-slate-100">
                    #{currentUserEntry.position}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-xl font-mono text-blue-400">
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
            className={`simple-tile bg-gradient-to-br ${getRankColor(entry.position)} border-l-4 cursor-pointer hover:scale-105 transition-transform`}
            onClick={() => handleMediaClick(entry)}
          >
            <div className="text-center">
              <div className="mb-3">
                {getRankIcon(entry.position)}
              </div>
              <h3 className="font-bold text-slate-100 mb-1">{entry.username}</h3>
              <div className="text-2xl font-mono font-bold text-slate-100 mb-2">
                {formatTime(entry.time)}
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-400">
                {getDocumentationIcon(entry.documentationType)}
                <span>{getDocumentationLabel(entry.documentationType)}</span>
                {entry.verified && (
                  <Verified className="w-4 h-4 text-green-400" />
                )}
              </div>
              {(entry.mediaUrl || entry.livestreamUrl) && (
                <div className="mt-2 text-xs text-blue-400">
                  Klicken zum Anzeigen
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard */}
      {sortedEntries.length > 3 && (
        <div className="simple-tile">
          <h3 className="text-lg font-medium text-slate-100 mb-4">Vollständiges Leaderboard</h3>
          <div className="space-y-2">
            {sortedEntries.map((entry) => (
              <div
                key={entry.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  entry.userId === currentUserId
                    ? 'bg-blue-600/10 border-blue-400/30'
                    : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                } ${selectedEntry === entry.id ? 'ring-2 ring-blue-400' : ''}`}
                onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(entry.position)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-100">{entry.username}</span>
                        {entry.verified && (
                          <Verified className="w-4 h-4 text-green-400" />
                        )}
                        {!entry.verified && (
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="text-sm text-slate-400">
                        {new Date(entry.submissionDate).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-lg font-mono font-bold text-slate-100">
                        {formatTime(entry.time)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      {getDocumentationIcon(entry.documentationType)}
                      <span>{getDocumentationLabel(entry.documentationType)}</span>
                      {(entry.mediaUrl || entry.livestreamUrl) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMediaClick(entry)
                          }}
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          Anzeigen
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedEntry === entry.id && (
                  <div className="mt-4 pt-4 border-t border-slate-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-200 mb-2">Dokumentation</h4>
                        <div className="flex items-center space-x-2 text-sm">
                          {getDocumentationIcon(entry.documentationType)}
                          <span className="text-slate-300">
                            {getDocumentationLabel(entry.documentationType)}
                          </span>
                        </div>
                        {(entry.mediaUrl || entry.livestreamUrl) && (
                          <button
                            onClick={() => handleMediaClick(entry)}
                            className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm mt-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Media anzeigen</span>
                          </button>
                        )}
                      </div>
                      {entry.notes && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-200 mb-2">Notizen</h4>
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