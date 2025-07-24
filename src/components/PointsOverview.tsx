import React, { useState } from 'react'
import { useLanguage, getLocaleString } from '../contexts/LanguageContext'
import { usePoints } from '../contexts/PointsContext'
import { useUser } from '../contexts/UserContext'
import { 
  Trophy, 
  Crown, 
  Medal,
  Star,
  TrendingUp,
  Calendar,
  Award,
  Target,
  Zap,
  Clock,
  Activity,
  ChevronRight,
  ChevronDown,
  Gift,
  ChevronUp
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

  if (!userPoints || !user) {
    return (
      <div className="simple-tile text-center py-8">
        <Trophy className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-300 mb-2">
          {t('points.noData')}
        </h3>
      </div>
    )
  }

  const currentRank = userPoints.currentRank
  const nextRank = ranksConfig.find(rank => rank.minPoints > currentRank.currentPoints)
  const pointsToNext = nextRank ? nextRank.minPoints - currentRank.currentPoints : 0
  const rankProgress = nextRank 
    ? ((currentRank.currentPoints - currentRank.minPoints) / (nextRank.minPoints - currentRank.minPoints)) * 100
    : 100

  const seasonPoints = userPoints.seasonPoints[currentSeason] || 0
  const recentHistory = userPoints.pointHistory.slice(0, showFullHistory ? undefined : 5)

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
      case 'speedrun.upload': return '⚡'
      case 'fanart.upload': return '🎨'
      case 'quiz.answerCorrect': return '🧠'
      case 'forum.post': return '💬'
      case 'minigame.success': return '🎮'
      default: return '⭐'
    }
  }

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Points Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="simple-tile bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-400/30">
            <div className="text-center">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">
                {userPoints.totalPoints.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">{t('points.total')}</div>
            </div>
          </div>
          
          <div className="simple-tile bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30">
            <div className="text-center">
              <Star className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">
                {seasonPoints.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">{t('points.season')}</div>
            </div>
          </div>
        </div>

        {/* Current Rank */}
        <div className="simple-tile">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getRankEmoji(currentRank.key)}</span>
            <div className="flex-1">
              <div className="font-bold text-slate-100">{t(currentRank.key)}</div>
              <div className="text-xs text-slate-400">
                {nextRank ? `${pointsToNext} ${t('rank.pointsToNext')}` : t('rank.maxRank')}
              </div>
            </div>
          </div>
          {nextRank && (
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${rankProgress}%` }}
              />
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
      </div>

      {/* Points Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="simple-tile bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-400/30">
          <div className="text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {userPoints.totalPoints.toLocaleString()}
            </div>
            <div className="text-slate-400">{t('points.total')}</div>
          </div>
        </div>

        <div className="simple-tile bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30">
          <div className="text-center">
            <Star className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {seasonPoints.toLocaleString()}
            </div>
            <div className="text-slate-400">{t('points.season')}</div>
            <div className="text-xs text-slate-500 mt-1">
              {t('medal.season')} {currentSeason}
            </div>
          </div>
        </div>

        <div className="simple-tile bg-gradient-to-r from-green-500/10 to-teal-500/10 border-green-400/30">
          <div className="text-center">
            <Activity className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-green-400 mb-1">
              {userPoints.pointHistory.length}
            </div>
            <div className="text-slate-400">{t('points.recentActivity')}</div>
          </div>
        </div>
      </div>

      {/* Rank Progress */}
      <div className="simple-tile">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-bold text-slate-100">{t('profile.rankProgress')}</h3>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getRankEmoji(currentRank.key)}</span>
            <div>
              <div className="font-bold text-xl text-slate-100">{t(currentRank.key)}</div>
              <div className="text-sm text-slate-400">
                {currentRank.currentPoints.toLocaleString()} {t('points.total')}
              </div>
            </div>
          </div>
          
          {nextRank && (
            <>
              <ChevronRight className="w-5 h-5 text-slate-400" />
              <div className="flex items-center gap-3">
                <span className="text-2xl opacity-50">{getRankEmoji(nextRank.key)}</span>
                <div>
                  <div className="font-bold text-lg text-slate-300">{t(nextRank.key)}</div>
                  <div className="text-sm text-slate-400">
                    {nextRank.minPoints.toLocaleString()} {t('points.total')}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {nextRank && (
          <div>
            <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
              <span>{t('rank.pointsToNext')}</span>
              <span className="font-bold text-yellow-400">
                {pointsToNext.toLocaleString()} {t('points.total')}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-400 to-amber-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${rankProgress}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {Math.round(rankProgress)}% {t('achievement.progress')}
            </div>
          </div>
        )}
      </div>

      {/* Medals */}
      {userPoints.medals.length > 0 && (
        <div className="simple-tile">
          <div className="flex items-center gap-2 mb-4">
            <Medal className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-bold text-slate-100">{t('profile.medals.title')}</h3>
            <span className="text-sm text-slate-400">({userPoints.medals.length})</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {userPoints.medals.map((medal) => (
              <div
                key={medal.id}
                className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getMedalIcon(medal.medalKey)}</span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-100">{t(medal.medalKey)}</div>
                    <div className="text-xs text-slate-400">
                      {t('medal.season')} {medal.season} • #{medal.rank}
                    </div>
                    <div className="text-xs text-purple-400">
                      +{medal.bonusXP} {t('medal.bonusXP')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {showHistory && userPoints.pointHistory.length > 0 && (
        <div className="simple-tile">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-100">{t('points.history')}</h3>
            </div>
            {userPoints.pointHistory.length > 5 && (
              <button
                onClick={() => setShowFullHistory(!showFullHistory)}
                className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                {showFullHistory ? (
                  <>
                    <span>Show less</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Show all ({userPoints.pointHistory.length})</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {recentHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-600/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getActionIcon(entry.action)}</span>
                  <div>
                    <div className="font-medium text-slate-100">
                      {t(entry.action)}
                    </div>
                    {entry.description && (
                      <div className="text-xs text-slate-400">{entry.description}</div>
                    )}
                    <div className="text-xs text-slate-500">
                      {entry.date.toLocaleDateString(getLocaleString(currentLanguage))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-400">
                    +{entry.points}
                  </div>
                  <div className="text-xs text-slate-400">
                    {t('points.earned')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Activity */}
      {userPoints.pointHistory.length === 0 && (
        <div className="simple-tile text-center py-8">
          <Activity className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300 mb-2">
            {t('points.noActivity')}
          </h3>
          <p className="text-slate-400">
            {t('points.startEarning')}
          </p>
        </div>
      )}
    </div>
  )
}

export default PointsOverview