export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: '#1f2937',
        background: '#060b16',
        card: '#0d1627',
        primary: '#2dd4bf',
        secondary: '#60a5fa',
        muted: '#94a3b8'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(96,165,250,0.2), 0 15px 40px rgba(15, 23, 42, 0.6)'
      }
    }
  },
  plugins: []
};
