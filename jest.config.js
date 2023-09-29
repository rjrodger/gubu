module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'],
  testTimeout: 9999,
  coveragePathIgnorePatterns: ['test'],
  transform: {
    '^.+\\.ts?$': 'es-jest'
  },
}
