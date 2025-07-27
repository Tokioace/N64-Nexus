import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { usePoints } from '../contexts/PointsContext'
import { useUser } from '../contexts/UserContext'
import { Trophy, Star, TrendingUp, Award } from 'lucide-react'

const PointsWidget: React.FC = () => {
  const { t } = useLanguage()
  const { userPoints, ranksConfig } = usePoints()
  const { user } = useUser()

  if (!user || !userPoints) {
    return null
  }

  const currentRank = userPoints.currentRank
  const nextRankIndex = ranksConfig.findIndex(rank => rank.key === currentRank.key) + 1
  const nextRank = nextRankIndex < ranksConfig.length ? ranksConfig[nextRankIndex] : null
  const pointsToNext = nextRank ? nextRank.minPoints - userPoints.totalPoints : 0

  const getRankEmoji = (rankKey: string) => {
    switch (rankKey) {
      case 'rank.n64Legend': return '👑'
      case 'rank.retroChampion': return '🏆'
      case 'rank.fanartMaster': return '🎨'
      case 'rank.speedrunner': return '⚡'
      case 'rank.retroGeek': return '🤓'
      case 'rank.moduleCollector': return '📦'
      default: return '🎮'
    }
  }

  return (
    <div className="simple-tile bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-400/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          {t('profile.pointsOverview')}
        </h3>
        <span className="text-2xl">{getRankEmoji(currentRank.key)}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {userPoints.totalPoints.toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">{t('points.total')}</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-slate-100">
            {t(currentRank.key)}
          </div>
          <div className="text-sm text-slate-400">{t('rank.current')}</div>
        </div>
      </div>

      {nextRank && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">{t('rank.nextRank')}: {t(nextRank.key)}</span>
            <span className="text-slate-400">{pointsToNext} {t('rank.pointsToNext')}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(((userPoints.totalPoints - currentRank.minPoints) / (nextRank.minPoints - currentRank.minPoints)) * 100, 100)}%` 
              }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-600/30">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Award className="w-4 h-4" />
          <span>{userPoints.achievementsUnlocked.length} {t('profile.achievements.title')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <TrendingUp className="w-4 h-4" />
          <span>#{userPoints.totalPoints > 0 ? 'N/A' : '—'}</span>
        </div>
      </div>
    </div>
  )
}

export default PointsWidget