import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Award, 
  Clock, 
  Users as UsersIcon, 
  Calendar,
  Trophy,
  Star,
  Gamepad2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Newspaper
} from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  content: string
  date: Date
  type: 'event_winner' | 'n64_history' | 'community_news' | 'event_announcement' | 'game_release' | 'update' | 'tournament'
  featured?: boolean
  imageUrl?: string
}

const NewsFeedPage: React.FC = () => {
  const { t } = useLanguage()
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Mock news data with multilingual support
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: t('news.luigiEvent'),
      content: t('news.luigiEventContent'),
      date: new Date(2025, 0, 20),
      type: 'event_announcement',
      featured: true
    },
    {
      id: '2',
      title: t('news.eventWinner'),
      content: t('news.eventWinnerContent'),
      date: new Date(2025, 0, 19),
      type: 'event_winner',
      featured: true
    },
    {
      id: '3',
      title: t('news.n64History'),
      content: t('news.n64HistoryContent'),
      date: new Date(2025, 0, 18),
      type: 'n64_history'
    },
    {
      id: '4',
      title: t('news.communityUpdate'),
      content: t('news.communityUpdateContent'),
      date: new Date(2025, 0, 17),
      type: 'community_news'
    },
    {
      id: '5',
      title: t('news.newFeatures'),
      content: t('news.newFeaturesContent'),
      date: new Date(2025, 0, 16),
      type: 'update'
    },
    {
      id: '6',
      title: t('news.tournamentAnnouncement'),
      content: t('news.tournamentAnnouncementContent'),
      date: new Date(2025, 0, 15),
      type: 'tournament'
    },
    {
      id: '7',
      title: t('news.gameSpotlight'),
      content: t('news.gameSpotlightContent'),
      date: new Date(2025, 0, 14),
      type: 'game_release'
    },
    {
      id: '8',
      title: t('news.weeklyChallenge'),
      content: t('news.weeklyChallengeContent'),
      date: new Date(2025, 0, 13),
      type: 'event_announcement'
    },
    {
      id: '9',
      title: t('news.speedrunRecord'),
      content: t('news.speedrunRecordContent'),
      date: new Date(2025, 0, 12),
      type: 'event_winner'
    },
    {
      id: '10',
      title: t('news.retroGaming'),
      content: t('news.retroGamingContent'),
      date: new Date(2025, 0, 11),
      type: 'n64_history'
    }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'event_winner':
        return <Award className="w-5 h-5 text-yellow-400" />
      case 'n64_history':
        return <Clock className="w-5 h-5 text-blue-400" />
      case 'community_news':
        return <UsersIcon className="w-5 h-5 text-green-400" />
      case 'event_announcement':
        return <Calendar className="w-5 h-5 text-purple-400" />
      case 'tournament':
        return <Trophy className="w-5 h-5 text-orange-400" />
      case 'update':
        return <Star className="w-5 h-5 text-cyan-400" />
      case 'game_release':
        return <Gamepad2 className="w-5 h-5 text-pink-400" />
      default:
        return <MessageSquare className="w-5 h-5 text-slate-400" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event_winner':
        return 'border-yellow-400 bg-yellow-600/10'
      case 'n64_history':
        return 'border-blue-400 bg-blue-600/10'
      case 'community_news':
        return 'border-green-400 bg-green-600/10'
      case 'event_announcement':
        return 'border-purple-400 bg-purple-600/10'
      case 'tournament':
        return 'border-orange-400 bg-orange-600/10'
      case 'update':
        return 'border-cyan-400 bg-cyan-600/10'
      case 'game_release':
        return 'border-pink-400 bg-pink-600/10'
      default:
        return 'border-slate-400 bg-slate-600/10'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Filter and search logic
  const filteredNews = newsItems.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage)

  const filterOptions = [
    { value: 'all', label: t('news.filter.all') },
    { value: 'event_announcement', label: t('news.filter.events') },
    { value: 'event_winner', label: t('news.filter.winners') },
    { value: 'tournament', label: t('news.filter.tournaments') },
    { value: 'community_news', label: t('news.filter.community') },
    { value: 'n64_history', label: t('news.filter.history') },
    { value: 'update', label: t('news.filter.updates') },
    { value: 'game_release', label: t('news.filter.games') }
  ]

  return (
    <div className="container-lg py-responsive space-responsive responsive-max-width responsive-overflow-hidden">
      {/* Header */}
      <div className="text-center mb-responsive responsive-max-width">
        <Newspaper className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500 mx-auto mb-4" />
        <h1 className="text-responsive-2xl font-bold text-slate-100 mb-2 responsive-word-break">
          {t('news.title')}
        </h1>
        <p className="text-responsive-base text-slate-400 max-w-2xl mx-auto responsive-word-break px-2">
          {t('news.subtitle')}
        </p>
      </div>

      {/* Search and Filter Bar */}
        <div className="bg-slate-800/50 rounded-lg p-6 mb-8 border border-slate-600/30">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('news.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-400 appearance-none"
                >
                  {filterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Featured News */}
        {currentPage === 1 && filteredNews.some(item => item.featured) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">
              ⭐ {t('news.featured')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {filteredNews.filter(item => item.featured).slice(0, 2).map((item) => (
                <div key={item.id} className={`p-6 rounded-lg border-l-4 ${getTypeColor(item.type)} backdrop-blur-sm`}>
                  <div className="flex items-center space-x-3 mb-4">
                    {getTypeIcon(item.type)}
                    <h3 className="text-xl font-bold text-slate-100">{item.title}</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">{item.content}</p>
                  <div className="flex justify-between items-center text-sm text-slate-400">
                    <span>{formatDate(item.date)}</span>
                    <span>{formatTime(item.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedNews.filter(item => !item.featured || currentPage > 1).map((item) => (
            <div key={item.id} className={`p-5 rounded-lg border-l-4 ${getTypeColor(item.type)} backdrop-blur-sm hover:bg-slate-700/20 transition-colors`}>
              <div className="flex items-center space-x-2 mb-3">
                {getTypeIcon(item.type)}
                <h3 className="text-lg font-semibold text-slate-100 line-clamp-2">{item.title}</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">{item.content}</p>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>{formatDate(item.date)}</span>
                <span>{formatTime(item.date)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              {t('news.noResults')}
            </h3>
            <p className="text-slate-400">
              {t('news.noResultsDescription')}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t('common.previous')}</span>
            </button>

            <span className="text-slate-300">
              {t('news.pagination').replace('{current}', currentPage.toString()).replace('{total}', totalPages.toString())}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>{t('common.next')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

    </div>
  )
}

export default NewsFeedPage