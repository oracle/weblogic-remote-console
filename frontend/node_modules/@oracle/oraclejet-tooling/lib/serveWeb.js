/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';

/**
 * # Dependencies
 */

/* Oracle */
const config = require('./config');
const util = require('./util');
const indexHtmlInjector = require('./indexHtmlInjector');
const serveConnect = require('./serve/connect');
const serveWatch = require('./serve/watch');
const hookRunner = require('./hookRunner');

/**
 * # ServeWeb procedure
 *
 * @param {function} build - build action (build or not)
 * @public
 */
module.exports = (build) => {
  let beforeServeContext = {};
  let connectOpts = {};
  let serveOpts = {};
  build()
    .then((context) => {
      connectOpts = _getConnectConfig(config.get('serve'));
      serveOpts = config.get('serve');
      if (!context) {
        // eslint-disable-next-line no-param-reassign
        context = {};
      }
      // eslint-disable-next-line no-param-reassign
      context.connectOpts = connectOpts;

      // eslint-disable-next-line no-param-reassign
      context.serveOpts = serveOpts;
      return hookRunner('before_serve', context);
    })
    .then((returnedContext) => {
      beforeServeContext = returnedContext;
      _updateCspRuleForLivereload();
    })
    .then(() => {
      serveConnect(connectOpts, beforeServeContext);
      serveWatch(serveOpts.watch, serveOpts.livereloadPort, beforeServeContext);
      hookRunner('after_serve', beforeServeContext);
    })
    .catch((error) => {
      util.log.error(error);
    });
};

function _getConnectConfig(opts) {
  const connectConfig = Object.assign({
    livereloadPort: opts.livereloadPort,
    serverUrl: opts.serverUrl
  },
  opts.connect.options
  );
  if (connectConfig.buildType === 'dev') {
    connectConfig.keepalive = true;
  }
  return connectConfig;
}

/**
 * ## _updateCspRuleForLivereload
 *
 * If livereload is on, updates the CSP rule in index.html to allow connections
 * to the livereload server.
 *
 * @private
 * @returns {object} - resolved promise
 */
function _updateCspRuleForLivereload() {
  const serveConfigs = config.get('serve');

  if (!serveConfigs.livereload) {
    return Promise.resolve();
  }
  const opts = { stagingPath: config.get('paths').staging.web };
  const context = { opts };
  return indexHtmlInjector.injectLocalhostCspRule(context);
}
