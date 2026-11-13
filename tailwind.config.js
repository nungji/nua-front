module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  // NativeWind's default is 'media', which makes react-native-css-interop throw from its
  // web color-scheme observer and leaves the app blank on web.
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ocean: { deep: '#0158C8', base: '#016BEA', mid: '#01A7FC', cyan: '#44D5EE', foam: '#E4F3FC' },
        sand: { base: '#FDD480', light: '#F9E4A5' },
        accent: {
          orange: '#FFA24C',
          deep: '#FF5A1F',
          yellow: '#FFC93C',
          coral: '#EE6474',
          purple: '#995DBE',
          mint: '#97E1D1'
        },
        curtain: '#E05757'
      },
      fontFamily: { jua: ['Jua'] },
      borderRadius: { card: '28px' }
    }
  },
  plugins: []
};
