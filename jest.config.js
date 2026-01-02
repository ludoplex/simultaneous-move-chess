module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    '*.js',
    '!node_modules/**',
    '!tests/**',
    '!coverage/**',
    '!playwright.config.js',
    '!jest.config.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  testMatch: [
    '**/tests/unit/**/*.test.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
