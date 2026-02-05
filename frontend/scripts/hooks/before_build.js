/**
  Copyright (c) 2015, 2026, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/

'use strict';

module.exports = function (configObj) {
  return new Promise((resolve, reject) => {
  	console.log("Running before_build hook.");

    const { cpSync } = require('fs');
    cpSync('./src/components/wrc/branding-area/tips.ini', './web/components/wrc/branding-area/tips.ini');

    resolve(configObj);
  });
};
