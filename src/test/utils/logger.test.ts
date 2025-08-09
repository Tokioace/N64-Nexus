import { describe, it, expect, beforeEach, vi } from 'vitest'
import { logger, log, warn, error, debug, info } from '../../lib/logger'

// Mock environment utilities
vi.mock('../../utils/env', () => ({
  isLoggingEnabled: vi.fn(() => true),
  isDevelopment: vi.fn(() => true),
  isDebugMode: vi.fn(() => true)
}))

describe('Logger', () => {
  beforeEach(() => {
    // Clear console mocks before each test
    vi.clearAllMocks()
  })

  describe('formatLogValue', () => {
    it('formats Error objects correctly', () => {
      const testError = new Error('Test error')
      testError.stack = 'Error: Test error\n    at test'
      
      // Since formatLogValue is internal, we test it through the logger
      logger.error('Error occurred:', testError)
      
      expect(console.error).toHaveBeenCalledWith(
        'Error occurred:',
        {
          name: 'Error',
          message: 'Test error',
          stack: 'Error: Test error\n    at test'
        }
      )
    })

    it('passes through non-Error values unchanged', () => {
      logger.log('String value', 123, true, null, undefined)
      
      expect(console.log).toHaveBeenCalledWith(
        'String value',
        123,
        true,
        null,
        undefined
      )
    })

    it('handles unknown values', () => {
      const unknownValue = Symbol('test')
      logger.log('Unknown:', unknownValue)
      
      expect(console.log).toHaveBeenCalledWith('Unknown:', unknownValue)
    })
  })

  describe('log function', () => {
    it('calls console.log when logging is enabled', () => {
      log('Test message', 123)
      
      expect(console.log).toHaveBeenCalledWith('Test message', 123)
    })

    it('formats multiple arguments correctly', () => {
      const testObj = { key: 'value' }
      log('Message:', testObj, true)
      
      expect(console.log).toHaveBeenCalledWith('Message:', testObj, true)
    })
  })

  describe('warn function', () => {
    it('calls console.warn when logging is enabled', () => {
      warn('Warning message')
      
      expect(console.warn).toHaveBeenCalledWith('Warning message')
    })
  })

  describe('error function', () => {
    it('calls console.error when logging is enabled', () => {
      error('Error message')
      
      expect(console.error).toHaveBeenCalledWith('Error message')
    })

    it('formats Error objects in error logs', () => {
      const testError = new Error('Test error')
      error('An error occurred:', testError)
      
      expect(console.error).toHaveBeenCalledWith(
        'An error occurred:',
        expect.objectContaining({
          name: 'Error',
          message: 'Test error'
        })
      )
    })
  })

  describe('debug function', () => {
    it('calls console.debug when debug mode is enabled', () => {
      debug('Debug message')
      
      expect(console.debug).toHaveBeenCalledWith('Debug message')
    })
  })

  describe('info function', () => {
    it('calls console.info when logging is enabled', () => {
      info('Info message')
      
      expect(console.info).toHaveBeenCalledWith('Info message')
    })
  })

  describe('logger object', () => {
    it('has all expected methods', () => {
      expect(logger).toHaveProperty('log')
      expect(logger).toHaveProperty('warn')
      expect(logger).toHaveProperty('error')
      expect(logger).toHaveProperty('debug')
      expect(logger).toHaveProperty('info')
    })

    it('logger.log works correctly', () => {
      logger.log('Test message')
      
      expect(console.log).toHaveBeenCalledWith('Test message')
    })

    it('logger.warn works correctly', () => {
      logger.warn('Warning message')
      
      expect(console.warn).toHaveBeenCalledWith('Warning message')
    })

    it('logger.error works correctly', () => {
      logger.error('Error message')
      
      expect(console.error).toHaveBeenCalledWith('Error message')
    })

    it('logger.debug works correctly', () => {
      logger.debug('Debug message')
      
      expect(console.debug).toHaveBeenCalledWith('Debug message')
    })

    it('logger.info works correctly', () => {
      logger.info('Info message')
      
      expect(console.info).toHaveBeenCalledWith('Info message')
    })
  })

  describe('environment-based behavior', () => {
    it('respects logging enabled setting', async () => {
      // Mock logging as disabled
      const { isLoggingEnabled } = await import('../../utils/env')
      vi.mocked(isLoggingEnabled).mockReturnValue(false)
      
      // Re-import logger to get updated behavior
      const { log: newLog } = await import('../../lib/logger')
      
      newLog('Should not log')
      
      // Console should not be called when logging is disabled
      expect(console.log).not.toHaveBeenCalled()
    })

    it('respects debug mode setting', async () => {
      const { isDebugMode } = await import('../../utils/env')
      vi.mocked(isDebugMode).mockReturnValue(false)
      
      const { debug: newDebug } = await import('../../lib/logger')
      
      newDebug('Should not debug')
      
      // Console.debug should not be called when debug mode is disabled
      expect(console.debug).not.toHaveBeenCalled()
    })
  })

  describe('error handling in production', () => {
    it('always logs errors in production even when logging is disabled', async () => {
      const { isLoggingEnabled, isDevelopment } = await import('../../utils/env')
      vi.mocked(isLoggingEnabled).mockReturnValue(false)
      vi.mocked(isDevelopment).mockReturnValue(false)
      
      const { error: newError } = await import('../../lib/logger')
      
      newError('Critical error')
      
      // Errors should still be logged in production
      expect(console.error).toHaveBeenCalledWith('Critical error')
    })
  })
})