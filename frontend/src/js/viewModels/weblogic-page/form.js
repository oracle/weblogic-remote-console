/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['knockout', 'ojs/ojrouter', 'ojs/ojmodule-element-utils', 'ojs/ojarraydataprovider', 'ojs/ojhtmlutils', '../../cfe/common/runtime', '../../cfe/http/adapter', '../modules/navtree-manager', '../../cfe/services/perspective/perspective-memory-manager', '../modules/tooltip-helper', '../modules/pdj-types', '../modules/pdj-fields', '../modules/pdj-messages', './create-form', './help-form', '../../cfe/common/utils', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojbinddom', 'ojs/ojinputtext', 'ojs/ojlabel', 'ojs/ojswitch', 'ojs/ojselectcombobox', 'ojs/ojformlayout', 'ojs/ojasyncvalidator-regexp', 'ojs/ojconveyorbelt', 'ojs/ojmessages', 'ojs/ojmodule-element', 'ojs/ojmodule', 'cfe-multi-select/loader', 'ojs/ojselectsingle', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojcheckboxset'],
  function (ko, Router, ModuleElementUtils, ArrayDataProvider, HtmlUtils, Runtime, HttpAdapter, NavtreeManager, PerspectiveMemoryManager, TooltipHelper, PageDataTypes, PageDefinitionFields, PageDefinitionMessages, CreateForm, HelpForm, Utils, Logger) {
    function FormViewModel(viewParams) {

      const FIELD_MESSAGES = Object.freeze("fieldMessages_");
      const FIELD_SELECTDATA = Object.freeze("fieldSelectData_");
      const FIELD_VALUES = Object.freeze("fieldValues_");

      const MORE_ICON_PREFIX = Object.freeze("moreIcon_");
      const MORE_MENU_PREFIX = Object.freeze("moreMenu_");

      var self = this;

      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(viewParams.perspective.id);
      this.navtreeManager = new NavtreeManager(viewParams.perspective);

      this.i18n = {
        checkboxes: {
          showAdvancedFields: { id: "show", label: "Show Advanced Fields"}
        },
        messages: {
          save: "Changes added to cart",
          pageNotFound: "Form reload unable to find page data, goto landing page: {0}",
          incorrectFileType: {
            summary: "Incorrect File Type",
            detail: "The file extension of the uploaded file for this field must be {0}"
          }
        },
        icons: {
          restart: {iconFile: "restart-required-org_24x24", tooltip: "Server or App Restart Required"},
          choose: {iconFile: "choose-file-icon-blk_24x24", tooltip: "Choose File"},
          clear: {iconFile: "erase-icon-blk_24x24", tooltip: "Clear Chosen File"},
          more: {iconFile: "more-vertical-brn-8x24", iconClass: "more-vertical-icon", tooltip: "More Actions"}
        },
        menus: {
          more: {
            optionsSources: {
              view: { label: "View/Create {0}..." }
            }
          }
        },
        tables: {
          help: {
            label: "Help Table",
            column: {
              header: {name: "Name", description: "Description"}
            }
          }
        },
        confirmDialog: {
          title: "Unsaved Changes Detected",
          buttons: {
            yes: {id: "dlgOkBtn", label: "Yes", disabled: false},
            no: {id: "dlgCancelBtn", label: "No", disabled: false}
          }
        },
        dialogSync: {
          title: "Set Auto-Reload Interval",
          instructions: "How many seconds do you want for the auto-reloading interval?",
          fields: {
            interval: { label: "Auto-Reload Interval:", value: ko.observable('')}
          },
          buttons: {
            ok: { id: "dlgOkBtn1", label: "OK", disabled: false },
            cancel: { id: "dlgCancelBtn1", label: "Cancel", disabled: false }
          }
        }
      };

      this.syncTimerId = undefined;
      this.dirtyFields = new Set();
      this.dynamicMessageFields = [];
      this.multiSelectControls = {};
      this.debugFlagItems = ko.observable();
      this.debugFlagsEnabled = ko.observableArray([]);

      this.cancelSliceChange = false;
      this.currentSlice = "";

      this.hasAdvancedFields = ko.observable(false);
      this.showAdvancedFields = ko.observableArray([]);

      this.tabDataProviders = ko.observableArray();
      this.tabArrays = ko.observableArray();

      this.level = 0;
      this.lastSelection = undefined;

      this.fieldMessages = ko.observableArray([]);
      this.messages = ko.observableArray([]);
      this.globalMessages = ko.observableArray([]);

      this.globalMessagesDataprovider = new ArrayDataProvider(this.globalMessages);
      this.messagesDataprovider = new ArrayDataProvider(this.messages);
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

      this.formToolbarModuleConfig = ModuleElementUtils.createConfig({
        name: "weblogic-page/form-toolbar",
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
          onConnected: setFormMaxHeight,
          onLandingPageSelected: selectLandingPage,
          onBeanPathHistoryToggled: toggleBeanPathHistory,
          onInstructionsToggled: toggleInstructions,
          onHelpPageToggled: toggleHelpPage,
          onShoppingCartViewed: viewShoppingCart,
          onShoppingCartDiscarded: discardShoppingCart,
          onShoppingCartCommitted: commitShoppingCart,
          onCommitDoTest: testUnsavedChangesForCommit,
          onToolbarRendering: getToolbarRenderingInfo,
          onSyncClicked: setSyncInterval,
          onSyncIntervalClicked: showSetSyncInterval
        }
      });

      this.signalBindings=[];

      this.connected = function () {
        const formContainer = document.getElementById("form-container");
        if (formContainer !== null) new TooltipHelper(formContainer);
        document.title = viewParams.parentRouter.data.pageTitle();

        if (viewParams.perspective.state.name !== "active") {
          viewParams.signaling.perspectiveSelected.dispatch(viewParams.perspective);
        }

        const pdjData = viewParams.parentRouter.data.pdjData();
        if (typeof pdjData.createForm !== "undefined") {
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

      this.selectionChanged = function (d) {
        //the 'this' in the following line is bound to $current.data (which is a tabDataProvider) in form.html
        self.currentSlice = this;
        const level = this.level;

        // initialize the slice history stack with the default tab
        if (typeof this.sliceHistory === 'undefined') {
          this.sliceHistory = [self.tabArrays()[0][0].name];
        }

        this.lastSelection = this.sliceHistory.pop();

        // Push name of clicked slice onto history stack
        this.sliceHistory.push(this.selection());

        // Remove all the elements in the self.tabDataProviders
        // observableArray, starting at level + 1. The objective
        // is to remove any tabs selected on a level greater
        // that the current value of the self.level instance-scope
        // variable.
        self.tabDataProviders.splice(level + 1);

        // Remove all the elements in the self.tabArrays
        // observableArray, starting at level + 1. The objective
        // is to remove any tabs selected on a level greater
        // that the current value of the self.level instance-scope
        // variable.
        self.tabArrays.splice(level + 1);

        // Update slice using name of currently selected tab,
        // and the level just used to do the splicing on the
        // self.tabDataProviders and self.tabArrays instance-scope
        // observableArray variables.
        self.canExit("exit").then(function (result) {
          if (result) {
            cancelAutoSync();
            updateSlice(self.currentSlice, level + 1, self.lastSelection);
          } else {
            // User clicked cancel on the abandon change dialog, so
            // put the value back
            self.cancelSliceChange = true;

            // set the slice back to the previous selection
            let oldTab = self.tabDataProviders()[level].lastSelection;
            this.selection(oldTab);
          }
        }.bind(this));
      };

      this.showAdvancedFieldsValueChanged = function (event) {
//MLW        adjustFormContainerOffsetHeight();

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

      this.isDirty = function () {
        const changes = this.determineChanges(true);
        const numberOfChanges = Object.keys(changes).length;

        return (numberOfChanges !== 0);
      };

      this.canExit = function (eventType) {
        const isEdit = (self.pdjData !== null && self.pdjData.sliceForm);

        if (!self.cancelSliceChange && isEdit && self.isDirty()) {
          // Make a confirm dialog promise
          const promise = new Promise(function (resolve, reject) {
            document.getElementById('confirmDialogPrompt').innerHTML = "Are you sure you want to exit without saving changes?";

            const okBtn = document.getElementById(self.i18n.confirmDialog.buttons.yes.id);
            const cancelBtn = document.getElementById(self.i18n.confirmDialog.buttons.no.id);
            const confirmDialog = document.getElementById('confirmDialog');
            function okClickHandler() {
              resolve(true);
              self.dirtyFields.clear();
              resetPageRedoHistory();
              self.debugFlagsEnabled(PageDefinitionFields.resetDebugFlagsEnabled(self.debugFlagItems()));
              confirmDialog.close();
            }
            okBtn.addEventListener('click', okClickHandler);

            function cancelClickHandler() {
              // clear treenav selection in case that caused the exit
              viewParams.signaling.navtreeSelectionCleared.dispatch();
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
          return promise;
        }
        return Promise.resolve(true);
      };

      function getDirtyFieldsPayload(keepSaveToOrig) {
        const data = self.rdjData.data;
        let dataPayload = {};

        if (self.dirtyFields.size > 0) {
          const properties = getSliceProperties(self.pdjData, true);
          const pdjTypes = new PageDataTypes(properties, viewParams.perspective.id);

          //loop through all of the dirtyFields
          for (let key of self.dirtyFields) {
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

      function updateSlice(newSliceName, level, previousSliceName) {
        let nonDefaultTab = newSliceName !== "";

        if (self.cancelSliceChange) {
          self.cancelSliceChange = false;
          return;
        }

        let rdj;

        let sliceParam = getQualifiedSlice(level);

        // slice has changed, reget the pdj/rdj for the selected slice
        $.getJSON(viewParams.parentRouter.data.rdjUrl() + "?slice=" + sliceParam)
          .then(function (rdjData) {
            rdj = rdjData;
          })
          .then(
            function () {
              const pageDef = rdj.pageDefinition;

              var pdjUrl = Runtime.getBaseUrl() + "/" + viewParams.perspective.id + "/pages/" + pageDef;

              $.getJSON(pdjUrl)
                .then((pdjData) => {
                    self.sliceName = Utils.getSliceFromPDJUrl(pageDef);

                    // Update the selected slices based on the returned page
                    var sliceArray = self.sliceName.split('.');

                    if (typeof pdjData.sliceForm === 'undefined') {
                      return;
                    }

                    let tabs = buildTabArrays(pdjData);

                    function isSame(a, b) {
                      return JSON.stringify(a) === JSON.stringify(b)
                    }

                    function findChildTabs(tabs, tabName) {
                      if (typeof tabs !== 'undefined')
                        for (var i = 0; i < tabs.length; i++) {
                          if (tabs[i].name === tabName) {
                            return tabs[i].tabs;
                          }
                        }
                    }

                    if (tabs.length !== 1 && self.tabArrays().length === 0 || !isSame(tabs, self.tabArrays()[0])) {
                      self.tabArrays.removeAll();
                      self.tabArrays.push(tabs);
                    }

                    let tabLevel = 0;
                    if (tabs.length !== 1 && self.tabDataProviders().length === 0) {
                      self.tabDataProviders.push({ level: tabLevel, selection: ko.observable(sliceArray[0]), dataProvider: new ArrayDataProvider(self.tabArrays()[0], { keyAttributes: 'name' }) });
                    }

                    tabLevel++;

                    // loop through the selected tabs and populate tab dataproviders
                    let subtabs = tabs;
                    for (let s = 0; s < sliceArray.length; s++) {
                      for (let ix = 0; ix < subtabs.length; ix++) {
                        if (sliceArray[s] !== subtabs[ix].name) {
                          continue;
                        }
                        subtabs = findChildTabs(subtabs, sliceArray[s]);

                        if (typeof subtabs === 'undefined') {
                          break;
                        }

                        if (self.tabArrays().length <= s + 1) {
                          self.tabArrays.push(subtabs);
                          const dataProvider = { level: tabLevel, selection: ko.observable(sliceArray[s + 1]), dataProvider: new ArrayDataProvider(subtabs, { keyAttributes: 'name' }) };

                          self.tabDataProviders.push(dataProvider);
                        } else if (!isSame(self.tabArrays()[s + 1], subtabs)) {
                          self.tabArrays.pop();
                          self.tabArrays.push(subtabs);

                          const dataProvider = { level: tabLevel, selection: ko.observable(sliceArray[s + 1]), dataProvider: new ArrayDataProvider(subtabs, { keyAttributes: 'name' }) };
                          self.tabDataProviders.pop();
                          self.tabDataProviders.push(dataProvider);
                        }
                        tabLevel++;
                        break;
                      }
                    }

                    // only update pdj/rdj observables for the nonDefaultTab
                    // to avoid looping on hot rdj's (e.g. JVM Runtimes)
                    if (nonDefaultTab) {
                      if (JSON.stringify(pdjData) !== JSON.stringify(viewParams.parentRouter.data.pdjData())) {
                        viewParams.parentRouter.data.pdjData(pdjData);
                      }

                      if (JSON.stringify(rdj) !== JSON.stringify(viewParams.parentRouter.data.rdjData())) {
                        viewParams.parentRouter.data.rdjData(rdj);
                      }
                    }

                    if (typeof rdj.data !== 'undefined') {
                      const pageTitle = `${Runtime.getName()} - ${rdj.data.Name.value}`;
                      viewParams.parentRouter.data.pageTitle(pageTitle);
                    }

                    self.pdjData = pdjData;
                    self.rdjData = rdj;

                    viewParams.signaling.tabStripTabSelected.dispatch("form", "shoppingcart", false);
                    setFormMaxHeight(self.perspectiveMemory.beanPathHistory.visibility);
                  }
                )
            }
          )
      }

      function getQualifiedSlice(level) {
        let sliceParam = '';

        for (let i = 0; i <= level; i++) {
          if (typeof self.tabDataProviders()[i] !== 'undefined') {
            if (sliceParam !== '') sliceParam += '.';
            sliceParam += self.tabDataProviders()[i].selection();
          }
        }
        return sliceParam;
      }

      function getToolbarRenderingInfo(eventType) {
        return new Promise(function (resolve) {
          let path = decodeURIComponent(viewParams.parentRouter.data.rawPath());
          path = Utils.removeTrailingSlashes(path);
          let kind, formDataExists = false;
          let mode = (typeof self.pdjData !== "undefined" && typeof self.pdjData.sliceForm !== "undefined" ? "save" : "create");
          if (typeof path !== "undefined") {
            self.navtreeManager.getPathModel(path)
            .then((pathModel) => {
              path = pathModel.path;
              kind = pathModel.kind;
              Logger.info(`[FORM] path=${path}, kind=${kind}`);

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

      function testUnsavedChangesForCommit() {
          if ( self.isDirty()) {
            // Make a confirm dialog promise
            const promise = new Promise(function (resolve, reject) {
              document.getElementById('confirmDialogPrompt').innerHTML = "All unsaved changes will be lost. Continue?";

              const okBtn = document.getElementById(self.i18n.confirmDialog.buttons.yes.id);
              const cancelBtn = document.getElementById(self.i18n.confirmDialog.buttons.no.id);
              const confirmDialog = document.getElementById('confirmDialog');
              function okClickHandler() {
                resolve(true);
                self.dirtyFields.clear();
                resetPageRedoHistory();
                self.debugFlagsEnabled(PageDefinitionFields.resetDebugFlagsEnabled(self.debugFlagItems()));
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
            return promise;
          }
          return Promise.resolve(true);
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

      function renderPageData(toolbarButton, render) {
        reloadRdjData();

        // When specified skip the render call as the RDJ reload will trigger observable subscription
        if ((typeof render === 'undefined') || render) {
          renderPage();
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

      function reloadPageData() {
        renderPageData("", false);
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

      function adjustFormContainerOffsetHeight() {
        const heightPadding = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--padding-30"), 10);
        let newOffsetHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--form-container-offset-height"), 10);
        newOffsetHeight += (self.showAdvancedFields().length > 0 ? -heightPadding : heightPadding);
        document.documentElement.style.setProperty("--form-container-offset-height", `${newOffsetHeight}px`);
      }

      function setFormMaxHeight(historyVisible){
        const heightPadding = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--padding-40"), 10);
        let newOffsetHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--form-container-offset-height"), 10);
        const container = document.getElementById("form-container");
        if (isWizardForm()) {
          newOffsetHeight -= container.offsetTop;
        }
        else {
          newOffsetHeight = container.offsetTop + (newOffsetHeight - container.offsetTop);
        }
        if (historyVisible) newOffsetHeight += heightPadding;
        if (self.showHelp()) newOffsetHeight -= heightPadding;
        Logger.info(`[FORM] historyVisible=${historyVisible}, showHelp=${self.showHelp()}, newOffsetHeight=${newOffsetHeight}, container.offsetTop=${container.offsetTop}`);
        document.documentElement.style.setProperty("--form-container-calc-max-height", `${newOffsetHeight}px`);
      }

      function toggleBeanPathHistory (historyVisible) {
        setFormMaxHeight(historyVisible);
        return viewParams.onBeanPathHistoryToggled();
      }

      function toggleInstructions (instructionsVisible, historyVisible) {
        const ele = document.getElementById("intro");
        ele.style.display = (instructionsVisible ? "inline-block" : "none");
        self.showInstructions(instructionsVisible);
        setFormMaxHeight(historyVisible);
      }

      function toggleHelpPage(helpVisible, historyVisible) {
        self.showHelp(helpVisible);
        setFormMaxHeight(historyVisible);
      }

      function selectLandingPage() {
        viewParams.onLandingPageSelected();
      }

      function newBean() {
        self.createForm = new CreateForm(viewParams);
        self.createForm.newBean()
          .then((result) => {
            viewParams.parentRouter.data.pdjUrl(result.data.pdjUrl);
            viewParams.parentRouter.data.pdjData(result.data.pdjData);
            viewParams.parentRouter.data.rdjData(result.data.rdjData);

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
          });
      }

      function deleteBean(deleteUrl) {
        self.createForm = new CreateForm(viewParams);
        self.createForm.deleteBean(deleteUrl)
          .then((response) => {
            if (response.ok) {
              self.formToolbarModuleConfig
                .then((moduleConfig) => {
                  const changeManager = moduleConfig.viewModel.changeManager();
                  moduleConfig.viewModel.changeManager({ isLockOwner: true, hasChanges: changeManager.hasChanges, supportsChanges: changeManager.supportsChanges });
                  moduleConfig.viewModel.renderToolbarButtons("delete");
                });
            }
            else {
              response.json()
              .then((responseJSON) => {
                displayResponseMessages(responseJSON.messages);
              });

              self.formToolbarModuleConfig
              .then((moduleConfig) => {
                const changeManager = moduleConfig.viewModel.changeManager();
                moduleConfig.viewModel.changeManager({ isLockOwner: true, hasChanges: changeManager.hasChanges, supportsChanges: changeManager.supportsChanges });
                moduleConfig.viewModel.renderToolbarButtons("delete");
              });
            }
          });

        viewParams.signaling.tabStripTabSelected.dispatch("form", "shoppingcart", false);
      }

      function saveBean(eventType) {
        let dataPayload = self.determineChanges(false);
        let dataAction = '';
        let isEdit = typeof self.pdjData.sliceForm !== 'undefined';
        if (isEdit) {
          dataAction = '?slice=' + self.sliceName;
        } else {
          dataAction = '?dataAction=create';
        }

        Logger.log(`[FORM] dataAction=${dataAction}, dataPayload=${JSON.stringify(dataPayload)}`);

        // First, check for empty payload and return when there is no data
        if (isEdit && (dataPayload != null) && (Object.keys(dataPayload).length === 0)) {
          Logger.log(`[FORM] POST data is empty while isEdit=true, exiting save!`);
          return;
        }

        // Second, check for no payload and instead POST an empty data object
        if (dataPayload === null) dataPayload = {};

        if (typeof dataPayload !== 'undefined') {
          Logger.log(`[FORM] POST dataPayload=${JSON.stringify(dataPayload)}`);
          $.ajax({
            type: "POST",
            url: viewParams.parentRouter.data.rdjUrl() + dataAction,
            data: JSON.stringify({ data: dataPayload }),
            contentType: "application/json",
            dataType: 'json',
            complete: function (data) {
              handleSaveResponse(data, dataAction, dataPayload, eventType, isEdit);
            }
          });
        }
      }

      function handleSaveResponse(data, dataAction, dataPayload, eventType, isEdit) {
        clearDynamicFieldMessages();

        let responseMessages = [];

        if (typeof data.responseJSON !== "undefined") {
          responseMessages = displayResponseMessages(data.responseJSON.messages);
        }

        self.debugFlagsEnabled(PageDefinitionFields.resetDebugFlagsEnabled(self.debugFlagItems()));

        self.formToolbarModuleConfig
          .then((moduleConfig) => {
            const changeManager = moduleConfig.viewModel.changeManager();
            moduleConfig.viewModel.changeManager({ isLockOwner: changeManager.isLockOwner, hasChanges: changeManager.hasChanges, supportsChanges: changeManager.supportsChanges });
          });

        if (data.status < 200 || data.status > 299) {
          saveFailedNoMessages(dataAction, dataPayload, isEdit);
        }
        else if (responseMessages.length === 0) {
          saveSuceededNoMessages(eventType, dataPayload, isEdit);
        } else {
          // response code of 200 with responseMessages doesn't make sense
          Logger.log(`[FORM] Unknown state: HTTP_STATUS=200, hadResponseMessages=true`);
        }

        // Collapse console Kiosk, regardless of what happened above.
        viewParams.signaling.tabStripTabSelected.dispatch("form", "shoppingcart", false);
      }

      function saveFailedNoMessages(dataAction, dataPayload, isEdit) {
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

          $.ajax({
            type: "POST",
            url: viewParams.parentRouter.data.rdjUrl() + dataAction,
            data: JSON.stringify({ data: compensatingPayload }),
            contentType: "application/json",
            dataType: 'json',
            complete: function (data) {

              if (typeof data.responseJSON.messages !== 'undefined') {
                Logger.error(`[FORM] Compensating transaction failed!`);
              }
            }
          })
        } else if (typeof dataPayload['Name'] !== 'undefined') {
          let dataPayloadName = dataPayload['Name'];
          let pathLeafName;
          if (typeof dataPayloadName !== 'undefined') pathLeafName = dataPayloadName.value;

          let deleteUrl = viewParams.parentRouter.data.rdjUrl() + "/" + encodeURIComponent(pathLeafName);
          HttpAdapter.delete(deleteUrl, '{}')
            .then((response) => {
              if (response.ok) {
                Logger.log(`[FORM] Delete of partially created object successful.`);
              } else {
                Logger.log(`[FORM] Delete of partially created object not possible`);
              }
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

      function saveSuceededNoMessages(eventType, dataPayload, isEdit) {
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
          viewParams.signaling.popupMessageSent.dispatch({
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
          let pathLeafName = "";
          let dataPayloadName = dataPayload['Name'];
          if (typeof dataPayloadName !== 'undefined') pathLeafName = dataPayloadName.value;

          const path = decodeURIComponent(routerData.rawPath()) + "/" + encodeURIComponent(pathLeafName);
          const editPage = "/" + viewParams.perspective.id + "/" + encodeURIComponent(path);

          Router.rootInstance.go(editPage)
            .then((hasChanged) => {
              self.formToolbarModuleConfig
                .then((moduleConfig) => {
                  const changeManager = moduleConfig.viewModel.changeManager();
                  moduleConfig.viewModel.changeManager({ isLockOwner: changeManager.isLockOwner, hasChanges: changeManager.hasChanges, supportsChanges: changeManager.supportsChanges });
                  moduleConfig.viewModel.renderToolbarButtons(eventType);
                });
            });
        }
      }

      function clearDynamicFieldMessages() {
        self.dynamicMessageFields.forEach((dynamicFieldMessage) => {
          while (dynamicFieldMessage().length !== 0) {
            dynamicFieldMessage.pop();
          }
        });
      }

      function displayResponseMessages(responseMessages) {
        // clear out messages
        self.messages.removeAll();

        responseMessages = PageDefinitionMessages.displayResponseMessages(responseMessages, viewParams.signaling.popupMessageSent);

        if (responseMessages.length > 0) {
          let errorMessage;
          const includeAdvancedFields = (self.showAdvancedFields().length !== 0);
          const properties = getSliceProperties(self.pdjData, includeAdvancedFields);
          responseMessages.forEach((message) => {
            if (typeof message.property != 'undefined') {
              errorMessage = { severity: 'error' };

              properties.forEach((property) => {
                if (property.name === message.property) errorMessage.summary = property.label;
              });

              errorMessage.detail = message.message;
              self[FIELD_MESSAGES + message.property].push(message);
              viewParams.signaling.popupMessageSent.dispatch(errorMessage);
            }
          });
        }

        return responseMessages;
      }

      function reloadRdjData() {
        //temp fix for incorrect self.sliceName
        const pageDefinition = (typeof viewParams.parentRouter.data.rdjData !== "undefined" ? viewParams.parentRouter.data.rdjData().pageDefinition: undefined);
        const sliceName = pageDefinition.substring( pageDefinition.indexOf("=") +1 );
        Logger.log(`[FORM] self.sliceName=${self.sliceName}`);

        $.getJSON(viewParams.parentRouter.data.rdjUrl() + "?slice=" + sliceName)
          .then((rdjData) => {
            //preserve those changes that occurs AFTER a save has done, and before discard.
            const dataPayload = getDirtyFieldsPayload();
            const path = decodeURIComponent(viewParams.parentRouter.data.rawPath());
            self.navtreeManager.getPathModel(Utils.removeTrailingSlashes(path))
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
            }).catch((response) => {
              displayResponseMessages(response.responseJSON.messages);
            });
          }, (jqXHR, status, error) => {
            // failed to reload rdjData
            if (jqXHR.status === 404) {
              signalGotoLandingPage(self.i18n.messages.pageNotFound.replace("{0}", jqXHR.responseText));
            }
          }).catch((response) => {
            displayResponseMessages(response.responseJSON.messages);
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
          if (self.currentSlice === "") {
            updateSlice(self.currentSlice, 1);
          }
        }

        let bindHtml = (typeof pdjData.introductionHTML !== 'undefined' ? pdjData.introductionHTML : "<p>");
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
          renderSpecialHandlingFields();
          }, 5
        );
      }

      function renderSpecialHandlingFields() {
        function onMouseUp(event) {
          const parentNode = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
          const minHeight = parseInt(parentNode.style["min-height"], 10);
          const calcOffsetHeight = (event.target.offsetHeight - minHeight);
          Logger.info(`[FORM] calcOffsetHeight=${calcOffsetHeight}`);
          parentNode.style.height = `${minHeight + calcOffsetHeight - 8}px`;
          const name = Utils.getSubstring(event.target.id, "|");
          self.perspectiveMemory.setNthChildMinHeight.call(self.perspectiveMemory, name, parentNode.style.height);
        }

        let ele;
        self.perspectiveMemory.nthChildrenItems.call(self.perspectiveMemory).forEach((nthChild) => {
          ele = document.querySelector("#wlsform > div > div:nth-child(" + nthChild.row + ") > div:nth-child(" + nthChild.col + ")");
          if (ele !== null && typeof nthChild.minHeight !== "undefined") {
            ele.addEventListener("mouseup", onMouseUp);
            ele.style["user-select"] = "none";
            ele.style["min-height"] = nthChild.minHeight;
            ele = document.getElementById(`${nthChild.name}|input`);
            if (ele !== null) ele.style.height = `${parseInt(nthChild.minHeight, 10) + 8}px`;
          }
        });
      }

      function renderWizardForm(rdjData) {
        const div = document.createElement("div");
        div.setAttribute("id", "cfe-form");
        div.style.display = 'block';

        const formLayout = createWLSForm(div, {labelWidthPcnt: "32%", maxColumns: "1"});
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
          populateFormLayout(properties, formLayout, pdjTypes, rdjData.data)
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

        const isDebugFlagsSlice = (getFormPresentation(pdjData, "useCheckBoxesForBooleans") !== null);
        const formLayout = createWLSForm(div, {labelWidthPcnt: "46%", maxColumns: (isDebugFlagsSlice ? "1" : "2")});

        if (isDebugFlagsSlice) {
          const debugFlagsCheckboxSet = PageDefinitionFields.createDebugFlagsCheckboxset(properties, rdjData.data);
          const field = debugFlagsCheckboxSet.field;
          self.debugFlagsEnabled(debugFlagsCheckboxSet.debugFlagsEnabled);
          self.debugFlagItems(debugFlagsCheckboxSet.dataProvider);
          formLayout.append(field);
        }
        else
        {
          if (typeof rdjData.data !== "undefined") {
            populateFormLayout(properties, formLayout, pdjTypes, rdjData.data);

            if ((properties.length !== 1) && (properties.length % 2 !== 0)) {
              const field = document.createElement("oj-input-text");
              field.setAttribute("readonly", "readonly");
              formLayout.append(field);
            }
          }
        }

        return div;
      }

      function createWLSForm(cfeForm, options) {
        const formLayout = document.createElement("oj-form-layout");
        formLayout.className = "oj-formlayout-full-width";
        formLayout.setAttribute("id", "wlsform");
        formLayout.setAttribute("label-edge", "start");
        formLayout.setAttribute("label-width", options.labelWidthPcnt);
        formLayout.setAttribute("max-columns", options.maxColumns);
        formLayout.setAttribute("colspan-wrap", "wrap");
        formLayout.setAttribute("direction", "row");
        formLayout.setAttribute("data-oj-binding-provider", "none");

        if (self.readonly() && viewParams.perspective.id === "configuration") formLayout.setAttribute("readonly", "true");
        cfeForm.append(formLayout);

        return formLayout;
      }

      function createFieldValueSubscription(name, replacer){
        return self[FIELD_VALUES + replacer].subscribe((newValue) => {
          self.dirtyFields.add(name);
          if (isWizardForm()) {
            self.createForm.backingDataAttributeValueChanged(name, newValue);
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

      function populateFormLayout(properties, formLayout, pdjTypes, dataValues){
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
          } else if (pdjTypes.isBooleanType(name) && (!pdjTypes.isReadOnly(name))) {
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
              if (((properties.length - 1) % 2) === 1) {
                if (!isWizardForm()) formLayout.append(document.createElement("div"));
              }
            } else {
              const isEdit = (typeof self.pdjData.sliceForm !== 'undefined');
              const dataProviderName = FIELD_SELECTDATA + replacer;
              const singleSelect = PageDefinitionFields.createSingleSelect(pdjTypes, value, dataValues, name, isEdit);
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
              if (pdjTypes.isReadOnly(name)) {
                field.className = "cfe-form-readonly-select-one";
                field.setAttribute("readonly", "readonly");
              }
            }
          }
          else if (pdjTypes.isSecretType(name)) {
            field = PageDefinitionFields.createInputPassword("cfe-form-input-password");
          }
          else if (pdjTypes.isArray(name) || pdjTypes.isPropertiesType(name)) {
            const params = {"resize-behavior": "vertical", "placeholder": pdjTypes.getInLineHelpPresentation(name)};
            field = PageDefinitionFields.createTextArea("cfe-form-input-textarea", params);
            if (pdjTypes.isReadOnly(name)) {
              field.setAttribute("readonly", "readonly");
            }
            let nthChild = self.perspectiveMemory.getNthChildrenItem.call(self.perspectiveMemory, name);
            if (typeof nthChild === "undefined") nthChild = {name: name, row: parseInt(i) + 1, col: 2, minHeight: "48px"};
            self.perspectiveMemory.upsertNthChildrenItem.call(self.perspectiveMemory, nthChild);
          }
          else if (pdjTypes.isReadOnly(name)) {
            field = PageDefinitionFields.createReadOnlyText("cfe-form-readonly-text");
            field.setAttribute("readonly", "readonly");
            if (["SourcePath", "PlanPath"].includes(name)) field.setAttribute("title", value);
          }
          else if (pdjTypes.isUploadedFileType(name)) {
            field = PageDefinitionFields.createFileChooser("cfe-file-picker");
          }
          else {
            const params = {"placeholder": pdjTypes.getInLineHelpPresentation(name)};
            field = PageDefinitionFields.createInputText("cfe-form-input-text", params);
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
                params['moreMenuParams'] = getPropertyMoreMenuParams(name, dataValues[name].optionsSources);
              }

              container = PageDefinitionFields.addFieldIcons(params);
            }
          }

          formLayout.append(container);
        }  //end of for loops
      }

      this.moreMenuIconClickListener = function (event) {
        event.preventDefault();

        // Get the more menu id based on the property name in the event
        let propertyName = event.currentTarget.id.substring(MORE_ICON_PREFIX.length);
        let menuId = MORE_MENU_PREFIX + propertyName;

        // Open the more menu for the property name
        document.getElementById(menuId).open(event);
      };

      this.moreMenuClickListener = function (event) {
        event.preventDefault();

        // Get the property name based on the menu selected
        let propertyName = event.currentTarget.id.substring(MORE_MENU_PREFIX.length);

        // Get the index value for the optionSources from the menu item value
        let index = Number(event.target.value);

        // Get the identity for the selected optionsSource
        if ((typeof self.rdjData.data !== 'undefined')
          && (typeof self.rdjData.data[propertyName] !== 'undefined')
          && (typeof self.rdjData.data[propertyName].optionsSources !== 'undefined')) {
          let optionsSource = self.rdjData.data[propertyName].optionsSources[index];
          if (typeof optionsSource !== 'undefined') {
            // Get the path from the option source identity
            let path = Utils.pathEncodedFromIdentity(optionsSource);
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
        }
      };

      function getPropertyMoreMenuParams(propertyName, optionsSources) {
        // Setup the more menu information
        let params = {
          buttonId: MORE_ICON_PREFIX + propertyName,
          menuId: MORE_MENU_PREFIX + propertyName,
          menuItems: []
        };
        // Form the menu items from the option sources identity
        // by replacing the format parameter from the i18n text
        let menuItemLabelFormat = self.i18n.menus.more.optionsSources.view.label;
        for (let i = 0; i <  optionsSources.length; i++) {
          let display = Utils.displayNameFromIdentity(optionsSources[i]);
          let itemLabel = menuItemLabelFormat.replace("{0}", display);
          params.menuItems.push(itemLabel);
        }
        return params;
      }

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

      function getFormPresentation(pdjData, key) {
        let result = null;
        if ((typeof pdjData.sliceForm !== 'undefined') && (typeof pdjData.sliceForm.presentation !== 'undefined')) {
          let presentation = pdjData.sliceForm.presentation;
          if (typeof presentation[key] !== 'undefined') {
            result = presentation[key];
            if (typeof result === 'boolean') {
              result = (result ? "true" : null);
            }
          }
        }
        return result;
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

    function buildTabArrays(pdj) {
      let tabArray = [];

      function tabFromSlice(slice) {
        return { name: slice.name, label: slice.label };
      }

      // create Tabs recursively from an element in a pdj
      function createTabs(levelTabs, pdjElement) {
        if (typeof pdjElement.slices !== 'undefined') {
          pdjElement.slices.forEach(function (levelSlice) {
            levelTabs.push(tabFromSlice(levelSlice));

            if (typeof levelSlice.slices !== 'undefined') {
              levelTabs[levelTabs.length - 1].tabs = [];
              createTabs(levelTabs[levelTabs.length - 1].tabs, levelSlice);
            }
          });
        }
      }

      createTabs(tabArray, pdj.sliceForm);

      return tabArray;
    }

    FormViewModel.prototype = {
      buildTabArrays: buildTabArrays
    };

    return FormViewModel;
  }
);
