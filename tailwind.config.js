/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'n64-gray': '#8B8B8B',
        'n64-dark': '#2D2D2D',
        'n64-blue': '#0066CC',
        'n64-red': '#CC0000',
        'n64-green': '#00CC00',
        'n64-yellow': '#CCCC00',
        'n64-purple': '#6600CC',
        'n64-orange': '#CC6600',
        'n64-silver': '#C0C0C0',
        'n64-gold': '#FFD700',
        'n64-platinum': '#E5E4E2',
      },
      fontFamily: {
        'n64': ['Courier New', 'monospace'],
        'pixel': ['Press Start 2P', 'cursive'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0066CC' },
          '100%': { boxShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #0066CC' }
        }
      },
      backgroundImage: {
        'pixel-pattern': "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"1\"/%3E%3C/g%3E%3C/svg%3E')",
      }
    },
  },
  plugins: [],
}