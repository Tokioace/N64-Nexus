import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, Zap, Star } from 'lucide-react'

interface RetroIntroAnimationProps {
  onComplete: () => void
  skipIntro?: boolean
}

const RetroIntroAnimation: React.FC<RetroIntroAnimationProps> = ({ 
  onComplete, 
  skipIntro = false 
}) => {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [showSkip, setShowSkip] = useState(false)

  useEffect(() => {
    if (skipIntro) {
      onComplete()
      return
    }

    // Show skip button after 2 seconds
    const skipTimer = setTimeout(() => {
      setShowSkip(true)
    }, 2000)

    // Phase progression
    const phases = [
      { duration: 2000, next: 1 }, // Nintendo 64 logo
      { duration: 2000, next: 2 }, // Battle64 title
      { duration: 2000, next: 3 }, // Loading animation
      { duration: 1000, next: 4 }  // Fade out
    ]

    let currentTimer: NodeJS.Timeout

    const progressPhase = (phase: number) => {
      if (phase >= phases.length) {
        onComplete()
        return
      }

      currentTimer = setTimeout(() => {
        setCurrentPhase(phase + 1)
        progressPhase(phase + 1)
      }, phases[phase].duration)
    }

    progressPhase(0)

    return () => {
      clearTimeout(skipTimer)
      clearTimeout(currentTimer)
    }
  }, [skipIntro, onComplete])

  const handleSkip = () => {
    onComplete()
  }

  if (skipIntro) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Polygon Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-n64-gray to-black">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-gradient-to-br from-n64-purple/20 to-n64-blue/20 rounded-lg"
                style={{
                  width: Math.random() * 100 + 50,
                  height: Math.random() * 100 + 50,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  rotateZ: [0, 360],
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-n64-purple/30 to-transparent bg-[length:100px_100px] bg-[image:linear-gradient(90deg,transparent_49%,rgba(107,70,193,0.3)_50%,rgba(107,70,193,0.3)_51%,transparent_52%)]" />
          </div>
        </div>

        {/* Skip Button */}
        <AnimatePresence>
          {showSkip && (
            <motion.button
              className="absolute top-8 right-8 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white font-game text-sm hover:bg-white/20 transition-colors"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={handleSkip}
            >
              Skip Intro
            </motion.button>
          )}
        </AnimatePresence>

        {/* Phase 0: Nintendo 64 Style Logo */}
        <AnimatePresence>
          {currentPhase === 0 && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="relative mb-8"
                animate={{
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 2,
                  ease: "linear"
                }}
              >
                <div className="text-8xl font-bold text-white font-game text-shadow-lg">
                  N64
                </div>
                <motion.div
                  className="absolute inset-0 text-8xl font-bold text-n64-purple font-game"
                  animate={{
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  N64
                </motion.div>
              </motion.div>
              
              <motion.div
                className="text-2xl text-white/80 font-game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Style Gaming
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 1: Battle64 Title */}
        <AnimatePresence>
          {currentPhase === 1 && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: 90 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="relative mb-6"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div
                  className="text-6xl font-bold text-white font-game text-shadow-lg"
                  animate={{
                    rotateY: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  BATTLE64
                </motion.div>
                
                {/* 3D Depth Effect */}
                <div className="absolute inset-0 text-6xl font-bold text-n64-purple/50 font-game transform translate-x-1 translate-y-1 -z-10">
                  BATTLE64
                </div>
              </motion.div>
              
              <motion.div
                className="flex items-center justify-center gap-4 text-white/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Gamepad2 size={24} />
                <span className="font-game text-lg">Quiz & Minigames</span>
                <Gamepad2 size={24} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2: Loading Animation */}
        <AnimatePresence>
          {currentPhase === 2 && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="mb-8"
                animate={{
                  rotateZ: [0, 360],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="w-16 h-16 mx-auto border-4 border-n64-purple border-t-transparent rounded-full" />
              </motion.div>
              
              <motion.div
                className="text-xl text-white font-game mb-4"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Loading Game...
              </motion.div>
              
              {/* Loading Progress */}
              <div className="w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-n64-purple to-n64-blue rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </div>
              
              {/* Floating Stars */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 40}%`,
                    }}
                    animate={{
                      y: [-10, 10, -10],
                      rotateZ: [0, 180, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Star size={20} className="text-n64-yellow" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 3: Ready Animation */}
        <AnimatePresence>
          {currentPhase === 3 && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="relative"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 2,
                  ease: "easeInOut"
                }}
              >
                <div className="text-4xl font-bold text-white font-game text-shadow-lg">
                  READY!
                </div>
                
                {/* Lightning Effect */}
                <motion.div
                  className="absolute inset-0 text-4xl font-bold text-n64-yellow font-game"
                  animate={{
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.2,
                    repeat: 3,
                    ease: "easeInOut"
                  }}
                >
                  READY!
                </motion.div>
              </motion.div>
              
              <motion.div
                className="mt-4"
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 0.3,
                  repeat: 3,
                  ease: "easeInOut"
                }}
              >
                <Zap size={32} className="text-n64-yellow mx-auto" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

export default RetroIntroAnimation