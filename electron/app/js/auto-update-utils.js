/**
 * @license
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

const { autoUpdater } = require('electron-updater');

let _updateInfo;

(() => {
  autoUpdater.autoDownload = false;
})();

autoUpdater.on('update-available', (info) => {
  _updateInfo = info;
});

async function checkForUpdates() {
  return Promise.resolve(getAutoUpdateInfo());
}

function getAutoUpdateInfo() {
  return (typeof _updateInfo === 'undefined' ? {version: autoUpdater.currentVersion.version} : _updateInfo);
}

module.exports = {
  getAutoUpdateInfo,
  checkForUpdates
};