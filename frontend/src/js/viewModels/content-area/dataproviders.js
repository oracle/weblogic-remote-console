/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojarraydataprovider',  'wrc-frontend/microservices/project-management/console-project-manager', 'wrc-frontend/microservices/project-management/console-project', 'wrc-frontend/microservices/provider-management/data-provider-manager', 'wrc-frontend/microservices/provider-management/data-provider', './dataproviders-dialog','wrc-frontend/integration/viewModels/utils', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/core/runtime', 'wrc-frontend/core/utils', 'wrc-frontend/core/types', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojtreeview','ojs/ojnavigationlist', 'ojs/ojswitch', 'ojs/ojcheckboxset', 'ojs/ojradioset', 'ojs/ojselectcombobox', 'ojs/ojselectsingle'],
  function (oj, ko, ArrayDataProvider, ConsoleProjectManager, ConsoleProject, DataProviderManager, DataProvider, DataProvidersDialog, ViewModelUtils, MessageDisplaying, Runtime, CoreUtils, CoreTypes, Logger) {
    function DataProvidersTemplate(viewParams) {
      const self = this;

      const PROVIDER_ACTIVATED_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--provider-activated-color');
      const PROVIDER_DEACTIVATED_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--provider-deactivated-color');

      // Nested class.
      function DialogFields() {
        return {
          addField: function(name, value) {
            if (typeof value === 'number') value = value.toString();
            this.putValue(name, value || '');
          },
          putValue: function(name, value) {
            this[name] = value;
          }
        }
      }

      var connectionsModels = ko.observableArray([]);

      this.i18n = {
        'icons': {
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
          },
          'reload': {
            iconFile: 'reload-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.reload.value')
          },
          'info': {
            iconFile: 'data-providers-info-icon-brn_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-data-providers.icons.info.tooltip')
          },
          'edit': {
            iconFile: 'data-providers-manage-icon-brn_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-data-providers.icons.edit.tooltip')
          },
          'deactivate': {
            iconFile: 'data-providers-deactivate-icon-brn_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-data-providers.icons.deactivate.tooltip')
          },
          'delete': {
            iconFile: 'data-providers-delete-icon-brn_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-data-providers.icons.delete.tooltip')
          }
        },
        'popups': {
          'info': {
            'provider': {
              'id': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.provider.id.label')},
            },
            'domain': {
              'name': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.name.label')},
              'url': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.url.label')},
              'version': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.version.label')},
              'username': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.username.label')},
              'roles': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.roles.label')},
              'connectTimeout': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.connectTimeout.label')},
              'readTimeout': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.readTimeout.label')},
              'anyAttempt': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.anyAttempt.label')},
              'lastAttempt': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.lastAttempt.label')}
            },
            'model': {
              'file': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.model.file.label')},
              'props': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.model.props.label')}
            },
            'composite': {
              'models': {'value': ko.observableArray([]),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.composite.models.label')}
            },
            'proplist': {
              'file': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.proplist.file.label')}
            }
          }
        },
        'labels': {
          'connections': {
            'header': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.connections.header.value')},
            'name': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.connections.name.value')},
            'url': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.connections.url.value')},
            'username': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.connections.username.value')},
            'password': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.connections.password.value')}
          },
          'models': {
            'name': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.models.name.value')},
            'file': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.models.file.value')},
            'props': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.models.props.value')}
          },
          'composite': {
            'name': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.composite.name.value')},
            'providers': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.composite.providers.value')}
          },
          'proplist': {
            'name': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.proplist.name.value')},
            'file': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.proplist.file.value')}
          },
          'project': {
            'name': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.project.name.value')},
            'file': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.project.file.value')}
          },
          'provider': {
            'adminserver': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.provider.adminserver.value')},
            'model': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.provider.model.value')}
          },
          'dropdown': {
            'none': {'value': oj.Translations.getTranslatedString('wrc-data-providers.labels.dropdown.none.value')}
          }
        },
        'menus': {
          'connections': {
            'add': {id: 'add-domain-connection', disabled: false,
              label: oj.Translations.getTranslatedString('wrc-data-providers.menus.connections.add.value')
            }
          },
          'models': {
            'new': {id: 'add-new-wdt-model', disabled: false,
              label: oj.Translations.getTranslatedString('wrc-data-providers.menus.models.new.value')
            },
            'add': {id: 'add-exiting-wdt-model', disabled: false,
              label: oj.Translations.getTranslatedString('wrc-data-providers.menus.models.add.value')
            }
          },
          'composite': {
            'add': {id: 'add-wdt-composite', disabled: false,
              label: oj.Translations.getTranslatedString('wrc-data-providers.menus.composite.add.value')
            }
          },
          'proplist': {
            'new': {id: 'add-new-property-list', disabled: false,
              label: oj.Translations.getTranslatedString('wrc-data-providers.menus.proplist.new.value')
            },
            'add': {id: 'add-exiting-property-list', disabled: false,
              label: oj.Translations.getTranslatedString('wrc-data-providers.menus.proplist.add.value')
            }
          },
          'providers': {
            'sort': {
              id: 'sort-by-provider-type', disabled: false,
              'label': oj.Translations.getTranslatedString('wrc-data-providers.menus.providers.sort.value')
            }
          },
          'project': {
            'export': {id: 'export-all-to-project', disabled: false,
              label: oj.Translations.getTranslatedString('wrc-data-providers.menus.project.export.value')
            },
            'import': {id: 'load-project', disabled: false,
              label: oj.Translations.getTranslatedString('wrc-data-providers.menus.project.import.value')
            }
          }
        },
        'titles': {
          'add': {
            'connections': {value: oj.Translations.getTranslatedString('wrc-data-providers.titles.add.connections.value')},
            'models': {value: oj.Translations.getTranslatedString('wrc-data-providers.titles.add.models.value')},
            'composite': {value: oj.Translations.getTranslatedString('wrc-data-providers.titles.add.composite.value')},
            'proplist': {value: oj.Translations.getTranslatedString('wrc-data-providers.titles.add.proplist.value')},
          },
          'new': {
            'models': {'value': oj.Translations.getTranslatedString('wrc-data-providers.titles.new.models.value')},
            'proplist': {'value': oj.Translations.getTranslatedString('wrc-data-providers.titles.new.proplist.value')}
          },
          'edit': {
            'connections': {value: oj.Translations.getTranslatedString('wrc-data-providers.titles.edit.connections.value')},
            'models': {value: oj.Translations.getTranslatedString('wrc-data-providers.titles.edit.models.value')},
            'composite': {value: oj.Translations.getTranslatedString('wrc-data-providers.titles.edit.composite.value')},
            'proplist': {value: oj.Translations.getTranslatedString('wrc-data-providers.titles.edit.proplist.value')},
          },
          'export': {
            'project': {value: oj.Translations.getTranslatedString('wrc-data-providers.titles.export.project.value')}
          },
          'import': {
            'project': {value: oj.Translations.getTranslatedString('wrc-data-providers.titles.import.project.value')}
          },
          'startup': {
            'task': {value: oj.Translations.getTranslatedString('wrc-data-providers.titles.startup.task.value')}
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
          'stage': {
            'failed': {
              'summary': oj.Translations.getTranslatedString('wrc-data-providers.messages.stage.failed.summary'),
              'detail': oj.Translations.getTranslatedString('wrc-data-providers.messages.stage.failed.detail', '{0}')
            }
          },
          'use': {
            'failed': {
              'summary': oj.Translations.getTranslatedString('wrc-data-providers.messages.use.failed.summary'),
              'detail': oj.Translations.getTranslatedString('wrc-data-providers.messages.use.failed.detail', '{0}')
            }
          },
          'upload': {
            'failed': {
              'detail': oj.Translations.getTranslatedString('wrc-data-providers.messages.upload.failed.detail', '{0}')
            }
          },
          'response': {
            'nameAlreadyExist': {
              'detail': oj.Translations.getTranslatedString('wrc-data-providers.messages.response.nameAlreadyExist.detail', '{0}')
            },
            'modelsNotFound': {
              'detail': oj.Translations.getTranslatedString('wrc-data-providers.messages.response.modelsNotFound.detail', '{0}')
            },
            'propListNotFound': {
              'detail': oj.Translations.getTranslatedString('wrc-data-providers.messages.response.propListNotFound.detail', '{0}')
            },
            'selectModels': {
              'detail': oj.Translations.getTranslatedString('wrc-data-providers.messages.response.selectModels.detail')
            }
          }
        },
        'checkboxes': {
          'useSparseTemplate': {
            id: 'sparse',
            label: oj.Translations.getTranslatedString('wrc-data-providers.checkboxes.useSparseTemplate.label')
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

      // Content for a new property list dataprovider
      const newPropertyListContentFileData = '# Property List\n';

      // START: knockout observables referenced in dataproviders.html
      this.connectionsModelsSelectedItem = ko.observable('');
      // Need to initialize observable with valid, throw
      // away data, because the view (dataproviders.html)
      // has <oj-bind-if> elements that use it in test
      // attributes.
      this.dialogFields = ko.observable(initializeDialogFields());
      this.responseMessage = ko.observable('');
      this.providerInfo = {type: ko.observable('adminserver'), state: ko.observable('disconnected')};
      this.contentFile = ko.observable();
      this.contentFiles = {};
      // END:   knockout observables referenced in dataproviders.html

      this.useSparseTemplate = ko.observableArray([]);

      /**
       * !!! DON'T CHANGE THE ORDER OF THE NEXT TWO LINES  !!!
       * !!! THE initializeProject() CALL MUST COME BEFORE !!!
       * !!! THE loadConnectionsModels() CALL              !!!
       */

      this.project = initializeProject();
      this.projectAlias = ko.observable(CoreUtils.isNotUndefinedNorNull(this.project) ? this.project.name : '');

      this.connectionsModelsDataProvider = loadConnectionsModels();

      // WDT Composite Model Provider Dialog
      this.wdtProvidersSelectedValues = ko.observableArray([]);
      this.wdtProvidersDataProvider = new ArrayDataProvider([], { keyAttributes: 'value' });

      // Property List selections for WDT Model
      this.propProviderSelectedValue = ko.observable('');
      this.propProvidersDataProvider = new ArrayDataProvider([], { keyAttributes: 'value' });

      /**
       * Returns the dataProviders property of the default project
       * @returns {ArrayDataProvider}
       * @private
       */
      function loadConnectionsModels() {
        if (CoreUtils.isNotUndefinedNorNull(self.project)) {
          setDataProvidersClassField(self.project.dataProviders);
          connectionsModels(self.project.dataProviders);
        }

        if (CoreUtils.isUndefinedOrNull(self.connectionsModelsDataProvider)) {
          return new ArrayDataProvider(
            connectionsModels, { keyAttributes: 'id' }
          );
        }
        else {
          return self.connectionsModelsDataProvider;
        }
      }

      this.tabNode = 'dataproviders';
      this.canExitCallback = viewParams.canExitCallback;

      this.signalBindings = [];

      this.connected = function () {
        this.projectFileContentsSubscription = this.projectFileContents.subscribe((newValue) => {
          // We only need to do something if newValue
          // is non-empty JS object.
          if (Object.keys(newValue).length > 0) {
            let project = ConsoleProjectManager.getByName(self.project.name);
            if (CoreUtils.isNotUndefinedNorNull(project)) {
              deactivateDataProviders([...project.dataProviders])
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
                  addEventListeners();
                  viewParams.signaling.projectSwitched.dispatch(project);
                });
            }
          }
        });

        if (ViewModelUtils.isElectronApiAvailable()) {
          window.electron_api.ipc.receive('on-project-switched', (switching) => {
            performProjectElectronMenuAction(switching);
          });
        }

        // Be sure to create a binding for any signaling add in
        // this module. In fact, the code for the add needs to
        // be moved here physically.

        let binding = viewParams.signaling.backendConnectionLost.add(() => {
          removeEventListeners();
          clearConnectionsModels();
          self.project = initializeProject();
          setProjectAlias(ConsoleProject.prototype.UNNAMED_PROJECT);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.unsavedChangesDetected.add((exitFormCallback) => {
          self.canExitCallback = exitFormCallback;
        });

        self.signalBindings.push(binding);

        // DON'T PUT CODE AFTER THIS setTimeout(),
        // INSIDE THIS this.connected() callback!!

        // The code executed when the timeout elapses,
        // happens after the DOM is actually rendered.
        // We need the DOM, because the event listeners
        // get attached to elements in it.
        setTimeout(() => {
            addEventListeners();
            if (connectionsModels().length > 0) {
              setListItemColor(connectionsModels());
            }
            checkLoginCustomUrl();
          }, 5
        );
      }.bind(this);

      this.disconnected = function () {
        // Dispose of change subscriptions on knockout observables.
        self.projectFileContentsSubscription.dispose();

        // Remove all event listeners added earlier using
        // the addEventListeners() call.
        removeEventListeners();

        // When in the Electron app, cancel the receive
        // for the events for project switched
        if (ViewModelUtils.isElectronApiAvailable()) {
          window.electron_api.ipc.cancelReceive('on-project-switched');
        }

        // Detach all signal "add" bindings.
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];
      }.bind(this);

      this.getCachedState = () => {
        return (CoreUtils.isNotUndefinedNorNull(self.project) ? self.project : {});
      };

      function setProjectAlias(name) {
        if (CoreUtils.isNotUndefinedNorNull(self.projectAlias)) {
          self.projectAlias(name);
        }
      }

      function initializeProject() {
        self.projectFiles = {};
        self.projectFileContents = ko.observable({});
        const project = getWorkingProject();
        self.projectFile = ko.observable('');
        return project;
      }

      function initializeDialogFields() {
        return {id: '0123456789012', name: '', type: DataProvider.prototype.Type.ADMINSERVER.name};
      }

      function checkLoginCustomUrl() {
        return new Promise((resolve, reject) => {
          if (ViewModelUtils.isElectronApiAvailable()) {
            window.electron_api.ipc.invoke('current-login')
              .then(reply => {
                if (reply) {
                  Logger.info('[DATAPROVIDERS] checkLoginCustomUrl() "current-login"');

                  // TBD - Pass domain protocol and handle type error for bad URL
                  const url = new URL(reply.customUrl);
                  if (url.protocol !== 'wrc:') {
                    Logger.info('[DATAPROVIDERS] checkLoginCustomUrl() "Invalid protocol!"');
                    resolve(null);
                    return;
                  }
                  const params = url.searchParams;
                  const token = params.get('token');
                  const expires = params.get('expires');
                  const protocol = params.get('protocol');

                  // Update the URL protocol so that URL host value is based on domain's URL
                  url.protocol = (protocol ? protocol : 'http:');
                  const domainUrl = `${url.protocol}//${url.host}`;

                  // TBD - Determine handling of the provider based on the custom url
                  const dataProviderName = 'loginProvider';
                  var dataProvider = getAdminServerConnectionByName(dataProviderName);
                  if (CoreUtils.isUndefinedOrNull(dataProvider)) {
                    const entryValues = getDialogFields(DataProvider.prototype.Type.ADMINSERVER);
                    entryValues.putValue('name', dataProviderName);
                    dataProvider = addDialogFields(DataProvider.prototype.Type.ADMINSERVER, entryValues);
                  }
                  dataProvider.putValue('url', domainUrl);
                  dataProvider.putValue('token', token);
                  dataProvider.putValue('expires', expires);
                  dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;

                  // Select the dataprovider
                  Logger.info(`[DATAPROVIDERS] checkLoginCustomUrl() ${domainUrl}`);
                  selectAdminServerConnection(dataProvider);
                  resolve(dataProvider);
                  return;
                }
                resolve(null);
              })
              .catch(failure => {
                ViewModelUtils.failureResponseDefaultHandling(failure);
                reject(failure);
              });
          }
          resolve(null);
        });
      }

      function getAdminServerConnectionByName(dataProviderName) {
        var dataProvider;
        const entry = connectionsModels().find(dataProvider => dataProvider.name === dataProviderName);
        if (CoreUtils.isNotUndefinedNorNull(entry) && (entry.type === DataProvider.prototype.Type.ADMINSERVER.name)) {
          dataProvider = entry;
        }
        return dataProvider;
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
                Logger.info('[DATAPROVIDERS] ipcMain.handle()->ipcRenderer.invoke()->getWorkingProject() "current-project-requesting" reply=null');
                project = ConsoleProjectManager.createFromEntry({name: ConsoleProject.prototype.UNNAMED_PROJECT});
              }
              else {
                // This means there was a "projects" field in
                // the auto-prefs.json file that CFE Electron
                // uses for persisting project metadata, and
                // reply.body.data was assigned the project
                // with a "current" true field.
                Logger.info(`[DATAPROVIDERS] ipcMain.handle()->ipcRenderer.invoke()->getWorkingProject() "current-project-requesting" reply=${JSON.stringify(reply)}`);
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
              addEventListeners();
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
        loadConnectionsModels();
        setTimeout(() => {
          if (viewParams.onTabStripContentHidden()) {
            viewParams.onTabStripContentVisible(true);
          }
          chooseStartupTask();
          // Add "mouseenter" and "mouseleave" event
          // listener to list items
          addEventListeners();
          // Set name pf current project.
          setProjectAlias(project.name);
          }, 5
        );
      }

      function submitWDTModelChanges(dataProvider) {
        return new Promise(function (resolve, reject) {
          if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
            const rootViewModel = ko.dataFor(document.getElementById('globalBody'));
            if (rootViewModel !== null) {
              // Here, rootViewModel.moduleConfig() returns
              // a fulfilled Promise.
              rootViewModel.moduleConfig()
                .then(moduleConfig => {
                  // Project can be switched without a module config available
                  if (CoreUtils.isUndefinedOrNull(moduleConfig.viewModel.wlsModuleConfig)) {
                    return Promise.resolve(null);
                  }
                  return moduleConfig.viewModel.wlsModuleConfig();
                })
                .then(wlsModuleConfig => {
                  if (CoreUtils.isUndefinedOrNull(wlsModuleConfig)) {
                    resolve(true);
                  }
                  else {
                    const eventType = (ViewModelUtils.isElectronApiAvailable() ? 'autoDownload' : 'navigation');
                    resolve(wlsModuleConfig.viewModel.canExit(eventType));
                  }
                })
                .catch(failure => {
                  resolve(true);
                });
            }
            else {
              resolve(true);
            }
          }
          else {
            resolve(true);
          }
        });
      }

      function deactivateDataProviders(dataProviders) {
        const start = async () => {
          await CoreUtils.asyncForEach(dataProviders, async (dataProvider) => {
            switch(dataProvider.type) {
              case DataProvider.prototype.Type.ADMINSERVER.name: {
                  DataProviderManager.removeAdminServerConnection(dataProvider)
                    .then( result => {
                      if (result.succeeded) {
                        viewParams.signaling.dataProviderRemoved.dispatch(dataProvider);
                      }
                      else {
                        ViewModelUtils.failureResponseDefaultHandling(result.failure);
                      }
                    })
                    .catch(response => {
                      ViewModelUtils.failureResponseDefaultHandling(response.failure);
                    });
                }
                break;
              case DataProvider.prototype.Type.MODEL.name: {
                  submitWDTModelChanges(dataProvider)
                    .then(result => {
                      DataProviderManager.removeWDTModel(dataProvider)
                        .then(result => {
                          if (result.succeeded) {
                            viewParams.signaling.dataProviderRemoved.dispatch(dataProvider);
                          }
                          else {
                            ViewModelUtils.failureResponseDefaultHandling(result.failure);
                          }
                        })
                        .catch(response => {
                          ViewModelUtils.failureResponseDefaultHandling(response.failure);
                        });
                    })
                    .catch(failure => {
                      ViewModelUtils.failureResponseDefaultHandling(failure);
                    });
                }
                break;
              case DataProvider.prototype.Type.COMPOSITE.name: {
                  DataProviderManager.removeWDTCompositeModel(dataProvider)
                    .then( result => {
                      if (result.succeeded) {
                        viewParams.signaling.dataProviderRemoved.dispatch(dataProvider);
                      }
                      else {
                        ViewModelUtils.failureResponseDefaultHandling(result.failure);
                      }
                    })
                    .catch(response => {
                      ViewModelUtils.failureResponseDefaultHandling(response.failure);
                    });
                }
                break;
              case DataProvider.prototype.Type.PROPERTIES.name: {
                  DataProviderManager.removePropertyList(dataProvider)
                    .then( result => {
                      if (result.succeeded) {
                        viewParams.signaling.dataProviderRemoved.dispatch(dataProvider);
                      }
                      else {
                        ViewModelUtils.failureResponseDefaultHandling(result.failure);
                      }
                    })
                    .catch(response => {
                      ViewModelUtils.failureResponseDefaultHandling(response.failure);
                    });
                }
                break;
            }
          });
        };
        return Promise.resolve(start());
      }

      function quiesceDataProviders(dataProviders) {
        const start = async () => {
          await CoreUtils.asyncForEach(dataProviders, async (dataProvider) => {
            DataProviderManager.quiesceDataProvider(dataProvider)
              .then( result => {
                if (result.succeeded) {
                  viewParams.signaling.dataProviderRemoved.dispatch(dataProvider);
                  if (dataProvider.type !== DataProvider.prototype.Type.ADMINSERVER.name) {
                    delete dataProvider['fileContents'];
                    delete self.contentFiles[dataProvider.id];
                  }
                }
                else {
                  ViewModelUtils.failureResponseDefaultHandling(result.failure);
                }
              })
              .catch(response => {
                ViewModelUtils.failureResponseDefaultHandling(response.failure);
              });
          });
        };
        return Promise.resolve(start());
      }

      /**
       *
       * @param {DataProvider[]} dataProviders
       * @private
       */
      function setDataProvidersClassField(dataProviders) {
        dataProviders.forEach((dataProvider) => {
          switch (dataProvider.type) {
            case DataProvider.prototype.Type.ADMINSERVER.name:
              dataProvider.putValue('class', 'oj-navigationlist-item-icon oj-ux-ico-domain cfe-provider-icon');
              break;
            case DataProvider.prototype.Type.MODEL.name:
              dataProvider.putValue('class', 'oj-navigationlist-item-icon oj-ux-ico-file-other cfe-provider-icon');
              break;
            case DataProvider.prototype.Type.COMPOSITE.name:
              dataProvider.putValue('class', 'oj-navigationlist-item-icon oj-ux-ico-composite-form cfe-provider-icon');
              break;
            case DataProvider.prototype.Type.PROPERTIES.name:
              dataProvider.putValue('class', 'oj-navigationlist-item-icon oj-ux-ico-custom-properties cfe-provider-icon');
              break;
          }
        });
      }

      /**
       * Returns a new instance of a DialogFields class, for a given ``dataProviderType``.
       * @param {DataProvider.prototype.Type} dataProviderType
       * @returns {DialogFields}
       * @private
       */
      function getDialogFields(dataProviderType) {
        const dialogFields = new DialogFields();
        dialogFields.putValue('id', `${DataProviderManager.getNextDataProviderId(dataProviderType)}`);
        dialogFields.addField('name');
        dialogFields.putValue('type', dataProviderType.name);
        dialogFields.putValue('readonly', CoreUtils.isUndefinedOrNull(window.electron_api));
        dialogFields.putValue('selectProps', false);

        switch(dataProviderType) {
          case DataProvider.prototype.Type.ADMINSERVER:
            dialogFields.putValue('url', 'http://localhost:7001');
            dialogFields.addField('username');
            dialogFields.addField('password');
            break;
          case DataProvider.prototype.Type.MODEL:
            dialogFields.putValue('selectProps', true);
            dialogFields.putValue('propProvider', '');
          case DataProvider.prototype.Type.PROPERTIES:
            dialogFields.addField('file');
            break;
          case DataProvider.prototype.Type.COMPOSITE:
            dialogFields.putValue('modelProviders', []);
            break;
        }

        return dialogFields;
      }

      /**
       *
       * @param {DataProvider} dataProvider
       * @returns {DialogFields}
       * @private
       */
      function createDialogFields(dataProvider){
        const dialogFields = new DialogFields();
        dialogFields.putValue('id', dataProvider.id);
        dialogFields.putValue('name', dataProvider.name);
        dialogFields.putValue('type', dataProvider.type);
        // The "readonly" dialog field is used to set
        // readonly attribute on the "File:" field.
        // Set it based on whether we're running as
        // an Electron app (false), not not (true).
        dialogFields.putValue('readonly', CoreUtils.isUndefinedOrNull(window.electron_api));
        dialogFields.putValue('selectProps', false);

        switch(dataProvider.type) {
          case DataProvider.prototype.Type.ADMINSERVER.name:
            dialogFields.putValue('url', dataProvider.url);
            dialogFields.putValue('username', dataProvider.username);
            dialogFields.putValue('password', dataProvider.password);
            break;
          case DataProvider.prototype.Type.MODEL.name:
            dialogFields.putValue('selectProps', true);
            dialogFields.putValue('propProvider', getPropertyListProvider(dataProvider.properties));
          case DataProvider.prototype.Type.PROPERTIES.name:
            dialogFields.putValue('file', (ViewModelUtils.isElectronApiAvailable() ? dataProvider.file : ''));
            break;
          case DataProvider.prototype.Type.COMPOSITE.name:
            dialogFields.putValue('modelProviders', getWDTModelProviders(dataProvider.models));
            break;
        }
        return dialogFields;
      }

      /**
       *
       * @param {DataProvider.prototype.Type} dataProviderType
       * @param {DialogFields} dialogFields
       * @returns {DataProvider}
       * @private
       */
      function addDialogFields(dataProviderType, dialogFields) {
        let dataProvider;
        switch(dataProviderType) {
          case DataProvider.prototype.Type.ADMINSERVER:
            dataProvider = DataProviderManager.createAdminServerConnection({id: dialogFields.id, name: dialogFields.name, type: dialogFields.type, beanTrees: []});
            dataProvider.putValue('url', dialogFields.url);
            dataProvider.putValue('username', dialogFields.username);
            dataProvider.putValue('password', dialogFields.password);
            break;
          case DataProvider.prototype.Type.MODEL:
            dataProvider = DataProviderManager.createWDTModel({id: dialogFields.id, name: dialogFields.name, type: dialogFields.type, beanTrees: []});
            dataProvider.putValue('file', dialogFields.file);
            dataProvider.putValue('propProvider', dialogFields.propProvider);
            var propListNames = getPropertyListNames(dialogFields.propProvider);
            if (CoreUtils.isNotUndefinedNorNull(propListNames)) dataProvider.putValue('properties', propListNames);
            break;
          case DataProvider.prototype.Type.COMPOSITE:
            dataProvider = DataProviderManager.createWDTCompositeModel({ id: dialogFields.id, name: dialogFields.name, type: dialogFields.type, beanTrees: [] });
            dataProvider.putValue('modelProviders', dialogFields.modelProviders);
            dataProvider.putValue('models', getWDTModelNames(dialogFields.modelProviders));
            break;
          case DataProvider.prototype.Type.PROPERTIES:
            dataProvider = DataProviderManager.createPropertyList({id: dialogFields.id, name: dialogFields.name, type: dialogFields.type, beanTrees: []});
            dataProvider.putValue('file', dialogFields.file);
            break;
        }
        setDataProvidersClassField([dataProvider]);
        return dataProvider;
      }

      /**
       *
       * @param {DataProvider} dataProvider
       * @private
       */
      function revertDialogFields(dataProvider) {
        if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
          self.dialogFields().name = dataProvider.name;
          // Proceed based on value of dataProvider.type
          switch (dataProvider.type) {
            case DataProvider.prototype.Type.ADMINSERVER.name:
              self.dialogFields().url = dataProvider.url;
              self.dialogFields().username = dataProvider.username;
              self.dialogFields().password = dataProvider.password;
              break;
            case DataProvider.prototype.Type.MODEL.name:
              self.dialogFields().propProvider = dataProvider.propProvider;
            case DataProvider.prototype.Type.PROPERTIES.name:
              delete self.contentFiles[dataProvider.id];
              self.dialogFields().file = (ViewModelUtils.isElectronApiAvailable() ? dataProvider.file : '');
              break;
            case DataProvider.prototype.Type.COMPOSITE.name:
              self.dialogFields().modelProviders = dataProvider.modelProviders;
              break;
          }
        }
      }

      /**
       *
       * @param {DataProvider} dataProvider
       * @param {DialogFields} dialogFields
       * @returns {DataProvider}
       * @private
       */
      function updateDataProvider(dataProvider, dialogFields) {
        dataProvider.putValue('name', dialogFields.name);
        for (const i in dataProvider.beanTrees)
        {
          if (CoreUtils.isNotUndefinedNorNull(dataProvider.beanTrees[i].provider)) {
            dataProvider.beanTrees[i].provider['name'] = dialogFields.name;
          }
        }

        switch(dataProvider.type) {
          case DataProvider.prototype.Type.ADMINSERVER.name:
            dataProvider.putValue('url', dialogFields.url);
            dataProvider.putValue('username', dialogFields.username);
            dataProvider.putValue('password', dialogFields.password);
            break;
          case DataProvider.prototype.Type.MODEL.name:
            dataProvider.putValue('file', dialogFields.file);
            dataProvider.putValue('propProvider', dialogFields.propProvider);
            var propListNames = getPropertyListNames(dialogFields.propProvider);
            if (CoreUtils.isNotUndefinedNorNull(propListNames)) {
              dataProvider.putValue('properties', propListNames);
            }
            else {
              dataProvider.removeField('properties');
            }
          case DataProvider.prototype.Type.PROPERTIES.name:
            if (CoreUtils.isNotUndefinedNorNull(dialogFields.file)) {
              dataProvider.putValue('file', dialogFields.file);
            }
            break;
          case DataProvider.prototype.Type.COMPOSITE.name:
            dataProvider.putValue('modelProviders', dialogFields.modelProviders);
            dataProvider.putValue('models', getWDTModelNames(dialogFields.modelProviders));
            break;
        }

        return dataProvider;
      }

      /**
       *
       * @param {DataProvider} newDataProvider
       * @private
       */
      function addConnectionsModels(newDataProvider){
        const index = connectionsModels().map(dataProvider => dataProvider.id).indexOf(newDataProvider.id);
        if (index === -1) connectionsModels.push(newDataProvider);
        $(`#${newDataProvider.id}`)
          .on('mouseenter', onMouseEnter)
          .on('mouseleave', onMouseLeave);
      }

      /**
       *
       * @param {DataProvider} newDataProvider
       * @private
       */
      function updateConnectionsModels(newDataProvider) {
        if (newDataProvider.type === DataProvider.prototype.Type.ADMINSERVER.name && !newDataProvider.lastConnectionAttemptSuccessful) {
          return;
        }

        const index = connectionsModels().map(dataProvider => dataProvider.id).indexOf(newDataProvider.id);
        if (index === -1) connectionsModels.push(newDataProvider);
        loadConnectionsModels();
        setTimeout(() => {
            addEventListeners();
            setListItemColor(connectionsModels());
          }, 5
        );
      }

      /**
       *
       * @param {DataProvider} newDataProvider
       * @private
       */
       function replaceConnectionsModels(newDataProvider) {
        const index = connectionsModels().map(dataProvider => dataProvider.id).indexOf(newDataProvider.id);
        if (index !== -1) {
          setDataProvidersClassField([newDataProvider]);
          connectionsModels()[index] = newDataProvider;
          setListItemColor([newDataProvider]);
        }
      }

      /**
       *
       * @param {string} listItemId
       * @private
       */
      function deleteConnectionsModels(listItemId){
        const index = connectionsModels().map(dataProvider => dataProvider.id).indexOf(listItemId);
        if (index !== -1) {
          connectionsModels.valueWillMutate();
          connectionsModels().splice(index, 1);
          connectionsModels.valueHasMutated();
        }
      }

      function quiesceConnectionsModels(dataProviders){
        let quiescedCount = 0;
        for (const dataProvider of dataProviders) {
          const index = connectionsModels().map(item => item.id).indexOf(dataProvider.id);
          if (index !== -1) {
            connectionsModels.valueWillMutate();
            connectionsModels()[index].state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
            connectionsModels()[index].connectivity = CoreTypes.Console.RuntimeMode.DETACHED.name;
            if (dataProvider.type === DataProvider.prototype.Type.ADMINSERVER.name) {
              delete connectionsModels()[index].password;
            }
            connectionsModels.valueHasMutated();
            quiescedCount++;
          }
        }
        if (quiescedCount > 0) {
          setTimeout(() => {
              addEventListeners();
              setListItemColor(connectionsModels());
            }, 5
          );
        }
      }

      function clearConnectionsModels() {
        connectionsModels.removeAll();
      }

      function sortConnectionModels() {
        connectionsModels.sort((left, right) => {
          if (left.type < right.type)
            return -1;
          if (left.type > right.type)
            return 1;
          return 0;
        });
        loadConnectionsModels();
        setTimeout(() => {
            addEventListeners();
            setListItemColor(connectionsModels());
          }, 5
        );
      }

      function setResponseMessageVisibility(selector, visible) {
        const div = document.getElementById(selector);
        if (div !== null) {
          div.style.display = (visible ? 'inline-flex' : 'none');
        }
      }

      function setListItemColor(dataProviders) {
        for (const i in dataProviders) {
          $(`#${dataProviders[i].id} span.cfe-provider-icon`).css('color', (dataProviders[i].state === CoreTypes.Domain.ConnectState.CONNECTED.name ? PROVIDER_ACTIVATED_COLOR : PROVIDER_DEACTIVATED_COLOR));
          $(`#${dataProviders[i].id} span.oj-navigationlist-item-label`).css('color', (dataProviders[i].state === CoreTypes.Domain.ConnectState.CONNECTED.name ? PROVIDER_ACTIVATED_COLOR : PROVIDER_DEACTIVATED_COLOR));
        }
      }

      function selectAdminServerConnection(dataProvider, navtreeReset = false) {
        if (dataProvider.state === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
          DataProviderManager.activateAdminServerConnection(dataProvider)
            .then(reply => {
              dataProvider.populateFromResponse(reply.body.data);
              if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
                self.responseMessage('');
                setResponseMessageVisibility('connection-response-message', false);
                self.project.upsertDataProvider(dataProvider);
                updateConnectionsModels(dataProvider);
                dispatchElectronApiSignal('project-changing');
                viewParams.onCachedStateChanged(self.tabNode, self.project);
                useSucceededHandler(dataProvider, navtreeReset);
              }
              else if (dataProvider.state === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
                setListItemColor([dataProvider]);
                self.responseMessage(reply.failureReason);
                setResponseMessageVisibility('connection-response-message', true);
                editAdminServerConnection(dataProvider);
              }
            })
            .catch(response => {
              ViewModelUtils.failureResponseDefaultHandling(response);
            });
        }
        else if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
          activateDataProvider(dataProvider);
        }
      }

      function selectWDTModel(dataProvider, navtreeReset = false) {
        // Check the property list reference on the model
        // and then select the model provider...
        checkPropertyListSelectWDTModel(dataProvider, navtreeReset);
      }

      /**
       * Common logic to select the data providers using file content
       * deal with the creating the form data and doing the upload.
       */
      function selectContentFileProvider(dataProvider, navtreeReset = false) {
        if (dataProvider.state === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
          if (CoreUtils.isNotUndefinedNorNull(dataProvider.fileContents)) {
            // We're not connected, but we have the file contents.
            const blob = self.contentFiles[dataProvider.id];
            if (CoreUtils.isUndefinedOrNull(blob)) {
              const formData = getContentFileFormData(dataProvider);
              sendContentFileFormData(dataProvider, formData, navtreeReset);
              delete self.contentFiles[dataProvider.id];
            }
          }
          else {
            createContentFileBlob(dataProvider, navtreeReset);
          }
        }
        else if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
          // We're connected, so the "fileContents" field should already
          // be here.
          if (CoreUtils.isUndefinedOrNull(dataProvider['fileContents'])) {
            if (CoreUtils.isNotUndefinedNorNull(dataProvider.file)) {
              // It's not, so set file name to an empty string,
              // which will cause the user to be prompted to
              // choose the physical file.
              dataProvider.file = '';
            }
            // Put up dialog, so user can choose the
            // file to associated with the data provider.
            editDataProvider(dataProvider);
          }
          else {
            // We're good to go, so "activate" or make this the
            // data provider user is currently working with.
            activateDataProvider(dataProvider);
          }
        }
      }

      function selectWDTCompositeModel(dataProvider, navtreeReset = false) {
        if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
          // Composite is connected just activate the provider...
          activateDataProvider(dataProvider);
          return;
        }

        // Check and map the models to their dataproviders and if unable
        // to map the model names 1-1, have the user edit the composite...
        if (CoreUtils.isUndefinedOrNull(dataProvider['modelProviders'])) {
          const dataproviders = getWDTModelProviders(dataProvider.models);
          if ((dataproviders.length === 0) || (dataproviders.length !== dataProvider.models.length)) {
            const models = (CoreUtils.isNotUndefinedNorNull(dataProvider.models) ? dataProvider.models : []);
            self.responseMessage(self.i18n.messages.response.modelsNotFound.detail.replace('{0}', models));
            setResponseMessageVisibility('model-composite-response-message', true);
            editWDTCompositeModel(dataProvider);
            return;
          }
          // Set the list of dataproviders used to create the composite dataprovider
          dataProvider['modelProviders'] = dataproviders;
        }

        // IFF all the model dataproviders are not ready then upload the model files...
        const modelProviders = getWDTModelProviders(dataProvider.models, true);
        if (!modelProviders.every(isProviderContentReady)) {
          if (!ViewModelUtils.isElectronApiAvailable()) {
            // Unable to updload model files when using the browser only, so
            // display a message to first select all the WDT model providers
            MessageDisplaying.displayMessage({
              severity: 'info',
              summary: self.i18n.messages.response.selectModels.detail
            }, 10000);
            return;
          }
          // Perform the uploads syncrhonously and then return later on to do the
          // activate of the composite dataprovider after the uploads complete!
          uploadCompositeModelFiles(dataProvider, modelProviders, navtreeReset);
        }
        else {
          DataProviderManager.activateWDTCompositeModel(dataProvider)
            .then(reply => {
              dataProvider.populateFromResponse(reply.body.data);
              if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
                self.responseMessage('');
                setResponseMessageVisibility('model-composite-response-message', false);
                self.project.upsertDataProvider(dataProvider);
                updateConnectionsModels(dataProvider);
                dispatchElectronApiSignal('project-changing');
                viewParams.onCachedStateChanged(self.tabNode, self.project);
                useSucceededHandler(dataProvider, navtreeReset);
              }
              else if (dataProvider.state === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
                setListItemColor([dataProvider]);
                self.responseMessage(reply.failureReason);
                setResponseMessageVisibility('model-composite-response-message', true);
                editWDTCompositeModel(dataProvider);
              }
            })
            .catch(response => {
              ViewModelUtils.failureResponseDefaultHandling(response);
            });
        }
      }

      function selectPropertyList(dataProvider, navtreeReset = false) {
        // Perform the file content handling and select the provider
        selectContentFileProvider(dataProvider, navtreeReset);
      }

      function createContentFileBlob(dataProvider, navtreeReset) {
        const blob = self.contentFiles[dataProvider.id];
        if (CoreUtils.isNotUndefinedNorNull(blob)) {
          createUploadContentFileFormData(dataProvider)
            .then(formData => {
              sendContentFileFormData(dataProvider, formData, navtreeReset);
              delete self.contentFiles[dataProvider.id];
            })
            .catch(failure => {
              viewParams.signaling.dataProviderLoadFailed.dispatch(dataProvider);
              if (failure?.failureReason?.name === 'YAMLException') {
                delete self.contentFiles[dataProvider.id];
                const failureMessage = ViewModelUtils.getYAMLExceptionFailureMessage(failure);
                const displayedMessage = `${oj.Translations.getTranslatedString('wrc-data-providers.messages.correctiveAction.fixModelFile.detail')}<ul><li>${failureMessage}.</li></ul>`;
                self.responseMessage(displayedMessage);
                setResponseMessageVisibility('model-response-message', true);
                editDataProvider(dataProvider);
              }
              else {
                ViewModelUtils.failureResponseDefaultHandling(failure);
              }
            });
        }
        else {
          if (ViewModelUtils.isElectronApiAvailable()) {
            // Get the file contents, so we can create
            // the multipart/form POST we need to get
            // a session for the provider type.
            window.electron_api.ipc.invoke('file-reading', {filepath: dataProvider.file, allowDialog: false})
              .then(response => {
                if (CoreUtils.isNotUndefinedNorNull(response) && CoreUtils.isNotUndefinedNorNull(response.file)) {
                  // This means the user picked the file and it was read.
                  Logger.info(`[DATAPROVIDERS] ipcMain.handle()->ipcRenderer.invoke()->createContentFileBlob(dataProvider) 'file-reading' file=${response.file}`);
                  // Ensure the media type for a properties dataprovider is always plain text
                  const mediaType = ((dataProvider.type === DataProvider.prototype.Type.PROPERTIES.name) ? 'text/plain' : response.mediaType);
                  self.contentFiles[dataProvider.id] = new Blob([response.fileContents], {type: mediaType});
                  self.contentFile(response.file);
                  dataProvider.file = response.file;
                  createUploadContentFileFormData(dataProvider)
                    .then(formData => {
                      sendContentFileFormData(dataProvider, formData, navtreeReset);
                      delete self.contentFiles[dataProvider.id];
                    })
                    .catch(failure => {
                      viewParams.signaling.dataProviderLoadFailed.dispatch(dataProvider);
                      if (failure?.failureReason?.name === 'YAMLException') {
                        delete self.contentFiles[dataProvider.id];
                        const failureMessage = ViewModelUtils.getYAMLExceptionFailureMessage(failure);
                        const displayedMessage = `${oj.Translations.getTranslatedString('wrc-data-providers.messages.correctiveAction.fixModelFile.detail')}<ul><li>${failureMessage}.</li></ul>`;
                        self.responseMessage(displayedMessage);
                        setResponseMessageVisibility('model-response-message', true);
                        editDataProvider(dataProvider);
                      }
                      else {
                        ViewModelUtils.failureResponseDefaultHandling(failure);
                      }
                    });
                }
              })
              .catch(failure => {
                viewParams.signaling.dataProviderLoadFailed.dispatch(dataProvider);
                const failureMessage = failure.message.match(/(File does not exist.+)/);
                if (failureMessage !== null) {
                  const displayedMessage = `${oj.Translations.getTranslatedString('wrc-data-providers.messages.correctiveAction.filePathNotFound.detail')}<ul><li>${failureMessage[0]}.</li></ul>`;
                  self.responseMessage(displayedMessage);
                  setResponseMessageVisibility('model-response-message', true);
                  editDataProvider(dataProvider);
                }
                else {
                  ViewModelUtils.failureResponseDefaultHandling(failure);
                }
              });
          }
          else {
            // Put up dialog, so user can choose the
            // file to associated with the data provider.
            editDataProvider(dataProvider);
          }
        }
      }

      function sendContentFileFormData(dataProvider, formData, navtreeReset) {
        uploadDataProviderFormData(dataProvider, formData)
          .then(reply => {
            dataProvider.populateFromResponse(reply.body.data);
            if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
              self.responseMessage('');
              setResponseMessageVisibility('model-response-message', false);
              self.project.upsertDataProvider(dataProvider);
              updateConnectionsModels(dataProvider);
              dispatchElectronApiSignal('project-changing');
              viewParams.onCachedStateChanged(self.tabNode, self.project);
              useSucceededHandler(dataProvider, navtreeReset);
            }
            else if (dataProvider.state === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
              setListItemColor([dataProvider]);
              self.responseMessage(reply.failureReason);
              setResponseMessageVisibility('model-response-message', true);
              editDataProvider(dataProvider);
            }
          })
          .catch(response => {
            dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
            viewParams.signaling.dataProviderLoadFailed.dispatch(dataProvider);
            delete dataProvider['fileContents'];
            let responseErrorMessages = {html: '<p/>'};
            if (CoreUtils.isError(response)) {
              response.body.messages.push({message: response});
            }
            else if (response.transport.status === 0) {
              response.body.messages.push({message: response.failureReason});
            }
            responseErrorMessages = ViewModelUtils.getResponseErrorMessages(
              response,
              oj.Translations.getTranslatedString('wrc-data-providers.messages.correctiveAction.fixModelFile.detail')
            );
            self.responseMessage(responseErrorMessages.html);
            setResponseMessageVisibility('model-response-message', true);
            editDataProvider(dataProvider);
          });
      }

      function useSucceededHandler(dataProvider, navtreeReset) {
        if (self.project.name === null) {
          // Add selected data provider to "in-memory"
          // project, using ConsoleProject.prototype.UNNAMED_PROJECT
          // as the name.
          self.project.name = ConsoleProject.prototype.UNNAMED_PROJECT;
          ConsoleProjectManager.add(self.project);
        }

        activateDataProvider(dataProvider, navtreeReset);
      }

      function activateDataProvider(dataProvider, navtreeReset = false) {
        // Set color of list item for data provider,
        // to indicate that it has been activated.
        setListItemColor([dataProvider]);
        // Set runtime property associated with the
        // activated data provider. It is essentially
        // a "centralized announcement" of which data
        // provider anything not listening for signals
        // relating to data providers, needs to use.
        // Signaling is (or should) only used in modules
        // under the src/js/viewModels folder.
        Runtime.setDataProviderId(dataProvider.id);
        // Set runtime property associated with the
        // runtime mode (e.g. "connected", "disconnected")
        // the CFE is running in.
        Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE, dataProvider.state);
        // Send signal about domain being changed, if
        // this is an "adminserver" data provider.
        if (dataProvider.type === DataProvider.prototype.Type.ADMINSERVER.name) {
          Runtime.setProperty(Runtime.PropertyName.CBE_WLS_USERNAME, dataProvider.username);
          viewParams.signaling.domainChanged.dispatch('dataproviders');
        }
        // Send signal about the runtime mode (e.g.
        // "ONLINE", "OFFLINE", "DETACHED") the CFE
        // console is running in.
        viewParams.signaling.modeChanged.dispatch(dataProvider.connectivity);
        // Send signal about data provider being selected.
        viewParams.signaling.dataProviderSelected.dispatch(dataProvider, navtreeReset);
        // Unselect the selected data provider list item,
        // to workaround the default JET behavior with
        // change events. Doing this allows the end user
        // to repeatedly click on the same list item.
        self.connectionsModelsSelectedItem(null);
        // Select 'dataproviders' tab strip and collapse console Kiosk
        viewParams.signaling.tabStripTabSelected.dispatch('dataproviders', 'dataproviders', false);
      }

      function removeSucceededHandler(dataProvider, showDialog = true) {
        // Remove from instance-scoped observable array.
        deleteConnectionsModels(dataProvider.id);
        // Handle scenario where all of the data providers
        // have been removed.
        if (connectionsModels().length === 0) {
          Runtime.setProperty(Runtime.PropertyName.CFE_MODE, CoreTypes.Console.RuntimeMode.UNATTACHED.name);
          // Send signal about the change in the runtime
          // mode of the CFE console.
          viewParams.signaling.modeChanged.dispatch(Runtime.getMode());
          // Use value of showDialog argument to decide
          // whether or not to show StartupTaskChooser
          // dialog (or whatever dialog is assigned to the
          // settings.projectManagement.defaultProviderType
          // field in console-frontend-jet.yaml file).
          if (showDialog) chooseStartupTask();
        }
        dataProvider.beanTrees = [...dataProvider.beanTrees];
        // Send signal about data provider being deleted.
        viewParams.signaling.dataProviderRemoved.dispatch(dataProvider);
      }

      function getContentFileFormData(dataProvider) {
        const formData = new FormData();
        // Add multipart section for the file contents
        formData.append(
          dataProvider.type,
          new Blob([dataProvider.fileContents]),
          dataProvider.file
        );

        // Create the data section specifying the name as the provider id
        const data = {
          name: dataProvider.id
        };

        // Add the property list reference when specified on the dataprovider
        if (CoreUtils.isNotUndefinedNorNull(dataProvider.propProvider) && (dataProvider.propProvider !== '')) {
          data['propertyLists'] = [dataProvider.propProvider];
        }

        // Add the multipart form data section
        formData.append(
          'data', JSON.stringify(data)
        );

        return formData;
      }

      function readContentFile(dataProvider, blob) {
        return new Promise((resolve, reject) => {
          // Declare reader for reading model file.
          const reader = new FileReader();

          // Callback that will be called when the
          // reader.readAsText() function is called.
          // The blob argument will contain the
          // File/Blob object for the model file.
          reader.onload = (function (theBlob) {
            return function (event) {
              const mediaType = ((dataProvider.type === DataProvider.prototype.Type.PROPERTIES.name) ? 'text/plain' : blob.type);
              DataProviderManager.checkProviderUploadContent(event.target.result,  mediaType)
                .then(reply => {
                  resolve(reply);
                })
                .catch(failure => {
                  reject(failure);
                });
            };
          })(blob);

          // Read in model file as a data URL.
          reader.readAsText(blob);
        });
      }

      async function createUploadContentFileFormData(dataProvider, blob = null) {
        const contentFileBlob = (CoreUtils.isUndefinedOrNull(blob) ? self.contentFiles[dataProvider.id] : blob);
        const reply = await readContentFile(dataProvider, contentFileBlob)
        dataProvider['fileContents'] = reply.body.data;
        return getContentFileFormData(dataProvider);
      }

      // Checks if provider content is ready for a WDT Model or Property List provider
      function isProviderContentReady(dataProvider) {
        // Check if the dataprovider is already connected and has the content file
        return ((dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name)
                && CoreUtils.isNotUndefinedNorNull(dataProvider['fileContents']));
      }

      function uploadCompositeModelFiles(compositeProvider, modelProviders, navtreeReset) {
        CoreUtils.asyncForEach(modelProviders, uploadModelProviderContentFile)
          .then(() => {
            Logger.info(`[DATAPROVIDERS] uploadCompositeModelFiles() completed for ${compositeProvider.name}`);
            selectWDTCompositeModel(compositeProvider, navtreeReset);
          })
          .catch(error => {
            ViewModelUtils.failureResponseDefaultHandling(getUploadContentFileFailure(error), 'error');
          });
      }

      function getUploadContentFileFailure(error) {
        var failure = error;
        if (CoreUtils.isError(error) && CoreUtils.isNotUndefinedNorNull(error.message)) {
          // When we have an Error, extract the message and create the failure...
          const reason = error.message.substring(error.message.indexOf(':') + 1);
          failure = {
            failureType: CoreTypes.FailureType.UNEXPECTED,
            failureReason: self.i18n.messages.upload.failed.detail.replace('{0}', reason)
          };
        }
        return failure;
      }

      async function uploadModelProviderContentFile(modelProvider) {
        // Check and attempt to upload the property list first when a reference exists
        // If there is a failure to upload properties, display the message and continue...
        if (isPropertyListSpecified(modelProvider.properties)) {
          const propProvider = getPropertyListProvider(modelProvider.properties, true);
          if (CoreUtils.isNotUndefinedNorNull(propProvider)) {
            self.i18n.messages.upload.failed.detail = oj.Translations.getTranslatedString('wrc-data-providers.messages.upload.props.failed.detail', '{0}');
            modelProvider['propProvider'] = propProvider.id;
            await uploadProviderContentFile(propProvider)
              .catch(error => {
                ViewModelUtils.failureResponseDefaultHandling(getUploadContentFileFailure(error), 'info');
              });
          }
        }

        // Now upload the model file...
        self.i18n.messages.upload.failed.detail = oj.Translations.getTranslatedString('wrc-data-providers.messages.upload.failed.detail', '{0}');
        await uploadProviderContentFile(modelProvider);
      }

      async function uploadProviderContentFile(dataprovider) {
        // Skip upload when the dataprovider is ready...
        if (isProviderContentReady(dataprovider)) {
          return Promise.resolve(true);
        }

        // Otherwise read the content file for the dataprovider and upload...
        const response = await window.electron_api.ipc.invoke('file-reading', {filepath: dataprovider.file, allowDialog: false});
        Logger.info(`[DATAPROVIDERS] uploadProviderContentFile() 'file-reading' file=${response.file}`);
        const blob = new Blob([response.fileContents], { type: response.mediaType });
        const formData = await createUploadContentFileFormData(dataprovider, blob);
        return uploadDataProviderFormData(dataprovider, formData)
          .then(reply => {
            dataprovider.populateFromResponse(reply.body.data);
            setListItemColor([dataprovider]);
            if (dataprovider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
              return Promise.resolve(true);
            }
            else {
              const failure = {
                failureType: CoreTypes.FailureType.UNEXPECTED,
                failureReason: self.i18n.messages.upload.failed.detail.replace('{0}', dataprovider.file)
              };
              return Promise.reject(failure);
            }
          })
          .catch(failure => {
            dataprovider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
            delete dataprovider['fileContents'];
            return Promise.reject(failure);
          });
      }

      // Check the referenced property list from the model for upload then select the model
      async function checkPropertyListSelectWDTModel(modelProvider, navtreeReset = false) {
        // Check and map the properties reference to the property list dataprovider...
        const propProvider = getPropertyListProvider(modelProvider.properties, true);
        const propProviderId = (CoreUtils.isUndefinedOrNull(propProvider) ? '' : propProvider.id)
        if (CoreUtils.isUndefinedOrNull(modelProvider['propProvider'])) {
          modelProvider['propProvider'] = propProviderId;
        }
        else if ((propProviderId !== '') && (propProviderId !== modelProvider['propProvider'])) {
          // If the poperty list provider was updated or replaced then update the model reference
          await DataProviderManager.updatePropertyListWDTModel(modelProvider, propProviderId)
            .catch(response => {
              ViewModelUtils.failureResponseDefaultHandling(response.failure);
            });
          modelProvider['propProvider'] = propProviderId;
        }

        // IFF the property list was specified but the provider was not found then display this information
        if (CoreUtils.isUndefinedOrNull(propProvider) && isPropertyListSpecified(modelProvider.properties)) {
          MessageDisplaying.displayMessage({
            severity: 'info',
            summary: self.i18n.messages.response.propListNotFound.detail.replace('{0}', modelProvider.properties[0])
          }, 5000);
        }

        // Where there is a property list reference, attempt to upload the properties
        // but if there are any problems, just display the failure and continue since the
        // property list is not required for the WDT model...
        if ((modelProvider.propProvider !== '') &&
             CoreUtils.isNotUndefinedNorNull(propProvider) &&
             !isProviderContentReady(propProvider)) {
          if (!ViewModelUtils.isElectronApiAvailable()) {
            // Unable to upload files when using the browser only, the model
            // provider will still get a reference to the properties and when
            // property list provider is selected the property values can be used.
            Logger.info(`[DATAPROVIDERS] skipping upload of property list provider: ${modelProvider.propProvider}`);
          }
          else {
            // Perform the upload for the property list provider and if there is any problem
            // diaplay the message but the error does not prevent selecting the model provider...
            self.i18n.messages.upload.failed.detail = oj.Translations.getTranslatedString('wrc-data-providers.messages.upload.props.failed.detail', '{0}');
            await uploadProviderContentFile(propProvider)
              .catch(error => {
                ViewModelUtils.failureResponseDefaultHandling(getUploadContentFileFailure(error), 'info');
              });
          }
        }

        // Now go an perform the file content handling and select the model provider!
        selectContentFileProvider(modelProvider, navtreeReset);
      }

      function showDataProviderInfo(dataProvider, popup) {
        self.i18n.popups.info.provider.id.value(dataProvider.id);
        switch(dataProvider.type){
          case DataProvider.prototype.Type.ADMINSERVER.name:
            self.i18n.popups.info.domain.name.value(dataProvider.domainName);
            self.i18n.popups.info.domain.url.value(dataProvider.url);
            self.i18n.popups.info.domain.version.value(dataProvider.domainVersion);
            self.i18n.popups.info.domain.username.value(dataProvider.username);
            self.i18n.popups.info.domain.roles.value(dataProvider.userRoles);
            self.i18n.popups.info.domain.connectTimeout.value(dataProvider.connectTimeout);
            self.i18n.popups.info.domain.readTimeout.value(dataProvider.readTimeout);
            break;
          case DataProvider.prototype.Type.MODEL.name:
            self.i18n.popups.info.model.file.value(CoreUtils.isNotUndefinedNorNull(dataProvider.file) ? dataProvider.file : oj.Translations.getTranslatedString('wrc-data-providers.prompts.info.fileNotSet.value'));
            var propsSet = (CoreUtils.isNotUndefinedNorNull(dataProvider.properties) && CoreUtils.isNotUndefinedNorNull(dataProvider.properties[0])) ? true : false;
            self.i18n.popups.info.model.props.value(propsSet ? dataProvider.properties[0] : undefined);
            break;
          case DataProvider.prototype.Type.COMPOSITE.name:
            self.i18n.popups.info.composite.models.value(CoreUtils.isNotUndefinedNorNull(dataProvider.models) ? dataProvider.models : []);
            break;
          case DataProvider.prototype.Type.PROPERTIES.name:
            self.i18n.popups.info.proplist.file.value(CoreUtils.isNotUndefinedNorNull(dataProvider.file) ? dataProvider.file : oj.Translations.getTranslatedString('wrc-data-providers.prompts.info.fileNotSet.value'));
            break;
        }
        popup.open('#' + dataProvider.id);
      }

      function addAdminServerConnection(dialogParams){
        const entryValues = getDialogFields(DataProvider.prototype.Type.ADMINSERVER);
        self.dialogFields(entryValues);

        self.i18n.dialog.title(self.i18n.titles.add.connections.value);
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString('wrc-data-providers.instructions.connections.add.value'));
        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString('wrc-common.buttons.ok.label'));

        self.responseMessage('');
        setResponseMessageVisibility('connection-response-message',false);

        DataProvidersDialog.showDataProvidersDialog('AddAdminServerConnection', dialogParams, self.i18n, isUniqueDataProviderName)
          .then(reply => {
            if (reply) {
              const dataProvider = addDialogFields(DataProvider.prototype.Type.ADMINSERVER, self.dialogFields());
              dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
              selectAdminServerConnection(dataProvider);
            }
          });
      }

      function getNewWDTModelDataByTemplate(template) {
        let data = Runtime.getProperty('settings.projectManagement.newModel.domain.fileContents');
        if (CoreUtils.isNotUndefinedNorNull(template) && ['domain', 'sparse'].includes(template)) {
          data = Runtime.getProperty(`settings.projectManagement.newModel.${template}.fileContents`);
        }
        return data;
      }

      /**
       * Displays the dialog box used to add a WDT Model provider, for a "new" or "existing" WDT model file.
       * <p>NOTE: The same dialog box is used to edit a WDT Model provider.</p>
       * @param {{action: "new"|"existing", type?: string, id?: string, accepts?: string}} dialogParams
       * @private
       */
      function addWDTModel(dialogParams) {
        const entryValues = getDialogFields(DataProvider.prototype.Type.MODEL);
        entryValues['action'] = dialogParams.action;
        entryValues['checkbox'] = (dialogParams.action === 'new');
        entryValues.file = (dialogParams.action === 'existing' ? '' : 'new-wdt-model.yaml');
        entryValues.readonly = (dialogParams.action === 'existing');

        self.dialogFields(entryValues);

        const actionSwitch = (value) => ({
          'new': 'new',
          'existing': 'add'
        })[value];
        const actionPart = actionSwitch(dialogParams.action);

        self.i18n.dialog.title(self.i18n.titles[actionPart].models.value);
        self.i18n.dialog.nameLabel(self.i18n.labels.models.name.value);
        self.i18n.dialog.fileLabel(self.i18n.labels.models.file.value);
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString(`wrc-data-providers.instructions.models.${actionPart}.value`));
        self.i18n.dialog.iconFile(dialogParams.action === 'existing' ? self.i18n.icons.choose.iconFile : self.i18n.icons.pick.iconFile);
        self.i18n.dialog.tooltip(dialogParams.action === 'existing' ? self.i18n.icons.choose.tooltip : self.i18n.icons.pick.tooltip);

        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString('wrc-common.buttons.ok.label'));

        self.useSparseTemplate([]);
        self.responseMessage('');
        setResponseMessageVisibility('model-response-message',false);

        // Set modelFile observable to "", which will make
        // clicking the "OK" button a no-op, until the end
        // user clicks the directory tree icon
        // (dialogParams.action = "new"), or the download
        // icon (dialogParams.action = "existing").
        self.contentFile('');

        // Setup the Property List selection values
        self.propProviderSelectedValue(self.dialogFields().propProvider);
        self.propProvidersDataProvider.data = getAvailablePropertyLists();

        DataProvidersDialog.showDataProvidersDialog('AddWDTModel', dialogParams, self.i18n, isUniqueDataProviderName)
          .then(reply => {
            if (reply) {
              self.dialogFields().file = self.contentFile();
              self.dialogFields().propProvider = self.propProviderSelectedValue();
              const dataProvider = addDialogFields(DataProvider.prototype.Type.MODEL, self.dialogFields());
              dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
              if (dialogParams.action === 'new') {
                delete self.contentFiles[dataProvider.id];
                const data = createNewWDTModelFile(self.contentFile(), 'file-writing', dataProvider);
                const mediaType = 'application/x-yaml';
                // The getWDTModelContent() function uses js-yaml to
                // convert the data/YAML into a JS object.
                DataProviderManager.checkProviderUploadContent(data, mediaType)
                  .then(reply => {
                    // Assign JS object to dataProvider's "fileContents"
                    // property.
                    dataProvider['fileContents'] = reply.body.data;
                    // Call selectWDTModel(), which is where the multipart
                    // POST creation/submission and model provider session
                    // activation happens.
                    selectWDTModel(dataProvider);
                  });
              }
              else {
                selectWDTModel(dataProvider);
              }
            }
            else {
              self.contentFile('');
              self.dialogFields().file = self.contentFile();
              self.propProviderSelectedValue('');
              self.dialogFields().propProvider = self.propProviderSelectedValue();
              self.responseMessage('');
              setResponseMessageVisibility('model-response-message', false);
            }
          });
      }

      /**
       * Displays the dialog box used to add a WDT Composite Model provider.
       * @private
       */
       function addWDTCompositeModel(dialogParams) {
        const entryValues = getDialogFields(DataProvider.prototype.Type.COMPOSITE);
        self.dialogFields(entryValues);

        self.i18n.dialog.title(self.i18n.titles.add.composite.value);
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString('wrc-data-providers.instructions.composite.add.value'));
        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString('wrc-common.buttons.ok.label'));

        self.responseMessage('');
        setResponseMessageVisibility('model-composite-response-message',false);

        // Setup the WDT Composite Model dialog values
        self.wdtProvidersSelectedValues(self.dialogFields().modelProviders);
        self.wdtProvidersDataProvider.data = getAvailableWDTModels();

        DataProvidersDialog.showDataProvidersDialog('AddWDTCompositeModel', dialogParams, self.i18n, isUniqueDataProviderName)
          .then(reply => {
            if (reply) {
              self.dialogFields().modelProviders = self.wdtProvidersSelectedValues();
              const dataProvider = addDialogFields(DataProvider.prototype.Type.COMPOSITE, self.dialogFields());
              dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
              selectWDTCompositeModel(dataProvider);
            }
            else {
              self.wdtProvidersSelectedValues([])
              self.responseMessage('');
              setResponseMessageVisibility('model-composite-response-message', false);
            }
          });
      }

      /**
       * Displays the dialog box used to add a Property List provider.
       * Uses the WDT model dialog box without checkbox for new property list.
       * @private
       */
       function addPropertyList(dialogParams) {
        const entryValues = getDialogFields(DataProvider.prototype.Type.PROPERTIES);
        entryValues['action'] = dialogParams.action;
        entryValues['checkbox'] = false;
        entryValues.file = (dialogParams.action === 'existing' ? '' : 'new-property-list.props');
        entryValues.readonly = (dialogParams.action === 'existing');

        self.dialogFields(entryValues);

        const actionSwitch = (value) => ({
          'new': 'new',
          'existing': 'add'
        })[value];
        const actionPart = actionSwitch(dialogParams.action);

        self.i18n.dialog.title(self.i18n.titles[actionPart].proplist.value);
        self.i18n.dialog.nameLabel(self.i18n.labels.proplist.name.value);
        self.i18n.dialog.fileLabel(self.i18n.labels.proplist.file.value);
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString(`wrc-data-providers.instructions.proplist.${actionPart}.value`));
        self.i18n.dialog.iconFile(dialogParams.action === 'existing' ? self.i18n.icons.choose.iconFile : self.i18n.icons.pick.iconFile);
        self.i18n.dialog.tooltip(dialogParams.action === 'existing' ? self.i18n.icons.choose.tooltip : self.i18n.icons.pick.tooltip);

        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString('wrc-common.buttons.ok.label'));

        self.responseMessage('');
        setResponseMessageVisibility('model-response-message',false);

        // Set the file observable to "", which will make
        // clicking the "OK" button a no-op, until the end
        // user clicks the directory tree icon
        self.contentFile('');

        DataProvidersDialog.showDataProvidersDialog('AddPropertyList', dialogParams, self.i18n, isUniqueDataProviderName)
          .then(reply => {
            if (reply) {
              self.dialogFields().file = self.contentFile();
              const dataProvider = addDialogFields(DataProvider.prototype.Type.PROPERTIES, self.dialogFields());
              dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
              if (dialogParams.action === 'new') {
                delete self.contentFiles[dataProvider.id];
                // Create the file content for a new properties file
                const data = createNewContentFile(newPropertyListContentFileData, self.contentFile(), 'file-writing', dataProvider);
                const mediaType = 'text/plain';
                DataProviderManager.checkProviderUploadContent(data, mediaType)
                  .then(reply => {
                    // Assign dataProvider file content and then select the provider
                    dataProvider['fileContents'] = reply.body.data;
                    selectPropertyList(dataProvider);
                  });
              }
              else {
                // Select the provider to check, upload and create the PropertyList
                selectPropertyList(dataProvider);
              }
            }
            else {
              self.contentFile('');
              self.dialogFields().file = self.contentFile();
              self.responseMessage('');
              setResponseMessageVisibility('model-response-message', false);
            }
          });
      }

      /**
       * Return the array of WDT Models currently available from the list of dataproviders.
       * @private
       */
       function getAvailableWDTModels() {
        var wdtModels = [];
        connectionsModels().forEach(dataprovider => {
          if (dataprovider.type === DataProvider.prototype.Type.MODEL.name) {
            wdtModels.push({
              value: dataprovider.id,
              label: dataprovider.name
            });
          }
        });
        return wdtModels;
      }

      /**
       * Return the array of Model names based on the array of dataprovider ids.
       * @private
       */
       function getWDTModelNames(dataProviderIds) {
        var models = [];
        dataProviderIds.forEach(dataproviderId => {
          models.push(connectionsModels().find(dataProvider => dataProvider.id === dataproviderId).name);
        });
        return models;
      }

      /**
       * Return the array of dataprovider ids or array of dataproviders based on the array of Model names.
       * @private
       */
       function getWDTModelProviders(models, isDataProvider = false) {
        var modelProviders = [];
        if (CoreUtils.isNotUndefinedNorNull(models)) {
          models.forEach(model => {
            const entry = connectionsModels().find(dataProvider => dataProvider.name === model);
            if (CoreUtils.isNotUndefinedNorNull(entry) && (entry.type === DataProvider.prototype.Type.MODEL.name)) {
              modelProviders.push(isDataProvider ? entry : entry.id);
            }
          });
        }
        return modelProviders;
      }

      /**
       * Return the array of Property Lists currently available from the list of dataproviders.
       * @private
       */
       function getAvailablePropertyLists() {
        var propertyLists = [];
        connectionsModels().forEach(dataprovider => {
          if (dataprovider.type === DataProvider.prototype.Type.PROPERTIES.name) {
            propertyLists.push({
              value: dataprovider.id,
              label: dataprovider.name
            });
          }
        });
        // Add an empty element to allow for picking no provider
        // as once an item is selected, there is no option to unselect
        // and the property list providers are optional...
        propertyLists.push({ value: '', label: self.i18n.labels.dropdown.none.value});
        return propertyLists;
      }

      /**
       * Return an array of Property List names based on the single dataprovider id
       * as the backend model provider allows multiple references to be specified.
       *
       * An null is returned when there is no dataprovider selected as the
       * property list reference for the model is optional...
       * @private
       */
       function getPropertyListNames(providerId) {
        var propertyNames = null;
        if (providerId !== '') {
          propertyNames = [connectionsModels().find(dataProvider => dataProvider.id === providerId).name];
        }
        return propertyNames;
      }

      /**
       * Check if there is a property list name entry in the array of property list names.
       * @private
       */
       function isPropertyListSpecified(propListNames) {
        return (CoreUtils.isNotUndefinedNorNull(propListNames) && CoreUtils.isNotUndefinedNorNull(propListNames[0]));
      }

      /**
       * Return the dataprovider id or the dataprovider based on first Property List name.
       *
       * An empty id or null provider is returned when there is no property list name as the
       * property list reference for the model is optional...
       * @private
       */
       function getPropertyListProvider(propListNames, isDataProvider = false) {
        if (isPropertyListSpecified(propListNames)) {
          const entry = connectionsModels().find(dataProvider => dataProvider.name === propListNames[0]);
          if (CoreUtils.isNotUndefinedNorNull(entry) && (entry.type === DataProvider.prototype.Type.PROPERTIES.name)) {
            return (isDataProvider ? entry : entry.id);
          }
        }
        return (isDataProvider ? null : '');
      }

      function addProject(dialogParams) {
        const entryValues = new DialogFields();
        entryValues.putValue('name', self.project.name);
        entryValues.putValue('file', self.project.filename);

        self.dialogFields(entryValues);

        self.i18n.dialog.title(self.i18n.titles.export.project.value);
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString('wrc-data-providers.instructions.project.export.value'));
        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString('wrc-common.buttons.ok.label'));

        DataProvidersDialog.showDataProvidersDialog('ExportAllToProject', dialogParams, self.i18n, undefined)
          .then(reply => {
            if (reply) {
              exportAllToProject(self.dialogFields());
            }
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
        viewParams.onCachedStateChanged(self.tabNode, self.project);
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
              Logger.info(`[DATAPROVIDERS] ipcMain.handle()->ipcRenderer.invoke()->sendProjectdNotification() '${channel}' reply=${JSON.stringify(reply)}`);
            })
            .catch(failure => {
              ViewModelUtils.failureResponseDefaultHandling(failure);
            });
        }
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

        DataProvidersDialog.showDataProvidersDialog('ImportProject', dialogParams, self.i18n, undefined)
          .then(reply => {
            if (reply) {
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

      function chooseStartupTask(startupTask = Runtime.getProperty(Runtime.PropertyName.CFE_STARTUP_TASK)) {
        if (startupTask !== 'triggered' && connectionsModels().length > 0) {
          return;
        }

        const startupTasks = [
          {id: 'adminserver', value: self.i18n.menus.connections.add.id, label: oj.Translations.getTranslatedString('wrc-data-providers.menus.connections.add.value')},
          {id: 'addModel', value: self.i18n.menus.models.add.id, label: oj.Translations.getTranslatedString('wrc-data-providers.menus.models.add.value')},
          {id: 'addModelComposite', value: self.i18n.menus.composite.add.id, label: oj.Translations.getTranslatedString('wrc-data-providers.menus.composite.add.value')},
          {id: 'addPropertyList', value: self.i18n.menus.proplist.add.id, label: oj.Translations.getTranslatedString('wrc-data-providers.menus.proplist.add.value')},
          {id: 'newModel', value: self.i18n.menus.models.new.id, label: oj.Translations.getTranslatedString('wrc-data-providers.menus.models.new.value')},
          {id: 'newPropertyList', value: self.i18n.menus.proplist.new.id, label: oj.Translations.getTranslatedString('wrc-data-providers.menus.proplist.new.value')},
          {id: 'importProject', value: self.i18n.menus.project.import.id, label: oj.Translations.getTranslatedString('wrc-data-providers.menus.project.import.value')}
        ];

        if (startupTask !== '' && startupTask !== 'none') {
          // There is a setting in console-frontend-jet.yaml, but we
          // still need to see if it a valid value.
          const result = startupTasks.find(type => type.id === startupTask);
          // Set startupTask to an empty string, if the settings value
          // was invalid.
          if (CoreUtils.isNotUndefinedNorNull(result)) {
            // startupTask needs to be converted to the menu
            // item id, which is the result.value value.
            startupTask = result.value;
          }
          else {
            // The setting in console-frontend.yaml is either
            // missing or invalid. Set startupTask to an empty
            // string, so the StartupTaskChooser dialog is shown.
            startupTask = '';
          }
        }

        if (startupTask !== '') {
          // We have a valid startup task, so just use it.
          useChosenStartupTask(startupTask);
        }
        else {
          const dialogParams = {};
          const entryValues = new DialogFields();
          entryValues.putValue('startupTask', self.i18n.menus.connections.add.id);
          entryValues.putValue('startupTasks', startupTasks);
          self.dialogFields(entryValues);

          // There was no settings value, or it was invalid.
          // In both cases, we need to show the provider type
          // chooser dialog.
          self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-data-providers.titles.startup.task.value'));
          self.i18n.dialog.instructions(oj.Translations.getTranslatedString('wrc-data-providers.instructions.task.startup.value'));
          self.i18n.buttons.ok.label(oj.Translations.getTranslatedString('wrc-common.buttons.choose.label'));

          DataProvidersDialog.showDataProvidersDialog('StartupTaskChooser', dialogParams, self.i18n, undefined)
            .then(reply => {
              if (reply) {
                useChosenStartupTask(self.dialogFields().startupTask);
              }
              else {
                self.dialogFields(initializeDialogFields());
              }
            });
        }
      }

      function useChosenStartupTask(startupTask) {
        if (startupTask !== 'none') self.projectMoreMenuClickListener({target: { value: startupTask}});
      }

      function isUniqueDataProviderName(selector) {
        const dialogFields = self.dialogFields();
        const result = connectionsModels().filter(dataProvider => dataProvider.name === dialogFields.name && dataProvider.id !== dialogFields.id);
        if (result.length > 0) {
          self.responseMessage(self.i18n.messages.response.nameAlreadyExist.detail.replace('{0}', dialogFields.name));
          setResponseMessageVisibility(selector, true);
        }
        return (result.length === 0);
      }

      function editAdminServerConnection(dataProvider) {
        const entryValues = createDialogFields(dataProvider);
        self.dialogFields(entryValues);

        self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-data-providers.titles.edit.connections.value'));
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString('wrc-data-providers.instructions.connections.edit.value'));
        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString('wrc-common.buttons.ok.label'));

        const dialogParams = {
          type: dataProvider.type,
          id: dataProvider.id,
          accepts: 'application/yaml,application/x-yaml,application/json'
        };

        DataProvidersDialog.showDataProvidersDialog('EditAdminServerConnection', dialogParams, self.i18n, isUniqueDataProviderName)
          .then(reply => {
            if (reply) {
              // FortifyIssueSuppression(C9827329D56593134375D08BC3A21847) Password Management: Password in Comment
              // Not a password, just a comment password property.
              const removeRequired = (dataProvider.url !== self.dialogFields().url || dataProvider.username !== self.dialogFields().username || dataProvider.password !== self.dialogFields().password);
              if ((removeRequired) && (dataProvider.state !== CoreTypes.Domain.ConnectState.DISCONNECTED.name)) {
                removeDataProvider(dataProvider)
                  .then(reply =>{
                    if (reply.succeeded) {
                      dataProvider = updateDataProvider(dataProvider, self.dialogFields());
                      dataProvider = DataProviderManager.createAdminServerConnection(dataProvider);
                      // Set state to disabled, because we need to set
                      // things up to get a provider session.
                      dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
                      replaceConnectionsModels(dataProvider);
                      // Dispatch the dataProviderSelected singal using navtreeReset as true
                      selectAdminServerConnection(dataProvider, true);
                    }
                    else {
                      ViewModelUtils.failureResponseDefaultHandling(reply.failure);
                    }
                  })
                  .catch(response => {
                    ViewModelUtils.failureResponseDefaultHandling(response.failure);
                  });
              }
              else {
                dataProvider = editUpdateDataProvider(dataProvider, self.dialogFields());
                // Dispatch the dataProviderSelected singal using navtreeReset as true
                selectAdminServerConnection(dataProvider, true);
              }
            }
            else {
              revertDialogFields(dataProvider);
              self.responseMessage('');
              setResponseMessageVisibility('connection-response-message', false);
            }
          });
      }

      /**
       * Displays the dialog box used to edit a WDT Model provider.
       * <p>NOTE: The same dialog box is used to add a WDT Model provider.</p>
       * @param {DataProvider} dataProvider
       * @private
       */
      function editWDTModel(dataProvider) {
        const entryValues = createDialogFields(dataProvider);
        entryValues['action'] = 'existing';
        self.dialogFields(entryValues);

        self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-data-providers.titles.edit.models.value'));
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString('wrc-data-providers.instructions.models.edit.value'));
        self.i18n.dialog.nameLabel(self.i18n.labels.models.name.value);
        self.i18n.dialog.fileLabel(self.i18n.labels.models.file.value);
        self.i18n.dialog.iconFile(self.i18n.icons.choose.iconFile);
        self.i18n.dialog.tooltip(self.i18n.icons.choose.tooltip);
        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString('wrc-common.buttons.ok.label'));

        const dialogParams = {
          type: dataProvider.type,
          id: dataProvider.id,
          accepts: 'application/yaml,application/x-yaml,application/json'
        };

        self.connectionsModelsSelectedItem(null);

        // Set the dialog box based on createDialogFields()
        self.contentFile(self.dialogFields().file);

        // Setup the Property List selection values
        self.propProviderSelectedValue(self.dialogFields().propProvider);
        self.propProvidersDataProvider.data = getAvailablePropertyLists();

        // Finally, we need to show the "Edit WDT Model" dialog,
        // mainly for the purpose of getting the model file.
        DataProvidersDialog.showDataProvidersDialog('EditWDTModel', dialogParams, self.i18n, isUniqueDataProviderName)
          .then(reply => {
            if (reply) {
              self.dialogFields().file = self.contentFile();
              self.dialogFields().propProvider = self.propProviderSelectedValue();
              let removeRequired = (dataProvider.file !== self.contentFile() || CoreUtils.isNotUndefinedNorNull(self.contentFiles[dataProvider.id]));
              if (!removeRequired && CoreUtils.isNotUndefinedNorNull(dataProvider.propProvider)) {
                // Determine if property list reference has been removed which also requires a dataprovider remove
                removeRequired = ((dataProvider.propProvider !== '') && (self.dialogFields().propProvider === ''));
              }
              if ((removeRequired) && (dataProvider.state !== CoreTypes.Domain.ConnectState.DISCONNECTED.name)) {
                // Remove fileContents property before proceeding.
                delete dataProvider['fileContents'];
                removeDataProvider(dataProvider)
                  .then(reply =>{
                    if (reply.succeeded) {
                      dataProvider = updateDataProvider(dataProvider, self.dialogFields());
                      dataProvider = DataProviderManager.createWDTModel(dataProvider);
                      dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
                      replaceConnectionsModels(dataProvider);
                      // Dispatch the dataProviderSelected singal using navtreeReset as true
                      selectWDTModel(dataProvider, true);
                    }
                    else {
                      ViewModelUtils.failureResponseDefaultHandling(reply.failure);
                    }
                  })
                  .catch(response => {
                    ViewModelUtils.failureResponseDefaultHandling(response.failure);
                  });
              }
              else if (CoreUtils.isNotUndefinedNorNull(dataProvider.propProvider) &&
                       (dataProvider.propProvider !== self.dialogFields().propProvider)) {
                // IFF property provider has changed, update the property list reference
                DataProviderManager.updatePropertyListWDTModel(dataProvider, self.dialogFields().propProvider)
                  .then(reply =>{
                    if (reply.succeeded) {
                      editUpdateWDTModel(dataProvider);
                    }
                    else {
                      ViewModelUtils.failureResponseDefaultHandling(reply.failure);
                    }
                  })
                  .catch(response => {
                    ViewModelUtils.failureResponseDefaultHandling(response.failure);
                  });
              }
              else {
                editUpdateWDTModel(dataProvider);
              }
            }
            else {
              revertDialogFields(dataProvider);
              self.contentFile(self.dialogFields().file);
              self.propProviderSelectedValue(self.dialogFields().propProvider);
              self.responseMessage('');
              setResponseMessageVisibility('model-response-message', false);
            }
          });
      }

      function editUpdateWDTModel(dataProvider) {
        dataProvider = editUpdateDataProvider(dataProvider, self.dialogFields());
        if (CoreUtils.isNotUndefinedNorNull(dataProvider.file)) {
          // Dispatch the dataProviderSelected singal using navtreeReset as true
          selectWDTModel(dataProvider, true);
        }
      }

      /**
       * Displays the dialog box used to edit a WDT Composite Model provider.
       * <p>NOTE: The same dialog box is used to add a WDT Composite Model provider.</p>
       * @param {DataProvider} dataProvider
       * @private
       */
       function editWDTCompositeModel(dataProvider) {
        const entryValues = createDialogFields(dataProvider);
        self.dialogFields(entryValues);

        self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-data-providers.titles.edit.composite.value'));
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString('wrc-data-providers.instructions.composite.edit.value'));
        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString('wrc-common.buttons.ok.label'));

        const dialogParams = {
          type: dataProvider.type,
          id: dataProvider.id,
          accepts: 'application/yaml,application/x-yaml,application/json'
        };

        self.connectionsModelsSelectedItem(null);

        // Setup the WDT Composite Model dialog values
        self.wdtProvidersSelectedValues(self.dialogFields().modelProviders);
        if (!modelProvidersEqual(dataProvider, self.dialogFields())) {
          // IFF provider ids are not in sync then have the user re-select the dataproviders!
          self.wdtProvidersSelectedValues([]);
        }
        self.wdtProvidersDataProvider.data = getAvailableWDTModels();

        DataProvidersDialog.showDataProvidersDialog('EditWDTCompositeModel', dialogParams, self.i18n, isUniqueDataProviderName)
          .then(reply => {
            if (reply) {
              self.dialogFields().modelProviders = self.wdtProvidersSelectedValues();
              const updModels = getWDTModelNames(self.dialogFields().modelProviders);
              const curModels = (CoreUtils.isNotUndefinedNorNull(dataProvider.models) ? dataProvider.models : []);
              let removeRequired = ((updModels.length !== curModels.length) || !updModels.every((val, idx) => val === curModels[idx]));
              if (!removeRequired) {
                // IFF model names are the same, ensure that dataproviders are also the same!
                removeRequired = !modelProvidersEqual(dataProvider, self.dialogFields());
              }
              if ((removeRequired) && (dataProvider.state !== CoreTypes.Domain.ConnectState.DISCONNECTED.name)) {
                removeDataProvider(dataProvider)
                  .then(reply =>{
                    if (reply.succeeded) {
                      dataProvider = updateDataProvider(dataProvider, self.dialogFields());
                      dataProvider = DataProviderManager.createWDTCompositeModel(dataProvider);
                      dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
                      replaceConnectionsModels(dataProvider);
                      // Dispatch the dataProviderSelected singal using navtreeReset as true
                      selectWDTCompositeModel(dataProvider, true);
                    }
                    else {
                      ViewModelUtils.failureResponseDefaultHandling(reply.failure);
                    }
                  })
                  .catch(response => {
                    ViewModelUtils.failureResponseDefaultHandling(response.failure);
                  });
              }
              else {
                dataProvider = editUpdateDataProvider(dataProvider, self.dialogFields());
                // Dispatch the dataProviderSelected singal using navtreeReset as true
                selectWDTCompositeModel(dataProvider, true);
              }

            }
            else {
              revertDialogFields(dataProvider);
              self.wdtProvidersSelectedValues(self.dialogFields().modelProviders)
              self.responseMessage('');
              setResponseMessageVisibility('model-composite-response-message', false);
            }
          });
      }

      // Determine if the list of model provider ids are the same
      function modelProvidersEqual(dataProvider, dialogFields) {
        // If the composite has no model providers, return true
        if (CoreUtils.isUndefinedOrNull(dataProvider.modelProviders)) {
          return true;
        }
        // Determine if the two arrays contain the same id values
        const prov = dataProvider.modelProviders;
        const other = dialogFields.modelProviders;
        return ((other.length === prov.length) && other.every((val, idx) => val === prov[idx]));
      }

      /**
       * Displays the dialog box used to edit a Property List provider.
       * Uses the WDT model dialog box.
       * @param {DataProvider} dataProvider
       * @private
       */
       function editPropertyList(dataProvider) {
        const entryValues = createDialogFields(dataProvider);
        entryValues['action'] = 'existing';
        self.dialogFields(entryValues);

        self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-data-providers.titles.edit.proplist.value'));
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString('wrc-data-providers.instructions.proplist.edit.value'));
        self.i18n.dialog.nameLabel(self.i18n.labels.proplist.name.value);
        self.i18n.dialog.fileLabel(self.i18n.labels.proplist.file.value);
        self.i18n.dialog.iconFile(self.i18n.icons.choose.iconFile);
        self.i18n.dialog.tooltip(self.i18n.icons.choose.tooltip);
        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString('wrc-common.buttons.ok.label'));

        const dialogParams = {
          type: dataProvider.type,
          id: dataProvider.id,
          accepts: 'text/plain'
        };

        self.connectionsModelsSelectedItem(null);

        // Set the dialog box based on createDialogFields()
        self.contentFile(self.dialogFields().file);

        // Finally, we need to show the "Edit Property List" dialog,
        // mainly for the purpose of getting the properties file.
        DataProvidersDialog.showDataProvidersDialog('EditPropertyList', dialogParams, self.i18n, isUniqueDataProviderName)
          .then(reply => {
            if (reply) {
              self.dialogFields().file = self.contentFile();
              const removeRequired = (dataProvider.file !== self.contentFile() || CoreUtils.isNotUndefinedNorNull(self.contentFiles[dataProvider.id]));
              if ((removeRequired) && (dataProvider.state !== CoreTypes.Domain.ConnectState.DISCONNECTED.name)) {
                // Remove fileContents property before proceeding.
                delete dataProvider['fileContents'];
                removeDataProvider(dataProvider)
                  .then(reply =>{
                    if (reply.succeeded) {
                      dataProvider = updateDataProvider(dataProvider, self.dialogFields());
                      dataProvider = DataProviderManager.createPropertyList(dataProvider);
                      dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
                      replaceConnectionsModels(dataProvider);
                      // Dispatch the dataProviderSelected singal using navtreeReset as true
                      selectPropertyList(dataProvider, true);
                    }
                    else {
                      ViewModelUtils.failureResponseDefaultHandling(reply.failure);
                    }
                  })
                  .catch(response => {
                    ViewModelUtils.failureResponseDefaultHandling(response.failure);
                  });
              }
              else {
                dataProvider = editUpdateDataProvider(dataProvider, self.dialogFields());
                if (CoreUtils.isNotUndefinedNorNull(dataProvider.file)) {
                  // Dispatch the dataProviderSelected singal using navtreeReset as true
                  selectPropertyList(dataProvider, true);
                }
              }
            }
            else {
              revertDialogFields(dataProvider);
              self.contentFile(self.dialogFields().file)
              self.responseMessage('');
              setResponseMessageVisibility('model-response-message', false);
            }
          });
      }

      function editUpdateDataProvider(dataProvider, dialogFields) {
        dataProvider = updateDataProvider(dataProvider, dialogFields);
        updateConnectionsModels(dataProvider);
        if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
          dispatchElectronApiSignal('project-changing');
          viewParams.onCachedStateChanged(self.tabNode, self.project);
        }
        return dataProvider;
      }

      function editDataProvider(dataProvider) {
        switch (dataProvider.type) {
          case DataProvider.prototype.Type.ADMINSERVER.name:
            editAdminServerConnection(dataProvider);
            break;
          case DataProvider.prototype.Type.MODEL.name:
            editWDTModel(dataProvider);
            break;
          case DataProvider.prototype.Type.COMPOSITE.name:
            editWDTCompositeModel(dataProvider);
            break;
          case DataProvider.prototype.Type.PROPERTIES.name:
            editPropertyList(dataProvider);
            break;
        }
      }

      function removeDataProvider(dataProvider) {
        switch (dataProvider.type) {
          case DataProvider.prototype.Type.ADMINSERVER.name:
            return DataProviderManager.removeAdminServerConnection(dataProvider);
          case DataProvider.prototype.Type.MODEL.name:
            return DataProviderManager.removeWDTModel(dataProvider);
          case DataProvider.prototype.Type.COMPOSITE.name:
            return DataProviderManager.removeWDTCompositeModel(dataProvider);
          case DataProvider.prototype.Type.PROPERTIES.name:
            return DataProviderManager.removePropertyList(dataProvider);
        }
      }

      function uploadDataProviderFormData(dataProvider, formData) {
        switch (dataProvider.type) {
          case DataProvider.prototype.Type.MODEL.name:
            return DataProviderManager.uploadWDTModel(dataProvider, formData);
          case DataProvider.prototype.Type.PROPERTIES.name:
            return DataProviderManager.uploadPropertyList(dataProvider, formData);
        }
      }

      /**
       *
       * @returns {Promise<any>}
       */
      function deleteAllDataProviders() {
        return new Promise((resolve, reject) => {
          ConsoleProjectManager.removeById(self.project.id)
            .then(results => {
              const start = async () => {
                await CoreUtils.asyncForEach(results, async (result) => {
                  if (result.succeeded) {
                    Logger.info(`[DATAPROVIDERS] removeById - result.data.id=${result.data.id}`);
                    removeSucceededHandler(result.data, false);
                  } else {
                    ViewModelUtils.failureResponseDefaultHandling(result.failure);
                  }
                });
                Logger.info('[DATAPROVIDERS] removeById - Done');
              };
              resolve(start());
            })
            .catch(response => {
              reject(response);
            });
        });
      }

      // FortifyIssueSuppression(746F19A7EC928D5E62A6C45F83A91498) Password Management: Password in Comment
      // Not a password, just a comment
      /**
       * Returns Promise containing JS object with properties associated with obtaining credentials (e.g. password) for an AdminServerConnection data provider type.
       * @param {{project: {name: string}, provider: {name: string, username: string, password: string}}} options
       * @returns {Promise<{succeeded: boolean, secret?: string | {transport: {statusText: string, failureType: string, failureReason: any}}}>}
       */
      async function getAdminServerConnectionCredentials(options) {
        if (ViewModelUtils.isElectronApiAvailable()) {
          // Set selected list item to '' in order to circumvent
          // default change event triggering, of JET.
          self.connectionsModelsSelectedItem(null);
          return window.electron_api.ipc.invoke('credentials-requesting', options);
        }
        else {
          const reply = {};
          reply['succeeded'] = CoreUtils.isNotUndefinedNorNull(options.provider.password);
          if (reply.succeeded) reply['secret'] = options.provider.password;
          return Promise.resolve(reply);
        }
      }

      this.toolbarMoreMenuClickListener = function(event) {
        const action = event.currentTarget.attributes['data-item-action'].value;

        const dialogParams = {
          accepts: 'application/yaml,application/x-yaml,application/json'
        };

        switch(action) {
          case 'export':
            addProject(dialogParams);
            break;
          case 'import':
            importProject(dialogParams);
            break;
        }
      }.bind(this);

      this.launchProjectMoreMenu = function (event) {
        event.preventDefault();
        document.getElementById('projectMoreMenu').open(event);
      };

      function performProjectElectronMenuAction(switching) {
        function switchToProject(project) {
          project = ConsoleProjectManager.createFromEntry(switching.to);
          if (CoreUtils.isNotUndefinedNorNull(project)) {
            setCurrentProject(project);
            // Add "mouseenter" and "mouseleave" event
            // listener to list items
            addEventListeners();
            viewParams.signaling.projectSwitched.dispatch(switching.from);
            if (viewParams.onTabStripContentHidden()) viewParams.onTabStripContentVisible(true);
          }
        }

        switch(switching.action) {
          case 'create':
          case 'select':
          case 'navigate':
            if (switching.to.name !== self.project.name) {
              let project = ConsoleProjectManager.getByName(switching.from.name);
              if (CoreUtils.isNotUndefinedNorNull(project)) {
                deactivateDataProviders([...project.dataProviders])
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
          case self.i18n.menus.connections.add.id:
            addAdminServerConnection(dialogParams);
            break;
          case self.i18n.menus.models.add.id:
            dialogParams['action'] = 'existing';
            addWDTModel(dialogParams);
            break;
          case self.i18n.menus.models.new.id:
            dialogParams['action'] = 'new';
            addWDTModel(dialogParams);
            break;
          case self.i18n.menus.composite.add.id:
            addWDTCompositeModel(dialogParams);
            break;
          case self.i18n.menus.proplist.add.id:
            dialogParams['action'] = 'existing';
            addPropertyList(dialogParams);
            break;
          case self.i18n.menus.proplist.new.id:
            dialogParams['action'] = 'new';
            addPropertyList(dialogParams);
            break;
          case self.i18n.menus.providers.sort.id:
            sortConnectionModels();
            break;
          case self.i18n.menus.project.export.id:
            addProject(dialogParams);
            break;
          case self.i18n.menus.project.import.id:
            importProject(dialogParams);
            break;
        }
      }

      this.projectMoreMenuClickListener = function (event) {
        if (CoreUtils.isNotUndefinedNorNull(self.canExitCallback)) {
          const lastActivedDataProvider = DataProviderManager.getLastActivatedDataProvider();
          const dialogMessageName = (CoreUtils.isNotUndefinedNorNull(lastActivedDataProvider) ? lastActivedDataProvider.name : 'Unknown');
          const eventType = (['model', 'properties', 'modelComposite'].includes(lastActivedDataProvider.type) ? 'download' : 'exit');
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

      }.bind(this);

      this.connectionsModelsIconBarClickListener = function(event) {
        const action = event.currentTarget.attributes['data-item-action'].value;

        const dialogParams = {
          type: event.currentTarget.attributes['data-item-type'].value,
          id: event.currentTarget.attributes['data-item-id'].value,
          accepts: 'application/yaml,application/x-yaml,application/json'
        };

        const actionSwitch = (value) => ({
          'edit': 'Edit',
          'deactivate': 'Deactivate',
          'delete': 'Delete'
        })[value];
        const actionPart = actionSwitch(action);

        const mapSwitch = (value) => ({
          'adminserver': 'connections',
          'model': 'models',
          'modelComposite': 'composite'
        })[value];
        const mapValue = mapSwitch(dialogParams.type);

        self.i18n.dialog.instructions(oj.Translations.getTranslatedString(`wrc-data-providers.instructions.${mapValue}.${action}.value`));

        if (action === 'info') {
          const dataProvider = connectionsModels().find(item => item.id === dialogParams.id);
          if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
            const popup = document.getElementById('dataProviderInfoPopup');
            if (popup !== null) {
              if (popup.isOpen()) popup.close();
              else {
                self.providerInfo.type(dataProvider.type);
                self.providerInfo.state(dataProvider.state);
                showDataProviderInfo(dataProvider, popup);
              }
            }
          }
        }
        else if (action === 'edit') {
          const dataProvider = connectionsModels().find(item => item.id === dialogParams.id);
          ViewModelUtils.abandonUnsavedChanges(action, self.canExitCallback, {dialogMessage: {name: dataProvider.name }})
            .then(reply => {
              if (reply === null)  {
                ViewModelUtils.cancelEventPropagation(event);
              }
              else if (reply) {
                self.canExitCallback = undefined;
                performEditAction(dataProvider, dialogParams);
              }
              else {
                performEditAction(dataProvider, dialogParams);
              }
            })
            .catch(failure => {
              ViewModelUtils.failureResponseDefaultHandling(failure);
            });
        }
        else if (action === 'deactivate') {
          const dataProvider = connectionsModels().find(item => item.id === dialogParams.id);
          if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
            ViewModelUtils.abandonUnsavedChanges(action, self.canExitCallback, {dialogMessage: {name: dataProvider.name }})
              .then(reply => {
                if (reply === null)  {
                  ViewModelUtils.cancelEventPropagation(event);
                }
                else if (reply) {
                  self.canExitCallback = undefined;
                  performDeactivateAction(dataProvider);
                }
                else {
                  performDeactivateAction(dataProvider);
                }
              })
              .catch(failure => {
                ViewModelUtils.failureResponseDefaultHandling(failure);
              });
          }
        }
        else if (action === 'delete') {
          const dataProvider = connectionsModels().find(item => item.id === dialogParams.id);
          ViewModelUtils.abandonUnsavedChanges(action, self.canExitCallback, {dialogMessage: {name: dataProvider.name }})
            .then(reply => {
              if (reply === null)  {
                ViewModelUtils.cancelEventPropagation(event);
              }
              else if (reply) {
                self.canExitCallback = undefined;
                performDeleteAction(dataProvider);
              }
              else {
                performDeactivateAction(dataProvider);
              }
            })
            .catch(failure => {
              ViewModelUtils.failureResponseDefaultHandling(failure);
            });
        }

      };

      function isSelectedDataProvider(dataProvider) {
        const lastActivatedDataProvider = DataProviderManager.getLastActivatedDataProvider();
        return (CoreUtils.isUndefinedOrNull(lastActivatedDataProvider) ? false : lastActivatedDataProvider.id === dataProvider.id)
      }

      function performEditAction(dataProvider, dialogParams) {
        self.responseMessage('');

        switch(dialogParams.type) {
          case DataProvider.prototype.Type.ADMINSERVER.name:
            setResponseMessageVisibility('connection-response-message', false);
            break;
          case DataProvider.prototype.Type.MODEL.name:
          case DataProvider.prototype.Type.PROPERTIES.name:
            setResponseMessageVisibility('model-response-message', false);
            break;
          case DataProvider.prototype.Type.COMPOSITE.name:
            setResponseMessageVisibility('model-composite-response-message', false);
            break;
        }
        editDataProvider(dataProvider);
      }

      function performDeactivateAction(dataProvider) {
        const dataProviders = [dataProvider];
        if (dataProvider.type !== DataProvider.prototype.Type.ADMINSERVER.name) {
          const propertiesDataProvider = getPropertyListProvider(dataProvider.properties, true);
          if (CoreUtils.isNotUndefinedNorNull(propertiesDataProvider)) {
            dataProviders.push(propertiesDataProvider);
          }
        }
        quiesceDataProviders(dataProviders)
          .then(() =>{
            quiesceConnectionsModels(dataProviders);
          })
          .catch(response => {
            ViewModelUtils.failureResponseDefaultHandling(response);
          });
      }

      function performDeleteAction(dataProvider) {
        deactivateDataProviders([dataProvider])
          .then(() =>{
            removeSucceededHandler(dataProvider);
            dispatchElectronApiSignal('project-changing');
            viewParams.onCachedStateChanged(self.tabNode, self.project);
          })
          .catch(response => {
            ViewModelUtils.failureResponseDefaultHandling(response);
          });
      }

      function changeConnectionsModelsSelectedItem(dataProvider, navtreeReset = false) {
        if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
          // Choose what to do next, based on the type
          // of data provider this is.
          switch(dataProvider.type) {
            case DataProvider.prototype.Type.ADMINSERVER.name: {
              const options = {project: {name: self.project.name}, provider: {name: dataProvider.name, username: dataProvider.username, password: dataProvider.password}};
              getAdminServerConnectionCredentials(options)
                .then(reply => {
                  if (reply.succeeded) {
                    // Attempt to get the credentials succeeded,
                    // so go ahead and update the data provider's
                    // FortifyIssueSuppression(C9827329D56593134375D08BC3A21847) Password Management: Password in Comment
                    // Not a password, just a comment
                    // password property.
                    dataProvider['password'] = reply.secret;
                    selectAdminServerConnection(dataProvider, navtreeReset);
                  }
                  else {
                    Logger.warn(`[DATAPROVIDERS] ${JSON.stringify(reply)}`);
                    editAdminServerConnection(dataProvider);
                  }
                })
                .catch(failure => {
                  ViewModelUtils.failureResponseDefaultHandling(failure);
                });
            }
              break;
            case DataProvider.prototype.Type.MODEL.name:
              selectWDTModel(dataProvider, navtreeReset);
              break;
            case DataProvider.prototype.Type.COMPOSITE.name:
              selectWDTCompositeModel(dataProvider, navtreeReset);
              break;
            case DataProvider.prototype.Type.PROPERTIES.name:
              selectPropertyList(dataProvider, navtreeReset);
              break;
          }
        }
      }

      this.connectionsModelsSelectedItemChanged = function(event) {
        // Only do something if user actually clicked a
        // list item. self.connectionsModelsSelectedItem
        // is a knockout observable that is frequently
        // set to '', in order to circumvent the default
        // change event triggering of a JET navigation
        // list control.
        if (self.connectionsModelsSelectedItem() !== null) {
          self.connectionsModelsSelectedItem(null);

          const dataProvider = connectionsModels().find(item => item.id === event.target.currentItem);
          const previousDataProvider = DataProviderManager.getLastActivatedDataProvider();

          if (CoreUtils.isUndefinedOrNull(previousDataProvider)) {
            changeConnectionsModelsSelectedItem(dataProvider, true);
          }
          else if (previousDataProvider.id !== dataProvider.id) {
            if (CoreUtils.isNotUndefinedNorNull(self.canExitCallback)) {
              const eventType = (['model', 'properties', 'modelComposite'].includes(previousDataProvider.type) ? (ViewModelUtils.isElectronApiAvailable() ? 'autoDownload' : 'download') : 'exit');
              self.canExitCallback(eventType, {dialogMessage: {name: previousDataProvider.name }})
                .then(reply => {
                  if (reply === null)  {
                    ViewModelUtils.cancelEventPropagation(event);
                  }
                  else if (['autoDownload', 'download'].includes(eventType)) {
                    self.canExitCallback = undefined;
                    changeConnectionsModelsSelectedItem(dataProvider);
                  }
                  else {
                    if (reply) changeConnectionsModelsSelectedItem(dataProvider);
                  }
                });
            }
            else {
              changeConnectionsModelsSelectedItem(dataProvider);
            }
          }
          else if (dataProvider.state === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
            changeConnectionsModelsSelectedItem(dataProvider);
          }
        }
      };

      this.newFileClickHandler = (event) => {
        const fileType = event.currentTarget.attributes['data-input-type'].value;
        const filepath = self.contentFile();
        let data = '';
        let mediaType = 'application/x-yaml';
        switch (fileType) {
          case 'model':
            data = createNewWDTModelFile(filepath);
            break;
          case 'properties':
            data = createNewContentFile(newPropertyListContentFileData, filepath);
            mediaType = 'text/plain';
            break;
          case 'project':
            mediaType = 'application/json';
            break;
        }
        if (!ViewModelUtils.isElectronApiAvailable() && filepath !== '') {
          ViewModelUtils.downloadFile({filepath: filepath, fileContents: data, mediaType: mediaType});
        }
      };

      /**
       *
       * @param {string} filepath
       * @param {string} channel
       * @returns {object}
       * @private
       */
      function createNewWDTModelFile(filepath, channel = 'file-creating', dataprovider = null) {
        const data = getNewWDTModelDataByTemplate(self.useSparseTemplate().length > 0 ? 'sparse' : 'domain');
        return createNewContentFile(data, filepath, channel, dataprovider);
      }

      function createNewContentFile(data, filepath, channel = 'file-creating', dataprovider = null) {
        if (ViewModelUtils.isElectronApiAvailable()) {
          if (filepath !== '') {
            window.electron_api.ipc.invoke(channel, {filepath: filepath, fileContents: data})
              .then(reply => {
                if (reply.succeeded) {
                  self.contentFile(reply.filePath);
                  if ((channel === 'file-writing') && CoreUtils.isNotUndefinedNorNull(dataprovider)) {
                    checkDataproviderFilePath(dataprovider, self.contentFile());
                  }
                }
              })
              .catch(error => {
                // Creating a fake error object because the error object here
                // has the wrong message
                const fakeError = new Error(`Failed to write file: ${filepath}`);
                ViewModelUtils.failureResponseDefaultHandling(fakeError, 'error');
              });
          }
        }
        return data;
      }

      // Check the dataprovider file path against the path of the file created
      function checkDataproviderFilePath(dataprovider, filePath) {
        if (CoreUtils.isNotUndefinedNorNull(dataprovider.file)) {
          // IFF file path values are not the same then update the data provider
          // so the provider editing and the loading of the provider at startup
          // reflect the location of the file on disk.
          if (dataprovider.file !== filePath) {
            dataprovider.putValue('file', filePath);
          }
        }
      }

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
              Logger.info(`[DATAPROVIDERS] ipcMain.handle()->ipcRenderer.invoke()->this.chooseFileClickHandler(event) 'file-choosing' file=${response.file}`);
              if (CoreUtils.isNotUndefinedNorNull(response.file)) {
                switch(fileType) {
                  case 'properties':
                  case 'model': {
                      self.contentFile(response.file);
                    }
                    break;
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
          const chooser = $('#file-chooser');
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
          switch(fileType) {
            case 'properties':
            case 'model': {
              const dataProviderId = event.currentTarget.attributes['data-input'].value;
              self.contentFiles[dataProviderId] = files[0];
              self.contentFile(files[0].name);
            }
              break;
            case 'project': {
              self.projectFiles['current'] = files[0];
              self.projectFile(files[0].name)
            }
              break;
          }

          const chooser = $('#file-chooser');
          chooser.off('change', self.chooseFileChangeHandler);
          chooser.val('');
        }
      };

      this.reloadFileClickListener = function(event) {
        const dataProvider = connectionsModels().find(item => item.id === self.dialogFields().id);
        if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
          dataProvider.file = null;
          delete self.contentFiles[dataProvider.id];
          const dlgOkBtn12 = $('#dlgOkBtn12');
          dlgOkBtn12.trigger('click');
        }
      };

      this.isReloadable = () => {
        return ViewModelUtils.isElectronApiAvailable();
      };

      function onMouseEnter(event) {
        const listItemId = event.currentTarget.attributes['id'].value;
        $(`#${listItemId}-iconbar`).css({'visibility':'visible'});
      }

      function onMouseLeave(event) {
        const listItemId = event.currentTarget.attributes['id'].value;
        $(`#${listItemId}-iconbar`).css({'visibility':'hidden'});
      }

      function addEventListeners() {
        connectionsModels().forEach((item) => {
          $(`#${item.id}`)
            .on('mouseenter', onMouseEnter)
            .on('mouseleave', onMouseLeave);
        });
      }

      function removeEventListeners() {
        connectionsModels().forEach((item) => {
          $(`#${item.id}`)
            .off('mouseenter', onMouseEnter)
            .off('mouseleave', onMouseLeave);
        });
      }

    }

    return DataProvidersTemplate;
  }
);
