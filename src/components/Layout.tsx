import React, { ReactNode } from 'react'
import Sidebar from './Sidebar'
import LanguageSelector from './LanguageSelector'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        {/* Top Header with Language Selector */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-end items-center">
          <LanguageSelector />
        </header>
        
        {/* Main Content */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout