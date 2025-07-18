import React from 'react'
import { LucideIcon } from 'lucide-react'

interface SimpleButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  disabled?: boolean
  className?: string
}

const SimpleButton: React.FC<SimpleButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  className = ''
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-xl'
      case 'secondary':
        return 'bg-slate-700 hover:bg-slate-600 text-slate-100 shadow-lg hover:shadow-xl'
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-xl'
      case 'danger':
        return 'bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-xl'
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg hover:shadow-xl'
      default:
        return 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-xl'
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'md':
        return 'px-4 py-2 text-base'
      case 'lg':
        return 'px-6 py-3 text-lg'
      default:
        return 'px-4 py-2 text-base'
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        font-medium rounded-lg transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  )
}

export default SimpleButton