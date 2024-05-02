/**
 * @license
 * Copyright (c) 2023, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
    'ojs/ojcore',
    'knockout',
    './app-menu-dialog',
    'wrc-frontend/microservices/app-menu/app-menu-manager',
    'wrc-frontend/common/keyup-focuser',
    'wrc-frontend/common/dialog-fields',
    'wrc-frontend/integration/viewModels/content-area/body/table-clipboard',
    'wrc-frontend/integration/viewModels/utils',
    'wrc-frontend/apis/message-displaying',
    'wrc-frontend/core/runtime',
    'wrc-frontend/core/utils',
    'ojs/ojknockout',
    'ojs/ojmodule-element',
    'ojs/ojmodule',
    'ojs/ojmenu',
    'ojs/ojoption'
  ],
  function(
    oj,
    ko,
    AppMenuDialog,
    AppMenuManager,
    KeyUpFocuser,
    DialogFields,
    TableClipboard,
    ViewModelUtils,
    MessageDisplaying,
    Runtime,
    CoreUtils
  ) {
    function AppMenuTemplate(viewParams) {
      const self = this;
      
      this.i18n = {
        icons: {
          wrcApp: {
            iconFile: ko.observable('wrc-app-icon-color_88x78'), disabled: !Runtime.getProperty('features.appMenu.disabled'),
            tooltip: oj.Translations.getTranslatedString('wrc-header.text.appName')
          },
          appMenu: {
            iconFile: 'app-menu-icon-wht_24x24', disabled: Runtime.getProperty('features.appMenu.disabled'),
            tooltip: ko.observable('Show App Menu')
          }
        },
        'buttons': {
          'ok': {
            disabled: ko.observable(false),
            'label': ko.observable(oj.Translations.getTranslatedString('wrc-common.buttons.ok.label'))
          },
          'cancel': {
            disabled: false,
            'label': oj.Translations.getTranslatedString('wrc-common.buttons.cancel.label')
          }
        },
        dialog: {
          'title': ko.observable(''),
          'instructions': ko.observable(''),
          'nameLabel': ko.observable(''),
          'fileLabel': ko.observable(''),
          'iconFile': ko.observable(''),
          'tooltip': ko.observable(''),
          about: {
            title: `About ${oj.Translations.getTranslatedString('wrc-header.text.appName')}`,
            name: oj.Translations.getTranslatedString('wrc-header.text.appName'),
            version: {value: Runtime.getProperty(Runtime.PropertyName.CFE_VERSION)},
            copyrightLegal: oj.Translations.getTranslatedString('wrc-footer.text.copyrightLegal')
          }
        }
      };
      
      this.dialogFields = ko.observable({file: ''});
      this.menus = ko.observableArray();
      
      this.signalBindings = [];
      
      this.connected = function () {
        let binding = viewParams.signaling.ancillaryContentItemToggled.add((source, changedState) => {
          if (changedState.state === 'opened') closeAppMenuPopup('app-menu-popup');
        });
        
        this.signalBindings.push(binding);
        
        binding = viewParams.signaling.appMenuActionTriggered.add((source, actionKey = null) => {
          const supportedActions = ['resetWindow'];
          if (actionKey) {
            const index = supportedActions.indexOf(actionKey);
            if (index !== -1) {
              self.menuItemAction({detail: {selectedValue: supportedActions[index]}});
            }
          }
        });
        
        this.signalBindings.push(binding);
        
        binding = viewParams.signaling.appMenuChangeRequested.add((source, type, newValue, options) => {
          if (type === 'changeLabel') {
            updateAppMenuLabel(options.menuId, options.menuItemId, newValue);
          }
          else if (['disableMenu', 'enableMenu'].includes(type)) {
            setAppMenuDisabledState(options.menuId, options.menuItemId, newValue);
          }
        });
        
        this.signalBindings.push(binding);
        
        binding = viewParams.signaling.dataProviderSelected.add((dataProvider) => {
          self.canExitCallback = undefined;
        });
        
        this.signalBindings.push(binding);
        
        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          self.canExitCallback = undefined;
        });
        
        this.signalBindings.push(binding);
        
        binding = viewParams.signaling.unsavedChangesDetected.add((exitFormCallback) => {
          self.canExitCallback = exitFormCallback;
        });
        
        this.signalBindings.push(binding);
        
        if (!Runtime.getProperty('features.appMenu.disabled')) {
          AppMenuManager.getAppMenu()
            .then(reply => {
              createAppMenuObservables(reply.body.data);
              this.menus(reply.body.data.appMenu);
              setAppMenuIconDisabledState(false);
            })
            .catch(response => {
              if (CoreUtils.isNotUndefinedNorNull(response.failure)) {
                ViewModelUtils.failureResponseDefaultHandling(response.failure);
              }
              else {
                ViewModelUtils.failureResponseDefaultHandling(response);
              }
            });
        }

//MLW        const platform = ViewModelUtils.detectOS();
      }.bind(this);
      
      this.disconnected = function () {
        // Detach all signal "add" bindings
        self.signalBindings.forEach(binding => {
          binding.detach();
        });
        
        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];
      }.bind(this);
      
      // FortifyIssueSuppression Key Management: Empty Encryption Key
      // This is a key on the keyboard, not security key
      this.onOjFocus = (event) => {
        function registerKeyUpFocusers() {
          const registerAppMenuLauncherKeyUpFocuser = (id) => {
            let result = KeyUpFocuser.getKeyUpCallback(id);
            
            if (!result.alreadyRegistered) {
              const options = {
                focusItems: self.menus().map(({id}) => id)
              };
              
              result = KeyUpFocuser.register(
                id,
                {
                  '/': {key: '/', action: 'click', indexValue: 0, callback: onKeyUpFocuserShortcutKeyEvent},
                  f: {key: 'f', action: 'click', indexValue: 1, callback: onKeyUpFocuserShortcutKeyEvent},
                  e: {key: 'e', action: 'click', indexValue: 2, callback: onKeyUpFocuserShortcutKeyEvent},
                  v: {key: 'v', action: 'click', indexValue: 3, callback: onKeyUpFocuserShortcutKeyEvent},
                  g: {key: 'g', action: 'click', indexValue: 4, callback: onKeyUpFocuserShortcutKeyEvent},
                  s: {key: 's', action: 'click', indexValue: 5, callback: onKeyUpFocuserShortcutKeyEvent},
                  t: {key: 't', action: 'click', indexValue: 6, callback: onKeyUpFocuserShortcutKeyEvent},
                  w: {key: 'w', action: 'click', indexValue: 7, callback: onKeyUpFocuserShortcutKeyEvent},
                  h: {key: 'h', action: 'click', indexValue: 8, callback: onKeyUpFocuserShortcutKeyEvent},
                  Tab: {key: 'Shift+Tab', action: 'navigate', callback: onKeyUpFocuserNavigateKeyEvent},
                  ArrowRight: {key: 'ArrowRight', action: 'navigate', callback: onKeyUpFocuserNavigateKeyEvent},
                  ArrowLeft: {key: 'ArrowLeft', action: 'navigate', callback: onKeyUpFocuserNavigateKeyEvent}
                },
                options
              );
            }
            
            return result.keyUpCallback;
          };
          
          const registerAppMenuKeyUpFocuser = (id) => {
            let result = KeyUpFocuser.getKeyUpCallback(id);
            
            if (!result.alreadyRegistered) {
              const options = {
                focusItems: self.menus().map(({id}) => id)
              };
              
              result = KeyUpFocuser.register(
                id,
                {},
/*
//MLW
                {
                  ArrowRight: {key: 'ArrowRight', action: 'click'},
                  ArrowLeft: {key: 'ArrowLeft', action: 'click'}
                },
 */
                options
              );
            }
            
            return result.keyUpCallback;
          };
          
          let nodeList = document.querySelectorAll('.cfe-app-menu-popup-body > oj-menu');
          
          if (nodeList !== null) {
            nodeList.forEach((node) => {
              node.onkeyup = registerAppMenuKeyUpFocuser('.cfe-app-menu-launcher');
            });
          }
          
          nodeList = document.querySelectorAll('.cfe-app-menu-popup-body > a');
          
          if (nodeList !== null) {
            nodeList.forEach((node) => {
              node.onkeyup = registerAppMenuLauncherKeyUpFocuser('.cfe-app-menu-shortcut');
            });
          }
          
        }
        
        event.preventDefault();
        
        registerKeyUpFocusers();
        
        setAppMenuDisabledVariable(self.menus().find(menu => menu.id === 'tableMenu'), 'tableMenu', (document.querySelector('.cfe-table') === null));
        
        focusAppMenuLauncher('appMenuLauncher');
      };
      
      // FortifyIssueSuppression Key Management: Empty Encryption Key
      // This is a key on the keyboard, not security key
      this.onOjBeforeClose = (event) => {
        const rule = KeyUpFocuser.getLastExecutedRule('.cfe-app-menu-shortcut');
        if (rule.key !== null) {
          if (rule.key !== 'Tab') event.preventDefault();
          // FortifyIssueSuppression Key Management: Null Encryption Key
          // This is a key on the keyboard, not a security key
          KeyUpFocuser.setLastExecutedRule('.cfe-app-menu-shortcut', {focusIndexValue: rule.focusIndexValue, key: null});
          $('#app-menu-close-icon').focus();
        }
        
        const nodeList = document.querySelectorAll('a[data-state="selected"].cfe-app-menu-launcher');
        if (nodeList !== null) {
          nodeList.forEach((node) => {
            node.setAttribute('data-state', 'unset');
          });
        }
      };
      
      this.onBlurCloseIcon = (event) => {
        if (event.relatedTarget !== null) {
          if (event.relatedTarget.id === 'helpMenuLauncher') {
            selectAppMenuLauncher('appMenuLauncher');
            KeyUpFocuser.setLastExecutedRule('.cfe-app-menu-launcher', {focusIndexValue: 0, key: 'RightArrow'});
          }
          else if (event.relatedTarget.localName.toLowerCase() === 'a') {
//MLW            KeyUpFocuser.setLastExecutedRule('.cfe-app-menu-shortcut', {focusIndexValue: 0, key: 'Tab', shiftKey: true});
            // FortifyIssueSuppression Key Management: Null Encryption Key
            // This is a key on the keyboard, not a security key
            KeyUpFocuser.setLastExecutedRule('.cfe-app-menu-shortcut', {key: null});
            const launcherId = event.relatedTarget.attributes['aria-labelledby'];
            if (CoreUtils.isNotUndefinedNorNull(launcherId)) {
              selectAppMenuLauncher(launcherId.value);
            }
          }
        }
      };
      
      this.isElectronApiAvailable = () => {
        return ViewModelUtils.isElectronApiAvailable();
      };
      
      this.menuItemAction = (event) => {
        event.preventDefault();
        closeAppMenuPopup('app-menu-popup');
        
        const action = event.detail.selectedValue;
        
        const actionsMap = {
          'about': {callback: appMenuAction, options: {}},
          'settings': {callback: appMenuAction, options: {}},
          'preferences': {callback: appMenuAction, options: {}},
          'resetWindow': {callback: windowMenuAction, options: {}},
/*
//MLW
          'copyText': {callback: copyTableMenuAction, options: {event: event, selector: 'oj-table.cfe-table'}},
          'copyJSON': {callback: copyTableMenuAction, options: {event: event, selector: 'oj-table.cfe-table'}},
          'copyYAML': {callback: copyTableMenuAction, options: {event: event, selector: 'oj-table.cfe-table'}},
          'exportAsText': {callback: exportTableAsMenuAction, options: {event: event, selector: 'oj-table.cfe-table'}},
          'exportAsJSON': {callback: exportTableAsMenuAction, options: {event: event, selector: 'oj-table.cfe-table'}},
          'exportAsYAML': {callback: exportTableAsMenuAction, options: {event: event, selector: 'oj-table.cfe-table'}},
*/
          'selectAll': {callback: editMenuAction, options: {event: event}},
          'startUpTask': {callback: goMenuAction, options: {chooser: Runtime.getStartupTaskChooser()}},
          'providersDrawer': {callback: goMenuAction, options: {selector: '#provider-management-iconbar-icon'}},
          'tipsDrawer': {callback: helpMenuAction, options: {selector: '#tips-iconbar-icon'}},
          'shoppingCartDrawer': {callback: goMenuAction, options: {event: event}},
          'toggleFullScreen': {callback: viewMenuAction, options: {event: event}},
          'customizeTable': {callback: tableMenuAction, options: {selector: '#customize'}},
          'newWindow': {callback: fileMenuAction, options: {}},
          'load-project': {callback: projectsMenuAction, options: {startupTask: action}},
          'export-all-to-project': {callback: projectsMenuAction, options: {startupTask: action}},
          'add-domain-connection': {callback: providersMenuAction, options: {startupTask: action}},
          'add-existing-wdt-model': {callback: providersMenuAction, options: {startupTask: action}},
          'add-wdt-composite': {callback: providersMenuAction, options: {startupTask: action}},
          'add-existing-property-list': {callback: providersMenuAction, options: {startupTask: action}},
          'add-new-wdt-model': {callback: providersMenuAction, options: {startupTask: action}},
          'add-new-property-list': {callback: providersMenuAction, options: {startupTask: action}},
          'visitGithubProject': {
            callback: helpMenuAction,
            options: {url: 'https://github.com/oracle/weblogic-remote-console'}
          },
          'developerTools': {
            callback: helpMenuAction,
            options: {keyCode: 73, type: 'down', modifiers: {altKey: true, metaKey: true}}
          },
          'closeWindow': {callback: fileMenuAction, options: {}}
        };
        
        if (CoreUtils.isNotUndefinedNorNull(actionsMap[action])) {
          actionsMap[action].callback(action, actionsMap[action].options);
        } else {
          closeAppMenuPopup();
          console.log(`[APP-MENU] action=${action}`);
        }
      };
      
      this.launchMenu = (event) => {
        function getFocusIndexValue(launcherId) {
          let index = 0;
          if (CoreUtils.isNotUndefinedNorNull(launcherId)) {
            index = self.menus().map(item => item.launcher).indexOf(launcherId);
          }
          return index;
        }
        
        function getLauncherMenu(currentTarget, previousLauncher) {
          let index = getFocusIndexValue(currentTarget.id);
          if (index === -1) index = 0;
          KeyUpFocuser.setLastExecutedRule('.cfe-app-menu-launcher', {focusIndexValue: index, key: 'Enter'});
          const launcher = document.getElementById(self.menus()[index].launcher);
          if (launcher !== null) launcher.setAttribute('data-state', 'selected');
          const menuId = self.menus()[index].id;
          return document.getElementById(menuId);
        }
        
        const previousLauncher = unselectAppMenuLauncher(event.currentTarget);
        const launcherMenu = getLauncherMenu(event.currentTarget, previousLauncher);
        launcherMenu.open(event);
      };
      
      this.closeIconClickHandler = (event) => {
        event.preventDefault();
        closeAppMenuPopup('app-menu-popup');
      };
      
      this.appMenuIconClickHandler = (event) => {
        event.preventDefault();
        // Close any ancillary content drawer that is open
        viewParams.signaling.ancillaryContentItemCleared.dispatch('app-menu');
        viewParams.signaling.appProfileActionTriggered.dispatch('app-menu', 'closeAppProfile');
        if (self.i18n.icons.wrcApp.disabled) return false;
        openAppMenuPopup('app-menu-popup', '#wrc-app-menu-icon');
      };
      
      function setAppMenuDisabledState(menuId, menuItemId, state) {
        let menuItem = {};
        const filtered = self.menus().filter(item => item.id === menuId);
        findAppMenuItem(filtered, menuItemId, menuItem);
        if (CoreUtils.isNotUndefinedNorNull(menuItem.value)) {
          menuItem.value.disabled(state);
        }
      }
      
      function setAppMenuDisabledVariable(appMenu, target, state, searchScope = 'global') {
        function performSubMenuItemsDisablement(subMenuItems, state, searchScope) {
          if (CoreUtils.isNotUndefinedNorNull(subMenuItems)) {
            for (const subMenuItem of subMenuItems) {
              if (CoreUtils.isNotUndefinedNorNull(subMenuItem.disabled)) {
                if (searchScope === 'global' || appMenu.id === target) {
                  subMenuItem.disabled(state);
                }
              }
            }
          }
        }
        
        function performSubMenuDisablement(subMenu, state, searchScope) {
          if (CoreUtils.isNotUndefinedNorNull(subMenu)) {
            for (const menu of subMenu) {
              performSubMenuItemsDisablement(menu.subMenuItems, state, searchScope);
            }
          }
        }
        
        function performMenuItemsDisablement(menuItems, state, searchScope) {
          if (CoreUtils.isNotUndefinedNorNull(menuItems)) {
            for (const menuItem of menuItems) {
              if (CoreUtils.isNotUndefinedNorNull(menuItem.disabled)) {
                if (searchScope === 'global' || appMenu.id === target) {
                  menuItem.disabled(state);
                }
              }
              performSubMenuDisablement(menuItem.subMenu, state, searchScope);
            }
          }
        }
        
        if (CoreUtils.isNotUndefinedNorNull(appMenu)) {
          if (searchScope === 'global' || appMenu.id === target) {
            appMenu.disabled(state);
          }
          performMenuItemsDisablement(appMenu.menuItems, state, searchScope);
        }
      }
      
      function isAppMenuLauncherVisible(currentTarget) {
        let rtnval = false;
        const visible = currentTarget.attributes['data-menu-visible'];
        if (CoreUtils.isNotUndefinedNorNull(visible)) {
          rtnval = visible.value;
        }
        return rtnval;
      }
      
      function isAppMenuLauncherDisabled(currentTarget) {
        let rtnval = false;
        const disabled = currentTarget.attributes['data-menu-disabled'];
        if (CoreUtils.isNotUndefinedNorNull(disabled)) {
          rtnval = disabled.value;
        }
        return rtnval;
      }
      
      function focusAppMenuLauncher(launcherId) {
        const launcher = document.getElementById(launcherId);
        if (launcher !== null) {
          launcher.focus();
        }
      }
      
      function updateAppMenuLabel(menuId, menuItemId, newValue) {
        const menuItem = document.querySelector(menuItemId);
        if (menuItem !== null) {
          menuItem.innerText = newValue;
        }
      }
      
      function selectAppMenuLauncher(launcherId) {
        const launcher = document.getElementById(launcherId);
        if (launcher !== null) {
          launcher.click();
        }
      }
      
      function unselectAppMenuLauncher(currentTarget) {
        const launcher = document.querySelector('a[data-state="selected"].cfe-app-menu-launcher');
        if (launcher !== null) launcher.setAttribute('data-state', 'unset');
//NLW        if (!isAppMenuLauncherDisabled(currentTarget)) currentTarget.setAttribute('data-state', 'selected');
        currentTarget.setAttribute('data-state', 'selected');
        return launcher;
      }
      
      function openAppMenuPopup(popupElementId, launcherSelector) {
        const popup = closeAppMenuPopup(popupElementId);
        if (popup !== null) {
          popup.open(launcherSelector);
        }
      }
      
      function closeAppMenuPopup(popupElementId = 'app-menu-popup') {
        const popup = document.getElementById(popupElementId);
        if (popup !== null) {
          if (popup.isOpen()) {
            popup.close();
          }
        }
        return popup;
      }
      
      function createAppMenuObservables(data) {
        const traverseMenuItems = (menuItems) => {
          let children = [];
          return menuItems.map((child) => {
            if (CoreUtils.isNotUndefinedNorNull(child.disabled)) {
              child.disabled = ko.observable(child.disabled);
            }
            
            if (child.menuItems) {
              children = [...child.menuItems];
              traverseMenuItems(children);
            }
            else if (child.menu) {
              children = [...child.menu];
              traverseMenuItems(children);
            }
          });
        };
        
        if (data.appMenu.length > 0) {
          traverseMenuItems(data.appMenu);
        }
      }
      
      function setAppMenuIconDisabledState(state) {
        self.i18n.icons.wrcApp.iconFile(state ? 'wrc-app-icon-gry_88x78' : 'wrc-app-icon-color_88x78');
        self.i18n.icons.wrcApp.disabled = state;
      }
      
      function onKeyUpFocuserShortcutKeyEvent(event, focusRule) {
        if (CoreUtils.isNotUndefinedNorNull(focusRule.indexValue)) {
          KeyUpFocuser.setLastExecutedRule('.cfe-app-menu-shortcut', {focusIndexValue: focusRule.indexValue, key: event.key});
          $('.cfe-app-menu-launcher')[focusRule.indexValue].click();
        }
      }
      
      function onKeyUpFocuserNavigateKeyEvent(event, focusRule) {
        const focusIndexValue = KeyUpFocuser.computeNextFocusIndexValue('.cfe-app-menu-shortcut', focusRule, event);
        if (focusIndexValue !== -1) {
          KeyUpFocuser.setLastExecutedRule('.cfe-app-menu-shortcut', {focusIndexValue: focusIndexValue, key: event.key, shiftKey: event.shiftKey});
          $('.cfe-app-menu-launcher')[focusIndexValue].focus();
        }
      }
      
      function appMenuAction(name, options) {
        if (name === 'about') {
          AppMenuDialog.showAppMenuDialog('About', options, self.i18n)
            .then(reply => {});
        }
        else if (['settings','preferences'].includes(name)) {
          closeAppMenuPopup();
          viewParams.signaling.appProfileActionTriggered.dispatch('app-menu', 'viewAppProfile', {section: name});
        }
      }
      
      function fileMenuAction(name, options) {
        if (name === 'newWindow') {
          window.open('/');
        } else if (name === 'closeWindow') {
          if (window.opener === null) {
            MessageDisplaying.displayMessage({
              severity: 'info',
              summary: 'Operation Not Allowed',
              detail: 'Cannot close windows not opened using "New Window" menu in this window.'
            }, 6000);
          } else {
            window.close();
          }
        }
      }
      
      function projectsMenuAction(name, options) {
        closeAppMenuPopup();
        viewParams.signaling.startupTaskChosen.dispatch(options.startupTask, {chooser: Runtime.getStartupTaskChooser()});
      }
      
      function providersMenuAction(name, options) {
        closeAppMenuPopup();
        viewParams.signaling.startupTaskChosen.dispatch(options.startupTask, {chooser: Runtime.getStartupTaskChooser()});
      }
      
      function editMenuAction(name, options) {
        if (name === 'selectAll') {
          console.log(`[APP-MENU] editMenuAction("${name}")`);
        }
      }
      
      function viewMenuAction(name, options) {
        if (name === 'toggleFullScreen') {
          const selector = `#${options.event.detail.selectedValue} > a > span`;
          if (document.fullscreenElement) {
            document.exitFullscreen()
              .then(() => {
                updateAppMenuLabel('viewMenu', selector, 'Enter Full Screen');
              })
              .catch(err => {
                MessageDisplaying.displayMessage({
                  severity: 'error',
                  summary: err
                });
              });
          } else {
            document.documentElement.requestFullscreen()
              .then(() => {
                updateAppMenuLabel('viewMenu', selector, 'Exit Full Screen');
              });
          }
        }
      }
      
      function goMenuAction(name, options) {
        if (name === 'shoppingCartDrawer') {
          viewParams.signaling.ancillaryContentItemSelected.dispatch('app-menu', 'shoppingcart');
        }
        else if (name === 'startUpTask') {
          viewParams.signaling.tabStripTabSelected.dispatch('app-menu', 'startup-tasks', options);
        }
      }
      
      function tableMenuAction(name, options) {
        if (name === 'customizeTable') {
          const clickable = document.querySelector(options.selector);
          if (clickable !== null) {
            clickable.click();
          }
        }
      }
      
      function windowMenuAction(name, options) {
        if (name === 'resetWindow') {
          const link = document.querySelector('#app-reset-link');
          if (link !== null) link.click();
        }
      }
      
      function helpMenuAction(name, options) {
        if (name === 'visitGithubProject') {
          window.open(options.url, '_blank', 'noopener noreferrer');
        }
        else if (name === 'tipsDrawer') {
          const clickable = document.querySelector(options.selector);
          if (clickable !== null) clickable.click();
        }
        else if (name === 'developerTools') {
          ViewModelUtils.simulateKeyPress(options.keyCode, options.type, options.modifiers);
        }
      }
      
      function findAppMenuItem(menus, menuItemId, menuItem) {
        let children = [];
        
        for (let child of menus) {
          if (child.id === menuItemId) {
            menuItem['value'] = child;
            break;
          }
          
          if (typeof menuItem.value === 'undefined') {
            if (child.menuItems) {
              children = [...children, ...child.menuItems];
              findAppMenuItem(children, menuItemId, menuItem);
            }
            
            if (child.subMenu) {
              children = [...children, ...child.subMenu];
              findAppMenuItem(children, menuItemId, menuItem);
            }
            
            if (child.subMenuItems) {
              children = [...children, ...child.subMenuItems];
              findAppMenuItem(children, menuItemId, menuItem);
            }
          }
        }
        
        return menuItem;
      }
      
      function exportTableAsMenuAction(name, options) {
        function writeContent(contents, mediaType, dialogFields) {
          const options1 = {
            filepath: dialogFields.file,
            fileContents: contents,
            mediaType: mediaType
          };
          
          ViewModelUtils.downloadFile(options1);
        }
        
        function exportContentToFile(contents, mediaType = 'plain/text', dialogParams) {
          const entryValues = new DialogFields();
          entryValues.putValue('file', self.i18n.dialog.fileLabel());
          
          self.dialogFields(entryValues);
          
          self.i18n.dialog.title(`Export As ${dialogParams.format}`);
          self.i18n.dialog.instructions('Enter file name exported file, not the path. The browser will save it to the "Download" directory specified in your browser settings. If the name contains path separators, the browser will convert them to underscore characters and treat the result as the file name.');
          self.i18n.dialog.fileLabel('File Name');
          self.i18n.buttons.ok.label(oj.Translations.getTranslatedString('wrc-common.buttons.ok.label'));
          
          AppMenuDialog.showAppMenuDialog('ExportTableAs', dialogParams, self.i18n)
            .then(reply => {
              if (reply) {
                writeContent(contents, mediaType, self.dialogFields());
              }
            });
        }
        
        const table = document.querySelector(options.selector);
        
        if (table !== null) {
          if (name === 'exportAsText') {
            const text = TableClipboard.getTableAsText(table);
            exportContentToFile(text, 'plain/text', {format: 'Text'});
          }
          else if (name === 'exportAsJSON') {
            const json = JSON.stringify(TableClipboard.contentAsJSON(table));
            exportContentToFile(json, 'application/json', {format: 'JSON'});
          }
          else if (name === 'exportAsYAML') {
            TableClipboard.getTableAsYAML(table)
              .then(yaml => {
                exportContentToFile(yaml, 'application/yaml', {format: 'YAML'});
              })
              .catch(err => {
                MessageDisplaying.displayMessage({
                  severity: 'error',
                  summary: err
                });
              });
            
          }
          
        }
      }
    }
    
    return AppMenuTemplate;
  }
);