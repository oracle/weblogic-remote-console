/**
 * @license
 * Copyright (c) 2021, 2025, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

// Calls to require() are cached, but are also blocking.
// This why we put all the ones used in this module, here
// at the top.
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { spawn } = require('child_process');
const { execFile } = require('child_process');

const { app, ipcMain, shell, dialog, safeStorage } = require('electron');

const logger = require('./js/console-logger');

const I18NUtils = require('./js/i18n-utils');
const OSUtils = require('./js/os-utils');
// Declare variable for IIFE class used to handle Custom URL
const TokenUtils = require('./js/token-utils');
// Declare variable for IIFE class used to perform file
// management operations for JET side of WRC
const FileUtils = require('./js/file-utils');
// Declare variable for IIFE class used to manage data
// persisted in the user-prefs.json file
const UserPrefs = require('./js/user-prefs-json');
// persisted in the auto-prefs.json file
const AutoPrefs = require('./js/auto-prefs-json');
// Declare variable for IIFE class used to manage data
// persisted in the config.json file as well as its editor
const AppConfig = require('./js/config-json');
const SettingsEditor = require('./js/settings-editor');
// Declare variable for IIFE class used to manage projects
const ProjectManagement = require('./js/project-management');
// Declare variable for IIFE class used to read and write projects
const UserProjects = require('./js/user-projects-json');
// Declare variable for IIFE class used to watch for changes to files
const Watcher = require('./js/watcher');
// Declare variable for IIFE class used to manage window
// and menu for app
const AppWindow = require('./js/window-management');

const instDir = path.dirname(app.getPath('exe'));
const { homepage, productName, version, copyright } = require(`${instDir}/package.json`);

if (OSUtils.isMacOS()) {
  app.disableHardwareAcceleration();
}

let feedURL;

// The documentation says to not use setFeedURL(), though it seems to work.
// We'll only use it for testing.
if (process.env.CONSOLE_FEED_URL) {
  feedURL = process.env.CONSOLE_FEED_URL;
  const { setFeedURL } = require('./js/auto-update-utils');
  setFeedURL(feedURL);
}
else {
  // electron-builder puts a URL in itself, but it is not available to us
  // unless we do this trick.  We need it for prompting the user, so we'll
  // use the builder data to do it.
  if (fs.existsSync(`${instDir}/electron-builder-custom.json`))
    feedURL = require(`${instDir}/electron-builder-custom.json`)?.publish?.url;
}


const AppConstants = Object.freeze({
  EXECUTABLE_JAR_FILE: 'backend/console.jar',
  JAVA_BINARY: 'customjre/bin/java',
  LOG_BASEFILENAME: 'out'
});

let logOptions;
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
let cbe;

(() => {
  function updateUserDataPath() {
    if (process.env.CONSOLE_USER_DATA_DIR) {
      if (!fs.existsSync(process.env.CONSOLE_USER_DATA_DIR)) {
        fs.mkdirSync(process.env.CONSOLE_USER_DATA_DIR, { recursive: true });
      }
      app.setPath('userData', process.env.CONSOLE_USER_DATA_DIR);
    }
    else {
      const defaultUserDataDir = `${app.getPath('appData')}/weblogic-remote-console`;
      if (!fs.existsSync(defaultUserDataDir)) {
        fs.mkdirSync(defaultUserDataDir, { recursive: true });
      }
      app.setPath('userData', defaultUserDataDir);
    }
  }

  updateUserDataPath();

  const exePath = path.dirname(app.getPath('exe'));
  const userDataPath = app.getPath('userData');

  logOptions = {
    appPaths: {
      userData: userDataPath
    },
    baseFilename: AppConstants.LOG_BASEFILENAME,
    loggingLevel: 'debug'
  };
  logger.initializeLog(logOptions);

  // Register the Custom URL for processing on Mac and Windows...
  if (!OSUtils.isLinuxOS() && !app.isDefaultProtocolClient('wrc')) {
    if (process.defaultApp) {
      if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient("wrc", process.execPath, [path.resolve(process.argv[1])]);
      }
    } else {
      app.setAsDefaultProtocolClient("wrc");
    }
  }

  const options = {
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

  // This seems complicated, but really isn't.
  // There are three ways that the language may be set (in precedence order):
  // 1. The command line option --lang=<lang>
  // 2. The value of "language.language" in user-prefs.json
  // 3. On Linux, the environment variable LANGUAGE
  // To implement this, it would be simple enough to set the --lang option if #2
  // or #3 applies. However, there is a bug in electron where --lang doesn't
  // work on Linux.  The solution is to make sure LANGUAGE is set on Linux to
  // the right value, as well as setting the command-line option in every
  // platform.
  const file = userDataPath + "/user-prefs.json";
  if (!app.commandLine.hasSwitch('lang') && fs.existsSync(file)) {
    const userPrefsEarly = require(file);
    if ((userPrefsEarly?.language?.language !== undefined) &&
        userPrefsEarly.language.language !== 'System' &&
        userPrefsEarly.language.language !== ''
      ) {
        app.commandLine.appendSwitch('lang', userPrefsEarly.language.language);
    }
  }
  if (app.commandLine.hasSwitch('lang')) {
    process.env['LANGUAGE'] = app.commandLine.getSwitchValue('lang');
  }

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
    if (isHeadlessMode())
      AppWindow.hideDockIconMacOS();
  }
});

// Register for Custom URL event handling on MacOS!
// The Custom URL is only used when the browser is unable
// to send the token via an HTTP request to the backend.
// Safari is a browser that prevents access to localhost
// and thus the Custom URL is used to pass the token.
// On other platforms, see the 'whenReady' processing...
app.on("open-url", (event, url) => {
  if (url) {
    logger.log('debug', `Handle Custom URL for process: ${process.pid}`);
    if (event) event.preventDefault();
    TokenUtils.processCustomUrl(url);
    if (isHeadlessMode())
      AppWindow.hideDockIconMacOS();
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
  if (!isHeadlessMode()) {
    AppWindow.load(`http://localhost:${cbePort}/`);
  }
}

function isHeadlessMode() {
  return app.commandLine.hasSwitch('headless');
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

function sendConfig(data) {
  if (!cbe)
    return;
  let buffer = 'START\n';
  for (const key in data) {
    buffer += key + '=' + data[key] + '\n';
  }
  buffer += 'END\n';
  try {
    cbe.stdin.write(buffer);
  } catch (err) {
    // If the writes fail, we're about to die anyway
    return;
  }
}

function start_cbe() {
  var instDir = path.dirname(app.getPath('exe'));
  let filename = AppConfig.getPath();

  const cbeTempDir = `${app.getPath('userData')}/cbe_tmp`;

  if (fs.existsSync(cbeTempDir)) {
    fs.rmSync(cbeTempDir, { recursive: true, force: true });
  }
    
  fs.mkdirSync(cbeTempDir);

  let spawnArgs = [
    `-Djava.io.tmpdir=${cbeTempDir}`,
    `-Dserver.port=${cbePort}`,
    '-jar',
    `${instDir}/backend/console.jar`,
    '--persistenceDirectory',
    `${app.getPath('userData')}`,
    '--showPort',
    '--stdin'
  ];
  if (useTokenNotCookie) {
    spawnArgs.push('--useTokenNotCookie');
  }
  cbe = spawn(AppConfig.get('javaPath'), spawnArgs);

  let readlineStderr = readline.createInterface({
    input: cbe.stderr,
  });

  let readlineStdout = readline.createInterface({
    input: cbe.stdout,
  });

  readlineStderr.on('line', (line) => {
    logger.log('info', line, false);
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
  SettingsEditor.setConfigSender(sendConfig);
}

// This is only used on Mac
function start_another_me() {
  logger.log('debug', `Starting another remote console (${process.pid})`);
  another_me = execFile(`${instDir}/WebLogic Remote Console`, [], () => {
    another_me = null;
  });
}

app.whenReady()
  .then(() => {
    I18NUtils.initialize(`${instDir}/resources`, app.getLocale());
    if (!I18NUtils.get('wrc-electron.labels.app.appName.value')) {
      logger.log('error', 'Cannot load internationalization utilities');
      process.exit();
      process.kill(process.pid, 9);
    }

    // Check for the Custom URL on the command line!
    // The Custom URL is only used when the browser is unable
    // to send the token via an HTTP request to the backend.
    // After handling the Custom URL the process terminates!
    // For MacOS, see the 'open-url' event processing...
    const cmdlineUrl = process.argv.find((argv) => argv.startsWith('wrc://'));
    if (cmdlineUrl) {
      logger.log('debug', `Handle command line Custom URL for process: ${process.pid}`);
      TokenUtils.processCustomUrl(cmdlineUrl, true);
      return;
    }

    // Rotate the log file as the process is expected to continue running...
    logOptions['isHeadlessMode'] = isHeadlessMode();
    logger.rotateLog(logOptions);
    processCmdLineOptions();

    if (!isHeadlessMode()) {
      // Attempt to obtain the single instance lock.  This is not used as a
      // "lock", really, but as a signifier that we have a running instance
      // that is not headless.  See app.on for "activate" above.
      app.requestSingleInstanceLock();

      // No way to prompt for updates in a headless process
      const supportsUpgradeCheck = !isHeadlessMode();

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

      const file = app.getPath('userData') + "/user-prefs.json";
      const userPrefsEarly = fs.existsSync(file) ? require(file) : null;
      const upgradeCheckAtStart =
        (userPrefsEarly?.startup?.checkForUpdates === undefined)
        ? true
        : userPrefsEarly.startup.checkForUpdates;

      const params = {
        version: version,
        productName: productName,
        copyright: copyright,
        homepage: homepage,
        feedURL: feedURL,
        supportsUpgradeCheck: supportsUpgradeCheck,
        upgradeCheckAtStart: upgradeCheckAtStart,
        supportsAutoUpgrades: supportsAutoUpgrades
      };

      window = AppWindow.initialize(
        I18NUtils.get('wrc-electron.messages.initializing'),
        params,
        path.dirname(app.getPath('exe')),
        app.getPath('userData')
      );

      AppWindow.renderAppMenu();
    }
    else {
      AppWindow.hideDockIconMacOS();
    }
    Watcher.initialize(app.getPath('userData'), window, [UserProjects, UserPrefs, AutoPrefs, AppConfig]);
    start_cbe();
  })
  .catch(err => {
    logger.log('error', `err=${err}`);
    AppWindow.showFailureStartingMessageBox(
      I18NUtils.get('wrc-electron.messages.failure-messagebox.title'),
      `${err}`,
      [I18NUtils.get('wrc-electron.messages.failure-messagebox.button')]
    );
    process.exit();
    process.kill(process.pid, 9);
  });


ipcMain.handle('translated-strings-sending', async (event, arg) => {
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
  return UserPrefs.get(arg);
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

ipcMain.handle('external-url-opening', async (event, arg) => {
  AppWindow.openExternalURL(arg);
});

ipcMain.handle('complete-login', async (event, arg) => {
  logger.log('info', `'complete-login' provider='${arg.name}'`);
  AppWindow.showMainWindow();
});

ipcMain.handle('perform-login', async (event, arg) => {
  return new Promise(function (resolve, reject) {
    if (arg) {
      logger.log('info', `'perform-login' provider='${arg.name}' url='${arg.loginUrl}'`);

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
ipcMain.handle('credentials-requesting', (event, arg) => {
  const reply = {succeeded: false};
  if (!UserPrefs.get('credentials.storage') || !safeStorage.isEncryptionAvailable()) {
    reply['failure'] = {
      failureType: 'PASSWORD_STORAGE_NOT_SUPPORTED',
      failureReason: 'Either password storage is disabled or is not supported on this platform'
    }
    return reply;
  }

  const current_project = ProjectManagement.getCurrentProject();
  const provider = current_project.dataProviders.find(item => item.name === arg.provider.name);

  if (!provider) {
    reply['failure'] = {
      failureType: 'INVALID_PROVIDER',
      failureReason: `Provider named '${arg.provider.name}' is not associated with the specified project: '${arg.project.name}'`
    };
    return reply;
  }
  if (!provider.passwordEncrypted) {
    reply['failure'] = {
      failureType: 'NO_STORED_PASSWORD',
      failureReason: 'There is no password stored for this provider'
    };
    return reply;
  }
  try {
    reply['secret'] = safeStorage.decryptString(Buffer.from(provider.passwordEncrypted, 'base64'));
    reply.succeeded = true;
  } catch(err) {
    logger.log('error', 'Error decrypting password, pretending it does not exist');
    reply['failure'] = {
      failureType: 'NO_STORED_PASSWORD',
      failureReason: 'There is no password stored for this provider'
    };
  }
  return reply;
});

ipcMain.handle('window-app-quiting', async (event, arg) => {
  logger.log('debug', `'window-app-quiting' reply=${JSON.stringify(arg)}`);
  if (!arg.preventQuitting) {
    // Destroy app menu, which has references to the
    // app and window module-scoped variables.
    AppWindow.destroy();
  }
});
