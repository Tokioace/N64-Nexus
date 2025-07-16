import React, { useRef, useCallback } from 'react'

interface RetroSoundEffectsProps {
  enabled?: boolean
}

const RetroSoundEffects: React.FC<RetroSoundEffectsProps> = ({ enabled = true }) => {
  const audioContextRef = useRef<AudioContext | null>(null)

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current && enabled) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [enabled])

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'square') => {
    if (!enabled) return

    const context = initAudioContext()
    if (!context) return

    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    oscillator.frequency.setValueAtTime(frequency, context.currentTime)
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.1, context.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration)

    oscillator.start(context.currentTime)
    oscillator.stop(context.currentTime + duration)
  }, [enabled, initAudioContext])

  const playClickSound = useCallback(() => {
    playTone(800, 0.1, 'square')
  }, [playTone])

  const playHoverSound = useCallback(() => {
    playTone(400, 0.05, 'square')
  }, [playTone])

  const playSuccessSound = useCallback(() => {
    playTone(523, 0.2, 'square') // C5
    setTimeout(() => playTone(659, 0.2, 'square'), 100) // E5
    setTimeout(() => playTone(784, 0.3, 'square'), 200) // G5
  }, [playTone])

  const playErrorSound = useCallback(() => {
    playTone(200, 0.3, 'sawtooth')
  }, [playTone])

  const playStartSound = useCallback(() => {
    playTone(440, 0.1, 'square') // A4
    setTimeout(() => playTone(554, 0.1, 'square'), 100) // C#5
    setTimeout(() => playTone(659, 0.1, 'square'), 200) // E5
    setTimeout(() => playTone(880, 0.2, 'square'), 300) // A5
  }, [playTone])

  const playPowerUpSound = useCallback(() => {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        playTone(220 + i * 50, 0.05, 'square')
      }, i * 30)
    }
  }, [playTone])

  // Expose sound functions globally for easy access
  React.useEffect(() => {
    if (enabled) {
      ;(window as any).retroSounds = {
        click: playClickSound,
        hover: playHoverSound,
        success: playSuccessSound,
        error: playErrorSound,
        start: playStartSound,
        powerUp: playPowerUpSound,
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [enabled, playClickSound, playHoverSound, playSuccessSound, playErrorSound, playStartSound, playPowerUpSound])

  return null // This component doesn't render anything
}

// Hook for using retro sounds
export const useRetroSounds = () => {
  const playClickSound = useCallback(() => {
    ;(window as any).retroSounds?.click?.()
  }, [])

  const playHoverSound = useCallback(() => {
    ;(window as any).retroSounds?.hover?.()
  }, [])

  const playSuccessSound = useCallback(() => {
    ;(window as any).retroSounds?.success?.()
  }, [])

  const playErrorSound = useCallback(() => {
    ;(window as any).retroSounds?.error?.()
  }, [])

  const playStartSound = useCallback(() => {
    ;(window as any).retroSounds?.start?.()
  }, [])

  const playPowerUpSound = useCallback(() => {
    ;(window as any).retroSounds?.powerUp?.()
  }, [])

  return {
    playClickSound,
    playHoverSound,
    playSuccessSound,
    playErrorSound,
    playStartSound,
    playPowerUpSound,
  }
}

export default RetroSoundEffects