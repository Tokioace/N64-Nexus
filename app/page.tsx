'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGamepad, FaCamera, FaTrophy, FaUsers, FaCog, FaStar, FaCompactDisc, FaBomb } from 'react-icons/fa'

export default function Battle64Home() {
  const [currentTab, setCurrentTab] = useState('home')
  const [showStartAnimation, setShowStartAnimation] = useState(true)
  const [points, setPoints] = useState(1250)
  const [level, setLevel] = useState(8)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // Start Animation Sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStartAnimation(false)
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  // Simulate level up
  const addPoints = () => {
    const newPoints = points + 100
    setPoints(newPoints)
    
    if (Math.floor(newPoints / 200) > Math.floor(points / 200)) {
      setLevel(prev => prev + 1)
      setShowLevelUp(true)
      setTimeout(() => setShowLevelUp(false), 2000)
    }
  }

  // Simulate upload
  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const tabs = [
    { id: 'home', label: 'Home', icon: FaGamepad },
    { id: 'upload', label: 'Upload', icon: FaCamera },
    { id: 'leaderboard', label: 'Leaderboard', icon: FaTrophy },
    { id: 'community', label: 'Community', icon: FaUsers },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ]

  if (showStartAnimation) {
    return (
      <div className="fixed inset-0 bg-retro-black flex items-center justify-center z-50">
        {/* Cartridge Drop Animation */}
        <motion.div
          initial={{ y: '-100vh', rotate: 0, opacity: 0 }}
          animate={{ y: 0, rotate: 360, opacity: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          className="absolute"
        >
          <FaCompactDisc className="text-8xl text-n64-purple" />
        </motion.div>

        {/* Console Slot */}
        <div className="absolute bottom-20 w-32 h-8 cartridge-slot rounded-lg"></div>

        {/* Flash Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="absolute inset-0 bg-white"
        />

        {/* Logo Fade In */}
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2, delay: 2 }}
          className="text-center"
        >
          <h1 className="text-6xl font-retro text-crt-green retro-glow mb-4">
            BATTLE64
          </h1>
          <p className="text-xl font-pixel text-n64-blue">
            Premium Retro Gaming
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-retro-black text-crt-green relative overflow-hidden">
      {/* Parallax Background */}
      <div className="fixed inset-0 parallax-bg opacity-20"></div>

      {/* Level Up Explosion */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-40"
          >
            <div className="level-up-explosion w-96 h-96 rounded-full flex items-center justify-center">
              <div className="text-center">
                <FaBomb className="text-8xl text-white mx-auto mb-4" />
                <h2 className="text-4xl font-retro text-white">LEVEL UP!</h2>
                <p className="text-2xl font-pixel text-white">Level {level}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="relative z-10 p-6">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-between items-center"
        >
          <div className="flex items-center space-x-4">
            <FaGamepad className="text-4xl text-n64-purple" />
            <h1 className="text-3xl font-retro text-crt-green retro-glow">
              BATTLE64
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-center"
            >
              <div className="text-2xl font-pixel text-n64-yellow">{points}</div>
              <div className="text-sm text-n64-blue">POINTS</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-center"
            >
              <div className="text-2xl font-pixel text-n64-green">LVL {level}</div>
              <div className="text-sm text-n64-blue">LEVEL</div>
            </motion.div>
          </div>
        </motion.div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative z-10 px-6 mb-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex space-x-2 bg-retro-gray p-2 rounded-lg"
        >
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            const isActive = currentTab === tab.id
            
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-pixel transition-all duration-300 ${
                  isActive 
                    ? 'bg-n64-purple text-white shadow-lg' 
                    : 'bg-transparent text-n64-blue hover:text-crt-green'
                }`}
                style={{
                  boxShadow: isActive ? '0 0 20px rgba(93, 63, 211, 0.5)' : 'none'
                }}
              >
                <Icon className="text-lg" />
                <span>{tab.label}</span>
                
                {/* Active Tab Glow Line */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-crt-green"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            )
          })}
        </motion.div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {currentTab === 'home' && (
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-retro-gray p-6 rounded-lg border border-n64-purple"
                >
                  <h2 className="text-2xl font-retro text-n64-yellow mb-4">
                    Welcome to Battle64!
                  </h2>
                  <p className="text-lg font-pixel text-crt-green mb-4">
                    Experience the ultimate retro gaming platform with premium animations and 90s nostalgia.
                  </p>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addPoints}
                    className="joypad-button px-6 py-3 rounded-lg text-white font-pixel text-lg"
                  >
                    Add Points (+100)
                  </motion.button>
                </motion.div>

                {/* Live Events Ticker */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-retro-gray p-4 rounded-lg overflow-hidden"
                >
                  <div className="ticker-tape">
                    <motion.div
                      animate={{ x: '-100%' }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className="whitespace-nowrap text-lg font-pixel text-n64-yellow"
                    >
                      🏆 NEW CHALLENGE: Speed Run Mario 64 - Prize: 5000 Points! 🏆 
                      🎮 LIVE NOW: Team Battle Tournament - Join Now! 🎮 
                      ⭐ SPECIAL EVENT: Retro Game Night - Tonight 8PM! ⭐
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            )}

            {currentTab === 'upload' && (
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="bg-retro-gray p-6 rounded-lg border border-n64-blue"
                >
                  <h2 className="text-2xl font-retro text-n64-blue mb-4">
                    Upload Screenshots & Videos
                  </h2>
                  
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={simulateUpload}
                      className="joypad-button w-full py-4 rounded-lg text-white font-pixel text-lg flex items-center justify-center space-x-2"
                    >
                      <FaCamera className="text-xl" />
                      <span>Take Screenshot</span>
                    </motion.button>

                    {isUploading && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-retro-black p-4 rounded-lg"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <FaCompactDisc className="text-2xl text-n64-green" />
                          </motion.div>
                          <span className="font-pixel text-crt-green">Uploading...</span>
                        </div>
                        
                        <div className="w-full bg-retro-gray rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            className="bg-n64-green h-2 rounded-full"
                          />
                        </div>
                        
                        <div className="text-right text-sm font-pixel text-n64-blue mt-1">
                          {uploadProgress}%
                        </div>
                      </motion.div>
                    )}

                    {uploadProgress === 100 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-n64-green p-4 rounded-lg text-center"
                      >
                        <div className="text-2xl font-retro text-white mb-2">✓ UPLOAD SUCCESS!</div>
                        <div className="font-pixel text-white">Your content has been uploaded successfully!</div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {currentTab === 'leaderboard' && (
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="bg-retro-gray p-6 rounded-lg border border-n64-yellow"
                >
                  <h2 className="text-2xl font-retro text-n64-yellow mb-4">
                    Top Players
                  </h2>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'RetroMaster', points: 15420, level: 25, rank: 1 },
                      { name: 'PixelWarrior', points: 12850, level: 22, rank: 2 },
                      { name: 'N64Legend', points: 11200, level: 20, rank: 3 },
                      { name: 'BattleKing', points: 9850, level: 18, rank: 4 },
                      { name: 'GamingPro', points: 8750, level: 16, rank: 5 },
                    ].map((player, index) => (
                      <motion.div
                        key={player.name}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-retro-black rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl font-retro text-n64-yellow">
                            #{player.rank}
                          </div>
                          <div>
                            <div className="font-pixel text-crt-green">{player.name}</div>
                            <div className="text-sm text-n64-blue">Level {player.level}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-pixel text-n64-green">{player.points}</div>
                          <div className="text-sm text-n64-blue">points</div>
                        </div>
                        
                        {player.rank === 1 && (
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="ml-2"
                          >
                            <FaStar className="text-2xl text-n64-yellow" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {currentTab === 'community' && (
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="bg-retro-gray p-6 rounded-lg border border-n64-green"
                >
                  <h2 className="text-2xl font-retro text-n64-green mb-4">
                    Fanart Gallery
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                      <motion.div
                        key={item}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: item * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-retro-black p-4 rounded-lg border border-n64-blue"
                      >
                        <div className="w-full h-32 bg-gradient-to-br from-n64-purple to-n64-blue rounded-lg mb-2 flex items-center justify-center">
                          <span className="font-pixel text-white">Fanart #{item}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-pixel text-crt-green">Artist {item}</span>
                          <div className="flex items-center space-x-1">
                            <FaStar className="text-n64-yellow" />
                            <span className="font-pixel text-n64-yellow">4.{item}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {currentTab === 'settings' && (
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="bg-retro-gray p-6 rounded-lg border border-n64-red"
                >
                  <h2 className="text-2xl font-retro text-n64-red mb-4">
                    Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-pixel text-crt-green">Animations</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-6 bg-n64-green rounded-full relative"
                      >
                        <motion.div
                          className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"
                          animate={{ x: 24 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-pixel text-crt-green">Sound Effects</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-6 bg-n64-green rounded-full relative"
                      >
                        <motion.div
                          className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"
                          animate={{ x: 24 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-pixel text-crt-green">CRT Effects</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-6 bg-n64-green rounded-full relative"
                      >
                        <motion.div
                          className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"
                          animate={{ x: 24 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Stars Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute pixel-star w-2 h-2 bg-n64-yellow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}