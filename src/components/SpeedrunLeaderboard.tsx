import React, { useState, useEffect } from 'react'
import { 
  Trophy, 
  Medal, 
  Award, 
  Clock, 
  User, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Play, 
  Star,
  Crown,
  Flame,
  Filter,
  TrendingUp
} from 'lucide-react'
import { useMedia } from '../contexts/MediaContext'
import { useUser } from '../contexts/UserContext'
import { useEvents } from '../contexts/EventContext'
import { MediaMeta, SpeedrunEntry } from '../types'
import RetroCard3D from './RetroCard3D'
import RetroButton3D from './RetroButton3D'

interface SpeedrunLeaderboardProps {
  gameId?: string
  eventId?: string
  type?: 'daily' | 'weekly' | 'monthly' | 'event' | 'all-time'
  maxEntries?: number
  showMedia?: boolean
}

const SpeedrunLeaderboard: React.FC<SpeedrunLeaderboardProps> = ({
  gameId,
  eventId,
  type = 'all-time',
  maxEntries = 10,
  showMedia = true
}) => {
  const { user } = useUser()
  const { mediaList, getMediaByGame, getMediaByEvent } = useMedia()
  const { getEventById } = useEvents()
  
  const [leaderboard, setLeaderboard] = useState<SpeedrunEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<SpeedrunEntry | null>(null)
  const [filterVerified, setFilterVerified] = useState(false)
  const [showOnlyWithMedia, setShowOnlyWithMedia] = useState(false)

  const event = eventId ? getEventById(eventId) : null

  useEffect(() => {
    let relevantMedia = mediaList

    // Filter by game or event
    if (gameId) {
      relevantMedia = getMediaByGame(gameId)
    } else if (eventId) {
      relevantMedia = getMediaByEvent(eventId)
    }

    // Filter by time period
    if (type !== 'all-time') {
      const now = new Date()
      const cutoffDate = new Date()
      
      switch (type) {
        case 'daily':
          cutoffDate.setDate(now.getDate() - 1)
          break
        case 'weekly':
          cutoffDate.setDate(now.getDate() - 7)
          break
        case 'monthly':
          cutoffDate.setMonth(now.getMonth() - 1)
          break
        case 'event':
          if (event) {
            cutoffDate.setTime(new Date(event.startDate).getTime())
          }
          break
      }
      
      relevantMedia = relevantMedia.filter(media => 
        media.createdAt >= cutoffDate
      )
    }

    // Only include media with game times
    const speedrunMedia = relevantMedia.filter(media => 
      media.gameTime && 
      media.gameTime.trim() !== '' &&
      (!filterVerified || media.isVerified) &&
      (!showOnlyWithMedia || showMedia)
    )

    // Convert to speedrun entries and sort by time
    const entries: SpeedrunEntry[] = speedrunMedia.map((media, index) => {
      // Parse time (assumes MM:SS or HH:MM:SS format)
      const timeParts = media.gameTime!.split(':').map(Number)
      let totalSeconds = 0
      
      if (timeParts.length === 2) {
        totalSeconds = timeParts[0] * 60 + timeParts[1]
      } else if (timeParts.length === 3) {
        totalSeconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]
      }

      return {
        rank: 0, // Will be set after sorting
        user: {
          id: media.userId,
          username: media.userId,
          points: 0,
          level: 1,
          totalQuizzes: 0,
          correctAnswers: 0,
          totalAnswers: 0,
          achievements: [],
          quizProgress: {
            totalQuestions: 0,
            correctAnswers: 0,
            categories: {} as any,
            achievements: []
          }
        },
        score: totalSeconds,
        quizCount: 0,
        averageScore: 0,
        gameTime: media.gameTime!,
        media: media,
        isVerified: media.isVerified,
        submittedAt: media.createdAt
      }
    })

    // Sort by time (lowest first) and assign ranks
    entries.sort((a, b) => a.score - b.score)
    entries.forEach((entry, index) => {
      entry.rank = index + 1
    })

    // Group by user (keep best time per user)
    const userBestTimes = new Map<string, SpeedrunEntry>()
    entries.forEach(entry => {
      const existing = userBestTimes.get(entry.user.id)
      if (!existing || entry.score < existing.score) {
        userBestTimes.set(entry.user.id, entry)
      }
    })

    // Convert back to array and re-rank
    const finalEntries = Array.from(userBestTimes.values())
    finalEntries.sort((a, b) => a.score - b.score)
    finalEntries.forEach((entry, index) => {
      entry.rank = index + 1
    })

    // Limit entries
    setLeaderboard(finalEntries.slice(0, maxEntries))
  }, [mediaList, gameId, eventId, type, filterVerified, showOnlyWithMedia, maxEntries, getMediaByGame, getMediaByEvent, event, showMedia])

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-gray-400 font-bold">{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50'
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50'
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/50'
      default:
        return 'bg-gray-800/50 border-gray-600/50'
    }
  }

  const getTypeTitle = () => {
    switch (type) {
      case 'daily':
        return 'Tages-Rangliste'
      case 'weekly':
        return 'Wochen-Rangliste'
      case 'monthly':
        return 'Monats-Rangliste'
      case 'event':
        return event ? `${event.title} - Rangliste` : 'Event-Rangliste'
      case 'all-time':
        return 'Ewige Bestenliste'
      default:
        return 'Rangliste'
    }
  }

  const handleViewMedia = (entry: SpeedrunEntry) => {
    setSelectedEntry(entry)
  }

  if (leaderboard.length === 0) {
    return (
      <RetroCard3D className="text-center p-8">
        <div className="text-gray-400">
          <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Keine Einträge gefunden</h3>
          <p className="text-sm">
            {gameId && 'Für dieses Spiel wurden noch keine Zeiten eingereicht.'}
            {eventId && 'Für dieses Event wurden noch keine Zeiten eingereicht.'}
            {!gameId && !eventId && 'Es wurden noch keine Zeiten eingereicht.'}
          </p>
        </div>
      </RetroCard3D>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          {getTypeTitle()}
        </h2>
        
        <div className="flex items-center gap-2">
          <RetroButton3D
            variant="secondary"
            onClick={() => setFilterVerified(!filterVerified)}
            className={filterVerified ? 'bg-blue-600' : ''}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Nur verifiziert
          </RetroButton3D>
          
          {showMedia && (
            <RetroButton3D
              variant="secondary"
              onClick={() => setShowOnlyWithMedia(!showOnlyWithMedia)}
              className={showOnlyWithMedia ? 'bg-blue-600' : ''}
            >
              <Eye className="w-4 h-4 mr-1" />
              Nur mit Medien
            </RetroButton3D>
          )}
        </div>
      </div>

      {/* Event Info */}
      {event && (
        <RetroCard3D className="p-4 bg-blue-900/20 border-blue-500/30">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-300">{event.title}</h3>
              <p className="text-gray-300">Spiel: {event.game}</p>
              <p className="text-sm text-gray-400">
                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </RetroCard3D>
      )}

      {/* Leaderboard */}
      <div className="space-y-3">
        {leaderboard.map((entry, index) => (
          <RetroCard3D 
            key={`${entry.user.id}-${entry.submittedAt.getTime()}`}
            className={`${getRankColor(entry.rank)} transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/50">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-medium">{entry.user.username}</span>
                        {entry.isVerified && (
                          <CheckCircle className="w-4 h-4 text-green-400" title="Verifiziert" />
                        )}
                        {entry.user.id === user?.id && (
                          <Star className="w-4 h-4 text-yellow-400" title="Das sind Sie!" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {entry.submittedAt.toLocaleDateString()}
                        </div>
                        {entry.rank === 1 && type === 'weekly' && (
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Flame className="w-3 h-3" />
                            Run der Woche
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time and Actions */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-xl font-bold text-white">{entry.gameTime}</span>
                    </div>
                    {entry.rank <= 3 && (
                      <div className="text-xs text-gray-400">
                        {entry.rank === 1 ? 'Weltrekord' : 
                         entry.rank === 2 ? '2. Platz' : '3. Platz'}
                      </div>
                    )}
                  </div>

                  {/* Media Actions */}
                  {showMedia && entry.media && (
                    <div className="flex items-center gap-2">
                      <RetroButton3D
                        variant="secondary"
                        onClick={() => handleViewMedia(entry)}
                        className="text-xs px-2 py-1"
                      >
                        {entry.media.type === 'video' ? (
                          <>
                            <Play className="w-3 h-3 mr-1" />
                            Video
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Foto
                          </>
                        )}
                      </RetroButton3D>
                      
                      {entry.media.votes && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <span>🔥 {entry.media.votes.likes}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Comment */}
              {entry.media?.comment && (
                <div className="mt-3 p-2 bg-gray-900/50 rounded text-sm text-gray-300">
                  "{entry.media.comment}"
                </div>
              )}
            </div>
          </RetroCard3D>
        ))}
      </div>

      {/* Show More Button */}
      {leaderboard.length >= maxEntries && (
        <div className="text-center">
          <RetroButton3D variant="secondary">
            <TrendingUp className="w-4 h-4 mr-2" />
            Mehr anzeigen
          </RetroButton3D>
        </div>
      )}

      {/* Media Detail Modal */}
      {selectedEntry && selectedEntry.media && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <RetroCard3D className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {getRankIcon(selectedEntry.rank)}
                    {selectedEntry.user.username} - {selectedEntry.gameTime}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {selectedEntry.submittedAt.toLocaleDateString()}
                    {selectedEntry.isVerified && (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Verifiziert</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Media Preview */}
                <div className="bg-black rounded-lg overflow-hidden">
                  {selectedEntry.media.type === 'photo' ? (
                    <img
                      src={selectedEntry.media.url}
                      alt={`Speedrun by ${selectedEntry.user.username}`}
                      className="w-full max-h-96 object-contain"
                    />
                  ) : (
                    <video
                      src={selectedEntry.media.url}
                      className="w-full max-h-96 object-contain"
                      controls
                    />
                  )}
                </div>

                {/* Comment */}
                {selectedEntry.media.comment && (
                  <div className="bg-gray-800/50 p-3 rounded">
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Kommentar:</h4>
                    <p className="text-white">{selectedEntry.media.comment}</p>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-gray-400">Votes</div>
                    <div className="text-white">
                      👍 {selectedEntry.media.votes.likes} | 👎 {selectedEntry.media.votes.dislikes}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-gray-400">Dateigröße</div>
                    <div className="text-white">
                      {Math.round((selectedEntry.media.metadata.fileSize || 0) / 1024)} KB
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end">
                  <RetroButton3D
                    variant="secondary"
                    onClick={() => setSelectedEntry(null)}
                  >
                    Schließen
                  </RetroButton3D>
                </div>
              </div>
            </div>
          </RetroCard3D>
        </div>
      )}
    </div>
  )
}

export default SpeedrunLeaderboard