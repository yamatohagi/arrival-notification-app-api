module.exports = {
  parser: '@typescript-eslint/parser',

  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:no-array-reduce/recommended',
  ],

  plugins: ['@typescript-eslint', 'import'],

  rules: {
    // General
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-empty-interface': 0,

    // Import
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    // other todo: reactプロジェクトから移植したので整理
    'no-new': 0,
    'no-alert': 0,
    'no-shadow': 0,
    'no-console': 0,
    'import/no-cycle': 0,
    'arrow-body-style': 1,
    'consistent-return': 1,
    'no-param-reassign': 0,
    'no-use-before-define': 0,
    'no-underscore-dangle': 0,
    'import/no-unresolved': 0,
    'no-unused-expressions': 0,
    'no-irregular-whitespace': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'no-promise-executor-return': 0,
    'no-unsafe-optional-chaining': 0,
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0,
    'no-unused-vars': [
      1,
      {
        ignoreRestSiblings: false,
      },
    ],
    'prefer-destructuring': [
      1,
      {
        object: true,
        array: false,
      },
    ],
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
};
