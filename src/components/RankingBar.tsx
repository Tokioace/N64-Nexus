import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { usePoints } from '../contexts/PointsContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Trophy, Zap, ChevronUp, ChevronDown } from 'lucide-react'

const RankingBar: React.FC = () => {
  const { user, isAuthenticated } = useUser()
  const { getUserPosition, userPoints } = usePoints()
  const { t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  if (!isAuthenticated || !user || !userPoints) {
    return null
  }

  const currentRank = getUserPosition(user.id, { type: 'global', timeframe: 'allTime' })
  const currentXP = (user.xp || 0) % 1000
  const maxXP = 1000
  const progressPercentage = Math.min((currentXP / maxXP) * 100, 100)
  const level = Math.floor((user.xp || 0) / 1000) + 1

  return (
    <div 
      className="fixed z-40 transition-all duration-500 ease-out"
      style={{
        top: 'clamp(0.5rem, 2vw, 1rem)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'clamp(200px, 40vw, 280px)', // More compact width
        maxWidth: 'calc(100vw - 120px)', // Leave space for user icon and sidebar
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        relative backdrop-blur-md bg-gradient-to-r from-slate-800/80 via-slate-700/80 to-slate-800/80 
        border border-slate-600/50 rounded-xl shadow-2xl transition-all duration-300 ease-out
        ${isHovered ? 'shadow-blue-500/20 border-blue-500/30 scale-105' : ''}
        ${isExpanded ? 'pb-3' : 'pb-1'}
      `}>
        {/* Glasmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 rounded-xl" />
        
        {/* Main content */}
        <div className="relative px-3 py-2">
          {/* Top row - Ultra compact layout */}
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            {/* Rank Badge */}
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg shadow-lg transform hover:scale-105 transition-transform flex-shrink-0">
              <Trophy className="w-3 h-3" />
              <span className="text-xs">#{currentRank || '1'}</span>
            </div>

            {/* Level Badge */}
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg flex-shrink-0">
              <Zap className="w-3 h-3" />
              <span className="text-xs">Lv.{level}</span>
            </div>

            {/* CP Badge */}
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg shadow-lg flex-shrink-0">
              <span className="text-xs">
                {userPoints.totalPoints > 999 
                  ? `${Math.floor(userPoints.totalPoints / 1000)}k` 
                  : userPoints.totalPoints} CP
              </span>
            </div>
          </div>

          {/* XP Progress Section - Compact */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium text-xs">RangEXP</span>
              <span className="font-mono text-xs">{currentXP} / {maxXP}</span>
            </div>
            
            {/* Enhanced Progress Bar - Thinner */}
            <div className="relative h-1.5 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/30">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 transition-all duration-700 ease-out rounded-full shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              />
              {/* Shine effect */}
              <div 
                className={`absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full ${isHovered ? 'shimmer-effect' : ''}`}
                style={{ 
                  width: '30%',
                  left: `${Math.min(progressPercentage, 70)}%`
                }}
              />
            </div>
          </div>

          {/* Expand/Collapse Button - Smaller */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-slate-700/80 hover:bg-slate-600/80 border border-slate-500/50 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            {isExpanded ? (
              <ChevronUp className="w-2.5 h-2.5 text-slate-300" />
            ) : (
              <ChevronDown className="w-2.5 h-2.5 text-slate-300" />
            )}
          </button>

          {/* Expanded Content - Compact */}
          <div className={`
            overflow-hidden transition-all duration-300 ease-out
            ${isExpanded ? 'max-h-16 opacity-100 mt-3' : 'max-h-0 opacity-0'}
          `}>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800/50 rounded-md p-1.5 border border-slate-600/30">
                <div className="text-slate-400 mb-0.5 text-xs">Season Rank</div>
                <div className="text-white font-semibold text-xs">#{currentRank || '1'}</div>
              </div>
              <div className="bg-slate-800/50 rounded-md p-1.5 border border-slate-600/30">
                <div className="text-slate-400 mb-0.5 text-xs">Next Level</div>
                <div className="text-white font-semibold text-xs">{maxXP - currentXP} XP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RankingBar