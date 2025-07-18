import React, { useState, useEffect } from 'react'
import { 
  Heart, 
  ThumbsDown, 
  Flag, 
  Eye, 
  EyeOff, 
  Clock, 
  User, 
  Trophy, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Filter,
  Calendar,
  GamepadIcon,
  Play,
  Download
} from 'lucide-react'
import { useMedia } from '../contexts/MediaContext'
import { useUser } from '../contexts/UserContext'
import { useEvents } from '../contexts/EventContext'
import { MediaMeta } from '../types'
import SimpleCard from './SimpleCard'
import SimpleButton from './SimpleButton'

interface MediaGalleryProps {
  gameId?: string
  eventId?: string
  userId?: string
  showOnlyVerified?: boolean
  showOnlyPublic?: boolean
  maxItems?: number
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  gameId,
  eventId,
  userId,
  showOnlyVerified = false,
  showOnlyPublic = true,
  maxItems
}) => {
  const { user } = useUser()
  const { 
    mediaList, 
    voteOnMedia, 
    reportMedia, 
    deleteMedia, 
    getMediaByUser, 
    getMediaByEvent, 
    getMediaByGame 
  } = useMedia()
  const { getEventById } = useEvents()
  
  const [filteredMedia, setFilteredMedia] = useState<MediaMeta[]>([])
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mostLiked' | 'gameTime'>('newest')
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'video'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [reportingMedia, setReportingMedia] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState('')

  useEffect(() => {
    let media = mediaList

    // Apply filters
    if (gameId) {
      media = getMediaByGame(gameId)
    } else if (eventId) {
      media = getMediaByEvent(eventId)
    } else if (userId) {
      media = getMediaByUser(userId)
    }

    // Additional filters
    if (showOnlyVerified) {
      media = media.filter(m => m.isVerified)
    }
    
    if (showOnlyPublic) {
      media = media.filter(m => m.isPublic)
    }

    if (filterType !== 'all') {
      media = media.filter(m => m.type === filterType)
    }

    // Sort media
    media.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'mostLiked':
          return b.votes.likes - a.votes.likes
        case 'gameTime':
          // Simple time comparison (assumes MM:SS or HH:MM:SS format)
          const timeA = a.gameTime?.split(':').reduce((acc, time) => (60 * acc) + +time, 0) || 0
          const timeB = b.gameTime?.split(':').reduce((acc, time) => (60 * acc) + +time, 0) || 0
          return timeA - timeB
        default:
          return 0
      }
    })

    // Limit items if specified
    if (maxItems) {
      media = media.slice(0, maxItems)
    }

    setFilteredMedia(media)
  }, [mediaList, gameId, eventId, userId, showOnlyVerified, showOnlyPublic, sortBy, filterType, maxItems, getMediaByGame, getMediaByEvent, getMediaByUser])

  const handleVote = async (mediaId: string, vote: 'like' | 'dislike') => {
    if (!user) return
    
    try {
      await voteOnMedia(mediaId, vote)
    } catch (error) {
      console.error('Error voting on media:', error)
    }
  }

  const handleReport = async (mediaId: string) => {
    if (!user || !reportReason.trim()) return
    
    try {
      await reportMedia(mediaId, reportReason)
      setReportingMedia(null)
      setReportReason('')
    } catch (error) {
      console.error('Error reporting media:', error)
    }
  }

  const handleDelete = async (mediaId: string) => {
    if (!user) return
    
    if (window.confirm('Sind Sie sicher, dass Sie dieses Medium löschen möchten?')) {
      try {
        await deleteMedia(mediaId)
      } catch (error) {
        console.error('Error deleting media:', error)
      }
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'vor wenigen Sekunden'
    if (diffInSeconds < 3600) return `vor ${Math.floor(diffInSeconds / 60)} Min`
    if (diffInSeconds < 86400) return `vor ${Math.floor(diffInSeconds / 3600)} Std`
    return `vor ${Math.floor(diffInSeconds / 86400)} Tagen`
  }

  const getStatusIcon = (media: MediaMeta) => {
    switch (media.status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      default:
        return null
    }
  }

  if (filteredMedia.length === 0) {
    return (
      <SimpleCard className="text-center p-8">
        <div className="text-gray-400">
          <GamepadIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Keine Medien gefunden</h3>
          <p className="text-sm">
            {gameId && 'Für dieses Spiel wurden noch keine Medien hochgeladen.'}
            {eventId && 'Für dieses Event wurden noch keine Medien hochgeladen.'}
            {userId && 'Dieser Nutzer hat noch keine Medien hochgeladen.'}
            {!gameId && !eventId && !userId && 'Es wurden noch keine Medien hochgeladen.'}
          </p>
        </div>
      </SimpleCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Speedrun Medien ({filteredMedia.length})
        </h2>
        
        <SimpleButton
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </SimpleButton>
      </div>

      {/* Filters */}
      {showFilters && (
        <SimpleCard className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sortierung
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="newest">Neueste zuerst</option>
                <option value="oldest">Älteste zuerst</option>
                <option value="mostLiked">Beliebteste</option>
                <option value="gameTime">Beste Zeit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Medientyp
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Alle</option>
                <option value="photo">Fotos</option>
                <option value="video">Videos</option>
              </select>
            </div>

            <div className="flex items-end">
              <SimpleButton
                variant="secondary"
                onClick={() => {
                  setSortBy('newest')
                  setFilterType('all')
                }}
                className="w-full"
              >
                Filter zurücksetzen
              </SimpleButton>
            </div>
          </div>
        </SimpleCard>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.map((media) => {
          const event = media.eventId ? getEventById(media.eventId) : null
          const isOwner = user?.id === media.userId
          const userVote = media.votes.userVote

          return (
            <SimpleCard key={media.id} className="overflow-hidden">
              {/* Media Content */}
              <div className="relative">
                {media.type === 'photo' ? (
                  <img
                    src={media.url}
                    alt={`Speedrun by ${media.userId}`}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="relative">
                    <video
                      src={media.url}
                      className="w-full h-48 object-cover"
                      controls
                      preload="metadata"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded flex items-center gap-1">
                      <Play className="w-3 h-3 text-white" />
                      <span className="text-xs text-white">Video</span>
                    </div>
                  </div>
                )}

                {/* Status Overlay */}
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  {getStatusIcon(media)}
                  {!media.isPublic && (
                    <div className="bg-gray-900/70 px-2 py-1 rounded flex items-center gap-1">
                      <EyeOff className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">Privat</span>
                    </div>
                  )}
                  {media.isEventRun && (
                    <div className="bg-blue-900/70 px-2 py-1 rounded flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-blue-400">Event</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Media Info */}
              <div className="p-4 space-y-3">
                {/* Game Time */}
                {media.gameTime && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-lg font-bold text-white">{media.gameTime}</span>
                    </div>
                    {media.isVerified && (
                      <div className="flex items-center gap-1 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs">Verifiziert</span>
                      </div>
                    )}
                  </div>
                )}

                {/* User and Date */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{media.userId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatTimeAgo(media.createdAt)}</span>
                  </div>
                </div>

                {/* Event Info */}
                {event && (
                  <div className="text-sm text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
                    {event.title} - {event.game}
                  </div>
                )}

                {/* Comment */}
                {media.comment && (
                  <p className="text-sm text-gray-300 bg-gray-800/50 p-2 rounded">
                    {media.comment}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-600">
                  {/* Voting */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleVote(media.id, 'like')}
                      disabled={!user}
                      className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                        userVote === 'like'
                          ? 'bg-red-600 text-white'
                          : 'text-gray-400 hover:text-red-400'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{media.votes.likes}</span>
                    </button>
                    
                    <button
                      onClick={() => handleVote(media.id, 'dislike')}
                      disabled={!user}
                      className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                        userVote === 'dislike'
                          ? 'bg-gray-600 text-white'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span className="text-sm">{media.votes.dislikes}</span>
                    </button>
                  </div>

                  {/* Owner Actions */}
                  <div className="flex items-center gap-2">
                    {isOwner && (
                      <SimpleButton
                        variant="danger"
                        onClick={() => handleDelete(media.id)}
                        className="text-xs px-2 py-1"
                      >
                        Löschen
                      </SimpleButton>
                    )}
                    
                    {!isOwner && user && (
                      <button
                        onClick={() => setReportingMedia(media.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Melden"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Report Form */}
                {reportingMedia === media.id && (
                  <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded">
                    <h4 className="text-sm font-medium text-red-400 mb-2">Medium melden</h4>
                    <textarea
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Grund für die Meldung..."
                      rows={2}
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm placeholder-gray-400 focus:border-red-500 focus:outline-none resize-none"
                    />
                    <div className="flex gap-2 mt-2">
                      <SimpleButton
                        variant="danger"
                        onClick={() => handleReport(media.id)}
                        disabled={!reportReason.trim()}
                        className="text-xs px-2 py-1"
                      >
                        Melden
                      </SimpleButton>
                      <SimpleButton
                        variant="secondary"
                        onClick={() => {
                          setReportingMedia(null)
                          setReportReason('')
                        }}
                        className="text-xs px-2 py-1"
                      >
                        Abbrechen
                      </SimpleButton>
                    </div>
                  </div>
                )}
              </div>
            </SimpleCard>
          )
        })}
      </div>
    </div>
  )
}

export default MediaGallery