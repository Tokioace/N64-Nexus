/**
 * Centralized logging utility for Battle64
 * Uses environment-specific configuration for logging behavior
 */

import { isLoggingEnabled, isDevelopment, isDebugMode } from '@/utils/env';

type LogLevel = 'log' | 'warn' | 'error' | 'debug';

/**
 * Check if logging should be enabled based on environment configuration
 */
const shouldLog = (): boolean => {
  return isLoggingEnabled();
};

/**
 * Check if debug logging should be enabled
 */
const shouldDebug = (): boolean => {
  return isDebugMode() && shouldLog();
};

/**
 * Log function that respects environment configuration
 */
export const log = (...args: any[]) => {
  if (shouldLog()) {
    console.log(...args);
  }
};

/**
 * Warning function that respects environment configuration
 */
export const warn = (...args: any[]) => {
  if (shouldLog()) {
    console.warn(...args);
  }
};

/**
 * Error function that always outputs (critical for debugging)
 * Only respects environment in development, always shows in staging/prod for critical errors
 */
export const error = (...args: any[]) => {
  if (shouldLog() || !isDevelopment()) {
    console.error(...args);
  }
};

/**
 * Debug function that only outputs in debug mode
 */
export const debug = (...args: any[]) => {
  if (shouldDebug()) {
    console.debug(...args);
  }
};

/**
 * Generic logger function with level support
 */
export const logger = {
  log: (...args: any[]) => {
    if (shouldLog()) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (shouldLog()) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if (shouldLog() || !isDevelopment()) {
      console.error(...args);
    }
  },
  debug: (...args: any[]) => {
    if (shouldDebug()) {
      console.debug(...args);
    }
  },
  info: (...args: any[]) => {
    if (shouldLog()) {
      console.info(...args);
    }
  }
};

export default logger;