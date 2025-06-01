import { FlatCompat } from '@eslint/eslintrc';
import parser from '@typescript-eslint/parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:@tanstack/query/recommended'),

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
    },
    rules: {
      'react/no-unknown-property': ['error', { ignore: [] }],
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-undef': 'off',
      'react/function-component-definition': [
        2,
        { namedComponents: ['arrow-function', 'function-declaration'] },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },

  {
    ignores: [
      '.next/**/*',
      'tailwind.config.ts',
      '.lintstagedrc.js',
      '**/*.stories.tsx',
    ],
  },
];

export default eslintConfig;
