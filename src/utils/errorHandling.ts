/* eslint-disable @typescript-eslint/no-explicit-any */
// Error types for better categorization
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  PERMISSION = 'PERMISSION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN'
}

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

interface ErrorContext {
  userId?: string
  page?: string
  component?: string
  action?: string
  timestamp?: number
  userAgent?: string
  url?: string
  stackTrace?: string
  additionalData?: Record<string, any>
}

interface LogEntry {
  level: LogLevel
  message: string
  context?: ErrorContext
  timestamp: number
}

class ErrorHandler {
  private static instance: ErrorHandler
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private isDevelopment = process.env.NODE_ENV === 'development'

  private constructor() {
    this.setupGlobalErrorHandlers()
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(
        'Unhandled Promise Rejection',
        ErrorType.UNKNOWN,
        {
          stackTrace: event.reason?.stack,
          additionalData: { reason: event.reason }
        }
      )
      
      // Prevent the default browser behavior
      event.preventDefault()
    })

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.logError(
        event.message || 'Uncaught Error',
        ErrorType.CLIENT,
        {
          stackTrace: event.error?.stack,
          url: event.filename,
          additionalData: {
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
          }
        }
      )
    })

    // Handle React error boundaries
    window.addEventListener('react-error', (event: any) => {
      this.logError(
        'React Error Boundary Triggered',
        ErrorType.CLIENT,
        {
          component: event.detail?.componentStack,
          stackTrace: event.detail?.error?.stack,
          additionalData: event.detail
        }
      )
    })
  }

  private getErrorContext(): ErrorContext {
    return {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      page: window.location.pathname
    }
  }

  private addLog(level: LogLevel, message: string, context?: ErrorContext) {
    const logEntry: LogEntry = {
      level,
      message,
      context: { ...this.getErrorContext(), ...context },
      timestamp: Date.now()
    }

    this.logs.push(logEntry)

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console output in development
    if (this.isDevelopment) {
      this.consoleLog(logEntry)
    }

    // Send critical errors to monitoring service
    if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
      this.sendToMonitoring(logEntry)
    }
  }

  private consoleLog(entry: LogEntry) {
    const { level, message, context } = entry
    const timestamp = new Date(entry.timestamp).toISOString()
    
    const logMessage = `[${timestamp}] ${level}: ${message}`
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, context)
        break
      case LogLevel.INFO:
        console.info(logMessage, context)
        break
      case LogLevel.WARN:
        console.warn(logMessage, context)
        break
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(logMessage, context)
        break
      default:
        console.log(logMessage, context)
    }
  }

  private async sendToMonitoring(entry: LogEntry) {
    try {
      // In a real application, you would send this to your monitoring service
      // Example: Sentry, LogRocket, Datadog, etc.
      
      if (!navigator.onLine) {
        // Queue for later if offline
        this.queueForOfflineSending(entry)
        return
      }

      // Example monitoring service call
      // await fetch('/api/monitoring/error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // })
      
      console.info('Error logged to monitoring service:', entry)
    } catch (error) {
      console.error('Failed to send error to monitoring service:', error)
    }
  }

  private queueForOfflineSending(entry: LogEntry) {
    try {
      const queuedErrors = JSON.parse(localStorage.getItem('queuedErrors') || '[]')
      queuedErrors.push(entry)
      
      // Keep only the most recent 50 queued errors
      const trimmedQueue = queuedErrors.slice(-50)
      localStorage.setItem('queuedErrors', JSON.stringify(trimmedQueue))
    } catch (error) {
      console.error('Failed to queue error for offline sending:', error)
    }
  }

  async sendQueuedErrors() {
    try {
      const queuedErrors = JSON.parse(localStorage.getItem('queuedErrors') || '[]')
      
      if (queuedErrors.length === 0) return

      for (const error of queuedErrors) {
        await this.sendToMonitoring(error)
      }

      // Clear the queue after successful sending
      localStorage.removeItem('queuedErrors')
      this.logInfo('Sent queued offline errors to monitoring service')
    } catch (error) {
      console.error('Failed to send queued errors:', error)
    }
  }

  // Public logging methods
  logDebug(message: string, context?: ErrorContext) {
    this.addLog(LogLevel.DEBUG, message, context)
  }

  logInfo(message: string, context?: ErrorContext) {
    this.addLog(LogLevel.INFO, message, context)
  }

  logWarning(message: string, context?: ErrorContext) {
    this.addLog(LogLevel.WARN, message, context)
  }

  logError(message: string, type: ErrorType = ErrorType.UNKNOWN, context?: ErrorContext) {
    this.addLog(LogLevel.ERROR, `[${type}] ${message}`, context)
  }

  logFatal(message: string, type: ErrorType = ErrorType.UNKNOWN, context?: ErrorContext) {
    this.addLog(LogLevel.FATAL, `[${type}] ${message}`, context)
  }

  // Specific error handling methods
  handleNetworkError(error: any, context?: ErrorContext) {
    let message = 'Network request failed'
    
    if (error.response) {
      message = `HTTP ${error.response.status}: ${error.response.statusText}`
    } else if (error.request) {
      message = 'No response received from server'
    } else {
      message = error.message || 'Network configuration error'
    }

    this.logError(message, ErrorType.NETWORK, {
      ...context,
      additionalData: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method
      }
    })
  }

  handleValidationError(field: string, message: string, context?: ErrorContext) {
    this.logWarning(`Validation failed for ${field}: ${message}`, {
      ...context,
      additionalData: { field, validationMessage: message }
    })
  }

  handleAuthenticationError(message: string, context?: ErrorContext) {
    this.logError(message, ErrorType.AUTHENTICATION, context)
  }

  // Performance monitoring
  measurePerformance(name: string, fn: () => Promise<any> | any) {
    const start = performance.now()
    
    try {
      const result = fn()
      
      if (result instanceof Promise) {
        return result
          .then((data) => {
            const duration = performance.now() - start
            this.logDebug(`Performance: ${name} completed in ${duration.toFixed(2)}ms`)
            return data
          })
          .catch((error) => {
            const duration = performance.now() - start
            this.logError(`Performance: ${name} failed after ${duration.toFixed(2)}ms`, ErrorType.UNKNOWN, {
              additionalData: { error, duration }
            })
            throw error
          })
      } else {
        const duration = performance.now() - start
        this.logDebug(`Performance: ${name} completed in ${duration.toFixed(2)}ms`)
        return result
      }
    } catch (error) {
      const duration = performance.now() - start
      this.logError(`Performance: ${name} failed after ${duration.toFixed(2)}ms`, ErrorType.UNKNOWN, {
        additionalData: { error, duration }
      })
      throw error
    }
  }

  // Get logs for debugging
  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    const filteredLogs = level 
      ? this.logs.filter(log => log.level === level)
      : this.logs

    return limit 
      ? filteredLogs.slice(-limit)
      : filteredLogs
  }

  // Clear logs
  clearLogs() {
    this.logs = []
    this.logInfo('Logs cleared')
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// Create singleton instance
export const errorHandler = ErrorHandler.getInstance()

// Convenience functions
export const logDebug = (message: string, context?: ErrorContext) => 
  errorHandler.logDebug(message, context)

export const logInfo = (message: string, context?: ErrorContext) => 
  errorHandler.logInfo(message, context)

export const logWarning = (message: string, context?: ErrorContext) => 
  errorHandler.logWarning(message, context)

export const logError = (message: string, type?: ErrorType, context?: ErrorContext) => 
  errorHandler.logError(message, type, context)

export const logFatal = (message: string, type?: ErrorType, context?: ErrorContext) => 
  errorHandler.logFatal(message, type, context)

export const handleNetworkError = (error: any, context?: ErrorContext) => 
  errorHandler.handleNetworkError(error, context)

export const handleValidationError = (field: string, message: string, context?: ErrorContext) => 
  errorHandler.handleValidationError(field, message, context)

export const handleAuthenticationError = (message: string, context?: ErrorContext) => 
  errorHandler.handleAuthenticationError(message, context)

export const measurePerformance = (name: string, fn: () => Promise<any> | any) => 
  errorHandler.measurePerformance(name, fn)

// React Error Boundary helper
export const reportErrorBoundary = (error: Error, errorInfo: any) => {
  errorHandler.logError('React Error Boundary', ErrorType.CLIENT, {
    stackTrace: error.stack,
    component: errorInfo.componentStack,
    additionalData: { error: error.message, errorInfo }
  })
}