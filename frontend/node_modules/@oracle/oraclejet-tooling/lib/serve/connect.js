/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

/**
 * # Dependencies
 */

/* 3rd party */
const express = require('express');
const serveStatic = require('serve-static');
const serveIndex = require('serve-index');
const http = require('http');
const injectLiveReload = require('connect-livereload');
const open = require('open');

const utils = require('../util');

/**
 * # serve Connect Module
 *
 * @public
 */
module.exports = function (opts, context) {
  utils.log('Starting web server.');
  const connectOpts = _processCustomOptions(opts);
  return new Promise((resolve, reject) => {
    const app = context.express ? context.express : express();

    const defaultMiddleware = _getMiddleware(connectOpts);
    const customMiddleware = Array.isArray(context.middleware) ? context.middleware : null;
    const customPreMiddleware = context.preMiddleware || [];
    const customPostMiddleware = context.postMiddleware || [];

    let appMiddleware;
    if (customMiddleware) {
      appMiddleware = customMiddleware;
    } else {
      appMiddleware = [...customPreMiddleware, ...defaultMiddleware, ...customPostMiddleware];
    }

    appMiddleware.forEach((middleware) => {
      let middlewareArray = middleware;
      if (!Array.isArray(middlewareArray)) {
        middlewareArray = [middlewareArray];
      }
      app.use.apply(app, middlewareArray); //eslint-disable-line
    });

    let server;
    if (context.server) {
      // Use user's custom server -- this means none of our default middleware applies
      server = context.server;
    } else if (context.serverOptions) {
      server = context.http ? context.http.createServer(context.serverOptions, app) :
        http.createServer(context.serverOptions, app);
    } else {
      server = context.http ? context.http.createServer(app) : http.createServer(app);
    }

    const hostname = connectOpts.hostname || '0.0.0.0';
    const targetHostname = hostname === '0.0.0.0' ? 'localhost' : hostname;
    const urlPrefix = context.urlPrefix ? context.urlPrefix : 'http';
    const defaultTarget = `${urlPrefix}://${targetHostname}:${connectOpts.port}`;
    const target = connectOpts.serverUrl ? connectOpts.serverUrl : defaultTarget;
    console.log(`Connecting to ${target}`);
    server
      .listen(connectOpts.port, connectOpts.hostname)
      .on('listening', () => {
        utils.log.success(`Server ready: ${target}`);
        if (connectOpts.open) {
          open(target);
        }
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

function _getMiddleware(options) {
  let middlewares = [];
  middlewares = _getDefaultMiddleware(options);
  if (options.livereload) {
    const livereloadConfig = { port: options.livereloadPort, hostname: options.hostname };
    middlewares.unshift(injectLiveReload(livereloadConfig));
  }
  return middlewares;
}

function _getDefaultMiddleware(options) {
  const middlewares = [];
  const middlewareOpts = options;
  if (!Array.isArray(middlewareOpts.base)) {
    middlewareOpts.base = [middlewareOpts.base];
  }
  // Options for serve-static module. See https://www.npmjs.com/package/serve-static
  const defaultStaticOptions = {};
  const directory = middlewareOpts.directory || middlewareOpts.base[middlewareOpts.base.length - 1];
  middlewareOpts.base.forEach((base) => {
    // Serve static files.
    const rootPath = base.path || base;
    const staticOptions = base.options || defaultStaticOptions;
    middlewares.push(serveStatic(rootPath, staticOptions));
  });
  // Make directory browse-able.
  middlewares.push(serveIndex(directory.path || directory));
  return middlewares;
}

function _processCustomOptions(opts) {
  const result = opts || null;
  if (opts.hostname === '*') {
    result.hostname = '';
  }

  if (opts.port === '?') {
    result.port = 0;
  }

  const defaultOpts = _getDefaultOptions();
  return Object.assign({ livereloadPort: opts.livereloadPort }, defaultOpts, result);
}

function _getDefaultOptions() {
  return {
    port: 8000,
    hostname: '0.0.0.0',
    livereload: true,
    open: true
  };
}
