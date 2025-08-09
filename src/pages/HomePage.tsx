import React, { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useForum } from '../contexts/ForumContext'
import EventFeedWidget from '../components/EventFeedWidget'
import PointsWidget from '../components/PointsWidget'
import N64FanLeaderboard from '../components/N64FanLeaderboard'
import SingleNewsCard from '../components/SingleNewsCard'
import SingleMarketplaceCard from '../components/SingleMarketplaceCard'

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
  createdAt?: string
}

const HomePage: React.FC = () => {
  const { user, isLoading: userLoading } = useUser()
  const { t, currentLanguage, isLoading: langLoading } = useLanguage()
  const { threads, posts } = useForum()
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([])

  // Debug translation loading
  console.log('🏠 HomePage render - testing SingleMarketplaceCard:', { 
    currentLanguage, 
    langLoading, 
    homeWelcome: typeof t('home.welcome'),
    navHome: typeof t('nav.home'),
    tFunction: typeof t,
    postsCount: posts?.length || 0,
    threadsCount: threads?.length || 0,
    marketplaceItemsCount: marketplaceItems?.length || 0
  })

  // Load marketplace data (simulate what the original HomePage did)
  useEffect(() => {
    const loadMarketplaceData = () => {
      try {
        const savedMarketplace = localStorage.getItem('marketplace_items')
        console.log('📦 Loading marketplace data from localStorage:', savedMarketplace ? 'found data' : 'no data')
        
        if (savedMarketplace && savedMarketplace.trim() !== '') {
          let parsedMarketplace
          try {
            parsedMarketplace = JSON.parse(savedMarketplace) as MarketplaceItem[]
            if (!Array.isArray(parsedMarketplace)) {
              throw new Error('Invalid marketplace data format')
            }
          } catch (parseError) {
            console.error('❌ Error parsing marketplace data:', parseError)
            localStorage.removeItem('marketplace_items')
            throw parseError
          }
          
          const sortedMarketplace = parsedMarketplace
            .filter(item => item && item.id)
            .map((item: MarketplaceItem) => ({
              ...item,
              date: item.date ? new Date(item.date) : (item.createdAt ? new Date(item.createdAt) : new Date())
            }))
            .sort((a: MarketplaceItem, b: MarketplaceItem) => b.date.getTime() - a.date.getTime())
          
          console.log('✅ Loaded marketplace items:', sortedMarketplace.length)
          setMarketplaceItems(sortedMarketplace)
        } else {
          // Use fallback mock data
          const mockData = [
            { 
              id: '1', 
              title: 'Super Mario 64 - Mint Condition', 
              description: 'Original cartridge in mint condition with manual', 
              price: 89.99, 
              condition: 'Mint', 
              seller: 'RetroCollector', 
              date: new Date(Date.now() - 3600000), 
              category: 'Games', 
              images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTVFN0VCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPk1hcmlvIDY0PC90ZXh0Pjwvc3ZnPg=='] 
            }
          ]
          console.log('📦 Using fallback marketplace data')
          setMarketplaceItems(mockData)
        }
      } catch (error) {
        console.error('❌ Error loading marketplace data:', error)
        localStorage.removeItem('marketplace_items')
        setMarketplaceItems([])
      }
    }

    loadMarketplaceData()

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'marketplace_items') {
        console.log('🔄 Marketplace data changed in localStorage, reloading...')
        loadMarketplaceData()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Show loading state while data is loading
  if (userLoading || langLoading) {
    return (
      <div className="container-lg space-responsive">
        <div className="text-center mb-6">
          <h1>Loading...</h1>
          <p>User Loading: {String(userLoading)}</p>
          <p>Language Loading: {String(langLoading)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-lg space-responsive">
      <div className="text-center mb-6">
        <h1>Battle64 - Testing SingleMarketplaceCard</h1>
        <p>Current Language: {currentLanguage}</p>
        <p>User: {user ? user.email || 'Anonymous' : 'Not logged in'}</p>
        <p>Welcome Message: {String(t('home.welcome'))}</p>
        <p>Nav Home: {String(t('nav.home'))}</p>
        <p>Marketplace Items: {marketplaceItems.length}</p>
      </div>

      {/* Test EventFeedWidget */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">✅ EventFeedWidget (Working):</h2>
        <EventFeedWidget />
      </div>

      {/* Test PointsWidget */}
      {user && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">✅ PointsWidget (Working):</h2>
          <PointsWidget />
        </div>
      )}

      {/* Test SingleNewsCard */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">✅ SingleNewsCard (Working):</h2>
        <SingleNewsCard 
          newsItems={posts.slice(0, 5).map(post => ({
            id: post.id,
            title: post.content.substring(0, 50) + '...', 
            content: post.content,
            date: new Date(post.createdAt),
            type: 'community_news' as const
          }))}
          className="w-full"
        />
      </div>

      {/* Test N64FanLeaderboard */}
      {user && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">✅ N64FanLeaderboard (Working):</h2>
          <N64FanLeaderboard 
            maxEntries={5}
            showFilters={false}
            compact={true}
          />
        </div>
      )}

      {/* Test SingleMarketplaceCard - SUSPECTED CULPRIT */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">🧪 Testing SingleMarketplaceCard (SUSPECTED CULPRIT):</h2>
        <SingleMarketplaceCard 
          marketplaceItems={marketplaceItems}
          className="w-full"
        />
      </div>
    </div>
  )
}

export default HomePage