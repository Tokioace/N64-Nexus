/**
 * Performance monitoring utility for Battle64
 * Tracks Core Web Vitals and other important performance metrics
 */

import { logger } from '../lib/logger'

// Core Web Vitals thresholds (Google recommended)
const PERFORMANCE_THRESHOLDS = {
  // Largest Contentful Paint (LCP) - measures loading performance
  LCP_GOOD: 2500, // milliseconds
  LCP_NEEDS_IMPROVEMENT: 4000,
  
  // First Input Delay (FID) - measures interactivity
  FID_GOOD: 100, // milliseconds
  FID_NEEDS_IMPROVEMENT: 300,
  
  // Cumulative Layout Shift (CLS) - measures visual stability
  CLS_GOOD: 0.1,
  CLS_NEEDS_IMPROVEMENT: 0.25,
  
  // First Contentful Paint (FCP)
  FCP_GOOD: 1800,
  FCP_NEEDS_IMPROVEMENT: 3000,
  
  // Time to First Byte (TTFB)
  TTFB_GOOD: 800,
  TTFB_NEEDS_IMPROVEMENT: 1800
} as const

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
  url: string
}

interface NavigationTiming {
  dns: number
  tcp: number
  request: number
  response: number
  dom: number
  load: number
  total: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private observer: PerformanceObserver | null = null
  private isInitialized = false

  /**
   * Initialize performance monitoring
   */
  init(): void {
    if (this.isInitialized || typeof window === 'undefined') {
      return
    }

    try {
      this.initWebVitals()
      this.initNavigationTiming()
      this.initResourceTiming()
      this.isInitialized = true
      
      logger.debug('Performance monitoring initialized')
    } catch (error) {
      logger.error('Failed to initialize performance monitoring:', error)
    }
  }

  /**
   * Initialize Core Web Vitals monitoring
   */
  private initWebVitals(): void {
    if (!('PerformanceObserver' in window)) {
      logger.warn('PerformanceObserver not supported, skipping Web Vitals monitoring')
      return
    }

    // Largest Contentful Paint (LCP)
    this.observeMetric('largest-contentful-paint', (entry) => {
      this.recordMetric('LCP', entry.startTime, this.rateLCP(entry.startTime))
    })

    // First Input Delay (FID)
    this.observeMetric('first-input', (entry) => {
      const fid = entry.processingStart - entry.startTime
      this.recordMetric('FID', fid, this.rateFID(fid))
    })

    // Cumulative Layout Shift (CLS)
    this.observeMetric('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        this.recordMetric('CLS', entry.value, this.rateCLS(entry.value))
      }
    })

    // First Contentful Paint (FCP)
    this.observeMetric('paint', (entry) => {
      if (entry.name === 'first-contentful-paint') {
        this.recordMetric('FCP', entry.startTime, this.rateFCP(entry.startTime))
      }
    })
  }

  /**
   * Initialize navigation timing monitoring
   */
  private initNavigationTiming(): void {
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.measureNavigationTiming()
      }, 0)
    })
  }

  /**
   * Initialize resource timing monitoring
   */
  private initResourceTiming(): void {
    this.observeMetric('resource', (entry) => {
      // Monitor slow resources
      const duration = entry.responseEnd - entry.startTime
      if (duration > 1000) { // Resources taking more than 1s
        logger.warn(`Slow resource detected: ${entry.name} took ${duration.toFixed(2)}ms`)
      }
    })
  }

  /**
   * Observe specific performance metrics
   */
  private observeMetric(type: string, callback: (entry: any) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback)
      })
      
      observer.observe({ type, buffered: true })
      
      if (!this.observer) {
        this.observer = observer
      }
    } catch (error) {
      logger.warn(`Failed to observe ${type} metrics:`, error)
    }
  }

  /**
   * Record a performance metric
   */
  private recordMetric(name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor'): void {
    const metric: PerformanceMetric = {
      name,
      value,
      rating,
      timestamp: Date.now(),
      url: window.location.href
    }

    this.metrics.push(metric)
    
    // Log significant metrics
    if (rating === 'poor') {
      logger.warn(`Poor ${name} performance: ${value.toFixed(2)}${name === 'CLS' ? '' : 'ms'}`)
    } else if (rating === 'good') {
      logger.debug(`Good ${name} performance: ${value.toFixed(2)}${name === 'CLS' ? '' : 'ms'}`)
    }

    // Send to analytics (if configured)
    this.sendToAnalytics(metric)
  }

  /**
   * Measure navigation timing
   */
  private measureNavigationTiming(): void {
    if (!('performance' in window) || !window.performance.timing) {
      return
    }

    const timing = window.performance.timing
    const navigationStart = timing.navigationStart

    const timings: NavigationTiming = {
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      tcp: timing.connectEnd - timing.connectStart,
      request: timing.responseStart - timing.requestStart,
      response: timing.responseEnd - timing.responseStart,
      dom: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
      load: timing.loadEventEnd - timing.loadEventStart,
      total: timing.loadEventEnd - navigationStart
    }

    logger.debug('Navigation timings:', timings)

    // Record TTFB
    const ttfb = timing.responseStart - navigationStart
    this.recordMetric('TTFB', ttfb, this.rateTTFB(ttfb))
  }

  /**
   * Rate LCP performance
   */
  private rateLCP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= PERFORMANCE_THRESHOLDS.LCP_GOOD) return 'good'
    if (value <= PERFORMANCE_THRESHOLDS.LCP_NEEDS_IMPROVEMENT) return 'needs-improvement'
    return 'poor'
  }

  /**
   * Rate FID performance
   */
  private rateFID(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= PERFORMANCE_THRESHOLDS.FID_GOOD) return 'good'
    if (value <= PERFORMANCE_THRESHOLDS.FID_NEEDS_IMPROVEMENT) return 'needs-improvement'
    return 'poor'
  }

  /**
   * Rate CLS performance
   */
  private rateCLS(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= PERFORMANCE_THRESHOLDS.CLS_GOOD) return 'good'
    if (value <= PERFORMANCE_THRESHOLDS.CLS_NEEDS_IMPROVEMENT) return 'needs-improvement'
    return 'poor'
  }

  /**
   * Rate FCP performance
   */
  private rateFCP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= PERFORMANCE_THRESHOLDS.FCP_GOOD) return 'good'
    if (value <= PERFORMANCE_THRESHOLDS.FCP_NEEDS_IMPROVEMENT) return 'needs-improvement'
    return 'poor'
  }

  /**
   * Rate TTFB performance
   */
  private rateTTFB(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= PERFORMANCE_THRESHOLDS.TTFB_GOOD) return 'good'
    if (value <= PERFORMANCE_THRESHOLDS.TTFB_NEEDS_IMPROVEMENT) return 'needs-improvement'
    return 'poor'
  }

  /**
   * Send metric to analytics service
   */
  private sendToAnalytics(metric: PerformanceMetric): void {
    // In a real app, you would send this to your analytics service
    // For now, we'll just store it locally for development
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const existingMetrics = JSON.parse(localStorage.getItem('battle64-performance-metrics') || '[]')
        existingMetrics.push(metric)
        
        // Keep only last 100 metrics to avoid storage bloat
        const recentMetrics = existingMetrics.slice(-100)
        localStorage.setItem('battle64-performance-metrics', JSON.stringify(recentMetrics))
      } catch (error) {
        logger.warn('Failed to store performance metric:', error)
      }
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  /**
   * Get performance summary
   */
  getSummary(): { [key: string]: { good: number; needsImprovement: number; poor: number } } {
    const summary: { [key: string]: { good: number; needsImprovement: number; poor: number } } = {}

    this.metrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = { good: 0, needsImprovement: 0, poor: 0 }
      }

      if (metric.rating === 'good') {
        summary[metric.name].good++
      } else if (metric.rating === 'needs-improvement') {
        summary[metric.name].needsImprovement++
      } else {
        summary[metric.name].poor++
      }
    })

    return summary
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = []
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('battle64-performance-metrics')
    }
  }

  /**
   * Cleanup observers
   */
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    this.isInitialized = false
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor()

/**
 * Initialize performance monitoring
 * Call this early in your app lifecycle
 */
export const initPerformanceMonitoring = (): void => {
  performanceMonitor.init()
}

/**
 * Measure custom timing
 */
export const measureTiming = (name: string, startTime: number): void => {
  const duration = performance.now() - startTime
  logger.debug(`Custom timing - ${name}: ${duration.toFixed(2)}ms`)
}

/**
 * Mark performance milestone
 */
export const markPerformance = (name: string): void => {
  if ('performance' in window && performance.mark) {
    performance.mark(name)
  }
}

/**
 * Measure between two performance marks
 */
export const measureBetweenMarks = (name: string, startMark: string, endMark: string): void => {
  if ('performance' in window && performance.measure) {
    try {
      performance.measure(name, startMark, endMark)
      const measure = performance.getEntriesByName(name, 'measure')[0]
      if (measure) {
        logger.debug(`Performance measure - ${name}: ${measure.duration.toFixed(2)}ms`)
      }
    } catch (error) {
      logger.warn(`Failed to measure between marks ${startMark} and ${endMark}:`, error)
    }
  }
}