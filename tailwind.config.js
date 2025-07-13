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
        'n64-yellow': '#D69E2E',
        'n64-red': '#E53E3E',
        'n64-gray': '#2D3748',
      },
      fontFamily: {
        'retro': ['Courier New', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}