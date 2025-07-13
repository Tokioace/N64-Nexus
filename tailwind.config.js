/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'n64-purple': '#8B5CF6',
        'n64-blue': '#3B82F6',
        'n64-green': '#10B981',
        'n64-red': '#EF4444',
        'n64-yellow': '#F59E0B',
        'n64-gray': '#6B7280',
        'retro-black': '#1F2937',
        'retro-white': '#F9FAFB',
      },
      fontFamily: {
        'retro': ['Courier New', 'monospace'],
        'pixel': ['Press Start 2P', 'cursive'],
      },
      animation: {
        'pixel-bounce': 'pixel-bounce 0.6s ease-in-out',
        'glitch': 'glitch 0.3s ease-in-out',
        'countdown': 'countdown 1s linear',
        'score-pop': 'score-pop 0.5s ease-out',
      },
      keyframes: {
        'pixel-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'countdown': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        'score-pop': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}