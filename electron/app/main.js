/**
 * @license
 * Copyright (c) 2021, 2026, Oracle and/or its affiliates.
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
const yargs = require('yargs');

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
// Declare variable for IIFE class used to read and write projects
const UserProjects = require('./js/user-projects-json');
// Declare variable for IIFE class used to watch for changes to files
const Watcher = require('./js/watcher');
// Declare variable for IIFE class used to manage window
// and menu for app
const AppWindow = require('./js/window-management');

const instDir = path.dirname(app.getPath('exe'));
const { homepage, productName, version, copyright } = require(`${instDir}/package.json`);

let feedURL;

// Place for command-line java options
let javaOptions;

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
let windows = [];
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
let cbeUrl = '';

(() => {
  function updateUserDataPath() {
    if (process.env.CONSOLE_USER_DATA_DIR)
      app.setPath('userData', process.env.CONSOLE_USER_DATA_DIR);
    else
      app.setPath('userData', `${app.getPath('appData')}/weblogic-remote-console`);
    if (!fs.existsSync(app.getPath('userData')))
      fs.mkdirSync(app.getPath('userData'), { recursive: true });
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
        app.setAsDefaultProtocolClient('wrc', process.execPath, [path.resolve(process.argv[1])]);
      }
    } else {
      app.setAsDefaultProtocolClient('wrc');
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
  const file = userDataPath + '/user-prefs.json';
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
  // windows is set for "headed" instances.  So, if it is set, we are good.
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
  if (windows.length === 0 && app.requestSingleInstanceLock()) {
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
app.on('open-url', (event, url) => {
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
    cbeUrl = `http://localhost:${cbePort}/`;
    AppWindow.load(cbeUrl);
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

  const argv = yargs
    .options({
      'java-options': {describe: 'Pass options to underlying java process'},
      'quiet': {describe: 'Do not put any output on standard output'},
      'verbose': {describe: 'Show debugging output to standard output'},
      'check-ppid': {describe: 'Use the parent process ID to check for death.  If it is dead, this process should die'},
      'check-pid': {describe: 'The process ID to be checked for death.  If it is dead, this process should die', default: 0 },
      'port': {describe: 'The port to start the java process on'},
      'stdin': {describe: 'Indicates to read configuration from standard input'},
      'showPort': {describe: 'The process will output on its standard output the port that the Java process is using', alias: 'showport'},
      'useTokenNotCookie': {describe: 'Tells the code to use X-Session-Token header instead of cookie', alias: 'usetokennotcookie'}
    })
    .help()
    .argv;

  javaOptions = argv.javaOptions;

  if (argv.verbose) {
    logger.setStdoutEnabled();
  }

  if (argv.checkPpid)
    checkPid = process.ppid;
  else
    checkPid = argv.checkPid;

  if (checkPid !== 0) {
    setInterval(doCheckPid, checkPpidMillis);
  }

  if (argv.portOption) {
    cbePort = argv.portOption;
  }

  if (argv.stdinOption) {
    let readlineStdin = readline.createInterface({
      input: process.stdin,
    });
    readlineStdin.on('close', () => {
      process.exit();
    });
  }

  // Note that the way yargs works is very flexible.  If someone says
  // "--show-port" or "--showPort" or "--showport", it will put in argv the
  // value with keys "showPort" *and* "show-port" *and* "showport".
  showPort = argv.showPort;
  useTokenNotCookie = argv.useTokenNotCookie;
  quiet = argv.quiet;
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

  let spawnArgs = [ ];
  const config = AppConfig.getAll();
  if (config['weblogic.remoteconsole.java.startoptions']) {
    for (var arg of config['weblogic.remoteconsole.java.startoptions'].split(';')) {
      spawnArgs.push(arg);
    }
  }
  if (javaOptions) {
    for (arg of javaOptions.split(';')) {
      spawnArgs.push(arg);
    }
  }
  spawnArgs.push(...[
    `-Djava.io.tmpdir=${cbeTempDir}`,
    `-Dserver.port=${cbePort}`,
    '-jar',
    `${instDir}/backend/console.jar`,
    '--persistenceDirectory',
    `${app.getPath('userData')}`,
    '--showPort',
    '--stdin'
  ]);
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

  UserProjects.dumpPasswords(cbe.stdin);

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
    } else if (line.startsWith('URL: ')) {
      shell.openExternal(line.replace('URL: ', ''));
    } else if (line.startsWith('EncryptionService: ')) {
      if (safeStorage.isEncryptionAvailable()) {
        const decrypted = atob(line.replace('EncryptionService: ', ''));
        const encrypted = safeStorage.encryptString(decrypted);
        const output = 
          `${btoa(decrypted)} ${btoa(encrypted.toString('base64'))}`;
        cbe.stdin.write(`EncryptionService: ${output}\n`);
      }
    } else if (line.startsWith('BACKEND OUTPUT: ')) {
      line = line.replace('BACKEND OUTPUT: ', '');
    }
    logger.log('debug', `!${line}!`);
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
    function createNewWindow() {
      const newWindow = AppWindow.createNewWindow(cbeUrl);
      windows.push(newWindow);
      newWindow.on('closed', () => {
        windows = windows.filter(w => w !== newWindow);
        if (windows.length === 0) {
          app.quit();
        }
      });
    }

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

      const file = app.getPath('userData') + '/user-prefs.json';
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

      const mainWindow = AppWindow.initialize(
        I18NUtils.get('wrc-electron.messages.initializing'),
        params,
        path.dirname(app.getPath('exe')),
        app.getPath('userData'),
        createNewWindow
      );
      windows.push(mainWindow);

      // Handle window closing
      mainWindow.on('closed', () => {
        windows = windows.filter(w => w !== mainWindow);
        if (windows.length === 0) {
          app.quit();
        }
      });

      AppWindow.renderAppMenu();
    }
    else {
      AppWindow.hideDockIconMacOS();
    }
    Watcher.initialize(app.getPath('userData'), windows[0], [UserPrefs, AutoPrefs, AppConfig]);
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

ipcMain.handle('preference-reading', async (event, arg) => {
  logger.log('debug', `'preference-reading' arg=${JSON.stringify(arg)}`);
  // You don't need to return an explicit Promise
  // here, because the async keyword before the
  // "(event, ...args)" in the method signature,
  // does that implicitly.
  return UserPrefs.get(arg);
});

ipcMain.handle('file-choosing', async (event, dialogParams) => {
  console.trace('FIXME file-choosing in electron is going away');
  return null;
});

ipcMain.handle('external-url-opening', async (event, arg) => {
  AppWindow.openExternalURL(arg);
});


ipcMain.handle('unsaved-changes', async (event, busy) => {
  console.trace('FIXME unsaved-changes is going away');
});


ipcMain.handle('get-property', async (event, prop) => {
  return AutoPrefs.get(prop);
});

ipcMain.handle('set-property', async (event, arg) => {
  AutoPrefs.set(arg);
  AutoPrefs.write();
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
ipcMain.handle("file-creating", async (event, arg) => {
  const dialogParams = {
    defaultPath: arg.filepath,
    properties: ["createDirectory"],
    filters: {
      name: "Supported Formats",
      extensions: FileUtils.fileExtensions,
    },
  };

  return AppWindow.showFileCreatingSaveDialog(dialogParams).then((result) => {
    if (!result.canceled) {
      if (arg.fileContents) {
        return FileUtils.writeFileAsync(result.filePath, arg.fileContents).then(
          (reply) => {
            reply["filePath"] = result.filePath;
            return Promise.resolve(reply);
          }
        );
      } else {
        return Promise.resolve({ succeeded: true, filePath: result.filePath });
      }
    } else {
      return Promise.resolve({ succeeded: false, filePath: "" });
    }
  });
});
