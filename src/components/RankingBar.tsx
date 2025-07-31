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
    <div className="fixed z-40 w-full max-w-[320px] mx-auto"
         style={{
           top: 'clamp(0.5rem, 2vw, 1rem)',
           left: '50%',
           transform: 'translateX(-50%)',
         }}>
      
      <div className="flex items-center justify-between w-full px-2 py-1.5 bg-[#0e0e1a] rounded-md shadow-md text-white text-xs">

        {/* Rank Display - Yellow Badge */}
        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-yellow-400 text-black font-bold rounded text-xs shadow flex-shrink-0">
          <Trophy className="w-3 h-3" />
          <span className="leading-none">#{currentRank || '1'}</span>
        </div>

        {/* XP / Level Center Section */}
        <div className="flex flex-col items-center justify-center gap-[1px] px-2 min-w-[100px] flex-1">
          <span className="uppercase tracking-wider text-[10px] font-semibold text-slate-300 leading-none">
            {t('profile.level')}
          </span>
          <span className="text-xs font-medium leading-none text-white">
            {currentXP} / {maxXP}
          </span>
          <div className="relative w-full h-1 mt-[1px] bg-slate-700 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-green-400 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* CP Value - Purple Badge */}
        <div className="flex items-center justify-center px-1.5 py-0.5 bg-purple-600 text-white font-semibold rounded shadow text-xs flex-shrink-0">
          <span className="leading-none">
            {userPoints.totalPoints > 999 
              ? `${Math.floor(userPoints.totalPoints / 1000)}k` 
              : userPoints.totalPoints} CP
          </span>
        </div>
      </div>
    </div>
  )
}

export default RankingBar