/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cafe: {
          50: '#fbf8f5',
          100: '#f5eee6',
          200: '#ebd9c8',
          300: '#debfa3',
          400: '#cd9f78',
          500: '#b87d51',
          600: '#9f643f',
          700: '#7f4c33',
          800: '#643c2d',
          900: '#4e2f25',
          950: '#2a1711',
        },
        jazz: {
          gold: '#d4af37',
          brass: '#c59b27',
          amber: '#e69138',
          copper: '#b87333',
          crema: '#fff8f0',
          night: '#131110',
          surface: '#1c1917',
          card: '#24201d',
          border: '#38322e',
        }
      },
      fontFamily: {
        sans: ['Cairo', 'Inter', 'system-ui', 'sans-serif'],
      },
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      }
    },
  },
  plugins: [],
}
