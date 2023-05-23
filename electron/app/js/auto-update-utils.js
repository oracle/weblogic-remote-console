/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

const { autoUpdater } = require('electron-updater');

let _updateInfo;

(() => {
  autoUpdater.autoDownload = false;
  autoUpdater.allowDowngrade = false;
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

function setFeedURL(feedURL) {
  autoUpdater.setFeedURL(feedURL);
}

module.exports = {
  getVersion,
  setFeedURL,
  checkForUpdates
};
