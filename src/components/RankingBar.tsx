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
    <div className="fixed z-40 flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-600 shadow-lg"
         style={{
           top: 'clamp(0.5rem, 2vw, 1rem)',
           left: '50%',
           transform: 'translateX(-50%) scaleY(0.5)',
           transformOrigin: 'top center',
           padding: 'clamp(0.4rem, 1.6vw, 0.6rem) clamp(0.6rem, 2.4vw, 0.9rem)',
           minWidth: 'clamp(180px, 30vw, 280px)',
           maxWidth: 'clamp(280px, 40vw, 350px)'
         }}>
      
      {/* Rank Badge */}
      <div className="flex items-center gap-0.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/30 rounded px-1 py-0.5 flex-shrink-0">
        <Trophy className="text-yellow-400" style={{ width: 'clamp(8px, 2vw, 12px)', height: 'clamp(8px, 2vw, 12px)' }} />
        <span className="font-medium text-yellow-100" style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)' }}>
          #{currentRank || 'N/A'}
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="flex-1 min-w-0 mx-0.5">
        {/* Level label centered at top */}
        <div className="text-center mb-0.5">
          <span className="text-slate-300" style={{ fontSize: 'clamp(0.55rem, 1.3vw, 0.65rem)' }}>
            {t('ranking.rankProgress')}
          </span>
        </div>
        
        {/* Score centered below level */}
        <div className="text-center mb-0.5">
          <span className="text-slate-400" style={{ fontSize: 'clamp(0.5rem, 1.2vw, 0.6rem)' }}>
            {Math.min(((user.xp || 0) % 1000), 1000)}/1000
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-600 rounded-full" style={{ height: 'clamp(2px, 0.8vw, 4px)' }}>
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
      <div className="flex items-center gap-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded px-1 py-0.5 flex-shrink-0">
        <span className="font-medium text-blue-100" style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)' }}>
          {userPoints.totalPoints > 999 ? `${Math.floor(userPoints.totalPoints / 1000)}k` : userPoints.totalPoints}
        </span>
      </div>
    </div>
  )
}

export default RankingBar