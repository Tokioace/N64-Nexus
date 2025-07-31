import React from 'react'
import { useUser } from '../contexts/UserContext'
import { usePoints } from '../contexts/PointsContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Trophy } from 'lucide-react'

const RankingBar: React.FC = () => {
  const { user, isAuthenticated } = useUser()
  const { getUserPosition, userPoints } = usePoints()
  const { t } = useLanguage()

  if (!isAuthenticated || !user || !userPoints) {
    return null
  }

  const currentRank = getUserPosition(user.id, { type: 'global', timeframe: 'allTime' })
  const progressPercentage = Math.min(((user.xp || 0) % 1000) / 10, 100)

  return (
    <div className="ranking-bar-container fixed z-40 flex items-center gap-1 sm:gap-2 bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-600 shadow-lg"
         style={{
           top: 'clamp(0.5rem, 2vw, 1rem)',
           // Position between the mobile menu button and user icon
           left: 'clamp(70px, 15vw, 90px)', // Start after mobile menu button
           right: 'clamp(70px, 15vw, 90px)', // End before user icon
           height: 'clamp(44px, 10vw, 52px)', // Match sidebar and user icon height exactly
           padding: 'clamp(0.25rem, 1vw, 0.5rem)',
           // Dynamic width - will fill available space between icons
           width: 'auto',
           maxWidth: 'calc(100vw - clamp(140px, 30vw, 180px))' // Total space for both side icons
         }}>
      
      {/* Rank Badge - Compact */}
      <div className="flex items-center gap-0.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/30 rounded px-1 py-0.5 flex-shrink-0">
        <Trophy className="text-yellow-400 hidden xs:block" style={{ width: 'clamp(10px, 2vw, 14px)', height: 'clamp(10px, 2vw, 14px)' }} />
        <span className="font-medium text-yellow-100 whitespace-nowrap" style={{ fontSize: 'clamp(0.625rem, 1.4vw, 0.75rem)' }}>
          #{currentRank || 'N/A'}
        </span>
      </div>

      {/* Progress Bar Container - Optimized for smaller space */}
      <div className="flex-1 min-w-0 px-1">
        {/* Show progress info on very small screens as single line */}
        <div className="hidden sm:flex items-center justify-between mb-0.5">
          <span className="text-slate-300 whitespace-nowrap truncate" style={{ fontSize: 'clamp(0.5rem, 1.2vw, 0.625rem)' }}>
            {t('ranking.rankProgress')}
          </span>
          <span className="text-slate-400 whitespace-nowrap" style={{ fontSize: 'clamp(0.5rem, 1.2vw, 0.625rem)' }}>
            {Math.min(((user.xp || 0) % 1000), 1000)}/1000 XP
          </span>
        </div>
        
        {/* Compact single line for mobile */}
        <div className="sm:hidden flex items-center justify-center mb-0.5">
          <span className="text-slate-300 text-center" style={{ fontSize: 'clamp(0.5rem, 1.2vw, 0.625rem)' }}>
            {Math.min(((user.xp || 0) % 1000), 1000)}/1000 XP
          </span>
        </div>
        
        {/* Progress Bar - Thinner for compact layout */}
        <div className="w-full bg-slate-600 rounded-full" style={{ height: 'clamp(3px, 0.8vw, 4px)' }}>
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ 
              width: `${progressPercentage}%`,
              height: '100%'
            }}
          />
        </div>
      </div>

      {/* Points Display - Compact */}
      <div className="flex items-center bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded px-1 py-0.5 flex-shrink-0">
        <span className="font-medium text-blue-100 whitespace-nowrap" style={{ fontSize: 'clamp(0.625rem, 1.4vw, 0.75rem)' }}>
          {userPoints.totalPoints.toLocaleString()} CP
        </span>
      </div>
    </div>
  )
}

export default RankingBar