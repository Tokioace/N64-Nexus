import React, { ReactNode, useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { useUser } from '../contexts/UserContext'
import { usePoints } from '../contexts/PointsContext'
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 responsive-overflow-hidden responsive-max-width">
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
        className="mobile-menu-button fixed top-2 left-2 sm:top-3 sm:left-3 z-50 lg:hidden bg-slate-800/90 backdrop-blur-sm text-white p-2 sm:p-3 rounded-lg shadow-lg hover:bg-slate-700 transition-all duration-200 border border-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Toggle mobile menu"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* User Profile Icon - Fixed position for all screen sizes */}
      {isAuthenticated && user && (
        <Link 
          to="/profile" 
          className="fixed top-2 right-2 sm:top-3 sm:right-3 z-50 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700/90 transition-all duration-200 border border-slate-600 shadow-lg group min-h-[44px] min-w-[44px]"
          title={`${user.username} - Level ${user.level}`}
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium text-white group-hover:scale-105 transition-transform shadow-inner">
            {user.avatar || '🎮'}
          </div>
        </Link>
      )}

      <Sidebar isOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} />
      
      <div className="flex-1 lg:ml-64 min-h-screen responsive-max-width responsive-overflow-hidden">
        {/* Header - Desktop only */}
        <header className="hidden lg:flex items-center justify-between px-4 lg:px-6 py-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 responsive-max-width">
          <h1 className="text-xl lg:text-2xl font-bold text-blue-400">Battle64</h1>
          
          {/* Points Display */}
          {isAuthenticated && userPoints && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg px-3 py-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-100">
                  {userPoints.totalPoints.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg px-3 py-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-blue-200">
                  {userPoints.currentRank.key.split('.')[1] || 'Beginner'}
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="main-content min-h-screen responsive-max-width">
          <div className="pt-14 sm:pt-16 lg:pt-6 px-2 sm:px-3 lg:px-4 xl:px-6 responsive-max-width">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout