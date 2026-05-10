module.exports = {
  extends: [
    'expo',
    'plugin:@typescript-eslint/strict',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['@typescript-eslint', 'import', 'react-hooks'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    'import/no-default-export': 'off',
    'react-hooks/exhaustive-deps': 'error',
    'no-restricted-imports': ['error', {
      patterns: [
        {
          group: ['@features/*/internal/*'],
          message: 'Do not import internals of another feature. Use the public index.ts.',
        },
      ],
    }],
  },
  overrides: [
    {
      files: ['src/core/**/*'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [
            { group: ['@features/*', 'src/features/*'], message: 'core/ must not import from features/' },
          ],
        }],
      },
    },
    {
      files: ['src/ui/**/*'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [
            { group: ['@features/*', 'src/features/*', '@core/*', 'src/core/*'], message: 'ui/ is a pure primitive layer — no upward imports.' },
          ],
        }],
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
};
