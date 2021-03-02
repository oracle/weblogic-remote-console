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
    "js-copyright": ["error",{
      regexPatterns: {
        startLine: "^\\/\\*\\*\\s*",
        licenseTag: "\\s*\\*\\s*@license",
        copyrightLine: "\\s*\\*\\s*Copyright\\s*\\(c\\)\\s*[\\s*\\d{4}$|\\d{4}$\\-\\d{4}$|\\d{4}$,]+[ ,|]\\s*Oracle[ |Corporation|Corp|Corp\\.]+and\\/or its affiliates.",
        uplLine: "\\s*\\*\\s*The Universal Permissive License \\(UPL\\), Version 1\\.0",
        ignoreTag: "\\s*\\*\\s*@ignore",
        endLine: "\\s*\\*\\/"
      },
      validCopyright: "/**\n * @license\n * Copyright (c) 2020 Oracle Corporation and/or its affiliates.\n * The Universal Permissive License (UPL), Version 1.0\n * @ignore\n */\n"
    }]
  }
};