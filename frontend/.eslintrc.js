module.exports = {
  "env": {
    "browser": true
  },
  "parser": "babel-eslint",
  "extends": "airbnb",
  "plugins": [
    "eslint-plugin-flowtype",
  ],
  "rules": {
    "arrow-body-style": ["error", "always"],
    "flowtype/define-flow-type": 1,
    "jsx-a11y/label-has-for": 0,
    "max-len": [1, 132, 2],
    "react/prefer-stateless-function": 0,
    "react/jsx-filename-extension": 0,
    "strict": 0,
    'no-console': 'off',
		'prefer-template':'off',
		'linebreak-style': ["off", "windows"],
		"import/no-named-as-default": 0,
    "no-restricted-syntax": 0,
		'jsx-a11y/no-static-element-interactions': [
  'error',
  {
    handlers: [
      // 'onClick',
      'onMouseDown',
      'onMouseUp',
      'onKeyPress',
      'onKeyDown',
      'onKeyUp',
    ],
  },
],
  },
};
