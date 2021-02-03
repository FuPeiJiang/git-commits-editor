module.exports = {
  'root': true,
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  'env': {
    'node': true,
  },
  'rules': {
    '@typescript-eslint/naming-convention': 'warn',
    '@typescript-eslint/semi': 'warn',
    'semi': 'off',
    'curly': 'warn',
    'eqeqeq': 'warn',
    'no-throw-literal': 'warn',

    'no-var' : 'off',
    'keyword-spacing': 'off',
    '@typescript-eslint/keyword-spacing': ['error'],
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': ['error', 'never'],
    '@typescript-eslint/type-annotation-spacing': 'error',
    'template-curly-spacing': [
      'error',
    ],
    'no-multi-spaces': [
      'error',
    ],
    'prefer-template': [
      'error',
    ],
    'no-trailing-spaces': [
      'error',
    ],
    'space-infix-ops': [
      'error',
    ],
    'indent': [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'constructor-super': [
      'error',
    ],
    'for-direction': [
      'error',
    ],
    'getter-return': [
      'error',
    ],
    'no-async-promise-executor': [
      'error',
    ],
    'no-case-declarations': [
      'error',
    ],
    'no-class-assign': [
      'error',
    ],
    'no-compare-neg-zero': [
      'error',
    ],
    'no-cond-assign': [
      'error',
    ],
    'no-const-assign': [
      'error',
    ],
    'no-constant-condition': [
      'error',
    ],
    'no-control-regex': [
      'off',
    ],
    'no-debugger': [
      'error',
    ],
    'no-delete-var': [
      'error',
    ],
    'no-dupe-args': [
      'error',
    ],
    'no-dupe-class-members': [
      'error',
    ],
    'no-dupe-else-if': [
      'error',
    ],
    'no-dupe-keys': [
      'error',
    ],
    'no-duplicate-case': [
      'error',
    ],
    'no-empty': [
      'error',
    ],
    'no-empty-character-class': [
      'error',
    ],
    'no-empty-pattern': [
      'error',
    ],
    'no-ex-assign': [
      'error',
    ],
    'no-extra-boolean-cast': [
      'error',
    ],
    'no-extra-semi': [
      'error',
    ],
    'no-fallthrough': [
      'error',
    ],
    'no-func-assign': [
      'error',
    ],
    'no-global-assign': [
      'error',
    ],
    'no-import-assign': [
      'error',
    ],
    'no-inner-declarations': [
      'error',
    ],
    'no-invalid-regexp': [
      'error',
    ],
    'no-irregular-whitespace': [
      'error',
    ],
    'no-misleading-character-class': [
      'error',
    ],
    'no-mixed-spaces-and-tabs': [
      'error',
    ],
    'no-new-symbol': [
      'error',
    ],
    'no-obj-calls': [
      'error',
    ],
    'no-octal': [
      'error',
    ],
    'no-prototype-builtins': [
      'error',
    ],
    'no-redeclare': [
      'off',
    ],
    'no-regex-spaces': [
      'error',
    ],
    'no-self-assign': [
      'error',
    ],
    'no-setter-return': [
      'error',
    ],
    'no-shadow-restricted-names': [
      'error',
    ],
    'no-sparse-arrays': [
      'error',
    ],
    'no-this-before-super': [
      'error',
    ],
    'no-undef': [
      'error',
    ],
    'no-unexpected-multiline': [
      'error',
    ],
    'no-unreachable': [
      'error',
    ],
    'no-unsafe-finally': [
      'error',
    ],
    'no-unsafe-negation': [
      'error',
    ],
    'no-unused-labels': [
      'error',
    ],
    'no-unused-vars': [
      'error',
    ],
    'no-useless-catch': [
      'error',
    ],
    'no-useless-escape': [
      'error',
    ],
    'no-with': [
      'error',
    ],
    'require-yield': [
      'error',
    ],
    'use-isnan': [
      'error',
    ],
    'valid-typeof': [
      'error',
    ],

  },
};
