import { Routes, Route } from 'react-router-dom'
import { QuizProvider } from './contexts/QuizContext'
import { UserProvider } from './contexts/UserContext'
import { EventProvider } from './contexts/EventContext'
import { MediaProvider } from './contexts/MediaContext'
import { ForumProvider } from './contexts/ForumContext'
import HomePage from './pages/HomePage'
import HomeScreenRetro from './components/HomeScreenRetro'
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
                  <Route path="/" element={<HomeScreenRetro />} />
                  <Route path="/classic" element={<HomePage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/quiz/result" element={<QuizResultPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/minigames" element={<MinigamesPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/speedrun-media" element={<SpeedrunMediaPage />} />
                  <Route path="/collector" element={<CollectorMode />} />
                  <Route path="/forum" element={<ForumPage />} />
                  <Route path="/forum/category/:categoryId" element={<ForumCategoryPage />} />
                  <Route path="/forum/category/:categoryId/new-thread" element={<ForumNewThreadPage />} />
                  <Route path="/forum/thread/:threadId" element={<ForumThreadPage />} />
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