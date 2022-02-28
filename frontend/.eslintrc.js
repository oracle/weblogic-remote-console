"use strict";

module.exports = {
  env: {
    "amd": true,
    "browser": true,
    "commonjs": true,
    "es2021": true,
    "es6": true, // es6 is the same as es2015
    "jquery": true,
    "mocha": true,
    "node": true
  },
  extends: "eslint:recommended",
  parserOptions: {
    "ecmaVersion": 12
  },
  overrides: [
    {
      files: [
        "main.js"
      ],
      rules: {
        "strict": "off",
        "no-undef": "off"
      }
    }
  ],
  rules: {
    "strict": "error",
    "no-unused-vars": "off",
    "no-console": "off",
    "no-fallthrough": "off",
    "no-prototype-builtins": "off",
    "quotes": [
      "error",
      "single"
    ]
  }
};