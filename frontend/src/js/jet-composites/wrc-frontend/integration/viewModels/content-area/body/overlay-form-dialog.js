/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', 'wrc-frontend/apis/data-operations', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/microservices/navtree/navtree-manager', 'wrc-frontend/microservices/perspective/perspective-memory-manager', 'wrc-frontend/microservices/page-definition/types', 'wrc-frontend/microservices/page-definition/fields', 'wrc-frontend/microservices/page-definition/form-layouts', 'wrc-frontend/microservices/page-definition/unset', 'wrc-frontend/microservices/page-definition/utils', './create-form', './help-form', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'wrc-frontend/core/types', 'wrc-frontend/core/runtime', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojbinddom', 'ojs/ojinputtext', 'ojs/ojlabel', 'ojs/ojswitch', 'ojs/ojselectcombobox', 'ojs/ojformlayout', 'ojs/ojasyncvalidator-regexp', 'ojs/ojconveyorbelt', 'ojs/ojmessages', 'ojs/ojmodule-element', 'ojs/ojmodule', 'cfe-multi-select/loader', 'ojs/ojselectsingle', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojcheckboxset'],
  function (oj, ko, Router, ArrayDataProvider, HtmlUtils, DataOperations, MessageDisplaying, NavtreeManager, PerspectiveMemoryManager, PageDataTypes, PageDefinitionFields, PageDefinitionFormLayouts, PageDefinitionUnset, PageDefinitionUtils, CreateForm, HelpForm, ViewModelUtils, CoreUtils, CoreTypes, Runtime, Context, Logger) {
    function OverlayDialogViewModel(viewParams) {

      const FIELD_DISABLED = Object.freeze('fieldDisabled_');
      const FIELD_UNSET = Object.freeze('fieldUnset_');
      const FIELD_MESSAGES = Object.freeze('fieldMessages_');
      const FIELD_SELECTDATA = Object.freeze('fieldSelectData_');
      const FIELD_VALUES = Object.freeze('fieldValues_');

      var self = this;

      this.i18n = {
        introduction: {
          toggleHelp: {
            iconFile: 'toggle-help-icon-blk_16x16.png',
            text: oj.Translations.getTranslatedString('wrc-form.introduction.toggleHelp.text', '{0}')
          }
        },
        buttons: {
          'save': { id: 'save', iconFile: ko.observable('save-icon-blk_24x24'), disabled: ko.observable(false),
            label: ko.observable(oj.Translations.getTranslatedString('wrc-form-toolbar.buttons.save.label'))
          },
          'finish': { id: 'finish', iconFile: 'add-icon-blk_24x24', disabled: ko.observable(true),
            label: oj.Translations.getTranslatedString('wrc-form-toolbar.buttons.finish.label')
          }
        },
        icons: {
          'save': { id: 'save', iconFile: 'save-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-form-toolbar.icons.save.tooltip')
          },
          'create': { id: 'create', iconFile: 'add-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-form-toolbar.icons.create.tooltip')
          },
          'help': { iconFile: 'toggle-help-on-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-form-toolbar.icons.help.tooltip')
          },
          'restart': {iconFile: 'restart-required-org_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-form.icons.restart.tooltip')
          },
          'choose': {iconFile: 'choose-file-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.choose.value')
          },
          'clear': {iconFile: 'erase-icon-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.clear.value')
          },
          'more': {iconFile: 'more-vertical-brn-8x24', iconClass: 'more-vertical-icon',
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.more.value')
          }
        }
      };

      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(viewParams.perspective.id);

      this.dirtyFields = new Set();
      this.pageRedoHistory = {};
      this.dynamicMessageFields = [];
      this.multiSelectControls = {};
      this.saveButtonDisabledVoting = {checkboxSetChanged: true, multiSelectChanged: true, inputFieldChanged: true, nonInputFieldChanged: true};
      this.debugFlagItems = ko.observable();
      this.debugFlagsEnabled = ko.observableArray([]);

      this.fieldMessages = ko.observableArray([]);

      this.overlayFormDom = ko.observable({});
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

      this.valueSubscriptions = [];
      this.subscriptions = [];

      this.connected = function () {
        if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
          document.title = viewParams.parentRouter.data.pageTitle();
        }

        renderToolbarButtons();

        const pdjData = viewParams.parentRouter.data.pdjData();
        if (CoreUtils.isNotUndefinedNorNull(pdjData.createForm)) {
          const mode = CreateForm.prototype.Mode.SCROLLING;
          self.createForm = new CreateForm(viewParams, rerenderWizardForm, mode);
        }

        renderPage();

        const rdjSub = viewParams.parentRouter.data.rdjData.subscribe(renderPage.bind(this));
        self.subscriptions.push(rdjSub);
      }.bind(this);

      this.disconnected = function () {
        self.subscriptions.forEach(function (subscription) {
          subscription.dispose();
        });
        self.subscriptions = [];

        self.valueSubscriptions.forEach(function (item) {
          item.subscription.dispose();
        });
        self.valueSubscriptions = [];
      };

      this.finishAction = function (event) {
        viewParams.signaling.navtreeSelectionCleared.dispatch();
        return finishWizardForm();
      };

      this.onSave = ko.observable(
        function (event) {
          // clear treenav selection
          viewParams.signaling.navtreeSelectionCleared.dispatch();
          saveBean('update');
        }
      );

      this.helpPageClick = function (event) {
        function toggleToolbarButtonsVisibility(visible) {
          const ele = document.getElementById('form-toolbar-buttons');
          ele.style.display = (visible ? 'none' : 'inline-flex');
        }

        function toggleHelpPage(withHelpVisible, withHistoryVisible) {
          self.showHelp(withHelpVisible);
          setFormContainerMaxHeight(withHistoryVisible);
          if (withHelpVisible === false){
            const pdjData = viewParams.parentRouter.data.pdjData();
            const rdjData = viewParams.parentRouter.data.rdjData();
            renderFormLayout(pdjData, rdjData);
          }
        }

        const helpVisible = !self.showHelp();
        toggleToolbarButtonsVisibility(helpVisible);
        toggleHelpPage(helpVisible, false);
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
        if (self.isWizardForm()) {
          let replacer = self.createForm.getBackingDataAttributeReplacer(fieldName);
          if (typeof replacer === 'undefined') replacer = fieldName;
          if (typeof self[FIELD_VALUES + replacer] === 'undefined') {
            self[FIELD_VALUES + replacer] = ko.observable();
            self.dirtyFields.add(fieldName);
          }
          createFieldValueSubscription(self.valueSubscriptions, fieldName, replacer);
          self[FIELD_VALUES + replacer](values);
        }
        const availableItems = self.multiSelectControls[fieldName].availableItems.concat(self.multiSelectControls[fieldName].chosenItems);
        const result = PageDefinitionFields.createMultiSelectControlItem(availableItems, fieldValue);
        self.multiSelectControls[fieldName].availableItems = result.availableItems;
        self.multiSelectControls[fieldName].chosenItems = result.chosenItems;

        if (!self.isWizardForm()) {
          const result = PageDefinitionFields.getMultiSelectChosenItems(
            self.multiSelectControls[fieldName].chosenItems,
            self.multiSelectControls[fieldName].origChosenLabels
          );
          resetSaveButtonDisabledState({disabled: !result.isDirty});
        }
      };

      this.debugFlagsValueChanged = function(event) {
        const dataPayload = PageDefinitionFields.getDebugFlagItems(self.debugFlagItems(), self.debugFlagsEnabled());
        resetSaveButtonDisabledState({disabled: Object.keys(dataPayload).length === 0});
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

      this.determineChanges = function () {
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

        function getDebugPayload() {
          return PageDefinitionFields.getDebugFlagItems(self.debugFlagItems(), self.debugFlagsEnabled());
        }

        let dataPayload = {};
        var data = self.rdjData.data;

        const formElement = document.getElementById('wlsform');
        if (CoreUtils.isUndefinedOrNull(formElement)) {
          return dataPayload;
        }

        // Obtain the payload and flag that scrubData is needed for posting to the backend
        const results = getCreateFormPayload(self.pdjData.createForm.properties, true);
        return results.data;
      };

      function showModalDialog(title, propertyLabel) {
        const overlayFormDialog = document.getElementById('overlayFormDialog');
        overlayFormDialog.setAttribute('dialog-title', title);
        const ele = document.getElementById('linked-property-label');
        if (ele !== null) ele.innerText = propertyLabel;
        overlayFormDialog.open();
      }

      this.isWizardForm = () => {
        let rtnval = false;
        if (self.pdjData !== null) {
          if (CoreUtils.isNotUndefinedNorNull(self.pdjData.createForm) && CoreUtils.isNotUndefinedNorNull(self.createForm.isWizard) && self.createForm.isWizard()) {
            rtnval = true;
          }
        }
        return rtnval;
      };

      function finishWizardForm() {
        if (self.isWizardForm()) {
          const pageState = self.createForm.markAsFinished();
          if (pageState.succeeded) saveBean('finish');
        }
      }

      /**
       * Returns whether fields on the form have been changed
       * @returns {boolean}
       */
      this.isDirty = function () {
        const changes = this.determineChanges();
        const numberOfChanges = Object.keys(changes).length;

        return (numberOfChanges !== 0);
      };

      function renderToolbarButtons() {
        const ele = document.getElementById('form-toolbar-save-button');
        if (ele !== null) ele.style.display = 'inline-flex';
        resetSaveButtonDisplayState([{id: 'create'}]);
      }

      function resetButtonsDisabledState(buttons) {
        buttons.forEach((button) => {
          self.i18n.buttons[button.id].disabled(button.disabled);
        });
      }

      function resetSaveButtonDisabledState(state) {
        resetButtonsDisabledState([
          {id: 'save', disabled: false}
        ]);
      }

      function resetSaveButtonDisplayState(buttons) {
        buttons.forEach((button) => {
          self.i18n.buttons.save.label(self.i18n.icons[button.id].tooltip);
          self.i18n.buttons.save.iconFile(self.i18n.icons[button.id].iconFile);
        });
      }

      function saveBean(eventType) {
        function saveDataPayload(eventType, isEdit, dataAction) {
          let dataPayload = self.determineChanges(false);

          // First, check for empty payload and return when there is no data
          if (isEdit && (dataPayload != null) && (Object.keys(dataPayload).length === 0)) {
            Logger.log('POST data is empty while isEdit=true, exiting save!');
            return;
          }

          // Second, check for no payload and instead POST an empty data object
          if (dataPayload === null) dataPayload = {};

          if (typeof dataPayload !== 'undefined') {
            Logger.log(`POST dataPayload=${JSON.stringify(dataPayload)}`);
            const rdjUrl = viewParams.parentRouter.data.rdjUrl().replace('?dataAction=new', dataAction);
            DataOperations.mbean.save(rdjUrl, dataPayload)
              .then(reply => {
                handleSaveResponse(reply, dataAction, dataPayload, eventType, isEdit);
              })
              .catch(response => {
                handleSaveResponse(response, dataAction, dataPayload, eventType, isEdit);
              });
          }
        }

        saveDataPayload(eventType, false, '?action=create');
      }

      /**
       * Method to perform "post-Save" activities for a successful save operation, based on the values of specific parameters.
       * <p>The assumption here is that the save operation was successful, with regards to the Promise returned. This means that a Promise rejection should not result in this method being called.</p>
       * @param {{body: {data: any, messages?: any}}} response - The response object return from the successful save operation.
       * @param {string} dataAction - Query parameter that was used with the successful save operation.
       * @param {object} dataPayload - JSON payload that was used in the successful save operation.
       * @param {"create"|"finish"|"update"} eventType - The type of event that was associated with the successful save operation.
       * @param {boolean} isEdit - Flag indicating if the save operation was for a "create" event, or an "update" event. The flag will be false for the former, and true for the latter.
       */
      function handleSaveResponse(response, dataAction, dataPayload, eventType, isEdit) {
        const properties = getSliceProperties(self.pdjData);
        const bodyMessages = ViewModelUtils.getResponseBodyMessages(response, properties);
        if (bodyMessages.length > 0) {
          MessageDisplaying.displayMessages(bodyMessages);
        }

        self.debugFlagsEnabled(PageDefinitionFields.resetDebugFlagsEnabled(self.debugFlagItems()));

        resetButtonsDisabledState([
          {id: 'save', disabled: false}
        ]);

        if (typeof response.failureType !== 'undefined' && response.body.messages.length === 0) {
          saveFailedNoMessages(dataAction, dataPayload, isEdit);
        }
        else if (response.body.messages.length === 0) {
          const identity = (!isEdit ? response.body.data?.resourceData?.resourceData : undefined);
          saveSuceededNoMessages(eventType, dataPayload, isEdit, identity);
        }
      }

      function saveFailedNoMessages(dataAction, dataPayload, isEdit) {
        function compensatingTransactionFailure(response) {
          if (response.body.messages.length > 0) {
            Logger.error('Compensating transaction failed!');
            MessageDisplaying.displayResponseMessages(response.body.messages);
          }
        }

        if (typeof dataPayload['Name'] !== 'undefined') {
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
        let treeaction = {
          isEdit: isEdit,
          path: decodeURIComponent(viewParams.parentRouter.data.rawPath())
        };

        // fix the navtree
        viewParams.signaling.navtreeUpdated.dispatch(treeaction);
        // clear treenav selection
        viewParams.signaling.navtreeSelectionCleared.dispatch();

        const pathSegments = PageDefinitionUtils.pathSegmentsFromIdentity(identity);
        Logger.info(`[OVERLAYFORMDIALOG] path=${pathSegments.join('/')}`);

        viewParams.onSaveSuceeded(eventType);
        viewParams.onFormRefresh();
        viewParams.onSaveContent();
        const overlayFormDialog = document.getElementById('overlayFormDialog');
        if (overlayFormDialog !== 'null') overlayFormDialog.close();
      }

      function renderPage() {
        var pdjData = viewParams.parentRouter.data.pdjData();
        var rdjData = viewParams.parentRouter.data.rdjData();

        let isEdit;

        // If the observable updates and no longer references
        // a table do nothing.. <perspective.id>.js will route
        if (typeof pdjData.sliceForm !== 'undefined') {
          isEdit = true;
        }
        else if (typeof pdjData.createForm !== 'undefined') {
          isEdit = false;
        }
        else {
          return;
        }

        // update the wls-form component
        self.pdjData = viewParams.parentRouter.data.pdjData();
        self.rdjData = viewParams.parentRouter.data.rdjData();

        const toggleHelpIntroduction = self.i18n.introduction.toggleHelp.text.replace('{0}','<img src=\'js/jet-composites/wrc-frontend/1.0.0/images/' + self.i18n.introduction.toggleHelp.iconFile + '\'>');
        const bindHtml = getIntroductionHtml(pdjData.introductionHTML, rdjData.introductionHTML);
        self.introductionHTML({ view: HtmlUtils.stringToNodeArray(bindHtml) });

        pdjData = viewParams.parentRouter.data.pdjData();
        rdjData = viewParams.parentRouter.data.rdjData();

        if (CoreUtils.isNotUndefinedNorNull(rdjData) && CoreUtils.isNotUndefinedNorNull(pdjData)) {
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
          removed.forEach((item) => {
            // Remove the subscription that matches item.name.
            processRemovedField(item.name);
          });
        }

        const pageState = self.createForm.rerenderPage(direction);
        if (pageState.succeeded) {
          resetButtonsDisabledState([
            {id: 'finish', disabled: !self.createForm.getCanFinish()}
          ]);

          renderFormLayout(pdjData, rdjData);
        }
      }

      function renderFormLayout(pdjData, rdjData) {
        let div;

        if (self.isWizardForm()) {
          div = renderWizardForm(rdjData);
        }
        else {
          self.perspectiveMemory.contentPage.nthChildren = [];
          div = renderForm(pdjData, rdjData);
        }

        createHelp(pdjData);

        self.overlayFormDom({ view: HtmlUtils.stringToNodeArray(div.outerHTML), data: self });

        setTimeout(() => {
            Context.getPageContext().getBusyContext().whenReady()
              .then( () => {
                renderSpecialHandlingFields();
                showModalDialog(viewParams.title, viewParams.property.name);
              });
          }, 5
        );
      }

      function setFormContainerMaxHeight(withHistoryVisible){
        // We don't need anything here, because the CSS for
        // the overlayFormDialog dialog box covers min-height
        // and min-width requirements. Clicking the toggleHelp
        // icon will cause the height of the dialog box to
        // stretch/shrink to accommodate everything, when the
        // user goes into help mode.
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
        // Obtain the payload and flag that scrubData is not needed for rendering
        const results = getCreateFormPayload(properties, false);

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

        if (typeof rdjData.data !== 'undefined') {
          //formLayout is built as single column, so just pass in the params as true.
          populateFormLayout(properties, formLayout, pdjTypes, rdjData.data, true, false)
        }

        return div;
      }

      function renderForm(pdjData, rdjData) {
        const div = document.createElement('div');
        div.setAttribute('id', 'cfe-form');
        div.style.display = 'block';

        const properties = getSliceProperties(pdjData);

        // Setup PDJ type information for the properties being handled on this form
        const pdjTypes = new PageDataTypes(properties, viewParams.perspective.id);

        let formLayout = null;

        const isUseCheckBoxesForBooleans = PageDefinitionFormLayouts.hasFormLayoutType(pdjData, 'useCheckBoxesForBooleans');
        const isSingleColumn = PageDefinitionFormLayouts.hasFormLayoutType(pdjData, 'singleColumn');
        const hasFormLayoutSections = PageDefinitionFormLayouts.hasFormLayoutSections(pdjData);
        const isReadOnly = (self.readonly() && (['configuration','view','security','composite'].indexOf(viewParams.perspective.id) !== -1));

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
          }
          else {
            formLayout = PageDefinitionFormLayouts.createTwoColumnFormLayout({labelWidthPcnt: '45%', maxColumns: '2'} );
            div.append(formLayout);
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
            populateFormLayout(properties, formLayout, pdjTypes, rdjData.data, isSingleColumn, isReadOnly);
          }
        }
        return div;
      }

      function createFieldValueSubscription(valueSubscriptions, name, replacer){
        // Check if the subscription already exists and simply return
        const subscribed = valueSubscriptions.find(sub => sub.name === name);
        if (CoreUtils.isNotUndefinedNorNull(subscribed)) return;

        // Define the callback function used when the field is updated
        const updatedFieldValueCallback = (newValue) => {
          self.dirtyFields.add(name);
          if (self.isWizardForm()) {
            self.createForm.backingDataAttributeValueChanged(name, newValue);
          }
          else {
            resetSaveButtonDisabledState({disabled: !self.isDirty()});
            if (!self[`${FIELD_UNSET}${name}`]()) {
              PageDefinitionUnset.addPropertyHighlight(name);
            }
          }
        };

        // Subscribe to the field then store the subscription with the field name
        const subscription = self[`${FIELD_VALUES}${replacer}`].subscribe(updatedFieldValueCallback);
        valueSubscriptions.push({ name: name, subscription: subscription });
      }

      function processRemovedField(name){
        // Remove the subscription that exists for the removed field
        let index = self.valueSubscriptions.findIndex(sub => sub.name === name);
        if (index !== -1) {
          self.valueSubscriptions[index].subscription.dispose();
          self.valueSubscriptions.splice(index, 1);
          self.dirtyFields.delete(name);
        }
        let replacer = self.createForm.getBackingDataAttributeReplacer(name);
        if (typeof replacer === 'undefined') replacer = name;
        if (typeof self[`${FIELD_VALUES}${replacer}`] !== 'undefined') delete self[`${FIELD_VALUES}${replacer}`];
        if (typeof self[`${FIELD_SELECTDATA}${replacer}`] !== 'undefined') delete self[`${FIELD_SELECTDATA}${replacer}`];
        if (typeof self[`${FIELD_MESSAGES}${replacer}`] !== 'undefined') {
          index = self.dynamicMessageFields.indexOf(self[`${FIELD_MESSAGES}${replacer}`]);
          if (index !== -1) self.dynamicMessageFields.splice(index, 1);
          delete self[`${FIELD_MESSAGES}${replacer}`];
        }

        index = self.perspectiveMemory.nthChildrenItems.call(self.perspectiveMemory).map(nthChild1 => nthChild1.name).indexOf(replacer);
        if (index !== -1) self.perspectiveMemory.nthChildrenItems.call(self.perspectiveMemory).splice(index, 1);

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

          let toggleDisableFunc = (newValue) => {
            // Prevent a property from becoming enabled/disabled
            // when value has been unset
            if (self[`${FIELD_UNSET}${name}`]() || self[`${FIELD_UNSET}${propertyName}`]()) {
              Logger.info('Prevent usedIf handling for unset field: ' + name);
              return;
            }

            // See if the new value enables the field or not
            const enabled = usedIf.values.find((item) => {return item === newValue; });
            self[`${FIELD_DISABLED}${name}`](!enabled);
          };

          // Call event callback to initialize, then set up
          // subscription.
          toggleDisableFunc(self[`${FIELD_VALUES}${propertyName}`]());
          const subscription = self[`${FIELD_VALUES}${propertyName}`].subscribe(toggleDisableFunc);
          self.subscriptions.push(subscription);
        });
      }

      function populateFormLayout(properties, formLayout, pdjTypes, dataValues, isSingleColumn, isReadOnly){
        for (let i = 0; i < properties.length; i++) {
          let name = properties[i].name;

          const helpInstruction = PageDefinitionFields.createHelpInstruction(name, pdjTypes);

          let replacer = name, labelEle, field, value, container, createValue = null;

          if (self.isWizardForm()) {
            const result = self.createForm.getBackingDataAttributeReplacer(replacer);
            if (typeof result !== 'undefined') replacer = result;
            if (typeof self[FIELD_VALUES + replacer] === 'undefined') {
              // Add name to wizard page in backing data
              self.createForm.addBackingDataPageData(name);
            }
          }

          // Get the text display value for the data or null
          value = pdjTypes.getDisplayValue(name, dataValues[name]);
          if (value === null) value = '';

          // special case... if there is only one read-only field that
          // is an array, display it as a table.
          let tableProperty = false;
          if (properties.length === 1 && pdjTypes.isReadOnly(name) && pdjTypes.isArray(name)) {
            const singlePropertyTable = PageDefinitionFields.createSinglePropertyTable(name, value, pdjTypes);
            tableProperty = singlePropertyTable.property;
            self.singlePropertyTableDataProvider = singlePropertyTable.dataProvider;
            self.singlePropertyTableColumns = singlePropertyTable.columns;
            field = singlePropertyTable.field;
          } else if (pdjTypes.isBooleanType(name) && (!pdjTypes.isReadOnly(name)) && (!isReadOnly)) {
            field = PageDefinitionFields.createSwitch({'className': 'cfe-form-switch', 'disabled': false});
          }
          else if (pdjTypes.isDynamicEnumType(name) || pdjTypes.hasLegalValues(name)) {
            if (pdjTypes.isArray(name)) {
              const multiSelect = PageDefinitionFields.createMultiSelect(dataValues, name);

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
            }
            else {
              const dataProviderName = FIELD_SELECTDATA + replacer;
              const options = {
                'name': name,
                'isEdit': (typeof self.pdjData.sliceForm !== 'undefined'),
                'isSingleColumn': isSingleColumn,
                'isReadOnly': isReadOnly
              };

              const singleSelect = PageDefinitionFields.createSingleSelect(pdjTypes, value, dataValues, options );
              self[dataProviderName] = singleSelect.dataProvider;
              field = singleSelect.field;
              field.setAttribute('data', '[[' + dataProviderName + ']]');
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
            field = PageDefinitionFields.createInputPassword('cfe-form-input-password');
          }
          else if (pdjTypes.isArray(name) || pdjTypes.isPropertiesType(name)) {
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
              let fieldColumn = (isSingleColumn || ((fieldIndex % 2) != 0) ? 2 : 4);
              nthChild = { name: name, row: fieldRow, col: fieldColumn, minHeight: '52px' };
            }
            self.perspectiveMemory.upsertNthChildrenItem.call(self.perspectiveMemory, nthChild);
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

          if (tableProperty) {
            formLayout.append(document.createElement('div'));
          } else {
            labelEle = PageDefinitionFields.createLabel(name, pdjTypes, helpInstruction);
            if (!isSingleColumn && field.classList.contains('cfe-multi-select')) {
              formLayout.append(document.createElement('div'));
            }
            formLayout.append(labelEle);
          }

          if (typeof field !== 'undefined' && field.className !== 'cfe-multi-select') {
            field.setAttribute('id', name);
            field.setAttribute('label-edge', 'provided');

            // Get the actual value for the observable to preserve type
            let observableValue = createValue;
            if (observableValue === null) {
              observableValue = pdjTypes.getObservableValue(name, dataValues[name], value);
            }

            const observableName = FIELD_VALUES + replacer;
            if (typeof self[observableName] !== 'undefined') {
              if (!self.isWizardForm()) {
                self[observableName](observableValue);
                //the above call actually triggers the subscription and mark this as dirty.
                //since the value hasn't really changed, we need to remove it from the dirtyField list.
                self.dirtyFields.delete(name);
              }
            }
            else {
              if (self.isWizardForm()) observableValue = '';
              self[observableName] = ko.observable(observableValue);
            }

            createFieldValueSubscription(self.valueSubscriptions, name, replacer);

            if (self.isWizardForm()) {
              if (self[FIELD_VALUES + replacer]() === '') {
                self[FIELD_VALUES + replacer](dataValues[name].value);
              }
            }

            field.setAttribute('value', '{{' + FIELD_VALUES + replacer + '}}');
            field.setAttribute('messages-custom', '[[' + FIELD_MESSAGES + replacer + ']]');
            field.setAttribute('display-options.messages', 'none');
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
            if (field.className === 'cfe-multi-select') {
              container = field;
            }
            else if (pdjTypes.isUploadedFileType(name)){
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
                field: field,
                readOnly: (pdjTypes.isReadOnly(name) || Runtime.isReadOnly()),
                valueSet: pdjTypes.isValueSet(name, dataValues[name]),
                restartRequired: pdjTypes.isRestartNeeded(name),
                showMoreIcon: (
                  pdjTypes.hasOptionsSources(name, dataValues[name])
                  && !pdjTypes.isReadOnly(name)
                  && !Runtime.isReadOnly()
                  && pdjTypes.isReferenceType(name)
                ),
                icons: {
                  restart: {iconFile: self.i18n.icons.restart.iconFile, tooltip: self.i18n.icons.restart.tooltip},
                  more: {iconFile: self.i18n.icons.more.iconFile, iconClass: self.i18n.icons.more.iconClass, tooltip: self.i18n.icons.more.tooltip}
                }
              };

              container = PageDefinitionFields.addFieldIcons(params);
            }

            if (!self.isWizardForm()) {
              self[`${FIELD_DISABLED}${name}`] = ko.observable(false);
              field.setAttribute('disabled', `[[${FIELD_DISABLED}${name}]]`);

              // Track a field unset action which restores that value to the default setting
              self[`${FIELD_UNSET}${name}`] = ko.observable(false);
            }
          }

          formLayout.append(container);
        }  //end of for loops

        if (!self.isWizardForm()) {
          setupUsedIfListeners(properties);
        }
      }

      this.contextMenuClickListener = function (event) {
        event.preventDefault();
        // Get the action information for the context menu event
        // and then perform the unset handling on the property
        unsetProperty(PageDefinitionUnset.getAction(event));
      };

      function unsetProperty(action) {
        // Use the action to change the settings for the specified property
        if (CoreUtils.isNotUndefinedNorNull(action)) {
          self[`${FIELD_UNSET}${action.field}`](action.unset);
          self[`${FIELD_DISABLED}${action.field}`](action.disabled);
          self.dirtyFields.add(action.field);
          self[`${FIELD_VALUES}${action.field}`]('');
        }
      }

      function restoreUnsetFieldsApplyHighlighting() {
        // The unset fields are applied as if the context menu triggered the action
        // and the updated fields are highlighted again to show they are modified...
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

      function getCreateFormPayload(properties, scrubData) {
        if (self.isWizardForm()) properties = self.createForm.getRenderProperties();

        // Set things up to return a null if there are no properties
        let results = {properties: properties, data: null};

        if (properties.length > 0) {
          let replacer, fieldValues = {};

          properties.forEach((property) => {
            replacer = property.name;
            if (self.isWizardForm()) {
              const result = self.createForm.getBackingDataAttributeReplacer(replacer);
              if (CoreUtils.isNotUndefinedNorNull(result)) replacer = result;
            }
            fieldValues[property.name] = self[`${FIELD_VALUES}${replacer}`];
          });

          if (self.createForm.hasMultiFormData()) {
            self.createForm.postMultiFormDataPayload(properties, fieldValues)
              .then((data) => {
                handleSaveResponse(data, '', {}, 'create', (typeof self.pdjData.sliceForm !== 'undefined'))
              });
            results.data = undefined;
          }
          else if (self.createForm.hasDeploymentPathData()) {
            results = self.createForm.getDeploymentDataPayload(properties, fieldValues, scrubData);
          }
          else {
            results = self.createForm.getDataPayload(properties, fieldValues, undefined, scrubData);
          }
        }

        return results;
      }

      function getSliceProperties(pdjData) {
        let properties;
        if (self.isWizardForm()) {
          properties = self.createForm.getRenderProperties();
        }
        else {
          if (CoreUtils.isNotUndefinedNorNull(pdjData.sliceForm)) {
            properties = pdjData.sliceForm.properties;
          }

          if (CoreUtils.isUndefinedOrNull(properties)) properties = pdjData.createForm.properties;
        }

        return properties;
      }

      function createHelp(pdjData) {
        const helpForm = new HelpForm(viewParams);

        self.tableHelpColumns(helpForm.tableHelpColumns);
        helpForm.setPDJData(pdjData);
        const properties = getSliceProperties(pdjData);
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

    return OverlayDialogViewModel;
  }
);