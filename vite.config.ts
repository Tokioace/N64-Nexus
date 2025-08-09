import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import strip from '@rollup/plugin-strip'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
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
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'manifest.webmanifest'],
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\//,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'supabase-api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 5 // 5 minutes
                }
              }
            },
            {
              urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/v1\//,
              handler: 'CacheFirst',
              options: {
                cacheName: 'supabase-storage-cache',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
                }
              }
            },
            {
              urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 300,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                }
              }
            }
          ]
        },
        filename: 'manifest.webmanifest',
        manifestFilename: 'manifest.webmanifest',
        manifest: {
          name: 'Battle64 - N64 Community',
          short_name: 'Battle64',
          description: 'Die ultimative Nintendo 64 Community mit Events, Ranglisten, Sammler-Features und mehr',
          theme_color: '#1e293b',
          background_color: '#0f172a',
          display: 'standalone',
          orientation: 'any',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: 'android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
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
              
              // Translation chunks
              if (id.includes('src/translations/')) {
                return 'translations'
              }
              
              // Utils chunk
              if (id.includes('src/utils/')) {
                return 'utils'
              }
              
              // Data chunk
              if (id.includes('src/data/')) {
                return 'data'
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