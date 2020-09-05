module.exports = {
  root:          true,
  parser:        '@typescript-eslint/parser',
  plugins:       [
    '@typescript-eslint',
  ],
  extends:       [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType:  'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules:         {
    '@typescript-eslint/array-type': [
      'error',
      {default: 'generic'},
    ],
    '@typescript-eslint/no-use-before-define': [
        'off'
    ]
  },
};
