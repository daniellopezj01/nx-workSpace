module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 11
  },
  rules: {
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    'no-param-reassign': 0,
    'no-confusing-arrow': 0,
    'func-names': ['error', 'never'],
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    'no-underscore-dangle': ['error', { allow: ['_id', '_doc', '__'] }],
    // 'no-unused-vars': ['error', { allow: ['_'] }],
    'array-callback-return': 0,
    'consistent-return': 0,
    'arrow-parens': ['error'],
    'no-console': ['error', { allow: ['warn', 'error', 'log'] }],
    'spaced-comment': ['error', 'always', { block: { exceptions: ['*'] } }],
    'max-len': ['error', { code: 120 }],
    'no-ex-assign': 0,
    'linebreak-style': 0,
    'arrow-body-style': 0,
    'no-plusplus': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: false
      }
    ],
    'prefer-promise-reject-errors': 0,
    'no-async-promise-executor': 0,
    'import/no-dynamic-require': 0,
    'global-require': 0,
    'prefer-destructuring': ['error', { object: true, array: false }]
  }
}
