/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
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
const { spawn } = require("child_process");
const { execFile } = require("child_process");

const { app, ipcMain } = require('electron');

const logger = require('./js/console-logger');

const I18NUtils = require('./js/i18n-utils');
const OSUtils = require('./js/os-utils');
// Declare variable for IIFE class used to perform file
// management operations for JET side of WRC
const FileUtils = require('./js/file-utils');
// Declare variable for IIFE class used to manage data
// persisted in the user-prefs.json file
const UserPrefs = require('./js/user-prefs-json');
// Declare variable for IIFE class used to manage data
// persisted in the config.json file
const AppConfig = require('./js/config-json');
// Declare variable for IIFE class used to manage projects
const ProjectManager = require('./js/project-management');
// Declare variable for IIFE class used to manage window
// and menu for app
const AppWindow = require('./js/window-management');

// Declare functions from module that wraps keytar usage
const {getKeyTar} = require('./js/keytar-utils');
// Declare functions from module that wraps auto-updater usage
const {getAutoUpdateInfo} = require('./js/auto-update-utils');

const instDir = path.dirname(app.getPath('exe'));
const { homepage, productName, version, copyright } = require(`${instDir}/package.json`);

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
let login = null;
let lines = [ ];

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

  ProjectManager.readProjects(userDataPath);
  ProjectManager.selectCurrentProject();
})();

// On Mac OS, the "Finder" prevents starting the Remote Console when it
// has already been started, even if it was only started for use by WKT UI.
// This is different than Windows and Linux where the passive Remote Console
// instance started for WKT UI is not seen as an instance of the Remote
// Console.  Given the limitations of the Mac OS user interface, it will be
// impossible to do as well as Windows and Linux, where the user can launch as
// many copies of the Remote Console as they choose.  Instead, we will allow the
// user to have, at most, two Remote Consoles, the passive one used by WKT UI
// and an active one that is actually a Remote Console that they can use.
// 
// We will be able to make this work on the Mac by recognizing that the user
// has clicked on the Remote Console and interpreting that as the desire to
// have a real one, not the passive one.
//
// Electron on Mac OS does give an "activate" notification when the user clicks.
// Therefore, if there is no Remote Console running when we get the
// notification, we start one.  There are three ways to know that there is
// already a Remote Console running:
// 1.  We are a Remote Console ourselves.  This is indicated by the "window"
//     variable, which is where the remote console is displayed and is set by the
//     "ready" notification, which comes before any "activate" notification.
// 2.  We've already started one ourselves and it is still running.
// 3.  If a Remote Console was started *prior* to launching WKT UI and the user
//     clicked on our process, neither of the above conditions is true, but
//     we also don't want to launch another because that is not consistent with
//     the user's click.
//     We can tell that this has occurred by using the "single instance lock".
//     On Mac OS, we grab the lock whenever we create the window (the lock is
//     automatically released on process exit).  Therefore, if nobody is holding
//     the lock, then we are free to start a new process to start a window and
//     grab the lock.  Since we are testing the lock before creating the new
//     process, there is a timing window where if a user clicks really quickly,
//     we will try to create more than necessary and they will die right away.
//     This will actually be the behavior the user would expect since, on the
//     Mac, only a single active instance is allowed.
// Technically, we could live without #2 since #3 will cover it, but it feels
// like checking a variable is nice and light weight.
app.on('activate', () => {
  if (!window && !another_me && app.requestSingleInstanceLock()) {
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
  if (!app.commandLine.hasSwitch("headless")) {
    AppWindow.load(`http://localhost:${cbePort}/`);
  }
}

function processCmdLineOptions() {
  const config = AppConfig.getAll();

  if (config['server.port']) {
    cbePort = config['server.port'];
  }

  if (app.commandLine.hasSwitch("check-ppid"))
    checkPid = process.ppid;
  else
    checkPid = app.commandLine.getSwitchValue("check-pid");

  if (checkPid !== 0) {
    setInterval(doCheckPid, checkPpidMillis);
  }

  const portOption = app.commandLine.getSwitchValue("port");
  if (portOption) {
    cbePort = portOption;
  }

  const stdinOption = app.commandLine.hasSwitch("stdin");
  if (stdinOption) {
    let readlineStdin = readline.createInterface({
      input: process.stdin,
    });
    readlineStdin.on("close", () => {
      process.exit();
    });
  }

  // Windows folds case in arguments it seems
  showPort = app.commandLine.hasSwitch("showPort") ||
    app.commandLine.hasSwitch("showport");
  useTokenNotCookie = app.commandLine.hasSwitch("useTokenNotCookie") ||
    app.commandLine.hasSwitch("usetokennotcookie");
  quiet = app.commandLine.hasSwitch("quiet");

  // Check for WRC custom URL
  if (app.commandLine.hasSwitch("login")) {
    login = app.commandLine.getSwitchValue("login");
  }
}

function start_cbe() {
  var instDir = path.dirname(app.getPath("exe"));
  let filename = AppConfig.getFilename();
  let spawnArgs = [
    `-Dserver.port=${cbePort}`,
    "-jar",
    `${instDir}/backend/console.jar`,
    "--persistenceDirectory",
    `${app.getPath("userData")}`,
    "--showPort",
    "--stdin",
    "--properties",
    filename,
  ];
  if (useTokenNotCookie) {
    spawnArgs.push('--useTokenNotCookie');
  }
  const cbe = spawn(instDir + "/customjre/bin/java", spawnArgs);

  let readlineStderr = readline.createInterface({
    input: cbe.stderr,
  });

  let readlineStdout = readline.createInterface({
    input: cbe.stdout,
  });

  readlineStderr.on("line", (line) => {
    console.log(line);
    lines.push(line);
  });

  readlineStderr.on("close", () => {
    if (!started) {
      let i = lines.length - 40;
      if (i < 0) i = 0;
      var last40 = "Java Process Output";
      for (; i < lines.length; i++) last40 = last40 + "\n" + lines[i];
      AppWindow.showJavaProcessErrorMessageBox(
        "Remote Console Error - Java Process",
        `${last40}`,
        ["Exit"]
      );
    }
    process.exit();
  });

  readlineStdout.on("line", (line) => {
    console.log(line);
    if (line.startsWith("Port=")) {
      if (showPort) logger.log(line);
      cbePort = line.replace("Port=", "");
      started = true;
      doit();
    }
  });
}

function start_another_me() {
  another_me = execFile(`${instDir}/WebLogic Remote Console`, () => {
    another_me = null;
  });
}

app.whenReady()
  .then(() => {
    processCmdLineOptions();

    if (!app.commandLine.hasSwitch("headless")) {
      // As described earlier, the Mac will only support one running
      // Remote Console (with a head)
      if (OSUtils.isMacOS()) {
        if (!app.requestSingleInstanceLock()) {
          process.exit();
          process.kill(process.pid, 9);
        }
      }

      const params = {
        version: version,
        productName: productName,
        copyright: copyright,
        homepage: homepage,
        supportsAutoUpgrades: !instDir.startsWith('/opt/')
      };

      if (params.supportsAutoUpgrades && !app.commandLine.hasSwitch("headless")) {
        const autoUpdateInfo = getAutoUpdateInfo();
        if (autoUpdateInfo.version !== version) {
          params['version'] = autoUpdateInfo.version;
        }
      }

      window = AppWindow.initialize(
        "Initializing...",
        params,
        path.dirname(app.getPath('exe')),
        app.getPath('userData')
      );

      AppWindow.renderAppMenu();
    }
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
    return showFileCreatingSaveDialog(dialogParams)
      .then(result => {
        if (!result.canceled) {
          return FileUtils.writeFileAsync(result.filePath, arg.fileContents)
            .then(reply => {
              reply["filePath"] = result.filePath;
              return Promise.resolve(reply);
            });
        }
        else {
          return Promise.resolve({succeeded: false, filePath: ""});
        }
      });
  }
  else {
    const response = {
      succeeded: false,
      failure: {
        transport: {statusText: "Missing or invalid parameter"},
        failureType: "VERIFICATION",
        failureReason: "Parameters cannot be undefined, null or an empty string: arg.fileContents!"
      }
    };
    return Promise.resolve(response);
  }
});

ipcMain.handle('file-reading', async (event, arg) => {
  return FileUtils.createFileReadingResponse(arg.filepath)
    .catch(response => {
      if (arg.allowDialog && (response.failureType === "NOT_FOUND")) {
        const dialogParams = {
          defaultPath: arg.filepath,
          properties: ['openFile'],
          filters: { name: 'Supported Formats', extensions: FileUtils.fileExtensions }
        };
        return showFileReadingOpenDialog(dialogParams)
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
        transport: {statusText: "Missing or invalid parameter"},
        failureType: "VERIFICATION",
        failureReason: "Parameters cannot be undefined, null or an empty string: arg.filepath, arg.fileContents!"
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
  return showFileChoosingOpenDialog(dialogParams)
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
        failureType: "UNEXPECTED",
        failureReason: err
      };
      return Promise.reject(response);
    });
});

ipcMain.handle('current-login', async (event, ...args) => {
  if (login) {
    // Create the reply with the current login state
    const reply = {action: "login", customUrl: login};

    // Clear the login state then return the reply
    login = null;
    return reply;
  }
  return null;
});

ipcMain.handle('current-project-requesting', async (event, ...args) => {
  // You don't need to return an explicit Promise
  // here, because the async keyword before the
  // "(event, ...args)" in the method signature,
  // does that implicitly.
  const current_project = ProjectManager.getCurrentProject();
  if (typeof current_project !== "undefined") {
    return current_project;
  }
  return null;
});

ipcMain.handle('submenu-state-setting', async (event, arg) => {
  AppWindow.setAppSubmenuItemsState(arg);
});

ipcMain.handle('project-changing', async (event, arg) => {
  const result = ProjectManager.processChangedProject(arg);
  if (result.succeeded) {
    AppWindow.renderAppMenu();
  }
  // You don't need to return an explicit Promise
  // here, because the async keyword before the
  // "(event, ...args)" in the method signature,
  // does that implicitly.
  return `Saved it!`;
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
      return (typeof provider1 !== "undefined");
    }

    const reply = {succeeded: false};

    try {
      const keytar = getKeyTar();
      if (typeof keytar !== "undefined") {
        const project = ProjectManager.getProject(arg.project.name);
        if (typeof project !== "undefined") {
          if (isValidProvider(project, arg.provider)) {
            const account = `${project.name}-${arg.provider.name}-${arg.provider.username}`;
            keytar.getPassword('weblogic-remote-console', account)
              .then(secret => {
                if (secret !== null) {
                  reply.succeeded = true;
                  reply["secret"] = secret;
                }
                else {
                  reply["failure"] = {
                    failureType: "NO_MATCHING_KEYTAR_ACCOUNT",
                    failureReason: `Unable to retrieve secret for '${account}' keytar account`
                  };
                }
                resolve(reply);
              });
          }
          else {
            reply["failure"] = {
              failureType: "INVALID_PROVIDER",
              failureReason: `Provider named '${arg.provider.name}' is not associated with the specified project: '${arg.project.name}'`
            };
            resolve(reply);
          }
        }
        else {
          reply["failure"] = {
            failureType: "INVALID_PROJECT",
            failureReason: `Unable to find a project named '${arg.project.name}'`
          };
          resolve(reply);
        }
      }
      else {
        reply["failure"] = {
          failureType: "KEYTAR_NOT_LOADABLE",
          failureReason: `keytar is not installed or loadable, so skipping code that securely retrieves stored credentials.`
        };
        resolve(reply);
      }
    }
    catch(err) {
      const response = {
        transport: {statusText: err.code},
        failureType: "UNEXPECTED",
        failureReason: err.stack
      };
      reject(response);
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
