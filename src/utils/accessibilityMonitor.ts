/**
 * Accessibility monitoring utility for Battle64
 * Integrates with axe-core for comprehensive accessibility testing and reporting
 */

import { logger } from '../lib/logger'

interface AccessibilityViolation {
  id: string
  impact: 'minor' | 'moderate' | 'serious' | 'critical'
  description: string
  help: string
  helpUrl: string
  nodes: Array<{
    target: string[]
    html: string
    failureSummary: string
  }>
  tags: string[]
}

interface AccessibilityReport {
  violations: AccessibilityViolation[]
  passes: number
  incomplete: number
  inapplicable: number
  timestamp: number
  url: string
}

class AccessibilityMonitor {
  private isInitialized = false
  private axe: any = null
  private reports: AccessibilityReport[] = []

  /**
   * Initialize accessibility monitoring
   */
  async init(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') {
      return
    }

    try {
      // Dynamically import axe-core only when needed
      const axeModule = await import('axe-core')
      this.axe = axeModule.default

      // Configure axe with Battle64-specific rules
      this.configureAxe()
      
      this.isInitialized = true
      logger.debug('Accessibility monitoring initialized')
    } catch (error) {
      logger.error('Failed to initialize accessibility monitoring:', error)
    }
  }

  /**
   * Configure axe-core with Battle64-specific settings
   */
  private configureAxe(): void {
    if (!this.axe) return

    // Configure axe to focus on WCAG 2.1 AA compliance
    this.axe.configure({
      rules: {
        // Enable important accessibility rules
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true },
        'aria-labels': { enabled: true },
        'semantic-html': { enabled: true },
        
        // Gaming-specific accessibility considerations
        'motion-reduction': { enabled: true },
        'audio-control': { enabled: true },
        
        // Disable rules that might conflict with gaming UI
        'region': { enabled: false }, // Gaming UIs often have complex layouts
      },
      tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']
    })
  }

  /**
   * Run accessibility audit on the current page
   */
  async auditPage(element?: Element): Promise<AccessibilityReport | null> {
    if (!this.isInitialized || !this.axe) {
      logger.warn('Accessibility monitor not initialized')
      return null
    }

    try {
      const target = element || document.body
      const results = await this.axe.run(target)

      const report: AccessibilityReport = {
        violations: results.violations.map(this.formatViolation),
        passes: results.passes.length,
        incomplete: results.incomplete.length,
        inapplicable: results.inapplicable.length,
        timestamp: Date.now(),
        url: window.location.href
      }

      this.reports.push(report)
      this.logResults(report)
      this.storeReport(report)

      return report
    } catch (error) {
      logger.error('Failed to run accessibility audit:', error)
      return null
    }
  }

  /**
   * Format violation for consistent reporting
   */
  private formatViolation = (violation: any): AccessibilityViolation => ({
    id: violation.id,
    impact: violation.impact,
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    nodes: violation.nodes.map((node: any) => ({
      target: node.target,
      html: node.html,
      failureSummary: node.failureSummary || ''
    })),
    tags: violation.tags
  })

  /**
   * Log accessibility results
   */
  private logResults(report: AccessibilityReport): void {
    const { violations, passes } = report

    if (violations.length === 0) {
      logger.info(`✅ Accessibility audit passed! ${passes} checks successful`)
      return
    }

    // Group violations by impact level
    const critical = violations.filter(v => v.impact === 'critical')
    const serious = violations.filter(v => v.impact === 'serious')
    const moderate = violations.filter(v => v.impact === 'moderate')
    const minor = violations.filter(v => v.impact === 'minor')

    // Log summary
    logger.warn(`🚨 Accessibility violations found:`)
    logger.warn(`  Critical: ${critical.length}`)
    logger.warn(`  Serious: ${serious.length}`)
    logger.warn(`  Moderate: ${moderate.length}`)
    logger.warn(`  Minor: ${minor.length}`)
    logger.info(`  Passes: ${passes}`)

    // Log critical and serious violations in detail
    const criticalAndSerious = critical.concat(serious)
    criticalAndSerious.forEach(violation => {
      logger.error(`❌ ${violation.impact.toUpperCase()}: ${violation.description}`)
      logger.error(`   Help: ${violation.help}`)
      logger.error(`   More info: ${violation.helpUrl}`)
      
      violation.nodes.forEach(node => {
        logger.error(`   Element: ${node.target.join(' > ')}`)
        if (node.failureSummary) {
          logger.error(`   Issue: ${node.failureSummary}`)
        }
      })
    })
  }

  /**
   * Store accessibility report for analysis
   */
  private storeReport(report: AccessibilityReport): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const existingReports = JSON.parse(localStorage.getItem('battle64-accessibility-reports') || '[]')
        existingReports.push(report)
        
        // Keep only last 50 reports to avoid storage bloat
        const recentReports = existingReports.slice(-50)
        localStorage.setItem('battle64-accessibility-reports', JSON.stringify(recentReports))
      } catch (error) {
        logger.warn('Failed to store accessibility report:', error)
      }
    }
  }

  /**
   * Get accessibility recommendations for Battle64
   */
  getRecommendations(): string[] {
    return [
      // Gaming-specific accessibility recommendations
      '🎮 Provide keyboard alternatives for all mouse interactions',
      '🎨 Ensure color contrast ratio of at least 4.5:1 for normal text',
      '🔊 Include captions or transcripts for audio content',
      '⚡ Provide options to reduce motion and animations',
      '🎯 Make all interactive elements focusable and clearly indicated',
      '📱 Ensure touch targets are at least 44x44 pixels',
      '🏷️ Use semantic HTML elements and proper ARIA labels',
      '⌨️ Implement logical tab order throughout the application',
      '🔍 Provide skip links for main navigation',
      '📋 Use descriptive form labels and error messages',
      '🎪 Ensure sufficient spacing between interactive elements',
      '🌟 Provide clear visual focus indicators',
      '📖 Use headings to structure content hierarchically',
      '🎭 Provide alternative text for all images and icons',
      '⏸️ Allow users to pause auto-playing content'
    ]
  }

  /**
   * Check for common gaming accessibility issues
   */
  async checkGamingAccessibility(): Promise<string[]> {
    const issues: string[] = []

    try {
      // Check for motion reduction support
      if (!window.matchMedia('(prefers-reduced-motion)').matches) {
        const animatedElements = document.querySelectorAll('[class*="animate"], [class*="transition"]')
        if (animatedElements.length > 0) {
          issues.push('Consider respecting prefers-reduced-motion user preference')
        }
      }

      // Check for keyboard navigation
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]')
      const focusableElements = Array.from(interactiveElements).filter(el => {
        return (el as HTMLElement).tabIndex >= 0
      })
      
      if (focusableElements.length !== interactiveElements.length) {
        issues.push('Some interactive elements may not be keyboard accessible')
      }

      // Check for color-only information
      const colorOnlyElements = document.querySelectorAll('[style*="color"]:not([aria-label]):not([title])')
      if (colorOnlyElements.length > 0) {
        issues.push('Avoid using color as the only way to convey information')
      }

      // Check for proper heading structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      if (headings.length === 0) {
        issues.push('Page should have a proper heading structure')
      }

    } catch (error) {
      logger.error('Error checking gaming accessibility:', error)
    }

    return issues
  }

  /**
   * Get all stored reports
   */
  getReports(): AccessibilityReport[] {
    return [...this.reports]
  }

  /**
   * Get accessibility summary
   */
  getSummary(): { totalViolations: number; criticalIssues: number; averageScore: number } {
    if (this.reports.length === 0) {
      return { totalViolations: 0, criticalIssues: 0, averageScore: 100 }
    }

    const totalViolations = this.reports.reduce((sum, report) => sum + report.violations.length, 0)
    const criticalIssues = this.reports.reduce((sum, report) => 
      sum + report.violations.filter(v => v.impact === 'critical').length, 0
    )
    
    const totalPasses = this.reports.reduce((sum, report) => sum + report.passes, 0)
    const totalTests = totalPasses + totalViolations
    const averageScore = totalTests > 0 ? Math.round((totalPasses / totalTests) * 100) : 100

    return { totalViolations, criticalIssues, averageScore }
  }

  /**
   * Clear all reports
   */
  clearReports(): void {
    this.reports = []
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('battle64-accessibility-reports')
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.isInitialized = false
    this.axe = null
  }
}

// Create singleton instance
export const accessibilityMonitor = new AccessibilityMonitor()

/**
 * Initialize accessibility monitoring
 */
export const initAccessibilityMonitoring = async (): Promise<void> => {
  await accessibilityMonitor.init()
}

/**
 * Quick accessibility check for development
 */
export const quickA11yCheck = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    const report = await accessibilityMonitor.auditPage()
    if (report && report.violations.length > 0) {
      console.group('🚨 Accessibility Issues Found')
      report.violations.forEach(violation => {
        console.warn(`${violation.impact.toUpperCase()}: ${violation.description}`)
        console.info(`Help: ${violation.helpUrl}`)
      })
      console.groupEnd()
    }
  }
}