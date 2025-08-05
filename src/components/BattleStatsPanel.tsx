import React, { useState } from 'react'
import { useMap } from '../contexts/MapContext'
import { useUser } from '../contexts/UserContext'

import { 
  Trophy, 
  Target, 
  Crown, 
  Star, 
  TrendingUp, 
  Gamepad2, 
  Award,
  Users,
  Calendar,
  BarChart3,
  Flame,
  X,
  Lock,
  Unlock
} from 'lucide-react'

interface BattleStatsPanelProps {
  isOpen: boolean
  onClose: () => void
}

const BattleStatsPanel: React.FC<BattleStatsPanelProps> = ({ isOpen, onClose }) => {
  const { user } = useUser()
  const { userStats, achievements, battlePass, leaderboard } = useMap()
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'battlepass' | 'leaderboard'>('stats')

  if (!isOpen || !user) return null

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-500'
      case 'rare': return 'text-blue-400 border-blue-500'
      case 'epic': return 'text-purple-400 border-purple-500'
      case 'legendary': return 'text-yellow-400 border-yellow-500'
      default: return 'text-gray-400 border-gray-500'
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'shadow-gray-500/20'
      case 'rare': return 'shadow-blue-500/30'
      case 'epic': return 'shadow-purple-500/40'
      case 'legendary': return 'shadow-yellow-500/50'
      default: return 'shadow-gray-500/20'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border-2 border-yellow-500/50 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border-b border-yellow-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="w-7 h-7 text-black" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-yellow-400">Battle Dashboard</h2>
                <p className="text-slate-400">Your N64 Gaming Legacy</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6">
            {[
              { id: 'stats', label: 'Battle Stats', icon: BarChart3 },
              { id: 'achievements', label: 'Achievements', icon: Award },
              { id: 'battlepass', label: 'Battle Pass', icon: Star },
              { id: 'leaderboard', label: 'Leaderboard', icon: Crown }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'stats' | 'achievements' | 'battlepass' | 'leaderboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-yellow-600 text-black shadow-lg'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'stats' && userStats && (
            <div className="space-y-6">
              {/* Overall Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-8 h-8 text-blue-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">{userStats.skillRating}</div>
                      <div className="text-sm text-blue-300">Skill Rating</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-green-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">{userStats.wins}</div>
                      <div className="text-sm text-green-300">Total Wins</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border border-purple-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Flame className="w-8 h-8 text-purple-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">{userStats.currentStreak}</div>
                      <div className="text-sm text-purple-300">Win Streak</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 border border-orange-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-orange-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">{userStats.winRate.toFixed(1)}%</div>
                      <div className="text-sm text-orange-300">Win Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Stats */}
              <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Game Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(userStats.gameStats).map(([game, stats]) => (
                    <div key={game} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                      <div className="font-medium text-white mb-2 truncate" title={game}>{game}</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Battles:</span>
                          <span className="text-white">{stats.battles}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Wins:</span>
                          <span className="text-green-400">{stats.wins}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Rating:</span>
                          <span className="text-blue-400">{stats.skillRating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Win Rate:</span>
                          <span className="text-yellow-400">
                            {stats.battles > 0 ? ((stats.wins / stats.battles) * 100).toFixed(1) : '0.0'}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Matches */}
              <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Matches
                </h3>
                <div className="space-y-3">
                  {userStats.recentMatches.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">No recent matches</p>
                  ) : (
                    userStats.recentMatches.slice(0, 5).map((match, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            match.result === 'win' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <div>
                            <div className="font-medium text-white">{match.game}</div>
                            <div className="text-sm text-slate-400">
                              {match.date.toLocaleDateString()} • Score: {match.score}
                            </div>
                          </div>
                        </div>
                        <div className={`font-bold ${
                          match.skillChange > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {match.skillChange > 0 ? '+' : ''}{match.skillChange}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {/* Achievement Categories */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['battles', 'social', 'exploration', 'mastery', 'special'].map((category) => {
                  const categoryAchievements = achievements.filter(a => a.category === category)
                  const unlockedCount = categoryAchievements.filter(a => a.unlockedAt).length
                  
                  return (
                    <div key={category} className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">
                        {category === 'battles' && '⚔️'}
                        {category === 'social' && '👥'}
                        {category === 'exploration' && '🗺️'}
                        {category === 'mastery' && '🎯'}
                        {category === 'special' && '✨'}
                      </div>
                      <div className="font-medium text-white capitalize">{category}</div>
                      <div className="text-sm text-slate-400">
                        {unlockedCount}/{categoryAchievements.length}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Achievement Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`bg-slate-800/50 border rounded-xl p-4 transition-all hover:scale-105 ${
                      achievement.unlockedAt 
                        ? `${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)} shadow-lg` 
                        : 'border-slate-600 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white">{achievement.title}</h4>
                          {achievement.unlockedAt ? (
                            <Unlock className="w-4 h-4 text-green-400" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{achievement.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Progress</span>
                            <span className="text-slate-400">
                              {achievement.progress}/{achievement.requirement.target}
                            </span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                achievement.unlockedAt ? 'bg-green-500' : 'bg-yellow-500'
                              }`}
                              style={{ 
                                width: `${Math.min(100, (achievement.progress / achievement.requirement.target) * 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className={`text-xs px-2 py-1 rounded ${getRarityColor(achievement.rarity)} border`}>
                            {achievement.rarity.toUpperCase()}
                          </span>
                          <span className="text-yellow-400 font-bold text-sm">
                            +{achievement.points} XP
                          </span>
                        </div>
                        
                        {achievement.unlockedAt && (
                          <div className="text-xs text-green-400 mt-2">
                            Unlocked {achievement.unlockedAt.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'battlepass' && battlePass && (
            <div className="space-y-6">
              {/* Battle Pass Header */}
              <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{battlePass.title}</h3>
                    <p className="text-purple-300">{battlePass.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-yellow-400">
                      Tier {battlePass.userProgress.currentTier}
                    </div>
                    <div className="text-sm text-slate-400">
                      {battlePass.userProgress.currentXp} XP
                    </div>
                  </div>
                </div>
                
                {/* XP Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Season Progress</span>
                    <span className="text-yellow-400">
                      {battlePass.userProgress.currentXp} / {battlePass.tiers[battlePass.tiers.length - 1].xpRequired} XP
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(100, (battlePass.userProgress.currentXp / battlePass.tiers[battlePass.tiers.length - 1].xpRequired) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Battle Pass Tiers */}
              <div className="space-y-4">
                {battlePass.tiers.map((tier) => {
                  const isUnlocked = battlePass.userProgress.currentTier >= tier.tier
                  const isCurrentTier = battlePass.userProgress.currentTier === tier.tier
                  
                  return (
                    <div
                      key={tier.tier}
                      className={`border rounded-xl p-4 transition-all ${
                        isCurrentTier 
                          ? 'border-yellow-500 bg-yellow-500/10 shadow-yellow-500/20 shadow-lg' 
                          : isUnlocked 
                            ? 'border-green-500/30 bg-green-500/5' 
                            : 'border-slate-600 bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                            isCurrentTier 
                              ? 'bg-yellow-500 text-black' 
                              : isUnlocked 
                                ? 'bg-green-500 text-white' 
                                : 'bg-slate-600 text-slate-400'
                          }`}>
                            {tier.tier}
                          </div>
                          <div>
                            <div className="font-bold text-white">Tier {tier.tier}</div>
                            <div className="text-sm text-slate-400">{tier.xpRequired} XP Required</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {/* Free Reward */}
                          {tier.freeReward && (
                            <div className={`border rounded-lg p-3 ${
                              isUnlocked ? 'border-green-500/50 bg-green-500/10' : 'border-slate-600 bg-slate-700/30'
                            }`}>
                              <div className="text-sm text-slate-400 mb-1">Free</div>
                              <div className="font-medium text-white">{tier.freeReward.item}</div>
                              {isUnlocked ? (
                                <div className="text-xs text-green-400 mt-1">✓ Unlocked</div>
                              ) : (
                                <div className="text-xs text-slate-500 mt-1">🔒 Locked</div>
                              )}
                            </div>
                          )}
                          
                          {/* Premium Reward */}
                          {tier.premiumReward && (
                            <div className={`border rounded-lg p-3 ${
                              isUnlocked && battlePass.userProgress.isPremium 
                                ? 'border-purple-500/50 bg-purple-500/10' 
                                : 'border-slate-600 bg-slate-700/30'
                            }`}>
                              <div className="text-sm text-purple-400 mb-1">Premium</div>
                              <div className="font-medium text-white">{tier.premiumReward.item}</div>
                              {isUnlocked && battlePass.userProgress.isPremium ? (
                                <div className="text-xs text-purple-400 mt-1">✓ Unlocked</div>
                              ) : battlePass.userProgress.isPremium ? (
                                <div className="text-xs text-slate-500 mt-1">🔒 Locked</div>
                              ) : (
                                <div className="text-xs text-orange-400 mt-1">💎 Premium Only</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-6">
              {/* Leaderboard Header */}
              <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-500/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-yellow-400 mb-2 flex items-center gap-3">
                  <Crown className="w-8 h-8" />
                  Global Leaderboard
                </h3>
                <p className="text-orange-300">Top N64 Battle Champions Worldwide</p>
              </div>

              {/* Top 3 Podium */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {leaderboard.slice(0, 3).map((player, index) => (
                  <div
                    key={player.userId}
                    className={`relative rounded-xl p-6 text-center ${
                      index === 0 
                        ? 'bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 border-2 border-yellow-500/50' 
                        : index === 1 
                          ? 'bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-2 border-gray-400/50' 
                          : 'bg-gradient-to-br from-amber-900/50 to-amber-800/50 border-2 border-amber-600/50'
                    }`}
                  >
                    <div className="text-4xl mb-2">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="font-bold text-white text-lg">{player.username}</div>
                    <div className="text-sm text-slate-400 mb-2">{player.country}</div>
                    <div className="text-2xl font-bold text-yellow-400">{player.skillRating}</div>
                    <div className="text-sm text-slate-300">{player.wins} wins</div>
                    <div className="text-xs text-slate-400 mt-1">{player.favoriteGame}</div>
                  </div>
                ))}
              </div>

              {/* Full Leaderboard */}
              <div className="bg-slate-800/50 border border-slate-600 rounded-xl overflow-hidden">
                <div className="bg-slate-700/50 p-4 border-b border-slate-600">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Top 10 Players
                  </h4>
                </div>
                <div className="divide-y divide-slate-600">
                  {leaderboard.slice(0, 10).map((player, index) => (
                    <div key={player.userId} className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index < 3 ? 'bg-yellow-500 text-black' : 'bg-slate-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-white">{player.username}</div>
                          <div className="text-sm text-slate-400">{player.favoriteGame}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-yellow-400">{player.skillRating}</div>
                        <div className="text-sm text-green-400">{player.wins} wins</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BattleStatsPanel