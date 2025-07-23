import React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { LogIn } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  customMessage?: string
  className?: string
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  customMessage, 
  className = '' 
}) => {
  const { isAuthenticated } = useUser()
  const { t } = useLanguage()

  if (!isAuthenticated) {
    return (
      <div className={`simple-tile text-center py-12 ${className}`}>
        <LogIn className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-300 mb-2">
          {t('auth.loginRequired')}
        </h3>
        <p className="text-slate-400 mb-6">
          {customMessage || t('auth.loginRequiredMessage')}
        </p>
        <Link 
          to="/auth" 
          className="btn-primary inline-flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          {t('auth.loginHere')}
        </Link>
      </div>
    )
  }

  return <>{children}</>
}

export default AuthGuard