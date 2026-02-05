/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

const fs = require('fs-extra');
const config = require('./config');
const path = require('path');

const clean = function (filepath) {
  return new Promise((resolve, reject) => {
    fs.emptyDir(filepath, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log(`Finished clean path ${filepath}..`);
        resolve();
      }
    });
  });
};

clean.platform = function () {
  config.loadOraclejetConfig();
  clean(path.join(process.cwd(), config('paths').staging.web));
};

module.exports = clean;

