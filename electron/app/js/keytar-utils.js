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
 * @type {{upsertKeytarEntries, getKeyTar, removeKeytarAccount}}
 */
const KeyTarUtils = (() => {
  const {log} = require('./console-logger');

  let _keytar;

  function isKeyTarInstalled() {
    let rtnval = false;
    try {
      require.resolve("keytar");
      rtnval = true;
    }
    catch(err) {
      if (err.code !== "MODULE_NOT_FOUND") throw err;
    }
    return rtnval;
  }

  function loadKeyTar() {
    if (isKeyTarInstalled()) {
      require.resolve("keytar");
      // Load the keytar module if it hasn't been
      // loaded yet.
      if (typeof _keytar === "undefined") {
        // Module-scope variable wasn't set, so
        // go ahead and call require to load the
        // keytar module and set the variable.
        _keytar = require('keytar');
      }
    }
  }

  return {
    getKeyTar: () => {
      loadKeyTar();
      return _keytar;
    },
    removeKeytarAccount: (account) => {
      let rtnval = false;
      getKeyTar();
      if (typeof _keytar !== "undefined") {
        rtnval = _keytar.deletePassword('weblogic-remote-console', account);
      }
      return rtnval;
    },
    upsertKeytarEntries: (project) => {
      KeyTarUtils.getKeyTar();
      if (typeof _keytar !== "undefined") {
        for (const i in project.dataProviders) {
          // noinspection JSUnfilteredForInLoop
          if (project.dataProviders[i].type === "adminserver") {
            const account = `${project.name}-${project.dataProviders[i].name}-${project.dataProviders[i].username}`;
            const password = project.dataProviders[i].password || "";
            if (password !== "") _keytar.setPassword('weblogic-remote-console', account, password);
          }
        }
      }
      else {
        log('info', `keytar is not installed or loaded, so skipping code that securely stores credentials for adminserver connection providers.`);
      }
    }

  };

})();

// noinspection JSUnusedGlobalSymbols
module.exports = KeyTarUtils;