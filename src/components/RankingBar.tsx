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
    <div className="fixed z-40 flex items-center gap-3 bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-600 shadow-lg"
         style={{
           top: 'clamp(0.5rem, 2vw, 1rem)',
           left: '50%',
           transform: 'translateX(-50%)',
           height: 'clamp(44px, 10vw, 52px)', // Match sidebar and user icon height exactly
           padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
           minWidth: 'clamp(220px, 35vw, 300px)',
           maxWidth: 'clamp(300px, 45vw, 380px)'
         }}>
      
      {/* Rank Badge */}
      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/30 rounded px-2 py-1 flex-shrink-0">
        <Trophy className="text-yellow-400" style={{ width: 'clamp(12px, 2.5vw, 16px)', height: 'clamp(12px, 2.5vw, 16px)' }} />
        <span className="font-medium text-yellow-100 whitespace-nowrap" style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)' }}>
          #{currentRank || 'N/A'}
        </span>
      </div>

      {/* Progress Bar Container - Adjusted for better spacing */}
      <div className="flex-1 min-w-0 px-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-slate-300 whitespace-nowrap" style={{ fontSize: 'clamp(0.625rem, 1.4vw, 0.7rem)' }}>
            {t('ranking.rankProgress')}
          </span>
          <span className="text-slate-400 whitespace-nowrap" style={{ fontSize: 'clamp(0.625rem, 1.4vw, 0.7rem)' }}>
            {Math.min(((user.xp || 0) % 1000), 1000)}/1000 XP
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-600 rounded-full" style={{ height: 'clamp(4px, 1vw, 6px)' }}>
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ 
              width: `${progressPercentage}%`,
              height: '100%'
            }}
          />
        </div>
      </div>

      {/* Points Display */}
      <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded px-2 py-1 flex-shrink-0">
        <span className="font-medium text-blue-100 whitespace-nowrap" style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)' }}>
          {userPoints.totalPoints.toLocaleString()} CP
        </span>
      </div>
    </div>
  )
}

export default RankingBar