/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
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
        'retro-gray': '#1F2937',
        'retro-light': '#F3F4F6',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #8B5CF6, 0 0 10px #8B5CF6, 0 0 15px #8B5CF6' },
          '100%': { boxShadow: '0 0 10px #EC4899, 0 0 20px #EC4899, 0 0 30px #EC4899' },
        }
      },
      fontFamily: {
        'retro': ['Courier New', 'monospace'],
        'gaming': ['Orbitron', 'sans-serif'],
      }
    },
  },
  plugins: [],
}