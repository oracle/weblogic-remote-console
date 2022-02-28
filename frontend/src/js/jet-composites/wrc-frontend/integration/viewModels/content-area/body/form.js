/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojmodule-element-utils', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', 'wrc-frontend/integration/controller', 'wrc-frontend/apis/data-operations', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/microservices/change-management/change-manager', 'wrc-frontend/microservices/navtree/navtree-manager', 'wrc-frontend/microservices/perspective/perspective-memory-manager', './unsaved-changes-dialog', './set-sync-interval-dialog', './container-resizer', 'wrc-frontend/microservices/page-definition/types', 'wrc-frontend/microservices/page-definition/fields', 'wrc-frontend/microservices/page-definition/options-sources', 'wrc-frontend/microservices/page-definition/form-layouts', 'wrc-frontend/microservices/page-definition/unset', 'wrc-frontend/microservices/page-definition/utils', './create-form', './wdt-form',  './help-form', 'wrc-frontend/core/mutex', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'wrc-frontend/core/types', 'wrc-frontend/core/runtime', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojbinddom', 'ojs/ojinputtext', 'ojs/ojlabel', 'ojs/ojswitch', 'ojs/ojselectcombobox', 'ojs/ojformlayout', 'ojs/ojasyncvalidator-regexp', 'ojs/ojconveyorbelt', 'ojs/ojmessages', 'ojs/ojmodule-element', 'ojs/ojmodule', 'cfe-multi-select/loader', 'cfe-property-list-editor/loader', 'ojs/ojselectsingle', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojcheckboxset','ojs/ojradioset'],
  function (oj, ko, Router, ModuleElementUtils, ArrayDataProvider, HtmlUtils, Controller, DataOperations, MessageDisplaying, ChangeManager, NavtreeManager, PerspectiveMemoryManager, UnsavedChangesDialog, SetSyncIntervalDialog, ContentAreaContainerResizer, PageDataTypes, PageDefinitionFields, PageDefinitionOptionsSources, PageDefinitionFormLayouts, PageDefinitionUnset, PageDefinitionUtils, CreateForm, WdtForm, HelpForm, Mutex, ViewModelUtils, CoreUtils, CoreTypes, Runtime, Context, Logger) {
    function FormViewModel(viewParams) {

      const FIELD_DISABLED = Object.freeze('fieldDisabled_');
      const FIELD_UNSET = Object.freeze('fieldUnset_');
      const FIELD_MESSAGES = Object.freeze('fieldMessages_');
      const FIELD_SELECTDATA = Object.freeze('fieldSelectData_');
      const FIELD_VALUES = Object.freeze('fieldValues_');
      const FIELD_VALUE_FROM = Object.freeze('fieldValuesFrom_');
      const FIELD_VALUE_SET = Object.freeze('fieldValueSet_');
      const FIELD_HIGHLIGHT_CLASS = Object.freeze('cfe-field-highlight');

      var self = this;

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
          save: oj.Translations.getTranslatedString('wrc-form.messages.save')
        },
        prompts: {
          unsavedChanges: {
            willBeLost: {value: oj.Translations.getTranslatedString('wrc-unsaved-changes.prompts.unsavedChanges.willBeLost.value')},
            areYouSure: {value: oj.Translations.getTranslatedString('wrc-unsaved-changes.prompts.unsavedChanges.areYouSure.value')},
            needDownloading: {value: oj.Translations.getTranslatedString('wrc-unsaved-changes.prompts.unsavedChanges.needDownloading.value')}
          }
        },
        icons: {
          restart: {iconFile: 'restart-required-org_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-form.icons.restart.tooltip')
          },
          wdtIcon: {iconFile: 'wdt-options-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-form.icons.wdtIcon.tooltip')
          },
          choose: {iconFile: 'choose-file-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.choose.value')
          },
          clear: {iconFile: 'erase-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.clear.value')
          },
          more: {
            iconFile: {enabled: 'more-vertical-brn-8x24', grayed: 'more-vertical-readonly-8x24'},
            iconClass: 'more-vertical-icon',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.more.value')
          }
        },
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
          cancel: {disabled: false,
            label: oj.Translations.getTranslatedString('wrc-common.buttons.cancel.label')
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
      this.saveButtonDisabledVoting = {checkboxSetChanged: true, multiSelectChanged: true, inputFieldChanged: true, nonInputFieldChanged: true};
      this.debugFlagItems = ko.observable();
      this.debugFlagsEnabled = ko.observableArray([]);

      this.hasAdvancedFields = ko.observable(false);
      this.showAdvancedFields = ko.observableArray([]);

      this.fieldMessages = ko.observableArray([]);
      this.fieldDisabled = ko.observableArray([]);

      this.formDom = ko.observable({});
      this.rdjData = null;
      this.pdjData = null;

      this.readonly = ko.observable(Runtime.isReadOnly());
      this.introductionHTML = ko.observable();

      this.showHelp = ko.observable(false);
      this.showInstructions = ko.observable(true);
      this.helpDataSource = ko.observableArray([]);
      this.helpDataProvider = new ArrayDataProvider(this.helpDataSource);
      this.helpFooterDom = ko.observable({});
      this.tableHelpColumns = ko.observableArray([]);

      this.dialogFields = ko.observable();
      this.dialogFields({title:''});
      this.wdtOptionsDialogHTML = ko.observable();
      this.buttonSelected = ko.observable('fromRegValue');
      this.doWdtDialogPopup = false;

      this.subscriptions = [];
      this.signalBindings = [];

      this.formToolbarModuleConfig = ModuleElementUtils.createConfig({
        viewPath: `${Controller.getModulePathPrefix()}views/content-area/body/form-toolbar.html`,
        viewModelPath: `${Controller.getModulePathPrefix()}viewModels/content-area/body/form-toolbar`,
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          perspective: viewParams.perspective,
          newAction: newBean,
          deleteAction: deleteBean,
          rerenderAction: rerenderWizardForm,
          isWdtForm: isWdtForm,
          isShoppingCartVisible: isShoppingCartVisible,
          isWizardForm: isWizardForm,
          finishedAction: finishWizardForm,
          createFormMode: getCreateFormMode,
          onSave: saveBean,
          onUpdateModelFile: updateWdtModelFile,
          onLandingPageSelected: selectLandingPage,
          onBeanPathHistoryToggled: toggleBeanPathHistory,
          onInstructionsToggled: toggleInstructions,
          onHelpPageToggled: toggleHelpPage,
          onShoppingCartViewed: viewShoppingCart,
          onShoppingCartDiscarded: discardShoppingCart,
          onShoppingCartCommitted: commitShoppingCart,
          onUnsavedChangesDecision: decideUnsavedChangesAction,
          onToolbarRendering: getToolbarRenderingInfo,
          onSyncClicked: setSyncInterval,
          onSyncIntervalClicked: captureSyncInterval
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

      this.overlayFormDialogModuleConfig = ko.observable({ view: [], viewModel: null });

      this.connected = function () {
        document.title = viewParams.parentRouter.data.pageTitle();

        const pdjData = viewParams.parentRouter.data.pdjData();
        if (CoreUtils.isNotUndefinedNorNull(pdjData.createForm)) {
          resetSaveButtonDisabledState({disabled: false});
          const mode = CreateForm.prototype.Mode.SCROLLING;
          self.createForm = new CreateForm(viewParams, rerenderWizardForm, mode);
        }

        if (isWdtForm()) {
          self.wdtForm = new WdtForm(viewParams);
          self.mutex = new Mutex();
          if (ViewModelUtils.isElectronApiAvailable() && CoreUtils.isUndefinedOrNull(window.api)) {
            window.addEventListener('beforeunload', onBeforeUnload);
          }
        }

        renderPage(true);

        const rdjSub = viewParams.parentRouter.data.rdjData.subscribe(renderPage.bind(this));
        self.subscriptions.push(rdjSub);
        cancelSyncTimer();

        let binding = viewParams.signaling.readonlyChanged.add((newRO) => {
          self.readonly(newRO);
          renderPage(true);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.appQuitTriggered.add(() => {
          onStartWindowQuit();
        });

        self.signalBindings.push(binding);

      }.bind(this);

      this.disconnected = function () {
        cancelSyncTimer();

        self.signalBindings.forEach((binding) => {
          binding.detach();
        });

        self.signalBindings = [];

        self.subscriptions.forEach((subscription) => {
          subscription.dispose();
        });

        self.subscriptions = [];

        if (isWdtForm()) {
          const formElement = document.getElementById('wlsform');
          if (formElement) formElement.removeEventListener('keyup', sendEnterOnKeyUp);
          window.removeEventListener('beforeunload', onBeforeUnload);
        }

      };

      this.showAdvancedFieldsValueChanged = function (event) {
        stashDirtyFields();
        renderPage();
      };

      function onStartWindowQuit() {
        function sendWindowAppQuit(isNotQuitable, waitMilliseconds) {
          if (ViewModelUtils.isElectronApiAvailable()) {
              setTimeout(() => {
                window.electron_api.ipc.invoke('window-app-quit', {preventQuit: isNotQuitable, source: 'form.js'});
            }, waitMilliseconds);
          }
        }

        if (self.isDirty()) {
          stashDirtyFields();
          const eventType = (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name ? 'download' : 'autoDownload');
          return saveBean(eventType)
            .then(reply => {
              if (reply) {
                return self.wdtForm.getModelFileChanges()
                  .then(reply => {
                    if (!reply.succeeded) {
                      writeWdtModelFile({filepath: reply.filepath, fileContents: reply.fileContents});
                    }
                    sendWindowAppQuit(false, 2500);
                  });
              }
              else {
                sendWindowAppQuit(true, 5);
              }
            });
        }
        else {
          sendWindowAppQuit(false, 5);
        }
      }

      function onBeforeUnload(event) {
        if (self.isDirty()) {
          onStartWindowQuit();
          event.preventDefault();
          return event.returnValue = '';
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
          addField: function(name, value) {
            if (typeof value === 'number') value = value.toString();
            this.putValue(name, value || '');
          },
          putValue: function(name, value) {
            this[name] = value;
          }
        }
      }

      function stashDirtyFields() {
        const dataPayload = getDirtyFieldsPayload(true);
        // "dirty" fields that are that way because their
        // value was changed from what's in the RDJ, then
        // put back, are not included in dataPayload.
        // However, we still need to treat them as "dirty",
        // when it comes to what's displayed on the screen.
        // We accomplish that by calling resetPageRedoHistory(),
        // followed by cacheDataPayload(dataPayload).
        resetPageRedoHistory();
        cacheDataPayload(dataPayload);
      }

      function updateFields(){
        self.doWdtDialogPopup = false;
        const dialogFields = self.wdtForm.processWDTOptionsDialogFields(self.dialogFields());
        const buttonS = self.buttonSelected();
        const name = dialogFields.id;
        if (dialogFields.displayClass === 'cfe-multi-select'){
          const newLabel = dialogFields.currentValueText;
          const newTokenItem = {
            'label' : newLabel,
            'modelToken' : newLabel
          };
          const newUnrefItem = {
            'label' : newLabel,
            'value' : {'label' : newLabel, 'unresolvedReference' : newLabel}
          };
          const newChosenItem = (buttonS === 'fromModelToken' ? newTokenItem : newUnrefItem);
          document.getElementById(name).addNewChosenItem(newChosenItem);
        }
        else {
          if (buttonS === 'restoreToDefault'){
            unsetProperty(PageDefinitionUnset.getPropertyAction(name));
            if (dialogFields.displayClass === 'oj-switch'){
              document.getElementById('extraField_'+name).style.display = 'none';
              document.getElementById('baseField_'+name).style.display = 'inline-flex';
            }
            document.getElementById(name).classList.remove(FIELD_HIGHLIGHT_CLASS);
          }
          else {
            self[`${FIELD_VALUE_SET}${dialogFields.replacer}`](true);
            PageDefinitionUnset.addPropertyHighlight(dialogFields.id);
            if (buttonS === 'fromModelToken' || buttonS === 'fromUnresolvedReference'){
              self[`${FIELD_VALUES}${dialogFields.replacer}`](dialogFields.currentValueText);
              if (dialogFields.displayClass === 'oj-switch'){
                document.getElementById('extraField_'+name).style.display = 'inline-flex';
                document.getElementById('baseField_'+name).style.display = 'none';
              }
            }
            else {
              self[`${FIELD_VALUES}${dialogFields.replacer}`](dialogFields.currentValue);
              if (dialogFields.displayClass === 'oj-switch'){
                document.getElementById('extraField_'+name).style.display = 'none';
                document.getElementById('baseField_'+name).style.display = 'inline-flex';
              }
            }
          }
          self[`${FIELD_VALUE_FROM}${dialogFields.replacer}`](buttonS);
        }
        self.doWdtDialogPopup=true;
      }

      function displayAndProcessWdtDialog(result, fromFieldChange){
        if (CoreUtils.isNotUndefinedNorNull(result.html)) {
          self.wdtOptionsDialogHTML({ view: HtmlUtils.stringToNodeArray(result.html), data: self });
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
              updateFields(self.wdtForm.processWDTOptionsDialogFields(self.dialogFields()));
            }
            else
              {
                if (!fromFieldChange || self.dialogFields().disabled === true) return;
          const dialogFields = self.wdtForm.processWDTOptionsDialogFields(self.dialogFields());
          self.buttonSelected(dialogFields.originalValueFrom);
          dialogFields.currentValueText = dialogFields.originalValue;
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

        if (event.currentTarget.attributes['data-displayClass'].value !== 'cfe-multi-select') {
          curValue = self[`${FIELD_VALUES}${replacer}`]();
          valueSet = self[`${FIELD_VALUE_SET}${replacer}`]();
          valueFrom = self[`${FIELD_VALUE_FROM}${replacer}`]();
          disabled = (self[`${FIELD_DISABLED}${replacer}`]() === true);
        }
        const targetInfo = {
          iconLink: event.currentTarget,
          curValue: curValue,
          valueSet:  valueSet,
          valueFrom : valueFrom,
          disabled : disabled
        };
        const result = self.wdtForm.createWdtOptionsDialog(targetInfo);
        displayAndProcessWdtDialog(result, false);
      };

      this.sectionExpanderClickHandler = function (event) {
        PageDefinitionFormLayouts.handleSectionExpanderClicked(event);
      };

      this.helpIconClick = function (event) {
        new HelpForm(viewParams).handleHelpIconClicked(event);
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
          if (typeof self[FIELD_VALUES + replacer] === 'undefined') {
            self[FIELD_VALUES + replacer] = ko.observable();
            self.dirtyFields.add(fieldName);
          }
          const subscription = createFieldValueSubscription(fieldName, replacer);
          if (subscription._target() === '') {
            self.subscriptions.push(subscription);
          }
          self[FIELD_VALUES + replacer](values);
        }
        else if (CoreUtils.isNotUndefinedNorNull(self.createForm) && self.createForm.hasDeploymentPathData()) {
          if (typeof self[`${FIELD_VALUES}${fieldName}`] === 'undefined') {
            self[`${FIELD_VALUES}${fieldName}`] = ko.observable();
            self.dirtyFields.add(fieldName);
          }
          self[`${FIELD_VALUES}${fieldName}`](values);
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
        }
      };

      this.debugFlagsValueChanged = function(event) {
        const dataPayload = PageDefinitionFields.getDebugFlagItems(self.debugFlagItems(), self.debugFlagsEnabled());
        resetSaveButtonDisabledState({disabled: false});
      };

      this.chooseFileClickHandler = function(event) {
        const chooser = $('#file-chooser');
        chooser.on('change', self.chooseFileChangeHandler);
        chooser.trigger('click');
        chooser.attr('data-input', event.currentTarget.attributes['data-input'].value);
        event.preventDefault();
      };

      this.clearChosenFileClickHandler = function(event) {
        const name = event.currentTarget.attributes['data-input'].value;
        self[`${FIELD_VALUES}${name}`](null);
        self.createForm.clearUploadedFile(name);
        $('#' + name + '_clearChosen').css({'display':'none'});
      };

      this.chooseFileChangeHandler = function(event) {
        const files = event.currentTarget.files;
        if (files.length > 0) {
          const name = event.currentTarget.attributes['data-input'].value;
          const fileName = files[0].name;
          const fileExt = '.' + fileName.split('.').pop();

          self[`${FIELD_VALUES}${name}`](fileName);
          self.createForm.addUploadedFile(name, files[0]);
          $('#' + name + '_clearChosen').css({'display':'inline-flex'});

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
          if (CoreUtils.isUndefinedOrNull(self.propertyListName))
            return {};
          const propsElement = document.getElementById(self.propertyListName);
          if (CoreUtils.isNotUndefinedNorNull(propsElement)) {
            const result = propsElement.getUpdatedProperties();
            if (Object.keys(result).length > 0){
              dataPayload[self.propertyListName] = {value: result};
              return dataPayload;
            }
          }
          return {};
        }

        function getDebugPayload() {
          return PageDefinitionFields.getDebugFlagItems(self.debugFlagItems(), self.debugFlagsEnabled());
        }

        let dataPayload = {};
        var data = self.rdjData.data;

        const formElement = document.getElementById('wlsform');
        if (CoreUtils.isUndefinedOrNull(formElement)) {
          return dataPayload;
        }

        // Determine if this form is for a create or edit.
        const isEdit = CoreUtils.isNotUndefinedNorNull(self.pdjData.sliceForm);
        if (!isEdit) {
          const results = getCreateFormPayload(self.pdjData.createForm.properties);
          // For a create form without any properties, the
          // getCreateFormPayload() function will assign
          // null to results.data.
          if (isWizardForm()) {
            results.data = self.createForm.scrubDataPayload(results.data);
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

      function isShoppingCartVisible() {
        // The shopping cart will be visible expect for the WDT perspectives...
        return (['modeling','composite'].indexOf(viewParams.perspective.id) === -1);
      }

      function isWdtForm() {
        return (viewParams.perspective.id === 'modeling');
      }

      function isWizardForm() {
        let rtnval = false;
        if (self.pdjData !== null) {
          if (CoreUtils.isNotUndefinedNorNull(self.pdjData.createForm) && CoreUtils.isNotUndefinedNorNull(self.createForm.isWizard) && self.createForm.isWizard()) {
            rtnval = true;
          }
        }
        return rtnval;
      }

      function finishWizardForm() {
        if (isWizardForm()) {
          const pageState = self.createForm.markAsFinished();
          if (pageState.succeeded) saveBean('finish');
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
        const changes = this.determineChanges(true);
        const numberOfChanges = Object.keys(changes).length;

        return (numberOfChanges !== 0);
      };

      function isEditing() {
        return ( CoreUtils.isNotUndefinedNorNull(self.pdjData) && CoreUtils.isNotUndefinedNorNull(self.pdjData.sliceForm));
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
          exitFormEventType = (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name ? 'autoSave' : 'autoDownload');
        }
        return exitFormEventType;
      }

      /**
       * Wrapper function for assigning to ``viewParams`` of embedded V-VMs (i.e. form-toolbar, form-tabstrip)
       * <p>Only invoked from form-tabstrip,js, and only when slices are clicked.</pp>
       * @param {"exit"|"autoSave"|"autoDownload"} eventType - The type of event that will be performed, if ``true`` is returned
       * @returns {Promise<boolean>}
       * @see FormViewModel#canExit
       */
      function exitForm(eventType) {
        return self.canExit(eventType);
      }

      /**
       * Returns whether it is okay to exit the form, or not
       * @param {"exit"|"autoSave"|"autoDownload"|"download"} eventType - The type of event that will be performed, if ``true`` is returned
       * @returns {Promise<boolean>}
       */
      this.canExit = function (eventType) {
        return new Promise(function (resolve) {
          self.formTabStripModuleConfig
            .then((moduleConfig) => {
            const placement = PageDefinitionUtils.getPlacementRouterParameter(viewParams.parentRouter);
          if (['autoSave', 'autoDownload', 'navigation'].includes(eventType)) {
            if (isEditing()) {
              const cancelSliceChange = moduleConfig.viewModel.getCancelSliceChange();
              if (!cancelSliceChange) {
                updateWdtModelFile(eventType)
                  .then((result) => {
                  resolve(result);
              });
              }
              else {
                resolve(true);
              }
            } else {
              resolve(true);
            }
          }
          else if (CoreUtils.isNotUndefinedNorNull(placement) && placement === 'detached') {
            resolve(true);
          }
          else {
            const isEdit = (self.pdjData !== null && CoreUtils.isNotUndefinedNorNull(self.pdjData.sliceForm));
            const cancelSliceChange = moduleConfig.viewModel.getCancelSliceChange();
            const confirmDialog = document.getElementById('confirmDialog');
            if (confirmDialog !== 'null' && (confirmDialog.style['display'] !== 'none')) {
              if (confirmDialog.isOpen()) confirmDialog.close();
              resolve(true);
            }
            else if (!cancelSliceChange && isEdit && self.isDirty()) {
              return decideUnsavedChangesDetectedAction()
                .then(reply => {
                if (reply) {
                  self.dirtyFields.clear();
                  resetPageRedoHistory();
                  self.debugFlagsEnabled(PageDefinitionFields.resetDebugFlagsEnabled(self.debugFlagItems()));
                  self.multiSelectControls = {};
                  resolve(reply);
                }
                else {
                  // clear treenav selection in case that caused the exit
                  viewParams.signaling.navtreeSelectionCleared.dispatch();
              resolve(reply);
            }
            });
            }
            else {
              return resolve(true);
            }
          }
        });
        });
      };

      function getDirtyFieldsPayload(keepSaveToOrig) {
        const data = self.rdjData.data;
        let dataPayload = {};

        if (self.dirtyFields.size > 0) {
          const properties = getSliceProperties(self.pdjData, true);
          const pdjTypes = new PageDataTypes(properties, viewParams.perspective.id);
          if (isWdtForm()) self.wdtForm.setPdjTypes(pdjTypes);

          //loop through all of the dirtyFields
          for (let key of self.dirtyFields) {

            if (CoreUtils.isUndefinedOrNull(self[`${FIELD_DISABLED}${key}`])
              || CoreUtils.isUndefinedOrNull(self[`${FIELD_UNSET}${key}`])) {
              continue;
            }

            // do not include disabled fields in the values that are returned
            if ((self[`${FIELD_DISABLED}${key}`]() === true)
              && (self[`${FIELD_UNSET}${key}`]() !== true))
              continue;

            // Unset the property by marking the field as not set in the payload
            if (self[`${FIELD_UNSET}${key}`]() === true) {
              dataPayload[key] = { set: false };
              continue;
            }

            const fieldObv = self[`${FIELD_VALUES}${key}`];

            if (typeof fieldObv !== 'undefined') {
              const fieldValue = fieldObv();
              if (isWdtForm()){
                // Obtain the updated value and the original value
                // If it's a model token, the value returned will be null;
                const fromValue = self[`${FIELD_VALUE_FROM}${key}`]();
                const value = pdjTypes.getConvertedObservableValue_WDT(key, fieldValue, fromValue);
                let serverValue = pdjTypes.getObservableValue_WDT(key, data[key], null);
                const serverValueFrom = pdjTypes.getObservableValueFrom(data[key]);

                // Convert and compare values to determine if a change has actually occurred
                if (serverValueFrom === 'fromModelToken'){
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
                  dataPayload[key] = (fromValue === 'fromModelToken') ?
                    value : {value: value};
                }
                else {
                  // The field was updated then set back to the server value
                  // thus clear the property from being marked as dirty...
                  self.dirtyFields.delete(key);
                  if (keepSaveToOrig !== undefined) {
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
                  if (keepSaveToOrig !== undefined) {
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
            // Toggling the ShowAdvancedFields checkbox always
            // results in a self.dirtyFields.clear(), even after
            // the "Save" button is clicked. If the user has made
            // changes since the "Save" button was clicked, that
            // self.dirtyFields.clear() call will blow away them
            // away, which is not what we want. obsValue contains
            // the saved value for key, so calling
            // self[`${FIELD_VALUES}${key}`](obsValue) will trigger
            // a knockout change, which is where our change handler
            // does a self.dirtyFields.add() that puts the saved
            // value back in the self.dirtyFields set.
            if (isWdtForm()){
              const obsValue = pdjTypes.getObservableValue_WDT(key, self.rdjData.data[key], displayValue, value);
              self.doWdtDialogPopup = false;
              self[`${FIELD_VALUES}${key}`](obsValue);
              self[`${FIELD_VALUE_FROM}${key}`](self.wdtForm.calValueFrom(key, obsValue));
              self.doWdtDialogPopup = true;
              if (pdjTypes.getPDJType(key).type === 'boolean') {
                if (self[`${FIELD_VALUE_FROM}${key}`]() === 'fromRegValue'){
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
              self[`${FIELD_VALUES}${key}`](obsValue);
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
          let mode = (CoreUtils.isNotUndefinedNorNull(self.pdjData) && CoreUtils.isNotUndefinedNorNull(self.pdjData.sliceForm) ? 'save' : 'create');
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

          if (!isWizardForm()) renderPageData(toolbarButton);
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
          let cancelled = cancelSyncTimer();
          if (!cancelled) reloadPageData();

          // Set a new timer interval in millis when sync interval is specified
          if (syncInterval > 0) {
            let refreshInterval = (syncInterval * 1000);
            self.timerId = setInterval(reloadPageData, refreshInterval);
          }
        }
      }

      function cancelSyncTimer() {
        let cancelled = false;
        if (CoreUtils.isNotUndefinedNorNull(self.timerId)) {
          clearInterval(self.timerId);
          self.timerId = undefined;
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

      function setAutoDownloadTimer(checkInterval) {
        if (isWdtForm() && !isWizardForm()) {
          // Cancel any timer.
          cancelAutoDownloadTimer();

          // Set a new timer interval in millis when sync interval is specified
          if (checkInterval > 0) {
            const intervalMillis = (checkInterval * 1000);
            self.autoDownloadTimerId = setInterval(onStartWindowQuit, intervalMillis);
          }
        }
      }

      function cancelAutoDownloadTimer() {
        if (CoreUtils.isNotUndefinedNorNull(self.autoDownloadTimerId)) {
          clearInterval(self.autoDownloadTimerId);
          self.autoDownloadTimerId = undefined;
        }
      }

      function decideUnsavedChangesDetectedAction() {
        self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-unsaved-changes.titles.unsavedChanges.value'));
        self.i18n.dialog.prompt(self.i18n.prompts.unsavedChanges.areYouSure.value);
        return UnsavedChangesDialog.showConfirmDialog('UnsavedChangesDetected', self.i18n);
      }

      function decideUnsavedChangesAction() {
        if ( self.isDirty()) {
          self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-unsaved-changes.titles.unsavedChanges.value'));
          self.i18n.dialog.prompt(self.i18n.prompts.unsavedChanges.willBeLost.value);
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
      }

      function renderPageData(toolbarButton, render) {
        // Only reload data for an edit form as create form would result in table data!
        const isEdit = typeof self.pdjData.sliceForm !== 'undefined';
        if (isEdit) {
          reloadRdjData();
          // When specified skip the render call as the RDJ reload will trigger observable subscription
          if ((typeof render === 'undefined') || render) {
            renderPage();
          }
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

      function setFormContainerMaxHeight(withHistoryVisible){
        const options = {withHistoryVisible: withHistoryVisible, withHelpVisible: self.showHelp()};
        const offsetMaxHeight = self.contentAreaContainerResizer.getOffsetMaxHeight('#form-container', options);
        Logger.info(`[FORM] max-height=calc(100vh - ${offsetMaxHeight}px)`);
        const ele = document.querySelector('.cfe-table-form-content');
        if (ele !== null) ele.style['max-height'] = `calc(100vh - ${offsetMaxHeight}px)`;
      }

      function toggleBeanPathHistory (withHistoryVisible) {
        setFormContainerMaxHeight(withHistoryVisible);
        return viewParams.onBeanPathHistoryToggled();
      }

      function toggleInstructions (withInstructionsVisible, withHistoryVisible) {
        const ele = document.getElementById('intro');
        if (ele !== null) ele.style.display = (withInstructionsVisible ? 'inline-block' : 'none');
        self.showInstructions(withInstructionsVisible);
        setFormContainerMaxHeight(withHistoryVisible);
      }

      function toggleHelpPage(withHelpVisible, withHistoryVisible) {
        if (withHelpVisible) {
          self.canExit().then((result) => {
            if (result) {
              self.showHelp(withHelpVisible);
              setFormContainerMaxHeight(withHistoryVisible);

              stashDirtyFields();
            }
          });
        } else {
          self.showHelp(withHelpVisible);
          setFormContainerMaxHeight(withHistoryVisible);

          const pdjData = viewParams.parentRouter.data.pdjData();
          const rdjData = viewParams.parentRouter.data.rdjData();
          self.loadRdjDoNotClearDirty = true;
          renderFormLayout(pdjData, rdjData);
        }
      }

      function selectLandingPage() {
        viewParams.onLandingPageSelected();
      }

      function newBean() {
        self.createForm = new CreateForm(viewParams);
        self.createForm.newBean()
          .then((result) => {
          const rdjUrl = result.body.data.get('rdjUrl');
          const isCreateForm = 'createForm' === (new URL(rdjUrl, Runtime.getBackendUrl())).searchParams.get('view');
        // We're working with a "createableOptionalSingleton".
        // save and download the latest WDT model, from the CBE.
        if (isWdtForm() && !isCreateForm) {
          submitWdtModelChanges('autoSave');
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
        viewParams.parentRouter.go('form')
          .then((hasChanged) => {
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
      .then(reply =>{
          if (reply.body.messages > 0) {
          MessageDisplaying.displayResponseMessages(reply.body.messages);
        }
      else if (isWdtForm()) {
          submitWdtModelChanges('autoSave');
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

      function saveBean(eventType) {
        let dataAction = '';
        let isEdit = (typeof self.pdjData.sliceForm !== 'undefined');

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
        Logger.info(`[FORM] dataAction=${dataAction}, dataPayload=${JSON.stringify(dataPayload)}`);

        if (isEdit && (dataPayload != null) && (Object.keys(dataPayload).length === 0)) {
          Logger.log('[FORM] POST data is empty while isEdit=true, exiting save!');
          dataPayload = null;
        }

        if (dataPayload === null) dataPayload = {};

        if (CoreUtils.isNotUndefinedNorNull(dataPayload)) {
          const url = `${viewParams.parentRouter.data.rdjUrl()}${dataAction}`;
          return DataOperations.mbean.save(url, dataPayload)
            .then(reply => {
            return handleSaveResponse(reply, dataAction, dataPayload, eventType, isEdit);
        })
        .catch(response => {
            return handleSaveResponse(response, dataAction, dataPayload, eventType, isEdit);
        });
        }
        return Promise.resolve(true);
      }

      /**
       * Method to perform "post-Save" activities for a successful save operation, based on the values of specific parameters.
       * <p>The assumption here is that the save operation was successful, with regards to the Promise returned. This means that a Promise rejection should not result in this method being called.</p>
       * @param {{body: {data: any, messages?: any}}} response - The response object return from the successful save operation.
       * @param {string} dataAction - Query parameter that was used with the successful save operation.
       * @param {object} dataPayload - JSON payload that was used in the successful save operation.
       * @param {"create"|"finish"|"update"} eventType - The type of event that was associated with the successful save operation.
       * @param {boolean} isEdit - Flag indicating if the save operation was for a "create" event, or an "update" event. The flag will be false for the former, and true for the latter.
       * @private
       */
      function handleSaveResponse(response, dataAction, dataPayload, eventType, isEdit) {
        const includeAdvancedFields = (self.showAdvancedFields().length !== 0);
        let retval = false;
        const properties = getSliceProperties(self.pdjData, includeAdvancedFields);
        const bodyMessages = ViewModelUtils.getResponseBodyMessages(response, properties);
        if (bodyMessages.length > 0) {
          MessageDisplaying.displayMessages(bodyMessages);
        }

        self.debugFlagsEnabled(PageDefinitionFields.resetDebugFlagsEnabled(self.debugFlagItems()));

        resetToolbarButtons();

        if (CoreUtils.isNotUndefinedNorNull(response.failureType) && response.body.messages.length === 0) {
          saveFailedNoMessages(dataAction, dataPayload, isEdit);
        }
        else if (response.body.messages.length === 0) {
          const identity = response.body.data?.resourceData?.resourceData;
          saveSuceededNoMessages(eventType, dataPayload, isEdit, identity);
          retval = true;
        }

        // Collapse console Kiosk, regardless of what happened above.
        viewParams.signaling.tabStripTabSelected.dispatch('form', 'shoppingcart', false);
        return retval;
      }

      function resetToolbarButtons() {
        if (['configuration', 'modeling'].indexOf(viewParams.perspective.id) !== -1) {
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

        // if the response is not a 200 or 201 (CREATED)
        // with no messages, the CBE might have done a
        // partial edit.

        /*
        1) if the update fails:
          a) display any error messages (global or field scoped)
          b) repost the stored RDJ's data section to restore the old values
          c) don't update the values on the screen (so that the user can try to correct them then click 'Save' again)
        2) if the create fails, try to delete the object (since it may or may not have been created):
          a) display any error messages (global or field scoped)
          b) delete the new object (it may or may not have been created)
          c) don't update the values on the screen (so that the user can try to correct them then click 'Save' again)
        */
        if (isEdit) {
          // create a POST request to reverse the change.
          let compensatingPayload = {};

          self.dirtyFields.forEach(function (field) {
            compensatingPayload[field] = self.rdjData.data[field];
          });

          DataOperations.mbean.save(viewParams.parentRouter.data.rdjUrl() + dataAction, compensatingPayload)
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
          if (typeof dataPayloadName !== 'undefined') pathLeafName = dataPayloadName.value;

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

      function saveSuceededNoMessages(eventType, dataPayload, isEdit, identity) {
        updateMultiSelectControls(dataPayload);
        cacheDataPayload(dataPayload);
        self.dirtyFields.clear();
        self.debugFlagItems(null);

        const treeaction = {
          isEdit: isEdit,
          path: decodeURIComponent(viewParams.parentRouter.data.rawPath())
        };

        // fix the navtree
        viewParams.signaling.navtreeUpdated.dispatch(treeaction);

        if (isEdit) {
          if (['configuration', 'modeling'].indexOf(viewParams.perspective.id) !== -1) {
            if (CoreUtils.isNotUndefinedNorNull(self.wdtForm)) {
              submitWdtModelChanges(eventType);
            }
            else {
              MessageDisplaying.displayMessage({
                severity: 'confirmation',
                summary: self.i18n.messages.save
              }, 2500);
              updateShoppingCart(eventType);
            }
          }
          // Reload the page data to pickup the saved changes!
          reloadRdjData();
        }
        else {
          if (isWdtForm()) submitWdtModelChanges(eventType);

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

      function submitWdtModelChanges(eventType) {
        if (!ViewModelUtils.isElectronApiAvailable()) {
          switch (eventType) {
            case 'navigation':
            case 'update':
            case 'autoDownload':
            case 'download':
              downloadWdtModelFile(eventType);
              break;
          }
        }
        else {
          downloadWdtModelFile(eventType);
        }
      }

      async function updateWdtModelFile(eventType) {
        if (CoreUtils.isNotUndefinedNorNull(self.wdtForm)) {
          if (self.isDirty()) {
            stashDirtyFields();
            let reply = await saveBean(eventType);
            if (reply) {
              if (eventType === 'autoSave') {
                if (!ViewModelUtils.isElectronApiAvailable()) {
                  self.i18n.dialog.title(oj.Translations.getTranslatedString('wrc-unsaved-changes.titles.changesNeedDownloading.value'));
                  self.i18n.dialog.prompt(self.i18n.prompts.unsavedChanges.needDownloading.value);
                  reply = await UnsavedChangesDialog.showConfirmDialog('ChangesNotDownloaded', self.i18n);
                }
                else {
                  reply = true;
                }
                if (reply) downloadWdtModelFile('download');
                viewParams.signaling.navtreeSelectionCleared.dispatch();
              }
            }
            else {
              viewParams.signaling.navtreeSelectionCleared.dispatch();
              return Promise.resolve(reply);
            }
          }
          else if (eventType === 'download') {
            downloadWdtModelFile(eventType);
          }
        }
        return Promise.resolve(true);
      }

      function downloadWdtModelFile(eventType) {
        self.wdtForm.getModelFileChanges()
          .then(reply => {
          if (reply.succeeded) {
          if (eventType === 'download') {
            MessageDisplaying.displayMessage({
              severity: 'confirmation',
              summary: self.wdtForm.getSummaryMessage('changesDownloaded')
            }, 2500);
          }
        }
      else {
          // This means wdtForm.getModelFileChanges() was
          // able to download, but not write out the model
          // file.
          if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name && ['update', 'autoDownload'].includes(eventType)) {
            // Send signal containing the changes
            // downloaded from the WRC-CBE.
            const dataProvider = self.wdtForm.getDataProvider();
            viewParams.signaling.changesAutoDownloaded.dispatch(dataProvider, reply.fileContents);
          }
          else {
            // Call writeModelFile passing in the
            // filepath and fileContents in reply.
            writeWdtModelFile({filepath: reply.filepath, fileContents: reply.fileContents});
          }
        }
      })
      .catch(response => {
          ViewModelUtils.failureResponseDefaultHandling(response);
      });
      }

      function writeWdtModelFile(options) {
        self.wdtForm.writeModelFile(options)
          .then(reply => {
          Logger.log(`[FORM] self.wdtForm.writeModelFile(options) returned ${reply.succeeded}`);
      });
      }

      function updateMultiSelectControls(dataPayload) {
        for (const key of Object.keys(dataPayload)) {
          if (typeof self.multiSelectControls[key] !== 'undefined') {
            self.multiSelectControls[key].origChosenLabels = self.multiSelectControls[key].savedChosenLabels;
          }
        }
      }

      function reloadRdjData() {
        //temp fix for incorrect self.sliceName
        const pageDefinition = (CoreUtils.isNotUndefinedNorNull(viewParams.parentRouter.data.rdjData) ? viewParams.parentRouter.data.rdjData().pageDescription : undefined);
        let sliceName = (CoreUtils.isNotUndefinedNorNull(pageDefinition) ? pageDefinition.substring( pageDefinition.indexOf('=') +1 ) : '');
        // Ensure the reload does not attempt to use the create form as the slice
        sliceName = ('createForm' !== sliceName ? sliceName : '');
        Logger.log(`self.sliceName=${self.sliceName}`);

        const url = viewParams.parentRouter.data.rdjUrl() + '?slice=' + sliceName;

        DataOperations.mbean.reload(url)
          .then(reply => {
          const rdjData = reply.body.data;
        Logger.log('[FORM] reload url; reply.body.data = ' + JSON.stringify(rdjData));
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
          // failed to reload rdjData
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
       *
       * @param {undefined|true} resetPageHistory
       */
      function renderPage(resetPageHistory) {
        var pdjData = viewParams.parentRouter.data.pdjData();
        var rdjData = viewParams.parentRouter.data.rdjData();

        //The loadRdjDoNotClearDirty flag is set when we try to reload the rdj, but not clear up dirty fields.
        //one use case is when we need to reload rdj after creating a resource using overlay-form.  We don't want to lose
        //all the changes.
        //if user is using the 'reload icon' on the toolbar to reload the page, then this flag will not be set.
        if (CoreUtils.isNotUndefinedNorNull(resetPageHistory) && ! self.loadRdjDoNotClearDirty) {
          resetPageRedoHistory();
        }

        let isEdit;

        if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm) || CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable)) {
          isEdit = true;
        }
        else if (CoreUtils.isNotUndefinedNorNull(pdjData.createForm)) {
          isEdit = false;
        }
        else {
          return;
        }

        self.pdjData = viewParams.parentRouter.data.pdjData();
        self.rdjData = viewParams.parentRouter.data.rdjData();

        let slices = pdjData.sliceForm?.slices || pdjData.sliceTable?.slices;
        
        if (isEdit && CoreUtils.isNotUndefinedNorNull(slices) && slices.length > 0) {
          self.formTabStripModuleConfig
            .then((moduleConfig) => {
          const currentSlice = moduleConfig.viewModel.getCurrentSlice();
          if (currentSlice === '') {
            moduleConfig.viewModel.updateSlice(currentSlice, 1);
          }
        });
        }

        const toggleHelpIntroduction = self.i18n.introduction.toggleHelp.text.replace('{0}','<img src=\'../../images/' + self.i18n.introduction.toggleHelp.iconFile + '\'>');
        const bindHtml = (CoreUtils.isNotUndefinedNorNull(pdjData.introductionHTML) ? pdjData.introductionHTML : '<p>');
        self.introductionHTML({ view: HtmlUtils.stringToNodeArray(bindHtml) });

        pdjData = viewParams.parentRouter.data.pdjData();
        rdjData = viewParams.parentRouter.data.rdjData();

        if (typeof rdjData !== 'undefined' && typeof pdjData !== 'undefined') {
          let flag = (typeof pdjData.sliceForm !== 'undefined' && typeof pdjData.sliceForm.advancedProperties !== 'undefined');
          self.hasAdvancedFields(flag);
          self.perspectiveMemory.contentPage.nthChildren = [];
          renderFormLayout(pdjData, rdjData);
        }
      }

      function rerenderWizardForm(pdjData, rdjData, direction, removed) {
        if (typeof removed !== 'undefined') {
          Logger.log(`[FORM] removed.length=${removed.length}`);
          removed.forEach((item) => {
            // Some subscription._target() values will be an empty
            // string, so we need to look for those first.
            processRemovedField(item.name,'');
          // Look for subscription._target() values that match
          // item.name.
          processRemovedField(item.name, item.value);
        });
        }

        const pageState = self.createForm.rerenderPage(direction);
        if (pageState.succeeded) {
          self.formToolbarModuleConfig
            .then((moduleConfig) => {
            moduleConfig.viewModel.resetButtonsDisabledState([{id: 'finish', disabled: !self.createForm.getCanFinish()}]);
          renderFormLayout(pdjData, rdjData);
        });
        }
      }

      function renderFormLayout(pdjData, rdjData) {
        let div;

        if (isWizardForm()) {
          div = renderWizardForm(rdjData);
        }
        else {
          self.perspectiveMemory.contentPage.nthChildren = [];
          div = renderForm(pdjData, rdjData);
        }

        createHelp(pdjData);

        self.formDom({ view: HtmlUtils.stringToNodeArray(div.outerHTML), data: self });

        setTimeout(() => {
          Context.getPageContext().getBusyContext().whenReady()
            .then( () => {
            restoreUnsetFieldsApplyHighlighting();
        renderSpecialHandlingFields();
        setFormContainerMaxHeight(self.perspectiveMemory.beanPathHistory.visibility);
        restoreDirtyFieldsValues();
        self.loadRdjDoNotClearDirty = false;
      });
      }, 5
      );
      }

      function renderSpecialHandlingFields() {
        function onMouseUp(event) {
          const parentNode = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
          const initHeight = parseInt(event.target.attributes['data-init-height'].value, 10);
          const calcOffsetHeight = (event.target.offsetHeight - initHeight);
          Logger.info(`calcOffsetHeight=${calcOffsetHeight}`);
          parentNode.style.height = `${(initHeight + calcOffsetHeight) - 10}px`;
          const name = CoreUtils.getSubstring(event.target.id, '|');
          self.perspectiveMemory.setNthChildMinHeight.call(self.perspectiveMemory, name, parentNode.style.height);
        }

        let ele;
        self.perspectiveMemory.nthChildrenItems.call(self.perspectiveMemory).forEach((nthChild) => {
          ele = document.querySelector('#wlsform > div > div:nth-child(' + nthChild.row + ') > div:nth-child(' + nthChild.col + ')');
        if (ele !== null && typeof nthChild.minHeight !== 'undefined') {
          ele.style['min-height'] = nthChild.minHeight;
          ele = document.getElementById(`${nthChild.name}|input`);
          if (ele !== null) {
            ele.addEventListener('mouseup', onMouseUp);
            ele.setAttribute('data-init-height', nthChild.minHeight);
            ele.style.height = `${parseInt(nthChild.minHeight, 10)}px`;
          }
        }
      });

        if (isWdtForm()) {
          const formElement = document.getElementById('wlsform');
          if (formElement) formElement.addEventListener('keyup', sendEnterOnKeyUp, true);
        }
      }

      function sendEnterOnKeyUp(event) {
        if (event.key !== 'Enter' && event.key !== 'Tab') {
          const selector = `${document.activeElement.id}`;
          document.activeElement.blur();
          document.getElementById(selector).focus();
        }
      }

      function renderWizardForm(rdjData) {
        const div = document.createElement('div');
        div.setAttribute('id', 'cfe-form');
        div.style.display = 'block';

        //wizard form always use single column. If this is changed, the param calling populateFormLayout will need to change.
        const formLayout = PageDefinitionFormLayouts.createWizardFormLayout({labelWidthPcnt: '32%', maxColumns: '1'});
        div.append(formLayout);

        document.documentElement.style.setProperty('--form-input-min-width', '25em');
        let properties = self.createForm.getRenderProperties();
        const results = getCreateFormPayload(properties);

        self.formToolbarModuleConfig
          .then((moduleConfig) => {
          moduleConfig.viewModel.resetButtonsDisabledState([{id: 'finish', disabled: !self.createForm.getCanFinish()}]);
      });

        properties = results.properties;
        const dataPayload = results.data;

        for (const [key, value] of Object.entries(dataPayload)) {
          if (CoreUtils.isNotUndefinedNorNull(value) && typeof value.value !== 'undefined' ) {
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

      function renderForm(pdjData, rdjData) {
        const div = document.createElement('div');
        div.setAttribute('id', 'cfe-form');
        div.style.display = 'block';

        const includeAdvancedFields = (self.showAdvancedFields().length !== 0);
        const properties = getSliceProperties(pdjData, includeAdvancedFields);

        // Setup PDJ type information for the properties being handled on this form
        const pdjTypes = new PageDataTypes(properties, viewParams.perspective.id);
        if (isWdtForm()) self.wdtForm.setPdjTypes(pdjTypes);

        let formLayout = null;

        const isUseCheckBoxesForBooleans = PageDefinitionFormLayouts.hasFormLayoutType(pdjData, 'useCheckBoxesForBooleans');
        const isSingleColumn = PageDefinitionFormLayouts.hasFormLayoutType(pdjData, 'singleColumn');
        const hasFormLayoutSections = PageDefinitionFormLayouts.hasFormLayoutSections(pdjData);
        const isReadOnly = (self.readonly() && (['configuration','view','composite'].indexOf(viewParams.perspective.id) !== -1));

        const isSliceTable = pdjData.sliceTable ? true : false;

        if (isSliceTable) {
          let tableLayout = PageDefinitionFormLayouts.createTable(
            {},
            pdjTypes,
            rdjData,
            pdjData,
            populateSliceTable
          );
          div.append(tableLayout);

          return div;
        }

        if (hasFormLayoutSections) {
          formLayout = PageDefinitionFormLayouts.createSectionedFormLayout({labelWidthPcnt: '45%', maxColumns: '1', isReadOnly: isReadOnly, isSingleColumn: isSingleColumn}, pdjTypes, rdjData, pdjData, populateFormLayout);
          div.append(formLayout);
        }
        else if (isUseCheckBoxesForBooleans) {
          formLayout = PageDefinitionFormLayouts.createCheckBoxesFormLayout({labelWidthPcnt: '45%', maxColumns: '1'} );
          div.append(formLayout);
        }
        else {
          if (isSingleColumn) {
            formLayout = PageDefinitionFormLayouts.createSingleColumnFormLayout({labelWidthPcnt: '32%', maxColumns: '1'} );
            div.append(formLayout);
            document.documentElement.style.setProperty('--form-input-min-width', '32em');
          }
          else {
            formLayout = PageDefinitionFormLayouts.createTwoColumnFormLayout({labelWidthPcnt: '45%', maxColumns: '2'} );
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

      function createFieldValueSubscription(name, replacer){
        return self[`${FIELD_VALUES}${replacer}`].subscribe((newValue) => {
          self.dirtyFields.add(name);
        let replacer = name;
        if (isWizardForm()) {
          replacer = self.createForm.getBackingDataAttributeReplacer(name);
          if (typeof replacer === 'undefined') replacer = name;
        }
        if (isWdtForm()){
          let testShow = self.wdtForm.shouldShowDialog(self.doWdtDialogPopup, name, newValue, self.createForm);
          if (testShow.shouldShow){
            const result = self.wdtForm.formFieldValueChanged(name, newValue);
            displayAndProcessWdtDialog(result, true);
            if (isWizardForm()) {
              newValue = self[`${FIELD_VALUES}${replacer}`]();
              self.createForm.backingDataAttributeValueChanged(name, newValue);
            }
            return;
          }
          else {
            //we  want to set the valueFrom, then continue with the rest of the code as normal.
            if (CoreUtils.isNotUndefinedNorNull(testShow.from)){
              self[`${FIELD_VALUE_FROM}${replacer}`](testShow.from);
            }
            if (isWizardForm()) {
              newValue = self[`${FIELD_VALUES}${replacer}`]();
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

        if ( (CoreUtils.isNotUndefinedNorNull(self[`${FIELD_UNSET}${name}`]) && !self[`${FIELD_UNSET}${name}`]())
          || (isWdtForm())) {
          // This means the user is changing the value
          // of fields on the form, not inside the WDT
          // settings dialog box.
          PageDefinitionUnset.addPropertyHighlight(name);
          self[`${FIELD_VALUE_SET}${name}`](true);
        }
      });
      }

      function processRemovedField(name, value){
        if (CoreUtils.isUndefinedOrNull(value)) value = '';
        let index = self.subscriptions.map(subscription => subscription._target()).indexOf(value);
        if (index !== -1) {
          self.subscriptions[index].dispose();
          self.subscriptions.splice(index, 1);
          self.dirtyFields.delete(name);
        }
        let replacer = self.createForm.getBackingDataAttributeReplacer(name);
        if (typeof replacer === 'undefined') replacer = name;
        if (typeof self[`${FIELD_VALUES}${replacer}`] !== 'undefined') delete self[`${FIELD_VALUES}${replacer}`];
        if (typeof self[`${FIELD_SELECTDATA}${replacer}`] !== 'undefined') delete self[`${FIELD_SELECTDATA}${replacer}`];
        if (typeof self[`${FIELD_VALUE_FROM}${replacer}`] !== 'undefined') delete self[`${FIELD_VALUE_FROM}${replacer}`];
        if (typeof self[`${FIELD_VALUE_SET}${replacer}`] !== 'undefined') delete self[`${FIELD_VALUE_SET}${replacer}`];
        if (typeof self[`${FIELD_MESSAGES}${replacer}`] !== 'undefined') {
          index = self.dynamicMessageFields.indexOf(self[`${FIELD_MESSAGES}${replacer}`]);
          if (index !== -1) self.dynamicMessageFields.splice(index, 1);
          delete self[`${FIELD_MESSAGES}${replacer}`];
        }

        index = self.perspectiveMemory.nthChildrenItems.call(self.perspectiveMemory).map(nthChild1 => nthChild1.name).indexOf(replacer);
        if (index === -1) self.perspectiveMemory.nthChildrenItems.call(self.perspectiveMemory).splice(index, 1);

        if (CoreUtils.isNotUndefinedNorNull(self.multiSelectControls[replacer])) {
          delete self.multiSelectControls[replacer];
        }
      }

      function setupUsedIfListeners(properties) {
        const usedIfProperties = properties.filter(property => CoreUtils.isNotUndefinedNorNull(property.usedIf));

        usedIfProperties.forEach((property) => {
          let propertyName, name = property.name, usedIf = property.usedIf;

        if (self.createForm) {
          const replacer = self.createForm.getBackingDataAttributeReplacer(usedIf.property);
          // replacer is only used with the property names used
          // in the JDBC System Resource wizard. Only assign it
          // to propertyName, if it's not undefined.
          propertyName = (CoreUtils.isNotUndefinedNorNull(replacer) ? replacer : usedIf.property);
        }
        else {
          propertyName = usedIf.property;
        }

        let toggleDisableFunc = (newValue , pType) => {
          // Prevent a property from becoming enabled/disabled
          // when value has been unset
          if (!isWdtForm()){
            if (self[`${FIELD_UNSET}${name}`]() || self[`${FIELD_UNSET}${propertyName}`]()) {
              Logger.log(`[FORM] Prevent usedIf handling for unset field: ${name}`);
              return;
            }
          }

          // If the new value is a Model Token, always enable the field.
          if (CoreUtils.isNotUndefinedNorNull(newValue) && (typeof newValue === 'string') && newValue.startsWith('@@')){
            self[`${FIELD_DISABLED}${name}`](false);
          }
          else {
            // See if the new value enables the field or not
            let enabled = usedIf.values.find(
              (item) => {
                // if we are comparing to true/false (ie boolean), and the value is undefined
                // of newValue === "" which is the case when user restore to default
                // we want to enable the dependant field.
                // we can only test for true/false here because in this call back, we don't have access
                // to the pdjTypes of this field
                if ( isWdtForm() && (item === true || item === false) &&
              (CoreUtils.isUndefinedOrNull(newValue) || newValue === ''))
            return true;
            return item === newValue; }
          );
            self[`${FIELD_DISABLED}${name}`](!enabled);
          }
        };

        // Call event callback to initialize, then set up
        // subscription.
        const oneProp = properties.find(element => element.name === propertyName);
        let pType = '';
        if (CoreUtils.isNotUndefinedNorNull(oneProp))
          pType = oneProp.type;
        toggleDisableFunc(self[`${FIELD_VALUES}${propertyName}`](), pType);
        const subscription = self[`${FIELD_VALUES}${propertyName}`].subscribe(toggleDisableFunc);
        self.subscriptions.push(subscription);
      });
      }

      function populateFormLayout(properties, formLayout, pdjTypes, dataValues, isSingleColumn, isReadOnly){
        for (let i = 0; i < properties.length; i++) {
          let name = properties[i].name;

          const helpInstruction = PageDefinitionFields.createHelpInstruction(name, pdjTypes);

          let replacer = name, labelEle, field, value, container, createValue = null;

          if (isWizardForm()) {
            const result = self.createForm.getBackingDataAttributeReplacer(replacer);
            if (typeof result !== 'undefined') replacer = result;
            if (typeof self[FIELD_VALUES + replacer] === 'undefined') {
              // Add name to wizard page in backing data
              self.createForm.addBackingDataPageData(name);
            }
          }

          const observableNameValueFrom = FIELD_VALUE_FROM + replacer;
          const observableNameValueSet = FIELD_VALUE_SET + replacer;

          // Get the text display value for the data or null
          value = pdjTypes.getDisplayValue(name, dataValues[name]);
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
            field = PageDefinitionFields.createSwitch('cfe-form-switch');
            if (isWdtForm() && pdjTypes.isSupportsModelTokens(name)){
              const options = {
                'className':  'cfe-form-input-text',
                'placeholder': name,
                'readonly': true,
              };
              field_inputTextForBoolean = PageDefinitionFields.createInputText(options);
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
              self.perspectiveMemory.upsertNthChildrenItem.call(self.perspectiveMemory, {name: name, row: parseInt(i) + 1, col: 2, minHeight: '240px'});

              if (CoreUtils.isUndefinedOrNull(self[observableNameValueFrom])) {
                self[observableNameValueFrom] = ko.observable();
              }
              self[observableNameValueFrom]('fromRegValue');
            }
            else {
              const dataProviderName = FIELD_SELECTDATA + replacer;
              const options = {
                'name': name,
                'isEdit': (typeof self.pdjData.sliceForm !== 'undefined'),
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
          else if (pdjTypes.isArray(name) && (!pdjTypes.isPropertiesType(name))) {
            const options = {
              'className': 'cfe-form-input-textarea',
              'resize-behavior': 'vertical',
              'placeholder': pdjTypes.getInLineHelpPresentation(name),
              'readonly': pdjTypes.isReadOnly(name) || isReadOnly
            };
            field = PageDefinitionFields.createTextArea(options);
            field.setAttribute('title', value);
            let nthChild = self.perspectiveMemory.getNthChildrenItem.call(self.perspectiveMemory, name);
            if (typeof nthChild === 'undefined') {
              // Setup the nthChild based on the form using one or two fields per row
              let fieldIndex = parseInt(i) + 1;
              let fieldRow = (isSingleColumn ? fieldIndex : Math.round(fieldIndex / 2));
              let fieldColumn = (isSingleColumn || ((fieldIndex % 2) !== 0) ? 2 : 4);
              nthChild = { name: name, row: fieldRow, col: fieldColumn, minHeight: '52px' };
            }
            self.perspectiveMemory.upsertNthChildrenItem.call(self.perspectiveMemory, nthChild);
          }
          else if (pdjTypes.isPropertiesType(name)) {
            const jsonString = JSON.stringify(dataValues[name].value);
            field = PageDefinitionFields.createPropertyListEditor(jsonString, name, pdjTypes.isReadOnly(name) || isReadOnly);
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
          }
          else {
            const options = {
              'className': pdjTypes.isNumberType(name)? 'cfe-form-input-integer-sm' : 'cfe-form-input-text',
              'placeholder': pdjTypes.getInLineHelpPresentation(name),
              'readonly': isReadOnly
            };
            field = PageDefinitionFields.createInputText(options);
            field.setAttribute('title', value);
          }

          if (!tableProperty) {
            if ((!isSingleColumn && pdjTypes.isArray(name) && pdjTypes.isDynamicEnumType(name))
                 || (!isSingleColumn && pdjTypes.isPropertiesType(name))) {
              // We're on a field associated with a cfe-multi-select or cfe-property-list-editor,
              // so use modulus of i and 2 make odd remainders force
              // a new div.
              if ((i % 2) === 1) {
                const div = document.createElement('div');
                formLayout.append(div);
              }
            }
            // Append the help icon to the form layout, as it is
            // always the first thing on a new row.
            labelEle = PageDefinitionFields.createLabel(name, pdjTypes, helpInstruction);
            formLayout.append(labelEle);
          }

          if (typeof field !== 'undefined' && field.className !== 'cfe-multi-select'
            && field.className != 'cfe-property-list-editor'
          ) {
            field.setAttribute('id', name);
            field.setAttribute('label-edge', 'provided');

            // Get the actual value for the observable to preserve type
            let observableValue = createValue;
            let observableValueFrom = 'fromRegValue';
            if (observableValue === null) {
              if (isWdtForm()){
                observableValue = pdjTypes.getObservableValue_WDT(name, dataValues[name], value);
                observableValueFrom = pdjTypes.getObservableValueFrom(dataValues[name]);
              }
              else {
                observableValue = pdjTypes.getObservableValue(name, dataValues[name], value);
              }
            }
            let isValueSet = true;
            if (CoreUtils.isNotUndefinedNorNull(dataValues[name]) && CoreUtils.isNotUndefinedNorNull(dataValues[name].set)){
              isValueSet = (dataValues[name].set);
            }

            const observableName = FIELD_VALUES + replacer;
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

            const subscription = createFieldValueSubscription(name, replacer);
            if (CoreUtils.isNotUndefinedNorNull(subscription) && subscription._target() === '') {
              self.subscriptions.push(subscription);
            }

            if (isWizardForm()) {
              if (self[FIELD_VALUES + replacer]() === '') {
                self[FIELD_VALUES + replacer](dataValues[name].value);
              }
            }

            field.setAttribute('value', '{{' + FIELD_VALUES + replacer + '}}');
            field.setAttribute('messages-custom', '[[' + FIELD_MESSAGES + replacer + ']]');
            field.setAttribute('display-options.messages', 'none');

            if (field_inputTextForBoolean !== null){
              field_inputTextForBoolean.setAttribute('value', '{{' + FIELD_VALUES + replacer + '}}');
              field_inputTextForBoolean.setAttribute('messages-custom', '[[' + FIELD_MESSAGES + replacer + ']]');
              field_inputTextForBoolean.setAttribute('display-options.messages', 'none');
            }
          }

          if (typeof field !== 'undefined') {
            var messageArea = document.createElement('div');
            messageArea.setAttribute('class', '');
            field.append(messageArea);
          }

          if (typeof self[FIELD_MESSAGES + replacer] === 'undefined') {
            self[FIELD_MESSAGES + replacer] = ko.observableArray([]);
            self.dynamicMessageFields.push(self[FIELD_MESSAGES + replacer]);
          }

          if (typeof field !== 'undefined') {
            if (pdjTypes.isUploadedFileType(name)){
              const params = {
                field: field,
                id: name,
                choose: { 'on-click': '[[chooseFileClickHandler]]', iconFile: self.i18n.icons.choose.iconFile, tooltip: self.i18n.icons.choose.tooltip},
                clear: { 'on-click': '[[clearChosenFileClickHandler]]', iconFile: self.i18n.icons.clear.iconFile, tooltip: self.i18n.icons.clear.tooltip},
              };
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
                restartRequired: pdjTypes.isRestartNeeded(name),
                needsWdtIcon: isWdtForm(),
                nameLabel: pdjTypes.getLabel(name),
                supportsModelTokens: pdjTypes.isSupportsModelTokens(name),
                supportsUnresolvedReferences: pdjTypes.isSupportsUnresolvedReferences(name),
                valueFrom: pdjTypes.valueFrom(name,dataValues[name]),
                showMoreIcon: (
                  pdjTypes.hasOptionsSources(name, dataValues[name])
                  && !pdjTypes.isReadOnly(name)
                  && !Runtime.isReadOnly()
                  && pdjTypes.isReferenceType(name)
                ),
                icons: {
                  restart: {iconFile: self.i18n.icons.restart.iconFile, tooltip: self.i18n.icons.restart.tooltip},
                  wdtIcon: {iconFile: self.i18n.icons.wdtIcon.iconFile, tooltip: self.i18n.icons.wdtIcon.tooltip},
                  more: {iconFile: (pdjTypes.isReadOnly(name) || Runtime.isReadOnly() ? self.i18n.icons.more.iconFile.grayed: self.i18n.icons.more.iconFile.enabled), iconClass: self.i18n.icons.more.iconClass, tooltip: self.i18n.icons.more.tooltip}
                }
              };

              if (field.className !== 'cfe-multi-select'
                && field.className !== 'cfe-property-list-editor'
              ) {
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
              self[`${FIELD_DISABLED}${name}`] = ko.observable(false);
              field.setAttribute('disabled', `[[${FIELD_DISABLED}${name}]]`);

              // Track a field unset action which restores that value to the default setting
              self[`${FIELD_UNSET}${name}`] = ko.observable(false);
            }
          }
          formLayout.append(container);
        }  //end of for loops
        if (isWdtForm()) {
          self.doWdtDialogPopup = true;
        }
        if (!isWizardForm()) {
          setupUsedIfListeners(properties);
        }
      }

       function populateSliceTable(
         properties,
         table,
         pdjTypes,
         dataValues,
         isSingleColumn,
         isReadOnly
       ) {
         let rows = [];
         let rowObj = {};

         for (let i = 0; i < properties.length; i++) {
           let name = properties[i].name;

           const helpInstruction = PageDefinitionFields.createHelpInstruction(
             name,
             pdjTypes
           );

           let value;
           

           dataValues.forEach((dataValue) => {
             // Get the text display value for the data or null
             value = pdjTypes.getDisplayValue(name, dataValue[name]);
             if (value === null) value = '';
             rowObj[name] = value;
           });
         }
         rows.push(rowObj);

         const columns = properties.map((dc) => {
           return { field: dc.name, headerText: dc.label };
         });

         table.setAttribute('columns', JSON.stringify(columns));

         self['sliceRows'] = new ArrayDataProvider(rows);
         self['sliceTableChangeListener'] = (event) => {
           {
             const row = event.detail.value.row;

             if (row.values().size > 0) {
               // if the selected row contains resourceData, navigate to it
               row.values().forEach(function (key) {
                 let row = rows[key];

                 if (row.resourceData) {
                   // fix the navtree
                   viewParams.signaling.navtreeSelectionCleared.dispatch();
                   Router.rootInstance.go(
                     '/' +
                       viewParams.perspective.id +
                       '/' +
                       encodeURIComponent(row.resourceData)
                   );
                 }
               });
             }
           }
         };

         table.setAttribute('data', '[[ sliceRows ]]');
         table.setAttribute('id', 'table');
         table.setAttribute('class', 'wlstable');
         table.setAttribute('aria-label', 'Table');
         table.setAttribute(
           'selection-mode',
           JSON.stringify({ row: 'single', column: 'none' })
         );
         table.setAttribute(
           'on-selected-changed',
           '[[ sliceTableChangeListener ]]'
         );
       }

      this.contextMenuClickListener = function (event) {
        event.preventDefault();
        unsetProperty(PageDefinitionUnset.getAction(event));
      };

      /**
       * Use the action to change the settings for the specified property
       * @param {string} action
       * @private
       */
      function unsetProperty(action) {
        if (CoreUtils.isNotUndefinedNorNull(action)) {
          self[`${FIELD_UNSET}${action.field}`](action.unset);
          //This keeps the behavior for unset field to be the same as release 1.
          if (!isWdtForm()) {
            self[`${FIELD_DISABLED}${action.field}`](action.disabled);
          }
          self.dirtyFields.add(action.field);
          if (isWdtForm()){
            self.doWdtDialogPopup = false;
            self[`${FIELD_VALUES}${action.field}`]('');
            self[`${FIELD_VALUE_SET}${action.field}`](false);
            self.doWdtDialogPopup = true;
          }
          else
            self[`${FIELD_VALUES}${action.field}`]('');
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

      this.moreMenuIconClickListener = function (event) {
        event.preventDefault();
        self.optionsSources.showMoreMenuItems(event);
      };

      this.moreMenuClickListener = function (event) {
        event.preventDefault();
        const optionsSourceConfig = self.optionsSources.handleMenuItemSelected(event, self.rdjData, viewParams);
        switch (optionsSourceConfig.action) {
          case 'edit':
            self.dirtyFields.delete(optionsSourceConfig.name);
            break;
          case 'create':
            self.optionsSources.createOverlayFormDialogModuleConfig(viewParams, optionsSourceConfig, updateShoppingCart, refreshForm)
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
      function refreshForm(){
        self.loadRdjDoNotClearDirty = true;
        const dataPayload = getDirtyFieldsPayload(true);
        cacheDataPayload(dataPayload);
        renderPageData('', false);
        PageDefinitionUtils.setPlacementRouterParameter(viewParams.parentRouter, 'embedded');
      }

      function updateShoppingCart(eventType){
        if (viewParams.perspective.id === 'configuration') {
          self.formToolbarModuleConfig
            .then((moduleConfig) => {
            const changeManager = moduleConfig.viewModel.changeManager();
          ChangeManager.getData()
            .then(data => {
            let flag = true;
          let content = data.data[ChangeManager.Section.ADDITIONS.name];
          if (content.length <= 0) {
            content = data.data[ChangeManager.Section.MODIFICATIONS.name];
            if (content.length <= 0) {
              content = data.data[ChangeManager.Section.REMOVALS.name];
              if (content.length <= 0) {
                flag = false;
              }
            }
          }
          moduleConfig.viewModel.changeManager({ isLockOwner: (flag), hasChanges: (flag), supportsChanges: data.changeManager.supportsChanges });
        });

          moduleConfig.viewModel.renderToolbarButtons(eventType);
        });
        }
      }

      function getCreateFormPayload(properties) {
        if (isWizardForm()) properties = self.createForm.getRenderProperties();

        // Set things up to return a null if there are no properties
        let results = {properties: properties, data: null};

        if (properties.length > 0) {
          let replacer, fieldValues = {}, fieldValuesFrom = {};

          properties.forEach((property) => {
            replacer = property.name;
          if (isWizardForm()) {
            const result = self.createForm.getBackingDataAttributeReplacer(replacer);
            if (CoreUtils.isNotUndefinedNorNull(result)) replacer = result;
          }
          fieldValues[property.name] = self[`${FIELD_VALUES}${replacer}`];
          if(isWdtForm()){
            fieldValuesFrom[property.name] = self[`${FIELD_VALUE_FROM}${replacer}`];
          }
        });

          if (self.createForm.hasMultiFormData()) {
            self.createForm.postMultiFormDataPayload(properties, fieldValues)
              .then((data) => {
              handleSaveResponse(data, '', {}, 'create', (typeof self.pdjData.sliceForm !== 'undefined'))
          });
            results.data = undefined;
          }
          else if (self.createForm.hasDeploymentPathData()) {
            results = self.createForm.getDeploymentDataPayload(properties, fieldValues);
          }
          else {
            results = self.createForm.getDataPayload(properties, fieldValues, (isWdtForm())? fieldValuesFrom : null);
          }
        }

        return results;
      }

      function getSliceProperties(pdjData, includeAdvancedFields) {
        let properties;
        if (isWizardForm()) {
          properties = self.createForm.getRenderProperties();
        }
        else {
          if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm)) {
            properties = pdjData.sliceForm.properties;
            if (CoreUtils.isUndefinedOrNull(properties)){
              const sections = pdjData.sliceForm.sections;
              properties = [];
              if (CoreUtils.isNotUndefinedNorNull(sections)){
                sections.forEach((section, index) => {
                  // If the section doesn't have a properties
                  // property, just skip over it.
                  if (CoreUtils.isNotUndefinedNorNull(section.properties)) {
                  properties = properties.concat(section.properties);
                }
              });
              }
            }
            if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm.advancedProperties)) {
              if (includeAdvancedFields || self.showAdvancedFields().length !== 0) {
                properties = properties.concat(pdjData.sliceForm.advancedProperties);
              }
            }
          } else if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceTable)) {
            properties = pdjData.sliceTable.displayedColumns;
          }

          if (CoreUtils.isUndefinedOrNull(properties)) properties = pdjData.createForm.properties;
        }

        return properties;
      }

      function createHelp(pdjData) {
        const helpForm = new HelpForm(viewParams);

        self.tableHelpColumns(helpForm.tableHelpColumns);
        helpForm.setPDJData(pdjData);
        const includeAdvancedFields = (self.showAdvancedFields().length !== 0);
        const properties = getSliceProperties(pdjData, includeAdvancedFields);
        const helpData = helpForm.getHelpData(
          properties,
          helpForm.i18n.tables.help.columns.header.name,
          helpForm.i18n.tables.help.columns.header.description
        );
        self.helpDataSource(helpData);
        const div = helpForm.render();
        self.helpFooterDom({ view: HtmlUtils.stringToNodeArray(div.outerHTML), data: self });
      }
    }

    return FormViewModel;
  }
);
 