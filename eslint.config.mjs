import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: { parser: tsParser },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-undef': 'off',
    },
  },
  {
    files: ['*.config.js', '*.config.cjs'],
    languageOptions: { globals: { module: 'readonly', require: 'readonly' } },
  },
  { ignores: ['node_modules/', 'dist/'] },
]
