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
        'n64-purple': '#5D3FD3',
        'n64-blue': '#4A90E2',
        'n64-green': '#7ED321',
        'n64-red': '#D0021B',
        'n64-yellow': '#F5A623',
        'retro-black': '#0A0A0A',
        'retro-gray': '#2A2A2A',
        'crt-green': '#00FF41',
        'scanline': 'rgba(0, 255, 65, 0.1)',
      },
      animation: {
        'crt-scan': 'scan 0.1s linear infinite',
        'pixel-bounce': 'pixelBounce 0.6s ease-out',
        'cartridge-drop': 'cartridgeDrop 2s ease-in-out',
        'logo-fade': 'logoFade 3s ease-in-out',
        'star-float': 'starFloat 2s ease-in-out infinite',
        'level-up': 'levelUp 1s ease-out',
        'ticker-scroll': 'tickerScroll 20s linear infinite',
        'button-shake': 'buttonShake 0.3s ease-in-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'parallax': 'parallax 20s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        pixelBounce: {
          '0%': { transform: 'scale(0.3)', opacity: 0 },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        cartridgeDrop: {
          '0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: 0 },
          '50%': { transform: 'translateY(20vh) rotate(180deg)', opacity: 1 },
          '100%': { transform: 'translateY(0) rotate(360deg)', opacity: 1 },
        },
        logoFade: {
          '0%': { opacity: 0, filter: 'blur(10px)' },
          '50%': { opacity: 0.5, filter: 'blur(5px)' },
          '100%': { opacity: 1, filter: 'blur(0px)' },
        },
        starFloat: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
          '50%': { transform: 'translateY(-20px) rotate(180deg)', opacity: 0.7 },
          '100%': { transform: 'translateY(-40px) rotate(360deg)', opacity: 0 },
        },
        levelUp: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: 0 },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: 1 },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: 1 },
        },
        tickerScroll: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        buttonShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 255, 65, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 255, 65, 0.8)' },
        },
        parallax: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      fontFamily: {
        'retro': ['Press Start 2P', 'monospace'],
        'pixel': ['VT323', 'monospace'],
      },
    },
  },
  plugins: [],
}