import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface RetroCard3DProps {
  children: React.ReactNode
  title?: string
  icon?: LucideIcon
  onClick?: () => void
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  hover3D?: boolean
  flipOnHover?: boolean
  backContent?: React.ReactNode
  className?: string
}

const RetroCard3D: React.FC<RetroCard3DProps> = ({
  children,
  title,
  icon: Icon,
  onClick,
  variant = 'default',
  size = 'md',
  hover3D = true,
  flipOnHover = false,
  backContent,
  className = ''
}) => {
  const [isFlipped, setIsFlipped] = useState(false)

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: 'bg-gradient-to-br from-n64-purple/20 to-purple-900/30',
          border: 'border-n64-purple/50',
          glow: 'shadow-[0_0_30px_rgba(107,70,193,0.3)]',
          hoverGlow: 'hover:shadow-[0_0_50px_rgba(107,70,193,0.5)]'
        }
      case 'secondary':
        return {
          bg: 'bg-gradient-to-br from-n64-blue/20 to-blue-900/30',
          border: 'border-n64-blue/50',
          glow: 'shadow-[0_0_30px_rgba(49,130,206,0.3)]',
          hoverGlow: 'hover:shadow-[0_0_50px_rgba(49,130,206,0.5)]'
        }
      case 'success':
        return {
          bg: 'bg-gradient-to-br from-n64-green/20 to-green-900/30',
          border: 'border-n64-green/50',
          glow: 'shadow-[0_0_30px_rgba(56,161,105,0.3)]',
          hoverGlow: 'hover:shadow-[0_0_50px_rgba(56,161,105,0.5)]'
        }
      case 'danger':
        return {
          bg: 'bg-gradient-to-br from-n64-red/20 to-red-900/30',
          border: 'border-n64-red/50',
          glow: 'shadow-[0_0_30px_rgba(229,62,62,0.3)]',
          hoverGlow: 'hover:shadow-[0_0_50px_rgba(229,62,62,0.5)]'
        }
      default:
        return {
          bg: 'bg-gradient-to-br from-white/10 to-white/5',
          border: 'border-white/20',
          glow: 'shadow-[0_0_30px_rgba(255,255,255,0.1)]',
          hoverGlow: 'hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]'
        }
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'p-4 min-h-[120px]'
      case 'lg':
        return 'p-8 min-h-[300px]'
      default:
        return 'p-6 min-h-[200px]'
    }
  }

  const styles = getVariantStyles()
  const sizeStyles = getSizeStyles()

  const handleMouseEnter = () => {
    if (flipOnHover) {
      setIsFlipped(true)
    }
  }

  const handleMouseLeave = () => {
    if (flipOnHover) {
      setIsFlipped(false)
    }
  }

  return (
    <motion.div
      className={`
        relative
        ${sizeStyles}
        ${styles.bg}
        ${styles.glow}
        ${styles.hoverGlow}
        backdrop-blur-sm
        border-2 ${styles.border}
        rounded-xl
        cursor-pointer
        select-none
        transition-all duration-300
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={hover3D ? {
        scale: 1.05,
        rotateX: -10,
        rotateY: 10,
        z: 50
      } : {}}
      whileTap={{ scale: 0.95 }}
      initial={{ rotateX: 0, rotateY: 0 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* 3D Depth Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-black/20 to-transparent opacity-50 transform translate-x-2 translate-y-2 -z-10" />
      
      {/* Card Content Container */}
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Face */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Glass Reflection Effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-30 pointer-events-none" />
          
          {/* Header */}
          {(title || Icon) && (
            <div className="flex items-center gap-3 mb-4">
              {Icon && (
                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Icon size={24} className="text-white" />
                </div>
              )}
              {title && (
                <h3 className="text-lg font-bold text-white font-game text-shadow">
                  {title}
                </h3>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="relative z-10 text-white">
            {children}
          </div>
          
          {/* Animated Border Glow */}
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-white/30 pointer-events-none"
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Back Face */}
        {flipOnHover && backContent && (
          <div 
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {/* Glass Reflection Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-30 pointer-events-none" />
            
            {/* Back Content */}
            <div className="relative z-10 text-white h-full flex items-center justify-center">
              {backContent}
            </div>
            
            {/* Animated Border Glow */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-white/30 pointer-events-none"
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        )}
      </motion.div>
      
      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/50 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + i * 30}%`,
              top: `${80 - i * 20}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default RetroCard3D