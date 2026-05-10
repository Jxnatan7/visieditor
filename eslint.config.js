import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@features/*/internal/*'],
            message: 'Do not import feature internals. Use the public index.ts.',
          },
        ],
      }],
    },
  },
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
          { group: ['@features/*', 'src/features/*'], message: 'ui/ must not import from features/' },
          { group: ['@core/!(design-system)*', 'src/core/!(design-system)*'], message: 'ui/ must not import from core/ (except design-system)' },
        ],
      }],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ['node_modules/', '.expo/', 'dist/', 'scripts/'],
  },
);
