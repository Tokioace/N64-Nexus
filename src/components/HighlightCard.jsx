import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Pin, Eye, Play, Image, Trophy, Palette, Video, Calendar } from 'lucide-react'
import { useHighlights, HIGHLIGHT_TYPES } from '../context/HighlightContext'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

function HighlightCard({ highlight, viewMode = 'grid' }) {
  const { toggleFavorite, togglePinned } = useHighlights()

  const getTypeIcon = (type) => {
    switch (type) {
      case HIGHLIGHT_TYPES.BEST_GAME:
        return <Trophy className="w-4 h-4" />
      case HIGHLIGHT_TYPES.FANART:
        return <Palette className="w-4 h-4" />
      case HIGHLIGHT_TYPES.LIVESTREAM:
        return <Video className="w-4 h-4" />
      case HIGHLIGHT_TYPES.SEASON_MILESTONE:
        return <Calendar className="w-4 h-4" />
      default:
        return <Trophy className="w-4 h-4" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case HIGHLIGHT_TYPES.BEST_GAME:
        return 'bg-retro-blue'
      case HIGHLIGHT_TYPES.FANART:
        return 'bg-retro-green'
      case HIGHLIGHT_TYPES.LIVESTREAM:
        return 'bg-retro-purple'
      case HIGHLIGHT_TYPES.SEASON_MILESTONE:
        return 'bg-retro-yellow'
      default:
        return 'bg-retro-gray'
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case HIGHLIGHT_TYPES.BEST_GAME:
        return 'Beste Runde'
      case HIGHLIGHT_TYPES.FANART:
        return 'Fanart'
      case HIGHLIGHT_TYPES.LIVESTREAM:
        return 'Livestream'
      case HIGHLIGHT_TYPES.SEASON_MILESTONE:
        return 'Meilenstein'
      default:
        return 'Trophäe'
    }
  }

  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case 'private':
        return '🔒'
      case 'friends':
        return '👥'
      case 'public':
        return '🌍'
      default:
        return '🌍'
    }
  }

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(highlight.id)
  }

  const handlePinClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    togglePinned(highlight.id)
  }

  const playCameraSound = () => {
    // Simulate camera click sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
    audio.play().catch(() => {})
  }

  if (viewMode === 'list') {
    return (
      <Link 
        to={`/highlight/${highlight.id}`}
        className="block retro-card rounded-lg p-4 hover:shadow-lg transition-all duration-300 highlight-thumbnail"
        onClick={playCameraSound}
      >
        <div className="flex items-center space-x-4">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-retro-dark">
              {highlight.video ? (
                <div className="w-full h-full bg-gradient-to-br from-retro-purple to-retro-blue flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
              ) : (
                <img 
                  src={highlight.image} 
                  alt={highlight.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {/* Sticker */}
            <div className={`sticker ${getTypeColor(highlight.type)}`}>
              {getTypeIcon(highlight.type)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-retro text-white truncate">
                {highlight.title}
              </h3>
              {highlight.isPinned && (
                <Pin className="w-4 h-4 text-retro-yellow" />
              )}
            </div>
            <p className="text-retro-gray font-pixel text-sm mb-2 line-clamp-2">
              {highlight.description}
            </p>
            <div className="flex items-center space-x-4 text-xs text-retro-gray">
              <span>{highlight.game}</span>
              <span>{format(new Date(highlight.date), 'dd.MM.yyyy', { locale: de })}</span>
              <span>{getPrivacyIcon(highlight.privacy)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded transition-all duration-300 ${
                highlight.isFavorite 
                  ? 'text-retro-red' 
                  : 'text-retro-gray hover:text-retro-red'
              }`}
            >
              <Heart className={`w-4 h-4 ${highlight.isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handlePinClick}
              className={`p-2 rounded transition-all duration-300 ${
                highlight.isPinned 
                  ? 'text-retro-yellow' 
                  : 'text-retro-gray hover:text-retro-yellow'
              }`}
            >
              <Pin className={`w-4 h-4 ${highlight.isPinned ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </Link>
    )
  }

  if (viewMode === 'featured') {
    return (
      <Link 
        to={`/highlight/${highlight.id}`}
        className="block retro-card rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 highlight-thumbnail"
        onClick={playCameraSound}
      >
        <div className="relative">
          {/* Featured Image */}
          <div className="h-48 bg-gradient-to-br from-retro-dark to-retro-darker">
            {highlight.video ? (
              <div className="w-full h-full bg-gradient-to-br from-retro-purple to-retro-blue flex items-center justify-center">
                <Play className="w-12 h-12 text-white" />
              </div>
            ) : (
              <img 
                src={highlight.image} 
                alt={highlight.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {/* Sticker */}
          <div className={`sticker ${getTypeColor(highlight.type)}`}>
            {getTypeIcon(highlight.type)}
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-pixel text-retro-yellow bg-black/50 px-2 py-1 rounded">
                {getTypeLabel(highlight.type)}
              </span>
              <span className="text-xs font-pixel text-white bg-black/50 px-2 py-1 rounded">
                {highlight.game}
              </span>
            </div>
            <h3 className="text-xl font-retro text-white mb-2">
              {highlight.title}
            </h3>
            <p className="text-white/90 font-pixel text-sm line-clamp-2">
              {highlight.description}
            </p>
          </div>
        </div>
      </Link>
    )
  }

  // Default grid view
  return (
    <Link 
      to={`/highlight/${highlight.id}`}
      className="block retro-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 highlight-thumbnail group"
      onClick={playCameraSound}
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-retro-dark to-retro-darker">
        {highlight.video ? (
          <div className="w-full h-full bg-gradient-to-br from-retro-purple to-retro-blue flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <Play className="w-8 h-8 text-white" />
          </div>
        ) : (
          <img 
            src={highlight.image} 
            alt={highlight.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        
        {/* Sticker */}
        <div className={`sticker ${getTypeColor(highlight.type)}`}>
          {getTypeIcon(highlight.type)}
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleFavoriteClick}
            className={`p-1 rounded bg-black/50 transition-all duration-300 ${
              highlight.isFavorite 
                ? 'text-retro-red' 
                : 'text-white hover:text-retro-red'
            }`}
          >
            <Heart className={`w-3 h-3 ${highlight.isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handlePinClick}
            className={`p-1 rounded bg-black/50 transition-all duration-300 ${
              highlight.isPinned 
                ? 'text-retro-yellow' 
                : 'text-white hover:text-retro-yellow'
            }`}
          >
            <Pin className={`w-3 h-3 ${highlight.isPinned ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-pixel text-retro-gray">
            {getTypeLabel(highlight.type)}
          </span>
          <span className="text-xs font-pixel text-retro-gray">
            {getPrivacyIcon(highlight.privacy)}
          </span>
        </div>
        
        <h3 className="font-retro text-white text-sm mb-1 line-clamp-1">
          {highlight.title}
        </h3>
        
        <p className="text-retro-gray font-pixel text-xs mb-2 line-clamp-2">
          {highlight.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-retro-gray">
          <span className="font-pixel">{highlight.game}</span>
          <span className="font-pixel">
            {format(new Date(highlight.date), 'dd.MM.yy', { locale: de })}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default HighlightCard