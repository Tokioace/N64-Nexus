import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

console.log('🚀 App.tsx loading...')

function App() {
  console.log('🔄 App component rendering...')
  
  useEffect(() => {
    console.log('✅ App component mounted!')
  }, [])

  return (
    <div style={{ padding: '20px', color: 'white', background: '#1e293b', minHeight: '100vh' }}>
      <h1>🎮 Battle64 - React App Loaded Successfully!</h1>
      <p>✅ React is working properly!</p>
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

console.log('✅ App component defined')
export default App