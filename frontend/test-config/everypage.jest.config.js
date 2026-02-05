/**
  Copyright (c) 2015, 2024, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
module.exports = {
    rootDir: process.cwd(),
    preset: "@oracle/oraclejet-jest-preset",
  moduleNameMapper: {
    "wrc/wrc-form/(.*)": "<rootDir>/web/components/wrc/wrc-form/$1",
    "ojL10n!(.*)/wrc-form-strings":"<rootDir>/web/components/wrc/resource/resources/nls/wrc-form-strings"
  },
    setupFiles: [
      "<rootDir>/test-config/testSetup.ts"
    ],
    testMatch: [
      "<rootDir>/src/**/__tests__/**/wrc-form.spec.tsx"
    ]
}
