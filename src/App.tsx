import { Routes, Route } from 'react-router-dom'
import { QuizProvider } from './contexts/QuizContext'
import { UserProvider } from './contexts/UserContext'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import DuelPage from './pages/DuelPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <UserProvider>
      <QuizProvider>
        <div className="min-h-screen bg-retro-black">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/duel" element={<DuelPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
      </QuizProvider>
    </UserProvider>
  )
}

export default App