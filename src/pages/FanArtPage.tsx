import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'
import { Palette, Heart, Eye, MessageSquare, Upload, Filter, Grid, List } from 'lucide-react'

interface FanArtItem {
  id: string
  title: string
  artist: string
  imageUrl: string
  likes: number
  views: number
  comments: number
  tags: string[]
  createdAt: Date
  game: string
}

const FanArtPage: React.FC = () => {
  const { t } = useLanguage()
  const { user, isAuthenticated } = useUser()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Mock fan art data
  const fanArtItems: FanArtItem[] = [
    {
      id: '1',
      title: 'Mario 64 Castle Reimagined',
      artist: 'PixelMaster64',
      imageUrl: '/api/placeholder/300/200',
      likes: 142,
      views: 1205,
      comments: 23,
      tags: ['Mario', 'Castle', 'Digital Art'],
      createdAt: new Date('2024-01-15'),
      game: 'Super Mario 64'
    },
    {
      id: '2',
      title: 'Link in Hyrule Field',
      artist: 'ZeldaFan98',
      imageUrl: '/api/placeholder/300/200',
      likes: 89,
      views: 756,
      comments: 15,
      tags: ['Zelda', 'Link', 'Landscape'],
      createdAt: new Date('2024-01-14'),
      game: 'The Legend of Zelda: Ocarina of Time'
    },
    {
      id: '3',
      title: 'GoldenEye Facility',
      artist: 'SpyArtist',
      imageUrl: '/api/placeholder/300/200',
      likes: 67,
      views: 432,
      comments: 8,
      tags: ['GoldenEye', 'Facility', '3D'],
      createdAt: new Date('2024-01-13'),
      game: 'GoldenEye 007'
    },
    {
      id: '4',
      title: 'Donkey Kong Country Jungle',
      artist: 'JungleDrawer',
      imageUrl: '/api/placeholder/300/200',
      likes: 156,
      views: 923,
      comments: 31,
      tags: ['DK', 'Jungle', 'Nature'],
      createdAt: new Date('2024-01-12'),
      game: 'Donkey Kong 64'
    },
    {
      id: '5',
      title: 'Star Fox Arwing Squadron',
      artist: 'SpacePilot',
      imageUrl: '/api/placeholder/300/200',
      likes: 98,
      views: 645,
      comments: 19,
      tags: ['Star Fox', 'Arwing', 'Space'],
      createdAt: new Date('2024-01-11'),
      game: 'Star Fox 64'
    },
    {
      id: '6',
      title: 'Mario Kart 64 Rainbow Road',
      artist: 'RainbowRacer',
      imageUrl: '/api/placeholder/300/200',
      likes: 203,
      views: 1456,
      comments: 42,
      tags: ['Mario Kart', 'Rainbow Road', 'Racing'],
      createdAt: new Date('2024-01-10'),
      game: 'Mario Kart 64'
    }
  ]

  const categories = [
    { id: 'all', name: t('fanart.allCategories') },
    { id: 'mario', name: 'Super Mario 64' },
    { id: 'zelda', name: 'Zelda: OoT' },
    { id: 'goldeneye', name: 'GoldenEye 007' },
    { id: 'mariokart', name: 'Mario Kart 64' },
    { id: 'starfox', name: 'Star Fox 64' },
    { id: 'dk', name: 'Donkey Kong 64' }
  ]

  const filteredItems = selectedCategory === 'all' 
    ? fanArtItems 
    : fanArtItems.filter(item => 
        item.game.toLowerCase().includes(selectedCategory) ||
        item.tags.some(tag => tag.toLowerCase().includes(selectedCategory))
      )

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Palette className="w-8 h-8 text-rose-400" />
          <h1 className="text-3xl font-bold text-slate-100">
            {t('nav.fanart')}
          </h1>
        </div>
        <p className="text-slate-400 text-lg mb-6">
          {t('fanart.subtitle')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {isAuthenticated && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 
                         text-white rounded-lg transition-colors font-medium"
            >
              <Upload className="w-5 h-5" />
              {t('fanart.uploadArt')}
            </button>
          )}

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
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-slate-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <span className="text-slate-300 font-medium">{t('fanart.filterBy')}:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-slate-400">
          {filteredItems.length} {t('fanart.artworksFound')}
        </p>
      </div>

      {/* Fan Art Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="n64-tile bg-slate-800/50 hover:bg-slate-800/70 transition-colors">
              <div className="aspect-video bg-slate-700 rounded-lg mb-4 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-slate-100 text-lg mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm">by {item.artist}</p>
                  <p className="text-slate-500 text-xs">{item.game}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-slate-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{item.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{item.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{item.comments}</span>
                    </div>
                  </div>
                  <span className="text-xs">
                    {item.createdAt.toLocaleDateString()}
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
                <div className="w-32 h-20 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-bold text-slate-100 text-lg">{item.title}</h3>
                    <p className="text-slate-400 text-sm">by {item.artist} • {item.game}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{item.comments}</span>
                      </div>
                    </div>
                    <span className="text-xs">
                      {item.createdAt.toLocaleDateString()}
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
          <Palette className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            {t('fanart.noArtworksFound')}
          </h3>
          <p className="text-slate-500">
            {t('fanart.noArtworksDescription')}
          </p>
        </div>
      )}

      {/* Upload Modal Placeholder */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-slate-100 mb-4">
              {t('fanart.uploadArt')}
            </h3>
            <p className="text-slate-400 mb-6">
              {t('fanart.uploadDescription')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
              >
                {t('common.upload')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FanArtPage