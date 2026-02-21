/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      colors: {
        bob: {
          green: '#58CC02',
          'green-dark': '#46A302',
          'green-light': '#89E219',
          orange: '#FF9600',
          'orange-dark': '#E68600',
          blue: '#1CB0F6',
          'blue-dark': '#1899D6',
          purple: '#CE82FF',
          red: '#FF4B4B',
          yellow: '#FFC800',
        },
        lesson: {
          bg: '#F7F7F7',
          card: '#FFFFFF',
          border: '#E5E5E5',
        },
      },
      animation: {
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'pop': 'pop 0.3s ease-out',
      },
      keyframes: {
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.9)', opacity: '0.5' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'bob': '0 4px 0 0 #46A302',
        'bob-sm': '0 2px 0 0 #46A302',
        'card': '0 2px 8px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
