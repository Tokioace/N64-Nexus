'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Star, 
  Trophy, 
  Award,
  Crown,
  Target,
  TrendingUp,
  Palette,
  Camera,
  Edit,
  Settings,
  Share,
  Download,
  Flag
} from 'lucide-react'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('gallery')
  const [selectedContent, setSelectedContent] = useState('my-content')

  const mockUser = {
    id: 1,
    username: "RetroArtist",
    email: "retroartist@battle64.com",
    avatar: "/api/placeholder/150/150",
    bio: "Passionate retro gaming artist who loves creating fanart of classic N64 games. Specializing in Mario Kart and Zelda series.",
    joinDate: "2023-06-15",
    totalPoints: 2847,
    fanartLevel: "Gold",
    fanartCount: 23,
    screenshotCount: 8,
    totalLikes: 1247,
    totalComments: 89,
    followers: 156,
    following: 42
  }

  const mockBadges = [
    {
      id: 1,
      name: "Retro Picasso",
      description: "Created 20+ fanart pieces",
      icon: "🎨",
      color: "from-purple-400 to-pink-400",
      earned: "2024-01-10"
    },
    {
      id: 2,
      name: "Speedrun Shooter",
      description: "Uploaded 10+ screenshots",
      icon: "📷",
      color: "from-blue-400 to-cyan-400",
      earned: "2024-01-05"
    },
    {
      id: 3,
      name: "Art of the Week",
      description: "Had artwork featured in weekly top",
      icon: "🏆",
      color: "from-yellow-400 to-orange-400",
      earned: "2024-01-15"
    },
    {
      id: 4,
      name: "Community Pillar",
      description: "Received 100+ likes on content",
      icon: "❤️",
      color: "from-red-400 to-pink-400",
      earned: "2024-01-12"
    }
  ]

  const mockMyContent = [
    {
      id: 1,
      title: "Mario Kart 64 - Rainbow Road",
      type: "fanart",
      image: "/api/placeholder/300/300",
      likes: 156,
      comments: 23,
      createdAt: "2024-01-15",
      isTop: true
    },
    {
      id: 2,
      title: "Perfect Score Achievement",
      type: "screenshot",
      image: "/api/placeholder/300/300",
      likes: 67,
      comments: 8,
      createdAt: "2024-01-14",
      isTop: false
    },
    {
      id: 3,
      title: "Zelda OoT - Link's Awakening",
      type: "fanart",
      image: "/api/placeholder/300/300",
      likes: 89,
      comments: 12,
      createdAt: "2024-01-13",
      isTop: false
    }
  ]

  const mockFavorites = [
    {
      id: 1,
      title: "Super Mario 64 - Peach's Castle",
      type: "fanart",
      author: "ArtGamer",
      image: "/api/placeholder/300/300",
      likes: 234,
      comments: 45,
      createdAt: "2024-01-13"
    },
    {
      id: 2,
      title: "Speedrun World Record",
      type: "screenshot",
      author: "FastPlayer",
      image: "/api/placeholder/300/300",
      likes: 456,
      comments: 67,
      createdAt: "2024-01-12"
    }
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Platinum': return 'from-purple-400 to-purple-600'
      case 'Gold': return 'from-yellow-400 to-yellow-600'
      case 'Silver': return 'from-gray-300 to-gray-500'
      case 'Bronze': return 'from-amber-600 to-amber-800'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getLevelProgress = () => {
    const levels = { Bronze: 0, Silver: 1000, Gold: 2500, Platinum: 5000 }
    const currentLevel = mockUser.fanartLevel
    const currentPoints = mockUser.totalPoints
    const nextLevel = currentLevel === 'Platinum' ? 'Platinum' : 
                     currentLevel === 'Gold' ? 'Platinum' :
                     currentLevel === 'Silver' ? 'Gold' : 'Silver'
    
    const currentLevelPoints = levels[currentLevel as keyof typeof levels]
    const nextLevelPoints = levels[nextLevel as keyof typeof levels]
    const progress = ((currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100
    
    return Math.min(Math.max(progress, 0), 100)
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="retro-card p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <img 
                src={mockUser.avatar} 
                alt={mockUser.username}
                className="w-32 h-32 rounded-full border-4 border-retro-purple"
              />
              <div className="absolute -bottom-2 -right-2">
                <div className={`bg-gradient-to-r ${getLevelColor(mockUser.fanartLevel)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                  {mockUser.fanartLevel}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <h1 className="text-3xl font-bold glow-text">{mockUser.username}</h1>
                <button className="retro-button-secondary px-4 py-2 flex items-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
              
              <p className="text-gray-300 mb-4 max-w-2xl">{mockUser.bio}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>Member since {new Date(mockUser.joinDate).toLocaleDateString()}</span>
                <span>•</span>
                <span>{mockUser.followers} followers</span>
                <span>•</span>
                <span>{mockUser.following} following</span>
              </div>
            </div>

            {/* Stats */}
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-2">{mockUser.totalPoints}</div>
              <div className="text-gray-400 text-sm">Total Points</div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="retro-card p-4 text-center"
          >
            <Palette className="h-8 w-8 text-retro-purple mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{mockUser.fanartCount}</div>
            <div className="text-gray-400 text-sm">Fanart Pieces</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="retro-card p-4 text-center"
          >
            <Camera className="h-8 w-8 text-retro-blue mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{mockUser.screenshotCount}</div>
            <div className="text-gray-400 text-sm">Screenshots</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="retro-card p-4 text-center"
          >
            <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{mockUser.totalLikes}</div>
            <div className="text-gray-400 text-sm">Total Likes</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="retro-card p-4 text-center"
          >
            <MessageCircle className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{mockUser.totalComments}</div>
            <div className="text-gray-400 text-sm">Comments</div>
          </motion.div>
        </div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="retro-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Level Progress</h2>
            <div className={`bg-gradient-to-r ${getLevelColor(mockUser.fanartLevel)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
              {mockUser.fanartLevel} Artist
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
            <div 
              className={`bg-gradient-to-r ${getLevelColor(mockUser.fanartLevel)} h-4 rounded-full transition-all duration-500`}
              style={{ width: `${getLevelProgress()}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>{mockUser.totalPoints} points</span>
            <span>{mockUser.fanartLevel === 'Platinum' ? 'Max Level' : 'Next level: ' + (mockUser.fanartLevel === 'Gold' ? 'Platinum' : mockUser.fanartLevel === 'Silver' ? 'Gold' : 'Silver')}</span>
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="retro-card p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Award className="h-6 w-6 mr-2 text-yellow-400" />
            Badges & Achievements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockBadges.map((badge) => (
              <div key={badge.id} className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h3 className="font-bold text-white mb-1">{badge.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{badge.description}</p>
                <div className="text-xs text-gray-500">Earned {new Date(badge.earned).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Content Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex flex-wrap">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'gallery' 
                  ? 'bg-retro-purple text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Palette className="h-4 w-4" />
              <span>Gallery</span>
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'achievements' 
                  ? 'bg-retro-purple text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>Achievements</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'stats' 
                  ? 'bg-retro-purple text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Statistics</span>
            </button>
          </div>
        </div>

        {/* Gallery Content */}
        {activeTab === 'gallery' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Content Type Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-700 rounded-lg p-1 flex">
                <button
                  onClick={() => setSelectedContent('my-content')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedContent === 'my-content' 
                      ? 'bg-retro-purple text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  My Content
                </button>
                <button
                  onClick={() => setSelectedContent('favorites')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedContent === 'favorites' 
                      ? 'bg-retro-purple text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Favorites
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="gallery-grid">
              {(selectedContent === 'my-content' ? mockMyContent : mockFavorites).map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="retro-card overflow-hidden group relative"
                >
                  {item.isTop && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold">
                        TOP
                      </div>
                    </div>
                  )}
                  
                  <div className="relative aspect-square bg-gray-700">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      {selectedContent === 'favorites' && (
                        <p className="text-sm text-gray-300">by {item.author}</p>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                          {item.type === 'fanart' ? '🎨' : '📷'} {item.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{item.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">{item.comments}</span>
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                          <Star className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-blue-500 transition-colors">
                          <Share className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="retro-card p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Achievement Progress</h2>
            <div className="space-y-4">
              {mockBadges.map((badge) => (
                <div key={badge.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{badge.icon}</div>
                    <div>
                      <h3 className="font-bold text-white">{badge.name}</h3>
                      <p className="text-gray-400 text-sm">{badge.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 text-sm">✓ Earned</div>
                    <div className="text-gray-500 text-xs">{new Date(badge.earned).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="retro-card p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Detailed Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Content Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Uploads</span>
                    <span className="text-white font-bold">{mockUser.fanartCount + mockUser.screenshotCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fanart Pieces</span>
                    <span className="text-white font-bold">{mockUser.fanartCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Screenshots</span>
                    <span className="text-white font-bold">{mockUser.screenshotCount}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Engagement</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Likes Received</span>
                    <span className="text-white font-bold">{mockUser.totalLikes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Comments</span>
                    <span className="text-white font-bold">{mockUser.totalComments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average Likes per Post</span>
                    <span className="text-white font-bold">
                      {Math.round(mockUser.totalLikes / (mockUser.fanartCount + mockUser.screenshotCount))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}