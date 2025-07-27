import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split translations into separate chunk
          translations: ['./src/contexts/LanguageContext.tsx'],
          // Split React libraries into separate chunk
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Split Lucide icons into separate chunk
          icons: ['lucide-react']
        }
      }
    },
    // Increase chunk size warning limit to handle translations
    chunkSizeWarningLimit: 1500
  }
})