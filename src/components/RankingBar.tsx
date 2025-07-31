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
    <div className="flex flex-col items-center justify-center w-full max-w-[320px] mx-auto pt-3">

      {/* Kopfzeile mit #1 – LEVEL – CP */}
      <div className="flex items-center justify-between w-full px-1 sm:px-2 mb-1">
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
      <div className="text-sm font-medium mb-1 text-slate-300">
        {currentXP} / {maxXP}
      </div>

      {/* Fortschrittsleiste (gleiche Breite wie obere Boxen) */}
      <div className="relative w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-green-400 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${(currentXP / maxXP) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}

export default RankingBar