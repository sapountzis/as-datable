/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './thanks.html', './checklist.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif']
      },
      colors: {
        ink: { 950: '#0b0e13', 900: '#0f141a', 800: '#141b22' },
        accent: { 400: '#7aa2ff', 500: '#4f7cff', 600: '#355ee8' }
      }
    }
  },
  plugins: []
};

