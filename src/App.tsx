import React, { useEffect, useState } from 'react'
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
                      <ErrorBoundary>
                        <Layout>
                          <Routes>
                            {/* Main Pages */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/retro" element={<HomeScreenRetro />} />
                            
                            {/* Authentication */}
                            <Route path="/auth" element={<AuthPage />} />
                            
                            {/* Legal Pages */}
                            <Route path="/terms" element={<TermsPage />} />
                            <Route path="/privacy" element={<PrivacyPage />} />
                            <Route path="/delete-account" element={<AccountDeletionPage />} />
                            
                            {/* Core Features */}
                            <Route path="/community" element={<CommunityPage />} />
                            <Route path="/quiz" element={<QuizPage />} />
                            <Route path="/quiz/result" element={<QuizResultPage />} />
                            <Route path="/leaderboard" element={<LeaderboardPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/profile/:userId" element={<ProfilePage />} />
                            <Route path="/minigames" element={<MinigamesPage />} />
                            
                            {/* Events & Media */}
                            <Route path="/events" element={<EventsPage />} />
                            <Route path="/speedrun-media" element={<SpeedrunMediaPage />} />
                            
                            {/* Collection & Trading */}
                            <Route path="/collector" element={<CollectorMode />} />
                            <Route path="/marketplace" element={<MarketplacePage />} />
                            
                            {/* Communication */}
                            <Route path="/chat" element={<ChatPage />} />
                            <Route path="/forum" element={<ForumPage />} />
                            <Route path="/forum/:categoryId" element={<ForumCategoryPage />} />
                            <Route path="/forum/:categoryId/:threadId" element={<ForumThreadPage />} />
                            <Route path="/forum/:categoryId/new" element={<ForumNewThreadPage />} />
                            
                            {/* Content */}
                            <Route path="/news" element={<NewsFeedPage />} />
                            <Route path="/fanart" element={<FanArtPage />} />
                            
                            {/* Map */}
                            <Route path="/map" element={<Battle64Map />} />
                            
                            {/* Admin */}
                            <Route path="/admin" element={<AdminRoute />} />
                            
                            {/* Development/Debug */}
                            <Route path="/typography" element={<TypographyShowcase />} />
                            
                            {/* 404 */}
                            <Route path="*" element={
                              <div style={{ padding: '20px', textAlign: 'center' }}>
                                <h1>404 - Page Not Found</h1>
                                <p>The page you're looking for doesn't exist.</p>
                              </div>
                            } />
                          </Routes>
                          
                          {/* Global Components */}
                          <PWAInstallPrompt />
                          <OfflineIndicator />
                          {cookiePreferences === null && (
                            <CookieConsent
                              onAccept={handleCookieAccept}
                              onReject={handleCookieReject}
                            />
                          )}
                        </Layout>
                      </ErrorBoundary>
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