/**
 * @license
 * Copyright (c) 2020, 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojmodule-element-utils', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', 'ojs/ojknockout-keyset', 'wrc-frontend/integration/controller', 'wrc-frontend/apis/data-operations', 'wrc-frontend/apis/message-displaying', './table-sorter', 'wrc-frontend/microservices/perspective/perspective-memory-manager', './unsaved-changes-dialog', './set-sync-interval-dialog', './actions-input-dialog', './container-resizer', 'wrc-frontend/microservices/page-definition/types', './help-form', './wdt-form', 'wrc-frontend/microservices/customize/table-manager', 'wrc-frontend/microservices/actions-management/declarative-actions-manager', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'wrc-frontend/core/types', 'wrc-frontend/core/runtime', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojbinddom', 'ojs/ojdialog', 'ojs/ojcheckboxset', 'ojs/ojmodule-element', 'ojs/ojmodule', 'cfe-multi-select/loader'],
  function (oj, ko, Router, ModuleElementUtils, ArrayDataProvider, HtmlUtils, ojkeyset_1, Controller, DataOperations, MessageDisplaying, TableSorter, PerspectiveMemoryManager, UnsavedChangesDialog, SetSyncIntervalDialog, ActionsInputDialog, ContentAreaContainerResizer, PageDataTypes, HelpForm, WdtForm, TableCustomizerManager, DeclarativeActionsManager, ViewModelUtils, CoreUtils, CoreTypes, Runtime, Context, Logger) {
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
        icons: {
          all: {
            iconFile: 'select-all-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.checkAll.value')
          },
          none: {
            iconFile: 'select-none-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.checkNone.value')
          },
          some: {
            iconFile: 'select-some-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.checkSome.value')
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
          onActionInputButtonClicked: handleActionInputButtonClicked,
          onActionInputFormCompleted: handleActionInputFormCompleted,
          onCheckedRowsRefreshed: refreshCheckedRowsKeySet
        }
      });

      this.overlayFormDialogModuleConfig = ko.observable({view: [], viewModel: null});

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
      this.selectedRows = new ojkeyset_1.ObservableKeySet();
      this.rowsPerPage = ko.observable(10000);

      this.nonwritable = ko.observable(false);
      this.readonly = ko.observable(Runtime.isReadOnly());
      this.introductionHTML = ko.observable();

      this.showInstructions = ko.observable(true);

      this.showHelp = ko.observable(false);
      this.helpDataSource = ko.observableArray([]);
      this.helpDataProvider = new ArrayDataProvider(this.helpDataSource, { keyAttributes: 'Name' });
      this.helpFooterDom = ko.observable({});
      this.tableHelpColumns = ko.observableArray([]);

      this.actionsDialog = {formLayout: { html: ko.observable({}) }};
      this.declarativeActions = {rowSelectionRequired: false, buttons: [], checkedRows: new Set(), dataRowsCount: 0};
      this.checkedRowsKeySet = new ojkeyset_1.ObservableKeySet();

      this.availableItems = [];
      this.chosenItems = [];

      // END: Declare instance variables used in the ViewModel's view

      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(viewParams.perspective.id);
      this.contentAreaContainerResizer = new ContentAreaContainerResizer(viewParams.perspective);
      this.subscriptions = [];
      this.signalBindings = [];
      this.confirmed = ko.observable(function (event) { });
      this.confirmationMessage = ko.observable('');

      this.tableSort = {enabled: true, property: null, direction: null};
      this.tableSortable = ko.observable({});

      self.connected = function () {
        cancelSyncTimer();
        renderPage();
        this.subscriptions.push(viewParams.parentRouter.data.rdjData.subscribe(renderPage.bind(self)));

        if (isWdtTable()) {
          self.wdtForm = new WdtForm(viewParams);
        }

        self.signalBindings.push(viewParams.signaling.nonwritableChanged.add((newRO) => {
          self.nonwritable(newRO);
        }));

        self.signalBindings.push(viewParams.signaling.readonlyChanged.add((newRO) => {
          self.readonly(newRO);
          renderPage();
        }));

        self.signalBindings.push(viewParams.signaling.resizeObserverTriggered.add( (resizerData) => {
          setFormContainerMaxHeight(self.perspectiveMemory.beanPathHistory.visibility);
        }));

        Context.getPageContext().getBusyContext().whenReady()
          .then(() => {
            const pdjData = viewParams.parentRouter.data.pdjData();
            const navigationProperty = DeclarativeActionsManager.getNavigationProperty(pdjData);
            ViewModelUtils.setTableCursor(navigationProperty);
            setFormContainerMaxHeight(self.perspectiveMemory.beanPathHistory.visibility);
          });
/*
//MLW
        Context.getPageContext().getBusyContext().whenReady()
          .then(() => {
            addCheckedAllRowsSelector(viewParams.parentRouter.data.pdjData());
          });
*/
      };

      self.disconnected = function () {
        cancelSyncTimer();

        self.subscriptions.forEach((item) => {
          if (item.name) {
            item.subscription.dispose();
          }
          else {
            item.dispose();
          }
        });

        self.subscriptions = [];

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

          if (actionPolling.interval === 0) {
            reloadRdjData();
            self.syncTimerId = setInterval(reloadRdjData, refreshInterval);
          }
          else {
            performActionPolling(actionPolling);
            if (CoreUtils.isNotUndefinedNorNull(actionPolling.pollCount)) {
              self.syncTimerId = setInterval(performActionPolling.bind(self, actionPolling), refreshInterval);
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

      function terminateActionPolling(actionPolling) {
        delete actionPolling.pollCount;
        actionPolling.interval = 0;
        actionPolling.maxPolls = 0;
        startActionPolling(actionPolling);
        cancelAutoSync();
      }

      function onActionPollingIntervalCompleted() {
        const treeaction = {
          isEdit: false,
          path: decodeURIComponent(viewParams.parentRouter.data.rawPath())
        };

        // fix the navtree
        viewParams.signaling.navtreeUpdated.dispatch(treeaction);
      }

      function performActionPolling(actionPolling) {
        // See if value assigned to actionPolling.pollCount
        // has exceeded actionPolling.maxPolls.
        if (CoreUtils.isNotUndefinedNorNull(actionPolling.pollCount) &&
          (actionPolling.pollCount > actionPolling.maxPolls)
        ) {
          // It has, so terminate action polling.
          terminateActionPolling(actionPolling);
        }

        // See if actionPolling JS object has a pollCount
        // property. It won't if terminateActionPolling()
        // has been called.
        if (CoreUtils.isNotUndefinedNorNull(actionPolling.pollCount)) {
          reloadRdjData()
            .then(reply => {
              if (reply.succeeded) {
                actionPolling.pollCount += 1;
                onActionPollingIntervalCompleted()
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

      function handleActionInputButtonClicked(rdjData, actionInputFormConfig) {
        ActionsInputDialog.handleActionInputButtonClicked(self, viewParams, rdjData, actionInputFormConfig, 'table', submitActionInputForm, '_identity');
      }

      function handleActionInputFormCompleted(reply, options) {
        if (reply.succeeded) {
          const actionPolling = DeclarativeActionsManager.getPDJActionPollingObject(self.declarativeActions, options.action);
          DeclarativeActionsManager.onCheckedRowsSubmitted(self.declarativeActions, options);
          actionPolling['pollCount'] = 0;
          startActionPolling(actionPolling);
        }
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

      function handleActionButtonClicked(options) {
        const rdjData = viewParams.parentRouter.data.rdjData();
        return DeclarativeActionsManager.performActionOnCheckedRows(rdjData, self.declarativeActions, options);
      }

      function submitActionInputForm(rdjData, submitResults, options) {
        ViewModelUtils.setPreloaderVisibility(true);

        if (CoreUtils.isNotUndefinedNorNull(self.declarativeActions.inputForm)) {
          if (self.declarativeActions.inputForm.rows.value.length > 0) {
            submitResults['rows'] = self.declarativeActions.inputForm.rows;
          }
        }

        refreshCheckedRowsKeySet();

        DeclarativeActionsManager.submitActionInputForm(submitResults, self.declarativeActions.checkedRows, rdjData.invoker, options)
          .then(reply => {
            self.tableActionsStripModuleConfig
              .then(moduleConfig => {
                moduleConfig.viewModel.handleActionButtonClickedReply(reply, options);
              });
          })
          .catch(failure => {
            if (CoreUtils.isNotUndefinedNorNull(failure.messages)) {
              MessageDisplaying.displayResponseMessages(failure.messages);
            }
            else {
              ViewModelUtils.failureResponseDefaultHandling(failure);
            }
          })
          .finally(() => {
            ViewModelUtils.setPreloaderVisibility(false);
          });
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

      function toggleCustomizer(event) {
        const toggleState = self.tableCustomizerManager.toggleCustomizerState(event);
        if (CoreUtils.isNotUndefinedNorNull(toggleState)) {
          const visible = (toggleState === 'collapsed');
          self.tableActionsStripModuleConfig
            .then(moduleConfig => {
              moduleConfig.viewModel.renderActionsStrip(visible);
              toggleInstructions(visible);
            });
        }
      }

      function setFormContainerMaxHeight(withHistoryVisible){
        const options = {withHistoryVisible: withHistoryVisible, withHelpVisible: self.showHelp()};
        const offsetMaxHeight = self.contentAreaContainerResizer.getOffsetMaxHeight('#table-container', options);
        document.documentElement.style.setProperty('--table-container-calc-max-height', `${offsetMaxHeight}px`);
      }

      function toggleBeanPathHistory (withHistoryVisible) {
        setFormContainerMaxHeight(withHistoryVisible);
        // Call function in perspective assigned to the
        // onBeanPathHistoryToggled field in viewParams.
        return viewParams.onBeanPathHistoryToggled();
      }

      function toggleInstructions(visible) {
        self.showInstructions(visible);
        setFormContainerMaxHeight(!visible, self.perspectiveMemory.beanPathHistory.visibility);
        viewParams.signaling.resizeObserveeNudged.dispatch('table');
      }

      function toggleHelpPage(withHelpVisible) {
        self.tableActionsStripModuleConfig
          .then(moduleConfig => {
            moduleConfig.viewModel.renderActionsStrip(!withHelpVisible);
            self.showHelp(withHelpVisible);
            toggleInstructions(!withHelpVisible);
            self.tableCustomizerManager.closeCustomizerState();

            if (!withHelpVisible) {
              renderPage();
            }
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
        let keyValue = null;

        if (event.type === 'selectedChanged') {
          if (this.selectedRows() !== null && this.selectedRows().values().size > 0) {
            this.selectedRows().values().forEach((key) => {keyValue = key;});
          }

          if (keyValue !== null) {
            viewParams.signaling.navtreeSelectionCleared.dispatch();
            Router.rootInstance.go(`/${this.perspective.id}/${encodeURIComponent(keyValue)}`)
              .then(hasChanged => {
                if (hasChanged) viewParams.signaling.formSliceSelected.dispatch({path: keyValue});
              });
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

      function addCheckedAllRowsSelector(pdjData) {
        const table = document.getElementById('table');

        if (table !== null) {
          if (DeclarativeActionsManager.isRowSelectionRequired(pdjData)) {
            table.setAttribute('data-selector-state', 'none');
            setCheckedAllRowsSelectorState('none', self.i18n.icons.all.tooltip);
          }
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
      };

      this.checkedAllRowsChanged1 = function (event) {
        function checkedAllRowsClickHandler(currentTarget, selectorStateValue) {
          switch (selectorStateValue) {
            case 'none':
              setCheckedAllRowsSelectorState('all', self.i18n.icons.none.tooltip)
              currentTarget.setAttribute('data-selector-state', 'all');
              break;
            case 'all':
            case 'some':
              setCheckedAllRowsSelectorState('none', self.i18n.icons.all.tooltip)
              currentTarget.setAttribute('data-selector-state', 'none');
              break;
          }
        }

        function checkedRowsClickHandler(currentTarget, selectorStateValue) {
          switch (selectorStateValue) {
            case 'some':
              setCheckedAllRowsSelectorState('none', self.i18n.icons.all.tooltip)
              currentTarget.setAttribute('data-selector-state', 'none');
              break;
            case 'all':
            case 'none':
              setCheckedAllRowsSelectorState('some', self.i18n.icons.some.tooltip)
              currentTarget.setAttribute('data-selector-state', 'some');
              break;
          }
        }

        function addAllCheckedRow(checkedRows, data, fieldName) {
          for (let index = 0; index < data.length; index++) {
            const rowKey = data[index][fieldName];
            if (CoreUtils.isNotUndefinedNorNull(rowKey)) {
              checkedRows.add(rowKey);
            }
          }
        }

        function removeAllCheckedRow(checkedRows) {
          checkedRows.clear();
        }

        const selectorState = event.currentTarget.attributes['data-selector-state'];

        if (CoreUtils.isNotUndefinedNorNull(selectorState)) {
          if (CoreUtils.isUndefinedOrNull(event.currentTarget.currentRow)) {
            checkedAllRowsClickHandler(event.currentTarget, selectorState.value);
/*
//MLW
          if (selectorState.value === 'none') {
            removeAllCheckedRow(self.declarativeActions.checkedRows);
          }
          else if (selectorState.value === 'all') {
            removeAllCheckedRow(self.declarativeActions.checkedRows);
            addAllCheckedRow(self.declarativeActions.checkedRows, event.currentTarget.data.data, '_id');
            refreshCheckedRowsKeySet();
          }
*/
          }
          else {
            checkedRowsClickHandler(event.currentTarget, self.declarativeActions.checkedRows.size > 0 ? 'none' : 'some');
          }
        }
      };

      function setCheckedAllRowsSelectorState(selectorState, tooltip) {
        const container = document.getElementById('table:_hdrCol0');
        if (container !== null) {
          const img = document.createElement('img');
          img.setAttribute('src', `js/jet-composites/wrc-frontend/1.0.0/images/${self.i18n.icons[selectorState].iconFile}.png`);
          img.setAttribute('title', tooltip);
          img.setAttribute('alt', tooltip);
          if (container.lastElementChild.localName === 'img') {
            container.replaceChild(img, container.lastElementChild);
          }
          else {
            container.append(img);
          }
        }
      }

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
