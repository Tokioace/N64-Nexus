import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Pin, Share2, Edit, Trash2, Play, MessageCircle, Calendar, Trophy, Palette, Video } from 'lucide-react'
import { useHighlights, HIGHLIGHT_TYPES } from '../context/HighlightContext'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

function HighlightDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { 
    highlights, 
    toggleFavorite, 
    togglePinned, 
    deleteHighlight,
    addComment 
  } = useHighlights()
  
  const [newComment, setNewComment] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const highlight = highlights.find(h => h.id === id)

  if (!highlight) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-retro text-retro-gray mb-4">
          Highlight nicht gefunden
        </h2>
        <Link 
          to="/"
          className="text-retro-purple hover:text-retro-blue transition-colors duration-300 font-pixel"
        >
          Zurück zum Archiv
        </Link>
      </div>
    )
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case HIGHLIGHT_TYPES.BEST_GAME:
        return <Trophy className="w-6 h-6" />
      case HIGHLIGHT_TYPES.FANART:
        return <Palette className="w-6 h-6" />
      case HIGHLIGHT_TYPES.LIVESTREAM:
        return <Video className="w-6 h-6" />
      case HIGHLIGHT_TYPES.SEASON_MILESTONE:
        return <Calendar className="w-6 h-6" />
      default:
        return <Trophy className="w-6 h-6" />
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
        return '🔒 Privat'
      case 'friends':
        return '👥 Nur Freunde'
      case 'public':
        return '🌍 Öffentlich'
      default:
        return '🌍 Öffentlich'
    }
  }

  const handleFavoriteClick = () => {
    toggleFavorite(highlight.id)
  }

  const handlePinClick = () => {
    togglePinned(highlight.id)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: highlight.title,
        text: highlight.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link in Zwischenablage kopiert!')
    }
  }

  const handleDelete = () => {
    deleteHighlight(highlight.id)
    navigate('/')
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      addComment(highlight.id, newComment.trim())
      setNewComment('')
    }
  }

  const renderStatistics = () => {
    if (!highlight.statistics) return null

    const stats = highlight.statistics
    const entries = Object.entries(stats).filter(([_, value]) => value !== null && value !== '' && value !== 0)

    if (entries.length === 0) return null

    return (
      <div className="retro-card p-6">
        <h3 className="text-lg font-retro text-white mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Statistiken
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {entries.map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-2xl font-retro text-retro-purple mb-1">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </div>
              <div className="text-xs font-pixel text-retro-gray capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/"
            className="p-2 text-retro-gray hover:text-white hover:bg-retro-dark rounded-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-retro text-white">
              {highlight.title}
            </h1>
            <p className="text-retro-gray font-pixel">
              {highlight.game} • {format(new Date(highlight.date), 'dd.MM.yyyy', { locale: de })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-lg transition-all duration-300 ${
              highlight.isFavorite 
                ? 'text-retro-red bg-retro-red/10' 
                : 'text-retro-gray hover:text-retro-red hover:bg-retro-dark'
            }`}
          >
            <Heart className={`w-5 h-5 ${highlight.isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handlePinClick}
            className={`p-2 rounded-lg transition-all duration-300 ${
              highlight.isPinned 
                ? 'text-retro-yellow bg-retro-yellow/10' 
                : 'text-retro-gray hover:text-retro-yellow hover:bg-retro-dark'
            }`}
          >
            <Pin className={`w-5 h-5 ${highlight.isPinned ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 text-retro-gray hover:text-white hover:bg-retro-dark rounded-lg transition-all duration-300"
          >
            <Share2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-retro-gray hover:text-retro-red hover:bg-retro-dark rounded-lg transition-all duration-300"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Media Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image/Video */}
          <div className="retro-card overflow-hidden">
            {highlight.video ? (
              <div className="relative h-96 bg-gradient-to-br from-retro-purple to-retro-blue flex items-center justify-center">
                <Play className="w-16 h-16 text-white" />
                <div className="absolute top-4 right-4 bg-black/50 px-2 py-1 rounded text-xs font-pixel text-white">
                  Video verfügbar
                </div>
              </div>
            ) : (
              <img 
                src={highlight.image} 
                alt={highlight.title}
                className="w-full h-96 object-cover"
              />
            )}
          </div>

          {/* Description */}
          <div className="retro-card p-6">
            <h3 className="text-lg font-retro text-white mb-4">
              Beschreibung
            </h3>
            <p className="text-retro-gray font-pixel leading-relaxed">
              {highlight.description}
            </p>
          </div>

          {/* Statistics */}
          {renderStatistics()}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Type and Privacy */}
          <div className="retro-card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className={`p-2 rounded-lg ${getTypeColor(highlight.type)}`}>
                {getTypeIcon(highlight.type)}
              </div>
              <div>
                <h3 className="font-retro text-white">
                  {getTypeLabel(highlight.type)}
                </h3>
                <p className="text-xs font-pixel text-retro-gray">
                  {getPrivacyIcon(highlight.privacy)}
                </p>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="retro-card p-6">
            <h3 className="text-lg font-retro text-white mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Kommentare ({highlight.comments.length})
            </h3>
            
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Kommentar hinzufügen..."
                  className="flex-1 px-3 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-retro-purple text-white rounded-lg hover:bg-retro-blue transition-colors duration-300 font-pixel disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Senden
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {highlight.comments.map(comment => (
                <div key={comment.id} className="bg-retro-dark rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-pixel text-retro-purple">
                      {comment.user}
                    </span>
                    <span className="text-xs font-pixel text-retro-gray">
                      {format(new Date(comment.date), 'dd.MM.yy', { locale: de })}
                    </span>
                  </div>
                  <p className="text-sm font-pixel text-white">
                    {comment.text}
                  </p>
                </div>
              ))}
              
              {highlight.comments.length === 0 && (
                <p className="text-sm font-pixel text-retro-gray text-center py-4">
                  Noch keine Kommentare
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-retro-dark border-2 border-pixel-border rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-retro text-white mb-4">
              Highlight löschen?
            </h3>
            <p className="text-retro-gray font-pixel mb-6">
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-retro-gray hover:text-white transition-colors duration-300 font-pixel"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-retro-red text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-pixel"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HighlightDetail