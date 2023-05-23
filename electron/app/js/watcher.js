/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

/**
 *
 * See {@link https://stackabuse.com/javascripts-immediately-invoked-function-expressions/}
 */
const Watcher = (() => {
  const {log} = require('./console-logger');
  const chokidar = require('chokidar');
  let watcheePairs = [];

  return {
    initialize: (userDataDirectory, _window, watchees) => {
      let paths = []
      for (const watchee of watchees) {
        let path = watchee.getPath(userDataDirectory)
        watcheePairs.push({path: path, watchee: watchee});
        paths.push(path);
      }
      chokidar.watch(paths).on('change', path => {
        let watcheePair = watcheePairs.find(item => item.path === path);
        if (watcheePair) {
          for (let i = 0; i < 3; i++) {
            try {
              watcheePair.watchee.read(userDataDirectory, _window);
              break;
            } catch { }
          }
        }
      });
    }
  };
})();

module.exports = Watcher;
