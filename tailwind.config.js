/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          50: '#F0F5F2',
          100: '#DDE8E2',
          200: '#B8D1C4',
          700: '#234A36',
          800: '#1A3728',
          900: '#12251B',
        },
        berry: {
          50: '#FAF0F0',
          100: '#F4DEDE',
          600: '#9B3B3B',
          700: '#842D2D',
          800: '#692020',
        },
        warm: {
          50: '#FAF9F6',
          100: '#F4F1EA',
          200: '#E8E3D8',
          300: '#D6CEBF',
          800: '#3D3A35',
          900: '#24221F',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
