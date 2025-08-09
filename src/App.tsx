import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { UserProvider, useUser } from './contexts/UserContext'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { PointsProvider, usePoints } from './contexts/PointsContext'

console.log('🚀 App.tsx loading...')

function AppContent() {
  const { user, isAuthenticated, isLoading: userLoading } = useUser()
  const { currentLanguage, t, isLoading: langLoading } = useLanguage()
  const { userPoints, loading: pointsLoading } = usePoints()
  
  console.log('🔄 AppContent rendering, state:', { 
    userAuth: isAuthenticated, 
    userLoading, 
    langLoading,
    pointsLoading,
    language: currentLanguage,
    hasUser: !!user,
    points: userPoints?.totalPoints || 0
  })
  
  return (
    <div style={{ padding: '20px', color: 'white', background: '#1e293b', minHeight: '100vh' }}>
      <h1>🎮 Battle64 - With PointsProvider!</h1>
      <p>✅ React + UserProvider + LanguageProvider + PointsProvider!</p>
      
      <div style={{ background: '#334155', padding: '15px', borderRadius: '8px', margin: '10px 0' }}>
        <h3>System Status:</h3>
        <p>👤 User Loading: {userLoading ? 'Yes' : 'No'}</p>
        <p>🔐 Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>👤 User: {user ? user.username || 'Unknown' : 'None'}</p>
        <p>🌍 Language Loading: {langLoading ? 'Yes' : 'No'}</p>
        <p>🌍 Current Language: {currentLanguage}</p>
        <p>📝 Translation Test: {t('welcome', { name: 'Battle64' })}</p>
        <p>🏆 Points Loading: {pointsLoading ? 'Yes' : 'No'}</p>
        <p>🏆 Total Points: {userPoints?.totalPoints || 0}</p>
        <p>🏆 Current Rank: {userPoints?.currentRank?.key || 'N/A'}</p>
        <p>📦 Dependencies: Lazy-loaded after React mounts</p>
      </div>
      
      <Routes>
        <Route path="/" element={
          <div>
            <h2>Home Page</h2>
            <p>Welcome to Battle64!</p>
            <p>UserProvider, LanguageProvider, and PointsProvider are all working.</p>
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
        <PointsProvider>
          <AppContent />
        </PointsProvider>
      </UserProvider>
    </LanguageProvider>
  )
}

console.log('✅ App component defined')
export default App