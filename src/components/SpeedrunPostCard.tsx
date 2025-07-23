import React, { useState } from 'react'
import { Heart, MessageCircle, Clock, Trophy, Eye, Verified, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useMedia } from '../contexts/MediaContext'
import { SpeedrunPost } from '../types'

interface SpeedrunPostCardProps {
  post: SpeedrunPost
}

const SpeedrunPostCard: React.FC<SpeedrunPostCardProps> = ({ post }) => {
  const { t } = useLanguage()
  const { likeSpeedrunPost } = useMedia()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)

  const handleLike = async () => {
    if (!liked) {
      const success = await likeSpeedrunPost(post.id)
      if (success) {
        setLiked(true)
        setLikeCount(prev => prev + 1)
      }
    }
  }

  const nextImage = () => {
    if (post.media.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % post.media.length)
    }
  }

  const prevImage = () => {
    if (post.media.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + post.media.length) % post.media.length)
    }
  }

  const formatTime = (time?: string) => {
    if (!time) return ''
    return time
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'N64': return 'bg-yellow-600'
      case 'PC': return 'bg-blue-600'
      case 'Emulator': return 'bg-purple-600'
      default: return 'bg-gray-600'
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'any': return 'bg-green-600'
      case '100': return 'bg-orange-600'
      case '120stars': return 'bg-red-600'
      case '16stars': return 'bg-blue-600'
      case '70stars': return 'bg-purple-600'
      case 'glitchless': return 'bg-pink-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {post.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100">{post.username}</h3>
                {post.verified && (
                  <Verified className="w-4 h-4 text-blue-400" />
                )}
              </div>
              <p className="text-slate-400 text-sm">
                {new Date(post.createdAt).toLocaleDateString()} • {post.gameName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs text-white ${getPlatformColor(post.platform)}`}>
              {t(`speedrun.platforms.${post.platform.toLowerCase()}`)}
            </span>
            {post.category && (
              <span className={`px-2 py-1 rounded text-xs text-white ${getCategoryColor(post.category)}`}>
                {t(`speedrun.categories.${post.category}`)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-slate-100 mb-2">
          {post.title}
        </h2>
        
        {post.description && (
          <p className="text-slate-300 mb-4">
            {post.description}
          </p>
        )}

        {/* Time Display */}
        {post.time && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-slate-700 rounded-lg">
            <Clock className="w-5 h-5 text-yellow-400" />
            <span className="text-slate-200 font-medium">Zeit:</span>
            <span className="text-2xl font-bold text-yellow-400 font-mono">
              {formatTime(post.time)}
            </span>
            <Trophy className="w-5 h-5 text-yellow-400 ml-2" />
          </div>
        )}

        {/* Images */}
        {post.media.length > 0 && (
          <div className="mb-4">
            <div className="relative">
              <img
                src={post.media[currentImageIndex].url}
                alt={`${post.title} - Bild ${currentImageIndex + 1}`}
                className="w-full h-auto rounded-lg border border-slate-600"
              />
              
              {post.media.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {post.media.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {post.media.length > 1 && (
              <p className="text-slate-400 text-sm mt-2 text-center">
                Bild {currentImageIndex + 1} von {post.media.length}
              </p>
            )}
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                liked 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-slate-400 hover:text-red-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </button>
            
            <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments}</span>
            </button>
            
            <div className="flex items-center gap-2 text-slate-400">
              <Eye className="w-5 h-5" />
              <span>{Math.floor(Math.random() * 1000) + 50}</span>
            </div>
          </div>
          
          <div className="text-slate-400 text-sm">
            {new Date(post.createdAt).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpeedrunPostCard