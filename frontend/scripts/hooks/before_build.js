/**
  Copyright (c) 2015, 2026, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/

'use strict';

module.exports = function (configObj) {
  return new Promise((resolve) => {
    console.log("Running before_build hook.");

    const { cpSync, mkdirSync } = require('fs');
    mkdirSync('./web/wrc/branding-area', { recursive: true });
    cpSync('./src/wrc/branding-area/tips.ini', './web/wrc/branding-area/tips.ini');

    resolve(configObj);
  });
};
