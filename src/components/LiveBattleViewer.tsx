import React, { useState, useEffect } from 'react'
import { useMap } from '../contexts/MapContext'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Play, 
  Pause, 
  Users, 
  Eye, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Share2, 
  MessageCircle,
  Heart,
  Zap,
  Crown,
  Target,
  Timer,
  X,
  ExternalLink,
  Camera,
  Mic,
  MicOff,
  Settings
} from 'lucide-react'

interface LiveBattleViewerProps {
  isOpen: boolean
  onClose: () => void
  battleId?: string
}

const LiveBattleViewer: React.FC<LiveBattleViewerProps> = ({ isOpen, onClose, battleId }) => {
  const { t } = useLanguage()
  const { user } = useUser()
  const { liveBattles, joinAsSpectator } = useMap()
  const [selectedBattle, setSelectedBattle] = useState<string | null>(battleId || null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string
    username: string
    message: string
    timestamp: Date
    type: 'chat' | 'system' | 'cheer'
  }>>([])
  const [newMessage, setNewMessage] = useState('')
  const [showControls, setShowControls] = useState(true)
  const [reactions, setReactions] = useState<Array<{
    id: string
    emoji: string
    x: number
    y: number
    timestamp: Date
  }>>([])

  const currentBattle = liveBattles.find(b => b.eventId === selectedBattle)

  // Simulate live chat messages
  useEffect(() => {
    if (!currentBattle) return

    const interval = setInterval(() => {
      const sampleMessages = [
        { username: 'SpeedRunner92', message: 'Amazing combo!', type: 'chat' as const },
        { username: 'N64Fan', message: 'That was insane!', type: 'chat' as const },
        { username: 'RetroGamer', message: 'GG WP', type: 'chat' as const },
        { username: 'System', message: 'Round 2 starting...', type: 'system' as const },
        { username: 'MarioMaster', message: '🔥🔥🔥', type: 'cheer' as const }
      ]

      if (Math.random() > 0.7) {
        const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)]
        setChatMessages(prev => [...prev.slice(-49), {
          id: `msg_${Date.now()}_${Math.random()}`,
          ...randomMessage,
          timestamp: new Date()
        }])
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [currentBattle])

  // Auto-hide controls
  useEffect(() => {
    if (!isFullscreen) return

    const timer = setTimeout(() => {
      setShowControls(false)
    }, 3000)

    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(timer)
      setTimeout(() => setShowControls(false), 3000)
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isFullscreen])

  const handleJoinAsSpectator = async (eventId: string) => {
    if (user) {
      await joinAsSpectator(eventId)
      setSelectedBattle(eventId)
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return

    setChatMessages(prev => [...prev.slice(-49), {
      id: `msg_${Date.now()}_${user.id}`,
      username: user.username,
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'chat'
    }])
    setNewMessage('')
  }

  const handleReaction = (emoji: string) => {
    const newReaction = {
      id: `reaction_${Date.now()}_${Math.random()}`,
      emoji,
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 100,
      timestamp: new Date()
    }
    
    setReactions(prev => [...prev, newReaction])
    
    // Remove reaction after animation
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id))
    }, 3000)
  }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 bg-black z-50 flex ${isFullscreen ? '' : 'p-4 bg-black/90'}`}>
      <div className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl flex ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-7xl mx-auto'
      }`}>
        
        {/* Battle Selection Sidebar */}
        {!selectedBattle && (
          <div className="w-80 border-r border-slate-600 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-yellow-400">Live Battles</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {liveBattles.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🎮</div>
                  <p className="text-slate-400">No live battles right now</p>
                  <p className="text-sm text-slate-500 mt-2">Check back later for epic battles!</p>
                </div>
              ) : (
                liveBattles.map((battle) => (
                  <div
                    key={battle.eventId}
                    className="bg-slate-800/50 border border-slate-600 rounded-xl p-4 cursor-pointer hover:border-yellow-500/50 transition-all"
                    onClick={() => handleJoinAsSpectator(battle.eventId)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-white truncate">{battle.title}</h3>
                      <div className="flex items-center gap-1 text-red-500">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium">LIVE</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-yellow-400 mb-2">{battle.game}</div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users className="w-4 h-4" />
                        {battle.players.length} players
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Eye className="w-4 h-4" />
                        {battle.spectators} watching
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-slate-500">
                      Round {battle.currentRound} of {battle.totalRounds}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Main Battle View */}
        {selectedBattle && currentBattle && (
          <div className="flex-1 flex flex-col relative">
            {/* Header Controls */}
            <div className={`absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity ${
              isFullscreen && !showControls ? 'opacity-0' : 'opacity-100'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedBattle(null)}
                    className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                  
                  <div>
                    <h2 className="text-xl font-bold text-white">{currentBattle.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-slate-300">
                      <span>{currentBattle.game}</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span>LIVE</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {currentBattle.spectators}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                  </button>
                  
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {isFullscreen ? <Minimize className="w-5 h-5 text-white" /> : <Maximize className="w-5 h-5 text-white" />}
                  </button>
                  
                  <button className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                  
                  {!isFullscreen && (
                    <button
                      onClick={onClose}
                      className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Video/Stream Area */}
            <div className="flex-1 bg-gradient-to-br from-slate-900 to-black relative flex items-center justify-center">
              {/* Simulated Stream */}
              <div className="text-center">
                <div className="w-24 h-24 bg-yellow-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                  <Play className="w-12 h-12 text-black" />
                </div>
                <p className="text-white text-xl mb-2">Battle Stream</p>
                <p className="text-slate-400">Round {currentBattle.currentRound} of {currentBattle.totalRounds}</p>
                
                {/* Simulated N64 Game Screen */}
                <div className="mt-8 bg-slate-800 rounded-lg p-6 max-w-md mx-auto">
                  <div className="text-yellow-400 font-bold mb-4">{currentBattle.game}</div>
                  <div className="grid grid-cols-2 gap-4">
                    {currentBattle.players.map((player, index) => (
                      <div key={player.id} className="text-center">
                        <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl ${
                          index === 0 ? 'bg-red-600' : index === 1 ? 'bg-blue-600' : index === 2 ? 'bg-green-600' : 'bg-purple-600'
                        }`}>
                          🎮
                        </div>
                        <div className="text-white font-medium text-sm">{player.name}</div>
                        <div className="text-yellow-400 font-bold">{player.score}</div>
                        <div className={`text-xs ${
                          player.status === 'playing' ? 'text-green-400' : 
                          player.status === 'spectating' ? 'text-blue-400' : 'text-red-400'
                        }`}>
                          {player.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Reactions */}
              {reactions.map((reaction) => (
                <div
                  key={reaction.id}
                  className="absolute text-4xl animate-bounce pointer-events-none"
                  style={{
                    left: `${reaction.x}px`,
                    top: `${reaction.y}px`,
                    animation: 'float-up 3s ease-out forwards'
                  }}
                >
                  {reaction.emoji}
                </div>
              ))}
            </div>

            {/* Bottom Controls & Chat */}
            <div className={`bg-slate-900/95 border-t border-slate-600 transition-all ${
              isFullscreen && !showControls ? 'translate-y-full' : 'translate-y-0'
            }`}>
              <div className="flex">
                {/* Battle Stats */}
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Timer className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-300">
                          {Math.floor((Date.now() - currentBattle.startTime.getTime()) / 60000)}m
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300">Round {currentBattle.currentRound}/{currentBattle.totalRounds}</span>
                      </div>
                    </div>
                    
                    {/* Quick Reactions */}
                    <div className="flex items-center gap-2">
                      {['🔥', '💯', '😱', '👏', '🎉'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(emoji)}
                          className="w-8 h-8 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Player Scores */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentBattle.players.map((player, index) => (
                      <div key={player.id} className="bg-slate-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${
                            player.status === 'playing' ? 'bg-green-500' : 
                            player.status === 'spectating' ? 'bg-blue-500' : 'bg-red-500'
                          }`} />
                          <span className="text-white font-medium text-sm truncate">{player.name}</span>
                        </div>
                        <div className="text-2xl font-bold text-yellow-400">{player.score}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Chat */}
                <div className="w-80 border-l border-slate-600 flex flex-col">
                  <div className="p-4 border-b border-slate-600">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Live Chat
                    </h3>
                  </div>
                  
                  <div className="flex-1 p-4 overflow-y-auto max-h-64 space-y-2">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`text-sm ${
                        msg.type === 'system' ? 'text-yellow-400 italic' : 
                        msg.type === 'cheer' ? 'text-purple-400' : 'text-slate-300'
                      }`}>
                        {msg.type !== 'system' && (
                          <span className="font-medium text-white">{msg.username}: </span>
                        )}
                        {msg.message}
                      </div>
                    ))}
                  </div>
                  
                  {user && (
                    <div className="p-4 border-t border-slate-600">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                        <button
                          onClick={handleSendMessage}
                          className="px-4 py-2 bg-yellow-600 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
          }
        }
      `}</style>
    </div>
  )
}

export default LiveBattleViewer