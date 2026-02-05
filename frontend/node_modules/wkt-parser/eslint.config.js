import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  recommendedConfigs: {
    'eslint:recommended': {
      rules: {
        'no-unused-vars': [
          'error',
          { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
        ],
      },
    },
  },
});

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2015,
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
      },
    },
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      'brace-style': ['error', '1tbs'],
      quotes: ['error', 'single'],
      'no-console': 'off',
      'no-shadow': 'off',
      'no-use-before-define': ['error', { functions: false }],
      'no-underscore-dangle': 'off',
      'no-constant-condition': 'off',
      'space-after-function-name': 'off',
      'consistent-return': 'off',
    },
  },
];
