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
        'retro-gray': '#6B7280',
        'retro-dark': '#1F2937',
        'retro-darker': '#111827',
        'retro-light': '#F3F4F6',
        'retro-lighter': '#F9FAFB',
        'pixel-border': '#374151',
      },
      fontFamily: {
        'retro': ['Press Start 2P', 'monospace'],
        'pixel': ['VT323', 'monospace'],
      },
      animation: {
        'pixel-bounce': 'pixel-bounce 0.6s ease-in-out',
        'camera-click': 'camera-click 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pixel-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'camera-click': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px #8B5CF6' },
          '100%': { boxShadow: '0 0 20px #8B5CF6, 0 0 30px #8B5CF6' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'pixel-pattern': "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"1\"/%3E%3Ccircle cx=\"13\" cy=\"13\" r=\"1\"/%3E%3C/g%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}