module.exports = {
  preset: 'react-native',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/backend/'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((@)?react-native|@react-native|@react-navigation|react-native-safe-area-context|react-native-gesture-handler|react-native-reanimated|react-native-svg|react-native-vector-icons)/)',
  ],
};
