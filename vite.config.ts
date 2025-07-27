import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split translations into language-specific chunks for better loading
          'translations-core': ['./src/translations/index.ts'],
          'translations-de': ['./src/translations/de.ts'],
          'translations-en': ['./src/translations/en.ts'],
          'translations-fr': ['./src/translations/fr.ts'],
          'translations-it': ['./src/translations/it.ts'],
          'translations-es': ['./src/translations/es.ts'],
          'translations-el': ['./src/translations/el.ts'],
          'translations-tr': ['./src/translations/tr.ts'],
          'translations-zh': ['./src/translations/zh.ts'],
          'translations-ja': ['./src/translations/ja.ts'],
          'translations-ru': ['./src/translations/ru.ts'],
          'translations-pt': ['./src/translations/pt.ts'],
          'translations-hi': ['./src/translations/hi.ts'],
          'translations-ar': ['./src/translations/ar.ts'],
          // Split React libraries into separate chunk
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Split Lucide icons into separate chunk
          icons: ['lucide-react']
        }
      }
    },
    // Reasonable chunk size warning limit
    chunkSizeWarningLimit: 600
  }
})