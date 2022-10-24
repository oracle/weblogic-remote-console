/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojmodule-element-utils', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', 'ojs/ojknockout-keyset', 'wrc-frontend/integration/controller', 'wrc-frontend/apis/data-operations', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/microservices/wdt-model/archive', './table-sorter', './actions-dialog', './unsaved-changes-dialog', './set-sync-interval-dialog', './container-resizer', 'wrc-frontend/microservices/page-definition/types', 'wrc-frontend/microservices/page-definition/actions', './help-form', './wdt-form', 'wrc-frontend/microservices/customize/table-manager', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'wrc-frontend/core/types', 'wrc-frontend/core/runtime', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojbinddom', 'ojs/ojdialog', 'ojs/ojmodule-element', 'ojs/ojmodule', 'ojs/ojpagingcontrol', 'cfe-multi-select/loader'],
  function (oj, ko, Router, ModuleElementUtils, ArrayDataProvider, HtmlUtils, keySet, Controller, DataOperations, MessageDisplaying, ModelArchive, TableSorter, ActionsDialog, UnsavedChangesDialog, SetSyncIntervalDialog, ContentAreaContainerResizer, PageDataTypes, PageDefinitionActions, HelpForm, WdtForm, TableCustomizerManager, ViewModelUtils, CoreUtils, CoreTypes, Runtime, Logger) {
    function TableViewModel(viewParams) {
      // Declare reference to instance of the ViewModel
      // that JET creates/manages the lifecycle of. This
      // reference is needed (and used) inside closures.
      const self = this;

      // START: Declare instance variables used in the ViewModel's view

      this.i18n = {
        buttons: {
          yes: {disabled: false,
            label: oj.Translations.getTranslatedString('wrc-common.buttons.yes.label')
          },
          no: {disabled: false,
            label: oj.Translations.getTranslatedString('wrc-common.buttons.no.label')
          },
          ok: {disabled: false,
            label: oj.Translations.getTranslatedString('wrc-common.buttons.ok.label')
          },
          cancel: {
            disabled: false,
            visible: ko.observable(false),
            label: oj.Translations.getTranslatedString('wrc-common.buttons.cancel.label')
          }
        },
        prompts: {
          unsavedChanges: {
            needDownloading: {value: oj.Translations.getTranslatedString('wrc-unsaved-changes.prompts.unsavedChanges.needDownloading.value')}
          }
        },
        labels: {
          'totalRows': {
            value: ko.observable()
          }
        },
        dialog: {
          title: ko.observable(''),
          instructions: ko.observable(''),
          prompt: ko.observable('')
        },
        dialogSync: {
          title: oj.Translations.getTranslatedString('wrc-sync-interval.dialogSync.title'),
          instructions: oj.Translations.getTranslatedString('wrc-sync-interval.dialogSync.instructions'),
          fields: {
            interval: {value: ko.observable(''),
              label: oj.Translations.getTranslatedString('wrc-sync-interval.dialogSync.fields.interval.label')
            }
          }
        },
        actionsDialog: {
          title: ko.observable(''),
          instructions: ko.observable(''),
          buttons: {
            ok: {disabled: ko.observable(true),
              label: ko.observable('')
            },
            cancel: {disabled: false,
              label: oj.Translations.getTranslatedString('wrc-common.buttons.cancel.label')
            }
          }
        }
      };

      this.perspective = viewParams.perspective;

      this.introductionHTML = ko.observable();

      this.tableToolbarModuleConfig = ModuleElementUtils.createConfig({
        viewPath: `${Controller.getModulePathPrefix()}views/content-area/body/table-toolbar.html`,
        viewModelPath: `${Controller.getModulePathPrefix()}viewModels/content-area/body/table-toolbar`,
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          perspective: viewParams.perspective,
          pageDefinitionActions: getPageDefinitionActions,
          newAction: newBean,
          onWriteContentFile: writeContentFile,
          isWdtTable: isWdtTable,
          isShoppingCartVisible: isShoppingCartVisible,
          onConnected: setFormContainerMaxHeight,
          onLandingPageSelected: selectLandingPage,
          onBeanPathHistoryToggled: toggleBeanPathHistory,
          onInstructionsToggled: toggleInstructions,
          onHelpPageToggled: toggleHelpPage,
          onShoppingCartViewed: viewShoppingCart,
          onShoppingCartDiscarded: discardShoppingCart,
          onSyncClicked: setSyncInterval,
          onSyncIntervalClicked: captureSyncInterval,
          onActionButtonClicked: renderActionsDialog,
          onCustomizeButtonClicked: toggleCustomizer,
          onCustomViewButtonClicked: createCustomView
        }
      });

      this.columnDataProvider = ko.observable();
      this.tableCustomizerManager = new TableCustomizerManager(viewParams.parentRouter.data.rdjData().tableCustomizer);

      self.applyCustomizations = (visibleColumns, hiddenColumns, applyButton = false) => {
        const columnMetadata = self.tableCustomizerManager.applyCustomizations.call(
          self.tableCustomizerManager,
          getColumnMetadata(viewParams.perspective.id),
          visibleColumns,
          hiddenColumns
        );
        self.columnDataProvider(columnMetadata);
        if (applyButton) {
          const defaultColumns = getDefaultVisibleAndHiddenColumns();
          self.tableCustomizerManager.checkTableHiddenValue(
            visibleColumns,
            defaultColumns.visibleColumns,
            defaultColumns.hiddenColumns,
            viewParams.parentRouter.data.rdjData().displayedColumns
          );
        }
      };

      self.resetCustomizations = function (valueHasMutated = false) {
        const defaultColumns = getDefaultVisibleAndHiddenColumns();
        const columnMetadata = self.tableCustomizerManager.applyCustomizations.call(
          self.tableCustomizerManager,
          getColumnMetadata(viewParams.perspective.id),
          defaultColumns.visibleColumns,
          defaultColumns.hiddenColumns,
          valueHasMutated
        );
        self.columnDataProvider(columnMetadata);
      };

      this.tableCustomizerModuleConfig = ModuleElementUtils.createConfig({
        viewPath: `${Controller.getModulePathPrefix()}views/content-area/body/table-customizer.html`,
        viewModelPath: `${Controller.getModulePathPrefix()}viewModels/content-area/body/table-customizer`,
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          perspective: viewParams.perspective,
          visibleColumns: self.tableCustomizerManager.getVisibleColumnsObservable.call(self.tableCustomizerManager),
          hiddenColumns: self.tableCustomizerManager.getHiddenColumnsObservable.call(self.tableCustomizerManager),
          customizerUrl: self.tableCustomizerManager.getCustomizerUrlObservable.call(self.tableCustomizerManager),
          applyCustomizationsCallback: self.applyCustomizations,
          resetCustomizationsCallback: self.resetCustomizations
        },
      });

      this.rdjDataProvider = ko.observable();
      this.selectedRows = new keySet.ObservableKeySet();
      this.rowsPerPage = ko.observable(10000);

      this.readonly = ko.observable(Runtime.isReadOnly());
      this.nonwritable = ko.observable(false);

      this.actionsDialog = {formLayout: { html: ko.observable({}) }};

      this.showHelp = ko.observable(false);
      this.showInstructions = ko.observable(true);
      this.helpDataSource = ko.observableArray([]);
      this.helpDataProvider = new ArrayDataProvider(this.helpDataSource);
      this.helpFooterDom = ko.observable({});
      this.tableHelpColumns = ko.observableArray([]);

      // END: Declare instance variables used in the ViewModel's view
      this.contentAreaContainerResizer = new ContentAreaContainerResizer(viewParams.perspective);
      this.signalBindings = [];
      this.syncTimerId = undefined;
      this.availableItems = [];
      this.chosenItems = [];
      this.pageDefinitionActions = undefined;
      this.confirmed = ko.observable(function (event) { });
      this.confirmationMessage = ko.observable('');
      this.tableSort = {enabled: true, property: null, direction: null};
      this.tableSortable = ko.observable({});

      self.connected = function () {
        self.signalBindings.push(viewParams.signaling.nonwritableChanged.add((newRO) => {
          self.nonwritable(newRO);
        }));

        self.signalBindings.push(viewParams.signaling.readonlyChanged.add((newRO) => {
          self.readonly(newRO);
          renderPage();
        }));

        renderPage();
        this.subscription = viewParams.parentRouter.data.rdjData.subscribe(renderPage.bind(self));
        cancelSyncTimer();

        if (isWdtTable()) {
          self.wdtForm = new WdtForm(viewParams);
        }
      };

      self.disconnected = function () {
        if (CoreUtils.isNotUndefinedNorNull(self.subscription)) {
          self.subscription.dispose();
        }
        cancelSyncTimer();

        self.signalBindings.forEach(function (binding) {
          binding.detach();
        });

        self.signalBindings = [];
      };

      this.canExit = function () {
        return Promise.resolve(true);
      };

      function isWdtTable() {
        // The same form is used for WDT model and Property List for uniform content file handling
        return (['modeling', 'properties'].indexOf(viewParams.perspective.id) !== -1);
      }

      function isShoppingCartVisible() {
        // The shopping cart will be visible expect for the WDT and properties perspectives...
        return (['modeling','composite','properties'].indexOf(viewParams.perspective.id) === -1);
      }

      function getPageDefinitionActions() {
        return self.pageDefinitionActions;
      }

      function viewShoppingCart() {
        viewParams.onShoppingCartViewed();
      }

      function discardShoppingCart() {
        // Only perform UI restore if we're in "configuration" perspective.
        if (self.perspective.id === 'configuration') {
          let treeaction = {
            clearTree: true,
            path: decodeURIComponent(viewParams.parentRouter.data.rawPath())
          };

          // fix the navtree
          viewParams.signaling.navtreeUpdated.dispatch(treeaction);

          reloadRdjData();
          renderPage();
        }
      }

      function reloadPageData() {
        reloadRdjData();
        // Skip the render call as the RDJ reload will trigger observable subscription
        //renderPage();
      }

      function captureSyncInterval(currentValue) {
        return SetSyncIntervalDialog.showSetSyncIntervalDialog(currentValue, self.i18n)
          .then(result => {
            setSyncInterval(parseInt(result.interval));
            return Promise.resolve(result);
          });
      }

      function setSyncInterval(syncInterval) {
        // Cancel any timer and reload page when timer was not running
        let cancelled = cancelSyncTimer();
        if (!cancelled) reloadPageData();

        // Set a new timer interval in millis when sync interval is specified
        if (syncInterval > 0) {
          let refreshInterval = (syncInterval * 1000);
          self.timerId = setInterval(reloadPageData, refreshInterval);
        }
      }

      function cancelSyncTimer() {
        let cancelled = false;
        if (typeof self.timerId !== 'undefined') {
          clearInterval(self.timerId);
          self.timerId = undefined;
          cancelled = true;
        }
        return cancelled;
      }

      function cancelAutoSync() {
        cancelSyncTimer();
        self.tableToolbarModuleConfig
          .then(moduleConfig => {
            moduleConfig.viewModel.cancelAutoSync();
          });
      }

      function renderActionsDialog(dialogParams) {
        return new Promise(function (resolve, reject) {
          const data = self.pageDefinitionActions.createActionsDialog(dialogParams.id);
          data.field.setAttribute('on-chosen-items-changed', '[[chosenItemsChanged]]');
          data.field.setAttribute('readonly', dialogParams.isReadOnly);
          data.field.setAttribute('display-width', '725px');
          self.availableItems = data.availableItems;
          self.actionsDialog.formLayout.html({ view: HtmlUtils.stringToNodeArray(data.formLayout.outerHTML), data: self });
          self.chosenItems = [];
          return ActionsDialog.showActionsDialog(dialogParams, self.i18n)
            .then((result) => {
              result['chosenItems'] =  self.chosenItems;
              result['urls'] = data.urls;
              resolve(result);
            })
            .catch(cancelled => {
              Logger.log('cancelBtn was clicked, or ESC key was pressed!');
            });
        });
      }

      function createCustomView(event) {
        const createFormUrl = viewParams.parentRouter.data.rdjData().dashboardCreateForm.resourceData;
        DataOperations.mbean.new(createFormUrl)
          .then(reply => {
            viewParams.parentRouter.data.pdjUrl(reply.body.data.get('pdjUrl'));
            viewParams.parentRouter.data.pdjData(reply.body.data.get('pdjData'));
            viewParams.parentRouter.data.rdjUrl(reply.body.data.get('rdjUrl'));
            viewParams.parentRouter.data.rdjData(reply.body.data.get('rdjData'));
            viewParams.parentRouter.go('form');
          })
          .catch(response => {
            ViewModelUtils.failureResponseDefaultHandling(response);
          });
      }

      this.chosenItemsChanged = function (event) {
        let values = [];
        if (event.detail.value.length > 0) {
          const fieldName = event.currentTarget.id;
          const fieldValue = event.detail.value;
          for (let i = 0; i < fieldValue.length; i++) {
            values.push(JSON.parse(fieldValue[i].value));
          }
        }
        self.chosenItems = [...values];
        self.i18n.actionsDialog.buttons.ok.disabled(values.length === 0);
      };

      function toggleCustomizer(event) {
        self.tableCustomizerManager.toggleCustomizerState(event);
      }

      function setFormContainerMaxHeight(withHistoryVisible){
        const options = {withHistoryVisible: withHistoryVisible, withHelpVisible: self.showHelp()};
        const offsetMaxHeight = self.contentAreaContainerResizer.getOffsetMaxHeight('#table-container', options);
        Logger.log(`max-height=calc(100vh - ${offsetMaxHeight}px)`);
        const ele = document.querySelector('.cfe-table-form-content');
        if (ele !== null) ele.style['max-height'] = `calc(100vh - ${offsetMaxHeight}px)`;
      }

      function toggleBeanPathHistory (withHistoryVisible) {
        setFormContainerMaxHeight(withHistoryVisible);
        // Call function in perspective assigned to the
        // onBeanPathHistoryToggled field in viewParams.
        return viewParams.onBeanPathHistoryToggled();
      }

      function toggleInstructions (withInstructionsVisible, withHistoryVisible) {
        const ele = document.getElementById('intro');
        ele.style.display = (withInstructionsVisible ? 'inline-block' : 'none');
        self.showInstructions(withInstructionsVisible);
        setFormContainerMaxHeight(withHistoryVisible);
      }

      function toggleHelpPage(withHelpVisible, withHistoryVisible) {
        self.showHelp(withHelpVisible);
        setFormContainerMaxHeight(withHistoryVisible);

        // Ensure table customizer is closed whenever clicking on the help
        self.tableCustomizerManager.closeCustomizerState();

        if (!withHelpVisible) renderPage();
      }

      function selectLandingPage() {
        viewParams.onLandingPageSelected();
      }

      function setSubmenuItemsState(state) {
        if (CoreUtils.isNotUndefinedNorNull(window.electron_api)) {
          const submenuStates =  [
            {id: 'newProject', state: state},
            {id: 'switchToProject', state: state},
            {id: 'deleteProject', state: state},
            {id: 'nameProject', state: state},
            {id: 'reload', state: state}
          ];
          window.electron_api.ipc.invoke('submenu-state-setting', submenuStates)
            .then()
            .catch(response => {
              ViewModelUtils.failureResponseDefaultHandling(response);
            });
        }
      }

      function newBean(event) {
        const createFormUrl = viewParams.parentRouter.data.rdjData().createForm.resourceData;

        DataOperations.mbean.new(createFormUrl)
          .then(reply => {
            Logger.log(`reply=${JSON.stringify(reply)}`);
            setSubmenuItemsState(false);
            viewParams.parentRouter.data.pdjUrl(reply.body.data.get('pdjUrl'));
            viewParams.parentRouter.data.pdjData(reply.body.data.get('pdjData'));
            viewParams.parentRouter.data.rdjData(reply.body.data.get('rdjData'));
            viewParams.parentRouter.go('form');
          })
          .catch(response => {
            ViewModelUtils.failureResponseDefaultHandling(response);
          });
      }

      this.selectedListener = function (event) {
        let id = null;

        if (event.type === 'selectedChanged') {
          if (this.selectedRows() != null && this.selectedRows().values().size > 0) {
            this.selectedRows().values().forEach((key) => {id = key;});
          }

          // fix the navtree
          viewParams.signaling.navtreeSelectionCleared.dispatch();

          const path = id;
          if (path !== null) {
            Router.rootInstance.go('/' + self.perspective.id + '/' + encodeURIComponent(path));
            viewParams.signaling.formSliceSelected.dispatch({path: path});
          }
        }
      }.bind(this);

      function reloadRdjData() {
        return DataOperations.mbean.reload(viewParams.parentRouter.data.rdjUrl())
          .then(reply => {
            viewParams.parentRouter.data.rdjData(reply.body.data);
          })
          .catch(response => {
            switch (response.failureType.name) {
              case CoreTypes.FailureType.NOT_FOUND.name:
                Logger.log(`Unable to find page data, so redirecting to landing page for ${self.perspective.label} perspective`);
                // fix the navtree
                viewParams.signaling.navtreeUpdated.dispatch({
                  isEdit: false,
                  path: '/'
                });
                // goto the landing page
                viewParams.onLandingPageSelected();
                break;
              case CoreTypes.FailureType.CBE_REST_API.name:
                MessageDisplaying.displayResponseMessages(response.body.messages);
                break;
              default:
                ViewModelUtils.failureResponseDefaultHandling(response);
                break;
            }
          });
      }

      function writeContentFile(eventType = 'autoSave') {
        function downloadContentFile() {
          self.wdtForm.getContentFileChanges()
            .then(reply => {
              if (reply.succeeded) {
                if (eventType === 'download') {
                  MessageDisplaying.displayMessage({
                    severity: 'confirmation',
                    summary: self.wdtForm.getSummaryMessage(ViewModelUtils.isElectronApiAvailable() ? 'changesSaved': 'changesDownloaded')
                  }, 2500);
                }
              }
              else {
                if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
                  // This means wdtForm.getModelFileChanges() was
                  // able to download, but not write out the model
                  // file. Call writeContentFile passing in the
                  // filepath and fileContents in reply.
                  self.wdtForm.writeContentFile({filepath: reply.filepath, fileContents: reply.fileContents})
                    .then(reply => {
                      Logger.log(`[TABLE] self.wdtForm.writeContentFile(options) returned ${reply.succeeded}`);
                    });
                }
                else {
                  const dataProvider = self.wdtForm.getDataProvider();
                  viewParams.signaling.changesAutoDownloaded.dispatch(dataProvider, reply.fileContents);
                }

              }
            })
            .catch(response => {
              ViewModelUtils.failureResponseDefaultHandling(response);
            });
        }

        if (!ViewModelUtils.isElectronApiAvailable()) {
          switch (eventType) {
            case 'autoSave': {
              if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
                const dataProvider = self.wdtForm.getDataProvider();
                const options = {
                  dialogMessage: {name: CoreUtils.isNotUndefinedNorNull(dataProvider) ? dataProvider.name : ''}
                };
                self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-unsaved-changes.titles.changesNeedDownloading.value'));
                self.i18n.dialog.prompt(oj.Translations.getTranslatedString('wrc-unsaved-changes.prompts.unsavedChanges.needDownloading.value', '{0}').replace('{0}', options.dialogMessage.name));
                self.i18n.buttons.cancel.visible(false);
                UnsavedChangesDialog.showConfirmDialog('ChangesNotDownloaded', self.i18n)
                  .then(reply => {
                    if (reply.exitButton === 'yes') {
                      downloadContentFile();
                    }
                  });
              }
              else {
                downloadContentFile();
              }
            }
              break;
            case 'navigation':
            case 'download':
              downloadContentFile();
              break;
          }
        }
        else {
          downloadContentFile();
        }
      }

      this.deleteListener = function (event) {
        // prevent row from being selected as a result of the delete button being clicked
        event.stopPropagation();

        self.selectedRows.clear();

        // Data used for the navtree delete action
        const resourceData = event.currentTarget.id;
        var navigationPath = null;

        DataOperations.mbean.get(resourceData)
          .then(reply => {
            const rdjData = reply.body.data.get('rdjData');
            navigationPath = rdjData.navigation;
            if (isWdtTable() && window?.api?.ipc &&
              Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name &&
              rdjData.navigation.match(/^Deployments\/[AppDeployments|Libraries]/)) {
              const paths = self.wdtForm.getModelArchivePaths([rdjData.data.SourcePath, rdjData.data.PlanPath], self.wdtForm);

              if (paths.length > 0) {
                const dataProvider = self.wdtForm.getDataProvider();
                dataProvider.putValue('modelArchivePaths', paths);
              }
            }
            return DataOperations.mbean.delete(resourceData)
          })
          .then(reply => {
            if (CoreUtils.isNotUndefinedNorNull(reply.body.messages) && reply.body.messages.length > 0) {
              MessageDisplaying.displayResponseMessages(reply.body.messages);
            }
            else if (CoreUtils.isNotUndefinedNorNull(self.wdtForm)) {
              const eventType = (ViewModelUtils.isElectronApiAvailable() ? 'autoDownload' : 'autoSave');
              writeContentFile(eventType);
            }
          })
          .then(() => {
            const rdjData = viewParams.parentRouter.data.rdjData();
            if (isWdtTable() && window?.api?.ipc &&
              Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name &&
              rdjData.navigation.match(/^Deployments\/[AppDeployments|Libraries]/)) {
              window.api.ipc.invoke('get-archive-entry-types')
                .then(entryTypes => {
                  const dataProvider = self.wdtForm.getDataProvider();
                  const modelArchive = new ModelArchive(dataProvider.modelArchive, entryTypes);
                  self.wdtForm.deleteModelArchivePaths(dataProvider, modelArchive, viewParams.signaling);
                  delete dataProvider['modelArchivePaths'];
                });
            }
          })
          .then(() => {
            viewParams.signaling.shoppingCartModified.dispatch('table', 'delete', {isLockOwner: true, hasChanges: true, supportsChanges: true,}, event.srcElement.id);
            return {
              delete: true,
              resourceData: resourceData,
              path: navigationPath
            };
          })
          .then(treeaction => {
            if (typeof viewParams.parentRouter.data.breadcrumbs !== 'undefined') {
              if (treeaction) treeaction['breadcrumbs'] = viewParams.parentRouter.data.breadcrumbs();
            }

            // fix the navtree
            viewParams.signaling.navtreeUpdated.dispatch(treeaction);
          })
          .then(() => {
            reloadRdjData()
              .then(() => {
                renderPage();
              });
          })
          .then(() => {
            self.tableToolbarModuleConfig.then((moduleConfig) => {
              moduleConfig.viewModel.changeManager({
                isLockOwner: true,
                hasChanges: true,
                supportsChanges: true,
              });
            });
          })
          .catch((response) => {
            // Announce that shopping cart icon and menu need to
            // be refreshed, because the delete rejection may have
            // caused a roll back of the removal.
            viewParams.signaling.shoppingCartModified.dispatch(
              'table',
              'refresh',
              undefined,
              event.srcElement.id
            );

            if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
              MessageDisplaying.displayResponseMessages(response.body.messages);
            }
          })
          .finally(() => {
            // Announce that tabstrip item for "Shopping Cart Viewer"
            // has been unselected
            viewParams.signaling.tabStripTabSelected.dispatch(
              'table',
              'shoppingcart',
              false
            );
          });
      }.bind(this);

      function getColumnMetadata(perspectiveId) {
        let columnMetadata = [];

        // Add table column containing delete icon as the first column
        const rdjData = viewParams.parentRouter?.data?.rdjData();
        if (rdjData?.navigation === 'Dashboards') {
          columnMetadata.push({ name: '_delete', field: '_delete', readonly: self.nonwritable, template: 'deleteCellTemplate', sortable: 'disabled'});
        }
        else if (['configuration','modeling','security','properties'].indexOf(perspectiveId) !== -1 && self.nonwritable() !== true) {
          columnMetadata.push({ name: '_delete', field: '_delete', readonly: self.nonwritable, template: 'deleteCellTemplate', sortable: 'disabled'});
        }

        return columnMetadata;
      }

      function setRDJDataProvider(rdjData, perspectiveId, displayedColumns, hiddenColumns) {
        // Setup PDJ type information for display
        let columns = displayedColumns;
        if (CoreUtils.isNotUndefinedNorNull(hiddenColumns)) {
          columns = columns.concat(hiddenColumns);
        }
        const pdjTypes = new PageDataTypes(columns, perspectiveId);

        let rows = [];

        for (var j in rdjData.data) {
          const row = rdjData.data[j];
          let rowObj = {}, displayValue;

          for (let i = 0; i < columns.length; i++) {
            const cname = columns[i].name;

            // Get the display value based on the type information
            displayValue = {data: pdjTypes.getDisplayValue(cname, row[cname])};
            rowObj[cname] = displayValue;
          }

          if (CoreUtils.isNotUndefinedNorNull(row.identity)) {
            rowObj['_id'] = row.identity.value.resourceData;
            rowObj['_delete'] = { _id: rowObj['_id'], headerText: 'Delete', name: '_delete', field: '_delete', template: 'deleteCellTemplate', listener: self.deleteListener }
            rows.push(rowObj);
          }
        }

        if (self.tableSort.property === null) self.tableSort.property = 'Name';
        if (self.tableSort.direction === null) self.tableSort.direction = 'ascending';

        // Enable or disable table sorting
        self.tableSortable(self.tableSort.enabled ? {} : {sortable: 'disabled'});

        const arrayDataProvider = TableSorter.sort(rows, '_id', self.tableSort.enabled, self.tableSort.property, self.tableSort.direction);
        self.rdjDataProvider(arrayDataProvider);
        self.i18n.labels.totalRows.value(oj.Translations.getTranslatedString('wrc-table.labels.totalRows.value', rows.length));
      }

      this.onSortListener = (event) => {
        self.tableSort.property = event.detail.header;
        self.tableSort.direction = event.detail.direction;

        const arrayDataProvider = TableSorter.sort(self.rdjDataProvider().data, '_id', self.tableSort.enabled, self.tableSort.property, self.tableSort.direction);
        self.rdjDataProvider(arrayDataProvider);
      };

      function getDefaultVisibleAndHiddenColumns() {
        const pdjData = viewParams.parentRouter.data.pdjData();
        const visibleColumns = CoreUtils.shallowCopy(pdjData.table.displayedColumns);
        const hiddenColumns = CoreUtils.shallowCopy(pdjData.table.hiddenColumns);
        return { visibleColumns: visibleColumns, hiddenColumns: hiddenColumns };
      }

      function updateColumns() {
        // determine what columns to show/hide based on pdj and customizer
        self.resetCustomizations(true);
        self.tableCustomizerModuleConfig
        .then((moduleConfig) => {
          if (moduleConfig) {
            const selectedColumns = viewParams.parentRouter.data.rdjData().displayedColumns;
            moduleConfig.viewModel.setupCustomization(selectedColumns);
          }
        });
      }

      function renderPage() {
        const pdjData = viewParams.parentRouter.data.pdjData();
        const rdjData = viewParams.parentRouter.data.rdjData();

        // If the observable updates and no longer references a table
        // do nothing.. ${perspective.id}.js will route
        if (typeof pdjData.table === 'undefined') {
          return;
        }

        // remove create/delete options for nonCreatableCollection
        if (rdjData.self.kind === 'nonCreatableCollection') {
          self.nonwritable(true);
        }

        if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
          document.title = viewParams.parentRouter.data.pageTitle();
        }

        // Seed the table customizations via columnDataProvider
        updateColumns();

        // Ordered tables disable the column sorting and display the data as returned...
        if (CoreUtils.isNotUndefinedNorNull(pdjData.table.ordered) && (pdjData.table.ordered === true)) {
          self.tableSort.enabled = false;
        }
        setRDJDataProvider(rdjData, self.perspective.id, pdjData.table.displayedColumns, pdjData.table.hiddenColumns);

        const bindHtml = getIntroductionHtml(pdjData.introductionHTML, rdjData.introductionHTML);
        self.introductionHTML({ view: HtmlUtils.stringToNodeArray(bindHtml), data: self });

        let pdjActions;

        if (typeof pdjData.table.actions !== 'undefined') pdjActions = pdjData.table.actions;
        self.pageDefinitionActions = new PageDefinitionActions(pdjActions, rdjData);

        self.actionsDialog.formLayout.html({ view: HtmlUtils.stringToNodeArray('<p>'), data: self });

        createHelp(pdjData, self.perspective.id);
      }

      function getIntroductionHtml(pdjIntro, rdjIntro) {
        const bindHtml = (CoreUtils.isNotUndefinedNorNull(rdjIntro) ? rdjIntro : pdjIntro);
        return (CoreUtils.isNotUndefinedNorNull(bindHtml) ? bindHtml : '<p>');
      }

      function createHelp(pdjData, perspectiveId) {
        if (typeof pdjData === 'undefined') {
          return;
        }

        let pdjTypes, helpData = [];

        const helpForm = new HelpForm(viewParams),
          column1 = helpForm.i18n.tables.help.columns.header.name,
          column2 = helpForm.i18n.tables.help.columns.header.description;

        self.tableHelpColumns(helpForm.tableHelpColumns);

        if (typeof pdjData.table.displayedColumns !== 'undefined') {
          pdjTypes = new PageDataTypes(pdjData.table.displayedColumns, perspectiveId);

          for (const i in pdjData.table.displayedColumns) {
            const name = pdjData.table.displayedColumns[i].name;
            const label = pdjTypes.getLabel(name);
            // Determine the help description for the property
            const fullHelp = pdjTypes.getFullHelp(name);
            const description = { view: HtmlUtils.stringToNodeArray(fullHelp) };
            // Use Map to set value of "Name" and "Description"
            // columns, in a way that honors the language locale
            const entries = new Map([[column1, label], [column2, description]]);

            helpData.push(Object.fromEntries(entries));
          }
        }

          if (typeof pdjData.table.hiddenColumns !== 'undefined') {
            pdjTypes = new PageDataTypes(pdjData.table.hiddenColumns, perspectiveId);

            for (const i in pdjData.table.hiddenColumns) {
              const name = pdjData.table.hiddenColumns[i].name;
              const label = pdjTypes.getLabel(name);

              // Determine the help description for the property
              const fullHelp = pdjTypes.getFullHelp(name);
              const description = { view: HtmlUtils.stringToNodeArray(fullHelp) };
              const entries = new Map([[column1, label], [column2, description]]);

              helpData.push(Object.fromEntries(entries));
            }
          }

        self.helpDataSource(helpData);

        if (typeof pdjData.helpTopics !== 'undefined') {
          const div = document.createElement('div');
          div.setAttribute('id', 'cfe-help-footer');
          const title = document.createElement('p');
          title.innerHTML = '<b>Related Topics:</b>';
          div.append(title);
          const list = document.createElement('ul');
          div.append(list);

          for (const j in pdjData.helpTopics) {
            const topic = pdjData.helpTopics[j];
            const listElement = document.createElement('li');
            const ref = document.createElement('a');
            ref.setAttribute('href', topic.href);
            ref.setAttribute('target', '_blank');
            ref.setAttribute('rel', 'noopener');
            ref.innerText = topic.label;

            listElement.append(ref);
            list.append(listElement);
          }

          const divString = div.outerHTML;
          self.helpFooterDom({ view: HtmlUtils.stringToNodeArray(divString), data: self });
        }
      }
    }

    return TableViewModel;
  }
);