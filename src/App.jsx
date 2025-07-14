import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HighlightArchive from './components/HighlightArchive'
import HighlightDetail from './components/HighlightDetail'
import Profile from './components/Profile'
import { HighlightProvider } from './context/HighlightContext'

function App() {
  return (
    <HighlightProvider>
      <div className="min-h-screen bg-gradient-to-br from-retro-dark to-retro-darker">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HighlightArchive />} />
            <Route path="/highlight/:id" element={<HighlightDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </HighlightProvider>
  )
}

export default App