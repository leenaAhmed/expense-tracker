/** @type {import('tailwindcss').Config} */
 module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1D55F3',
          light: '#496EF3',
          dark: '#1656F0',
        },
        secondary: '#F4F6FA',
        success: '#00D9A5',
        danger: '#FF6B6B',
        warning: '#FFB800',
        dark: {
          DEFAULT: '#1A1A2E',
          light: '#16213E',
        }
      },
    },
  },
  plugins: [],
}
