'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Star, 
  Filter, 
  Search,
  TrendingUp,
  Clock,
  Users,
  Trophy,
  Fire,
  Sparkles,
  Palette,
  Camera,
  Upload
} from 'lucide-react'

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('fanart')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedGame, setSelectedGame] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const games = [
    { id: 'all', name: 'All Games' },
    { id: 'mario-kart-64', name: 'Mario Kart 64' },
    { id: 'super-mario-64', name: 'Super Mario 64' },
    { id: 'zelda-oot', name: 'The Legend of Zelda: Ocarina of Time' },
    { id: 'zelda-mm', name: 'The Legend of Zelda: Majora\'s Mask' },
    { id: 'goldeneye', name: 'GoldenEye 007' },
    { id: 'perfect-dark', name: 'Perfect Dark' },
    { id: 'banjo-kazooie', name: 'Banjo-Kazooie' },
    { id: 'donkey-kong-64', name: 'Donkey Kong 64' },
    { id: 'star-fox-64', name: 'Star Fox 64' },
    { id: 'f-zero-x', name: 'F-Zero X' },
  ]

  const mockFanarts = [
    {
      id: 1,
      title: "Mario Kart 64 - Rainbow Road",
      author: "RetroArtist",
      authorLevel: "Gold",
      image: "/api/placeholder/400/300",
      likes: 156,
      comments: 23,
      game: "Mario Kart 64",
      tags: ["mario", "kart", "rainbow road"],
      tools: "Photoshop",
      createdAt: "2024-01-15",
      isTop: true
    },
    {
      id: 2,
      title: "Zelda OoT - Link's Awakening",
      author: "PixelMaster",
      authorLevel: "Silver",
      image: "/api/placeholder/400/300",
      likes: 89,
      comments: 12,
      game: "The Legend of Zelda: Ocarina of Time",
      tags: ["zelda", "link", "ocarina"],
      tools: "Procreate",
      createdAt: "2024-01-14",
      isTop: false
    },
    {
      id: 3,
      title: "Super Mario 64 - Peach's Castle",
      author: "ArtGamer",
      authorLevel: "Platinum",
      image: "/api/placeholder/400/300",
      likes: 234,
      comments: 45,
      game: "Super Mario 64",
      tags: ["mario", "peach", "castle"],
      tools: "Traditional",
      createdAt: "2024-01-13",
      isTop: true
    },
    {
      id: 4,
      title: "GoldenEye 007 - Facility",
      author: "BondFan",
      authorLevel: "Bronze",
      image: "/api/placeholder/400/300",
      likes: 67,
      comments: 8,
      game: "GoldenEye 007",
      tags: ["bond", "facility", "action"],
      tools: "Digital Art",
      createdAt: "2024-01-12",
      isTop: false
    },
    {
      id: 5,
      title: "Banjo-Kazooie - Spiral Mountain",
      author: "RareLover",
      authorLevel: "Gold",
      image: "/api/placeholder/400/300",
      likes: 178,
      comments: 31,
      game: "Banjo-Kazooie",
      tags: ["banjo", "kazooie", "rare"],
      tools: "Clip Studio Paint",
      createdAt: "2024-01-11",
      isTop: true
    },
    {
      id: 6,
      title: "Star Fox 64 - Corneria",
      author: "SpacePilot",
      authorLevel: "Silver",
      image: "/api/placeholder/400/300",
      likes: 92,
      comments: 15,
      game: "Star Fox 64",
      tags: ["star fox", "corneria", "space"],
      tools: "Krita",
      createdAt: "2024-01-10",
      isTop: false
    }
  ]

  const mockScreenshots = [
    {
      id: 1,
      title: "Perfect Score - 999,999 points!",
      author: "SpeedRunner",
      authorLevel: "Gold",
      image: "/api/placeholder/400/300",
      likes: 67,
      comments: 8,
      game: "Mario Kart 64",
      platform: "N64",
      region: "NTSC",
      createdAt: "2024-01-15",
      isTop: false
    },
    {
      id: 2,
      title: "Hidden Easter Egg Found",
      author: "Explorer",
      authorLevel: "Silver",
      image: "/api/placeholder/400/300",
      likes: 123,
      comments: 19,
      game: "Super Mario 64",
      platform: "N64",
      region: "PAL",
      createdAt: "2024-01-14",
      isTop: true
    },
    {
      id: 3,
      title: "Speedrun World Record",
      author: "FastPlayer",
      authorLevel: "Platinum",
      image: "/api/placeholder/400/300",
      likes: 456,
      comments: 67,
      game: "The Legend of Zelda: Ocarina of Time",
      platform: "N64",
      region: "NTSC",
      createdAt: "2024-01-13",
      isTop: true
    },
    {
      id: 4,
      title: "Multiplayer Victory",
      author: "TeamPlayer",
      authorLevel: "Bronze",
      image: "/api/placeholder/400/300",
      likes: 34,
      comments: 5,
      game: "GoldenEye 007",
      platform: "N64",
      region: "NTSC",
      createdAt: "2024-01-12",
      isTop: false
    }
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Platinum': return 'text-purple-400'
      case 'Gold': return 'text-yellow-400'
      case 'Silver': return 'text-gray-300'
      case 'Bronze': return 'text-amber-600'
      default: return 'text-gray-400'
    }
  }

  const renderContent = () => {
    const content = activeTab === 'fanart' ? mockFanarts : mockScreenshots
    
    return content.map((item) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="retro-card overflow-hidden group relative"
      >
        {item.isTop && (
          <div className="absolute top-2 left-2 z-10">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
              <Fire className="h-3 w-3" />
              <span>TOP</span>
            </div>
          </div>
        )}
        
        <div className="relative aspect-square bg-gray-700">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="font-bold text-lg mb-1">{item.title}</h3>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm text-gray-300">by {item.author}</span>
              <span className={`text-xs font-bold ${getLevelColor(item.authorLevel)}`}>
                {item.authorLevel}
              </span>
            </div>
            <p className="text-xs text-gray-400">{item.game}</p>
            {activeTab === 'screenshots' && (
              <p className="text-xs text-gray-400">{item.platform} • {item.region}</p>
            )}
          </div>
        </div>
        
        <div className="p-4">
          {activeTab === 'fanart' && item.tags && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors like-animation">
                <Heart className="h-4 w-4" />
                <span className="text-sm">{item.likes}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{item.comments}</span>
              </button>
            </div>
            <button className="text-gray-400 hover:text-yellow-500 transition-colors">
              <Star className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    ))
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold glow-text mb-4">Community Gallery</h1>
          <p className="text-gray-400">
            Discover amazing fanart and screenshots from the Battle64 community
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex flex-wrap">
            <button
              onClick={() => setActiveTab('fanart')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'fanart' 
                  ? 'bg-retro-purple text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Palette className="h-4 w-4" />
              <span>🎨 Fanart</span>
            </button>
            <button
              onClick={() => setActiveTab('screenshots')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'screenshots' 
                  ? 'bg-retro-purple text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Camera className="h-4 w-4" />
              <span>📷 Screenshots</span>
            </button>
            <button
              onClick={() => setActiveTab('top')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'top' 
                  ? 'bg-retro-purple text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>🔥 Top This Month</span>
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'new' 
                  ? 'bg-retro-purple text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>🆕 New</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="retro-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="retro-input w-full pl-10"
              />
            </div>

            {/* Game Filter */}
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="retro-input"
            >
              {games.map(game => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="retro-input"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-liked">Most Liked</option>
              <option value="most-commented">Most Commented</option>
              <option value="trending">Trending</option>
            </select>

            {/* Upload Button */}
            <button className="retro-button flex items-center justify-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="retro-card p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {activeTab === 'fanart' ? mockFanarts.length : mockScreenshots.length}
            </div>
            <div className="text-gray-400 text-sm">
              {activeTab === 'fanart' ? 'Fanart Pieces' : 'Screenshots'}
            </div>
          </div>
          <div className="retro-card p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {activeTab === 'fanart' 
                ? mockFanarts.reduce((sum, item) => sum + item.likes, 0)
                : mockScreenshots.reduce((sum, item) => sum + item.likes, 0)
              }
            </div>
            <div className="text-gray-400 text-sm">Total Likes</div>
          </div>
          <div className="retro-card p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {activeTab === 'fanart' 
                ? mockFanarts.reduce((sum, item) => sum + item.comments, 0)
                : mockScreenshots.reduce((sum, item) => sum + item.comments, 0)
              }
            </div>
            <div className="text-gray-400 text-sm">Total Comments</div>
          </div>
          <div className="retro-card p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {activeTab === 'fanart' 
                ? mockFanarts.filter(item => item.isTop).length
                : mockScreenshots.filter(item => item.isTop).length
              }
            </div>
            <div className="text-gray-400 text-sm">Top Content</div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {renderContent()}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="retro-button-secondary px-8 py-3">
            Load More Content
          </button>
        </div>
      </div>
    </div>
  )
}