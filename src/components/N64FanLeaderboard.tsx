import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { usePoints } from '../contexts/PointsContext'
import { useUser } from '../contexts/UserContext'
import { 
  Trophy, 
  Crown, 
  Medal,
  Filter,
  MapPin,
  Gamepad2,
  Target
} from 'lucide-react'
import { N64FanLeaderboardEntry, LeaderboardFilter } from '../types'

interface N64FanLeaderboardProps {
  maxEntries?: number
  showFilters?: boolean
  compact?: boolean
}

const N64FanLeaderboard: React.FC<N64FanLeaderboardProps> = ({ 
  maxEntries = 50, 
  showFilters = true,
  compact = false 
}) => {
  const { t } = useLanguage()
  const { getLeaderboard, getUserPosition } = usePoints()
  const { user } = useUser()
  
  const [filter, setFilter] = useState<LeaderboardFilter>({
    type: 'global',
    timeframe: 'allTime',
    region: undefined,
    platform: undefined
  })
  
  const [leaderboard, setLeaderboard] = useState<N64FanLeaderboardEntry[]>([])
  const [userPosition, setUserPosition] = useState<number>(0)

  useEffect(() => {
    const entries = getLeaderboard(filter).slice(0, maxEntries)
    setLeaderboard(entries)
    
    if (user) {
      const position = getUserPosition(user.id, filter)
      setUserPosition(position)
    }
  }, [filter, maxEntries, user, getLeaderboard, getUserPosition])

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />
      case 2: return <Medal className="w-5 h-5 text-gray-300" />
      case 3: return <Medal className="w-5 h-5 text-amber-600" />
      default: return <Trophy className="w-4 h-4 text-slate-400" />
    }
  }

  const getRankColor = (position: number) => {
    switch (position) {
      case 1: return 'text-yellow-400 font-bold'
      case 2: return 'text-gray-300 font-bold'
      case 3: return 'text-amber-600 font-bold'
      default: return 'text-slate-300'
    }
  }

  const getPositionBg = (position: number, isCurrentUser: boolean = false) => {
    if (isCurrentUser) {
      return 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50'
    }
    
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-400/50'
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-300/50'
      case 3: return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-500/50'
      default: return 'bg-slate-800/50 border-slate-600/50'
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

  if (compact) {
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          {t('leaderboard.globalLeaderboard')}
        </h3>
        <div className="space-y-1">
          {leaderboard.slice(0, 5).map((entry) => (
            <div
              key={entry.userId}
              className={`leaderboard-entry ${
                getPositionBg(entry.position, entry.isCurrentUser || false)
              }`}
            >
              <div className="leaderboard-user-info">
                <span className="w-6 text-center flex-shrink-0">
                  {entry.position <= 3 ? getRankIcon(entry.position) : `#${entry.position}`}
                </span>
                <span 
                  className="leaderboard-username"
                  title={entry.username.length > 10 ? entry.username : undefined}
                >
                  {entry.username}
                </span>
                <span className="text-xs flex-shrink-0">
                  {getRankEmoji(entry.currentRank.key)}
                </span>
              </div>
              <div className="leaderboard-time-container">
                <div className={`leaderboard-time-compact ${getRankColor(entry.position)}`}>
                  {entry.totalPoints.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
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
            {t('leaderboard.globalLeaderboard')}
          </h1>
        </div>
        <p className="text-slate-400">
          {filter.timeframe === 'season' 
            ? t('leaderboard.seasonLeaderboard')
            : t('leaderboard.pageSubtitle')
          }
        </p>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="simple-tile">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-bold text-slate-100">{t('ui.filter')}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('leaderboard.filterType')}
              </label>
              <select
                value={filter.type}
                onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100"
              >
                <option value="global">{t('leaderboard.filterGlobal')}</option>
                <option value="friends">{t('leaderboard.filterFriends')}</option>
                <option value="region">{t('leaderboard.filterRegion')}</option>
              </select>
            </div>

            {/* Timeframe Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('leaderboard.timeframe')}
              </label>
              <select
                value={filter.timeframe}
                onChange={(e) => setFilter(prev => ({ ...prev, timeframe: e.target.value as any }))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100"
              >
                <option value="allTime">{t('leaderboard.timeframeAllTime')}</option>
                <option value="season">{t('leaderboard.timeframeSeason')}</option>
                <option value="month">{t('leaderboard.timeframeMonth')}</option>
              </select>
            </div>

            {/* Region/Platform Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('leaderboard.regionPlatform')}
              </label>
              <select
                value={filter.region || 'all'}
                onChange={(e) => setFilter(prev => ({ 
                  ...prev, 
                  region: e.target.value === 'all' ? undefined : e.target.value as any 
                }))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100"
              >
                <option value="all">{t('ui.allRegions')}</option>
                <option value="PAL">{t('ui.pal')}</option>
                <option value="NTSC">{t('ui.ntsc')}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* User Position */}
      {user && userPosition > 0 && (
        <div className="simple-tile bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="font-medium text-slate-100">{t('leaderboard.yourRank')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-400">#{userPosition}</span>
              <span className="text-slate-300">
                {user.points?.totalPoints?.toLocaleString() || '0'} {t('points.total')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="simple-tile">
        <div className="space-y-2">
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, _index) => (
              <div
                key={entry.userId}
                className={`leaderboard-entry hover:scale-[1.02] ${
                  getPositionBg(entry.position, entry.isCurrentUser || false)
                } ${entry.position <= 3 ? 'shadow-lg' : ''}`}
              >
                <div className="leaderboard-user-info">
                  {/* Position */}
                  <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
                    {entry.position <= 3 ? (
                      getRankIcon(entry.position)
                    ) : (
                      <span className={`text-lg font-bold ${getRankColor(entry.position)}`}>
                        #{entry.position}
                      </span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg flex-shrink-0">
                      {entry.avatar || '🎮'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span 
                          className={`leaderboard-username ${getRankColor(entry.position)}`}
                          title={entry.username.length > 12 ? entry.username : undefined}
                        >
                          {entry.username}
                        </span>
                        {entry.isCurrentUser && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full flex-shrink-0">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1 flex-shrink-0">
                          {getRankEmoji(entry.currentRank.key)}
                          {t(entry.currentRank.key as any)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <MapPin className="w-3 h-3" />
                          {entry.region}
                        </span>
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <Gamepad2 className="w-3 h-3" />
                          {entry.platform}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="leaderboard-time-container">
                  {/* Points */}
                  <div className={`leaderboard-time ${getRankColor(entry.position)}`}>
                    {filter.timeframe === 'season' 
                      ? entry.seasonPoints.toLocaleString()
                      : entry.totalPoints.toLocaleString()
                    }
                  </div>
                  <div className="text-xs text-slate-400">
                    {filter.timeframe === 'season' ? t('points.season') : t('points.total')}
                  </div>

                  {/* Medals */}
                  {entry.medals.length > 0 && (
                    <div className="flex items-center justify-end gap-1 mt-1">
                                                {entry.medals.slice(0, 3).map((medal, _medalIndex) => (
                        <span
                          key={medal.id}
                          className="text-sm"
                          title={`${t(medal.medalKey as any)} - ${medal.season}`}
                        >
                          {getMedalIcon(medal.medalKey)}
                        </span>
                      ))}
                      {entry.medals.length > 3 && (
                        <span className="text-xs text-slate-400">
                          +{entry.medals.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-300 mb-2">
                {t('leaderboard.noData')}
              </h3>
              <p className="text-slate-400">
                {t('leaderboard.noDataDesc')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default N64FanLeaderboard