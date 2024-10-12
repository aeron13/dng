/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'orange': '#FFC8A0',
      'yellow': '#FFFA8F',
      'green': '#BCFF93',
      'sky': '#A6FAFF',
      'purple': '#E3B6FF',
      'blue': '#628DD9',
      'dark': '#302B2B',
      'white': '#ffffff',
    },
    fontFamily: {
      impact: ['Impact', 'Inter', 'sans-serif'],
      inter: ['Inter', 'sans-serif'],
      mono: ['Courier', 'monospace'],
      serif: ['Noto Serif Display', 'Inter', 'sans-serif']
    },
    extend: {
      fontSize: {
        small: '13px',
        text: '15px',
        mid: '22px',
        xl: '53.4px'
      }
    },
  },
  plugins: [],
}