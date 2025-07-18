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
        return 'border-blue-200 bg-blue-50'
      case 'secondary':
        return 'border-gray-200 bg-gray-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'danger':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-gray-200 bg-white'
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