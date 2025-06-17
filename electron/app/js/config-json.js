/**
 * @license
 * Copyright (c) 2022, 2025, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

/**
 * See {@link https://stackabuse.com/javascripts-immediately-invoked-function-expressions/}
 * @type {{getPath, getAll, set, read, get, initialize, write}}
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
      _config['javaPath'] = `${options.appPaths.exe}/${options.javaPath}`;
      _config['persistenceDirectory'] = options.appPaths.userData;
      AppConfig.read();
    },
    getPath: () => {
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
      if (settings.javaPath) _config['javaPath'] = `${settings.javaPath}`;
      if (settings.executablePath) _config['executableJar'] = `${_appPaths.exe}/${settings.executablePath}`;
      if (settings['weblogic.remoteconsole.java.startoptions']) _config['weblogic.remoteconsole.java.startoptions'] = `${settings['weblogic.remoteconsole.java.startoptions']}`;
    },
    read: () => {
      if (fs.existsSync(AppConfig.getPath())) {
        try {
          const content = fs.readFileSync(AppConfig.getPath()).toString();

          if (content !== this.previousContent) {
            this.previousContent = content;
            const settings = JSON.parse(content);
            AppConfig.set(settings);
          }
        }
        catch(err) {
          log('error', err);
          const WindowManagement = require('./window-management');
          WindowManagement.corruptFile(AppConfig.getPath());
        }
      }
    },
    write: () => {
      // Creates the file, if it doesn't exists
      fs.writeFileSync(AppConfig.getPath(), JSON.stringify(_config, null, 4));
    }
  };

})();

module.exports = AppConfig;
