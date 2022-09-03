/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        barlow: ['Barlow', 'cursive'],
        barlowExtraBold: ['BarlowExtraBold'],
      },
      boxShadow: {
        'shadow-in': 'inset 0px 5px 0px rgba(0,0,0,0.2)',
        'shadow-out': 'inset 0px -5px 0px rgba(0,0,0,0.2)',
      },
      colors: {
        paper: 'hsl(var(--color-paper) / <alpha-value>)',
        scissors: 'hsl(var(--color-scissors) / <alpha-value>)',
        rock: 'hsl(var(--color-rock) / <alpha-value>)',
        background: 'hsl(var(--color-background) / <alpha-value>)',
        background2: 'hsl(var(--color-background2) / <alpha-value>)',
        empty: '#1d1d6e'
      },
      gridTemplateColumns: {
        // Complex site-specific column configuration
        options: 'minmax(313px, 626px)',
      },
      backgroundImage: {
        'triangle': "url('/src/assets/bg-triangle.svg')",
      },
      backgroundSize: {
        'triangle': '213px 178px',
      }
    },
  },
  plugins: [],
};
