/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: {
          DEFAULT: '#FFFFFF',
          100: '#F4F2F0'
        },
        primary: {
          DEFAULT: '#5184FF',
        },
        neutral: {
          300: '#9A9FA5',
          500: '#6F767E',
          800: '#111315',
          900: '#1A1D1F'
        }

      },
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans]
      },
    },
  },
  plugins: [],
}
