/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#C9A84C',
        secondary: '#1A1A2E',
        accent: '#E94560',
        background: '#0F0F1A',
        'background-light': '#FAFAFA',
        surface: '#16213E',
        'surface-hover': '#1E2D50',
        success: '#00C896',
        warning: '#FFB830',
        error: '#FF4757',
        info: '#0EA5E9',
      },
    },
  },
  plugins: [],
}
