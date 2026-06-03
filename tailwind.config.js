/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wxbg: '#EDEDED',
        wxgreen: '#07C160',
        wxbubble: '#95EC69',
        yuanbao: {
          50: '#F0FBF7',
          100: '#DCF5EA',
          200: '#B8EAD3',
          300: '#8FDDB9',
          400: '#5DCB99',
          500: '#36B37E',
          600: '#1F9468',
          700: '#177554',
        },
        ink: {
          900: '#0F1115',
          700: '#2C313A',
          500: '#5B6371',
          300: '#A6ACB6',
          100: '#E6E8EC',
        },
      },
      boxShadow: {
        soft: '0 8px 24px -8px rgba(15, 17, 21, 0.10), 0 2px 6px -2px rgba(15, 17, 21, 0.06)',
        glow: '0 8px 32px -8px rgba(54, 179, 126, 0.35)',
      },
      backgroundImage: {
        'yb-gradient': 'linear-gradient(135deg, #DCF5EA 0%, #E6F4FF 100%)',
        'yb-strong': 'linear-gradient(135deg, #5DCB99 0%, #4BA3E3 100%)',
      },
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
