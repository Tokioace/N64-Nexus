/**
 * Time utilities for leaderboard display and validation
 */

export const TIME_REGEX = /^\d{1,2}:\d{2}\.\d{3}$/

/**
 * Validates if a time string matches the expected format (MM:SS.mmm)
 */
export const isValidTimeFormat = (time: string): boolean => {
  if (!time || typeof time !== 'string') return false
  return TIME_REGEX.test(time.trim())
}

/**
 * Safely formats a time string for display, with fallback for invalid formats
 */
export const safeFormatTime = (time: string | null | undefined): string => {
  if (!time) return '0:00.000'
  
  const trimmedTime = time.trim()
  if (!isValidTimeFormat(trimmedTime)) {
    // Try to parse and fix common issues
    if (/^\d+$/.test(trimmedTime)) {
      // Pure seconds, convert to MM:SS.mmm
      const seconds = parseFloat(trimmedTime)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = (seconds % 60).toFixed(3)
      return `${minutes}:${remainingSeconds.padStart(6, '0')}`
    }
    
    // If we can't parse it, return a safe fallback
    console.warn(`Invalid time format: ${time}`)
    return '0:00.000'
  }
  
  return trimmedTime
}

/**
 * Converts time string to seconds for comparison/sorting
 */
export const timeToSeconds = (time: string): number => {
  const safeTime = safeFormatTime(time)
  const [minutes, seconds] = safeTime.split(':')
  return parseInt(minutes) * 60 + parseFloat(seconds)
}

/**
 * Checks if a time is within reasonable bounds for N64 games
 */
export const isReasonableTime = (time: string): boolean => {
  const seconds = timeToSeconds(time)
  // Reasonable bounds: 1 second to 99 minutes
  return seconds >= 1 && seconds <= 5940 // 99:00.000
}

/**
 * Gets the display width needed for a time string (for responsive design)
 */
export const getTimeDisplayWidth = (time: string): 'short' | 'medium' | 'long' => {
  const safeTime = safeFormatTime(time)
  if (safeTime.length <= 7) return 'short'    // 1:23.456
  if (safeTime.length <= 8) return 'medium'   // 12:34.567
  return 'long'                               // 99:59.999
}