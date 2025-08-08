import { Routes, Route } from 'react-router-dom'
import { QuizProvider } from './contexts/QuizContext'
import { UserProvider } from './contexts/UserContext'
import { EventProvider } from './contexts/EventContext'
import { MediaProvider } from './contexts/MediaContext'
import { ForumProvider } from './contexts/ForumContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { PointsProvider } from './contexts/PointsContext'
import { InteractionProvider } from './contexts/InteractionContext'
import { MapProvider } from './contexts/MapContext'
import HomePage from './pages/HomePage'
import HomeScreenRetro from './components/HomeScreenRetro'
import AuthPage from './pages/AuthPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import AccountDeletionPage from './pages/AccountDeletionPage'
import QuizResultPage from './pages/QuizResultPage'
import TypographyShowcase from './components/TypographyShowcase'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import OfflineIndicator from './components/OfflineIndicator'
import CookieConsent from './components/CookieConsent'
import React, { useEffect, useState } from 'react'
import { bugMonitorService } from './services/bugMonitorService'

// Import lazy components for code splitting
import {
  CommunityPage,
  QuizPage,
  LeaderboardPage,
  ProfilePage,
  MinigamesPage,
  EventsPage,
  SpeedrunMediaPage,
  CollectorMode,
  MarketplacePage,
  ChatPage,
  ForumPage,
  ForumCategoryPage,
  ForumThreadPage,
  ForumNewThreadPage,
  NewsFeedPage,
  FanArtPage,
  Battle64Map
} from './components/LazyComponents'

import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminGuard from './components/AdminGuard'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

function AdminRoute() {
  return (
    <AdminGuard>
      <ErrorBoundary>
        <AdminDashboardPage />
      </ErrorBoundary>
    </AdminGuard>
  )
}

function App() {
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences | null>(null)

  useEffect(() => {
    bugMonitorService.init()
  }, [])

  const handleCookieAccept = (preferences: CookiePreferences) => {
    setCookiePreferences(preferences)
    // Here you would typically initialize analytics, marketing scripts, etc.
    // based on the user's preferences
    console.log('Cookie preferences accepted:', preferences)
  }

  const handleCookieReject = () => {
    setCookiePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    })
    console.log('Cookies rejected - only necessary cookies will be used')
  }

  return (
      <LanguageProvider>
        <UserProvider>
          <PointsProvider>
            <InteractionProvider>
              <QuizProvider>
                <EventProvider>
                  <MediaProvider>
                    <ForumProvider>
                      <MapProvider>
                        <Layout>
                          <PWAInstallPrompt />
                          <OfflineIndicator />
                          <CookieConsent 
                            onAccept={handleCookieAccept}
                            onReject={handleCookieReject}
                          />
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/account/delete" element={<AccountDeletionPage />} />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/retro" element={<HomeScreenRetro />} />
                        <Route path="/quiz" element={<QuizPage />} />
                        <Route path="/quiz/result" element={<QuizResultPage />} />
                        <Route path="/leaderboard" element={<LeaderboardPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/profile/:userId" element={<ProfilePage />} />
                        <Route path="/minigames" element={<MinigamesPage />} />
                        <Route path="/events" element={<EventsPage />} />
                        <Route path="/speedrun-media" element={<SpeedrunMediaPage />} />
                        <Route path="/collector" element={<CollectorMode />} />
                        <Route path="/marktplatz" element={<MarketplacePage />} />
                        <Route path="/chat" element={<ChatPage />} />
                        <Route path="/forum" element={<ErrorBoundary><ForumPage /></ErrorBoundary>} />
                        <Route path="/forum/category/:categoryId" element={<ErrorBoundary><ForumCategoryPage /></ErrorBoundary>} />
                        <Route path="/forum/category/:categoryId/new-thread" element={<ErrorBoundary><ForumNewThreadPage /></ErrorBoundary>} />
                        <Route path="/forum/thread/:threadId" element={<ErrorBoundary><ForumThreadPage /></ErrorBoundary>} />
                        <Route path="/newsfeed" element={<NewsFeedPage />} />
                        <Route path="/fanart" element={<FanArtPage />} />
                        <Route path="/map" element={<Battle64Map />} />
                                                 <Route path="/typography-showcase" element={<TypographyShowcase />} />
                         <Route path="/admin" element={<AdminRoute />} />
                         </Routes>
                         </Layout>
</MapProvider>
                    </ForumProvider>
                  </MediaProvider>
                </EventProvider>
              </QuizProvider>
            </InteractionProvider>
          </PointsProvider>
        </UserProvider>
      </LanguageProvider>
    )
}

export default App