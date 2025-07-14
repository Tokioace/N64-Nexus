import React from 'react'
import { useHighlights, HIGHLIGHT_TYPES } from '../context/HighlightContext'
import { Trophy, Star, Calendar, Gamepad2, Crown, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

function Profile() {
  const { highlights, userPlan } = useHighlights()

  const pinnedHighlight = highlights.find(h => h.isPinned)
  const favoriteHighlights = highlights.filter(h => h.isFavorite)
  const totalHighlights = highlights.length

  // Calculate stats
  const stats = {
    total: totalHighlights,
    favorites: favoriteHighlights.length,
    types: {
      [HIGHLIGHT_TYPES.BEST_GAME]: highlights.filter(h => h.type === HIGHLIGHT_TYPES.BEST_GAME).length,
      [HIGHLIGHT_TYPES.FANART]: highlights.filter(h => h.type === HIGHLIGHT_TYPES.FANART).length,
      [HIGHLIGHT_TYPES.TROPHY]: highlights.filter(h => h.type === HIGHLIGHT_TYPES.TROPHY).length,
      [HIGHLIGHT_TYPES.LIVESTREAM]: highlights.filter(h => h.type === HIGHLIGHT_TYPES.LIVESTREAM).length,
      [HIGHLIGHT_TYPES.SEASON_MILESTONE]: highlights.filter(h => h.type === HIGHLIGHT_TYPES.SEASON_MILESTONE).length,
    },
    games: [...new Set(highlights.map(h => h.game))].length,
    public: highlights.filter(h => h.privacy === 'public').length,
    private: highlights.filter(h => h.privacy === 'private').length,
    friends: highlights.filter(h => h.privacy === 'friends').length
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case HIGHLIGHT_TYPES.BEST_GAME:
        return <Trophy className="w-4 h-4" />
      case HIGHLIGHT_TYPES.FANART:
        return <Gamepad2 className="w-4 h-4" />
      case HIGHLIGHT_TYPES.LIVESTREAM:
        return <TrendingUp className="w-4 h-4" />
      case HIGHLIGHT_TYPES.SEASON_MILESTONE:
        return <Crown className="w-4 h-4" />
      default:
        return <Trophy className="w-4 h-4" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case HIGHLIGHT_TYPES.BEST_GAME:
        return 'text-retro-blue'
      case HIGHLIGHT_TYPES.FANART:
        return 'text-retro-green'
      case HIGHLIGHT_TYPES.LIVESTREAM:
        return 'text-retro-purple'
      case HIGHLIGHT_TYPES.SEASON_MILESTONE:
        return 'text-retro-yellow'
      default:
        return 'text-retro-gray'
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case HIGHLIGHT_TYPES.BEST_GAME:
        return 'Beste Runden'
      case HIGHLIGHT_TYPES.FANART:
        return 'Fanart'
      case HIGHLIGHT_TYPES.LIVESTREAM:
        return 'Livestreams'
      case HIGHLIGHT_TYPES.SEASON_MILESTONE:
        return 'Meilensteine'
      default:
        return 'Trophäen'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-retro text-white text-shadow mb-2">
          Mein Profil
        </h1>
        <p className="text-retro-gray font-pixel">
          Battle64 Highlight Archiv
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="retro-card p-6 text-center">
          <div className="text-3xl font-retro text-retro-purple mb-2">
            {stats.total}
          </div>
          <div className="text-sm font-pixel text-retro-gray">
            Highlights
          </div>
        </div>
        
        <div className="retro-card p-6 text-center">
          <div className="text-3xl font-retro text-retro-yellow mb-2">
            {stats.favorites}
          </div>
          <div className="text-sm font-pixel text-retro-gray">
            Favoriten
          </div>
        </div>
        
        <div className="retro-card p-6 text-center">
          <div className="text-3xl font-retro text-retro-green mb-2">
            {stats.games}
          </div>
          <div className="text-sm font-pixel text-retro-gray">
            Spiele
          </div>
        </div>
        
        <div className="retro-card p-6 text-center">
          <div className="text-3xl font-retro text-retro-blue mb-2">
            {stats.public}
          </div>
          <div className="text-sm font-pixel text-retro-gray">
            Öffentlich
          </div>
        </div>
      </div>

      {/* Pinned Highlight Showcase */}
      {pinnedHighlight && (
        <div className="retro-card p-6">
          <h2 className="text-xl font-retro text-retro-yellow mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Angepinntes Highlight
          </h2>
          <div className="bg-retro-dark rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-retro-purple to-retro-blue flex items-center justify-center">
                <img 
                  src={pinnedHighlight.image} 
                  alt={pinnedHighlight.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-retro text-white text-lg">
                  {pinnedHighlight.title}
                </h3>
                <p className="text-retro-gray font-pixel text-sm">
                  {pinnedHighlight.game} • {format(new Date(pinnedHighlight.date), 'dd.MM.yyyy', { locale: de })}
                </p>
                <p className="text-retro-gray font-pixel text-sm mt-1">
                  {pinnedHighlight.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Type Breakdown */}
      <div className="retro-card p-6">
        <h2 className="text-xl font-retro text-white mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Highlight-Typen
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats.types).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between p-3 bg-retro-dark rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`${getTypeColor(type)}`}>
                  {getTypeIcon(type)}
                </div>
                <span className="font-pixel text-white">
                  {getTypeLabel(type)}
                </span>
              </div>
              <span className="text-lg font-retro text-retro-purple">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Breakdown */}
      <div className="retro-card p-6">
        <h2 className="text-xl font-retro text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Sichtbarkeit
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-retro-dark rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🌍</span>
              <span className="font-pixel text-white">Öffentlich</span>
            </div>
            <span className="text-lg font-retro text-retro-green">
              {stats.public}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-retro-dark rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">👥</span>
              <span className="font-pixel text-white">Nur Freunde</span>
            </div>
            <span className="text-lg font-retro text-retro-blue">
              {stats.friends}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-retro-dark rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔒</span>
              <span className="font-pixel text-white">Privat</span>
            </div>
            <span className="text-lg font-retro text-retro-gray">
              {stats.private}
            </span>
          </div>
        </div>
      </div>

      {/* Plan Status */}
      <div className="retro-card p-6">
        <h2 className="text-xl font-retro text-white mb-4">
          Account Status
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-retro text-white">
              {userPlan === 'premium' ? 'Premium Account' : 'Kostenloser Account'}
            </h3>
            <p className="text-retro-gray font-pixel text-sm">
              {userPlan === 'premium' 
                ? 'Unbegrenzte Highlights, Video-Unterstützung, Cloud-Backup'
                : `${totalHighlights}/10 Highlights verfügbar`
              }
            </p>
          </div>
          {userPlan === 'free' && (
            <button className="px-4 py-2 bg-gradient-to-r from-retro-purple to-retro-blue text-white rounded-lg hover:from-retro-blue hover:to-retro-purple transition-all duration-300 font-pixel">
              Upgrade auf Premium
            </button>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="retro-card p-6">
        <h2 className="text-xl font-retro text-white mb-4">
          Letzte Aktivität
        </h2>
        <div className="space-y-3">
          {highlights
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(highlight => (
              <div key={highlight.id} className="flex items-center space-x-3 p-3 bg-retro-dark rounded-lg">
                <div className={`p-2 rounded-lg ${getTypeColor(highlight.type)}`}>
                  {getTypeIcon(highlight.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-pixel text-white">
                    {highlight.title}
                  </h4>
                  <p className="text-xs font-pixel text-retro-gray">
                    {highlight.game} • {format(new Date(highlight.date), 'dd.MM.yyyy', { locale: de })}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Profile