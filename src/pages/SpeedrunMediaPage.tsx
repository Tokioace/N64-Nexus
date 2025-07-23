import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'
import { Play, Camera, Video, Upload, Eye, Heart, MessageSquare, Clock, Trophy, User, Filter, Grid, List } from 'lucide-react'
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
  comments: number
  uploadDate: Date
  isLive?: boolean
}

const SpeedrunMediaPage: React.FC = () => {
  const { t } = useLanguage()
  const { isAuthenticated } = useUser()
  const [selectedType, setSelectedType] = useState<'all' | 'video' | 'stream' | 'photo'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Mock data - in a real app this would come from an API
  const mediaItems: MediaItem[] = [
    {
      id: '1',
      title: 'Mario 64 16 Star WR Attempt',
      type: 'video',
      creator: 'SpeedRunner64',
      game: 'Super Mario 64',
      category: '16 Star',
      time: '15:42.89',
      thumbnailUrl: '/api/placeholder/320/180',
      mediaUrl: '/videos/mario64-16star.mp4',
      views: 12543,
      likes: 892,
      comments: 156,
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
      comments: 89,
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
      comments: 23,
      uploadDate: new Date('2024-01-18')
    },
    {
      id: '4',
      title: 'Mario Kart 64 Three Lap Challenge',
      type: 'video',
      creator: 'KartSpeedster',
      game: 'Mario Kart 64',
      category: '3 Lap',
      time: '5:54.12',
      thumbnailUrl: '/api/placeholder/320/180',
      mediaUrl: '/videos/mk64-3lap.mp4',
      views: 8765,
      likes: 567,
      comments: 98,
      uploadDate: new Date('2024-01-17')
    },
    {
      id: '5',
      title: 'Star Fox 64 Expert Mode Run',
      type: 'video',
      creator: 'ArwingPilot',
      game: 'Star Fox 64',
      category: 'Expert',
      time: '23:15.67',
      thumbnailUrl: '/api/placeholder/320/180',
      mediaUrl: '/videos/starfox-expert.mp4',
      views: 4532,
      likes: 298,
      comments: 67,
      uploadDate: new Date('2024-01-16')
    },
    {
      id: '6',
      title: 'DK64 101% Marathon Stream',
      type: 'stream',
      creator: 'BananaCollector',
      game: 'Donkey Kong 64',
      category: '101%',
      time: '8:42:33',
      thumbnailUrl: '/api/placeholder/320/180',
      mediaUrl: '/streams/dk64-101.m3u8',
      views: 15432,
      likes: 1234,
      comments: 456,
      uploadDate: new Date('2024-01-15'),
      isLive: false
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
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
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

      {/* Filters and View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-slate-800/50 rounded-lg">
        <div className="flex flex-wrap items-center gap-4">
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

        {/* View Mode Toggle */}
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              viewMode === 'grid' 
                ? 'bg-slate-700 text-slate-100' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              viewMode === 'list' 
                ? 'bg-slate-700 text-slate-100' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-4 h-4" />
            List
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-slate-400">
          {filteredItems.length} {t('speedrun.mediaItemsFound')}
        </p>
      </div>

      {/* Media Content - Protected by AuthGuard */}
      <AuthGuard 
        customMessage={t('speedrun.loginToViewMedia')}
        className="min-h-[500px]"
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="n64-tile bg-slate-800/50 hover:bg-slate-800/70 transition-colors">
                <div className="relative aspect-video bg-slate-700 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Type Badge */}
                  <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 ${getTypeColor(item.type)} text-white text-xs rounded-full`}>
                    {getTypeIcon(item.type)}
                    {item.type.toUpperCase()}
                  </div>
                  
                  {/* Live Badge */}
                  {item.isLive && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      LIVE
                    </div>
                  )}
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-100 text-lg mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {item.creator}
                    </p>
                    <p className="text-slate-500 text-xs">{item.game} • {item.category}</p>
                    {item.time && (
                      <p className="text-blue-400 text-sm font-mono flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.time}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{item.comments}</span>
                      </div>
                    </div>
                    <span className="text-xs">
                      {item.uploadDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map(item => (
              <div key={item.id} className="n64-tile bg-slate-800/50 hover:bg-slate-800/70 transition-colors">
                <div className="flex gap-4">
                  <div className="relative w-48 h-28 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.thumbnailUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Type Badge */}
                    <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 ${getTypeColor(item.type)} text-white text-xs rounded-full`}>
                      {getTypeIcon(item.type)}
                      {item.type.toUpperCase()}
                    </div>
                    
                    {/* Live Badge */}
                    {item.isLive && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        LIVE
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-bold text-slate-100 text-lg">{item.title}</h3>
                      <p className="text-slate-400 text-sm flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {item.creator} • {item.game} • {item.category}
                      </p>
                      {item.time && (
                        <p className="text-blue-400 text-sm font-mono flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.time}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{item.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{item.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{item.comments}</span>
                        </div>
                      </div>
                      <span className="text-xs">
                        {item.uploadDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              {t('speedrun.noMediaFound')}
            </h3>
            <p className="text-slate-500">
              {t('speedrun.noMediaDescription')}
            </p>
          </div>
        )}
      </AuthGuard>
    </div>
  )
}

export default SpeedrunMediaPage