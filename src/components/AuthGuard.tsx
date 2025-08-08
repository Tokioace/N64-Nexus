import React from 'react'
import { useUser } from '../contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import { Gamepad2, LogIn } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useUser()
  const navigate = useNavigate()

  // Zeige Loading während Auth-Status geladen wird
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 animate-pulse">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-300">Authentifizierung wird überprüft...</p>
        </div>
      </div>
    )
  }

  // Wenn nicht authentifiziert, zeige Fallback oder Login-Aufforderung
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
        <div className="simple-tile p-8 text-center max-w-md w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            Anmeldung erforderlich
          </h2>
          <p className="text-slate-300 mb-6">
            Du musst angemeldet sein, um diese Seite zu besuchen.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Jetzt anmelden
          </button>
        </div>
      </div>
    )
  }

  // Wenn authentifiziert, zeige geschützten Inhalt
  return <>{children}</>
}

export default AuthGuard