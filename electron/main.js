let keytar;

const { BrowserWindow, app, Menu, shell, ipcMain, dialog } = require("electron")
const { autoUpdater } = require('electron-updater');
autoUpdater.autoDownload = false;
const prompt = require('electron-prompt');
var path = require('path');
const instDir = path.dirname(app.getPath('exe'));
const canCheckForUpdates = !instDir.startsWith('/opt/');

const { homepage, productName, version, copyright } = require(`${instDir}/package.json`);

const fs = require('fs');
var newVersion = version;
var window;
var projects;
var current_project;
var width = 1600;
var height = 1000;
var started = false;
var lines = [ ];

if (process.platform === 'darwin') {
  quitkey = 'Command+Q';
}
else {
  quitkey = 'Control+Q';
}

function getProject(name) {
  let project;
  if (name === "(Unnamed Project)") name = "(unnamed)";
  if (name) {
    project = projects.find(item => item.name === name);
  }
  return project;
}

function showPopupMessage(message) {
  dialog.showMessageBox(window, {
    title: message.title,
    buttons: ['Dismiss'],
    type: message.severity,
    message: message.details,
  });
}

function makeCurrentCurrent() {
  for (let i = 0; i < projects.length; i++)
    delete projects[i].current;
  current_project.current = true;
}

function isKeyTarInstalled() {
  let rtnval = false;
  try {
    require.resolve("keytar");
    rtnval = true;
  }
  catch(err) {
    if (err.code !== "MODULE_NOT_FOUND") throw err;
  }
  return rtnval;
}

function loadKeyTar() {
  if (isKeyTarInstalled()) {
    require.resolve("keytar");
    // Load the keytar module if it hasn't been
    // loaded yet.
    if (typeof keytar === "undefined") {
      // Module-scope variable wasn't set, so
      // go ahead and call require to load the
      // leytar module and set the variable.
      keytar = require('keytar');
    }
  }
}

function removeKeytarAccount(account) {
  let rtnval = false;
  loadKeyTar();
  if (typeof keytar !== "undefined") {
    rtnval = keytar.deletePassword('weblogic-remote-console', account);
  }
  return rtnval;
}

/**
 * Returns a copy of the ``projects`` module-scoped variable, where the ``dataProvider`` objects do not contain fields specified in ``providerKeyExclusions``.
 * @param {[string]|[]} providerKeyExclusions - An string array containing the object keys to exclude.
 * @returns {Array} - A copy of the ``projects`` module-scoped variable, where the ``dataProvider`` objects do not contain fields specified in ``providerKeyExclusions``.
 * @private
 */
function getMaskedProjects(providerKeyExclusions = []) {
  // Declare return variable
  let maskedProjects = [];
  // Use spread operator (...) to create a copy
  // of the module-scoped projects variable.
  const clonedProjects = [...projects];
  // Loop through the copy of the projects variable
  for (const i in clonedProjects) {
    // Extract providers from copy of project
    const providers = getFilteredProviders(clonedProjects[i].dataProviders);
    // Loop through extracted providers
    for (const j in providers) {
      // Create 2-elememt ["key", "value"] array
      // from provider.
      const arr = Object.entries(providers[j]);
      // Exclude the 2-element array item, if the key
      // is in providerKeyExclusions array.
      const filtered = arr.filter(([key, value]) => providerKeyExclusions.indexOf(key) === -1);
      // Convert remaining 2-element array items back
      // into an object, and then store the object
      // back in the current provider item.
      providers[j] = Object.fromEntries(filtered);
    }
    // Replace providers of cloned/copied project
    // with updated providers.
    clonedProjects[i].dataProviders = providers;
    // Put cloned/copied project in return variable.
    maskedProjects.push(clonedProjects[i]);
  }
  return maskedProjects;
}

function getFilteredProviders(providers) {
  const filteredProviders = [];
  // Using for (const i in <array>) is the optimal
  // (e.g. more operations per seconds) for-loop
  // construct, in JS
  for (const i in providers) {
    // Declare local variable used to filter
    // out properties fron changed_project.
    const filteredProvider = {
      name: providers[i].name,
      type: providers[i].type
    };

    // Filter out properties associated with adminserver
    // provider type.
    if (providers[i].url) filteredProvider.url = providers[i].url;
    if (providers[i].username) filteredProvider.username = providers[i].username;
    if (providers[i].password) filteredProvider.password = providers[i].password;

    // Filter out properties associated with model
    // provider type.
    if (providers[i].file) {
      filteredProvider.file = providers[i].file;
    }
    filteredProviders.push(filteredProvider);
  }
  return filteredProviders;
}

function upsertKeytarEntries(project) {
  loadKeyTar();
  if (typeof keytar !== "undefined") {
    for (const i in project.dataProviders) {
      if (project.dataProviders[i].type === "adminserver") {
        const account = `${project.name}-${project.dataProviders[i].name}-${project.dataProviders[i].username}`;
        const password = project.dataProviders[i].password || "";
        if (password !== "") keytar.setPassword('weblogic-remote-console', account, password);
      }
    }
  }
  else {
    console.log(`keytar is not installed or loaded, so skipping code that securely stores credentials for adminserver connection providers.`);
  }
}

function makeNewFromCurrent() {
  const index = projects.map(item => item.name).indexOf(current_project.name);
  if (index !== -1) {
    current_project.dataProviders = getFilteredProviders(current_project.dataProviders);
    upsertKeytarEntries(current_project);
    projects[index] = current_project;
  }
  else {
    projects.push(current_project);
  }

  makeCurrentCurrent();
  writeAutoPrefs();
}

/**
 * Add ``current_project`` to module-scoped ``projects`` variable, or simply update it if a project with the same ``id`` already exist.
 * @param {{name: string, current?: boolean, dataProviders: [{name: string, type: string, url: string, username: string, password: string}|{name: string, type: string, file: string}]}} changed_project
 * @private
 */
function makeNewFromChanged(changed_project) {
  const index = projects.map(item => item.name).indexOf(changed_project.name);
  if (index !== -1) {
    projects[index] = changed_project;
  }
  else {
    projects.push(changed_project);
  }

  current_project = changed_project;

  makeCurrentCurrent();
  writeAutoPrefs();
}

function makeMenu() {
  if (typeof current_project === "undefined") {
    current_project = {
      name: '(unnamed)',
      dataProviders: []
    };
  }
  let template = [
    {
      label: '&File',
      role: 'fileMenu',
      submenu: []
    },
    {
      label: '&Edit',
      role: 'editMenu',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CommandOrControl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CommandOrControl+Z',
          role: 'undo'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CommandOrControl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CommandOrControl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CommandOrControl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CommandOrControl+A',
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: '&Help',
      role: 'help',
      submenu: [
        {
          label: `About ${productName}`,
          role: 'about',
          click() {
            app.showAboutPanel();
          }
        },
        {
          label: `Visit ${productName} Website`,
          click() {
            shell.openExternal('https://github.com/oracle/weblogic-remote-console').then();
          }
        },
      ]
    }
  ];
  if (canCheckForUpdates) {
    template[3].submenu.push(
      {
          label: `Check For Updates`,
          click() {
              autoUpdater.checkForUpdates().then(result => {
                newVersion = result.versionInfo.version;
                if (newVersion === version) {
                  dialog.showMessageBox(window,
                    {
                      title: 'You Are Up To Date',
                      buttons: ['Ok'],
                      type: 'info',
                      message: `Current version is ${newVersion}`
                    }
                  );
                } else {
                  dialog.showMessageBox(window,
                    {
                      title: 'Newer Version Available!',
                      buttons: ['Ok', 'Cancel'],
                      type: 'info',
                      message: `Go to https://github.com/oracle/weblogic-remote-console/releases to get version ${newVersion}?`
                    }
                  ).then((choice) => {
                    if (choice.response === 0)
                      shell.openExternal('https://github.com/oracle/weblogic-remote-console/releases').then();
                  });
                }
              }
            )
            .catch(err => {
              dialog.showMessageBox(window,
                {
                  title: 'Connection Issue',
                  buttons: ['Ok'],
                  type: 'info',
                  message: 'Could not reach update site'
                }
              );
            });
          }
        }
    );
  }
  if (newVersion !== version) {
    template.push(
      {
        label: 'New Version Available - click here',
        click() {
          shell.openExternal('https://github.com/oracle/weblogic-remote-console/releases').then();
        }
      }
    );
  }
  template[0].submenu.push({
    label: 'New Project',
    click(item) {
      prompt({
        title: 'New Project',
        label: 'Name',
        inputAttrs: { required: true },
        resizable: true,
        alwaysOnTop: true
      })
      .then(name => {
        const previous_project = JSON.parse(JSON.stringify(current_project));
        delete previous_project.current;
        const project = getProject(name);
        if (typeof project === "undefined") {
          current_project = {
            name: name,
            dataProviders: []
          };
          makeNewFromCurrent(current_project);
          makeMenu();
          window.webContents.send('on-project-switched', {action: "create", from: previous_project, to: current_project});
        }
        else {
          showPopupMessage({title: "Project Already Exist", severity: "warning", details: `A project named "${name}" already exists!`});
        }
      })
      .catch(err => {
        reject(new Error('Failed to create project'));
      });
    }
  });
  if (projects.length > 1) {
    let subsubmenu = [];
    for (i = 0; i < projects.length; i++) {
      if (projects[i].name !== current_project.name) {
        subsubmenu.push({
          label: `${projects[i].name}`,
          id: i,
          click(item) {
            const previous_project = JSON.parse(JSON.stringify(current_project));
            current_project = projects[item.id];
            makeCurrentCurrent();
            writeAutoPrefs();
            makeMenu();
            window.webContents.send('on-project-switched', {action: "select", from: previous_project, to: current_project});
          }
        });
      }
    }
    template[0].submenu.push({
      label: 'Switch to project',
      submenu: subsubmenu
    });
  }
  subsubmenu = [];
  for (i = 0; i < projects.length; i++) {
    if (projects[i].name === current_project.name)
      label = `${projects[i].name} (current)`;
    else
      label = `${projects[i].name}`;
    subsubmenu.push({
      label: label,
      id: i,
      click(item) {
        const previous_project = JSON.parse(JSON.stringify(projects[item.id]));
        let iscur = (projects[item.id].name === current_project.name);
        if (item.id !== 0) {
          projects[item.id] = projects[0];
        }
        projects.shift();
        if (projects.length === 0) {
          current_project = {
            name: '(unnamed)',
            dataProviders: []
          };
          projects.push(current_project);
          makeCurrentCurrent();
          window.webContents.send('on-project-switched', {action: "navigate", from: previous_project, to: current_project});
        }
        else if (iscur) {
          current_project = projects[0];
          makeCurrentCurrent();
          window.webContents.send('on-project-switched', {action: "navigate", from: previous_project, to: current_project});
        }
        writeAutoPrefs();
        makeMenu();
      }
    });
  }
  template[0].submenu.push({
    label: 'Delete Project',
    submenu: subsubmenu
  });
  if (current_project.name === '(unnamed)') {
    template[0].submenu.push({
      label: 'Name Project...',
      click(item) {
        prompt({
          title: 'Name Project',
          label: 'Name',
          inputAttrs: { required: true },
          resizable: true,
          alwaysOnTop: true
        })
        .then(name => {
          const project = getProject(name);
          if (typeof project === "undefined") {
            const previous_project = JSON.parse(JSON.stringify(current_project));
            current_project.name = name;
            writeAutoPrefs();
            makeMenu();
            window.webContents.send('on-project-switched', {action: "rename", from: previous_project, to: current_project});
          }
          else {
            showPopupMessage({title: "Project Already Exist", severity: "warning", details: `Cannot use the name "${name}" because a project with that name already exists!`});
          }
        })
        .catch(err => {
          reject(new Error('Failed to create project'));
        });
      }
    });
  }
  else {
    template[0].submenu.push({
      label: `Rename "${current_project.name}"...`,
      id: current_project.name,
      click(item) {
        prompt({
          title: `Rename ${item.id}`,
          label: 'New name',
          value: current_project.name,
          inputAttrs: { required: true },
          resizable: true,
          alwaysOnTop: true
        })
        .then(name => {
          if (name) {
            const project = getProject(name);
            if (typeof project === "undefined") {
              const previous_project = JSON.parse(JSON.stringify(current_project));
              current_project.name = name;
              writeAutoPrefs();
              makeMenu();
              window.webContents.send('on-project-switched', {action: "rename", from: previous_project, to: current_project});
            }
            else {
              showPopupMessage({title: "Project Already Exist", severity: "warning", details: `Cannot rename the project to "${name}" because a project with that name already exists!`});
            }
          }
        });
      }
    });
  }
  template[0].submenu.push({
    label: 'Quit',
    role: 'quit',
    accelerator: `${quitkey}`
  });
  Menu.setApplicationMenu((Menu.buildFromTemplate(template)));
}


if (canCheckForUpdates) {
  autoUpdater.checkForUpdates().then(result => {
    newVersion = result.versionInfo.version;
    if (app.isReady())
      makeMenu();
  });
}

app.setPath('userData', `${app.getPath('appData')}/weblogic-remote-console`);

var readline = require('readline');

function writeAutoPrefs() {
  const prefs = {
    width: window.getSize()[0],
    height: window.getSize()[1],
    projects: getMaskedProjects(["password"])
  };
  fs.writeFileSync(`${app.getPath('userData')}/auto-prefs.json`, JSON.stringify(prefs, null, 4));
}

function readAutoPrefs() {
  let filename = `${app.getPath('userData')}/auto-prefs.json`;
  if (fs.existsSync(filename)) {
    props = JSON.parse(fs.readFileSync(filename));
    if (props["width"])
      width = props["width"];
    if (props["height"])
      height = props["height"];
    if (props["projects"])
      projects = props["projects"]
    else
      projects = [ ];
    for (let i = 0; i < projects.length; i++)
      if (projects[i].current)
        current_project = projects[i];
  }
  else
    projects = [ ];
}

function doit() {
  var port = 8012;
  let filename = `${app.getPath('userData')}/config.json`;
  if (fs.existsSync(filename)) {
    props = JSON.parse(fs.readFileSync(filename));
    if (props["server.port"])
      port = props["server.port"];
  }
  if (!app.commandLine.hasSwitch("headless"))
    window.loadURL(`http://localhost:${port}/`);
}

function rotateLogfile() {
  const filebase = "out";
  const filename = filebase + ".log";
  const file = `${app.getPath("userData")}/${filename}`;

  if (fs.existsSync(file)) {
    fs.renameSync(file, file.replace(filename, `${filebase}-1.log`));
  }

  return file;
}

const logFilename = rotateLogfile();
const os = require("os");

function start_cbe() {
  
  const { spawn } = require("child_process");

  var instDir = path.dirname(app.getPath("exe"));
  let filename = `${app.getPath("userData")}/config.json`;
  const cbe = spawn(instDir + "/customjre/bin/java", [
    "-jar",
    `${instDir}/backend/console.jar`,
    "--stdin",
    "--properties",
    filename,
  ]);
  
  let rl = readline.createInterface({
    input: cbe.stderr,
  });

  let rl2 = readline.createInterface({
    input: cbe.stdout,
  });

  rl.on("line", (line) => {
    console.log(line);
    fs.appendFileSync(logFilename, line + os.EOL);
    lines.push(line);
    if (line.includes("Started in")) {
      started = true;
      doit();
    }
  });

  rl.on("close", () => {
    if (!started) {
      let i = lines.length - 40;
      if (i < 0) i = 0;
      var last40 = "Java Process Output";
      for (; i < lines.length; i++) last40 = last40 + "\n" + lines[i];
      dialog.showMessageBoxSync(window, {
        title: "Remote Console Error - Java Process",
        buttons: ["Exit"],
        type: "error",
        message: `${last40}`,
      });
    }
    process.exit();
  });

  rl2.on("line", (line) => {
    console.log(line);
    fs.appendFileSync(logFilename, line + os.EOL);
  });
}

function readWDTModelFile(filepath) {
  return {
    file: filepath,
    fileContents: fs.readFileSync(filepath, 'utf8'),
    mediaType: (filepath.endsWith(".json") ? "application/json" : "application/yaml")
  };
}

function writeFileAsync(filepath, fileContents) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      filepath,
      fileContents,
      {encoding: "utf8", flag: "w", mode: 0o666},
      (err) => {
        if (err) {
          reject({
            succeeded: false,
            failure: {
              transport: {statusText: err.code},
              failureType: "UNEXPECTED",
              failureReason: err.stack
            }
          });
        }
        else {
          resolve({ succeeded: true, filePath: filepath});
        }
      });
  });
}

function createFileReadingResponse(filepath) {
  const response = {};
  if (fs.existsSync(filepath)) {
    try {
      const results = readWDTModelFile(filepath);
      response["file"] = results.file;
      response["fileContents"] = results.fileContents;
      response["mediaType"] = results.mediaType;
      return Promise.resolve(response);
    }
    catch(err) {
      response["transport"] = {statusText: err};
      response["failureType"] = "UNEXPECTED";
      response["failureReason"] = err;
      return Promise.reject(response);
    }
  }
  else {
    response["transport"] = {statusText: `File does not exist: ${filepath}`};
    response["failureType"] = "NOT_FOUND";
    response["failureReason"] = `File does not exist: ${filepath}`;
    return Promise.reject(response);
  }
}

/**
 * window.electron_api.invoke("file-creating")
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
      filters: { name: 'Supported Formats', extensions: ['yml', 'yaml', 'json']}
    };
    return dialog.showSaveDialog(window, dialogParams)
      .then(result => {
        if (!result.canceled) {
          return writeFileAsync(result.filePath, arg.fileContents)
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

ipcMain.handle('file-reading', async (event, filepath) => {
  return createFileReadingResponse(filepath)
    .catch(response => {
      if (response.failureType === "NOT_FOUND") {
        const dialogParams = {
          defaultPath: filepath,
          properties: ['openFile'],
          filters: { name: 'Supported Formats', extensions: ['yml', 'yaml', 'json']}
        };
        return dialog.showOpenDialog(window, dialogParams)
          .then(dialogReturnValue => {
            if (dialogReturnValue.filePaths.length > 0) {
              return createFileReadingResponse(dialogReturnValue.filePaths[0]);
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
        return Promise.reject(response);
      }
    });
});

ipcMain.handle('file-writing', async (event, arg) => {
  if (arg.filepath && arg.fileContents) {
    return writeFileAsync(arg.filepath, arg.fileContents);
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

ipcMain.handle('file-choosing', async (event, dialogParams) => {
  return dialog.showOpenDialog(window, dialogParams)
    .then(dialogReturnValue => {
      if (dialogReturnValue.filePaths.length > 0) {
        const filepath = dialogReturnValue.filePaths[0];
        return createFileReadingResponse(filepath);
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

ipcMain.handle('current-project-requesting', async (event, ...args) => {
  // You don't need to return an explicit Promise
  // here, because the async keyword before the
  // "(event, ...args)" in the method signature,
  // does that implicitly.
  if (typeof current_project !== "undefined") {
    return current_project;
  }
  return null;
});

ipcMain.handle('project-changing', async (event, arg) => {
  /**
   * A closure that creates and returns a ``project`` using the specified ``entry`` JS object.
   * @param {{name: string, current?: boolean, dataProviders: [{name: string, type: "adminserver", url: string, username: string, password: string}|{name: string, type: "model", file: string}]}} entry
   * @private
   */
  function makeChanged(entry) {
    const changed_project = {
      name: entry.name,
      dataProviders: []
    };

    if (entry.name === "(Unnamed Project)") {
      changed_project.name = "(unnamed)";
    }

    if (typeof entry.dataProviders === "undefined" || entry.dataProviders === null) {
      entry.dataProviders = [];
    }

    changed_project.dataProviders = getFilteredProviders(entry.dataProviders);
    upsertKeytarEntries(changed_project);

    return changed_project;
  }

  const changed_project = makeChanged(arg);
  makeNewFromChanged(changed_project);
  makeMenu();
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
      loadKeyTar();
      if (typeof keytar !== "undefined") {
        const project = getProject(arg.project.name);
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

app.whenReady()
  .then(() => {
    if (!app.commandLine.hasSwitch("headless")) {
      /**
       * Creates a new instance of the ``BrowserWindow`` class, using the specified parameter values.
       * @param {string} title
       * @param {number} width
       * @param {number} height
       * @returns {BrowserWindow}
       * @private
       */
      function createBrowserWindow(title, width, height) {
        return new BrowserWindow({
          width: width,
          height: height,
          show: true,
          title: title,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
          }
        });
      }

      /**
       * Sets fields displayed when the "About" menu item is chosen.
       * <p>NOTE: The implementation of this function uses module-scoped variables.</p>
       * @private
       */
      function setAboutPanelFields() {
        app.setAboutPanelOptions({
          applicationName: `${productName}`,
          applicationVersion: `${version}`,
          copyright: `${copyright}`,
          version: `${version}`,
          website: `${homepage}`
        });
      }

      try {
        readAutoPrefs();
      } catch (error) {
        ((line) => {
          console.log(line);
          fs.appendFileSync(logFilename, line + os.EOL);
        })(error);
        dialog.showMessageBoxSync(window, {
          title: "Failure reading auto prefs",
          buttons: ["Exit"],
          type: "error",
          message: `${error}`,
        });

        process.exit();
        process.kill(process.pid, 9);
      }
      window = createBrowserWindow("Initializing...", width, height);
      window.webContents.session.clearCache();
      window.on('resize', () => {
        writeAutoPrefs();
      });
      setAboutPanelFields();
      makeMenu();
    }
    start_cbe();
  })
  .catch(err => {
    ((line) => {
      console.log(line);
      fs.appendFileSync(logFilename, line + os.EOL);
    })(`[MAIN] err=${err}`);

    dialog.showMessageBoxSync(window, {
      title: 'Failure starting remote console',
      buttons: ['Exit'],
      type: 'error',
      message: `${err}`
    });
    process.exit();
    process.kill(process.pid, 9);
  });
