/**
 * @license
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

/**
 *
 * See {@link https://stackabuse.com/javascripts-immediately-invoked-function-expressions/}
 * @type {{isMacOS, isWinOS, isLinuxOS, getWinOSPathArg}
 */
const OSUtils = (() => {
  return {
    isMacOS: () => { return (process.platform === 'darwin'); },
    isWinOS: () => { return (process.platform === 'win32'); },
    isLinuxOS: () => { return (process.platform === 'linux'); },
    /**
     * Determine if the Windows executable is from a local
     * build area and return the proper path argument location.
     */
     getWinOSPathArg: () => {
      var pathArg = null;
      const buildPath = '\\node_modules\\electron\\dist\\electron.exe';
      if (process.execPath.toLowerCase().endsWith(buildPath)) {
        pathArg = process.execPath.substring(0, (process.execPath.length - buildPath.length));
      }
      return pathArg;
    }
  };

})();

module.exports = OSUtils;
