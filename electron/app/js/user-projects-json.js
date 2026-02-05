/**
 * @license
 * Copyright (c) 2022, 2025, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

const { safeStorage } = require('electron');

/**
 *
 * See {@link https://stackabuse.com/javascripts-immediately-invoked-function-expressions/}
 * @type {{dumpPasswords, clearPasswords, areThereAnyPasswordsStored}}
 */
const UserProjects = (() => {
  const fs = require('fs');
  const {log} = require('./console-logger');
  const CoreUtils = require('./core-utils');

  function write(projects) {
    const filepath = require('electron').app.getPath('userData') + '/user-projects-new.json';
    try {
      // Creates the file, if it doesn't already exist.
      // The openstack.org convention is to use 4 spaces
      // for indentation.
      fs.writeFileSync(filepath, JSON.stringify({ projects: projects }, null, 4));
    }
    catch(err) {
      log('error', err);
    }
  }

  function read() {
    const filepath = require('electron').app.getPath('userData') + '/user-projects-new.json';
    if (fs.existsSync(filepath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filepath).toString());
        return data.projects;
      } catch(err) {
        log('error', err);
        const WindowManagement = require('./window-management');
        WindowManagement.corruptFile(filepath);
      }
    }
    return [];
  }

  return {
    dumpPasswords: (file) => {
      const projects = read();
      const seen = [];
      if (safeStorage.isEncryptionAvailable()) {
        for (const proj of projects) {
          for (const prov of proj.dataProviders) {
            if (prov.passwordEncrypted) {
              if (!seen[prov.passwordEncrypted]) {
                const decrypted = safeStorage.decryptString(Buffer.from(prov.passwordEncrypted, 'base64'));
                // console.log(`Decrypted is ${decrypted}`);
                const output = 
                  `${btoa(decrypted)} ${btoa(prov.passwordEncrypted)}`;
                // console.log(`Dumping out ${output}`);
                file.write(`EncryptionService: ${output}\n`);
              }
              seen[prov.passwordEncrypted] = 1;
            }
          }
        }
      }
    },
    clearPasswords: () => {
      const projects = read()
      for (const proj of projects) {
        for (const prov of proj.dataProviders) {
          delete prov.passwordEncrypted;
        }
      }
      write(projects);
    },
    areThereAnyPasswordsStored: () => {
      const projects = read()
      for (const proj of projects) {
        for (const prov of proj.dataProviders) {
          if (prov.passwordEncrypted) {
            return true;
          }
        }
      }
      return false;
    },
  };

})();

module.exports = UserProjects;
