import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { useRetroSounds } from './RetroSoundEffects'

interface RetroButton3DProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  disabled?: boolean
  className?: string
}

const RetroButton3D: React.FC<RetroButton3DProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  className = ''
}) => {
  const { playClickSound, playHoverSound } = useRetroSounds()
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: 'bg-gradient-to-b from-n64-purple to-purple-800',
          shadow: 'shadow-[0_8px_0_#553C9A,0_12px_20px_rgba(107,70,193,0.4)]',
          hoverShadow: 'hover:shadow-[0_6px_0_#553C9A,0_8px_15px_rgba(107,70,193,0.6)]',
          activeShadow: 'active:shadow-[0_2px_0_#553C9A,0_4px_8px_rgba(107,70,193,0.8)]',
          glow: 'hover:shadow-[0_0_30px_rgba(107,70,193,0.8)]'
        }
      case 'secondary':
        return {
          bg: 'bg-gradient-to-b from-n64-blue to-blue-800',
          shadow: 'shadow-[0_8px_0_#2C5282,0_12px_20px_rgba(49,130,206,0.4)]',
          hoverShadow: 'hover:shadow-[0_6px_0_#2C5282,0_8px_15px_rgba(49,130,206,0.6)]',
          activeShadow: 'active:shadow-[0_2px_0_#2C5282,0_4px_8px_rgba(49,130,206,0.8)]',
          glow: 'hover:shadow-[0_0_30px_rgba(49,130,206,0.8)]'
        }
      case 'success':
        return {
          bg: 'bg-gradient-to-b from-n64-green to-green-800',
          shadow: 'shadow-[0_8px_0_#2F855A,0_12px_20px_rgba(56,161,105,0.4)]',
          hoverShadow: 'hover:shadow-[0_6px_0_#2F855A,0_8px_15px_rgba(56,161,105,0.6)]',
          activeShadow: 'active:shadow-[0_2px_0_#2F855A,0_4px_8px_rgba(56,161,105,0.8)]',
          glow: 'hover:shadow-[0_0_30px_rgba(56,161,105,0.8)]'
        }
      case 'danger':
        return {
          bg: 'bg-gradient-to-b from-n64-red to-red-800',
          shadow: 'shadow-[0_8px_0_#C53030,0_12px_20px_rgba(229,62,62,0.4)]',
          hoverShadow: 'hover:shadow-[0_6px_0_#C53030,0_8px_15px_rgba(229,62,62,0.6)]',
          activeShadow: 'active:shadow-[0_2px_0_#C53030,0_4px_8px_rgba(229,62,62,0.8)]',
          glow: 'hover:shadow-[0_0_30px_rgba(229,62,62,0.8)]'
        }
      case 'warning':
        return {
          bg: 'bg-gradient-to-b from-n64-yellow to-yellow-800',
          shadow: 'shadow-[0_8px_0_#B7791F,0_12px_20px_rgba(214,158,46,0.4)]',
          hoverShadow: 'hover:shadow-[0_6px_0_#B7791F,0_8px_15px_rgba(214,158,46,0.6)]',
          activeShadow: 'active:shadow-[0_2px_0_#B7791F,0_4px_8px_rgba(214,158,46,0.8)]',
          glow: 'hover:shadow-[0_0_30px_rgba(214,158,46,0.8)]'
        }
      default:
        return {
          bg: 'bg-gradient-to-b from-n64-purple to-purple-800',
          shadow: 'shadow-[0_8px_0_#553C9A,0_12px_20px_rgba(107,70,193,0.4)]',
          hoverShadow: 'hover:shadow-[0_6px_0_#553C9A,0_8px_15px_rgba(107,70,193,0.6)]',
          activeShadow: 'active:shadow-[0_2px_0_#553C9A,0_4px_8px_rgba(107,70,193,0.8)]',
          glow: 'hover:shadow-[0_0_30px_rgba(107,70,193,0.8)]'
        }
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm'
      case 'lg':
        return 'px-8 py-4 text-lg'
      default:
        return 'px-6 py-3 text-base'
    }
  }

  const styles = getVariantStyles()
  const sizeStyles = getSizeStyles()

  const handleClick = () => {
    if (!disabled) {
      playClickSound()
      onClick?.()
    }
  }

  const handleMouseEnter = () => {
    if (!disabled) {
      playHoverSound()
    }
  }

  return (
    <motion.button
      className={`
        relative inline-flex items-center justify-center gap-2
        ${styles.bg}
        ${styles.shadow}
        ${styles.hoverShadow}
        ${styles.activeShadow}
        ${styles.glow}
        ${sizeStyles}
        text-white font-bold
        rounded-lg
        transform-gpu
        transition-all duration-150 ease-out
        hover:translate-y-[-2px]
        active:translate-y-[2px]
        border-2 border-white/20
        font-game
        select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled}
      whileHover={disabled ? {} : { 
        scale: 1.05,
        rotateX: -5,
        rotateY: 5
      }}
      whileTap={disabled ? {} : { 
        scale: 0.95,
        rotateX: 5,
        rotateY: -5
      }}
      initial={{ rotateX: 0, rotateY: 0 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* 3D Face Highlight */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/30 to-transparent opacity-50 pointer-events-none" />
      
      {/* Side Faces for 3D Effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-black/20 to-transparent opacity-30 pointer-events-none transform translate-x-1 translate-y-1" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
        <span className="text-shadow-sm">{children}</span>
      </div>
      
      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 pointer-events-none"
        animate={{
          x: ['-100%', '100%'],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut'
        }}
      />
    </motion.button>
  )
}

export default RetroButton3D