import React, { ReactNode, useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import RankingBar from './RankingBar'
import { useUser } from '../contexts/UserContext'
import { usePoints } from '../contexts/PointsContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Link } from 'react-router-dom'
import { Trophy, Zap } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { user, isAuthenticated } = useUser()
  const { userPoints } = usePoints()
  const { t } = useLanguage()

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false)
  }

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = '0'
      document.body.style.left = '0'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      document.body.style.left = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      document.body.style.left = ''
    }
  }, [isMobileSidebarOpen, isMobile])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileSidebarOpen && isMobile) {
        const sidebar = document.querySelector('.sidebar')
        const menuButton = document.querySelector('.mobile-menu-button')
        
        if (sidebar && menuButton && 
            !sidebar.contains(event.target as Node) && 
            !menuButton.contains(event.target as Node)) {
          closeMobileSidebar()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileSidebarOpen, isMobile])

  return (
    <div className="flex min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 responsive-overflow-hidden responsive-max-width safe-area-padding">
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeMobileSidebar}
          style={{ touchAction: 'none' }}
        />
      )}
      
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileSidebar}
        className="mobile-menu-button fixed z-50 lg:hidden bg-slate-800/90 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-slate-700 transition-all duration-200 border border-slate-600 flex items-center justify-center"
        style={{
          top: 'clamp(0.5rem, 2vw, 1rem)',
          left: 'clamp(0.5rem, 2vw, 1rem)',
          width: 'clamp(44px, 10vw, 52px)',
          height: 'clamp(44px, 10vw, 52px)',
          padding: 'clamp(0.5rem, 1.5vw, 0.75rem)'
        }}
        aria-label={t('aria.toggleMobileMenu')}
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ width: 'clamp(20px, 4vw, 24px)', height: 'clamp(20px, 4vw, 24px)' }}
        >
          {isMobileSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* User Profile Icon - Responsive fixed position */}
      {isAuthenticated && user && (
        <Link 
          to="/profile" 
          className="fixed z-50 flex items-center justify-center rounded-full bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700/90 transition-all duration-200 border border-slate-600 shadow-lg group"
          style={{
            top: 'clamp(0.5rem, 2vw, 1rem)',
            right: 'clamp(0.5rem, 2vw, 1rem)',
            width: 'clamp(44px, 10vw, 52px)',
            height: 'clamp(44px, 10vw, 52px)'
          }}
          title={`${user.username} - Level ${user.level}`}
        >
          <div 
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-medium text-white group-hover:scale-105 transition-transform shadow-inner"
            style={{
              width: 'clamp(24px, 6vw, 32px)',
              height: 'clamp(24px, 6vw, 32px)',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
            }}
          >
            {user.avatar || '🎮'}
          </div>
        </Link>
      )}

      {/* Ranking Bar - Fixed between sidebar and user icons */}
      <RankingBar />

      <Sidebar isOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} />
      
      <div className="flex-1 lg:ml-64 min-h-screen min-h-[100dvh] responsive-max-width responsive-overflow-hidden">
        {/* Header - Desktop only */}
        <header className="hidden lg:flex items-center justify-between bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 responsive-max-width" style={{ padding: 'clamp(1rem, 2vw, 1.5rem)' }}>
          <h1 className="font-bold text-blue-400" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>Battle64</h1>
          
          {/* Points Display */}
          {isAuthenticated && userPoints && (
            <div className="responsive-flex-center">
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
                <Trophy className="text-yellow-400" style={{ width: 'clamp(16px, 3vw, 20px)', height: 'clamp(16px, 3vw, 20px)' }} />
                <span className="font-medium text-yellow-100" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                  {userPoints.totalPoints.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
                <Zap className="text-blue-400" style={{ width: 'clamp(16px, 3vw, 20px)', height: 'clamp(16px, 3vw, 20px)' }} />
                <span className="text-blue-200" style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)' }}>
                  {t(userPoints.currentRank.key as any)}
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="main-content min-h-screen min-h-[100dvh] responsive-max-width">
          <div className="responsive-max-width" style={{ 
            paddingTop: 'clamp(3.5rem, 8vw, 4rem)', 
            paddingLeft: 'clamp(0.5rem, 2vw, 1.5rem)', 
            paddingRight: 'clamp(0.5rem, 2vw, 1.5rem)',
            paddingBottom: 'clamp(1rem, 3vw, 2rem)'
          }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout