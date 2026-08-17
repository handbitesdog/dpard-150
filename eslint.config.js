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
  {
    // Scoped to StyleSheet.create objects and JSX `style` props specifically,
    // not the whole file — business logic (pagination, schema versions, WCAG
    // math in src/lib/contrastRatio.ts) has numbers with nothing to do with
    // design tokens, and a file-wide ban flags those too. 0 and 1 stay
    // allowed (flex: 1, zero offsets, ternary fallbacks like `pressed ? x :
    // 1`). This doesn't reach numeric literals in other JSX props (e.g. a
    // bare `size={20}`) — those still need a local named constant by hand,
    // same as the values already promoted to src/design/ tokens.
    files: ['src/**/*.tsx'],
    ignores: ['src/design/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.object.name='StyleSheet'][callee.property.name='create'] Property > Literal[raw=/^\\d+(\\.\\d+)?$/][raw!='0'][raw!='1']",
          message:
            'Raw numeric literals are banned in StyleSheet.create outside src/design/. Add the value to a src/design/ token, or a local named constant if it only applies here.',
        },
        {
          selector:
            "CallExpression[callee.object.name='StyleSheet'][callee.property.name='create'] Property > ConditionalExpression > Literal[raw=/^\\d+(\\.\\d+)?$/][raw!='0'][raw!='1']",
          message:
            'Raw numeric literals are banned in StyleSheet.create outside src/design/. Add the value to a src/design/ token, or a local named constant if it only applies here.',
        },
        {
          selector:
            "JSXAttribute[name.name='style'] Property > Literal[raw=/^\\d+(\\.\\d+)?$/][raw!='0'][raw!='1']",
          message:
            'Raw numeric literals are banned in style props outside src/design/. Add the value to a src/design/ token, or a local named constant if it only applies here.',
        },
        {
          selector:
            "JSXAttribute[name.name='style'] Property > ConditionalExpression > Literal[raw=/^\\d+(\\.\\d+)?$/][raw!='0'][raw!='1']",
          message:
            'Raw numeric literals are banned in style props outside src/design/. Add the value to a src/design/ token, or a local named constant if it only applies here.',
        },
      ],
    },
  },
]);
