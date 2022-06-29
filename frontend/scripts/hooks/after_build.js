/**
  Copyright (c) 2015, 2022, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/

'use strict';

module.exports = function (configObj) {
  return new Promise((resolve, reject) => {
    console.log("Running after_build hook.");

    // by default, the baseUrl is going to be empty -- 
    // the REST backend will be at the same host and port as the frontend.
    // in "dev" mode, the REST backend will be the local ojet serve
    const baseUrlFile = 'web/js/jet-composites/wrc-frontend/1.0.0/core/baseUrl'
    const fs = require('fs')
    var baseUrlData = "http://localhost:8012"

    var userOptions = configObj.userOptions
    if (typeof userOptions !== 'undefined') {
      var qd = {};
      userOptions.split(",").forEach(function (item) { var s = item.split("="), k = s[0], v = s[1] && decodeURIComponent(s[1]); (qd[k] = qd[k] || []).push(v) })

      var environment = qd.environment

      if (typeof environment !== 'undefined' && environment.length != 0) {
        switch (environment[0]) {
          case "helidon":
            baseUrlData = ""
            break
          default:
            baseUrlData = "http://localhost:8012"
        }
      }

    }

    fs.writeFile(baseUrlFile, baseUrlData, (err) => {
      if (err) throw err;
    })

    resolve(configObj);
  });
};

