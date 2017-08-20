// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    mocha: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-unused-expressions': 0,
    'no-constant-condition': 0,
    'import/first': 0,
    "indent": [2, 4, { "SwitchCase": 1 }],
    'no-unused-vars': 0,
    'eol-last': 0,
    'no-fallthrough': 0,
    'no-unneeded-ternary': 0,
    'no-undef': 0,
    'valid-typeof': 0,
    'eqeqeq': 0,
    'camelcase': 0,
    'no-new-wrappers': 0
  }
}