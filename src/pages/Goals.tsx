import { useState } from 'react'
import { useGameData } from '../contexts/GameDataContext'
import { Target, Plus, Calendar, Trophy, Users } from 'lucide-react'

const Goals: React.FC = () => {
  const { goals, games, addGoal } = useGameData()
  const [showAddGoal, setShowAddGoal] = useState(false)

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const activeGoals = goals.filter(goal => !goal.isCompleted)
  const completedGoals = goals.filter(goal => goal.isCompleted)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-arcade text-white mb-2">Ziele & Fortschritt</h1>
          <p className="text-retro-gray font-retro">Setze dir Ziele und verfolge deinen Fortschritt</p>
        </div>
        <button 
          onClick={() => setShowAddGoal(true)}
          className="retro-button flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Neues Ziel</span>
        </button>
      </div>

      {/* Active Goals */}
      <div className="retro-card">
        <h2 className="text-2xl font-arcade text-white mb-6 flex items-center">
          <Target className="w-6 h-6 mr-3 text-retro-purple" />
          Aktive Ziele ({activeGoals.length})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeGoals.map((goal) => {
            const game = games.find(g => g.id === goal.gameId)
            const progressColor = goal.progress >= 80 ? 'retro-green' : 
                                goal.progress >= 50 ? 'retro-yellow' : 'retro-red'
            
            return (
              <div key={goal.id} className="bg-retro-darker border border-retro-gray rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-arcade text-white mb-1">
                      {game?.name}
                    </h3>
                    <p className="text-retro-gray font-retro text-sm">
                      Ziel: {formatTime(goal.targetTime)}
                    </p>
                    {goal.currentBest && (
                      <p className="text-retro-blue font-retro text-sm">
                        Aktuell: {formatTime(goal.currentBest)}
                      </p>
                    )}
                  </div>
                  <div className={`achievement-badge ${
                    goal.type === 'personal' ? 'achievement-silver' : 'achievement-gold'
                  }`}>
                    {goal.type === 'personal' ? <Trophy className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                    <span className="ml-1">{goal.type === 'personal' ? 'Persönlich' : 'Challenge'}</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-retro text-retro-gray">Fortschritt</span>
                    <span className={`text-sm font-arcade text-${progressColor}`}>
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-retro-gray rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r from-${progressColor} to-${progressColor}/70 h-3 rounded-full transition-all duration-300`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
                
                {/* Deadline */}
                {goal.deadline && (
                  <div className="flex items-center text-retro-gray text-sm font-retro">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Deadline: {goal.deadline.toLocaleDateString('de-DE')}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {activeGoals.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-retro-gray mx-auto mb-4" />
            <p className="text-retro-gray font-retro">Noch keine aktiven Ziele</p>
            <button 
              onClick={() => setShowAddGoal(true)}
              className="retro-button mt-4"
            >
              Erstes Ziel setzen
            </button>
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="retro-card">
          <h2 className="text-2xl font-arcade text-white mb-6 flex items-center">
            <Trophy className="w-6 h-6 mr-3 text-retro-yellow" />
            Erreichte Ziele ({completedGoals.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedGoals.map((goal) => {
              const game = games.find(g => g.id === goal.gameId)
              
              return (
                <div key={goal.id} className="bg-retro-darker border border-retro-green rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-arcade text-white mb-1">
                        {game?.name}
                      </h3>
                      <p className="text-retro-green font-retro text-sm">
                        Ziel erreicht: {formatTime(goal.targetTime)}
                      </p>
                    </div>
                    <div className="achievement-badge achievement-gold">
                      <Trophy className="w-4 h-4" />
                      <span className="ml-1">Erreicht!</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Goals