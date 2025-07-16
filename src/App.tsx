import { Routes, Route } from 'react-router-dom'
import { QuizProvider } from './contexts/QuizContext'
import { UserProvider } from './contexts/UserContext'
import { EventProvider } from './contexts/EventContext'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import QuizResultPage from './pages/QuizResultPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'
import MinigamesPage from './pages/MinigamesPage'
import EventsPage from './pages/EventsPage'
import Layout from './components/Layout'
import RetroSoundEffects from './components/RetroSoundEffects'

function App() {
  return (
    <UserProvider>
      <QuizProvider>
        <EventProvider>
          <RetroSoundEffects enabled={true} />
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/quiz/result" element={<QuizResultPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/minigames" element={<MinigamesPage />} />
              <Route path="/events" element={<EventsPage />} />
            </Routes>
          </Layout>
        </EventProvider>
      </QuizProvider>
    </UserProvider>
  )
}

export default App