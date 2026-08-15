/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/tests/__mocks__/svgMock.tsx',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-native-nitro-modules$':
      '<rootDir>/tests/__mocks__/react-native-nitro-modules.ts',
  },
  testMatch: ['<rootDir>/tests/**/*.test.{ts,tsx}'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/data/**'],
};
