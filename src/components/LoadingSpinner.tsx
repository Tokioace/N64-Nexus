import React from 'react'
import { Loader2 } from 'lucide-react'
import './LoadingSpinner.css'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  fullScreen?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  text = 'Laden...',
  fullScreen = false,
}) => {
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32,
  }

  const spinner = (
    <div className={`loading-spinner ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="spinner-content">
        <Loader2 
          size={sizeMap[size]} 
          className="spinner-icon"
        />
        {text && <p className="spinner-text">{text}</p>}
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="loading-overlay">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner