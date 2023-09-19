/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

const { autoUpdater } = require('electron-updater');
const I18NUtils = require('./i18n-utils');
const { dialog } = require('electron');

let _updateInfo;
let _window;

(() => {
  autoUpdater.autoDownload = false;
  autoUpdater.allowDowngrade = true;
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(
      _window,
      {
        title: `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.restartNow.message', getVersion())}`,
        message: `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.updateDownloaded.message')}`,
        buttons: [ `${I18NUtils.get('wrc-common.buttons.restart.label')}`, `${I18NUtils.get('wrc-common.buttons.cancel.label')}` ],
        type: 'info'
      }
    ).then((choice) => {
      if (choice.response === 0)
        autoUpdater.quitAndInstall();
    });
  });
})();

autoUpdater.on('update-available', (info) => {
  _updateInfo = info;
});


async function checkForUpdates() {
  return Promise.resolve(autoUpdater.checkForUpdates());
}

function getVersion() {
  return _updateInfo.version;
}

async function doUpdate(window) {
  _window = window;
  try {
    await autoUpdater.downloadUpdate();
  } catch (error) {
    dialog.showMessageBox(
      _window,
      {
        title: `${I18NUtils.get('wrc-electron.menus.updates.downloadFailed.title')}`,
        buttons: [ `${I18NUtils.get('wrc-common.buttons.ok.label')}` ],
        type: 'info',
        message: `${I18NUtils.get('wrc-electron.menus.updates.downloadFailed.message', error)}`
      }
    );
  }
}

function setFeedURL(feedURL) {
  autoUpdater.setFeedURL(feedURL);
}

module.exports = {
  doUpdate,
  getVersion,
  setFeedURL,
  checkForUpdates
};
