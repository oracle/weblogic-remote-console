/**
 * @license
 * Copyright (c) 2020, 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojrouter',
  'ojs/ojmodule-element-utils',
  'ojs/ojarraydataprovider',
  'ojs/ojhtmlutils',
  'ojs/ojknockout-keyset',
  'wrc-frontend/common/controller',
  'wrc-frontend/apis/data-operations',
  'wrc-frontend/apis/message-displaying',
  'wrc-frontend/microservices/perspective/perspective-memory-manager',
  'wrc-frontend/microservices/page-definition/types',
  './container-resizer',
  './container-accessibility',
  './table-templates',
  './table-sorter',
  './help-form',
  './wdt-form',
  './unsaved-changes-dialog',
  './set-sync-interval-dialog',
  './actions-input-dialog',
  'wrc-frontend/microservices/customize/table-manager',
  'wrc-frontend/microservices/pages-history/pages-history-manager',
  'wrc-frontend/microservices/actions-management/declarative-actions-manager',
  'wrc-frontend/common/page-definition-helper',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/utils',
  'wrc-frontend/core/types',
  'wrc-frontend/core/runtime',
  'ojs/ojcontext',
  'ojs/ojlogger',
  'ojs/ojknockout',
  'ojs/ojtable',
  'ojs/ojbinddom',
  'ojs/ojdialog',
  'ojs/ojcheckboxset',
  'ojs/ojmodule-element',
  'ojs/ojmodule',
  'cfe-multi-select/loader'
],
  function (oj, ko, Router, ModuleElementUtils, ArrayDataProvider, HtmlUtils, ojkeyset_1, Controller, DataOperations, MessageDisplaying, PerspectiveMemoryManager, PageDataTypes, ContentAreaContainerResizer, ContentAreaContainerAccessibility, TableTemplates, TableSorter, HelpForm, WdtForm, UnsavedChangesDialog, SetSyncIntervalDialog, ActionsInputDialog, TableCustomizerManager, PagesHistoryManager, DeclarativeActionsManager, PageDefinitionHelper, ViewModelUtils, CoreUtils, CoreTypes, Runtime, Context, Logger) {
    function TableViewModel(viewParams) {
      // Declare reference to instance of the ViewModel
      // that JET creates/manages the lifecycle of. This
      // reference is needed (and used) inside closures.
      const self = this;

      // START: Declare instance variables used in the ViewModel's view

      this.i18n = {
        buttons: {
          yes: {
            disabled: false,
            label: oj.Translations.getTranslatedString('wrc-common.buttons.yes.label')
          },
          no: {
            disabled: false,
            label: oj.Translations.getTranslatedString('wrc-common.buttons.no.label')
          },
          ok: {
            disabled: false,
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
            needDownloading: { value: oj.Translations.getTranslatedString('wrc-unsaved-changes.prompts.unsavedChanges.needDownloading.value') }
          }
        },
        labels: {
          'totalRows': {
            value: ko.observable()
          },
          'noData': {
            value: oj.Translations.getTranslatedString('wrc-table.labels.noData.value')
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
            interval: {
              value: ko.observable(''),
              label: oj.Translations.getTranslatedString('wrc-sync-interval.dialogSync.fields.interval.label')
            }
          }
        },
        actionsDialog: {
          title: ko.observable(''),
          instructions: ko.observable(''),
          buttons: {
            ok: {
              disabled: ko.observable(true),
              label: ko.observable('')
            },
            cancel: {
              disabled: false,
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
          isHistoryVisible: isHistoryVisible,
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
          onAdminServerShutdown: handleAdminServerShutdown,
          onSyncClicked: setSyncInterval,
          onActionPollingStarted: startActionPolling,
          onActionButtonClicked: handleActionButtonClicked,
          onActionButtonsRefreshed: refreshActionsStripButtons,
          onActionInputButtonClicked: handleActionInputButtonClicked,
          onActionInputFormCompleted: handleActionInputFormCompleted,
          onCheckedRowsRefreshed: refreshCheckedRowsKeySet,
          onActionConstraintsApplied: applyActionConstraints
        }
      });

      this.overlayFormDialogModuleConfig = ko.observable({ view: [], viewModel: null });

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
      this.hasHelpTopics = ko.observable(false);
      this.tableHelpColumns = ko.observableArray([]);

      this.actionsDialog = { formLayout: { html: ko.observable({}) } };
      this.declarativeActions = { rowSelectionRequired: false, buttons: [], checkedRows: new Set(), dataRowsCount: 0 };
      this.checkedRowsKeySet = new ojkeyset_1.ObservableKeySet();

      this.availableItems = [];
      this.chosenItems = [];

      // END: Declare instance variables used in the ViewModel's view

      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(viewParams.perspective.id);
      this.contentAreaContainerResizer = new ContentAreaContainerResizer(viewParams.perspective);
      this.confirmed = ko.observable(function (event) { });
      this.confirmationMessage = ko.observable('');

      this.tableSort = { enabled: true, property: null, direction: null };
      this.tableSortable = ko.observable({});

      this.modelConsole = { expanded: false, offsetHeight: 0 };
      this.subscriptions = [];
      this.signalBindings = [];

      self.connected = function () {
        if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
          const offsetHeight = parseInt(ViewModelUtils.getCustomCssProperty('table-container-resizer-offset-max-height'), 10);
          updateModelConsole(offsetHeight);
        }

        cancelSyncTimer();

        renderPage();

        this.subscriptions.push(viewParams.parentRouter.data.rdjData.subscribe(renderPage.bind(this)));

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

        self.signalBindings.push(viewParams.signaling.resizeObserverTriggered.add((resizerData) => {
          setFormContainerMaxHeight(self.perspectiveMemory.beanPathHistory.visibility);
        }));

        self.signalBindings.push(viewParams.signaling.beanPathHistoryToggled.add((source, withHistoryVisible) => {
          setFormContainerMaxHeight(withHistoryVisible);
        }));

        self.signalBindings.push(viewParams.signaling.modelConsoleSizeChanged.add((newOffsetHeight) => {
          updateModelConsole(newOffsetHeight);
          setFormContainerMaxHeight(self.perspectiveMemory.beanPathHistory.visibility);
        }));

        self.signalBindings.push(viewParams.signaling.backendDataReloaded.add(() => {
          const treeaction = {
            isEdit: false,
            path: decodeURIComponent(viewParams.parentRouter.data.rawPath())
          };

          // fix the navtree
          viewParams.signaling.navtreeUpdated.dispatch(treeaction);

          reloadRdjData()
            .then(() => {
              renderPage();
              refreshCheckedRowsKeySet();
            });
        }));

        Context.getPageContext().getBusyContext().whenReady()
          .then(() => {
            function setOnSelectedChange(navigationProperty) {
              const ojTable = document.querySelector('.wlstable');
              if (navigationProperty !== 'none') {
                if (ojTable !== null) ojTable.setAttribute('on-selected-changed', '[[selectedListener]]');
              }
              return ojTable;
            }

            function setFormLayoutColumnCountCSSVariable(columnCount) {
              document.documentElement.style.setProperty('--form-layout-column-count', columnCount);
            }

            const pdjData = viewParams.parentRouter.data.pdjData();
            const navigationProperty = PageDefinitionHelper.getNavigationProperty(pdjData);
            ViewModelUtils.setTableCursor(navigationProperty);

            const ojTable = setOnSelectedChange(navigationProperty);
            ContentAreaContainerAccessibility.setTableAccessKey(ojTable, 'T');
            ContentAreaContainerAccessibility.setBreadcrumbAccessKey(';');
            setFormLayoutColumnCountCSSVariable(0);

            setFormContainerMaxHeight(self.perspectiveMemory.beanPathHistory.visibility);
          });
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

      function updateModelConsole(offsetHeight) {
        self.modelConsole.expanded = (offsetHeight > 104);
        self.modelConsole.offsetHeight = offsetHeight;
      }

      function isWdtTable() {
        // The same form is used for WDT model and Property List for uniform content file handling
        return (['modeling', 'properties'].indexOf(viewParams.perspective.id) !== -1);
      }

      function isHistoryVisible() {
        if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
          return false;
        }
        else {
          return (!Runtime.getProperty('features.iconbarIcons.relocated'));
        }
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

          reloadRdjData()
            .then(() => {
              renderPage();
              refreshCheckedRowsKeySet();
            });
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
          let actionPolling = { interval: 0, maxPolls: 0 };

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
                onActionPollingIntervalCompleted();
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
          if (self.declarativeActions['willAffectChangeManager']) {
            const onChangeManagerModified = (resourceData) => {
              viewParams.signaling.shoppingCartModified.dispatch(
                'table',
                'refresh',
                undefined,
                resourceData
              );
            };

            const values = Array.from(self.declarativeActions.checkedRows);
            if (values && values.length > 0) {
              onChangeManagerModified(values[0]);
            }
          }

          const rdjData = viewParams.parentRouter.data.rdjData();
          const actionPolling = DeclarativeActionsManager.getPDJActionPollingObject(rdjData, self.declarativeActions, options.action);

          if (actionPolling.interval > 0) {
            DeclarativeActionsManager.onCheckedRowsSubmitted(self.declarativeActions, options);
            actionPolling['pollCount'] = 0;
            startActionPolling(actionPolling);
          }
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
            PagesHistoryManager.setPagesHistoryCurrentAction('bypass');
            moduleConfig.viewModel.cancelAutoSync();
            moduleConfig.viewModel.syncClick({
              target: {
                attributes: {
                  'data-interval': { value: actionPolling.interval }
                }
              }
            });
          });
      }

      function setCheckedRowsDisabledState(state) {
        const nodeList = document.querySelectorAll('#table .oj-selectorbox');
        if (nodeList !== null) {
          const arr = Array.from(nodeList);
          arr.forEach((node) => {
            if (state)
              node.setAttribute('disabled', '');
            else
              node.removeAttribute('disabled');
          });
        }
      }

      function handleAdminServerShutdown() {
        viewParams.signaling.adminServerShutdown.dispatch();
        viewParams.signaling.modeChanged.dispatch(CoreTypes.Console.RuntimeMode.DETACHED.name);
      }

      function handleActionButtonClicked(options) {
        const rdjData = viewParams.parentRouter.data.rdjData();
        if (options.isDeleteAction) {
          self.declarativeActions['deleteActionCallback'] = deleteCheckedRow;
        }
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
            self.tableActionsStripModuleConfig
              .then(moduleConfig => {
                moduleConfig.viewModel.handleActionButtonClickedFailure(failure, options);
              });
          })
          .finally(() => {
            ViewModelUtils.setPreloaderVisibility(false);
          });
      }

      function applyActionConstraints(action) {
        self.tableActionsStripModuleConfig
          .then(moduleConfig => {
            const rdjData = viewParams.parentRouter?.data?.rdjData();
            DeclarativeActionsManager.onApplyActionConstraints(
              rdjData.data,
              self.declarativeActions,
              moduleConfig.viewModel.actionButtons.buttons,
              action
            );
          });
      }

      function refreshActionsStripButtons() {
        self.tableActionsStripModuleConfig
          .then(moduleConfig => {
            DeclarativeActionsManager.onCheckedRowsChanged(
              self.declarativeActions,
              moduleConfig.viewModel.actionButtons.buttons
            );
          });
      }

      function refreshCheckedRowsKeySet() {
        self.checkedRowsKeySet().keys.keys.clear();
        for (const identity of Array.from(self.declarativeActions.checkedRows)) {
          self.checkedRowsKeySet().keys.keys.add(identity);
        }
      }

      function adjustPagesHistoryData(action) {
        PagesHistoryManager.setPagesHistoryCurrentAction(action);
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

      function setFormContainerMaxHeight(withHistoryVisible) {
        const options = {
          containerType: 'table',
          withHistoryVisible: withHistoryVisible,
          withHelpVisible: self.showHelp(),
          isPolicyForm: false
        };

        let offsetMaxHeight = self.contentAreaContainerResizer.getOffsetMaxHeight('#table-container', 'table-container-resizer-offset-max-height', options);

        document.documentElement.style.setProperty('--table-container-calc-max-height', `${offsetMaxHeight}px`);
        document.documentElement.style.setProperty('--help-table-calc-max-height', `${offsetMaxHeight}px`);
      }

      function toggleBeanPathHistory(withHistoryVisible) {
        setFormContainerMaxHeight(withHistoryVisible);
        viewParams.signaling.resizeObserveeNudged.dispatch('table');
        // Call function in perspective assigned to the
        // onBeanPathHistoryToggled field in viewParams.
        return viewParams.onBeanPathHistoryToggled();
      }

      function toggleInstructions(visible) {
        self.showInstructions(visible);
        setFormContainerMaxHeight(self.perspectiveMemory.beanPathHistory.visibility);
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
              refreshCheckedRowsKeySet();
              if (self.declarativeActions.checkedRows.size > 0) {
                refreshActionsStripButtons();
              }
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
          let messageSummary = oj.Translations.getTranslatedString('wrc-common.messages.dataCopiedToClipboard.detail');
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
              const match = target.parentElement.innerText.match(/(^\t)?(.+)/);
              ele.setAttribute('data-clipboard-copyrowdata', (match ? match.at(-1) : ''));
            }
          }
        }
      };

      this.infoIconKeyUp = (event) => {
        ViewModelUtils.infoIconHTMLEventListener(event);
      };

      this.infoIconClick = (event) => {
        ViewModelUtils.infoIconHTMLEventListener(event);
      };

      this.hrefCellTemplateListener = function (event) {
        event.stopImmediatePropagation();
        const dataDefaultTemplate = TableTemplates.hrefCellTemplateListener(
          event,
          viewParams.parentRouter,
          self.perspective.id
        );
        const ele = document.getElementById('table');
        if (ele !== null) ele.setAttribute('data-default-template', dataDefaultTemplate);
      };

      this.htmlCellTemplateListener = function (event) {
        const dataDefaultTemplate = TableTemplates.htmlCellTemplateListener(
          event,
          viewParams.parentRouter,
          self.perspective.id
        );
        const ele = document.getElementById('table');
        if (ele !== null) ele.setAttribute('data-default-template', dataDefaultTemplate);
      };

      this.selectedListener = function (event) {
        let keyValue = null;

        if (event.type === 'selectedChanged') {
          if (this.selectedRows() !== null && this.selectedRows().values().size > 0) {
            this.selectedRows().values().forEach((key) => { keyValue = key; });
          }

          if (keyValue !== null) {
            viewParams.signaling.navtreeSelectionCleared.dispatch();
            const pdjData = viewParams.parentRouter.data.pdjData();

            if (PageDefinitionHelper.getNavigationProperty(pdjData) !== 'none') {
              // The following is needed because the "on-click" event
              // fires before this selectedListener function is called.
              // The function assigned to that "on-click" event, is
              // where the 'data-default-template' attribute is set
              // in the DOM. The PDJ has "identity" assigned tp the
              // navigationProperty, so we will need to use this
              // 'data-default-template' attribute to prevent the
              // navigation from happening, when the user clicks
              // the cell containing the "Download" link. JET doesn't
              // support selection-mode="("row": "single", "column": "single")"
              // so this selectedListener event will always get call
              // when you click anywhere in the row :-)
              if (event.target.getAttribute('data-default-template') === 'cellTemplate') {
                adjustPagesHistoryData('route');
                Router.rootInstance.go(`/${this.perspective.id}/${encodeURIComponent(keyValue)}`)
                  .then(hasChanged => {
                    if (hasChanged) viewParams.signaling.formSliceSelected.dispatch({ path: keyValue });
                  });
              }
            }
            else {
              const rowData = event.target.data.data[event.target.currentRow.rowIndex];
            }

            this.selectedRows(null);
          }
        }
      }.bind(this);

      function reloadRdjData() {
        return DataOperations.mbean.reload(viewParams.parentRouter.data.rdjUrl())
          .then(reply => {
            viewParams.parentRouter.data.rdjData(reply.body.data);
            return reply;
          })
          .then(reply => {
            if (self.declarativeActions['hasActionConstraints']) {
              self.tableActionsStripModuleConfig
                .then(moduleConfig => {
                  DeclarativeActionsManager.onApplyActionConstraints(
                    reply.body.data.data,
                    self.declarativeActions,
                    moduleConfig.viewModel.actionButtons.buttons
                  );
                });
            }
            return { succeeded: true };
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
                Logger.error(JSON.stringify(response));
                break;
              default:
                ViewModelUtils.failureResponseDefaultHandling(response);
                break;
            }
            return { succeeded: false };
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
                    summary: self.wdtForm.getSummaryMessage(ViewModelUtils.isElectronApiAvailable() ? 'changesSaved' : 'changesDownloaded')
                  }, 2500);
                }
              }
              else {
                if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
                  // This means wdtForm.getModelFileChanges() was
                  // able to download, but not write out the model
                  // file. Call writeContentFile passing in the
                  // filepath and fileContents in reply.
                  self.wdtForm.writeContentFile({ filepath: reply.filepath, fileContents: reply.fileContents })
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
                  dialogMessage: { name: CoreUtils.isNotUndefinedNorNull(dataProvider) ? dataProvider.name : '' }
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
        event.preventDefault();

        self.selectedRows.clear();

        const resourceData = event.currentTarget.id;

        deleteCheckedRow(resourceData);
      }.bind(this);

      function deleteCheckedRow(resourceData) {
        let navigationPath = null;

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
              const index = rdjData.data.findIndex(item => item.identity.value.resourceData === resourceData);
              if (index !== -1) {
                const key = rdjData.data[index]['Name'].value;
                self.perspectiveMemory.removeAddToArchiveSwitchValue.call(self.perspectiveMemory, key);
              }
            }
          })
          .then(() => {
            viewParams.signaling.shoppingCartModified.dispatch('table', 'delete', { isLockOwner: true, hasChanges: true, supportsChanges: true, }, resourceData);
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
                const result = removeUncheckedRow(resourceData);
                if (result.succeeded) {
                  self.declarativeActions.dataRowsCount = self.rdjDataProvider().data.length;
                  refreshActionsStripButtons();
                }
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
              resourceData
            );

            if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
              MessageDisplaying.displayResponseMessages(response.body.messages);
            }
          })
          .finally(() => {
            viewParams.signaling.ancillaryContentItemCleared.dispatch('table');
          });
      }

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

        const rdjData = viewParams.parentRouter?.data?.rdjData();
        const pdjData = viewParams.parentRouter?.data?.pdjData();

        if (PageDefinitionHelper.isDeletable(rdjData)) pdjData.table.requiresRowSelection = true;

        if (DeclarativeActionsManager.isRowSelectionRequired(pdjData)) {
          // Make first column of table a checkbox
          columnMetadata.push({
            name: '_selector',
            field: '_selector',
            readonly: self.nonwritable,
            template: 'selectorCellTemplate',
            sortable: 'disabled'
          });
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

        let columnMetadata = self.columnDataProvider();
        let rows = [];

        for (const j in rdjData.data) {
          const row = rdjData.data[~~j];
          let rowObj = {}, rowObjValue = {};

          for (let i = 0; i < columns.length; i++) {
            const cname = columns[i].name;

            rowObjValue = { label: pdjTypes.getDisplayValue(cname, row[cname]) };

            if (pdjTypes.isHrefType(cname)) {
              TableTemplates.setHrefTypeRowObjValue(rowObjValue, columnMetadata, row, cname, pdjTypes, self.hrefCellTemplateListener);
            }
            else if (pdjTypes.isHtmlType(cname) && CoreUtils.isNotUndefinedNorNull(row[cname].value.detailsHTML)) {
              TableTemplates.setHtmlTypeRowObjValue(rowObjValue, columnMetadata, row, cname, self.htmlCellTemplateListener);
            }

            rowObj[cname] = rowObjValue;
          }

          if (CoreUtils.isNotUndefinedNorNull(row.identity)) {
            rowObj['_id'] = row.identity.value.resourceData;
            rowObj['_selector'] = { _id: rowObj['_id'], headerText: 'Selector', name: '_selector', field: '_selector', template: 'selectorCellTemplate', listener: self.checkedRowsChanged };
            rows.push(rowObj);
          }
        }

        self.columnDataProvider.valueWillMutate();
        self.columnDataProvider(columnMetadata);
        self.columnDataProvider.valueHasMutated();

        if (self.tableSort.property === null) self.tableSort.property = 'Name';
        if (self.tableSort.direction === null) self.tableSort.direction = 'ascending';

        // Enable or disable table sorting
        self.tableSortable(self.tableSort.enabled ? {} : { sortable: 'disabled' });

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

        if (self.declarativeActions['hasActionConstraints']) {
          applyActionConstraints();
        }

        refreshActionsStripButtons();
      };

      this.tableCellClickListener = function (event) {
        const dataDefaultTemplate = TableTemplates.handleTableCellClickEvent(
          event,
          viewParams.parentRouter,
          self.perspective.id
        );
        const ele = document.getElementById('table');
        if (ele !== null) ele.setAttribute('data-default-template', dataDefaultTemplate);
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
          }
          else {
            checkedRowsClickHandler(event.currentTarget, self.declarativeActions.checkedRows.size > 0 ? 'none' : 'some');
          }
        }
      };

      this.helpTopicLinkClick = function (event) {
        new HelpForm(
          viewParams.parentRouter.data.pdjData(),
          self.perspective.id
        ).handleHelpTopicLinkClicked(event);
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

      function removeUncheckedRow(identity) {
        const result = { succeeded: false };
        if (self.declarativeActions.checkedRows.has(identity)) {
          self.declarativeActions.checkedRows.delete(identity);
          result.succeeded = true;
        }
        return result;
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

        if (!PageDefinitionHelper.hasTable(pdjData)) {
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

        self.tableSort.property = null;
        self.tableSort.direction = null;

        // See if CBE is controlling column sorting, or not
        if (CoreUtils.isNotUndefinedNorNull(pdjData.table.ordered) && (pdjData.table.ordered === true)) {
          // ...it is, so disable letting the user sort the columns
          self.tableSort.enabled = false;
        }
        else if (CoreUtils.isNotUndefinedNorNull(pdjData.table.defaultSortProperty)) {
          // ...CBE isn't controlling column sorting and there is
          // a default sort property, so use it.
          self.tableSort.property = pdjData.table.defaultSortProperty;
        }

        DeclarativeActionsManager.populateDeclarativeActions(rdjData, pdjData, self.declarativeActions);
        DeclarativeActionsManager.addDeclarativeAction('delete', rdjData, pdjData, self.declarativeActions);

        setRDJDataProvider(rdjData, self.perspective.id, pdjData.table.displayedColumns, pdjData.table.hiddenColumns);

        const bindHtml = PageDefinitionHelper.createIntroduction(pdjData, rdjData);
        self.introductionHTML({ view: HtmlUtils.stringToNodeArray(bindHtml), data: self });

        self.actionsDialog.formLayout.html({ view: HtmlUtils.stringToNodeArray('<p>'), data: self });

        populateAddToArchiveSwitchValues(rdjData);

        createHelp(pdjData);
      }

      function createHelp(pdjData) {
        self.hasHelpTopics(PageDefinitionHelper.hasHelpTopics(pdjData));

        if (CoreUtils.isUndefinedOrNull(pdjData)) {
          return;
        }

        const helpForm = new HelpForm(
          pdjData,
          self.perspective.id
        );

        self.tableHelpColumns(helpForm.tableHelpColumns);

        let properties = [];

        if (CoreUtils.isNotUndefinedNorNull(pdjData.table.displayedColumns)) {
          properties = [...pdjData.table.displayedColumns];
        }

        if (CoreUtils.isNotUndefinedNorNull(pdjData.table.hiddenColumns)) {
          properties = [...properties, ...pdjData.table.hiddenColumns];
        }

        const helpData = helpForm.getHelpData(properties);
        self.helpDataSource(helpData);

        const div = helpForm.render();
        self.helpFooterDom({ view: HtmlUtils.stringToNodeArray(div.innerHTML), data: self });
      }
    }

    return TableViewModel;
  }
);