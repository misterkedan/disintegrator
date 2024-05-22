module.exports = {
  env: {
    browser: true,
    amd: true,
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  ignorePatterns: ['dist/*', 'lib/*', 'vendor/*', '*.min.js', '_/*'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    indent: ['warn', 2],
    quotes: ['error', 'single'],
    'key-spacing': 'off',
    'no-multi-spaces': 'off',
  },
};
