import { Routes, Route } from 'react-router-dom'
import { QuizProvider } from './contexts/QuizContext'
import { UserProvider } from './contexts/UserContext'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import QuizResultPage from './pages/QuizResultPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'
import MinigamesPage from './pages/MinigamesPage'
import Layout from './components/Layout'

function App() {
  return (
    <UserProvider>
      <QuizProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/quiz/result" element={<QuizResultPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/minigames" element={<MinigamesPage />} />
          </Routes>
        </Layout>
      </QuizProvider>
    </UserProvider>
  )
}

export default App