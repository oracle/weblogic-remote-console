/**
 * @license
 * Copyright (c) 2022, 2024, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

const fs = require('fs');
const OSUtils = require('./os-utils');
const { execFile } = require('child_process');
const I18NUtils = require('./i18n-utils');
const UserPrefs = require('./user-prefs-json');
const SettingsEditor = require('./settings-editor');
var supportsAutoUpgrades = false;
var findString = '';

/**
 * See {@link https://stackabuse.com/javascripts-immediately-invoked-function-expressions/}
 * @type {{showFileChoosingOpenDialog, showFailureStartingDialog, renderAppMenu, showFileReadingOpenDialog, showJavaProcessErrorDialog, destroy, showFileCreatingSaveDialog, initialize, notifyState}}
 */
const WindowManagement = (() => {
  const path = require('path');
  
  const {app, BrowserWindow, Menu, dialog, shell} = require('electron');
  const prompt = require('electron-prompt');
  
  const ConfigJSON = require('./config-json');
  const ProjectManager = require('./project-management');
  const AutoUpdateUtils = require('./auto-update-utils');
  const CoreUtils = require('./core-utils');
  const OSUtils = require('./os-utils');
  // Declare variable for IIFE class used to manage data
  // persisted in the auto-prefs.json file
  const AutoPrefs = require('./auto-prefs-json');
  
  let _window;
  let _params;
  let newVersion;
  let downloadURL = 'https://github.com/oracle/weblogic-remote-console/releases';
  
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
        label: `&${I18NUtils.get('wrc-electron.menus.file.label')}`,
        role: 'fileMenu',
        // Specify empty array for submenu, because the menu items
        // are created in populateFileMenu(appMenuTemplate).
        submenu: []
      },
      {
        label: `&${I18NUtils.get('wrc-electron.menus.edit.label')}`,
        role: 'editMenu',
        submenu: [
          {
            label: `${I18NUtils.get('wrc-electron.menus.edit.undo.label')}`,
            accelerator: 'CommandOrControl+Z',
            role: 'undo'
          },
          {
            label: `${I18NUtils.get('wrc-electron.menus.edit.redo.label')}`,
            accelerator: 'Shift+CommandOrControl+Z',
            role: 'redo'
          },
          {
            type: 'separator'
          },
          {
            label: `${I18NUtils.get('wrc-electron.menus.edit.cut.label')}`,
            accelerator: 'CommandOrControl+X',
            role: 'cut'
          },
          {
            label: `${I18NUtils.get('wrc-electron.menus.edit.copy.label')}`,
            accelerator: 'CommandOrControl+C',
            role: 'copy'
          },
          {
            label: `${I18NUtils.get('wrc-electron.menus.edit.paste.label')}`,
            accelerator: 'CommandOrControl+V',
            role: 'paste'
          },
          {
            label: `${I18NUtils.get('wrc-electron.menus.edit.select-all.label')}`,
            accelerator: 'CommandOrControl+A',
            role: 'selectall'
          },
          {
            label: `${I18NUtils.get('wrc-electron.menus.edit.find.label')}`,
            accelerator: 'CommandOrControl+F',
            click(item) {
              prompt({
                title: `${I18NUtils.get('wrc-electron.menus.edit.find.prompt.title')}`,
                label: '',
                buttonLabels: { ok: `${I18NUtils.get('wrc-electron.menus.edit.find.prompt.button')}` },
                value: `${findString}`,
                resizable: true,
                alwaysOnTop: true
              }).then(string => {
                if (string != null) {
                  findString = string;
                  if (string == '')
                    _window.webContents.stopFindInPage('clearSelection');
                  else
                    _window.webContents.findInPage(string, { findNext: true });
                }
                else
                  _window.webContents.stopFindInPage('clearSelection');
              });
            }
          },
          {
            label: `${I18NUtils.get('wrc-electron.menus.edit.find-next.label')}`,
            accelerator: 'CommandOrControl+G',
            click(item) {
              _window.webContents.findInPage(findString, { findNext: true });
            }
          }
        ]
      },
      {
        id: 'view',
        label: `${OSUtils.isWinOS() ? '&' : ''}${I18NUtils.get('wrc-electron.menus.view.label')}`,
        role: 'viewMenu',
        submenu: [
          {
            label: `${I18NUtils.get('wrc-electron.menus.view.reload.label')}`,
            id: 'reload',
            role: 'reload'
          },
          // The 'forceReload' menu item causes Electron to create
          // a new Browser Window, so DON'T INCLUDE IT!!
          { type: 'separator' },
          {
            label: `${I18NUtils.get('wrc-electron.menus.view.resetZoom.label')}`,
            role: 'resetZoom',
            enabled: false
          },
          {
            label: `${I18NUtils.get('wrc-electron.menus.view.zoomIn.label')}`,
            role: 'zoomIn',
            enabled: false
          },
          {
            label: `${I18NUtils.get('wrc-electron.menus.view.zoomOut.label')}`,
            role: 'zoomOut',
            enabled: false
          },
          {
            type: 'separator'
          },
          {
            label: `${I18NUtils.get('wrc-electron.menus.view.togglefullscreen.label')}`,
            role: 'togglefullscreen'
          }
        ]
      },
      {
        // Provide an id field, so we can use Array.find() to
        // locate the "Help" menu within appMenuTemplate.
        id: 'help',
        label: `&${I18NUtils.get('wrc-electron.menus.help.label')}`,
        role: 'help',
        // Specify empty array for submenu, because the menu items
        // are created in populateHelpMenu(appMenuTemplate).
        submenu: []
      }
    ];
    
    populateFileMenu(appMenuTemplate);
    populateHelpMenu(appMenuTemplate);
    maybeAddUpdateMenu(appMenuTemplate);
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
     * A closure that creates the "New Window" submenu item, under the "File" menu
     * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures}
     */
    function createNewWindowSubmenu() {
      fileMenu.submenu.push({
        id: 'newWindow',
        accelerator: 'CommandOrControl+N',
        label: `${I18NUtils.get('wrc-electron.menus.file.newWindow.value')}`,
        click(item) {
          const runme = (process.env.APPIMAGE && fs.existsSync(process.env.APPIMAGE)) ?
            process.env.APPIMAGE :
            app.getPath('exe');
          execFile(runme);
        }
      });
    }
    /**
     * A closure that creates the "New Project" submenu item, under the "File" menu
     * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures}
     */
    function createNewProjectSubmenu() {
      fileMenu.submenu.push({
        id: 'newProject',
        label: `${I18NUtils.get('wrc-electron.menus.file.newProject.value')}`,
        click(item) {
          prompt({
            title: `${I18NUtils.get('wrc-electron.prompt.file.newProject.title')}`,
            label: `${I18NUtils.get('wrc-electron.prompt.file.newProject.label')}`,
            inputAttrs: { required: true },
            resizable: true,
            alwaysOnTop: true
          })
            .then(name => {
              const results = ProjectManager.addNewProject(name);
              if (results.succeeded) {
                current_project = results.current_project;
                generateAppMenu();
                _window.webContents.send('on-project-switched', {action: 'create', from: results.previous_project, to: results.current_project});
              }
              else {
                switch(results.resultReason) {
                  case ProjectManager.ResultReason.ALREADY_EXISTS:
                    showPopupMessage({
                      title: `${I18NUtils.get('wrc-electron.prompt.file.newProject.already-exists-error.title')}`,
                      severity: 'warning',
                      details: `${I18NUtils.get('wrc-electron.prompt.file.newProject.already-exists-error.detail', name)}`
                    });
                    break;
                  case ProjectManager.ResultReason.CANNOT_BE_NULL:
                    break;
                }
              }
            })
            .catch(err => {
              Promise.reject(new Error('Failed to create project'));
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
                _window.webContents.send('on-project-switched', {action: 'select', from: results.previous_project, to: results.current_project});
              }
            }
          });
        }
        
        fileMenu.submenu.push({
          id: 'switchToProject',
          label: `${I18NUtils.get('wrc-electron.menus.file.switchToProject.value')}`,
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
              _window.webContents.send('on-project-switched', {action: 'navigate', from: results.deleted_project, to: results.current_project});
              generateAppMenu();
            }
          }
        });
      }
      
      fileMenu.submenu.push({
        id: 'deleteProject',
        label: `${I18NUtils.get('wrc-electron.menus.file.deleteProject.value')}`,
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
        attr['label'] = I18NUtils.get('wrc-electron.menus.file.nameProject.value');
        attr['prompt'] = {
          title: `${I18NUtils.get('wrc-electron.prompt.file.nameProject.title')}`,
          label: `${I18NUtils.get('wrc-electron.prompt.file.nameProject.label')}`,
          value: null
        };
      }
      else {
        attr['label'] = I18NUtils.get('wrc-electron.menus.file.renameProject.value', current_project.name);
        attr['prompt'] = {
          title: `${I18NUtils.get('wrc-electron.prompt.file.renameProject.title', current_project.name)}`,
          label: `${I18NUtils.get('wrc-electron.prompt.file.renameProject.label')}`,
          value: current_project.name
        };
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
                _window.webContents.send('on-project-switched', {action: 'rename', from: results.renamed_project, to: results.current_project});
                generateAppMenu();
              }
              else {
                switch(results.resultReason) {
                  case ProjectManager.ResultReason.ALREADY_EXISTS:
                    showPopupMessage({title: 'Project Already Exist', severity: 'warning', details: `A project named "${name}" already exists!`});
                    break;
                  case ProjectManager.ResultReason.NAME_NOT_CHANGED:
                  case ProjectManager.ResultReason.CANNOT_BE_NULL:
                    break;
                }
              }
            })
            .catch(err => {
              Promise.reject(new Error('Failed to create project'));
            });
        }
      });
    }
    
    // Get 'File' menu from application menu
    const fileMenu = appMenuTemplate.find(item => item.id === 'file');
    // Declare function-scoped reference to the current project
    let current_project = ProjectManager.getCurrentProject();
    
    createNewWindowSubmenu();
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
    
    // Add "Check for Updates" menu item only if it is supported and
    // we haven't already determined that there is a new version.
    if (_params.supportsUpgradeCheck &&
      (!newVersion || (newVersion === _params.version))) {
      helpMenu.submenu.push(
        {
          id: 'checkForUpdates',
          label: `${I18NUtils.get('wrc-electron.menus.help.checkForUpdates.value', _params.productName)}`,
          click() {
            AutoUpdateUtils.checkForUpdates()
              .then(result => {
                if (result.versionInfo?.version)
                  newVersion = result.versionInfo.version;
                if (newVersion === _params.version) {
                  showOnLatestVersionMessageBox(
                    `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.alreadyOnCurrent.title')}`,
                    `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.alreadyOnCurrent.message', newVersion)}`,
                    [`${I18NUtils.get('wrc-common.buttons.ok.label')}`]
                  );
                }
                else {
                  if (supportsAutoUpgrades) {
                    showNewerVersionAvailableMessageBox(
                      `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.newVersionAvailable.title')}`,
                      `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.newVersionAvailable.message', new URL(downloadURL).host, AutoUpdateUtils.getVersion())}`,
                      [
                        `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.button.gotosite.value')}`,
                        `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.button.download-and-install.value', AutoUpdateUtils.getVersion())}`,
                        `${I18NUtils.get('wrc-common.buttons.cancel.label')}`
                      ]
                    )
                      .then((choice) => {
                        if (choice.response === 0)
                          shell.openExternal(downloadURL).then();
                        else if (choice.response === 1)
                          AutoUpdateUtils.doUpdate(_window);
                      });
                  }
                  else {
                    showNewerVersionAvailableMessageBox(
                      `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.newVersionAvailable.title')}`,
                      `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.newVersionAvailable.message', new URL(downloadURL).host, AutoUpdateUtils.getVersion())}`,
                      [
                        `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.button.gotosite.value')}`,
                        `${I18NUtils.get('wrc-common.buttons.cancel.label')}`
                      ]
                    )
                      .then((choice) => {
                        if (choice.response === 0)
                          shell.openExternal(downloadURL).then();
                      });
                  }
                }
              })
              .catch(err => {
                showConnectionIssueMessageBox(
                  `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.connectionIssue.title')}`,
                  `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.connectionIssue.message')}`,
                    [`${I18NUtils.get('wrc-common.buttons.ok.label')}`]
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
        label: `${I18NUtils.get('wrc-electron.menus.help.visit.value', _params.productName)}`,
        click() {
          shell.openExternal('https://github.com/oracle/weblogic-remote-console').then();
        }
      },
      { type: 'separator' },
      {
        label: `${I18NUtils.get('wrc-electron.menus.help.toggleDevTools.label')}`,
        role: 'toggleDevTools'
      }
    ];
    
    // Concatenate additional submenu items to helpMenu.
    helpMenu.submenu = [].concat(helpMenu.submenu, helpSubmenu);
  }
  
  /**
   * Populate the update section if there is an update to be had
   * @param {[Menu]} appMenuTemplate
   * @private
   */
  function maybeAddUpdateMenu(appMenuTemplate) {
    if (!newVersion || (newVersion === _params.version))
      return;
    const submenu = [
      {
        label: `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.newVersionAvailable.message', new URL(downloadURL).host, newVersion)}`,
        click() {
          shell.openExternal(downloadURL).then();
        }
      }
    ];
    // For now, the Mac auto-update isn't working, so just don't offer it
    if (supportsAutoUpgrades) {
      submenu.push({
          label: `${I18NUtils.get('wrc-electron.dialog.help.checkForUpdates.button.download-and-install.value', newVersion)}`,
          click() {
            AutoUpdateUtils.doUpdate(_window);
          }
        }
      );
    }
    appMenuTemplate.push(
      {
        label: `${I18NUtils.get('wrc-electron.menus.updates.value')}`,
        submenu: submenu
      }
    );
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
            label: `${I18NUtils.get('wrc-electron.menus.app.about.value', _params.productName)}`,
            role: 'about',
            click() {
              app.showAboutPanel();
            }
          },
          {
            type: 'separator'
          },
          {
            id: 'settings',
            label: `${I18NUtils.get('wrc-electron.menus.file.settings.value')}`,
            click() {
              SettingsEditor.show(_window);
            }
          },
          {
            id: 'preferences',
            // The Mac doesn't like "Preferences" so we change it to
            // "Application Preferences" just for Mac
            label: `${I18NUtils.get('wrc-electron.menus.file.preferences.mac.value')}`,
            click() {
              UserPrefs.show();
            }
          },
          {
            type: 'separator'
          },
          {
            id: 'services',
            label: `${I18NUtils.get('wrc-electron.menus.app.services.value')}`,
            role: 'services',
          },
          {
            type: 'separator'
          },
          {
            id: 'hide',
            label: `${I18NUtils.get('wrc-electron.menus.app.hide.value', _params.productName)}`,
            accelerator: 'Command+H',
            role: 'hide'
          },
          {
            id: 'hideOthers',
            label: `${I18NUtils.get('wrc-electron.menus.app.hide-others.value')}`,
            accelerator: 'Command+Alt+H',
            role: 'hideothers'
          },
          {
            id: 'showAll',
            label: `${I18NUtils.get('wrc-electron.menus.app.show-all.value')}`,
            role: 'unhide'
          },
          {
            type: 'separator'
          },
          {
            id: 'exit',
            label: `${I18NUtils.get('wrc-electron.menus.app.quit.value', _params.productName)}`,
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
          id: 'settings',
          label: `${I18NUtils.get('wrc-electron.menus.file.settings.value')}`,
          click() {
            SettingsEditor.show(_window);
          }
        },
        {
          id: 'preferences',
          label: `${I18NUtils.get('wrc-electron.menus.file.preferences.value')}`,
          click() {
            UserPrefs.show();
          }
        },
        {
          type: 'separator'
        },
        {
          id: 'exit',
          label: `${I18NUtils.get('wrc-electron.menus.app.quit.value', _params.productName)}`,
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
          label: `${I18NUtils.get('wrc-electron.menus.app.about.value', _params.productName)}`,
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
      buttons: [`${I18NUtils.get('wrc-electron.common.dismiss')}`],
      type: message.severity,
      message: message.details,
    }).then();
  }
  
  return {
    /**
     * @param {string} title
     * @param {{version: string, productName: string, copyright: string, homepage: string, supportsUpgradeCheck: boolean, supportsAutoUpgrades: boolean}} params
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
        location: (
          (process.env.APPIMAGE && fs.existsSync(process.env.APPIMAGE)) ?
            process.env.APPIMAGE :
            exePath
        )
      });
      
      _params = params;
      
      if (params.feedURL)
        downloadURL = params.feedURL;
      
      if (_params.supportsUpgradeCheck) {
        AutoUpdateUtils.checkForUpdates()
          .then(result => {
            newVersion = (result !== null ? result.versionInfo.version : null);
            if (newVersion !== _params.version) {
              if (_window) generateAppMenu()
            }
          });
      }
      supportsAutoUpgrades = _params.supportsAutoUpgrades;
      
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
     *  notifyState([{id: 'newProject', state: false}]);
     *
     *    or
     *
     *  notifyState([{id: 'newProject', state: false},{id: 'nameProject', true}]);
     */
    notifyState: (state) => {
      if (Menu.getApplicationMenu()) {
        const items =  [
          {id: 'newProject', state: state},
          {id: 'switchToProject', state: state},
          {id: 'deleteProject', state: state},
          {id: 'nameProject', state: state},
          {id: 'reload', state: state}
        ];
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
          type: 'error',
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
    },
    showMainWindow: () => {
      if (_window) {
        if (_window.isMinimized()) _window.restore();
        _window.focus();
      }
    },
    openExternalURL: (url) => {
      // open url in a browser and prevent default
      shell.openExternal(url);
      return { action: 'deny' };
    }
  };
  
})();

module.exports = WindowManagement;
