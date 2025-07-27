import React from 'react'
import { safeFormatTime, isValidTimeFormat } from '../utils/timeUtils'

interface LeaderboardTimeDisplayProps {
  time: string | null | undefined
  username?: string
  compact?: boolean
  className?: string
  loading?: boolean
  'aria-label'?: string
}

/**
 * Reusable component for displaying race times in leaderboards
 * Handles error states, loading states, and responsive display
 */
export const LeaderboardTimeDisplay: React.FC<LeaderboardTimeDisplayProps> = ({
  time,
  username,
  compact = false,
  className = '',
  loading = false,
  'aria-label': ariaLabel,
}) => {
  if (loading) {
    return (
      <div className={`${compact ? 'leaderboard-time-compact' : 'leaderboard-time'} ${className}`}>
        <span className="animate-pulse bg-slate-600 rounded w-16 h-4 inline-block"></span>
      </div>
    )
  }

  const formattedTime = safeFormatTime(time)
  const isValid = time ? isValidTimeFormat(time) : false
  
  const finalAriaLabel = ariaLabel || (username 
    ? `Race time: ${formattedTime} for ${username}`
    : `Race time: ${formattedTime}`
  )

  return (
    <span
      className={`${compact ? 'leaderboard-time-compact' : 'leaderboard-time'} ${className} ${
        !isValid && time ? 'text-yellow-400' : ''
      }`}
      aria-label={finalAriaLabel}
      title={!isValid && time ? `Invalid time format: ${time}` : undefined}
    >
      {formattedTime}
      {!isValid && time && (
        <span className="sr-only"> (invalid format, showing fallback)</span>
      )}
    </span>
  )
}

export default LeaderboardTimeDisplay