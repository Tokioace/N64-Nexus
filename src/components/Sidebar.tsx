import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSelector from './LanguageSelector'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { t } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg border border-slate-600 shadow-lg transition-all duration-200"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'translate-x-0' : ''}`}>
        <div className="p-6">
          {/* Header with Logo and Language Selector */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-blue-400">Battle64</h1>
            <LanguageSelector />
          </div>
          
          <nav>
            <ul>
              <li className={location.pathname === '/' ? 'active' : ''}>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>🏠 {t('nav.home')}</Link>
              </li>
              <li className={location.pathname === '/classic' ? 'active' : ''}>
                <Link to="/classic" onClick={() => setIsMobileMenuOpen(false)}>🎮 {t('nav.classic')}</Link>
              </li>
              <li className={location.pathname === '/events' ? 'active' : ''}>
                <Link to="/events" onClick={() => setIsMobileMenuOpen(false)}>🏆 {t('nav.events')}</Link>
              </li>
              <li className={location.pathname === '/speedrun-media' ? 'active' : ''}>
                <Link to="/speedrun-media" onClick={() => setIsMobileMenuOpen(false)}>📹 {t('nav.speedrun')}</Link>
              </li>
              <li className={location.pathname === '/collector' ? 'active' : ''}>
                <Link to="/collector" onClick={() => setIsMobileMenuOpen(false)}>📦 {t('nav.collector')}</Link>
              </li>
              <li className={location.pathname === '/leaderboard' ? 'active' : ''}>
                <Link to="/leaderboard" onClick={() => setIsMobileMenuOpen(false)}>📊 {t('nav.leaderboard')}</Link>
              </li>
              <li className={location.pathname === '/minigames' ? 'active' : ''}>
                <Link to="/minigames" onClick={() => setIsMobileMenuOpen(false)}>🎯 {t('nav.minigames')}</Link>
              </li>
              <li className={location.pathname === '/marktplatz' ? 'active' : ''}>
                <Link to="/marktplatz" onClick={() => setIsMobileMenuOpen(false)}>🛒 {t('nav.marketplace')}</Link>
              </li>
              <li className={location.pathname === '/freunde' ? 'active' : ''}>
                <Link to="/freunde" onClick={() => setIsMobileMenuOpen(false)}>👥 {t('nav.friends')}</Link>
              </li>
              <li className={location.pathname === '/quiz' ? 'active' : ''}>
                <Link to="/quiz" onClick={() => setIsMobileMenuOpen(false)}>❓ {t('nav.quiz')}</Link>
              </li>
              <li className={location.pathname.startsWith('/forum') ? 'active' : ''}>
                <Link to="/forum" onClick={() => setIsMobileMenuOpen(false)}>💬 {t('nav.forum')}</Link>
              </li>
              <li className={location.pathname === '/fanart' ? 'active' : ''}>
                <Link to="/fanart" onClick={() => setIsMobileMenuOpen(false)}>🎨 {t('nav.fanart')}</Link>
              </li>
              <li className={location.pathname === '/newsfeed' ? 'active' : ''}>
                <Link to="/newsfeed" onClick={() => setIsMobileMenuOpen(false)}>📰 {t('nav.news')}</Link>
              </li>
              <li className={location.pathname === '/profile' ? 'active' : ''}>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>👤 {t('nav.profile')}</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar