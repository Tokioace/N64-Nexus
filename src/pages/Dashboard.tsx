import { useGameData } from '../contexts/GameDataContext'
import { User } from '../types'
import StatCard from '../components/StatCard'
import GameCard from '../components/GameCard'
import ProgressChart from '../components/ProgressChart'
import AchievementCard from '../components/AchievementCard'
import { TrendingUp, Clock, Trophy, Target } from 'lucide-react'

interface DashboardProps {
  user: User
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { games, runs, goals, achievements, getUserStats } = useGameData()
  const stats = getUserStats()

  const recentGames = games.slice(0, 3)
  const activeGoals = goals.filter(goal => !goal.isCompleted).slice(0, 3)
  const unlockedAchievements = achievements.filter(achievement => achievement.unlockedAt).slice(0, 3)

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-arcade text-white mb-2">
          Willkommen zurück, {user.username}! 🏁
        </h1>
        <p className="text-retro-gray font-retro">
          Deine Battle64 Statistiken & Fortschritt
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Gesamt Runs"
          value={stats.totalRuns.toString()}
          icon={TrendingUp}
          color="retro-green"
          change="+12 diese Woche"
        />
        <StatCard
          title="Durchschnittszeit"
          value={formatTime(stats.averageTime)}
          icon={Clock}
          color="retro-blue"
          change="-2.3s vs. letzte Woche"
        />
        <StatCard
          title="Persönliche Bestzeiten"
          value={stats.personalBests.toString()}
          icon={Trophy}
          color="retro-yellow"
          change="+3 diesen Monat"
        />
        <StatCard
          title="Aktive Ziele"
          value={activeGoals.length.toString()}
          icon={Target}
          color="retro-purple"
          change="2 nahe am Ziel"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Games */}
        <div className="lg:col-span-2">
          <div className="retro-card">
            <h2 className="text-2xl font-arcade text-white mb-6 flex items-center">
              <Trophy className="w-6 h-6 mr-3 text-retro-yellow" />
              Letzte Spiele
            </h2>
            <div className="space-y-4">
              {recentGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        </div>

        {/* Progress & Goals */}
        <div className="space-y-6">
          {/* Progress Chart */}
          <div className="retro-card">
            <h3 className="text-xl font-arcade text-white mb-4">Fortschritt</h3>
            <ProgressChart />
          </div>

          {/* Active Goals */}
          <div className="retro-card">
            <h3 className="text-xl font-arcade text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-retro-purple" />
              Aktive Ziele
            </h3>
            <div className="space-y-3">
              {activeGoals.map((goal) => (
                <div key={goal.id} className="bg-retro-darker rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-retro text-white">
                      {games.find(g => g.id === goal.gameId)?.name}
                    </span>
                    <span className="text-xs text-retro-gray">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-retro-gray rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-retro-purple to-retro-pink h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="retro-card">
        <h2 className="text-2xl font-arcade text-white mb-6">Erfolge</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {unlockedAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard