import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Shield, User, Lock, Smartphone } from 'lucide-react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(username, password, twoFactorCode)
      if (success) {
        navigate('/')
      } else {
        setError('Ungültige Anmeldedaten oder 2FA-Code')
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-retro-dark">
      <div className="admin-card w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-retro-green" />
          </div>
          <h1 className="text-3xl font-retro text-retro-green mb-2">
            BATTLE64
          </h1>
          <p className="text-retro-blue font-pixel">
            Admin Panel & Steuerzentrale
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-retro-red bg-opacity-20 border border-retro-red text-retro-red px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-retro-green font-bold mb-2">
              <User className="inline w-4 h-4 mr-2" />
              Benutzername
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-input w-full"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-retro-green font-bold mb-2">
              <Lock className="inline w-4 h-4 mr-2" />
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input w-full"
              placeholder="••••••••"
              required
            />
          </div>

          {showTwoFactor && (
            <div>
              <label className="block text-retro-green font-bold mb-2">
                <Smartphone className="inline w-4 h-4 mr-2" />
                2FA-Code
              </label>
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="admin-input w-full"
                placeholder="123456"
                maxLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="admin-button w-full py-3 text-lg font-retro disabled:opacity-50"
          >
            {isLoading ? 'ANMELDUNG...' : 'ANMELDEN'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-retro-light-gray">
          <p>Demo-Zugang:</p>
          <p className="font-pixel">Benutzer: admin</p>
          <p className="font-pixel">Passwort: battle64</p>
        </div>
      </div>
    </div>
  )
}