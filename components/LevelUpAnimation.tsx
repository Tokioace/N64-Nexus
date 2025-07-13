'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBomb, FaStar } from 'react-icons/fa'
import { useAnimation } from './AnimationProvider'

interface LevelUpAnimationProps {
  isVisible: boolean
  level: number
  onComplete?: () => void
}

export function LevelUpAnimation({ isVisible, level, onComplete }: LevelUpAnimationProps) {
  const { shouldAnimate } = useAnimation()

  const particles = Array.from({ length: 20 }, (_, i) => i)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onAnimationComplete={onComplete}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          {/* Background Flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white"
          />

          {/* Main Explosion */}
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 1,
              ease: "easeOut"
            }}
            className="relative"
          >
            <div className="level-up-explosion w-96 h-96 rounded-full flex items-center justify-center">
              <div className="text-center z-10">
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <FaBomb className="text-8xl text-white mx-auto mb-4" />
                </motion.div>
                
                <motion.h2
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-4xl font-retro text-white mb-2"
                >
                  LEVEL UP!
                </motion.h2>
                
                <motion.p
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-2xl font-pixel text-white"
                >
                  Level {level}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Particle Effects */}
          {shouldAnimate && particles.map((particle) => (
            <motion.div
              key={particle}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                opacity: [1, 0],
                scale: [0, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 1.5,
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
              className="absolute"
            >
              <FaStar 
                className="text-2xl text-n64-yellow"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(245, 166, 35, 0.8))'
                }}
              />
            </motion.div>
          ))}

          {/* Ring Effects */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: [0, 2 + ring * 0.5],
                opacity: [1, 0]
              }}
              transition={{
                duration: 1.5,
                delay: ring * 0.2,
                ease: "easeOut",
              }}
              className="absolute w-96 h-96 border-4 border-n64-yellow rounded-full"
              style={{
                borderColor: `hsl(${45 + ring * 30}, 100%, 60%)`
              }}
            />
          ))}

          {/* Success Message */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute bottom-20 text-center"
          >
            <div className="text-2xl font-retro text-n64-yellow retro-glow">
              CONGRATULATIONS!
            </div>
            <div className="text-lg font-pixel text-crt-green mt-2">
              You've reached a new milestone!
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}