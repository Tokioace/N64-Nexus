import React, { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useForum } from '../contexts/ForumContext'
import EventFeedWidget from '../components/EventFeedWidget'
import PointsWidget from '../components/PointsWidget'
import N64FanLeaderboard from '../components/N64FanLeaderboard'
import SingleNewsCard from '../components/SingleNewsCard'

const HomePage: React.FC = () => {
  const { user, isLoading: userLoading } = useUser()
  const { t, currentLanguage, isLoading: langLoading } = useLanguage()
  const { threads, posts } = useForum()

  // Debug translation loading
  console.log('🏠 HomePage render - testing more components:', { 
    currentLanguage, 
    langLoading, 
    homeWelcome: typeof t('home.welcome'),
    navHome: typeof t('nav.home'),
    tFunction: typeof t,
    postsCount: posts?.length || 0,
    threadsCount: threads?.length || 0
  })

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
        <h1>Battle64 - Testing More Components</h1>
        <p>Current Language: {currentLanguage}</p>
        <p>User: {user ? user.email || 'Anonymous' : 'Not logged in'}</p>
        <p>Welcome Message: {String(t('home.welcome'))}</p>
        <p>Nav Home: {String(t('nav.home'))}</p>
      </div>

      {/* Test EventFeedWidget */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">✅ EventFeedWidget (Working):</h2>
        <EventFeedWidget />
      </div>

      {/* Test PointsWidget */}
      {user && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">🧪 Testing PointsWidget:</h2>
          <PointsWidget />
        </div>
      )}

      {/* Test SingleNewsCard */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">🧪 Testing SingleNewsCard:</h2>
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
          <h2 className="text-lg font-bold mb-4">🧪 Testing N64FanLeaderboard:</h2>
          <N64FanLeaderboard 
            maxEntries={5}
            showFilters={false}
            compact={true}
          />
        </div>
      )}
    </div>
  )
}

export default HomePage