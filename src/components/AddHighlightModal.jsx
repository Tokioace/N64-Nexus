import React, { useState } from 'react'
import { X, Upload, Play, Image, Trophy, Palette, Video, Calendar } from 'lucide-react'
import { HIGHLIGHT_TYPES, PRIVACY_LEVELS } from '../context/HighlightContext'

function AddHighlightModal({ onClose, onSubmit, userPlan, currentCount, maxCount }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: HIGHLIGHT_TYPES.BEST_GAME,
    game: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    video: '',
    privacy: PRIVACY_LEVELS.PUBLIC,
    statistics: {}
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Titel ist erforderlich'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Beschreibung ist erforderlich'
    }

    if (!formData.game.trim()) {
      newErrors.game = 'Spiel ist erforderlich'
    }

    if (!formData.image && !formData.video) {
      newErrors.media = 'Bild oder Video ist erforderlich'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      // Prepare statistics based on type
      let statistics = null
      if (formData.type === HIGHLIGHT_TYPES.BEST_GAME) {
        statistics = {
          time: formData.statistics.time || '',
          score: formData.statistics.score || 0,
          level: formData.statistics.level || 0
        }
      } else if (formData.type === HIGHLIGHT_TYPES.SEASON_MILESTONE) {
        statistics = {
          tournament: formData.statistics.tournament || '',
          position: formData.statistics.position || 0,
          participants: formData.statistics.participants || 0
        }
      } else if (formData.type === HIGHLIGHT_TYPES.TROPHY) {
        statistics = {
          level: formData.statistics.level || 0,
          playtime: formData.statistics.playtime || '',
          achievements: formData.statistics.achievements || 0
        }
      }

      const highlightData = {
        ...formData,
        statistics,
        isFavorite: false,
        isPinned: false,
        comments: []
      }

      await onSubmit(highlightData)
    } catch (error) {
      console.error('Error adding highlight:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

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

  const renderStatisticsFields = () => {
    switch (formData.type) {
      case HIGHLIGHT_TYPES.BEST_GAME:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-pixel text-retro-gray mb-2">
                Bestzeit
              </label>
              <input
                type="text"
                value={formData.statistics.time || ''}
                onChange={(e) => handleInputChange('statistics', { ...formData.statistics, time: e.target.value })}
                placeholder="z.B. 2:34:12"
                className="w-full px-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple"
              />
            </div>
            <div>
              <label className="block text-xs font-pixel text-retro-gray mb-2">
                Punktzahl
              </label>
              <input
                type="number"
                value={formData.statistics.score || ''}
                onChange={(e) => handleInputChange('statistics', { ...formData.statistics, score: parseInt(e.target.value) || 0 })}
                placeholder="125000"
                className="w-full px-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple"
              />
            </div>
            <div>
              <label className="block text-xs font-pixel text-retro-gray mb-2">
                Level
              </label>
              <input
                type="number"
                value={formData.statistics.level || ''}
                onChange={(e) => handleInputChange('statistics', { ...formData.statistics, level: parseInt(e.target.value) || 0 })}
                placeholder="15"
                className="w-full px-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple"
              />
            </div>
          </div>
        )

      case HIGHLIGHT_TYPES.SEASON_MILESTONE:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-pixel text-retro-gray mb-2">
                Turnier
              </label>
              <input
                type="text"
                value={formData.statistics.tournament || ''}
                onChange={(e) => handleInputChange('statistics', { ...formData.statistics, tournament: e.target.value })}
                placeholder="Halloween Cup 2023"
                className="w-full px-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple"
              />
            </div>
            <div>
              <label className="block text-xs font-pixel text-retro-gray mb-2">
                Platzierung
              </label>
              <input
                type="number"
                value={formData.statistics.position || ''}
                onChange={(e) => handleInputChange('statistics', { ...formData.statistics, position: parseInt(e.target.value) || 0 })}
                placeholder="1"
                className="w-full px-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple"
              />
            </div>
            <div>
              <label className="block text-xs font-pixel text-retro-gray mb-2">
                Teilnehmer
              </label>
              <input
                type="number"
                value={formData.statistics.participants || ''}
                onChange={(e) => handleInputChange('statistics', { ...formData.statistics, participants: parseInt(e.target.value) || 0 })}
                placeholder="64"
                className="w-full px-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple"
              />
            </div>
          </div>
        )

      case HIGHLIGHT_TYPES.TROPHY:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-pixel text-retro-gray mb-2">
                Level
              </label>
              <input
                type="number"
                value={formData.statistics.level || ''}
                onChange={(e) => handleInputChange('statistics', { ...formData.statistics, level: parseInt(e.target.value) || 0 })}
                placeholder="100"
                className="w-full px-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple"
              />
            </div>
            <div>
              <label className="block text-xs font-pixel text-retro-gray mb-2">
                Spielzeit
              </label>
              <input
                type="text"
                value={formData.statistics.playtime || ''}
                onChange={(e) => handleInputChange('statistics', { ...formData.statistics, playtime: e.target.value })}
                placeholder="150h"
                className="w-full px-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple"
              />
            </div>
            <div>
              <label className="block text-xs font-pixel text-retro-gray mb-2">
                Erfolge
              </label>
              <input
                type="number"
                value={formData.statistics.achievements || ''}
                onChange={(e) => handleInputChange('statistics', { ...formData.statistics, achievements: parseInt(e.target.value) || 0 })}
                placeholder="45"
                className="w-full px-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-retro-dark border-2 border-pixel-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-pixel-border">
          <h2 className="text-xl font-retro text-white">
            Neues Highlight hinzufügen
          </h2>
          <button
            onClick={onClose}
            className="text-retro-gray hover:text-white transition-colors duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Plan Info */}
        {userPlan === 'free' && (
          <div className="bg-gradient-to-r from-retro-yellow/20 to-retro-orange/20 border-l-4 border-retro-yellow p-4 mx-6 mt-4">
            <p className="text-sm font-pixel text-retro-yellow">
              Kostenlos: {currentCount}/{maxCount} Highlights
              {currentCount >= maxCount && ' - Limit erreicht!'}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-pixel text-retro-gray mb-2">
                Titel *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Mein bester Speedrun..."
                className={`w-full px-4 py-2 bg-retro-dark border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple ${
                  errors.title ? 'border-retro-red' : 'border-pixel-border'
                }`}
              />
              {errors.title && (
                <p className="text-xs text-retro-red mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-pixel text-retro-gray mb-2">
                Spiel *
              </label>
              <input
                type="text"
                value={formData.game}
                onChange={(e) => handleInputChange('game', e.target.value)}
                placeholder="Donkey Kong 64"
                className={`w-full px-4 py-2 bg-retro-dark border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple ${
                  errors.game ? 'border-retro-red' : 'border-pixel-border'
                }`}
              />
              {errors.game && (
                <p className="text-xs text-retro-red mt-1">{errors.game}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-pixel text-retro-gray mb-2">
              Beschreibung *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Beschreibe dein Highlight..."
              rows={3}
              className={`w-full px-4 py-2 bg-retro-dark border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple resize-none ${
                errors.description ? 'border-retro-red' : 'border-pixel-border'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-retro-red mt-1">{errors.description}</p>
            )}
          </div>

          {/* Type and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-pixel text-retro-gray mb-2">
                Typ
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple"
              >
                <option value={HIGHLIGHT_TYPES.BEST_GAME}>Beste Spielrunde</option>
                <option value={HIGHLIGHT_TYPES.FANART}>Fanart</option>
                <option value={HIGHLIGHT_TYPES.TROPHY}>Trophäe</option>
                <option value={HIGHLIGHT_TYPES.LIVESTREAM}>Livestream</option>
                <option value={HIGHLIGHT_TYPES.SEASON_MILESTONE}>Saison-Meilenstein</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-pixel text-retro-gray mb-2">
                Datum
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple"
              />
            </div>
          </div>

          {/* Statistics */}
          {renderStatisticsFields()}

          {/* Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-pixel text-retro-gray mb-2">
                Bild URL
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-retro-gray" />
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full pl-10 pr-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-pixel text-retro-gray mb-2">
                Video URL
              </label>
              <div className="relative">
                <Play className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-retro-gray" />
                <input
                  type="url"
                  value={formData.video}
                  onChange={(e) => handleInputChange('video', e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full pl-10 pr-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple"
                />
              </div>
            </div>
          </div>

          {errors.media && (
            <p className="text-xs text-retro-red">{errors.media}</p>
          )}

          {/* Privacy */}
          <div>
            <label className="block text-xs font-pixel text-retro-gray mb-2">
              Sichtbarkeit
            </label>
            <select
              value={formData.privacy}
              onChange={(e) => handleInputChange('privacy', e.target.value)}
              className="w-full px-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple"
            >
              <option value={PRIVACY_LEVELS.PUBLIC}>🌍 Öffentlich</option>
              <option value={PRIVACY_LEVELS.FRIENDS}>👥 Nur Freunde</option>
              <option value={PRIVACY_LEVELS.PRIVATE}>🔒 Privat</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-pixel-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-retro-gray hover:text-white transition-colors duration-300 font-pixel"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (userPlan === 'free' && currentCount >= maxCount)}
              className="px-6 py-2 bg-gradient-to-r from-retro-purple to-retro-blue text-white rounded-lg hover:from-retro-blue hover:to-retro-purple transition-all duration-300 font-pixel disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Wird hinzugefügt...' : 'Highlight hinzufügen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddHighlightModal