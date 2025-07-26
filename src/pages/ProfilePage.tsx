import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { User } from '../types'
import UserCollectionManager from '../components/UserCollectionManager'
import PersonalRecordsManager from '../components/PersonalRecordsManager'
import PointsOverview from '../components/PointsOverview'
import AchievementsPanel from '../components/AchievementsPanel'
import { 
  User as UserIcon, 
  Trophy, 
  Gamepad2, 
  Calendar,
  MapPin,
  Edit,
  Medal,
  Target,
  Clock,
  Package,
  Star,
  LogIn,
  Globe,
  ArrowLeft,
  Award,
  Crown
} from 'lucide-react'

interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
}

interface GameStats {
  game: string
  bestTime: string
  completions: number
  personalBest: boolean
}

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const { user, isAuthenticated, getUserProfile } = useUser()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'points' | 'achievements' | 'stats' | 'collection' | 'records'>('overview')
  const [isEditing, setIsEditing] = useState(false)

  const isOwnProfile = Boolean(!userId || (user && userId === user.id))

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }
  }, [isAuthenticated, navigate])

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) return
      
      if (isOwnProfile) {
        setProfileUser(user)
      } else if (userId) {
        setLoading(true)
        try {
          const fetchedUser = await getUserProfile(userId)
          if (fetchedUser) {
            setProfileUser(fetchedUser)
          } else {
            navigate('/profile') // Redirect to own profile if user not found
          }
        } catch (error) {
          console.error('Error loading profile:', error)
          navigate('/profile')
        } finally {
          setLoading(false)
        }
      }
    }

    loadProfile()
  }, [userId, user, isOwnProfile, isAuthenticated, getUserProfile, navigate])

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="simple-tile text-center py-12">
          <LogIn className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            {t('auth.loginRequired')}
          </h2>
          <p className="text-slate-400 mb-6">
            {t('auth.loginRequiredMessage')}
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <LogIn className="w-5 h-5" />
            {t('auth.login')}
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="simple-tile text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="simple-tile text-center py-12">
          <UserIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            {t('error.notFound')}
          </h2>
          <p className="text-slate-400 mb-6">
            {t('error.generic')}
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Zu meinem Profil
          </Link>
        </div>
      </div>
    )
  }

  const achievements: Achievement[] = [
    {
      id: 1,
      name: t('achievement.speedrunMaster'),
      description: t('achievement.speedrunMasterDesc'),
      icon: "🏃‍♂️",
      earned: profileUser.personalRecords.length >= 5,
      earnedDate: "15. Juli 2024"
    },
    {
      id: 2,
      name: t('achievement.communityHero'),
      description: t('achievement.profilePublic'),
      icon: "👥",
      earned: profileUser.isPublic,
      earnedDate: "10. Juli 2024"
    },
    {
      id: 3,
      name: t('achievement.collector'),
      description: t('achievement.gamesAdded'),
      icon: "📦",
      earned: profileUser.collections.filter(c => !c.isWishlist).length >= 10,
      earnedDate: "5. Juli 2024"
    },
    {
      id: 4,
              name: t('achievement.eventChampionName'),
      description: t('achievement.eventChampion'),
      icon: "🏆",
      earned: false
    },
    {
      id: 5,
      name: t('achievement.recordHolder'),
      description: t('achievement.recordHolderDesc'),
      icon: "⭐",
      earned: profileUser.personalRecords.filter(r => r.verified).length >= 5,
      earnedDate: profileUser.personalRecords.filter(r => r.verified).length >= 5 ? t('achievement.today') : undefined
    }
  ]

  const gameStats: GameStats[] = [
    {
      game: "Super Mario 64",
      bestTime: "16:42",
      completions: 8,
      personalBest: true
    },
    {
      game: "Zelda: Ocarina of Time",
      bestTime: "4:23:15",
      completions: 3,
      personalBest: false
    },
    {
      game: "Mario Kart 64",
      bestTime: "2:08:45",
      completions: 12,
      personalBest: false
    }
  ]

  return (
    <div className="container-lg py-responsive space-responsive responsive-max-width responsive-overflow-hidden">
      {/* Back Button for Other Profiles */}
      {!isOwnProfile && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Zurück
          </button>
        </div>
      )}

      {/* Profile Header */}
      <div className="simple-tile p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
            {profileUser.avatar || '🎮'}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 truncate">
                {profileUser.username}
              </h1>
              <div className="flex items-center gap-2 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  profileUser.platform === 'N64' 
                    ? 'text-blue-400 bg-blue-400/20' 
                    : 'text-green-400 bg-green-400/20'
                }`}>
                  {profileUser.platform}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  profileUser.region === 'PAL' 
                    ? 'text-purple-400 bg-purple-400/20' 
                    : 'text-orange-400 bg-orange-400/20'
                }`}>
                  {profileUser.region}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-400 mb-4 text-sm">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{t('profile.level')} {profileUser.level}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{profileUser.xp.toLocaleString()} XP</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{t('profile.joinDate')} {profileUser.joinDate.toLocaleDateString()}</span>
              </div>
              {profileUser.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{profileUser.location}</span>
                </div>
              )}
            </div>

            {profileUser.bio && (
              <p className="text-slate-300 mb-4 text-sm sm:text-base">
                {profileUser.bio}
              </p>
            )}

            {/* Quick Stats */}
            <div className="flex gap-4 sm:gap-6 text-sm">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-blue-400">
                  {profileUser.collections.filter(c => !c.isWishlist).length}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm">{t('profile.collection')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-green-400">
                  {profileUser.personalRecords.filter(r => r.verified).length}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm">{t('profile.records')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-purple-400">
                  {achievements.filter(a => a.earned).length}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm">{t('profile.achievements')}</div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          {isOwnProfile && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-slate-300 hover:text-slate-100 hover:bg-slate-700 rounded-lg transition-colors text-sm flex-shrink-0"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Bearbeiten</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800 rounded-lg p-1 overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('profile.overview')}
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className={`py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'points'
                ? 'bg-yellow-500 text-slate-900 shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t('profile.pointsOverview')}</span>
              <span className="sm:hidden">Points</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'achievements'
                ? 'bg-yellow-500 text-slate-900 shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t('profile.achievements.title')}</span>
              <span className="sm:hidden">Awards</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('collection')}
            className={`py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'collection'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="hidden sm:inline">{t('profile.collection')}</span>
            <span className="sm:hidden">Games</span>
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'records'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="hidden sm:inline">{t('profile.records')}</span>
            <span className="sm:hidden">Records</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'stats'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="hidden sm:inline">{t('profile.statistics')}</span>
            <span className="sm:hidden">Stats</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Points Overview */}
            <div className="simple-tile p-6">
              <PointsOverview compact={true} showHistory={false} />
            </div>

            {/* Recent Achievements */}
            <div className="simple-tile p-6">
              <AchievementsPanel compact={true} showProgress={false} />
            </div>

            {/* Recent Achievements (Legacy) */}
            <div className="simple-tile p-6">
              <h3 className="text-xl font-bold text-slate-100 mb-4">
                {t('profile.achievements')}
              </h3>
              <div className="space-y-3">
                {achievements.filter(a => a.earned).slice(0, 3).map(achievement => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-100">
                        {achievement.name}
                      </div>
                      <div className="text-sm text-slate-400">
                        {achievement.description}
                      </div>
                      {achievement.earnedDate && (
                        <div className="text-xs text-slate-500">
                          {achievement.earnedDate}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Records */}
            <div className="simple-tile p-6">
              <h3 className="text-xl font-bold text-slate-100 mb-4">
                {t('profile.records')}
              </h3>
              <div className="space-y-3">
                {profileUser.personalRecords.slice(0, 3).map(record => (
                  <div key={record.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl">
                      {record.time ? '⏱️' : '🎯'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-100">
                        {record.gameName}
                      </div>
                      <div className="text-sm text-slate-400">
                        {record.category}
                      </div>
                      <div className="text-sm text-blue-400">
                        {record.time || `${record.score?.toLocaleString()} ${t('profile.points')}`}
                      </div>
                    </div>
                    {record.verified && (
                      <div className="text-green-400">
                        <Trophy className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'collection' && (
          <UserCollectionManager isOwnProfile={isOwnProfile} />
        )}

        {activeTab === 'records' && (
          <PersonalRecordsManager isOwnProfile={isOwnProfile} />
        )}

        {activeTab === 'points' && (
          <PointsOverview />
        )}

        {activeTab === 'achievements' && (
          <AchievementsPanel />
        )}

        {activeTab === 'stats' && (
          <div className="simple-tile p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-6">
              {t('profile.statistics')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="font-bold text-slate-100 mb-3">Collection Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Games:</span>
                    <span className="text-slate-100">{profileUser?.collections?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Personal Records:</span>
                    <span className="text-slate-100">{profileUser?.personalRecords?.length || 0}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="font-bold text-slate-100 mb-3">Activity Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Profile Created:</span>
                    <span className="text-slate-100">
                      {profileUser?.joinDate ? new Date(profileUser.joinDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Region:</span>
                    <span className="text-slate-100">{profileUser?.region || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="simple-tile p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-6">
              Spiel-Statistiken
            </h3>
            <div className="space-y-4">
              {gameStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="font-medium text-slate-100">
                        {stat.game}
                      </div>
                      <div className="text-sm text-slate-400">
                        {stat.completions} Durchläufe
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${stat.personalBest ? 'text-yellow-400' : 'text-slate-300'}`}>
                      {stat.bestTime}
                    </div>
                    {stat.personalBest && (
                      <div className="text-xs text-yellow-400">
                        Persönliche Bestzeit
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage