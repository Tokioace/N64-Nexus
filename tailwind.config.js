/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'retro': ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      colors: {
        'game-blue': '#3b82f6',
        'game-purple': '#8b5cf6',
        'game-pink': '#ec4899',
        'game-green': '#10b981',
        'game-yellow': '#f59e0b',
        'game-red': '#ef4444',
      }
    },
  },
  plugins: [],
}