import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

interface AccessibilitySettings {
  reducedMotion: boolean
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  screenReaderOptimized: boolean
  keyboardNavigation: boolean
  focusIndicators: boolean
  announcements: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void
  setFocusToElement: (elementId: string) => void
  skipToContent: () => void
  isReducedMotion: boolean
  isHighContrast: boolean
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

const defaultSettings: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
  screenReaderOptimized: false,
  keyboardNavigation: true,
  focusIndicators: true,
  announcements: true
}

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLanguage()
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('accessibility-settings')
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) }
      } catch {
        return defaultSettings
      }
    }
    return defaultSettings
  })

  // Detect system preferences
  useEffect(() => {
    // Detect reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e: MediaQueryListEvent) => {
      updateSetting('reducedMotion', e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    if (mediaQuery.matches) {
      updateSetting('reducedMotion', true)
    }

    // Detect high contrast preference
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    const handleContrastChange = (e: MediaQueryListEvent) => {
      updateSetting('highContrast', e.matches)
    }
    
    contrastQuery.addEventListener('change', handleContrastChange)
    if (contrastQuery.matches) {
      updateSetting('highContrast', true)
    }

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
      contrastQuery.removeEventListener('change', handleContrastChange)
    }
  }, [])

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement
    
    // Apply font size
    root.style.setProperty('--base-font-size', getFontSizeValue(settings.fontSize))
    
    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Apply reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }
    
    // Apply focus indicators
    if (settings.focusIndicators) {
      root.classList.add('focus-indicators')
    } else {
      root.classList.remove('focus-indicators')
    }

    // Save settings to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))
  }, [settings])

  // Keyboard navigation setup
  useEffect(() => {
    if (!settings.keyboardNavigation) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip to main content with Alt + S
      if (event.altKey && event.key === 's') {
        event.preventDefault()
        skipToContent()
        announceToScreenReader(t('accessibility.skippedToContent'))
      }
      
      // Skip to navigation with Alt + N
      if (event.altKey && event.key === 'n') {
        event.preventDefault()
        setFocusToElement('main-navigation')
        announceToScreenReader(t('accessibility.skippedToNavigation'))
      }
      
      // Escape key to close modals/dropdowns
      if (event.key === 'Escape') {
        const activeElement = document.activeElement as HTMLElement
        if (activeElement?.getAttribute('role') === 'dialog') {
          const closeButton = activeElement.querySelector('[aria-label*="close"], [aria-label*="schließen"]') as HTMLElement
          closeButton?.click()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [settings.keyboardNavigation, t])

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const announceToScreenReader = useCallback((
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    if (!settings.announcements) return

    // Create or update announcement element
    let announcer = document.getElementById('screen-reader-announcer') as HTMLElement
    if (!announcer) {
      announcer = document.createElement('div')
      announcer.id = 'screen-reader-announcer'
      announcer.setAttribute('aria-live', priority)
      announcer.setAttribute('aria-atomic', 'true')
      announcer.style.position = 'absolute'
      announcer.style.left = '-10000px'
      announcer.style.width = '1px'
      announcer.style.height = '1px'
      announcer.style.overflow = 'hidden'
      document.body.appendChild(announcer)
    }

    // Update the message
    announcer.setAttribute('aria-live', priority)
    announcer.textContent = message

    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = ''
    }, 1000)
  }, [settings.announcements])

  const setFocusToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId) as HTMLElement
    if (element) {
      element.focus()
      // Ensure element is visible
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  const skipToContent = useCallback(() => {
    const mainContent = document.getElementById('main-content') || 
                       document.querySelector('main') ||
                       document.querySelector('[role="main"]') as HTMLElement
    
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const getFontSizeValue = (size: AccessibilitySettings['fontSize']): string => {
    switch (size) {
      case 'small': return '14px'
      case 'medium': return '16px'
      case 'large': return '18px'
      case 'extra-large': return '20px'
      default: return '16px'
    }
  }

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    announceToScreenReader,
    setFocusToElement,
    skipToContent,
    isReducedMotion: settings.reducedMotion,
    isHighContrast: settings.highContrast
  }

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      
      {/* Skip Links */}
      <div className="skip-links">
        <button
          className="skip-link"
          onClick={skipToContent}
          onKeyDown={(e) => e.key === 'Enter' && skipToContent()}
        >
          {t('accessibility.skipToContent')}
        </button>
        <button
          className="skip-link"
          onClick={() => setFocusToElement('main-navigation')}
          onKeyDown={(e) => e.key === 'Enter' && setFocusToElement('main-navigation')}
        >
          {t('accessibility.skipToNavigation')}
        </button>
      </div>
    </AccessibilityContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

// Hook for components to announce changes
// eslint-disable-next-line react-refresh/only-export-components
export const useAnnouncement = () => {
  const { announceToScreenReader } = useAccessibility()
  return announceToScreenReader
}

// Hook for focus management
// eslint-disable-next-line react-refresh/only-export-components
export const useFocusManagement = () => {
  const { setFocusToElement, skipToContent } = useAccessibility()
  
  const manageFocus = useCallback((action: 'next' | 'previous' | 'first' | 'last', container?: HTMLElement) => {
    const focusableElements = (container || document).querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>
    
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as HTMLElement)
    
    let targetIndex: number
    switch (action) {
      case 'next':
        targetIndex = (currentIndex + 1) % focusableElements.length
        break
      case 'previous':
        targetIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1
        break
      case 'first':
        targetIndex = 0
        break
      case 'last':
        targetIndex = focusableElements.length - 1
        break
    }
    
    focusableElements[targetIndex]?.focus()
  }, [])
  
  return { setFocusToElement, skipToContent, manageFocus }
}

// Accessibility testing helper
// eslint-disable-next-line react-refresh/only-export-components
export const useAccessibilityTesting = () => {
  const checkColorContrast = useCallback((foreground: string, background: string): number => {
    // Simplified contrast ratio calculation
    // In a real implementation, you'd use a proper color contrast library
    const getLuminance = (color: string): number => {
      // This is a simplified version - use a proper color library in production
      const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0]
      const [r, g, b] = rgb.map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    
    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    
    return (lighter + 0.05) / (darker + 0.05)
  }, [])
  
  const checkFocusIndicators = useCallback((): boolean => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    let hasProperFocus = true
    focusableElements.forEach(element => {
      const styles = window.getComputedStyle(element, ':focus')
      if (!styles.outline && !styles.boxShadow && !styles.border) {
        hasProperFocus = false
      }
    })
    
    return hasProperFocus
  }, [])
  
  return { checkColorContrast, checkFocusIndicators }
}