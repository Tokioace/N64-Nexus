import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useEvent } from '../contexts/EventContext'
import { useLanguage } from '../contexts/LanguageContext'
import EventFeedWidget from '../components/EventFeedWidget'
import PointsWidget from '../components/PointsWidget'
import N64FanLeaderboard from '../components/N64FanLeaderboard'
import SingleNewsCard from '../components/SingleNewsCard'
import SingleForumCard from '../components/SingleForumCard'
import SingleFanArtCard from '../components/SingleFanArtCard'
import SingleMediaCard from '../components/SingleMediaCard'
import SingleRecordCard from '../components/SingleRecordCard'
import SingleMarketplaceCard from '../components/SingleMarketplaceCard'
import { GameEvent } from '../types'
import {
  Trophy,
  TrendingUp,
  MessageSquare,
  Palette,
  Camera,
  Award,
  ShoppingCart,
  Clock,
  User,
  Eye,
  Heart,
  Star,
  Gamepad2
} from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  content: string
  date: Date
  type: 'event_winner' | 'n64_history' | 'community_news' | 'event_announcement'
}

interface ForumThread {
  id: string
  title: string
  author: string
  replies: number
  lastActivity: Date
  category: string
}

interface FanArtItem {
  id: string
  title: string
  artist: string
  imageUrl: string
  likes: number
  views: number
  game: string
}

interface MediaItem {
  id: string
  title: string
  uploader: string
  type: 'video' | 'screenshot' | 'stream'
  thumbnailUrl: string
  uploadDate: Date
  views: number
}

interface RecordItem {
  id: string
  game: string
  track: string
  time: string
  username: string
  date: Date
  verified: boolean
}

interface MarketplaceItem {
  id: string
  title: string
  price: number
  currency: string
  seller: string
  condition: string
  imageUrl: string
  createdAt: Date
}

const HomePage: React.FC = () => {
  const { user } = useUser()
  const { events, activeEvents, getLeaderboard } = useEvent()
  const { t, currentLanguage } = useLanguage()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isEventExpanded, setIsEventExpanded] = useState(false)

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Mock data for demonstration - in real app this would come from API/context
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: '🏆 Mario Kart 64 Speedrun Weltrekord gebrochen!',
      content: 'SpeedDemon64 hat einen neuen Weltrekord in Wario Stadium mit einer Zeit von 1:42.33 aufgestellt!',
      date: new Date(Date.now() - 3600000),
      type: 'event_winner'
    },
    {
      id: '2',
      title: '🎮 N64 Controller Update verfügbar',
      content: 'Die Battle64 App unterstützt jetzt präzisere Controller-Eingaben für bessere Speedrun-Aufzeichnungen.',
      date: new Date(Date.now() - 7200000),
      type: 'community_news'
    },
    {
      id: '3',
      title: '📺 Live Event: GoldenEye 007 Tournament',
      content: 'Das GoldenEye 007 Facility Tournament läuft gerade! Sieh dir die besten Spieler live an.',
      date: new Date(Date.now() - 1800000),
      type: 'event_announcement'
    },
    {
      id: '4',
      title: '🎯 N64 Sammler-Feature erweitert',
      content: 'Wir haben unser Bewertungssystem für seltene N64-Spiele erweitert. Jetzt mit Preisvergleich!',
      date: new Date(Date.now() - 86400000),
      type: 'n64_history'
    },
    {
      id: '5',
      title: '🏁 Super Mario 64 120-Star Challenge',
      content: 'Die Gewinner des 120-Star Challenge stehen fest! ProGamer_MK hat mit 1:37:42 gewonnen.',
      date: new Date(Date.now() - 172800000),
      type: 'event_winner'
    },
    {
      id: '6',
      title: '🚀 Battle64 App Update 2.1',
      content: 'Neue Features: Verbesserte Leaderboards, erweiterte Statistiken und optimierte Performance.',
      date: new Date(Date.now() - 259200000),
      type: 'community_news'
    },
    {
      id: '7',
      title: '🎪 Retro Gaming Convention angekündigt',
      content: 'Die größte N64 Convention des Jahres findet im November statt. Tickets ab sofort verfügbar!',
      date: new Date(Date.now() - 345600000),
      type: 'event_announcement'
    },
    {
      id: '8',
      title: '🔥 Neue Speedrun Kategorie: Any%',
      content: 'Wir haben eine neue Any% Kategorie für Banjo-Kazooie hinzugefügt. Jetzt mitmachen!',
      date: new Date(Date.now() - 432000000),
      type: 'n64_history'
    },
    {
      id: '9',
      title: '🏆 Monthly Challenge Gewinner',
      content: 'Herzlichen Glückwunsch an N64Master für den Sieg im Oktober Monthly Challenge!',
      date: new Date(Date.now() - 518400000),
      type: 'event_winner'
    },
    {
      id: '10',
      title: '📊 Community Statistiken veröffentlicht',
      content: 'Über 50.000 registrierte Speedrunner und mehr als 1 Million aufgezeichnete Runs!',
      date: new Date(Date.now() - 604800000),
      type: 'community_news'
    }
  ]

  const forumThreads: ForumThread[] = [
    { id: '1', title: 'Bester N64 Controller für Speedruns?', author: 'SpeedRunner123', replies: 23, lastActivity: new Date(Date.now() - 1800000), category: 'Hardware' },
    { id: '2', title: 'Mario Kart 64: Neue Shortcuts entdeckt!', author: 'MKExplorer', replies: 45, lastActivity: new Date(Date.now() - 3600000), category: 'Glitches' },
    { id: '3', title: 'OoT Randomizer Tournament Anmeldung', author: 'ZeldaFan64', replies: 67, lastActivity: new Date(Date.now() - 7200000), category: 'Events' },
    { id: '4', title: 'Perfekte Dark Strategie Guide', author: 'PerfectAgent', replies: 12, lastActivity: new Date(Date.now() - 10800000), category: 'Guides' },
    { id: '5', title: 'N64 Emulator vs Original Hardware', author: 'RetroGamer', replies: 89, lastActivity: new Date(Date.now() - 14400000), category: 'Diskussion' },
    { id: '6', title: 'Super Mario 64 BLJ Tutorial', author: 'BLJMaster', replies: 34, lastActivity: new Date(Date.now() - 18000000), category: 'Tutorials' },
    { id: '7', title: 'Banjo-Kazooie 100% Route optimiert', author: 'BearBirdRunner', replies: 56, lastActivity: new Date(Date.now() - 21600000), category: 'Routen' },
    { id: '8', title: 'Goldeneye 007 Facility unter 1:00?', author: 'SecretAgent', replies: 78, lastActivity: new Date(Date.now() - 25200000), category: 'Challenges' },
    { id: '9', title: 'N64 Sammlung: Seltene Spiele bewerten', author: 'Collector64', replies: 23, lastActivity: new Date(Date.now() - 28800000), category: 'Sammeln' },
    { id: '10', title: 'Paper Mario Speedrun Tipps', author: 'PaperSpeedster', replies: 41, lastActivity: new Date(Date.now() - 32400000), category: 'Tipps' }
  ]

  const fanArtItems: FanArtItem[] = [
    { id: '1', title: 'Mario in Peach\'s Castle', artist: 'PixelArtist64', imageUrl: '/api/placeholder/200/150', likes: 234, views: 1250, game: 'Super Mario 64' },
    { id: '2', title: 'Link vs Ganondorf Epic Battle', artist: 'ZeldaDrawer', imageUrl: '/api/placeholder/200/150', likes: 189, views: 980, game: 'Ocarina of Time' },
    { id: '3', title: 'Banjo & Kazooie Adventure', artist: 'RetroSketch', imageUrl: '/api/placeholder/200/150', likes: 156, views: 750, game: 'Banjo-Kazooie' },
    { id: '4', title: 'Rainbow Road Nostalgia', artist: 'KartArtist', imageUrl: '/api/placeholder/200/150', likes: 298, views: 1400, game: 'Mario Kart 64' },
    { id: '5', title: 'GoldenEye 007 Facility Map', artist: 'SpyArtist', imageUrl: '/api/placeholder/200/150', likes: 167, views: 890, game: 'GoldenEye 007' },
    { id: '6', title: 'Diddy Kong Racing Team', artist: 'RareArtFan', imageUrl: '/api/placeholder/200/150', likes: 134, views: 620, game: 'Diddy Kong Racing' },
    { id: '7', title: 'Star Fox 64 Arwing Squadron', artist: 'SpaceArtist', imageUrl: '/api/placeholder/200/150', likes: 201, views: 1100, game: 'Star Fox 64' },
    { id: '8', title: 'Smash Bros N64 All Stars', artist: 'FighterArt', imageUrl: '/api/placeholder/200/150', likes: 345, views: 1800, game: 'Super Smash Bros' },
    { id: '9', title: 'Yoshi\'s Story Cute Style', artist: 'YoshiLover', imageUrl: '/api/placeholder/200/150', likes: 123, views: 560, game: 'Yoshi\'s Story' },
    { id: '10', title: 'F-Zero X Speed Demon', artist: 'RacingArt64', imageUrl: '/api/placeholder/200/150', likes: 178, views: 820, game: 'F-Zero X' }
  ]

  const mediaItems: MediaItem[] = [
    { id: '1', title: 'Mario 64 16 Star WR Run', uploader: 'SpeedDemon64', type: 'video', thumbnailUrl: '/api/placeholder/200/150', uploadDate: new Date(Date.now() - 3600000), views: 5430 },
    { id: '2', title: 'OoT Any% New PB!', uploader: 'ZeldaRunner', type: 'video', thumbnailUrl: '/api/placeholder/200/150', uploadDate: new Date(Date.now() - 7200000), views: 3210 },
    { id: '3', title: 'Perfect Dark Agent Speedrun', uploader: 'SecretRunner', type: 'video', thumbnailUrl: '/api/placeholder/200/150', uploadDate: new Date(Date.now() - 10800000), views: 2890 },
    { id: '4', title: 'Mario Kart 64 Epic Comeback', uploader: 'KartMaster', type: 'screenshot', thumbnailUrl: '/api/placeholder/200/150', uploadDate: new Date(Date.now() - 14400000), views: 1560 },
    { id: '5', title: 'Live: GoldenEye Tournament', uploader: 'EventStream', type: 'stream', thumbnailUrl: '/api/placeholder/200/150', uploadDate: new Date(Date.now() - 18000000), views: 8920 },
    { id: '6', title: 'Banjo-Kazooie 100% Completion', uploader: 'BearRunner', type: 'video', thumbnailUrl: '/api/placeholder/200/150', uploadDate: new Date(Date.now() - 21600000), views: 4560 },
    { id: '7', title: 'Smash Bros Combo Video', uploader: 'ComboKing', type: 'video', thumbnailUrl: '/api/placeholder/200/150', uploadDate: new Date(Date.now() - 25200000), views: 6780 },
    { id: '8', title: 'Star Fox 64 Expert Mode', uploader: 'StarPilot', type: 'video', thumbnailUrl: '/api/placeholder/200/150', uploadDate: new Date(Date.now() - 28800000), views: 2340 },
    { id: '9', title: 'Paper Mario Glitchless Run', uploader: 'PaperSpeedster', type: 'video', thumbnailUrl: '/api/placeholder/200/150', uploadDate: new Date(Date.now() - 32400000), views: 3450 },
    { id: '10', title: 'Diddy Kong Racing Screenshot', uploader: 'RacingFan', type: 'screenshot', thumbnailUrl: '/api/placeholder/200/150', uploadDate: new Date(Date.now() - 36000000), views: 1230 }
  ]

  const recordItems: RecordItem[] = [
    { id: '1', game: 'Super Mario 64', track: '16 Star', time: '15:42.33', username: 'SpeedDemon64', date: new Date(Date.now() - 3600000), verified: true },
    { id: '2', game: 'Mario Kart 64', track: 'Rainbow Road', time: '6:14.82', username: 'RainbowMaster', date: new Date(Date.now() - 7200000), verified: true },
    { id: '3', game: 'GoldenEye 007', track: 'Facility Agent', time: '0:58.91', username: 'SecretAgent007', date: new Date(Date.now() - 10800000), verified: true },
    { id: '4', game: 'Ocarina of Time', track: 'Any%', time: '16:58.12', username: 'ZeldaSpeedster', date: new Date(Date.now() - 14400000), verified: true },
    { id: '5', game: 'Perfect Dark', track: 'DataDyne Central', time: '1:23.45', username: 'PerfectRunner', date: new Date(Date.now() - 18000000), verified: true },
    { id: '6', game: 'Banjo-Kazooie', track: '100%', time: '2:03:45.67', username: 'BearBirdPro', date: new Date(Date.now() - 21600000), verified: true },
    { id: '7', game: 'Star Fox 64', track: 'Expert Mode', time: '23:12.89', username: 'StarWingAce', date: new Date(Date.now() - 25200000), verified: true },
    { id: '8', game: 'Super Smash Bros', track: '1P Mode Very Hard', time: '7:45.23', username: 'SmashChampion', date: new Date(Date.now() - 28800000), verified: true },
    { id: '9', game: 'F-Zero X', track: 'Death Race', time: '1:34.56', username: 'SpeedRacer64', date: new Date(Date.now() - 32400000), verified: true },
    { id: '10', game: 'Paper Mario', track: 'Any%', time: '3:12:34.78', username: 'PaperSpeedRun', date: new Date(Date.now() - 36000000), verified: true }
  ]

  const marketplaceItems: MarketplaceItem[] = [
    { id: '1', title: 'Super Mario 64 - Mint Condition', price: 89.99, currency: 'EUR', seller: 'RetroCollector', condition: 'Mint', imageUrl: '/api/placeholder/200/150', createdAt: new Date(Date.now() - 3600000) },
    { id: '2', title: 'N64 Controller - Original Nintendo', price: 34.50, currency: 'EUR', seller: 'ControllerKing', condition: 'Very Good', imageUrl: '/api/placeholder/200/150', createdAt: new Date(Date.now() - 7200000) },
    { id: '3', title: 'GoldenEye 007 - Complete in Box', price: 125.00, currency: 'EUR', seller: 'GameVault', condition: 'Good', imageUrl: '/api/placeholder/200/150', createdAt: new Date(Date.now() - 10800000) },
    { id: '4', title: 'Ocarina of Time - Gold Cartridge', price: 199.99, currency: 'EUR', seller: 'ZeldaFanatic', condition: 'Mint', imageUrl: '/api/placeholder/200/150', createdAt: new Date(Date.now() - 14400000) },
    { id: '5', title: 'N64 Console - Jungle Green', price: 149.99, currency: 'EUR', seller: 'ConsoleDealer', condition: 'Very Good', imageUrl: '/api/placeholder/200/150', createdAt: new Date(Date.now() - 18000000) },
    { id: '6', title: 'Mario Kart 64 - Player\'s Choice', price: 45.00, currency: 'EUR', seller: 'KartCollector', condition: 'Good', imageUrl: '/api/placeholder/200/150', createdAt: new Date(Date.now() - 21600000) },
    { id: '7', title: 'Perfect Dark - Big Box Edition', price: 89.50, currency: 'EUR', seller: 'RareGameHunter', condition: 'Very Good', imageUrl: '/api/placeholder/200/150', createdAt: new Date(Date.now() - 25200000) },
    { id: '8', title: 'Banjo-Kazooie - Manual included', price: 67.99, currency: 'EUR', seller: 'ManualMaster', condition: 'Good', imageUrl: '/api/placeholder/200/150', createdAt: new Date(Date.now() - 28800000) },
    { id: '9', title: 'Star Fox 64 - Rumble Pak Bundle', price: 78.00, currency: 'EUR', seller: 'BundleBargains', condition: 'Very Good', imageUrl: '/api/placeholder/200/150', createdAt: new Date(Date.now() - 32400000) },
    { id: '10', title: 'Super Smash Bros - Tournament Ed.', price: 156.99, currency: 'EUR', seller: 'TournamentGames', condition: 'Mint', imageUrl: '/api/placeholder/200/150', createdAt: new Date(Date.now() - 36000000) }
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

  // Render functions for each card type
  const renderNewsItem = (item: NewsItem, index: number) => (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-slate-100 mb-2 line-clamp-2">{item.title}</h4>
        <p className="text-xs text-slate-300 mb-3 line-clamp-3">{item.content}</p>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{formatTime(item.date)}</span>
        <span className="capitalize">{item.type.replace('_', ' ')}</span>
      </div>
    </div>
  )

  const renderForumThread = (thread: ForumThread, index: number) => (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-slate-100 mb-2 line-clamp-2">{thread.title}</h4>
        <div className="text-xs text-slate-300 mb-2">
          <span className="text-blue-400">{thread.author}</span> • {thread.category}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{thread.replies} Antworten</span>
        <span>{formatTime(thread.lastActivity)}</span>
      </div>
    </div>
  )

  const renderFanArtItem = (item: FanArtItem, index: number) => (
    <div className="h-full flex flex-col">
      <div className="flex-1 mb-2">
        <div className="w-full h-16 bg-slate-700 rounded mb-2 flex items-center justify-center">
          <Palette className="w-6 h-6 text-slate-400" />
        </div>
        <h4 className="text-sm font-semibold text-slate-100 mb-1 line-clamp-1">{item.title}</h4>
        <p className="text-xs text-blue-400 mb-1">{item.artist}</p>
        <p className="text-xs text-slate-400">{item.game}</p>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" /> {item.likes}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> {item.views}
          </span>
        </div>
      </div>
    </div>
  )

  const renderMediaItem = (item: MediaItem, index: number) => (
    <div className="h-full flex flex-col">
      <div className="flex-1 mb-2">
        <div className="w-full h-16 bg-slate-700 rounded mb-2 flex items-center justify-center">
          <Camera className="w-6 h-6 text-slate-400" />
        </div>
        <h4 className="text-sm font-semibold text-slate-100 mb-1 line-clamp-1">{item.title}</h4>
        <p className="text-xs text-green-400 mb-1">{item.uploader}</p>
        <p className="text-xs text-slate-400 capitalize">{item.type}</p>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" /> {item.views}
        </span>
        <span>{formatTime(item.uploadDate)}</span>
      </div>
    </div>
  )

  const renderRecordItem = (record: RecordItem, index: number) => (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <div className="flex items-center gap-1 mb-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <h4 className="text-sm font-semibold text-slate-100 line-clamp-1">{record.time}</h4>
        </div>
        <p className="text-xs text-slate-300 mb-1 line-clamp-1">{record.game}</p>
        <p className="text-xs text-slate-400 mb-2 line-clamp-1">{record.track}</p>
        <p className="text-xs text-blue-400">{record.username}</p>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{formatTime(record.date)}</span>
        {record.verified && <span className="text-green-400">✓ Verifiziert</span>}
      </div>
    </div>
  )

  const renderMarketplaceItem = (item: MarketplaceItem, index: number) => (
    <div className="h-full flex flex-col">
      <div className="flex-1 mb-2">
        <div className="w-full h-16 bg-slate-700 rounded mb-2 flex items-center justify-center">
          <ShoppingCart className="w-6 h-6 text-slate-400" />
        </div>
        <h4 className="text-sm font-semibold text-slate-100 mb-1 line-clamp-1">{item.title}</h4>
        <p className="text-xs text-green-400 mb-1">{item.price} {item.currency}</p>
        <p className="text-xs text-slate-400 mb-1">{item.condition}</p>
        <p className="text-xs text-blue-400">{item.seller}</p>
      </div>
      <div className="text-xs text-slate-400">
        <span>{formatTime(item.createdAt)}</span>
      </div>
    </div>
  )

  return (
    <div className="container-lg py-responsive space-responsive responsive-max-width responsive-overflow-hidden">
      {/* Welcome Section */}
      <div className="text-center mb-responsive responsive-max-width">
        <h1 className="text-responsive-2xl font-bold text-slate-100 mb-4 responsive-word-break">
          {user ? t('home.welcomeBack', { name: user.username }) : t('home.welcome')}
        </h1>
        <p className="text-responsive-base text-slate-400 max-w-2xl mx-auto responsive-word-break px-2">
          {t('home.subtitle')}
        </p>
        <div className="mt-4 text-responsive-sm text-slate-500">
          <span className="block sm:inline">{formatDate(currentTime)}</span>
          <span className="hidden sm:inline mx-2">•</span>
          <span className="block sm:inline">{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* LIVE EVENTS SECTION - TOP PRIORITY */}
      <div className="mb-responsive responsive-max-width">
        {activeEvents.length > 0 ? (
          <EventFeedWidget
            eventTitle={activeEvents[0].title}
            eventGame={activeEvents[0].game || 'N64'}
            participants={activeEvents[0].participants || 0}
            timeRemaining={getEventTimeRemaining(activeEvents[0])}
            leaderboard={getLeaderboard(activeEvents[0].id)}
            isExpanded={isEventExpanded}
            onToggleExpanded={() => setIsEventExpanded(!isEventExpanded)}
          />
        ) : (
          <div className="n64-tile n64-tile-large bg-gradient-to-br from-red-600/20 to-pink-600/20 border-l-4 border-red-400 responsive-max-width">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0" />
              <h2 className="text-responsive-lg font-bold text-slate-100 responsive-word-break">🔴 {t('home.liveEvents')}</h2>
            </div>
            <div className="text-center py-4 sm:py-8">
              <Gamepad2 className="w-8 h-8 sm:w-12 sm:h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-responsive-sm text-slate-400 mb-4 responsive-word-break">Kein Live-Event aktiv - Nächstes Event startet bald!</p>
              <Link 
                to="/events" 
                className="inline-block px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-responsive-sm w-full sm:w-auto text-center"
              >
                📅 Alle Events anzeigen
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* POINTS WIDGET SECTION */}
      {user && (
        <div className="mb-responsive responsive-max-width">
          <PointsWidget />
        </div>
      )}

      {/* NEWS CARDS SECTION */}
      <div className="space-y-6">
        {/* Single News Card - One card at a time with dismiss functionality */}
        <div className="space-y-4">
          <h2 className="text-responsive-xl font-bold text-slate-100 text-center mb-6">
            📰 N64 & App News
          </h2>
          <SingleNewsCard 
            newsItems={newsItems.slice(0, 8)}
            className="w-full"
          />
        </div>

        {/* Forum Posts - Single card interface */}
        <SingleForumCard 
          forumThreads={forumThreads}
          className="w-full"
        />

        {/* Other Content - FanArts and Media */}
        <div className="swipeable-grid-2col">
          <SingleFanArtCard 
            fanArtItems={fanArtItems}
            className="w-full"
          />
          
          <SingleMediaCard 
            mediaItems={mediaItems}
            className="w-full"
          />
        </div>

        {/* Records and Marketplace */}
        <div className="swipeable-grid-2col">
          <SingleRecordCard 
            recordItems={recordItems}
            className="w-full"
          />
          
          <SingleMarketplaceCard 
            marketplaceItems={marketplaceItems}
            className="w-full"
          />
        </div>

        {/* N64Fan Leaderboard - Compact */}
        {user && (
          <div className="responsive-max-width">
            <div className="simple-tile">
              <N64FanLeaderboard 
                maxEntries={5}
                showFilters={false}
                compact={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-responsive responsive-max-width">
        <p className="text-responsive-sm text-slate-400 responsive-word-break">
          {t('home.footer.tagline')}
        </p>
        <Link 
          to="/retro" 
          className="inline-block mt-4 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors text-responsive-sm text-slate-300 w-full sm:w-auto"
        >
          🎮 Zur Retro-Ansicht
        </Link>
      </div>
    </div>
  )
}

export default HomePage