import React, { useState } from 'react'
import { Play, Pause, Square, Clock, Trophy, Target } from 'lucide-react'
import './SpeedrunsPage.css'

interface Speedrun {
  id: string
  game: string
  category: string
  personalBest: string
  worldRecord: string
  isRunning: boolean
  currentTime: string
}

const SpeedrunsPage: React.FC = () => {
  const [speedruns, setSpeedruns] = useState<Speedrun[]>([
    {
      id: '1',
      game: 'Super Mario Bros',
      category: 'Any%',
      personalBest: '1:23:45',
      worldRecord: '1:20:10',
      isRunning: false,
      currentTime: '00:00:00',
    },
    {
      id: '2',
      game: 'Zelda: Ocarina of Time',
      category: 'Any%',
      personalBest: '2:15:30',
      worldRecord: '2:10:45',
      isRunning: false,
      currentTime: '00:00:00',
    },
  ])

  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

  const startRun = (id: string) => {
    setSpeedruns(prev => 
      prev.map(run => 
        run.id === id ? { ...run, isRunning: true } : run
      )
    )
    setActiveTimer(id)
    
    const interval = setInterval(() => {
      setSpeedruns(prev => 
        prev.map(run => {
          if (run.id === id && run.isRunning) {
            const [hours, minutes, seconds] = run.currentTime.split(':').map(Number)
            const totalSeconds = hours * 3600 + minutes * 60 + seconds + 1
            const newHours = Math.floor(totalSeconds / 3600)
            const newMinutes = Math.floor((totalSeconds % 3600) / 60)
            const newSeconds = totalSeconds % 60
            return {
              ...run,
              currentTime: `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`
            }
          }
          return run
        })
      )
    }, 1000)
    
    setTimerInterval(interval)
  }

  const pauseRun = (id: string) => {
    setSpeedruns(prev => 
      prev.map(run => 
        run.id === id ? { ...run, isRunning: false } : run
      )
    )
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
    setActiveTimer(null)
  }

  const stopRun = (id: string) => {
    setSpeedruns(prev => 
      prev.map(run => 
        run.id === id ? { 
          ...run, 
          isRunning: false, 
          currentTime: '00:00:00',
          personalBest: run.currentTime // In a real app, you'd compare and update PB
        } : run
      )
    )
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
    setActiveTimer(null)
  }

  return (
    <div className="speedruns-page">
      <header className="page-header">
        <h1>Speedruns</h1>
        <p>Verwalte deine Speedrunning Sessions</p>
      </header>

      <div className="speedruns-grid">
        {speedruns.map((run) => (
          <div key={run.id} className="speedrun-card">
            <div className="speedrun-header">
              <h3>{run.game}</h3>
              <span className="category">{run.category}</span>
            </div>
            
            <div className="speedrun-stats">
              <div className="stat">
                <Clock size={16} />
                <span>PB: {run.personalBest}</span>
              </div>
              <div className="stat">
                <Trophy size={16} />
                <span>WR: {run.worldRecord}</span>
              </div>
            </div>

            <div className="timer-display">
              <Target size={20} />
              <span className="current-time">{run.currentTime}</span>
            </div>

            <div className="speedrun-controls">
              {!run.isRunning ? (
                <button 
                  onClick={() => startRun(run.id)}
                  className="btn btn-primary"
                  disabled={activeTimer !== null}
                >
                  <Play size={16} />
                  Start
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => pauseRun(run.id)}
                    className="btn btn-secondary"
                  >
                    <Pause size={16} />
                    Pause
                  </button>
                  <button 
                    onClick={() => stopRun(run.id)}
                    className="btn btn-danger"
                  >
                    <Square size={16} />
                    Stop
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SpeedrunsPage