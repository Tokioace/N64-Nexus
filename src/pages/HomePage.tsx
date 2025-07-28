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
  description: string
  type: 'speedrun' | 'screenshot' | 'achievement' | 'stream'
  uploader: string
  date: Date
  views: number
  likes: number
  verified: boolean
  game: string
  thumbnailUrl?: string
}

interface PersonalRecord {
  id: string
  game: string
  category: string
  time?: string
  score?: number
  date: Date
  verified: boolean
  platform: string
}

interface MarketplaceItem {
  id: string
  title: string
  description: string
  price: number
  condition: string
  seller: string
  date: Date
  image?: string
  category: string
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
      title: t('news.communityStats'),
      content: t('news.communityStatsContent'),
      date: new Date(Date.now() - 604800000),
      type: 'community_news'
    }
  ]

  const forumThreads: ForumThread[] = [
    { id: '1', title: t('forum.thread.controllerQuestion'), author: 'SpeedRunner123', replies: 23, lastActivity: new Date(Date.now() - 1800000), category: t('category.hardware') },
    { id: '2', title: t('forum.thread.mariokartShortcuts'), author: 'MKExplorer', replies: 45, lastActivity: new Date(Date.now() - 3600000), category: t('category.glitches') },
    { id: '3', title: t('forum.thread.ootRandomizer'), author: 'ZeldaFan64', replies: 67, lastActivity: new Date(Date.now() - 7200000), category: t('category.events') },
    { id: '4', title: t('forum.thread.perfectDarkGuide'), author: 'PerfectAgent', replies: 12, lastActivity: new Date(Date.now() - 10800000), category: t('category.guides') },
    { id: '5', title: t('forum.thread.emulatorVsHardware'), author: 'RetroGamer', replies: 89, lastActivity: new Date(Date.now() - 14400000), category: t('category.discussion') },
    { id: '6', title: t('forum.thread.marioBLJ'), author: 'BLJMaster', replies: 34, lastActivity: new Date(Date.now() - 18000000), category: t('category.tutorials') },
    { id: '7', title: t('forum.thread.banjoRoute'), author: 'BearBirdRunner', replies: 56, lastActivity: new Date(Date.now() - 21600000), category: t('category.routes') },
    { id: '8', title: t('forum.thread.goldeneye'), author: 'SecretAgent', replies: 78, lastActivity: new Date(Date.now() - 25200000), category: t('category.challenges') },
    { id: '9', title: t('forum.thread.collecting'), author: 'Collector64', replies: 23, lastActivity: new Date(Date.now() - 28800000), category: t('category.collecting') },
    { id: '10', title: t('forum.thread.paperMario'), author: 'PaperSpeedster', replies: 41, lastActivity: new Date(Date.now() - 32400000), category: t('category.tips') }
  ]

  const fanArtItems: FanArtItem[] = [
    { id: '1', title: 'Mario in Peach\'s Castle', artist: 'PixelArtist64', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2QjZCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPk1hcmlvIEFydDwvdGV4dD48L3N2Zz4=', likes: 234, views: 1250, game: 'Super Mario 64' },
    { id: '2', title: 'Link vs Ganondorf Epic Battle', artist: 'ZeldaDrawer', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEVDREMxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPlplbGRhIEFydDwvdGV4dD48L3N2Zz4=', likes: 189, views: 980, game: 'Ocarina of Time' },
    { id: '3', title: 'Banjo & Kazooie Adventure', artist: 'RetroSketch', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDVCN0QxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkJhbmpvIEFydDwvdGV4dD48L3N2Zz4=', likes: 156, views: 750, game: 'Banjo-Kazooie' },
    { id: '4', title: 'Rainbow Road Nostalgia', artist: 'KartArtist', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOTZDRUI0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkthcnQgQXJ0PC90ZXh0Pjwvc3ZnPg==', likes: 298, views: 1400, game: 'Mario Kart 64' },
    { id: '5', title: 'GoldenEye 007 Facility Map', artist: 'SpyArtist', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZFQUE3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkdvbGRlbkV5ZSBBcnQ8L3RleHQ+PC9zdmc+', likes: 167, views: 890, game: 'GoldenEye 007' },
    { id: '6', title: 'Diddy Kong Racing Team', artist: 'RareArtFan', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRERBMEREIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkRpZGR5IEFydDwvdGV4dD48L3N2Zz4=', likes: 134, views: 620, game: 'Diddy Kong Racing' },
    { id: '7', title: 'Star Fox 64 Arwing Squadron', artist: 'SpaceArtist', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNzRCOUZGIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPlN0YXJGb3ggQXJ0PC90ZXh0Pjwvc3ZnPg==', likes: 201, views: 1100, game: 'Star Fox 64' },
    { id: '8', title: 'Smash Bros N64 All Stars', artist: 'FighterArt', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkQ3OUE4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPlNtYXNoIEFydDwvdGV4dD48L3N2Zz4=', likes: 345, views: 1800, game: 'Super Smash Bros' },
    { id: '9', title: 'Yoshi\'s Story Cute Style', artist: 'YoshiLover', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDBCODk0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPllvc2hpIEFydDwvdGV4dD48L3N2Zz4=', likes: 123, views: 560, game: 'Yoshi\'s Story' },
    { id: '10', title: 'F-Zero X Speed Demon', artist: 'RacingArt64', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTE3MDU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkYtWmVybyBBcnQ8L3RleHQ+PC9zdmc+', likes: 178, views: 820, game: 'F-Zero X' }
  ]

  const mediaItems: MediaItem[] = [
    { id: '1', title: 'Mario 64 16 Star WR Run', description: 'New world record attempt with frame-perfect BLJ execution', type: 'speedrun', uploader: 'SpeedDemon64', date: new Date(Date.now() - 3600000), views: 5430, likes: 234, verified: true, game: 'Super Mario 64', thumbnailUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2QjZCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPk1hcmlvIFZpZGVvPC90ZXh0Pjwvc3ZnPg==' },
    { id: '2', title: 'OoT Any% New PB!', description: 'Personal best with improved routing and glitch execution', type: 'speedrun', uploader: 'ZeldaRunner', date: new Date(Date.now() - 7200000), views: 3210, likes: 156, verified: true, game: 'Ocarina of Time' },
    { id: '3', title: 'Perfect Dark Agent Speedrun', description: 'Agent difficulty completion with stealth tactics', type: 'speedrun', uploader: 'SecretRunner', date: new Date(Date.now() - 10800000), views: 2890, likes: 89, verified: true, game: 'Perfect Dark' },
    { id: '4', title: 'Mario Kart 64 Epic Comeback', description: 'Amazing last-lap comeback on Rainbow Road', type: 'screenshot', uploader: 'KartMaster', date: new Date(Date.now() - 14400000), views: 1560, likes: 78, verified: false, game: 'Mario Kart 64' },
    { id: '5', title: 'Live: GoldenEye Tournament', description: 'Live tournament stream with community commentary', type: 'stream', uploader: 'EventStream', date: new Date(Date.now() - 18000000), views: 8920, likes: 445, verified: true, game: 'GoldenEye 007' }
  ]

  const personalRecords: PersonalRecord[] = [
    { id: '1', game: 'Super Mario 64', category: '16 Star', time: '15:42.33', date: new Date(Date.now() - 3600000), verified: true, platform: 'N64' },
    { id: '2', game: 'Mario Kart 64', category: 'Rainbow Road', time: '6:14.82', date: new Date(Date.now() - 7200000), verified: true, platform: 'N64' },
    { id: '3', game: 'GoldenEye 007', category: 'Facility Agent', time: '0:58.91', date: new Date(Date.now() - 10800000), verified: true, platform: 'N64' },
    { id: '4', game: 'Ocarina of Time', category: 'Any%', time: '16:58.12', date: new Date(Date.now() - 14400000), verified: true, platform: 'N64' },
    { id: '5', game: 'Perfect Dark', category: 'DataDyne Central', time: '1:23.45', date: new Date(Date.now() - 18000000), verified: true, platform: 'N64' }
  ]

  const marketplaceItems: MarketplaceItem[] = [
    { id: '1', title: 'Super Mario 64 - Mint Condition', description: 'Original cartridge in mint condition with manual', price: 89.99, condition: 'Mint', seller: 'RetroCollector', date: new Date(Date.now() - 3600000), category: 'Games' },
    { id: '2', title: 'N64 Controller - Original Nintendo', description: 'Official Nintendo controller in very good condition', price: 34.50, condition: 'Very Good', seller: 'ControllerKing', date: new Date(Date.now() - 7200000), category: 'Accessories' },
    { id: '3', title: 'GoldenEye 007 - Complete in Box', description: 'Complete game with box, manual, and cartridge', price: 125.00, condition: 'Good', seller: 'GameVault', date: new Date(Date.now() - 10800000), category: 'Games' },
    { id: '4', title: 'Ocarina of Time - Gold Cartridge', description: 'Rare gold cartridge edition in mint condition', price: 199.99, condition: 'Mint', seller: 'ZeldaFanatic', date: new Date(Date.now() - 14400000), category: 'Collectibles' },
    { id: '5', title: 'N64 Console - Jungle Green', description: 'Special edition jungle green N64 console', price: 149.99, condition: 'Very Good', seller: 'ConsoleDealer', date: new Date(Date.now() - 18000000), category: 'Consoles' }
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
        <span>{formatTime(item.date)}</span>
      </div>
    </div>
  )

  const renderRecordItem = (record: PersonalRecord, index: number) => (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <div className="flex items-center gap-1 mb-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <h4 className="leaderboard-time-compact text-slate-100 line-clamp-1">{record.time}</h4>
        </div>
        <p className="text-xs text-slate-300 mb-1 line-clamp-1">{record.game}</p>
        <p className="text-xs text-slate-400 mb-2 line-clamp-1">{record.category}</p>
        <p className="text-xs text-blue-400">{record.platform}</p>
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
        <p className="text-xs text-green-400 mb-1">€{item.price.toFixed(2)}</p>
        <p className="text-xs text-slate-400 mb-1">{item.condition}</p>
        <p className="text-xs text-blue-400">{item.seller}</p>
      </div>
      <div className="text-xs text-slate-400">
        <span>{formatTime(item.date)}</span>
      </div>
    </div>
  )

  return (
    <div className="container-lg space-responsive responsive-max-width responsive-overflow-hidden">
      {/* Welcome Section with Mascot */}
      <div className="text-center mb-responsive responsive-max-width">
        <div className="battle64-header-container mb-responsive">
          {/* Mascot Image */}
          <img 
            src="/mascot.png" 
            alt={t('alt.battle64Mascot')} 
            className="battle64-mascot"
          />
        </div>
        
        {/* Welcome Back Text */}
        <p className="battle64-welcome-text">
          {user ? `${t('home.welcome')}, ${user.username}!` : t('home.welcome')}
        </p>
        
        <p className="text-responsive-base text-slate-400 responsive-word-break" style={{ 
          maxWidth: 'min(42rem, 90vw)', 
          margin: '0 auto', 
          marginTop: 'clamp(1rem, 2vw, 1.5rem)',
          padding: '0 clamp(0.5rem, 2vw, 1rem)'
        }}>
          {t('home.subtitle')}
        </p>
        <div className="text-responsive-sm text-slate-500 responsive-flex-center" style={{ marginTop: 'clamp(1rem, 2vw, 1.5rem)' }}>
          <span>{formatDate(currentTime)}</span>
          <span className="hidden sm:inline">•</span>
          <span>{formatTime(currentTime)}</span>
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
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 flex-shrink-0" />
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
        <div className="responsive-grid-2">
          <SingleFanArtCard 
            fanArtItems={fanArtItems}
            className="responsive-max-width"
          />
          
          <SingleMediaCard 
            mediaItems={mediaItems}
            className="responsive-max-width"
          />
        </div>

        {/* Records and Marketplace */}
        <div className="responsive-grid-2">
          <SingleRecordCard 
            personalRecords={personalRecords}
            className="responsive-max-width"
          />
          
          <SingleMarketplaceCard 
            marketplaceItems={marketplaceItems}
            className="responsive-max-width"
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
      </div>
    </div>
  )
}

export default HomePage