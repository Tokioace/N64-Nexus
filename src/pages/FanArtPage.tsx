import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'
import { usePoints } from '../contexts/PointsContext'
import { Palette, Heart, Eye, MessageSquare, Upload, Filter, Grid, List, Zap, X, Image as ImageIcon } from 'lucide-react'

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
  rating: number // Average rating (0-5)
  ratingCount: number // Number of ratings
  userRating?: number // Current user's rating
}

interface RatingDisplayProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ rating, size = 'md', showNumber = true }) => {
  const roundedRating = Math.ceil(rating) // Round up as requested
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Zap
            key={star}
            className={`${sizeClasses[size]} ${
              star <= roundedRating
                ? 'text-sky-400 fill-sky-400' // Light blue lightning bolts
                : 'text-slate-600'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-slate-400 text-sm ml-1">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  )
}

interface RatingInputProps {
  currentRating: number
  onRate: (rating: number) => void
  disabled?: boolean
}

const RatingInput: React.FC<RatingInputProps> = ({ currentRating, onRate, disabled = false }) => {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          disabled={disabled}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onRate(star)}
          className={`w-5 h-5 transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
        >
          <Zap
            className={`w-full h-full ${
              star <= (hoverRating || currentRating)
                ? 'text-sky-400 fill-sky-400'
                : 'text-slate-600 hover:text-sky-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

interface UploadModalProps {
  onClose: () => void
  onUpload: (artwork: FanArtItem) => void
  awardPoints: (action: keyof import('../types').PointsConfig, description?: string) => Promise<boolean>
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload, awardPoints }) => {
  const { t } = useLanguage()
  const { user } = useUser()
  const [title, setTitle] = useState('')
  const [selectedGame, setSelectedGame] = useState('')
  const [tags, setTags] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  const gameOptions = [
    'Super Mario 64',
    'The Legend of Zelda: Ocarina of Time',
    'GoldenEye 007',
    'Mario Kart 64',
    'Star Fox 64',
    'Donkey Kong 64',
    'Super Smash Bros.',
    'Mario Party',
    'Paper Mario',
    'Banjo-Kazooie'
  ]

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !selectedGame || !imageFile || !user) return

    setIsUploading(true)

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const newArtwork: FanArtItem = {
      id: Date.now().toString(),
      title,
      artist: user.username,
      imageUrl: imagePreview, // In a real app, this would be the uploaded image URL
      likes: 0,
      views: 1,
      comments: 0,
      rating: 0,
      ratingCount: 0,
      userRating: undefined,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date(),
      game: selectedGame
    }

    onUpload(newArtwork)
    
    // Award points for fanart upload
    try {
      await awardPoints('fanart.upload', `Fanart uploaded: ${title}`)
    } catch (error) {
      console.error('Failed to award points for fanart upload:', error)
    }
    
    setIsUploading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full overflow-y-auto" style={{ maxHeight: 'clamp(400px, 90vh, 800px)' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-100">
            {t('fanart.uploadArt')}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              {t('fanart.uploadImage')}
            </label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt={t('alt.preview')}
                    className="max-w-full max-h-48 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview('')
                    }}
                    className="text-rose-400 hover:text-rose-300 text-sm"
                  >
                    {t('common.remove')}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <ImageIcon className="w-12 h-12 text-slate-500 mx-auto" />
                  <div>
                    <label className="cursor-pointer">
                      <span className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg transition-colors">
                        {t('fanart.chooseImage')}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-slate-400 text-sm">
                    {t('fanart.imageFormats')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              {t('fanart.artworkTitle')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-rose-500 focus:outline-none"
              placeholder={t('fanart.titlePlaceholder')}
              required
            />
          </div>

          {/* Game Selection */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              {t('fanart.selectGame')}
            </label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-rose-500 focus:outline-none"
              required
            >
              <option value="">{t('fanart.chooseGame')}</option>
              {gameOptions.map(game => (
                <option key={game} value={game}>{game}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              {t('fanart.tags')}
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-rose-500 focus:outline-none"
              placeholder={t('fanart.tagsPlaceholder')}
            />
            <p className="text-slate-400 text-sm mt-1">
              {t('fanart.tagsHint')}
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
              disabled={isUploading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!title || !selectedGame || !imageFile || isUploading}
            >
              {isUploading ? t('fanart.uploading') : t('common.upload')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const FanArtPage: React.FC = () => {
  const { t } = useLanguage()
  const { user, isAuthenticated } = useUser()
  const { awardPoints } = usePoints()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [fanArtItems, setFanArtItems] = useState<FanArtItem[]>([])

  // Load FanArt data from localStorage on component mount
  useEffect(() => {
    const loadFanArtData = () => {
      try {
        const savedFanArt = localStorage.getItem('fanart_items')
        if (savedFanArt) {
          const parsedFanArt = JSON.parse(savedFanArt)
          // Convert date strings back to Date objects and sort by newest first
          const sortedFanArt = parsedFanArt
            .map((item: any) => ({
              ...item,
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
            }))
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          setFanArtItems(sortedFanArt)
        } else {
          // Use default mock data if no saved data exists
          const defaultFanArt = [
            {
              id: '1',
              title: 'Mario 64 Castle Reimagined',
              artist: 'PixelMaster64',
              imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2QjZCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPk1hcmlvIENhc3RsZTwvdGV4dD48L3N2Zz4=',
              likes: 142,
              views: 1205,
              comments: 23,
              rating: 4.7,
              ratingCount: 89,
              userRating: undefined,
              tags: ['Mario', 'Castle', 'Digital Art'],
              createdAt: new Date('2024-01-15'),
              game: 'Super Mario 64'
            },
            {
              id: '2',
              title: 'Link in Hyrule Field',
              artist: 'ZeldaFan98',
              imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEVDREMxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPlplbGRhIEFydDwvdGV4dD48L3N2Zz4=',
              likes: 89,
              views: 756,
              comments: 15,
              rating: 4.2,
              ratingCount: 54,
              userRating: undefined,
              tags: ['Zelda', 'Link', 'Landscape'],
              createdAt: new Date('2024-01-14'),
              game: 'The Legend of Zelda: Ocarina of Time'
            },
            {
              id: '3',
              title: 'GoldenEye Facility',
              artist: 'SpyArtist',
              imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZFQUE3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkdvbGRlbkV5ZSBBcnQ8L3RleHQ+PC9zdmc+',
              likes: 67,
              views: 543,
              comments: 8,
              rating: 4.0,
              ratingCount: 32,
              userRating: undefined,
              tags: ['GoldenEye', 'Facility', 'Map'],
              createdAt: new Date('2024-01-13'),
              game: 'GoldenEye 007'
            }
          ]
          setFanArtItems(defaultFanArt)
          // Save default data to localStorage
          localStorage.setItem('fanart_items', JSON.stringify(defaultFanArt))
        }
      } catch (error) {
        console.error('Error loading fanart data:', error)
        // Use minimal fallback on error
        setFanArtItems([])
      }
    }

    loadFanArtData()
  }, [])

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

  const handleLikeArtwork = async (artworkId: string) => {
    if (!isAuthenticated || !user) return

    const artwork = fanArtItems.find(item => item.id === artworkId)
    if (!artwork) return

    // Prevent self-liking
    if (artwork.artist === user.username) {
      console.log('Cannot like your own artwork')
      return
    }

    // In a real app, you'd check if user already liked this artwork
    // For now, we'll just increment the likes
    setFanArtItems(prev => prev.map(item => {
      if (item.id === artworkId) {
        return {
          ...item,
          likes: item.likes + 1
        }
      }
      return item
    }))

    // Award points to the artwork creator
    try {
      await awardPoints('fanart.likeReceived', `Like received on: ${artwork.title}`)
    } catch (error) {
      console.error('Failed to award points for fanart like:', error)
    }
  }

  const handleRateArtwork = (artworkId: string, rating: number) => {
    if (!isAuthenticated) return

    setFanArtItems(prev => prev.map(item => {
      if (item.id === artworkId) {
        const wasRated = item.userRating !== undefined
        const oldRating = item.userRating || 0
        const totalRating = item.rating * item.ratingCount
        
        let newRating: number
        let newRatingCount: number

        if (wasRated) {
          // Update existing rating
          newRating = (totalRating - oldRating + rating) / item.ratingCount
          newRatingCount = item.ratingCount
        } else {
          // Add new rating
          newRating = (totalRating + rating) / (item.ratingCount + 1)
          newRatingCount = item.ratingCount + 1
        }

        return {
          ...item,
          rating: newRating,
          ratingCount: newRatingCount,
          userRating: rating
        }
      }
      return item
    }))
  }

  const handleNewArtwork = (newArtwork: FanArtItem) => {
    setFanArtItems(prev => {
      const updated = [newArtwork, ...prev]
      // Save to localStorage so it appears on HomePage
      try {
        localStorage.setItem('fanart_items', JSON.stringify(updated))
        // Trigger storage event for HomePage to update
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'fanart_items',
          newValue: JSON.stringify(updated)
        }))
      } catch (error) {
        console.error('Error saving fanart to localStorage:', error)
      }
      return updated
    })
  }

  return (
    <div className="container-lg py-responsive space-responsive responsive-max-width responsive-overflow-hidden">
      {/* Header */}
      <div className="text-center mb-responsive responsive-max-width">
        <Palette className="w-12 h-12 sm:w-16 sm:h-16 text-pink-400 mx-auto mb-4" />
        <h1 className="text-responsive-2xl font-bold text-slate-100 mb-2 responsive-word-break">
          {t('nav.fanart')}
        </h1>
        <p className="text-responsive-base text-slate-400 max-w-2xl mx-auto responsive-word-break px-2">
          {t('fanart.subtitle')}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 responsive-max-width">
          {isAuthenticated && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-rose-600 hover:bg-rose-700 
                         text-white rounded-lg transition-colors font-medium w-full sm:w-auto justify-center"
            >
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{t('fanart.uploadArt')}</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex bg-slate-800 rounded-lg p-1 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-slate-700 text-slate-100' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-4 h-4" />
                              <span className="text-sm sm:text-base">{t('ui.grid')}</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-slate-700 text-slate-100' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
                              <span className="text-sm sm:text-base">{t('ui.list')}</span>
            </button>
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

                {/* Rating Display and Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <RatingDisplay rating={item.rating} size="sm" />
                    <span className="text-slate-500 text-xs">
                      {item.ratingCount} {t('fanart.ratings')}
                    </span>
                  </div>
                  
                  {isAuthenticated && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm">{t('fanart.yourRating')}:</span>
                      <RatingInput
                        currentRating={item.userRating || 0}
                        onRate={(rating) => handleRateArtwork(item.id, rating)}
                      />
                    </div>
                  )}
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
                    <button 
                      onClick={() => handleLikeArtwork(item.id)}
                      className="flex items-center gap-1 hover:text-rose-400 transition-colors"
                      disabled={!isAuthenticated}
                    >
                      <Heart className="w-4 h-4" />
                      <span>{item.likes}</span>
                    </button>
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

                  {/* Rating Display and Input */}
                  <div className="flex items-center gap-4">
                    <RatingDisplay rating={item.rating} size="sm" />
                    <span className="text-slate-500 text-xs">
                      {item.ratingCount} {t('fanart.ratings')}
                    </span>
                    
                    {isAuthenticated && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">{t('fanart.yourRating')}:</span>
                        <RatingInput
                          currentRating={item.userRating || 0}
                          onRate={(rating) => handleRateArtwork(item.id, rating)}
                        />
                      </div>
                    )}
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
                      <button 
                        onClick={() => handleLikeArtwork(item.id)}
                        className="flex items-center gap-1 hover:text-rose-400 transition-colors"
                        disabled={!isAuthenticated}
                      >
                        <Heart className="w-4 h-4" />
                        <span>{item.likes}</span>
                      </button>
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

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={(newArtwork) => {
            handleNewArtwork(newArtwork)
            setShowUploadModal(false)
          }}
          awardPoints={awardPoints}
        />
      )}
    </div>
  )
}

export default FanArtPage