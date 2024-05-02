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
    'ojs/ojarraydataprovider',
    'ojs/ojmodule-element-utils',
    'wrc-frontend/microservices/project-management/console-project-manager',
    'wrc-frontend/microservices/project-management/console-project',
    'wrc-frontend/microservices/provider-management/data-provider-manager',
    'wrc-frontend/microservices/provider-management/data-provider',
    './providers',
    './provider-management-dialog',
    'wrc-frontend/integration/viewModels/utils',
    'wrc-frontend/apis/message-displaying',
    'wrc-frontend/common/dialog-fields',
    'wrc-frontend/core/runtime',
    'wrc-frontend/core/utils',
    'wrc-frontend/core/types',
    'ojs/ojlogger',
    'ojs/ojknockout',
    'ojs/ojmodule-element',
    'ojs/ojmodule',
    'ojs/ojtreeview',
    'ojs/ojnavigationlist',
    'ojs/ojswitch',
    'ojs/ojcheckboxset',
    'ojs/ojradioset',
    'ojs/ojselectcombobox',
    'ojs/ojselectsingle'
  ],
  function (
    oj,
    ko,
    ArrayDataProvider,
    ModuleElementUtils,
    ConsoleProjectManager,
    ConsoleProject,
    DataProviderManager,
    DataProvider,
    Providers,
    ProvidersDialog,
    ViewModelUtils,
    MessageDisplaying,
    DialogFields,
    Runtime,
    CoreUtils,
    CoreTypes,
    Logger
  ) {
    function ProviderManagement(viewParams) {
      const self = this;

      /** @type {Readonly<{models: {add: {id: string}, new: {id: string}}, proplist: {add: {id: string}, new: {id: string}}, composite: {add: {id: string}}, project: {import: {id: string}, export: {id: string}}, connections: {add: {id: string}}, providers: {sort: {id: string}}}>} */
      this.i18n = {
        'icons': {
          'ancillary': {
            'contentItem': {
              id: 'provider-management',
              iconFile: 'provider-management-tabstrip-icon_24x24',
              tooltip: oj.Translations.getTranslatedString('wrc-ancillary-content.tabstrip.tabs.projectmanagement.label')
            }
          },
          'close': {
            iconFile: 'dialog-close-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.buttons.close.label')
          },
          'choose': {
            iconFile: 'import-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.choose.value')
          },
          'pick': {
            iconFile: 'choose-directory-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.pick.value')
          },
          'download': {
            iconFile: 'export-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.download.value')
          },
          'import': {
            iconFile: 'project-import-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.buttons.import.label')
          },
          'export': {
            iconFile: 'project-export-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.buttons.export.label')
          },
          'more': {
            iconFile: 'more-vertical-brn-8x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.more.value')
          }
        },
        'labels': {
          'project': {
            'name': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.project.name.value')},
            'file': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.project.file.value')}
          }
        },
        'menus': {
          'connections': {
            'add': {id: ProviderManagement.prototype.Actions.connections.add.id, disabled: false,
              label: oj.Translations.getTranslatedString('wrc-data-providers.menus.connections.add.value')
            }
          },
          'models': {
            'new': {id: ProviderManagement.prototype.Actions.models.new.id, disabled: false,
              label: oj.Translations.getTranslatedString('wrc-data-providers.menus.models.new.value')
            },
            'add': {id: ProviderManagement.prototype.Actions.models.add.id, disabled: false,
              label: oj.Translations.getTranslatedString('wrc-data-providers.menus.models.add.value')
            }
          },
          'composite': {
            'add': {id: ProviderManagement.prototype.Actions.composite.add.id, disabled: false,
              label: oj.Translations.getTranslatedString('wrc-data-providers.menus.composite.add.value')
            }
          },
          'proplist': {
            'new': {id: ProviderManagement.prototype.Actions.proplist.new.id, disabled: false,
              label: oj.Translations.getTranslatedString('wrc-data-providers.menus.proplist.new.value')
            },
            'add': {id: ProviderManagement.prototype.Actions.proplist.add.id, disabled: false,
              label: oj.Translations.getTranslatedString('wrc-data-providers.menus.proplist.add.value')
            }
          },
          'providers': {
            'sort': {
              id: ProviderManagement.prototype.Actions.providers.sort.id, disabled: false,
              'label': oj.Translations.getTranslatedString('wrc-data-providers.menus.providers.sort.value')
            }
          },
          'project': {
            'export': {id: ProviderManagement.prototype.Actions.project.export.id, disabled: false,
              label: oj.Translations.getTranslatedString('wrc-data-providers.menus.project.export.value')
            },
            'import': {id: ProviderManagement.prototype.Actions.project.import.id, disabled: false,
              label: oj.Translations.getTranslatedString('wrc-data-providers.menus.project.import.value')
            }
          }
        },
        'titles': {
          'ancillary': {
            'contentItem': {value: oj.Translations.getTranslatedString('wrc-ancillary-content.tabstrip.tabs.projectmanagement.label')}
          },
          'export': {
            'project': {value: oj.Translations.getTranslatedString('wrc-data-providers.titles.export.project.value')}
          },
          'import': {
            'project': {value: oj.Translations.getTranslatedString('wrc-data-providers.titles.import.project.value')}
          }
        },
        'buttons': {
          'ok': { disabled: ko.observable(false),
            'label': ko.observable(oj.Translations.getTranslatedString('wrc-common.buttons.ok.label'))
          },
          'cancel': { disabled: false,
            'label': oj.Translations.getTranslatedString('wrc-common.buttons.cancel.label')
          }
        },
        'messages': {
          'export': {
            'failed': {
              'summary': oj.Translations.getTranslatedString('wrc-data-providers.messages.export.failed.summary'),
              'detail': oj.Translations.getTranslatedString('wrc-data-providers.messages.export.failed.detail', '{0}')
            }
          },
          'import': {
            'failed': {
              'summary': oj.Translations.getTranslatedString('wrc-data-providers.messages.import.failed.summary'),
              'detail': oj.Translations.getTranslatedString('wrc-data-providers.messages.import.failed.detail', '{0}')
            }
          },
          'upload': {
            'failed': {
              'detail': oj.Translations.getTranslatedString('wrc-data-providers.messages.upload.failed.detail', '{0}')
            }
          }
        },
        'dialog': {
          'title': ko.observable(''),
          'instructions': ko.observable(''),
          'nameLabel': ko.observable(''),
          'fileLabel': ko.observable(''),
          'iconFile': ko.observable(''),
          'tooltip': ko.observable('')
        }
      };

      /**
       * !!! DON'T CHANGE THE ORDER OF THE NEXT THREE LINES  !!!
       * !!! THE initializeProject() CALL MUST COME BEFORE   !!!
       * !!! SETTING THE this.providersModuleConfig VARIABLE !!!              !!!
       */

      this.dialogFields = ko.observable(initializeDialogFields());
      this.project = initializeProject();
      this.projectAlias = ko.observable(CoreUtils.isNotUndefinedNorNull(this.project) ? this.project.name : '');
      this.providersCount = ko.observable(0);

      this.tabNode = 'provider-management';
      this.canExitCallback = viewParams.canExitCallback;

      this.signalBindings = [];

      this.connected = function () {
        this.projectFileContentsSubscription = this.projectFileContents.subscribe((newValue) => {
          // We only need to do something if newValue
          // is non-empty JS object.
          if (Object.keys(newValue).length > 0) {
            let project = ConsoleProjectManager.getByName(self.project.name);
            if (CoreUtils.isNotUndefinedNorNull(project)) {
              self.providersModuleConfig
                .then(moduleConfig => {
                  moduleConfig.viewModel.deactivateDataProviders([...project.dataProviders])
                    .then(() => {
                      // Use ConsoleProjectManager to load newValue
                      // (i.e. project).
                      project = ConsoleProjectManager.createFromEntry(newValue);
                      project.filename = (CoreUtils.isNotUndefinedNorNull(self.projectFiles['current']) ? self.projectFiles['current'].name : '');
                      setCurrentProject(project);
                      // Send notification that project was imported.
                      dispatchElectronApiSignal('project-changing');
                      // Add "mouseenter" and "mouseleave" event
                      // listener to list items
                      moduleConfig.viewModel.addEventListeners();
                      viewParams.signaling.projectSwitched.dispatch(project);
                    });
                });
            }
          }
        });

        if (ViewModelUtils.isElectronApiAvailable()) {
          window.electron_api.ipc.receive('on-project-switched', (switching) => {
            performProjectElectronMenuAction(switching);
          });
        }

        let binding = viewParams.signaling.backendConnectionLost.add(() => {
          self.providersModuleConfig
            .then(moduleConfig => {
              moduleConfig.viewModel.removeEventListeners();
              moduleConfig.viewModel.clearConnectionsModels();
            });
          self.project = initializeProject();
          self.providersCount(0);
          setProjectAlias(ConsoleProject.prototype.UNNAMED_PROJECT);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.adminServerShutdown.add(() => {
          const dataProvider = DataProviderManager.getDataProviderById(Runtime.getDataProviderId());
          if (CoreUtils.isNotUndefinedNorNull(dataProvider) &&
            CoreUtils.isNotUndefinedNorNull(dataProvider.domainStatus)
          ) {
            if (dataProvider.domainStatus['pollWhenQuiesced'] === false) {
              refreshDataProviders(self.project);
              dataProvider.domainStatus['pollWhenQuiesced'] = true;
            }
            self.providersModuleConfig
              .then(moduleConfig => {
                moduleConfig.viewModel.onDeactivateDataProvider(dataProvider, 'deactivate')
                  .then(reply => {
                    if (dataProvider.type === DataProvider.prototype.Type.ADMINSERVER.name) {
                      const messageLine = {
                        messageHTML: oj.Translations.getTranslatedString('wrc-message-line.messages.adminServerShutdown.details'),
                        severity: 'warning',
                        pollWhenQuiesced: true
                      };
                      viewParams.signaling.domainStatusPollingCompleted.dispatch(messageLine);
                    }
                  })
                  .catch(failure => {
                    ViewModelUtils.failureResponseDefaultHandling(failure);
                  });

              });
          }

        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.startupTaskChosen.add((startupTask) => {
          self.toolbarMoreMenuClickListener({
            currentTarget: {
              attributes: {
                'data-item-action': {
                  value: startupTask
                }
              }
            }
          });
        });

        self.signalBindings.push(binding);

      };

      this.disconnected = function () {
        // Dispose of change subscriptions on knockout observables.
        self.projectFileContentsSubscription.dispose();

        if (ViewModelUtils.isElectronApiAvailable()) {
          window.electron_api.ipc.cancelReceive('on-project-switched');
        }

        self.signalBindings.forEach(binding => { binding.detach(); });

        self.signalBindings = [];
      };

      this.providersModuleConfig = ModuleElementUtils.createConfig({
        name: 'content-area/ancillary/providers',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          getProjectName: getProjectName,
          onSetUnnamedProject: setUnnamedProject,
          onCachedStateChanged: changedTabModuleTabCachedState,
          onDataProviderUpserted: upsertDataProvider,
          onDataProviderRemoved: removeDataProvider,
          onDataProvidersCleared: clearDataProviders,
          onElectronApiSignalDispatched: dispatchElectronApiSignal,
          onStartupTaskChooser: chooseStartupTask,
          onBusyDialogShown: showBusyDialog
        }
      });

      this.getCachedState = () => {
        return (CoreUtils.isNotUndefinedNorNull(self.project) ? self.project : {});
      };

      this.onOjFocus = (event)=> {
        removeDialogResizableHandleNodes(event);
        refreshDataProviders(self.project);
        // Disable keyboard focus using the "Tab" key on all
        // of the oj-label help.definition attributes. That is
        // where we store field-level help in the "?" icons. We
        // need to do this after JET has rendered the oj-label,
        // because that is where it does the tabindex="0" under
        // the covers.
        $('oj-label > div.oj-label-group > span > a').attr({'tabindex': '-1'});
        // Trigger a focusin event, so the focus goes to the
        // providers oj-navigation-list
        $('#connections-models').trigger('focusin');
      };

      this.onOjBeforeClose = function (event) {
        viewParams.onClose(self.tabNode);
      };

      this.closeIconClickHandler = function(event) {
        viewParams.onClose(self.tabNode);
      };

      this.toolbarMoreMenuClickListener = function(event) {
        const action = event.currentTarget.attributes['data-item-action'].value;

        const dialogParams = {
          accepts: 'application/yaml,application/x-yaml,application/json'
        };

        switch(action) {
          case 'export-all-to-project':
            addProject(dialogParams);
            break;
          case 'load-project':
            importProject(dialogParams);
            break;
          default:
            viewParams.signaling.providerManagementActionChosen.dispatch(action, dialogParams, ProviderManagement.prototype.Actions);
            break;
        }
      }.bind(this);

      this.launchProjectMoreMenu = function (event) {
        event.preventDefault();
        document.getElementById('projectMoreMenu').open(event);
      };

      this.projectMoreMenuItemAction = function (event) {
        if (CoreUtils.isNotUndefinedNorNull(self.canExitCallback)) {
          let dialogMessageName = 'Unknown';
          let eventType = 'exit';
          const lastActivedDataProvider = DataProviderManager.getLastActivatedDataProvider();
          if (CoreUtils.isNotUndefinedNorNull(lastActivedDataProvider)) {
            dialogMessageName =  lastActivedDataProvider.name;
            if (['model', 'properties', 'modelComposite'].includes(lastActivedDataProvider.type)) {
              eventType = 'download';
            }
          }
          self.canExitCallback(eventType, {dialogMessage: {name: dialogMessageName }})
            .then(reply => {
              if (reply) {
                self.canExitCallback = undefined;
                performProjectMoreMenuAction(event);
              }
            })
            .catch(failure => {
              ViewModelUtils.failureResponseDefaultHandling(failure);
            });
        }
        else {
          performProjectMoreMenuAction(event);
        }

      };

      this.newFileClickHandler = (event) => {
        const fileType = event.currentTarget.attributes['data-input-type'].value;
        const filepath = self.contentFile();
        let mediaType = 'application/x-yaml';
        if (fileType === 'project') {
          mediaType = 'application/json';
        }
        let data = '';
        if (!ViewModelUtils.isElectronApiAvailable() && filepath !== '') {
          ViewModelUtils.downloadFile({filepath: filepath, fileContents: data, mediaType: mediaType});
        }
      };

      this.chooseFileClickHandler = (event) => {
        const fileType = event.currentTarget.attributes['data-input-type'].value;
        if (ViewModelUtils.isElectronApiAvailable()) {
          const dialogParams = {
            defaultPath: self.dialogFields().file,
            properties: ['openFile'],
            filters: { name: 'Supported Formats', extensions: ['yml', 'yaml', 'json', 'props', 'properties']}
          };
          window.electron_api.ipc.invoke('file-choosing', dialogParams)
            .then(response => {
              Logger.info(`[PROVIDER-MANAGEMENT] ipcMain.handle()->ipcRenderer.invoke()->this.chooseFileClickHandler(event) 'file-choosing' file=${response.file}`);
              if (CoreUtils.isNotUndefinedNorNull(response.file)) {
                switch(fileType) {
                  case 'project': {
                    self.projectFiles['current'] = new Blob([response.fileContents], {type: response.mediaType});
                    self.projectFile(response.file);
                  }
                    break;
                }
              }
            })
            .catch(failure => {
              ViewModelUtils.failureResponseDefaultHandling(failure);
            });
        }
        else {
          const chooser = $('#file-chooser-provider-management');
          chooser.on('change', self.chooseFileChangeHandler);
          chooser.trigger('click');
          chooser.attr('data-input', self.dialogFields().id);
          chooser.attr('data-input-type', fileType);
          event.preventDefault();
        }
      };

      this.chooseFileChangeHandler = function(event) {
        const files = event.currentTarget.files;
        if (files.length > 0) {
          const fileType = event.currentTarget.attributes['data-input-type'].value;
          if (fileType === 'project') {
            self.projectFiles['current'] = files[0];
            self.projectFile(files[0].name);
          }

          const chooser = $('#file-chooser-provider-management');
          chooser.off('change', self.chooseFileChangeHandler);
          chooser.val('');
        }
      };

      function initializeDialogFields() {
        return {id: '0123456789012', name: '', type: DataProvider.prototype.Type.ADMINSERVER.name};
      }

      function initializeProject() {
        self.projectFiles = {};
        self.projectFileContents = ko.observable({});
        const project = getWorkingProject();
        self.projectFile = ko.observable('');
        return project;
      }

      /**
       * @returns {ConsoleProject}
       */
      function getWorkingProject() {
        let project = self.project;

        if (CoreUtils.isNotUndefinedNorNull(viewParams.cachedState) && Object.keys(viewParams.cachedState).length > 0) {
          // The ancillary content module stores the cached
          // state of the tabstrip tab content, which is
          // being swapped out. The dataproviders module
          // stores this.project in this cached state, so
          // we first need to check viewParams to see if
          // that contains the current project.
          project = ConsoleProjectManager.createFromEntry(viewParams.cachedState);
        }
        else if (CoreUtils.isNotUndefinedNorNull(window.electron_api)) {
          // We're in an Electron app, so do a call to the
          // Electron side to get the current project.
          window.electron_api.ipc.invoke('current-project-requesting')
            .then(reply => {
              if (reply === null) {
                // This means there was no "projects" field in
                // the auto-prefs.json file that CFE Electron
                // uses for persisting project metadata.
                Logger.info('[PROVIDER-MANAGEMENT] ipcMain.handle()->ipcRenderer.invoke()->getWorkingProject() "current-project-requesting" reply=null');
                project = ConsoleProjectManager.createFromEntry({name: ConsoleProject.prototype.UNNAMED_PROJECT});
              }
              else {
                // This means there was a "projects" field in
                // the auto-prefs.json file that CFE Electron
                // uses for persisting project metadata, and
                // reply.body.data was assigned the project
                // with a "current" true field.
                Logger.info(`[PROVIDER-MANAGEMENT] ipcMain.handle()->ipcRenderer.invoke()->getWorkingProject() "current-project-requesting" reply=${JSON.stringify(reply)}`);
                // Ask ConsoleProjectManager to create a
                // project from reply, and add it
                // to the list of projects it knows about.
                project = ConsoleProjectManager.createFromEntry(reply);
              }
              // Set project property that is currently only
              // used in CFE JET.
              project.isDefault = true;
              setCurrentProject(project);
              // Add "mouseenter" and "mouseleave" event
              // listener to list items
              self.providersModuleConfig
                .then(moduleConfig => {
                  moduleConfig.viewModel.addEventListeners();
                });
            })
            .catch(failure => {
              ViewModelUtils.failureResponseDefaultHandling(failure);
            });
        }
        else {
          // self.project was undefined, viewParams.cachedState was
          // not set and we're not in an Electron app.

          if (CoreUtils.isUndefinedOrNull(project)) {
            // Try getting the runtime startup project.
            project = Runtime.getStartupProject();
            if (CoreUtils.isNotUndefinedNorNull(project)) {
              // There was a runtime startup project, so
              // use ConsoleProjectManager to load it.
              // The resulting ConsoleProject class
              // instance will only be in memory, not
              // something that was persisted to the
              // local device.
              project = ConsoleProjectManager.createFromEntry(project);
            }
          }

          if (CoreUtils.isUndefinedOrNull(project)) {
            // Still haven't found a project, so try
            // loading the projects appearing in the
            // "config/wrc-projects.yaml" file.
            ConsoleProjectManager.loadConfigProjects()
              .then(defaultProject => {
                project = defaultProject;

                if (CoreUtils.isUndefinedOrNull(project)) {
                  // There was no ConsoleProject with a name
                  // matching project.name, and there was no
                  // runtime startup project. Fair enough, see
                  // if ConsoleProjectManager has a ConsoleProject
                  // marked as the default
                  project = ConsoleProjectManager.getDefault();
                }

                if (CoreUtils.isUndefinedOrNull(project)) {
                  // None of the ways to get an existing
                  // ConsoleProject instance has worked,
                  // so just create a new one with a null
                  // name, and mark it as the default.
                  project = ConsoleProjectManager.createFromEntry({name: ConsoleProject.prototype.UNNAMED_PROJECT, isDefault: true});
                }

                setCurrentProject(project);
              });
          }

        }

        return project;
      }

      function setCurrentProject(project) {
        // Update module-scope project variable, because that
        // is what gets used in loadConnectionsModels()
        self.project = project;
        // Reload the connectionsModels observable
        // array.
        self.providersModuleConfig
          .then(moduleConfig => {
            moduleConfig.viewModel.loadConnectionsModels(self.project);
            const onTimeout = (itemId, project) => {
              // Add "mouseenter" and "mouseleave" event
              // listener to list items
              moduleConfig.viewModel.addEventListeners();
              // Set name pf current project.
              setProjectAlias(project.name);
              // Set observable used to store number of
              // data providers in current project.
              self.providersCount(project.dataProviders.length);
              // See if project has any data providers
              if (self.providersCount() === 0) {
                // It doesn't, so show the startup task
                // dialog or "Tasks" vertical tab content
                chooseStartupTask();
              }
            };

            // Call setTimeout passing in the callback function and the
            // timeout milliseconds. Here, we use the bind() method to
            // pass parameters (newValue, in this case) to the callback.
            setTimeout(onTimeout.bind(undefined, self.tabNode, project), 5);
            // DON'T PUT ANY CODE IN THIS FUNCTION AFTER THIS POINT !!!
          });
      }

      function getProjectName() {
        return self.project.name;
      }

      function setUnnamedProject() {
        if (self.project.name === null) {
          // Add selected data provider to "in-memory"
          // project, using ConsoleProject.prototype.UNNAMED_PROJECT
          // as the name.
          self.project.name = ConsoleProject.prototype.UNNAMED_PROJECT;
          ConsoleProjectManager.add(self.project);
        }
      }

      function upsertDataProvider(dataProvider) {
        self.project.upsertDataProvider(dataProvider);
        self.providersCount(self.project.dataProviders.length);
      }

      function removeDataProvider(dataProvider) {
        self.providersCount(self.project.dataProviders.length);
        if (self.providersCount() > 0) {
          viewParams.signaling.ancillaryContentItemToggled.dispatch(self.tabNode, {id: self.tabNode, state: 'opened'});
        }
      }

      function clearDataProviders() {
        return ConsoleProjectManager.removeById(self.project.id);
      }

      function refreshDataProviders(project) {
        self.providersModuleConfig
          .then(moduleConfig => {
            // Refresh the providers oj-navigation-list
            moduleConfig.viewModel.refreshConnectionsModels(project);
          });

      }

      function performProjectElectronMenuAction(switching) {
        function switchToProject(project) {
          project = ConsoleProjectManager.createFromEntry(switching.to);
          if (CoreUtils.isNotUndefinedNorNull(project)) {
            setCurrentProject(project);
            // Add "mouseenter" and "mouseleave" event
            // listener to list items
            self.providersModuleConfig
              .then(moduleConfig => {
                moduleConfig.viewModel.addEventListeners();
                viewParams.signaling.projectSwitched.dispatch(switching.from);
              });
          }
        }

        switch(switching.action) {
          case 'create':
          case 'select':
          case 'navigate':
            if (switching.to.name !== self.project.name) {
              let project = ConsoleProjectManager.getByName(switching.from.name);
              if (CoreUtils.isNotUndefinedNorNull(project)) {
                self.providersModuleConfig.viewModel.deactivateDataProviders([...project.dataProviders])
                  .then(() => {
                    switchToProject(project);
                  });
              }
              else {
                switchToProject(project);
              }
            }
            break;
          case 'rename':
            ConsoleProjectManager.renameProject(switching.from.name, switching.to.name);
            self.project.name = switching.to.name;
            setProjectAlias(self.project.name);
            break;
        }
      }

      function performProjectMoreMenuAction(event) {
        const dialogParams = {
          id: event.target.value,
          accepts: 'application/yaml,application/x-yaml,application/json,text/plain'
        };

        switch(dialogParams.id) {
          case ProviderManagement.prototype.Actions.connections.add.id:
            viewParams.signaling.providerManagementActionChosen.dispatch(dialogParams.id, dialogParams, ProviderManagement.prototype.Actions);
            break;
          case ProviderManagement.prototype.Actions.models.add.id:
            dialogParams['action'] = 'existing';
            viewParams.signaling.providerManagementActionChosen.dispatch(dialogParams.id, dialogParams, ProviderManagement.prototype.Actions);
            break;
          case ProviderManagement.prototype.Actions.models.new.id:
            dialogParams['action'] = 'new';
            viewParams.signaling.providerManagementActionChosen.dispatch(dialogParams.id, dialogParams, ProviderManagement.prototype.Actions);
            break;
          case ProviderManagement.prototype.Actions.composite.add.id:
            viewParams.signaling.providerManagementActionChosen.dispatch(dialogParams.id, dialogParams, ProviderManagement.prototype.Actions);
            break;
          case ProviderManagement.prototype.Actions.proplist.add.id:
            dialogParams['action'] = 'existing';
            viewParams.signaling.providerManagementActionChosen.dispatch(dialogParams.id, dialogParams, ProviderManagement.prototype.Actions);
            break;
          case ProviderManagement.prototype.Actions.proplist.new.id:
            dialogParams['action'] = 'new';
            viewParams.signaling.providerManagementActionChosen.dispatch(dialogParams.id, dialogParams, ProviderManagement.prototype.Actions);
            break;
          case ProviderManagement.prototype.Actions.providers.sort.id:
            viewParams.signaling.providerManagementActionChosen.dispatch(dialogParams.id, dialogParams, ProviderManagement.prototype.Actions);
            break;
          case ProviderManagement.prototype.Actions.project.export.id:
            addProject(dialogParams);
            break;
          case ProviderManagement.prototype.Actions.project.import.id:
            importProject(dialogParams);
            break;
        }
      }

      function setProjectAlias(name) {
        if (CoreUtils.isNotUndefinedNorNull(self.projectAlias)) {
          self.projectAlias(name);
        }
      }

      function addProject(dialogParams) {
        const entryValues = new DialogFields();
        entryValues.putValue('name', self.project.name);
        entryValues.putValue('file', self.project.filename);

        self.dialogFields(entryValues);

        self.i18n.dialog.title(self.i18n.titles.export.project.value);
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString('wrc-data-providers.instructions.project.export.value'));
        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString('wrc-common.buttons.ok.label'));

        ProvidersDialog.showProvidersDialog('ExportAllToProject', dialogParams, self.i18n, undefined)
          .then(reply => {
            if (reply) {
              exportAllToProject(self.dialogFields());
            }
          });
      }

      function importProject(dialogParams) {
        self.i18n.dialog.title(self.i18n.titles.import.project.value);
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString('wrc-data-providers.instructions.project.import.value'));
        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString('wrc-common.buttons.import.label'));

        const entryValues = new DialogFields();
        entryValues.addField('file');
        entryValues.putValue('readonly', CoreUtils.isUndefinedOrNull(window.electron_api));

        self.dialogFields(entryValues);

        self.projectFile('');

        ProvidersDialog.showProvidersDialog('ImportProject', dialogParams, self.i18n, undefined)
          .then(reply => {
            if (reply) {
              // If the startup task chooser is 'use-cards' then
              // we need to be unhidden. If not, then the user
              // won't be able to see that the import worked.
              if (Runtime.getStartupTaskChooser() === 'use-cards') {
                viewParams.onUnhide();
              }

              // Declare reader for reading the loaded
              // project file.
              const reader = new FileReader();

              // Callback that will be called when the
              // reader.readAsText() function is called.
              // The self.projectFiles["current"'] entry
              // will contain the File/Blob object for
              // the loaded file.
              reader.onload = ( (file) => {
                return (event) => {
                  readImportedProjectFile(event.target.result);
                };
              })(self.projectFiles['current']);

              // Read in project file as a data URL.
              reader.readAsText(self.projectFiles['current']);
            }
          })
          .catch(reason => {
            ViewModelUtils.failureResponseDefaultHandling(reason);
          });
      }

      function showBusyDialog() {
        self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-data-providers.titles.project-busy.value'));
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString('wrc-data-providers.instructions.project-busy.value'));
        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString('wrc-common.buttons.ok.label'));

        ProvidersDialog.showProvidersDialog('ProjectBusy', null, self.i18n, undefined)
          .then()
          .catch(reason => {
            ViewModelUtils.failureResponseDefaultHandling(reason);
          });
      }

      function readImportedProjectFile(fileText) {
        // Remove any line breaks from fileText
        const fileContents = CoreUtils.removeLineBreaks(fileText);
        ConsoleProjectManager.createFromJSONString(fileContents)
          .then(project => {
            // There were no JSON parsing issues and fileContents is the
            // JSON representation of a project, so go ahead and trigger
            // knockout change subscription.
            self.projectFileContents(project);
          })
          .catch(response => {
            if (CoreUtils.isNotUndefinedNorNull(response.failureType) && response.failureType === CoreTypes.FailureType.INCORRECT_CONTENT) {
              response = Error(oj.Translations.getTranslatedString('wrc-common.messages.incorrectFileContent.detail', self.projectFile(), 'project'));
              response.name = oj.Translations.getTranslatedString('wrc-common.title.incorrectFileContent.value');
            }
            ViewModelUtils.failureResponseDefaultHandling(response);
          });
      }

      function exportAllToProject(dialogFields){
        // Update the project name and filename.
        self.project.name = dialogFields.name;
        // Update the project alias
        setProjectAlias(self.project.name);
        // Add .json file extension, if not already there.
        if (!dialogFields.file.toLowerCase().endsWith('.json')) dialogFields.file = `${dialogFields.file}.json`;
        self.project.filename = dialogFields.file;

        const options = {
          filepath: dialogFields.file,
          fileContents: self.project.getAsDownloadFormatted(),
          mediaType: 'application/json'
        };

        ViewModelUtils.downloadFile(options);
        dispatchElectronApiSignal('project-changing');
      }

      function dispatchElectronApiSignal(channel) {
        if (CoreUtils.isUndefinedOrNull(self.project)) {
          self.project = ConsoleProjectManager.createFromEntry({name: ConsoleProject.prototype.UNNAMED_PROJECT});
        }

        if (ViewModelUtils.isElectronApiAvailable()) {
          // We're in an Electron app, so do an ipcRenderer.invoke()
          // call to the Electron ipc channel passed in the channel
          // argument.
          window.electron_api.ipc.invoke(channel, self.project.getAsJSONFormatted())
            .then(reply => {
              Logger.info(`[PROVIDER-MANAGEMENT] ipcMain.handle()->ipcRenderer.invoke()->sendProjectdNotification() '${channel}' reply=${JSON.stringify(reply)}`);
            })
            .catch(failure => {
              ViewModelUtils.failureResponseDefaultHandling(failure);
            });
        }
      }

      function chooseStartupTask(options) {
        if (CoreUtils.isUndefinedOrNull(options) || CoreUtils.isUndefinedOrNull(options.chooser)) {
          options = {chooser: Runtime.getStartupTaskChooser()};
        }

        viewParams.signaling.tabStripTabSelected.dispatch('provider-management', 'startup-tasks', options);
      }

      function changedTabModuleTabCachedState() {
        viewParams.onCachedStateChanged(self.tabNode, self.project);
      }

      function removeDialogResizableHandleNodes(event) {
        const nodeList = document.querySelectorAll(`#${event.currentTarget.id} .oj-resizable-handle`);
        if (nodeList !== null) {
          let arr = Array.from(nodeList);
          for (let i in arr.reverse()) {
            const classList = nodeList[i].className.split(' ').filter(e => e);
            if (!['oj-resizable-w', 'oj-resizable-sw','oj-resizable-s'].includes(classList.at(-1))) {
              nodeList[i].remove();
            }
          }
        }
      }

    }

    ProviderManagement.prototype.Actions = Object.freeze({
      'connections': {
        'add': {id: 'add-domain-connection'}
      },
      'models': {
        'new': {id: 'add-new-wdt-model'},
        'add': {id: 'add-existing-wdt-model'}
      },
      'composite': {
        'add': {id: 'add-wdt-composite'}
      },
      'proplist': {
        'new': {id: 'add-new-property-list'},
        'add': {id: 'add-existing-property-list'}
      },
      'providers': {
        'sort': {id: 'sort-by-provider-type'}
      },
      'project': {
        'export': {id: 'export-all-to-project'},
        'import': {id: 'load-project'}
      }
    });

    return ProviderManagement;
  }
);