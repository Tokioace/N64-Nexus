import React from 'react'
import { Trophy, Award, Star } from 'lucide-react'

interface EventMedalProps {
  medal: 'gold' | 'silver' | 'bronze' | 'top10' | 'participant'
  eventTitle: string
  position?: number
  size?: 'small' | 'medium' | 'large'
}

const EventMedal: React.FC<EventMedalProps> = ({ 
  medal, 
  eventTitle, 
  position, 
  size = 'medium' 
}) => {
  const getMedalIcon = () => {
    switch (medal) {
      case 'gold':
        return <Trophy className={`${getIconSize()} text-yellow-400`} />
      case 'silver':
        return <Trophy className={`${getIconSize()} text-gray-300`} />
      case 'bronze':
        return <Trophy className={`${getIconSize()} text-amber-600`} />
      case 'top10':
        return <Award className={`${getIconSize()} text-blue-400`} />
      case 'participant':
        return <Star className={`${getIconSize()} text-purple-400`} />
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'small': return 'w-4 h-4'
      case 'medium': return 'w-5 h-5'
      case 'large': return 'w-6 h-6'
    }
  }

  const getMedalText = () => {
    switch (medal) {
      case 'gold': return 'Gold'
      case 'silver': return 'Silber'
      case 'bronze': return 'Bronze'
      case 'top10': return 'Top 10'
      case 'participant': return 'Teilnahme'
    }
  }

  const getMedalColor = () => {
    switch (medal) {
      case 'gold': return 'bg-yellow-400/20 border-yellow-400/40'
      case 'silver': return 'bg-gray-300/20 border-gray-300/40'
      case 'bronze': return 'bg-amber-600/20 border-amber-600/40'
      case 'top10': return 'bg-blue-400/20 border-blue-400/40'
      case 'participant': return 'bg-purple-400/20 border-purple-400/40'
    }
  }

  return (
    <div className={`flex items-center space-x-2 p-2 rounded-lg border ${getMedalColor()}`}>
      {getMedalIcon()}
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-slate-100 ${size === 'small' ? 'text-sm' : ''}`}>
          {getMedalText()}
          {position && position <= 10 && ` (#${position})`}
        </div>
        <div className={`text-slate-400 truncate ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
          {eventTitle}
        </div>
      </div>
    </div>
  )
}

export default EventMedal