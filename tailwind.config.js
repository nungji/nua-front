module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  // NativeWind's default is 'media', which makes react-native-css-interop throw from its
  // web color-scheme observer and leaves the app blank on web.
  darkMode: 'class',
  theme: {
    extend: {}
  },
  plugins: []
};
