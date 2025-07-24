/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 🅰️ Font Families - Retro + Modern Mix
      fontFamily: {
        'heading': ['"Press Start 2P"', 'cursive'],
        'body': ['"Inter"', 'sans-serif'],
        'fallback': ['sans-serif'],
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // 📏 Fluid/Responsive Font Sizes with clamp()
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        // Fluid Typography System
        'fluid-h1': ['clamp(1.8rem, 2vw, 2.6rem)', { lineHeight: '1.3', letterSpacing: '0.5px' }],
        'fluid-h2': ['clamp(1.4rem, 1.8vw, 2.2rem)', { lineHeight: '1.3', letterSpacing: '0.5px' }],
        'fluid-h3': ['clamp(1.2rem, 1.6vw, 2rem)', { lineHeight: '1.3', letterSpacing: '0.5px' }],
        'fluid-body': ['clamp(0.95rem, 1.2vw, 1.05rem)', { lineHeight: '1.6', letterSpacing: '0.25px' }],
        'fluid-small': ['0.85rem', { lineHeight: '1.6', letterSpacing: '0.25px' }],
      },
      // 🧾 Font Weights
      fontWeight: {
        'heading': '700',
        'subheading': '600',
        'body': '400',
        'bold': '500',
      },
      // 🔤 Line Heights & Letter Spacing
      lineHeight: {
        'heading': '1.3',
        'body': '1.6',
      },
      letterSpacing: {
        'heading': '0.5px',
        'body': '0.25px',
      },
      // 🎨 Typography Colors
      colors: {
        text: {
          primary: '#FFFFFF',
          secondary: '#B0B0B0',
          muted: '#888888',
          'heading-highlight': '#FFD700',
          link: '#66ccff',
        },
      },
      maxWidth: {
        'xs': '20rem',
        'sm': '24rem',
        'md': '28rem',
        'lg': '32rem',
        'xl': '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
      },
      minHeight: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
        'screen': '100vh',
        'dvh': '100dvh',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}