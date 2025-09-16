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
 * @type {{getFilteredProviders, putAll, put, getAll, get, set, upsert, clean, replace, remove, clear, read, write}}
 */
const UserProjects = (() => {
  const fs = require('fs');
  const {log} = require('./console-logger');
  const CoreUtils = require('./core-utils');

  const _appPaths = {};
  let _projects = [];

  function encryptPasswords(projects) {
    if (safeStorage.isEncryptionAvailable()) {
      for (const proj of projects) {
        for (const prov of proj.dataProviders) {
          if (prov.password) {
            prov.passwordEncrypted = safeStorage.encryptString(prov.password).toString('base64');
          }
        }
      }
    }
  }

  /**
   * Returns a copy of the ``projects`` module-scoped variable, where the ``dataProvider`` objects do not contain fields specified in ``providerKeyExclusions``.
   * @param {[string]|[]} providerKeyExclusions - An string array containing the object keys to exclude.
   * @returns {[{name: string, current?: boolean, dataProviders: [{name: string, type: string, url: string, username: string, password: string}|{name: string, type: string, file: string}]}]} - A copy of the ``projects`` module-scoped variable, where the ``dataProvider`` objects do not contain fields specified in ``providerKeyExclusions``.
   * @private
   */
  function getMaskedProjects(providerKeyExclusions = []) {
    // Declare return variable
    let maskedProjects = [];
    // Use spread operator (...) to create a copy
    // of the module-scoped  variable.
    const clonedProjects = [..._projects];
    // Loop through the copy of the projects variable
    for (const i in clonedProjects) {
      // Extract providers from copy of project
      const providers = UserProjects.getFilteredProviders(clonedProjects[i].dataProviders);
      // Loop through extracted providers
      for (const j in providers) {
        // Create 2-element ["key", "value"] array
        // from provider.
        const arr = Object.entries(providers[j]);
        // Exclude the 2-element array item, if the key
        // is in providerKeyExclusions array.
        const filtered = arr.filter(([key]) => providerKeyExclusions.indexOf(key) === -1);
        // Convert remaining 2-element array items back
        // into an object, and then store the object
        // back in the current provider item.
        providers[j] = Object.fromEntries(filtered);
      }
      // Replace providers of cloned/copied project
      // with updated providers.
      clonedProjects[i].dataProviders = providers;
      // Put cloned/copied project in return variable.
      maskedProjects.push(clonedProjects[i]);
    }
    return maskedProjects;
  }

  return {
    clearPasswords: () => {
      for (const proj of _projects) {
        for (const prov of proj.dataProviders) {
          delete prov.passwordEncrypted;
          delete prov.password;
        }
      }
    },
    areThereAnyPasswordsStored: () => {
      for (const proj of _projects) {
        for (const prov of proj.dataProviders) {
          if (prov.passwordEncrypted)
            return true;
        }
      }
      return false;
    },
    /**
     *
     * @param {[{name: string, type: string, url?: string, username?: string, password?: string, settings?: *, file?: string, models?: [string], properties?: *}]} providers
     * @returns {Array}
     */
     getFilteredProviders: (providers) => {
      const filteredProviders = [];
      // Using for (const i in <array>) is the optimal
      // (e.g. more operations per seconds) for-loop
      // construct, in JS
      for (const i in providers) {
        // Declare local variable used to filter
        // out properties from changed_project.
        const filteredProvider = {
          name: providers[i].name,
          type: providers[i].type
        };

        // Filter out properties associated with adminserver
        // provider type.
        if (providers[i].url) filteredProvider.url = providers[i].url;
        if (providers[i].username) filteredProvider.username = providers[i].username;
        if (providers[i].password) filteredProvider.password = providers[i].password;
        if (providers[i].passwordEncrypted) filteredProvider.passwordEncrypted = providers[i].passwordEncrypted;
        if (providers[i].settings) filteredProvider.settings = providers[i].settings;

        // Filter out properties associated with model
        // provider type.
        if (providers[i].file) {
          filteredProvider.file = providers[i].file;
        }

        // Filter out properties associated with modelComposite
        // provider type.
        if (providers[i].models) {
          filteredProvider.models = providers[i].models;
        }

        // Filter out the references to a property list
        // associated with model provider type.
        if (providers[i].type === 'model' && providers[i].properties) {
          filteredProvider.properties = providers[i].properties;
        }

        filteredProviders.push(filteredProvider);
      }
      return filteredProviders;
    },
    putAll: (projects) => {
      _projects = projects;
    },
    put: (project) => {
      const index = _projects.map(item => item.name).indexOf(project.name);
      if (index === -1) {
        _projects.push(project);
      }
    },
    getAll: () => { 
      return Object.freeze([..._projects]); 
    },
    /**
     * 
     * @param {string} name 
     * @returns {{name: string, current?: boolean, dataProviders: [{name: string, type: string, url: string, username: string, password: string}|{name: string, type: string, file: string}]}|undefined}
     */
     get: (name) => {
      let project;
      if (name === '(Unnamed Project)') name = '(unnamed)';
      if (CoreUtils.isNotUndefinedNorNull(name)) {
        project = _projects.find(item => item.name === name);
      }
      return project;
    },
    set: (project) => {
      const index = _projects.map(item => item.name).indexOf(project.name);
      if (index !== -1) {
        _projects[index] = project;
      }
    },
    upsert: (project) => {
      const result = { succeeded: false };
      const index = _projects.map(item => item.name).indexOf(project.name);
      if (index !== -1) {
        _projects[index] = project;
        result.succeeded = true;
        result['chamge_state'] = 'updated';
      }
      else {
        _projects.push(project);
        result.succeeded = true;
        result['chamge_state'] = 'new';
      }
      return result;
    },
    current: () => {
      return _projects.find(project => typeof project.current !== 'undefined');
    },
    clean: (field) => {
      if (field) {
        const index = _projects.map(project => project[field]).indexOf(true);
        if (index !== -1) {
          delete _projects[index][field];
        }
      }
    },
    /**
     * 
     * @param {string} name 
     * @param {{name: string, current?: boolean, dataProviders: [{name: string, type: string, url: string, username: string, password: string}|{name: string, type: string, file: string}]}} project
     */
    replace: (name, project) => {
      const index = _projects.map(project => project.name).indexOf(name);
      if (index > 0) {
        _projects[index] = (typeof project !== 'undefined' ? project : _projects[0]);
        // First project has been copied over the deleted
        // project, so go ahead and pop (i.e. delete) it
        // from the projects array.
        _projects.shift();
      }
    },
    remove: (name = '') => {
      const index = _projects.map(project => project.name).indexOf(name);
      if (index !== -1) {
        _projects.splice(index, 1);
      }
    },
    clear: () => {
      _projects = [];
    },
    getUserDataPath: () => { 
      return _appPaths.userDataPath;
    },
    getPath: (userDataPath) => { 
      return `${userDataPath}/user-projects.json`;
    },
    read: (userDataPath, _window) => {
      if (CoreUtils.isUndefinedOrNull(userDataPath)) userDataPath = _appPaths.userDataPath;
      if (userDataPath) {
        // Update _appPaths.userDataPath with value passed as
        // function argument, regardless.
        _appPaths.userDataPath = userDataPath;
        // Construct full path to user-projects.json file
        const filepath = UserProjects.getPath(userDataPath);
        if (fs.existsSync(filepath)) {
          const data = JSON.parse(fs.readFileSync(filepath).toString());
          if (JSON.stringify(_projects) !== JSON.stringify(data.projects)) {
            // _window isn't passed on the initial read, which is what we want,
            // since we don't need to notify
            if (_window) {
              const current_before_update = UserProjects.current();
              _projects = data.projects;
              // The project listed as "current" in the file isn't necessarily
              // current in this process.  Unset it
              const current_in_file = UserProjects.current();
              if (current_in_file)
                current_in_file.current = false;
              if (current_before_update) {
                const current_in_new = UserProjects.get(current_before_update.name)
                if (current_in_new) {
                  current_in_new.current = true;
                  if (JSON.stringify(current_in_new) !== JSON.stringify(current_before_update)) {
                    const fakeName = Math.random();
                    _window.webContents.send('on-project-switched', {action: 'navigate', from: current_before_update, to: {name: fakeName} });
                    _window.webContents.send('on-project-switched', {action: 'navigate', from: {name: fakeName}, to: current_in_new});
                  }
                }
                else if (_projects.length != 0)
                  _window.webContents.send('on-project-switched', {action: 'navigate', from: current_before_update.name, to: _projects[0] });
                else
                  _window.webContents.send('on-project-switched', {action: 'navigate', from: current_before_update.name, to: {name: '(unnamed)'} });
              }
            }
            else
              _projects = data.projects;
          }
        }
      }
    },
    write: (userDataPath) => {
      encryptPasswords(_projects);
      if (!userDataPath) userDataPath = _appPaths.userDataPath;
      if (userDataPath) {
        try {
          // Update _appPaths.userDataPath with value passed as
          // function argument, regardless.
          _appPaths.userDataPath = userDataPath;
          const filepath = `${userDataPath}/user-projects.json`;
          // Creates the file, if it doesn't already exists.
          // The openstack.org convention is to use 4 spaces
          // for indentation.
          fs.writeFileSync(filepath, JSON.stringify({ projects: getMaskedProjects(['password']) }, null, 4));
        }
        catch(err) {
          log('error', err);
        }
      }
    }

  };

})();

module.exports = UserProjects;
