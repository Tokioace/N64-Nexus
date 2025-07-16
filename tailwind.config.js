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
        'orbitron': ['Orbitron', 'sans-serif'],
        'tech': ['Orbitron', 'Press Start 2P', 'cursive'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shake': 'shake 0.5s ease-in-out',
        'flip': 'flip 0.6s ease-in-out',
        'zoom-in': 'zoomIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'rotate-3d': 'rotate3d 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(107, 70, 193, 0.5)' },
          'to': { boxShadow: '0 0 30px rgba(107, 70, 193, 0.8)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '50%': { transform: 'rotateY(-90deg)' },
          '100%': { transform: 'rotateY(0)' },
        },
        zoomIn: {
          'from': { opacity: '0', transform: 'scale(0.8)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          'from': { opacity: '0', transform: 'translateX(100%)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          'from': { opacity: '0', transform: 'translateX(-100%)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        rotate3d: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(107, 70, 193, 0.4)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(107, 70, 193, 0.8)',
            transform: 'scale(1.05)'
          },
        },
      }
    },
  },
  plugins: [],
}