import React, { ReactNode } from 'react'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Link } from 'react-router-dom'
import { Lock, LogIn, UserPlus } from 'lucide-react'

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
  blurContent?: boolean
  showLoginPrompt?: boolean
  customMessage?: string
  className?: string
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  blurContent = true,
  showLoginPrompt = true,
  customMessage,
  className = ''
}) => {
  const { isAuthenticated } = useUser()
  const { t } = useLanguage()

  if (!requireAuth || isAuthenticated) {
    return <>{children}</>
  }

  const message = customMessage || t('auth.loginRequiredMessage')

  return (
    <div className={`relative ${className}`}>
      {/* Blurred Content */}
      {blurContent && (
        <div className="filter blur-md pointer-events-none select-none">
          {children}
        </div>
      )}
      
      {/* Overlay */}
      <div className={`${blurContent ? 'absolute inset-0' : ''} flex items-center justify-center ${blurContent ? 'bg-slate-900/80' : 'bg-slate-800/50 rounded-lg p-8'}`}>
        <div className="text-center max-w-md mx-auto p-6 bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-700">
          <Lock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          
          <h3 className="text-xl font-bold text-slate-100 mb-2">
            {t('auth.loginRequired')}
          </h3>
          
          <p className="text-slate-400 mb-6">
            {message}
          </p>
          
          {showLoginPrompt && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/auth"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                <LogIn className="w-4 h-4" />
                {t('auth.login')}
              </Link>
              <Link
                to="/auth"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors font-medium"
              >
                <UserPlus className="w-4 h-4" />
                {t('auth.register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthGuard