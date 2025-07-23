import React, { ReactNode, useState, useEffect } from 'react'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      document.body.style.position = ''
      document.body.style.width = ''
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
        className="mobile-menu-button fixed top-3 left-3 z-50 lg:hidden bg-slate-800/90 backdrop-blur-sm text-white p-2 sm:p-3 rounded-lg shadow-lg hover:bg-slate-700 transition-all duration-200 border border-slate-600"
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

      <Sidebar isOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} />
      
      <div className="flex-1 lg:ml-64 min-h-screen">
        {/* Main Content */}
        <main className="main-content min-h-screen">
          <div className="pt-12 lg:pt-0 px-3 sm:px-4 lg:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout