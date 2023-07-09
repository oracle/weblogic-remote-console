/**
 * @license
 * Copyright (c) 2020, 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojmodule-element-utils', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', 'ojs/ojknockout-keyset', 'ojs/ojkeyset', 'wrc-frontend/integration/controller', 'wrc-frontend/apis/data-operations', 'wrc-frontend/apis/message-displaying', './table-sorter', 'wrc-frontend/microservices/perspective/perspective-memory-manager', './unsaved-changes-dialog', './set-sync-interval-dialog', './container-resizer', 'wrc-frontend/microservices/page-definition/types', './help-form', './wdt-form', 'wrc-frontend/microservices/customize/table-manager', 'wrc-frontend/microservices/actions-management/declarative-actions-manager', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'wrc-frontend/core/types', 'wrc-frontend/core/runtime', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojbinddom', 'ojs/ojdialog', 'ojs/ojcheckboxset', 'ojs/ojmodule-element', 'ojs/ojmodule', 'cfe-multi-select/loader'],
  function (oj, ko, Router, ModuleElementUtils, ArrayDataProvider, HtmlUtils, keySet, ojkeyset_1, Controller, DataOperations, MessageDisplaying, TableSorter, PerspectiveMemoryManager, UnsavedChangesDialog, SetSyncIntervalDialog, ContentAreaContainerResizer, PageDataTypes, HelpForm, WdtForm, TableCustomizerManager, DeclarativeActionsManager, ViewModelUtils, CoreUtils, CoreTypes, Runtime, Context, Logger) {
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
        contextMenus: {
          copyCellData: {
            id: 'copyCellData',
            iconFile: 'clipboard-copycell-icon-brn_24x24',
            label: oj.Translations.getTranslatedString('wrc-common.contextMenus.copyData.cell.label')
          },
          copyRowData: {
            id: 'copyRowData',
            iconFile: 'clipboard-copyrow-icon-brn_24x24',
            label: oj.Translations.getTranslatedString('wrc-common.contextMenus.copyData.row.label')
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
          onCustomizeButtonClicked: toggleCustomizer,
          onDashboardButtonClicked: createDashboard
        }
      });
      
      this.tableActionsStripModuleConfig = ModuleElementUtils.createConfig({
        viewPath: `${Controller.getModulePathPrefix()}views/content-area/body/table-actions-strip.html`,
        viewModelPath: `${Controller.getModulePathPrefix()}viewModels/content-area/body/table-actions-strip`,
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          perspective: viewParams.perspective,
          getDeclarativeActions: getDeclarativeActions,
          onSyncClicked: setSyncInterval,
          onActionPollingStarted: startActionPolling,
          onActionButtonClicked: handleActionButtonClicked,
          onCheckedRowsRefreshed: refreshCheckedRowsKeySet
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

      this.tableActions = {visible: ko.observable(false), formLayout: { html: ko.observable({}) }};

      this.checkedAllRows = ko.observableArray([]);
      this.declarativeActions = {rowSelectionRequired: false, buttons: [], checkedRows: new Set(), dataRowsCount: 0};
      this.checkedRowsKeySet = ko.observable(new ojkeyset_1.KeySetImpl());

      this.availableItems = [];
      this.chosenItems = [];

      // END: Declare instance variables used in the ViewModel's view

      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(viewParams.perspective.id);
      this.contentAreaContainerResizer = new ContentAreaContainerResizer(viewParams.perspective);
      this.signalBindings = [];
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
/*
//MLW
        Context.getPageContext().getBusyContext().whenReady()
          .then(() => {
            addCheckedAllRowsSelector();
          });
 */
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

      function hasTableActions() {
        self.tableActions.visible(true);
        return self.tableActions.visible();
      }

      function isWdtTable() {
        // The same form is used for WDT model and Property List for uniform content file handling
        return (['modeling', 'properties'].indexOf(viewParams.perspective.id) !== -1);
      }

      function isShoppingCartVisible() {
        // The shopping cart will be visible expect for the WDT and properties perspectives...
        return (['modeling','composite','properties'].indexOf(viewParams.perspective.id) === -1);
      }

      function getDeclarativeActions() {
        return self.declarativeActions;
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
        const wasCancelled = cancelSyncTimer();
        if (!wasCancelled) reloadPageData();

        // Set a new timer interval in millis when sync interval is specified
        if (syncInterval > 0) {
          let actionPolling = {interval: 0, maxPolls: 0};

          const img = document.getElementById('sync-icon');
          if (img !== null && CoreUtils.isNotUndefinedNorNull(img.attributes['data-action-polling'])) {
            actionPolling = JSON.parse(img.attributes['data-action-polling'].value);
          }

          const refreshInterval = (syncInterval * 1000);

          if (CoreUtils.isUndefinedOrNull(actionPolling.endWhenPairs)) {
            reloadRdjData();
            self.syncTimerId = setInterval(reloadRdjData, refreshInterval);
          }
          else {
            satisfyActionEndWhenPairs(actionPolling);
            if (CoreUtils.isNotUndefinedNorNull(actionPolling.pollCount)) {
              self.syncTimerId = setInterval(satisfyActionEndWhenPairs.bind(self, actionPolling), refreshInterval);
            }
          }
        }
      }

      function cancelSyncTimer() {
        let wasCancelled = false;
        if (CoreUtils.isNotUndefinedNorNull(self.syncTimerId)) {
          clearInterval(self.syncTimerId);
          self.syncTimerId = undefined;
          wasCancelled = true;
        }
        return wasCancelled;
      }

      function cancelAutoSync() {
        cancelSyncTimer();
        self.tableToolbarModuleConfig
            .then(moduleConfig => {
              moduleConfig.viewModel.cancelAutoSync();
            });
      }
      
      async function isAutoSyncRunning() {
        const moduleConfig = await self.tableToolbarModuleConfig;
        return moduleConfig.viewModel.autoSyncEnabled();
      }

      /**
       *
       * @param {{action?: string, interval: number, maxPolls: number, pollCount?: number, endWhenPairs?: [{name: string, value: any}]}} actionPolling
       * @private
       */
      function startActionPolling(actionPolling) {
        self.tableToolbarModuleConfig
          .then(moduleConfig => {
            const img = document.getElementById('sync-icon');
            if (img !== null) {
              img.setAttribute('data-action-polling', JSON.stringify(actionPolling));
            }
            moduleConfig.viewModel.cancelAutoSync();
            moduleConfig.viewModel.syncClick({
              target: {
                attributes: {
                  'data-interval': {value: actionPolling.interval}
                }
              }
            });
          });
      }

      function terminateActionPolling(actionPolling) {
        delete actionPolling.pollCount;
        delete self.declarativeActions.endWhenPairs;
        startActionPolling(actionPolling);
        cancelAutoSync();
      }

      /**
       *
       * @param {{action?: string, interval: number, maxPolls: number, pollCount?: number, endWhenPairs?: [{name: string, value: any}]}} actionPolling
       * @private
       */
      function satisfyActionEndWhenPairs(actionPolling) {
        // See if value assigned to actionPolling.pollCount
        // has exceeded actionPolling.maxPolls.
        if (CoreUtils.isNotUndefinedNorNull(actionPolling.pollCount) &&
            (actionPolling.pollCount > actionPolling.maxPolls)
        ) {
          // It has, so terminate action polling.
          terminateActionPolling(actionPolling);
        }

        // See if the action has endWhen pairs.
        if (CoreUtils.isUndefinedOrNull(actionPolling.endWhenPairs)) {
          // It doesn't, so terminate action polling.
          terminateActionPolling(actionPolling);
        }

        // See if actionPolling JS object has a pollCount
        // property. It won't if terminateAutoSync() has
        // been called.
        if (CoreUtils.isNotUndefinedNorNull(actionPolling.pollCount)) {
          // The actionPolling JS object has a pollCount
          // property, so call reloadRdjData() to get
          // latest RDJ from the CBE.
          reloadRdjData()
            .then(reply => {
              if (reply.succeeded) {
                // Get latest RDJ from the router data, because
                // it needs to be passed as an argument.
                const rdjData = viewParams.parentRouter.data.rdjData();
                // Call updateActionPollingEndWhenPairs() with
                // the latest RDJ, so it can see if all the
                // action's endWhen pairs have been satisfied.
                DeclarativeActionsManager.updateActionPollingEndWhenPairs(rdjData, self.declarativeActions, actionPolling)
                  .then(reply => {
                    if (reply.satisfied) {
                      // All the action's endWhen pairs have been
                      // satisfied, so terminate action polling.
                      terminateActionPolling(actionPolling);
                    }
                    else {
                      // There are still endWhen pairs that haven't been
                      // satisfied, so increment pollCount.
                      actionPolling.pollCount += 1;
                    }
                  });
              }
              else {
                // The call to reloadRdjData() returned a reply
                // JS object that had false assigned to the
                // succeeded property, so increment pollCount.
                actionPolling.pollCount += 1;
              }
            });
        }
      }

      function handleActionButtonClicked(options) {
        const rdjData = viewParams.parentRouter.data.rdjData();
        return DeclarativeActionsManager.performActionOnCheckedRows(rdjData, self.declarativeActions, options);
      }

      function refreshCheckedRowsKeySet() {
        self.checkedRowsKeySet().keys.keys.clear();
        for (const identity of Array.from(self.declarativeActions.checkedRows)) {
          self.checkedRowsKeySet().keys.keys.add(identity);
        }
      }

      function createDashboard(event) {
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
        document.documentElement.style.setProperty('--form-container-calc-max-height', `${offsetMaxHeight}px`);
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
        self.tableActionsStripModuleConfig
          .then(moduleConfig => {
            moduleConfig.viewModel.renderActionsStrip(!withHelpVisible);
            self.showHelp(withHelpVisible);
            setFormContainerMaxHeight(withHistoryVisible);
            
            // Ensure table customizer is closed whenever clicking on the help
            self.tableCustomizerManager.closeCustomizerState();
            
            if (!withHelpVisible) renderPage();
          });
      }

      function selectLandingPage() {
        viewParams.onLandingPageSelected();
      }

      function notifyUnsavedChanges(state) {
        if (CoreUtils.isNotUndefinedNorNull(window.electron_api)) {
          window.electron_api.ipc.invoke('unsaved-changes', state)
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
            notifyUnsavedChanges(true);
            viewParams.parentRouter.data.pdjUrl(reply.body.data.get('pdjUrl'));
            viewParams.parentRouter.data.pdjData(reply.body.data.get('pdjData'));
            viewParams.parentRouter.data.rdjData(reply.body.data.get('rdjData'));
            viewParams.parentRouter.go('form');
          })
          .catch(response => {
            ViewModelUtils.failureResponseDefaultHandling(response);
          });
      }

      this.onContextMenuAction = (event) => {
        const getClipboardData = (ele, menuItemId) => {
          let clipboardData = '';
          switch (menuItemId) {
            case 'copyCellData':
              clipboardData = ele.getAttribute('data-clipboard-copycelldata');
              break;
            case 'copyRowData':
              clipboardData = ele.getAttribute('data-clipboard-copyrowdata');
              break;
          }
          return clipboardData;
        };

        const getConfirmationMessageSummary = (clipboardData, menuItemId) => {
          let messageSummary = oj.Translations.getTranslatedString('wrc-common.messages.copiedToClipboard.detail');
          switch (menuItemId) {
            case 'copyCellData':
              if (clipboardData === '') messageSummary = oj.Translations.getTranslatedString('wrc-common.messages.emptyCellData.detail');
              break;
            case 'copyRowData':
              if (clipboardData === '') messageSummary = oj.Translations.getTranslatedString('wrc-common.messages.emptyRowData.detail');
              break;
          }
          return messageSummary;
        };

        const showConfirmationMessage = (message, clipboardData) => {
          if (clipboardData !== '') {
            ViewModelUtils.blurActiveElement();
            ViewModelUtils.copyToClipboard(clipboardData)
              .then(() => {
                MessageDisplaying.displayMessage({
                  severity: message.severity,
                  summary: message.message
                }, 2500);
              })
              .catch(failure => {
                ViewModelUtils.failureResponseDefaultHandling(failure);
              });
          }
          else {
            MessageDisplaying.displayMessage({
              severity: message.severity,
              summary: message.message
            }, 2500);
          }
        };

        const ele = document.getElementById('table');

        if (ele !== null) {
          const menuItemId = event.detail.selectedValue;
          const clipboardData = getClipboardData(ele, menuItemId);
          const messageSummary = getConfirmationMessageSummary(clipboardData, menuItemId);

          showConfirmationMessage({
              severity: 'confirmation',
              message: messageSummary
            },
            clipboardData
          );
        }
      };

      this.onContextMenuBeforeOpen = (event) => {
        const target = event.detail.originalEvent.target;
        if (CoreUtils.isNotUndefinedNorNull(target)) {
          if (target.innerText === '' && target.parentElement.innerText === '') {
            event.preventDefault();
            return false;
          }
          else {
            const ele = document.getElementById('table');
            if (ele !== null) {
              ele.setAttribute('data-clipboard-copycelldata', target.innerText);
              ele.setAttribute('data-clipboard-copyrowdata', target.parentElement.innerText.replace(/^\t/, ''));
            }
          }
        }
      };

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
            return {succeeded: true};
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
            return {succeeded: false};
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
              const dataProvider = self.wdtForm.getDataProvider();
              const modelArchive = dataProvider.extensions.wktui.modelArchive;
              self.wdtForm.deleteModelArchivePaths(dataProvider, modelArchive);
              delete dataProvider['modelArchivePaths'];
              const index = rdjData.data.map(item => item.identity.value.resourceData).indexOf(resourceData);
              if (index !== -1) {
                const key = rdjData.data[index]['Name'].value;
                self.perspectiveMemory.removeAddToArchiveSwitchValue.call(self.perspectiveMemory, key);
              }
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

      function addCheckedAllRowsSelector() {
        const container = document.getElementById('table:_hdrCol0');
        if (container !== null) {
          const checkboxset = document.createElement('oj-checkboxset');
          checkboxset.setAttribute('value', '[[checkedAllRows]]');
          checkboxset.setAttribute('on-value-changed', '[[checkedAllRowsChanged]]');
          const option = document.createElement('oj-option');
          option.setAttribute('value', 'checked');
          checkboxset.append(option);
          container.replaceChild(checkboxset, container.firstElementChild);
        }
      }

      function getColumnMetadata(perspectiveId) {
        let columnMetadata = [];

        // Add table column containing delete icon as the first column
        const rdjData = viewParams.parentRouter?.data?.rdjData();
        const pdjData = viewParams.parentRouter?.data?.pdjData();
        if (rdjData?.navigation === 'Dashboards') {
          columnMetadata.push({ name: '_delete', field: '_delete', readonly: self.nonwritable, template: 'deleteCellTemplate', sortable: 'disabled'});
        }
        else if (DeclarativeActionsManager.isRowSelectionRequired(pdjData)) {
          columnMetadata.push({ name: '_selector', field: '_selector', readonly: self.nonwritable, template: 'selectorCellTemplate', sortable: 'disabled'});
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
            rowObj['_selector'] = { _id: rowObj['_id'], headerText: 'Selector', name: '_selector', field: '_selector', template: 'selectorCellTemplate', listener: self.checkedRowsChanged };
            rowObj['_delete'] = { _id: rowObj['_id'], headerText: 'Delete', name: '_delete', field: '_delete', template: 'deleteCellTemplate', listener: self.deleteListener };
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

      /**
       * Triggered when the user clicks on the checkbox, for a row in the table.
       * <p>Clicking will either cause the checkbox to appear "checked" or "unchecked"</p>
       * @param {CustomEvent} event
       */
      this.checkedRowsChanged = (event) => {
        function removeUncheckedRow(identity) {
          if (self.declarativeActions.checkedRows.has(identity)) {
            self.declarativeActions.checkedRows.delete(identity);
          }
        }

        function addCheckedRow(identity) {
          if (!self.declarativeActions.checkedRows.has(identity)) {
            self.declarativeActions.checkedRows.add(identity);
          }
        }

        if (event.detail.previousValue.keys.keys.size > 0 &&
            event.detail.value.keys.keys.size === 0
        ) {
          removeUncheckedRow(event.currentTarget.rowKey);
        }
        if (event.detail.value.keys.keys.size > 0 &&
            event.detail.previousValue.keys.keys.size === 0
        ) {
          addCheckedRow(event.currentTarget.rowKey);
        }
        if (event.detail.previousValue.keys.keys.size > 0 &&
            event.detail.value.keys.keys.size > 0
        ) {
          if (event.detail.previousValue.keys.keys.has(event.currentTarget.rowKey)) {
            removeUncheckedRow(event.currentTarget.rowKey);
          }
          else if (event.detail.value.keys.keys.has(event.currentTarget.rowKey)) {
            addCheckedRow(event.currentTarget.rowKey);
          }

          if (event.detail.previousValue.keys.keys.size === 0) {
            self.declarativeActions.checkedRows.clear();
          }
        }

        self.tableActionsStripModuleConfig
          .then(moduleConfig => {
            DeclarativeActionsManager.onCheckedRowsChanged(
              self.declarativeActions,
              moduleConfig.viewModel.actionButtons.buttons
            );
          });
      };

      this.checkedAllRowsChanged = function (event) {
        console.info('[TABLE] checkedAllRowsChanged was called.');
      }.bind(this);

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
        //setting default switch values
        function populateAddToArchiveSwitchValues(rdjData) {
          if (isWdtTable() && window?.api?.ipc &&
            Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name &&
            rdjData.navigation.match(/^Deployments\/[AppDeployments|Libraries]/)) {
            for (const row of rdjData.data) {
              self.perspectiveMemory.upsertAddToArchiveSwitchValue.call(self.perspectiveMemory, row['Name'].value, 'SourcePath', true);
              self.perspectiveMemory.upsertAddToArchiveSwitchValue.call(self.perspectiveMemory, row['Name'].value, 'PlanPath', true);
            }
          }

        }

        const pdjData = viewParams.parentRouter.data.pdjData();
        const rdjData = viewParams.parentRouter.data.rdjData();

        // If the observable updates and no longer references a table
        // do nothing.. ${perspective.id}.js will route
        if (CoreUtils.isUndefinedOrNull(pdjData.table)) {
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
        
        DeclarativeActionsManager.populateDeclarativeActions(rdjData, pdjData, self.declarativeActions);

        self.actionsDialog.formLayout.html({ view: HtmlUtils.stringToNodeArray('<p>'), data: self });

        const settingsActions = Runtime.getSettingsActions();

        populateAddToArchiveSwitchValues(rdjData);

        createHelp(pdjData);
      }

      function getIntroductionHtml(pdjIntro, rdjIntro) {
        const bindHtml = (CoreUtils.isNotUndefinedNorNull(rdjIntro) ? rdjIntro : pdjIntro);
        return (CoreUtils.isNotUndefinedNorNull(bindHtml) ? bindHtml : '<p>');
      }

      function createHelp(pdjData) {
        if (CoreUtils.isUndefinedOrNull(pdjData)) {
          return;
        }

        let helpData = [], pdjTypes;

        const helpForm = new HelpForm(pdjData, self.perspective.id);
        const column1 = helpForm.i18n.tables.help.columns.header.name;
        const column2 = helpForm.i18n.tables.help.columns.header.description;

        self.tableHelpColumns(helpForm.tableHelpColumns);

        if (DeclarativeActionsManager.hasActions(pdjData)) {
          const pdjTypesHelpColumns = DeclarativeActionsManager.getPDJTypesHelpColumns(pdjData);

          pdjTypes = new PageDataTypes(pdjTypesHelpColumns, self.perspective.id);

          for (let i = 0; i < pdjTypesHelpColumns.length; i++) {
            const name = pdjTypesHelpColumns[i].name;
            const label = pdjTypes.getHelpLabel(name);
            // Determine the help description for the property
            const fullHelp = pdjTypes.getFullHelp(name);
            const description = {view: HtmlUtils.stringToNodeArray(fullHelp)};
            // Use Map to set value of "Name" and "Description"
            // columns, in a way that honors the language locale
            const entries = new Map([[column1, label], [column2, description]]);

            helpData.push(Object.fromEntries(entries));
          }
        }

        if (CoreUtils.isNotUndefinedNorNull(pdjData.table.displayedColumns)) {
          pdjTypes = new PageDataTypes(pdjData.table.displayedColumns, self.perspective.id);

          for (let i = 0; i < pdjData.table.displayedColumns.length; i++) {
            const name = pdjData.table.displayedColumns[i].name;
            const label = pdjTypes.getLabel(name);
            // Determine the help description for the property
            const fullHelp = pdjTypes.getFullHelp(name);
            const description = {view: HtmlUtils.stringToNodeArray(fullHelp)};
            // Use Map to set value of "Name" and "Description"
            // columns, in a way that honors the language locale
            const entries = new Map([[column1, label], [column2, description]]);

            helpData.push(Object.fromEntries(entries));
          }
        }

        if (CoreUtils.isNotUndefinedNorNull(pdjData.table.hiddenColumns)) {
          pdjTypes = new PageDataTypes(pdjData.table.hiddenColumns, self.perspective.id);

          for (let i = 0; i < pdjData.table.hiddenColumns.length; i++) {
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

        if (CoreUtils.isNotUndefinedNorNull(pdjData.helpTopics)) {
          const div = document.createElement('div');
          div.setAttribute('id', 'cfe-help-footer');
          const title = document.createElement('p');
          title.innerHTML = '<b>Related Topics:</b>';
          div.append(title);
          const list = document.createElement('ul');
          div.append(list);

          for (let j = 0; j < pdjData.helpTopics.length; j++) {
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
