/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#316bff',
          100: '#e9f3ff',
          200: '#bbceff',
          250: '#7091e5',
          275: '#5f84e2',
          300: '#316bff',
          325: '#3d6adc',
          350: '#2b5cd9',
          400: '#134cdd',
          500: '#0132b0',
        },
        success: {
          DEFAULT: '#31c52e',
          100: '#e5fce5',
          200: '#9ae299',
          400: '#009e00',
          500: '#007300',
        },
        warning: {
          DEFAULT: '#dfb009',
          100: '#fff8d3',
          200: '#ffe172',
          400: '#d9aa00',
          500: '#916d00',
        },
        alert: {
          100: '#ffe7e2',
          200: '#f8b1b1',
          400: '#be0723',
          500: '#8c0000',
        },
        accent: {
          1: '#c9e8ff',
          2: '#b2d1e6',
        },
        secondary: '#ffb0cc',
        tertiary: {
          1: '#91e0bf',
          2: '#f5967e',
        },
        themePrimary: {
          1: '#366092',
          2: '#538dd5',
        },
        textLight: '#566f8f',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'h1': 'clamp(2.25rem, 4.5vw, 3.5rem)',
        'h2': 'clamp(1.875rem, 3.5vw, 2.75rem)',
        'h3': 'clamp(1.5rem, 2.5vw, 2rem)',
        'h4': 'clamp(1.25rem, 2vw, 1.5rem)',
      },
      lineHeight: {
        'comfortable': '1.7',
      },
      spacing: {
        'section': 'clamp(80px, 10vw, 120px)',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(49, 107, 255, 0.08)',
        'card-hover': '0 4px 16px rgba(49, 107, 255, 0.12)',
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
};
