import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { usePoints } from '../contexts/PointsContext'
import { useUser } from '../contexts/UserContext'
import { 
  Trophy, 
  Crown, 
  Star,
  TrendingUp,
  ArrowRight,
  Award
} from 'lucide-react'

const PointsWidget: React.FC = () => {
  const { t } = useLanguage()
  const { userPoints, ranksConfig, currentSeason } = usePoints()
  const { user } = useUser()

  if (!user || !userPoints) {
    return null
  }

  const currentRank = userPoints.currentRank
  const nextRank = ranksConfig.find(rank => rank.minPoints > currentRank.currentPoints)
  const seasonPoints = userPoints.seasonPoints[currentSeason] || 0
  const recentAchievements = userPoints.achievementsUnlocked.slice(-2)

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

  const rankProgress = nextRank 
    ? ((currentRank.currentPoints - currentRank.minPoints) / (nextRank.minPoints - currentRank.minPoints)) * 100
    : 100

  return (
    <div className="simple-tile bg-gradient-to-br from-yellow-500/10 via-amber-500/10 to-orange-500/10 border-yellow-400/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="font-bold text-slate-100">N64Fan Points</h3>
        </div>
        <Link 
          to="/leaderboard"
          className="text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Points Summary */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
          <div className="text-lg font-bold text-yellow-400">
            {userPoints.totalPoints.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">{t('points.total')}</div>
        </div>
        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
          <div className="text-lg font-bold text-blue-400">
            {seasonPoints.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">{t('points.season')}</div>
        </div>
      </div>

      {/* Current Rank */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{getRankEmoji(currentRank.key)}</span>
          <div className="flex-1">
            <div className="font-medium text-slate-100 text-sm">
              {t(currentRank.key)}
            </div>
            {nextRank && (
              <div className="text-xs text-slate-400">
                {(nextRank.minPoints - currentRank.currentPoints).toLocaleString()} {t('rank.pointsToNext')}
              </div>
            )}
          </div>
        </div>
        
        {nextRank && (
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${rankProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">
              {t('achievement.progress')}
            </span>
          </div>
          <div className="space-y-1">
            {recentAchievements.map((achievementKey, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-400 font-medium">
                  {t(achievementKey)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="flex gap-2">
        <Link
          to="/profile"
          className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-lg transition-colors text-center"
        >
          {t('profile.pointsOverview')}
        </Link>
        <Link
          to="/leaderboard"
          className="flex-1 px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs font-medium rounded-lg transition-colors text-center border border-yellow-500/30"
        >
          {t('leaderboard.globalLeaderboard')}
        </Link>
      </div>
    </div>
  )
}

export default PointsWidget