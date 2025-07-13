'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AnimationSettings {
  animationsEnabled: boolean
  soundEnabled: boolean
  crtEffectsEnabled: boolean
  reducedMotion: boolean
}

interface AnimationContextType {
  settings: AnimationSettings
  updateSettings: (newSettings: Partial<AnimationSettings>) => void
  shouldAnimate: boolean
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AnimationSettings>({
    animationsEnabled: true,
    soundEnabled: true,
    crtEffectsEnabled: true,
    reducedMotion: false,
  })

  // Check for user's reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }))
    }

    setSettings(prev => ({ ...prev, reducedMotion: mediaQuery.matches }))
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const updateSettings = (newSettings: Partial<AnimationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const shouldAnimate = settings.animationsEnabled && !settings.reducedMotion

  return (
    <AnimationContext.Provider value={{ settings, updateSettings, shouldAnimate }}>
      {children}
    </AnimationContext.Provider>
  )
}

export function useAnimation() {
  const context = useContext(AnimationContext)
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider')
  }
  return context
}