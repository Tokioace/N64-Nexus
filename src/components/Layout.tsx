import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { Home, Brain, Trophy, User, Gamepad2 } from 'lucide-react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser()
  const location = useLocation()

  if (!user) {
    return (
      <div className="min-h-screen bg-n64-gray flex items-center justify-center">
        <div className="card max-w-md w-full mx-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-shadow">
            🎮 Battle64 Quiz
          </h1>
          <LoginForm />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-n64-gray">
      <main className="pb-20">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-n64-gray/90 backdrop-blur-sm border-t border-white/20">
        <div className="flex justify-around items-center py-2">
          <NavLink to="/" icon={Home} label="Home" />
          <NavLink to="/quiz" icon={Brain} label="Quiz" />
          <NavLink to="/minigames" icon={Gamepad2} label="Minigames" />
          <NavLink to="/leaderboard" icon={Trophy} label="Rangliste" />
          <NavLink to="/profile" icon={User} label="Profil" />
        </div>
      </nav>
    </div>
  )
}

const NavLink: React.FC<{ to: string; icon: React.ComponentType<any>; label: string }> = ({ 
  to, 
  icon: Icon, 
  label 
}) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'text-n64-purple bg-white/10' 
          : 'text-white/70 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={20} />
      <span className="text-xs mt-1">{label}</span>
    </Link>
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-2">
          Benutzername
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-n64-purple focus:border-transparent"
          placeholder="Dein Spielername"
          required
        />
      </div>
      <button
        type="submit"
        className="btn-primary w-full"
      >
        Spiel starten
      </button>
    </form>
  )
}

export default Layout