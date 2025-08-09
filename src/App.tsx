import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { UserProvider } from './contexts/UserContext'

console.log('🚀 App.tsx loading...')

function App() {
  console.log('🔄 App component rendering...')
  
  useEffect(() => {
    console.log('✅ App component mounted!')
  }, [])

  return (
    <LanguageProvider>
      <UserProvider>
        <div style={{ padding: '20px', color: 'white', background: '#1e293b', minHeight: '100vh' }}>
          <h1>🎮 Battle64 - React App with Basic Contexts!</h1>
          <p>✅ React + LanguageProvider + UserProvider working!</p>
          <Routes>
            <Route path="/" element={
              <div>
                <h2>Home Page</h2>
                <p>Welcome to Battle64!</p>
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
      </UserProvider>
    </LanguageProvider>
  )
}

console.log('✅ App component defined')
export default App