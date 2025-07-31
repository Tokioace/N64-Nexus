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
  const currentXP = (user.xp || 0) % 1000
  const maxXP = 1000
  const progressPercentage = Math.min((currentXP / maxXP) * 100, 100)

  return (
    <div className="fixed z-40 flex items-center justify-between w-full max-w-sm mx-auto bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-600 shadow-lg px-2 py-1"
         style={{
           top: 'clamp(0.5rem, 2vw, 1rem)',
           left: '50%',
           transform: 'translateX(-50%)',
           height: 'clamp(44px, 10vw, 52px)',
           minWidth: 'clamp(180px, 30vw, 280px)',
           maxWidth: 'clamp(280px, 40vw, 350px)'
         }}>
      
      {/* Yellow #1 Rank Badge */}
      <div className="flex items-center gap-1 px-1 py-0.5 bg-yellow-600 text-black rounded flex-shrink-0">
        <Trophy className="w-4 h-4" />
        <span className="font-bold text-sm">
          #{currentRank || '1'}
        </span>
      </div>

      {/* Centered XP Progress Container */}
      <div className="flex flex-col items-center justify-center gap-1 text-center px-2 flex-1 min-w-0">
        {/* Level Label - Centered */}
        <span className="text-xs leading-none font-medium text-slate-200">
          {t('profile.level')}
        </span>
        
        {/* XP Progress Text - Centered */}
        <span className="text-sm leading-none text-slate-300 font-semibold">
          {currentXP} / {maxXP}
        </span>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-600 rounded-full h-1 mt-1">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Purple CP Points Display */}
      <div className="flex items-center gap-1 px-1 py-0.5 bg-purple-700 text-white rounded flex-shrink-0">
        <span className="font-bold text-sm">
          {userPoints.totalPoints > 999 ? `${Math.floor(userPoints.totalPoints / 1000)}k` : userPoints.totalPoints}
        </span>
        <span className="text-xs">CP</span>
      </div>
    </div>
  )
}

export default RankingBar