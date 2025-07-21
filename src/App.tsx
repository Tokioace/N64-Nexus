import { Routes, Route } from 'react-router-dom'
import { QuizProvider } from './contexts/QuizContext'
import { UserProvider } from './contexts/UserContext'
import { EventProvider } from './contexts/EventContext'
import { MediaProvider } from './contexts/MediaContext'
import { ForumProvider } from './contexts/ForumContext'
import { LanguageProvider } from './contexts/LanguageContext'
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
import ForumPage from './pages/ForumPage'
import ForumCategoryPage from './pages/ForumCategoryPage'
import ForumThreadPage from './pages/ForumThreadPage'
import ForumNewThreadPage from './pages/ForumNewThreadPage'
import NewsFeedPage from './pages/NewsFeedPage'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'

function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <QuizProvider>
          <EventProvider>
            <MediaProvider>
              <ForumProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomeScreenRetro />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/classic" element={<HomePage />} />
                    <Route path="/quiz" element={<QuizPage />} />
                    <Route path="/quiz/result" element={<QuizResultPage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profile/:userId" element={<ProfilePage />} />
                    <Route path="/minigames" element={<MinigamesPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/speedrun-media" element={<SpeedrunMediaPage />} />
                    <Route path="/collector" element={<CollectorMode />} />
                    <Route path="/forum" element={<ErrorBoundary><ForumPage /></ErrorBoundary>} />
                    <Route path="/forum/category/:categoryId" element={<ErrorBoundary><ForumCategoryPage /></ErrorBoundary>} />
                    <Route path="/forum/category/:categoryId/new-thread" element={<ErrorBoundary><ForumNewThreadPage /></ErrorBoundary>} />
                    <Route path="/forum/thread/:threadId" element={<ErrorBoundary><ForumThreadPage /></ErrorBoundary>} />
                    <Route path="/newsfeed" element={<NewsFeedPage />} />
                  </Routes>
                </Layout>
              </ForumProvider>
            </MediaProvider>
          </EventProvider>
        </QuizProvider>
      </UserProvider>
    </LanguageProvider>
  )
}

export default App