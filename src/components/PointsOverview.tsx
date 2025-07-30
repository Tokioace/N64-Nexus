import React, { useState } from 'react'
import { useLanguage, getLocaleString } from '../contexts/LanguageContext'
import { usePoints } from '../contexts/PointsContext'
import { useUser } from '../contexts/UserContext'
import { 
  Trophy, 
  Star, 
  Award, 
  Calendar,
  Clock,
  Zap,
  Medal,
  Crown
} from 'lucide-react'

interface PointsOverviewProps {
  compact?: boolean
  showHistory?: boolean
}

const PointsOverview: React.FC<PointsOverviewProps> = ({ 
  compact = false,
  showHistory = true 
}) => {
  const { t, currentLanguage } = useLanguage()
  const { userPoints, ranksConfig, currentSeason } = usePoints()
  const { user } = useUser()
  
  const [showFullHistory, setShowFullHistory] = useState(false)

  if (!user || !userPoints) {
    return (
      <div className="simple-tile text-center py-8">
        <Trophy className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-300 mb-2">
          {t('points.noData')}
        </h3>
        <p className="text-slate-400">
          {t('points.startEarning')}
        </p>
      </div>
    )
  }

  const currentRank = userPoints.currentRank
  const nextRankIndex = ranksConfig.findIndex(rank => rank.key === currentRank.key) + 1
  const nextRank = nextRankIndex < ranksConfig.length ? ranksConfig[nextRankIndex] : null
  const pointsToNext = nextRank ? nextRank.minPoints - userPoints.totalPoints : 0
  const seasonPoints = userPoints.seasonPoints[currentSeason] || 0

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

  const getMedalIcon = (medalKey: string) => {
    switch (medalKey) {
      case 'medal.legend': return '👑'
      case 'medal.champion': return '🥈'
      case 'medal.pixelHero': return '🥉'
      default: return '🏅'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'speedrun.upload': return <Zap className="w-4 h-4 text-blue-400" />
      case 'quiz.answerCorrect': return <Star className="w-4 h-4 text-green-400" />
      case 'forum.post': return <Trophy className="w-4 h-4 text-purple-400" />
      default: return <Award className="w-4 h-4 text-slate-400" />
    }
  }

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            {t('profile.pointsOverview')}
          </h3>
          <span className="text-2xl">{getRankEmoji(currentRank.key)}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-yellow-400">
              {userPoints.totalPoints.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">{t('points.total')}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-400">
              {seasonPoints.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">{t('points.season')}</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-slate-100 mb-1">
            {t(currentRank.key as any)}
          </div>
          {nextRank && (
            <div className="text-sm text-slate-400">
              {pointsToNext} {t('rank.pointsToNext')}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h1 className="text-2xl font-bold text-slate-100">
            {t('profile.pointsOverview')}
          </h1>
        </div>
        <p className="text-slate-400">
          {t('profile.activityHistory')}
        </p>
      </div>

      {/* Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="simple-tile bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-400/50 text-center">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-3xl font-bold text-yellow-400 mb-1">
            {userPoints.totalPoints.toLocaleString()}
          </div>
          <div className="text-sm text-slate-300">{t('points.total')}</div>
        </div>

        <div className="simple-tile bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 text-center">
          <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-3xl font-bold text-blue-400 mb-1">
            {seasonPoints.toLocaleString()}
          </div>
          <div className="text-sm text-slate-300">{t('points.season')}</div>
        </div>

        <div className="simple-tile bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50 text-center">
          <Award className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-3xl font-bold text-green-400 mb-1">
            {userPoints.achievementsUnlocked.length}
          </div>
          <div className="text-sm text-slate-300">{t('profile.achievements.title')}</div>
        </div>
      </div>

      {/* Rank Progress */}
      <div className="simple-tile">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{getRankEmoji(currentRank.key)}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-100 mb-1">
              {t(currentRank.key as any)}
            </h3>
            <p className="text-slate-400">{t('rank.current')}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-100">
              {userPoints.totalPoints.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">{t('points.total')}</div>
          </div>
        </div>

        {nextRank ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">
                {t('rank.nextRank')}: {t(nextRank.key as any)}
              </span>
              <span className="text-slate-400">
                {pointsToNext.toLocaleString()} {t('rank.pointsToNext')}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-400 to-amber-500 h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(((userPoints.totalPoints - currentRank.minPoints) / (nextRank.minPoints - currentRank.minPoints)) * 100, 100)}%` 
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{currentRank.minPoints.toLocaleString()}</span>
              <span>{nextRank.minPoints.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-slate-300 font-medium">{t('rank.maxRank')}</p>
          </div>
        )}
      </div>

      {/* Medals */}
      {userPoints.medals.length > 0 && (
        <div className="simple-tile">
          <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Medal className="w-6 h-6 text-yellow-400" />
            {t('profile.medals.title')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPoints.medals.map((medal) => (
              <div
                key={medal.id}
                className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/50 rounded-lg p-4 text-center"
              >
                <div className="text-3xl mb-2">{getMedalIcon(medal.medalKey)}</div>
                <div className="font-bold text-slate-100 mb-1">
                  {t(medal.medalKey as any)}
                </div>
                <div className="text-sm text-slate-400 mb-2">
                  {t('medal.season')} {medal.season}
                </div>
                <div className="text-xs text-green-400">
                  +{medal.bonusXP} {t('medal.bonusXP')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Points History */}
      {showHistory && userPoints.pointHistory.length > 0 && (
        <div className="simple-tile">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-400" />
              {t('points.history')}
            </h3>
            {userPoints.pointHistory.length > 5 && (
              <button
                onClick={() => setShowFullHistory(!showFullHistory)}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                {showFullHistory ? 'Show Less' : 'Show All'}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {(showFullHistory ? userPoints.pointHistory : userPoints.pointHistory.slice(0, 5))
              .map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-600/50"
                >
                  <div className="flex items-center gap-3">
                    {getActionIcon(entry.action)}
                    <div>
                      <div className="text-sm font-medium text-slate-100">
                        {t(`points.${entry.action.replace('.', '')}` as any)}
                      </div>
                      {entry.description && (
                        <div className="text-xs text-slate-400">
                          {entry.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-400">
                      +{entry.points}
                    </div>
                    <div className="text-xs text-slate-400">
                      {entry.date.toLocaleDateString(getLocaleString(currentLanguage))}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {userPoints.pointHistory.length === 0 && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-300 mb-2">
                {t('points.noActivity')}
              </h3>
              <p className="text-slate-400">
                {t('points.startEarning')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PointsOverview