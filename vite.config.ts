import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for large libraries
          vendor: ['react', 'react-dom'],
          // UI components chunk
          ui: ['lucide-react'],
          // Translation chunk
          i18n: [
            './src/translations/de.ts',
            './src/translations/en.ts',
            './src/translations/fr.ts',
            './src/translations/it.ts',
            './src/translations/es.ts'
          ],
          // Game data chunk
          gameData: ['./src/data/n64Games.ts'],
          // Context providers chunk
          contexts: [
            './src/contexts/LanguageContext.tsx',
            './src/contexts/EventContext.tsx',
            './src/contexts/ForumContext.tsx',
            './src/contexts/QuizContext.tsx'
          ]
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: false,
    // Optimize for modern browsers
    target: 'es2020',
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Optimize development server
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: false
    }
  },
  // Enable CSS code splitting
  css: {
    devSourcemap: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    exclude: []
  }
})