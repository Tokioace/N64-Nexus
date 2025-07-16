import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

interface RetroSwitch3DProps {
  isOn: boolean
  onToggle: () => void
  label?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'secondary'
  className?: string
}

const RetroSwitch3D: React.FC<RetroSwitch3DProps> = ({
  isOn,
  onToggle,
  label,
  size = 'md',
  variant = 'default',
  className = ''
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-12 h-6',
          switch: 'w-5 h-5',
          translate: 'translate-x-6',
          icon: 12
        }
      case 'lg':
        return {
          container: 'w-20 h-10',
          switch: 'w-8 h-8',
          translate: 'translate-x-10',
          icon: 20
        }
      default:
        return {
          container: 'w-16 h-8',
          switch: 'w-7 h-7',
          translate: 'translate-x-8',
          icon: 16
        }
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          onBg: 'bg-gradient-to-r from-n64-purple to-purple-700',
          offBg: 'bg-gradient-to-r from-gray-600 to-gray-800',
          onGlow: 'shadow-[0_0_20px_rgba(107,70,193,0.6)]',
          offGlow: 'shadow-[0_0_10px_rgba(75,85,99,0.4)]'
        }
      case 'secondary':
        return {
          onBg: 'bg-gradient-to-r from-n64-blue to-blue-700',
          offBg: 'bg-gradient-to-r from-gray-600 to-gray-800',
          onGlow: 'shadow-[0_0_20px_rgba(49,130,206,0.6)]',
          offGlow: 'shadow-[0_0_10px_rgba(75,85,99,0.4)]'
        }
      default:
        return {
          onBg: 'bg-gradient-to-r from-n64-green to-green-700',
          offBg: 'bg-gradient-to-r from-gray-600 to-gray-800',
          onGlow: 'shadow-[0_0_20px_rgba(56,161,105,0.6)]',
          offGlow: 'shadow-[0_0_10px_rgba(75,85,99,0.4)]'
        }
    }
  }

  const sizeStyles = getSizeStyles()
  const variantStyles = getVariantStyles()

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {label && (
        <label className="text-white font-game text-sm text-shadow select-none">
          {label}
        </label>
      )}
      
      <motion.div
        className={`
          relative
          ${sizeStyles.container}
          ${isOn ? variantStyles.onBg : variantStyles.offBg}
          ${isOn ? variantStyles.onGlow : variantStyles.offGlow}
          rounded-full
          cursor-pointer
          border-2 border-white/20
          transition-all duration-300
          shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
        `}
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Track Inner Shadow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-black/20 to-transparent" />
        
        {/* Switch Knob */}
        <motion.div
          className={`
            absolute top-0.5 left-0.5
            ${sizeStyles.switch}
            bg-gradient-to-b from-white to-gray-200
            rounded-full
            shadow-[0_4px_8px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.8)]
            border border-gray-300
            flex items-center justify-center
            transition-all duration-300
          `}
          animate={{
            x: isOn ? sizeStyles.translate.replace('translate-x-', '').replace('px', '') : 0,
            rotateZ: isOn ? 180 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        >
          {/* Knob Highlight */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 to-transparent opacity-80" />
          
          {/* Icon */}
          <motion.div
            animate={{ rotateZ: isOn ? -180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOn ? (
              <Moon size={sizeStyles.icon} className="text-gray-600" />
            ) : (
              <Sun size={sizeStyles.icon} className="text-yellow-500" />
            )}
          </motion.div>
        </motion.div>
        
        {/* Track Labels */}
        <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
          <motion.div
            animate={{ opacity: isOn ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Sun size={sizeStyles.icon * 0.6} className="text-white/60" />
          </motion.div>
          <motion.div
            animate={{ opacity: isOn ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon size={sizeStyles.icon * 0.6} className="text-white/60" />
          </motion.div>
        </div>
        
        {/* Animated Glow Ring */}
        <motion.div
          className={`
            absolute inset-0 rounded-full border-2
            ${isOn ? 'border-white/40' : 'border-gray-400/40'}
            pointer-events-none
          `}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  )
}

export default RetroSwitch3D