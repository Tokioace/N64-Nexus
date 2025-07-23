import React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import {
  Trophy,
  Target,
  Gamepad2,
  Star,
  Users as UsersIcon,
  Camera,
  Package,
  MessageSquare,
  ShoppingCart,
  MessageCircle,
  Palette,
  Newspaper
} from 'lucide-react'

const HomeScreenRetro: React.FC = () => {
  const { user, isAuthenticated } = useUser()
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">
          🎮 Battle64
        </h1>
        <p className="text-slate-400 text-lg">
          {t('home.subtitle')}
        </p>
        {user && (
          <p className="text-blue-400 mt-2">
            {t('home.welcome')}, {user.username}! ({t('profile.level')} {user.level})
          </p>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        
        {/* Quiz Tile */}
        <Link to="/quiz" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <Target className="w-7 h-7 text-purple-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">{t('nav.quiz')}</div>
            <div className="text-xs text-slate-400">{t('home.quiz.subtitle')}</div>
          </div>
        </Link>

        {/* Events Tile */}
        <Link to="/events" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <Trophy className="w-7 h-7 text-yellow-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">{t('nav.events')}</div>
            <div className="text-xs text-slate-400">{t('home.events.subtitle')}</div>
          </div>
        </Link>

        {/* Speedrun Media Tile */}
        <Link to="/speedrun-media" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <Camera className="w-7 h-7 text-green-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">{t('nav.media')}</div>
            <div className="text-xs text-slate-400">{t('home.media.subtitle')}</div>
          </div>
        </Link>

        {/* Collector Mode Tile */}
        <Link to="/collector" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <Package className="w-7 h-7 text-orange-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">{t('nav.collector')}</div>
            <div className="text-xs text-slate-400">{t('home.collector.subtitle')}</div>
          </div>
        </Link>

        {/* Forum Tile */}
        <Link to="/forum" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <MessageSquare className="w-7 h-7 text-cyan-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">{t('nav.forum')}</div>
            <div className="text-xs text-slate-400">{t('home.forum.subtitle')}</div>
          </div>
        </Link>

        {/* Profile Tile */}
        <Link to="/profile" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <UsersIcon className="w-7 h-7 text-blue-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">{t('nav.profile')}</div>
            <div className="text-xs text-slate-400">{t('home.profile.subtitle')}</div>
          </div>
        </Link>

        {/* Leaderboard Tile */}
        <Link to="/leaderboard" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <Star className="w-7 h-7 text-pink-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">{t('nav.leaderboard')}</div>
            <div className="text-xs text-slate-400">{t('home.leaderboard.subtitle')}</div>
          </div>
        </Link>

        {/* Minigames Tile */}
        <Link to="/minigames" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <Gamepad2 className="w-7 h-7 text-red-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">{t('nav.minigames')}</div>
            <div className="text-xs text-slate-400">{t('home.minigames.subtitle')}</div>
          </div>
        </Link>

        {/* Marketplace Tile */}
        <Link to="/marktplatz" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <ShoppingCart className="w-7 h-7 text-emerald-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">{t('nav.marketplace')}</div>
            <div className="text-xs text-slate-400">{t('home.marketplace.subtitle')}</div>
          </div>
        </Link>

        {/* Community Tile */}
        <Link to="/community" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <UsersIcon className="w-7 h-7 text-indigo-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">{t('nav.community')}</div>
            <div className="text-xs text-slate-400">{t('community.subtitle')}</div>
          </div>
        </Link>

        {/* Chat Tile */}
        <Link to="/chat" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <MessageCircle className="w-7 h-7 text-violet-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">{t('nav.chat')}</div>
            <div className="text-xs text-slate-400">Live Chat</div>
          </div>
        </Link>

        {/* Fanart Tile */}
        <Link to="/fanart" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <Palette className="w-7 h-7 text-rose-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">{t('nav.fanart')}</div>
            <div className="text-xs text-slate-400">{t('home.fanart.subtitle')}</div>
          </div>
        </Link>

        {/* Newsfeed Tile */}
        <Link to="/newsfeed" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <Newspaper className="w-7 h-7 text-amber-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">{t('nav.news')}</div>
            <div className="text-xs text-slate-400">{t('home.newsfeed')}</div>
          </div>
        </Link>

      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-slate-400 text-sm">
          {t('home.footer.retro')} - {t('home.footer.n64')}
        </p>
        <Link 
          to="/" 
          className="inline-block mt-3 px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 
                     border border-blue-500/30 text-blue-400 hover:text-blue-300 
                     transition-all duration-200 text-sm font-medium"
        >
          📰 {t('home.footer.classic')}
        </Link>
      </div>
    </div>
  )
}

export default HomeScreenRetro