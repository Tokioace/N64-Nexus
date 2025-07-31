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
    <div className="fixed z-40 flex items-center gap-1 sm:gap-3 bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-600 shadow-lg"
         style={{
           top: 'clamp(0.5rem, 2vw, 1rem)',
           left: '50%',
           transform: 'translateX(-50%)',
           padding: 'clamp(0.375rem, 1.5vw, 0.75rem)',
           minWidth: 'clamp(180px, 30vw, 280px)',
           maxWidth: 'clamp(280px, 40vw, 350px)'
         }}>
      
      {/* Rank Badge */}
      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/30 rounded px-1.5 sm:px-2 py-1 flex-shrink-0">
        <Trophy className="text-yellow-400" style={{ width: 'clamp(10px, 2.5vw, 16px)', height: 'clamp(10px, 2.5vw, 16px)' }} />
        <span className="font-medium text-yellow-100" style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)' }}>
          #{currentRank || 'N/A'}
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="flex-1 min-w-0 mx-1 sm:mx-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-slate-300" style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)' }}>
            {t('ranking.rankProgress')}
          </span>
          <span className="text-slate-400" style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)' }}>
            {Math.min(((user.xp || 0) % 1000), 1000)}/1000 XP
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-600 rounded-full" style={{ height: 'clamp(3px, 1vw, 6px)' }}>
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
      <div className="flex items-center gap-0.5 sm:gap-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded px-1.5 sm:px-2 py-1 flex-shrink-0">
        <span className="font-medium text-blue-100" style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.875rem)' }}>
          {userPoints.totalPoints.toLocaleString()} CP
        </span>
      </div>
    </div>
  )
}

export default RankingBar