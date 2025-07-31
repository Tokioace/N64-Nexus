import React from 'react'
import { useUser } from '../contexts/UserContext'
import { usePoints } from '../contexts/PointsContext'
import { useLanguage } from '../contexts/LanguageContext'

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

  return (
    <div className="fixed z-40 w-full max-w-[400px] mx-auto"
         style={{
           top: 'clamp(0.5rem, 2vw, 1rem)',
           left: '50%',
           transform: 'translateX(-50%)',
         }}>
      
      <div className="w-full max-w-[360px] mx-auto px-3 py-3 bg-[#0e0e1a]/90 backdrop-blur-sm rounded-md shadow text-white text-xs border border-slate-600">

        {/* Kopfzeile mit #1 – LEVEL – CP */}
        <div className="flex items-center justify-between w-full mb-1">
          <div className="bg-yellow-400 text-black font-bold px-2 py-1 rounded-md text-xs shadow">
            🏆 #{currentRank || '1'}
          </div>
          <span className="uppercase text-[11px] font-semibold tracking-wide text-slate-300 text-center">
            {t('profile.level')}
          </span>
          <div className="bg-purple-600 text-white font-semibold px-2 py-1 rounded-md text-xs shadow">
            {userPoints.totalPoints > 999 
              ? `${Math.floor(userPoints.totalPoints / 1000)}k` 
              : userPoints.totalPoints} CP
          </div>
        </div>

        {/* XP-Wert */}
        <div className="text-center mb-1 text-sm font-medium text-slate-300">
          {currentXP} / {maxXP}
        </div>

        {/* Fortschrittsleiste */}
        <div className="relative w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-green-400 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${(currentXP / maxXP) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default RankingBar