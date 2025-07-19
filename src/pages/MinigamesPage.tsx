import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '../contexts/UserContext'
import { Gamepad2, Music, Image, Puzzle, Clock, Palette, Target, Zap } from 'lucide-react'

const MinigamesPage: React.FC = () => {
  const { user } = useUser()
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [gameState, setGameState] = useState<any>({})
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isGameActive, setIsGameActive] = useState(false)

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
      id: 'sound-memory',
      name: 'Sound Memory',
      description: 'Finde passende Sound-Paare',
      icon: '🎵',
      difficulty: 'medium' as const,
      maxScore: 150,
      isAvailable: true,
      color: 'bg-purple-600/20',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-400'
    },
    {
      id: 'cartridge-match',
      name: 'Match the Cartridge',
      description: 'Ordne Covers den richtigen Spielen zu',
      icon: '📀',
      difficulty: 'hard' as const,
      maxScore: 200,
      isAvailable: true,
      color: 'bg-red-600/20',
      textColor: 'text-red-400',
      borderColor: 'border-red-400'
    },
    {
      id: 'character-puzzle',
      name: 'Character Puzzle',
      description: 'Löse Puzzles mit N64-Charakteren',
      icon: '🧩',
      difficulty: 'medium' as const,
      maxScore: 120,
      isAvailable: true,
      color: 'bg-green-600/20',
      textColor: 'text-green-400',
      borderColor: 'border-green-400'
    },
    {
      id: 'speed-challenge',
      name: 'Speed Challenge',
      description: 'Beantworte Fragen so schnell wie möglich',
      icon: '⚡',
      difficulty: 'hard' as const,
      maxScore: 300,
      isAvailable: true,
      color: 'bg-yellow-600/20',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-400'
    },
    {
      id: 'color-match',
      name: 'Color Match',
      description: 'Ordne Charaktere ihren Farben zu',
      icon: '🎨',
      difficulty: 'easy' as const,
      maxScore: 80,
      isAvailable: true,
      color: 'bg-pink-600/20',
      textColor: 'text-pink-400',
      borderColor: 'border-pink-400'
    },
    {
      id: 'controller-challenge',
      name: 'Controller Challenge',
      description: 'Erkenne N64-Controller-Kombinationen',
      icon: '🎮',
      difficulty: 'medium' as const,
      maxScore: 140,
      isAvailable: true,
      color: 'bg-cyan-600/20',
      textColor: 'text-cyan-400',
      borderColor: 'border-cyan-400'
    },
    {
      id: 'boss-rush',
      name: 'Boss Rush Quiz',
      description: 'Erkenne Endgegner aus N64-Spielen',
      icon: '👹',
      difficulty: 'hard' as const,
      maxScore: 250,
      isAvailable: true,
      color: 'bg-orange-600/20',
      textColor: 'text-orange-400',
      borderColor: 'border-orange-400'
    }
  ]

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isGameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isGameActive) {
      setIsGameActive(false)
    }
    return () => clearInterval(interval)
  }, [isGameActive, timeLeft])

  // Game Components
  const renderEmojiQuiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [correctAnswers, setCorrectAnswers] = useState(0)

    const questions = [
      { emojis: '🍄👨‍🦰🏰', answer: 'Super Mario 64', options: ['Super Mario 64', 'Banjo-Kazooie', 'Donkey Kong 64', 'Conker\'s Bad Fur Day'] },
      { emojis: '🗡️🛡️🏰', answer: 'The Legend of Zelda: Ocarina of Time', options: ['The Legend of Zelda: Ocarina of Time', 'GoldenEye 007', 'Perfect Dark', 'Turok'] },
      { emojis: '🐻🐦🍯', answer: 'Banjo-Kazooie', options: ['Banjo-Kazooie', 'Donkey Kong 64', 'Conker\'s Bad Fur Day', 'Super Mario 64'] },
      { emojis: '🔫👨‍💼🏢', answer: 'GoldenEye 007', options: ['GoldenEye 007', 'Perfect Dark', 'Turok', 'Doom 64'] },
      { emojis: '🏎️🍄🏁', answer: 'Mario Kart 64', options: ['Mario Kart 64', 'Diddy Kong Racing', 'F-Zero X', 'Wave Race 64'] },
      { emojis: '🦍🍌🥊', answer: 'Donkey Kong 64', options: ['Donkey Kong 64', 'Banjo-Kazooie', 'Super Mario 64', 'Conker\'s Bad Fur Day'] },
      { emojis: '🌊🏄‍♂️💨', answer: 'Wave Race 64', options: ['Wave Race 64', 'Mario Kart 64', 'F-Zero X', 'Diddy Kong Racing'] },
      { emojis: '🦕🔫🌴', answer: 'Turok', options: ['Turok', 'Perfect Dark', 'GoldenEye 007', 'Doom 64'] }
    ]

    const handleAnswer = (option: string) => {
      setSelectedAnswer(option)
      setShowResult(true)
      if (option === questions[currentQuestion].answer) {
        setCorrectAnswers(prev => prev + 1)
        setScore(prev => prev + 10)
      }
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1)
          setSelectedAnswer(null)
          setShowResult(false)
        } else {
          alert(`Quiz beendet! ${correctAnswers + (option === questions[currentQuestion].answer ? 1 : 0)}/${questions.length} richtig!`)
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
            <div className="text-6xl mb-4 animate-pulse">{questions[currentQuestion].emojis}</div>
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

  const renderSoundMemory = () => {
    const [flippedCards, setFlippedCards] = useState<number[]>([])
    const [matchedCards, setMatchedCards] = useState<number[]>([])
    const [moves, setMoves] = useState(0)

    const soundPairs = [
      { id: 1, sound: '🎵', game: 'Mario 64' },
      { id: 2, sound: '🎶', game: 'Zelda OoT' },
      { id: 3, sound: '🔊', game: 'GoldenEye' },
      { id: 4, sound: '🎼', game: 'Banjo-Kazooie' },
      { id: 1, sound: '🎵', game: 'Mario 64' },
      { id: 2, sound: '🎶', game: 'Zelda OoT' },
      { id: 3, sound: '🔊', game: 'GoldenEye' },
      { id: 4, sound: '🎼', game: 'Banjo-Kazooie' }
    ].sort(() => Math.random() - 0.5)

    const handleCardClick = (index: number) => {
      if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) return

      const newFlipped = [...flippedCards, index]
      setFlippedCards(newFlipped)

      if (newFlipped.length === 2) {
        setMoves(prev => prev + 1)
        const [first, second] = newFlipped
        if (soundPairs[first].id === soundPairs[second].id) {
          setMatchedCards(prev => [...prev, first, second])
          setScore(prev => prev + 20)
        }
        setTimeout(() => setFlippedCards([]), 1000)
      }
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-purple-400 mb-2">🎵 Sound Memory</h3>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="bg-purple-600/20 px-3 py-1 rounded-full">Züge: {moves}</span>
            <span className="bg-green-600/20 px-3 py-1 rounded-full">Score: {score}</span>
          </div>
        </div>
        
        <div className="card border-l-4 border-purple-400">
          <p className="text-center text-white/70 mb-6">Finde die passenden Sound-Paare!</p>
          
          <div className="grid grid-cols-4 gap-3">
            {soundPairs.map((card, index) => (
              <button
                key={index}
                onClick={() => handleCardClick(index)}
                className={`aspect-square flex flex-col items-center justify-center text-2xl rounded-lg transition-all duration-300 ${
                  flippedCards.includes(index) || matchedCards.includes(index)
                    ? 'bg-purple-600/30 border-2 border-purple-400'
                    : 'bg-slate-700 hover:bg-slate-600 border-2 border-slate-600'
                } ${matchedCards.includes(index) ? 'animate-pulse' : ''}`}
              >
                {flippedCards.includes(index) || matchedCards.includes(index) ? (
                  <>
                    <div className="text-3xl">{card.sound}</div>
                    <div className="text-xs mt-1">{card.game}</div>
                  </>
                ) : (
                  <div className="text-3xl">🎮</div>
                )}
              </button>
            ))}
          </div>

          {matchedCards.length === soundPairs.length && (
            <div className="mt-6 text-center">
              <div className="text-2xl font-bold text-purple-400">🎉 Geschafft!</div>
              <div className="text-white/70">Alle Paare in {moves} Zügen gefunden!</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderCartridgeMatch = () => {
    const [currentRound, setCurrentRound] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [correctMatches, setCorrectMatches] = useState(0)

    const cartridges = [
      {
        cover: '🎮 Rotes Cartridge mit Stern',
        correctGame: 'Super Mario 64',
        options: ['Super Mario 64', 'Mario Kart 64', 'Paper Mario', 'Mario Party']
      },
      {
        cover: '🗡️ Goldenes Cartridge mit Triforce',
        correctGame: 'The Legend of Zelda: Ocarina of Time',
        options: ['Zelda: Ocarina of Time', 'Zelda: Majora\'s Mask', 'Adventure of Link', 'Link\'s Awakening']
      },
      {
        cover: '🔫 Schwarzes Cartridge mit 007',
        correctGame: 'GoldenEye 007',
        options: ['GoldenEye 007', 'Perfect Dark', 'Mission Impossible', 'The World Is Not Enough']
      },
      {
        cover: '🐻 Oranges Cartridge mit Bär und Vogel',
        correctGame: 'Banjo-Kazooie',
        options: ['Banjo-Kazooie', 'Banjo-Tooie', 'Conker\'s Bad Fur Day', 'Diddy Kong Racing']
      },
      {
        cover: '🏎️ Blaues Cartridge mit Kart',
        correctGame: 'Mario Kart 64',
        options: ['Mario Kart 64', 'Diddy Kong Racing', 'F-Zero X', 'Wave Race 64']
      }
    ]

    const handleAnswer = (option: string) => {
      setSelectedOption(option)
      setShowResult(true)
      if (option === cartridges[currentRound].correctGame) {
        setCorrectMatches(prev => prev + 1)
        setScore(prev => prev + 25)
      }
      setTimeout(() => {
        if (currentRound < cartridges.length - 1) {
          setCurrentRound(prev => prev + 1)
          setSelectedOption(null)
          setShowResult(false)
        } else {
          alert(`Cartridge Match beendet! ${correctMatches + (option === cartridges[currentRound].correctGame ? 1 : 0)}/${cartridges.length} richtig!`)
        }
      }, 2500)
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-red-400 mb-2">📀 Match the Cartridge</h3>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="bg-red-600/20 px-3 py-1 rounded-full">Runde {currentRound + 1}/{cartridges.length}</span>
            <span className="bg-green-600/20 px-3 py-1 rounded-full">Score: {score}</span>
          </div>
        </div>
        
        <div className="card border-l-4 border-red-400">
          <div className="text-center mb-6">
            <div className="bg-slate-700 rounded-lg p-6 mb-4">
              <div className="text-4xl mb-2">📀</div>
              <div className="text-lg font-medium">{cartridges[currentRound].cover}</div>
            </div>
            <p className="text-white/70">Welches Spiel gehört zu diesem Cartridge?</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {cartridges[currentRound].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`quiz-option text-center p-4 transition-all duration-300 ${
                  showResult
                    ? option === cartridges[currentRound].correctGame
                      ? 'correct animate-pulse'
                      : option === selectedOption
                      ? 'incorrect'
                      : 'opacity-50'
                    : 'hover:scale-105 hover:bg-red-600/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {showResult && (
            <div className="mt-4 text-center">
              <div className="text-lg font-bold">
                {selectedOption === cartridges[currentRound].correctGame ? '🎉 Perfekt!' : '😔 Falsch!'}
              </div>
              <div className="text-sm text-white/70">
                Richtige Antwort: {cartridges[currentRound].correctGame}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderCharacterPuzzle = () => {
    const [currentPuzzle, setCurrentPuzzle] = useState(0)
    const [draggedPiece, setDraggedPiece] = useState<string | null>(null)
    const [placedPieces, setPlacedPieces] = useState<{[key: string]: string}>({})

    const puzzles = [
      {
        character: 'Mario',
        pieces: ['🧢', '👨‍🦰', '👔', '👖'],
        description: 'Setze Mario zusammen!'
      },
      {
        character: 'Link',
        pieces: ['🧝‍♂️', '🗡️', '🛡️', '👢'],
        description: 'Baue Link aus Hyrule!'
      },
      {
        character: 'Samus',
        pieces: ['🤖', '🔫', '⚡', '🚀'],
        description: 'Erstelle Samus Aran!'
      }
    ]

    const handleDragStart = (piece: string) => {
      setDraggedPiece(piece)
    }

    const handleDrop = (slot: string) => {
      if (draggedPiece) {
        setPlacedPieces(prev => ({...prev, [slot]: draggedPiece}))
        setDraggedPiece(null)
        if (Object.keys(placedPieces).length + 1 === puzzles[currentPuzzle].pieces.length) {
          setScore(prev => prev + 30)
          setTimeout(() => {
            if (currentPuzzle < puzzles.length - 1) {
              setCurrentPuzzle(prev => prev + 1)
              setPlacedPieces({})
            } else {
              alert('Alle Puzzles gelöst! 🎉')
            }
          }, 1000)
        }
      }
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-400 mb-2">🧩 Character Puzzle</h3>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="bg-green-600/20 px-3 py-1 rounded-full">Puzzle {currentPuzzle + 1}/{puzzles.length}</span>
            <span className="bg-green-600/20 px-3 py-1 rounded-full">Score: {score}</span>
          </div>
        </div>
        
        <div className="card border-l-4 border-green-400">
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold mb-2">{puzzles[currentPuzzle].character}</h4>
            <p className="text-white/70">{puzzles[currentPuzzle].description}</p>
          </div>
          
          {/* Puzzle Slots */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {['head', 'weapon', 'body', 'feet'].map((slot) => (
              <div
                key={slot}
                className="aspect-square border-2 border-dashed border-green-400/50 rounded-lg flex items-center justify-center text-4xl bg-slate-700/50 cursor-pointer hover:bg-green-600/10 transition-all"
                onClick={() => handleDrop(slot)}
              >
                {placedPieces[slot] || '❓'}
              </div>
            ))}
          </div>
          
          {/* Available Pieces */}
          <div className="grid grid-cols-4 gap-2">
            {puzzles[currentPuzzle].pieces.map((piece, index) => (
              <button
                key={index}
                className="aspect-square bg-slate-600 hover:bg-slate-500 rounded-lg flex items-center justify-center text-3xl transition-all duration-200 hover:scale-105"
                onClick={() => handleDragStart(piece)}
                disabled={Object.values(placedPieces).includes(piece)}
              >
                {piece}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderSpeedChallenge = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [timeLeft, setTimeLeft] = useState(10)
    const [isActive, setIsActive] = useState(false)
    const [correctAnswers, setCorrectAnswers] = useState(0)

    const questions = [
      { q: 'Wie viele Sterne gibt es in Super Mario 64?', a: '120', options: ['120', '100', '150', '64'] },
      { q: 'Welches Jahr wurde der N64 veröffentlicht?', a: '1996', options: ['1995', '1996', '1997', '1998'] },
      { q: 'Wie heißt Marios Bruder?', a: 'Luigi', options: ['Luigi', 'Wario', 'Yoshi', 'Toad'] },
      { q: 'Welche Farbe hat Links Tunika?', a: 'Grün', options: ['Grün', 'Blau', 'Rot', 'Gelb'] },
      { q: 'Wie viele Controller-Ports hat der N64?', a: '4', options: ['2', '4', '6', '8'] }
    ]

    useEffect(() => {
      let interval: NodeJS.Timeout
      if (isActive && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft(prev => prev - 1)
        }, 1000)
      } else if (timeLeft === 0) {
        handleAnswer('')
      }
      return () => clearInterval(interval)
    }, [isActive, timeLeft])

    const startGame = () => {
      setIsActive(true)
      setTimeLeft(10)
      setCurrentQuestion(0)
      setCorrectAnswers(0)
      setScore(0)
    }

    const handleAnswer = (answer: string) => {
      setIsActive(false)
      if (answer === questions[currentQuestion].a) {
        setCorrectAnswers(prev => prev + 1)
        setScore(prev => prev + Math.max(1, timeLeft) * 5)
      }
      
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1)
          setTimeLeft(10)
          setIsActive(true)
        } else {
          alert(`Speed Challenge beendet! ${correctAnswers + (answer === questions[currentQuestion].a ? 1 : 0)}/${questions.length} richtig!`)
        }
      }, 1500)
    }

    if (!isActive && currentQuestion === 0 && correctAnswers === 0) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-yellow-400 mb-2">⚡ Speed Challenge</h3>
            <p className="text-white/70 mb-6">Beantworte Fragen so schnell wie möglich!</p>
            <button
              onClick={startGame}
              className="btn-primary bg-yellow-600 hover:bg-yellow-500 text-2xl px-8 py-4"
            >
              🚀 Start Challenge
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-yellow-400 mb-2">⚡ Speed Challenge</h3>
          <div className="flex justify-center space-x-4 text-sm mb-4">
            <span className="bg-yellow-600/20 px-3 py-1 rounded-full">Frage {currentQuestion + 1}/{questions.length}</span>
            <span className="bg-green-600/20 px-3 py-1 rounded-full">Score: {score}</span>
            <span className={`px-3 py-1 rounded-full ${timeLeft <= 3 ? 'bg-red-600/20 text-red-400 animate-pulse' : 'bg-blue-600/20'}`}>
              Zeit: {timeLeft}s
            </span>
          </div>
        </div>
        
        <div className="card border-l-4 border-yellow-400">
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold mb-4">{questions[currentQuestion].q}</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="quiz-option text-center p-4 hover:bg-yellow-600/10 transition-all duration-200 hover:scale-105"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderColorMatch = () => {
    const [matches, setMatches] = useState<{[key: string]: string}>({})
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
    const [selectedColor, setSelectedColor] = useState<string | null>(null)

    const characters = ['Mario', 'Luigi', 'Yoshi', 'Kirby']
    const colors = ['🔴 Rot', '🟢 Grün', '🟡 Gelb', '🩷 Rosa']
    const correctMatches = { 'Mario': '🔴 Rot', 'Luigi': '🟢 Grün', 'Yoshi': '🟡 Gelb', 'Kirby': '🩷 Rosa' }

    const handleMatch = () => {
      if (selectedCharacter && selectedColor) {
        setMatches(prev => ({...prev, [selectedCharacter]: selectedColor}))
        if (correctMatches[selectedCharacter] === selectedColor) {
          setScore(prev => prev + 15)
        }
        setSelectedCharacter(null)
        setSelectedColor(null)
      }
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-pink-400 mb-2">🎨 Color Match</h3>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="bg-pink-600/20 px-3 py-1 rounded-full">Matches: {Object.keys(matches).length}/4</span>
            <span className="bg-green-600/20 px-3 py-1 rounded-full">Score: {score}</span>
          </div>
        </div>
        
        <div className="card border-l-4 border-pink-400">
          <p className="text-center text-white/70 mb-6">Ordne jedem Charakter seine charakteristische Farbe zu!</p>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Characters */}
            <div>
              <h4 className="font-bold mb-3 text-center">Charaktere</h4>
              <div className="space-y-2">
                {characters.map((char) => (
                  <button
                    key={char}
                    onClick={() => setSelectedCharacter(char)}
                    className={`w-full p-3 rounded-lg transition-all duration-200 ${
                      selectedCharacter === char 
                        ? 'bg-pink-600/30 border-2 border-pink-400' 
                        : 'bg-slate-700 hover:bg-slate-600 border-2 border-slate-600'
                    } ${matches[char] ? 'opacity-50' : ''}`}
                    disabled={!!matches[char]}
                  >
                    {char} {matches[char] ? `→ ${matches[char]}` : ''}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Colors */}
            <div>
              <h4 className="font-bold mb-3 text-center">Farben</h4>
              <div className="space-y-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-full p-3 rounded-lg transition-all duration-200 ${
                      selectedColor === color 
                        ? 'bg-pink-600/30 border-2 border-pink-400' 
                        : 'bg-slate-700 hover:bg-slate-600 border-2 border-slate-600'
                    } ${Object.values(matches).includes(color) ? 'opacity-50' : ''}`}
                    disabled={Object.values(matches).includes(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {selectedCharacter && selectedColor && (
            <div className="text-center mt-6">
              <button
                onClick={handleMatch}
                className="btn-primary bg-pink-600 hover:bg-pink-500"
              >
                {selectedCharacter} → {selectedColor} zuordnen
              </button>
            </div>
          )}

          {Object.keys(matches).length === 4 && (
            <div className="mt-6 text-center">
              <div className="text-2xl font-bold text-pink-400">🎉 Alle zugeordnet!</div>
              <div className="text-white/70">
                Richtige Matches: {Object.entries(matches).filter(([char, color]) => correctMatches[char] === color).length}/4
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderControllerChallenge = () => {
    const [currentChallenge, setCurrentChallenge] = useState(0)
    const [inputSequence, setInputSequence] = useState<string[]>([])
    const [showingSequence, setShowingSequence] = useState(true)

    const challenges = [
      { name: 'Hadoken (Street Fighter)', sequence: ['⬇️', '↘️', '➡️', '🅰️'], description: 'Klassischer Hadoken-Move' },
      { name: 'Konami Code', sequence: ['⬆️', '⬆️', '⬇️', '⬇️', '⬅️', '➡️', '⬅️', '➡️', '🅱️', '🅰️'], description: 'Der berühmte Cheat-Code' },
      { name: 'Mario Jump', sequence: ['🅰️', '🅰️', '🅰️'], description: 'Dreifach-Sprung in Mario 64' },
      { name: 'Zelda Song', sequence: ['🅰️', '⬇️', '➡️', '🅰️', '⬇️', '➡️'], description: 'Zeldas Wiegenlied' }
    ]

    const buttons = ['⬆️', '⬇️', '⬅️', '➡️', '🅰️', '🅱️', '🎯', '🔄']

    useEffect(() => {
      if (showingSequence) {
        setTimeout(() => setShowingSequence(false), 3000)
      }
    }, [currentChallenge, showingSequence])

    const handleButtonPress = (button: string) => {
      if (showingSequence) return
      
      const newSequence = [...inputSequence, button]
      setInputSequence(newSequence)
      
      const currentTarget = challenges[currentChallenge].sequence
      
      if (newSequence.length === currentTarget.length) {
        if (JSON.stringify(newSequence) === JSON.stringify(currentTarget)) {
          setScore(prev => prev + 40)
          alert('🎉 Perfekt!')
          if (currentChallenge < challenges.length - 1) {
            setCurrentChallenge(prev => prev + 1)
            setInputSequence([])
            setShowingSequence(true)
          } else {
            alert('Alle Controller-Challenges gemeistert!')
          }
        } else {
          alert('❌ Falsche Sequenz!')
          setInputSequence([])
          setShowingSequence(true)
        }
      }
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-cyan-400 mb-2">🎮 Controller Challenge</h3>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="bg-cyan-600/20 px-3 py-1 rounded-full">Challenge {currentChallenge + 1}/{challenges.length}</span>
            <span className="bg-green-600/20 px-3 py-1 rounded-full">Score: {score}</span>
          </div>
        </div>
        
        <div className="card border-l-4 border-cyan-400">
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold mb-2">{challenges[currentChallenge].name}</h4>
            <p className="text-white/70 mb-4">{challenges[currentChallenge].description}</p>
            
            {showingSequence ? (
              <div className="bg-slate-700 rounded-lg p-4 mb-4">
                <div className="text-sm text-white/70 mb-2">Merke dir die Sequenz:</div>
                <div className="text-3xl space-x-2">
                  {challenges[currentChallenge].sequence.join(' ')}
                </div>
              </div>
            ) : (
              <div className="bg-slate-700 rounded-lg p-4 mb-4">
                <div className="text-sm text-white/70 mb-2">Deine Eingabe:</div>
                <div className="text-2xl space-x-1">
                  {inputSequence.join(' ') || '___'}
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {buttons.map((button) => (
              <button
                key={button}
                onClick={() => handleButtonPress(button)}
                disabled={showingSequence}
                className={`aspect-square text-3xl rounded-lg transition-all duration-200 hover:scale-105 ${
                  showingSequence 
                    ? 'bg-slate-700 opacity-50' 
                    : 'bg-slate-600 hover:bg-cyan-600/20 border-2 border-slate-500 hover:border-cyan-400'
                }`}
              >
                {button}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderBossRush = () => {
    const [currentBoss, setCurrentBoss] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [defeats, setDefeats] = useState(0)

    const bosses = [
      {
        description: '👑 Großer Koopa mit Spikes am Rücken',
        answer: 'Bowser',
        game: 'Super Mario 64',
        options: ['Bowser', 'King K. Rool', 'Ganondorf', 'Ridley']
      },
      {
        description: '🐉 Dunkler Magier aus Hyrule',
        answer: 'Ganondorf',
        game: 'Zelda: Ocarina of Time',
        options: ['Ganondorf', 'Bowser', 'Sephiroth', 'Dracula']
      },
      {
        description: '🦍 Riesiger Krokodil-König',
        answer: 'King K. Rool',
        game: 'Donkey Kong 64',
        options: ['King K. Rool', 'Bowser', 'Ganondorf', 'Ridley']
      },
      {
        description: '🤖 Mechanischer Space Pirate',
        answer: 'Ridley',
        game: 'Super Metroid',
        options: ['Ridley', 'Samus', 'Mother Brain', 'Kraid']
      },
      {
        description: '👹 Maskierter Schurke aus Termina',
        answer: 'Majora',
        game: 'Zelda: Majora\'s Mask',
        options: ['Majora', 'Ganondorf', 'Skull Kid', 'Moon']
      }
    ]

    const handleAnswer = (option: string) => {
      setSelectedAnswer(option)
      setShowResult(true)
      if (option === bosses[currentBoss].answer) {
        setDefeats(prev => prev + 1)
        setScore(prev => prev + 35)
      }
      setTimeout(() => {
        if (currentBoss < bosses.length - 1) {
          setCurrentBoss(prev => prev + 1)
          setSelectedAnswer(null)
          setShowResult(false)
        } else {
          alert(`Boss Rush beendet! ${defeats + (option === bosses[currentBoss].answer ? 1 : 0)}/${bosses.length} Bosse besiegt!`)
        }
      }, 2500)
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-orange-400 mb-2">👹 Boss Rush Quiz</h3>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="bg-orange-600/20 px-3 py-1 rounded-full">Boss {currentBoss + 1}/{bosses.length}</span>
            <span className="bg-green-600/20 px-3 py-1 rounded-full">Score: {score}</span>
          </div>
        </div>
        
        <div className="card border-l-4 border-orange-400">
          <div className="text-center mb-6">
            <div className="bg-slate-700 rounded-lg p-6 mb-4">
              <div className="text-4xl mb-3">👹</div>
              <div className="text-lg font-medium mb-2">{bosses[currentBoss].description}</div>
              <div className="text-sm text-white/70">aus {bosses[currentBoss].game}</div>
            </div>
            <p className="text-white/70">Welcher Boss wird hier beschrieben?</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {bosses[currentBoss].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`quiz-option text-center p-4 transition-all duration-300 ${
                  showResult
                    ? option === bosses[currentBoss].answer
                      ? 'correct animate-pulse'
                      : option === selectedAnswer
                      ? 'incorrect'
                      : 'opacity-50'
                    : 'hover:scale-105 hover:bg-orange-600/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {showResult && (
            <div className="mt-4 text-center">
              <div className="text-lg font-bold">
                {selectedAnswer === bosses[currentBoss].answer ? '⚔️ Boss besiegt!' : '💀 Boss hat gewonnen!'}
              </div>
              <div className="text-sm text-white/70">
                Boss: {bosses[currentBoss].answer} aus {bosses[currentBoss].game}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (selectedGame) {
    return (
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => {
            setSelectedGame(null)
            setScore(0)
            setGameState({})
          }}
          className="mb-6 text-white/70 hover:text-white transition-colors flex items-center space-x-2"
        >
          <span>←</span>
          <span>Zurück zu Minigames</span>
        </button>
        
        {selectedGame === 'emoji-quiz' && renderEmojiQuiz()}
        {selectedGame === 'sound-memory' && renderSoundMemory()}
        {selectedGame === 'cartridge-match' && renderCartridgeMatch()}
        {selectedGame === 'character-puzzle' && renderCharacterPuzzle()}
        {selectedGame === 'speed-challenge' && renderSpeedChallenge()}
        {selectedGame === 'color-match' && renderColorMatch()}
        {selectedGame === 'controller-challenge' && renderControllerChallenge()}
        {selectedGame === 'boss-rush' && renderBossRush()}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
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
            onClick={() => setSelectedGame(game.id)}
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
            <p className="text-white/70 text-sm">Authentisches Retro-Gaming-Feeling</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">📊 Deine Statistiken</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">8</div>
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