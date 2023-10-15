/**
 * @license
 * Copyright (c) 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

const { app } = require('electron');
const OSUtils = require('./os-utils');
const I18NUtils = require('./i18n-utils');
const ElectronPreferences = require('electron-preferences');
const SettingsEditor = require('./settings-editor');

/**
 * See {@link https://stackabuse.com/javascripts-immediately-invoked-function-expressions/}
 * @type {{read, putAll, write, getDefaultValue}}
 */
const UserPrefs = (() => {
  let preferences;

  function osBasedHelp() {
    if (OSUtils.isMacOS())
      return I18NUtils.get('wrc-electron.menus.preferences.section.credential-storage.confirmation.apple.help');
    if (OSUtils.isWinOS())
      return I18NUtils.get('wrc-electron.menus.preferences.section.credential-storage.confirmation.windows.help');
    return I18NUtils.get('wrc-electron.menus.preferences.section.credential-storage.confirmation.linux.help');
  }

  // Define the methods exposed to the outside world,
  // along with useful JSDoc comments :-).
  return {
    getPath: (userDataPath) => { 
      return `${userDataPath}/user-prefs.json`;
    },
    get: (key) => {
      if (!preferences) {
        UserPrefs.init();
      }
      return preferences.value(key);
    },
    show: () => {
      // This is destroying the previous instance of user-prefs or
      // perhaps the previous instance of settings-editor
      SettingsEditor.destroy(preferences);
      // We need to create a fresh one to re-initialize various
      // objects for show()
      UserPrefs.init();
      preferences.show();
    },
    init: () => {
      const preferencesTemplate = {
        defaults: {
          credentials: { storage: true },
          unsaved: { appExit: true, unload: true }
        },
        dataStore: `${app.getPath('userData')}/user-prefs.json`,
        browserWindowOverrides: {
          title: `${I18NUtils.get('wrc-electron.menus.preferences.title')}`,
          width: 900,
          maxWidth: 1000,
          height: 700,
          maxHeight: 1000,
          resizable: true
        },
        sections: [
          /* Planned:
          {
            'id': 'logging',
            'title': 'Logging',
            'properties': [
              {
                'defaultValue': 'debug',
                'label': 'Logging Level',
                'legalValues': [
                  {'label': 'ERROR', 'value': 'error'},
                  {'label': 'WARNING', 'value': 'warning'},
                  {'label': 'INFO', 'value': 'info'},
                  {'label': 'DEBUG', 'value': 'debug'},
                  {'label': 'TRACE', 'value': 'trace'}
                ],
                'name': 'PropertyCriteria_LoggingLevel'
              },
              {
                'label': '',
                'name': 'PropertyValue_LoggingLevel',
                'type': 'string',
                'usedIf':
                  {'property': 'PropertyCriteria_LoggingLevel', 'values': ['error','warning','info','debug','trace']}
              }
            ]
          },
          */
          {
            id: 'credentials',
            label: `${I18NUtils.get('wrc-electron.menus.preferences.section.credential-storage.label')}`,
            form: {
              groups: [
                {
                  fields: [
                    {
                      label: `${I18NUtils.get('wrc-electron.menus.preferences.section.credential-storage.confirmation.label')}`,
                      help: `${osBasedHelp()}`,
                      key: 'storage',
                      type: 'radio',
                      options: [
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.yes')}`, value: true},
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.no')}`, value: false}
                      ]
                    }
                  ]
                }
              ]
            }
          },
          {
            id: 'unsaved-confirmation',
            label: `${I18NUtils.get('wrc-electron.menus.preferences.section.unsaved-confirmation.label')}`,
            form: {
              groups: [
                {
                  fields: [
                    {
                      label: `${I18NUtils.get('wrc-electron.menus.preferences.section.unsaved-confirmation.appExit.label')}`,
                      help: `${I18NUtils.get('wrc-electron.menus.preferences.section.unsaved-confirmation.appExit.help')}`,
                      key: 'appExit',
                      type: 'radio',
                      options: [
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.yes')}`, value: true },
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.no')}`, value: false }
                      ]
                    },
                    {
                      // The preference is currently used, but can occur in
                      // various situations.  For now, we'll have the property
                      // and use it in the code, but not show it or try to explain it.
                      label: 'This is disabled for now',
                      help: 'This is disabled for now',
                      hideFunction: () => { return true; },
                      key: 'unload',
                      type: 'radio',
                      options: [
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.yes')}`, value: false},
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.no')}`, value: true}
                      ]
                    }
                  ]
                }
              ]
            }
          }
        ]
      };
      preferences = new ElectronPreferences(preferencesTemplate);
    },
    read: (userDataPath) => {
      UserPrefs.init();
    }
  };

})();

module.exports = UserPrefs;
