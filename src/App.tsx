import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { UserProvider, useUser } from './contexts/UserContext'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'

console.log('🚀 App.tsx loading...')

function AppContent() {
  const { user, isAuthenticated, isLoading: userLoading } = useUser()
  const { currentLanguage, t, isLoading: langLoading } = useLanguage()
  
  console.log('🔄 AppContent rendering, state:', { 
    userAuth: isAuthenticated, 
    userLoading, 
    langLoading,
    language: currentLanguage,
    hasUser: !!user 
  })
  
  return (
    <div style={{ padding: '20px', color: 'white', background: '#1e293b', minHeight: '100vh' }}>
      <h1>🎮 Battle64 - With LanguageProvider!</h1>
      <p>✅ React + UserProvider + LanguageProvider with lazy loading!</p>
      
      <div style={{ background: '#334155', padding: '15px', borderRadius: '8px', margin: '10px 0' }}>
        <h3>System Status:</h3>
        <p>👤 User Loading: {userLoading ? 'Yes' : 'No'}</p>
        <p>🔐 Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>👤 User: {user ? user.username || 'Unknown' : 'None'}</p>
        <p>🌍 Language Loading: {langLoading ? 'Yes' : 'No'}</p>
        <p>🌍 Current Language: {currentLanguage}</p>
        <p>📝 Translation Test: {t('welcome', { name: 'Battle64' })}</p>
        <p>📦 Dependencies: Lazy-loaded after React mounts</p>
      </div>
      
      <Routes>
        <Route path="/" element={
          <div>
            <h2>Home Page</h2>
            <p>Welcome to Battle64!</p>
            <p>Both UserProvider and LanguageProvider are now lazy-loaded.</p>
            <p>Heavy dependencies load in background without blocking React.</p>
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
    <LanguageProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </LanguageProvider>
  )
}

console.log('✅ App component defined')
export default App