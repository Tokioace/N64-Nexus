import React, { useState } from 'react'
import { Clock, Trophy, Camera, Tag, X } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useMedia } from '../contexts/MediaContext'
import { useUser } from '../contexts/UserContext'
import ImageUpload from './ImageUpload'

interface SpeedrunPostCreatorProps {
  onClose: () => void
  onSuccess: () => void
}

const SpeedrunPostCreator: React.FC<SpeedrunPostCreatorProps> = ({ onClose, onSuccess }) => {
  const { t } = useLanguage()
  const { createSpeedrunPost, uploadMedia, loading } = useMedia()
  const { currentUser } = useUser()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gameId: '',
    gameName: '',
    category: '',
    platform: 'N64' as 'N64' | 'PC' | 'Emulator',
    time: '',
    tags: [] as string[]
  })
  
  const [images, setImages] = useState<{ url: string, file: File }[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const games = [
    { id: 'mario64', name: 'Super Mario 64' },
    { id: 'mariokart64', name: 'Mario Kart 64' },
    { id: 'goldeneye', name: 'GoldenEye 007' },
    { id: 'zelda-oot', name: 'The Legend of Zelda: Ocarina of Time' },
    { id: 'smash64', name: 'Super Smash Bros.' },
    { id: 'mario-party', name: 'Mario Party' }
  ]

  const categories = [
    { id: 'any', name: t('speedrun.categories.any') },
    { id: '100', name: t('speedrun.categories.100') },
    { id: '120stars', name: t('speedrun.categories.120stars') },
    { id: '16stars', name: t('speedrun.categories.16stars') },
    { id: '70stars', name: t('speedrun.categories.70stars') },
    { id: 'glitchless', name: t('speedrun.categories.glitchless') }
  ]

  const platforms = [
    { id: 'N64', name: t('speedrun.platforms.n64') },
    { id: 'PC', name: t('speedrun.platforms.pc') },
    { id: 'Emulator', name: t('speedrun.platforms.emulator') }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Titel ist erforderlich'
    }
    if (!formData.gameId) {
      newErrors.gameId = 'Spiel auswählen ist erforderlich'
    }
    if (!formData.category) {
      newErrors.category = 'Kategorie auswählen ist erforderlich'
    }
    if (!formData.time.trim()) {
      newErrors.time = 'Zeit ist erforderlich'
    } else if (!/^\d{1,2}:\d{2}:\d{2}(\.\d{1,3})?$/.test(formData.time)) {
      newErrors.time = 'Zeit Format: MM:SS oder H:MM:SS'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageSelect = (imageUrl: string, file: File) => {
    setImages(prev => [...prev, { url: imageUrl, file }])
  }

  const handleImageRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !currentUser) return

    try {
      // Upload images first
      const mediaItems = []
      for (const image of images) {
        const success = await uploadMedia(image.file, {
          type: 'speedrun',
          title: formData.title,
          gameId: formData.gameId,
          gameName: formData.gameName
        })
        if (success) {
          mediaItems.push({
            id: Date.now().toString() + Math.random(),
            userId: currentUser.id,
            username: currentUser.username,
            gameId: formData.gameId,
            gameName: formData.gameName,
            type: 'speedrun' as const,
            title: formData.title,
            url: image.url,
            uploadDate: new Date(),
            verified: false,
            likes: 0,
            views: 0,
            tags: formData.tags,
            time: formData.time,
            category: formData.category,
            platform: formData.platform
          })
        }
      }

      const success = await createSpeedrunPost({
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        gameId: formData.gameId,
        gameName: formData.gameName,
        title: formData.title,
        description: formData.description,
        time: formData.time,
        category: formData.category,
        platform: formData.platform,
        media: mediaItems,
        tags: formData.tags,
        verified: false
      })

      if (success) {
        onSuccess()
        onClose()
      }
    } catch (error) {
      console.error('Error creating speedrun post:', error)
    }
  }

  if (!currentUser) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold text-slate-100 mb-4">Anmeldung erforderlich</h2>
          <p className="text-slate-400 mb-4">Du musst angemeldet sein, um Speedruns zu posten.</p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              {t('speedrun.createPost')}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                {t('speedrun.postTitle')} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="Mein neuer Rekord in Super Mario 64!"
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                {t('speedrun.postDescription')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500 h-24 resize-none"
                placeholder="Beschreibe deine Strategie, verwendete Glitches oder andere Details..."
              />
            </div>

            {/* Game Selection */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                {t('speedrun.selectGame')} *
              </label>
              <select
                value={formData.gameId}
                onChange={(e) => {
                  const selectedGame = games.find(g => g.id === e.target.value)
                  setFormData(prev => ({ 
                    ...prev, 
                    gameId: e.target.value,
                    gameName: selectedGame?.name || ''
                  }))
                }}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="">{t('speedrun.selectGame')}</option>
                {games.map(game => (
                  <option key={game.id} value={game.id}>{game.name}</option>
                ))}
              </select>
              {errors.gameId && <p className="text-red-400 text-sm mt-1">{errors.gameId}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  {t('speedrun.selectCategory')} *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="">{t('speedrun.selectCategory')}</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
              </div>

              {/* Platform */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  {t('speedrun.selectPlatform')} *
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value as any }))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  {platforms.map(platform => (
                    <option key={platform.id} value={platform.id}>{platform.name}</option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {t('speedrun.enterTime')} *
                </label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="1:23:45"
                />
                {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time}</p>}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                <Camera className="w-4 h-4 inline mr-1" />
                {t('speedrun.addImages')}
              </label>
              <div className="space-y-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full max-w-md h-auto rounded-lg border border-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  onImageRemove={() => {}}
                  isAuthenticated={true}
                  className="max-w-md"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                {t('speedrun.addTags')}
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="Tag hinzufügen..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-lg transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Wird veröffentlicht...
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4" />
                    {t('speedrun.publishPost')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SpeedrunPostCreator