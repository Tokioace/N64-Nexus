import { Routes, Route } from 'react-router-dom'
import { QuizProvider } from './contexts/QuizContext'
import { UserProvider } from './contexts/UserContext'

import { EventProvider } from './contexts/EventContext'
import { MediaProvider } from './contexts/MediaContext'
import { ForumProvider } from './contexts/ForumContext'
import HomePage from './pages/HomePage'
import HomeScreenRetro from './components/HomeScreenRetro'
import N64SpeedrunHub from './pages/N64SpeedrunHub'
import N64TracksPage from './pages/N64TracksPage'
import QuizPage from './pages/QuizPage'
import QuizResultPage from './pages/QuizResultPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'
import SpeedrunChallengesPage from './pages/MinigamesPage'
import EventsPage from './pages/EventsPage'
import SpeedrunMediaPage from './pages/SpeedrunMediaPage'
import CollectorMode from './pages/CollectorMode'
import ForumPage from './pages/ForumPage'
import ForumCategoryPage from './pages/ForumCategoryPage'
import ForumThreadPage from './pages/ForumThreadPage'
import ForumNewThreadPage from './pages/ForumNewThreadPage'
import N64CameraCreatorPage from './pages/N64CameraCreatorPage'
import EventFeaturesDemo from './pages/EventFeaturesDemo'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'

function App() {
  return (
    <UserProvider>
      <QuizProvider>
        <EventProvider>
          <MediaProvider>
            <ForumProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<N64SpeedrunHub />} />
                  <Route path="/classic" element={<HomeScreenRetro />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/tracks" element={<N64TracksPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/quiz/result" element={<QuizResultPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/minigames" element={<SpeedrunChallengesPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/speedrun-media" element={<SpeedrunMediaPage />} />
                  <Route path="/collector" element={<CollectorMode />} />
                  <Route path="/forum" element={<ErrorBoundary><ForumPage /></ErrorBoundary>} />
                  <Route path="/forum/category/:categoryId" element={<ErrorBoundary><ForumCategoryPage /></ErrorBoundary>} />
                  <Route path="/forum/category/:categoryId/new-thread" element={<ErrorBoundary><ForumNewThreadPage /></ErrorBoundary>} />
                  <Route path="/forum/thread/:threadId" element={<ErrorBoundary><ForumThreadPage /></ErrorBoundary>} />
                  <Route path="/n64-camera" element={<N64CameraCreatorPage />} />
                  <Route path="/event-features-demo" element={<EventFeaturesDemo />} />
                </Routes>
              </Layout>
            </ForumProvider>
          </MediaProvider>
        </EventProvider>
      </QuizProvider>
    </UserProvider>
  )
}

export default App