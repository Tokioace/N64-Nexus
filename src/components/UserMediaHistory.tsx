/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useCallback } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'
import { useMedia } from '../contexts/MediaContext'
import { MediaMeta } from '../types'
import { 
  Calendar, 
  Trophy, 
  Eye, 
  Heart, 
  Camera, 
  Video, 
  Award,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react'

interface UserMediaHistoryProps {
  className?: string
}

const UserMediaHistory: React.FC<UserMediaHistoryProps> = ({ className = '' }) => {
  const { t } = useLanguage()
  const { user } = useUser()
  const { getUserMediaHistory } = useMedia()
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'speedrun' | 'screenshot' | 'achievement'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes'>('date')

  // Memoized user media to prevent unnecessary recalculations
  const userMedia = useMemo(() => {
    if (!user || !getUserMediaHistory) {
      return []
    }
    
    try {
      return getUserMediaHistory(user.id)
    } catch (error) {
      console.error('Error fetching user media:', error)
      return []
    }
  }, [user, getUserMediaHistory])

  // Memoized filtered and sorted media
  const filteredAndSortedMedia = useMemo(() => {
    return userMedia
      .filter(media => selectedFilter === 'all' || media.type === selectedFilter)
      .sort((a, b) => {
        switch (sortBy) {
          case 'views':
            return b.views - a.views
          case 'likes':
            return b.likes - a.likes
          case 'date':
          default:
            return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        }
      })
  }, [userMedia, selectedFilter, sortBy])

  // Memoized type icon function
  const getTypeIcon = useCallback((type: 'speedrun' | 'screenshot' | 'achievement') => {
    switch (type) {
      case 'speedrun':
        return <Video className="w-4 h-4 text-red-400" />
      case 'screenshot':
        return <Camera className="w-4 h-4 text-blue-400" />
      case 'achievement':
        return <Award className="w-4 h-4 text-green-400" />
      default:
        return <Video className="w-4 h-4 text-gray-400" />
    }
  }, [])

  // Memoized type color function
  const getTypeColor = useCallback((type: 'speedrun' | 'screenshot' | 'achievement') => {
    switch (type) {
      case 'speedrun':
        return 'bg-red-600/20 border-red-600/30 text-red-400'
      case 'screenshot':
        return 'bg-blue-600/20 border-blue-600/30 text-blue-400'
      case 'achievement':
        return 'bg-green-600/20 border-green-600/30 text-green-400'
      default:
        return 'bg-gray-600/20 border-gray-600/30 text-gray-400'
    }
  }, [])

  // Memoized date formatting function
  const formatDate = useCallback((date: Date) => {
    try {
      const now = new Date()
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      
      if (diffInHours < 24) {
        return `vor ${Math.floor(diffInHours)} Stunden`
      } else if (diffInHours < 24 * 7) {
        return `vor ${Math.floor(diffInHours / 24)} Tagen`
      } else {
        return date.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      }
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Unbekannt'
    }
  }, [])

  // Early return if no user or getUserMediaHistory function
  if (!user || !getUserMediaHistory) {
    return null
  }

  // Empty state
  if (userMedia.length === 0) {
    return (
      <div className={`${className} bg-slate-800 rounded-lg p-6`}>
        <div className="text-center">
          <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">{t('media.noUploads')}</h3>
          <p className="text-slate-400">{t('media.noUploadsDesc')}</p>
        </div>
      </div>
    )
  }

  // Memoized MediaItem component to prevent unnecessary re-renders
  const MediaItem = React.memo(({ media }: { media: MediaMeta }) => (
    <div className="p-4 border-b border-slate-700/50 hover:bg-slate-750 transition-colors">
      <div className="flex items-start gap-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <img
            src={media.thumbnailUrl || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop'}
            alt={media.title}
            className="w-16 h-12 object-cover rounded bg-slate-700"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop'
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {getTypeIcon(media.type)}
            <h4 className="font-medium text-slate-100 truncate">{media.title}</h4>
            {media.verified && (
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            )}
          </div>

          <p className="text-sm text-slate-400 mb-2">{media.gameName}</p>

          {media.eventId && (
            <div className="flex items-center gap-1 mb-2">
              <Trophy className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-yellow-400">{t('media.eventUpload')}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(new Date(media.uploadDate))}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {media.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {media.likes}
              </span>
            </div>

            <div className={`px-2 py-1 rounded-full text-xs border ${getTypeColor(media.type)}`}>
              {media.type === 'speedrun' && '🏃‍♂️ Speedrun'}
              {media.type === 'screenshot' && '📷 Screenshot'}
              {media.type === 'achievement' && '🏆 Achievement'}
            </div>
          </div>

          {/* Tags */}
          {media.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {media.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded">
                  #{tag}
                </span>
              ))}
              {media.tags.length > 3 && (
                <span className="text-xs text-slate-400">
                  +{media.tags.length - 3} mehr
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  ))

  return (
    <div className={`${className} bg-slate-800 rounded-lg`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Meine Media History
          </h3>
          <span className="text-sm text-slate-400">{userMedia.length} Uploads</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as any)}
              className="bg-slate-700 text-slate-100 rounded px-3 py-1 text-sm"
            >
              <option value="all">Alle Typen</option>
              <option value="speedrun">Speedruns</option>
              <option value="screenshot">Screenshots</option>
              <option value="achievement">Achievements</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Sortieren:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-700 text-slate-100 rounded px-3 py-1 text-sm"
            >
              <option value="date">Nach Datum</option>
              <option value="views">Nach Views</option>
              <option value="likes">Nach Likes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Media History List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredAndSortedMedia.map((media) => (
          <MediaItem key={media.id} media={media} />
        ))}
      </div>

      {/* No results state */}
      {filteredAndSortedMedia.length === 0 && (
        <div className="p-6 text-center">
          <Filter className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-400">Keine Media für diesen Filter gefunden.</p>
        </div>
      )}

      {/* Summary */}
      <div className="p-4 bg-slate-750 rounded-b-lg">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-semibold text-slate-100">
              {userMedia.reduce((sum, m) => sum + m.views, 0)}
            </div>
            <div className="text-slate-400">Total Views</div>
          </div>
          <div>
            <div className="font-semibold text-slate-100">
              {userMedia.reduce((sum, m) => sum + m.likes, 0)}
            </div>
            <div className="text-slate-400">Total Likes</div>
          </div>
          <div>
            <div className="font-semibold text-slate-100">
              {userMedia.filter(m => m.verified).length}
            </div>
            <div className="text-slate-400">Verifiziert</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserMediaHistory