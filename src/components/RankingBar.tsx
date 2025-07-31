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
    <div className="fixed z-40 w-full max-w-[400px] mx-auto"
         style={{
           top: 'clamp(0.5rem, 2vw, 1rem)',
           left: '50%',
           transform: 'translateX(-50%)',
         }}>
      
      <div className="w-full max-w-[360px] mx-auto px-3 py-3 bg-[#0e0e1a] rounded-md shadow text-white text-xs">

        {/* Kopfzeile mit #1 und CP – leicht eingerückt */}
        <div className="flex justify-between items-center w-full mb-1">
          <div className="bg-yellow-400 text-black font-bold px-2 py-1 rounded-md shadow text-xs flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            <span className="leading-none">#{currentRank || '1'}</span>
          </div>

          <span className="uppercase text-[11px] font-semibold tracking-wide text-slate-300">
            {t('profile.level')}
          </span>

          <div className="bg-purple-600 text-white font-semibold px-2 py-1 rounded-md shadow text-xs">
            <span className="leading-none">
              {userPoints.totalPoints > 999 
                ? `${Math.floor(userPoints.totalPoints / 1000)}k` 
                : userPoints.totalPoints} CP
            </span>
          </div>
        </div>

        {/* XP-Wert */}
        <div className="text-center mb-1 text-sm font-medium">
          {currentXP} / {maxXP}
        </div>

        {/* Fortschrittsbalken */}
        <div className="relative w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-green-400 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default RankingBar