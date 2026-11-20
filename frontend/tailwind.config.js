/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '400px',
      },
      colors: {
        navy: '#102353',
        navyDark: '#0a1738',
        navyLight: '#1b3474',
        gold: '#bb984d',
        goldDark: '#9f7e34',
        goldLight: '#d4af37',
        coral: '#bb984d',
        coralDark: '#9f7e34',
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        domine:  ['Domine', 'serif'],
      },
    },
  },
  plugins: [],
};
