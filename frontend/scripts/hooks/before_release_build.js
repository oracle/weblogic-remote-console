/**
  Copyright (c) 2015, 2026, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/

'use strict';

module.exports = function (configObj) {
  return new Promise((resolve, reject) => {
    console.log("Running before_release_build hook.");
    
    console.log('Generating all nls bundles');
    
    const { execFileSync } = require("child_process");
    const fs = require("fs");
    
    const destinationDir = './web/components/wrc/shared/resources/nls';

    fs.mkdirSync(destinationDir, { recursive: true });

    const cwd = process.cwd();

    const env = { ...process.env, ...{
      NODE_PATH: `${cwd}/node_modules`
    } };

    execFileSync(
      'node',
      [ 'nls/create-translation-bundles.js', '-p', 'nls', '-o', `${destinationDir}` ],
      { stdio: 'inherit', env: env },
    );
    
  	resolve(configObj);
  });
};
