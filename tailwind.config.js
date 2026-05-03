export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './src/pages/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '360px',
      },
      colors: {
        brand: {
          primary:     '#0A1F44',
          mid:         '#142A5C',
          accent:      '#C9A227',
          'gold-soft': '#E8C547',
        },
        text:         '#F5F5F0',
        'text-muted': 'rgba(245, 245, 240, 0.6)',
        primary: {
          50:  '#E8EBF1',
          100: '#C5CCDA',
          200: '#8E9BB6',
          300: '#5C6F95',
          400: '#2E4574',
          500: '#0A1F44',
          600: '#08193A',
          700: '#061330',
          800: '#040D24',
          900: '#020717',
        },
      },
    },
  },
  plugins: [],
}
