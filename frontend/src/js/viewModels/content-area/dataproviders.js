/**
 * @license
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojcore', 'knockout', 'ojs/ojarraydataprovider',  'wrc-frontend/microservices/project-management/console-project-manager', 'wrc-frontend/microservices/project-management/console-project', 'wrc-frontend/microservices/provider-management/data-provider-manager', 'wrc-frontend/microservices/provider-management/data-provider', './dataproviders-dialog','wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/runtime', 'wrc-frontend/core/utils', 'wrc-frontend/core/types', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojtreeview','ojs/ojnavigationlist', 'ojs/ojswitch', 'ojs/ojcheckboxset', 'ojs/ojradioset'],
  function (oj, ko, ArrayDataProvider, ConsoleProjectManager, ConsoleProject, DataProviderManager, DataProvider, DataProvidersDialog, ViewModelUtils, Runtime, CoreUtils, CoreTypes, Logger) {
    function DataProvidersTemplate(viewParams) {
      const self = this;

      const PROVIDER_ACTIVATED_COLOR = getComputedStyle(document.documentElement).getPropertyValue("--provider-activated-color");
      const PROVIDER_DEACTIVATED_COLOR = getComputedStyle(document.documentElement).getPropertyValue("--provider-deactivated-color");

      // Nested class.
      function DialogFields() {
        return {
          addField: function(name, value) {
            if (typeof value === "number") value = value.toString();
            this.putValue(name, value || '');
          },
          putValue: function(name, value) {
            this[name] = value;
          }
        }
      }

      var connectionsModels = ko.observableArray([]);

      /**
       * !!! DON'T CHANGE THE ORDER OF THE NEXT TWO LINES  !!!
       * !!! THE initializeProject() CALL MUST COME BEFORE !!!
       * !!! THE loadConnectionsModels() CALL              !!!
       */

      this.i18n = {
        "icons": {
          "collapse": {
            iconFile: "data-providers-collapse-icon_8x24",
            tooltip: oj.Translations.getTranslatedString("wrc-common.tooltips.collapse.value")
          },
          "expand": {
            iconFile: "data-providers-expand-icon_8x24",
            tooltip: oj.Translations.getTranslatedString("wrc-common.tooltips.expand.value")
          },
          "choose": {
            iconFile: "import-icon-blk_24x24",
            tooltip: oj.Translations.getTranslatedString("wrc-common.tooltips.choose.value")
          },
          "pick": {
            iconFile: "choose-directory-icon-blk_24x24",
            tooltip: oj.Translations.getTranslatedString("wrc-common.tooltips.pick.value")
          },
          "download": {
            iconFile: "export-icon-blk_24x24",
            tooltip: oj.Translations.getTranslatedString("wrc-common.tooltips.download.value")
          },
          "import": {
            iconFile: "project-import-icon-blk_24x24",
            tooltip: "Import"
          },
          "export": {
            iconFile: "project-export-icon-blk_24x24",
            tooltip: "Export"
          },
          "more": {
            iconFile: `more-vertical-brn-8x24`,
            tooltip: oj.Translations.getTranslatedString("wrc-common.tooltips.more.value")
          },
          "info": {
            iconFile: `data-providers-info-icon-brn_24x24`,
            tooltip: oj.Translations.getTranslatedString("wrc-data-providers.icons.info.tooltip")
          },
          "edit": {
            iconFile: `data-providers-manage-icon-brn_24x24`,
            tooltip: oj.Translations.getTranslatedString("wrc-data-providers.icons.edit.tooltip")
          },
          "delete": {
            iconFile: `data-providers-delete-icon-brn_24x24`,
            tooltip: oj.Translations.getTranslatedString("wrc-data-providers.icons.delete.tooltip")
          }
        },
        "popups": {
          "info": {
            "provider": {
              "id": {"value": ko.observable(),
                "label": oj.Translations.getTranslatedString("wrc-data-providers.popups.info.provider.id.label")},
            },
            "domain": {
              "name": {"value": ko.observable(),
                "label": oj.Translations.getTranslatedString("wrc-data-providers.popups.info.domain.name.label")},
              "url": {"value": ko.observable(),
                "label": oj.Translations.getTranslatedString("wrc-data-providers.popups.info.domain.url.label")},
              "version": {"value": ko.observable(),
                "label": oj.Translations.getTranslatedString("wrc-data-providers.popups.info.domain.version.label")},
              "username": {"value": ko.observable(),
                "label": oj.Translations.getTranslatedString("wrc-data-providers.popups.info.domain.username.label")},
              "roles": {"value": ko.observable(),
                "label": oj.Translations.getTranslatedString("wrc-data-providers.popups.info.domain.roles.label")},
              "connectTimeout": {"value": ko.observable(),
                "label": oj.Translations.getTranslatedString("wrc-data-providers.popups.info.domain.connectTimeout.label")},
              "readTimeout": {"value": ko.observable(),
                "label": oj.Translations.getTranslatedString("wrc-data-providers.popups.info.domain.readTimeout.label")},
              "anyAttempt": {"value": ko.observable(),
                "label": oj.Translations.getTranslatedString("wrc-data-providers.popups.info.domain.anyAttempt.label")},
              "lastAttempt": {"value": ko.observable(),
                "label": oj.Translations.getTranslatedString("wrc-data-providers.popups.info.domain.lastAttempt.label")}
            },
            "model": {
              "file": {"value": ko.observable(),
                "label": oj.Translations.getTranslatedString("wrc-data-providers.popups.info.model.file.label")}
            }
          }
        },
        "labels": {
          "connections": {
            "header": {"value": oj.Translations.getTranslatedString("wrc-data-providers.labels.connections.header.value")},
            "name": {"value": oj.Translations.getTranslatedString("wrc-data-providers.labels.connections.name.value")},
            "url": {"value": oj.Translations.getTranslatedString("wrc-data-providers.labels.connections.url.value")},
            "username": {"value": oj.Translations.getTranslatedString("wrc-data-providers.labels.connections.username.value")},
            "password": {"value": oj.Translations.getTranslatedString("wrc-data-providers.labels.connections.password.value")}
          },
          "models": {
            "name": {"value": oj.Translations.getTranslatedString("wrc-data-providers.labels.models.name.value")},
            "file": {"value": oj.Translations.getTranslatedString("wrc-data-providers.labels.models.file.value")}
          },
          "project": {
            "name": {"value": oj.Translations.getTranslatedString("wrc-data-providers.labels.project.name.value")},
            "file": {"value": oj.Translations.getTranslatedString("wrc-data-providers.labels.project.file.value")}
          },
          "provider": {
            "adminserver": {"value": oj.Translations.getTranslatedString("wrc-data-providers.labels.provider.adminserver.value")},
            "model": {"value": oj.Translations.getTranslatedString("wrc-data-providers.labels.provider.model.value")}
          }
        },
        "menus": {
          "connections": {
            "add": {id: "add-domain-connection", disabled: false,
              label: oj.Translations.getTranslatedString("wrc-data-providers.menus.connections.add.value")
            }
          },
          "models": {
            "new": {id: "add-new-wdt-model", disabled: false,
              label: oj.Translations.getTranslatedString("wrc-data-providers.menus.models.new.value")
            },
            "add": {id: "add-exiting-wdt-model", disabled: false,
              label: oj.Translations.getTranslatedString("wrc-data-providers.menus.models.add.value")
            }
          },
          "providers": {
            "sort": {
              id: "sort-by-provider-type", disabled: false,
              "label": oj.Translations.getTranslatedString("wrc-data-providers.menus.providers.sort.value")
            }
          },
          "project": {
            "export": {id: "export-all-to-project", disabled: false,
              label: oj.Translations.getTranslatedString("wrc-data-providers.menus.project.export.value")
            },
            "import": {id: "load-project", disabled: false,
              label: oj.Translations.getTranslatedString("wrc-data-providers.menus.project.import.value")
            }
          }
        },
        "titles": {
          "add": {
            "connections": {value: oj.Translations.getTranslatedString("wrc-data-providers.titles.add.connections.value")},
            "models": {value: oj.Translations.getTranslatedString("wrc-data-providers.titles.add.models.value")}
          },
          "new": {
            "models": {"value": oj.Translations.getTranslatedString("wrc-data-providers.titles.new.models.value")}
          },
          "edit": {
            "connections": {value: oj.Translations.getTranslatedString("wrc-data-providers.titles.edit.connections.value")},
            "models": {value: oj.Translations.getTranslatedString("wrc-data-providers.titles.edit.models.value")}
          },
          "export": {
            "project": {value: oj.Translations.getTranslatedString("wrc-data-providers.titles.export.project.value")}
          },
          "import": {
            "project": {value: oj.Translations.getTranslatedString("wrc-data-providers.titles.import.project.value")}
          },
          "startup": {
            "task": {value: oj.Translations.getTranslatedString("wrc-data-providers.titles.startup.task.value")}
          }
        },
        "buttons": {
          "ok": { disabled: ko.observable(false),
            "label": ko.observable(oj.Translations.getTranslatedString("wrc-common.buttons.ok.label"))
          },
          "cancel": { disabled: false,
            "label": oj.Translations.getTranslatedString("wrc-common.buttons.cancel.label")
          }
        },
        "messages": {
          "export": {
            "failed": {
              "summary": oj.Translations.getTranslatedString("wrc-data-providers.messages.export.failed.summary"),
              "detail": oj.Translations.getTranslatedString("wrc-data-providers.messages.export.failed.detail", "{0}")
            }
          },
          "import": {
            "failed": {
              "summary": oj.Translations.getTranslatedString("wrc-data-providers.messages.import.failed.summary"),
              "detail": oj.Translations.getTranslatedString("wrc-data-providers.messages.import.failed.detail", "{0}")
            }
          },
          "stage": {
            "failed": {
              "summary": oj.Translations.getTranslatedString("wrc-data-providers.messages.stage.failed.summary"),
              "detail": oj.Translations.getTranslatedString("wrc-data-providers.messages.stage.failed.detail", "{0}")
            }
          },
          "use": {
            "failed": {
              "summary": oj.Translations.getTranslatedString("wrc-data-providers.messages.use.failed.summary"),
              "detail": oj.Translations.getTranslatedString("wrc-data-providers.messages.use.failed.detail", "{0}")
            }
          },
          "response": {
            "nameAlreadyExist": {
              "detail": oj.Translations.getTranslatedString("wrc-data-providers.messages.response.nameAlreadyExist.detail", "{0}")
            }
          }
        },
        "checkboxes": {
          "useSparseTemplate": {
            id: "sparse",
            label: oj.Translations.getTranslatedString("wrc-data-providers.checkboxes.useSparseTemplate.label")
          }
        },
        "dialog": {
          "title": ko.observable(""),
          "instructions": ko.observable(""),
          "iconFile": ko.observable(""),
          "tooltip": ko.observable("")
        }
      };

      // START: knockout observables referenced in dataproviders.html
      this.connectionsModelsSelectedItem = ko.observable('');
      this.dataProvidersVisible = ko.observable();
      // Need to initialize observable with valid, throw
      // away data, because the view (dataproviders.html)
      // has <oj-bind-if> elements that use it in test
      // attributes.
      this.dialogFields = ko.observable(initializeDialogFields());
      this.responseMessage = ko.observable("");
      this.providerInfo = {type: ko.observable("adminserver"), state: ko.observable("disconnected")};
      this.modelFile = ko.observable();
      this.modelFiles = {};
      // END:   knockout observables referenced in dataproviders.html
      this.useSparseTemplate = ko.observableArray([]);

      this.project = initializeProject();
      this.projectAlias = ko.observable(CoreUtils.isNotUndefinedNorNull(this.project) ? this.project.name : "");

      this.connectionsModelsDataProvider = loadConnectionsModels();

      /**
       * Returns the dataProviders property of the default project
       * @returns {ArrayDataProvider}
       * @private
       */
      function loadConnectionsModels() {
        if (CoreUtils.isNotUndefinedNorNull(self.project)) {
          self.project.dataProviders.forEach((dataProvider) => {
            if (dataProvider.type === DataProvider.prototype.Type.ADMINSERVER.name) {
              dataProvider.putValue("class", "oj-navigationlist-item-icon oj-ux-ico-domain cfe-provider-icon");
            }
            else {
              dataProvider.putValue("class", "oj-navigationlist-item-icon oj-ux-ico-file-other cfe-provider-icon");
            }
          });
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

      // Declare module-scoped variable that prevents
      // user clicks on "Project Management" tabstrip,
      // from reloading this module when if is already
      // the currently selected tabstrip content being
      // displayed.
      this.tabNode = "dataproviders";
      // Declare module-scoped variable for storing
      // bindings to "add" signal handlers.
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
                  setCurrentProject(project);
                  // Send notification that project was imported.
                  dispatchElectronApiSignal("project-changing");
                  // Add "mouseenter" and "mouseleave" event
                  // listener to list items
                  addEventListeners();
                  viewParams.signaling.projectSwitched.dispatch(project);
                });
            }
          }
        });

        this.dataProvidersVisibleSubscription = this.dataProvidersVisible.subscribe((newValue) => {
          // Toggle visibility of the data provider section.
          toggleDataProvidersSection(newValue);
          // Send signal that will cause navtree-toggler to hide the navtree
          viewParams.signaling.dataProviderSectionToggled.dispatch(newValue);
        });

        if (ViewModelUtils.isElectronApiAvailable()) {
          window.electron_api.ipc.receive('on-project-switched', (switching) => {
            switch(switching.action) {
              case "create":
              case "select":
              case "navigate": {
                let project = ConsoleProjectManager.getByName(switching.from.name);
                if (CoreUtils.isNotUndefinedNorNull(project)) {
                  deactivateDataProviders([...project.dataProviders])
                    .then(() => {
                      project = ConsoleProjectManager.createFromEntry(switching.to);
                      if (CoreUtils.isNotUndefinedNorNull(project)) {
                        setCurrentProject(project);
                        // Add "mouseenter" and "mouseleave" event
                        // listener to list items
                        addEventListeners();
                        viewParams.signaling.projectSwitched.dispatch(switching.from);
                        if (viewParams.onTabStripContentHidden()) viewParams.onTabStripContentVisible(true);
                      }
                    });
                  }
                }
                break;
              case "rename":
                ConsoleProjectManager.renameProject(switching.from.name, switching.to.name);
                self.project.name = switching.to.name;
                setProjectAlias(self.project.name);
                break;
            }
          });
        }

        // Be sure to create a binding for any signaling add in
        // this module. In fact, the code for the add needs to
        // be moved here physically.

        let binding = viewParams.signaling.showStartupTasksTriggered.add((startupTask) => {
          chooseStartupTask(startupTask);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.perspectiveChanged.add((newPerspective) => {
          toggleDataProvidersToggleStrip(false);
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
          }, 5
        );
      }.bind(this);

      this.disconnected = function () {
        // Dispose of change subscriptions on knockout observables.
        self.projectFileContentsSubscription.dispose();
        self.dataProvidersVisibleSubscription.dispose();

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

      this.dataProvidersExpanderClickHandler = function (event) {
        const state = event.currentTarget.parentNode.attributes["data-slideup-state"].value;
        switch(state) {
          case "collapsed":
            toggleDataProvidersToggleStrip(true);
            break;
          case "expanded":
            toggleDataProvidersToggleStrip(false);
            break;
        }
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
        self.projectFile = ko.observable("");
        return project;
      }

      function initializeDialogFields() {
        return {id: '0123456789012', name: "", type: DataProvider.prototype.Type.ADMINSERVER.name};
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
                Logger.info(`[DATAPROVIDERS] ipcMain.handle()->ipcRenderer.invoke()->getWorkingProject() "current-project-requesting" reply=null`);
                project = ConsoleProjectManager.createFromEntry({name: "(Unnamed Project)"});
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
                  project = ConsoleProjectManager.createFromEntry({name: "(Unnamed Project)", isDefault: true});
                }

                setCurrentProject(project);
              });
          }

        }

        return project;
      }

      function setCurrentProject(project) {
        // Update CFE_PROJECT_NAME runtime property
        Runtime.setProperty(Runtime.PropertyName.CFE_PROJECT_NAME, project.name);
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
                  } else {
                    resolve(wlsModuleConfig.viewModel.canExit(dataProvider.type === DataProvider.prototype.Type.ADMINSERVER.name ? "exit": "navigation"));
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
            }
          });
        };
        return Promise.resolve(start());
      }

      /**
       * Returns a new instance of a DialogFields class, for a given ``dataProviderType``.
       * @param {DataProvider.prototype.Type} dataProviderType
       * @returns {DialogFields}
       * @private
       */
      function getDialogFields(dataProviderType) {
        const dialogFields = new DialogFields();
        dialogFields.putValue("id", `${DataProviderManager.getNextDataProviderId(dataProviderType)}`);
        dialogFields.addField("name");
        dialogFields.putValue("type", dataProviderType.name);
        dialogFields.putValue("readonly", CoreUtils.isUndefinedOrNull(window.electron_api));

        switch(dataProviderType) {
          case DataProvider.prototype.Type.ADMINSERVER:
            dialogFields.putValue("url", "http://localhost:7001");
            dialogFields.addField("username");
            dialogFields.addField("password");
            break;
          case DataProvider.prototype.Type.MODEL:
            dialogFields.addField("file");
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
        dialogFields.putValue("id", dataProvider.id);
        dialogFields.putValue("name", dataProvider.name);
        dialogFields.putValue("type", dataProvider.type);
        // The "readonly" dialog field is used to set
        // readonly attribute on the "File:" field.
        // Set it based on whether we're running as
        // an Electron app (false), not not (true).
        dialogFields.putValue("readonly", CoreUtils.isUndefinedOrNull(window.electron_api));

        switch(dataProvider.type) {
          case DataProvider.prototype.Type.ADMINSERVER.name:
            dialogFields.putValue("url", dataProvider.url);
            dialogFields.putValue("username", dataProvider.username);
            dialogFields.putValue("password", dataProvider.password);
            break;
          case DataProvider.prototype.Type.MODEL.name:
            dialogFields.putValue("file", dataProvider.file);
            if (dataProvider.state === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
              self.modelFile(ViewModelUtils.isElectronApiAvailable() ? dataProvider.file : "");
            }
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
            dataProvider.putValue("class", "oj-navigationlist-item-icon oj-ux-ico-domain cfe-provider-icon");
            dataProvider.putValue("url", dialogFields.url);
            dataProvider.putValue("username", dialogFields.username);
            dataProvider.putValue("password", dialogFields.password);
            break;
          case DataProvider.prototype.Type.MODEL:
            dataProvider = DataProviderManager.createWDTModel({id: dialogFields.id, name: dialogFields.name, type: dialogFields.type, beanTrees: []});
            dataProvider.putValue("class", "oj-navigationlist-item-icon oj-ux-ico-file-other cfe-provider-icon");
            dataProvider.putValue("file", dialogFields.file);
            break;
        }
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
              delete self.modelFiles[dataProvider.id];
              if (CoreUtils.isUndefinedOrNull(dataProvider.file)) {
                delete self.dialogFields().file;
              }
              else {
                if (dataProvider.state === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
                  self.modelFile(ViewModelUtils.isElectronApiAvailable() ? dataProvider.file : "");
                }
              }
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
        dataProvider.putValue("name", dialogFields.name);
        for (const i in dataProvider.beanTrees)
        {
          if (CoreUtils.isNotUndefinedNorNull(dataProvider.beanTrees[i].provider)) {
            dataProvider.beanTrees[i].provider["name"] = dialogFields.name;
          }
        }

        switch(dataProvider.type) {
          case DataProvider.prototype.Type.ADMINSERVER.name:
            dataProvider.putValue("url", dialogFields.url);
            dataProvider.putValue("username", dialogFields.username);
            dataProvider.putValue("password", dialogFields.password);
            break;
          case DataProvider.prototype.Type.MODEL.name:
            if (CoreUtils.isNotUndefinedNorNull(dialogFields.file)) {
              dataProvider.putValue("file", dialogFields.file);
            }
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
          .on("mouseenter", onMouseEnter)
          .on("mouseleave", onMouseLeave);
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

      function sortConnectionModels() {
        connectionsModels.sort((left, right) => {
          return left.type === right.type ? 0 :
            left.type === DataProvider.prototype.Type.ADMINSERVER.name ? -1 : 1;
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
          $(`#${dataProviders[i].id} span.cfe-provider-icon`).css("color", (dataProviders[i].state === CoreTypes.Domain.ConnectState.CONNECTED.name ? PROVIDER_ACTIVATED_COLOR : PROVIDER_DEACTIVATED_COLOR));
          $(`#${dataProviders[i].id} span.oj-navigationlist-item-label`).css("color", (dataProviders[i].state === CoreTypes.Domain.ConnectState.CONNECTED.name ? PROVIDER_ACTIVATED_COLOR : PROVIDER_DEACTIVATED_COLOR));
        }
      }

      function selectAdminServerConnection(dataProvider) {
        if (dataProvider.state === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
          DataProviderManager.activateAdminServerConnection(dataProvider)
            .then(reply => {
              dataProvider.populateFromResponse(reply.body.data);
              if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
                self.responseMessage('');
                setResponseMessageVisibility("connection-response-message", false);
                self.project.upsertDataProvider(dataProvider);
                updateConnectionsModels(dataProvider);
                dispatchElectronApiSignal("project-changing");
                viewParams.onCachedStateChanged(self.tabNode, self.project);
                useSucceededHandler(dataProvider);
              }
              else if (dataProvider.state === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
                setListItemColor([dataProvider]);
                self.responseMessage(reply.failureReason);
                setResponseMessageVisibility("connection-response-message", true);
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

      function selectWDTModel(dataProvider) {
        if (dataProvider.state === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
          if (CoreUtils.isNotUndefinedNorNull(dataProvider.fileContents)) {
            // We're not connected, but we have the file contents.
            const blob = self.modelFiles[dataProvider.id];
            if (CoreUtils.isUndefinedOrNull(blob)) {
              const formData = getWDTModelFormData(dataProvider);
              sendWDTModelFormData(dataProvider, formData);
              delete self.modelFiles[dataProvider.id];
            }
          }
          else {
            createWDTFileBlob(dataProvider);
          }
        }
        else if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
          // We're connected, so the "fileContents" field should already
          // be here.
          if (CoreUtils.isUndefinedOrNull(dataProvider["fileContents"])) {
            if (CoreUtils.isNotUndefinedNorNull(dataProvider.file)) {
              // It's not, so set file name to an empty string,
              // which will cause the user to be prompted to
              // choose the physical WDT model file.
              dataProvider.file = "";
            }
            // Put up dialog, so user can choose the WDT model
            // file to associated with the data provider.
            editWDTModel(dataProvider);
          }
          else {
            // We're good to go, so "activate" or make this the
            // data provider user is currently working with.
            activateDataProvider(dataProvider);
          }
        }
      }

      function createWDTFileBlob(dataProvider) {
        const blob = self.modelFiles[dataProvider.id];
        if (CoreUtils.isNotUndefinedNorNull(blob)) {
          uploadWDTModelFile(dataProvider)
            .then(formData => {
              sendWDTModelFormData(dataProvider, formData);
              delete self.modelFiles[dataProvider.id];
            })
            .catch(failure => {
              ViewModelUtils.failureResponseDefaultHandling(failure);
            });
        }
        else {
          if (CoreUtils.isNotUndefinedNorNull(window.electron_api)) {
            // Get the file contents, so we can create
            // the multipart/form POST we need to get
            // a session for a model provider type.
            window.electron_api.ipc.invoke('file-reading', dataProvider.file)
              .then(response => {
                if (CoreUtils.isNotUndefinedNorNull(response) && CoreUtils.isNotUndefinedNorNull(response.file)) {
                  // This means the user picked the model file
                  // and it was read.
                  Logger.info(`[DATAPROVIDERS] ipcMain.handle()->ipcRenderer.invoke()->createWDTFileBlob(dataProvider) 'file-reading' file=${response.file}`);
                  self.modelFiles[dataProvider.id] = new Blob([response.fileContents], {type: response.mediaType});
                  self.modelFile(response.file);
                  dataProvider.file = response.file;
                  uploadWDTModelFile(dataProvider)
                    .then(formData => {
                      sendWDTModelFormData(dataProvider, formData);
                      delete self.modelFiles[dataProvider.id];
                    })
                    .catch(failure => {
                      ViewModelUtils.failureResponseDefaultHandling(failure);
                    });
                }
              })
              .catch(failure => {
                ViewModelUtils.failureResponseDefaultHandling(failure);
              });
          }
          else {
            // Put up dialog, so user can choose the WDT model
            // file to associated with the data provider.
            editWDTModel(dataProvider);
          }
        }
      }

      function sendWDTModelFormData(dataProvider, formData) {
        DataProviderManager.uploadWDTModel(dataProvider, formData)
          .then(reply => {
            dataProvider.populateFromResponse(reply.body.data);
            if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
              self.responseMessage('');
              setResponseMessageVisibility("model-response-message", false);
              self.project.upsertDataProvider(dataProvider);
              updateConnectionsModels(dataProvider);
              dispatchElectronApiSignal("project-changing");
              viewParams.onCachedStateChanged(self.tabNode, self.project);
              useSucceededHandler(dataProvider);
            }
            else if (dataProvider.state === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
              setListItemColor([dataProvider]);
              self.responseMessage(reply.failureReason);
              setResponseMessageVisibility("model-response-message", true);
              editWDTModel(dataProvider);
            }
          })
          .catch(response => {
            dataProvider.file = "";
            dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
            delete dataProvider["fileContents"];
            if (CoreUtils.isError(response)) {
              response["failureReason"] = response;
            }
            self.responseMessage(response.failureReason);
            setResponseMessageVisibility("model-response-message", true);
            editWDTModel(dataProvider);
          });
      }

      function useSucceededHandler(dataProvider) {
        if (self.project.name === null) {
          // Add selected data provider to "in-memory"
          // project, using "InMemory" as the name.
          self.project.name = "(Unnamed Project)";
          ConsoleProjectManager.add(self.project);
        }

        activateDataProvider(dataProvider);
      }

      function activateDataProvider(dataProvider) {
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
        Runtime.setProperty(Runtime.PropertyName.CBE_WLS_USERNAME, dataProvider.username);
        // Send signal about domain being changed, if
        // this is an "adminserver" data provider.
        if (dataProvider.type === DataProvider.prototype.Type.ADMINSERVER.name) {
          viewParams.signaling.domainChanged.dispatch("dataproviders");
        }
        // Send signal about the runtime mode (e.g.
        // "ONLINE", "OFFLINE", "DETACHED") the CFE
        // console is running in.
        viewParams.signaling.modeChanged.dispatch(dataProvider.connectivity);
        // Send signal about data provider being selected.
        viewParams.signaling.dataProviderSelected.dispatch(dataProvider);
        // Unselect the selected data provider list item,
        // to workaround the default JET behavior with
        // change events. Doing this allows the end user
        // to repeatedly click on the same list item.
        self.connectionsModelsSelectedItem('');
      }

      function removeSucceededHandler(dataProvider, showDialog = true) {
        // Remove from instance-scoped observable array.
        deleteConnectionsModels(dataProvider.id);
        // Handle scenario where all of the data providers
        // have been removed.
        if (connectionsModels().length === 0) {
          Runtime.setProperty(Runtime.PropertyName.CFE_MODE, CoreTypes.Console.RuntimeMode.DETACHED.name);
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

      function getWDTModelFormData(dataProvider) {
        const formData = new FormData();
        // Add multipart section for model file, using
        // "model" as the part name.
        formData.append(
          'model',
          new Blob([JSON.stringify(dataProvider["fileContents"])]),
          dataProvider.file
        );
        // Add multipart section for data, using "data" as
        // the part name.
        formData.append(
          'data',
          JSON.stringify({
            name: dataProvider.id,
            providerType: "WDTModel"
          })
        );

        return formData;
      }

      function readWDTModelFile(dataProvider, blob) {
        return new Promise((resolve, reject) => {
          // Declare reader for reading model file.
          const reader = new FileReader();

          // Callback that will be called when the
          // reader.readAsText() function is called.
          // The blob argument will contain the
          // File/Blob object for the model file.
          reader.onload = (function (theBlob) {
            return function (event) {
              DataProviderManager.getWDTModelContent(event.target.result, blob.type)
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

      async function uploadWDTModelFile(dataProvider) {
        const reply = await readWDTModelFile(dataProvider, self.modelFiles[dataProvider.id])
        dataProvider["fileContents"] = reply.body.data;
        return getWDTModelFormData(dataProvider);
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
            self.i18n.popups.info.model.file.value(CoreUtils.isNotUndefinedNorNull(dataProvider.file) ? dataProvider.file : oj.Translations.getTranslatedString("wrc-data-providers.prompts.info.fileNotSet.value"));
            break;
        }
        popup.open("#" + dataProvider.id);
      }

      function addAdminServerConnection(dialogParams){
        const entryValues = getDialogFields(DataProvider.prototype.Type.ADMINSERVER);
        self.dialogFields(entryValues);

        self.i18n.dialog.title(self.i18n.titles.add.connections.value);
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString("wrc-data-providers.instructions.connections.add.value"));
        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString("wrc-common.buttons.ok.label"));

        self.responseMessage('');
        setResponseMessageVisibility("connection-response-message",false);

        DataProvidersDialog.showDataProvidersDialog("AddAdminServerConnection", dialogParams, self.i18n, isUniqueDataProviderName)
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
        if (CoreUtils.isNotUndefinedNorNull(template) && ["domain", "sparse"].includes(template)) {
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
        entryValues["action"] = dialogParams.action;
        entryValues.file = (dialogParams.action === "existing" ? "" : "new-wdt-model.yaml");
        entryValues.readonly = (dialogParams.action === "existing");

        self.dialogFields(entryValues);

        const actionSwitch = (value) => ({
          "new": "new",
          "existing": "add"
        })[value];
        const actionPart = actionSwitch(dialogParams.action);

        self.i18n.dialog.title(self.i18n.titles[actionPart].models.value);
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString(`wrc-data-providers.instructions.models.${actionPart}.value`));
        self.i18n.dialog.iconFile(dialogParams.action === "existing" ? self.i18n.icons.choose.iconFile : self.i18n.icons.pick.iconFile);
        self.i18n.dialog.tooltip(dialogParams.action === "existing" ? self.i18n.icons.choose.tooltip : self.i18n.icons.pick.tooltip);

        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString("wrc-common.buttons.ok.label"));

        self.useSparseTemplate([]);
        self.responseMessage('');
        setResponseMessageVisibility("model-response-message",false);

        // Set modelFile observable to "", which will make
        // clicking the "OK" button a no-op, until the end
        // user clicks the directory tree icon
        // (dialogParams.action = "new"), or the download
        // icon (dialogParams.action = "existing").
        self.modelFile("");

        DataProvidersDialog.showDataProvidersDialog("AddWDTModel", dialogParams, self.i18n, isUniqueDataProviderName)
          .then(reply => {
            if (reply) {
              self.dialogFields().file = self.modelFile();
              const dataProvider = addDialogFields(DataProvider.prototype.Type.MODEL, self.dialogFields());
              dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
              if (dialogParams.action === "new") {
                delete self.modelFiles[dataProvider.id];
                const data = createNewWDTModelFile(self.modelFile(), "file-writing");
                const mediaType = "application/x-yaml";
                // The getWDTModelContent() function uses js-yaml to
                // convert the data/YAML into a JS object.
                DataProviderManager.getWDTModelContent(data, mediaType)
                  .then(reply => {
                    // Assign JS object to dataProvider's "fileContents"
                    // property.
                    dataProvider["fileContents"] = reply.body.data;
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
              self.modelFile("");
              self.dialogFields().file = self.modelFile();
              self.responseMessage('');
              setResponseMessageVisibility("model-response-message", false);
            }
          });
      }

      function addProject(dialogParams) {
        const entryValues = new DialogFields();
        entryValues.addField("name");
        entryValues.addField("file");

        self.dialogFields(entryValues);

        self.i18n.dialog.title(self.i18n.titles.export.project.value);
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString("wrc-data-providers.instructions.project.export.value"));
        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString("wrc-common.buttons.ok.label"));

        DataProvidersDialog.showDataProvidersDialog("ExportAllToProject", dialogParams, self.i18n, undefined)
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
        if (!dialogFields.file.toLowerCase().endsWith(".json")) dialogFields.file = `${dialogFields.file}.json`;
        self.project.filename = dialogFields.file;

        const options = {
          filepath: dialogFields.file,
          fileContents: self.project.getAsDownloadFormatted(),
          mediaType: "application/json"
        };

        ViewModelUtils.downloadFile(options);
        dispatchElectronApiSignal("project-changing");
        viewParams.onCachedStateChanged(self.tabNode, self.project);
      }

      function dispatchElectronApiSignal(channel) {
        if (CoreUtils.isUndefinedOrNull(self.project)) {
          self.project = ConsoleProjectManager.createFromEntry({name: "(Unnamed Project)"});
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
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString("wrc-data-providers.instructions.project.import.value"));
        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString("wrc-common.buttons.import.label"));

        const entryValues = new DialogFields();
        entryValues.addField("file");
        entryValues.putValue("readonly", CoreUtils.isUndefinedOrNull(window.electron_api));

        self.dialogFields(entryValues);

        self.projectFile('');

        DataProvidersDialog.showDataProvidersDialog("ImportProject", dialogParams, self.i18n, undefined)
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
              })(self.projectFiles["current"]);

              // Read in project file as a data URL.
              reader.readAsText(self.projectFiles["current"]);
            }
          })
          .catch(reason => {
            ViewModelUtils.failureResponseDefaultHandling(reason);
          });
      }

      function readImportedProjectFile(fileText) {
        try {
          // Remove any line breaks from fileText
          const fileContents = CoreUtils.removeLineBreaks(fileText);
          // Better to catch any JSON parsing issues, now.
          const blob = JSON.parse(fileContents);
          // There were no JSON parsing issues, so go ahead
          // an trigger knockout change subscription.
          self.projectFileContents(blob);
        }
        catch (error) {
          ViewModelUtils.failureResponseDefaultHandling(error);
        }
      }

      function chooseStartupTask(startupTask = Runtime.getProperty(Runtime.PropertyName.CFE_STARTUP_TASK)) {
        if (startupTask !== "triggered" && connectionsModels().length > 0) {
          return;
        }

        const startupTasks = [
          {id: "adminserver", value: self.i18n.menus.connections.add.id, label: oj.Translations.getTranslatedString("wrc-data-providers.menus.connections.add.value")},
          {id: "addModel", value: self.i18n.menus.models.add.id, label: oj.Translations.getTranslatedString("wrc-data-providers.menus.models.add.value")},
          {id: "newModel", value: self.i18n.menus.models.new.id, label: oj.Translations.getTranslatedString("wrc-data-providers.menus.models.new.value")},
          {id: "importProject", value: self.i18n.menus.project.import.id, label: oj.Translations.getTranslatedString("wrc-data-providers.menus.project.import.value")}
        ];

        if (startupTask !== "" && startupTask !== "none") {
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
            startupTask = "";
          }
        }

        if (startupTask !== "") {
          // We have a valid startup task, so just use it.
          useChosenStartupTask(startupTask);
        }
        else {
          const dialogParams = {};
          const entryValues = new DialogFields();
          entryValues.putValue("startupTask", self.i18n.menus.connections.add.id);
          entryValues.putValue("startupTasks", startupTasks);
          self.dialogFields(entryValues);

          // There was no settings value, or it was invalid.
          // In both cases, we need to show the provider type
          // chooser dialog.
          self.i18n.dialog.title(oj.Translations.getTranslatedString("wrc-data-providers.titles.startup.task.value"));
          self.i18n.dialog.instructions(oj.Translations.getTranslatedString("wrc-data-providers.instructions.task.startup.value"));
          self.i18n.buttons.ok.label(oj.Translations.getTranslatedString("wrc-common.buttons.choose.label"));

          DataProvidersDialog.showDataProvidersDialog("StartupTaskChooser", dialogParams, self.i18n, undefined)
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
        if (startupTask !== "none") self.projectMoreMenuClickListener({target: { value: startupTask}});
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

        self.i18n.dialog.title(oj.Translations.getTranslatedString("wrc-data-providers.titles.edit.connections.value"));
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString("wrc-data-providers.instructions.connections.edit.value"));
        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString("wrc-common.buttons.ok.label"));

        const dialogParams = {
          type: dataProvider.type,
          id: dataProvider.id,
          accepts: "application/yaml,application/x-yaml,application/json"
        };

        DataProvidersDialog.showDataProvidersDialog("EditAdminServerConnection", dialogParams, self.i18n, isUniqueDataProviderName)
          .then(reply => {
            if (reply) {
              // FortifyIssueSuppression(C9827329D56593134375D08BC3A21847) Password Management: Password in Comment
              // Not a password, just a comment password property.
              const removeRequired = (dataProvider.url !== self.dialogFields().url || dataProvider.username !== self.dialogFields().username || dataProvider.password !== self.dialogFields().password);
              if (removeRequired) {
                removeDataProvider(dataProvider)
                  .then(reply =>{
                    if (reply.succeeded) {
                      dataProvider = updateDataProvider(dataProvider, self.dialogFields());
                      dataProvider = DataProviderManager.createAdminServerConnection(dataProvider);
                      // Set state to disabled, because we need to set
                      // things up to get a provider session.
                      dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
                      selectAdminServerConnection(dataProvider);
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
                dataProvider = updateDataProvider(dataProvider, self.dialogFields());
//<LW                dataProvider.state = (!removeRequired ? CoreTypes.Domain.ConnectState.CONNECTED.name : CoreTypes.Domain.ConnectState.DISCONNECTED.name);
                updateConnectionsModels(dataProvider);
                if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
                  dispatchElectronApiSignal("project-changing");
                  viewParams.onCachedStateChanged(self.tabNode, self.project);
                }
                selectAdminServerConnection(dataProvider);
              }
            }
            else {
              revertDialogFields(dataProvider);
              self.responseMessage('');
              setResponseMessageVisibility("connection-response-message", false);
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
        entryValues["action"] = "existing";
        self.dialogFields(entryValues);

        self.i18n.dialog.title(oj.Translations.getTranslatedString("wrc-data-providers.titles.edit.models.value"));
        self.i18n.dialog.instructions(oj.Translations.getTranslatedString("wrc-data-providers.instructions.models.edit.value"));
        self.i18n.dialog.iconFile(self.i18n.icons.choose.iconFile);
        self.i18n.dialog.tooltip(self.i18n.icons.choose.tooltip);
        self.i18n.buttons.ok.label(oj.Translations.getTranslatedString("wrc-common.buttons.ok.label"));

        const dialogParams = {
          type: dataProvider.type,
          id: dataProvider.id,
          accepts: "application/yaml,application/x-yaml,application/json"
        };

        self.connectionsModelsSelectedItem('');

        // Finally, we need to show the "Edit WDT Model" dialog,
        // mainly for the purpose of getting the model file.
        DataProvidersDialog.showDataProvidersDialog("EditWDTModel", dialogParams, self.i18n, isUniqueDataProviderName)
          .then(reply => {
            if (reply) {
              const removeRequired = (dataProvider.file !== self.modelFile() || CoreUtils.isNotUndefinedNorNull(self.modelFiles[dataProvider.id]));
              if (removeRequired) {
                // Remove fileContents property before proceeding.
                delete dataProvider["fileContents"];
                removeDataProvider(dataProvider)
                  .then(reply =>{
                    if (reply.succeeded) {
                      self.dialogFields().file = self.modelFile();
                      dataProvider.name = self.dialogFields().name;
                      dataProvider.file = self.dialogFields().file;
                      dataProvider = DataProviderManager.createWDTModel(dataProvider);
                      dataProvider.state = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
                      selectWDTModel(dataProvider);
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
                updateWDTModel(dataProvider, self.dialogFields());
              }
            }
            else {
              revertDialogFields(dataProvider);
              self.responseMessage('');
              setResponseMessageVisibility("model-response-message", false);
            }
          });
      }

      function updateWDTModel(dataProvider, dialogFields) {
        dataProvider = updateDataProvider(dataProvider, dialogFields);
        updateConnectionsModels(dataProvider);
        if (dataProvider.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
          dispatchElectronApiSignal("project-changing");
          viewParams.onCachedStateChanged(self.tabNode, self.project);
        }
        if (CoreUtils.isNotUndefinedNorNull(dataProvider.file)) {
          selectWDTModel(dataProvider);
        }
      }

      function removeDataProvider(dataProvider) {
        switch (dataProvider.type) {
          case DataProvider.prototype.Type.ADMINSERVER.name:
            return DataProviderManager.removeAdminServerConnection(dataProvider);
          case DataProvider.prototype.Type.MODEL.name:
            return DataProviderManager.removeWDTModel(dataProvider);
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
                Logger.info(`[DATAPROVIDERS] removeById - Done`);
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
          self.connectionsModelsSelectedItem('');
          return window.electron_api.ipc.invoke('credentials-requesting', options);
        }
        else {
          const reply = {};
          reply["succeeded"] = CoreUtils.isNotUndefinedNorNull(options.provider.password);
          if (reply.succeeded) reply["secret"] = options.provider.password;
          return Promise.resolve(reply);
        }
      }

      this.toolbarMoreMenuClickListener = function(event) {
        const action = event.currentTarget.attributes["data-item-action"].value;

        const dialogParams = {
          accepts: "application/yaml,application/x-yaml,application/json"
        };

        switch(action) {
          case "export":
            addProject(dialogParams);
            break;
          case "import":
            importProject(dialogParams);
            break;
        }
      }.bind(this);

      this.launchProjectMoreMenu = function (event) {
        event.preventDefault();
        document.getElementById("projectMoreMenu").open(event);
      };

      this.projectMoreMenuClickListener = function (event) {
        const dialogParams = {
          id: event.target.value,
          accepts: "application/yaml,application/x-yaml,application/json"
        };

        switch(dialogParams.id) {
          case self.i18n.menus.connections.add.id:
            addAdminServerConnection(dialogParams);
            break;
          case self.i18n.menus.models.add.id:
            dialogParams["action"] = "existing";
            addWDTModel(dialogParams);
            break;
          case self.i18n.menus.models.new.id:
            dialogParams["action"] = "new";
            addWDTModel(dialogParams);
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
      }.bind(this);

      this.connectionsModelsIconBarClickListener = function(event) {
        const action = event.currentTarget.attributes["data-item-action"].value;

        const dialogParams = {
          type: event.currentTarget.attributes["data-item-type"].value,
          id: event.currentTarget.attributes["data-item-id"].value,
          accepts: "application/yaml,application/x-yaml,application/json"
        };

        const actionSwitch = (value) => ({
          "edit": "Edit",
          "delete": "Delete"
        })[value];
        const actionPart = actionSwitch(action);

        const mapSwitch = (value) => ({
          "adminserver": "connections",
          "model": "models"
        })[value];
        const mapValue = mapSwitch(dialogParams.type);

        self.i18n.dialog.instructions(oj.Translations.getTranslatedString(`wrc-data-providers.instructions.${mapValue}.${action}.value`));

        if (action === "info") {
          const dataProvider = connectionsModels().find(item => item.id === dialogParams.id);
          if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
            const popup = document.getElementById("dataProviderInfoPopup");
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
        else if (action === "edit") {
          const dataProvider = connectionsModels().find(item => item.id === dialogParams.id);

          self.responseMessage('');

          switch(dialogParams.type) {
            case DataProvider.prototype.Type.ADMINSERVER.name:
              setResponseMessageVisibility("connection-response-message", false);
              editAdminServerConnection(dataProvider);
              break;
            case DataProvider.prototype.Type.MODEL.name:
              setResponseMessageVisibility("model-response-message", false);
              editWDTModel(dataProvider);
              break;
          }
        }
        else {
          const dataProvider = connectionsModels().find(item => item.id === dialogParams.id);
          deactivateDataProviders([dataProvider])
            .then(() =>{
              removeSucceededHandler(dataProvider);
              dispatchElectronApiSignal("project-changing");
              viewParams.onCachedStateChanged(self.tabNode, self.project);
            })
            .catch(response => {
              ViewModelUtils.failureResponseDefaultHandling(response);
            });
        }

      };

      this.connectionsModelsSelectedItemChanged = function(event) {
        // Only do something if user actually clicked a
        // list item. self.connectionsModelsSelectedItem
        // is a knockout observable that is frequently
        // set to '', in order to circumvent the default
        // change event triggering of a JET navigation
        // list control.
        if (self.connectionsModelsSelectedItem() !== '') {
          // event.target.currentItem contains the id of
          // the data provider the user clicked in the list.
          const dataProvider = connectionsModels().find(item => item.id === event.target.currentItem);
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
                      dataProvider["password"] = reply.secret;
                      selectAdminServerConnection(dataProvider);
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
                selectWDTModel(dataProvider);
                break;
            }
          }
        }
      };

      this.newFileClickHandler = (event) => {
        const filepath = self.modelFile();
        const data = createNewWDTModelFile(filepath);
        if (!ViewModelUtils.isElectronApiAvailable() && filepath !== "") {
          const mediaType = "application/x-yaml";
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
      function createNewWDTModelFile(filepath, channel = "file-creating") {
        const data = getNewWDTModelDataByTemplate(self.useSparseTemplate().length > 0 ? "sparse" : "domain");
        if (ViewModelUtils.isElectronApiAvailable()) {
          if (filepath !== "") {
            window.electron_api.ipc.invoke(channel, {filepath: filepath, fileContents: data})
              .then(reply => {
                self.modelFile(reply.filePath);
              })
              .catch(error => {
                // Creating a fake error object because the error object here
                // has the wrong message
                const fakeError = new Error(`Failed to write file: ${filepath}`);
                ViewModelUtils.failureResponseDefaultHandling(fakeError, "error");
              });
          }
        }
        return data;
      }

      this.chooseFileClickHandler = (event) => {
        const fileType = event.currentTarget.attributes["data-input-type"].value;
        if (ViewModelUtils.isElectronApiAvailable()) {
          const dialogParams = {
            defaultPath: self.dialogFields().file,
            properties: ['openFile'],
            filters: { name: 'Supported Formats', extensions: ['yml', 'yaml', 'json']}
          };
          window.electron_api.ipc.invoke('file-choosing', dialogParams)
            .then(response => {
              Logger.info(`[DATAPROVIDERS] ipcMain.handle()->ipcRenderer.invoke()->this.chooseFileClickHandler(event) 'file-choosing' file=${response.file}`);
              if (CoreUtils.isNotUndefinedNorNull(response.file)) {
                switch(fileType) {
                  case "model": {
                    self.modelFile(response.file);
                  }
                    break;
                  case "project": {
                    self.projectFiles["current"] = new Blob([response.fileContents], {type: response.mediaType});
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
          const chooser = $("#file-chooser");
          chooser.on("change", self.chooseFileChangeHandler);
          chooser.trigger("click");
          chooser.attr("data-input", self.dialogFields().id);
          chooser.attr("data-input-type", fileType);
          event.preventDefault();
        }
      };

      this.chooseFileChangeHandler = function(event) {
        const files = event.currentTarget.files;
        if (files.length > 0) {
          const fileType = event.currentTarget.attributes["data-input-type"].value;
          switch(fileType){
            case "model": {
              const dataProviderId = event.currentTarget.attributes["data-input"].value;
              self.modelFiles[dataProviderId] = files[0];
              self.modelFile(files[0].name);
            }
              break;
            case "project": {
              self.projectFiles["current"] = files[0];
              self.projectFile(files[0].name)
            }
              break;
          }

          const chooser = $("#file-chooser");
          chooser.off("change", self.chooseFileChangeHandler);
          chooser.val("");
        }
      };

      /**
       * Toggle the visibility of the entire data providers section.
       * <p>Only a narrow strip with the collapse/expand icon at the top, will remain visible.</p>
       * @param {boolean} visible
       * @private
       */
      function toggleDataProvidersSection(visible) {
        $("#projects-section").css({"display": (visible ? "inline-flex" : "none")});
      }

      function onMouseEnter(event) {
        const listItemId = event.currentTarget.attributes["id"].value;
        $(`#${listItemId}-iconbar`).css({"visibility":"visible"});
      }

      function onMouseLeave(event) {
        const listItemId = event.currentTarget.attributes["id"].value;
        $(`#${listItemId}-iconbar`).css({"visibility":"hidden"});
      }

      function addEventListeners() {
        connectionsModels().forEach((item) => {
          $(`#${item.id}`)
            .on("mouseenter", onMouseEnter)
            .on("mouseleave", onMouseLeave);
        });
      }

      function removeEventListeners() {
        connectionsModels().forEach((item) => {
          $(`#${item.id}`)
            .off("mouseenter", onMouseEnter)
            .off("mouseleave", onMouseLeave);
        });
      }

      function toggleDataProvidersToggleStrip(visible) {
        const div = document.getElementById("data-providers-toggle-strip");
        if (div !== null) {
          const currentState = div.getAttribute("data-slideup-state");
          if (visible && currentState !== "expanded") {
            div.setAttribute("data-slideup-state", "expanded");
          }
          else {
            div.setAttribute("data-slideup-state", (visible ? "expanded": "collapsed"));
            self.dataProvidersVisible(visible);
          }
        }
      }

    }

    return DataProvidersTemplate;
  }
);
