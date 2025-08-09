import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useForum } from '../contexts/ForumContext'
import { CheckCircle, X } from 'lucide-react'
import EventFeedWidget from '../components/EventFeedWidget'
import PointsWidget from '../components/PointsWidget'
import N64FanLeaderboard from '../components/N64FanLeaderboard'
import SingleNewsCard from '../components/SingleNewsCard'
import SingleForumCard from '../components/SingleForumCard'
import SingleFanArtCard from '../components/SingleFanArtCard'
import SingleMediaCard from '../components/SingleMediaCard'
import SingleRecordCard from '../components/SingleRecordCard'
import SingleMarketplaceCard from '../components/SingleMarketplaceCard'
import Battle64MapTile from '../components/Battle64MapTile'
import { LegacyMarketplaceItem } from '../types'

interface ForumThread {
  id: string
  title: string
  author: string
  replies: number
  lastActivity: Date
  category: string
  lastPostContent?: string
  lastPostAuthor?: string
}

interface FanArtItem {
  id: string
  title: string
  artist: string
  imageUrl: string
  likes: number
  views: number
  game: string
  createdAt?: Date
  date?: Date
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
  time: string
  date: Date
  verified: boolean
  platform: string
}

// Use the legacy interface for HomePage compatibility
type MarketplaceItem = LegacyMarketplaceItem

// 🔧 Safe component wrapper with error boundaries
const SafeComponent: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode; name: string }> = ({ 
  children, 
  fallback, 
  name 
}) => {
  const [hasError, setHasError] = React.useState(false)
  const [, setError] = React.useState<Error | null>(null)
  
  React.useEffect(() => {
    setHasError(false)
    setError(null)
  }, [children])
  
  if (hasError) {
    return fallback || (
      <div className="simple-tile bg-slate-800/50 border-slate-600 p-4 rounded-lg">
        <p className="text-slate-400 text-sm">
          ⚠️ Error loading {name}
        </p>
        <button 
          onClick={() => {
            setHasError(false)
            setError(null)
          }}
          className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
        >
          Try again
        </button>
      </div>
    )
  }
  
  try {
    return (
      <React.Suspense fallback={
        <div className="simple-tile bg-slate-800/50 border-slate-600 p-4 rounded-lg">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      }>
        {children}
      </React.Suspense>
    )
  } catch (error) {
    logger.error(`Error in ${name}:`, error)
    setHasError(true)
    setError(error as Error)
    return null
  }
}

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, isLoading: userLoading } = useUser()
  const { t, currentLanguage } = useLanguage()
  const { threads, posts } = useForum()
  const [isDataLoading, setIsDataLoading] = React.useState(true)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registrationUsername, setRegistrationUsername] = useState('')

  // 🔧 FIXED: Safe state management with defensive programming
  const [fanArtItems, setFanArtItems] = useState<FanArtItem[]>([])
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([])
  
  // Static data with proper typing
  const [mediaItems] = useState<MediaItem[]>([
    { id: '1', title: 'Mario 64 16 Star WR Run', description: 'New world record attempt with frame-perfect BLJ execution', type: 'speedrun', uploader: 'SpeedDemon64', date: new Date(Date.now() - 3600000), views: 5430, likes: 234, verified: true, game: 'Super Mario 64', thumbnailUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2QjZCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPk1hcmlvIFZpZGVvPC90ZXh0Pjwvc3ZnPg==' },
    { id: '2', title: 'OoT Any% New PB!', description: 'Personal best with improved routing and glitch execution', type: 'speedrun', uploader: 'ZeldaRunner', date: new Date(Date.now() - 7200000), views: 3210, likes: 156, verified: true, game: 'Ocarina of Time' },
    { id: '3', title: 'Perfect Dark Agent Speedrun', description: 'Agent difficulty completion with stealth tactics', type: 'speedrun', uploader: 'SecretRunner', date: new Date(Date.now() - 10800000), views: 2890, likes: 89, verified: true, game: 'Perfect Dark' },
    { id: '4', title: 'Mario Kart 64 Epic Comeback', description: 'Amazing last-lap comeback on Rainbow Road', type: 'screenshot', uploader: 'KartMaster', date: new Date(Date.now() - 14400000), views: 1560, likes: 78, verified: false, game: 'Mario Kart 64' },
    { id: '5', title: 'Live: GoldenEye Tournament', description: 'Live tournament stream with community commentary', type: 'stream', uploader: 'EventStream', date: new Date(Date.now() - 18000000), views: 8920, likes: 445, verified: true, game: 'GoldenEye 007' }
  ])

  const [personalRecords] = useState<PersonalRecord[]>([
    { id: '1', game: 'Super Mario 64', category: '16 Star', time: '15:42.33', date: new Date(Date.now() - 3600000), verified: true, platform: 'N64' },
    { id: '2', game: 'Mario Kart 64', category: 'Rainbow Road', time: '6:14.82', date: new Date(Date.now() - 7200000), verified: true, platform: 'N64' },
    { id: '3', game: 'GoldenEye 007', category: 'Facility Agent', time: '0:58.91', date: new Date(Date.now() - 10800000), verified: true, platform: 'N64' },
    { id: '4', game: 'Ocarina of Time', category: 'Any%', time: '16:58.12', date: new Date(Date.now() - 14400000), verified: true, platform: 'N64' },
    { id: '5', game: 'Perfect Dark', category: 'DataDyne Central', time: '1:23.45', date: new Date(Date.now() - 18000000), verified: true, platform: 'N64' }
  ])

  // Handle email confirmation
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const registration = searchParams.get('registration')
      const tokenHash = searchParams.get('token_hash')
      const type = searchParams.get('type')
      const safariRedirect = searchParams.get('safari_redirect')

      // Validate parameters to prevent malicious input
      if (registration === 'success' && 
          tokenHash && 
          typeof tokenHash === 'string' && 
          tokenHash.length > 10 && 
          tokenHash.length < 200 &&
          type === 'email') {
        try {
          // Verify the email confirmation token
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'email'
          })

          if (error) {
            logger.error('Email confirmation error:', error)
            return
          }

          if (data.user) {
            // Check if profile already exists
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id, username')
              .eq('id', data.user.id)
              .single()

            let userUsername = 'User'

            if (!existingProfile) {
              // Create profile for confirmed user
              const userData = data.user.user_metadata
              userUsername = userData.username || 'User'
              
              const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                  id: data.user.id,
                  username: userUsername,
                  level: 1,
                  xp: 0,
                  region: userData.region || 'PAL',
                  platform: userData.platform || 'N64',
                  birth_date: userData.birth_date,
                  terms_accepted: userData.terms_accepted || false,
                  privacy_accepted: userData.privacy_accepted || false,
                  copyright_acknowledged: userData.copyright_acknowledged || false,
                  avatar: '🎮',
                  bio: '',
                  location: '',
                  is_public: true
                })

              if (profileError) {
                logger.error('Profile creation error:', profileError)
                return
              }
            } else {
              userUsername = existingProfile.username
            }

            setRegistrationUsername(userUsername)
            setRegistrationSuccess(true)
            
            // Clean up URL parameters
            setSearchParams({})
            
            // If this was a Safari redirect, show special message
            if (safariRedirect === 'true') {
              // Show Safari-specific success message
              const message = t('auth.safariRedirectSuccess')
              setTimeout(() => {
                alert(message)
              }, 500)
            }
          }
        } catch (error) {
          logger.error('Email confirmation error:', error)
        }
      }
    }

    handleEmailConfirmation()
  }, [searchParams, setSearchParams])

  // 🔧 FIXED: Safe data loading with proper error handling
  useEffect(() => {
    const loadFanArtData = () => {
      try {
        const savedFanArt = localStorage.getItem('fanart_items')
        if (savedFanArt && savedFanArt.trim() !== '') {
          let parsedFanArt
          try {
            parsedFanArt = JSON.parse(savedFanArt) as FanArtItem[]
            if (!Array.isArray(parsedFanArt)) {
              throw new Error('Invalid fanart data format')
            }
          } catch (parseError) {
            logger.error('Error parsing fanart data:', parseError)
            localStorage.removeItem('fanart_items')
            throw parseError
          }
          
          const sortedFanArt = parsedFanArt
            .filter(item => item && item.id)
            .map((item: FanArtItem) => ({
              ...item,
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
              date: item.date ? new Date(item.date) : new Date()
            }))
            .sort((a: FanArtItem, b: FanArtItem) => {
              const dateA = a.createdAt || a.date || new Date(0)
              const dateB = b.createdAt || b.date || new Date(0)
              return dateB.getTime() - dateA.getTime()
            })
          setFanArtItems(sortedFanArt)
        } else {
          setFanArtItems([
            { id: '1', title: 'Mario in Peach\'s Castle', artist: 'PixelArtist64', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2QjZCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPk1hcmlvIEFydDwvdGV4dD48L3N2Zz4=', likes: 234, views: 1250, game: 'Super Mario 64', createdAt: new Date() },
            { id: '2', title: 'Link vs Ganondorf Epic Battle', artist: 'ZeldaDrawer', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEVDREMxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPlplbGRhIEFydDwvdGV4dD48L3N2Zz4=', likes: 189, views: 980, game: 'Ocarina of Time', createdAt: new Date(Date.now() - 86400000) },
            { id: '3', title: 'Banjo & Kazooie Adventure', artist: 'RetroSketch', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDVCN0QxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkJhbmpvIEFydDwvdGV4dD48L3N2Zz4=', likes: 156, views: 750, game: 'Banjo-Kazooie', createdAt: new Date(Date.now() - 172800000) }
          ])
        }
      } catch (error) {
        logger.error('Error loading fanart data:', error)
        localStorage.removeItem('fanart_items')
        setFanArtItems([
          { id: '1', title: 'Mario in Peach\'s Castle', artist: 'PixelArtist64', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2QjZCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPk1hcmlvIEFydDwvdGV4dD48L3N2Zz4=', likes: 234, views: 1250, game: 'Super Mario 64', createdAt: new Date() }
        ])
      }
    }

    const loadMarketplaceData = () => {
      try {
        const savedMarketplace = localStorage.getItem('marketplace_items')
        if (savedMarketplace && savedMarketplace.trim() !== '') {
          let parsedMarketplace
          try {
            parsedMarketplace = JSON.parse(savedMarketplace) as MarketplaceItem[]
            if (!Array.isArray(parsedMarketplace)) {
              throw new Error('Invalid marketplace data format')
            }
          } catch (parseError) {
            logger.error('Error parsing marketplace data:', parseError)
            localStorage.removeItem('marketplace_items')
            throw parseError
          }
          
          const sortedMarketplace = parsedMarketplace
            .filter(item => item && item.id)
            .map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              price: item.price,
              condition: item.condition,
              seller: typeof item.seller === 'object' && item.seller?.name ? item.seller.name : item.seller,
              imageUrl: item.imageUrl || '',
              category: item.category || 'general',
              date: item.date ? new Date(item.date) : (item.createdAt ? new Date(item.createdAt) : new Date())
            } as MarketplaceItem))
            .sort((a: MarketplaceItem, b: MarketplaceItem) => b.date.getTime() - a.date.getTime())
          setMarketplaceItems(sortedMarketplace)
        } else {
          setMarketplaceItems([
            { id: '1', title: 'Super Mario 64 - Mint Condition', description: 'Original cartridge in mint condition with manual', price: 89.99, condition: 'Mint', seller: 'RetroCollector', date: new Date(Date.now() - 3600000), category: 'Games', images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTVFN0VCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPk1hcmlvIDY0PC90ZXh0Pjwvc3ZnPg=='] },
            { id: '2', title: 'N64 Controller - Original Nintendo', description: 'Official Nintendo controller in very good condition', price: 34.50, condition: 'Very Good', seller: 'ControllerKing', date: new Date(Date.now() - 7200000), category: 'Accessories', images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTVFN0VCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkNvbnRyb2xsZXI8L3RleHQ+PC9zdmc+'] },
            { id: '3', title: 'GoldenEye 007 - Complete in Box', description: 'Complete game with box, manual, and cartridge', price: 125.00, condition: 'Good', seller: 'GameVault', date: new Date(Date.now() - 10800000), category: 'Games', images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTVFN0VCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkdvbGRlbkV5ZTwvdGV4dD48L3N2Zz4='] }
          ])
        }
      } catch (error) {
        logger.error('Error loading marketplace data:', error)
        localStorage.removeItem('marketplace_items')
        setMarketplaceItems([
          { id: '1', title: 'Super Mario 64 - Mint Condition', description: 'Original cartridge in mint condition with manual', price: 89.99, condition: 'Mint', seller: 'RetroCollector', date: new Date(Date.now() - 3600000), category: 'Games' }
        ])
      }
    }

    const loadData = async () => {
      setIsDataLoading(true)
      try {
        await Promise.all([
          new Promise(resolve => { loadFanArtData(); resolve(void 0) }),
          new Promise(resolve => { loadMarketplaceData(); resolve(void 0) })
        ])
      } catch (error) {
        logger.error('Error loading homepage data:', error)
      } finally {
        setIsDataLoading(false)
      }
    }

    loadData()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fanart_items') {
        loadFanArtData()
      } else if (e.key === 'marketplace_items') {
        loadMarketplaceData()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // 🔧 FIXED: Safe forum threads processing
  const forumThreads: ForumThread[] = React.useMemo(() => {
    try {
      if (!threads || !Array.isArray(threads)) {
        logger.warn('Invalid threads data:', threads)
        return []
      }
      
      return threads
        .filter(thread => thread && thread.id && thread.title)
        .sort((a, b) => {
          try {
            const dateA = new Date(a.lastUpdated || a.createdAt || 0).getTime()
            const dateB = new Date(b.lastUpdated || b.createdAt || 0).getTime()
            return dateB - dateA
          } catch (error) {
            logger.warn('Error sorting threads:', error)
            return 0
          }
        })
        .slice(0, 10)
        .map(thread => {
          try {
            const threadPosts = Array.isArray(posts) 
              ? posts.filter(post => post && post.threadId === thread.id)
              : []
            const latestPost = threadPosts
              .sort((a, b) => {
                try {
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                } catch (error) {
                  return 0
                }
              })[0]
            
            return {
              id: thread.id,
              title: thread.title || 'Untitled Thread',
              author: thread.authorName || thread.authorId || 'Unknown',
              replies: thread.postCount || 0,
              lastActivity: new Date(thread.lastUpdated || thread.createdAt || Date.now()),
              category: thread.categoryId || 'general',
              lastPostContent: latestPost?.content,
              lastPostAuthor: latestPost?.authorName || latestPost?.authorId
            }
          } catch (error) {
            logger.error('Error processing thread:', thread, error)
            return null
          }
        })
        .filter(Boolean) as ForumThread[]
    } catch (error) {
      logger.error('Error processing forum threads:', error)
      return []
    }
  }, [threads, posts])

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

  if (userLoading || isDataLoading) {
    return (
      <div className="container-lg space-responsive responsive-max-width responsive-overflow-hidden">
        <div className="text-center mb-6 responsive-max-width">
          <div className="battle64-header-container">
            <img 
              src="/mascot.png" 
              alt={t('alt.battle64Mascot')} 
              className="battle64-mascot mx-auto block"
              style={{
                marginTop: 'clamp(0.5rem, 1vw, 1rem)',
                marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)'
              }}
            />
          </div>
          <div className="mt-2">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-600 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-700 rounded w-96 mx-auto mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-32 mx-auto"></div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="simple-tile bg-slate-800/50 border-slate-600 p-4 rounded-lg">
              <div className="animate-pulse">
                <div className="h-6 bg-slate-600 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container-lg space-responsive responsive-max-width responsive-overflow-hidden">
      {/* Registration Success Notification */}
      {registrationSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-xl shadow-2xl border border-green-500/30 max-w-md">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-200 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">
                {t('auth.registrationSucceeded')}
              </h3>
              <p className="text-green-100 mb-2">
                {t('auth.welcomeToCommunity')}, <span className="font-bold">{registrationUsername}</span>!
              </p>
              <p className="text-green-200 text-sm mb-3">
                {t('auth.accountActivatedSuccessfully')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => window.location.href = '/events'}
                  className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition-colors text-sm"
                >
                  {t('auth.exploreEvents')}
                </button>
                <button
                  onClick={() => setRegistrationSuccess(false)}
                  className="bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-lg transition-colors text-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mascot Section with Welcome Content */}
      <div className="text-center mb-6 responsive-max-width">
        <div className="battle64-header-container">
          <img 
            src="/mascot.png" 
            alt={t('alt.battle64Mascot')} 
            className="battle64-mascot mx-auto block"
            style={{
              marginTop: 'clamp(0.5rem, 1vw, 1rem)',
              marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)'
            }}
          />
        </div>
        
        <div className="mt-2">
          <p className="battle64-welcome-text">
            {user ? `${t('home.welcome')}, ${user.username}!` : t('home.welcome')}
          </p>
          
          <p className="text-responsive-base text-slate-400 responsive-word-break" style={{ 
            maxWidth: 'min(42rem, 90vw)', 
            margin: '0 auto', 
            marginTop: 'clamp(0.5rem, 1.5vw, 1rem)',
            padding: '0 clamp(0.5rem, 2vw, 1rem)'
          }}>
            {t('home.subtitle')}
          </p>
          <div className="text-responsive-sm text-slate-500 responsive-flex-center" style={{ marginTop: 'clamp(0.5rem, 1.5vw, 1rem)' }}>
            <span>{formatDate(new Date())}</span>
            <span className="hidden sm:inline">•</span>
            <span>{formatTime(new Date())}</span>
          </div>
        </div>
      </div>

      {/* LIVE EVENTS SECTION */}
      <SafeComponent name="EventFeedWidget">
        <div className="mb-responsive responsive-max-width">
          <EventFeedWidget />
        </div>
      </SafeComponent>

      {/* POINTS WIDGET SECTION */}
      {user && (
        <SafeComponent name="PointsWidget">
          <div className="mb-responsive responsive-max-width">
            <PointsWidget />
          </div>
        </SafeComponent>
      )}

      {/* CONTENT SECTIONS */}
      <div className="space-y-6">
        {/* News Cards Section */}
        <SafeComponent name="SingleNewsCard">
          <div className="space-y-4">
            <h2 className="text-responsive-lg font-bold text-slate-100 mb-responsive">
              {t('home.newsTitle')}
            </h2>
            <SingleNewsCard 
              newsItems={posts.slice(0, 8).map(post => ({
                id: post.id,
                title: post.content.substring(0, 50) + '...',
                content: post.content,
                date: new Date(post.createdAt),
                type: 'community_news' as const
              }))}
              className="w-full"
            />
          </div>
        </SafeComponent>

        {/* Battle64 Map Tile */}
        <SafeComponent name="Battle64MapTile">
          <Battle64MapTile className="w-full" />
        </SafeComponent>

        {/* Forum Posts */}
        <SafeComponent name="SingleForumCard">
          <SingleForumCard 
            forumThreads={forumThreads}
            className="w-full"
          />
        </SafeComponent>

        {/* FanArts and Media */}
        <div className="responsive-grid-2">
          <SafeComponent name="SingleFanArtCard">
            <SingleFanArtCard 
              fanArtItems={fanArtItems}
              className="responsive-max-width"
            />
          </SafeComponent>
          
          <SafeComponent name="SingleMediaCard">
            <SingleMediaCard 
              mediaItems={mediaItems}
              className="responsive-max-width"
            />
          </SafeComponent>
        </div>

        {/* Records and Marketplace - 🔧 FIXED with defensive programming */}
        <div className="responsive-grid-2">
          <SafeComponent name="SingleRecordCard">
            <SingleRecordCard 
              personalRecords={personalRecords}
              className="responsive-max-width"
            />
          </SafeComponent>
          
          <SafeComponent name="SingleMarketplaceCard">
            <SingleMarketplaceCard 
              marketplaceItems={marketplaceItems}
              className="responsive-max-width"
            />
          </SafeComponent>
        </div>

        {/* N64Fan Leaderboard */}
        {user && (
          <SafeComponent name="N64FanLeaderboard">
            <div className="responsive-max-width">
              <div className="simple-tile">
                <N64FanLeaderboard 
                  maxEntries={5}
                  showFilters={false}
                  compact={true}
                />
              </div>
            </div>
          </SafeComponent>
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