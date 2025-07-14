import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import GameStats from './pages/GameStats'
import Goals from './pages/Goals'
import History from './pages/History'
import Profile from './pages/Profile'
import { GameDataProvider } from './contexts/GameDataContext'

function App() {
  const [currentUser] = useState({
    id: '1',
    username: 'SpeedRunner64',
    avatar: '/api/avatars/default.png',
    joinDate: new Date('2023-01-15'),
    totalGames: 47,
    totalRuns: 284
  })

  return (
    <GameDataProvider>
      <div className="min-h-screen bg-retro-darker">
        <Navigation user={currentUser} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard user={currentUser} />} />
            <Route path="/stats/:gameId" element={<GameStats />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile user={currentUser} />} />
          </Routes>
        </main>
      </div>
    </GameDataProvider>
  )
}

export default App