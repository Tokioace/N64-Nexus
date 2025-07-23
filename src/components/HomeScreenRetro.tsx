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
    <div className="neon-container circuit-pattern scanlines min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="neon-title">
            🎮 <span className="neon-text">Battle64</span>
          </h1>
          <p className="text-slate-300 text-lg neon-blue">
            {t('home.subtitle')}
          </p>
          {user && (
            <p className="neon-orange mt-2">
              {t('home.welcome')}, <span className="neon-text">{user.username}</span>! ({t('profile.level')} {user.level})
            </p>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto neon-grid">
          
          {/* Quiz Tile */}
          <Link to="/quiz" className="neon-tile simple-tile-small holographic">
            <div className="simple-tile-icon">
              <Target className="w-7 h-7 text-purple-400 mx-auto neon-icon" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm neon-text">{t('nav.quiz')}</div>
              <div className="text-xs text-slate-400">{t('home.quiz.subtitle')}</div>
            </div>
          </Link>

          {/* Events Tile */}
          <Link to="/events" className="neon-tile simple-tile-small holographic">
            <div className="simple-tile-icon">
              <Trophy className="w-7 h-7 text-yellow-400 mx-auto neon-icon" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm neon-text">{t('nav.events')}</div>
              <div className="text-xs text-slate-400">{t('home.events.subtitle')}</div>
            </div>
          </Link>

          {/* Speedrun Media Tile */}
          <Link to="/speedrun-media" className="neon-tile simple-tile-small holographic">
            <div className="simple-tile-icon">
              <Camera className="w-7 h-7 text-green-400 mx-auto neon-icon" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm neon-text">{t('nav.media')}</div>
              <div className="text-xs text-slate-400">{t('home.media.subtitle')}</div>
            </div>
          </Link>

          {/* Collector Mode Tile */}
          <Link to="/collector" className="neon-tile simple-tile-small holographic">
            <div className="simple-tile-icon">
              <Package className="w-7 h-7 text-orange-400 mx-auto neon-icon" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm neon-text">{t('nav.collector')}</div>
              <div className="text-xs text-slate-400">{t('home.collector.subtitle')}</div>
            </div>
          </Link>

          {/* Forum Tile */}
          <Link to="/forum" className="neon-tile simple-tile-small holographic">
            <div className="simple-tile-icon">
              <MessageSquare className="w-7 h-7 text-cyan-400 mx-auto neon-icon" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm neon-text">{t('nav.forum')}</div>
              <div className="text-xs text-slate-400">{t('home.forum.subtitle')}</div>
            </div>
          </Link>

          {/* Profile Tile */}
          <Link to="/profile" className="neon-tile simple-tile-small holographic">
            <div className="simple-tile-icon">
              <UsersIcon className="w-7 h-7 text-blue-400 mx-auto neon-icon" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm neon-text">{t('nav.profile')}</div>
              <div className="text-xs text-slate-400">{t('home.profile.subtitle')}</div>
            </div>
          </Link>

          {/* Leaderboard Tile */}
          <Link to="/leaderboard" className="neon-tile simple-tile-small holographic">
            <div className="simple-tile-icon">
              <Star className="w-7 h-7 text-pink-400 mx-auto neon-icon" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm neon-text">{t('nav.leaderboard')}</div>
              <div className="text-xs text-slate-400">{t('home.leaderboard.subtitle')}</div>
            </div>
          </Link>

          {/* Minigames Tile */}
          <Link to="/minigames" className="neon-tile simple-tile-small holographic">
            <div className="simple-tile-icon">
              <Gamepad2 className="w-7 h-7 text-red-400 mx-auto neon-icon" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm neon-text">{t('nav.minigames')}</div>
              <div className="text-xs text-slate-400">{t('home.minigames.subtitle')}</div>
            </div>
          </Link>

          {/* Marketplace Tile */}
          <Link to="/marktplatz" className="neon-tile simple-tile-small holographic">
            <div className="simple-tile-icon">
              <ShoppingCart className="w-7 h-7 text-emerald-400 mx-auto neon-icon" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm neon-text">{t('nav.marketplace')}</div>
              <div className="text-xs text-slate-400">{t('home.marketplace.subtitle')}</div>
            </div>
          </Link>

          {/* Community Tile */}
          <Link to="/community" className="neon-tile simple-tile-small holographic">
            <div className="simple-tile-icon">
              <UsersIcon className="w-7 h-7 text-indigo-400 mx-auto neon-icon" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm neon-text">{t('nav.community')}</div>
              <div className="text-xs text-slate-400">{t('community.subtitle')}</div>
            </div>
          </Link>

          {/* Chat Tile */}
          <Link to="/chat" className="neon-tile simple-tile-small holographic">
            <div className="simple-tile-icon">
              <MessageCircle className="w-7 h-7 text-violet-400 mx-auto neon-icon" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm neon-text">{t('nav.chat')}</div>
              <div className="text-xs text-slate-400">Live Chat</div>
            </div>
          </Link>

          {/* Fanart Tile */}
          <Link to="/fanart" className="neon-tile simple-tile-small holographic">
            <div className="simple-tile-icon">
              <Palette className="w-7 h-7 text-rose-400 mx-auto neon-icon" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm neon-text">{t('nav.fanart')}</div>
              <div className="text-xs text-slate-400">{t('home.fanart.subtitle')}</div>
            </div>
          </Link>

          {/* Newsfeed Tile */}
          <Link to="/newsfeed" className="neon-tile simple-tile-small holographic">
            <div className="simple-tile-icon">
              <Newspaper className="w-7 h-7 text-amber-400 mx-auto neon-icon" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm neon-text">{t('nav.news')}</div>
              <div className="text-xs text-slate-400">{t('home.newsfeed')}</div>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm neon-blue">
            {t('home.footer.retro')} - <span className="neon-orange">{t('home.footer.n64')}</span>
          </p>
          <Link 
            to="/classic" 
            className="neon-button inline-block mt-3"
          >
            📰 <span className="neon-text">{t('home.footer.classic')}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomeScreenRetro