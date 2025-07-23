import React, { useState, useEffect } from 'react'
import { Plus, Radio, Filter, Trophy, Clock, Users, Gamepad2 } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useMedia } from '../contexts/MediaContext'
import SpeedrunPostCreator from '../components/SpeedrunPostCreator'
import LivestreamManager from '../components/LivestreamManager'
import SpeedrunPostCard from '../components/SpeedrunPostCard'

const SpeedrunMediaPage: React.FC = () => {
  const { t } = useLanguage()
  const { getSpeedrunPosts, getLivestreams } = useMedia()
  
  const [showPostCreator, setShowPostCreator] = useState(false)
  const [showStreamManager, setShowStreamManager] = useState(false)
  const [activeTab, setActiveTab] = useState<'posts' | 'streams'>('posts')
  const [selectedGame, setSelectedGame] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [posts, setPosts] = useState<any[]>([])
  const [liveStreams, setLiveStreams] = useState<any[]>([])

  const games = [
    { id: '', name: 'Alle Spiele' },
    { id: 'mario64', name: 'Super Mario 64' },
    { id: 'mariokart64', name: 'Mario Kart 64' },
    { id: 'goldeneye', name: 'GoldenEye 007' },
    { id: 'zelda-oot', name: 'The Legend of Zelda: Ocarina of Time' },
    { id: 'smash64', name: 'Super Smash Bros.' },
    { id: 'mario-party', name: 'Mario Party' }
  ]

  const categories = [
    { id: '', name: 'Alle Kategorien' },
    { id: 'any', name: t('speedrun.categories.any') },
    { id: '100', name: t('speedrun.categories.100') },
    { id: '120stars', name: t('speedrun.categories.120stars') },
    { id: '16stars', name: t('speedrun.categories.16stars') },
    { id: '70stars', name: t('speedrun.categories.70stars') },
    { id: 'glitchless', name: t('speedrun.categories.glitchless') }
  ]

  useEffect(() => {
    setPosts(getSpeedrunPosts(selectedGame || undefined, selectedCategory || undefined))
    setLiveStreams(getLivestreams())
  }, [selectedGame, selectedCategory, getSpeedrunPosts, getLivestreams])

  const handlePostSuccess = () => {
    setPosts(getSpeedrunPosts(selectedGame || undefined, selectedCategory || undefined))
  }

  const handleStreamSuccess = () => {
    setLiveStreams(getLivestreams())
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="simple-tile text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-slate-100">{t('nav.speedrun')}</h1>
        </div>
        <p className="text-slate-400 mb-6">{t('speedrun.description')}</p>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setShowPostCreator(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {t('speedrun.createPost')}
          </button>
          
          <button
            onClick={() => setShowStreamManager(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            <Radio className="w-5 h-5" />
            {t('speedrun.startStream')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-800 rounded-lg p-1 flex">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'posts'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Speedrun Posts
            {posts.length > 0 && (
              <span className="bg-slate-600 text-slate-200 px-2 py-0.5 rounded-full text-xs">
                {posts.length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('streams')}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'streams'
                ? 'bg-red-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Radio className="w-4 h-4" />
            {t('speedrun.viewStreams')}
            {liveStreams.length > 0 && (
              <>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-xs">
                  {liveStreams.length}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-200">Filter</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              <Gamepad2 className="w-4 h-4 inline mr-1" />
              Spiel
            </label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
            >
              {games.map(game => (
                <option key={game.id} value={game.id}>{game.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              <Trophy className="w-4 h-4 inline mr-1" />
              Kategorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-300 mb-2">
                {t('speedrun.noPostsYet')}
              </h3>
              <p className="text-slate-400 mb-6">
                {t('speedrun.noPostsDescription')}
              </p>
              <button
                onClick={() => setShowPostCreator(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                {t('speedrun.createPost')}
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map(post => (
                <SpeedrunPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'streams' && (
        <div className="space-y-6">
          {liveStreams.length === 0 ? (
            <div className="text-center py-12">
              <Radio className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-300 mb-2">
                {t('speedrun.noStreamsLive')}
              </h3>
              <p className="text-slate-400 mb-6">
                {t('speedrun.noStreamsDescription')}
              </p>
              <button
                onClick={() => setShowStreamManager(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <Radio className="w-5 h-5" />
                {t('speedrun.startStream')}
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {liveStreams.map(stream => (
                <div key={stream.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-400 text-sm font-medium">
                          {t('speedrun.currentlyLive')}
                        </span>
                        <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                          {stream.streamPlatform || 'Twitch'}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-100 mb-2">
                        {stream.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-slate-300 mb-4">
                        <span className="flex items-center gap-1">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {stream.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {stream.username}
                        </span>
                        <span>•</span>
                        <span>{stream.gameName}</span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {Math.floor(Math.random() * 500) + 10} {t('speedrun.viewers')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(stream.uploadDate).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <a
                        href={stream.livestreamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Radio className="w-5 h-5" />
                        Stream ansehen
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showPostCreator && (
        <SpeedrunPostCreator
          onClose={() => setShowPostCreator(false)}
          onSuccess={handlePostSuccess}
        />
      )}
      
      {showStreamManager && (
        <LivestreamManager
          onClose={() => setShowStreamManager(false)}
        />
      )}
    </div>
  )
}

export default SpeedrunMediaPage