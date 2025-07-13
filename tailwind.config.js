/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Retro Gaming Colors
        'n64-purple': '#5A4A9F',
        'n64-blue': '#4A90E2',
        'n64-green': '#7ED321',
        'n64-yellow': '#F5A623',
        'n64-red': '#D0021B',
        'n64-gray': '#9B9B9B',
        'n64-dark': '#2C2C2C',
        
        // Trophy Colors
        'bronze': '#CD7F32',
        'silver': '#C0C0C0',
        'gold': '#FFD700',
        'platinum': '#E5E4E2',
        
        // Achievement Categories
        'game-specific': '#4A90E2',
        'platform': '#7ED321',
        'community': '#F5A623',
        'collector': '#D0021B',
        'recurring': '#9B9B9B',
        'limited': '#5A4A9F',
      },
      fontFamily: {
        'retro': ['Press Start 2P', 'monospace'],
        'n64': ['N64', 'monospace'],
      },
      animation: {
        'trophy-glow': 'trophy-glow 2s ease-in-out infinite alternate',
        'achievement-unlock': 'achievement-unlock 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        'trophy-glow': {
          '0%': { boxShadow: '0 0 5px #FFD700, 0 0 10px #FFD700, 0 0 15px #FFD700' },
          '100%': { boxShadow: '0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700' },
        },
        'achievement-unlock': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'sparkle': {
          '0%, 100%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1) rotate(180deg)' },
        },
      },
      backgroundImage: {
        'retro-pattern': "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"1\"/%3E%3Ccircle cx=\"13\" cy=\"13\" r=\"1\"/%3E%3C/g%3E%3C/svg%3E')",
        'achievement-bg': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23FFD700\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"25\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      boxShadow: {
        'bronze-glow': '0 0 10px #CD7F32, 0 0 20px #CD7F32, 0 0 30px #CD7F32',
        'silver-glow': '0 0 10px #C0C0C0, 0 0 20px #C0C0C0, 0 0 30px #C0C0C0',
        'gold-glow': '0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700',
        'platinum-glow': '0 0 10px #E5E4E2, 0 0 20px #E5E4E2, 0 0 30px #E5E4E2',
        'achievement-card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'achievement-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}