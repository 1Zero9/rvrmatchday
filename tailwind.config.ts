import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Orbitron", "system-ui", "sans-serif"],
        heading: ["Rajdhani", "system-ui", "sans-serif"],
        accent: ["Exo 2", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b3d9ff',
          300: '#80c2ff',
          400: '#4da6ff',
          500: '#1E649F',
          600: '#1a5a8f',
          700: '#164a73',
          800: '#134060',
          900: '#0f3048',
          950: '#0a1f30',
        },
        accent: {
          pink: '#e91e63',
          'pink-light': '#f48fb1',
          teal: '#00bcd4',
          'teal-dark': '#00838f',
          green: '#4caf50',
          'green-dark': '#2e7d32',
        },
        kids: {
          yellow: '#ffeb3b',
          'yellow-dark': '#f57f17',
          orange: '#ff9800',
          'orange-dark': '#ef6c00',
          purple: '#9c27b0',
          'purple-dark': '#6a1b9a',
          lime: '#8bc34a',
          'lime-dark': '#558b2f',
        },
        club: {
          navy: '#0d1b2a',
          'navy-light': '#1b263b',
          grass: '#4a7c59',
          'grass-light': '#6b9b7f',
          pitch: '#2e5a3e',
          'pitch-light': '#426350',
        },
        // Better contrast colors for text
        text: {
          primary: '#1a202c',
          secondary: '#4a5568',
          muted: '#718096',
          inverse: '#ffffff',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'slide-in-right': 'slideInRight 0.8s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
