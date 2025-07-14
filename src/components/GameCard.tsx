import { Link } from 'react-router-dom'
import { Game } from '../types'
import { Trophy, Clock, TrendingUp } from 'lucide-react'

interface GameCardProps {
  game: Game
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Link to={`/stats/${game.id}`}>
      <div className="bg-retro-darker border border-retro-gray rounded-lg p-4 hover:border-retro-purple transition-all duration-300 group">
        <div className="flex items-center space-x-4">
          {/* Game Cover */}
          <div className="w-16 h-16 bg-gradient-to-br from-retro-purple to-retro-pink rounded-lg flex items-center justify-center">
            <span className="text-white font-arcade text-xs text-center">
              {game.name.split(' ').map(word => word[0]).join('')}
            </span>
          </div>
          
          {/* Game Info */}
          <div className="flex-1">
            <h3 className="text-lg font-arcade text-white group-hover:text-retro-purple transition-colors">
              {game.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-retro-gray font-retro">
              <span>{game.platform}</span>
              <span>•</span>
              <span>{game.region}</span>
              <span>•</span>
              <span>{game.releaseYear}</span>
            </div>
          </div>
          
          {/* Stats */}
          <div className="text-right">
            <div className="flex items-center space-x-2 text-retro-yellow">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-arcade">#{game.globalRank}</span>
            </div>
            <div className="flex items-center space-x-2 text-retro-blue mt-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-retro">
                {game.personalBest ? formatTime(game.personalBest.totalTime) : '--:--'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-retro-green mt-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-retro">{game.totalRuns} Runs</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default GameCard