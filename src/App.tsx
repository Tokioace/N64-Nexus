import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MessagingSystem from './components/MessagingSystem'
import './App.css'

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-retro-blue to-retro-purple">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-pixel text-white mb-2">
            🎮 Battle64
          </h1>
          <p className="text-xl font-retro text-retro-light">
            Direktnachrichten & Inbox System
          </p>
        </header>
        
        <Routes>
          <Route path="/" element={<MessagingSystem />} />
          <Route path="/inbox" element={<MessagingSystem />} />
        </Routes>
      </div>
    </div>
  )
}

export default App