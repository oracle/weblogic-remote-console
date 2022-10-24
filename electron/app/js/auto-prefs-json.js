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
 * @type {{getAll, get, set, read, write}}
 * @example
 *  AutoPrefs.read(`${app.getPath('appData')}/weblogic-remote-console`);
 *  let props = {
 *    version: '2.4.1',
 *    location: '/Applications/WebLogic Remote Console.app/Contents/MacOS/WebLogic Remote Console'
 *  };
 *  AutoPrefs.set(props);
 *  const width = AutoPref.get('width');
 *  console.log(width);
 *  props = AutoPrefs.getAll();
 *  console.log(JSON.stringify(props));
 *  // The following line raises a TypeError in strict mode
 *  props['width'] = 1470;
 *  // Do this to not raise the TypeError
 *  AutoPrefs.set({width: 1470});
 *  // The following works because you can add new
 *  // properties, you just can't modify existing
 *  // without using the AutoPrefs.set() function.
 *  props['canAddNewProperty'] = true;
 *  // The following updates the auto-prefs.json file,
 *  // using the previous value for userDataPath as
 *  // the path to it. You can also just pass in the
 *  // path if you want, just like you did previously
 *  // with AutoPrefs.read(<user-data-path>).
 *  AutoPrefs.write();
 */
const AutoPrefs = (() => {
  const fs = require('fs');
  const {log} = require('./console-logger');
  const UserProjects = require('./user-projects-json');
  const UserPrefs = require('./user-prefs-json');

  const _appPaths = {};
  let _fields = {};

  ((version, width, height, location) => {
    _fields['version'] = version;
    _fields['width'] = width;
    _fields['height'] = height;
    _fields['location'] = location;
  })(null, 1600, 1000, null);

  return {
    /**
     * Gets an immutable, shallow copy of the in-memory data that ``AutoPrefs`` knows about.
     * <p>You can add new in-memory data, but you can only change the value of existing ones using the ``AutoPrefs.set()`` function.</p>
     * @returns {readonly}
     */
    getAll: () => { return Object.freeze(_fields); },
    /**
     * Gets the value of the ``AutoPrefs`` in-memory field with a given ``key``.
     * @param {string} [key='']
     * @returns {object|undefined}
     */
    get: (key = '') => { return _fields[key]; },
    /**
     * Upserts the in-memory data that ``AutoPrefs`` knows about.
     * @param {object} [fields={}]
     */
    set: (fields = {}) => {
      if (fields.version) _fields.version = fields.version;
      if (fields.width) _fields.width = fields.width;
      if (fields.height) _fields.height = fields.height;
      if (fields.location) _fields.location = fields.location;
    },
    /**
     * Removes in-memory field from ``AutoPrefs`` with a given ``key``.
     * @param {string} [key='']
     */
    remove: (key = '') => {
      delete _fields[key];
    },
    /**
     * Removes all the in-memory data from ``AutoPrefs``.
     */
    clear: () => {
      _fields = {};
    },
    /**
     * Populates the in-memory data that ``AutoPrefs`` knows about, by reading and parsing the JSON content in the ``auto-prefs.json`` file.
     * <p>If the <code>userDataPath</code> argument was passed, it's used as the path to the <code>auto-prefs.json</code> file. Otherwise, a check is done to see if a <code>userDataPath</code> in-memory field has been set. If so, then the value assigned to that field is used used as the path to the <code>auto-prefs.json</code> file.</p>
     * @param {string} [userDataPath]
     */
    read: (userDataPath) => {
      if (!userDataPath) userDataPath = _appPaths.userDataPath;
      if (userDataPath) {
        // Update _fields.userDataPath with value passed as
        // function argument, regardless.
        _appPaths.userDataPath = userDataPath;
        // Construct full path to auto-prefs.json file
        const filepath = `${userDataPath}/auto-prefs.json`;
        if (fs.existsSync(filepath)) {
          try {
            const props = JSON.parse(fs.readFileSync(filepath));
            // Update all the other _fields with values from the
            // file just read.
            AutoPrefs.set(props);
            // See if auto-prefs.json contained a projects field
            if (typeof props.projects !== 'undefined') {
              // It did, so use it to do a UserProjects.putAll()
              UserProjects.putAll(props.projects);
              // Use UserProjects.write() to write out the
              // in-memory projects.
              UserProjects.write(userDataPath);
            }
            // See if auto-prefs.json contained a preferences field
            if (typeof props.preferences !== 'undefined') {
              // It did, so use it to do a UserPrefs.putAll()
              UserPrefs.putAll(props.preferences);
              // Use UserPrefs.write() to write out the
              // in-memory preferences.
              UserPrefs.write(userDataPath);
            }
            // The auto-prefs.json field could have contained a
            // projects or preferences field, which will not be
            // in the _fields. Write out the updated _fields.
            AutoPrefs.write(userDataPath);
          }
          catch(err) {
            log('error', err);
          }
        }
      }
    },
    /**
     * Writes in-memory data that ``AutoPrefs``knows about to the ``auto-prefs.json`` file.
     * <p>If the <code>userDataPath</code> argument was passed, it's used as the path to the <code>auto-prefs.json</code> file. Otherwise, a check is done to see if a <code>userDataPath</code> in-memory field has been set. If so, then the value assigned to that field is used used as the path to the <code>auto-prefs.json</code> file.</p>
     * <p>An attempt is made to create the <code>userDataPath/auto-prefs.json</code> file, if it doesn't already exists.t</p>
     * @param {string} [userDataPath]
     */
    write: (userDataPath) => {
      if (!userDataPath) userDataPath = _appPaths.userDataPath;
      if (userDataPath) {
        try {
          // Update _fields.userDataPath with value passed as
          // function argument, regardless.
          _appPaths.userDataPath = userDataPath;
          // Construct full path to auto-prefs.json file
          const filepath = `${userDataPath}/auto-prefs.json`;
          // Remove _fields.userDataPath property, so it won't
          // get written out.
          delete _fields.userDataPath;
          // The openstack.org convention is to use 4 spaces
          // for indentation.
          fs.writeFileSync(filepath, JSON.stringify(_fields, null, 4));
        }
        catch(err) {
          log('error', err);
        }
      }
    }
  };

})();

module.exports = AutoPrefs;