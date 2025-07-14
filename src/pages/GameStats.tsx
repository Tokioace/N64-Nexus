import { useParams } from 'react-router-dom'
import { useGameData } from '../contexts/GameDataContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Clock, Trophy, Target, TrendingUp, Calendar } from 'lucide-react'

const GameStats: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>()
  const { games, runs, getGameStats } = useGameData()
  
  const game = games.find(g => g.id === gameId)
  const stats = gameId ? getGameStats(gameId) : null

  if (!game || !stats) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-arcade text-white">Spiel nicht gefunden</h2>
      </div>
    )
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Mock track data for visualization
  const trackData = [
    { track: 'Luigi Raceway', time: 30, pb: 28, wr: 25 },
    { track: 'Moo Moo Farm', time: 35, pb: 32, wr: 29 },
    { track: 'Koopa Troopa Beach', time: 55, pb: 52, wr: 48 },
    { track: 'Kalimari Desert', time: 45, pb: 42, wr: 38 },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-retro-dark border border-retro-purple rounded-lg p-3 shadow-lg">
          <p className="text-white font-retro">{`Strecke: ${label}`}</p>
          <p className="text-retro-blue font-retro">
            {`Deine Zeit: ${formatTime(payload[0].value * 1000)}`}
          </p>
          <p className="text-retro-green font-retro">
            {`PB: ${formatTime(payload[1].value * 1000)}`}
          </p>
          <p className="text-retro-yellow font-retro">
            {`WR: ${formatTime(payload[2].value * 1000)}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Game Header */}
      <div className="retro-card">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-retro-purple to-retro-pink rounded-lg flex items-center justify-center">
            <span className="text-white font-arcade text-lg">
              {game.name.split(' ').map(word => word[0]).join('')}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-arcade text-white mb-2">{game.name}</h1>
            <div className="flex items-center space-x-4 text-retro-gray font-retro">
              <span>{game.platform}</span>
              <span>•</span>
              <span>{game.region}</span>
              <span>•</span>
              <span>{game.releaseYear}</span>
              <span>•</span>
              <span>Global Rank: #{game.globalRank}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-retro-blue" />
            <div>
              <p className="text-sm font-retro text-retro-gray">Bestzeit</p>
              <p className="text-xl font-arcade text-white">
                {stats.personalBest ? formatTime(stats.personalBest.totalTime) : '--:--'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-retro-yellow" />
            <div>
              <p className="text-sm font-retro text-retro-gray">Gesamt Runs</p>
              <p className="text-xl font-arcade text-white">{stats.totalRuns}</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-retro-green" />
            <div>
              <p className="text-sm font-retro text-retro-gray">Durchschnitt</p>
              <p className="text-xl font-arcade text-white">
                {formatTime(stats.averageTime)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-retro-purple" />
            <div>
              <p className="text-sm font-retro text-retro-gray">Verbesserung</p>
              <p className="text-xl font-arcade text-white">-12.3s</p>
            </div>
          </div>
        </div>
      </div>

      {/* Track Times Chart */}
      <div className="retro-card">
        <h2 className="text-2xl font-arcade text-white mb-6">Streckenzeiten</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={trackData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="track" 
              stroke="#9CA3AF"
              fontSize={12}
              fontFamily="Courier New"
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              fontFamily="Courier New"
              tickFormatter={(value) => formatTime(value * 1000)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="time" fill="#6B7280" name="Deine Zeit" />
            <Bar dataKey="pb" fill="#3B82F6" name="Persönliche Bestzeit" />
            <Bar dataKey="wr" fill="#F59E0B" name="Weltrekord" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Runs */}
      <div className="retro-card">
        <h2 className="text-2xl font-arcade text-white mb-6">Letzte Runs</h2>
        <div className="space-y-4">
          {stats.recentRuns?.map((run: any) => (
            <div key={run.id} className="bg-retro-darker rounded-lg p-4 border border-retro-gray">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-retro">
                    {run.date.toLocaleDateString('de-DE')}
                  </p>
                  <p className="text-retro-gray text-sm font-retro">
                    {run.platform} • {run.region}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-arcade text-white">
                    {formatTime(run.totalTime)}
                  </p>
                  {run.isPersonalBest && (
                    <span className="text-xs text-retro-yellow font-retro">PB!</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GameStats