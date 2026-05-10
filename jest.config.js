const { defaults } = require('jest-config');

module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@shopify/flash-list|react-native-reanimated|react-native-gesture-handler|@gorhom/bottom-sheet)',
  ],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
  setupFilesAfterFramework: ['@testing-library/react-native/extend-expect'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.types.ts',
    '!src/**/index.ts',
  ],
  coverageThresholds: {
    global: {
      lines: 70,
      functions: 80,
      branches: 65,
    },
  },
};
