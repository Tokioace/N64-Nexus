import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react'
import { Routes, Route } from 'react-router-dom'

console.log('🚀 App.tsx loading...')

// Minimal UserContext inline to test
interface MinimalUserContextType {
  isLoading: boolean
  user: string | null
}

const MinimalUserContext = createContext<MinimalUserContextType | undefined>(undefined)

const useMinimalUser = () => {
  const context = useContext(MinimalUserContext)
  if (!context) {
    throw new Error('useMinimalUser must be used within MinimalUserProvider')
  }
  return context
}

const MinimalUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<string | null>(null)

  console.log('🔄 MinimalUserProvider rendering...')

  // Test if ANY useEffect in the provider blocks React
  useEffect(() => {
    console.log('✅ MinimalUserProvider useEffect running (after React mount)')
    setIsLoading(true)
    
    // Simulate async work without Supabase
    setTimeout(() => {
      console.log('✅ Simulated async work complete')
      setUser('Test User')
      setIsLoading(false)
    }, 1000)
  }, [])

  const value: MinimalUserContextType = {
    isLoading,
    user
  }

  return (
    <MinimalUserContext.Provider value={value}>
      {children}
    </MinimalUserContext.Provider>
  )
}

function AppContent() {
  const { user, isLoading } = useMinimalUser()
  
  console.log('🔄 AppContent rendering, state:', { isLoading, user })
  
  return (
    <div style={{ padding: '20px', color: 'white', background: '#1e293b', minHeight: '100vh' }}>
      <h1>🎮 Battle64 - Minimal UserProvider Test!</h1>
      <p>✅ React + Minimal inline UserProvider!</p>
      <div style={{ background: '#334155', padding: '15px', borderRadius: '8px', margin: '10px 0' }}>
        <h3>Minimal Auth Status:</h3>
        <p>🔄 Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>👤 User: {user || 'None'}</p>
      </div>
      <Routes>
        <Route path="/" element={
          <div>
            <h2>Home Page</h2>
            <p>Welcome to Battle64!</p>
            <p>Testing if ANY UserProvider blocks React mounting.</p>
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
    <MinimalUserProvider>
      <AppContent />
    </MinimalUserProvider>
  )
}

console.log('✅ App component defined')
export default App