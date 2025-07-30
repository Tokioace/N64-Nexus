import React, { useState, useEffect } from 'react'
import { useLanguage, getLocaleString } from '../contexts/LanguageContext'
import { usePoints } from '../contexts/PointsContext'
import { 
  Award, 
  Lock,
  CheckCircle,
  Zap,
  Brain,
  Palette,
  Users,
  ShoppingCart,
  Calendar,
  BookOpen
} from 'lucide-react'
import { Achievement } from '../types'

interface AchievementsPanelProps {
  compact?: boolean
  showProgress?: boolean
}

const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ 
  compact = false,
  showProgress = true 
}) => {
  const { t, currentLanguage } = useLanguage()
  const { achievementsConfig, userPoints } = usePoints()

  
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

  useEffect(() => {
    if (achievementsConfig && userPoints) {
      const updatedAchievements = achievementsConfig.map(achievement => ({
        ...achievement,
        unlocked: userPoints.achievementsUnlocked.includes(achievement.key),
        unlockedDate: achievement.unlocked ? new Date() : undefined
      }))
      setAchievements(updatedAchievements)
    }
  }, [achievementsConfig, userPoints])

  const getAchievementIcon = (iconKey: string, unlocked: boolean) => {
    const iconClass = `w-6 h-6 ${unlocked ? 'text-yellow-400' : 'text-slate-500'}`
    
    switch (iconKey) {
      case 'icon.speedrun': return <Zap className={iconClass} />
      case 'icon.brain': return <Brain className={iconClass} />
      case 'icon.art': return <Palette className={iconClass} />
      case 'icon.community': return <Users className={iconClass} />
      case 'icon.market': return <ShoppingCart className={iconClass} />
      case 'icon.event': return <Calendar className={iconClass} />
      case 'icon.knowledge': return <BookOpen className={iconClass} />
      default: return <Award className={iconClass} />
    }
  }

  const getProgressForAchievement = (achievement: Achievement): { current: number; total: number; percentage: number } => {
    if (!userPoints || !achievement.requiredActions) {
      return { current: 0, total: 1, percentage: achievement.unlocked ? 100 : 0 }
    }

    if (achievement.requiredPoints) {
      return {
        current: Math.min(userPoints.totalPoints, achievement.requiredPoints),
        total: achievement.requiredPoints,
        percentage: Math.min((userPoints.totalPoints / achievement.requiredPoints) * 100, 100)
      }
    }

    // Calculate progress based on required actions
    let totalProgress = 0
    let totalRequired = 0

    achievement.requiredActions.forEach(requirement => {
      const actionCount = userPoints.pointHistory
        .filter(entry => entry.action === requirement.action)
        .length
      totalProgress += Math.min(actionCount, requirement.count)
      totalRequired += requirement.count
    })

    return {
      current: totalProgress,
      total: totalRequired,
      percentage: totalRequired > 0 ? (totalProgress / totalRequired) * 100 : 0
    }
  }

  const filteredAchievements = achievements.filter(achievement => {
    switch (filter) {
      case 'unlocked': return achievement.unlocked
      case 'locked': return !achievement.unlocked
      default: return true
    }
  })

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            {t('profile.achievements.title')}
          </h3>
          <span className="text-sm text-slate-400">
            {unlockedCount}/{totalCount}
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {achievements.slice(0, 6).map((achievement) => {
            const progress = getProgressForAchievement(achievement)
            return (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-400/50'
                    : 'bg-slate-800/50 border-slate-600/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {getAchievementIcon(achievement.iconKey, achievement.unlocked)}
                  {achievement.unlocked && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <div className="text-xs font-medium text-slate-100 mb-1">
                  {t(achievement.key as any)}
                </div>
                {!achievement.unlocked && showProgress && (
                  <div className="w-full bg-slate-700 rounded-full h-1">
                    <div
                      className="bg-yellow-400 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Award className="w-8 h-8 text-yellow-400" />
          <h1 className="text-2xl font-bold text-slate-100">
            {t('profile.achievements.title')}
          </h1>
        </div>
        <p className="text-slate-400">
          {t('achievement.progress')}: {unlockedCount}/{totalCount} ({Math.round((unlockedCount / totalCount) * 100)}%)
        </p>
      </div>

      {/* Progress Overview */}
      <div className="simple-tile bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-400/30">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-slate-100">{t('achievement.progress')}</span>
          <span className="text-yellow-400 font-bold">{unlockedCount}/{totalCount}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-yellow-400 to-amber-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Filter */}
      <div className="simple-tile">
        <div className="flex items-center gap-4">
          <span className="font-medium text-slate-100">Filter:</span>
          <div className="flex gap-2">
            {(['all', 'unlocked', 'locked'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  filter === filterOption
                    ? 'bg-yellow-400 text-slate-900'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {filterOption === 'all' && 'All'}
                {filterOption === 'unlocked' && `Unlocked (${unlockedCount})`}
                {filterOption === 'locked' && `Locked (${totalCount - unlockedCount})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement) => {
          const progress = getProgressForAchievement(achievement)
          
          return (
            <div
              key={achievement.id}
              className={`p-6 rounded-lg border transition-all hover:scale-[1.02] ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-400/50 shadow-lg'
                  : 'bg-slate-800/50 border-slate-600/50'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-lg ${
                  achievement.unlocked
                    ? 'bg-yellow-400/20 border border-yellow-400/50'
                    : 'bg-slate-700/50 border border-slate-600/50'
                }`}>
                  {getAchievementIcon(achievement.iconKey, achievement.unlocked)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-bold text-lg ${
                      achievement.unlocked ? 'text-yellow-400' : 'text-slate-300'
                    }`}>
                      {t(achievement.key as any)}
                    </h3>
                    {achievement.unlocked && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="space-y-2 mb-3">
                    {achievement.requiredPoints && (
                      <div className="text-sm text-slate-400">
                        <span className="font-medium">{t('achievement.requirements')}:</span>{' '}
                        {achievement.requiredPoints.toLocaleString()} {t('points.total')}
                      </div>
                    )}
                    
                    {achievement.requiredActions && (
                      <div className="text-sm text-slate-400">
                        <span className="font-medium">{t('achievement.requirements')}:</span>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {achievement.requiredActions.map((requirement, index) => (
                            <li key={index}>
                              {requirement.count}x {t(requirement.action as any)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {!achievement.unlocked && showProgress && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>{t('achievement.progress')}</span>
                        <span>{progress.current}/{progress.total}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    {achievement.unlocked ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 text-sm font-medium">
                          {t('achievement.unlocked')}
                        </span>
                        {achievement.unlockedDate && (
                          <span className="text-xs text-slate-400">
                            {t('achievement.unlockedOn')} {achievement.unlockedDate.toLocaleDateString(getLocaleString(currentLanguage))}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-500 text-sm">
                          {t('achievement.notUnlocked')}
                        </span>
                        <span className="text-xs text-slate-400">
                          {Math.round(progress.percentage)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8">
          <Award className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300 mb-2">
            No achievements found
          </h3>
          <p className="text-slate-400">
            Try changing the filter or start earning achievements!
          </p>
        </div>
      )}
    </div>
  )
}

export default AchievementsPanel