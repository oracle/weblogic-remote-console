/**
  Copyright (c) 2015, 2020, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/

'use strict';

module.exports = function (configObj) {
  return new Promise((resolve, reject) => {
    console.log('Running before_serve hook.');
    // ojet custom connect and serve options
    // { connectOpts, serveOpts } = configObj;
    // const express = require('express');
    // const http = require('http');
    // pass in custom http
    // configObj['http'] = http;
    // pass in custom express app
    // configObj['express'] = express();
    // pass in custom options for http.createServer
    // const serverOptions = {...};
    // configObj['serverOptions'] = serverOptions;
    // pass in custom server
    // configObj['server'] = http.createServer(serverOptions, express());
    // const tinylr = require('tiny-lr');
    // pass in custom live reload server
    // configObj['liveReloadServer'] = tinylr({ port: PORT });
    resolve(configObj);
  });
};
