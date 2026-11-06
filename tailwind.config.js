/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#173F35',
          dark: '#102D26',
          deep: '#0c221d',
          light: '#23584c',
          surface: '#1c4c40',
        },
        ivory: {
          DEFAULT: '#F7F5EF',
          soft: '#ECE9DF',
          warm: '#F4F1E8',
          border: '#E2DEC9',
        },
        lime: {
          DEFAULT: '#C6F36B',
          hover: '#b5e954',
          subtle: '#e4f9b8',
          text: '#2d4b00',
        },
        sage: {
          DEFAULT: '#A6B8A4',
          light: '#C4D3C2',
          dark: '#7A9178',
        },
        charcoal: {
          DEFAULT: '#202520',
          muted: '#4B5548',
          light: '#6E7A6B',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(16, 45, 38, 0.05)',
        'card': '0 8px 30px rgba(16, 45, 38, 0.07)',
        'lifted': '0 20px 40px -15px rgba(16, 45, 38, 0.12)',
        'lime-glow': '0 0 25px rgba(198, 243, 107, 0.45)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
