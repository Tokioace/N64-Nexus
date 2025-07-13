/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'retro-blue': '#0066CC',
        'retro-green': '#00CC66',
        'retro-purple': '#9933CC',
        'retro-orange': '#FF6600',
        'retro-pink': '#FF66CC',
        'retro-yellow': '#FFFF00',
        'retro-gray': '#666666',
        'retro-dark': '#333333',
        'retro-light': '#CCCCCC',
        'msn-blue': '#1E90FF',
        'icq-green': '#00FF00',
        'chat-bubble': '#E8F4FD',
        'chat-bubble-own': '#DCF8C6'
      },
      fontFamily: {
        'retro': ['Courier New', 'monospace'],
        'pixel': ['Press Start 2P', 'cursive'],
        'msn': ['Comic Sans MS', 'cursive']
      },
      animation: {
        'message-received': 'messageReceived 0.3s ease-in-out',
        'notification-pulse': 'notificationPulse 2s infinite',
        'typing': 'typing 1.5s infinite'
      },
      keyframes: {
        messageReceived: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        notificationPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' }
        },
        typing: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}