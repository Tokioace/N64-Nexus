import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // wichtig für Vercel!
  plugins: [react()],
});
