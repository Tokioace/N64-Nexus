/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly DEV: boolean
  readonly MODE: string
  readonly PROD: boolean
  readonly SSR: boolean
  
  // Custom Battle64 environment variables
  readonly VITE_ENV: 'development' | 'staging' | 'production'
  readonly VITE_API_BASE_URL: string
  readonly VITE_FEATURE_EXPERIMENTAL: string
  readonly VITE_ENABLE_LOGGING: string
  readonly VITE_ENABLE_DEVTOOLS: string
  readonly VITE_APP_NAME: string
  readonly VITE_DEBUG_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}