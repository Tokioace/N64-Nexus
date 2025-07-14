import { useGameData } from '../contexts/GameDataContext'
import { Clock, Trophy, Calendar, Filter } from 'lucide-react'

const History: React.FC = () => {
  const { runs, games } = useGameData()

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const sortedRuns = [...runs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-arcade text-white mb-2">Run Verlauf</h1>
        <p className="text-retro-gray font-retro">Deine komplette Geschichte aller Runs</p>
      </div>

      {/* Filters */}
      <div className="retro-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-arcade text-white flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-retro-blue" />
            Alle Runs ({runs.length})
          </h2>
          <button className="retro-button flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>

        {/* Run History */}
        <div className="space-y-4">
          {sortedRuns.map((run) => {
            const game = games.find(g => g.id === run.gameId)
            
            return (
              <div key={run.id} className="bg-retro-darker border border-retro-gray rounded-lg p-6 hover:border-retro-purple transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Game Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-retro-purple to-retro-pink rounded-lg flex items-center justify-center">
                      <span className="text-white font-arcade text-xs">
                        {game?.name.split(' ').map(word => word[0]).join('')}
                      </span>
                    </div>
                    
                    {/* Run Info */}
                    <div>
                      <h3 className="text-lg font-arcade text-white mb-1">
                        {game?.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-retro-gray font-retro">
                        <span>{run.platform}</span>
                        <span>•</span>
                        <span>{run.region}</span>
                        <span>•</span>
                        <span>{run.date.toLocaleDateString('de-DE')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Time & Badges */}
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-retro-blue" />
                      <span className="text-xl font-arcade text-white">
                        {formatTime(run.totalTime)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {run.isPersonalBest && (
                        <div className="achievement-badge achievement-gold">
                          <Trophy className="w-3 h-3" />
                          <span className="ml-1 text-xs">PB</span>
                        </div>
                      )}
                      {run.isWorldRecord && (
                        <div className="achievement-badge achievement-gold">
                          <Trophy className="w-3 h-3" />
                          <span className="ml-1 text-xs">WR</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Track Times */}
                {run.trackTimes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-retro-gray">
                    <h4 className="text-sm font-retro text-retro-gray mb-2">Streckenzeiten:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {run.trackTimes.map((track, index) => (
                        <div key={index} className="text-xs font-retro text-retro-gray">
                          <span className="text-white">{track.trackName}:</span>
                          <span className="ml-1">{formatTime(track.time)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {runs.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-retro-gray mx-auto mb-4" />
            <p className="text-retro-gray font-retro">Noch keine Runs aufgezeichnet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default History