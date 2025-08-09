/**
 * Accessibility Enhancements for Battle64
 * Provides skip links, focus management, and other a11y improvements
 */

import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

interface SkipLink {
  href: string
  label: string
}

const AccessibilityEnhancements: React.FC = () => {
  const location = useLocation()
  const { t } = useLanguage()
  const [skipLinks, setSkipLinks] = useState<SkipLink[]>([])

  // Update skip links based on current page
  useEffect(() => {
    const updateSkipLinks = () => {
      const links: SkipLink[] = [
        { href: '#main-content', label: t('a11y.skipToMain') || 'Skip to main content' }
      ]

      // Add navigation skip link if nav exists
      if (document.querySelector('nav')) {
        links.unshift({ href: '#main-navigation', label: t('a11y.skipToNav') || 'Skip to navigation' })
      }

      // Add search skip link on pages with search
      if (document.querySelector('[role="search"]') || document.querySelector('input[type="search"]')) {
        links.push({ href: '#search', label: t('a11y.skipToSearch') || 'Skip to search' })
      }

      setSkipLinks(links)
    }

    // Update skip links after a short delay to ensure DOM is ready
    const timer = setTimeout(updateSkipLinks, 100)
    return () => clearTimeout(timer)
  }, [location.pathname, t])

  // Manage focus for route changes (for screen reader users)
  useEffect(() => {
    const focusMainContent = () => {
      const mainContent = document.getElementById('main-content')
      if (mainContent) {
        // Set tabindex to make it focusable, then focus and remove
        mainContent.setAttribute('tabindex', '-1')
        mainContent.focus()
        
        // Remove tabindex after focus to avoid interfering with normal tab order
        const handleBlur = () => {
          mainContent.removeAttribute('tabindex')
          mainContent.removeEventListener('blur', handleBlur)
        }
        mainContent.addEventListener('blur', handleBlur)
      }
    }

    // Focus main content on route change (after a short delay)
    const timer = setTimeout(focusMainContent, 150)
    return () => clearTimeout(timer)
  }, [location.pathname])

  const handleSkipLinkClick = (href: string) => {
    const target = document.querySelector(href)
    if (target) {
      // Ensure the target is focusable
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1')
      }
      
      // Focus the target element
      ;(target as HTMLElement).focus()
      
      // Scroll into view if needed
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* Skip Links */}
      <div className="skip-links">
        {skipLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="skip-link"
            onClick={(e) => {
              e.preventDefault()
              handleSkipLinkClick(link.href)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleSkipLinkClick(link.href)
              }
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Live Region for Dynamic Content Announcements */}
      <div
        id="live-region"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      />

      {/* Alert Region for Important Messages */}
      <div
        id="alert-region"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        role="alert"
      />

      {/* Focus Trap Helper (invisible) */}
      <div
        id="focus-trap-start"
        tabIndex={0}
        className="sr-only"
        onFocus={(e) => {
          // If focus reaches here, redirect to last focusable element
          const focusableElements = document.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
          )
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
          if (lastElement) lastElement.focus()
        }}
      />
    </>
  )
}

export default AccessibilityEnhancements