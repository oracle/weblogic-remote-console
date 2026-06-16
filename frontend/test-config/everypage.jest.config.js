/**
 Copyright (c) 2015, 2026, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
module.exports = {
    rootDir: process.cwd(),
    preset: "@oracle/oraclejet-jest-preset",
  moduleNameMapper: {
    "wrc/wrc-form/(.*)": "<rootDir>/web/wrc/wrc-form/$1",
    "ojL10n!(.*)/wrc-form-strings":"<rootDir>/web/wrc/resource/resources/nls/wrc-form-strings"
  },
    setupFiles: [
      "<rootDir>/test-config/testSetup.ts"
    ],
    testMatch: [
      "<rootDir>/src/**/__tests__/**/wrc-form.spec.tsx"
    ]
}
