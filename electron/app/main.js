/**
 * @license
 * Copyright (c) 2021, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

// Calls to require() are cached, but are also blocking.
// This why we put all the ones used in this module, here
// at the top.
const net = require('net');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { spawn } = require('child_process');
const { execFile } = require('child_process');

const { app, ipcMain, shell, dialog } = require('electron');

const logger = require('./js/console-logger');

const I18NUtils = require('./js/i18n-utils');
const OSUtils = require('./js/os-utils');
// Declare variable for IIFE class used to perform file
// management operations for JET side of WRC
const FileUtils = require('./js/file-utils');
// Declare variable for IIFE class used to manage data
// persisted in the user-prefs.json file
const UserPrefs = require('./js/user-prefs-json');
// persisted in the auto-prefs.json file
const AutoPrefs = require('./js/auto-prefs-json');
// Declare variable for IIFE class used to manage data
// persisted in the config.json file
const AppConfig = require('./js/config-json');
// Declare variable for IIFE class used to manage projects
const ProjectManagement = require('./js/project-management');
// Declare variable for IIFE class used to read and write projects
const UserProjects = require('./js/user-projects-json');
// Declare variable for IIFE class used to watch for changes to files
const Watcher = require('./js/watcher');
// Declare variable for IIFE class used to manage window
// and menu for app
const AppWindow = require('./js/window-management');

// Declare functions from module that wraps keytar usage
const {getKeyTar} = require('./js/keytar-utils');

const instDir = path.dirname(app.getPath('exe'));
const { homepage, productName, version, copyright } = require(`${instDir}/package.json`);

let feedURL;

if (process.env.CONSOLE_FEED_URL)
  feedURL = process.env.CONSOLE_FEED_URL;
else if (fs.existsSync(`${instDir}/feed-url.json`))
  feedURL = require(`${instDir}/feed-url.json`).feedURL;

if (feedURL) {
  const { setFeedURL } = require('./js/auto-update-utils');
  setFeedURL(feedURL);
}


const AppConstants = Object.freeze({
  EXECUTABLE_JAR_FILE: 'backend/console.jar',
  JAVA_BINARY: 'customjre/bin/java',
  LOG_BASEFILENAME: 'out'
});

let window;
let checkPid = 0;
let cbePort = 0;
let another_me = null;
let checkPpidMillis = 5000;
let started = false;
let stdinOption = false;
let showPort = false;
let useTokenNotCookie = false;
let quiet = false;
let lines = [];

(() => {
  function updateUserDataPath() {
    if (process.env.CONSOLE_USER_DATA_DIR) {
      if (!fs.existsSync(process.env.CONSOLE_USER_DATA_DIR)) {
        fs.mkdirSync(process.env.CONSOLE_USER_DATA_DIR, { recursive: true });
      }
      app.setPath('userData', process.env.CONSOLE_USER_DATA_DIR);
    }
    else {
      app.setPath('userData', `${app.getPath('appData')}/weblogic-remote-console`);
    }
  }

  updateUserDataPath();

  const exePath = path.dirname(app.getPath('exe'));
  const userDataPath = app.getPath('userData');

  let options = {
    appPaths: {
      userData: userDataPath
    },
    baseFilename: AppConstants.LOG_BASEFILENAME,
    loggingLevel: 'debug'
  };
  logger.initializeLog(options);

  UserPrefs.read(userDataPath);
  
  options = {
    appPaths: {
      userData: userDataPath,
      exe: exePath
    },
    executablePath: AppConstants.EXECUTABLE_JAR_FILE,
    javaPath: AppConstants.JAVA_BINARY,
    useTokenNotCookie: useTokenNotCookie,
    showPort: showPort,
    quiet: quiet,
    checkPpidMillis: checkPpidMillis
  };
  AppConfig.initialize(options);

  ProjectManagement.readProjects(userDataPath);
  ProjectManagement.selectCurrentProject();
})();

// On Mac OS, "activate" signifies that the user has "clicked" on the Remote
// Console, whether in the "Finder" or the taskbar.  Most of the time, the Mac
// will handle this perfectly fine:  if it is not running, it starts it and if 
// it is already running, it makes it current.  The problem is that with the
// "headless" version running for WKT UI, the one that is "running" could be
// non-functional as far as user interaction is concerned.  So, when the user
// chooses to click on the Remote Console and the only version running is
// "headless", we start a "headed" version.
app.on('activate', () => {
  logger.log('debug', `Event activate (${process.pid})`);
  // window is set for "headed" instances.  So, if it is set, we are good.
  // If not, then we want to see if there is already a headed instance running
  // and only start a headed instance if there is not.  Regretfully, at this
  // time, we don't have a way of knowing that there is a headed instance.  We
  // can, however, use the "single instance lock" to come close.  Only a headed
  // instance will grab the lock.  So, if someone is holding the lock then we
  // are good.  However, if the user created two headed instances and closed the
  // one that had the lock, we'll end up starting an instance here even though
  // there already is one.  This new instance *will* grab the lock, so another
  // click will not start yet another.  This is not an important issue; we will
  // fix it soon.
  if (!window && app.requestSingleInstanceLock()) {
    app.releaseSingleInstanceLock();
    start_another_me();
  }
});

function doCheckPid() {
  try {
    process.kill(checkPid, 0);
  } catch(err) {
    process.exit();
  }
}

function doit() {
  if (!app.commandLine.hasSwitch('headless')) {
    AppWindow.load(`http://localhost:${cbePort}/`);
  }
}

function processCmdLineOptions() {
  const config = AppConfig.getAll();

  if (config['server.port']) {
    cbePort = config['server.port'];
  }

  if (app.commandLine.hasSwitch('check-ppid'))
    checkPid = process.ppid;
  else
    checkPid = app.commandLine.getSwitchValue('check-pid');

  if (checkPid !== 0) {
    setInterval(doCheckPid, checkPpidMillis);
  }

  const portOption = app.commandLine.getSwitchValue('port');
  if (portOption) {
    cbePort = portOption;
  }

  const stdinOption = app.commandLine.hasSwitch('stdin');
  if (stdinOption) {
    let readlineStdin = readline.createInterface({
      input: process.stdin,
    });
    readlineStdin.on('close', () => {
      process.exit();
    });
  }

  // Windows folds case in arguments it seems
  showPort = app.commandLine.hasSwitch('showPort') ||
    app.commandLine.hasSwitch('showport');
  useTokenNotCookie = app.commandLine.hasSwitch('useTokenNotCookie') ||
    app.commandLine.hasSwitch('usetokennotcookie');
  quiet = app.commandLine.hasSwitch('quiet');
}

function start_cbe() {
  var instDir = path.dirname(app.getPath('exe'));
  let filename = AppConfig.getPath();
  let spawnArgs = [
    `-Dserver.port=${cbePort}`,
    '-jar',
    `${instDir}/backend/console.jar`,
    '--persistenceDirectory',
    `${app.getPath('userData')}`,
    '--showPort',
    '--stdin',
    '--properties',
    filename,
  ];
  if (useTokenNotCookie) {
    spawnArgs.push('--useTokenNotCookie');
  }
  const cbe = spawn(AppConfig.get('javaPath'), spawnArgs);

  let readlineStderr = readline.createInterface({
    input: cbe.stderr,
  });

  let readlineStdout = readline.createInterface({
    input: cbe.stdout,
  });

  readlineStderr.on('line', (line) => {
    logger.log('info', line);
    lines.push(line);
  });

  readlineStderr.on('close', () => {
    if (!started) {
      let i = lines.length - 40;
      if (i < 0) i = 0;
      var last40 = 'Java Process Output';
      for (; i < lines.length; i++) last40 = last40 + '\n' + lines[i];
      AppWindow.showJavaProcessErrorMessageBox(
        'Remote Console Error - Java Process',
        `${last40}`,
        ['Exit']
      );
    }
    process.exit();
  });

  readlineStdout.on('line', (line) => {
    if (line.startsWith('Port=')) {
      // This *needs* to be stdout, which console.log() may be, but may not be
      if (showPort)
        process.stdout.write(line + '\n');
      cbePort = line.replace('Port=', '');
      started = true;
      doit();
    }
    logger.log('debug', line);
  });
}

// This is only used on Mac
function start_another_me(event = null) {
  logger.log('debug', `Starting another remote console (${process.pid})`);
  const execArg = (event ? `${event.customUrl}` : null);
  another_me = execFile(`${instDir}/WebLogic Remote Console`, (execArg ? [execArg] : []), () => {
    another_me = null;
  });
}

app.whenReady()
  .then(() => {
    logger.setOptions({ isHeadlessMode: app.commandLine.hasSwitch('headless')});
    processCmdLineOptions();

    if (!app.commandLine.hasSwitch('headless')) {
      // Attempt to obtain the single instance lock.  This is not used as a
      // "lock", really, but as a signifier that we have a running instance
      // that is not headless.  See app.on for "activate" above.
      app.requestSingleInstanceLock();

      // No way to prompt for updates in a headless process
      const supportsUpgradeCheck = !app.commandLine.hasSwitch('headless');

      // On Linux, only AppImages can be updated in place
      const supportsAutoUpgrades = supportsUpgradeCheck &&
        !(OSUtils.isLinuxOS() && !process.env.APPIMAGE);

      // This is, obviously, a hack.  Here's the deal:
      // the Auto-Updater will only check for updates on Linux if the file is
      // an AppImage.  However, we want something a little different.  We want
      // to be able to *check* for a new image no matter what format, but only
      // *do* the update if it is a supported format.  So, we'll lie to the
      // Auto-Updater by setting the APPIMAGE, but our code will know better.
      // We'll know it isn't real because it isn't really a file.  This will
      // no longer be necessary in the near future when the Auto Updater
      // supports all formats on Linux.
      if (supportsUpgradeCheck && OSUtils.isLinuxOS && !process.env.APPIMAGE)
        process.env.APPIMAGE = `/${Math.random()}/${Math.random()}`;

      const params = {
        version: version,
        productName: productName,
        copyright: copyright,
        homepage: homepage,
        feedURL: feedURL,
        supportsUpgradeCheck: supportsUpgradeCheck,
        supportsAutoUpgrades: supportsAutoUpgrades
      };

      window = AppWindow.initialize(
        'Initializing...',
        params,
        path.dirname(app.getPath('exe')),
        app.getPath('userData')
      );

      AppWindow.renderAppMenu();
    }
    else {
      if (OSUtils.isMacOS())
        app.dock.hide();
    }
    Watcher.initialize(app.getPath('userData'), window, [UserProjects, UserPrefs, AutoPrefs, AppConfig]);
    start_cbe();
  })
  .catch(err => {
    logger.log('error', `err=${err}`);
    AppWindow.showFailureStartingMessageBox(
      'Failure starting remote console',
      `${err}`,
      ['Exit']
    );
    process.exit();
    process.kill(process.pid, 9);
  });


ipcMain.handle('translated-strings-sending', async (event, arg) => {
  I18NUtils.putAll(arg);
});

/**
 * @example
 * window.electron_api.invoke("file-creating", dataProvider.fileContents)
 *  .then(reply => {
 *    self.modelFile(reply.filePath);
 *  })
 *  .catch(failure => {
 *    console.log(JSON.stringify(failure));
 *  });
 */
ipcMain.handle('file-creating', async (event, arg) => {
  if (arg.fileContents) {
    const dialogParams = {
      defaultPath: arg.filepath,
      properties: ['createDirectory'],
      filters: { name: 'Supported Formats', extensions: FileUtils.fileExtensions }
    };
    return AppWindow.showFileCreatingSaveDialog(dialogParams)
      .then(result => {
        if (!result.canceled) {
          return FileUtils.writeFileAsync(result.filePath, arg.fileContents)
            .then(reply => {
              reply['filePath'] = result.filePath;
              return Promise.resolve(reply);
            });
        }
        else {
          return Promise.resolve({succeeded: false, filePath: ''});
        }
      });
  }
  else {
    const response = {
      succeeded: false,
      failure: {
        transport: {statusText: 'Missing or invalid parameter'},
        failureType: 'VERIFICATION',
        failureReason: 'Parameters cannot be undefined, null or an empty string: arg.fileContents!'
      }
    };
    return Promise.resolve(response);
  }
});

ipcMain.handle('file-reading', async (event, arg) => {
  return FileUtils.createFileReadingResponse(arg.filepath)
    .catch(response => {
      if (arg.allowDialog && (response.failureType === 'NOT_FOUND')) {
        const dialogParams = {
          defaultPath: arg.filepath,
          properties: ['openFile'],
          filters: { name: 'Supported Formats', extensions: FileUtils.fileExtensions }
        };
        return AppWindow.showFileReadingOpenDialog(dialogParams)
          .then(dialogReturnValue => {
            if (dialogReturnValue.filePaths.length > 0) {
              return FileUtils.createFileReadingResponse(dialogReturnValue.filePaths[0]);
            }
            // User didn't pick a file, so just return
            // an empty JS object
            return Promise.resolve({});
          })
          .catch(failure => {
            return Promise.reject(failure);
          })
      }
      else {
        return Promise.reject(response.failureReason);
      }
    });
});

ipcMain.handle('file-writing', async (event, arg) => {
  if (arg.filepath && arg.fileContents) {
    if (path.dirname(arg.filepath) === '.') {
      arg.filepath = path.join(__dirname, arg.filepath)
    }
    return FileUtils.writeFileAsync(arg.filepath, arg.fileContents);
  }
  else {
    const response = {
      succeeded: false,
      failure: {
        transport: {statusText: 'Missing or invalid parameter'},
        failureType: 'VERIFICATION',
        failureReason: 'Parameters cannot be undefined, null or an empty string: arg.filepath, arg.fileContents!'
      }
    };
    return Promise.resolve(response);
  }
});

ipcMain.handle('preference-reading', async (event, arg) => {
  logger.log('debug', `'preference-reading' arg=${JSON.stringify(arg)}`);
  // You don't need to return an explicit Promise
  // here, because the async keyword before the
  // "(event, ...args)" in the method signature,
  // does that implicitly.
  const defaultValue = UserPrefs.getDefaultValue(arg.section, arg.name);
  if (defaultValue) {
    return defaultValue;
  }
  else {
    return false;
  }
});

ipcMain.handle('file-choosing', async (event, dialogParams) => {
  return AppWindow.showFileChoosingOpenDialog(dialogParams)
    .then(dialogReturnValue => {
      if (dialogReturnValue.filePaths.length > 0) {
        const filepath = dialogReturnValue.filePaths[0];
        return FileUtils.createFileReadingResponse(filepath);
      }
      // User didn't pick a file, so just return
      // an empty JS object
      return Promise.resolve({});
    })
    .catch(err => {
      const response = {
        transport: {statusText: err},
        failureType: 'UNEXPECTED',
        failureReason: err
      };
      return Promise.reject(response);
    });
});

ipcMain.handle('complete-login', async (event, arg) => {
  logger.log('debug', `'complete-login' provider='${arg.name}'`);
  AppWindow.showMainWindow();
});

ipcMain.handle('perform-login', async (event, arg) => {
  return new Promise(function (resolve, reject) {
    if (arg) {
      logger.log('debug', `'perform-login' provider='${arg.name}' url='${arg.loginUrl}'`);

      // Validate the URL content and exec the user's browser
      try {
        const loginUrl = new URL(arg.loginUrl);
        if (!['https:', 'http:'].includes(loginUrl.protocol.toLowerCase())) {
          logger.log('error', `'perform-login' invalid protocol=${loginUrl.protocol}`);
          reject(new Error(`Invalid protocol '${loginUrl.protocol}'`));
        }
        else {
          shell.openExternal(arg.loginUrl)
            .then(() => {
              resolve(true);
            })
            .catch((error) => {
              logger.log('error', `'perform-login' failed open error=${error}`);
              reject(new Error(`${error}`));
            });
          }
      }
      catch (error) {
        logger.log('error', `'perform-login' failed error=${error}`);
        reject(new Error(`${error.message}`));
      }
    }
    resolve(false);
  });
});

ipcMain.handle('current-project-requesting', async (event, ...args) => {
  // You don't need to return an explicit Promise
  // here, because the async keyword before the
  // "(event, ...args)" in the method signature,
  // does that implicitly.
  const current_project = ProjectManagement.getCurrentProject();
  if (typeof current_project !== 'undefined') {
    return current_project;
  }
  return null;
});

ipcMain.handle('unsaved-changes', async (event, busy) => {
  ProjectManagement.markProjectBusyState(busy);
  AppWindow.notifyState(!busy);
});

ipcMain.handle('is-busy', async (event) => {
  return ProjectManagement.isCurrentProjectBusy();
});

ipcMain.handle('project-changing', async (event, arg) => {
  const result = ProjectManagement.processChangedProject(arg);
  if (result.succeeded) {
    AppWindow.renderAppMenu();
  }
  // You don't need to return an explicit Promise
  // here, because the async keyword before the
  // "(event, ...args)" in the method signature,
  // does that implicitly.
  return 'Saved it!';
});

/**
 * @example
 * const options = {project: {name: self.project.name}, provider: {name: dataProvider.name, username: dataProvider.username}};
 * window.electron_api.ipc.invoke('credentials-requesting', options);
 */
ipcMain.handle('credentials-requesting', async (event, arg) => {
  return new Promise(function (resolve, reject) {
    function isValidProvider(project, provider) {
      const provider1 = project.dataProviders.find(item => item.name === provider.name && item.username === provider.username);
      return (typeof provider1 !== 'undefined');
    }

    const reply = {succeeded: false};

    let keytar;
    try {
      keytar = getKeyTar();
      if (typeof keytar !== 'undefined') {
        const project = ProjectManagement.getProject(arg.project.name);
        if (typeof project !== 'undefined') {
          if (isValidProvider(project, arg.provider)) {
            const account = `${project.name}-${arg.provider.name}-${arg.provider.username}`;
            keytar.getPassword('weblogic-remote-console', account)
              .then(secret => {
                if (secret !== null) {
                  reply.succeeded = true;
                  reply['secret'] = secret;
                }
                else {
                  reply['failure'] = {
                    failureType: 'NO_MATCHING_KEYTAR_ACCOUNT',
                    failureReason: `Unable to retrieve secret for '${account}' keytar account`
                  };
                }
                resolve(reply);
              });
          }
          else {
            reply['failure'] = {
              failureType: 'INVALID_PROVIDER',
              failureReason: `Provider named '${arg.provider.name}' is not associated with the specified project: '${arg.project.name}'`
            };
            resolve(reply);
          }
        }
        else {
          reply['failure'] = {
            failureType: 'INVALID_PROJECT',
            failureReason: `Unable to find a project named '${arg.project.name}'`
          };
          resolve(reply);
        }
      }
      else {
        reply['failure'] = {
          failureType: 'KEYTAR_NOT_LOADABLE',
          failureReason: 'keytar is not installed or loadable, so skipping code that securely retrieves stored credentials.'
        };
        resolve(reply);
      }
    }
    catch(err) {
      if (keytar) {
          const response = {
          transport: {statusText: err.code},
          failureType: 'UNEXPECTED',
          failureReason: err.stack
        };
        reject(response);
      }
      else {
        reply['failure'] = {
          failureType: 'NO_MATCHING_KEYTAR_ACCOUNT',
          failureReason: 'Unable to retrieve secrets'
        };
        resolve(reply);
      }
    }
  });

});

ipcMain.handle('window-app-quiting', async (event, arg) => {
  logger.log('debug', `'window-app-quiting' reply=${JSON.stringify(arg)}`);
  if (!arg.preventQuitting) {
    // Destroy app menu, which has references to the
    // app and window module-scoped variables.
    AppWindow.destroy();
  }
});