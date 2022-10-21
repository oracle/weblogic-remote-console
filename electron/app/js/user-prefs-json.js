/**
 * @license
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

/**
 * See {@link https://stackabuse.com/javascripts-immediately-invoked-function-expressions/}
 * @type {{read, putAll, write, getDefaultValue}}
 */
const UserPrefs = (() => {
  const fs = require('fs');
  const {log} = require('./console-logger');
  const CoreUtils = require('./core-utils');

  const _appPaths = {};
  let _preferences = [
    {
      "sections": [
        {
          "key": "logging",
          "title": "Logging",
          "properties": [
            {
              "defaultValue": 'debug',
              "label": "Logging Level",
              "legalValues": [
                {"label": "ERROR", "value": "error"},
                {"label": "WARNING", "value": "warning"},
                {"label": "INFO", "value": "info"},
                {"label": "DEBUG", "value": "debug"},
                {"label": "TRACE", "value": "trace"}
              ],
              "name": "PropertyCriteria_LoggingLevel"
            },
            {
              "label": "",
              "name": "PropertyValue_LoggingLevel",
              "type": "string",
              "usedIf":
                {"property": "PropertyCriteria_LoggingLevel", "values": ["error","warning","info","debug","trace"]}
            }
          ]
        },
        {
          "key": "appExit",
          "title": "Application Exit",
          "properties": [
            {
              "defaultValue": true,
              "label": "Detect Unsaved Changes",
              "legalValues": [
                {"label": "Equals", "value": "equals"}
              ],
              "name": "PropertyCriteria_DetectUnsavedChanges"
            },
            {
              "label": "",
              "name": "PropertyValue_DetectUnsavedChanges",
              "type": "boolean",
              "usedIf":
                {"property": "PropertyCriteria_DetectUnsavedChanges", "values": ["equals"]}
            }
          ]
        },
        {
          "key": "beforeUnload",
          "title": "Before Unload",
          "properties": [
            {
              "defaultValue": true,
              "label": "Detect Unsaved Changes",
              "legalValues": [
                {"label": "Equals", "value": "equals"}
              ],
              "name": "PropertyCriteria_DetectUnsavedChanges"
            },
            {
              "label": "",
              "name": "PropertyValue_DetectUnsavedChanges",
              "type": "boolean",
              "usedIf":
                {"property": "PropertyCriteria_DetectUnsavedChanges", "values": ["equals"]}
            }
          ]
        }
      ]
    }
  ];

  // Define the methods exposed to the outside world,
  // along with useful JSDoc comments :-).
  return {
    /**
     *
     * @param {string} key
     * @param {string} name
     * @returns {string|undefined}
     */
    getDefaultValue: (key, name) => {
      let value;
      const section = _preferences[0].sections.find(item => item.key === key);
      if (section) {
        const index = section.properties.map(property => property.name).indexOf(name);
        if (index !== -1) {
          const pref = section.properties[index];
          value = pref.defaultValue;
          log('debug', `pref=${JSON.stringify(pref)}`);
        }
      }
      return value;
    },
    putAll: (preferences) => {
      _preferences = preferences;
    },
    read: (userDataPath) => {
      if (!userDataPath) userDataPath = _appPaths.userDataPath;
      if (userDataPath) {
        // Update _appPaths.userDataPath with value passed as
        // function argument, regardless.
        _appPaths.userDataPath = userDataPath;
        // Construct full path to user-prefs.json file
        const filepath = `${userDataPath}/user-prefs.json`;
        if (fs.existsSync(filepath)) {
          try {
            const data = JSON.parse(fs.readFileSync(filepath).toString());
            _preferences = data.preferences;
          }
          catch(err) {
            log('error', err);
          }
        }
      }
    },
    write: (userDataPath) => {
      if (!userDataPath) userDataPath = _appPaths.userDataPath;
      if (userDataPath) {
        try {
          // Update _appPaths.userDataPath with value passed as
          // function argument, regardless.
          _appPaths.userDataPath = userDataPath;
          const filepath = `${userDataPath}/user-prefs.json`;
          // Creates the file, if it doesn't already exists.
          // The openstack.org convention is to use 4 spaces
          // for indentation.
          fs.writeFileSync(filepath, JSON.stringify({ preferences: _preferences }, null, 4));
        }
        catch(err) {
          log('error', err);
        }
      }
    }
  };

})();

module.exports = UserPrefs;