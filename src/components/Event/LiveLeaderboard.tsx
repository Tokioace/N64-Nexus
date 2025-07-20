import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Medal, 
  Award, 
  Clock, 
  User, 
  Calendar, 
  CheckCircle, 
  Eye, 
  Play, 
  Star,
  Crown,
  Flame,
  RefreshCw,
  Users,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { useEvents } from '../../contexts/EventContext'
import { useUser } from '../../contexts/UserContext'
import { LiveLeaderboardEntry } from '../../types'
import SimpleCard from '../SimpleCard'
import SimpleButton from '../SimpleButton'

interface LiveLeaderboardProps {
  eventId: string
  maxEntries?: number
  autoRefresh?: boolean
  refreshInterval?: number
  showAnimations?: boolean
  showTeamInfo?: boolean
}

const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({
  eventId,
  maxEntries = 10,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
  showAnimations = true,
  showTeamInfo = true
}) => {
  const { user } = useUser()
  const { getEventById, getLiveLeaderboard } = useEvents()
  
  const [leaderboard, setLeaderboard] = useState<LiveLeaderboardEntry[]>([])
  const [previousLeaderboard, setPreviousLeaderboard] = useState<LiveLeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [highlightedEntries, setHighlightedEntries] = useState<Set<string>>(new Set())

  const event = getEventById(eventId)

  const fetchLeaderboard = useCallback(async () => {
    if (!event) return

    try {
      setIsLoading(true)
      
      // Store previous state for comparison
      setPreviousLeaderboard(leaderboard)
      
      // Get fresh leaderboard data
      const newLeaderboard = getLiveLeaderboard(eventId).slice(0, maxEntries)
      
      // Detect changes and mark entries for highlighting
      const newHighlighted = new Set<string>()
      newLeaderboard.forEach((entry, index) => {
        const previousEntry = previousLeaderboard.find(p => p.user.id === entry.user.id)
        if (previousEntry && previousEntry.rank !== entry.rank) {
          newHighlighted.add(entry.user.id)
        }
        if (!previousEntry) {
          newHighlighted.add(entry.user.id)
          entry.isNewEntry = true
        }
        entry.previousRank = previousEntry?.rank
      })
      
      setLeaderboard(newLeaderboard)
      setHighlightedEntries(newHighlighted)
      setLastUpdate(new Date())
      
      // Clear highlights after animation
      if (showAnimations && newHighlighted.size > 0) {
        setTimeout(() => {
          setHighlightedEntries(new Set())
        }, 3000)
      }
      
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setIsLoading(false)
    }
  }, [eventId, event, getLiveLeaderboard, maxEntries, leaderboard, previousLeaderboard, showAnimations])

  // Initial load and auto-refresh
  useEffect(() => {
    fetchLeaderboard()
    
    if (autoRefresh) {
      const interval = setInterval(fetchLeaderboard, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchLeaderboard, autoRefresh, refreshInterval])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold text-lg">
            {rank}
          </div>
        )
    }
  }

  const getRankColor = (rank: number, isHighlighted: boolean) => {
    const baseColors = {
      1: 'from-yellow-500/30 to-yellow-600/30 border-yellow-500/60',
      2: 'from-gray-400/30 to-gray-500/30 border-gray-400/60',  
      3: 'from-amber-600/30 to-amber-700/30 border-amber-600/60',
      default: 'from-gray-700/30 to-gray-800/30 border-gray-600/50'
    }
    
    const highlightColors = {
      1: 'from-yellow-500/50 to-yellow-600/50 border-yellow-400/80 shadow-yellow-400/20',
      2: 'from-gray-400/50 to-gray-500/50 border-gray-300/80 shadow-gray-300/20',
      3: 'from-amber-600/50 to-amber-700/50 border-amber-500/80 shadow-amber-500/20',
      default: 'from-blue-600/50 to-blue-700/50 border-blue-500/80 shadow-blue-500/20'
    }
    
    if (isHighlighted) {
      return `bg-gradient-to-r ${highlightColors[rank as keyof typeof highlightColors] || highlightColors.default} shadow-lg`
    }
    
    return `bg-gradient-to-r ${baseColors[rank as keyof typeof baseColors] || baseColors.default}`
  }

  const getRankChangeIcon = (entry: LiveLeaderboardEntry) => {
    if (!entry.previousRank || entry.previousRank === entry.rank) return null
    
    if (entry.rank < entry.previousRank) {
      return <TrendingUp className="w-4 h-4 text-green-400 animate-bounce" />
    } else {
      return <TrendingDown className="w-4 h-4 text-red-400 animate-bounce" />
    }
  }

  const formatTimeDifference = (current: string, previous?: string) => {
    if (!previous) return null
    
    // Simple time parsing - would need more robust parsing in production
    const parseTime = (timeStr: string) => {
      const parts = timeStr.split(':').map(Number)
      return parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0] * 3600 + parts[1] * 60 + parts[2]
    }
    
    const currentSeconds = parseTime(current)
    const previousSeconds = parseTime(previous)
    const diff = previousSeconds - currentSeconds
    
    if (diff > 0) {
      const minutes = Math.floor(diff / 60)
      const seconds = diff % 60
      return `${minutes > 0 ? `${minutes}:` : ''}${seconds.toString().padStart(2, '0')} faster`
    }
    return null
  }

  if (!event) {
    return (
      <SimpleCard className="text-center p-8">
        <div className="text-gray-400">
          <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Event nicht gefunden</h3>
        </div>
      </SimpleCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="relative">
              <Trophy className="w-7 h-7 text-yellow-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
            Live Leaderboard
          </h2>
          <p className="text-gray-400 text-sm mt-1">{event.title}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Letztes Update: {lastUpdate.toLocaleTimeString('de-DE')}
            </div>
            <div className="text-xs mt-1">
              Auto-Refresh: {autoRefresh ? `${refreshInterval / 1000}s` : 'Aus'}
            </div>
          </div>
          
          <SimpleButton
            variant="secondary"
            onClick={fetchLeaderboard}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Aktualisieren
          </SimpleButton>
        </div>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <SimpleCard className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
          <h3 className="text-lg font-bold text-white mb-4 text-center">🏆 Top 3 🏆</h3>
          <div className="flex justify-center items-end gap-4">
            {/* 2nd Place */}
            <motion.div 
              className="text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-20 h-16 bg-gradient-to-t from-gray-400/30 to-gray-300/30 rounded-t-lg flex items-end justify-center pb-2 mb-2 border-2 border-gray-300/50">
                <Medal className="w-8 h-8 text-gray-300" />
              </div>
              <div className="text-sm font-bold text-gray-300">{leaderboard[1]?.user.username}</div>
              <div className="text-lg font-bold text-white">{leaderboard[1]?.gameTime}</div>
              <div className="text-xs text-gray-400">2. Platz</div>
            </motion.div>

            {/* 1st Place */}
            <motion.div 
              className="text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-24 h-20 bg-gradient-to-t from-yellow-500/30 to-yellow-400/30 rounded-t-lg flex items-end justify-center pb-2 mb-2 border-2 border-yellow-400/60 shadow-lg shadow-yellow-400/20">
                <Crown className="w-10 h-10 text-yellow-400" />
              </div>
              <div className="text-sm font-bold text-yellow-400">{leaderboard[0]?.user.username}</div>
              <div className="text-xl font-bold text-white">{leaderboard[0]?.gameTime}</div>
              <div className="text-xs text-yellow-400">🥇 Champion</div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div 
              className="text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-20 h-14 bg-gradient-to-t from-amber-600/30 to-amber-500/30 rounded-t-lg flex items-end justify-center pb-2 mb-2 border-2 border-amber-500/50">
                <Award className="w-7 h-7 text-amber-600" />
              </div>
              <div className="text-sm font-bold text-amber-600">{leaderboard[2]?.user.username}</div>
              <div className="text-lg font-bold text-white">{leaderboard[2]?.gameTime}</div>
              <div className="text-xs text-amber-600">3. Platz</div>
            </motion.div>
          </div>
        </SimpleCard>
      )}

      {/* Full Leaderboard */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {leaderboard.map((entry, index) => {
            const isHighlighted = highlightedEntries.has(entry.user.id)
            const isCurrentUser = entry.user.id === user?.id
            
            return (
              <motion.div
                key={entry.user.id}
                layout
                initial={showAnimations && entry.isNewEntry ? { x: -50, opacity: 0, scale: 0.9 } : false}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 50, opacity: 0, scale: 0.9 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 25,
                  layout: { duration: 0.4 }
                }}
              >
                <SimpleCard 
                  className={`
                    ${getRankColor(entry.rank, isHighlighted)}
                    ${isCurrentUser ? 'ring-2 ring-blue-400/50' : ''}
                    transition-all duration-300 hover:scale-[1.02]
                    ${isHighlighted ? 'animate-pulse' : ''}
                  `}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Rank with change indicator */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800/50">
                            {getRankIcon(entry.rank)}
                          </div>
                          {getRankChangeIcon(entry)}
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-white font-medium">
                                {entry.user.username}
                                {showTeamInfo && entry.teamName && (
                                  <span className="ml-2 text-sm text-blue-400">
                                    [{entry.teamName}]
                                  </span>
                                )}
                              </span>
                              {entry.isVerified && (
                                <CheckCircle className="w-4 h-4 text-green-400" title="Verifiziert" />
                              )}
                              {isCurrentUser && (
                                <Star className="w-4 h-4 text-yellow-400" title="Das sind Sie!" />
                              )}
                              {entry.isLive && (
                                <div className="flex items-center gap-1 text-red-400">
                                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                  <span className="text-xs">Live</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {entry.submittedAt.toLocaleDateString('de-DE')}
                              </div>
                              {entry.isNewEntry && (
                                <div className="flex items-center gap-1 text-green-400">
                                  <Flame className="w-3 h-3" />
                                  Neu!
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Time and Actions */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-xl font-bold text-white">{entry.gameTime}</span>
                          </div>
                          {entry.rank <= 3 && (
                            <div className="text-xs text-gray-400">
                              {entry.rank === 1 ? '🏆 Weltrekord' : 
                               entry.rank === 2 ? '🥈 2. Platz' : '🥉 3. Platz'}
                            </div>
                          )}
                        </div>

                        {/* Media Actions */}
                        {entry.media && (
                          <div className="flex items-center gap-2">
                            <SimpleButton
                              variant="secondary"
                              onClick={() => window.open(entry.media?.url, '_blank')}
                              className="text-xs px-2 py-1"
                            >
                              {entry.media.type === 'video' ? (
                                <>
                                  <Play className="w-3 h-3 mr-1" />
                                  Video
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3 h-3 mr-1" />
                                  Foto
                                </>
                              )}
                            </SimpleButton>
                            
                            {entry.media.votes && (
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <span>🔥 {entry.media.votes.likes}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </SimpleCard>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Loading State */}
      {isLoading && leaderboard.length === 0 && (
        <SimpleCard className="text-center p-8">
          <div className="text-gray-400">
            <RefreshCw className="w-16 h-16 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Lade Leaderboard...</h3>
          </div>
        </SimpleCard>
      )}

      {/* Empty State */}
      {!isLoading && leaderboard.length === 0 && (
        <SimpleCard className="text-center p-8">
          <div className="text-gray-400">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Noch keine Einträge</h3>
            <p className="text-sm">Sei der Erste und reiche deine Zeit ein!</p>
          </div>
        </SimpleCard>
      )}

      {/* Event Stats */}
      <SimpleCard className="p-4 bg-gray-800/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">{leaderboard.length}</div>
            <div className="text-xs text-gray-400">Teilnehmer</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {leaderboard.filter(e => e.isLive).length}
            </div>
            <div className="text-xs text-gray-400">Live</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {leaderboard.filter(e => e.isVerified).length}
            </div>
            <div className="text-xs text-gray-400">Verifiziert</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {showTeamInfo ? new Set(leaderboard.filter(e => e.teamId).map(e => e.teamId)).size : 0}
            </div>
            <div className="text-xs text-gray-400">Teams</div>
          </div>
        </div>
      </SimpleCard>
    </div>
  )
}

export default LiveLeaderboard