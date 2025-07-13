/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Retro gaming color palette
        'retro-dark': '#1a1a1a',
        'retro-darker': '#0f0f0f',
        'retro-gray': '#2a2a2a',
        'retro-light-gray': '#3a3a3a',
        'retro-green': '#00ff41',
        'retro-blue': '#0080ff',
        'retro-red': '#ff0040',
        'retro-yellow': '#ffff00',
        'retro-purple': '#8000ff',
        'retro-orange': '#ff8000',
        'retro-cyan': '#00ffff',
        'retro-pink': '#ff0080',
      },
      fontFamily: {
        'pixel': ['Courier New', 'monospace'],
        'retro': ['Press Start 2P', 'cursive'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00ff41' },
          '100%': { boxShadow: '0 0 20px #00ff41, 0 0 30px #00ff41' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}