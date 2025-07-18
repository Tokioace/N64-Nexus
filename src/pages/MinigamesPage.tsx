import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { Gamepad2, Music, Image, Puzzle } from 'lucide-react'

const MinigamesPage: React.FC = () => {
  const { user } = useUser()
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

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
      textColor: 'text-blue-600'
    },
    {
      id: 'sound-memory',
      name: 'Sound Memory',
      description: 'Finde Soundeffekte dem Spiel zugeordnet',
      icon: '🎵',
      difficulty: 'medium' as const,
      maxScore: 150,
      isAvailable: true,
      color: 'bg-blue-600/20',
      textColor: 'text-blue-600'
    },
    {
      id: 'cartridge-match',
      name: 'Match the Cartridge',
      description: 'Ordne Fake-Covers echten Spielen zu',
      icon: '📀',
      difficulty: 'hard' as const,
      maxScore: 200,
      isAvailable: false,
      color: 'bg-red-600/20',
      textColor: 'text-red-600'
    },
    {
      id: 'character-puzzle',
      name: 'Character Puzzle',
      description: 'Löse Puzzles mit N64-Charakteren',
      icon: '🧩',
      difficulty: 'medium' as const,
      maxScore: 120,
      isAvailable: false,
      color: 'bg-green-600/20',
      textColor: 'text-green-600'
    }
  ]

  const renderEmojiQuiz = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">N64 Emoji-Quiz</h3>
      <p className="text-white/70">Errate das Spiel anhand der Emojis!</p>
      
      <div className="space-y-4">
        {[
          { emojis: '🍄👨‍🦰🏰', answer: 'Super Mario 64', options: ['Super Mario 64', 'Banjo-Kazooie', 'Donkey Kong 64', 'Conker\'s Bad Fur Day'] },
          { emojis: '🗡️🛡️🏰', answer: 'The Legend of Zelda: Ocarina of Time', options: ['The Legend of Zelda: Ocarina of Time', 'GoldenEye 007', 'Perfect Dark', 'Turok'] },
          { emojis: '🐻🐦🍯', answer: 'Banjo-Kazooie', options: ['Banjo-Kazooie', 'Donkey Kong 64', 'Conker\'s Bad Fur Day', 'Super Mario 64'] },
          { emojis: '🔫👨‍💼🏢', answer: 'GoldenEye 007', options: ['GoldenEye 007', 'Perfect Dark', 'Turok', 'Doom 64'] },
          { emojis: '🏎️🍄🏁', answer: 'Mario Kart 64', options: ['Mario Kart 64', 'Diddy Kong Racing', 'F-Zero X', 'Wave Race 64'] }
        ].map((quiz, index) => (
          <EmojiQuizItem key={index} {...quiz} />
        ))}
      </div>
    </div>
  )

  const renderSoundMemory = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Sound Memory</h3>
      <p className="text-white/70">Klicke auf die Karten um Soundeffekte zu finden!</p>
      
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }, (_, i) => (
          <button
            key={i}
            className="card aspect-square flex items-center justify-center text-2xl hover:bg-white/15 transition-all duration-200"
            onClick={() => alert('Sound Memory Game - Coming Soon!')}
          >
            🎵
          </button>
        ))}
      </div>
    </div>
  )

  if (selectedGame) {
    return (
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => setSelectedGame(null)}
          className="mb-4 text-white/70 hover:text-white transition-colors"
        >
          ← Zurück zu Minigames
        </button>
        
        {selectedGame === 'emoji-quiz' && renderEmojiQuiz()}
        {selectedGame === 'sound-memory' && renderSoundMemory()}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold ">
          🎮 Minigames
        </h1>
        <p className="text-white/70">
          Spaßige Spiele rund um N64
        </p>
      </div>

      {/* Minigames Grid */}
      <div className="space-y-4">
        {minigames.map((game) => (
          <div
            key={game.id}
            className={`card ${game.color} border-l-4 ${game.textColor} border-l-current ${
              game.isAvailable ? 'cursor-pointer hover:bg-white/15' : 'opacity-50 cursor-not-allowed'
            } transition-all duration-200`}
            onClick={() => game.isAvailable && setSelectedGame(game.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{game.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{game.name}</h3>
                <p className="text-white/70 text-sm">{game.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${game.color} ${game.textColor}`}>
                    {game.difficulty}
                  </span>
                  <span className="text-xs text-white/50">
                    Max: {game.maxScore} Punkte
                  </span>
                </div>
              </div>
              <div className="text-right">
                {game.isAvailable ? (
                  <div className="text-white/50">→</div>
                ) : (
                  <div className="text-xs text-white/50">Coming Soon</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold ">Bald verfügbar</h2>
        <div className="card">
          <p className="text-white/70 mb-4">
            Weitere Minigames sind in Entwicklung:
          </p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>• 🎵 Sound Memory - Finde Soundeffekte dem Spiel zugeordnet</li>
            <li>• 📀 Match the Cartridge - Ordne Fake-Covers echten Spielen zu</li>
            <li>• 🧩 Character Puzzle - Löse Puzzles mit N64-Charakteren</li>
            <li>• 🏆 Speed Challenge - Schnellste Runden in verschiedenen Spielen</li>
            <li>• 🎨 Color Match - Ordne Charaktere ihren Farben zu</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const EmojiQuizItem: React.FC<{
  emojis: string
  answer: string
  options: string[]
}> = ({ emojis, answer, options }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (option: string) => {
    setSelectedAnswer(option)
    setShowResult(true)
    setTimeout(() => setShowResult(false), 2000)
  }

  return (
    <div className="card">
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">{emojis}</div>
        <p className="text-white/70">Welches Spiel wird hier dargestellt?</p>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={showResult}
            className={`quiz-option text-center ${
              showResult
                ? option === answer
                  ? 'correct'
                  : option === selectedAnswer
                  ? 'incorrect'
                  : ''
                : selectedAnswer === option
                ? 'selected'
                : ''
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {showResult && (
        <div className="mt-3 text-center">
          <div className="text-lg font-bold">
            {selectedAnswer === answer ? '🎉 Richtig!' : '😔 Falsch!'}
          </div>
          <div className="text-sm text-white/70">
            Antwort: {answer}
          </div>
        </div>
      )}
    </div>
  )
}

export default MinigamesPage