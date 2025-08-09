import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import { PointsProvider } from './contexts/PointsContext'
import { InteractionProvider } from './contexts/InteractionContext'

console.log('🚀 App.tsx loading...')

function App() {
  console.log('🔄 App component rendering...')
  
  useEffect(() => {
    console.log('✅ App component mounted!')
  }, [])

  return (
    <UserProvider>
      <PointsProvider>
        <InteractionProvider>
          <div style={{ padding: '20px', color: 'white', background: '#1e293b', minHeight: '100vh' }}>
            <h1>🎮 Battle64 - Testing Multiple Contexts!</h1>
            <p>✅ React + UserProvider + PointsProvider + InteractionProvider working!</p>
            <Routes>
              <Route path="/" element={
                <div>
                  <h2>Home Page</h2>
                  <p>Welcome to Battle64!</p>
                  <p>Testing without LanguageProvider...</p>
                </div>
              } />
              <Route path="*" element={
                <div>
                  <h2>404 - Page Not Found</h2>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              } />
            </Routes>
          </div>
        </InteractionProvider>
      </PointsProvider>
    </UserProvider>
  )
}

console.log('✅ App component defined')
export default App