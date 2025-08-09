/**
 * Centralized logging utility for Battle64
 * Uses environment-specific configuration for logging behavior
 */

import { isLoggingEnabled, isDevelopment, isDebugMode } from '@/utils/env';

// type LogLevel = 'log' | 'warn' | 'error' | 'debug' | 'info'; // For future use

// Define what can be logged - more flexible to handle errors properly
type LoggableValue = string | number | boolean | null | undefined | Error | object | unknown;
type LogArgs = LoggableValue[];

/**
 * Convert unknown values to loggable format
 */
const formatLogValue = (value: unknown): LoggableValue => {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack
    };
  }
  return value;
};

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
export const log = (...args: LogArgs): void => {
  if (shouldLog()) {
    console.log(...args.map(formatLogValue));
  }
};

/**
 * Warning function that respects environment configuration
 */
export const warn = (...args: LogArgs): void => {
  if (shouldLog()) {
    console.warn(...args.map(formatLogValue));
  }
};

/**
 * Error function that always outputs (critical for debugging)
 * Only respects environment in development, always shows in staging/prod for critical errors
 */
export const error = (...args: LogArgs): void => {
  if (shouldLog() || !isDevelopment()) {
    console.error(...args.map(formatLogValue));
  }
};

/**
 * Debug function that only outputs in debug mode
 */
export const debug = (...args: LogArgs): void => {
  if (shouldDebug()) {
    console.debug(...args.map(formatLogValue));
  }
};

/**
 * Info function for informational messages
 */
export const info = (...args: LogArgs): void => {
  if (shouldLog()) {
    console.info(...args.map(formatLogValue));
  }
};

/**
 * Generic logger function with level support
 */
export const logger = {
  log: (...args: LogArgs): void => {
    if (shouldLog()) {
      console.log(...args.map(formatLogValue));
    }
  },
  warn: (...args: LogArgs): void => {
    if (shouldLog()) {
      console.warn(...args.map(formatLogValue));
    }
  },
  error: (...args: LogArgs): void => {
    if (shouldLog() || !isDevelopment()) {
      console.error(...args.map(formatLogValue));
    }
  },
  debug: (...args: LogArgs): void => {
    if (shouldDebug()) {
      console.debug(...args.map(formatLogValue));
    }
  },
  info: (...args: LogArgs): void => {
    if (shouldLog()) {
      console.info(...args.map(formatLogValue));
    }
  }
};

export default logger;