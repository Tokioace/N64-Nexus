import React, { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useForum } from '../contexts/ForumContext'
import EventFeedWidget from '../components/EventFeedWidget'
import PointsWidget from '../components/PointsWidget'
import N64FanLeaderboard from '../components/N64FanLeaderboard'
import SingleNewsCard from '../components/SingleNewsCard'
import SingleForumCard from '../components/SingleForumCard'
import SingleFanArtCard from '../components/SingleFanArtCard'
import SingleMediaCard from '../components/SingleMediaCard'
import SingleRecordCard from '../components/SingleRecordCard'
import SingleMarketplaceCard from '../components/SingleMarketplaceCard'

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
  date?: Date // Add date property for backward compatibility
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

interface MarketplaceItem {
  id: string
  title: string
  description: string
  price: number
  condition: string
  seller: string
  date: Date
  category: string
  images?: string[]
  image?: string
  createdAt?: string // Add createdAt property for backward compatibility
}

const HomePage: React.FC = () => {
  const { user } = useUser()
  const { t, currentLanguage } = useLanguage()
  const { threads, posts } = useForum()

  // Load FanArt data from localStorage or use mock data
  const [fanArtItems, setFanArtItems] = useState<FanArtItem[]>([])
  
  // Load Marketplace data from localStorage
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([])
  
  // Load other data from localStorage or use mock data
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

  // Load FanArt data from localStorage on component mount
  useEffect(() => {
    const loadFanArtData = () => {
      try {
        const savedFanArt = localStorage.getItem('fanart_items')
        if (savedFanArt) {
          const parsedFanArt = JSON.parse(savedFanArt) as FanArtItem[]
          // Sort by date (newest first) and convert date strings back to Date objects
          const sortedFanArt = parsedFanArt
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
          // Use fallback mock data if no saved data exists
          setFanArtItems([
            { id: '1', title: 'Mario in Peach\'s Castle', artist: 'PixelArtist64', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2QjZCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPk1hcmlvIEFydDwvdGV4dD48L3N2Zz4=', likes: 234, views: 1250, game: 'Super Mario 64', createdAt: new Date() },
            { id: '2', title: 'Link vs Ganondorf Epic Battle', artist: 'ZeldaDrawer', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEVDREMxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPlplbGRhIEFydDwvdGV4dD48L3N2Zz4=', likes: 189, views: 980, game: 'Ocarina of Time', createdAt: new Date(Date.now() - 86400000) },
            { id: '3', title: 'Banjo & Kazooie Adventure', artist: 'RetroSketch', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDVCN0QxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkJhbmpvIEFydDwvdGV4dD48L3N2Zz4=', likes: 156, views: 750, game: 'Banjo-Kazooie', createdAt: new Date(Date.now() - 172800000) }
          ])
        }
      } catch (error) {
        console.error('Error loading fanart data:', error)
        // Use fallback data on error
        setFanArtItems([
          { id: '1', title: 'Mario in Peach\'s Castle', artist: 'PixelArtist64', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2QjZCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPk1hcmlvIEFydDwvdGV4dD48L3N2Zz4=', likes: 234, views: 1250, game: 'Super Mario 64', createdAt: new Date() }
        ])
      }
    }

    const loadMarketplaceData = () => {
      try {
        const savedMarketplace = localStorage.getItem('marketplace_items')
        if (savedMarketplace) {
          const parsedMarketplace = JSON.parse(savedMarketplace) as MarketplaceItem[]
          // Sort by date (newest first) and convert date strings back to Date objects
          const sortedMarketplace = parsedMarketplace
            .map((item: MarketplaceItem) => ({
              ...item,
              date: item.date ? new Date(item.date) : (item.createdAt ? new Date(item.createdAt) : new Date())
            }))
            .sort((a: MarketplaceItem, b: MarketplaceItem) => b.date.getTime() - a.date.getTime())
          setMarketplaceItems(sortedMarketplace)
        } else {
          // Use fallback mock data if no saved data exists
          setMarketplaceItems([
            { id: '1', title: 'Super Mario 64 - Mint Condition', description: 'Original cartridge in mint condition with manual', price: 89.99, condition: 'Mint', seller: 'RetroCollector', date: new Date(Date.now() - 3600000), category: 'Games', images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTVFN0VCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPk1hcmlvIDY0PC90ZXh0Pjwvc3ZnPg=='] },
            { id: '2', title: 'N64 Controller - Original Nintendo', description: 'Official Nintendo controller in very good condition', price: 34.50, condition: 'Very Good', seller: 'ControllerKing', date: new Date(Date.now() - 7200000), category: 'Accessories', images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTVFN0VCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkNvbnRyb2xsZXI8L3RleHQ+PC9zdmc+'] },
            { id: '3', title: 'GoldenEye 007 - Complete in Box', description: 'Complete game with box, manual, and cartridge', price: 125.00, condition: 'Good', seller: 'GameVault', date: new Date(Date.now() - 10800000), category: 'Games', images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTVFN0VCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkdvbGRlbkV5ZTwvdGV4dD48L3N2Zz4='] }
          ])
        }
      } catch (error) {
        console.error('Error loading marketplace data:', error)
        // Use fallback data on error
        setMarketplaceItems([
          { id: '1', title: 'Super Mario 64 - Mint Condition', description: 'Original cartridge in mint condition with manual', price: 89.99, condition: 'Mint', seller: 'RetroCollector', date: new Date(Date.now() - 3600000), category: 'Games' }
        ])
      }
    }

    loadFanArtData()
    loadMarketplaceData()

    // Listen for data updates
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

  // Convert forum threads to the format expected by SingleForumCard with enhanced data
  const forumThreads: ForumThread[] = threads
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 10) // Take top 10 most recent
    .map(thread => {
      // Find the latest post for this thread
      const threadPosts = posts.filter(post => post.threadId === thread.id)
      const latestPost = threadPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
      
      return {
        id: thread.id,
        title: thread.title,
        author: thread.authorName, // Use authorName instead of authorId
        replies: thread.postCount, // Use postCount for replies
        lastActivity: new Date(thread.lastUpdated), // Use lastUpdated
        category: thread.categoryId, // Use categoryId instead of category
        lastPostContent: latestPost?.content,
        lastPostAuthor: latestPost?.authorName
      }
    })

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
          <span>{formatDate(new Date())}</span>
          <span className="hidden sm:inline">•</span>
          <span>{formatTime(new Date())}</span>
        </div>
      </div>

      {/* LIVE EVENTS SECTION - TOP PRIORITY */}
      <div className="mb-responsive responsive-max-width">
        <EventFeedWidget />
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
          <h2 className="text-responsive-lg font-bold text-slate-100 mb-responsive">
            {t('home.newsTitle')}
          </h2>
          <SingleNewsCard 
            newsItems={posts.slice(0, 8).map(post => ({
              id: post.id,
              title: post.content.substring(0, 50) + '...', // Use first 50 chars of content as title
              content: post.content,
              date: new Date(post.createdAt),
              type: 'community_news' as const
            }))}
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