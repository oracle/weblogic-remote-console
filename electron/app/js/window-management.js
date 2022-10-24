/**
 * @license
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

/**
 * See {@link https://stackabuse.com/javascripts-immediately-invoked-function-expressions/}
 * @type {{showFileChoosingOpenDialog, showFailureStartingDialog, renderAppMenu, showFileReadingOpenDialog, showJavaProcessErrorDialog, destroy, showFileCreatingSaveDialog, initialize, setAppSubmenuItemsState}}
 */
const WindowManagement = (() => {
  const path = require('path');

  const {app, BrowserWindow, Menu, dialog, shell} = require('electron');
  const prompt = require('electron-prompt');

  const ProjectManager = require('./project-management');
  const {checkForUpdates} = require('./auto-update-utils');
  const CoreUtils = require('./core-utils');
  const OSUtils = require('./os-utils');
  // Declare variable for IIFE class used to manage data
  // persisted in the auto-prefs.json file
  const AutoPrefs = require('./auto-prefs-json');

  let _window;
  let _params;

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
        preload: path.join(__dirname, 'ipcRendererPreload.js')
      }
    });
  }

  /**
   *
   * @private
   */
  function generateAppMenu() {

    let appMenuTemplate = [
      {
        // Provide an id field, so we can use Array.find() to
        // locate the "File" menu within appMenuTemplate.
        id: 'file',
        label: '&File',
        role: 'fileMenu',
        // Specify empty array for submenu, because the menu items
        // are created in populateFileMenu(appMenuTemplate).
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
        id: 'view',
        label: 'View',
        submenu: [
          { id: 'reload', role: 'reload' },
          // The 'forceReload' menu item causes Electron to create
          // a new Browser Window, so DON'T INCLUDE IT!!
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        // Provide an id field, so we can use Array.find() to
        // locate the "Help" menu within appMenuTemplate.
        id: 'help',
        label: '&Help',
        role: 'help',
        // Specify empty array for submenu, because the menu items
        // are created in populateHelpMenu(appMenuTemplate).
        submenu: []
      }
    ];

    populateFileMenu(appMenuTemplate);
    populateHelpMenu(appMenuTemplate);
    layoutAppMenu(appMenuTemplate);

    // Sets menu as the application menu on macOS. On Windows
    // and Linux, the menu will be set as each window's top menu.
    Menu.setApplicationMenu((Menu.buildFromTemplate(appMenuTemplate)));
  }

  /**
   * Populate the empty ``submenu`` field of the ``File`` menu.
   * @param {[Menu]} appMenuTemplate
   * @private
   */
  function populateFileMenu(appMenuTemplate) {
    /**
     * A closure that creates the "New Project" submenu item, under the "File" menu
     * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures}
     */
    function createNewProjectSubmenu() {
      fileMenu.submenu.push({
        id: 'newProject',
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
              const results = ProjectManager.addNewProject(name);
              if (results.succeeded) {
                current_project = results.current_project;
                generateAppMenu();
                _window.webContents.send('on-project-switched', {action: "create", from: results.previous_project, to: results.current_project});
              }
              else {
                switch(results.resultReason) {
                  case ProjectManager.ResultReason.ALREADY_EXISTS:
                    showPopupMessage({title: "Project Already Exist", severity: "warning", details: `A project named "${name}" already exists!`});
                    break;
                  case ProjectManager.ResultReason.CANNOT_BE_NULL:
                    break;
                }
              }
            })
            .catch(err => {
              reject(new Error('Failed to create project'));
            });
        }
      });
    }

    /**
     * A closure that populates the empty submenu field of the "Switch to project" submenu item, under the "File" menu
     * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures}
     */
    function populateSwitchToProjectSubmenu() {
      const switchable_projects = ProjectManager.getSwitchableProjects();
      // Leaving this following block of code here for now, but
      // it likely needs to be refactored and treated as part of
      // the logic used in ProjectManager.getSwitchableProjects().
      if (switchable_projects.length > 0) {
        const subsubmenu = [];
        for (let i = 0; i < switchable_projects.length; i++) {
          subsubmenu.push({
            label: `${switchable_projects[i].name}`,
            id: i,
            click(item) {
              const results = ProjectManager.selectProject(item.label);
              if  (results.succeeded) {
                current_project = results.current_project;
                generateAppMenu();
                _window.webContents.send('on-project-switched', {action: "select", from: results.previous_project, to: results.current_project});
              }
            }
          });
        }

        fileMenu.submenu.push({
          id: 'switchToProject',
          label: 'Switch to project',
          submenu: subsubmenu
        });
      }

    }

    /**
     * A closure that populates the empty submenu field of the "Delete Project" submenu item, under the "File" menu
     * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures}
     */
    function populateDeleteProjectSubmenu() {
      const deletable_projects = ProjectManager.getDeletableProjects();
      const fileSubmenu = [];
      let label;

      for (let i = 0; i < deletable_projects.length; i++) {
        if (deletable_projects[i].current)
          label = `${deletable_projects[i].name} (current)`;
        else
          label = `${deletable_projects[i].name}`;

        fileSubmenu.push({
          label: label,
          id: i,
          click(item) {
            // Use item.label to get name of project being deleted
            const name = item.label.replace(' (current)', '');
            const results = ProjectManager.deleteProject(name);
            if (results.succeeded) {
              // Update current_project using results returned from the
              // call to ProjectManager.deleteProject.
              current_project = results.current_project;
              _window.webContents.send('on-project-switched', {action: "navigate", from: results.deleted_project, to: results.current_project});
              generateAppMenu();
            }
          }
        });
      }

      fileMenu.submenu.push({
        id: 'deleteProject',
        label: 'Delete Project',
        submenu: fileSubmenu
      });
    }

    /**
     * A closure that creates the "Name/Rename Project" submenu item, under the "File" menu
     * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures}
     */
    function createNameProjectSubmenu() {
      const attr = {};
      if (current_project.name === '(unnamed)') {
        attr['label'] = 'Name Project...';
        attr['prompt'] = {title: 'Name Project', label: 'Name', value: null};
      }
      else {
        attr['label'] = `Rename "${current_project.name}"...`;
        attr['prompt'] = {title: `Rename "${current_project.name}"`, label: 'New name', value: current_project.name};
      }

      fileMenu.submenu.push({
        id: 'nameProject',
        label: attr.label,
        click(item) {
          prompt({
            title: attr.prompt.title,
            label: attr.prompt.label,
            value: attr.prompt.value,
            inputAttrs: { required: true },
            resizable: true,
            alwaysOnTop: true
          })
            .then(name => {
              const results = ProjectManager.renameCurrentProject(name);
              if (results.succeeded) {
                current_project = results.current_project;
                _window.webContents.send('on-project-switched', {action: "rename", from: results.renamed_project, to: results.current_project});
                generateAppMenu();
              }
              else {
                switch(results.resultReason) {
                  case ProjectManager.ResultReason.ALREADY_EXISTS:
                    showPopupMessage({title: "Project Already Exist", severity: "warning", details: `A project named "${name}" already exists!`});
                    break;
                  case ProjectManager.ResultReason.NAME_NOT_CHANGED:
                  case ProjectManager.ResultReason.CANNOT_BE_NULL:
                    break;
                }
              }
            })
            .catch(err => {
              reject(new Error('Failed to create project'));
            });
        }
      });
    }

    // Get 'File' menu from application menu
    const fileMenu = appMenuTemplate.find(item => item.id === 'file');
    // Declare function-scoped reference to the current project
    let current_project = ProjectManager.getCurrentProject();

    createNewProjectSubmenu();
    populateSwitchToProjectSubmenu();
    populateDeleteProjectSubmenu();
    createNameProjectSubmenu();
  }

  /**
   * Populate the empty ``submenu`` field of the ``Help`` menu
   * @param {[Menu]} appMenuTemplate
   * @private
   */
  function populateHelpMenu(appMenuTemplate) {
    async function showNewerVersionAvailableMessageBox(title, message, buttons){
      return dialog.showMessageBox(_window,
        {
          title: title,
          buttons: buttons,
          type: 'info',
          message: message
        }
      );
    }

    function showOnLatestVersionMessageBox(title, message, buttons){
      dialog.showMessageBox(_window,
        {
          title: title,
          buttons: buttons,
          type: 'info',
          message: message
        }
      );
    }

    function showConnectionIssueMessageBox(title, message, buttons){
      dialog.showMessageBox(_window,
        {
          title: title,
          buttons: buttons,
          type: 'info',
          message: message
        }
      );
    }

    const helpMenu = appMenuTemplate.find(item => item.id === 'help');

    if (_params.supportsAutoUpgrades) {
      // Add "Check for Updates" menu item to helpMenu.
      helpMenu.submenu.push(
        {
          id: 'checkForUpdates',
          label: `Check for ${_params.productName} Updates`,
          click() {
            checkForUpdates()
              .then(result => {
                const newVersion = result.version;
                if (newVersion === _params.version) {
                  showOnLatestVersionMessageBox(
                    'You Are Up To Date',
                    `Current version is ${newVersion}`,
                    ['Ok']
                  );
                }
                else {
                  showNewerVersionAvailableMessageBox(
                    'Newer Version Available!',
                    `Go to https://github.com/oracle/weblogic-remote-console/releases to get version ${newVersion}?`,
                    ['Ok', 'Cancel']
                  )
                    .then((choice) => {
                      if (choice.response === 0)
                        shell.openExternal('https://github.com/oracle/weblogic-remote-console/releases').then();
                    });
                }
              })
              .catch(err => {
                showConnectionIssueMessageBox(
                  'Connection Issue',
                  'Could not reach update site',
                  ['Ok']
                );
              });
          }
        }
      );
    }

    // Create additional submenu items for helpMenu,
    // which need to be there regardless of whether
    // auto-upgrade is supported or not.
    const helpSubmenu = [
      {
        label: `Visit ${_params.productName} Github Project`,
        click() {
          shell.openExternal('https://github.com/oracle/weblogic-remote-console').then();
        }
      },
      { type: 'separator' },
      { role: 'toggleDevTools' }
    ];

    // Concatenate additional submenu items to helpMenu.
    helpMenu.submenu = [].concat(helpMenu.submenu, helpSubmenu);
  }

  /**
   * Layout the "WebLogic Remote Console" menu
   * <p>The menu placement needs to be done in a way that adheres to where users expect to find things, on the OS platform the app is running on.</p>
   * @param {[Menu]} appMenuTemplate
   * @private
   */
  function layoutAppMenu(appMenuTemplate) {
    const fileMenu = appMenuTemplate.find(item => item.id === 'file');
    const helpMenu = appMenuTemplate.find(item => item.id === 'help');

    if (OSUtils.isMacOS()) {
      // Add the menu items for the appMenu menu
      // to appMenuTemplate
      appMenuTemplate.unshift({
        id: 'appMenu',
        label: _params.productName,
        role: 'appMenu',
        submenu: [
          {
            id: 'about',
            label: `About ${_params.productName}`,
            role: 'about',
            click() {
              app.showAboutPanel();
            }
          },
          {
            type: 'separator'
          },
          {
            id: 'services',
            label: 'Services',
            role: 'services',
          },
          {
            type: 'separator'
          },
          {
            id: 'hide',
            label: `Hide ${_params.productName}`,
            accelerator: 'Command+H',
            role: 'hide'
          },
          {
            id: 'hideOthers',
            label: 'Hide Others',
            accelerator: 'Command+Alt+H',
            role: 'hideothers'
          },
          {
            id: 'showAll',
            label: 'Show All',
            role: 'unhide'
          },
          {
            type: 'separator'
          },
          {
            id: 'exit',
            label: `Quit ${_params.productName}`,
            accelerator: 'Command+Q',
            click() { app.quit(); }
          }
        ]
      });
    }
    else {
      fileMenu.submenu.push(
        {
          type: 'separator'
        },
        {
          id: 'preferences',
          label: 'Preferences',
          click() {
            app.showAboutPanel();
          }
        },
        {
          type: 'separator'
        },
        {
          id: 'exit',
          label: `Quit ${_params.productName}`,
          accelerator: 'Alt+X',
          click() { app.quit(); }
        }
      );

      // Use custom About dialog for non-MacOS platforms.
      // Built-in About menu not supported for Linux (in current version).
      // Built-in About menu for Windows lacks build version, has title and modal issues.
      helpMenu.submenu.push(
        { type: 'separator' },
        {
          id: 'about',
          label: `About ${_params.productName}`,
          accelerator: 'Alt+A',
          click() {
            app.showAboutPanel();
          }
        }
      );
    }
  }

  /**
   *
   * @param {{title: string, severity: string, details: string}} message
   * @private
   */
  function showPopupMessage(message) {
    dialog.showMessageBox(_window, {
      title: message.title,
      buttons: ['Dismiss'],
      type: message.severity,
      message: message.details,
    }).then();
  }

  return {
    /**
     * @param {string} title
     * @param {{version: string, productName: string, copyright: string, homepage: string, supportsAutoUpgrades: boolean}} params
     * @param {string} exePath
     * @param {string} userDataPath
     * @returns {BrowserWindow}
     */
    initialize: (title, params, exePath, userDataPath) => {
      function setOnWindowCloseListener() {
        _window.on('close', (event) => {
          if (_window) {
            // Cancel the close, because we want to
            // allow the JET side to do stuff (like
            // attempt to save a "dirty" form) before
            // closing.
            event.preventDefault();
            // 1. Send notification to JET side saying
            //    that the app is closing.
            _window.webContents.send('start-app-quit');
            // 2. Write out the auto-prefs.json file.
            AutoPrefs.write();
          }
        });
      }

      AutoPrefs.read(userDataPath);
      AutoPrefs.set({
        version: params.version,
        location: (process.env.APPIMAGE ? process.env.APPIMAGE : exePath)
      });

      _params = params;

      _window = createBrowserWindow(title, AutoPrefs.get('width'), AutoPrefs.get('height'));
      _window.webContents.session.clearCache();

      _window.on('resize', () => {
        AutoPrefs.set({width: _window.getSize()[0], height: _window.getSize()[1]});
        AutoPrefs.write();
      });

      setOnWindowCloseListener();

      return _window;
    },
    load: (cbeUrl) => {
      if (_window) _window.loadURL(cbeUrl);
    },
    destroy: () => {
      // Set module-scoped window variable to null, so
      // the check in the 'close' event handler, won't
      // do an event.preventDefault().
      _window = null;
      // Calling app.quit() will generate another 'close'
      // event, but the app will exit because the module-scoped
      // window variable has been set to null.
      app.quit();
    },
    /**
     * Enable or disable submenu items of an application menu item
     * @param {[{id: string, state: boolean}]} items
     * @example
     *  setAppSubmenuItemsState([{id: 'newProject', state: false}]);
     *
     *    or
     *
     *  setAppSubmenuItemsState([{id: 'newProject', state: false},{id: 'nameProject', true}]);
     */
    setAppSubmenuItemsState: (items) => {
      if (Menu.getApplicationMenu()) {
        let submenuItem;
        for (const item of items) {
          // Get the array of submenu items for the submenu
          // name (e.g. "deleteMenu") specified in item.id
          submenuItem = Menu.getApplicationMenu().getMenuItemById(item.id);
          if (CoreUtils.isNotUndefinedNorNull(submenuItem)) {
            if (CoreUtils.isNotUndefinedNorNull(submenuItem.submenu) && submenuItem.submenu.items.length > 0) {
              // See https://github.com/electron/electron/issues/3416
              for (const item1 of submenuItem.submenu.items) {
                // Only change the state if it's currently
                // different than the value of item.state.
                if (item1.enabled !== item.state) {
                  item1.enabled = item.state;
                }
              }
            }
            else if (submenuItem.enabled !== item.state) {
              // There are no sub-submenu items, so just set
              // the state of the submenu.
              submenuItem.enabled = item.state;
            }
          }
        }
      }
    },
    renderAppMenu: () => {
      app.setAboutPanelOptions({
        applicationName: _params.productName,
        applicationVersion: _params.version,
        copyright: _params.copyright,
        version: _params.version,
        website: _params.homepage
      });

      generateAppMenu();
    },
    showJavaProcessErrorMessageBox: (title, message, buttons) => {
      if (_window) {
        dialog.showMessageBoxSync(_window, {
          title: title,
          buttons: buttons,
          type: "error",
          message: message,
        });
      }
    },
    showFailureStartingMessageBox: (title, message, buttons) => {
      if (_window) {
        dialog.showMessageBoxSync(_window, {
          title: title,
          buttons: buttons,
          type: 'error',
          message: message
        });
      }
    },
    showFileCreatingSaveDialog: async (dialogParams) => {
      if (_window) {
        return dialog.showSaveDialog(_window, dialogParams);
      }
      else {
        return Promise.resolve({canceled: true});
      }
    },
    showFileReadingOpenDialog: async (dialogParams) => {
      if (_window) {
        return dialog.showOpenDialog(_window, dialogParams);
      }
      else {
        return Promise.reject(Error('_window variable is undefined, which implies that either AppWindow.initialize() was not called, or an error happened when it was called. Check the JS console or log.'));
      }
    },
    showFileChoosingOpenDialog: async (dialogParams) => {
      if (_window) {
        return dialog.showOpenDialog(_window, dialogParams);
      }
      else {
        return Promise.reject(Error('_window variable is undefined, which implies that either AppWindow.initialize() was not called, or an error happened when it was called. Check the JS console or log.'));
      }
    }

  };

})();

module.exports = WindowManagement;