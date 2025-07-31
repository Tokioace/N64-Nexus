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
           height: 'clamp(44px, 10vw, 52px)',
           padding: 'clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2.5vw, 1.25rem)',
           minWidth: 'clamp(180px, 30vw, 280px)',
           maxWidth: 'clamp(280px, 40vw, 350px)'
         }}>
      
      {/* Rank Badge */}
      <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/30 rounded-md px-2 py-1 flex-shrink-0 h-full">
        <Trophy className="text-yellow-400" style={{ width: 'clamp(14px, 3vw, 18px)', height: 'clamp(14px, 3vw, 18px)' }} />
        <span className="font-bold text-yellow-100" style={{ fontSize: 'clamp(0.875rem, 2.2vw, 1rem)' }}>
          #{currentRank || 'N/A'}
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="flex-1 min-w-0 mx-1 h-full flex flex-col justify-center">
        {/* Level label */}
        <div className="text-center">
          <span className="text-slate-200 font-medium" style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)' }}>
            {t('ranking.rankProgress')}
          </span>
        </div>
        
        {/* Score */}
        <div className="text-center">
          <span className="text-slate-300 font-semibold" style={{ fontSize: 'clamp(0.7rem, 1.7vw, 0.8rem)' }}>
            {Math.min(((user.xp || 0) % 1000), 1000)}/1000
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-600 rounded-full" style={{ height: 'clamp(4px, 1.2vw, 6px)' }}>
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
      <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-md px-2 py-1 flex-shrink-0 h-full">
        <span className="font-bold text-blue-100" style={{ fontSize: 'clamp(0.875rem, 2.2vw, 1rem)' }}>
          {userPoints.totalPoints > 999 ? `${Math.floor(userPoints.totalPoints / 1000)}k` : userPoints.totalPoints}
        </span>
      </div>
    </div>
  )
}

export default RankingBar