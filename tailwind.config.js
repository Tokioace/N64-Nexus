/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'n64-purple': '#6B46C1',
        'n64-blue': '#3182CE',
        'n64-green': '#38A169',
        'n64-red': '#E53E3E',
        'n64-yellow': '#D69E2E',
        'n64-gray': '#2D3748',
        'n64-light': '#F7FAFC',
      },
      fontFamily: {
        'retro': ['Courier New', 'monospace'],
        'game': ['Press Start 2P', 'cursive'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}