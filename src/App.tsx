import { Routes, Route } from 'react-router-dom'
import { QuizProvider } from './contexts/QuizContext'
import { UserProvider } from './contexts/UserContext'
import { EventProvider } from './contexts/EventContext'
import { MediaProvider } from './contexts/MediaContext'
import { ForumProvider } from './contexts/ForumContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { PointsProvider } from './contexts/PointsContext'
import HomePage from './pages/HomePage'
import HomeScreenRetro from './components/HomeScreenRetro'
import AuthPage from './pages/AuthPage'
import CommunityPage from './pages/CommunityPage'
import QuizPage from './pages/QuizPage'
import QuizResultPage from './pages/QuizResultPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'
import MinigamesPage from './pages/MinigamesPage'
import EventsPage from './pages/EventsPage'
import SpeedrunMediaPage from './pages/SpeedrunMediaPage'
import CollectorMode from './pages/CollectorMode'
import MarketplacePage from './pages/MarketplacePage'
import ChatPage from './pages/ChatPage'
import ForumPage from './pages/ForumPage'
import ForumCategoryPage from './pages/ForumCategoryPage'
import ForumThreadPage from './pages/ForumThreadPage'
import ForumNewThreadPage from './pages/ForumNewThreadPage'
import NewsFeedPage from './pages/NewsFeedPage'
import FanArtPage from './pages/FanArtPage'
import TypographyShowcase from './components/TypographyShowcase'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'

function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <PointsProvider>
          <QuizProvider>
            <EventProvider>
              <MediaProvider>
                <ForumProvider>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/classic" element={<HomePage />} />
                      <Route path="/auth" element={<AuthPage />} />
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
                      <Route path="/typography-showcase" element={<TypographyShowcase />} />
                    </Routes>
                  </Layout>
                </ForumProvider>
              </MediaProvider>
            </EventProvider>
          </QuizProvider>
        </PointsProvider>
      </UserProvider>
    </LanguageProvider>
  )
}

export default App