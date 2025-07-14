import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import ProfilePage from '@/pages/ProfilePage'
import SpeedrunsPage from '@/pages/SpeedrunsPage'
import EventsPage from '@/pages/EventsPage'
import LeaderboardPage from '@/pages/LeaderboardPage'

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="speedruns" element={<SpeedrunsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
      </Route>
    </Routes>
  )
}

export default AppRouter