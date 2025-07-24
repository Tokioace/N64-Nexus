import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { 
  PointsContextType, 
  UserPoints, 
  N64FanLeaderboardEntry, 
  PointsConfig, 
  RankConfig, 
  Achievement, 
  MedalConfig,
  PointsHistoryEntry,
  UserRank,
  UserMedal,
  LeaderboardFilter
} from '../types'
import { useUser } from './UserContext'
import { useLanguage } from './LanguageContext'
import PointsNotification from '../components/PointsNotification'

const PointsContext = createContext<PointsContextType | undefined>(undefined)

// Points configuration based on requirements
const POINTS_CONFIG: PointsConfig = {
  'speedrun.upload': 50,
  'speedrun.top3': 25,
  'media.speedrun': 50,
  'media.screenshot': 25,
  'media.achievement': 30,
  'media.stream': 50,
  'fanart.upload': 40,
  'fanart.likeReceived': 5,
  'quiz.answerCorrect': 10,
  'quiz.fullPerfect': 50,
  'minigame.success': 15,
  'forum.post': 10,
  'forum.reply': 5,
  'chat.messages': 1,
  'profile.setupComplete': 10,
  'marketplace.saleConfirmed': 20,
  'news.shared': 10
}

// Ranks configuration with i18n keys
const RANKS_CONFIG: RankConfig[] = [
  { key: 'rank.n64Beginner', minPoints: 0, iconKey: 'icon.n64Controller' },
  { key: 'rank.moduleCollector', minPoints: 100, iconKey: 'icon.cartridge' },
  { key: 'rank.retroGeek', minPoints: 250, iconKey: 'icon.retrogamer' },
  { key: 'rank.speedrunner', minPoints: 500, iconKey: 'icon.stopwatch' },
  { key: 'rank.fanartMaster', minPoints: 1000, iconKey: 'icon.paintbrush' },
  { key: 'rank.retroChampion', minPoints: 2000, iconKey: 'icon.trophy' },
  { key: 'rank.n64Legend', minPoints: 5000, iconKey: 'icon.crown' }
]

// Achievements configuration
const ACHIEVEMENTS_CONFIG: Achievement[] = [
  {
    id: 'speedrunMaster',
    key: 'achievement.speedrunMaster',
    iconKey: 'icon.speedrun',
    requiredActions: [{ action: 'speedrun.upload', count: 10 }],
    unlocked: false
  },
  {
    id: 'quizGuru',
    key: 'achievement.quizGuru',
    iconKey: 'icon.brain',
    requiredActions: [{ action: 'quiz.fullPerfect', count: 5 }],
    unlocked: false
  },
  {
    id: 'fanartArtist',
    key: 'achievement.fanartArtist',
    iconKey: 'icon.art',
    requiredActions: [{ action: 'fanart.upload', count: 20 }],
    unlocked: false
  },
  {
    id: 'communityVeteran',
    key: 'achievement.communityVeteran',
    iconKey: 'icon.community',
    requiredActions: [
      { action: 'forum.post', count: 50 },
      { action: 'forum.reply', count: 100 }
    ],
    unlocked: false
  },
  {
    id: 'marketPro',
    key: 'achievement.marketPro',
    iconKey: 'icon.market',
    requiredActions: [{ action: 'marketplace.saleConfirmed', count: 10 }],
    unlocked: false
  },
  {
    id: 'eventKing',
    key: 'achievement.eventKing',
    iconKey: 'icon.event',
    requiredPoints: 1000,
    unlocked: false
  },
  {
    id: 'n64Knowledge',
    key: 'achievement.n64Knowledge',
    iconKey: 'icon.knowledge',
    requiredActions: [{ action: 'quiz.answerCorrect', count: 100 }],
    unlocked: false
  }
]

// Medals configuration
const MEDALS_CONFIG: MedalConfig[] = [
  { place: 1, key: 'medal.legend', iconKey: 'icon.goldCrown', bonusXP: 200 },
  { place: 2, key: 'medal.champion', iconKey: 'icon.silverMedal', bonusXP: 100 },
  { place: 3, key: 'medal.pixelHero', iconKey: 'icon.bronzeMedal', bonusXP: 75 }
]

// Local storage keys
const STORAGE_KEY_USER_POINTS = 'battle64_user_points'
const STORAGE_KEY_GLOBAL_LEADERBOARD = 'battle64_global_leaderboard'
const STORAGE_KEY_CURRENT_SEASON = 'battle64_current_season'

export const PointsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, updateProfile } = useUser()
  const { t } = useLanguage()
  
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null)
  const [globalLeaderboard, setGlobalLeaderboard] = useState<N64FanLeaderboardEntry[]>([])
  const [seasonLeaderboard, setSeasonLeaderboard] = useState<N64FanLeaderboardEntry[]>([])
  const [currentSeason, setCurrentSeason] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Array<{
    id: string
    action: string
    points: number
    description?: string
  }>>([])
  const [lastActionTimes, setLastActionTimes] = useState<Record<string, number>>({})

  const showNotification = (action: string, points: number, description?: string) => {
    const notification = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action,
      points,
      description
    }
    setNotifications(prev => [...prev, notification].slice(-5)) // Keep max 5 notifications
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const isRateLimited = (action: string): boolean => {
    const now = Date.now()
    const lastTime = lastActionTimes[action] || 0
    const cooldown = action === 'chat.messages' ? 1000 : 5000 // 1s for chat, 5s for others
    
    return now - lastTime < cooldown
  }

  // Initialize current season
  useEffect(() => {
    const now = new Date()
    const seasonKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    setCurrentSeason(seasonKey)
  }, [])

  // Initialize user points
  useEffect(() => {
    if (user && !userPoints) {
      initializeUserPoints()
    }
  }, [user])

  // Load leaderboards
  useEffect(() => {
    loadLeaderboards()
  }, [])

  // Check for profile completion and award points
  useEffect(() => {
    if (!user || !userPoints) return

    const isProfileComplete = !!(
      user.bio && 
      user.location && 
      user.avatar && 
      user.collections && user.collections.length > 0
    )

    const hasProfileCompletionPoints = userPoints.pointHistory.some(
      entry => entry.action === 'profile.setupComplete'
    )

    if (isProfileComplete && !hasProfileCompletionPoints) {
      try {
        awardPoints('profile.setupComplete', 'Profile setup completed')
      } catch (error) {
        console.error('Failed to award points for profile completion:', error)
      }
    }
  }, [user?.bio, user?.location, user?.avatar, user?.collections?.length, userPoints?.pointHistory?.length])

  const initializeUserPoints = () => {
    if (!user) return

    const existingPoints = user.points || {
      totalPoints: 0,
      seasonPoints: {},
      currentRank: {
        key: 'rank.n64Beginner',
        minPoints: 0,
        currentPoints: 0
      },
      achievementsUnlocked: [],
      medals: [],
      pointHistory: []
    }

    // Ensure current season exists
    if (!existingPoints.seasonPoints[currentSeason]) {
      existingPoints.seasonPoints[currentSeason] = 0
    }

    setUserPoints(existingPoints)
  }

  const loadLeaderboards = () => {
    try {
      const savedGlobal = localStorage.getItem(STORAGE_KEY_GLOBAL_LEADERBOARD)
      if (savedGlobal) {
        setGlobalLeaderboard(JSON.parse(savedGlobal))
      }
    } catch (error) {
      console.error('Error loading leaderboards:', error)
    }
  }

  const saveUserPoints = async (points: UserPoints) => {
    if (!user) return false

    try {
      // Update user context
      await updateProfile({ points })
      setUserPoints(points)
      
      // Update leaderboards
      updateLeaderboards(points)
      
      return true
    } catch (error) {
      console.error('Error saving user points:', error)
      setError('Failed to save points')
      return false
    }
  }

  const updateLeaderboards = (points: UserPoints) => {
    if (!user) return

    const leaderboardEntry: N64FanLeaderboardEntry = {
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      totalPoints: points.totalPoints,
      seasonPoints: points.seasonPoints[currentSeason] || 0,
      currentRank: points.currentRank,
      region: user.region,
      platform: user.platform,
      position: 0, // Will be calculated
      medals: points.medals,
      isCurrentUser: true
    }

    // Update global leaderboard
    setGlobalLeaderboard(prev => {
      const filtered = prev.filter(entry => entry.userId !== user.id)
      const updated = [...filtered, leaderboardEntry]
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((entry, index) => ({ ...entry, position: index + 1 }))
      
      localStorage.setItem(STORAGE_KEY_GLOBAL_LEADERBOARD, JSON.stringify(updated))
      return updated
    })

    // Update season leaderboard
    setSeasonLeaderboard(prev => {
      const filtered = prev.filter(entry => entry.userId !== user.id)
      const updated = [...filtered, leaderboardEntry]
        .sort((a, b) => b.seasonPoints - a.seasonPoints)
        .map((entry, index) => ({ ...entry, position: index + 1 }))
      
      return updated
    })
  }

  const awardPoints = async (action: keyof PointsConfig, description?: string): Promise<boolean> => {
    if (!user || !userPoints) return false

    // Check rate limiting
    if (isRateLimited(action)) {
      console.warn(`Rate limited: ${action}`)
      return false
    }

    const pointsToAward = POINTS_CONFIG[action]
    if (!pointsToAward) return false

    // Update last action time
    setLastActionTimes(prev => ({ ...prev, [action]: Date.now() }))

    try {
      setLoading(true)
      
      const historyEntry: PointsHistoryEntry = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date(),
        action,
        points: pointsToAward,
        description
      }

      const updatedPoints: UserPoints = {
        ...userPoints,
        totalPoints: userPoints.totalPoints + pointsToAward,
        seasonPoints: {
          ...userPoints.seasonPoints,
          [currentSeason]: (userPoints.seasonPoints[currentSeason] || 0) + pointsToAward
        },
        pointHistory: [historyEntry, ...userPoints.pointHistory].slice(0, 100) // Keep last 100 entries
      }

      // Update rank if necessary
      const newRank = calculateRank(updatedPoints.totalPoints)
      if (newRank.key !== userPoints.currentRank.key) {
        updatedPoints.currentRank = newRank
      }

      const success = await saveUserPoints(updatedPoints)
      
      if (success) {
        // Show notification
        showNotification(action, pointsToAward, description)
        
        // Check for new achievements
        await checkAchievements()
      }

      return success
    } catch (error) {
      console.error('Error awarding points:', error)
      setError('Failed to award points')
      return false
    } finally {
      setLoading(false)
    }
  }

  const calculateRank = (totalPoints: number): UserRank => {
    const rank = RANKS_CONFIG
      .slice()
      .reverse()
      .find(rank => totalPoints >= rank.minPoints) || RANKS_CONFIG[0]

    return {
      key: rank.key,
      minPoints: rank.minPoints,
      currentPoints: totalPoints
    }
  }

  const updateUserRank = async (): Promise<void> => {
    if (!userPoints) return

    const newRank = calculateRank(userPoints.totalPoints)
    if (newRank.key !== userPoints.currentRank.key) {
      const updatedPoints = {
        ...userPoints,
        currentRank: newRank
      }
      await saveUserPoints(updatedPoints)
    }
  }

  const checkAchievements = async (): Promise<Achievement[]> => {
    if (!user || !userPoints) return []

    const newlyUnlocked: Achievement[] = []

    for (const achievement of ACHIEVEMENTS_CONFIG) {
      if (userPoints.achievementsUnlocked.includes(achievement.key)) continue

      let shouldUnlock = false

      // Check points requirement
      if (achievement.requiredPoints && userPoints.totalPoints >= achievement.requiredPoints) {
        shouldUnlock = true
      }

      // Check action requirements
      if (achievement.requiredActions) {
        shouldUnlock = achievement.requiredActions.every(requirement => {
          const actionCount = userPoints.pointHistory
            .filter(entry => entry.action === requirement.action)
            .length
          return actionCount >= requirement.count
        })
      }

      if (shouldUnlock) {
        newlyUnlocked.push({
          ...achievement,
          unlocked: true,
          unlockedDate: new Date()
        })

        // Add to user's unlocked achievements
        const updatedPoints = {
          ...userPoints,
          achievementsUnlocked: [...userPoints.achievementsUnlocked, achievement.key]
        }
        await saveUserPoints(updatedPoints)
      }
    }

    return newlyUnlocked
  }

  const getLeaderboard = (filter: LeaderboardFilter): N64FanLeaderboardEntry[] => {
    const sourceBoard = filter.timeframe === 'season' ? seasonLeaderboard : globalLeaderboard
    
    let filtered = sourceBoard

    // Apply region filter
    if (filter.region) {
      filtered = filtered.filter(entry => entry.region === filter.region)
    }

    // Apply platform filter
    if (filter.platform) {
      filtered = filtered.filter(entry => entry.platform === filter.platform)
    }

    // Apply type filter (friends filter would require additional implementation)
    if (filter.type === 'friends') {
      // This would require a friends system - for now, return empty array
      filtered = []
    }

    return filtered
  }

  const getUserPosition = (userId: string, filter: LeaderboardFilter): number => {
    const leaderboard = getLeaderboard(filter)
    const entry = leaderboard.find(entry => entry.userId === userId)
    return entry?.position || 0
  }

  const startNewSeason = async (): Promise<void> => {
    const now = new Date()
    const newSeasonKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    
    // Award medals for current season before starting new one
    await awardSeasonMedals()
    
    setCurrentSeason(newSeasonKey)
    localStorage.setItem(STORAGE_KEY_CURRENT_SEASON, newSeasonKey)
    
    // Reset season leaderboard
    setSeasonLeaderboard([])
  }

  const awardSeasonMedals = async (): Promise<void> => {
    if (seasonLeaderboard.length === 0) return

    const topPlayers = seasonLeaderboard.slice(0, 3)
    
    for (let i = 0; i < topPlayers.length; i++) {
      const player = topPlayers[i]
      const medalConfig = MEDALS_CONFIG[i]
      
      if (medalConfig && player.userId === user?.id && userPoints) {
        const medal: UserMedal = {
          id: `${currentSeason}_${medalConfig.place}`,
          season: currentSeason,
          rank: medalConfig.place,
          medalKey: medalConfig.key,
          bonusXP: medalConfig.bonusXP,
          awardedDate: new Date()
        }

        const updatedPoints = {
          ...userPoints,
          medals: [...userPoints.medals, medal],
          totalPoints: userPoints.totalPoints + medalConfig.bonusXP
        }

        await saveUserPoints(updatedPoints)
      }
    }
  }

  const contextValue: PointsContextType = {
    userPoints,
    globalLeaderboard,
    seasonLeaderboard,
    pointsConfig: POINTS_CONFIG,
    ranksConfig: RANKS_CONFIG,
    achievementsConfig: ACHIEVEMENTS_CONFIG,
    medalsConfig: MEDALS_CONFIG,
    awardPoints,
    updateUserRank,
    checkAchievements,
    getLeaderboard,
    getUserPosition,
    currentSeason,
    startNewSeason,
    awardSeasonMedals,
    loading,
    error
  }

  return (
    <PointsContext.Provider value={contextValue}>
      {children}
      
      {/* Render notifications */}
      {notifications.map(notification => (
        <PointsNotification
          key={notification.id}
          action={notification.action}
          points={notification.points}
          description={notification.description}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </PointsContext.Provider>
  )
}

export const usePoints = () => {
  const context = useContext(PointsContext)
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider')
  }
  return context
}