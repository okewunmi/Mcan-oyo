/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eaf5ee',
          100: '#c8e8d2',
          200: '#a3d9b5',
          300: '#7bcb96',
          400: '#55bc79',
          500: '#2ea65c',
          600: '#1e8449',
          700: '#145a32',
          800: '#0d3d21',
          900: '#062110',
        },
        gold: {
          50:  '#fdf9ec',
          100: '#f8edca',
          200: '#f2dea0',
          300: '#e9c76d',
          400: '#dea840',
          500: '#c8972a',
          600: '#a67a1e',
          700: '#7d5a14',
          800: '#55390a',
          900: '#2e1f03',
        },
        cream: '#FAFAF5',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'serif'],
        body: ['var(--font-outfit)', 'sans-serif'],
        arabic: ['var(--font-amiri)', 'serif'],
      },
      backgroundImage: {
        'islamic-pattern': "url('/images/pattern.svg')",
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
