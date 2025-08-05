import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ 
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@contexts': resolve(__dirname, 'src/contexts'),
      '@data': resolve(__dirname, 'src/data'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@translations': resolve(__dirname, 'src/translations'),
    }
  },
  build: {
    // Optimized build configuration for smaller bundles
    chunkSizeWarningLimit: 400,
    sourcemap: false,
    target: 'es2020',
    minify: 'terser', // Better compression than esbuild
    rollupOptions: {
      output: {
        manualChunks: (id) => {
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
          
          return undefined
        }
      }
    }
  },
  // Fast development server
  server: {
    port: 3000,
    hmr: true
  }
})