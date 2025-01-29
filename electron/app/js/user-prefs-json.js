/**
 * @license
 * Copyright (c) 2022, 2025, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

const { app } = require('electron');
const OSUtils = require('./os-utils');
const I18NUtils = require('./i18n-utils');
const ElectronPreferences = require('electron-preferences');
const SettingsEditor = require('./settings-editor');
const fs = require('fs');

/**
 * See {@link https://stackabuse.com/javascripts-immediately-invoked-function-expressions/}
 * @type {{read, putAll, write, getDefaultValue}}
 */
const UserPrefs = (() => {
  let preferences;

  const dataStore = 'user-prefs.json';
  
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
      return `${userDataPath}/${dataStore}`;
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
      this.previousContent = null;
      UserPrefs.init();
      preferences.show();
    },
    init: () => {
      const preferencesTemplate = {
        defaults: {
          credentials: { storage: true },
          unsaved: { appExit: true, unload: true },
          startup: { checkForUpdates: true }
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
          },
          {
            id: 'language',
            label: `${I18NUtils.get('wrc-electron.menus.preferences.section.language.label')}`,
            form: {
              groups: [
                {
                  fields: [
                    {
                      label: `${I18NUtils.get('wrc-electron.menus.preferences.language.field.label')}`,
                      help: `${I18NUtils.get('wrc-electron.menus.preferences.language.field.help')}`,
                      key: 'language',
                      type: 'radio',
                      options: [
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.language.system.label')}`, value: 'System'},
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.language.en.label')}`, value: 'en'},
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.language.de.label')}`, value: 'de'},
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.language.es.label')}`, value: 'es'},
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.language.fr.label')}`, value: 'fr'},
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.language.it.label')}`, value: 'it'},
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.language.ja.label')}`, value: 'ja'},
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.language.ko.label')}`, value: 'ko'},
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.language.pt.label')}`, value: 'pt-BR'},
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.language.zh-CN.label')}`, value: 'zh-CN'},
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.language.zh-TW.label')}`, value: 'zh-TW'}
                      ]
                    }
                  ]
                }
              ]
            }
          },
          {
            id: 'startup',
            label: `${I18NUtils.get('wrc-electron.menus.preferences.section.startup.label')}`,
            form: {
              groups: [
                {
                  fields: [
                    {
                      label: `${I18NUtils.get('wrc-electron.menus.preferences.check-for-update.field.label')}`,
                      key: 'checkForUpdates',
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
          }
        ]
      };
      preferences = new ElectronPreferences(preferencesTemplate);
    },
    read: (userDataPath) => {
      // Ensure that there are file content changes instead of relying on file metadata (e.g. fstat)
      // Workaround for https://github.com/paulmillr/chokidar/issues/1345
      const data = fs.readFileSync(UserPrefs.getPath(userDataPath), { encoding: 'utf8', flag: 'r' });

      if (data != this.previousContent) {        
        UserPrefs.init();

        this.previousContent = data;
      }
    }
  };

})();

module.exports = UserPrefs;
