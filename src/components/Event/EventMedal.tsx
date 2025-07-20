import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Trophy, Medal, Award, Star, Crown } from 'lucide-react'
import { EventMedal as EventMedalType } from '../../types'

interface EventMedalProps {
  medal: EventMedalType
  size?: 'small' | 'medium' | 'large'
  showTooltip?: boolean
  animated?: boolean
  className?: string
}

const EventMedal: React.FC<EventMedalProps> = ({
  medal,
  size = 'medium',
  showTooltip = true,
  animated = true,
  className = ''
}) => {
  const getMedalIcon = (type: 'gold' | 'silver' | 'bronze') => {
    const sizeClass = {
      small: 'w-6 h-6',
      medium: 'w-8 h-8', 
      large: 'w-12 h-12'
    }[size]

    switch (type) {
      case 'gold':
        return <Crown className={`${sizeClass} text-yellow-400`} />
      case 'silver':
        return <Medal className={`${sizeClass} text-gray-300`} />
      case 'bronze':
        return <Award className={`${sizeClass} text-amber-600`} />
    }
  }

  const getMedalColors = (type: 'gold' | 'silver' | 'bronze') => {
    switch (type) {
      case 'gold':
        return {
          gradient: 'from-yellow-500/30 to-yellow-600/30',
          border: 'border-yellow-500/60',
          glow: 'shadow-yellow-500/20',
          text: 'text-yellow-400',
          bg: 'bg-yellow-500/10'
        }
      case 'silver':
        return {
          gradient: 'from-gray-400/30 to-gray-500/30',
          border: 'border-gray-400/60',
          glow: 'shadow-gray-400/20',
          text: 'text-gray-300',
          bg: 'bg-gray-400/10'
        }
      case 'bronze':
        return {
          gradient: 'from-amber-600/30 to-amber-700/30',
          border: 'border-amber-600/60',
          glow: 'shadow-amber-600/20',
          text: 'text-amber-600',
          bg: 'bg-amber-600/10'
        }
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'w-12 h-12',
          text: 'text-xs',
          padding: 'p-2'
        }
      case 'medium':
        return {
          container: 'w-16 h-16',
          text: 'text-sm',
          padding: 'p-3'
        }
      case 'large':
        return {
          container: 'w-24 h-24',
          text: 'text-base',
          padding: 'p-4'
        }
    }
  }

  const colors = getMedalColors(medal.type)
  const sizeClasses = getSizeClasses()

  const medalElement = (
    <motion.div
      className={`
        ${sizeClasses.container}
        bg-gradient-to-br ${colors.gradient}
        border-2 ${colors.border}
        rounded-full
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110 hover:shadow-lg ${colors.glow}
        cursor-pointer
        ${className}
      `}
      initial={animated ? { scale: 0, rotate: -180 } : false}
      animate={animated ? { scale: 1, rotate: 0 } : false}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.1 
      }}
      whileHover={{ 
        scale: 1.1,
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.3 }
      }}
    >
      {getMedalIcon(medal.type)}
    </motion.div>
  )

  if (!showTooltip) {
    return medalElement
  }

  return (
    <div className="group relative">
      {medalElement}
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
        <div className={`
          ${colors.bg} 
          border ${colors.border}
          rounded-lg p-3 shadow-lg
          min-w-max max-w-xs
        `}>
          {/* Medal Title */}
          <div className={`font-bold ${colors.text} mb-1 text-center`}>
            {medal.type === 'gold' ? '🥇 Goldmedaille' : 
             medal.type === 'silver' ? '🥈 Silbermedaille' : 
             '🥉 Bronzemedaille'}
          </div>
          
          {/* Event Info */}
          <div className="text-white text-sm mb-2 text-center">
            {medal.eventTitle}
          </div>
          
          {/* Condition */}
          <div className="text-gray-300 text-xs mb-2 text-center">
            {medal.condition}
            {medal.rank && ` (Platz ${medal.rank})`}
          </div>
          
          {/* Date */}
          <div className="flex items-center justify-center gap-1 text-gray-400 text-xs">
            <Calendar className="w-3 h-3" />
            {medal.awardedAt.toLocaleDateString('de-DE')}
          </div>
          
          {/* Arrow pointing down */}
          <div className={`
            absolute top-full left-1/2 transform -translate-x-1/2 
            w-0 h-0 border-l-4 border-r-4 border-t-4 
            border-l-transparent border-r-transparent ${colors.border.replace('border-', 'border-t-')}
          `} />
        </div>
      </div>
    </div>
  )
}

// Medal collection component for displaying multiple medals
interface EventMedalCollectionProps {
  medals: EventMedalType[]
  maxDisplay?: number
  size?: 'small' | 'medium' | 'large'
  showMore?: boolean
  animated?: boolean
  className?: string
}

export const EventMedalCollection: React.FC<EventMedalCollectionProps> = ({
  medals,
  maxDisplay = 5,
  size = 'medium',
  showMore = true,
  animated = true,
  className = ''
}) => {
  const displayedMedals = medals.slice(0, maxDisplay)
  const remainingCount = medals.length - maxDisplay

  if (medals.length === 0) {
    return (
      <div className={`text-center text-gray-400 ${className}`}>
        <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <div className="text-sm">Noch keine Medaillen</div>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {displayedMedals.map((medal, index) => (
        <motion.div
          key={medal.id}
          initial={animated ? { opacity: 0, y: 20 } : false}
          animate={animated ? { opacity: 1, y: 0 } : false}
          transition={{ delay: index * 0.1 }}
        >
          <EventMedal 
            medal={medal} 
            size={size} 
            animated={false} // Already animated by parent
          />
        </motion.div>
      ))}
      
      {/* Show more indicator */}
      {showMore && remainingCount > 0 && (
        <motion.div
          className={`
            ${size === 'small' ? 'w-12 h-12 text-xs' : 
              size === 'medium' ? 'w-16 h-16 text-sm' : 
              'w-24 h-24 text-base'}
            bg-gray-800/50 border-2 border-gray-600/50
            rounded-full flex items-center justify-center
            text-gray-400 font-bold
            transition-all duration-300 hover:bg-gray-700/50
          `}
          initial={animated ? { opacity: 0, scale: 0 } : false}
          animate={animated ? { opacity: 1, scale: 1 } : false}
          transition={{ delay: displayedMedals.length * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          +{remainingCount}
        </motion.div>
      )}
    </div>
  )
}

// Medal stats component
interface EventMedalStatsProps {
  medals: EventMedalType[]
  className?: string
}

export const EventMedalStats: React.FC<EventMedalStatsProps> = ({
  medals,
  className = ''
}) => {
  const goldCount = medals.filter(m => m.type === 'gold').length
  const silverCount = medals.filter(m => m.type === 'silver').length
  const bronzeCount = medals.filter(m => m.type === 'bronze').length
  const totalCount = medals.length

  return (
    <div className={`grid grid-cols-4 gap-4 ${className}`}>
      <div className="text-center">
        <div className="text-2xl font-bold text-yellow-400">{goldCount}</div>
        <div className="text-xs text-gray-400">Gold</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-300">{silverCount}</div>
        <div className="text-xs text-gray-400">Silber</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-amber-600">{bronzeCount}</div>
        <div className="text-xs text-gray-400">Bronze</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-400">{totalCount}</div>
        <div className="text-xs text-gray-400">Gesamt</div>
      </div>
    </div>
  )
}

export default EventMedal