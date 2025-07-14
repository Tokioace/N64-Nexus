/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'retro-purple': '#8B5CF6',
        'retro-blue': '#3B82F6',
        'retro-green': '#10B981',
        'retro-yellow': '#F59E0B',
        'retro-red': '#EF4444',
        'retro-gray': '#1F2937',
        'retro-dark': '#111827',
        'retro-light': '#F3F4F6',
        'n64-gray': '#6B7280',
        'n64-dark': '#374151'
      },
      fontFamily: {
        'retro': ['Courier New', 'monospace'],
        'pixel': ['Press Start 2P', 'cursive']
      },
      animation: {
        'scan-line': 'scan-line 2s linear infinite',
        'pixel-fade': 'pixel-fade 0.5s ease-in-out',
        'retro-bounce': 'retro-bounce 0.6s ease-in-out'
      },
      keyframes: {
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        'pixel-fade': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'retro-bounce': {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0,-30px,0)' },
          '70%': { transform: 'translate3d(0,-15px,0)' },
          '90%': { transform: 'translate3d(0,-4px,0)' }
        }
      }
    },
  },
  plugins: [],
}