import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Battle64Gallery from './components/Battle64Gallery'
import Header from './components/Header'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-n64-dark via-n64-purple/10 to-n64-blue/10">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Battle64Gallery />} />
            <Route path="/gallery" element={<Battle64Gallery />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App