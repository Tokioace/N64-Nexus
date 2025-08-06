/**
 * Environment configuration utility for Battle64
 * Provides type-safe access to environment variables
 */

export type Environment = 'development' | 'staging' | 'production';

/**
 * Get the current environment
 */
export const getEnvironment = (): Environment => {
  return import.meta.env.VITE_ENV as Environment;
};

/**
 * Check if we're in development mode
 */
export const isDevelopment = (): boolean => {
  return getEnvironment() === 'development';
};

/**
 * Check if we're in staging mode
 */
export const isStaging = (): boolean => {
  return getEnvironment() === 'staging';
};

/**
 * Check if we're in production mode
 */
export const isProduction = (): boolean => {
  return getEnvironment() === 'production';
};

/**
 * Get the API base URL for the current environment
 */
export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL;
};

/**
 * Check if experimental features are enabled
 */
export const isExperimentalEnabled = (): boolean => {
  return import.meta.env.VITE_FEATURE_EXPERIMENTAL === 'true';
};

/**
 * Check if logging is enabled for the current environment
 */
export const isLoggingEnabled = (): boolean => {
  return import.meta.env.VITE_ENABLE_LOGGING === 'true';
};

/**
 * Check if dev tools are enabled for the current environment
 */
export const isDevToolsEnabled = (): boolean => {
  return import.meta.env.VITE_ENABLE_DEVTOOLS === 'true';
};

/**
 * Get the app name for the current environment
 */
export const getAppName = (): string => {
  return import.meta.env.VITE_APP_NAME;
};

/**
 * Check if debug mode is enabled
 */
export const isDebugMode = (): boolean => {
  return import.meta.env.VITE_DEBUG_MODE === 'true';
};

/**
 * Environment configuration object
 */
export const env = {
  environment: getEnvironment(),
  isDevelopment: isDevelopment(),
  isStaging: isStaging(),
  isProduction: isProduction(),
  apiBaseUrl: getApiBaseUrl(),
  experimentalFeatures: isExperimentalEnabled(),
  loggingEnabled: isLoggingEnabled(),
  devToolsEnabled: isDevToolsEnabled(),
  appName: getAppName(),
  debugMode: isDebugMode(),
} as const;

export default env;