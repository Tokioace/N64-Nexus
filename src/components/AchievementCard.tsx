import { Achievement } from '../types'
import { Star, Lock } from 'lucide-react'

interface AchievementCardProps {
  achievement: Achievement
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const rarityColors = {
    common: 'text-retro-gray',
    rare: 'text-retro-blue',
    epic: 'text-retro-purple',
    legendary: 'text-retro-yellow'
  }

  const rarityBgColors = {
    common: 'bg-retro-gray/10',
    rare: 'bg-retro-blue/10',
    epic: 'bg-retro-purple/10',
    legendary: 'bg-retro-yellow/10'
  }

  const isUnlocked = achievement.unlockedAt !== undefined

  return (
    <div className={`bg-retro-darker border rounded-lg p-4 transition-all duration-300 ${
      isUnlocked 
        ? 'border-retro-green hover:border-retro-green/50' 
        : 'border-retro-gray hover:border-retro-gray/50'
    }`}>
      <div className="flex items-start space-x-3">
        {/* Achievement Icon */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
          isUnlocked ? rarityBgColors[achievement.rarity] : 'bg-retro-gray/20'
        }`}>
          {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-retro-gray" />}
        </div>
        
        {/* Achievement Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className={`font-arcade text-sm ${
              isUnlocked ? 'text-white' : 'text-retro-gray'
            }`}>
              {achievement.name}
            </h3>
            {isUnlocked && (
              <Star className={`w-4 h-4 ${rarityColors[achievement.rarity]}`} />
            )}
          </div>
          
          <p className={`text-xs font-retro mb-2 ${
            isUnlocked ? 'text-retro-gray' : 'text-retro-gray/60'
          }`}>
            {achievement.description}
          </p>
          
          {/* Progress Bar for Incomplete Achievements */}
          {!isUnlocked && achievement.progress !== undefined && achievement.maxProgress !== undefined && (
            <div className="w-full bg-retro-gray/20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-retro-purple to-retro-pink h-2 rounded-full transition-all duration-300"
                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
              />
            </div>
          )}
          
          {/* Unlock Date */}
          {isUnlocked && achievement.unlockedAt && (
            <p className="text-xs text-retro-green font-retro mt-2">
              Freigeschaltet: {achievement.unlockedAt.toLocaleDateString('de-DE')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AchievementCard