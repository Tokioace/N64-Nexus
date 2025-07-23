import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useEvent } from '../contexts/EventContext'
import { useLanguage } from '../contexts/LanguageContext'
import EventFeedWidget from '../components/EventFeedWidget'
import { GameEvent } from '../types'
import {
  Trophy,
  Target,
  Gamepad2,
  Star,
  Users as UsersIcon,
  Camera,
  Package,
  MessageSquare,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Award,
  TrendingUp,
  ShoppingCart,
  MessageCircle,
  Palette
} from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  content: string
  date: Date
  type: 'event_winner' | 'n64_history' | 'community_news' | 'event_announcement'
}

const HomePage: React.FC = () => {
  const { user } = useUser()
  const { events, activeEvents, getLeaderboard } = useEvent()
  const { t, currentLanguage } = useLanguage()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isNewsExpanded, setIsNewsExpanded] = useState(false)
  const [isEventExpanded, setIsEventExpanded] = useState(false)

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Mock news data
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: t('news.speedrunEvent'),
      content: t('news.speedrunEventContent'),
      date: new Date(Date.now() - 86400000),
      type: 'event_winner'
    },
    {
      id: '2',
      title: t('news.n64History'),
      content: t('news.n64HistoryContent'),
      date: new Date(Date.now() - 172800000),
      type: 'n64_history'
    }
  ]

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(currentLanguage === 'de' ? 'de-DE' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(currentLanguage === 'de' ? 'de-DE' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getActiveEvent = () => {
    return activeEvents.length > 0 ? activeEvents[0] : null
  }

  const getEventTimeRemaining = (event: GameEvent) => {
    const now = new Date()
    const endTime = new Date(event.endDate)
    const timeLeft = endTime.getTime() - now.getTime()
    
    if (timeLeft <= 0) return t('home.ended')
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h verbleibend`
    return `${hours}h verbleibend`
  }

  const activeEvent = getActiveEvent()

  return (
    <div className="container-lg py-responsive space-responsive">
      {/* Welcome Section */}
      <div className="text-center mb-responsive">
        <h1 className="text-responsive-2xl font-bold text-slate-100 mb-4">
          {user ? t('home.welcomeBack', { name: user.username }) : t('home.welcome')}
        </h1>
        <p className="text-responsive-base text-slate-400 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
        <div className="mt-4 text-responsive-sm text-slate-500">
          {formatDate(currentTime)} • {formatTime(currentTime)}
        </div>
      </div>

      {/* Stats Overview */}
      {user && (
        <div className="grid grid-responsive grid-1-2-4 mb-responsive">
          <div className="simple-tile text-center">
            <div className="simple-tile-icon">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
            </div>
            <div className="text-responsive-lg font-bold text-slate-100">{user.level}</div>
            <div className="text-responsive-xs text-slate-400">{t('profile.level')}</div>
          </div>
          
          <div className="simple-tile text-center">
            <div className="simple-tile-icon">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <div className="text-responsive-lg font-bold text-slate-100">{user.xp}</div>
            <div className="text-responsive-xs text-slate-400">XP</div>
          </div>
          
          <div className="simple-tile text-center">
            <div className="simple-tile-icon">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
            </div>
            <div className="text-responsive-lg font-bold text-slate-100">
              {user.collections.filter(c => !c.isWishlist).length}
            </div>
            <div className="text-responsive-xs text-slate-400">{t('collector.items')}</div>
          </div>
          
          <div className="simple-tile text-center">
            <div className="simple-tile-icon">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
            </div>
            <div className="text-responsive-lg font-bold text-slate-100">
              {user.personalRecords.filter(r => r.verified).length}
            </div>
            <div className="text-responsive-xs text-slate-400">{t('profile.records')}</div>
          </div>
        </div>
      )}

      {/* News and Events Section */}
      <div className="grid grid-responsive grid-1-3 gap-responsive mb-responsive">
        
        {/* News Section */}
        <div className="lg:col-span-2">
          <div className="simple-tile">
            <div className="simple-tile-header">
              <div className="mobile-stack items-center justify-between">
                <h2 className="text-responsive-lg font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  {t('home.news')}
                </h2>
                <button
                  onClick={() => setIsNewsExpanded(!isNewsExpanded)}
                  className="btn-secondary btn-sm mobile-full sm:mobile-full lg:w-auto"
                >
                  {isNewsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span className="ml-2">{isNewsExpanded ? t('common.collapse') : t('common.expand')}</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {newsItems.slice(0, isNewsExpanded ? newsItems.length : 2).map((item) => (
                <div key={item.id} className="border-l-4 border-blue-400 pl-4 py-2">
                  <h3 className="text-responsive-base font-semibold text-slate-100 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-responsive-sm text-slate-400 mb-2">
                    {item.content}
                  </p>
                  <div className="text-responsive-xs text-slate-500">
                    {item.date.toLocaleDateString(currentLanguage === 'de' ? 'de-DE' : 'en-US')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Events Section */}
        {activeEvents.length > 0 ? (
          <div className="n64-tile n64-tile-large bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-l-4 border-green-400">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              <h2 className="text-responsive-lg font-bold text-slate-100">{t('home.liveEvents')}</h2>
            </div>
            <div className="space-y-3">
              {activeEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="bg-slate-700/30 rounded-lg p-3">
                  <h3 className="text-responsive-sm font-semibold text-slate-100 mb-1">
                    {event.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-responsive-xs text-slate-400">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{new Date(event.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link 
              to="/events" 
              className="inline-block mt-4 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-responsive-sm mobile-full text-center"
            >
              {t('events.viewAll')}
            </Link>
          </div>
        ) : (
          <div className="n64-tile n64-tile-large bg-gradient-to-br from-red-600/20 to-pink-600/20 border-l-4 border-red-400">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
              <h2 className="text-responsive-lg font-bold text-slate-100">{t('home.liveEvents')}</h2>
            </div>
            <div className="text-center py-4 sm:py-8">
              <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-responsive-sm text-slate-400 mb-4">{t('events.noActive')}</p>
              <Link 
                to="/events" 
                className="inline-block px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-responsive-sm mobile-full text-center"
              >
                {t('events.viewAll')}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-responsive grid-2-4 gap-responsive max-w-6xl mx-auto">
        
        {/* Quiz Tile */}
        <Link to="/quiz" className="n64-tile n64-tile-small bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-l-4 border-purple-400">
          <div className="text-center">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-responsive-sm">{t('nav.quiz')}</div>
            <div className="text-responsive-xs text-slate-400 mobile-hidden">{t('home.quiz.description')}</div>
          </div>
        </Link>

        {/* Events Tile */}
        <Link to="/events" className="n64-tile n64-tile-small bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-l-4 border-yellow-400">
          <div className="text-center">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-responsive-sm">{t('nav.events')}</div>
            <div className="text-responsive-xs text-slate-400 mobile-hidden">{t('home.events.description')}</div>
          </div>
        </Link>

        {/* Speedrun Media Tile */}
        <Link to="/speedrun-media" className="n64-tile n64-tile-small bg-gradient-to-br from-green-600/20 to-green-800/20 border-l-4 border-green-400">
          <div className="text-center">
            <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-responsive-sm">{t('nav.media')}</div>
            <div className="text-responsive-xs text-slate-400 mobile-hidden">{t('home.media.description')}</div>
          </div>
        </Link>

        {/* Collector Mode Tile */}
        <Link to="/collector" className="n64-tile n64-tile-small bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-l-4 border-orange-400">
          <div className="text-center">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-responsive-sm">{t('nav.collector')}</div>
            <div className="text-responsive-xs text-slate-400 mobile-hidden">{t('home.collector.description')}</div>
          </div>
        </Link>

        {/* Forum Tile */}
        <Link to="/forum" className="n64-tile n64-tile-small bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border-l-4 border-cyan-400">
          <div className="text-center">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-responsive-sm">{t('nav.forum')}</div>
            <div className="text-responsive-xs text-slate-400 mobile-hidden">{t('home.forum.subtitle')}</div>
          </div>
        </Link>

        {/* Profile Tile */}
        <Link to="/profile" className="n64-tile n64-tile-small bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-l-4 border-blue-400">
          <div className="text-center">
            <UsersIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-responsive-sm">{t('nav.profile')}</div>
            <div className="text-responsive-xs text-slate-400 mobile-hidden">{t('home.profile.subtitle')}</div>
          </div>
        </Link>

        {/* Leaderboard Tile */}
        <Link to="/leaderboard" className="n64-tile n64-tile-small bg-gradient-to-br from-pink-600/20 to-pink-800/20 border-l-4 border-pink-400">
          <div className="text-center">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-responsive-sm">{t('nav.leaderboard')}</div>
            <div className="text-responsive-xs text-slate-400 mobile-hidden">{t('home.leaderboard.subtitle')}</div>
          </div>
        </Link>

        {/* Minigames Tile */}
        <Link to="/minigames" className="n64-tile n64-tile-small bg-gradient-to-br from-red-600/20 to-red-800/20 border-l-4 border-red-400">
          <div className="text-center">
            <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-responsive-sm">{t('nav.minigames')}</div>
            <div className="text-responsive-xs text-slate-400 mobile-hidden">{t('home.minigames.description')}</div>
          </div>
        </Link>

        {/* Marketplace Tile */}
        <Link to="/marktplatz" className="n64-tile n64-tile-small bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border-l-4 border-emerald-400">
          <div className="text-center">
            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-responsive-sm">{t('nav.marketplace')}</div>
            <div className="text-responsive-xs text-slate-400 mobile-hidden">{t('home.marketplace.subtitle')}</div>
          </div>
        </Link>

        {/* Community Tile */}
        <Link to="/community" className="n64-tile n64-tile-small bg-gradient-to-br from-indigo-600/20 to-indigo-800/20 border-l-4 border-indigo-400">
          <div className="text-center">
            <UsersIcon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-responsive-sm">{t('nav.community')}</div>
            <div className="text-responsive-xs text-slate-400 mobile-hidden">{t('community.subtitle')}</div>
          </div>
        </Link>

        {/* Chat Tile */}
        <Link to="/chat" className="n64-tile n64-tile-small bg-gradient-to-br from-violet-600/20 to-violet-800/20 border-l-4 border-violet-400">
          <div className="text-center">
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-violet-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-responsive-sm">{t('nav.chat')}</div>
            <div className="text-responsive-xs text-slate-400 mobile-hidden">Live Chat</div>
          </div>
        </Link>

        {/* Fanart Tile */}
        <Link to="/fanart" className="n64-tile n64-tile-small bg-gradient-to-br from-rose-600/20 to-rose-800/20 border-l-4 border-rose-400">
          <div className="text-center">
            <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-responsive-sm">{t('nav.fanart')}</div>
            <div className="text-responsive-xs text-slate-400 mobile-hidden">{t('home.fanart.subtitle')}</div>
          </div>
        </Link>

      </div>

      {/* Footer */}
      <div className="text-center mt-responsive">
        <p className="text-responsive-sm text-slate-400">
          {t('home.footer.tagline')}
        </p>
        <Link 
          to="/" 
          className="inline-block mt-4 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors text-responsive-sm text-slate-300 mobile-full"
        >
          🎮 Zur Retro-Ansicht
        </Link>
      </div>
    </div>
  )
}

export default HomePage