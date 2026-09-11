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
        sepia: {
          50: '#fbf8f1',
          100: '#f6f0df',
          200: '#eee0c2',
          300: '#e3cca0',
          400: '#d5b27a',
          500: '#c59a58',
          600: '#b18146',
          700: '#8c6136',
          800: '#644427',
          900: '#432d19',
          950: '#2b1c0e',
        }
      },
      fontFamily: {
        serif: ['Charter', 'Bitstream Charter', 'Sitka Text', 'Cambria', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

