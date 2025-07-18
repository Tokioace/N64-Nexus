import React from 'react'

interface SimpleCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

const SimpleCard: React.FC<SimpleCardProps> = ({
  children,
  className = '',
  onClick,
  variant = 'default',
  size = 'md',
  hoverable = false
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'border-blue-600 bg-blue-900/30 text-blue-100'
      case 'secondary':
        return 'border-slate-600 bg-slate-800 text-slate-100'
      case 'success':
        return 'border-emerald-600 bg-emerald-900/30 text-emerald-100'
      case 'danger':
        return 'border-red-600 bg-red-900/30 text-red-100'
      case 'warning':
        return 'border-amber-600 bg-amber-900/30 text-amber-100'
      default:
        return 'border-slate-700 bg-slate-800 text-slate-100'
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'p-4'
      case 'md':
        return 'p-6'
      case 'lg':
        return 'p-8'
      default:
        return 'p-6'
    }
  }

  const baseStyles = `
    ${getVariantStyles()}
    ${getSizeStyles()}
    border rounded-lg shadow-sm
    ${hoverable ? 'hover:shadow-md transition-shadow duration-200' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `

  return (
    <div
      className={baseStyles}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default SimpleCard