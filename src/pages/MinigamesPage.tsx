import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '../contexts/UserContext'
import { 
  Timer, 
  Zap, 
  Target, 
  Trophy, 
  Play, 
  Pause, 
  RotateCcw, 
  Crown,
  Star,
  Flame,
  Rocket,
  CheckCircle,
  XCircle,
  ArrowRight,
  Clock
} from 'lucide-react'

const SpeedrunChallengesPage: React.FC = () => {
  const { user } = useUser()
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [currentScore, setCurrentScore] = useState(0)
  const [bestTimes, setBestTimes] = useState<{[key: string]: number}>({})
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Speed Typing Challenge State
  const [typingText, setTypingText] = useState('')
  const [typingInput, setTypingInput] = useState('')
  const [typingStarted, setTypingStarted] = useState(false)
  
  // Reaction Time Challenge State
  const [reactionPhase, setReactionPhase] = useState<'waiting' | 'ready' | 'go' | 'result'>('waiting')
  const [reactionStartTime, setReactionStartTime] = useState(0)
  const [reactionTime, setReactionTime] = useState(0)
  
  // Memory Challenge State
  const [memorySequence, setMemorySequence] = useState<number[]>([])
  const [memoryInput, setMemoryInput] = useState<number[]>([])
  const [memoryLevel, setMemoryLevel] = useState(1)
  const [showingSequence, setShowingSequence] = useState(false)

  const speedrunChallenges = [
    {
      id: 'speed-typing',
      name: 'Speed Typing',
      description: 'Type N64 game titles as fast as possible!',
      icon: '⌨️',
      difficulty: 'easy',
      color: 'from-blue-500 to-blue-700',
      record: bestTimes['speed-typing'] ? `${(bestTimes['speed-typing'] / 1000).toFixed(2)}s` : 'No record'
    },
    {
      id: 'reaction-time',
      name: 'Lightning Reflexes',
      description: 'Test your speedrunner reflexes!',
      icon: '⚡',
      difficulty: 'medium',
      color: 'from-yellow-500 to-orange-700',
      record: bestTimes['reaction-time'] ? `${bestTimes['reaction-time']}ms` : 'No record'
    },
    {
      id: 'memory-sequence',
      name: 'Button Sequence',
      description: 'Remember controller button sequences!',
      icon: '🎮',
      difficulty: 'hard',
      color: 'from-purple-500 to-pink-700',
      record: bestTimes['memory-sequence'] ? `Level ${bestTimes['memory-sequence']}` : 'No record'
    },
    {
      id: 'pattern-match',
      name: 'Pattern Rush',
      description: 'Match N64 patterns at lightning speed!',
      icon: '🧩',
      difficulty: 'medium',
      color: 'from-green-500 to-emerald-700',
      record: bestTimes['pattern-match'] ? `${(bestTimes['pattern-match'] / 1000).toFixed(2)}s` : 'No record'
    }
  ]

  const n64GameTitles = [
    'Super Mario 64',
    'The Legend of Zelda Ocarina of Time',
    'GoldenEye 007',
    'Mario Kart 64',
    'Super Smash Bros',
    'Banjo-Kazooie',
    'Paper Mario',
    'Mario Party',
    'Star Fox 64',
    'Donkey Kong 64'
  ]

  useEffect(() => {
    if (isPlaying && selectedChallenge) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 10)
      }, 10)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPlaying, selectedChallenge])

  const startChallenge = (challengeId: string) => {
    setSelectedChallenge(challengeId)
    setIsPlaying(true)
    setTimeElapsed(0)
    setCurrentScore(0)
    
    switch (challengeId) {
      case 'speed-typing':
        const randomTitle = n64GameTitles[Math.floor(Math.random() * n64GameTitles.length)]
        setTypingText(randomTitle)
        setTypingInput('')
        setTypingStarted(true)
        break
      case 'reaction-time':
        setReactionPhase('waiting')
        setTimeout(() => {
          setReactionPhase('ready')
          setTimeout(() => {
            setReactionPhase('go')
            setReactionStartTime(Date.now())
          }, Math.random() * 3000 + 1000) // Random delay 1-4 seconds
        }, 1000)
        break
      case 'memory-sequence':
        setMemoryLevel(1)
        generateMemorySequence(1)
        break
    }
  }

  const generateMemorySequence = (level: number) => {
    const sequence = []
    for (let i = 0; i < level + 2; i++) {
      sequence.push(Math.floor(Math.random() * 4))
    }
    setMemorySequence(sequence)
    setMemoryInput([])
    setShowingSequence(true)
    
    setTimeout(() => {
      setShowingSequence(false)
    }, (level + 2) * 800)
  }

  const handleReactionClick = () => {
    if (reactionPhase === 'go') {
      const time = Date.now() - reactionStartTime
      setReactionTime(time)
      setReactionPhase('result')
      setIsPlaying(false)
      
      if (!bestTimes['reaction-time'] || time < bestTimes['reaction-time']) {
        setBestTimes(prev => ({ ...prev, 'reaction-time': time }))
      }
    }
  }

  const handleTypingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTypingInput(value)
    
    if (value === typingText) {
      setIsPlaying(false)
      const time = timeElapsed
      if (!bestTimes['speed-typing'] || time < bestTimes['speed-typing']) {
        setBestTimes(prev => ({ ...prev, 'speed-typing': time }))
        // Celebrate new record!
        console.log('🎉 NEW RECORD! 🎉')
      }
    }
  }

  const resetChallenge = () => {
    setSelectedChallenge(null)
    setIsPlaying(false)
    setTimeElapsed(0)
    setCurrentScore(0)
    setTypingStarted(false)
    setReactionPhase('waiting')
    setMemoryLevel(1)
  }

  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(2) + 's'
  }

  if (selectedChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Challenge Header */}
          <div className="text-center mb-8">
            <button
              onClick={resetChallenge}
              className="mb-4 flex items-center space-x-2 mx-auto bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Back to Challenges</span>
            </button>
            
            <h1 className="text-4xl font-bold text-white mb-2">
              {speedrunChallenges.find(c => c.id === selectedChallenge)?.name}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-lg">
              <div className="flex items-center space-x-2">
                <Timer className="w-5 h-5 text-green-400" />
                <span className="font-mono text-green-400">{formatTime(timeElapsed)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400">
                  Best: {speedrunChallenges.find(c => c.id === selectedChallenge)?.record}
                </span>
              </div>
            </div>
          </div>

          {/* Challenge Content */}
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            {selectedChallenge === 'speed-typing' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-6">Type this N64 game title:</h2>
                <div className="bg-slate-700 rounded-lg p-6 mb-6">
                  <div className="text-3xl font-bold text-blue-400 mb-4">{typingText}</div>
                  <input
                    type="text"
                    value={typingInput}
                    onChange={handleTypingInput}
                    className="w-full bg-slate-600 text-white text-xl p-4 rounded-lg border-2 border-slate-500 focus:border-blue-400 outline-none"
                    placeholder="Start typing..."
                    autoFocus
                  />
                </div>
                <div className="text-lg text-slate-300">
                  Progress: {typingInput.length}/{typingText.length} characters
                </div>
                {typingInput === typingText && (
                  <div className="mt-6 text-green-400 text-xl font-bold flex items-center justify-center space-x-2 animate-bounce">
                    <CheckCircle className="w-6 h-6" />
                    <span>Perfect! Time: {formatTime(timeElapsed)}</span>
                    {!bestTimes['speed-typing'] || timeElapsed < bestTimes['speed-typing'] ? (
                      <span className="text-yellow-400 ml-2">🎉 NEW RECORD! 🎉</span>
                    ) : (
                      <span className="text-blue-400 ml-2">Great job! 👍</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {selectedChallenge === 'reaction-time' && (
              <div className="text-center">
                <div className="mb-8">
                  {reactionPhase === 'waiting' && (
                    <div className="text-2xl text-slate-300">Get ready...</div>
                  )}
                  {reactionPhase === 'ready' && (
                    <div className="text-2xl text-yellow-400">Wait for it...</div>
                  )}
                  {reactionPhase === 'go' && (
                    <div className="text-4xl font-bold text-green-400 animate-pulse">GO!</div>
                  )}
                  {reactionPhase === 'result' && (
                    <div className="text-3xl font-bold text-white">
                      Your time: {reactionTime}ms
                      {reactionTime < 200 && <div className="text-green-400 mt-2 animate-pulse">Lightning fast! ⚡ You're a speedrun legend!</div>}
                      {reactionTime >= 200 && reactionTime < 300 && <div className="text-yellow-400 mt-2">Great reflexes! 👍 Almost legendary!</div>}
                      {reactionTime >= 300 && reactionTime < 400 && <div className="text-orange-400 mt-2">Keep practicing! 🎯 You're getting there!</div>}
                      {reactionTime >= 400 && <div className="text-red-400 mt-2">Time to train those reflexes! 💪 Never give up!</div>}
                    </div>
                  )}
                </div>
                
                {reactionPhase === 'go' && (
                  <button
                    onClick={handleReactionClick}
                    className="w-64 h-64 bg-red-600 hover:bg-red-500 rounded-full text-white text-2xl font-bold transform hover:scale-105 transition-all"
                  >
                    CLICK!
                  </button>
                )}
                
                {reactionPhase === 'result' && (
                  <button
                    onClick={() => startChallenge('reaction-time')}
                    className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg text-white font-bold"
                  >
                    Try Again
                  </button>
                )}
              </div>
            )}

            {selectedChallenge === 'memory-sequence' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-6">Level {memoryLevel}</h2>
                <div className="text-lg text-slate-300 mb-6">
                  {showingSequence ? 'Watch the sequence...' : 'Repeat the sequence!'}
                </div>
                
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  {['A', 'B', 'X', 'Y'].map((button, index) => (
                    <button
                      key={button}
                      className={`w-24 h-24 rounded-lg text-2xl font-bold transition-all ${
                        showingSequence && memorySequence[memoryInput.length] === index
                          ? 'bg-yellow-500 text-black scale-110'
                          : 'bg-slate-600 text-white hover:bg-slate-500'
                      }`}
                      onClick={() => {
                        if (!showingSequence) {
                          const newInput = [...memoryInput, index]
                          setMemoryInput(newInput)
                          
                          if (newInput.length === memorySequence.length) {
                            const correct = newInput.every((val, i) => val === memorySequence[i])
                            if (correct) {
                              setMemoryLevel(prev => prev + 1)
                              setTimeout(() => generateMemorySequence(memoryLevel + 1), 1000)
                            } else {
                              setIsPlaying(false)
                              setBestTimes(prev => ({ ...prev, 'memory-sequence': memoryLevel }))
                            }
                          }
                        }
                      }}
                    >
                      {button}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 text-slate-300">
                  Sequence: {memoryInput.length}/{memorySequence.length}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-2">
            ⚡ SPEED CHALLENGES ⚡
          </h1>
          <p className="text-xl text-slate-300">Test your speedrunner skills with these mini-challenges!</p>
        </div>

        {/* Personal Stats */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Your Records</h2>
            <Crown className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {speedrunChallenges.map(challenge => (
              <div key={challenge.id} className="bg-slate-700 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">{challenge.icon}</div>
                <div className="text-sm text-slate-400 mb-1">{challenge.name}</div>
                <div className="font-bold text-white">{challenge.record}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {speedrunChallenges.map(challenge => (
            <div
              key={challenge.id}
              className="group cursor-pointer transform hover:scale-105 transition-all duration-200"
              onClick={() => startChallenge(challenge.id)}
            >
              <div className={`bg-gradient-to-br ${challenge.color} rounded-xl p-6 border border-slate-600 shadow-2xl`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{challenge.icon}</div>
                  <div className="flex items-center space-x-2">
                    <Play className="w-5 h-5 text-white group-hover:animate-pulse" />
                    <span className="text-white font-bold">START</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{challenge.name}</h3>
                <p className="text-white/80 mb-4">{challenge.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-white/60" />
                    <span className="text-white/60 capitalize">{challenge.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-sm">{challenge.record}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fun Stats */}
        <div className="mt-8 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
            <Flame className="w-6 h-6 text-red-400" />
            <span>Challenge Stats</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{Object.keys(bestTimes).length}</div>
              <div className="text-slate-400">Challenges Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {Object.values(bestTimes).length > 0 ? '🔥' : '⭐'}
              </div>
              <div className="text-slate-400">
                {Object.values(bestTimes).length > 0 ? 'On Fire!' : 'Ready to Start!'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {Object.values(bestTimes).length >= 4 ? '👑' : '🎯'}
              </div>
              <div className="text-slate-400">
                {Object.values(bestTimes).length >= 4 ? 'Master!' : 'Keep Going!'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpeedrunChallengesPage