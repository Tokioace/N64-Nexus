import React, { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { usePoints } from '../contexts/PointsContext'
import { 
  Gamepad2, 
  Zap, 
  Target, 
  Puzzle, 
  Timer, 
  Star,
  Play,
  Trophy,
  Users,
  Volume2,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Sword,
  Music
} from 'lucide-react'

interface Minigame {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  icon: any
  color: string
  available: boolean
  highScore?: number
  players?: number
}

interface GameState {
  currentGame: string | null
  isPlaying: boolean
  score: number
  timeLeft: number
  gameData: any
}

const MinigamesPage: React.FC = () => {
  const { t } = useLanguage()
  const { awardPoints } = usePoints()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [gameState, setGameState] = useState<GameState>({
    currentGame: null,
    isPlaying: false,
    score: 0,
    timeLeft: 0,
    gameData: {}
  })

  const minigames: Minigame[] = [
    {
      id: 'memory-match',
      title: 'N64 Memory Match',
      description: 'Finde die passenden N64-Spiele-Cover in diesem Gedächtnisspiel.',
      difficulty: 'easy',
      category: 'puzzle',
      icon: Puzzle,
      color: 'text-blue-400',
      available: true,
      highScore: 1250,
      players: 1
    },
    {
      id: 'reaction-test',
      title: 'Controller Reaktionstest',
      description: 'Wie schnell sind deine Reflexe? Teste deine Reaktionszeit!',
      difficulty: 'medium',
      category: 'skill',
      icon: Zap,
      color: 'text-yellow-400',
      available: true,
      highScore: 180,
      players: 1
    },
    {
      id: 'trivia-rush',
      title: 'N64 Trivia Rush',
      description: 'Beantworte N64-Fragen so schnell wie möglich!',
      difficulty: 'medium',
      category: 'quiz',
      icon: Target,
      color: 'text-green-400',
      available: true,
      highScore: 2100,
      players: 1
    },
    {
      id: 'speed-typing',
      title: 'Cheat Code Typing',
      description: 'Tippe berühmte N64 Cheat Codes so schnell wie möglich!',
      difficulty: 'hard',
      category: 'skill',
      icon: Timer,
      color: 'text-red-400',
      available: true,
      players: 1
    },
    {
      id: 'sound-guess',
      title: 'N64 Sound Quiz',
      description: 'Erkenne N64-Spiele an ihren Soundeffekten und Musik.',
      difficulty: 'medium',
      category: 'quiz',
      icon: Music,
      color: 'text-purple-400',
      available: true,
      players: 1
    },
    {
      id: 'multiplayer-duel',
      title: 'Battle64 Duell',
      description: 'Fordere andere Spieler zu einem schnellen Quiz-Duell heraus!',
      difficulty: 'hard',
      category: 'multiplayer',
      icon: Users,
      color: 'text-cyan-400',
      available: true,
      players: 2
    },
    {
      id: 'pixel-art-puzzle',
      title: 'N64 Pixel Art Puzzle',
      description: 'Setze pixelige N64-Charaktere aus Einzelteilen zusammen!',
      difficulty: 'medium',
      category: 'puzzle',
      icon: Star,
      color: 'text-pink-400',
      available: true,
      players: 1
    },
    {
      id: 'speedrun-challenge',
      title: 'Speedrun Challenge',
      description: 'Schaffe Mini-Challenges so schnell wie möglich - wie ein echter Speedrunner!',
      difficulty: 'hard',
      category: 'skill',
      icon: Award,
      color: 'text-orange-400',
      available: true,
      players: 1
    }
  ]

  // Game Data
  const n64Games = [
    'Super Mario 64', 'The Legend of Zelda: Ocarina of Time', 'Super Smash Bros.',
    'Mario Kart 64', 'GoldenEye 007', 'Super Mario Party', 'Donkey Kong 64',
    'Paper Mario', 'Mario Tennis', 'Star Fox 64', 'F-Zero X', 'Banjo-Kazooie'
  ]

  const cheatCodes = [
    { code: 'RAREWARE', game: 'Donkey Kong 64' },
    { code: 'NTHGTHDGDCRTDTRK', game: 'GoldenEye 007' },
    { code: 'CPUHELP', game: 'Super Smash Bros.' },
    { code: 'JUKEBOX', game: 'Donkey Kong 64' },
    { code: 'PAINTBALL', game: 'GoldenEye 007' }
  ]

  const triviaQuestions = [
    {
      question: 'Welches war das erste N64-Spiel?',
      options: ['Super Mario 64', 'Pilotwings 64', 'Wave Race 64', 'Star Wars: Shadows of the Empire'],
      correct: 0
    },
    {
      question: 'Wie viele Controller-Ports hat die N64?',
      options: ['2', '3', '4', '6'],
      correct: 2
    },
    {
      question: 'In welchem Jahr wurde die N64 veröffentlicht?',
      options: ['1995', '1996', '1997', '1998'],
      correct: 1
    },
    {
      question: 'Welches Spiel führte das Z-Targeting ein?',
      options: ['Super Mario 64', 'Ocarina of Time', 'GoldenEye', 'Star Fox 64'],
      correct: 1
    }
  ]

  const categories = [
    { key: 'all', label: t('minigames.allCategories'), count: minigames.length },
    { key: 'puzzle', label: t('minigames.puzzle'), count: minigames.filter(g => g.category === 'puzzle').length },
    { key: 'skill', label: t('minigames.skill'), count: minigames.filter(g => g.category === 'skill').length },
    { key: 'quiz', label: t('minigames.quiz'), count: minigames.filter(g => g.category === 'quiz').length },
    { key: 'multiplayer', label: 'Multiplayer', count: minigames.filter(g => g.category === 'multiplayer').length }
  ]

  const filteredGames = selectedCategory === 'all' 
    ? minigames 
    : minigames.filter(game => game.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/20'
      case 'hard': return 'text-red-400 bg-red-400/20'
      default: return 'text-slate-400 bg-slate-400/20'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return t('minigames.easy')
      case 'medium': return t('minigames.medium')
      case 'hard': return t('minigames.hard')
      default: return difficulty
    }
  }

  // Memory Match Game
  const MemoryMatchGame = () => {
    const [cards, setCards] = useState<Array<{id: number, game: string, flipped: boolean, matched: boolean}>>([])
    const [flippedCards, setFlippedCards] = useState<number[]>([])
    const [moves, setMoves] = useState(0)

    useEffect(() => {
      const gameSelection = n64Games.slice(0, 6)
      const cardPairs = [...gameSelection, ...gameSelection]
        .map((game, index) => ({
          id: index,
          game,
          flipped: false,
          matched: false
        }))
        .sort(() => Math.random() - 0.5)
      setCards(cardPairs)
    }, [])

    const handleCardClick = (id: number) => {
      if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched) return

      const newCards = [...cards]
      newCards[id].flipped = true
      setCards(newCards)
      
      const newFlippedCards = [...flippedCards, id]
      setFlippedCards(newFlippedCards)

      if (newFlippedCards.length === 2) {
        setMoves(moves + 1)
        const [first, second] = newFlippedCards
        if (cards[first].game === cards[second].game) {
          setTimeout(() => {
            const matchedCards = [...cards]
            matchedCards[first].matched = true
            matchedCards[second].matched = true
            setCards(matchedCards)
            setFlippedCards([])
            
            const newScore = gameState.score + 100
            setGameState(prev => ({ ...prev, score: newScore }))
            
            if (matchedCards.every(card => card.matched)) {
              const bonus = Math.max(0, (30 - moves) * 10)
              setGameState(prev => ({ ...prev, score: newScore + bonus, isPlaying: false }))
              
              // Award points for minigame success
              awardPoints('minigame.success', 'Memory game completed')
            }
          }, 1000)
        } else {
          setTimeout(() => {
            const resetCards = [...cards]
            resetCards[first].flipped = false
            resetCards[second].flipped = false
            setCards(resetCards)
            setFlippedCards([])
          }, 1000)
        }
      }
    }

    return (
      <div className="text-center">
        <div className="mb-4">
          <p className="text-slate-300">{t('minigames.moves')}: {moves} | {t('minigames.score')}: {gameState.score}</p>
        </div>
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center text-xs font-bold ${
                card.flipped || card.matched
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              {card.flipped || card.matched ? card.game.slice(0, 10) : '?'}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Reaction Test Game
  const ReactionTestGame = () => {
    const [phase, setPhase] = useState<'waiting' | 'ready' | 'go' | 'result'>('waiting')
    const [startTime, setStartTime] = useState(0)
    const [reactionTime, setReactionTime] = useState(0)
    const [attempts, setAttempts] = useState(0)

    const startTest = () => {
      setPhase('ready')
      const delay = Math.random() * 3000 + 1000
      setTimeout(() => {
        setPhase('go')
        setStartTime(Date.now())
      }, delay)
    }

    const handleClick = () => {
      if (phase === 'go') {
        const time = Date.now() - startTime
        setReactionTime(time)
        setPhase('result')
        setAttempts(attempts + 1)
        
        const points = Math.max(0, 500 - time)
        setGameState(prev => ({ ...prev, score: prev.score + points }))
      } else if (phase === 'ready') {
        setPhase('waiting')
        alert('Zu früh! Warte auf das grüne Signal.')
      }
    }

    const resetTest = () => {
      setPhase('waiting')
      setReactionTime(0)
    }

    return (
      <div className="text-center">
        <div className="mb-6">
          <p className="text-slate-300 mb-2">{t('minigames.attempts')}: {attempts} | {t('minigames.score')}: {gameState.score}</p>
          {reactionTime > 0 && (
            <p className="text-yellow-400 text-xl font-bold">{reactionTime}ms</p>
          )}
        </div>
        
        <div
          onClick={handleClick}
          className={`w-64 h-64 rounded-full mx-auto mb-6 cursor-pointer transition-all duration-200 flex items-center justify-center text-2xl font-bold ${
            phase === 'waiting' ? 'bg-slate-700 text-slate-400' :
            phase === 'ready' ? 'bg-red-600 text-white animate-pulse' :
            phase === 'go' ? 'bg-green-600 text-white' :
            'bg-blue-600 text-white'
          }`}
        >
          {phase === 'waiting' && 'Klicken zum Starten'}
          {phase === 'ready' && 'Warten...'}
          {phase === 'go' && 'JETZT KLICKEN!'}
          {phase === 'result' && `${reactionTime}ms`}
        </div>

        <div className="space-x-4">
          {phase === 'waiting' && (
            <button onClick={startTest} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
              Test starten
            </button>
          )}
          {phase === 'result' && (
            <>
              <button onClick={resetTest} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Nochmal
              </button>
              <button onClick={() => setGameState(prev => ({ ...prev, currentGame: null }))} 
                      className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg">
                Beenden
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  // Trivia Rush Game
  const TriviaRushGame = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [correctAnswers, setCorrectAnswers] = useState(0)

    const question = triviaQuestions[currentQuestion]

    const handleAnswer = (answerIndex: number) => {
      setSelectedAnswer(answerIndex)
      setShowResult(true)
      
      if (answerIndex === question.correct) {
        setCorrectAnswers(correctAnswers + 1)
        const points = Math.max(0, 200 - (gameState.timeLeft < 5 ? 50 : 0))
        setGameState(prev => ({ ...prev, score: prev.score + points }))
      }

      setTimeout(() => {
        if (currentQuestion < triviaQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
          setSelectedAnswer(null)
          setShowResult(false)
        } else {
          setGameState(prev => ({ ...prev, isPlaying: false }))
          
          // Award points for completing trivia game (if scored well)
          if (correctAnswers >= triviaQuestions.length / 2) {
            awardPoints('minigame.success', 'Trivia game completed successfully')
          }
        }
      }, 2000)
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
                      <p className="text-slate-300">{t('minigames.question')} {currentQuestion + 1}/{triviaQuestions.length}</p>
            <p className="text-slate-300">{t('minigames.correctAnswers')}: {correctAnswers} | {t('minigames.score')}: {gameState.score}</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
                className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                  showResult
                    ? index === question.correct
                      ? 'bg-green-600 text-white'
                      : index === selectedAnswer
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-700 text-slate-400'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                {option}
                {showResult && index === question.correct && <CheckCircle className="inline w-5 h-5 ml-2" />}
                {showResult && index === selectedAnswer && index !== question.correct && <XCircle className="inline w-5 h-5 ml-2" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Speed Typing Game
  const SpeedTypingGame = () => {
    const [currentCheat, setCurrentCheat] = useState(0)
    const [userInput, setUserInput] = useState('')
    const [startTime, setStartTime] = useState<number | null>(null)
    const [completedCheats, setCompletedCheats] = useState(0)

    const cheat = cheatCodes[currentCheat]

    useEffect(() => {
      if (startTime === null && userInput.length > 0) {
        setStartTime(Date.now())
      }
    }, [userInput, startTime])

    const handleInputChange = (value: string) => {
      setUserInput(value.toUpperCase())
      
      if (value.toUpperCase() === cheat.code) {
        const timeTaken = startTime ? Date.now() - startTime : 0
        const wpm = Math.round((cheat.code.length / 5) / (timeTaken / 60000))
        const points = Math.max(50, 300 - timeTaken / 10)
        
        setGameState(prev => ({ ...prev, score: prev.score + Math.round(points) }))
        setCompletedCheats(completedCheats + 1)
        
        if (currentCheat < cheatCodes.length - 1) {
          setCurrentCheat(currentCheat + 1)
          setUserInput('')
          setStartTime(null)
        } else {
          setGameState(prev => ({ ...prev, isPlaying: false }))
        }
      }
    }

    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
                      <p className="text-slate-300">{t('minigames.cheatCode')} {currentCheat + 1}/{cheatCodes.length}</p>
            <p className="text-slate-300">{t('minigames.completed')}: {completedCheats} | {t('minigames.score')}: {gameState.score}</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-slate-100 mb-2">{cheat.game}</h3>
          <div className="text-3xl font-mono font-bold text-yellow-400 mb-4 tracking-wider">
            {cheat.code}
          </div>
          <input
            type="text"
            value={userInput}
            onChange={(e) => handleInputChange(e.target.value)}
                          placeholder={t('minigames.typeCheatCode')}
            className="w-full p-3 bg-slate-700 text-white text-center text-xl font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="mt-4">
            <div className="text-sm text-slate-400">
              {userInput.split('').map((char, index) => (
                <span
                  key={index}
                  className={char === cheat.code[index] ? 'text-green-400' : 'text-red-400'}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Sound Quiz Game (Placeholder with descriptions)
  const SoundQuizGame = () => {
    const [currentSound, setCurrentSound] = useState(0)
    const [score, setScore] = useState(0)
    
    const sounds = [
      { game: 'Super Mario 64', description: `🎵 ${t('minigames.sound.mario64')}` },
      { game: 'Zelda: Ocarina of Time', description: `🎵 ${t('minigames.sound.zelda')}` },
      { game: 'GoldenEye 007', description: `🎵 ${t('minigames.sound.goldeneye')}` },
      { game: 'Mario Kart 64', description: `🎵 ${t('minigames.sound.mariokart')}` }
    ]

    const currentSoundData = sounds[currentSound]
    const options = [currentSoundData.game, ...n64Games.filter(g => g !== currentSoundData.game).slice(0, 3)]
      .sort(() => Math.random() - 0.5)

    const handleAnswer = (selectedGame: string) => {
      if (selectedGame === currentSoundData.game) {
        setScore(score + 100)
        setGameState(prev => ({ ...prev, score: prev.score + 100 }))
      }
      
      if (currentSound < sounds.length - 1) {
        setCurrentSound(currentSound + 1)
      } else {
        setGameState(prev => ({ ...prev, isPlaying: false }))
        
        // Award points for completing sound guessing game (if scored well)
        if (score >= sounds.length * 50) { // At least 50% correct
          awardPoints('minigame.success', 'Sound guessing game completed successfully')
        }
      }
    }

    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
                      <p className="text-slate-300">{t('minigames.sound')} {currentSound + 1}/{sounds.length}</p>
            <p className="text-slate-300">{t('minigames.score')}: {gameState.score}</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-8 mb-6">
          <Volume2 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <div className="text-2xl font-bold text-slate-100 mb-6">
            {currentSoundData.description}
          </div>
                      <p className="text-slate-400 mb-6">{t('minigames.whichGame')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-all duration-200"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Multiplayer Duel Game (Simulated)
  const MultiplayerDuelGame = () => {
    const [phase, setPhase] = useState<'waiting' | 'question' | 'result'>('waiting')
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [playerScore, setPlayerScore] = useState(0)
    const [opponentScore, setOpponentScore] = useState(0)
    const [playerAnswer, setPlayerAnswer] = useState<number | null>(null)

    const question = triviaQuestions[currentQuestion]

    const startDuel = () => {
      setPhase('question')
    }

    const handleAnswer = (answerIndex: number) => {
      setPlayerAnswer(answerIndex)
      
      // Simulate opponent answer
      const opponentAnswer = Math.random() < 0.7 ? question.correct : Math.floor(Math.random() * 4)
      
      if (answerIndex === question.correct) {
        setPlayerScore(playerScore + 100)
        setGameState(prev => ({ ...prev, score: prev.score + 100 }))
      }
      
      if (opponentAnswer === question.correct) {
        setOpponentScore(opponentScore + 100)
      }

      setPhase('result')
      
      setTimeout(() => {
        if (currentQuestion < triviaQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
          setPlayerAnswer(null)
          setPhase('question')
        } else {
          setGameState(prev => ({ ...prev, isPlaying: false }))
        }
      }, 3000)
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center bg-slate-800 rounded-lg p-4">
            <div className="text-center">
              <div className="text-blue-400 font-bold">{t('minigames.you')}</div>
              <div className="text-2xl font-bold text-slate-100">{playerScore}</div>
            </div>
            <Sword className="w-8 h-8 text-red-400" />
            <div className="text-center">
              <div className="text-red-400 font-bold">{t('minigames.opponent')}</div>
              <div className="text-2xl font-bold text-slate-100">{opponentScore}</div>
            </div>
          </div>
        </div>

        {phase === 'waiting' && (
          <div className="text-center">
            <Users className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-100 mb-4">{t('minigames.readyForDuel')}</h3>
            <button
              onClick={startDuel}
              className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg"
                          >
                {t('minigames.startDuel')}
              </button>
          </div>
        )}

        {phase === 'question' && (
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-4">
              {t('minigames.question')} {currentQuestion + 1}: {question.question}
            </h3>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-left"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <h3 className="text-lg font-bold text-slate-100 mb-4">{t('minigames.result')}</h3>
            <div className="space-y-2">
              <div className={`p-2 rounded ${playerAnswer === question.correct ? 'bg-green-600' : 'bg-red-600'}`}>
                                  {t('minigames.you')}: {question.options[playerAnswer!]} {playerAnswer === question.correct ? '✓' : '✗'}
              </div>
              <div className="p-2 rounded bg-slate-700">
                                  {t('minigames.opponent')} antwortet...
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const handlePlayGame = (gameId: string) => {
    setGameState({
      currentGame: gameId,
      isPlaying: true,
      score: 0,
      timeLeft: 60,
      gameData: {}
    })
  }

  const handleBackToMenu = () => {
    setGameState({
      currentGame: null,
      isPlaying: false,
      score: 0,
      timeLeft: 0,
      gameData: {}
    })
  }

  // Timer for games that need it
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState.isPlaying && gameState.timeLeft > 0 && ['trivia-rush', 'speed-typing'].includes(gameState.currentGame!)) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState.isPlaying, gameState.timeLeft, gameState.currentGame])

  // End game when timer runs out
  useEffect(() => {
    if (gameState.timeLeft === 0 && gameState.isPlaying) {
      setGameState(prev => ({ ...prev, isPlaying: false }))
    }
  }, [gameState.timeLeft, gameState.isPlaying])

  const renderGame = () => {
    switch (gameState.currentGame) {
      case 'memory-match':
        return <MemoryMatchGame />
      case 'reaction-test':
        return <ReactionTestGame />
      case 'trivia-rush':
        return <TriviaRushGame />
      case 'speed-typing':
        return <SpeedTypingGame />
      case 'sound-guess':
        return <SoundQuizGame />
      case 'multiplayer-duel':
        return <MultiplayerDuelGame />
      default:
        return <div className="text-center text-slate-400">{t('minigames.gameLoading')}</div>
    }
  }

  if (gameState.currentGame) {
    const game = minigames.find(g => g.id === gameState.currentGame)
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Game Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToMenu}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('minigames.backToMenu')}</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-100">{game?.title}</h1>
              {['trivia-rush', 'speed-typing'].includes(gameState.currentGame) && gameState.isPlaying && (
                <div className="flex items-center justify-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-bold">{gameState.timeLeft}s</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-bold">{gameState.score}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-24"></div>
          </div>

          {/* Game Content */}
          <div className="bg-slate-900 rounded-lg p-6">
            {gameState.isPlaying ? renderGame() : (
              <div className="text-center">
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-slate-100 mb-2">{t('minigames.gameEnded')}</h2>
            <p className="text-xl text-green-400 mb-4">{t('minigames.yourScore')}: {gameState.score}</p>
                <div className="space-x-4">
                  <button
                    onClick={() => handlePlayGame(gameState.currentGame!)}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    Nochmal spielen
                  </button>
                  <button
                    onClick={handleBackToMenu}
                    className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
                                      >
                      {t('minigames.backToMenu')}
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-lg py-responsive space-responsive responsive-max-width responsive-overflow-hidden">
      {/* Header */}
      <div className="text-center mb-responsive responsive-max-width">
        <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-responsive-2xl font-bold text-slate-100 mb-2 responsive-word-break">
          Battle64 {t('minigames.title')}
        </h1>
        <p className="text-responsive-base text-slate-400 responsive-word-break px-2">
          {t('minigames.subtitle')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid-auto-fit mb-responsive responsive-max-width">
        <div className="simple-tile text-center">
          <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-responsive-lg font-bold text-slate-100">
            {minigames.filter(g => g.available).length}
          </div>
          <div className="text-responsive-xs text-slate-400 responsive-word-break">{t('minigames.available') || 'Verfügbar'}</div>
        </div>
        
        <div className="simple-tile text-center">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-responsive-lg font-bold text-slate-100">
            {Math.max(...minigames.filter(g => g.highScore).map(g => g.highScore || 0)).toLocaleString()}
          </div>
          <div className="text-responsive-xs text-slate-400 responsive-word-break">{t('minigames.highScore')}</div>
        </div>
        
        <div className="simple-tile text-center">
          <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-2" />
          <div className="text-responsive-lg font-bold text-slate-100">
            {minigames.filter(g => g.difficulty === 'easy').length}
          </div>
          <div className="text-responsive-xs text-slate-400 responsive-word-break">{t('minigames.easy')} {t('minigames.games') || 'Spiele'}</div>
        </div>
        
        <div className="simple-tile text-center">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-responsive-lg font-bold text-slate-100">
            {minigames.filter(g => g.category === 'multiplayer').length}
          </div>
          <div className="text-responsive-xs text-slate-400 responsive-word-break">{t('minigames.multiplayer')}</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-responsive responsive-max-width">
        <div className="bg-slate-800 rounded-lg p-1 w-full max-w-4xl responsive-overflow-hidden">
          <div className="flex flex-wrap justify-center gap-1">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-3 sm:px-4 py-2 rounded-md transition-all duration-200 text-xs sm:text-sm ${
                  selectedCategory === category.key
                    ? 'bg-slate-700 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <span className="hidden sm:inline">{category.label} ({category.count})</span>
                <span className="sm:hidden">{category.label.split(' ')[0]} ({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid-auto-fit-lg mb-responsive responsive-max-width">
        {filteredGames.map((game) => {
          const IconComponent = game.icon
          
          return (
            <div 
              key={game.id} 
              className={`simple-tile simple-tile-large ${
                game.available ? 'hover:scale-105 transition-transform duration-200' : 'opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <IconComponent className={`w-8 h-8 ${game.color}`} />
                <div className="flex items-center space-x-2">
                  {game.players && (
                    <span className="px-2 py-1 rounded-full bg-slate-700 text-slate-300 text-xs">
                      {game.players}P
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                    {getDifficultyLabel(game.difficulty)}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-100 mb-2">{game.title}</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">{game.description}</p>
              
              {game.highScore && (
                <div className="flex items-center justify-between text-sm mb-4">
                                      <span className="text-slate-400">{t('minigames.bestScore')}:</span>
                  <span className="text-yellow-400 font-medium">{game.highScore.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex space-x-2">
                {game.available ? (
                  <>
                    <button 
                      onClick={() => handlePlayGame(game.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 
                               bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg 
                               transition-colors duration-200"
                    >
                      <Play className="w-4 h-4" />
                      <span>Spielen</span>
                    </button>
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 
                                     font-medium rounded-lg transition-colors duration-200">
                      Highscores
                    </button>
                  </>
                ) : (
                  <button 
                    disabled
                    className="flex-1 px-4 py-2 bg-slate-700/50 text-slate-500 font-medium 
                             rounded-lg cursor-not-allowed"
                  >
                    Bald verfügbar
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Community Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="simple-tile text-center py-8">
          <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-100 mb-2">{t('minigames.globalLeaderboard')}</h3>
          <p className="text-slate-400 mb-4">
            {t('minigames.globalLeaderboardDesc')}
          </p>
          <button className="px-6 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 
                           text-yellow-400 hover:text-yellow-300 rounded-lg transition-all duration-200">
            {t('minigames.viewLeaderboards')}
          </button>
        </div>

        <div className="simple-tile text-center py-8">
          <Users className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-100 mb-2">{t('minigames.tournamentsTitle')}</h3>
          <p className="text-slate-400 mb-4">
            {t('minigames.tournamentsDesc')}
          </p>
          <button className="px-6 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 
                           text-cyan-400 hover:text-cyan-300 rounded-lg transition-all duration-200">
            {t('minigames.currentTournaments')}
          </button>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="simple-tile text-center py-8">
        <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-100 mb-2">{t('minigames.moreGamesTitle')}</h3>
        <p className="text-slate-400 mb-4">
          {t('minigames.moreGamesComingSoon')}
        </p>
        <div className="flex justify-center space-x-4">
          <button className="px-6 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 
                           text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-200">
            💡 Spiel vorschlagen
          </button>
          <button className="px-6 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 
                           text-purple-400 hover:text-purple-300 rounded-lg transition-all duration-200">
            🎮 Beta testen
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-slate-400 text-sm">
          {t('minigames.allGamesFree')}
        </p>
      </div>
    </div>
  )
}

export default MinigamesPage