/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'n64-red': '#FF6B6B',
        'n64-blue': '#4ECDC4',
        'n64-green': '#45B7D1',
        'n64-yellow': '#FFE66D',
        'n64-purple': '#A8E6CF',
        'n64-orange': '#FF8C42',
        'n64-gray': '#2C3E50',
        'n64-dark': '#1A1A2E',
        'n64-light': '#F8F9FA',
        'retro-black': '#0A0A0A',
        'retro-white': '#F0F0F0',
        'retro-gray': '#808080',
      },
      fontFamily: {
        'retro': ['Courier New', 'monospace'],
        'pixel': ['Press Start 2P', 'cursive'],
      },
      animation: {
        'glitch': 'glitch 0.3s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        }
      }
    },
  },
  plugins: [],
}