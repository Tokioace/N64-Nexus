/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'n64-purple': '#663399',
        'n64-blue': '#0066CC',
        'n64-green': '#00CC66',
        'n64-red': '#CC0033',
        'n64-yellow': '#FFCC00',
        'n64-gray': '#666666',
        'n64-dark': '#1a1a1a',
        'n64-light': '#f5f5f5',
      },
      fontFamily: {
        'n64': ['Courier New', 'monospace'],
        'retro': ['Press Start 2P', 'cursive'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #663399, 0 0 10px #663399, 0 0 15px #663399' },
          '100%': { boxShadow: '0 0 10px #663399, 0 0 20px #663399, 0 0 30px #663399' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'n64-gradient': 'linear-gradient(135deg, #663399 0%, #0066CC 50%, #00CC66 100%)',
        'retro-grid': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(102, 51, 153, 0.1) 2px, rgba(102, 51, 153, 0.1) 4px)',
      },
    },
  },
  plugins: [],
}