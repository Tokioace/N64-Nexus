import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import RetroNavigation3D from './RetroNavigation3D'
import RetroButton3D from './RetroButton3D'
import RetroCard3D from './RetroCard3D'
import RetroIntroAnimation from './RetroIntroAnimation'
import { User as UserIcon } from 'lucide-react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser()
  const [showIntro, setShowIntro] = useState(!user)

  const handleIntroComplete = () => {
    setShowIntro(false)
  }

  if (!user) {
    return (
      <>
        {showIntro && (
          <RetroIntroAnimation 
            onComplete={handleIntroComplete}
            skipIntro={false}
          />
        )}
        <div className="min-h-screen bg-n64-gray flex items-center justify-center retro-grid">
          <div className="perspective-1000">
            <RetroCard3D
              title="Battle64 Quiz"
              icon={UserIcon}
              variant="primary"
              size="lg"
              hover3D={true}
              className="max-w-md w-full mx-4 animate-float"
            >
              <LoginForm />
            </RetroCard3D>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-n64-gray retro-grid scanlines">
      <main className="pb-20 md:pb-24">
        {children}
      </main>
      
      {/* 3D Navigation */}
      <RetroNavigation3D />
    </div>
  )
}



const LoginForm: React.FC = () => {
  const { login } = useUser()
  const [username, setUsername] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      login(username.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="username" className="block text-sm font-game mb-3 text-white/90">
          Benutzername
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-n64-purple focus:border-n64-purple/50 transition-all duration-300 font-game text-sm backdrop-blur-sm"
          placeholder="Dein Spielername"
          required
        />
      </div>
      <RetroButton3D
        variant="primary"
        size="lg"
        onClick={handleSubmit}
        className="w-full"
      >
        Spiel starten
      </RetroButton3D>
    </form>
  )
}

export default Layout