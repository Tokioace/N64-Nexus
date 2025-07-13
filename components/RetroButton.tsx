'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useAnimation } from './AnimationProvider'

interface RetroButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  icon?: React.ReactNode
}

export function RetroButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
}: RetroButtonProps) {
  const { shouldAnimate } = useAnimation()

  const variants = {
    primary: 'bg-n64-purple text-white border-n64-purple',
    secondary: 'bg-retro-gray text-crt-green border-n64-blue',
    success: 'bg-n64-green text-white border-n64-green',
    danger: 'bg-n64-red text-white border-n64-red',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const baseClasses = `joypad-button font-pixel rounded-lg border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${variants[variant]} ${sizes[size]} ${className}`

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${disabledClasses}`}
      whileHover={shouldAnimate && !disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={shouldAnimate && !disabled ? { scale: 0.95, y: 0 } : {}}
      animate={shouldAnimate ? {
        boxShadow: disabled ? 'none' : [
          '0 4px 8px rgba(0, 0, 0, 0.5)',
          '0 6px 12px rgba(0, 0, 0, 0.6)',
          '0 4px 8px rgba(0, 0, 0, 0.5)',
        ]
      } : {}}
      transition={{
        duration: 0.2,
        repeat: shouldAnimate ? Infinity : 0,
        repeatType: 'reverse',
      }}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </motion.button>
  )
}