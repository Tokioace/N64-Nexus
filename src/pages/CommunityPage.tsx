/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { logger } from '../lib/logger'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useLanguage, getLocaleString } from '../contexts/LanguageContext'
import { User } from '../types'
import { Users, Trophy, Package, Star, Search } from 'lucide-react'
import AuthGuard from '../components/AuthGuard'

const CommunityPage: React.FC = () => {
  const { getAllUsers } = useUser()
  const { t, currentLanguage } = useLanguage()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [platformFilter, setPlatformFilter] = useState<'all' | 'N64' | 'PC'>('all')
  const [regionFilter, setRegionFilter] = useState<'all' | 'PAL' | 'NTSC'>('all')
  const [sortBy, setSortBy] = useState<'level' | 'xp' | 'collections' | 'records' | 'joinDate'>('level')

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await getAllUsers()
        setUsers(allUsers)
      } catch (error) {
        logger.error('Error loading users:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [getAllUsers])

  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesPlatform = platformFilter === 'all' || user.platform === platformFilter
      const matchesRegion = regionFilter === 'all' || user.region === regionFilter
      return matchesSearch && matchesPlatform && matchesRegion
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'level':
          return b.level - a.level
        case 'xp':
          return b.xp - a.xp
        case 'collections':
          return b.collections.filter(c => !c.isWishlist).length - a.collections.filter(c => !c.isWishlist).length
        case 'records':
          return b.personalRecords.filter(r => r.verified).length - a.personalRecords.filter(r => r.verified).length
        case 'joinDate':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <div className="container-lg py-responsive">
        <div className="simple-tile text-center py-8 sm:py-12">
          <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-responsive-sm text-slate-400">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-lg py-responsive space-responsive responsive-max-width responsive-overflow-hidden">
      {/* Header */}
      <div className="text-center mb-responsive responsive-max-width">
        <Users className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-400 mx-auto mb-4" />
        <h1 className="text-responsive-2xl font-bold text-slate-100 mb-2 responsive-word-break">
          {t('community.title')}
        </h1>
        <p className="text-responsive-base text-slate-400 max-w-2xl mx-auto responsive-word-break px-2">
          {t('community.subtitle')}
        </p>
      </div>

      {/* Stats */}
      <div className="simple-tile mb-responsive responsive-max-width">
        <div className="grid grid-responsive grid-2-4 gap-responsive">
          <div className="text-center p-3 sm:p-4 bg-slate-700/30 rounded-lg">
            <div className="text-responsive-lg font-bold text-blue-400">{users.length}</div>
            <div className="text-responsive-xs text-slate-400">{t('community.members')}</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-slate-700/30 rounded-lg">
            <div className="text-responsive-lg font-bold text-green-400">
              {users.reduce((sum, user) => sum + user.collections.filter(c => !c.isWishlist).length, 0)}
            </div>
            <div className="text-responsive-xs text-slate-400">{t('community.games')}</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-slate-700/30 rounded-lg">
            <div className="text-responsive-lg font-bold text-purple-400">
              {users.reduce((sum, user) => sum + user.personalRecords.filter(r => r.verified).length, 0)}
            </div>
            <div className="text-responsive-xs text-slate-400">{t('community.records')}</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-slate-700/30 rounded-lg">
            <div className="text-responsive-lg font-bold text-yellow-400">
              {Math.round(users.reduce((sum, user) => sum + user.level, 0) / users.length)}
            </div>
            <div className="text-responsive-xs text-slate-400">Ø Level</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="simple-tile">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              <input
                type="text"
                placeholder={t('placeholder.searchPlayers')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-responsive-sm"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-responsive-sm"
            >
              <option value="all">{t('community.allPlatforms')}</option>
              <option value="N64">N64</option>
              <option value="PC">PC</option>
            </select>

            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-responsive-sm"
            >
              <option value="all">{t('community.allRegions')}</option>
              <option value="PAL">PAL</option>
              <option value="NTSC">NTSC</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-responsive-sm"
            >
              <option value="level">{t('community.sortByLevel')}</option>
              <option value="xp">{t('community.sortByXP')}</option>
              <option value="collections">{t('community.sortByCollection')}</option>
              <option value="records">{t('community.sortByRecords')}</option>
              <option value="joinDate">{t('community.sortByJoinDate')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid - Protected by AuthGuard */}
      <AuthGuard 
        fallback={
          <div className="simple-tile text-center py-12">
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              {t('community.loginToViewProfiles')}
            </h3>
          </div>
        }
      >
        {filteredAndSortedUsers.length === 0 ? (
          <div className="simple-tile text-center py-8 sm:py-12">
            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-responsive-lg font-semibold text-slate-300 mb-2">
              {t('community.noPlayersFound')}
            </h3>
            <p className="text-responsive-sm text-slate-400">
              {t('community.tryOtherFilters')}
            </p>
          </div>
        ) : (
          <div className="grid grid-responsive grid-1-2-3 gap-responsive">
            {filteredAndSortedUsers.map((user) => (
              <Link
                key={user.id}
                to={`/profile/${user.id}`}
                className="simple-tile hover:border-blue-500/50 transition-all hover:scale-[1.02]"
              >
                {/* User Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg sm:text-2xl">
                    {user.avatar || '🎮'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-responsive-base font-bold text-slate-100 mb-1 truncate">
                      {user.username}
                    </h3>
                    <div className="flex items-center gap-2 text-responsive-xs flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.platform === 'N64' 
                          ? 'text-blue-400 bg-blue-400/20' 
                          : 'text-green-400 bg-green-400/20'
                      }`}>
                        {user.platform}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.region === 'PAL' 
                          ? 'text-purple-400 bg-purple-400/20' 
                          : 'text-orange-400 bg-orange-400/20'
                      }`}>
                        {user.region}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                      <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-bold text-responsive-sm">{user.level}</span>
                    </div>
                    <div className="text-responsive-xs text-slate-400">{t('profile.level')}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                      <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-bold text-responsive-sm">{user.collections.filter(c => !c.isWishlist).length}</span>
                    </div>
                    <div className="text-responsive-xs text-slate-400">{t('community.games')}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-bold text-responsive-sm">{user.personalRecords.filter(r => r.verified).length}</span>
                    </div>
                    <div className="text-responsive-xs text-slate-400">{t('community.records')}</div>
                  </div>
                </div>

                {/* Bio Preview */}
                {user.bio && (
                  <p className="text-responsive-sm text-slate-300 mb-4 overflow-hidden line-clamp-2">
                    {user.bio}
                  </p>
                )}

                {/* Join Date */}
                <div className="text-responsive-xs text-slate-500">
                  {t('profile.joinDate')} {user.joinDate.toLocaleDateString(getLocaleString(currentLanguage), { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>

                {/* Recent Activity Preview */}
                {user.personalRecords.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="text-responsive-xs text-slate-400 mb-1">{t('community.recentRecord')}</div>
                    <div className="text-responsive-sm text-slate-200 truncate">
                      {user.personalRecords[user.personalRecords.length - 1].gameName}
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </AuthGuard>

      {/* Load More Button (for future pagination) */}
      {filteredAndSortedUsers.length >= 20 && (
        <div className="text-center">
          <button className="btn-secondary mobile-full sm:w-auto">
            {t('common.viewAll')}
          </button>
        </div>
      )}
    </div>
  )
}

export default CommunityPage