'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Star, 
  Upload, 
  Trophy, 
  Users, 
  Gamepad2,
  Palette,
  Camera
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('fanart')

  const mockFanarts = [
    {
      id: 1,
      title: "Mario Kart 64 - Rainbow Road",
      author: "RetroArtist",
      image: "/api/placeholder/400/300",
      likes: 156,
      comments: 23,
      game: "Mario Kart 64"
    },
    {
      id: 2,
      title: "Zelda OoT - Link's Awakening",
      author: "PixelMaster",
      image: "/api/placeholder/400/300",
      likes: 89,
      comments: 12,
      game: "The Legend of Zelda: Ocarina of Time"
    },
    {
      id: 3,
      title: "Super Mario 64 - Peach's Castle",
      author: "ArtGamer",
      image: "/api/placeholder/400/300",
      likes: 234,
      comments: 45,
      game: "Super Mario 64"
    }
  ]

  const mockScreenshots = [
    {
      id: 1,
      title: "Perfect Score - 999,999 points!",
      author: "SpeedRunner",
      image: "/api/placeholder/400/300",
      likes: 67,
      comments: 8,
      game: "Mario Kart 64"
    },
    {
      id: 2,
      title: "Hidden Easter Egg Found",
      author: "Explorer",
      image: "/api/placeholder/400/300",
      likes: 123,
      comments: 19,
      game: "Super Mario 64"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Gamepad2 className="h-8 w-8 text-retro-purple" />
              <span className="text-xl font-bold glow-text">Battle64 Community</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/upload" className="retro-button-secondary flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </Link>
              <Link href="/profile" className="retro-button-secondary">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 glow-text"
          >
            Share Your <span className="text-retro-pink">Retro Gaming</span> Passion
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Upload fanart, share screenshots, and connect with fellow Battle64 enthusiasts. 
            Earn badges, compete in challenges, and build your legacy in the retro gaming community.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/upload" className="retro-button text-lg px-8 py-4 flex items-center justify-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Share Fanart</span>
            </Link>
            <Link href="/upload?type=screenshot" className="retro-button-secondary text-lg px-8 py-4 flex items-center justify-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Upload Screenshot</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="retro-card p-6 text-center"
            >
              <Users className="h-12 w-12 text-retro-purple mx-auto mb-4" />
              <div className="text-3xl font-bold text-white">1,247</div>
              <div className="text-gray-400">Active Artists</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="retro-card p-6 text-center"
            >
              <Palette className="h-12 w-12 text-retro-pink mx-auto mb-4" />
              <div className="text-3xl font-bold text-white">5,892</div>
              <div className="text-gray-400">Fanart Pieces</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="retro-card p-6 text-center"
            >
              <Camera className="h-12 w-12 text-retro-blue mx-auto mb-4" />
              <div className="text-3xl font-bold text-white">3,456</div>
              <div className="text-gray-400">Screenshots</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="retro-card p-6 text-center"
            >
              <Trophy className="h-12 w-12 text-retro-yellow mx-auto mb-4" />
              <div className="text-3xl font-bold text-white">89</div>
              <div className="text-gray-400">Competitions</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Feed Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold glow-text">Community Feed</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('fanart')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'fanart' 
                    ? 'bg-retro-purple text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🎨 Fanart
              </button>
              <button
                onClick={() => setActiveTab('screenshots')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'screenshots' 
                    ? 'bg-retro-purple text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                📷 Screenshots
              </button>
            </div>
          </div>

          <div className="gallery-grid">
            {activeTab === 'fanart' ? (
              mockFanarts.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="retro-card overflow-hidden group"
                >
                  <div className="relative aspect-square bg-gray-700">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-300">by {item.author}</p>
                      <p className="text-xs text-gray-400">{item.game}</p>
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
                      <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                        <Star className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              mockScreenshots.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="retro-card overflow-hidden group"
                >
                  <div className="relative aspect-square bg-gray-700">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-300">by {item.author}</p>
                      <p className="text-xs text-gray-400">{item.game}</p>
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
                      <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                        <Star className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center mt-8">
            <Link href="/community" className="retro-button">
              View All Content
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/80 border-t border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2024 Battle64 Community. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Share your passion for retro gaming responsibly. No ROM content allowed.
          </p>
        </div>
      </footer>
    </div>
  )
}