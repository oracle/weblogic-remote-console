/**
 * @license
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

/**
 * See {@link https://stackabuse.com/javascripts-immediately-invoked-function-expressions/}
 * @type {{getFilename, getAll, set, read, get, initialize, write}}
 */
const AppConfig = (() => {
  const fs = require('fs');
  const {log} = require('./console-logger');

  const _appPaths = {};
  const _config = {};

  return {
    initialize: (options) => {
      _appPaths['userDataPath'] = options.appPaths.userData;
      _appPaths['exe'] = options.appPaths.exe;

      _config['useTokenNotCookie'] = options.useTokenNotCookie;
      _config['showPort'] = options.showPort;
      _config['quiet'] = options.quiet;
      _config['checkPpidMillis'] = options.checkPpidMillis;
      _config['executableJar'] = `${options.appPaths.exe}/${options.executablePath}`;
      _config['javaBinary'] = `${options.appPaths.exe}/${options.javaPath}`;
      _config['persistenceDirectory'] = options.appPaths.userData;
    },
    getFilename: () => {
      return `${_appPaths.userDataPath}/config.json`;
    },
    getAll: () => {
      return _config;
    },
    get: (key = '') => { return _config[key]; },
    set: (settings) => {
      if (settings.useTokenNotCookie) _config['useTokenNotCookie'] = settings.useTokenNotCookie;
      if (settings.showPort) _config['showPort'] = settings.showPort;
      if (settings.quiet) _config['quiet'] = settings.quiet;
      if (settings.checkPpidMillis) _config['checkPpidMillis'] = settings.checkPpidMillis;
      if (settings.javaPath) _config['javaBinary'] = `${_appPaths.exe}/${settings.javaPath}`;
      if (settings.executablePath) _config['executableJar'] = `${_appPaths.exe}/${settings.executablePath}`;
    },
    read: () => {
      if (fs.existsSync(AppConfig.getFilename())) {
        try {
          const settings = JSON.parse(fs.readFileSync(AppConfig.getFilename()).toString());
          AppConfig.set(settings);
        }
        catch(err) {
          log('error', err);
        }
      }
    },
    write: () => {
      // Creates the file, if it doesn't exists
      fs.writeFileSync(AppConfig.getFilename(), JSON.stringify(_config, null, 4));
    }
  };

})();

module.exports = AppConfig;