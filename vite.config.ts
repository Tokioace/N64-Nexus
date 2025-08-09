import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import strip from '@rollup/plugin-strip'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Environment-specific configuration
  const isDevelopment = mode === 'development'
  const isProduction = mode === 'production'
  const isStaging = mode === 'staging'

  return {
    plugins: [
      react(),
      // PWA Plugin Configuration
      VitePWA({
        registerType: 'prompt',
        injectRegister: false,
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'manifest.webmanifest'],
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}']
        },
        injectManifest: false,
        manifest: false,
        disable: true
      }),
      // Only strip console statements in production builds
      ...(isProduction ? [strip({
        include: ['**/*.(js|ts|tsx)'],
        functions: ['console.*'],
        sourceMap: false
      })] : []),
      // Only add visualizer in development or when explicitly requested
      ...(isDevelopment ? [visualizer({ 
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true
      })] : []),
      // Add compression for staging and production
      ...(isProduction || isStaging ? [
        viteCompression({
          algorithm: 'gzip',
          ext: '.gz'
        }),
        viteCompression({
          algorithm: 'brotliCompress',
          ext: '.br'
        })
      ] : [])
    ],
    define: {
      // Make environment variables available at build time
      __APP_ENV__: JSON.stringify(env.VITE_ENV),
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL),
      __APP_NAME__: JSON.stringify(env.VITE_APP_NAME),
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@contexts': resolve(__dirname, 'src/contexts'),
        '@data': resolve(__dirname, 'src/data'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@translations': resolve(__dirname, 'src/translations'),
        '@lib': resolve(__dirname, 'src/lib'),
      }
    },
    build: {
      // Environment-specific build configuration
      chunkSizeWarningLimit: isProduction ? 400 : 1000,
      sourcemap: isDevelopment ? 'inline' : false,
      target: 'es2020',
      minify: isProduction ? 'terser' : false,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Only optimize chunks in production and staging
            if (!isDevelopment) {
              // Vendor chunks
              if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                return 'react-vendor'
              }
              if (id.includes('node_modules/react-router-dom')) {
                return 'router-vendor'
              }
              if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) {
                return 'map-vendor'
              }
              if (id.includes('node_modules/lucide-react')) {
                return 'icons-vendor'
              }
              
              // Context chunks - separate heavy contexts
              if (id.includes('src/contexts/')) {
                return 'contexts'
              }
              
              // Translation chunks - split each language into its own chunk
              if (id.includes('src/translations/')) {
                const match = id.match(/translations\/([a-z]+)\.ts$/)
                if (match) {
                  return `translation-${match[1]}`
                }
                return 'translations-common'
              }
              
              // Utils chunk
              if (id.includes('src/utils/')) {
                return 'utils'
              }
              
              // Data chunk
              if (id.includes('src/data/')) {
                return 'data'
              }
              
              // Component chunks - split large components
              if (id.includes('src/components/Battle64Map')) {
                return 'map-component'
              }
              
              // Page chunks - split each page
              if (id.includes('src/pages/')) {
                const match = id.match(/pages\/([^/]+)\.tsx?$/)
                if (match) {
                  return `page-${match[1].toLowerCase()}`
                }
              }
            }
            
            return undefined
          },
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM'
          }
        }
      }
    },
    // Environment-specific server configuration
    server: {
      port: isDevelopment ? 3000 : 4173,
      hmr: isDevelopment,
      open: isDevelopment
    },
    // Environment-specific preview configuration
    preview: {
      port: 4173,
      open: false
    }
  }
})