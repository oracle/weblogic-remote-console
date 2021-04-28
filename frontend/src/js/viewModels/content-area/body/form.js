/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojmodule-element-utils', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', '../../../apis/data-operations', '../../../apis/message-displaying', '../../../microservices/navtree/navtree-manager', '../../../microservices/perspective/perspective-memory-manager', './container-resizer', '../../../microservices/page-definition/types', '../../../microservices/page-definition/fields', '../../../microservices/page-definition/options-sources', '../../../microservices/page-definition/form-layouts', './create-form', './help-form', '../../../microservices/page-definition/utils', '../../utils', '../../../core/utils', '../../../core/runtime', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojbinddom', 'ojs/ojinputtext', 'ojs/ojlabel', 'ojs/ojswitch', 'ojs/ojselectcombobox', 'ojs/ojformlayout', 'ojs/ojasyncvalidator-regexp', 'ojs/ojconveyorbelt', 'ojs/ojmessages', 'ojs/ojmodule-element', 'ojs/ojmodule', 'cfe-multi-select/loader', 'ojs/ojselectsingle', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojcheckboxset'],
  function (oj, ko, Router, ModuleElementUtils, ArrayDataProvider, HtmlUtils, DataOperations, MessageDisplaying, NavtreeManager, PerspectiveMemoryManager, ContentAreaContainerResizer, PageDataTypes, PageDefinitionFields, PageDefinitionOptionsSources, PageDefinitionFormLayouts, CreateForm, HelpForm, PageDefinitionUtils, ViewModelUtils, CoreUtils, Runtime, Context, Logger) {
    function FormViewModel(viewParams) {

      const FIELD_DISABLED = Object.freeze("fieldDisabled_");
      const FIELD_MESSAGES = Object.freeze("fieldMessages_");
      const FIELD_SELECTDATA = Object.freeze("fieldSelectData_");
      const FIELD_VALUES = Object.freeze("fieldValues_");

      var self = this;

      this.i18n = {
        checkboxes: {
          showAdvancedFields: {
            id: "show",
            label: oj.Translations.getTranslatedString("wrc-form.checkboxes.showAdvancedFields.label")
          }
        },
        introduction: {
          toggleHelp: {
            iconFile: "toggle-help-icon-blk_16x16.png",
            text: oj.Translations.getTranslatedString("wrc-form.introduction.toggleHelp.text", "{0}")
          }
        },
        messages: {
          save: oj.Translations.getTranslatedString("wrc-form.messages.save")
        },
        prompts: {
          unsavedChanges: {
            willBeLost: {value: oj.Translations.getTranslatedString("wrc-form.prompts.unsavedChanges.willBeLost.value")},
            areYouSure: {value: oj.Translations.getTranslatedString("wrc-form.prompts.unsavedChanges.areYouSure.value")}
          },
        },
        icons: {
          restart: {iconFile: "restart-required-org_24x24",
            tooltip: oj.Translations.getTranslatedString("wrc-form.icons.restart.tooltip")
          },
          choose: {iconFile: "choose-file-icon-blk_24x24",
            tooltip: oj.Translations.getTranslatedString("wrc-form.icons.choose.tooltip")
          },
          clear: {iconFile: "erase-icon-blk_24x24",
            tooltip: oj.Translations.getTranslatedString("wrc-form.icons.clear.tooltip")
          },
          more: {iconFile: "more-vertical-brn-8x24", iconClass: "more-vertical-icon",
            tooltip: oj.Translations.getTranslatedString("wrc-form.icons.more.tooltip")
          }
        },
        menus: {
          more: {
            optionsSources: {
              view: {
                label: oj.Translations.getTranslatedString("wrc-form.menus.more.optionsSources.view.label", "{0}")
              }
            }
          }
        },
        tables: {
          help: {
            label: oj.Translations.getTranslatedString("wrc-form.tables.help.label"),
            column: {
              header: {
                name: oj.Translations.getTranslatedString("wrc-form.tables.help.column.header.name"),
                description: oj.Translations.getTranslatedString("wrc-form.tables.help.column.header.description")
              }
            }
          }
        },
        confirmDialog: {
          title: oj.Translations.getTranslatedString("wrc-form.confirmDialog.title"),
          prompt: ko.observable(),
          buttons: {
            yes: {id: "dlgOkBtn", disabled: false,
              label: oj.Translations.getTranslatedString("wrc-form.confirmDialog.buttons.yes.label")
            },
            no: {id: "dlgCancelBtn", disabled: false,
              label: oj.Translations.getTranslatedString("wrc-form.confirmDialog.buttons.no.label")
            }
          }
        },
        dialogSync: {
          title: oj.Translations.getTranslatedString("wrc-form.dialogSync.title"),
          instructions: oj.Translations.getTranslatedString("wrc-form.dialogSync.instructions"),
          fields: {
            interval: {value: ko.observable(''),
              label: oj.Translations.getTranslatedString("wrc-form.dialogSync.fields.interval.label")
            }
          },
          buttons: {
            ok: { id: "dlgOkBtn1", disabled: false,
              label: oj.Translations.getTranslatedString("wrc-form.dialogSync.buttons.ok.label")
            },
            cancel: { id: "dlgCancelBtn1", disabled: false,
              label: oj.Translations.getTranslatedString("wrc-form.dialogSync.buttons.cancel.label")
            }
          }
        }
      };

      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(viewParams.perspective.id);
      this.navtreeManager = new NavtreeManager(viewParams.perspective);
      this.contentAreaContainerResizer = new ContentAreaContainerResizer(viewParams.perspective);

      this.dirtyFields = new Set();
      this.dynamicMessageFields = [];
      this.multiSelectControls = {};
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

      this.pageRedoHistory = {};

      this.subscriptions = [];
      this.signalBindings = [];

      this.formToolbarModuleConfig = ModuleElementUtils.createConfig({
        name: "content-area/body/form-toolbar",
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          perspective: viewParams.perspective,
          newAction: newBean,
          deleteAction: deleteBean,
          rerenderAction: rerenderWizardForm,
          isWizardForm: isWizardForm,
          finishedAction: finishWizardForm,
          createFormMode: getCreateFormMode,
          onSave: saveBean,
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
          onSyncIntervalClicked: showSetSyncInterval
        }
      });

      this.formTabStripModuleConfig = ModuleElementUtils.createConfig({
        name: "content-area/body/form-tabstrip",
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          perspective: viewParams.perspective,
          onCanExit: exitForm
        }
      });

      this.connected = function () {
        document.title = viewParams.parentRouter.data.pageTitle();

        if (viewParams.perspective.state.name !== "active") {
          viewParams.signaling.perspectiveSelected.dispatch(viewParams.perspective);
        }

        const pdjData = viewParams.parentRouter.data.pdjData();
        if (typeof pdjData.createForm !== "undefined") {
          resetSaveButtonDisabledState({disabled: false});
          const mode = CreateForm.prototype.Mode.SCROLLING;
          self.createForm = new CreateForm(viewParams, rerenderWizardForm, mode);
        }

        renderPage(true);

        const rdjSub = viewParams.parentRouter.data.rdjData.subscribe(renderPage.bind(this));
        self.subscriptions.push(rdjSub);
        cancelSyncTimer();

        self.signalBindings.push(viewParams.signaling.readonlyChanged.add((newRO) => {
          self.readonly(newRO);
          renderPage(true);
        }));
      }.bind(this);

      this.disconnected = function () {
        cancelSyncTimer();

        self.signalBindings.forEach(function (binding) {
          binding.detach();
        });

        self.signalBindings = [];
        
        self.subscriptions.forEach(function (subscription) {
          subscription.dispose();
        });
        self.subscriptions = [];
      };

      this.showAdvancedFieldsValueChanged = function (event) {
        const dataPayload = getDirtyFieldsPayload(true);
        //in getDirtyFieldsPayload(), if the field is set back to the original server value, that field
        //will be removed and not considered as dirty.
        //but for the purpose of always showing the value user last entered, we need to consider that dirty so that
        //the display can be updated.
        cacheDataPayload(dataPayload);

        //During renderPage() and restoreDirtyFieldsValues(), the dirtyFields set may be changed, so we need to
        //remember that and restore it.
        //Since both methods maybe changing the dirtyFields, we will do it here instead of
        //inside the methods itself.
        const tempDirtyFields = new Set(self.dirtyFields);
        renderPage();
        restoreDirtyFieldsValues();
        self.dirtyFields = new Set(tempDirtyFields);
      };

      this.sectionExpanderClickHandler = function (event) {
        PageDefinitionFormLayouts.sectionExpanderClickHandler(event);
      };

      this.helpIconClick = function (event) {
        const instructionHelp = event.currentTarget.attributes['help.definition'].value;
        const detailedHelp = event.currentTarget.attributes['data-detailed-help'].value;

        if (!detailedHelp) {
          return;
        }

        const popup = document.getElementById(event.target.getAttribute("aria-describedby"))

        if (popup != null) {
          const content = popup.getElementsByClassName("oj-label-help-popup-container")[0];
          if (content != null) {
            if (popup.classList.contains("cfe-detail-popup")) {
              content.innerText = instructionHelp;
              popup.classList.remove("cfe-detail-popup");
            } else {
              content.innerHTML = detailedHelp;
              popup.classList.add("cfe-detail-popup");
            }
          }
        }
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
          if (typeof replacer === "undefined") replacer = fieldName;
          if (typeof self[FIELD_VALUES + replacer] === "undefined") {
            self[FIELD_VALUES + replacer] = ko.observable();
            self.dirtyFields.add(fieldName);
          }
          const subscription = createFieldValueSubscription(fieldName, replacer);
          if (subscription._target() === "") {
            self.subscriptions.push(subscription);
          }
          self[FIELD_VALUES + replacer](values);
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
          resetSaveButtonDisabledState({disabled: !result.isDirty});
        }
      };

      this.debugFlagsValueChanged = function(event) {
        const dataPayload = getDebugPayload();
        resetSaveButtonDisabledState({disabled: Object.keys(dataPayload).length === 0});
      };

      this.chooseFileClickHandler = function(event) {
        const chooser = $("#file-chooser");
        chooser.on("change", self.chooseFileChangeHandler);
        chooser.trigger("click");
        chooser.attr("data-input", event.currentTarget.attributes["data-input"].value);
        event.preventDefault();
      };

      this.clearChosenFileClickHandler = function(event) {
        const name = event.currentTarget.attributes["data-input"].value;
        self[FIELD_VALUES + name](null);
        self.createForm.clearUploadedFile(name);
        $("#" + name + "_clearChosen").css({"display":"none"});
      };

      this.chooseFileChangeHandler = function(event) {
        const files = event.currentTarget.files;
        if (files.length > 0) {
          const name = event.currentTarget.attributes["data-input"].value;
          const fileName = files[0].name;
          const fileExt = "." + fileName.split(".").pop();

          self[FIELD_VALUES + name](fileName);
          self.createForm.addUploadedFile(name, files[0]);
          $("#" + name + "_clearChosen").css({"display":"inline-flex"});

          const chooser = $("#file-chooser");
          chooser.off("change", self.chooseFileChangeHandler);
          chooser.val("");
        }
      };

      this.determineChanges = function (doCache) {
        let dataPayload = {};
        var data = self.rdjData.data;

        const formElement = document.getElementById("wlsform");
        if (typeof formElement === 'undefined' || formElement == null) {
          return dataPayload;
        }

        // First check if the form is for a create or edit.
        // Determining the changes with a create form only
        // collects the value of the properties and does
        // enfore that a value is supplied. When the create
        // does not have any properties, a null value is returned.
        const isEdit = typeof self.pdjData.sliceForm !== 'undefined';
        if (!isEdit) {
          const results = getCreateFormPayload(self.pdjData.createForm.properties);
          return results.data;
        }

        // Go through the properties on the form page when there are dirty fields
        const dirtyPayload = getDirtyFieldsPayload();
        if (doCache) {
          cacheDataPayload(dirtyPayload);
        }
        dataPayload = combinePayloads(dirtyPayload,
          getMultiSelectsPayload(),
          getDebugPayload());
        return dataPayload;
      };

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

      function isWizardForm() {
        let rtnval = false;
        if (self.pdjData !== null) {
          if (typeof self.pdjData.createForm !== "undefined" && typeof self.createForm.isWizard !== "undefined" && self.createForm.isWizard()) {
            rtnval = true;
          }
        }
        return rtnval;
      }

      function finishWizardForm() {
        if (isWizardForm()) {
          const pageState = self.createForm.markAsFinished();
          if (pageState.succeeded) saveBean("finish");
        }
      }

      function getCreateFormMode() {
        let rtnval = CreateForm.prototype.Mode.SCROLLING.name;
        if (typeof self.createForm !== "undefined") {
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

      /**
       * Wrapper function for assigning to ``viewParams`` of embedded V-VMs (i.e. form-toolbar, form-tabstrip)
       * @param eventType
       * @returns {Promise<boolean>}
       * @see FormViewModel#canExit
       */
      function exitForm(eventType) {
        return self.canExit(eventType);
      }

      /**
       * Returns whether it is okay to exit the form, or not
       * @param {string} eventType - The type of event that will be performed, if ``true`` is returned
       * @returns {Promise<boolean>}
       */
      this.canExit = function (eventType) {
        const isEdit = (self.pdjData !== null && self.pdjData.sliceForm);
        return new Promise(function (resolve) {
          self.formTabStripModuleConfig
            .then((moduleConfig) => {
              const cancelSliceChange = moduleConfig.viewModel.getCancelSliceChange();
              if (!cancelSliceChange && isEdit && self.isDirty()) {
                return decideUnsavedChangesDetectedAction()
                  .then((reply) => {
                    if (reply) {
                      self.dirtyFields.clear();
                      resetPageRedoHistory();
                      self.debugFlagsEnabled(PageDefinitionFields.resetDebugFlagsEnabled(self.debugFlagItems()));
                      resolve(reply);
                    } else {
                      // clear treenav selection in case that caused the exit
                      viewParams.signaling.navtreeSelectionCleared.dispatch();
                      resolve(reply);
                    }
                  });
              }
              else {
                resolve(true);
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

          //loop through all of the dirtyFields
          for (let key of self.dirtyFields) {

            // do not include disabled fields in the values that are returned
            if (self[`${FIELD_DISABLED}_${key}`]() === true)
              continue;

            const fieldObv = self[FIELD_VALUES + key];

            if (typeof fieldObv !== 'undefined') {
              const fieldValue = fieldObv();

              // Obtain the updated value and the original value
              const value = pdjTypes.getConvertedObservableValue(key, fieldValue);
              const serverValue = pdjTypes.getObservableValue(key, data[key], null)

              // Convert and compare values to determine if a change has actually occurred!
              const strValue = JSON.stringify(value);
              const strServerValue = JSON.stringify(serverValue);
              if (strServerValue !== strValue) {
                // Set the new value into the payload where the value
                // from the UI was converted based on the PDJ type...
                dataPayload[key] = { value: value };
              }
              else {
                // The field was updated then set back to the server value
                // thus clear the property from being marked as dirty...
                self.dirtyFields.delete(key);
                if (keepSaveToOrig !== undefined) {
                  dataPayload[key] = { value: value };
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
          for (const [key, value] of Object.entries(self.pageRedoHistory)) {
            Logger.log(`[FORM] restore: key=${key}, value=${JSON.stringify(value)}`);
            let displayValue = pdjTypes.getDisplayValue(key, self.rdjData.data[key], value);
            if (displayValue == null) {
              displayValue = "";
            }
            const obsValue = pdjTypes.getObservableValue(key, self.rdjData.data[key], displayValue, value);
            //For the case where the ShowAdvancedFields is toggled AFTER a SAVE has been done, the dirtyFields is actually
            //empty, the following line will set it to be a dirty field again.  This will result in the 'Unsaved dialog'
            //to popup which shouldn't since SAVE has been done.  So we need to ensure dirtyFields is not changed.  This is
            //being done to by caller of this method.
            self[FIELD_VALUES + key](obsValue);
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
          let kind, formDataExists = false;
          let mode = (typeof self.pdjData !== "undefined" && typeof self.pdjData.sliceForm !== "undefined" ? "save" : "create");
          if (typeof path !== "undefined") {
            self.navtreeManager.getPathModel(path)
              .then((pathModel) => {
                path = pathModel.path;
                kind = pathModel.kind;
                Logger.info(`path=${path}, kind=${kind}`);

                switch (eventType) {
                  case "sync":
                  case "create":
                  case "update":
                    formDataExists = (typeof self.rdjData.data !== "undefined");
                    break;
                }
                resolve({mode: mode, kind: kind, path: path, formDataExists: formDataExists});
              });
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
        // Only perform UI restore if we're in "configuration" perspective
        if (viewParams.perspective.id === "configuration") {

          let treeaction = {
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
              {id: "save", disabled: false}
            ]);
          });
      }


      // Not sure why we need two different dialog
      // boxes for this, but leaving the decision
      // to keep both or remove one, until the
      // refactoring review.
      function decideUnsavedChangesDetectedAction() {
        self.i18n.confirmDialog.prompt(self.i18n.prompts.unsavedChanges.areYouSure.value);
        return showUnsavedChangesDetectedConfirmDialog();
      }

      function showUnsavedChangesDetectedConfirmDialog() {
        return new Promise(function (resolve) {
          const okBtn = document.getElementById(self.i18n.confirmDialog.buttons.yes.id);
          const cancelBtn = document.getElementById(self.i18n.confirmDialog.buttons.no.id);
          const confirmDialog = document.getElementById('confirmDialog');
          function okClickHandler() {
            resolve(true);
            confirmDialog.close();
          }
          okBtn.addEventListener('click', okClickHandler);

          function cancelClickHandler() {
            resolve(false);
            confirmDialog.close();
          }
          cancelBtn.addEventListener('click', cancelClickHandler)

          function onKeyUp(event) {
            if (event.key === "Enter") {
              // Treat pressing the "Enter" key as clicking the "OK" button
              okClickHandler();
              // Suppress default handling of keyup event
              event.preventDefault();
              // Veto the keyup event, so JET will update the knockout
              // observable associated with the <oj-input-text> element
              return false;
            }
          }
          confirmDialog.addEventListener("keyup", onKeyUp);

          confirmDialog.addEventListener('ojClose', function (event) {
            okBtn.removeEventListener('click', okClickHandler);
            cancelBtn.removeEventListener('click', cancelClickHandler);
            confirmDialog.removeEventListener('keyup', onKeyUp);
            // No-op if promise already resolved (like when 'OK' is clicked)
            resolve(false);
          });

          confirmDialog.open();
        });
      }

      function decideUnsavedChangesAction() {
        if ( self.isDirty()) {
          self.i18n.confirmDialog.prompt(self.i18n.prompts.unsavedChanges.willBeLost.value);
          return showAbandonUnsavedChangesConfirmDialog()
            .then((reply) => {
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

      function showAbandonUnsavedChangesConfirmDialog() {
        return new Promise(function (resolve) {
          const okBtn = document.getElementById(self.i18n.confirmDialog.buttons.yes.id);
          const cancelBtn = document.getElementById(self.i18n.confirmDialog.buttons.no.id);
          const confirmDialog = document.getElementById('confirmDialog');
          function okClickHandler() {
            resolve(true);
            confirmDialog.close();
          }
          okBtn.addEventListener('click', okClickHandler);

          function cancelClickHandler() {
            resolve(false);
            confirmDialog.close();
          }
          cancelBtn.addEventListener('click', cancelClickHandler)

          function onKeyUp(event) {
            if (event.key === "Enter") {
              // Treat pressing the "Enter" key as clicking the "OK" button
              okClickHandler();
              // Suppress default handling of keyup event
              event.preventDefault();
              // Veto the keyup event, so JET will update the knockout
              // observable associated with the <oj-input-text> element
              return false;
            }
          }
          confirmDialog.addEventListener("keyup", onKeyUp);

          confirmDialog.addEventListener('ojClose', function (event) {
            okBtn.removeEventListener('click', okClickHandler);
            cancelBtn.removeEventListener('click', cancelClickHandler);
            confirmDialog.removeEventListener('keyup', onKeyUp);
            // No-op if promise already resolved (like when 'OK' is clicked)
            resolve(false);
          });

          confirmDialog.open();
        });
      }

      function commitShoppingCart(toolbarButton) {
        // Only perform UI restore if we're in "configuration" perspective
        if (viewParams.perspective.id === "configuration") {
          reloadRdjData();

          self.formToolbarModuleConfig
            .then((moduleConfig) => {
              if (toolbarButton === "" || toolbarButton === "save") {
                moduleConfig.viewModel.renderToolbarButtons("sync");
              }
              else {
                const hasNonReadOnlyFields = (toolbarButton === "new");
                moduleConfig.viewModel.renderToolbarButtons("commit", hasNonReadOnlyFields);
              }
            });
        }
      }

      function reloadPageData() {
        renderPageData("", false);
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
            if (toolbarButton === "" || toolbarButton === "save") {
              moduleConfig.viewModel.renderToolbarButtons("sync");
            }
            else {
              const hasNonReadOnlyFields = (toolbarButton === "delete");
              moduleConfig.viewModel.renderToolbarButtons("discard", hasNonReadOnlyFields);
            }
          });
      }

      function showSetSyncInterval(currentValue) {
        return new Promise(function (resolve, reject) {
          // The dialog will contain current value when sync interval is set
          if (parseInt(currentValue) > 0) self.i18n.dialogSync.fields.interval.value(currentValue);

          const okBtn = document.getElementById(self.i18n.dialogSync.buttons.ok.id);
          const cancelBtn = document.getElementById(self.i18n.dialogSync.buttons.cancel.id);
          const inputText = document.getElementById("interval-field");
          const dialogSync = document.getElementById("syncIntervalDialog");

          // Check the specified sync interval where anything other
          // than a positive value returns zero for the saved value
          function sanityCheckInput(syncInterval) {
            if (syncInterval === "")
              syncInterval = "0";
            else {
              const value = parseInt(syncInterval);
              if (isNaN(value)) {
                syncInterval = "0";
              }
              else {
                syncInterval = (value <= 0 ? "0" : `${value}`);
              }
            }
            return syncInterval;
          }

          function okClickHandler() {
            const inputValue = self.i18n.dialogSync.fields.interval.value();
            const syncInterval = sanityCheckInput(inputValue);
            setSyncInterval(parseInt(syncInterval));
            resolve({exitAction: self.i18n.dialogSync.buttons.ok.label, interval: syncInterval});
            dialogSync.close();
          }
          okBtn.addEventListener('click', okClickHandler);

          function cancelClickHandler() {
            reject({exitAction: self.i18n.dialogSync.buttons.cancel.label, interval: currentValue});
            dialogSync.close();
          }
          cancelBtn.addEventListener('click', cancelClickHandler);

          function onKeyUp(event) {
            if (event.key === "Enter") {
              // Treat pressing the "Enter" key as clicking the "OK" button
              okClickHandler();
              // Suppress default handling of keyup event
              event.preventDefault();
              // Veto the keyup event, so JET will update the knockout
              // observable associated with the <oj-input-text> element
              return false;
            }
          }
          inputText.addEventListener("keyup", onKeyUp);

          dialogSync.addEventListener('ojClose', function (event) {
            okBtn.removeEventListener('click', okClickHandler);
            cancelBtn.removeEventListener('click', cancelClickHandler);
            inputText.removeEventListener('keyup', onKeyUp);
          });

          dialogSync.open();
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
        if (typeof self.timerId !== "undefined") {
          clearInterval(self.timerId);
          self.timerId = undefined;
          cancelled = true;
        }
        return cancelled;
      }

      function cancelAutoSync() {
        cancelSyncTimer();
        self.formToolbarModuleConfig
        .then((moduleConfig) => {
          moduleConfig.viewModel.cancelAutoSync();
        });
      }

      function setFormContainerMaxHeight(withHistoryVisible){
        const options = {withHistoryVisible: withHistoryVisible, withHelpVisible: self.showHelp()};
        const offsetMaxHeight = self.contentAreaContainerResizer.getOffsetMaxHeight("#form-container", options);
        Logger.info(`[FORM] max-height=calc(100vh - ${offsetMaxHeight}px)`);
        const ele = document.querySelector(".cfe-table-form-content");
        if (ele !== null) ele.style["max-height"] = `calc(100vh - ${offsetMaxHeight}px)`;
      }

      function toggleBeanPathHistory (withHistoryVisible) {
        setFormContainerMaxHeight(withHistoryVisible);
        return viewParams.onBeanPathHistoryToggled();
      }

      function toggleInstructions (withInstructionsVisible, withHistoryVisible) {
        const ele = document.getElementById("intro");
        if (ele !== null) ele.style.display = (withInstructionsVisible ? "inline-block" : "none");
        self.showInstructions(withInstructionsVisible);
        setFormContainerMaxHeight(withHistoryVisible);
      }

      function toggleHelpPage(withHelpVisible, withHistoryVisible) {
        self.showHelp(withHelpVisible);
        setFormContainerMaxHeight(withHistoryVisible);
      }

      function selectLandingPage() {
        viewParams.onLandingPageSelected();
      }

      function newBean() {
        self.createForm = new CreateForm(viewParams);
        self.createForm.newBean()
          .then((result) => {
            viewParams.parentRouter.data.pdjUrl(result.body.data.get("pdjUrl"));
            viewParams.parentRouter.data.pdjData(result.body.data.get("pdjData"));
            viewParams.parentRouter.data.rdjData(result.body.data.get("rdjData"));

            viewParams.parentRouter.go("form")
              .then((hasChanged) => {
                // The "New" button only appears on a form when the
                // identity kind is "creatableOptionalSingleton", so
                // we use the then of this promise to examine the size
                // of the pdjData.createForm.properties array.
                if (result.properties.length === 0) {
                  // createForm doesn't contain any fields, so go
                  // ahead and save the new MBean without showing it.
                  saveBean("create");
                }
                else {
                  const filteredProperties = result.properties.filter(property => property.readOnly);
                  self.formToolbarModuleConfig
                    .then((moduleConfig) => {
                      moduleConfig.viewModel.renderToolbarButtons("create", (filteredProperties.length < result.properties.length));
                    });
                }
              });
          })
          .catch(response => {
            ViewModelUtils.failureResponseDefaultHandling(response);
          });
      }

      function deleteBean(deleteUrl) {
        self.createForm = new CreateForm(viewParams);
        self.createForm.deleteBean(deleteUrl)
          .then(reply => {
            self.formToolbarModuleConfig
              .then((moduleConfig) => {
                const changeManager = moduleConfig.viewModel.changeManager();
                moduleConfig.viewModel.changeManager({
                  isLockOwner: true,
                  hasChanges: changeManager.hasChanges,
                  supportsChanges: changeManager.supportsChanges
                });
                moduleConfig.viewModel.renderToolbarButtons("delete");
              });
            return reply;
          })
          .then(reply =>{
            MessageDisplaying.displayResponseMessages(reply.body.messages);
          })
          .catch(response => {
            return ViewModelUtils.failureResponseDefaultHandling(response);
          })
          .then(() => {
            self.formToolbarModuleConfig
              .then((moduleConfig) => {
                const changeManager = moduleConfig.viewModel.changeManager();
                moduleConfig.viewModel.changeManager({
                  isLockOwner: true,
                  hasChanges: changeManager.hasChanges,
                  supportsChanges: changeManager.supportsChanges
                });
                moduleConfig.viewModel.renderToolbarButtons("delete");
              });
            viewParams.signaling.tabStripTabSelected.dispatch("form", "shoppingcart", false);
          });
      }

      function saveBean(eventType) {
        function saveDataPayload(eventType, isEdit, dataAction) {
          let dataPayload = self.determineChanges(false);
          Logger.log(`[FORM] dataAction=${dataAction}, dataPayload=${JSON.stringify(dataPayload)}`);

          // First, check for empty payload and return when there is no data
          if (isEdit && (dataPayload != null) && (Object.keys(dataPayload).length === 0)) {
            Logger.log(`POST data is empty while isEdit=true, exiting save!`);
            return;
          }

          // Second, check for no payload and instead POST an empty data object
          if (dataPayload === null) dataPayload = {};

          if (typeof dataPayload !== 'undefined') {
            Logger.log(`POST dataPayload=${JSON.stringify(dataPayload)}`);
            DataOperations.mbean.save(viewParams.parentRouter.data.rdjUrl() + dataAction, dataPayload)
              .then(response => {
                handleSaveResponse(response, dataAction, dataPayload, eventType, isEdit);
              });
          }
        }

        let dataAction = '';
        let isEdit = (typeof self.pdjData.sliceForm !== 'undefined');

        if (isEdit) {
          self.formTabStripModuleConfig
            .then(moduleConfig => {
              const sliceName = moduleConfig.viewModel.getSliceName();
              dataAction = '?slice=' + sliceName;
              saveDataPayload(eventType, isEdit, dataAction);
            });
        }
        else {
          dataAction = '?dataAction=create';
          saveDataPayload(eventType, isEdit, dataAction);
        }
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
        const bodyMessages = getResponseBodyMessages(response);
        if (bodyMessages.length > 0) {
          MessageDisplaying.displayMessages(bodyMessages);
        }

        self.debugFlagsEnabled(PageDefinitionFields.resetDebugFlagsEnabled(self.debugFlagItems()));

        self.formToolbarModuleConfig
          .then((moduleConfig) => {
            const changeManager = moduleConfig.viewModel.changeManager();
            moduleConfig.viewModel.changeManager({ isLockOwner: changeManager.isLockOwner, hasChanges: changeManager.hasChanges, supportsChanges: changeManager.supportsChanges });
            moduleConfig.viewModel.resetButtonsDisabledState([
              {id: "save", disabled: false}
            ]);
          });

        if (typeof response.failureType !== "undefined" && response.body.messages.length === 0) {
          saveFailedNoMessages(dataAction, dataPayload, isEdit);
        }
        else if (response.body.messages.length === 0) {
          const identity = (!isEdit ? response.body.data.identity : undefined);
          saveSuceededNoMessages(eventType, dataPayload, isEdit, identity);
        }

        // Collapse console Kiosk, regardless of what happened above.
        viewParams.signaling.tabStripTabSelected.dispatch("form", "shoppingcart", false);
      }

      function saveFailedNoMessages(dataAction, dataPayload, isEdit) {
        function compensatingTransactionFailure(response) {
          if (response.body.messages.length > 0) {
            Logger.error(`Compensating transaction failed!`);
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
          // create a POST request to reverse the change
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

          const deleteUrl = viewParams.parentRouter.data.rdjUrl() + "/" + encodeURIComponent(pathLeafName);
          DataOperations.mbean.delete(deleteUrl)
            .then(reply => {
              Logger.log(`Delete of partially created object successful.`);
              MessageDisplaying.displayResponseMessages(reply.body.messages);
            })
            .catch(response => {
              Logger.log(`Delete of partially created object not possible`);
              ViewModelUtils.failureResponseDefaultHandling(response);
            });
        }
      }

      function saveSuceededNoMessages(eventType, dataPayload, isEdit, identity) {
        updateMultiSelectControls(dataPayload);
        cacheDataPayload(dataPayload);
        self.dirtyFields.clear();
        self.debugFlagItems(null);

        let treeaction = {
          isEdit: isEdit,
          path: decodeURIComponent(viewParams.parentRouter.data.rawPath())
        };

        // fix the navtree
        viewParams.signaling.navtreeUpdated.dispatch(treeaction);

        if (isEdit) {
          MessageDisplaying.displayMessage({
            severity: 'confirmation',
            summary: self.i18n.messages.save
          });

          self.formToolbarModuleConfig
            .then((moduleConfig) => {
              const changeManager = moduleConfig.viewModel.changeManager();
              moduleConfig.viewModel.changeManager({ isLockOwner: true, hasChanges: true, supportsChanges: changeManager.supportsChanges });
              moduleConfig.viewModel.renderToolbarButtons(eventType);
            });

          // Reload the page data to pickup the saved changes!
          reloadRdjData();
        }
        else {
          // clear treenav selection
          viewParams.signaling.navtreeSelectionCleared.dispatch();
          const routerData = viewParams.parentRouter.data;

          const pathSegments = PageDefinitionUtils.pathSegmentsFromIdentity(identity);

          const path = pathSegments.join("/");

          const editPage = "/" + viewParams.perspective.id + "/" + encodeURIComponent(path);

          // go to e.g. /configuration/ first and then go to the edit page.
          // this forces a state change on the Router that would not happen
          // in the case of a singleton because the create/edit URLs are the same
          Router.rootInstance.go("/" + viewParams.perspective.id + "/")
            .then(() => {
              Router.rootInstance.go(editPage)
                .then((hasChanged) => {
                  self.formToolbarModuleConfig
                    .then((moduleConfig) => {
                      const changeManager = moduleConfig.viewModel.changeManager();
                      moduleConfig.viewModel.changeManager({ isLockOwner: changeManager.isLockOwner, hasChanges: changeManager.hasChanges, supportsChanges: changeManager.supportsChanges });
                      moduleConfig.viewModel.renderToolbarButtons(eventType);
                    });
                });
            });
        }
      }

      function updateMultiSelectControls(dataPayload) {
        for (const key of Object.keys(dataPayload)) {
          if (typeof self.multiSelectControls[key] !== "undefined") {
            self.multiSelectControls[key].origChosenLabels = self.multiSelectControls[key].savedChosenLabels;
          }
        }
      }

      function reloadRdjData() {
        //temp fix for incorrect self.sliceName
        const pageDefinition = (typeof viewParams.parentRouter.data.rdjData !== "undefined" ? viewParams.parentRouter.data.rdjData().pageDefinition: undefined);
        const sliceName = pageDefinition.substring( pageDefinition.indexOf("=") +1 );
        Logger.log(`self.sliceName=${self.sliceName}`);

        $.getJSON(viewParams.parentRouter.data.rdjUrl() + "?slice=" + sliceName)
          .then((rdjData) => {
            //preserve those changes that occurs AFTER a save has done, and before discard.
            const dataPayload = getDirtyFieldsPayload();
            const path = decodeURIComponent(viewParams.parentRouter.data.rawPath());
            self.navtreeManager.getPathModel(PageDefinitionUtils.removeTrailingSlashes(path))
              .then((pathModel) => {
                viewParams.parentRouter.data.rdjData(rdjData);
                if ((typeof rdjData === 'undefined') || (typeof rdjData.data === 'undefined')) {
                  if (pathModel.kind !== "creatableOptionalSingleton") {
                    // reload rdjData did not get any data
                    signalGotoLandingPage("No RDJ data!");
                  }
                }
                resetPageRedoHistory();
                cacheDataPayload(dataPayload);
                restoreDirtyFieldsValues();
              }).catch(response => {
              MessageDisplaying.displayResponseMessages(response.responseJSON.messages);
            });
          }, (jqXHR) => {
            // failed to reload rdjData
            if (jqXHR.status === 404) {
              signalGotoLandingPage("Form reload unable to find page data, goto landing page: {0}".replace("{0}", jqXHR.responseText));
            }
          }).catch(response => {
          MessageDisplaying.displayResponseMessages(response.responseJSON.messages);
        });
      }

      function signalGotoLandingPage(debugMessage) {
        viewParams.onLandingPageSelected(debugMessage);
      }

      function renderPage(resetPageHistory) {
        var pdjData = viewParams.parentRouter.data.pdjData();
        var rdjData = viewParams.parentRouter.data.rdjData();

        //do not reset the page history cache if this is called due to
        //toggling of ShowAdvancedFields.  Any other calls will be when we
        //switch to another tab or when the set of tabs is first displayed, and
        //need to clear it.
        if (typeof resetPageHistory !== 'undefined') {
          resetPageRedoHistory();
        }
        let isEdit;

        // If the observable updates and no longer references a table
        // do nothing.. <perspective.id>.js will route
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

        if (isEdit && (pdjData.sliceForm.slices.length > 0)) {
          self.formTabStripModuleConfig
            .then((moduleConfig) => {
              const currentSlice = moduleConfig.viewModel.getCurrentSlice();
              if (currentSlice === "") {
                moduleConfig.viewModel.updateSlice(currentSlice, 1);
              }
            });
        }

        const toggleHelpIntroduction = self.i18n.introduction.toggleHelp.text.replace("{0}","<img src='../../images/" + self.i18n.introduction.toggleHelp.iconFile + "'>");
        const bindHtml = (CoreUtils.isNotUndefinedNorNull(pdjData.introductionHTML) ? pdjData.introductionHTML : "<p>");
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
        if (typeof removed !== "undefined") {
          Logger.log(`[FORM] removed.length=${removed.length}`);
          removed.forEach((item) => {
            // Some subscription._target() values will be an empty
            // string, so we need to look for those first.
            processRemovedField(item.name,"");
            // Look for subscription._target() values that match
            // item.name.
            processRemovedField(item.name, item.value);
          });
        }

        const pageState = self.createForm.rerenderPage(direction);
        if (pageState.succeeded) {
          self.formToolbarModuleConfig
          .then((moduleConfig) => {
            moduleConfig.viewModel.resetButtonsDisabledState([
              {id: "finish", disabled: !self.createForm.getCanFinish()}
            ]);

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
              renderSpecialHandlingFields();
              setFormContainerMaxHeight(self.perspectiveMemory.beanPathHistory.visibility);
            });
          }, 5
        );
      }

      function renderSpecialHandlingFields() {
        function onMouseUp(event) {
          const parentNode = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
          const initHeight = parseInt(event.target.attributes["data-init-height"].value, 10);
          const calcOffsetHeight = (event.target.offsetHeight - initHeight);
          Logger.info(`calcOffsetHeight=${calcOffsetHeight}`);
          parentNode.style.height = `${(initHeight + calcOffsetHeight) - 10}px`;
          const name = CoreUtils.getSubstring(event.target.id, "|");
          self.perspectiveMemory.setNthChildMinHeight.call(self.perspectiveMemory, name, parentNode.style.height);
        }

        let ele;
        self.perspectiveMemory.nthChildrenItems.call(self.perspectiveMemory).forEach((nthChild) => {
          ele = document.querySelector("#wlsform > div > div:nth-child(" + nthChild.row + ") > div:nth-child(" + nthChild.col + ")");
          if (ele !== null && typeof nthChild.minHeight !== "undefined") {
            ele.style["min-height"] = nthChild.minHeight;
            ele = document.getElementById(`${nthChild.name}|input`);
            if (ele !== null) {
              ele.addEventListener("mouseup", onMouseUp);
              ele.setAttribute("data-init-height", nthChild.minHeight);
              ele.style.height = `${parseInt(nthChild.minHeight, 10)}px`;
            }
          }
        });
      }

      function renderWizardForm(rdjData) {
        const div = document.createElement("div");
        div.setAttribute("id", "cfe-form");
        div.style.display = 'block';

        //wizard form always use single column. If this is changed, the param calling populateFormLayout will need to change.
        const formLayout = PageDefinitionFormLayouts.createWizardFormLayout({labelWidthPcnt: "32%", maxColumns: "1"});
        div.append(formLayout);

        document.documentElement.style.setProperty("--form-input-min-width", `25em`);
        let properties = self.createForm.getRenderProperties();
        const results = getCreateFormPayload(properties);

        self.formToolbarModuleConfig
        .then((moduleConfig) => {
          moduleConfig.viewModel.resetButtonsDisabledState([
            {id: "finish", disabled: !self.createForm.getCanFinish()}
          ]);
        });

        properties = results.properties;
        const dataPayload = results.data;

        for (const [key, value] of Object.entries(dataPayload)) {
          if (key !== "wizard" && typeof value !== "undefined" && typeof value.value !== "undefined" ) {
            if (typeof rdjData.data[key] === "undefined") {
              rdjData.data[key] = {value: undefined};
            }
            rdjData.data[key].value = value.value;
          }
        }

        const pdjTypes = new PageDataTypes(properties, viewParams.perspective.id);

        if (typeof rdjData.data !== "undefined") {
          //formLayout is built as single column, so just pass in the params as true.
          populateFormLayout(properties, formLayout, pdjTypes, rdjData.data, true, false)
        }

        return div;
      }

      function renderForm(pdjData, rdjData) {
        const div = document.createElement("div");
        div.setAttribute("id", "cfe-form");
        div.style.display = 'block';

        const includeAdvancedFields = (self.showAdvancedFields().length !== 0);
        const properties = getSliceProperties(pdjData, includeAdvancedFields);

        // Setup PDJ type information for the properties being handled on this form
        const pdjTypes = new PageDataTypes(properties, viewParams.perspective.id);

        let formLayout = null;

        const isUseCheckBoxesForBooleans = PageDefinitionFormLayouts.hasFormLayoutType(pdjData, "useCheckBoxesForBooleans");
        const isSingleColumn = PageDefinitionFormLayouts.hasFormLayoutType(pdjData, "singleColumn");
        const hasFormLayoutSections = PageDefinitionFormLayouts.hasFormLayoutSections(pdjData);
        const isReadOnly = self.readonly() && viewParams.perspective.id === "configuration";

        if (hasFormLayoutSections) {
          formLayout = PageDefinitionFormLayouts.createSectionedFormLayout({labelWidthPcnt: "45%", maxColumns: "1", isReadOnly: isReadOnly, isSingleColumn: isSingleColumn}, pdjTypes, rdjData, pdjData, populateFormLayout);
          div.append(formLayout);
        }
        else if (isUseCheckBoxesForBooleans) {
          formLayout = PageDefinitionFormLayouts.createCheckBoxesFormLayout({labelWidthPcnt: "45%", maxColumns: "1"} );
          div.append(formLayout);
        }
        else {
          if (isSingleColumn) {
            formLayout = PageDefinitionFormLayouts.createSingleColumnFormLayout({labelWidthPcnt: "32%", maxColumns: "1"} );
            div.append(formLayout);
            document.documentElement.style.setProperty("--form-input-min-width", "25em");
          }
          else {
            formLayout = PageDefinitionFormLayouts.createTwoColumnFormLayout({labelWidthPcnt: "45%", maxColumns: "2"} );
            div.append(formLayout);
            document.documentElement.style.setProperty("--form-input-min-width", "15em");
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

      function createFieldValueSubscription(name, replacer){
        return self[FIELD_VALUES + replacer].subscribe((newValue) => {
          self.dirtyFields.add(name);
          if (isWizardForm()) {
            self.createForm.backingDataAttributeValueChanged(name, newValue);
          }
          else {
            resetSaveButtonDisabledState({disabled: !self.isDirty()});
          }
        });
      }

      function processRemovedField(name, value){
        if (typeof value === "undefined") value = "";
        let index = self.subscriptions.map(subscription => subscription._target()).indexOf(value);
        if (index !== -1) {
          self.subscriptions[index].dispose();
          self.subscriptions.splice(index, 1);
          self.dirtyFields.delete(name);
        }
        let replacer = self.createForm.getBackingDataAttributeReplacer(name);
        if (typeof replacer === "undefined") replacer = name;
        if (typeof self[FIELD_VALUES + replacer] !== "undefined") delete self[FIELD_VALUES + replacer];
        if (typeof self[FIELD_SELECTDATA + replacer] !== "undefined") delete self[FIELD_SELECTDATA + replacer];
        if (typeof self[FIELD_MESSAGES + replacer] !== "undefined") {
          index = self.dynamicMessageFields.indexOf(self[FIELD_MESSAGES + replacer]);
          if (index !== -1) self.dynamicMessageFields.splice(index, 1);
          delete self[FIELD_MESSAGES + replacer];
        }

        index = self.perspectiveMemory.nthChildrenItems.call(self.perspectiveMemory).map(nthChild1 => nthChild1.name).indexOf(replacer);
        if (index === -1) self.perspectiveMemory.nthChildrenItems.call(self.perspectiveMemory).splice(index, 1);

        if (typeof self.multiSelectControls[replacer] !== "undefined") {
          delete self.multiSelectControls[replacer];
        }
      }

      function setupUsedIfListeners(properties) {
        for (let i = 0; i < properties.length; i++) {
          let name = properties[i].name;
          let usedIf = properties[i].usedIf;

          // if there is a usedIf, set up a subscriber on the observable on the controlling property
          if (usedIf) {
            let propertyName;

            if (self.createForm)
              propertyName = self.createForm.getBackingDataAttributeReplacer(usedIf.property);
            else
              propertyName = usedIf.property;

            let toggleDisableFunc = (newValue) => {
              // check to see if the new value enables the field or not
              let enabled = usedIf.values.find((item) => { return item === newValue; })
              self[`${FIELD_DISABLED}_${name}`](!enabled);
            };

            // call the event callback to initialize, then set up subscription
            toggleDisableFunc(self[FIELD_VALUES + propertyName]());
            let subscription = self[FIELD_VALUES + propertyName].subscribe(toggleDisableFunc);

            self.subscriptions.push(subscription);
          }
        }

      }

      function populateFormLayout(properties, formLayout, pdjTypes, dataValues, isSingleColumn, isReadOnly){
        for (let i = 0; i < properties.length; i++) {
          let name = properties[i].name;

          const helpInstruction = PageDefinitionFields.createHelpInstruction(name, pdjTypes);

          let replacer = name, labelEle, field, value, container, createValue = null;

          if (isWizardForm()) {
            const result = self.createForm.getBackingDataAttributeReplacer(replacer);
            if (typeof result !== "undefined") replacer = result;
            if (typeof self[FIELD_VALUES + replacer] === "undefined") {
              // Add name to wizard page in backing data
              self.createForm.addBackingDataPageData(name);
            }
          }

          // Get the text display value for the data or null
          value = pdjTypes.getDisplayValue(name, dataValues[name]);
          if (value === null) value = "";

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
            field = PageDefinitionFields.createSwitch("cfe-form-switch");
          }
          else if (pdjTypes.isDynamicEnumType(name) || pdjTypes.hasLegalValues(name)) {
            if (pdjTypes.isArray(name)) {
              const multiSelect = PageDefinitionFields.createMultiSelect(dataValues, name);

              field = multiSelect.field;
              field.setAttribute("available-items", "[[multiSelectControls." + name + ".availableItems]]");
              field.setAttribute("chosen-items", "[[multiSelectControls." + name + ".chosenItems]]");
              field.setAttribute("on-chosen-items-changed", "[[chosenItemsChanged]]");
              field.setAttribute("readonly", self.readonly());

              self.multiSelectControls[name] = {
                availableItems: multiSelect.availableItems,
                chosenItems: multiSelect.chosenItems,
                origChosenLabels: multiSelect.origChosenLabels
              };
              self.perspectiveMemory.upsertNthChildrenItem.call(self.perspectiveMemory, {name: name, row: parseInt(i) + 1, col: 2, minHeight: "240px"});
            }
            else {
              const dataProviderName = FIELD_SELECTDATA + replacer;
              const options = {
                "name": name,
                "isEdit": (typeof self.pdjData.sliceForm !== 'undefined'),
                "isSingleColumn": isSingleColumn,
                "isReadOnly": isReadOnly
              };

              const singleSelect = PageDefinitionFields.createSingleSelect(pdjTypes, value, dataValues, options );
              self[dataProviderName] = singleSelect.dataProvider;
              field = singleSelect.field;
              field.setAttribute("data", "[[" + dataProviderName + "]]");
              if (typeof field.defaultForCreate !== "undefined") {
                if (field.defaultForCreate !== value) {
                  createValue = field.defaultForCreate;
                  // Convert legal values with int type for observable.
                  if (pdjTypes.isNumberType(name)) createValue = Number(createValue);
                }
              }
            }
          }
          else if (pdjTypes.isSecretType(name)) {
            field = PageDefinitionFields.createInputPassword("cfe-form-input-password");
          }
          else if (pdjTypes.isArray(name) || pdjTypes.isPropertiesType(name)) {
            const options = {
              "className": "cfe-form-input-textarea",
              "resize-behavior": "vertical",
              "placeholder": pdjTypes.getInLineHelpPresentation(name),
              "readonly": pdjTypes.isReadOnly(name) || isReadOnly
            };
            field = PageDefinitionFields.createTextArea(options);
            let nthChild = self.perspectiveMemory.getNthChildrenItem.call(self.perspectiveMemory, name);
            if (typeof nthChild === "undefined") {
              // Setup the nthChild based on the form using one or two fields per row
              let fieldIndex = parseInt(i) + 1;
              let fieldRow = (isSingleColumn ? fieldIndex : Math.round(fieldIndex / 2));
              let fieldColumn = (isSingleColumn || ((fieldIndex % 2) != 0) ? 2 : 4);
              nthChild = { name: name, row: fieldRow, col: fieldColumn, minHeight: "52px" };
            }
            self.perspectiveMemory.upsertNthChildrenItem.call(self.perspectiveMemory, nthChild);
          }
          else if (pdjTypes.isReadOnly(name)) {
            const options = {
              "className": "cfe-form-readonly-text",
              "readonly": "readonly"
            }
            field = PageDefinitionFields.createReadOnlyText(options);
            if (["SourcePath", "PlanPath"].includes(name)) field.setAttribute("title", value);
          }
          else if (pdjTypes.isUploadedFileType(name)) {
            field = PageDefinitionFields.createFileChooser("cfe-file-picker");
          }
          else {
            const options = {
              "className": pdjTypes.isNumberType(name)? "cfe-form-input-integer-sm" : "cfe-form-input-text",
              "placeholder": pdjTypes.getInLineHelpPresentation(name),
              "readonly": isReadOnly
            };
            field = PageDefinitionFields.createInputText(options);
          }

          if (tableProperty) {
            formLayout.append(document.createElement("div"));
          } else {
            labelEle = PageDefinitionFields.createLabel(name, pdjTypes, helpInstruction);
            formLayout.append(labelEle);
          }

          if (typeof field !== "undefined" && field.className !== "cfe-multi-select") {
            field.setAttribute("id", name);
            field.setAttribute("label-edge", "provided");

            // Get the actual value for the observable to preserve type
            let observableValue = createValue;
            if (observableValue === null) {
              observableValue = pdjTypes.getObservableValue(name, dataValues[name], value);
            }

            const observableName = FIELD_VALUES + replacer;
            if (typeof self[observableName] !== 'undefined') {
              if (!isWizardForm()) {
                self[observableName](observableValue);
                //the above call actually triggers the subscription and mark this as dirty.
                //since the value hasn't really changed, we need to remove it from the dirtyField list.
                self.dirtyFields.delete(name);
              }
            }
            else {
              if (isWizardForm()) observableValue = "";
              self[observableName] = ko.observable(observableValue);
            }

            const subscription = createFieldValueSubscription(name, replacer);
            if (subscription._target() === "") {
              self.subscriptions.push(subscription);
            }

            if (isWizardForm()) {
              if (self[FIELD_VALUES + replacer]() === "") {
                self[FIELD_VALUES + replacer](dataValues[name].value);
              }
            }

            field.setAttribute("value", "{{" + FIELD_VALUES + replacer + "}}");
            field.setAttribute("messages-custom", "[[" + FIELD_MESSAGES + replacer + "]]");
            field.setAttribute("display-options.messages", "none");
          }

          if (typeof field !== "undefined") {
            var messageArea = document.createElement("div");
            messageArea.setAttribute("class", "");
            field.append(messageArea);
          }

          if (typeof self[FIELD_MESSAGES + replacer] === "undefined") {
            self[FIELD_MESSAGES + replacer] = ko.observableArray([]);
            self.dynamicMessageFields.push(self[FIELD_MESSAGES + replacer]);
          }

          if (typeof field !== "undefined") {
            if (field.className === "cfe-multi-select") {
              container = field;
            }
            else if (pdjTypes.isUploadedFileType(name)){
              const params = {
                field: field,
                id: name,
                choose: { "on-click": "[[chooseFileClickHandler]]", iconFile: self.i18n.icons.choose.iconFile, tooltip: self.i18n.icons.choose.tooltip},
                clear: { "on-click": "[[clearChosenFileClickHandler]]", iconFile: self.i18n.icons.clear.iconFile, tooltip: self.i18n.icons.clear.tooltip},
              };
              container = PageDefinitionFields.addUploadFileElements(params);
            }
            else {
              // Apply hightlight class to the field when the value is set
              // Changes for the context menu are not currently supported.
              if (pdjTypes.isValueSet(name, dataValues[name])) {
                field.classList.add("cfe-field-highlight");
              }

              let params = {
                field: field,
                readOnly: (pdjTypes.isReadOnly(name) || Runtime.isReadOnly()),
                restartRequired: pdjTypes.isRestartNeeded(name),
                showMoreIcon: (
                  typeof dataValues[name] !== 'undefined'
                  && dataValues[name] !== null
                  && typeof dataValues[name].optionsSources !== 'undefined'
                  && dataValues[name].optionsSources.length > 0
                  && !pdjTypes.isReadOnly(name)
                  && !Runtime.isReadOnly()
                  && pdjTypes.isReferenceType(name)
                ),
                icons: {
                  restart: {iconFile: self.i18n.icons.restart.iconFile, tooltip: self.i18n.icons.restart.tooltip},
                  more: {iconFile: self.i18n.icons.more.iconFile, iconClass: self.i18n.icons.more.iconClass, tooltip: self.i18n.icons.more.tooltip}
                }
              };

              if (params.showMoreIcon) {
                params['moreMenuParams'] = PageDefinitionOptionsSources.getMoreMenuParams(name, dataValues[name].optionsSources);
              }

              container = PageDefinitionFields.addFieldIcons(params);
            }

            if (!isWizardForm()) {
              self[`${FIELD_DISABLED}_${name}`] = ko.observable(false);
              field.setAttribute('disabled', `[[${FIELD_DISABLED}_${name}]]`);
            }
          }
          formLayout.append(container);
        }  //end of for loops

        if (!isWizardForm()) {
          setupUsedIfListeners(properties);
        }
      }

      this.moreMenuIconClickListener = function (event) {
        event.preventDefault();
        PageDefinitionOptionsSources.showMenuItems(event);
      };

      this.moreMenuClickListener = function (event) {
        event.preventDefault();
        const path = PageDefinitionOptionsSources.getMenuItemPath(event, self.rdjData);
        if (typeof path !== "undefined") {
          Logger.log("More Menu - Routing to path: " + path);
          viewParams.parentRouter.go("/" + viewParams.perspective.id + "/" + encodeURIComponent(path))
            .then((result) => {
              // If the router was successful then signal the navtree with the new path
              if ((typeof result !== 'undefined') && (typeof result.hasChanged !== 'undefined') && result.hasChanged) {
                Logger.log("More Menu - success - Routed to path: " + path);
                viewParams.signaling.navtreeSelectionCleared.dispatch();
                viewParams.signaling.navtreeUpdated.dispatch({ path: path, isEdit: true });
              }
            });
        }
      };

      function getCreateFormPayload(properties) {
        if (isWizardForm()) properties = self.createForm.getRenderProperties();

        // Set things up to return a null if there are no properties
        let results = {properties: properties, data: null};

        if (properties.length > 0) {
          let replacer, fieldValues = {};

          properties.forEach((property) => {
            replacer = property.name;
            if (isWizardForm()) {
              const result = self.createForm.getBackingDataAttributeReplacer(replacer);
              if (typeof result !== "undefined") replacer = result;
            }
            fieldValues[property.name] = self[FIELD_VALUES + replacer];
          });

          if (self.createForm.hasMultiFormData()) {
            self.createForm.postMultiFormDataPayload(properties, fieldValues)
            .then((data) => {
              handleSaveResponse(data, "", {}, "create", (typeof self.pdjData.sliceForm !== "undefined"))
            });
            results.data = undefined;
          }
          else if (self.createForm.hasDeploymentPathData()) {
            results = self.createForm.getDeploymentDataPayload(properties, fieldValues);
          }
          else {
            results = self.createForm.getDataPayload(properties, fieldValues);
          }
        }

        return results;
      }

      function getResponseBodyMessages(response) {
        let bodyMessages = [];
        if (response.body.messages.length > 0) {
          let errorMessage;
          const includeAdvancedFields = (self.showAdvancedFields().length !== 0);
          const properties = getSliceProperties(self.pdjData, includeAdvancedFields);
          response.body.messages.forEach((message) => {
            if (typeof message.property != 'undefined') {
              errorMessage = { severity: message.severity };

              const property = properties.find(property => property.name === message.property);
              if (typeof property !== "undefined") errorMessage["summary"] = property.label;

              errorMessage["detail"] = message.message;
              bodyMessages.push(errorMessage);
            }
          });
        }
        return bodyMessages;
      }

      function getSliceProperties(pdjData, includeAdvancedFields) {
        let properties;
        if (isWizardForm()) {
          properties = self.createForm.getRenderProperties();
        }
        else {
          if (typeof pdjData.sliceForm !== 'undefined') {
            properties = pdjData.sliceForm.properties;

            if (typeof pdjData.sliceForm.advancedProperties !== 'undefined') {
              if (includeAdvancedFields || self.showAdvancedFields().length !== 0) {
                properties = properties.concat(pdjData.sliceForm.advancedProperties);
              }
            }
          }

          if (typeof properties === 'undefined') properties = pdjData.createForm.properties;
        }

        return properties;
      }

      function createHelp(pdjData) {
        const helpForm = new HelpForm(viewParams);

        helpForm.setPDJData(pdjData);
        const includeAdvancedFields = (self.showAdvancedFields().length !== 0);
        const properties = getSliceProperties(pdjData, includeAdvancedFields);
        const helpData = helpForm.getHelpData(properties);
        self.helpDataSource(helpData);
        const div = helpForm.render();
        self.helpFooterDom({ view: HtmlUtils.stringToNodeArray(div.outerHTML), data: self });
      }
    }

    return FormViewModel;
  }
);
