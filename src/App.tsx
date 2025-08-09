import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { UserProvider, useUser } from './contexts/UserContext'

console.log('🚀 App.tsx loading...')

function AppContent() {
  const { user, isAuthenticated, isLoading } = useUser()
  
  console.log('🔄 AppContent rendering, auth state:', { isAuthenticated, isLoading, hasUser: !!user })
  
  return (
    <div style={{ padding: '20px', color: 'white', background: '#1e293b', minHeight: '100vh' }}>
      <h1>🎮 Battle64 - Lightweight UserProvider!</h1>
      <p>✅ React + Lightweight UserProvider with lazy-loaded dependencies!</p>
      <div style={{ background: '#334155', padding: '15px', borderRadius: '8px', margin: '10px 0' }}>
        <h3>Auth Status:</h3>
        <p>🔄 Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>🔐 Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>👤 User: {user ? user.username || 'Unknown' : 'None'}</p>
        <p>📦 Dependencies: Lazy-loaded after React mounts</p>
      </div>
      <Routes>
        <Route path="/" element={
          <div>
            <h2>Home Page</h2>
            <p>Welcome to Battle64!</p>
            <p>Heavy dependencies (authService, supabase, logger) are loaded dynamically.</p>
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
  )
}

function App() {
  console.log('🔄 App component rendering...')
  
  useEffect(() => {
    console.log('✅ App component mounted!')
  }, [])

  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  )
}

console.log('✅ App component defined')
export default App