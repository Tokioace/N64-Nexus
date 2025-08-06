/**
 * Centralized logging utility for Battle64
 * Only logs in development mode to keep production builds clean
 */

type LogLevel = 'log' | 'warn' | 'error';

const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';

/**
 * Log function that only outputs in development mode
 */
export const log = (...args: any[]) => {
  if (isDev) {
    console.log(...args);
  }
};

/**
 * Warning function that only outputs in development mode
 */
export const warn = (...args: any[]) => {
  if (isDev) {
    console.warn(...args);
  }
};

/**
 * Error function that only outputs in development mode
 */
export const error = (...args: any[]) => {
  if (isDev) {
    console.error(...args);
  }
};

/**
 * Generic logger function with level support
 */
export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if (isDev) {
      console.error(...args);
    }
  },
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args);
    }
  }
};

export default logger;