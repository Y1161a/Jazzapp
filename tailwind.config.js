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
        charcoal: {
          DEFAULT: '#171e19',
          50: '#f4f5f4',
          100: '#e5e7e5',
          200: '#ccd1cc',
          300: '#a6b0a6',
          400: '#7a897b',
          500: '#5c6c5d',
          600: '#485549',
          700: '#3a443b',
          800: '#303931',
          900: '#2a312b',
          950: '#171e19',
        },
        brandRed: {
          DEFAULT: '#ca0013',
          hover: '#b00010',
          light: '#ffeaec',
        },
        sage: {
          DEFAULT: '#b7c6c2',
          light: '#dbe3e1',
          dark: '#8b9f9a',
        },
        offwhite: '#eeebe3',
      },
      fontFamily: {
        sans: ['Nunito', 'Cairo', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'hero': '40px',
        'feed': '24px',
        'bento': '16px',
      },
      boxShadow: {
        'soft': '0 20px 50px -12px rgba(0, 0, 0, 0.08)',
        'fab': '0 12px 30px -4px rgba(202, 0, 19, 0.35)',
        'card': '0 10px 30px -8px rgba(23, 30, 25, 0.06)',
      },
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      }
    },
  },
  plugins: [],
}
