import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { UserProvider } from './contexts/UserContext'

console.log('🚀 App.tsx loading...')

function AppContent() {
  const { isLoading, t } = useLanguage()
  
  console.log('🔄 AppContent rendering, isLoading:', isLoading)
  
  if (isLoading) {
    return (
      <div style={{ padding: '20px', color: 'white', background: '#1e293b', minHeight: '100vh' }}>
        <h1>🔄 Loading translations...</h1>
        <p>Please wait while we load the language files...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', color: 'white', background: '#1e293b', minHeight: '100vh' }}>
      <h1>🎮 Battle64 - React App with Lazy LanguageProvider!</h1>
      <p>✅ React + Lazy LanguageProvider + UserProvider working!</p>
      <p>🌍 Translation test: {t('welcome', { name: 'Battle64' })}</p>
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