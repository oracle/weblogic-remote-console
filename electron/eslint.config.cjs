"use strict";

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    files: ["app/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
    },
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
    rules: {
      strict: "error",
      "no-unused-vars": "off",
      "no-console": "off",
      "no-fallthrough": "off",
      "no-prototype-builtins": "off",
      quotes: ["error", "single"],
    },
  },
  {
    files: ["app/main.js"],
    rules: {
      strict: "off",
      "no-undef": "off",
    },
  },
];