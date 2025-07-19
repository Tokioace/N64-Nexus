import React, { useState, useEffect } from 'react'

const MinigamesPage: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  // Emoji Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const minigames = [
    {
      id: 'emoji-quiz',
      name: 'N64 Emoji-Quiz',
      description: 'Errate das Spiel anhand von Emojis',
      icon: '🎮',
      difficulty: 'easy' as const,
      maxScore: 100,
      isAvailable: true,
      color: 'bg-blue-600/20',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-400'
    },
    {
      id: 'memory-game',
      name: 'N64 Memory',
      description: 'Finde passende Spiele-Paare',
      icon: '🧠',
      difficulty: 'medium' as const,
      maxScore: 150,
      isAvailable: true,
      color: 'bg-purple-600/20',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-400'
    },
    {
      id: 'quick-quiz',
      name: 'Quick Quiz',
      description: 'Schnelle N64-Fragen',
      icon: '⚡',
      difficulty: 'easy' as const,
      maxScore: 80,
      isAvailable: true,
      color: 'bg-yellow-600/20',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-400'
    },
    {
      id: 'character-match',
      name: 'Character Match',
      description: 'Ordne Charaktere ihren Spielen zu',
      icon: '👾',
      difficulty: 'medium' as const,
      maxScore: 120,
      isAvailable: true,
      color: 'bg-green-600/20',
      textColor: 'text-green-400',
      borderColor: 'border-green-400'
    }
  ]

  // Reset function for all game states
  const resetAllGameStates = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setCorrectAnswers(0)
    setScore(0)
  }

  // Game Image Component
  const GameImage: React.FC<{ game: string; className?: string }> = ({ game, className = "" }) => {
    const gameImages: { [key: string]: { bg: string; icon: string; char: string; color: string } } = {
      'Super Mario 64': {
        bg: 'bg-gradient-to-br from-red-500 to-blue-500',
        icon: '🍄',
        char: 'M',
        color: 'text-white'
      },
      'The Legend of Zelda: Ocarina of Time': {
        bg: 'bg-gradient-to-br from-green-600 to-yellow-500',
        icon: '🗡️',
        char: 'Z',
        color: 'text-white'
      },
      'Banjo-Kazooie': {
        bg: 'bg-gradient-to-br from-orange-500 to-brown-600',
        icon: '🐻',
        char: 'B',
        color: 'text-white'
      },
      'GoldenEye 007': {
        bg: 'bg-gradient-to-br from-gray-800 to-yellow-600',
        icon: '🔫',
        char: '007',
        color: 'text-yellow-400'
      }
    }

    const gameData = gameImages[game] || {
      bg: 'bg-gradient-to-br from-gray-600 to-gray-800',
      icon: '🎮',
      char: '?',
      color: 'text-white'
    }

    return (
      <div className={`${gameData.bg} ${className} rounded-lg flex flex-col items-center justify-center p-4 shadow-lg`}>
        <div className="text-4xl mb-2">{gameData.icon}</div>
        <div className={`font-bold text-lg ${gameData.color}`}>{gameData.char}</div>
      </div>
    )
  }

  const renderEmojiQuiz = () => {
    const questions = [
      { 
        emojis: '🍄👨‍🦰🏰', 
        answer: 'Super Mario 64', 
        options: ['Super Mario 64', 'Banjo-Kazooie', 'Donkey Kong 64', 'Mario Kart 64'],
        image: 'Super Mario 64'
      },
      { 
        emojis: '🗡️🛡️🏰', 
        answer: 'The Legend of Zelda: Ocarina of Time', 
        options: ['The Legend of Zelda: Ocarina of Time', 'GoldenEye 007', 'Perfect Dark', 'Turok'],
        image: 'The Legend of Zelda: Ocarina of Time'
      },
      { 
        emojis: '🐻🐦🍯', 
        answer: 'Banjo-Kazooie', 
        options: ['Banjo-Kazooie', 'Donkey Kong 64', 'Super Mario 64', 'Mario Kart 64'],
        image: 'Banjo-Kazooie'
      },
      { 
        emojis: '🔫👨‍💼🏢', 
        answer: 'GoldenEye 007', 
        options: ['GoldenEye 007', 'Perfect Dark', 'Turok', 'Doom 64'],
        image: 'GoldenEye 007'
      }
    ]

    const handleAnswer = (option: string) => {
      setSelectedAnswer(option)
      setShowResult(true)
      if (option === questions[currentQuestion].answer) {
        setCorrectAnswers(prev => prev + 1)
        setScore(prev => prev + 25)
      }
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1)
          setSelectedAnswer(null)
          setShowResult(false)
        } else {
          alert(`Quiz beendet! ${correctAnswers + (option === questions[currentQuestion].answer ? 1 : 0)}/${questions.length} richtig!`)
          resetAllGameStates()
        }
      }, 2000)
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-blue-400 mb-2">🎮 N64 Emoji-Quiz</h3>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="bg-blue-600/20 px-3 py-1 rounded-full">Frage {currentQuestion + 1}/{questions.length}</span>
            <span className="bg-green-600/20 px-3 py-1 rounded-full">Score: {score}</span>
          </div>
        </div>
        
        <div className="card border-l-4 border-blue-400">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center space-x-6 mb-6">
              <div className="text-6xl animate-pulse">{questions[currentQuestion].emojis}</div>
              <div className="text-4xl text-white/50">→</div>
              <GameImage game={questions[currentQuestion].image} className="w-24 h-24" />
            </div>
            <p className="text-white/70">Welches N64-Spiel wird hier dargestellt?</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`quiz-option text-center p-4 transition-all duration-300 ${
                  showResult
                    ? option === questions[currentQuestion].answer
                      ? 'correct animate-pulse'
                      : option === selectedAnswer
                      ? 'incorrect'
                      : 'opacity-50'
                    : 'hover:scale-105 hover:bg-blue-600/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {showResult && (
            <div className="mt-4 text-center">
              <div className="text-lg font-bold">
                {selectedAnswer === questions[currentQuestion].answer ? '🎉 Richtig!' : '😔 Falsch!'}
              </div>
              <div className="text-sm text-white/70">
                Antwort: {questions[currentQuestion].answer}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderMemoryGame = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-purple-400 mb-2">🧠 N64 Memory</h3>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="bg-purple-600/20 px-3 py-1 rounded-full">Score: {score}</span>
          </div>
        </div>
        
        <div className="card border-l-4 border-purple-400">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧠</div>
            <h3 className="text-xl font-bold text-white mb-2">Memory Spiel</h3>
            <p className="text-white/70 mb-4">Finde die passenden N64-Spiele-Paare!</p>
            <button 
              onClick={() => setScore(prev => prev + 10)}
              className="btn-primary bg-purple-600 hover:bg-purple-500"
            >
              Spiel starten
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderQuickQuiz = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-yellow-400 mb-2">⚡ Quick Quiz</h3>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="bg-yellow-600/20 px-3 py-1 rounded-full">Score: {score}</span>
          </div>
        </div>
        
        <div className="card border-l-4 border-yellow-400">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">Quick Quiz</h3>
            <p className="text-white/70 mb-4">Beantworte schnelle N64-Fragen!</p>
            <button 
              onClick={() => setScore(prev => prev + 5)}
              className="btn-primary bg-yellow-600 hover:bg-yellow-500"
            >
              Quiz starten
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderCharacterMatch = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-400 mb-2">👾 Character Match</h3>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="bg-green-600/20 px-3 py-1 rounded-full">Score: {score}</span>
          </div>
        </div>
        
        <div className="card border-l-4 border-green-400">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👾</div>
            <h3 className="text-xl font-bold text-white mb-2">Character Match</h3>
            <p className="text-white/70 mb-4">Ordne Charaktere ihren Spielen zu!</p>
            <button 
              onClick={() => setScore(prev => prev + 15)}
              className="btn-primary bg-green-600 hover:bg-green-500"
            >
              Spiel starten
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <h2 className="text-2xl font-bold text-white mb-2">Spiel wird geladen...</h2>
          <p className="text-white/70">Bitte warten Sie einen Moment.</p>
        </div>
      </div>
    )
  }

  if (selectedGame) {
    return (
      <div className="container mx-auto px-4 py-6 min-h-screen bg-slate-900">
        <button
          onClick={() => {
            setSelectedGame(null)
            resetAllGameStates()
          }}
          className="mb-6 text-white/70 hover:text-white transition-colors flex items-center space-x-2"
        >
          <span>←</span>
          <span>Zurück zu Minigames</span>
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            {minigames.find(game => game.id === selectedGame)?.name || 'Minigame'}
          </h2>
          <p className="text-white/70">
            {minigames.find(game => game.id === selectedGame)?.description || 'Spiel wird geladen...'}
          </p>
        </div>

        <div className="card">
          {(() => {
            try {
              switch(selectedGame) {
                case 'emoji-quiz':
                  return renderEmojiQuiz()
                case 'memory-game':
                  return renderMemoryGame()
                case 'quick-quiz':
                  return renderQuickQuiz()
                case 'character-match':
                  return renderCharacterMatch()
                default:
                  return (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎮</div>
                      <h3 className="text-xl font-bold text-white mb-2">Spiel nicht gefunden</h3>
                      <p className="text-white/70">Dieses Minigame ist noch nicht verfügbar.</p>
                    </div>
                  )
              }
            } catch (error) {
              console.error('Error rendering minigame:', error)
              return (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-bold text-red-400 mb-2">Fehler beim Laden</h3>
                  <p className="text-white/70">Es gab einen Fehler beim Laden des Spiels.</p>
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="mt-4 btn-primary"
                  >
                    Zurück zur Übersicht
                  </button>
                </div>
              )
            }
          })()}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen bg-slate-900">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          🎮 N64 Minigames Arcade
        </h1>
        <p className="text-white/70 text-lg">
          Erlebe klassische N64-Spiele in interaktiven Minigames!
        </p>
      </div>

      {/* Minigames Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {minigames.map((game) => (
          <div
            key={game.id}
            className={`card ${game.color} border-l-4 ${game.borderColor} cursor-pointer hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
            onClick={() => {
              console.log('Minigame clicked:', game.id, game.name)
              setIsLoading(true)
              resetAllGameStates()
              setTimeout(() => {
                setSelectedGame(game.id)
                setIsLoading(false)
              }, 500) // Slightly longer delay to show loading
            }}
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl group-hover:animate-bounce">{game.icon}</div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${game.textColor} mb-1`}>{game.name}</h3>
                <p className="text-white/70 text-sm mb-3">{game.description}</p>
                <div className="flex items-center space-x-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${game.color} ${game.textColor} border ${game.borderColor}`}>
                    {game.difficulty}
                  </span>
                  <span className="text-xs text-white/50">
                    Max: {game.maxScore} Punkte
                  </span>
                </div>
              </div>
              <div className={`text-2xl ${game.textColor} group-hover:translate-x-1 transition-transform`}>
                →
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="card border-l-4 border-purple-400 mb-8">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">🌟 Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-bold mb-1">Punkte System</h3>
            <p className="text-white/70 text-sm">Sammle Punkte in jedem Minigame</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-bold mb-1">Verschiedene Modi</h3>
            <p className="text-white/70 text-sm">Von entspannt bis ultra-schnell</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-bold mb-1">N64 Nostalgie</h3>
            <p className="text-white/70 text-small">Authentisches Retro-Gaming-Feeling</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">📊 Deine Statistiken</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{minigames.length}</div>
            <div className="text-white/70 text-sm">Verfügbare Spiele</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{score}</div>
            <div className="text-white/70 text-sm">Aktuelle Session</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">1340</div>
            <div className="text-white/70 text-sm">Höchstpunktzahl</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">42</div>
            <div className="text-white/70 text-sm">Gespielte Runden</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MinigamesPage