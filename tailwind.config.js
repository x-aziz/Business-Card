/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#0F172A',
          DEFAULT: '#1E293B',
          light: '#334155',
        },
        accent: {
          cyan: {
            DEFAULT: '#06B6D4',
            light: '#22D3EE',
          },
          purple: {
            DEFAULT: '#8B5CF6',
            light: '#A78BFA',
          },
          green: {
            DEFAULT: '#10B981',
            light: '#34D399',
          }
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        }
      }
    },
  },
  plugins: [],
}