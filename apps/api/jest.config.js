module.exports = {
  displayName: 'api',
  preset: '../../jest.preset.js',
  globals: {
    ENV: 'test',
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json'
    }
  },
  testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'ts', 'html'],
  coverageDirectory: '../../coverage/apps/api'
}
