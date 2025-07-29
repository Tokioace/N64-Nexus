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
    // Fast build configuration
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    target: 'es2020',
    minify: 'esbuild', // Faster than terser
  },
  // Fast development server
  server: {
    port: 3000,
    hmr: true
  }
})