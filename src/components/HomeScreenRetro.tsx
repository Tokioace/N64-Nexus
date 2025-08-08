import React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import {
  Trophy,
  Target,
  Camera,
  Users as UsersIcon,
  User,
  Package,
  MessageSquare,
  ShoppingCart,
  MessageCircle,
  Palette,
  Newspaper,
  BarChart3,
  MapPin
} from 'lucide-react'

const HomeScreenRetro: React.FC = () => {
  const { user } = useUser()
  const { t } = useLanguage()

  return (
    <div className="retro-page container mx-auto px-4 py-6">
      {/* Header with Mascot */}
      <div className="text-center mb-6">
        <div className="battle64-header-container mb-2">
          {/* Mascot Image - Positioned so antennas are just below ranking card */}
          <img 
            src="/mascot.png" 
            alt={t('alt.battle64Mascot')} 
            className="battle64-mascot h-48 sm:h-56 md:h-64 lg:h-80 w-auto object-contain"
            style={{
              marginTop: 'clamp(0.5rem, 1vw, 1rem)' // Reduced margin so antennas show under ranking card
            }}
          />
        </div>
        
        {/* Welcome Back Text */}
        <p className="battle64-welcome-text mt-2">
          {user ? `${t('home.welcome')}, ${user.username}! (${t('profile.level')} ${user.level})` : t('home.welcome')}
        </p>
        
        <p className="typography-body-center mt-4 mb-4">
          {t('home.subtitle')}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 max-w-6xl mx-auto px-2 sm:px-0">
        
        {/* Quiz Tile */}
        <Link to="/quiz" className="simple-tile simple-tile-small mobile-tile-optimized">
          <div className="simple-tile-icon">
            <Target className="w-7 h-7 text-purple-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-text-primary text-sm">{t('nav.quiz')}</div>
            <div className="text-xs text-text-muted">{t('home.quiz.subtitle')}</div>
          </div>
        </Link>

        {/* Events Tile */}
        <Link to="/events" className="simple-tile simple-tile-small mobile-tile-optimized">
          <div className="simple-tile-icon">
            <Trophy className="w-7 h-7 text-yellow-500 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-text-primary text-sm">{t('nav.events')}</div>
            <div className="text-xs text-text-muted">{t('home.events.subtitle')}</div>
          </div>
        </Link>

        {/* Battle64 Map Tile */}
        <Link to="/map" className="simple-tile simple-tile-small mobile-tile-optimized">
          <div className="simple-tile-icon">
            <MapPin className="w-7 h-7 text-yellow-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-text-primary text-sm">{t('nav.map')}</div>
            <div className="text-xs text-text-muted">{t('home.map.subtitle')}</div>
          </div>
        </Link>

        {/* Media Tile */}
        <Link to="/speedrun-media" className="simple-tile simple-tile-small mobile-tile-optimized">
          <div className="simple-tile-icon">
            <Camera className="w-7 h-7 text-blue-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-text-primary text-sm">{t('nav.media')}</div>
            <div className="text-xs text-text-muted">{t('home.media.subtitle')}</div>
          </div>
        </Link>

        {/* Collector Mode Tile */}
        <Link to="/collector" className="simple-tile simple-tile-small mobile-tile-optimized">
          <div className="simple-tile-icon">
            <Package className="w-7 h-7 text-green-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-text-primary text-sm">{t('nav.collector')}</div>
            <div className="text-xs text-text-muted">{t('home.collector.subtitle')}</div>
          </div>
        </Link>

        {/* Forum Tile */}
        <Link to="/forum" className="simple-tile simple-tile-small mobile-tile-optimized">
          <div className="simple-tile-icon">
            <MessageSquare className="w-7 h-7 text-cyan-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-text-primary text-sm">{t('nav.forum')}</div>
            <div className="text-xs text-text-muted">{t('home.forum.subtitle')}</div>
          </div>
        </Link>

        {/* Profile Tile */}
        <Link to="/profile" className="simple-tile simple-tile-small mobile-tile-optimized">
          <div className="simple-tile-icon">
            <User className="w-7 h-7 text-slate-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-text-primary text-sm">{t('nav.profile')}</div>
            <div className="text-xs text-text-muted">{t('home.profile.subtitle')}</div>
          </div>
        </Link>

        {/* Leaderboard Tile */}
        <Link to="/leaderboard" className="simple-tile simple-tile-small mobile-tile-optimized">
          <div className="simple-tile-icon">
            <BarChart3 className="w-7 h-7 text-orange-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-text-primary text-sm">{t('nav.leaderboard')}</div>
            <div className="text-xs text-text-muted">{t('home.leaderboard.subtitle')}</div>
          </div>
        </Link>

        {/* Minigames Tile */}
        <Link to="/minigames" className="simple-tile simple-tile-small mobile-tile-optimized">
          <div className="simple-tile-icon">
            <Target className="w-7 h-7 text-red-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-text-primary text-sm">{t('nav.minigames')}</div>
            <div className="text-xs text-text-muted">{t('home.minigames.subtitle')}</div>
          </div>
        </Link>

        {/* Marketplace Tile */}
        <Link to="/marktplatz" className="simple-tile simple-tile-small mobile-tile-optimized">
          <div className="simple-tile-icon">
            <ShoppingCart className="w-7 h-7 text-emerald-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-text-primary text-sm">{t('nav.marketplace')}</div>
            <div className="text-xs text-text-muted">{t('home.marketplace.subtitle')}</div>
          </div>
        </Link>

        {/* Community Tile */}
        <Link to="/community" className="simple-tile simple-tile-small mobile-tile-optimized">
          <div className="simple-tile-icon">
            <UsersIcon className="w-7 h-7 text-indigo-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-text-primary text-sm">{t('nav.community')}</div>
            <div className="text-xs text-text-muted">{t('community.subtitle')}</div>
          </div>
        </Link>

        {/* Chat Tile */}
        <Link to="/chat" className="simple-tile simple-tile-small mobile-tile-optimized">
          <div className="simple-tile-icon">
            <MessageCircle className="w-7 h-7 text-violet-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-text-primary text-sm">{t('nav.chat')}</div>
            <div className="text-xs text-text-muted">{t('ui.liveChat')}</div>
          </div>
        </Link>

        {/* Fanart Tile */}
        <Link to="/fanart" className="simple-tile simple-tile-small mobile-tile-optimized fanart-tile-soft-red">
          <div className="simple-tile-icon">
            <Palette className="w-7 h-7 text-pink-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-text-primary text-sm">{t('nav.fanart')}</div>
            <div className="text-xs text-text-muted">{t('home.fanart.subtitle')}</div>
          </div>
        </Link>

        {/* Newsfeed Tile */}
        <Link to="/newsfeed" className="simple-tile simple-tile-small mobile-tile-optimized">
          <div className="simple-tile-icon">
            <Newspaper className="w-7 h-7 text-orange-500 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-text-primary text-sm">{t('nav.newsfeed')}</div>
            <div className="text-xs text-text-muted">{t('home.newsfeed.subtitle')}</div>
          </div>
        </Link>

      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-text-muted text-sm">
          {t('home.footer.retro')} - {t('home.footer.n64')}
        </p>
        <Link 
          to="/" 
          className="inline-block mt-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
          style={{
            backgroundColor: 'rgba(30, 144, 255, 0.2)',
            border: '1px solid rgba(30, 144, 255, 0.3)',
            color: '#1E90FF'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(30, 144, 255, 0.3)'
            e.currentTarget.style.color = '#3399FF'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(30, 144, 255, 0.2)'
            e.currentTarget.style.color = '#1E90FF'
          }}
        >
          🏠 Zurück zur Hauptseite
        </Link>
      </div>
    </div>
  )
}

export default HomeScreenRetro