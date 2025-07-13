import React, { useState } from 'react'
import { useQuiz } from '../contexts/QuizContext'
import { getRandomQuestions } from '../data/questions'
import { Users, Sword, Trophy, Clock, User } from 'lucide-react'

const DuelPage: React.FC = () => {
  const { state: quizState, startDuel } = useQuiz()
  const [player1Name, setPlayer1Name] = useState('')
  const [player2Name, setPlayer2Name] = useState('')
  const [isDuelActive, setIsDuelActive] = useState(false)

  const startDuelSession = () => {
    if (!player1Name.trim() || !player2Name.trim()) {
      alert('Bitte gib beide Spielernamen ein!')
      return
    }

    const questions = getRandomQuestions(10)
    const duelSession = {
      id: `duel_${Date.now()}`,
      player1: player1Name,
      player2: player2Name,
      questions,
      currentQuestionIndex: 0,
      player1Score: 0,
      player2Score: 0,
      player1Answers: [],
      player2Answers: [],
      status: 'waiting' as const,
      startTime: new Date()
    }

    startDuel(duelSession)
    setIsDuelActive(true)
  }

  if (isDuelActive && quizState.currentDuel) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="quiz-card">
          <h2 className="font-pixel text-3xl text-white mb-6 text-center">⚔️ Duell-Modus</h2>
          
          {/* Player Scores */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-n64-green/20 to-n64-blue/20 rounded-lg p-6 text-center">
              <User className="w-12 h-12 text-n64-green mx-auto mb-3" />
              <h3 className="font-pixel text-xl text-white mb-2">{quizState.currentDuel.player1}</h3>
              <div className="score-display">{quizState.currentDuel.player1Score}</div>
              <p className="text-white/70 text-sm">Punkte</p>
            </div>
            
            <div className="bg-gradient-to-r from-n64-red/20 to-n64-yellow/20 rounded-lg p-6 text-center">
              <User className="w-12 h-12 text-n64-red mx-auto mb-3" />
              <h3 className="font-pixel text-xl text-white mb-2">{quizState.currentDuel.player2}</h3>
              <div className="score-display">{quizState.currentDuel.player2Score}</div>
              <p className="text-white/70 text-sm">Punkte</p>
            </div>
          </div>

          {/* VS Display */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-n64-green to-n64-blue rounded-full flex items-center justify-center">
                <span className="font-pixel text-white text-lg">1</span>
              </div>
              <Sword className="w-12 h-12 text-n64-purple" />
              <div className="w-16 h-16 bg-gradient-to-br from-n64-red to-n64-yellow rounded-full flex items-center justify-center">
                <span className="font-pixel text-white text-lg">2</span>
              </div>
            </div>
          </div>

          {/* Game Status */}
          <div className="text-center">
            <p className="text-white/70 font-retro">
              Frage {quizState.currentDuel.currentQuestionIndex + 1} von {quizState.currentDuel.questions.length}
            </p>
            <p className="text-white/80 mt-2">
              Status: {quizState.currentDuel.status === 'waiting' ? 'Wartet auf Spieler...' : 
                      quizState.currentDuel.status === 'active' ? 'Aktiv' : 'Beendet'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mt-6">
            <button 
              onClick={() => setIsDuelActive(false)}
              className="retro-button"
            >
              Duell beenden
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="quiz-card">
        <h2 className="font-pixel text-3xl text-white mb-6 text-center">⚔️ Duell-Modus</h2>
        
        <div className="space-y-6">
          <div className="text-center">
            <Users className="w-16 h-16 text-n64-purple mx-auto mb-4" />
            <p className="text-white/80 font-retro">
              Fordere einen Freund heraus! Beide Spieler beantworten die gleichen Fragen.
              Wer schneller und richtiger antwortet, gewinnt!
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white font-pixel mb-2">Spieler 1</label>
              <input
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                placeholder="Name des ersten Spielers"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-retro placeholder-white/50 focus:outline-none focus:border-n64-green/50"
              />
            </div>

            <div>
              <label className="block text-white font-pixel mb-2">Spieler 2</label>
              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                placeholder="Name des zweiten Spielers"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-retro placeholder-white/50 focus:outline-none focus:border-n64-green/50"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-n64-purple/20 to-n64-blue/20 rounded-lg p-4 border border-white/20">
            <h3 className="font-pixel text-white mb-2">📋 Duell-Regeln:</h3>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• 10 Fragen aus verschiedenen Kategorien</li>
              <li>• 30 Sekunden Zeit pro Frage</li>
              <li>• Schnellere Antworten geben Bonus-Punkte</li>
              <li>• Spieler mit den meisten Punkten gewinnt</li>
            </ul>
          </div>

          <button 
            onClick={startDuelSession}
            disabled={!player1Name.trim() || !player2Name.trim()}
            className="retro-button w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sword size={16} />
            <span>Duell starten</span>
          </button>
        </div>
      </div>

      {/* Feature Preview */}
      <div className="quiz-card mt-6">
        <h3 className="font-pixel text-xl text-white mb-4 text-center">🎯 Kommende Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <Clock className="w-8 h-8 text-n64-yellow mx-auto mb-2" />
            <p className="text-white/70 text-sm">Live-Timer</p>
          </div>
          <div className="text-center">
            <Trophy className="w-8 h-8 text-n64-yellow mx-auto mb-2" />
            <p className="text-white/70 text-sm">Duell-Rangliste</p>
          </div>
          <div className="text-center">
            <Users className="w-8 h-8 text-n64-green mx-auto mb-2" />
            <p className="text-white/70 text-sm">Team-Modus (4v4)</p>
          </div>
          <div className="text-center">
            <Sword className="w-8 h-8 text-n64-red mx-auto mb-2" />
            <p className="text-white/70 text-sm">Turnier-Modus</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DuelPage