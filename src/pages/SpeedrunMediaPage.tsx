import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'
import { Camera, Video, Upload, Play, Eye, Heart, Clock, Trophy, Filter } from 'lucide-react'
import AuthGuard from '../components/AuthGuard'

interface MediaItem {
  id: string
  title: string
  type: 'video' | 'stream' | 'photo'
  creator: string
  game: string
  category: string
  time?: string
  thumbnailUrl: string
  mediaUrl: string
  views: number
  likes: number
  uploadDate: Date
  isLive?: boolean
}

const SpeedrunMediaPage: React.FC = () => {
  const { t } = useLanguage()
  const { isAuthenticated } = useUser()
  const [selectedType, setSelectedType] = useState<'all' | 'video' | 'stream' | 'photo'>('all')
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Mock data - in a real app this would come from an API
  const mediaItems: MediaItem[] = [
    {
      id: '1',
      title: 'Super Mario 64 120 Star WR Attempt',
      type: 'video',
      creator: 'SpeedrunMaster',
      game: 'Super Mario 64',
      category: '120 Star',
      time: '1:38:54',
      thumbnailUrl: '/api/placeholder/320/180',
      mediaUrl: '/videos/sm64-120star.mp4',
      views: 12543,
      likes: 892,
      uploadDate: new Date('2024-01-20')
    },
    {
      id: '2',
      title: 'OoT Any% Speedrun Practice',
      type: 'stream',
      creator: 'ZeldaMaster',
      game: 'Zelda: Ocarina of Time',
      category: 'Any%',
      time: '17:23.45',
      thumbnailUrl: '/api/placeholder/320/180',
      mediaUrl: '/streams/oot-practice.m3u8',
      views: 3421,
      likes: 234,
      uploadDate: new Date('2024-01-19'),
      isLive: true
    },
    {
      id: '3',
      title: 'GoldenEye Setup Screenshots',
      type: 'photo',
      creator: 'GoldenRunner',
      game: 'GoldenEye 007',
      category: 'Agent',
      thumbnailUrl: '/api/placeholder/320/180',
      mediaUrl: '/images/goldeneye-setup.jpg',
      views: 1876,
      likes: 143,
      uploadDate: new Date('2024-01-18')
    }
  ]

  const filteredItems = selectedType === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.type === selectedType)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />
      case 'stream': return <Play className="w-4 h-4" />
      case 'photo': return <Camera className="w-4 h-4" />
      default: return <Video className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-600'
      case 'stream': return 'bg-red-600'
      case 'photo': return 'bg-green-600'
      default: return 'bg-slate-600'
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-slate-100">
            {t('nav.speedrun')}
          </h1>
        </div>
        <p className="text-slate-400 text-lg mb-6">
          {t('speedrun.mediaDescription')}
        </p>

        {/* Upload Button */}
        <div className="flex justify-center mb-6">
          {isAuthenticated ? (
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <Upload className="w-5 h-5" />
              {t('speedrun.uploadMedia')}
            </button>
          ) : (
            <AuthGuard 
              requireAuth={true}
              blurContent={false}
              showLoginPrompt={true}
              customMessage={t('speedrun.loginToUpload')}
              className="inline-block"
            >
              <button
                disabled
                className="flex items-center gap-2 px-6 py-3 bg-slate-600 cursor-not-allowed text-slate-400 rounded-lg transition-colors font-medium"
              >
                <Upload className="w-5 h-5" />
                {t('speedrun.uploadMedia')}
              </button>
            </AuthGuard>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-slate-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <span className="text-slate-300 font-medium">{t('common.filter')}:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', name: t('common.all'), icon: <Trophy className="w-4 h-4" /> },
            { id: 'video', name: t('speedrun.videos'), icon: <Video className="w-4 h-4" /> },
            { id: 'stream', name: t('speedrun.streams'), icon: <Play className="w-4 h-4" /> },
            { id: 'photo', name: t('speedrun.photos'), icon: <Camera className="w-4 h-4" /> }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {type.icon}
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-slate-400">
          {filteredItems.length} {t('speedrun.mediaItemsFound')}
        </p>
      </div>

      {/* Media Grid - Protected by AuthGuard */}
      <AuthGuard 
        customMessage={t('speedrun.loginToViewMedia')}
        className="min-h-[400px]"
      >
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              {t('speedrun.noMediaFound')}
            </h3>
            <p className="text-slate-400">
              {t('speedrun.tryDifferentFilters')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-750 transition-colors">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-slate-700">
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Type Badge */}
                  <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 ${getTypeColor(item.type)} text-white text-xs rounded-full`}>
                    {getTypeIcon(item.type)}
                    {item.type}
                  </div>
                  {/* Live Badge */}
                  {item.isLive && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-xs rounded-full animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      LIVE
                    </div>
                  )}
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-slate-100 mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 mb-2">{item.creator}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>{item.game}</span>
                    {item.time && <span>{item.time}</span>}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {item.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {item.likes}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {item.uploadDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AuthGuard>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-100">{t('speedrun.uploadMedia')}</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  ×
                </button>
              </div>
              
              <div className="text-center py-8">
                <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">
                  {t('speedrun.uploadComingSoon')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpeedrunMediaPage