/**
 * @license
 * Copyright (c) 2023,2024, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';


/**
 * See {@link https://stackabuse.com/javascripts-immediately-invoked-function-expressions/}
 * @type {{read, putAll, write, getDefaultValue}}
 */
const SettingsEditor = (() => {
  const fs = require('fs');
  const {log} = require('./console-logger');
  const I18NUtils = require('./i18n-utils');
  const ElectronPreferences = require('electron-preferences');
  const ConfigJSON = require('./config-json');
  const { app, ipcMain, dialog } = require('electron');
  let preferences;
  let beforeEditingPreferences;
  const scratchPath = `${app.getPath('userData')}/scratch-settings.json`;

  let dontNeedStore = (preferences) => {
    if (!preferences.networking.trustStoreType)
      return true;
    if (!preferences.networking.trustStoreType === '')
      return true;
    if (/^Windows-[A-Z]+$/.test(preferences.networking.trustStoreType))
      return true;
    if (preferences.networking.trustStoreType === 'KeyChainStore')
      return true;
    return false;
  };

  function load() {
    const path = ConfigJSON.getPath();
    let data = {};
    if (fs.existsSync(path)) {
      try {
        data = JSON.parse(fs.readFileSync(path).toString());
      }
      catch (err) {
        console.error(err);
      }
    }
    const otherList = [];
    for (var key in data) {
      if (key === 'proxy') {
        preferences.value('networking.proxy', data[key]);
      }
      else if (key === 'javax.net.ssl.trustStoreType') {
        preferences.value('networking.trustStoreType', data[key]);
      }
      else if (key === 'javax.net.ssl.trustStore') {
        preferences.value('networking.trustStore', data[key]);
      }
      else if (key === 'javax.net.ssl.trustStoreKey') {
        preferences.value('networking.trustStoreKey', data[key]);
      }
      else if (key === 'console.connectTimeoutMillis') {
        preferences.value('networking.connectTimeoutMillis', data[key]);
      }
      else if (key === 'console.readTimeoutMillis') {
        preferences.value('networking.readTimeoutMillis', data[key]);
      }
      else if (key === 'console.disableHostnameVerification') {
        preferences.value('networking.disableHostnameVerification', data[key]);
      }
      else
        otherList.push(`${key}=${data[key]}`);
    }
    otherList.sort();
    preferences.value('other.list', otherList);
  }

  function addValue(data, key, value) {
    if (value && (value !== '')) {
      data[key]=value;
    }
  }

  function save() {
    const path = ConfigJSON.getPath();
    let data = {};
    addValue(data, 'proxy', preferences.value('networking.proxy'));
    addValue(data, 'javax.net.ssl.trustStoreType', preferences.value('networking.trustStoreType'));
    addValue(data, 'javax.net.ssl.trustStore', preferences.value('networking.trustStore'));
    addValue(data, 'javax.net.ssl.trustStorePassword', preferences.value('networking.trustStorePassword'));
    addValue(data, 'console.connectTimeoutMillis', preferences.value('networking.connectTimeoutMillis'));
    addValue(data, 'console.readTimeoutMillis', preferences.value('networking.readTimeoutMillis'));
    addValue(data, 'console.disableHostnameVerification', preferences.value('networking.disableHostnameVerification'));
    const otherList = preferences.preferences?.other?.list;
    for (var pair of otherList) {
      data[pair.substring(0, pair.indexOf('='))]= pair.substring(pair.indexOf('=') + 1);
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
  }

  function valid(showMessage) {
    if (!preferences.value('networking.proxy'))
      return true;
    const string =
      preferences.value('networking.proxy').replace('socks:', 'socks5:');
    preferences.value('networking.proxy', string);
    if ((string !== '') && (string !== 'DIRECT')) {
      try {
        const protocol = new URL(string).protocol;
        const validProtocols = [ 'socks4:', 'socks5:', 'http:', 'https:' ];
        if (!validProtocols.includes(protocol))
          throw new Error('minestrone');
      } catch (err) {
        if (showMessage) {
          dialog.showMessageBoxSync(preferences.prefsWindow, {
            title: `${I18NUtils.get('wrc-electron.menus.settings.proxy.error.title')}`,
            buttons: [`${I18NUtils.get('wrc-electron.common.dismiss')}`],
            message: `${I18NUtils.get('wrc-electron.menus.settings.proxy.error.details')}`
          });
        }
        return false;
      }
    }
    return true;
  }

  return {
    // electron-preferences doesn't clean up, so we have this
    // Note that this can be used to clean up after the last
    // user of electron-preferences and not just yourself
    destroy: (preferences) => {
      if (fs.existsSync(scratchPath))
        fs.rmSync(scratchPath);
      if (preferences)
        delete preferences.prefsWindow;
      ipcMain.removeAllListeners('showPreferences');
      ipcMain.removeAllListeners('closePreferences');
      ipcMain.removeAllListeners('getSections');
      ipcMain.removeAllListeners('restoreDefaults');
      ipcMain.removeAllListeners('getDefaults');
      ipcMain.removeAllListeners('getPreferences');
      ipcMain.removeAllListeners('setPreferences');
      ipcMain.removeAllListeners('showOpenDialog');
      ipcMain.removeAllListeners('sendButtonClick');
      ipcMain.removeAllListeners('resetToDefaults');
      ipcMain.removeAllListeners('encrypt');
      ipcMain.removeAllListeners('decrypt');
    },
    show: (parentWindow) => {
      SettingsEditor.destroy(preferences);
      const preferencesTemplate = {
        dataStore: `${scratchPath}`,
        browserWindowOverrides: {
          title: `${I18NUtils.get('wrc-electron.menus.settings.title')}`,
          width: 900,
          maxWidth: 1000,
          height: 700,
          maxHeight: 1000,
          // We will not make this modal after all.  It looks better as
          // modal, but then there is no way of closing the window besides "Save".
          // We could rename the "Save" button as something non-commital to
          // make it clear that there might not be anything to save, but
          // then we'd still need a cancel button anyway.  electron-preferences
          // doesn't put two buttons next to each other, though; instead they
          // are on top of each other (like separate entries in a form) and
          // that looks awful.
          //
          // With the window as not modal, one can simply "X" the window, so
          // that's what we'll do.
          // parent: parentWindow,
          // modal: true,
          resizable: true
        },
        sections: [
          {
            id: 'networking',
            label: `${I18NUtils.get('wrc-electron.menus.settings.section.networking.label')}`,
            icon: 'preferences',
            form: {
              groups: [
                {
                  'fields': [
                    {
                      label: `${I18NUtils.get('wrc-electron.menus.settings.proxy.label')}`,
                      help: `${I18NUtils.get('wrc-electron.menus.settings.proxy.help')}`,
                      key: 'proxy',
                      type: 'text'
                    },
                    {
                      label: `${I18NUtils.get('wrc-electron.menus.settings.trust-store.type.label')}`,
                      key: 'trustStoreType',
                      help: `${I18NUtils.get('wrc-electron.menus.settings.trust-store.type.help')}`,
                      type: 'text'
                    },
                    {
                      label: `${I18NUtils.get('wrc-electron.menus.settings.trust-store.path.label')}`,
                      key: 'trustStore',
                      buttonLabel: `${I18NUtils.get('wrc-electron.menus.settings.trust-store.path.button.label')}`,
                      type: 'file',
                      hideFunction: dontNeedStore
                    },
                    {
                      label: `${I18NUtils.get('wrc-electron.menus.settings.trust-store.key.label')}`,
                      key: 'trustStoreKey',
                      type: 'secret',
                      hideFunction: dontNeedStore
                    },
                    {
                      label: `${I18NUtils.get('wrc-electron.menus.settings.connect-timeout.label')}`,
                      help: `${I18NUtils.get('wrc-electron.menus.settings.connect-timeout.help')}`,
                      key: 'connectTimeoutMillis',
                      type: 'text'
                    },
                    {
                      label: `${I18NUtils.get('wrc-electron.menus.settings.read-timeout.label')}`,
                      help: `${I18NUtils.get('wrc-electron.menus.settings.read-timeout.help')}`,
                      key: 'readTimeoutMillis',
                      type: 'text'
                    },
                    {
                      label: `${I18NUtils.get('wrc-electron.menus.settings.disable-host-name-verification.label')}`,
                      help: `${I18NUtils.get('wrc-electron.menus.settings.disable-host-name-verification.help')}`,
                      key: 'disableHostnameVerification',
                      type: 'radio',
                      options: [
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.no')}`, value: false},
                        {label: `${I18NUtils.get('wrc-electron.menus.preferences.yes')}`, value: true}
                      ]
                    },
                    {
                      type: 'button',
                      key: 'save',
                      buttonLabel: `${I18NUtils.get('wrc-electron.common.save')}`,
                    }
                  ]
                }
              ]
            }
          },
          {
            id: 'other',
            label: `${I18NUtils.get('wrc-electron.menus.settings.section.other-list.label')}`,
            icon: 'preferences',
            form: {
              groups: [
                {
                  'fields': [
                    {
                      label: `${I18NUtils.get('wrc-electron.menus.settings.other-list.label')}`,
                      help: `${I18NUtils.get('wrc-electron.menus.settings.other-list.help')}`,
                      key: 'list',
                      addItemValidator: /^[^=]+=[^=]*$/.toString(),
                      addItemLabel: `${I18NUtils.get('wrc-electron.menus.settings.other-list.add.label')}`,
                      style: {
                        width: '100%'
                      },
                      type: 'list'
                    },
                    {
                      type: 'button',
                      key: 'save',
                      buttonLabel: `${I18NUtils.get('wrc-electron.common.save')}`,
                      hideLabel: 'true'
                    }
                  ]
                }
              ]
            }
          }
        ]
      };
      preferences = new ElectronPreferences(preferencesTemplate);
      preferences.on('save', () => {
        if (fs.existsSync(scratchPath))
          fs.rmSync(scratchPath);
      });
      preferences.on('click', (key) => {
        if (key === 'save') {
          if (valid(true)) {
            save();
            preferences.close();
            SettingsEditor.destroy(preferences);
          }
        }
      });
      load();
      preferences.show();
    }
  };
})();

module.exports = SettingsEditor;
