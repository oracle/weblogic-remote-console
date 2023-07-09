/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');

let _updateInfo;
let _window;

(() => {
  autoUpdater.autoDownload = false;
  autoUpdater.allowDowngrade = false;
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(
      _window,
      {
        message: 'Update downloaded and will be installed upon exit',
        buttons: [ 'Restart', 'Cancel' ],
        type: 'info',
        title: `Restart now with ${_updateInfo.version}?`
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
        title: 'Download failed',
        buttons: [ 'Ok' ],
        type: 'info',
        message: `Error from downloader: ${error}?`
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
