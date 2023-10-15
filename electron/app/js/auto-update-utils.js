/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

const logger = require('./console-logger');
const { autoUpdater } = require('electron-updater');
const I18NUtils = require('./i18n-utils');
autoUpdater.autoDownload = false;
autoUpdater.allowDowngrade = true;
const { dialog } = require('electron');

let failed;
let _updateInfo;
let _window;
let downloadingDialogAbortController;

autoUpdater.on('error', error => {
  failed = true;
  if (downloadingDialogAbortController) {
    downloadingDialogAbortController.abort();
    // This is a little odd.  We have to delay this slightly to allow the
    // abort to close the "downloading" dialog before showing the "quit"
    // dialog.  electron doesn't allow the abort to work after the second
    // dialog is started.
    setTimeout(() => showError(error), 100);
  }
  else
    showError(error);
});

(() => {
  autoUpdater.on('update-downloaded', () => {
    if (!failed) {
      if (downloadingDialogAbortController) {
	downloadingDialogAbortController.abort();
	// This is a little odd.  We have to delay this slightly to allow the
	// abort to close the "downloading" dialog before showing the "quit"
	// dialog.  electron doesn't allow the abort to work after the second
	// dialog is started.
	setTimeout(() => showQuitDialog(), 100);
      }
      else {
	showQuitDialog();
      }
    }
  });
})();

const log = require('electron-log');

// We don't need the logging in a second file.  We already have "console.log"
// going to a file.
log.transports.file.level = false;

// Make it match our logger (mostly)
log.transports.console.format = '{y}.{m}.{d} {h}:{i}:{s}.{ms} [{level}] {text}';

// Perhaps we'll use the same level for the auto updater as the rest, as below,
// but for now, let's leave logging level at the default (which is "silly") for
// now.  A little extra logging couldn't hurt in this tricky area of the system.
// log.transports.console.level = logger.getLoggingLevel();

autoUpdater.logger = log;

function showError(error) {
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

function showQuitDialog() {
  dialog.showMessageBox(
    _window,
    {
      title: `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.restartNow.message', getVersion())}`,
      message: `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.updateDownloaded.message')}`,
      buttons: [ `${I18NUtils.get('wrc-common.buttons.restart.label')}`, `${I18NUtils.get('wrc-common.buttons.cancel.label')}` ],
      type: 'info'
    }
  ).then((choice) => {
    if (choice.response === 0) {
      // There is an issue on the Mac with quitAndInstall inside the "on"
      setTimeout(() => autoUpdater.quitAndInstall(), 100);
    }
  });
}

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
  downloadingDialogAbortController = new AbortController();
  dialog.showMessageBox(
    _window,
    {
      title: `${I18NUtils.get('wrc-electron.menus.updates.downloadStarted.title')}`,
      buttons: [ `${I18NUtils.get('wrc-common.buttons.ok.label')}` ],
      type: 'info',
      signal: downloadingDialogAbortController.signal,
      message: `${I18NUtils.get('wrc-electron.menus.updates.downloadStarted.message')}`
    },
  );
  setTimeout(() => { downloadingDialogAbortController.abort(); downloadingDialogAbortController = null; }, 3000);
  try {
    await autoUpdater.downloadUpdate();
  } catch (error) {
    showError(error);
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
