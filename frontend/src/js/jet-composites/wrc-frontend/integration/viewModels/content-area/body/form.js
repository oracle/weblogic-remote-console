/**
 * @license
 * Copyright (c) 2020, 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */ 

 'use strict';

 define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojmodule-element-utils', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', 'ojs/ojknockout-keyset', 'ojs/ojkeyset', 'wrc-frontend/integration/controller', 'wrc-frontend/apis/data-operations', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/microservices/change-management/change-manager', 'wrc-frontend/microservices/navtree/navtree-manager', 'wrc-frontend/microservices/perspective/perspective-memory-manager', './unsaved-changes-dialog', './set-sync-interval-dialog', './actions-input-dialog', './container-resizer', 'wrc-frontend/microservices/page-definition/common', 'wrc-frontend/microservices/page-definition/types', 'wrc-frontend/microservices/page-definition/fields', 'wrc-frontend/microservices/page-definition/options-sources', 'wrc-frontend/microservices/page-definition/actions-input', 'wrc-frontend/microservices/page-definition/form-layouts', 'wrc-frontend/microservices/page-definition/unset', 'wrc-frontend/microservices/page-definition/usedifs','wrc-frontend/microservices/page-definition/utils', './create-form', './wdt-form', './help-form', './policy-form', 'wrc-frontend/microservices/customize/table-manager', 'wrc-frontend/microservices/actions-management/declarative-actions-manager', 'wrc-frontend/microservices/policy-management/policy-manager', 'wrc-frontend/integration/router-data', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'wrc-frontend/core/types', 'wrc-frontend/core/runtime', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojbinddom', 'ojs/ojinputtext', 'ojs/ojlabel', 'ojs/ojswitch', 'ojs/ojselectcombobox', 'ojs/ojformlayout', 'ojs/ojasyncvalidator-regexp', 'ojs/ojconveyorbelt', 'ojs/ojmessages', 'ojs/ojmodule-element', 'ojs/ojmodule', 'cfe-multi-select/loader', 'cfe-property-list-editor/loader', 'cfe-policy-editor/loader', 'ojs/ojselectsingle', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojcheckboxset', 'ojs/ojradioset'],
     function (oj, ko, Router, ModuleElementUtils, ArrayDataProvider, HtmlUtils, keySet, ojkeyset_1, Controller, DataOperations, MessageDisplaying, ChangeManager, NavtreeManager, PerspectiveMemoryManager, UnsavedChangesDialog, SetSyncIntervalDialog, ActionsInputDialog, ContentAreaContainerResizer, PageDefinitionCommon, PageDataTypes, PageDefinitionFields, PageDefinitionOptionsSources, PageDefinitionActionsInput, PageDefinitionFormLayouts, PageDefinitionUnset, PageDefinitionUsedIfs, PageDefinitionUtils, CreateForm, WdtForm, HelpForm, PolicyForm, TableCustomizerManager, DeclarativeActionsManager, PolicyManager, RouterData, ViewModelUtils, CoreUtils, CoreTypes, Runtime, Context, Logger) {
       function FormViewModel(viewParams) {

         const self = this;
 
         this.i18n = {
           checkboxes: {
             showAdvancedFields: {
               id: 'show',
               label: oj.Translations.getTranslatedString('wrc-form.checkboxes.showAdvancedFields.label')
             }
           },
           introduction: {
             toggleHelp: {
               iconFile: 'toggle-help-icon-blk_16x16.png',
               text: oj.Translations.getTranslatedString('wrc-form.introduction.toggleHelp.text', '{0}')
             }
           },
           messages: {
             savedTo: {
               shoppingcart: oj.Translations.getTranslatedString('wrc-form.messages.savedTo.shoppingcart'),
               generic: oj.Translations.getTranslatedString('wrc-form.messages.savedTo.generic'),
               notSaved: oj.Translations.getTranslatedString('wrc-form.messages.savedTo.notSaved')
             },
             action: {
               notAllowed: {
                 summary: oj.Translations.getTranslatedString('wrc-form.messages.action.notAllowed.summary'),
                 detail: oj.Translations.getTranslatedString('wrc-form.messages.action.notAllowed.detail')
               }
             }
           },
           prompts: {
             unsavedChanges: {
               willBeLost: {value: oj.Translations.getTranslatedString('wrc-unsaved-changes.prompts.unsavedChanges.willBeLost.value')},
               areYouSure: {value: oj.Translations.getTranslatedString('wrc-unsaved-changes.prompts.unsavedChanges.areYouSure.value')}
             }
           },
           icons: {
             restart: {
               iconFile: 'restart-required-org_24x24',
               tooltip: oj.Translations.getTranslatedString('wrc-form.icons.restart.tooltip')
             },
             wdtIcon: {
               iconFile: 'wdt-options-icon-blk_24x24',
               tooltip: oj.Translations.getTranslatedString('wrc-form.icons.wdtIcon.tooltip')
             },
             choose: {
               iconFile: 'choose-file-icon-blk_24x24',
               tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.choose.value')
             },
             clear: {
               iconFile: 'erase-icon-blk_24x24',
               tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.clear.value')
             },
             more: {
               iconFile: {enabled: 'more-vertical-brn-8x24', grayed: 'more-vertical-readonly-8x24'},
               iconClass: 'more-vertical-icon',
               tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.more.value')
             }
           },
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
           }
         };
 
         this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(viewParams.perspective.id);
         this.navtreeManager = new NavtreeManager(viewParams.perspective);
         this.contentAreaContainerResizer = new ContentAreaContainerResizer(viewParams.perspective);
 
         this.loadRdjDoNotClearDirty = false;
         this.dirtyFields = new Set();
         this.pageRedoHistory = {};
         this.dynamicMessageFields = [];
         this.multiSelectControls = {};
         this.propertyListName = null;
         this.saveButtonDisabledVoting = {
           checkboxSetChanged: true,
           multiSelectChanged: true,
           inputFieldChanged: true,
           nonInputFieldChanged: true
         };
         this.debugFlagItems = ko.observable();
         this.debugFlagsEnabled = ko.observableArray([]);
         this.debugFlagEvent = false;
 
         // An unset field is being set to default value
         this.resetUnsetFieldFlag = false;
 
         this.hasAdvancedFields = ko.observable(false);
         this.showAdvancedFields = ko.observableArray([]);
 
         this.fieldMessages = ko.observableArray([]);
         this.fieldDisabled = ko.observableArray([]);
 
         this.formDom = ko.observable({});
         this.rdjData = null;
         this.pdjData = null;
 
         this.readonly = ko.observable(Runtime.isReadOnly());
         this.introductionHTML = ko.observable();

         this.showInstructions = ko.observable(true);

         this.showHelp = ko.observable(false);
         this.helpDataSource = ko.observableArray([]);
         this.helpDataProvider = new ArrayDataProvider(this.helpDataSource, { keyAttributes: 'Name' });
         this.helpFooterDom = ko.observable({});
         this.tableHelpColumns = ko.observableArray([]);
 
         this.declarativeActions = {rowSelectionRequired: false, buttons: [], checkedRows: new Set(), dataRowsCount: 0};
         this.selectedRows = ko.observable({
           row: new ojkeyset_1.KeySetImpl(),
           column: new ojkeyset_1.KeySetImpl(),
         });

         this.dialogFields = ko.observable();
         this.dialogFields({title: ''});
         this.wdtOptionsDialogHTML = ko.observable({view: HtmlUtils.stringToNodeArray('<p/>')});
         this.buttonSelected = ko.observable('fromRegValue');
         this.doWdtDialogPopup = false;
 
         this.modelConsole = {expanded: false, offsetHeight: 0};
         this.valueSubscriptions = [];
         this.subscriptions = [];
         this.signalBindings = [];

         this.actionButtonSet = { html: ko.observable({}),  buttonSetItems: {}};

         this.formToolbarModuleConfig = ModuleElementUtils.createConfig({
           viewPath: `${Controller.getModulePathPrefix()}views/content-area/body/form-toolbar.html`,
           viewModelPath: `${Controller.getModulePathPrefix()}viewModels/content-area/body/form-toolbar`,
           params: {
             parentRouter: viewParams.parentRouter,
             signaling: viewParams.signaling,
             perspective: viewParams.perspective,
             newAction: newBean,
             deleteAction: deleteBean,
             cancelAction: cancelBean,
             rerenderAction: rerenderWizardForm,
             isWdtForm: isWdtForm,
             isShoppingCartVisible: isShoppingCartVisible,
             isWizardForm: isWizardForm,
             finishedAction: finishWizardForm,
             createFormMode: getCreateFormMode,
             onSave: saveBean,
             onSaveButtonClicked: saveButtonClicked,
             onUpdateContentFile: updateContentFile,
             onLandingPageSelected: selectLandingPage,
             onBeanPathHistoryToggled: toggleBeanPathHistory,
             onInstructionsToggled: toggleInstructions,
             onBlankFormDisplayed: displayBlankForm,
             onHelpPageToggled: toggleHelpPage,
             onShoppingCartViewed: viewShoppingCart,
             onShoppingCartDiscarded: discardShoppingCart,
             onShoppingCartCommitted: commitShoppingCart,
             onUnsavedChangesDecision: decideUnsavedChangesAction,
             onToolbarRendering: getToolbarRenderingInfo,
             onSyncClicked: setSyncInterval,
             onSyncIntervalClicked: captureSyncInterval,
             onCustomizeButtonClicked: toggleCustomizer,
             onDashboardButtonClicked: createDashboard
           }
         });
 
         this.formTabStripModuleConfig = ModuleElementUtils.createConfig({
           viewPath: `${Controller.getModulePathPrefix()}views/content-area/body/form-tabstrip.html`,
           viewModelPath: `${Controller.getModulePathPrefix()}viewModels/content-area/body/form-tabstrip`,
           params: {
             parentRouter: viewParams.parentRouter,
             signaling: viewParams.signaling,
             perspective: viewParams.perspective,
             onCanExit: exitForm,
             onAutoSave: autoSaveForm
           }
         });

         this.formActionsStripModuleConfig = ModuleElementUtils.createConfig({
           viewPath: `${Controller.getModulePathPrefix()}views/content-area/body/form-actions-strip.html`,
           viewModelPath: `${Controller.getModulePathPrefix()}viewModels/content-area/body/form-actions-strip`,
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
         this.tableCustomizerManager = new TableCustomizerManager();
 
         self.applyCustomizations = (visibleColumns, hiddenColumns, applyButton = false) => {
           const columnMetadata = self.tableCustomizerManager.applyCustomizations.call(
               self.tableCustomizerManager,
               [],
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
               [],
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
 
         function toggleCustomizer(event) {
           const toggleState = self.tableCustomizerManager.toggleCustomizerState(event);
           if (CoreUtils.isNotUndefinedNorNull(toggleState)) {
             const visible = (toggleState === 'collapsed');
             self.formTabStripModuleConfig
               .then(moduleConfig => {
                 moduleConfig.viewModel.setTabStripVisibility(visible);
                 self.formActionsStripModuleConfig
                   .then(moduleConfig => {
                     moduleConfig.viewModel.renderActionsStrip(visible);
                     toggleInstructions(visible);
                   });
               });
           }
         }
 
         function adjustSliceTableCustomizer(showCustomizer) {
           if (showCustomizer) {
             // Setup the page and column info on the customizer for a slice table
             const customizerUrl = viewParams.parentRouter.data.rdjData().tableCustomizer;
             self.tableCustomizerManager.setCustomizerUrl.call(self.tableCustomizerManager, customizerUrl);
             self.resetCustomizations(true);
           }
 
           // Ensure the customizer state is setup once the module is available
           self.tableCustomizerModuleConfig
             .then((moduleConfig) => {
               if (moduleConfig) {
                 // Setup the customizer to display the slice table columns
                 if (showCustomizer) {
                   const selectedColumns = viewParams.parentRouter.data.rdjData().displayedColumns;
                   moduleConfig.viewModel.setupCustomization(selectedColumns);
                 }

                 // Adjust the toolbar button based on table customization state
                 self.tableCustomizerManager.adjustCustomizerButtonState(showCustomizer);

                 // Ensure the customizer is not available when no slice table
                 if (!showCustomizer) self.tableCustomizerManager.closeCustomizerState();
               }
             });
         }
 
         function getDefaultVisibleAndHiddenColumns() {
           const pdjData = viewParams.parentRouter.data.pdjData();
           const visibleColumns = CoreUtils.shallowCopy(pdjData?.sliceTable.displayedColumns);
           const hiddenColumns = CoreUtils.shallowCopy(pdjData?.sliceTable?.hiddenColumns);
           return { visibleColumns: visibleColumns, hiddenColumns: hiddenColumns };
         }
 
         this.connected = function () {
           if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
             document.title = viewParams.parentRouter.data.pageTitle();
           }

           // Disable the customizer button until determining if there is a slice table
           self.tableCustomizerManager.adjustCustomizerButtonState(false);

           createCreateForm();

           if (isPolicyExpressionSliceLayout()) {
             createPolicyForm();
           }

           if (isWdtForm()) {
             self.wdtForm = new WdtForm(viewParams);
             if (!isWizardForm()) {
               if (ViewModelUtils.isElectronApiAvailable() && CoreUtils.isUndefinedOrNull(window.api)) {
                 window.addEventListener('beforeunload', onBeforeUnload);
               }
             }
           }

           cancelSyncTimer();
           renderPage(true);
           self.subscriptions.push(viewParams.parentRouter.data.rdjData.subscribe(renderPage.bind(this)));

           let binding = viewParams.signaling.readonlyChanged.add((newRO) => {
             self.readonly(newRO);
             renderPage(true);
           });

           self.signalBindings.push(binding);

           binding = viewParams.signaling.appQuitTriggered.add(() => {
             if (ViewModelUtils.isElectronApiAvailable()) {
               window.electron_api.ipc.invoke('preference-reading', 'unsaved-confirmation.appExit')
                 .then(value => {
                   value = value || false;
                   ViewModelUtils.blurActiveElement();
                   if (value && self.isDirty()) {
                     if (isWdtForm()) {
                       sendWindowAppQuit(false, 5);
                     }
                     else {
                       decideUnsavedChangesAppExitAction()
                         .then(reply => {
                           switch(reply.exitButton) {
                             case 'yes': {
                               onStartWindowQuit()
                                 .then(result => {
                                   sendWindowAppQuit(result.isNotQuitable, result.waitMilliseconds);
                                 });
                             }
                               break;
                             case 'no':
                               sendWindowAppQuit(false, 5);
                               break;
                             case 'cancel':
                               sendWindowAppQuit(true, 5);
                               break;
                           }
                         });
                     }
                   }
                   else {
                     sendWindowAppQuit(false, 5);
                   }
                 })
                 .catch(response => {
                   sendWindowAppQuit(false, 5);
                 });
             }
           });

           self.signalBindings.push(binding);

           binding = viewParams.signaling.autoDownloadRequested.add(() => {
             updateContentFile('autoDownload').then(reply => {});
           });

           self.signalBindings.push(binding);

           binding = viewParams.signaling.modelConsoleSizeChanged.add( (newOffsetHeight) => {
             self.modelConsole.expanded = (newOffsetHeight > 23);
             self.modelConsole.offsetHeight = newOffsetHeight;
             setFormContainerMaxHeight(self.perspectiveMemory.beanPathHistory.visibility);
           });

           self.signalBindings.push(binding);

           binding = viewParams.signaling.resizeObserverTriggered.add( (resizerData) => {
             setFormContainerMaxHeight(self.perspectiveMemory.beanPathHistory.visibility);
           });

           self.signalBindings.push(binding);

           binding = viewParams.signaling.dataProviderSelected.add((dataProvider) => {
             const eventType = (ViewModelUtils.isElectronApiAvailable() ? 'autoSave' : (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name ? 'autoDownload' : 'exit'));
             exitForm(eventType).then(result => {});
           });

           self.signalBindings.push(binding);

           // Handle signal that sso token has expired
           binding = viewParams.signaling.ssoTokenExpired.add((dataProvider) => {
             if ((Runtime.getDataProviderId() === dataProvider.id) && self.isDirty()) {
               // Clear the changes so the form will exit when the data provider is deactivated
               // Otherwise the save changes dialog will appear when the actions cannot be performed
               Logger.info(`[FORM] ssoTokenExpired when isDirty() - Clear changes ${dataProvider.name} (${dataProvider.id})`);
               clearFormChanges();
             }
           }, undefined, 1);

           self.signalBindings.push(binding);

         }.bind(this);
 
         this.disconnected = function () {
           cancelSyncTimer();

           self.declarativeActions.checkedRows.clear();
           refreshCheckedRowsKeySet();

           self.signalBindings.forEach((binding) => {
             binding.detach();
           });
 
           self.signalBindings = [];
 
           self.subscriptions.forEach((item) => {
             if (item.name) {
               item.subscription.dispose();
             }
             else {
               item.dispose();
             }
           });
 
           self.subscriptions = [];
 
           self.valueSubscriptions.forEach((item) => {
             item.subscription.dispose();
           });
 
           self.valueSubscriptions = [];
 
           const formElement = document.getElementById('wlsform');
           if (formElement) {
             formElement.removeEventListener('blur', onBlurFormLayout);
           }
 
           if (isWdtForm()) {
             window.removeEventListener('beforeunload', onBeforeUnload);
           }
 
         };
 
         this.showAdvancedFieldsValueChanged = function (event) {
           stashDirtyFields();
           if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
             reloadRdjData();
           }
           renderPage();
         };
 
         function createCreateForm() {
           const pdjData = viewParams.parentRouter.data.pdjData();
           if (CoreUtils.isNotUndefinedNorNull(pdjData.createForm)) {
             resetSaveButtonDisabledState({disabled: false});
             const mode = CreateForm.prototype.Mode.SCROLLING;
             self.createForm = new CreateForm(viewParams, rerenderWizardForm, mode);
           }
         }
 
         function createPolicyForm() {
           if (RouterData.hasRDJData(viewParams.parentRouter) && RouterData.hasPDJData(viewParams.parentRouter)) {
             const rdjData = viewParams.parentRouter.data.rdjData();
             if (CoreUtils.isUndefinedOrNull(self.policyData)) {
               self.policyData = PolicyManager.createPolicyData(rdjData);
             }
             const pdjData = viewParams.parentRouter.data.pdjData();
             if (RouterData.hasSliceFormProperties(pdjData)) {
               const sliceName = pdjData.sliceForm.properties[0].name;
               self.policyForm = new PolicyForm(
                   self.policyData,
                   sliceName,
                   viewParams.parentRouter.data.rdjUrl()
               );
             }
           }
         }
 
         this.policyActionButtonClicked = (event) => {
           self.policyForm.actionButtonClicked(event);
         };
 
         this.policyActionMenuClickListener = (event) => {
           self.policyForm.actionMenuClickListener(event);
         };
 
         this.addConditionMenuClickListener = (event) => {
           self.policyForm.addConditionMenuClickListener(event);
         };
 
         this.launchAddConditionMenu = (event) => {
           self.policyForm.launchAddConditionMenu(event);
         };
 
         function handleActionInputButtonClicked(rdjData, actionInputFormConfig) {
           ActionsInputDialog.handleActionInputButtonClicked(self, viewParams, rdjData, actionInputFormConfig, 'form', submitActionInputForm, getRowKey());
         }

         function handleActionInputFormCompleted(reply, options) {
           if (reply.succeeded) {
             const actionPolling = DeclarativeActionsManager.getPDJActionPollingObject(self.declarativeActions, options.action);
             const pdjData = viewParams.parentRouter.data.pdjData();
             if (!DeclarativeActionsManager.hasSliceFormActionInput(pdjData)) {
               DeclarativeActionsManager.onCheckedRowsSubmitted(self.declarativeActions, options);
             }

             if (actionPolling.interval > 0) {
               actionPolling['pollCount'] = 0;
               startActionPolling(actionPolling);
             }
             else {
               setSyncInterval(actionPolling.interval);
             }
           }
         }

         /**
          *
          * @param {{action?: string, interval: number, maxPolls: number, pollCount?: number, endWhenPairs?: [{name: string, value: any}]}} actionPolling
          * @private
          */
         function startActionPolling(actionPolling) {
           self.formToolbarModuleConfig
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
             reloadRdjData();
             actionPolling.pollCount += 1;
             onActionPollingIntervalCompleted()
           }
         }

         function handleActionButtonClicked(options) {
           const rdjData = viewParams.parentRouter.data.rdjData();
           return DeclarativeActionsManager.performActionOnCheckedRows(rdjData, self.declarativeActions, options);
         }

         function getRowKey() {
           let rowKey = '_identity';
           const table= document.getElementById('table');
           if (table !== null && CoreUtils.isNotUndefinedNorNull(table.attributes['data-row-key'])) {
             rowKey = table.attributes['data-row-key'].value;
           }
           return rowKey;
         }

         function submitActionInputForm(rdjData, submitResults, options) {
           function reloadCheckedRowsKeySet(checkedRows, rdjData) {
             function getKeyValue(row, rowKey) {
               let keyValue;
               switch (rowKey) {
                 case '_identity':
                   keyValue = row.identity.value.resourceData;
                   break;
                 case '_identifier':
                   keyValue = row.identifier.value;
               }
               return keyValue;
             }

             if (CoreUtils.isNotUndefinedNorNull(self.selectedRows().row.keys.keys)) {
               if (self.selectedRows().row.keys.keys.size > 0) {
                 checkedRows.clear();
                 const rowKey = getRowKey();
                 for (const rowIndex of Array.from(self.selectedRows().row.keys.keys)) {
                   const row = rdjData.data[rowIndex];
                   if (CoreUtils.isNotUndefinedNorNull(row)) {
                     const keyValue = getKeyValue(row, rowKey);
                     if (CoreUtils.isNotUndefinedNorNull(keyValue)) {
                       checkedRows.add(keyValue);
                     }
                   }
                 }
               }
             }
           }

           ViewModelUtils.setPreloaderVisibility(true);

           if (CoreUtils.isNotUndefinedNorNull(self.declarativeActions.inputForm)) {
             if (self.declarativeActions.inputForm.rows.value.length > 0) {
               submitResults['rows'] = self.declarativeActions.inputForm.rows;
             }
           }

           reloadCheckedRowsKeySet(self.declarativeActions.checkedRows, self.rdjData);

           DeclarativeActionsManager.submitActionInputForm(submitResults, self.declarativeActions.checkedRows, rdjData.invoker, options)
             .then(reply => {
               self.formActionsStripModuleConfig
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
           if (self.declarativeActions.checkedRows.size === 0) {
             if (!self.selectedRows().row.keys.all) {
               self.selectedRows().row.keys.keys.clear();
             }
           }
         }

         function refreshActionsDisabledStates() {
           self.formActionsStripModuleConfig
             .then(moduleConfig => {
               DeclarativeActionsManager.onCheckedRowsChanged(
                 self.declarativeActions,
                 moduleConfig.viewModel.actionButtons.buttons
               );
             });
         }

         function createDashboard(event) {
           function getContentPageSliceData(pdjData) {
             return new Promise(function (resolve) {
               let slices = [];

               if (RouterData.hasSliceFormSlices(pdjData)) {
                 slices = pdjData.sliceForm.slices;
               }
               else if (RouterData.hasSliceTableSlices(pdjData)) {
                 slices = pdjData.sliceTable.slices;
               }
  
               self.formTabStripModuleConfig
                 .then(moduleConfig => {
                   moduleConfig.viewModel.setTabStripVisibility(false);
                   if (slices.length > 0) {
                     resolve({slices: slices, currentSlice: moduleConfig.viewModel.getCurrentSlice()});
                   }
                   else {
                     resolve({slices: slices, currentSlice: null});
                   }
                 });
               
             });
           }

           const createFormUrl = viewParams.parentRouter.data.rdjData().dashboardCreateForm.resourceData;

           DataOperations.mbean.new(createFormUrl)
             .then(reply => {
               const pdjData = viewParams.parentRouter.data.pdjData();
               getContentPageSliceData(pdjData)
                 .then(data => {
                   self.perspectiveMemory.contentPage['rdjUrl'] = viewParams.parentRouter.data.rdjUrl();
                   if (data.currentSlice !== null) {
                     self.perspectiveMemory.contentPage['lastVisitedSlice'] = data.currentSlice;
                   }

                   viewParams.parentRouter.data.pdjUrl(reply.body.data.get('pdjUrl'));
                   viewParams.parentRouter.data.pdjData(reply.body.data.get('pdjData'));
                   viewParams.parentRouter.data.rdjUrl(reply.body.data.get('rdjUrl'));
                   viewParams.parentRouter.data.rdjData(reply.body.data.get('rdjData'));

                   createCreateForm();

                   viewParams.parentRouter.go('form');
                 })
             })
             .catch(response => {
               ViewModelUtils.failureResponseDefaultHandling(response);
             });
         }
 
         function sendWindowAppQuit(isNotQuitable, waitMilliseconds) {
           if (ViewModelUtils.isElectronApiAvailable()) {
             setTimeout(() => {
               window.electron_api.ipc.invoke('window-app-quiting', {preventQuitting: isNotQuitable, source: 'form.js'});
             }, waitMilliseconds);
           }
         }
 
         /**
          *
          * @returns {Promise<{isNotQuitable: boolean, waitMilliseconds: number}>}
          * @private
          */
         function onStartWindowQuit() {
           notifyUnsavedChanges(false);
           return new Promise(function (resolve) {
             stashDirtyFields();
             const eventType = (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name ? 'download' : 'autoDownload');
             saveBean(eventType)
               .then(reply => {
                 if (reply) {
                   if (CoreUtils.isNotUndefinedNorNull(self.wdtForm)) {
                     self.wdtForm.getContentFileChanges()
                       .then(reply => {
                         if (!reply.succeeded) {
                           writeContentFile({filepath: reply.filepath, fileContents: reply.fileContents});
                         }
                         resolve({isNotQuitable: false, waitMilliseconds: 2500});
                       });
                   }
                   else {
                     resolve({isNotQuitable: false, waitMilliseconds: 2500});
                   }
                 }
                 else {
                   resolve({isNotQuitable: true, waitMilliseconds: 5});
                 }
               });
           });
         }
 
         function onBeforeUnload(event) {
           function handleEvent(event) {
             event.preventDefault();
             return event.returnValue = '';
           }
 
           ViewModelUtils.blurActiveElement();
 
           if (self.isDirty()) {
             if (ViewModelUtils.isElectronApiAvailable()) {
               window.electron_api.ipc.invoke('preference-reading', 'unsaved-confirmation.unload')
                 .then(value => {
                   value = value || false;
                   if (value) {
                     onStartWindowQuit()
                       .then(result => {
                         delete event['returnValue'];
                       });
                   }
                   return handleEvent(event);
                 });
             }
             else {
               return handleEvent(event);
             }
           }
           else {
             delete event['returnValue'];
           }
         }
 
         /**
          * Nested class for setting and capturing the value of fields, used in a dialog box.
          * @returns {{addField: addField, putValue: putValue}}
          * @constructor
          */
         function DialogFields() {
           return {
             addField: function (name, value) {
               if (typeof value === 'number') value = value.toString();
               this.putValue(name, value || '');
             },
             putValue: function (name, value) {
               this[name] = value;
             }
           }
         }
 
         function stashDirtyFields() {
           const dataPayload = getDirtyFieldsPayload(true);
           resetPageRedoHistory();
           cacheDataPayload(dataPayload);
         }
 
         function updateFields_MultiSelect(dialogFields){
           const variableName = dialogFields.variableName;
           const itemValue = dialogFields.itemValue;
           const multiElement = document.getElementById(dialogFields.id);
           let newProp = null;
           switch (self.buttonSelected()) {
             case 'fromRegValue':
               self[`${PageDefinitionCommon.FIELD_VALUES}${dialogFields.replacer}`]('');
               self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${dialogFields.replacer}`]('fromRegValue');
               multiElement.readonly=false;
               break;
             case 'fromSelectWKTVariable': {
               const modelProp = self.wdtForm.getModelPropertyBasedOnUid(dialogFields.variableUid);
               dialogFields.variableName = modelProp.Name;
               dialogFields.itemValue = modelProp.Value;
               updateValue(dialogFields);
               multiElement.readonly=true;
               multiElement.clearAllChosenItems();
               break;
             }
             case 'fromWKTVariable':
               self.wdtForm.setModelPropertyValue(variableName, itemValue);
               updateValue(dialogFields);
               multiElement.readonly=true;
               multiElement.clearAllChosenItems();
               break;
             case 'fromModelToken':
               self[`${PageDefinitionCommon.FIELD_VALUES}${dialogFields.replacer}`](dialogFields.itemValue);
               self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${dialogFields.replacer}`]('fromModelToken');
               multiElement.readonly=true;
               break;
             case 'fromPropOptions':
               self[`${PageDefinitionCommon.FIELD_VALUES}${dialogFields.replacer}`](dialogFields.variableName);
               self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${dialogFields.replacer}`]('fromModelToken');
               multiElement.readonly=true;
               multiElement.clearAllChosenItems();
               break;
             case 'createPropOptions':
               self[`${PageDefinitionCommon.FIELD_VALUES}${dialogFields.replacer}`]('@@PROP:' + dialogFields.newPropName + '@@');
               self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${dialogFields.replacer}`]('fromModelToken');
               multiElement.readonly=true;
               multiElement.clearAllChosenItems();
               newProp = {
                 name: dialogFields.newPropName,
                 value: dialogFields.newPropValue
               };
           }
           self.dirtyFields.add(dialogFields.replacer);
           return newProp;
         }
 
         function setReadonly(name , option=true) {
           let field = document.getElementById(name);
           if (CoreUtils.isNotUndefinedNorNull(field)) {
             field.readonly = option;
           }
         }
 
         function updateValue(dialogFields){
           self[`${PageDefinitionCommon.FIELD_VALUES}${dialogFields.replacer}`]('@@PROP:'+dialogFields.variableName+'@@');
           self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${dialogFields.replacer}`]('fromModelToken');
           const name = dialogFields.id;
           if (dialogFields.displayClass === 'oj-switch') {
             document.getElementById('extraField_' + name).style.display = 'inline-flex';
             document.getElementById('baseField_' + name).style.display = 'none';
           }
         }
 
         function updateFields(dialogFields) {
           self.doWdtDialogPopup = false;
           let buttonS = self.buttonSelected();
           const name = dialogFields.id;
           let newProp = null;
           if (dialogFields.displayClass === 'cfe-multi-select') {
             return updateFields_MultiSelect(dialogFields);
           }
           if (dialogFields.wktTool === 'true'){
             if (!self.dirtyFields.has(dialogFields.id))
               self.dirtyFields.add(dialogFields.id);
             // if (dialogFields.originalValueFrom === 'fromModelToken'){
             //   //If this is TOOLS, used variable before but now no longer using variables, we need to delete this variable.
             //   if (buttonS !== 'fromWKTVariable') {
             //     self.wdtForm.removeModelProperty(self.wdtForm.stripOutSign(dialogFields.originalValue));
             //   }
             // }
             //if (buttonS !== 'restoreToDefault') setReadonly(name);
           }
           if (buttonS !== 'restoreToDefault') {
             self[`${PageDefinitionCommon.FIELD_VALUE_SET}${dialogFields.replacer}`](true);
             PageDefinitionUnset.addPropertyHighlight(dialogFields.id);
           }
           switch (buttonS){
             case 'restoreToDefault' :
               unsetProperty(PageDefinitionUnset.getPropertyAction(name));
               if (dialogFields.displayClass === 'oj-switch') {
                 document.getElementById('extraField_' + name).style.display = 'none';
                 document.getElementById('baseField_' + name).style.display = 'inline-flex';
               }
               self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${dialogFields.replacer}`]('fromRegValue');
               setReadonly(name, false);
               break;
             case 'fromSelectWKTVariable': {
               const modelProp = self.wdtForm.getModelPropertyBasedOnUid(dialogFields.variableUid);
               dialogFields.variableName = modelProp.Name;
               dialogFields.itemValue = modelProp.Value;
               updateValue(dialogFields);
               setReadonly(name);
               break;
             }
             case 'fromWKTVariable':
               self.wdtForm.updateModelProperty(dialogFields);
               updateValue(dialogFields);
               setReadonly(name);
               break;
             case 'fromModelToken':
               self[`${PageDefinitionCommon.FIELD_VALUES}${dialogFields.replacer}`](dialogFields.variableName);
               self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${dialogFields.replacer}`]('fromModelToken');
               if (dialogFields.displayClass === 'oj-switch') {
                 document.getElementById('extraField_' + name).style.display = 'inline-flex';
                 document.getElementById('baseField_' + name).style.display = 'none';
               }
               setReadonly(name);
               break;
             case 'fromUnresolvedReference' :
               self[`${PageDefinitionCommon.FIELD_VALUES}${dialogFields.replacer}`](dialogFields.unresolvedValue);
               self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${dialogFields.replacer}`]('fromUnresolvedReference');
               setReadonly(name);
               break;
             case 'fromPropOptions':
               self[`${PageDefinitionCommon.FIELD_VALUES}${dialogFields.replacer}`](dialogFields.variableName);
               self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${dialogFields.replacer}`]('fromModelToken');
               if (dialogFields.displayClass === 'oj-switch') {
                 document.getElementById('extraField_' + name).style.display = 'inline-flex';
                 document.getElementById('baseField_' + name).style.display = 'none';
               }
               setReadonly(name);
               break;
             case 'createPropOptions':
               self[`${PageDefinitionCommon.FIELD_VALUES}${dialogFields.replacer}`]('@@PROP:' + dialogFields.newPropName + '@@');
               self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${dialogFields.replacer}`]('fromModelToken');
               newProp = {
                 name: dialogFields.newPropName,
                 value: dialogFields.newPropValue
               };
               if (dialogFields.displayClass === 'oj-switch') {
                 document.getElementById('extraField_' + name).style.display = 'inline-flex';
                 document.getElementById('baseField_' + name).style.display = 'none';
               }
               setReadonly(name);
               break;
             case 'fromRegValue' :
               self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${dialogFields.replacer}`]('fromRegValue');
               if (dialogFields.displayClass === 'oj-switch') {
                 //we want to use the value from the element itself. User may just changed from using Token to
                 //boolean value by radio button selection, and see that it's the value he wants and just
                 //exit the wdt dialog without clicking on the boolean switch.
                 //Then the dialogFields.currentValue will still be the token which is wrong.
                 const realVal = document.getElementById('switch_'+name).value;
                 self[`${PageDefinitionCommon.FIELD_VALUES}${dialogFields.replacer}`](realVal);
                 document.getElementById('extraField_' + name).style.display = 'none';
                 document.getElementById('baseField_' + name).style.display = 'inline-flex';
               }else
               if (dialogFields.displayClass === 'oj-select-single' ||
                   dialogFields.displayClass === 'oj-combobox-one') {
                 self[`${PageDefinitionCommon.FIELD_VALUES}${dialogFields.replacer}`](dialogFields.selectedValue);
               } else {
                 self[`${PageDefinitionCommon.FIELD_VALUES}${dialogFields.replacer}`](dialogFields.itemValue);
               }
               setReadonly(name, false);
               break;
           }
           self.doWdtDialogPopup = true;
           return newProp;
         }
 
         function displayAndProcessWdtDialog(result, fromFieldChange) {
           if (CoreUtils.isNotUndefinedNorNull(result.html)) {
             self.wdtOptionsDialogHTML({view: HtmlUtils.stringToNodeArray(result.html), data: self});
             self.dialogFields(result.fields);
             self.i18n.dialog.title(result.title);
             self.buttonSelected(result.fields.showButtonSelected);
             const ignoreReturn = result.fields.displayClass === 'oj-text-area';
             self.wdtForm.showWdtOptionsDialog(fromFieldChange, ignoreReturn)
                 .then(reply => {
                   if (reply) {
                     if (self.dialogFields().disabled === true) {
                       //this is a read only field, don't do anything.
                       return;
                     }
                     const newProp = updateFields(self.wdtForm.processWDTOptionsDialogFields(self.dialogFields()));
                     if (CoreUtils.isNotUndefinedNorNull(newProp)){
                       updatePropertyList(self.rdjData.modelTokens, newProp.name, newProp.value);
                     }
                     if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
                       onBlurFormLayout({target: {id: self.dialogFields().id, type: 'blur', cancelable: false, cancelBubble: true}});
                     }
                   }
                   else {
                     //since WKT has auto-save, we can forget all changes in the wdt dialog as user hits cancel.
                     if (self.dialogFields().wktTool === 'true'){
                       const ov = self.dialogFields().originalValue;
                       if (typeof ov ==='string' && ov.startsWith('@@PROP:') && ov.endsWith('@@')){
                         let field = document.getElementById(self.dialogFields().id);
                         if (CoreUtils.isNotUndefinedNorNull(field)) {
                           field.readonly = true;
                         }
                       }
                       return;
                     }
                     if (self.dialogFields().disabled === true) {
                       //this is a read only field, don't do anything.
                       return;
                     }
                     const id = self.dialogFields().id;
                     const valueSet = (self[`${PageDefinitionCommon.FIELD_VALUE_SET}${id}`] ? self[`${PageDefinitionCommon.FIELD_VALUE_SET}${id}`]() : false);
                     if (valueSet === false){
                       return;
                     }
                     //for WRC, auto-save is not enabled. we need to ensure gets back to before the user
                     //brings up the WDT dialog.
                     const dialogFields = self.wdtForm.processWDTOptionsDialogFields(self.dialogFields());
                     self.buttonSelected(dialogFields.originalValueFrom);
                     switch (dialogFields.displayClass) {
                       case 'oj-switch':
                         dialogFields.itemValue = dialogFields.originalValue;
                         dialogFields.variableName = dialogFields.originalValue;
                         break;
                       case 'oj-input-text':
                       case 'oj-input-password':
                       case 'oj-text-area':
                         dialogFields.variableName = dialogFields.originalValue;
                         break;
                       case 'oj-select-single':
                       case 'oj-combobox-one':
                         switch (dialogFields.originalValueFrom) {
                           case 'fromModelToken':
                             dialogFields.variableName = dialogFields.originalValue;
                             break;
                           case 'fromRegValue':
                             dialogFields.selectedValue = dialogFields.originalValue;
                             break;
                           case 'fromUnresolvedReference':
                             dialogFields.unresolvedValue = dialogFields.originalValue;
                             break;
                         }
                         break;
                       case 'cfe-multi-select':
                         //we don't need to do anything to the multi select
                         return;
                       default:
                         dialogFields.variableName = dialogFields.originalValue;
                     }
                     updateFields(dialogFields);
                   }
                 });
           }
         }
 
         this.wdtOptionsIconClickListener = function (event) {
           const name = event.currentTarget.attributes['data-id'].value;
           let valueSet, curValue, valueFrom, replacer, disabled;
           if (isWizardForm()) {
             replacer = self.createForm.getBackingDataAttributeReplacer(name);
           }
           if (typeof replacer === 'undefined') replacer = name;
 
           let chosenItemsArray;
           if (event.currentTarget.attributes['data-displayClass'].value !== 'cfe-multi-select') {
             curValue = (self[`${PageDefinitionCommon.FIELD_VALUES}${replacer}`] ? self[`${PageDefinitionCommon.FIELD_VALUES}${replacer}`]() : undefined);
             valueSet = (self[`${PageDefinitionCommon.FIELD_VALUE_SET}${replacer}`] ? self[`${PageDefinitionCommon.FIELD_VALUE_SET}${replacer}`]() : undefined);
             valueFrom = (self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${replacer}`] ? self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${replacer}`]() : undefined);
             if (CoreUtils.isNotUndefinedNorNull(self[`${PageDefinitionCommon.FIELD_DISABLED}${replacer}`])){
               disabled = (self[`${PageDefinitionCommon.FIELD_DISABLED}${replacer}`]() === true);
             }
             else {
               disabled = false;
             }
           }else {
             chosenItemsArray = document.getElementById(name).chosenItems;
             curValue = (self[`${PageDefinitionCommon.FIELD_VALUES}${replacer}`] ? self[`${PageDefinitionCommon.FIELD_VALUES}${replacer}`]() : undefined);
             valueFrom = (self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${replacer}`] ? self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${replacer}`]() : undefined);
           }
 
           const pageProp = hasPagePropVariables();
           const targetInfo = {
             iconLink: event.currentTarget,
             curValue: curValue,
             valueSet: valueSet,
             valueFrom: valueFrom,
             disabled: disabled,
             supportsPropSelect : pageProp.supportsPropSelect,
             supportsPropCreate :  pageProp.supportsPropCreate,
             pagePropVariables : pageProp.pagePropVariables,
             chosenItemsArray: chosenItemsArray,
             onValueUpdated: onValueUpdatedTokenName,
             onValueWKTVariable: onValueWKTVariableUpdated
           };
           const result = self.wdtForm.createWdtOptionsDialog(targetInfo);
           displayAndProcessWdtDialog(result, false);
         };
 
         this.sectionExpanderClickHandler = function (event) {
           PageDefinitionFormLayouts.handleSectionExpanderClicked(event);
         };
 
         this.helpIconClick = function (event) {
           new HelpForm(
               viewParams.parentRouter.data.pdjData(),
               viewParams.parentRouter.data.rdjData(),
               viewParams.perspective
           ).handleHelpIconClicked(event);
         };

         this.chosenItemsChanged = function (event) {
           const fieldName = event.currentTarget.id;
           const fieldValue = event.detail.value;
           let values = [];
           for (let i = 0; i < fieldValue.length; i++) {
             values.push(JSON.parse(fieldValue[i].value));
           }
           if (isWizardForm()) {
             let replacer = self.createForm.getBackingDataAttributeReplacer(fieldName);
             if (typeof replacer === 'undefined') replacer = fieldName;
             if (typeof self[PageDefinitionCommon.FIELD_VALUES + replacer] === 'undefined') {
               self[PageDefinitionCommon.FIELD_VALUES + replacer] = ko.observable();
               self.dirtyFields.add(fieldName);
             }
             createFieldValueSubscription(self.valueSubscriptions, fieldName, replacer);
             self[PageDefinitionCommon.FIELD_VALUES + replacer](values);
           }
           else if (CoreUtils.isNotUndefinedNorNull(self.createForm) && self.createForm.hasDeploymentPathData()) {
             if (typeof self[`${PageDefinitionCommon.FIELD_VALUES}${fieldName}`] === 'undefined') {
               self[`${PageDefinitionCommon.FIELD_VALUES}${fieldName}`] = ko.observable();
               self.dirtyFields.add(fieldName);
             }
             self[`${PageDefinitionCommon.FIELD_VALUES}${fieldName}`](values);
           }
           const availableItems = self.multiSelectControls[fieldName].availableItems.concat(self.multiSelectControls[fieldName].chosenItems);
           const result = PageDefinitionFields.createMultiSelectControlItem(availableItems, fieldValue);
           self.multiSelectControls[fieldName].availableItems = result.availableItems;
           self.multiSelectControls[fieldName].chosenItems = result.chosenItems;
 
           if (!isWizardForm()) {
             const result = PageDefinitionFields.getMultiSelectChosenItems(
                 self.multiSelectControls[fieldName].chosenItems,
                 self.multiSelectControls[fieldName].origChosenLabels
             );
             resetSaveButtonDisabledState({disabled: false});
             viewParams.signaling.unsavedChangesDetected.dispatch(exitForm);
             if (isEditing()) {
               if (!self.dirtyFields.has(fieldName)) {
                 self.dirtyFields.add(fieldName);
                 if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
                   onBlurFormLayout({target: {id: fieldName, type: 'blur', cancelable: false, cancelBubble: true}});
                 }
               }
             }
           }
         };

         this.checkedRowsChanged = (event) => {
           function addCheckedRow(rowKey) {
             if (!self.declarativeActions.checkedRows.has(rowKey)) {
               self.declarativeActions.checkedRows.add(rowKey);
             }
           }

           function addAllCheckedRow(data, fieldName) {
             for (let index = 0; index < data.length; index++) {
               const rowKey = data[index][fieldName];
               if (CoreUtils.isNotUndefinedNorNull(rowKey)) {
                 self.declarativeActions.checkedRows.add(rowKey);
               }
             }
           }

           function excludeUncheckedRows(excludedKeys, data, fieldName) {
             for (let index = 0; index < data.length; index++) {
               const rowKey = data[index][fieldName];
               if (CoreUtils.isNotUndefinedNorNull(rowKey) && !excludedKeys.includes(rowKey)) {
                 self.declarativeActions.checkedRows.add(rowKey);
               }
             }
           }

           function getRowKey(index, fieldName) {
             return event.currentTarget.data.data[index][fieldName];
           }

           function getRowKeys(event, fieldName) {
             let rowKeys = [];
             if (CoreUtils.isNotUndefinedNorNull(self.selectedRows().row.keys.keys)) {
               for (const rowIndex of Array.from(self.selectedRows().row.keys.keys)) {
                 const row = event.currentTarget.data.data[rowIndex];
                 if (CoreUtils.isNotUndefinedNorNull(row)) {
                   rowKeys.push(row[fieldName]);
                 }
               }
             }
             return rowKeys;
           }

           self.declarativeActions.checkedRows.clear();

           if (CoreUtils.isNotUndefinedNorNull(self.declarativeActions.rowSelectionProperty)) {
              const fieldName = `_${self.declarativeActions.rowSelectionProperty}`;
             if (event.detail.value.row.isAddAll()) {
               const excludedKeys = [];
               const iterator = event.detail.value.row.deletedValues();
               iterator.forEach((key) => {
                 const rowKey = getRowKey(key, fieldName);
                 excludedKeys.push(rowKey);
               });
               if (excludedKeys.length > 0) {
                 excludeUncheckedRows(excludedKeys, event.currentTarget.data.data, fieldName);
               }
               else {
                 addAllCheckedRow(event.currentTarget.data.data, fieldName);
               }
             }
             else {
               const row = event.detail.value.row;
               if (row.values().size > 0) {
                 row.values().forEach(function (key) {
                   const rowKey = getRowKey(key, fieldName);
                   addCheckedRow(rowKey);
                 });
               }
             }
           }

           refreshActionsDisabledStates();
         };

         this.checkedRowsChanged2 = (event) => {
           function removeUncheckedRow(rowKey) {
             if (self.declarativeActions.checkedRows.has(rowKey)) {
               self.declarativeActions.checkedRows.delete(rowKey);
             }
           }

           function addCheckedRow(rowKey) {
             if (!self.declarativeActions.checkedRows.has(rowKey)) {
               self.declarativeActions.checkedRows.add(rowKey);
             }
           }

           function addAllCheckedRow(data, fieldName) {
             for (let index = 0; index < data.length; index++) {
               const rowKey = data[index][fieldName];
               if (CoreUtils.isNotUndefinedNorNull(rowKey)) {
                 self.declarativeActions.checkedRows.add(rowKey);
               }
             }
           }

           function handleUnselectAll(event, fieldName) {
             const rowKey = getRowKey(event, fieldName);

             if (CoreUtils.isNotUndefinedNorNull(rowKey)) {
               const rowIndex = event.currentTarget.currentRow.rowIndex;
               if (event.detail.value.row.keys.keys.size === 1) {
                 self.declarativeActions.checkedRows.clear();
                 addCheckedRow(rowKey);
               }
               else if (event.detail.previousValue.row.keys.keys.has(rowIndex)) {
                 removeUncheckedRow(rowKey);
               }
               else if (event.detail.value.row.keys.keys.has(rowIndex)) {
                 addCheckedRow(rowKey);
               }
             }
           }

           function getFieldName(event) {
             let fieldName;
             let filtered = event.currentTarget.data.data.filter(item => item._identity);
             if (filtered.length > 0) {
               fieldName = '_identity';
             }
             else {
               filtered = event.currentTarget.data.data.filter(item => item._identifier);
               if (filtered.length > 0) {
                 fieldName = '_identifier';
               }
             }
             return fieldName;
           }

           function getRowKey(event, fieldName) {
             const index = event.currentTarget.currentRow.rowIndex;
             return event.currentTarget.data.data[index][fieldName];
           }

           function getRowKeys(event, fieldName) {
             let rowKeys = [];
             if (CoreUtils.isNotUndefinedNorNull(self.selectedRows().row.keys.keys)) {
               for (const rowIndex of Array.from(self.selectedRows().row.keys.keys)) {
                 const row = event.currentTarget.data.data[rowIndex];
                 if (CoreUtils.isNotUndefinedNorNull(row)) {
                   rowKeys.push(row[fieldName]);
                 }
               }
             }
             return rowKeys;
           }

           const fieldName = getFieldName(event);

           if (CoreUtils.isUndefinedOrNull(fieldName)) {
             self.declarativeActions.checkedRows.clear();
           }
           else if (event.currentTarget.currentRow === null) {
             // This means the user either did a "selectAll" or
             // "unselectAll", using the selector in the column
             // header.
             if (event.detail.previousValue.row.keys.all &&
                 event.detail.previousValue.row.keys.deletedKeys.size === 0
             ) {
               self.declarativeActions.checkedRows.clear();
             }
             else if (!event.detail.previousValue.row.keys.all &&
                 event.detail.previousValue.row.keys.keys.size > 0
             ) {
               // This means user did an "unselect all"
               self.declarativeActions.checkedRows.clear();
             }

             if (event.detail.value.row.keys.all &&
                 event.detail.value.row.keys.deletedKeys.size === 0
             ) {
               // This means user did a "select all"
               self.declarativeActions.checkedRows.clear();
               addAllCheckedRow(event.currentTarget.data.data, fieldName);
             }
           }
           else if (event.detail.previousValue.row.keys.all) {
             handleUnselectAll(event, fieldName);
           }
           else {
             if (event.detail.previousValue.row.keys.keys.size > 0 &&
                 event.detail.value.row.keys.keys.size === 0
             ) {
               const rowKey = getRowKey(event, fieldName);
               if (CoreUtils.isNotUndefinedNorNull(rowKey)) removeUncheckedRow(rowKey);
             }
             if (event.detail.value.row.keys.keys.size > 0 &&
                 event.detail.previousValue.row.keys.keys.size === 0
             ) {
               const rowKey = getRowKey(event, fieldName);
               if (CoreUtils.isNotUndefinedNorNull(rowKey)) addCheckedRow(rowKey);
             }
             if (event.detail.previousValue.row.keys.keys.size > 0 &&
                 event.detail.value.row.keys.keys.size > 0
             ) {
               handleUnselectAll(event, fieldName);
             }
           }

           refreshActionsDisabledStates();
         };
 
         this.debugFlagsValueChanged = function (event) {
           if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
             const dataPayload = PageDefinitionFields.getDebugFlagItems(self.debugFlagItems(), self.debugFlagsEnabled());
             viewParams.signaling.unsavedChangesDetected.dispatch(exitForm);
             resetSaveButtonDisabledState({disabled: false});
           }
           else {
             const hasDebugFlag = (self.debugFlagsEnabled().includes(event.detail.value[0]) || self.debugFlagsEnabled().includes(event.detail.previousValue[0]));
             if (isEditing() && hasDebugFlag){
               self.debugFlagEvent = true;
               updateContentFile('autoDownload')
                   .then(reply => {
                     self.debugFlagEvent = false;
                   });
             }
           }
         };
 
         this.launchFileChooserMenu = function(event) {
           event.preventDefault();
           document.getElementById(`${event.currentTarget.attributes['data-input'].value}Menu`).open(event);
         };
 
         this.fileChooserMenuClickListener = function(event) {
           if (window.api && window.api.ipc) {
             const menuValue = event.target.value;
             const name = event.currentTarget.attributes['data-input'].value;
             const path = self.rdjData.navigation;
             const entryType = setArchiveEntryType(name, menuValue, path);
             const selector = $(`#${name}`);
             let initialValue = selector.attr('data-initial-value');
             if (initialValue === 'null') initialValue = null;
             const label = selector.attr('data-label');
             const fieldValue = self[`${PageDefinitionCommon.FIELD_VALUES}${name}`]();
             updateModelArchiveEntry(label, name, initialValue, fieldValue, entryType, true, false)
                 .then(succeeded => {
                   if (!succeeded) {
                     selector.focus();
                   }
                 });
           }
         };
 
         this.chooseFileClickHandler = function (event) {
           if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
             const chooser = $('#file-chooser');
             chooser.on('change', self.chooseFileChangeHandler);
             chooser.trigger('click');
             chooser.attr('data-input', event.currentTarget.attributes['data-input'].value);
             event.preventDefault();
           }
         };
 
         this.clearChosenFileClickHandler = function (event) {
           // Only update state as the eraser icon only appears on a create form
           const name = event.currentTarget.attributes['data-input'].value;
           self[`${PageDefinitionCommon.FIELD_VALUES}${name}`](null);
           if (CoreUtils.isNotUndefinedNorNull(self.createForm)) {
             self.createForm.backingDataAttributeValueChanged(name, null);
             self.createForm.clearUploadedFile(name);
           }
         };
 
         this.chooseFileChangeHandler = function (event) {
           const files = event.currentTarget.files;
           if (files.length > 0) {
             const name = event.currentTarget.attributes['data-input'].value;
             const fileName = files[0].name;
             const fileExt = '.' + fileName.split('.').pop();
 
             self[`${PageDefinitionCommon.FIELD_VALUES}${name}`](fileName);
             self.createForm.addUploadedFile(name, files[0]);
 
             const chooser = $('#file-chooser');
             chooser.off('change', self.chooseFileChangeHandler);
             chooser.val('');
           }
         };
 
         this.determineChanges = function (doCache) {
           function combinePayloads(...args) {
             let payload = {};
             for (const p of args) {
               if ((p !== null) && (Object.keys(p).length !== 0)) {
                 for (const [key, value] of Object.entries(p)) {
                   payload[key] = value;
                 }
               }
             }
             return payload;
           }
 
           function getMultiSelectsPayload() {
             let results = {};
             for (const domElementId of Object.keys(self.multiSelectControls)) {
               const chosenItems = self.multiSelectControls[domElementId].chosenItems;
               const origChosenLabels = self.multiSelectControls[domElementId].origChosenLabels;
               const result = PageDefinitionFields.getMultiSelectChosenItems(chosenItems, origChosenLabels);
               if (Object.keys(result.data).length > 0) results[domElementId] = result.data;
               self.multiSelectControls[domElementId].savedChosenLabels = result.chosenLabels;
             }
             return results;
           }
 
           function getPropertyListEditorPayload() {
             let results = {};
             if (self.propertyListName !== null) {
               const controlElement = document.getElementById(self.propertyListName);
               if (controlElement !== null) {
                 const changeResults = controlElement.getPropertyListChangeResults();
                 const obj = changeResults.values;
                 if (Object.keys(obj).length > 0) {
                   results[self.propertyListName] = {value: obj};
                 }
                 else if (changeResults.isEmpty && self.dirtyFields.has(self.propertyListName)) {
                   if (viewParams.perspective.id !== 'properties'){
                     results[self.propertyListName] = {set: false};
                   }else{
                     results[self.propertyListName] = {value: {}};
                   }
                 }
               }
             }
             return results;
           }
 
           function getDebugPayload() {
             return PageDefinitionFields.getDebugFlagItems(self.debugFlagItems(), self.debugFlagsEnabled());
           }
 
           let dataPayload = {};
 
           // Determine if this form is for a create or edit.
           const isEdit = isEditing();
           if (!isEdit) {
             const properties = getSliceProperties(self.pdjData);
             // Obtain the payload and flag that scrubData is needed for posting to the backend
             const results = getCreateFormPayload(properties, true);
             if (isWdtForm() && Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
               if (results.data.Source) {
                 results.data['SourcePath'] = results.data.Source;
                 delete results.data['Source'];
                 delete results.data['VerifySource'];
               }
               if (results.data.Plan) {
                 results.data['PlanPath'] = results.data.Plan;
                 delete results.data['Plan'];
                 delete results.data['VerifyPlan'];
               }
             }
 
             return results.data;
           }
 
           // Go through the properties on the form page when there are
           // dirty fields
           const dirtyPayload = getDirtyFieldsPayload();
           if (doCache) {
             cacheDataPayload(dirtyPayload);
           }
           dataPayload = combinePayloads(
               dirtyPayload,
               getMultiSelectsPayload(),
               getDebugPayload(),
               getPropertyListEditorPayload()
           );
 
           return dataPayload;
         };
 
         function resetAutoSyncToolbarIconsState() {
           self.formToolbarModuleConfig
             .then((moduleConfig) => {
               const state = (viewParams.perspective.id === 'monitoring');
               moduleConfig.viewModel.resetIconsVisibleState(state);
             });
         }
 
         function isShoppingCartVisible() {
           // The shopping cart will be visible expect for the WDT and properties perspectives...
           return (!['view','modeling', 'composite', 'properties'].includes(viewParams.perspective.id));
         }
 
         function isWdtForm() {
           // The same form is used for WDT model and Property List for uniform content file handling
           return (['modeling', 'properties'].includes(viewParams.perspective.id));
         }
 
         function needsWdtIcon(name, pdjTypes) {
           let rtnval = true;
           if (viewParams.perspective.id !== 'modeling' || pdjTypes.isPropertiesType(name)) {
             rtnval = false;
           }
           else if (pdjTypes.isBooleanType(name) && !pdjTypes.isSupportsModelTokens(name)) {
             //If the boolean doesn't supports model token, there is no use for popping up the wdt dialog, since it
             //will only shows the switch.
             rtnval = false;
           }
 
           return rtnval;
         }
 
         function hasPagePropVariables(){
           let result = {
             supportsPropSelect : false,
             supportsPropCreate : false,
             pagePropVariables : null
           };
           if (isWdtForm()){
             const modelTokens = self.rdjData.modelTokens;
             if (CoreUtils.isNotUndefinedNorNull(modelTokens)){
               if (CoreUtils.isNotUndefinedNorNull(modelTokens.options)){
                 result.supportsPropSelect = true;
                 result.pagePropVariables = new ArrayDataProvider(self.rdjData.modelTokens.options, { keyAttributes: 'value' });
               }
               if (CoreUtils.isNotUndefinedNorNull(modelTokens.optionsSources)) {
                 result.supportsPropCreate = true;
               }
             }
           }
           return result;
         }
 
         function onValueUpdatedTokenName(event) {
           Logger.log(`[FORM] value=${event.detail.value}, previousValue=${event.detail.previousValue}`);
           self.wdtForm.updateTokenValueSelection(event);
         }
 
         function onValueWKTVariableUpdated(event) {
           Logger.log(`[FORM] value=${event.detail.value}, previousValue=${event.detail.previousValue}`);
           const property = self.wdtForm.getModelPropertyBasedOnUid(event.detail.value);
           self.dialogFields().itemValue = property.Value;
           self.dialogFields().variableName = property.Name;
         }
 
         this.isSliceTable = (pdjData) => {
           return (CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable));
         }

         function isWizardForm() {
           let rtnval = false;
           if (self.pdjData !== null) {
             if (CoreUtils.isNotUndefinedNorNull(self.pdjData.createForm) && CoreUtils.isNotUndefinedNorNull(self?.createForm?.isWizard) && self?.createForm?.isWizard()) {
               rtnval = true;
             }
           }
           return rtnval;
         }
 
         function isDashboardFormLayout() {
           const rdjData = viewParams.parentRouter?.data?.rdjData();
           return rdjData?.navigation.startsWith('Dashboards');
         }

         function isReadOnlyFormLayout() {
           let rtnval = true;
           if (RouterData.hasPDJData(viewParams.parentRouter)) {
             const pdjData = viewParams.parentRouter.data.pdjData();
             rtnval = RouterData.isReadOnlySliceForm(pdjData);
           }
           return rtnval;
         }

         function isPolicyExpressionSliceLayout() {
           let rtnval = false;
           if (RouterData.hasPDJData(viewParams.parentRouter)) {
             const pdjData = viewParams.parentRouter.data.pdjData();
             if (RouterData.hasSliceFormSlices(pdjData) && RouterData.hasSliceFormProperties(pdjData)) {
               const filteredProperties = pdjData.sliceForm.properties.filter(property => property.type === 'entitleNetExpression');
               rtnval = (filteredProperties.length > 0);
             }
           }
           return rtnval;
         }
 
         function isPolicyAdvancedSliceWritableField(dataPayload) {
           let rtnval = false;
           if (CoreUtils.isNotUndefinedNorNull(dataPayload)) {
             const pdjData = viewParams.parentRouter.data.pdjData();
             const properties = pdjData?.sliceForm?.properties;
             if (CoreUtils.isNotUndefinedNorNull(properties)) {
               const fieldNames = Object.keys(dataPayload);
               for (const i in fieldNames) {
                 const property = properties.find(item => item.name === fieldNames[i] && (typeof item.readOnly === 'undefined'));
                 if (property) {
                   rtnval = true;
                   break;
                 }
               }
             }
           }
           return rtnval;
         }
 
         function fieldValueChanged(fieldName, fieldValue) {
           if (CoreUtils.isNotUndefinedNorNull(fieldName) &&
               CoreUtils.isNotUndefinedNorNull(fieldValue)
           ){
             self[`${PageDefinitionCommon.FIELD_VALUES}${fieldName}`](fieldValue);
           }
         }
 
         function policyEditorReset() {
           if (isPolicyExpressionSliceLayout()) {
             if (CoreUtils.isNotUndefinedNorNull(self.policyForm)) {
               self.policyForm.resetPolicyEditor(true);
               reloadRdjData();
             }
           }
         }
 
         function finishWizardForm() {
           if (isWizardForm()) {
             const pageState = self.createForm.markAsFinished();
             if (pageState.succeeded) {
               saveBean('finish');
             }
             else {
               setFocusFormElement();
             }
           }
         }
 
         function getCreateFormMode() {
           let rtnval = CreateForm.prototype.Mode.SCROLLING.name;
           if (CoreUtils.isNotUndefinedNorNull(self.createForm)) {
             rtnval = self.createForm.getMode().name;
           }
           return rtnval;
         }
 
         /**
          * Returns whether fields on the form have been changed
          * @returns {boolean}
          */
         this.isDirty = function () {
           let dataPayload = this.determineChanges(true);
           if (dataPayload === null) dataPayload = {};
           const numberOfChanges = Object.keys(dataPayload).length;
 
           return (numberOfChanges !== 0);
         };
 
         function isEditing() {
           return (CoreUtils.isNotUndefinedNorNull(self.pdjData) && (CoreUtils.isNotUndefinedNorNull(self.pdjData.sliceForm) || CoreUtils.isNotUndefinedNorNull(self.pdjData.sliceTable)));
         }
 
         /**
          *
          * <p>Only invoked from form-tabstrip,js, and only when slices are clicked.</pp>
          * @param {string} sliceName
          * @returns {"exit"|"autoSave"|"autoDownload"} - Returns event type that that should be passed to ``canExit()``
          */
         function autoSaveForm(sliceName) {
           let exitFormEventType = 'exit';
           if (isWdtForm()) {
             if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
               exitFormEventType = 'autoDownload';
             }
             else {
               exitFormEventType = 'autoSave';
             }
           }
           return exitFormEventType;
         }
 
         /**
          * Wrapper function for assigning to ``viewParams`` of embedded V-VMs (i.e. form-toolbar, form-tabstrip)
          * <p>Only invoked from form-tabstrip,js, and only when slices are clicked.</pp>
          * @param {"exit"|"autoSave"|"autoDownload"} eventType - The type of event that will be performed, if ``true`` is returned
          * @param {{dialogMessage: {name: string}}} [options]
          * @returns {Promise<boolean>}
          * @see FormViewModel#canExit
          */
         function exitForm(eventType, options) {
           return self.canExit(eventType, options);
         }
 
         /**
          * Returns whether it is okay to exit the form, or not
          * @param {"exit"|"cancel"|"autoSave"|"autoDownload"|"download"|"delete"} eventType
          * @param {{dialogMessage: {name: string}}} [options]
          * @returns {Promise<boolean>}
          */
         this.canExit = function (eventType, options) {
           return new Promise(function (resolve) {
             self.formTabStripModuleConfig
                 .then((moduleConfig) => {
                   const isEdit = isEditing();
 
                   if (['autoSave', 'navigation'].includes(eventType)) {
                     if (isEdit) {
                       const cancelSliceChange = moduleConfig.viewModel.getCancelSliceChange();
                       if (!cancelSliceChange) {
                         updateContentFile(eventType)
                           .then((result) => {
                             resolve(result);
                           });
                       }
                       else {
                         resolve(true);
                       }
                     }
                     else {
                       resolve(true);
                     }
                   }
                   else if (['download', 'autoDownload'].includes(eventType)) {
                     if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
                       if (!isEdit && CoreUtils.isNotUndefinedNorNull(self.createForm)) {
                         setFocusFormElement();
                         MessageDisplaying.displayMessage({
                           severity: 'info',
                           summary: oj.Translations.getTranslatedString('wrc-form.messages.action.notAllowed.summary'),
                           detail: oj.Translations.getTranslatedString('wrc-form.messages.action.notAllowed.detail')
                         }, 1500);
                         resolve(null);
                       }
                       else if (eventType === 'download') {
                         self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-unsaved-changes.titles.changesNeedDownloading.value'));
                         self.i18n.dialog.prompt(oj.Translations.getTranslatedString('wrc-unsaved-changes.prompts.unsavedChanges.needDownloading.value', '{0}').replace('{0}', options.dialogMessage.name));
                         self.i18n.buttons.cancel.visible(true);
                         UnsavedChangesDialog.showConfirmDialog('ChangesNotDownloaded', self.i18n)
                           .then(reply => {
                             switch(reply.exitButton) {
                               case 'yes':
                                 downloadContentFile(eventType);
                                 resolve(true);
                                 break;
                               case 'no':
                                 resolve(false);
                                 break;
                               case 'cancel':
                                 resolve(null);
                                 break;
                             }
                           });
                       }
                       else {
                         resolve(true);
                       }
                     }
                     else {
                       resolve(true);
                     }
                   }
                   else if (['edit', 'deactivate', 'delete'].includes(eventType)) {
                     if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
                       if (!isEdit && CoreUtils.isNotUndefinedNorNull(self.createForm)) {
                         setFocusFormElement();
                         MessageDisplaying.displayMessage({
                           severity: 'info',
                           summary: oj.Translations.getTranslatedString('wrc-form.messages.action.notAllowed.summary'),
                           detail: oj.Translations.getTranslatedString('wrc-form.messages.action.notAllowed.detail')
                         }, 1500);
                         resolve(null);
                       }
                       else if (['configuration', 'security'].includes(viewParams.perspective.id)) {
                         decideUnsavedChangesDetectedAction(eventType)
                             .then(reply => {
                               resolve(reply);
                             });
                       }
                       else {
                         self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-unsaved-changes.titles.changesNeedDownloading.value'));
                         self.i18n.dialog.prompt(oj.Translations.getTranslatedString('wrc-unsaved-changes.prompts.unsavedChanges.needDownloading.value', '{0}').replace('{0}', options.dialogMessage.name));
                         self.i18n.buttons.cancel.visible(true);
                         UnsavedChangesDialog.showConfirmDialog('ChangesNotDownloaded', self.i18n)
                             .then(reply => {
                               switch (reply.exitButton) {
                                 case 'yes':
                                   downloadContentFile(eventType);
                                   resolve(true);
                                   break;
                                 case 'no':
                                   resolve(false);
                                   break;
                                 case 'cancel':
                                   resolve(null);
                                   break;
                               }
                             });
                       }
                     }
                     else {
                       resolve(true);
                     }
                   }
                   else if (eventType === 'exit') {
                     if (!isEdit && CoreUtils.isNotUndefinedNorNull(self.createForm)) {
                       setFocusFormElement();
                       MessageDisplaying.displayMessage({
                         severity: 'info',
                         summary: oj.Translations.getTranslatedString('wrc-form.messages.action.notAllowed.summary'),
                         detail: oj.Translations.getTranslatedString('wrc-form.messages.action.notAllowed.detail')
                       }, 3000);
                       resolve(false);
                     }
                     else if (self.isDirty()) {
                       const cancelSliceChange = moduleConfig.viewModel.getCancelSliceChange();
                       if (!cancelSliceChange) {
                         if (isWdtForm()) {
                           updateContentFile(eventType)
                               .then((result) => {
                                 resolve(result);
                               });
                         }
                         else {
                           decideUnsavedChangesDetectedAction()
                               .then(reply => {
                                 if (ViewModelUtils.isElectronApiAvailable() &&
                                     ['configuration', 'security'].includes(viewParams.perspective.id)) {
                                   notifyUnsavedChanges(!reply);
                                 }
                                 if (reply) {
                                   clearFormChanges();
                                   resolve(reply);
                                 }
                                 else {
                                   // clear treenav selection in case that caused the exit
                                   viewParams.signaling.navtreeSelectionCleared.dispatch();
                                   resolve(reply);
                                 }
                               });
                         }
                       }
                       else {
                         resolve(true);
                       }
                     }
                     else {
                       resolve(true);
                     }
                   }
                   else {
                     resolve(true);
                   }
 
                 });
           });
 
         };
 
 
         function notifyUnsavedChanges(state) {
           if (ViewModelUtils.isElectronApiAvailable()) {
             window.electron_api.ipc.invoke('unsaved-changes', state)
                 .then()
                 .catch(response => {
                   ViewModelUtils.failureResponseDefaultHandling(response);
                 });
           }
         }
 
 
         function getDirtyFieldsPayload(keepSaveToOrig) {
           const data = self.rdjData.data;
           let dataPayload = {};
 
           if (self.dirtyFields.size > 0) {
             const properties = getSliceProperties(self.pdjData, true);
             const pdjTypes = new PageDataTypes(properties, viewParams.perspective.id);
             if (isWdtForm()) self.wdtForm.setPdjTypes(pdjTypes);
 
             //loop through all of the dirtyFields
             for (let key of self.dirtyFields) {
 
               if (CoreUtils.isUndefinedOrNull(self[`${PageDefinitionCommon.FIELD_DISABLED}${key}`])
                   || CoreUtils.isUndefinedOrNull(self[`${PageDefinitionCommon.FIELD_UNSET}${key}`])) {
                 continue;
               }
 
               // do not include disabled fields in the values that are returned
               if ((self[`${PageDefinitionCommon.FIELD_DISABLED}${key}`]() === true)
                   && (self[`${PageDefinitionCommon.FIELD_UNSET}${key}`]() !== true))
                 continue;
 
               // Unset the property by marking the field as not set in the payload
               if (self[`${PageDefinitionCommon.FIELD_UNSET}${key}`]() === true) {
                 dataPayload[key] = {set: false};
                 continue;
               }
 
               const fieldObv = self[`${PageDefinitionCommon.FIELD_VALUES}${key}`];
 
               if (typeof fieldObv !== 'undefined') {
                 const fieldValue = fieldObv();
                 if (isWdtForm()) {
                   // Obtain the updated value and the original value
                   // If it's a model token, the value returned will be null;
                   const fromValue = self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${key}`]();
                   let value = {};
                   if(pdjTypes.isMultiSelectType(key)){
                     value = pdjTypes.getConvertedObservableValue_WDT_Multi(fieldValue, fromValue);
                   } else {
                     value = pdjTypes.getConvertedObservableValue_WDT(key, fieldValue, fromValue);
                   }
                   let serverValue = pdjTypes.getObservableValue_WDT(key, data[key], null);
                   const serverValueFrom = pdjTypes.getObservableValueFrom(data[key]);
 
                   // Convert and compare values to determine if a change has actually occurred
                   if (serverValueFrom === 'fromModelToken') {
                     serverValue = {modelToken: serverValue};
                   }
                   else if (serverValueFrom === 'fromUnresolvedReference') {
                     serverValue = {label: serverValueFrom, unresolvedReference: serverValue};
                   }
 
                   const strValue = JSON.stringify(value);
                   const strServerValue = JSON.stringify(serverValue);
 
                   // compare values to determine if a change has actually occurred
                   if (strServerValue !== strValue) {
                     // Set the new value into the payload where the value
                     // from the UI was converted based on the PDJ type...
                     dataPayload[key] = (fromValue === 'fromModelToken') ? value : {value: value};
 
                     // Convert any WDT string values that are null to an empty string
                     // WDT validation does not accept bean attribs specified as null
                     if (pdjTypes.isStringType(key) && !pdjTypes.isArray(key) && (dataPayload[key].value !== undefined)) {
                       const payloadValue = dataPayload[key].value;
                       dataPayload[key].value = (payloadValue === null) ? '' : payloadValue;
                     }
                   }
                   else {
                     // The field was updated then set back to the server value
                     // thus clear the property from being marked as dirty...
                     self.dirtyFields.delete(key);
                     if (CoreUtils.isNotUndefinedNorNull(keepSaveToOrig)) {
                       dataPayload[key] = (fromValue === 'fromModelToken') ?
                           value : {value: value};
                     }
                   }
                 }
                 else {
                   // Obtain the updated value and the original value
                   const value = pdjTypes.getConvertedObservableValue(key, fieldValue);
                   const serverValue = pdjTypes.getObservableValue(key, data[key], null);
 
                   // Convert and compare values to determine if a change has actually occurred!
                   const strValue = JSON.stringify(value);
                   const strServerValue = JSON.stringify(serverValue);
                   if (strServerValue !== strValue) {
                     // Set the new value into the payload where the value
                     // from the UI was converted based on the PDJ type...
                     dataPayload[key] = {value: value};
                   } else {
                     // The field was updated then set back to the server value
                     // thus clear the property from being marked as dirty...
                     self.dirtyFields.delete(key);
                     if (CoreUtils.isNotUndefinedNorNull(keepSaveToOrig)) {
                       dataPayload[key] = {value: value};
                     }
                   }
                 }
               }
             } //end of dirtyFields loop
           }
 
           return dataPayload;
         }
 
         function cacheDataPayload(dataPayload) {
           if ((dataPayload !== null) && (Object.keys(dataPayload).length !== 0)) {
             for (const [key, value] of Object.entries(dataPayload)) {
               self.pageRedoHistory[key] = value;
             }
           }
         }
 
         function restoreDirtyFieldsValues() {
           if (Object.keys(self.pageRedoHistory).length !== 0) {
             const properties = getSliceProperties(self.pdjData, true);
             const pdjTypes = new PageDataTypes(properties, viewParams.perspective.id);
             if (isWdtForm()) self.wdtForm.setPdjTypes(pdjTypes);
             for (const [key, value] of Object.entries(self.pageRedoHistory)) {
               Logger.log(`[FORM] restore: key=${key}, value=${JSON.stringify(value)}`);
 
               // Restoring of dirty fields that are unset will
               // happen when the document is ready!
               if (CoreUtils.isNotUndefinedNorNull(value.set)) {
                 Logger.log(`[FORM] restore: skip unset ${key}`);
                 continue;
               }
 
               let displayValue = pdjTypes.getDisplayValue(key, self.rdjData.data[key], value);
 
               if (displayValue == null) {
                 displayValue = '';
               }
 
               if (isWdtForm()) {
                 const obsValue = pdjTypes.getObservableValue_WDT(key, self.rdjData.data[key], displayValue, value);
                 self.doWdtDialogPopup = false;
                 self[`${PageDefinitionCommon.FIELD_VALUES}${key}`](obsValue);
                 self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${key}`](self.wdtForm.calValueFrom(key, obsValue));
                 self.doWdtDialogPopup = true;
                 if (pdjTypes.getPDJType(key).type === 'boolean') {
                   if (self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${key}`]() === 'fromRegValue') {
                     document.getElementById('extraField_' + key).style.display = 'none';
                     document.getElementById('baseField_' + key).style.display = 'inline-flex';
                   }
                   else {
                     document.getElementById('extraField_' + key).style.display = 'inline-flex';
                     document.getElementById('baseField_' + key).style.display = 'none';
                   }
                 }
               }
               else {
                 const obsValue = pdjTypes.getObservableValue(key, self.rdjData.data[key], displayValue, value);
                 self[`${PageDefinitionCommon.FIELD_VALUES}${key}`](obsValue);
               }
             }
           }
         }
 
         function resetPageRedoHistory() {
           self.pageRedoHistory = {};
         }
 
         function getToolbarRenderingInfo(eventType) {
           return new Promise(function (resolve) {
             let path = decodeURIComponent(viewParams.parentRouter.data.rawPath());
             path = PageDefinitionUtils.removeTrailingSlashes(path);
             const kind = (CoreUtils.isNotUndefinedNorNull(self.rdjData) && CoreUtils.isNotUndefinedNorNull(self.rdjData.self) && CoreUtils.isNotUndefinedNorNull(self.rdjData.self.kind) ? self.rdjData.self.kind : undefined);
             let formDataExists = false;
             let mode = (CoreUtils.isNotUndefinedNorNull(self.pdjData) && (CoreUtils.isNotUndefinedNorNull(self.pdjData.sliceForm) || CoreUtils.isNotUndefinedNorNull(self.pdjData.sliceTable)) ? 'save' : 'create');
             if (CoreUtils.isNotUndefinedNorNull(path)) {
               switch (eventType) {
                 case 'sync':
                 case 'create':
                 case 'update':
                   formDataExists = (CoreUtils.isNotUndefinedNorNull(self.rdjData) && CoreUtils.isNotUndefinedNorNull(self.rdjData.data));
                   break;
               }
               resolve({mode: mode, kind: kind, path: path, formDataExists: formDataExists});
             }
             else {
               resolve({mode: mode, kind: kind, path: path, formDataExists: formDataExists});
             }
           });
         }
 
         function getDeclarativeActions() {
           return self.declarativeActions;
         }
 
         function viewShoppingCart() {
           viewParams.onShoppingCartViewed();
         }
 
         function discardShoppingCart(toolbarButton) {
           // Only perform if we're in "configuration" perspective
           if (viewParams.perspective.id === 'configuration') {
 
             const treeaction = {
               clearTree: true,
               path: decodeURIComponent(viewParams.parentRouter.data.rawPath())
             };
 
             // fix the navtree
             viewParams.signaling.navtreeUpdated.dispatch(treeaction);
 
             if (!isWizardForm()) {
               renderPageData(toolbarButton);
             }
           }
         }
 
         function resetSaveButtonDisabledState(state) {
           self.formToolbarModuleConfig
             .then((moduleConfig) => {
               moduleConfig.viewModel.resetButtonsDisabledState([
                 {id: 'save', disabled: state.disabled}
               ]);
             });
         }
 
         function captureSyncInterval(currentValue) {
           return SetSyncIntervalDialog.showSetSyncIntervalDialog(currentValue, self.i18n)
             .then(result => {
               setSyncInterval(parseInt(result.interval));
               return Promise.resolve(result);
             });
         }
 
         function setSyncInterval(syncInterval) {
           if (!isWizardForm()) {
             // Cancel any timer and reload page when timer was not running.
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
         }
 
         function cancelSyncTimer() {
           let cancelled = false;
           if (CoreUtils.isNotUndefinedNorNull(self.syncTimerId)) {
             clearInterval(self.syncTimerId);
             self.syncTimerId = undefined;
             cancelled = true;
           }
           return cancelled;
         }
 
         function cancelAutoSync() {
           cancelSyncTimer();
           self.formToolbarModuleConfig
             .then(moduleConfig => {
               moduleConfig.viewModel.cancelAutoSync();
             });
         }
         
         async function isAutoSyncRunning() {
           const moduleConfig = await self.formToolbarModuleConfig;
           return moduleConfig.viewModel.autoSyncEnabled();
         }
         
         function decideUnsavedChangesDetectedAction(eventType = 'exit') {
           self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-unsaved-changes.titles.unsavedChanges.value'));
           self.i18n.dialog.prompt(oj.Translations.getTranslatedString('wrc-unsaved-changes.prompts.unsavedChanges.areYouSure.value', '{0}').replace('{0}', eventType));
           self.i18n.buttons.cancel.visible(true);
           return UnsavedChangesDialog.showConfirmDialog('UnsavedChangesDetected', self.i18n);
         }
 
         function decideUnsavedChangesAction() {
           if (self.isDirty()) {
             self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-unsaved-changes.titles.unsavedChanges.value'));
             self.i18n.dialog.prompt(oj.Translations.getTranslatedString('wrc-unsaved-changes.prompts.unsavedChanges.willBeLost.value'));
             self.i18n.buttons.cancel.visible(false);
             return UnsavedChangesDialog.showConfirmDialog('AbandonUnsavedChanges', self.i18n)
               .then(reply => {
                 if (reply) {
                   self.dirtyFields.clear();
                   resetPageRedoHistory();
                   self.debugFlagsEnabled(PageDefinitionFields.resetDebugFlagsEnabled(self.debugFlagItems()));
                 }
                 return Promise.resolve(reply);
               });
           }
           else {
             return Promise.resolve(true);
           }
         }
 
         function decideUnsavedChangesAppExitAction() {
           self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-unsaved-changes.titles.unsavedChanges.value'));
           self.i18n.dialog.prompt(oj.Translations.getTranslatedString('wrc-unsaved-changes.prompts.unsavedChanges.saveBeforeExiting.value'));
           self.i18n.buttons.cancel.visible(true);
           return UnsavedChangesDialog.showConfirmDialog('UnsavedChangesAppExit', self.i18n);
         }
 
         function commitShoppingCart(toolbarButton) {
           // Only perform if we're in "configuration" perspective
           if (viewParams.perspective.id === 'configuration') {
             reloadRdjData();
 
             self.formToolbarModuleConfig
               .then((moduleConfig) => {
                 if (toolbarButton === '' || toolbarButton === 'save') {
                   moduleConfig.viewModel.renderToolbarButtons('sync');
                 }
                 else {
                   const hasNonReadOnlyFields = (toolbarButton === 'new');
                   moduleConfig.viewModel.renderToolbarButtons('commit', hasNonReadOnlyFields);
                 }
               });
           }
         }

         function reloadPageData() {
           renderPageData('', false);
           refreshCheckedRowsKeySet();
         }
 
         function renderPageData(toolbarButton, rerenderPage = true) {
           const isEdit = isEditing();
           const isSliceTable = self.isSliceTable(self.pdjData);
           if (isEdit || isSliceTable) {
             // Be mindful that the following reloadRdjData()
             // call will trigger a bunch of knockout change
             // subscriptions!
             reloadRdjData(isEdit);
             if (rerenderPage) {
               renderPage();
             }
           }
           else if (!isEdit && !isSliceTable) {
             // This means we're on a create form with a
             // "Create ..." more menu item, and the user
             // has used that to create a new MBean. We
             // need to refresh the dropdown associated
             // with the more item, so the user is able
             // to choose the new MBean.
             reloadRdjData(isEdit);
           }
 
           self.formToolbarModuleConfig
             .then((moduleConfig) => {
               if (toolbarButton === '' || toolbarButton === 'save') {
                 moduleConfig.viewModel.renderToolbarButtons('sync');
               }
               else {
                 const hasNonReadOnlyFields = (toolbarButton === 'delete');
                 moduleConfig.viewModel.renderToolbarButtons('discard', hasNonReadOnlyFields);
               }
             });
         }
 
         function setFormContainerMaxHeight(withHistoryVisible) {
           let offsetMaxHeight;
           const options = {withHistoryVisible: withHistoryVisible, withHelpVisible: self.showHelp()};
           const offsetHeightCSSVariable = (RouterData.hasSliceTable(self.pdjData) ? 'table-container-resizer-offset-max-height' : 'form-container-resizer-offset-max-height');
           offsetMaxHeight = self.contentAreaContainerResizer.getOffsetMaxHeight('#form-container', offsetHeightCSSVariable, options);
           if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
             offsetMaxHeight += (self.modelConsole.expanded ? self.modelConsole.offsetHeight : 23);
           }
           document.documentElement.style.setProperty('--table-container-calc-max-height', `${offsetMaxHeight}px`);
           document.documentElement.style.setProperty('--form-container-calc-max-height', `${offsetMaxHeight}px`);
         }
 
         function displayBlankForm() {
           self.formTabStripModuleConfig
             .then(moduleConfig => {
               moduleConfig.viewModel.setTabStripVisibility(false);
             });
         }

         function toggleBeanPathHistory(withHistoryVisible) {
           setFormContainerMaxHeight(withHistoryVisible);
           if (!withHistoryVisible) {
             viewParams.signaling.resizeObserveeNudged.dispatch('form');
           }
           return viewParams.onBeanPathHistoryToggled();
         }
 
         function toggleInstructions(visible) {
           self.showInstructions(visible);
           if (self.showInstructions()) {
             setFormContainerMaxHeight(!visible, self.perspectiveMemory.beanPathHistory.visibility);
             viewParams.signaling.resizeObserveeNudged.dispatch('form');
           }
           else {
             setFormContainerMaxHeight(visible, self.perspectiveMemory.beanPathHistory.visibility);
           }
         }

         function toggleHelpPage(withHelpVisible) {
           function rerenderFormLayout() {
             const pdjData = viewParams.parentRouter.data.pdjData();
             const rdjData = viewParams.parentRouter.data.rdjData();

             self.loadRdjDoNotClearDirty = true;

             renderFormLayout(pdjData, rdjData);
           }

           self.formTabStripModuleConfig
             .then(moduleConfig => {
               moduleConfig.viewModel.setTabStripVisibility(false);
             });

           self.formActionsStripModuleConfig
             .then(moduleConfig => {
               moduleConfig.viewModel.renderActionsStrip(!withHelpVisible);
               self.showHelp(withHelpVisible);
               toggleInstructions(!withHelpVisible);
               self.tableCustomizerManager.closeCustomizerState();

               if (withHelpVisible) {
                 stashDirtyFields();
               }
               else {
                 rerenderFormLayout();
               }
             });
         }
 
         function selectLandingPage() {
           viewParams.onLandingPageSelected();
         }
 
         function newBean() {
           self.createForm = new CreateForm(viewParams);
           self.createForm.newBean()
               .then(result => {
                 const rdjUrl = result.body.data.get('rdjUrl');
                 const searchParam = new URL(rdjUrl).searchParams.get('view');
                 const isCreateForm = (searchParam === 'createForm');
                 // We're working with a "createableOptionalSingleton".
                 // save and download the latest WDT model, from the CBE.
                 if (isWdtForm() && !isCreateForm) {
                   const eventType = (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name ? 'autoSave' : 'autoDownload');
                   submitContentFileChanges(eventType);
                 }
                 gotoBean(result, isCreateForm);
               })
               .catch(response => {
                 ViewModelUtils.failureResponseDefaultHandling(response);
               });
         }
 
         function gotoBean(result, isCreateForm) {
           // Use the obtained result to goto the form for the bean
           viewParams.parentRouter.data.pdjUrl(result.body.data.get('pdjUrl'));
           viewParams.parentRouter.data.pdjData(result.body.data.get('pdjData'));
           viewParams.parentRouter.data.rdjData(result.body.data.get('rdjData'));
           let editPage = 'form';
           if (isCreateForm) {
             // Include the query/search param when going to the create form
             // such that the router transitions to that form for the singleton
             // since the singleton and the create form are the same URI
             const resourceUrl = new URL(result.body.data.get('rdjUrl'));
             const path = encodeURIComponent(`${resourceUrl.pathname}${resourceUrl.search}`);
             editPage = `/${viewParams.perspective.id}/${path}`;
           }
           viewParams.parentRouter.go(editPage)
             .then((hasChanged) => {
               if (isCreateForm) {
                 // When loading the create form signal that nonwritable is false
                 // so that the toolbar shows the button that handles the create form
                 viewParams.signaling.nonwritableChanged.dispatch(false);
               }
               // Reset the toolbar buttons, so the
               // "Update Changes" button becomes visible.
               resetToolbarButtons();
               // When not loading the create form update the state
               // of shopping cart or the toolbar for WDT model
               if (!isCreateForm) {
                 if (!isWdtForm()) {
                   updateShoppingCart('sync');
                 }
                 else {
                   self.formToolbarModuleConfig
                     .then((moduleConfig) => {
                       moduleConfig.viewModel.renderToolbarButtons('sync');
                     });
                 }
               }
             });
         }
 
         function deleteBean(resourceData) {
           self.createForm = new CreateForm(viewParams);
           self.createForm.deleteBean(resourceData)
             .then(reply => {
               self.formToolbarModuleConfig
                 .then((moduleConfig) => {
                   const changeManager = moduleConfig.viewModel.changeManager();
                   moduleConfig.viewModel.changeManager({
                     isLockOwner: true,
                     hasChanges: changeManager.hasChanges,
                     supportsChanges: changeManager.supportsChanges
                   });
                   moduleConfig.viewModel.renderToolbarButtons('delete');
                 });
               return reply;
             })
             .then(reply => {
               if (reply.body.messages > 0) {
                 MessageDisplaying.displayResponseMessages(reply.body.messages);
               }
               else if (isWdtForm()) {
                 const eventType = (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name ? 'autoSave' : 'autoDownload');
                 submitContentFileChanges(eventType);
               }
             })
             .catch(response => {
               return ViewModelUtils.failureResponseDefaultHandling(response);
             })
             .finally(() => {
               self.formToolbarModuleConfig
                 .then((moduleConfig) => {
                   const changeManager = moduleConfig.viewModel.changeManager();
                   moduleConfig.viewModel.changeManager({
                     isLockOwner: true,
                     hasChanges: changeManager.hasChanges,
                     supportsChanges: changeManager.supportsChanges
                   });
                   moduleConfig.viewModel.renderToolbarButtons('delete');
                 });
               viewParams.signaling.tabStripTabSelected.dispatch('form', 'shoppingcart', false);
             });
         }
 
         function cancelBean(eventType) {
           function selectLastVisited(contentPage) {
             const onTimeout = (moduleConfigPromise) => {
               moduleConfigPromise
                 .then(moduleConfig => {
                   moduleConfig.viewModel.selectLastVisitedSlice(
                     contentPage.lastVisitedSlice,
                     contentPage.rdjUrl
                   );
                   viewParams.signaling.unsavedChangesDetected.dispatch(undefined);
                 });
             };

             // The timeout value must be high enough to cover how
             // long it takes code in form-tabstrip to retrieve the
             // RDJ associated with the rdjUrl variable. 50 seems to
             // be the smallest value it can be, and have the previous
             // slice appear reliably.
             setTimeout(onTimeout.bind(undefined, self.formTabStripModuleConfig), 50);
           }

           // We need to use rawPath instead of rdjUrl here, because
           // that always contains the URL the cancel needs to go back
           // to. This is true regardless of whether we were in a wizard
           // create form, non-wizard create form or dashboard.
           let rdjUrl = viewParams.parentRouter.data.rawPath();
           // The path knockout observable in the router's parameters is already
           // set to the path we need, so doing a router.go() isn't going to
           // trigger a change. Instead, we have to use the perspective module
           // to get us back to the form/table an appropriate buttons.
           if (!rdjUrl.startsWith(Runtime.getBackendUrl())) {
             rdjUrl = `${Runtime.getBackendUrl()}${rdjUrl}`;
           }
           viewParams.onCreateCancelled(rdjUrl);
           if (isWizardForm()) {
             self.createForm.clearCachedRemovedUsedIfDataValues();
           }
           // Need to set self.createForm to undefined, so the table
           // customizer manager logic inside the setTimeout, works
           // correctly when clicking the "Cancel" button in all the
           // different "New Dashboard" scenarios.
           self.createForm = undefined;
           clearFormChanges();
           selectLastVisited(self.perspectiveMemory.contentPage);
         }
 
         function clearFormChanges() {
           notifyUnsavedChanges(false);
           self.dirtyFields.clear();
           resetAutoSyncToolbarIconsState();
           resetPageRedoHistory();
           self.debugFlagsEnabled(PageDefinitionFields.resetDebugFlagsEnabled(self.debugFlagItems()));
           self.multiSelectControls = {};
         }

         function saveButtonClicked(eventType){
           if(self.isDirty()){
             saveBean(eventType);
           }
           else{
             const rdjData = viewParams.parentRouter.data.rdjData();
             const dataPayload = '';
             const isDashboardSliceLayout = rdjData.navigation.startsWith('Dashboards');
             const hasEmptyDataPayload = (CoreUtils.isUndefinedOrNull(dataPayload) || (Object.keys(dataPayload).length === 0));

             let messageText;

             if (hasEmptyDataPayload && ['configuration'].includes(viewParams.perspective.id) ||
                 isDashboardSliceLayout || isPolicyExpressionSliceLayout() ||
                 isPolicyAdvancedSliceWritableField(dataPayload)
             ) {
               messageText = self.i18n.messages.savedTo.notSaved;
             }

             if(CoreUtils.isNotUndefinedNorNull(messageText)){
               let message = {
                 severity: 'info',
                 message: messageText
               };
               MessageDisplaying.displayMessage({
                 severity: message.severity,
                 summary: message.message
               }, 2500);
             }
           }
         }

         function saveBean(eventType) {
           let dataAction = '';
           let isEdit = isEditing();
 
           if (isEdit) {
             // We're in edit mode, so get the slice name from
             // the embedded form-tabstrip.js module config.
             return self.formTabStripModuleConfig
                 .then(moduleConfig => {
                   // Get name of slice that save applies to.
                   const sliceName = moduleConfig.viewModel.getSliceName();
                   if (CoreUtils.isNotUndefinedNorNull(sliceName)) {
                     // There was a slice, so use it to construct
                     // the "slice" query parameter.
                     dataAction = '?slice=' + sliceName;
                   }
                   // Call saveDataPayload closure
                   return saveDataPayload(eventType, isEdit, dataAction);
                 });
           }
           else {
             // We're in create mode, so construct static query
             // parameter for a create data action.
             dataAction = '?action=create';
             // Call saveDataPayload closure
             return saveDataPayload(eventType, isEdit, dataAction);
           }
         }
 
         function saveDataPayload(eventType, isEdit, dataAction) {
           let dataPayload = self.determineChanges(false);
 
           if (isPolicyExpressionSliceLayout()) {
             dataPayload = {};
             if (self.isDirty()) {
               const pdjData = viewParams.parentRouter.data.pdjData();
               if (RouterData.hasSliceFormProperties(pdjData)) {
                 const sliceName = pdjData.sliceForm.properties[0].name;
                 const rdjUrl = viewParams.parentRouter.data.rdjUrl();
                 const fieldValue = self[`${PageDefinitionCommon.FIELD_VALUES}${sliceName}`]();
                 const stringExpression = self.policyData.getStringExpression(sliceName);
                 return PolicyManager.submitPolicyChange(fieldValue, stringExpression, rdjUrl)
                     .then(response => {
                       self.policyForm.resetPolicyEditor(true);
                       return handleSaveResponse(response, dataAction, dataPayload, eventType, isEdit);
                     })
                     .catch(response => {
                       return handleSaveResponse(response, dataAction, dataPayload, eventType, isEdit);
                     });
               }
             }
             else {
               return Promise.resolve(true);
             }
           }
 
           if (isEdit && (dataPayload != null) && (Object.keys(dataPayload).length === 0)) {
             Logger.log('[FORM] POST data is empty while isEdit=true, exiting save!');
             dataPayload = null;
           }
 
           if (dataPayload === null && !isDashboardFormLayout()) dataPayload = {};
 
           if (CoreUtils.isNotUndefinedNorNull(dataPayload)) {
             delete dataPayload['VerifySource'];
             delete dataPayload['VerifySourcePath'];
             delete dataPayload['VerifyPlan'];
             delete dataPayload['VerifyPlanPath'];
             if (CoreUtils.isNotUndefinedNorNull(dataPayload['formData'])) {
               const formData = dataPayload['formData'];
               delete dataPayload['formData'];
               delete dataPayload['Upload'];
               // Send multipart request.
               return DataOperations.mbean.upload(viewParams.parentRouter.data.rdjUrl(), formData)
                   .then(reply => {
                     return handleSaveResponse(reply, dataAction, dataPayload, eventType, isEdit);
                   })
                   .catch(response => {
                     if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
                       if (response.failureType === CoreTypes.FailureType.CONNECTION_REFUSED) {
                         ViewModelUtils.failureResponseDefaultHandling(response);
                       }
                     }
                     return handleSaveResponse(response, dataAction, dataPayload, eventType, isEdit);
                   });
             }
             else {
               let rdjUrl = viewParams.parentRouter.data.rdjUrl();
               // Remove the query/search param from the RDJ URL when present
               // as a singleton create form includes this with the router path
               const resourceUrl = new URL(rdjUrl);
               if ('createForm' === resourceUrl.searchParams.get('view') &&
                   !resourceUrl.pathname.endsWith('Dashboards')) {
                 resourceUrl.searchParams.delete('view');
                 rdjUrl = resourceUrl.toString();
               }
               if (resourceUrl.pathname.endsWith('Dashboards')) dataAction = '';
               const url = `${rdjUrl}${dataAction}`;
               return DataOperations.mbean.save(url, dataPayload)
                   .then(reply => {
                     if (ViewModelUtils.isElectronApiAvailable()) {
                       viewParams.signaling.unsavedChangesDetected.dispatch(undefined);
                       notifyUnsavedChanges(false);
                     }
                     return handleSaveResponse(reply, dataAction, dataPayload, eventType, isEdit);
                   })
                   .catch(response => {
                     if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
                       if (response.failureType === CoreTypes.FailureType.CONNECTION_REFUSED) {
                         ViewModelUtils.failureResponseDefaultHandling(response);
                       }
                     }
                     if (ViewModelUtils.isElectronApiAvailable() && eventType === 'update') {
                       setFocusFormElement();
                       notifyUnsavedChanges(true);
                     }
                     return handleSaveResponse(response, dataAction, dataPayload, eventType, isEdit);
                   });
             }
           }
           return Promise.resolve(true);
         }
 
         /**
          * Method to perform "post-Save" activities for a successful save operation, based on the values of specific parameters.
          * <p>The assumption here is that the save operation was successful, with regards to the Promise returned. This means that a Promise rejection should not result in this method being called.</p>
          * @param {{body: {data: any, messages?: any}}} response - The response object return from the successful save operation.
          * @param {string} dataAction - Query parameter that was used with the successful save operation.
          * @param {object} dataPayload - JSON payload that was used in the successful save operation.
          * @param {"create"|"finish"|"update"|"autoDownload"} eventType - The type of event that was associated with the successful save operation.
          * @param {boolean} isEdit - Flag indicating if the save operation was for a "create" event, or an "update" event. The flag will be false for the former, and true for the latter.
          * @private
          */
         function handleSaveResponse(response, dataAction, dataPayload, eventType, isEdit) {
           const includeAdvancedFields = (self.showAdvancedFields().length !== 0);
           let retval = false;
           const properties = getSliceProperties(self.pdjData, includeAdvancedFields);
           const bodyMessages = ViewModelUtils.getResponseBodyMessages(response, properties);
           if (bodyMessages.length > 0) {
             MessageDisplaying.displayErrorMessagesHTML(bodyMessages, oj.Translations.getTranslatedString('wrc-message-displaying.messages.responseMessages.summary'));
           }
 
           if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
             self.debugFlagsEnabled(PageDefinitionFields.resetDebugFlagsEnabled(self.debugFlagItems()));
           }
 
           resetToolbarButtons();
 
           if (CoreUtils.isNotUndefinedNorNull(response.failureType) && response.body.messages.length === 0) {
             saveFailedNoMessages(dataAction, dataPayload, isEdit);
           }
           else if (response.body.messages.length === 0) {
             const identity = (CoreUtils.isNotUndefinedNorNull(response.body.data) && CoreUtils.isNotUndefinedNorNull(response.body.data.resourceData) && CoreUtils.isNotUndefinedNorNull(response.body.data.resourceData.resourceData) ? response.body.data.resourceData.resourceData : undefined);
             if (['configuration', 'security'].includes(viewParams.perspective.id)) {
               viewParams.signaling.unsavedChangesDetected.dispatch(undefined);
             }
             saveSucceeded(eventType, dataPayload, isEdit, identity, response.body.data.messages);
             if (isWdtForm() && Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
               const dataProvider = self.wdtForm.getDataProvider();
               if (dataProvider.modelArchiveEntries) {
                 const modelArchive = dataProvider.extensions.wktui.modelArchive;
                 dataProvider.modelArchiveEntries.forEach((modelArchiveEntry) => {modelArchive.addToArchive(modelArchiveEntry.result.archiveEntryType, modelArchiveEntry.result.filePath)
                     .then(archivePath => {
                       if (modelArchiveEntry.result.archiveEntryType.endsWith('Dir') && archivePath.slice(-1) !== '/') {
                         modelArchiveEntry.result.archivePath = `${archivePath}/`;
                       }
                     })
                     .catch(response => {
                       ViewModelUtils.failureResponseDefaultHandling(response);
                     });
                 });
               }
             }
             retval = true;
           }
 
           return retval;
         }
 
         function resetToolbarButtons() {
           if (['configuration', 'modeling','security', 'properties'].indexOf(viewParams.perspective.id) !== -1) {
             self.formToolbarModuleConfig
               .then((moduleConfig) => {
                 moduleConfig.viewModel.resetButtonsDisabledState([
                   {id: 'save', disabled: false}
                 ]);
                 moduleConfig.viewModel.renderToolbarButtons('create');
               });
           }
         }
 
         function saveFailedNoMessages(dataAction, dataPayload, isEdit) {
           function compensatingTransactionFailure(response) {
             if (response.body.messages.length > 0) {
               Logger.error('Compensating transaction failed!');
               MessageDisplaying.displayResponseMessages(response.body.messages);
             }
           }
 
           if (isEdit) {
             // create a POST request to reverse the change.
             let compensatingPayload = {};
 
             self.dirtyFields.forEach(function (field) {
               compensatingPayload[field] = self.rdjData.data[field];
             });
 
             const rdjUrl = `${viewParams.parentRouter.data.rdjUrl()}${dataAction}`;
             DataOperations.mbean.save(rdjUrl, compensatingPayload)
                 .then(reply => {
                   compensatingTransactionFailure(reply);
                 })
                 .catch(response => {
                   compensatingTransactionFailure(response)
                 });
           }
           else if (typeof dataPayload['Name'] !== 'undefined') {
             let dataPayloadName = dataPayload['Name'];
             let pathLeafName;
             if (typeof dataPayloadName !== 'undefined') {
               if (CoreUtils.isNotUndefinedNorNull(dataPayloadName.value)){
                 pathLeafName = dataPayloadName.value;
               }
               else if (CoreUtils.isNotUndefinedNorNull(dataPayloadName.modelToken)){
                 pathLeafName = dataPayloadName.modelToken;
               }
             }
             const deleteUrl = viewParams.parentRouter.data.rdjUrl() + '/' + encodeURIComponent(pathLeafName);
 
             DataOperations.mbean.delete(deleteUrl)
                 .then(reply => {
                   Logger.log('Delete of partially created object successful.');
                   MessageDisplaying.displayResponseMessages(reply.body.messages);
                 })
                 .catch(response => {
                   Logger.log('Delete of partially created object not possible');
                   ViewModelUtils.failureResponseDefaultHandling(response);
                 });
           }
         }
 
         function saveSucceeded(eventType, dataPayload, isEdit, identity, messages) {
           notifyUnsavedChanges(false);
 
           updateMultiSelectControls(dataPayload);
           cacheDataPayload(dataPayload);
           self.dirtyFields.clear();
           clearMultiSelectControl(dataPayload);
           updatePropertyListControl(dataPayload);
 
           // For tool mode, reset any unset fields to the default value, if
           // the field is not actually in the unset state, no action is taken
           if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
             if (Object.keys(self.pageRedoHistory).length > 0) {
               for (const [fieldName, fieldValue] of Object.entries(self.pageRedoHistory)) {
                 resetUnsetFieldToDefault(fieldName);
               }
             }
           }
 
           if (self.debugFlagEvent && Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
             if (Object.keys(self.pageRedoHistory).length > 0) {
               const flagName = Object.keys(self.pageRedoHistory)[0];
               const flagVal = self.pageRedoHistory[flagName].value;
               self.debugFlagItems().data.forEach((oneF) => {
                 if (oneF.value === flagName) {
                   oneF.enabled = flagVal;
                 }
               });
             }
           } else {
             self.debugFlagItems(null);
           }
 
           if (Runtime.getDataProviderId() !== '') {
             const treeaction = {
               isEdit: isEdit,
               path: decodeURIComponent(viewParams.parentRouter.data.rawPath())
             };
 
             // fix the navtree
             viewParams.signaling.navtreeUpdated.dispatch(treeaction);
           }
 
           if (messages && messages.length > 0) {
             messages.forEach(message => {
               MessageDisplaying.displayMessage({
                 severity: message.severity,
                 summary: message.message
               }, 2500);
             });
           }
 
           if (isEdit) {
             if (RouterData.hasRDJData(viewParams.parentRouter)) {
               const rdjData = viewParams.parentRouter.data.rdjData();
               const isDashboardSliceLayout = rdjData.navigation.startsWith('Dashboards');
               const isReadWriteSliceLayout = !isReadOnlyFormLayout();
               const hasEmptyDataPayload = (CoreUtils.isUndefinedOrNull(dataPayload) || (Object.keys(dataPayload).length === 0));

               let messageText;

               if (!hasEmptyDataPayload && ['configuration'].includes(viewParams.perspective.id)) {
                 messageText = self.i18n.messages.savedTo.shoppingcart;
               }
               else if (isDashboardSliceLayout || isPolicyExpressionSliceLayout() ||
                 isPolicyAdvancedSliceWritableField(dataPayload)
               ) {
                 messageText = self.i18n.messages.savedTo.generic;
               }
               else if (!hasEmptyDataPayload && isReadWriteSliceLayout) {
                 messageText = self.i18n.messages.savedTo.generic;
               }

               if (CoreUtils.isNotUndefinedNorNull(messageText) && messageText !== '') {
                let message = {
                   severity: 'confirmation',
                   message: messageText
                 };
                 MessageDisplaying.displayMessage({
                   severity: message.severity,
                   summary: message.message
                 }, 2500);
               }

               if (!hasEmptyDataPayload) {
                 if (isDashboardSliceLayout || isReadWriteSliceLayout ||
                   ['configuration', 'modeling', 'security', 'properties'].indexOf(viewParams.perspective.id) !== -1
                 ) {
                   if (CoreUtils.isNotUndefinedNorNull(self.wdtForm)) {
                     submitContentFileChanges(eventType);
                   }

                   if (!isDashboardSliceLayout && (viewParams.perspective.id === 'configuration')) {
                     updateShoppingCart(eventType);
                   }
                 }

                 // Reload the page data to pickup the saved changes!
                 // Skip reload for property list due to a reordering
                 if (['properties'].indexOf(viewParams.perspective.id) === -1) {
                   if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
                     reloadRdjData();
                   }
                 }
               }
             }
           }
           else {
             if (isWdtForm()) submitContentFileChanges(eventType);
 
             if (isWizardForm()) {
               self.createForm.clearCachedRemovedUsedIfDataValues();
             }

             // clear treenav selection
             viewParams.signaling.navtreeSelectionCleared.dispatch();
 
             // Check if already the same RDJ when handling the singletons
             if (identity === viewParams.parentRouter.data.rdjUrl()) {
               // Obtain the bean and then goto the page for the bean
               DataOperations.mbean.get(identity)
                 .then((result) => {
                   gotoBean(result, false);
                 });
               return;
             }
 
             const path = encodeURIComponent(identity);
             const editPage = '/' + viewParams.perspective.id + '/' + path;
 
             Router.rootInstance.go(editPage)
               .then((hasChanged) => {
                 self.formToolbarModuleConfig
                   .then((moduleConfig) => {
                     const changeManager = moduleConfig.viewModel.changeManager();
                     moduleConfig.viewModel.changeManager({
                       isLockOwner: changeManager.isLockOwner,
                       hasChanges: changeManager.hasChanges,
                       supportsChanges: changeManager.supportsChanges,
                     });
                     moduleConfig.viewModel.renderToolbarButtons(eventType);
                   });
               });
           }
         }
 
         function submitContentFileChanges(eventType) {
           if (!ViewModelUtils.isElectronApiAvailable()) {
             switch (eventType) {
               case 'finish':
                 if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
                   downloadContentFile('autoDownload');
                 }
                 break;
               case 'navigation':
               case 'update':
               case 'autoDownload':
                 downloadContentFile(eventType);
                 break;
             }
           }
           else {
             downloadContentFile('autoDownload');
           }
         }
 
         function saveContentFileChanges() {
           if (isWdtForm()) {
             const eventType = (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name ? 'download' : 'autoDownload');
             downloadContentFile(eventType);
           }
         }
 
         async function updateContentFile(eventType) {
           if (self.isDirty()) {
             stashDirtyFields();
             const reply = await saveBean(eventType);
             if (!reply) {
               viewParams.signaling.navtreeSelectionCleared.dispatch();
               return Promise.resolve(reply);
             }
           }
 
           if (['download', 'autoDownload'].includes(eventType)) {
             viewParams.signaling.unsavedChangesDetected.dispatch(undefined);
             if (eventType === 'download') downloadContentFile(eventType);
           }
           return Promise.resolve(true);
         }
 
         function downloadContentFile(eventType, dataProviderId = null) {
           notifyUnsavedChanges(false);
           self.wdtForm.getContentFileChanges(dataProviderId)
               .then(reply => {
                 if (reply.succeeded) {
                   if (isEditing() && eventType === 'download') {
                     MessageDisplaying.displayMessage({
                       severity: 'confirmation',
                       summary: self.wdtForm.getSummaryMessage('changesDownloaded', dataProviderId)
                     }, 2500);
                   }
                 }
                 else {
                   // This means wdtForm.getContentFileChanges() was
                   // able to download, but not write out the model
                   // file.
                   if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name && ['update', 'autoDownload'].includes(eventType)) {
                     // Send signal containing the changes
                     // downloaded from the WRC-CBE.
                     const dataProvider = self.wdtForm.getDataProvider();
                     viewParams.signaling.changesAutoDownloaded.dispatch(dataProvider, reply.fileContents);
                   }
                   else {
                     // Call writeContentFile passing in the
                     // filepath and fileContents in reply.
                     writeContentFile({filepath: reply.filepath, fileContents: reply.fileContents}, dataProviderId);
                   }
                 }
               })
               .catch(response => {
                 ViewModelUtils.failureResponseDefaultHandling(response);
               });
         }
 
         function writeContentFile(options, dataProviderId = null) {
           self.wdtForm.writeContentFile(options, dataProviderId)
               .then(reply => {
                 Logger.log(`[FORM] self.wdtForm.writeContentFile(options) returned ${reply.succeeded}`);
               });
         }
 
         /**
          * <p>When new property is added through the WDT dialog, we will add that to the in memory rdjData, so that for the next WDT dialog, the new value will show up for selection without needing the page to refresh.</p>
          * @param {string} key
          * @param {object} modelTokens
          * @private
          */
         function updateRdjData(key, modelTokens) {
           const newOption = {
             label: key,
             value: '@@PROP:'+ key + '@@'
           };
           if (CoreUtils.isNotUndefinedNorNull(modelTokens.options)) {
             modelTokens.options.push(newOption);
           } else {
             modelTokens.options = [newOption];
           }
         }
 
         /**
          * <p>Use options source information in RDJ data, update the property value and save the property list content.</p>
          * @param {object} modelTokens
          * @param {string} key
          * @param {*} value
          * @private
          */
         function updatePropertyList(modelTokens, key, value) {
           if (CoreUtils.isNotUndefinedNorNull(self.wdtForm)) {
             const optionsSource = modelTokens.optionsSources[0];
             savePropertyValue(optionsSource.resourceData, key, value)
                 .then(() => {
                   downloadContentFile('download', optionsSource.label);
                   updateRdjData(key, modelTokens);
                 })
                 .catch(response => {
                   ViewModelUtils.failureResponseDefaultHandling(response);
                 });
           }
         }
 
         /**
          * Use specified ``key`` and ``value`` to upsert a property list item.
          * <p>If key doesn't exists, then a new item will be added using key and value. Otherwise, the value of the existing item will be updated.</p>
          * @param {string} url - The uri (e.g. resourceData) for the RDJ
          * @param {string} key - The key for the property list item
          * @param {*} val - The value for the property list item
          * @returns {*|Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
          * @private
          */
         function savePropertyValue(url, key, val) {
           const dataPayload = { action: 'update', data: {} };
           dataPayload.data['Properties'] = { value: {} };
           dataPayload.data['Properties'].value[key] = val;
           return DataOperations.mbean.save(url, dataPayload, true);
         }
 
         function clearMultiSelectControl(dataPayload){
           for (const key of Object.keys(dataPayload)) {
             if (typeof self.multiSelectControls[key] !== 'undefined') {
               self.multiSelectControls[key].chosenItems = [];
               self.multiSelectControls[key].origChosenLabels = [];
             }
           }
         }
 
         function updateMultiSelectControls(dataPayload) {
           for (const key of Object.keys(dataPayload)) {
             if (typeof self.multiSelectControls[key] !== 'undefined') {
               self.multiSelectControls[key].origChosenLabels = self.multiSelectControls[key].savedChosenLabels;
             }
           }
         }
 
         function updatePropertyListControl(dataPayload) {
           if (self.propertyListName !== null) {
             const controlElement = document.getElementById(self.propertyListName);
             if (controlElement !== null) {
               controlElement.updatePropertyListSnapshot();
             }
           }
         }
 
         function reloadRdjData(isEdit = true) {
           //temp fix for incorrect self.sliceName
           const pageDefinition = (CoreUtils.isNotUndefinedNorNull(viewParams.parentRouter.data.rdjData) ? viewParams.parentRouter.data.rdjData().pageDescription : undefined);
           let sliceName = (CoreUtils.isNotUndefinedNorNull(pageDefinition) ? pageDefinition.substring(pageDefinition.indexOf('=') + 1) : '');
           // Ensure the reload does not attempt to use
           // the create form as the slice.
           sliceName = (sliceName !== 'createForm' ? sliceName : '');
           Logger.log(`[FORM] sliceName=${sliceName}, self.sliceName=${self.sliceName}`);

           let rdjUrl = viewParams.parentRouter.data.rdjUrl();
           if (isEdit) {
             if (rdjUrl.indexOf(`slice=${sliceName}`) === -1 && sliceName !== '') {
               rdjUrl = `${rdjUrl}?slice=${sliceName}`;
             }
           }
           else {
             rdjUrl = `${rdjUrl}?view=createForm`;
           }

           DataOperations.mbean.reload(rdjUrl)
             .then(reply => {
               const rdjData = reply.body.data;
               Logger.log(`[FORM] reload url; reply.body.data=${JSON.stringify(rdjData)}`);
               // Preserve changes that occurred AFTER a save was
               // done, so they will be available after the data
               // is refreshed from the reload.
               const dataPayload = getDirtyFieldsPayload();
               viewParams.parentRouter.data.rdjData(rdjData);
               if (CoreUtils.isUndefinedOrNull(rdjData) || CoreUtils.isUndefinedOrNull(rdjData.data)) {
                 // reload rdjData did not get any data
                 signalGotoLandingPage('No RDJ data!');
               }
               resetPageRedoHistory();
               cacheDataPayload(dataPayload);
               restoreDirtyFieldsValues();
               self.formToolbarModuleConfig
                 .then((moduleConfig) => {
                   moduleConfig.viewModel.renderToolbarButtons('sync');
                 });
             })
             .catch(response => {
               if (response.failureType === CoreTypes.FailureType.NOT_FOUND) {
                 signalGotoLandingPage('Form reload unable to find page data, goto landing page.');
               }
               else {
                 MessageDisplaying.displayResponseMessages(response.body.messages);
               }
             });
 
         }
 
         function signalGotoLandingPage(debugMessage) {
           viewParams.onLandingPageSelected(debugMessage);
         }
 
         /**
          * <p><b>WARNING: This renderPage() function is called in multiple ways!</b>
          * <ol>
          *   <li>A call is made to it from the this.connected() callback function. The call isn't inside aa if statement, or function, or a signal.add handler. It's just "out in the open", sprinkled in with other code that's "out in the open"! The value true is assigned to the resetPageHistory parameter.</li>
          *   <li>A call is made to it from the this.connected() callback function, but this time it's inside a signal.add handler. The value true is assigned to the resetPageHistory parameter.</li>
          *   <li>A call is made to it from the this.showAdvancedFieldsValueChanged event handler, triggered when the "Show Advanced Fields" check is checked or unchecked. Nothing is passed as a parameter, so resetPageHistory is "undefined" in this function.</li>
          *   <li>A call is made to it from inside an if block, of the private renderPageData() function. Nothing is passed as a parameter, so resetPageHistory is "undefined" in this function.</li>
          * </ol>
          * @param {undefined|true} resetPageHistory
          */
         function renderPage(resetPageHistory) {
           function getIsEdit(pdjData) {
             let rtnval;
             if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm) || CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable)) {
               rtnval = true;
             }
             else if (CoreUtils.isNotUndefinedNorNull(pdjData.createForm)) {
               rtnval = false;
             }
             return rtnval;
           }
 
           // Declare function-scoped pdjData variable and initialize it from router data
           var pdjData = viewParams.parentRouter.data.pdjData();
           // Declare function-scoped rdjData variable and initialize it from router data
           var rdjData = viewParams.parentRouter.data.rdjData();
 
           // The loadRdjDoNotClearDirty flag is set when we try to
           // reload the rdj, but not clear up dirty fields. One use
           // case is when we need to reload rdj after creating a
           // resource using overlay-form.  We don't want to lose all
           // the changes. If user is using the 'Reload' icon' on the
           // table/form icon toolbar to reload the page, then this
           // flag will not be set.
           if (CoreUtils.isNotUndefinedNorNull(resetPageHistory) && !self.loadRdjDoNotClearDirty) {
             resetPageRedoHistory();
           }
 
           const isEdit = getIsEdit(pdjData);
           if (CoreUtils.isUndefinedOrNull(isEdit)) return;
 
           // Update module-scoped pdjData variable from router data
           self.pdjData = viewParams.parentRouter.data.pdjData();
           // Update module-scoped rdjData variable from router data
           self.rdjData = viewParams.parentRouter.data.rdjData();
 
           // Adjust the table customizer based on the PDJ data and when
           // available, seed the table customizations via columnDataProvider
           const isSliceTable = self.isSliceTable(pdjData);
           adjustSliceTableCustomizer(isSliceTable);
 
           // DON'T USE optional chaining, here!! It's not supported
           // in the JS compiler (esprima) that JET uses, when it does
           // a release build of a JET web app.
           let slices = (CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm) && CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm.slices) ? pdjData.sliceForm.slices : CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable) && CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable.slices) ? pdjData.sliceTable.slices : undefined);
 
           if (isEdit && CoreUtils.isNotUndefinedNorNull(slices) && slices.length > 0) {
             self.formTabStripModuleConfig
                 .then((moduleConfig) => {
                   const currentSlice = moduleConfig.viewModel.getCurrentSlice();
                   if (currentSlice === '') {
                     moduleConfig.viewModel.updateSlice(currentSlice, 1);
                   }
                   else if (isPolicyExpressionSliceLayout()) {
                     // This means the user clicked the "Policy" or
                     // "Default Policy" slice. In that case, we'll
                     // basically need to replace the PolicyForm
                     // and PolicyData instances that form.js was
                     // using, with new instances!
                     self.policyData = PolicyManager.createPolicyData(rdjData);
                     const sliceName = currentSlice.selection();
                     self.policyForm = new PolicyForm(
                         self.policyData,
                         sliceName,
                         viewParams.parentRouter.data.rdjUrl()
                     );
                   }
                 });
           }
 
           const toggleHelpIntroduction = self.i18n.introduction.toggleHelp.text.replace('{0}', '<img src=\'../../images/' + self.i18n.introduction.toggleHelp.iconFile + '\' alt='+ self.i18n.introduction.toggleHelp.text +'\'\'">');
           const bindHtml = getIntroductionHtml(pdjData.introductionHTML, rdjData.introductionHTML);
           self.introductionHTML({view: HtmlUtils.stringToNodeArray(bindHtml)});
 
           // Update function-scoped pdjData variable from router data
           pdjData = viewParams.parentRouter.data.pdjData();
           // Update function-scoped rdjData variable from router data
           rdjData = viewParams.parentRouter.data.rdjData();
 
           if (DeclarativeActionsManager.hasActions(pdjData)) {
             DeclarativeActionsManager.populateDeclarativeActions(rdjData, pdjData, self.declarativeActions);
             renderActionsStrip(true);
           }
           else {
             renderActionsStrip(false);
           }
 
           if (typeof rdjData !== 'undefined' && typeof pdjData !== 'undefined') {
             let flag = (typeof pdjData.sliceForm !== 'undefined' && typeof pdjData.sliceForm.advancedProperties !== 'undefined');
             self.hasAdvancedFields(flag);
             self.perspectiveMemory.contentPage.nthChildren = [];
             renderFormLayout(pdjData, rdjData);
           }
         }
 
         function getIntroductionHtml(pdjIntro, rdjIntro) {
           const bindHtml = (CoreUtils.isNotUndefinedNorNull(rdjIntro) ? rdjIntro : pdjIntro);
           return (CoreUtils.isNotUndefinedNorNull(bindHtml) ? bindHtml : '<p>');
         }
 
         function rerenderWizardForm(pdjData, rdjData, direction, removed) {
           if (typeof removed !== 'undefined') {
             Logger.log(`[FORM] removed.length=${removed.length}`);
             removed.forEach((item) => {
               // Remove the subscription that matches item.name.
               processRemovedField(item.name);
             });
           }
 
           const pageState = self.createForm.rerenderPage(direction);
           if (pageState.succeeded) {
             self.formToolbarModuleConfig
                 .then((moduleConfig) => {
                   moduleConfig.viewModel.resetButtonsDisabledState([{
                     id: 'finish',
                     disabled: !self.createForm.getCanFinish()
                   }]);
                   renderFormLayout(pdjData, rdjData);
                 });
           }
         }
 
         function renderFormLayout(pdjData, rdjData) {
           function setDashboardCriteriaValueLabelWidth() {
             if (isDashboardFormLayout()) {
               const nodeList = document.querySelectorAll('div > div:nth-child(n) > div:nth-child(3) > div.oj-formlayout-inline-label');
               if (nodeList !== null) {
                 const arr = Array.from(nodeList);
                 arr.forEach((node) => {
                   node.style['flex-grow'] = 0;
                   node.style['flex-shrink'] = 0;
                   node.style['flex-basis'] = 0;
                   node.style['width'] = 0;
                   node.style['max-width'] = 0;
                 });
               }
             }
           }

           function setTableCursor(pdjData) {
             const isSliceTable = self.isSliceTable(pdjData);
             let navigationProperty = 'none';
             if (isSliceTable){
               navigationProperty = DeclarativeActionsManager.getNavigationProperty(pdjData);
               ViewModelUtils.setTableCursor(navigationProperty);
             }
           }

           let div;
 
           if (isWizardForm()) {
             div = renderWizardForm(rdjData);
           }
           else if (isPolicyExpressionSliceLayout()) {
             const options = {labelWidthPcnt: '14%', maxColumns: '1', isReadOnly: false, isSingleColumn: true};
             div = createPolicyFormLayout(options, pdjData, rdjData);
           }
           else {
             self.perspectiveMemory.contentPage.nthChildren = [];
             div = renderForm(pdjData, rdjData);
           }
 
           createHelp(pdjData);
 
           self.formDom({view: HtmlUtils.stringToNodeArray(div.outerHTML), data: self});
 
           // Define callback function that will be passed to
           // the setTimeout() function
           const onRender = (pdjData) => {
             Context.getPageContext().getBusyContext().whenReady()
               .then(() => {
                 // Ensure that a create form or slice form does not have the customizer button
                 if (CoreUtils.isNotUndefinedNorNull(self.createForm) || CoreUtils.isNotUndefinedNorNull(self.pdjData?.sliceForm)) {
                   self.tableCustomizerManager.adjustCustomizerButtonState(false);
                 }
                 refreshActionsDisabledStates();

                 restoreUnsetFieldsApplyHighlighting();
                 renderSpecialHandlingFields();

                 setDashboardCriteriaValueLabelWidth();
                 setTableCursor(pdjData);
                 setFormContainerMaxHeight(self.perspectiveMemory.beanPathHistory.visibility);
                 restoreDirtyFieldsValues();
                 self.loadRdjDoNotClearDirty = false;

                 setDataFormType(pdjData);
  
                 const ele = document.querySelector('.cfe-buttonset');
                 if (ele !== null) ele.style.display = 'none';

                 if (isPolicyExpressionSliceLayout()) {
                   if (CoreUtils.isNotUndefinedNorNull(self.policyForm)) {
                     const bindHtml = getIntroductionHtml(pdjData.introductionHTML, rdjData.introductionHTML);
                     if (self.policyForm.section === 'Policy') {
                       self.introductionHTML({view: HtmlUtils.stringToNodeArray(`${bindHtml}${oj.Translations.getTranslatedString('wrc-policy-management.instructions.policyEditor.value')}`)});
                     }
                     else {
                       self.introductionHTML({view: HtmlUtils.stringToNodeArray(bindHtml)});
                     }
 
                     const pdjTypes = new PageDataTypes(pdjData.sliceForm.properties, viewParams.perspective.id);
                     self.policyForm.renderPolicyForm(
                         self.policyData,
                         pdjTypes,
                         rdjData,
                         pdjData,
                         self.actionButtonSet.buttonSetItems,
                         {'fieldValueChanged': fieldValueChanged, 'policyEditorReset': policyEditorReset}
                     );
                     if (ele !== null && self.policyForm.section === 'Policy') ele.style.display = 'inline-flex';
                   }
                 }
 
               });
           };
 
           // Call setTimeout passing in the callback function and the
           // timeout milliseconds. Here, we use the bind() method to
           // pass parameters (pdjData, in this case) to the callback.
           setTimeout(onRender.bind(undefined, pdjData), 5);
           // DON'T PUT ANY CODE IN THIS FUNCTION AFTER THIS POINT !!!
         }
 
         function setDataFormType(pdjData) {
           const ele = document.getElementById('form-container');
           if (ele !== null) {
             ele.setAttribute('data-form-type', (RouterData.hasSliceTable(pdjData) ? 'sliceTable' : 'sliceForm'));
           }
         }

         function renderActionsStrip(visibility) {
           self.formActionsStripModuleConfig
             .then(moduleConfig => {
               moduleConfig.viewModel.renderActionsStrip(visibility);
             });
         }
 
         function renderSpecialHandlingFields() {
           let ele;
           self.perspectiveMemory.nthChildrenItems.call(self.perspectiveMemory).forEach((nthChild) => {
             ele = document.querySelector('#wlsform > div > div:nth-child(' + nthChild.row + ') > div:nth-child(' + nthChild.col + ')');
             if (ele !== null && typeof nthChild.minHeight !== 'undefined') {
               ele.style['min-height'] = nthChild.minHeight;
               ele = document.getElementById(`${nthChild.name}|input`);
               if (ele !== null) {
                 ele.setAttribute('data-init-height', nthChild.minHeight);
               }
             }
           });
 
           const results = setFocusFormElement(true);
 
           if (results.formElement) {
             results.formElement.addEventListener('blur', onBlurFormLayout, true);
           }
 
           if (isWdtForm()) {
             results.nodeList = document.querySelectorAll('#Source, #SourcePath, #Plan, #PlanPath');
             if (results.nodeList !== null && Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
               const arr = Array.from(results.nodeList);
               arr.forEach((node) => {
                  node.onchange = onChangeLibAppDeploymentField;
               });
             }
           }
         }
 
         function setFocusFormElement(selectOnly = false) {
           let nodeList;
           const formElement = document.getElementById('wlsform');
           if (formElement !== null) {
             nodeList = formElement.querySelectorAll('oj-text-area.oj-textarea, oj-select-single.oj-text-field, oj-input-text.oj-text-field, oj-combobox-one.oj-text-field');
             if (!selectOnly) {
               if (nodeList !== null) {
                 const arr = Array.from(nodeList);
                 const index = arr.map(node => node.readonly).indexOf(false);
                 if (index !== -1) arr[index].focus();
               }
             }
           }
           return {formElement: formElement, nodeList: nodeList};
         }
 
         function requiredFieldsComplete(name, newValue) {
           let rtnval = true;
           const selector = $(`#${name}`);
           const isRequired = (selector.attr('data-required') !== 'undefined' ? selector.attr('data-required') : false);
           const initialValue = (selector.attr('data-initial-value') !== 'null' ? selector.attr('data-initial-value') : '');
           if (newValue === '' && !isRequired) {
             const curVal = self[`${PageDefinitionCommon.FIELD_VALUES}${name}`]();
             if (CoreUtils.isNotUndefinedNorNull(curVal)) {
               self.wdtForm.deleteModelArchiveEntry([curVal], self.wdtForm);
             }
             unsetProperty({field: name, disabled: false, unset: true});
             onBlurFormLayout({target: {id: name, type: 'blur', cancelable: false, cancelBubble: true}});
           }
           return rtnval;
         }
 
         function onChangeLibAppDeploymentField(event) {
           function handleAddToArchiveSwitchValueOn(name, newValue, selector, initialValue) {
             if (newValue !== '') {
               if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
                 const label = selector.attr('data-label');
                 updateModelArchiveEntry(label, name, initialValue, newValue, null, false, true)
                     .then(succeeded => {
                       if (!succeeded) {
                         selector.focus();
                       }
                     });
               }
             }
           }
 
           function handleAddToArchiveSwitchValueOff(name, newValue, selector, initialValue) {
             if (!isEditing()) {
               self.createForm.backingDataAttributeValueChanged(name, newValue);
             }
             self[`${PageDefinitionCommon.FIELD_VALUES}${name}`](newValue);
             selector.attr('data-initial-value', initialValue);
             if (!self.dirtyFields.has(name)) self.dirtyFields.add(name);
             if(isEditing()){
              unsetProperty({field: name, disabled: false, unset: true});
             }
             onBlurFormLayout({target: {id: name, type: 'blur', cancelable: false, cancelBubble: true}});
           }
           const name = this.id;
           const newValue = (CoreUtils.isNotUndefinedNorNull(event.target.value) ? event.target.value.trim() : '');
           const selector = $(`#${name}`);
           const initialValue = (selector.attr('data-initial-value') !== 'null' ? selector.attr('data-initial-value') : '');
           const completedRequiredFields = requiredFieldsComplete(name, newValue);
           const fieldName = name.replace('Verify', '');
           let fieldValue = self[`${PageDefinitionCommon.FIELD_VALUES}${fieldName}`]();
           const field = document.querySelector(`#${fieldName}`);
 
           if (!completedRequiredFields) {
             if (event.self) event.self.stopImmediatePropagation();
             if (!isEditing()) {
               self.createForm.backingDataAttributeValueChanged(name, initialValue);
             }
             if (!self.dirtyFields.has(name)) self.dirtyFields.add(name);
           }
           else {
             const addToArchiveSwitchValue = getAddToArchiveSwitchValue(name);
             if (addToArchiveSwitchValue && newValue !== '') {
               handleAddToArchiveSwitchValueOn(name, newValue, selector, initialValue);
             }
             else if (addToArchiveSwitchValue && newValue === '') {
                // If the source path is blanked in edit when the archive switch is ON
                // remove the field from the archive by treating it like the button is OFF
                handleAddToArchiveSwitchValueOff(name, newValue, selector, initialValue);
                if (isEditing()){
                  const dataProvider = self.wdtForm.getDataProvider();
                  const modelArchiveEntries = dataProvider.modelArchiveEntries || [];

                  //checking if there is an archive entry, if not, add one 
                  //this is a bug fix for the instance where a user manually clears out 
                  //the path in post create 
                  if (modelArchiveEntries.length === 0) {
                    // Add fieldValue as a new entry with archivePath set to fieldValue
                    modelArchiveEntries.push({archivePath: fieldValue });
                  }
                  const indexesToRemove = [];
                  modelArchiveEntries.forEach((modelArchiveEntry, index) => {
                    if (modelArchiveEntry.archivePath === initialValue) {
                      indexesToRemove.push(index);
                    }
                  });

                  // Removing in reverse order to avoid index shifting
                  for (let i = indexesToRemove.length - 1; i >= 0; i--) {
                    const index = indexesToRemove[i];
                    self.wdtForm.deleteModelArchiveEntry([fieldValue], self.wdtForm);
                    modelArchiveEntries.splice(index, 1);
                  }
                  fieldValue = '';
                }
             }
             else {
                handleAddToArchiveSwitchValueOff(name, newValue, selector, initialValue);
            }
           }
         }
 
         function onBlurFormLayout(event) {
           let losingFocusId = event.target.id;
           if (losingFocusId) {
             if (losingFocusId === self.propertyListName) {
               if (!self.dirtyFields.has(losingFocusId)) {
                 self.dirtyFields.add(losingFocusId);
               }
             }
           }
 
           const hasLosingFocusId = (self.dirtyFields.has(losingFocusId) && losingFocusId.indexOf('|') === -1);
 
           if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
             if (hasLosingFocusId) {
               viewParams.signaling.unsavedChangesDetected.dispatch(exitForm);
               if (isEditing()) {
                 if (isWdtForm() && event.relatedTarget !== null) {
                   const eventType = (ViewModelUtils.isElectronApiAvailable() ? 'autoDownload' : 'autoSave');
                   updateContentFile(eventType).then(reply => {});
                 }
               }
               else if (ViewModelUtils.isElectronApiAvailable()) {
                 // Need to disable the Electron submenu items, because
                 // we're in a create form, data has been entered, and
                 // focus has left the form. This is an ANA scenario.
                 notifyUnsavedChanges(true);
               }
             }
             else if (ViewModelUtils.isElectronApiAvailable()) {
               if (event?.relatedTarget?.tagName === 'A') {
                 // User clicked a selectable node in the navtree, and
                 // we're not in a UCD, CND or ANA situation. Need to
                 // enable the Electron submenu items.
                 // setSubmenuItemsState(true);
               }
               else if (event?.relatedTarget?.className === 'oj-button-button') {
                 // User clicked a button in the content area header
                 // (e.g. "Home"), and we're not in a UCD, CND or ANA
                 // situation. Need to enable the Electron submenu items.
                 //setSubmenuItemsState(true);
               }
             }
           }
           else if (losingFocusId.indexOf('|') === -1) {
             if (event.target.type === 'checkbox' && ['availableCheckboxset', 'chosenCheckboxset'].indexOf(event.target.name) === -1) {
               losingFocusId = event.target.value;
               if (!self.dirtyFields.has(losingFocusId)) self.dirtyFields.add(losingFocusId);
             }
             else if (['Source', 'SourcePath'].includes(losingFocusId)) {
               const selector = $(`#${losingFocusId}`);
               let newValue = self[`${PageDefinitionCommon.FIELD_VALUES}${losingFocusId}`]();
               if (newValue) newValue = newValue.trim();
               const rtnval = requiredFieldsComplete(losingFocusId, newValue);
               if (!rtnval) {
                 return ViewModelUtils.cancelEventPropagation(event);
               }
             }
 
             if (losingFocusId) {
               if (!isEditing()) {
                 const isExiting = (CoreUtils.isNotUndefinedNorNull(event.relatedTarget) && ['oj-tabbar-item-content', 'oj-navigationlist-item-content', 'oj-searchselect-filter'].some(item => event.relatedTarget.className.includes(item)));
                 if (isExiting) {
                   if (self.dirtyFields.size > 0) {
                     setFocusFormElement();
                     self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-unsaved-changes.titles.unsavedChanges.value'));
                     self.i18n.dialog.prompt(oj.Translations.getTranslatedString('wrc-unsaved-changes.prompts.uncommitedCreate.abandonForm.value', self.rdjData.createForm.label));
                     self.i18n.buttons.cancel.visible(true);
                     UnsavedChangesDialog.showConfirmDialog('AbandonCreateForm', self.i18n)
                         .then(reply => {
                           switch(reply.exitButton) {
                             case 'yes': {
                               const pageState = self.createForm.markAsFinished();
                               if (pageState.succeeded) {
                                 updateContentFile('autoDownload').then(reply => {});
                               }
                             }
                               break;
                             case 'no':
                               cancelBean('autoDownload');
                               break;
                             case 'cancel':
                               ViewModelUtils.cancelEventPropagation(event);
                               break;
                           }
                         });
                   }
                 }
               }
               else {
                 if (losingFocusId !== self.propertyListName && event.target.type !== 'checkbox') {
                   if (CoreUtils.isNotUndefinedNorNull(self[`${PageDefinitionCommon.FIELD_VALUES}${losingFocusId}`])) {
                     const value = self[`${PageDefinitionCommon.FIELD_VALUES}${losingFocusId}`]();
                     if (typeof value === 'string' && !CoreUtils.isEmpty(value) &&
                         value.startsWith('@@PROP:') && value.endsWith('@@'))
                     {
                       const varName = self.wdtForm.stripOutSign(value);
                       const varValue = self.wdtForm.getModelPropertyValue(varName);
                       if (CoreUtils.isUndefinedOrNull(varValue)){
                         self.wdtForm.addModelProperty(varName);
                         self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${losingFocusId}`]('fromModelToken');
                       }
                     }
                   }
                 }
                 updateContentFile('autoDownload').then(reply => {});
               }
             }
           }
         }
 
         function createPolicyFormLayout(options, pdjData, rdjData) {
           const div = document.createElement('div');
           div.setAttribute('id', 'cfe-form');

           if (CoreUtils.isNotUndefinedNorNull(self.policyForm)) {
             const pdjTypes = new PageDataTypes(pdjData.sliceForm.properties, viewParams.perspective.id);
             const results = self.policyForm.createPolicyFormLayout(
               options,
               pdjTypes,
               rdjData,
               pdjData,
               populateFormLayout
             );
             self.actionButtonSet.html({view: HtmlUtils.stringToNodeArray(results.html.innerHTML), data: self});
             self.actionButtonSet.buttonSetItems = results.buttonSetItems;
 
             div.append(results.formLayout);
           }
 
           return div;
         }
 
         function renderWizardForm(rdjData) {
           const div = document.createElement('div');
           div.setAttribute('id', 'cfe-form');

           //wizard form always use single column. If this is changed, the param calling populateFormLayout will need to change.
           const formLayout = PageDefinitionFormLayouts.createWizardFormLayout({labelWidthPcnt: '32%', maxColumns: '1'});
           div.append(formLayout);
 
           document.documentElement.style.setProperty('--form-input-min-width', '25em');
           let properties = self.createForm.getRenderProperties();
           // Obtain the payload and flag that scrubData is not needed for rendering
           const results = getCreateFormPayload(properties, false);
 
           self.formToolbarModuleConfig
             .then((moduleConfig) => {
               moduleConfig.viewModel.resetButtonsDisabledState([{
                 id: 'finish',
                 disabled: !self.createForm.getCanFinish()
               }]);
             });
 
           properties = results.properties;
           const dataPayload = results.data;
 
           for (const [key, value] of Object.entries(dataPayload)) {
             if (CoreUtils.isNotUndefinedNorNull(value) && typeof value.value !== 'undefined') {
               if (typeof rdjData.data[key] === 'undefined') {
                 rdjData.data[key] = {value: undefined};
               }
               rdjData.data[key].value = value.value;
             }
           }
 
           const pdjTypes = new PageDataTypes(properties, viewParams.perspective.id);
           if (isWdtForm()) self.wdtForm.setPdjTypes(pdjTypes);
 
           if (typeof rdjData.data !== 'undefined') {
             if (isWdtForm()) self.doWdtDialogPopup = false;
             //formLayout is built as single column, so just pass in the params as true.
             populateFormLayout(properties, formLayout, pdjTypes, rdjData.data, true, false)
           }
 
           return div;
         }
 
         function createVerifyPathProperty(name, label, field) {
           return {
             name: name,
             type: 'boolean',
             label: label,
             helpSummaryHTML: `Determines whether the ${field} field value should be added to the archive file, or not. The default (enabled) means that the local file system path will be added to the archive and the ${field} field value will be converted to the relative path into the archive file. When disabled, the ${field} field value will be treated as a path that is available on every machine or container to which the deployment is targeted and not try to add it to the archive file.`,
             detailedHelpHTML: `<p>Determines whether the ${field} field value should be added to the archive file, or not. The default (enabled) means that the local file system path will be added to the archive and the ${field} field value will be converted to the relative path into the archive file. When disabled, the ${field} field value will be treated as a path that is available on every machine or container to which the deployment is targeted and not try to add it to the archive file.</p>`,
             readOnly: false,
             supportsModelTokens: false
           };
         }
 
         function renderForm(pdjData, rdjData) {
           const div = document.createElement('div');
           div.setAttribute('id', 'cfe-form');

           const includeAdvancedFields = (self.showAdvancedFields().length !== 0);
           const properties = getSliceProperties(pdjData, includeAdvancedFields);
 
           if (isWdtForm() && window?.api?.ipc &&
               Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name &&
               rdjData.navigation.match(/^Deployments\/[AppDeployments|Libraries]/)) {
 
             let index = properties.map(property => property.name).indexOf('SourcePath');
             if (index !== -1) {
               properties[index].type = 'fileContents';
               properties[index].supportsModelTokens = true;
               properties[index].readOnly = false;
               const index1 = properties.map(property => property.name).indexOf('VerifySourcePath');
               if (index1 === -1) {
                 const property = createVerifyPathProperty('VerifySourcePath', 'Add Source Path to Archive', 'Source Path');
                 property.required = false;
                 pdjData.sliceForm.properties.splice(index, 0, property);
                 const value = self.perspectiveMemory.computeAddToArchiveSwitchValue.call(self.perspectiveMemory, rdjData.data['Name'].value, 'SourcePath', rdjData.data['SourcePath'].value);
                 rdjData.data['VerifySourcePath'] = {set: false, value: value};
               }
             }
             index = properties.map(property => property.name).indexOf('PlanPath');
             if (index !== -1) {
               properties[index].type = 'fileContents';
               properties[index].supportsModelTokens = true;
               properties[index].readOnly = false;
               const index1 = properties.map(property => property.name).indexOf('VerifyPlanPath');
               if (index1 === -1) {
                 const property = createVerifyPathProperty('VerifyPlanPath', 'Add Plan Path to Archive', 'Plan Path');
                 property.required = false;
                 pdjData.sliceForm.properties.splice(index, 0, property);
                 const value = self.perspectiveMemory.computeAddToArchiveSwitchValue.call(self.perspectiveMemory, rdjData.data['Name'].value, 'PlanPath', rdjData.data['PlanPath'].value);
                 rdjData.data['VerifyPlanPath'] = {set: false, value: value};
               }
             }
           }
 
           // Setup PDJ type information for the properties being handled on this form
           const pdjTypes = new PageDataTypes(properties, viewParams.perspective.id);
           if (isWdtForm()) self.wdtForm.setPdjTypes(pdjTypes);
 
           let formLayout = null;
 
           const isUseCheckBoxesForBooleans = PageDefinitionFormLayouts.hasFormLayoutType(pdjData, 'useCheckBoxesForBooleans');
           const isSingleColumn = PageDefinitionFormLayouts.hasFormLayoutType(pdjData, 'singleColumn');
           const hasFormLayoutSections = PageDefinitionFormLayouts.hasFormLayoutSections(pdjData);
           const isReadOnly = (self.readonly() && (['configuration', 'view', 'security', 'composite'].indexOf(viewParams.perspective.id) !== -1));
 
           const isSliceTable = self.isSliceTable(pdjData);
 
           if (isSliceTable) {
             const sliceTableFormLayout = PageDefinitionFormLayouts.createSliceTableFormLayout(
               {
                 onMenuAction: '[[onContextMenuAction]]',
                 onBeforeOpen: '[[onContextMenuBeforeOpen]]',
                 menuItems: [
                   {
                     id: self.i18n.contextMenus.copyCellData.id,
                     iconFile: self.i18n.contextMenus.copyCellData.iconFile,
                     label: self.i18n.contextMenus.copyCellData.label
                   },
                   {
                     id: self.i18n.contextMenus.copyRowData.id,
                     iconFile: self.i18n.contextMenus.copyRowData.iconFile,
                     label: self.i18n.contextMenus.copyRowData.label
                   }
                 ]
               }
             );
             populateSliceTableFormLayout(
               sliceTableFormLayout,
               properties,
               pdjTypes,
               rdjData,
               {
                 rowSelectionRequired: DeclarativeActionsManager.isRowSelectionRequired(pdjData)
               }
             );
             div.append(sliceTableFormLayout);
             return div;
           }
 
           if (hasFormLayoutSections) {
             formLayout = PageDefinitionFormLayouts.createSectionedFormLayout({
               labelWidthPcnt: '45%',
               maxColumns: '1',
               isReadOnly: isReadOnly,
               isSingleColumn: isSingleColumn,
               isEditing: isEditing()
             }, pdjTypes, rdjData, pdjData, populateFormLayout);
             div.append(formLayout);
             document.documentElement.style.setProperty('--form-input-min-width', '15em');
           }
           else if (isUseCheckBoxesForBooleans) {
             formLayout = PageDefinitionFormLayouts.createCheckBoxesFormLayout({labelWidthPcnt: '45%', maxColumns: '1'});
             div.append(formLayout);
           }
           else {
             if (isSingleColumn) {
               const options = {
                 labelWidthPcnt: '32%',
                 maxColumns: '1'
               };
               if (properties.filter(property => ['ThreadStackDump','DeploymentPlan'].includes(property.name)).length > 0) {
                 options.labelWidthPcnt = '18%';
               }
               formLayout = PageDefinitionFormLayouts.createSingleColumnFormLayout(options);
               div.append(formLayout);
//MLW               document.documentElement.style.setProperty('--form-input-min-width', '32em');
             }
             else {
               formLayout = PageDefinitionFormLayouts.createTwoColumnFormLayout({labelWidthPcnt: '45%', maxColumns: '2'});
               div.append(formLayout);
               document.documentElement.style.setProperty('--form-input-min-width', '15em');
             }
           }
 
           if (isUseCheckBoxesForBooleans) {
             const debugFlagsCheckboxSet = PageDefinitionFields.createDebugFlagsCheckboxset(properties, rdjData.data, {isReadOnly: isReadOnly});
             const field = debugFlagsCheckboxSet.field;
             self.debugFlagsEnabled(debugFlagsCheckboxSet.debugFlagsEnabled);
             self.debugFlagItems(debugFlagsCheckboxSet.dataProvider);
             formLayout.append(field);
           }
           else {
             if (!hasFormLayoutSections && CoreUtils.isNotUndefinedNorNull(rdjData.data)) {
               if (isWdtForm()) self.doWdtDialogPopup = false;
               populateFormLayout(properties, formLayout, pdjTypes, rdjData.data, isSingleColumn, isReadOnly);
             }
           }
           return div;
         }
 
         this.onContextMenuAction = (event) => {
           const ele = document.getElementById('table');
           if (ele !== null) {
             let clipboardData = ele.getAttribute('data-clipboard-copycelldata');
             const menuItemId = event.detail.selectedValue;
             if (menuItemId === 'copyRowData') {
               clipboardData = ele.getAttribute('data-clipboard-copyrowdata');
             }
 
             ViewModelUtils.blurActiveElement();
             ViewModelUtils.copyToClipboard(clipboardData)
               .then(() => {
                 const message = {
                   severity: 'confirmation',
                   message: oj.Translations.getTranslatedString('wrc-common.messages.copiedToClipboard.detail')
                 };
                 MessageDisplaying.displayMessage({
                   severity: message.severity,
                   summary: message.message
                 }, 2500);
               })
               .catch(failure => {
                 ViewModelUtils.failureResponseDefaultHandling(failure);
               });
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
 
         function createFieldValueSubscription(valueSubscriptions, name, replacer) {
           // Check if the subscription already exists and simply return
           const subscribed = valueSubscriptions.find(sub => sub.name === name);
           if (CoreUtils.isNotUndefinedNorNull(subscribed)) return;
           // Define the callback function used when the field is updated
           const updatedFieldValueCallback = (newValue) => {
             if (self.resetUnsetFieldFlag) {
               // Skip the field value update processsing when resetting
               // an unset field to that field's default value. The
               // reset flag is set and cleared by resetUnsetFieldToDefault
               return;
             }
             self.dirtyFields.add(name);
             let replacer = name;
             if (isWizardForm()) {
               replacer = self.createForm.getBackingDataAttributeReplacer(name);
               if (typeof replacer === 'undefined') replacer = name;
             }
             if (isWdtForm()) {
               let testShow = self.wdtForm.shouldShowDialog(self.doWdtDialogPopup, name, newValue, self.createForm);
               if (testShow.shouldShow) {
                 //the observed value has changed to the new value, we need to set the From to match that.
                 self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${replacer}`](testShow.from);
                 const pageProp = hasPagePropVariables();
                 const result = self.wdtForm.formFieldValueChanged(name, newValue, pageProp);
                 displayAndProcessWdtDialog(result, true);
                 if (isWizardForm()) {
                   newValue = self[`${PageDefinitionCommon.FIELD_VALUES}${replacer}`]();
                   self.createForm.backingDataAttributeValueChanged(name, newValue);
                 }
                 return;
               }
               else {
                 if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name){
                   //If the user empties the field through the form, instead of using the dialog to unset the properties,
                   //we want to set treat that as 'unset', otherwise when writing out to the model file,
                   //the field will be included with no value, and validate model will fail.
                   const ntrim = ((newValue && typeof newValue === 'string')  ? newValue.trim(): newValue);
                   if (ntrim === '') {
                     unsetProperty(PageDefinitionUnset.getPropertyAction(name));
                     self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${replacer}`]('fromRegValue');
                   }
                 }
                 //we  want to set the valueFrom, then continue with the rest of the code as normal.
                 if (CoreUtils.isNotUndefinedNorNull(testShow.from)) {
                   self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${replacer}`](testShow.from);
                 }
                 if (replacer.indexOf('Verify') !== -1) {
                   const index = replacer.indexOf('Verify');
                   const fieldName = replacer.substring(index + 6);
                   setAddToArchiveSwitchValue(fieldName, newValue);
                   if (!newValue) {
                     $(`#${fieldName}`).attr('data-initial-value', self[`${PageDefinitionCommon.FIELD_VALUES}${fieldName}`]());
                   }
                 }
                 if (isWizardForm()) {
                   newValue = self[`${PageDefinitionCommon.FIELD_VALUES}${replacer}`]();
                   self.createForm.backingDataAttributeValueChanged(name, newValue);
                   return;
                 }
               }
             }
             else {
               if (isWizardForm()) {
                 self.createForm.backingDataAttributeValueChanged(name, newValue);
                 return;
               }
             }
             if (CoreUtils.isUndefinedOrNull(self.optionsSources)) {
               self.optionsSources = new PageDefinitionOptionsSources();
             }
             self.optionsSources.propertyValueChanged(name, newValue);
             resetSaveButtonDisabledState({disabled: false});
 
             if ((CoreUtils.isNotUndefinedNorNull(self[`${PageDefinitionCommon.FIELD_UNSET}${name}`]) && !self[`${PageDefinitionCommon.FIELD_UNSET}${name}`]())) {
               const rdjData = viewParams.parentRouter?.data?.rdjData();
               if (!rdjData?.navigation.startsWith('Dashboards')) {
                 // This means the user is changing the value
                 // of fields on the form, not inside the WDT
                 // settings dialog box.
                 PageDefinitionUnset.addPropertyHighlight(name);
                 self[`${PageDefinitionCommon.FIELD_VALUE_SET}${name}`](true);
               }
             }
             viewParams.signaling.unsavedChangesDetected.dispatch(exitForm);
             resetAutoSyncToolbarIconsState();
 
             if (isEditing()){
               if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name && isWdtForm()) {
                 onBlurFormLayout({target: {id: name, type: 'blur', cancelable: false, cancelBubble: true}});
               }
               else if (ViewModelUtils.isElectronApiAvailable()) {
                 notifyUnsavedChanges(self.isDirty());
               }
             }
           };
 
           // Subscribe to the field then store the subscription with the field name
           const subscription = self[`${PageDefinitionCommon.FIELD_VALUES}${replacer}`].subscribe(updatedFieldValueCallback);
           valueSubscriptions.push({ name: name, subscription: subscription });
         }
 
         function processRemovedField(name) {
           // Remove the subscription that exists for the removed field
           let index = self.valueSubscriptions.findIndex(sub => sub.name === name);
           if (index !== -1) {
             self.valueSubscriptions[index].subscription.dispose();
             self.valueSubscriptions.splice(index, 1);
             self.dirtyFields.delete(name);
           }
           let replacer = self.createForm.getBackingDataAttributeReplacer(name);
           if (typeof replacer === 'undefined') replacer = name;
           if (typeof self[`${PageDefinitionCommon.FIELD_VALUES}${replacer}`] !== 'undefined') delete self[`${PageDefinitionCommon.FIELD_VALUES}${replacer}`];
           if (typeof self[`${PageDefinitionCommon.FIELD_SELECTDATA}${replacer}`] !== 'undefined') delete self[`${PageDefinitionCommon.FIELD_SELECTDATA}${replacer}`];
           if (typeof self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${replacer}`] !== 'undefined') delete self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${replacer}`];
           if (typeof self[`${PageDefinitionCommon.FIELD_VALUE_SET}${replacer}`] !== 'undefined') delete self[`${PageDefinitionCommon.FIELD_VALUE_SET}${replacer}`];
           if (typeof self[`${PageDefinitionCommon.FIELD_MESSAGES}${replacer}`] !== 'undefined') {
             index = self.dynamicMessageFields.indexOf(self[`${PageDefinitionCommon.FIELD_MESSAGES}${replacer}`]);
             if (index !== -1) self.dynamicMessageFields.splice(index, 1);
             delete self[`${PageDefinitionCommon.FIELD_MESSAGES}${replacer}`];
           }
 
           index = self.perspectiveMemory.nthChildrenItems.call(self.perspectiveMemory).map(nthChild1 => nthChild1.name).indexOf(replacer);
           if (index !== -1) self.perspectiveMemory.nthChildrenItems.call(self.perspectiveMemory).splice(index, 1);
 
           if (CoreUtils.isNotUndefinedNorNull(self.multiSelectControls[replacer])) {
             delete self.multiSelectControls[replacer];
           }
         }
 
         function populateFormLayout(properties, formLayout, pdjTypes, dataValues, isSingleColumn, isReadOnly) {
 
           for (let i = 0; i < properties.length; i++) {
             let name = properties[i].name;
 
             const helpInstruction = PageDefinitionFields.createHelpInstruction(name, pdjTypes);
 
             let replacer = name, labelEle, field, value, container, createValue = null;
 
             if (isWizardForm()) {
               const result = self.createForm.getBackingDataAttributeReplacer(replacer);
               if (typeof result !== 'undefined') replacer = result;
               if (typeof self[PageDefinitionCommon.FIELD_VALUES + replacer] === 'undefined') {
                 // Add name to wizard page in backing data
                 self.createForm.addBackingDataPageData(name);
               }
             }
 
             const observableNameValueFrom = `${PageDefinitionCommon.FIELD_VALUE_FROM}${replacer}`;
             const observableNameValueSet = `${PageDefinitionCommon.FIELD_VALUE_SET}${replacer}`;
 
             if (pdjTypes.isPolicyExpression(name)) {
               value = self.policyData.getStringExpression(name);
             }
             else {
               // Get the text display value for the data or null
               value = pdjTypes.getDisplayValue(name, dataValues[name]);
             }
 
             if (value === null) value = '';
             let field_inputTextForBoolean = null;
 
             // special case... if there is only one read-only field that
             // is an array, display it as a table.
             let tableProperty = false;
             if (properties.length === 1 && pdjTypes.isReadOnly(name) && pdjTypes.isArray(name)) {
               const singlePropertyTable = PageDefinitionFields.createSinglePropertyTable(name, value, pdjTypes);
               tableProperty = singlePropertyTable.property;
               self.singlePropertyTableDataProvider = singlePropertyTable.dataProvider;
               self.singlePropertyTableColumns = singlePropertyTable.columns;
               field = singlePropertyTable.field;
             }
             else if (pdjTypes.isBooleanType(name) && (!pdjTypes.isReadOnly(name)) && (!isReadOnly)) {
               field = PageDefinitionFields.createSwitch({'className': 'cfe-form-switch', 'disabled': false});
               if (isWdtForm() && pdjTypes.isSupportsModelTokens(name)) {
                 const options = {
                   'className': 'cfe-form-input-text',
                   'placeholder': name,
                   'readonly': true,
                 };
                 field_inputTextForBoolean = PageDefinitionFields.createInputText(options);
               }
               else if (isWdtForm() &&  window?.api?.ipc &&
                   Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name &&
                   name.startsWith('Verify')
               ) {
                 field.setAttribute('on-value-changed','[[addToArchiveSwitchValueChanged]]');
               }
             }
             else if (pdjTypes.isDynamicEnumType(name) || pdjTypes.hasLegalValues(name)) {
               if (pdjTypes.isArray(name)) {
                 const multiSelect = PageDefinitionFields.createMultiSelect(dataValues, name, pdjTypes);
 
                 field = multiSelect.field;
                 field.setAttribute('available-items', '[[multiSelectControls.' + name + '.availableItems]]');
                 field.setAttribute('chosen-items', '[[multiSelectControls.' + name + '.chosenItems]]');
                 field.setAttribute('on-chosen-items-changed', '[[chosenItemsChanged]]');
                 field.setAttribute('readonly', self.readonly());
 
                 self.multiSelectControls[name] = {
                   availableItems: multiSelect.availableItems,
                   chosenItems: multiSelect.chosenItems,
                   origChosenLabels: multiSelect.origChosenLabels
                 };
                 self.perspectiveMemory.upsertNthChildrenItem.call(self.perspectiveMemory, {
                   name: name,
                   row: parseInt(i) + 1,
                   col: 2,
                   minHeight: '240px'
                 });
 
                 if (CoreUtils.isUndefinedOrNull(self[observableNameValueFrom])) {
                   self[observableNameValueFrom] = ko.observable();
                 }
                 const observableNameValue = `${PageDefinitionCommon.FIELD_VALUES}${name}`;
                 if (CoreUtils.isUndefinedOrNull(self[observableNameValue])) {
                   self[observableNameValue] = ko.observable();
                   self[observableNameValue]('');
                 }
                 if (isWdtForm() && (CoreUtils.isNotUndefinedNorNull(dataValues[name].modelToken))){
                   self[observableNameValueFrom]('fromModelToken');
                   self[observableNameValue](dataValues[name].modelToken);
                   field.setAttribute('readonly', true);
                 } else {
                   self[observableNameValueFrom]('fromRegValue');
                 }
               }
               else {
                 const dataProviderName = `${PageDefinitionCommon.FIELD_SELECTDATA}${replacer}`;
                 const options = {
                   'name': name,
                   'isEdit': (CoreUtils.isNotUndefinedNorNull(self.pdjData.sliceForm) || CoreUtils.isNotUndefinedNorNull(self.pdjData.sliceTable)),
                   'isSingleColumn': isSingleColumn,
                   'isReadOnly': isReadOnly
                 };
 
                 let singleSelect;
                 if (pdjTypes.isSupportsModelTokens(name) || pdjTypes.isSupportsUnresolvedReferences(name)) {
                   singleSelect = PageDefinitionFields.createComboOne(pdjTypes, value, dataValues, options);
                   self[dataProviderName] = singleSelect.dataProvider;
                   field = singleSelect.field;
                   field.setAttribute('options', '[[' + dataProviderName + ']]');
                 } else {
                   singleSelect = PageDefinitionFields.createSingleSelect(pdjTypes, value, dataValues, options);
                   self[dataProviderName] = singleSelect.dataProvider;
                   field = singleSelect.field;
                   field.setAttribute('data', '[[' + dataProviderName + ']]');
                 }
 
                 if (typeof field.defaultForCreate !== 'undefined') {
                   if (field.defaultForCreate !== value) {
                     createValue = field.defaultForCreate;
                     // Convert legal values with int type for observable.
                     if (pdjTypes.isNumberType(name)) createValue = Number(createValue);
                   }
                 }
               }
             }
             else if (pdjTypes.isSecretType(name)) {
               field = PageDefinitionFields.createInputPassword('cfe-form-input-password', pdjTypes.isReadOnly(name) || isReadOnly);
             }
             else if ((pdjTypes.isArray(name) && !pdjTypes.isPropertiesType(name)) ||
               pdjTypes.isMultiLineStringType(name) ||
               pdjTypes.isThrowableType(name)
             ) {
               const options = {
                 'className': 'cfe-form-input-textarea',
                 'resize-behavior': 'vertical',
                 'placeholder': pdjTypes.getInLineHelpPresentation(name),
                 'readonly': pdjTypes.isReadOnly(name) || isReadOnly
               };
               if (pdjTypes.isMultiLineStringType(name) && isSingleColumn) {
                 options['resize-behavior'] = 'both';
                 const lineBreaksCount = PageDefinitionUtils.getLineBreaksCount(dataValues[name].value);
                 if (lineBreaksCount !== -1) {
                   options['rows'] = (lineBreaksCount > 20 ? 20 : lineBreaksCount);
                 }
               }
               field = PageDefinitionFields.createTextArea(options);
               field.setAttribute('title', value);
               let nthChild = self.perspectiveMemory.getNthChildrenItem.call(self.perspectiveMemory, name);
               if (typeof nthChild === 'undefined') {
                 // Setup the nthChild based on the form using one or two fields per row
                 let fieldIndex = parseInt(i) + 1;
                 let fieldRow = (isSingleColumn ? fieldIndex : Math.round(fieldIndex / 2));
                 let fieldColumn = (isSingleColumn || ((fieldIndex % 2) !== 0) ? 2 : 4);
                 nthChild = {name: name, row: fieldRow, col: fieldColumn, minHeight: '52px'};
               }
               self.perspectiveMemory.upsertNthChildrenItem.call(self.perspectiveMemory, nthChild);
             }
             else if (pdjTypes.isPropertiesType(name)) {
               const jsonString = JSON.stringify(dataValues[name].value);
               field = PageDefinitionFields.createPropertyListEditor( name, jsonString, pdjTypes.isReadOnly(name) || isReadOnly);
               field.setAttribute('id', name);
               self.propertyListName = name;
               if (CoreUtils.isUndefinedOrNull(self[observableNameValueFrom])) {
                 self[observableNameValueFrom] = ko.observable();
               }
               self[observableNameValueFrom]('fromRegValue');
             }
             else if (pdjTypes.isReadOnly(name)) {
               const options = {
                 'className': 'cfe-form-readonly-text',
                 'readonly': 'readonly'
               };
               field = PageDefinitionFields.createReadOnlyText(options);
               field.setAttribute('title', value);
             }
             else if (pdjTypes.isUploadedFileType(name)) {
               field = PageDefinitionFields.createFileChooser('cfe-file-picker');
               field.setAttribute('title', value);
 
               if (isWdtForm() && !isWizardForm() && name === 'PlanPath') {
                 const params = {
                   valueSet: true,
                   field: field,
                   readonly: false,
                   wktTool : Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name
                 };
                 // Apply the highlight and context menu for the property
                 PageDefinitionFields.addFieldContextMenu(name, params);
               }
             }
             else {
               const options = {
                 'className': pdjTypes.isNumberType(name) ? 'cfe-form-input-integer-sm' : 'cfe-form-input-text',
                 'placeholder': pdjTypes.getInLineHelpPresentation(name),
                 'readonly': isReadOnly
               };
               field = PageDefinitionFields.createInputText(options);
               field.setAttribute('title', value);
             }
 
             if (!tableProperty) {
               if ((!isSingleColumn && pdjTypes.isArray(name) && pdjTypes.isDynamicEnumType(name))
                   || (!isSingleColumn && pdjTypes.isPropertiesType(name)))
               {
                 // We're on a field associated with a cfe-multi-select or cfe-property-list-editor,
                 // so use modulus of i and 2 make odd remainders force
                 // a new div.
                 if ((i % 2) === 1) {
                   const div = document.createElement('div');
                   formLayout.append(div);
                 }
               }

               if (viewParams.perspective.id === 'modeling' && name === 'Upload') {
                 Logger.log('[FORM] Suppressing creation of "Upload" label!');
               }
               else if (viewParams.perspective.id === 'modeling' && name === 'NonNullStagingMode') {
                 Logger.log('[FORM] Suppressing creation of "NonNullStagingMode" label!');
               }
               else if (viewParams.perspective.id === 'modeling' && name === 'AdminMode') {
                 Logger.log('[FORM] Suppressing creation of "AdminMode" label!');
               }
               else if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name && name.indexOf('Verify') !== -1) {
                 Logger.log('[FORM] Suppressing creation of "VerifyXXX" field labels!');
               }
               else if (pdjTypes.isPropertiesType(name)) {
                 Logger.log('[FORM] Suppressing creation of "Properties" field labels!');
               }
               else {
                 // Append the help icon to the form layout, as it is
                 // always the first thing on a new row.
                 labelEle = PageDefinitionFields.createLabel(name, pdjTypes, helpInstruction);
                 formLayout.append(labelEle);
               }
             }
 
             if (typeof field !== 'undefined' &&
               field.className !== 'cfe-multi-select' &&
               field.className !== 'cfe-property-list-editor'
             ) {
               field.setAttribute('id', name);
               field.setAttribute('label-edge', 'provided');
 
               // Get the actual value for the observable to preserve type
               let observableValue = createValue;
               let observableValueFrom = 'fromRegValue';
               if (observableValue === null) {
                 if (isWdtForm()) {
                   observableValue = pdjTypes.getObservableValue_WDT(name, dataValues[name], value);
                   observableValueFrom = pdjTypes.getObservableValueFrom(dataValues[name]);
                 }
                 else {
                   observableValue = pdjTypes.getObservableValue(name, dataValues[name], value);
                 }
               }
               let isValueSet = true;
               if (CoreUtils.isNotUndefinedNorNull(dataValues[name]) && CoreUtils.isNotUndefinedNorNull(dataValues[name].set)) {
                 isValueSet = (dataValues[name].set);
               }
 
               const observableName = `${PageDefinitionCommon.FIELD_VALUES}${replacer}`;
               if (typeof self[observableName] !== 'undefined') {
                 if (!isWizardForm()) {
                   self[observableName](observableValue);
                   self[observableNameValueFrom](observableValueFrom);
                   self[observableNameValueSet](isValueSet);
                   //the above call actually triggers the subscription and mark this as dirty.
                   //since the value hasn't really changed, we need to remove it from the dirtyField list.
                   self.dirtyFields.delete(name);
                 }
               }
               else {
                 if (isWizardForm()) observableValue = '';
                 self[observableName] = ko.observable(observableValue);
                 self[observableNameValueFrom] = ko.observable(observableValueFrom);
                 self[observableNameValueSet] = ko.observable(isValueSet);
               }
 
               if (['Source', 'SourcePath', 'Plan', 'PlanPath'].includes(name) &&
                   Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
                 field.setAttribute('data-initial-value', dataValues[name].value);
                 field.setAttribute('data-label', properties[i].label);
                 field.setAttribute('data-required', properties[i].required);
               }
               else {
                 createFieldValueSubscription(self.valueSubscriptions, name, replacer);
               }
 
               if (isWizardForm()) {
                 if (self[`${PageDefinitionCommon.FIELD_VALUES}${replacer}`]() === '') {
                     self[`${PageDefinitionCommon.FIELD_VALUES}${replacer}`](dataValues[name].value);
                 }
               }
 
               field.setAttribute('value', `{{${PageDefinitionCommon.FIELD_VALUES}${replacer}}}`);
               field.setAttribute('messages-custom', `[[${PageDefinitionCommon.FIELD_MESSAGES}${replacer}]]`);
               field.setAttribute('display-options.messages', 'none');
 
               if (field_inputTextForBoolean !== null) {
                 field_inputTextForBoolean.setAttribute('value', `{{${PageDefinitionCommon.FIELD_VALUES}${replacer}}}`);
                 field_inputTextForBoolean.setAttribute('messages-custom', `[[${PageDefinitionCommon.FIELD_MESSAGES}${replacer}]]`);
                 field_inputTextForBoolean.setAttribute('display-options.messages', 'none');
               }
             }
 
             if (typeof field !== 'undefined') {
               var messageArea = document.createElement('div');
               messageArea.setAttribute('class', '');
               field.append(messageArea);
             }
 
             if (typeof self[`${PageDefinitionCommon.FIELD_MESSAGES}${replacer}`] === 'undefined') {
               self[`${PageDefinitionCommon.FIELD_MESSAGES}${replacer}`] = ko.observableArray([]);
               self.dynamicMessageFields.push(self[`${PageDefinitionCommon.FIELD_MESSAGES}${replacer}`]);
             }
 
             if (typeof field !== 'undefined') {
               if (pdjTypes.isUploadedFileType(name)) {
                 const params = {
                   field: field,
                   id: name,
                   choose: {
                     'on-click': '[[chooseFileClickHandler]]',
                     iconFile: self.i18n.icons.choose.iconFile,
                     tooltip: self.i18n.icons.choose.tooltip
                   }
                 };
                 if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name &&
                     ['Source', 'SourcePath'].includes(name)) {
                   params.choose['menu'] = {
                     'on-click': '[[launchFileChooserMenu]]',
                     items: [
                       {name: 'chooseFile', label: oj.Translations.getTranslatedString('wrc-common.menu.chooseFile.value')},
                       {name: 'chooseDir', label: oj.Translations.getTranslatedString('wrc-common.menu.chooseDir.value')}
                     ]
                   };
                 }
                 if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name &&
                     ['Plan','PlanPath'].includes(name)) {
                   params.choose['menu'] = {
                     'on-click': '[[launchFileChooserMenu]]',
                     items: [
                       {name: 'chooseFile', label: oj.Translations.getTranslatedString('wrc-common.menu.chooseFile.value')}
                     ]
                   };
                 }
                 if (!isEditing()) {
                   params['clear'] = {
                     'on-click': '[[clearChosenFileClickHandler]]',
                     iconFile: self.i18n.icons.clear.iconFile,
                     tooltip: self.i18n.icons.clear.tooltip
                   };
                 }
                 container = PageDefinitionFields.addUploadFileElements(params);
               }
               else {
                 let params = {
                   replacer: replacer,
                   field: field,
                   extraField: field_inputTextForBoolean,
                   showExtraField: (self[observableNameValueFrom]() === 'fromModelToken'),
                   readOnly: (pdjTypes.isReadOnly(name) || Runtime.isReadOnly()),
                   valueSet: pdjTypes.isValueSet(name, dataValues[name]),
                   restartRequired: (viewParams.perspective.id !== 'modeling') && (pdjTypes.isRestartNeeded(name)),
                   needsWdtIcon: needsWdtIcon(name, pdjTypes),
                   nameLabel: pdjTypes.getLabel(name),
                   supportsModelTokens: pdjTypes.isSupportsModelTokens(name),
                   supportsUnresolvedReferences: pdjTypes.isSupportsUnresolvedReferences(name),
                   valueFrom: pdjTypes.valueFrom(name, dataValues[name]),
                   wktTool : Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name,
                   showMoreIcon: (
                       pdjTypes.hasOptionsSources(name, dataValues[name])
                       && !pdjTypes.isReadOnly(name)
                       && !Runtime.isReadOnly()
                       && pdjTypes.isReferenceType(name)
                   ),
                   icons: {
                     restart: {iconFile: self.i18n.icons.restart.iconFile, tooltip: self.i18n.icons.restart.tooltip},
                     wdtIcon: {iconFile: self.i18n.icons.wdtIcon.iconFile, tooltip: self.i18n.icons.wdtIcon.tooltip},
                     more: {
                       iconFile: (pdjTypes.isReadOnly(name) || Runtime.isReadOnly() ? self.i18n.icons.more.iconFile.grayed : self.i18n.icons.more.iconFile.enabled),
                       iconClass: self.i18n.icons.more.iconClass,
                       tooltip: self.i18n.icons.more.tooltip
                     }
                   }
                 };
 
                 if (field.className !== 'cfe-multi-select' &&
                     field.className !== 'cfe-property-list-editor') {
                   if (params.showMoreIcon) {
                     self.optionsSources = new PageDefinitionOptionsSources();
                     params['moreMenuParams'] = self.optionsSources.getMoreMenuParams(name, pdjTypes.getLabel(name), dataValues[name], viewParams.perspective.id, pdjTypes.isReadOnly(name) || Runtime.isReadOnly());
                   }
 
                   // Apply the highlight and context menu for the property
                   PageDefinitionFields.addFieldContextMenu(name, params);
                 }
 
                 container = PageDefinitionFields.addFieldIcons(params);
               }
 
               if (!isWizardForm()) {
                 self[`${PageDefinitionCommon.FIELD_DISABLED}${name}`] = ko.observable(false);
                 field.setAttribute('disabled', `[[${PageDefinitionCommon.FIELD_DISABLED}${name}]]`);
 
                 // Track a field unset action which restores that value to the default setting
                 self[`${PageDefinitionCommon.FIELD_UNSET}${name}`] = ko.observable(false);
               }
 
               if ( (CoreUtils.isNotUndefinedNorNull(self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${name}`])) &&
                   (self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${name}`]() === 'fromModelToken')  &&
                   (field.className !== 'cfe-multi-select') &&
                   (field.className !== 'cfe-property-list-editor'))
               {
                 field.setAttribute('readonly', 'true');
               }
             }
 
             if (viewParams.perspective.id === 'modeling' && name === 'Upload') {
               Logger.log('[FORM] Suppressing display of "Upload" field!');
             }
             else if (viewParams.perspective.id === 'modeling' && name === 'NonNullStagingMode') {
               Logger.log('[FORM] Suppressing display of "Upload" field!');
             }
             else if (viewParams.perspective.id === 'modeling' && name === 'AdminMode') {
               Logger.log('[FORM] Suppressing display of "Upload" field!');
             }
             else if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name &&
                 name.indexOf('Verify') !== -1) {
               Logger.log('[FORM] Suppressing display of "VerifyXXX" fields!');
             }
             else if (pdjTypes.isPropertiesType(name)) {
               labelEle = PageDefinitionFields.createLabel(name, pdjTypes, helpInstruction);

               const options = {
                 name: `${name}-property-list-editor`,
                 labelWidthPcnt: (!isSingleColumn ? '50%' : '25%'),
                 maxColumns: '1'
               };
               const nestedFormLayout = PageDefinitionFormLayouts.createSingleColumnFormLayout(options);
               nestedFormLayout.append(labelEle);
               nestedFormLayout.append(field);

               container.append(nestedFormLayout);
               formLayout.append(container);

               const div = document.createElement('div');
               formLayout.append(div);
             }
             else {
               formLayout.append(container);
             }
 
           }  //end of for loops
           if (isWdtForm()) {
             self.doWdtDialogPopup = true;
           }
           if (!isWizardForm()) {
             PageDefinitionUsedIfs.setupUsedIfListeners(properties, isWdtForm(), self);
           }
         }
 
         function populateSliceTableFormLayout(sliceTableFormLayout, properties, pdjTypes, rdjData, params) {
           function createPagingHTML(sliceTableRows) {
             const paging = document.createElement('div');
             paging.setAttribute('id', 'paging');
             const span = document.createElement('span');
             span.innerText = oj.Translations.getTranslatedString('wrc-table.labels.totalRows.value', sliceTableRows.length);
             paging.append(span);
             return paging;
           }

           function getSliceTableRows(rdjData, properties) {
             const sliceTableRows = [];
 
             rdjData.data.forEach((dataValue) => {
               const rowObj = {};
               for (let i = 0; i < properties.length; i++) {
                 const name = properties[i].name;
                 let value;
 
                 // Get the text display value for the data or null
                 value = pdjTypes.getDisplayValue(name, dataValue[name]);
                 if (value === null) value = '';
                 rowObj[name] = value;
               }
 
               // Check and add the resource data for each data value
               const identityValue = (dataValue.identity ? dataValue.identity.value : null);
 
               if (CoreUtils.isNotUndefinedNorNull(identityValue)) {
                 rowObj['_identity'] = identityValue.resourceData;
               }
               else {
                 const identifierValue = (dataValue.identifier ? dataValue.identifier.value : null);
                 if (CoreUtils.isNotUndefinedNorNull(identifierValue)) {
                   rowObj['_identifier'] = identifierValue;
                 }
               }
 
               sliceTableRows.push(rowObj);
             });
 
             return sliceTableRows;
           }
 
           function getRowKey(rows) {
             let rowKey = '_rowIndex';
             if (Array.isArray(rows) && rows.length > 0) {
               if (CoreUtils.isNotUndefinedNorNull(rows[0]._identity)) {
                 rowKey = '_identity';
               }
               else if (CoreUtils.isNotUndefinedNorNull(rows[0]._identifier)) {
                 rowKey = '_identifier';
               }
             }
             return rowKey;
           }
 
           const sliceTableRows = getSliceTableRows(rdjData, properties);
           const rowKey = getRowKey(sliceTableRows);

           const selectableRows = sliceTableRows.filter(row => CoreUtils.isNotUndefinedNorNull(row[rowKey]));
           self['sliceTableDataProvider'] = new ArrayDataProvider(sliceTableRows);

           sliceTableFormLayout.setAttribute('data', '[[sliceTableDataProvider]]');
           sliceTableFormLayout.setAttribute('data-row-key', rowKey);
           sliceTableFormLayout.setAttribute('id', 'table');
           sliceTableFormLayout.setAttribute('class', 'wlstable');
           sliceTableFormLayout.setAttribute('aria-label', 'Table');
           sliceTableFormLayout.setAttribute('display', 'grid');
           sliceTableFormLayout.setAttribute('scroll-policy', 'loadMoreOnScroll');
           sliceTableFormLayout.setAttribute('scroll-policy-options', '{"fetchSize": 10000}');

           if (params.rowSelectionRequired) {
             sliceTableFormLayout.setAttribute('selection-mode', (selectableRows.length > 0 ? '{"row": "multiple"}' : '{"row": "none"}'));
             sliceTableFormLayout.setAttribute('on-checked-rows-changed', 'checkedRowsChanged');
           }
           else {
             sliceTableFormLayout.setAttribute('selection-mode', (selectableRows.length > 0 ? '{"row": "single"}' : '{"row": "none"}'));
           }

           sliceTableFormLayout.setAttribute('on-selected-changed', '[[sliceTableRowsSelectedChanged]]');
           sliceTableFormLayout.setAttribute('on-click', '[[sliceTableClickListener]]');
           sliceTableFormLayout.setAttribute('selected', '{{selectedRows}}');
           sliceTableFormLayout.setAttribute('columns', '[[columnDataProvider]]');

           const pagingHTML = createPagingHTML(sliceTableRows);
           sliceTableFormLayout.append(pagingHTML);

           self['sliceTableRowsSelectedChanged'] = (event) => {
             const onCheckedRowsChanged = event.target.attributes['on-checked-rows-changed'];
             if (CoreUtils.isNotUndefinedNorNull(onCheckedRowsChanged) &&
               CoreUtils.isNotUndefinedNorNull(onCheckedRowsChanged.value)
             ) {
               self[onCheckedRowsChanged.value](event);
             }
           };

           self['sliceTableClickListener'] = (event) => {
             if (CoreUtils.isNotUndefinedNorNull(event.target.cellIndex)) {
               const rowKeyName = event.currentTarget.attributes['data-row-key'].value;

               if (rowKeyName === '_identity') {
                 event.stopImmediatePropagation();
                 const keyValue = event.currentTarget.data.data[event.currentTarget.currentRow.rowIndex][rowKeyName];
                 if (CoreUtils.isNotUndefinedNorNull(keyValue)) {
                   viewParams.signaling.navtreeSelectionCleared.dispatch();
                   Router.rootInstance.go(`/${viewParams.perspective.id}/${encodeURIComponent(keyValue)}`);
                 }
               }
             }
           };

         }

         this.contextMenuClickListener = function (event) {
           event.preventDefault();
           unsetProperty(PageDefinitionUnset.getAction(event));
         };
 
         this.addToArchiveSwitchValueChanged = (event) => {
           // Compute field name using id of switch
           const fieldName = event.target.id.replace('Verify', '');
           // Get value of observable for field name
           const fieldValue = self[`${PageDefinitionCommon.FIELD_VALUES}${fieldName}`]();
           // See if fieldValue is undefined or null.
           if (fieldValue) {
             // It isn't, so get the DOM element for fieldName.
             const field = document.querySelector(`#${fieldName}`);
             const isArchivePath = (fieldValue.trim().startsWith('wlsdeploy/'));
             if (!isArchivePath) {
               // The value assigned to fileValue isn't an archive path.
               if (field !== null){
                 // The DOM element for the field isn't null, so see
                 // if the switch is in the ON position.
                 if (event.detail.value) {
                   // The switch is in the ON position, so go ahead
                   // and set the knockout observable behind the
                   // switch to true. We need to do that, because
                   // the code uses the knockout variable to determine
                   // the position of the switch, not the switch itself.
                   setAddToArchiveSwitchValue(fieldName, event.detail.value);
                 }
                 // We're here because isArchivePath is false. In
                 // that case, we assume fieldValue has been assigned
                 // the full path ta a file or directory, which the
                 // user wants to add as a model archive entry. The
                 // code in the onChangeLibAppDeploymentField()
                 // already does all that, so just create an trigger
                 // a 'change' event, programmatically.
                 const event1 = new Event('change', {bubbles: true});
                 // Trigger the 'change' event
                 field.dispatchEvent(event1);
                 // Set focus to field associated with switch,
                 // so that will be the field losing focus when
                 // a blur event happens.
                 field.focus();
               }
             }
 
             else {
               // The value assigned to fileValue is an archive path.
               if (field !== null) {
                 // The DOM element for the field isn't null, so see
                 // if the switch is in the OFF position.
                 if (!event.detail.value) {
                   // The switch is in the OFF position and fieldValue
                   // is an archive path, so go ahead and attempt to
                   // remove the model archive entry using it.
                   // Assign '' to the field associated with the switch.
                   if(isEditing()){
                    self.wdtForm.deleteModelArchiveEntry([fieldValue], self.wdtForm);
                   }
                   field.value = '';
                   // Create a 'change' event, programmatically.
                   const event1 = new Event('change', {bubbles: true});
                   // Trigger the 'change' event
                   field.dispatchEvent(event1);
                   // Set focus to field associated with switch,
                   // so that will be the field losing focus when
                   // a blur event happens.
                   field.focus();
                 }
               }
             }
           }
         };
 
 
         function getAddToArchiveSwitchValue(fieldName) {
           return self[`${PageDefinitionCommon.FIELD_VALUES}Verify${fieldName}`]();
         }
 
         function setAddToArchiveSwitchValue(fieldName, value) {
           // Sets the knockout observable behind the switch
           self[`${PageDefinitionCommon.FIELD_VALUES}Verify${fieldName}`](value)
           // Get value of 'Name' from RDJ
           const key = self.rdjData.data['Name'].value;
           // Sets the perspective memory associated with the
           // switch. Perspective memory has a scope that spans
           // clicking between the "Design View" and "Code View"
           // tabs, in the WKT-UI.
           self.perspectiveMemory.upsertAddToArchiveSwitchValue.call(self.perspectiveMemory, key, fieldName, value);
         }

         function addArchiveEntry(result, fieldName, initialValue) {
           const dataProvider = self.wdtForm.getDataProvider();
           if (CoreUtils.isUndefinedOrNull(dataProvider['modelArchiveEntries'])) {
             dataProvider.putValue('modelArchiveEntries', []);
           }
           const index = dataProvider.modelArchiveEntries.map(modelArchiveEntry => modelArchiveEntry.archivePath).indexOf(initialValue);
           if (index !== -1) {
             dataProvider.modelArchiveEntries.splice(index, 1);
           }
           const archiveEntry = {archivePath: result.archivePath, result: result};
           dataProvider.modelArchiveEntries.push(archiveEntry);
           $(`#${fieldName}`)
               .attr({
                 'data-initial-value': result.archivePath,
                 'title': result.archivePath
               });
         }
 
         function setArchiveEntryType(name, menuValue, path) {
           let entryType;
           switch (name) {
             case 'Source':
             case 'SourcePath':
               if (path.indexOf('Deployments/AppDeployments') !== -1) {
                 entryType = (menuValue === 'chooseFile' ? 'applicationFile' : 'applicationDir');
               }
               else {
                 entryType = (menuValue === 'chooseFile' ? 'sharedLibraryFile' : 'sharedLibraryDir');
               }
               break;
             case 'Plan':
             case 'PlanPath':
               entryType = 'applicationDeploymentPlan';
               break;
           }
           return entryType;
         }
 
         function updateModelArchiveEntry(fieldLabel, fieldName, initialValue, fieldValue, entryTypeName, showFileChooser, verifyEntry) {
           function setArchivePath(result) {
             result['archivePath'] = null;
 
             if (result.filePath) {
               let entryTypeBase;
 
               const fileName = result.filePath.replace(/^.*[\\/]/, '');
 
               if (fileName && fileName !== '') {
                 if (['sharedLibraryFile', 'sharedLibraryDir'].includes(result.archiveEntryType)) {
                   entryTypeBase = 'sharedLibraries';
                 } else if (['applicationFile', 'applicationDir', 'applicationDeploymentPlan'].includes(result.archiveEntryType)) {
                   entryTypeBase = 'applications';
                 }
                 result['archivePath'] = `wlsdeploy/${entryTypeBase}/${fileName}`;
               }
 
               if (CoreUtils.isUndefinedOrNull(entryTypeBase)) {
                 result['archivePath'] = result.filePath;
               }
             }
           }
 
           const processUserEnteredFilePath = (fieldLabel, fieldName, initialValue, fieldValue, entryTypeName) => {
             const result = {entryExists: false};
             const path = self.rdjData.navigation;
             window.api.path.exists(fieldValue)
                 .then(reply => {
                   result.entryExists = reply;
                   return reply;
                 })
                 .then(entryExists => {
                   if (entryExists) {
                     return window.api.path.isFile(fieldValue);
                   }
                   else {
                     return null;
                   }
                 })
                 .then(isFile => {
                   if (isFile) {
                     result['isFile'] = true;
                     result['isDirectory'] = false;
                     return false;
                   }
                   else if (isFile !== null) {
                     return window.api.path.isDirectory(fieldValue);
                   }
                 })
                 .then(isDirectory => {
                   if (isDirectory) {
                     result['isFile'] = false;
                     result['isDirectory'] = true;
                   }
                 })
                 .then(() => {
                   if (result.entryExists) {
                     result['menuValue'] = (result.isFile ? 'chooseFile' : 'chooseDir');
                     result['filePath'] = fieldValue;
                     result['archiveEntryType'] = setArchiveEntryType(fieldName, result.menuValue, path);
 
                     delete result.entryExists;
                     delete result.menuValue;
                     delete result.isFile;
                     delete result.isDirectory;
 
                     setArchivePath(result);
 
                     const displayedPath = result.archivePath;
                     addArchiveEntry(result, fieldName, initialValue);
                     self[`${PageDefinitionCommon.FIELD_VALUES}${fieldName}`](displayedPath);
                     if (!isEditing()) {
                       self.createForm.backingDataAttributeValueChanged(fieldName, displayedPath);
                     }
                     if (!self.dirtyFields.has(fieldName)) self.dirtyFields.add(fieldName);
                     onBlurFormLayout({target: {id: fieldName, type: 'blur', cancelable: false, cancelBubble: true}});
                   }
                   else {
                     const message = {
                       severity: 'warning',
                       summary: oj.Translations.getTranslatedString('wrc-view-model-utils.messages.pathNotFound.summary'),
                       detail: oj.Translations.getTranslatedString('wrc-view-model-utils.messages.pathNotFound.details', fieldValue)
                     };
                     ViewModelUtils.displayResponseMessage(message);
                   }
                   return true;
                 })
                 .catch(err => {
                   const message = {
                     severity: 'error',
                     summary: oj.Translations.getTranslatedString('wrc-view-model-utils.labels.unexpectedErrorResponse.value'),
                     detail: err
                   };
                   ViewModelUtils.displayResponseMessage(message);
                   return true;
                 });
           };
 
           const processUserChosenFilePath = (fieldLabel, fieldName, initialValue, fieldValue, entryTypeName) => {
             const options = { showChooser: showFileChooser};
             if (CoreUtils.isNotUndefinedNorNull(fieldValue) && fieldValue !== '') {
               options['providedValue'] = fieldValue;
             }
             window.api.ipc.invoke('wrc-get-archive-entry', entryTypeName, options)
                 .then(result => {
                   const addToArchiveSwitchValue = getAddToArchiveSwitchValue(fieldName);
                   let displayedPath;
                   // The value of result.filePath will be undefined, if the
                   // end-user clicked the "Cancel" button in the file chooser.
                   if (result.filePath) {
                     if (addToArchiveSwitchValue) {
                       setArchivePath(result);
                       displayedPath = result.archivePath;
                       addArchiveEntry(result, fieldName, initialValue);
                     }
                     else if (!addToArchiveSwitchValue){              
                        const dataProvider = self.wdtForm.getDataProvider();
                        const modelArchiveEntries = dataProvider.modelArchiveEntries || [];
                        if (modelArchiveEntries.length > 0) {
                          while (modelArchiveEntries.length > 0) {
                            const entry = modelArchiveEntries[0];
                            self.wdtForm.deleteModelArchiveEntry([entry.fieldName], self.wdtForm);
                            modelArchiveEntries.splice(0, 1);
                          }
                        }
                        displayedPath = result.filePath;
                     }
                     self[`${PageDefinitionCommon.FIELD_VALUES}${fieldName}`](displayedPath);
                     if (!isEditing()) {
                       self.createForm.backingDataAttributeValueChanged(fieldName, displayedPath);
                     }
                     if (!self.dirtyFields.has(fieldName)) self.dirtyFields.add(fieldName);
                     onBlurFormLayout({target: {id: fieldName, type: 'blur', cancelable: false, cancelBubble: true}});
                     return true;
                   }
                   else if (result.errorMessage) {
                     self[`${PageDefinitionCommon.FIELD_VALUES}${fieldName}`](initialValue);
                     MessageDisplaying.displayMessage({
                       severity: 'error',
                       summary: oj.Translations.getTranslatedString('wrc-message-displaying.messages.responseMessages.summary'),
                       detail: result.errorMessage
                     });
                     return false;
                   }
                 })
                 .catch(err => {
                   const message = {
                     severity: 'error',
                     summary: oj.Translations.getTranslatedString('wrc-view-model-utils.labels.unexpectedErrorResponse.value'),
                     detail: err
                   };
                   ViewModelUtils.displayResponseMessage(message);
                   return false;
                 });
           };
 
           return new Promise(function (resolve) {
             if (isWdtForm() &&
                 window?.api?.ipc &&
                 Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name
             ) {
               if (typeof fieldValue === 'string') fieldValue = fieldValue.trim();
 
               if (isEditing() && CoreUtils.isNotUndefinedNorNull(initialValue) && initialValue.startsWith('wlsdeploy/')) {
                 const paths = self.wdtForm.getModelArchivePaths([self.rdjData.data.SourcePath, self.rdjData.data.PlanPath], self.wdtForm);
                 if (paths.length > 0) {
                   const index = paths.map(path => path).indexOf(initialValue);
                   if (index !== -1) {
                     self.wdtForm.deleteModelArchiveEntry([paths[index]], self.wdtForm);
                   }
                 }
               }
 
               if (verifyEntry) {
                 const reply = processUserEnteredFilePath(fieldLabel, fieldName, initialValue, fieldValue, entryTypeName);
                 resolve(reply);
               }
               else {
                 const reply = processUserChosenFilePath(fieldLabel, fieldName, initialValue, fieldValue, entryTypeName);
                 resolve(reply);
               }
             }
             else {
               resolve(true);
             }
           });
         }
 
         /**
          * Use the action to change the settings for the specified property
          * @param {string} action
          * @private
          */
         function unsetProperty(action) {
           if (CoreUtils.isNotUndefinedNorNull(action)) {
             self[`${PageDefinitionCommon.FIELD_UNSET}${action.field}`](action.unset);
             if (!self.dirtyFields.has(action.field)) self.dirtyFields.add(action.field);
             self[`${PageDefinitionCommon.FIELD_DISABLED}${action.field}`](action.disabled);
             if (isWdtForm()) {
               self.doWdtDialogPopup = false;
               self[`${PageDefinitionCommon.FIELD_VALUES}${action.field}`]('');
               self[`${PageDefinitionCommon.FIELD_VALUE_SET}${action.field}`](false);
               self.doWdtDialogPopup = true;
             }
             else {
               self[`${PageDefinitionCommon.FIELD_VALUES}${action.field}`]('');
             }
           }
         }
 
         function resetUnsetFieldToDefault(fieldName) {
           // Perform the reset of the field only when the field is currently marked unset...
           if (CoreUtils.isNotUndefinedNorNull(self[`${PageDefinitionCommon.FIELD_UNSET}${fieldName}`]) && self[`${PageDefinitionCommon.FIELD_UNSET}${fieldName}`]()) {
             // Obtain the default value for the field using the page definition...
             const pageProps = getSliceProperties(self.pdjData, (self.showAdvancedFields().length !== 0));
             const pdjTypes = new PageDataTypes(pageProps, viewParams.perspective.id);
             const fieldDefaultValue = pdjTypes.getDefaultObservableValue(fieldName);
 
             // Clear the placeholder...
             const field = document.getElementById(fieldName);
             if (field != null) field.removeAttribute('placeholder');
 
             // Reset the state of the field...
             self[`${PageDefinitionCommon.FIELD_UNSET}${fieldName}`](false);
             self[`${PageDefinitionCommon.FIELD_DISABLED}${fieldName}`](false);
 
             // Update the reset flag and set the default value...
             self.resetUnsetFieldFlag = true;
             self[`${PageDefinitionCommon.FIELD_VALUES}${fieldName}`](fieldDefaultValue);
             self.resetUnsetFieldFlag = false;
 
           }
         }
 
         function restoreUnsetFieldsApplyHighlighting() {
           // The unset fields are applied as if the context
           // menu triggered the action, and the updated
           // fields are highlighted again to show they
           // are modified.
           if (Object.keys(self.pageRedoHistory).length !== 0) {
             // Make copy of the data as changes are made during the unset
             const dirty = new Set(self.dirtyFields);
             const redo = JSON.parse(JSON.stringify(self.pageRedoHistory));
 
             // Find all the unset fields and apply the change. For the updated
             // fields, apply the highlighting when the value is defined since
             // updated fields could actually be set to the null value...
             for (const [key, value] of Object.entries(redo)) {
               if (CoreUtils.isNotUndefinedNorNull(value.set) && dirty.has(key)) {
                 Logger.log(`[FORM] restore unset: ${key}`);
                 unsetProperty(PageDefinitionUnset.getPropertyAction(key));
               }
               else if (CoreUtils.isNotUndefinedNorNull(value.value) && dirty.has(key)) {
                 Logger.log(`[FORM] restore highlight: ${key}`);
                 PageDefinitionUnset.addPropertyHighlight(key);
               }
             }
           }
         }
 
         this.moreMenuIconClickListener = (event) => {
           event.preventDefault();
           self.optionsSources.showMoreMenuItems(event);
         };
 
         this.moreMenuClickListener = (event) => {
           event.preventDefault();
           const optionsSourceConfig = self.optionsSources.handleMenuItemSelected(event, self.rdjData, viewParams, exitForm);
           switch (optionsSourceConfig.action) {
             case 'edit':
               self.dirtyFields.delete(optionsSourceConfig.name);
               break;
             case 'create':
               self.optionsSources.createOverlayFormDialogModuleConfig(viewParams, optionsSourceConfig, updateShoppingCart, refreshForm, saveContentFileChanges)
                 .then(moduleConfig => {
                   self.overlayFormDialogModuleConfig(moduleConfig);
                 });
               break;
           }
         };
 
         /*
             * this function is called when user create a new resource using the overlay-form.
             * we need to reload the rdj data so that the dropdown will refresh with the newly created item.
             * There is a subscription for the change of rdj data and renderPage() will be called.  We need
             * to set the flag 'loadRdjDoNotClearDirty' to true so renderPage() will not clean up the dirty field.
             * This flag will be cleared in the setTimeout method at the end of  renderFormLayout().
             *
             * Also need to set the placement to 'embedded'. Otherwise, when user tries to leave the slice, isDirty() will not
             * be called to determine if the unsaved warning dialog should be displayed.
             * @private
             */
 
         function refreshForm() {
           self.loadRdjDoNotClearDirty = true;
           const dataPayload = getDirtyFieldsPayload(true);
           cacheDataPayload(dataPayload);
           renderPageData('', false);
           PageDefinitionUtils.setPlacementRouterParameter(viewParams.parentRouter, 'embedded');
         }
 
         function updateShoppingCart(eventType) {
           if (viewParams.perspective.id === 'configuration') {
             self.formToolbarModuleConfig
                 .then((moduleConfig) => {
                   const changeManager = moduleConfig.viewModel.changeManager();
                   ChangeManager.getData()
                       .then(data => {
                         let flag = data.changeManager.hasChanges;
                         moduleConfig.viewModel.changeManager({
                           isLockOwner: (flag),
                           hasChanges: (flag),
                           supportsChanges: data.changeManager.supportsChanges
                         });
                       });
 
                   moduleConfig.viewModel.renderToolbarButtons(eventType);
                 });
           }
         }
 
         function getCreateFormPayload(properties, scrubData) {
           if (isWizardForm() && CoreUtils.isNotUndefinedNorNull(self.createForm)) properties = self.createForm.getRenderProperties();
 
           // Set things up to return a null if there are no properties
           let results = {properties: properties, data: null};
 
           if (CoreUtils.isNotUndefinedNorNull(self.createForm) && properties.length > 0) {
             let replacer, fieldValues = {}, fieldValuesFrom = {};
 
             properties.forEach((property) => {
               replacer = property.name;
               if (isWizardForm()) {
                 const result = self.createForm.getBackingDataAttributeReplacer(replacer);
                 if (CoreUtils.isNotUndefinedNorNull(result)) replacer = result;
               }
               fieldValues[property.name] = self[`${PageDefinitionCommon.FIELD_VALUES}${replacer}`];
               if (isWdtForm()) {
                 fieldValuesFrom[property.name] = self[`${PageDefinitionCommon.FIELD_VALUE_FROM}${replacer}`];
               }
             });
 
             if (self.createForm.hasMultiFormData()) {
               // Get FormData associated with multipart request
               results = self.createForm.createMultipartFormData(properties, fieldValues, scrubData);
             }
             else if (self.createForm.hasDeploymentPathData()) {
               results = self.createForm.getDeploymentDataPayload(properties, fieldValues, scrubData);
             }
             else {
               results = self.createForm.getDataPayload(properties, fieldValues, ((isWdtForm()) ? fieldValuesFrom : null), scrubData);
             }
           }
 
           return results;
         }
 
         function getSliceProperties(pdjData, includeAdvancedFields) {
           let properties;
           if (isWizardForm()) {
             properties = self.createForm.getRenderProperties();
             let index = properties.map(property => property.name).indexOf('Upload');
             if (index !== -1 &&
                 viewParams.perspective.id === 'modeling' &&
                 Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
               self[`${PageDefinitionCommon.FIELD_VALUES}${properties[index].name}`](false);
             }
           }
           else {
             const hasLayoutSections = PageDefinitionFormLayouts.hasFormLayoutSections(pdjData);
             if (hasLayoutSections) {
               let sections;
               if (PageDefinitionFormLayouts.hasSliceFormLayoutSections(pdjData)) {
                 sections = pdjData.sliceForm.sections;
               }
               if (PageDefinitionFormLayouts.hasCreateFormLayoutSections(pdjData)) {
                 sections = pdjData.createForm.sections;
               }
               if (CoreUtils.isNotUndefinedNorNull(sections)) {
                 properties = [];
                 sections.forEach((section, index) => {
                   // If the section doesn't have a properties
                   // property, just skip over it.
                   if (CoreUtils.isNotUndefinedNorNull(section.properties)) {
                     properties = properties.concat(section.properties);
                   }
                 });
               }
             }
             else if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm)) {
               properties = pdjData.sliceForm.properties;
               if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm?.advancedProperties)) {
                 if (includeAdvancedFields || self.showAdvancedFields().length !== 0) {
                   properties = properties.concat(pdjData.sliceForm.advancedProperties);
                 }
               }
             }
             else if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable)) {
               properties = pdjData.sliceTable.displayedColumns;
               if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable.hiddenColumns)) {
                 properties = properties.concat(pdjData.sliceTable.hiddenColumns);
               }
             }
 
             if (CoreUtils.isUndefinedOrNull(properties)) {
               properties = pdjData.createForm.properties;
             }
           }
 
           return properties;
         }
 
         function createHelp(pdjData) {
           const helpForm = new HelpForm(
             viewParams.parentRouter.data.pdjData(),
             viewParams.perspective.id
           );
 
           const column1 = helpForm.i18n.tables.help.columns.header.name;
           const column2 = helpForm.i18n.tables.help.columns.header.description;
 
           self.tableHelpColumns(helpForm.tableHelpColumns);
 
           helpForm.setPDJData(pdjData);
 
           let helpData = [], pdjTypes;
 
           if (DeclarativeActionsManager.hasActions(pdjData)) {
             const pdjTypesHelpColumns = DeclarativeActionsManager.getPDJTypesHelpColumns(pdjData);
 
             pdjTypes = new PageDataTypes(pdjTypesHelpColumns, viewParams.perspective.id);
 
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
 
           const includeAdvancedFields = (self.showAdvancedFields().length !== 0);
           const properties = getSliceProperties(pdjData, includeAdvancedFields);
 
           if (properties.length > 0) {
             pdjTypes = new PageDataTypes(properties, viewParams.perspective.id);
 
             for (let i = 0; i < properties.length; i++) {
               const name = properties[i].name;
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
 
           self.helpDataSource(helpData);
           const div = helpForm.render();
           self.helpFooterDom({view: HtmlUtils.stringToNodeArray(div.outerHTML), data: self});
         }
       }
 
       return FormViewModel;
     }
 );
 
