import React from 'react'
import { useUser } from '../contexts/UserContext'
import SimpleButton from './SimpleButton'
import SimpleCard from './SimpleCard'
import { User as UserIcon } from 'lucide-react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser()

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <SimpleCard size="lg" className="shadow-xl border-slate-600">
            <div className="text-center mb-6">
              <UserIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Battle64 Quiz</h2>
              <p className="text-slate-300">Melde dich an, um zu spielen</p>
            </div>
            <LoginForm />
          </SimpleCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <main className="pb-20 md:pb-24 relative z-10">
        {children}
      </main>
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
        <label htmlFor="username" className="block text-sm font-medium mb-2 text-slate-200">
          Benutzername
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          placeholder="Dein Spielername"
          required
        />
      </div>
      <SimpleButton
        variant="primary"
        size="lg"
        onClick={() => handleSubmit(new Event('click') as any)}
        className="w-full"
      >
        Spiel starten
      </SimpleButton>
    </form>
  )
}

export default Layout