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

  if (!isAuthenticated && requireAuth) {
    return (
      <div className={`simple-tile text-center py-12 ${className}`}>
        <LogIn className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-300 mb-2">
          {t('auth.loginRequired')}
        </h3>
        <p className="text-slate-400 mb-6">
          {customMessage || t('auth.loginRequiredMessage')}
        </p>
        {showLoginPrompt && (
          <Link 
            to="/auth" 
            className="btn-primary inline-flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {t('auth.loginHere')}
          </Link>
        )}
      </div>
    )
  }

  if (!isAuthenticated && !requireAuth && blurContent) {
    return (
      <div className={`relative ${className}`}>
        <div className="filter blur-sm pointer-events-none">
          {children}
        </div>
        {showLoginPrompt && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="simple-tile text-center p-8">
              <Lock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-4">
                {customMessage || t('auth.enhancedExperienceMessage')}
              </h3>
              <Link 
                to="/auth" 
                className="btn-primary inline-flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {t('auth.loginHere')}
              </Link>
            </div>
          </div>
        )}
      </div>
    )
  }

  return <>{children}</>
}

export default AuthGuard