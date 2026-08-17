const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
  {
    // src/components and src/services are the two layers the repo layout rule
    // in IMPLEMENTATION.md constrains: components never touch a store, and
    // services never import React.
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/stores', '@/stores/*'],
              message:
                'Components are presentational. Read state in a feature or route and pass it down as props.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/services/**/*.ts', 'src/lib/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              message:
                'Services and lib helpers must be testable without a renderer. Keep React out of them.',
            },
          ],
          patterns: [
            {
              group: ['react-native', 'react-native/*'],
              message:
                'Services and lib helpers must be testable without a renderer. Keep React Native out of them.',
            },
          ],
        },
      ],
    },
  },
  {
    // Colors live in src/design/colors.ts (and shadow definitions in
    // src/design/shadows.ts) so contrast stays auditable in one place —
    // see tests/unit/contrast.test.ts.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/design/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
          message: 'Raw hex colors are banned outside src/design/. Add the color to src/design/ and import it.',
        },
      ],
    },
  },
]);
