import React, { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'

const HomePage: React.FC = () => {
  const { user, isLoading: userLoading } = useUser()
  const { t, currentLanguage, isLoading: langLoading } = useLanguage()

  // Debug translation loading
  console.log('🏠 HomePage render - simplified test:', { 
    currentLanguage, 
    langLoading, 
    homeWelcome: typeof t('home.welcome'),
    navHome: typeof t('nav.home'),
    tFunction: typeof t
  })

  // Show loading state while data is loading
  if (userLoading || langLoading) {
    return (
      <div className="container-lg space-responsive">
        <div className="text-center mb-6">
          <h1>Loading...</h1>
          <p>User Loading: {String(userLoading)}</p>
          <p>Language Loading: {String(langLoading)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-lg space-responsive">
      <div className="text-center mb-6">
        <h1>Battle64 - Simplified Test</h1>
        <p>Current Language: {currentLanguage}</p>
        <p>User: {user ? user.email || 'Anonymous' : 'Not logged in'}</p>
        <p>Welcome Message: {String(t('home.welcome'))}</p>
        <p>Nav Home: {String(t('nav.home'))}</p>
      </div>
    </div>
  )
}

export default HomePage