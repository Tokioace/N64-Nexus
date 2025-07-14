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
        'retro-pink': '#EC4899',
        'retro-blue': '#3B82F6',
        'retro-green': '#10B981',
        'retro-yellow': '#F59E0B',
        'retro-red': '#EF4444',
        'retro-orange': '#F97316',
        'retro-cyan': '#06B6D4',
        'retro-gray': '#6B7280',
        'retro-dark': '#1F2937',
        'retro-darker': '#111827',
        'retro-light': '#F3F4F6',
        'retro-lighter': '#F9FAFB',
      },
      fontFamily: {
        'retro': ['Courier New', 'monospace'],
        'arcade': ['Press Start 2P', 'cursive'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #8B5CF6' },
          '100%': { boxShadow: '0 0 20px #8B5CF6, 0 0 30px #8B5CF6' },
        }
      }
    },
  },
  plugins: [],
}