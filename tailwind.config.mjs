/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        clientBtn: 'rgb(10, 111, 167)'
      },
      screens: {
        lp: '1325px', // Custom screen size
        tb: '915px'
      },
      animation: {
        'featured-shimmer': 'featured-shimmer 1.5s infinite ease-in-out'
      },
      keyframes: {
        'featured-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      backgroundImage: {
        'featured-shimmer':
          'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'
      },
      screens: {
        'sm-d': '640px'
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none'
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none'
        }
      })
    },
    require('tailwind-scrollbar'),
    require('@tailwindcss/typography')
  ]
}
