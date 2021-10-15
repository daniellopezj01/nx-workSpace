module.exports = {
  displayName: 'api',
  preset: '../../jest.preset.js',
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json'
    }
  },
  testEnvironment: 'node',
  // testMatch: ['**/tests/testAdmin/test.js'],
  testMatch: ['**/tests/testAdmin/auth.js'],
  // testMatch: ['**/tests/**/*.js'],
  // testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.[tj]s$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'ts', 'html', 'json'],
  coverageDirectory: '../../coverage/apps/api'
}
