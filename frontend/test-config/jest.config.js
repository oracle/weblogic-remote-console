/**
  Copyright (c) 2015, 2024, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/

const jetPreset = require("@oracle/oraclejet-jest-preset");

module.exports = {
  rootDir: process.cwd(),
  preset: "@oracle/oraclejet-jest-preset",
  moduleNameMapper: {
      "^wrc/(.*)$": "<rootDir>/web/components/wrc/$1",
      "^ojL10n!wrc/(.*)$": "<rootDir>/web/components/wrc/$1",
      "^css!.*$": "identity-obj-proxy",
      "wrc/(.*)": "<rootDir>/web/components/wrc/$1",
      "^project-menu/(.*)$": "<rootDir>/web/components/wrc/project-menu/$1",
      "^assets/(.*)$": "<rootDir>/web/components/wrc/assets/$1",
      "^error-boundary/(.*)$": "<rootDir>/web/components/wrc/error-boundary/$1",
      "^resource/(.*)$": "<rootDir>/web/components/wrc/resource/$1",
      "^shared/(.*)$": "<rootDir>/web/components/wrc/shared/$1",
      "^nav-tree/(.*)$": "<rootDir>/web/components/wrc/nav-tree/$1"
},
  setupFiles: ["<rootDir>/test-config/testSetup.ts"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.spec.tsx",
    "<rootDir>/src/**/__tests__/**/*.spec.ts",
    "!**/*.everypage.spec.*"
  ],
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "Test Report"
      }
    ]
  ]
};
