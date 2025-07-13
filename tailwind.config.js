/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'battle64': {
          'primary': '#FF6B35', // Orange
          'secondary': '#4ECDC4', // Teal
          'accent': '#45B7D1', // Blue
          'dark': '#2C3E50', // Dark blue
          'light': '#ECF0F1', // Light gray
          'success': '#27AE60', // Green
          'warning': '#F39C12', // Orange
          'error': '#E74C3C', // Red
          'speedrun': '#E74C3C', // Red for speedrun events
          'fanart': '#3498DB', // Blue for fanart events
          'glitch': '#9B59B6', // Purple for glitch events
          'teams': '#F39C12', // Orange for team events
        }
      },
      fontFamily: {
        'pixel': ['Press Start 2P', 'monospace'],
        'retro': ['VT323', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'countdown': 'countdown 1s ease-in-out infinite',
      },
      keyframes: {
        countdown: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}