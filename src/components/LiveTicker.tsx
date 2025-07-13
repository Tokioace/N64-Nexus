import React, { useState, useEffect, useRef } from 'react'
import './LiveTicker.css'

interface TickerItem {
  id: number
  time: string
  user: string
  action: string
  type: 'submission' | 'screenshot' | 'update' | 'livestream' | 'admin' | 'record'
}

interface LiveTickerProps {
  items: TickerItem[]
}

const LiveTicker: React.FC<LiveTickerProps> = ({ items }) => {
  const [isPaused, setIsPaused] = useState(false)
  const [showLivestream, setShowLivestream] = useState(false)
  const [newItems, setNewItems] = useState<Set<number>>(new Set())
  const tickerRef = useRef<HTMLDivElement>(null)

  // Simulate new items being added
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        const randomItem = items[Math.floor(Math.random() * items.length)]
        setNewItems(prev => new Set([...prev, randomItem.id]))
        
        // Remove blink effect after 3 seconds
        setTimeout(() => {
          setNewItems(prev => {
            const newSet = new Set(prev)
            newSet.delete(randomItem.id)
            return newSet
          })
        }, 3000)
      }
    }, 5000) // Add new item every 5 seconds

    return () => clearInterval(interval)
  }, [items, isPaused])

  const getItemIcon = (type: TickerItem['type']) => {
    switch (type) {
      case 'submission':
        return '🏁'
      case 'screenshot':
        return '📷'
      case 'update':
        return '🔄'
      case 'livestream':
        return '🔥'
      case 'admin':
        return '⚡'
      case 'record':
        return '🏆'
      default:
        return '📢'
    }
  }

  const getItemClass = (type: TickerItem['type']) => {
    const baseClass = 'ticker-item'
    const typeClass = `ticker-item-${type}`
    return `${baseClass} ${typeClass}`
  }

  const handlePauseToggle = () => {
    setIsPaused(!isPaused)
  }

  const handleLivestreamToggle = () => {
    setShowLivestream(!showLivestream)
  }

  const livestreamItems = items.filter(item => item.type === 'livestream')

  return (
    <div className="live-ticker-container">
      {/* Livestream Banner */}
      {showLivestream && livestreamItems.length > 0 && (
        <div className="livestream-banner fade-in">
          <div className="livestream-content">
            <span className="livestream-icon">🔥</span>
            <span className="livestream-text">
              {livestreamItems[0].user} läuft live!
            </span>
            <button 
              className="retro-button livestream-close"
              onClick={handleLivestreamToggle}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Ticker Controls */}
      <div className="ticker-controls">
        <button 
          className={`retro-button control-btn ${isPaused ? 'paused' : ''}`}
          onClick={handlePauseToggle}
        >
          {isPaused ? '▶️' : '⏸️'} {isPaused ? 'Fortsetzen' : 'Pausieren'}
        </button>
        
        {livestreamItems.length > 0 && (
          <button 
            className={`retro-button control-btn ${showLivestream ? 'active' : ''}`}
            onClick={handleLivestreamToggle}
          >
            🔥 Livestream {showLivestream ? 'Aus' : 'An'}
          </button>
        )}
      </div>

      {/* Ticker Display */}
      <div className="ticker-display pixel-border">
        <div 
          ref={tickerRef}
          className={`ticker-content ${isPaused ? 'paused' : ''}`}
        >
          {items.map((item) => (
            <div 
              key={item.id}
              className={`${getItemClass(item.type)} ${newItems.has(item.id) ? 'new-item' : ''}`}
            >
              <span className="ticker-time">[{item.time}]</span>
              <span className="ticker-icon">{getItemIcon(item.type)}</span>
              <span className="ticker-user">{item.user}</span>
              <span className="ticker-action">{item.action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ticker Stats */}
      <div className="ticker-stats">
        <div className="stat-item">
          <span className="stat-label">Aktive Updates:</span>
          <span className="stat-value">{items.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Status:</span>
          <span className="stat-value">{isPaused ? 'Pausiert' : 'Live'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Livestreams:</span>
          <span className="stat-value">{livestreamItems.length}</span>
        </div>
      </div>
    </div>
  )
}

export default LiveTicker