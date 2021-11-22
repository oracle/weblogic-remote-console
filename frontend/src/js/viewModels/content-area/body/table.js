/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojmodule-element-utils', 'ojs/ojarraydataprovider', 'ojs/ojpagingdataproviderview', 'ojs/ojhtmlutils', 'ojs/ojknockout-keyset', '../../../core/runtime', '../../../apis/data-operations', '../../../apis/message-displaying', './actions-dialog', './unsaved-changes-dialog', './set-sync-interval-dialog', './container-resizer', '../../../microservices/page-definition/types', '../../../microservices/page-definition/actions', '../../../microservices/page-definition/fields', '../../../microservices/page-definition/utils', './help-form', './wdt-form', '../../utils', '../../../core/types', '../../../core/utils', '../../../core/cbe-types', '../../../core/cbe-utils', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojbinddom', 'ojs/ojdialog', 'ojs/ojmodule-element', 'ojs/ojmodule', 'ojs/ojpagingcontrol', 'cfe-multi-select/loader'],
  function (oj, ko, Router, ModuleElementUtils, ArrayDataProvider, PagingDataProviderView, HtmlUtils, keySet, Runtime, DataOperations, MessageDisplaying, ActionsDialog, UnsavedChangesDialog, SetSyncIntervalDialog, ContentAreaContainerResizer, PageDataTypes, PageDefinitionActions, PageDefinitionFields, PageDefinitionUtils, HelpForm, WdtForm, ViewModelUtils, CoreTypes, CoreUtils, CbeTypes, CbeUtils, Logger) {
    function TableViewModel(viewParams) {
      // Declare reference to instance of the ViewModel
      // that JET creates/manages the lifecycle of. This
      // reference is needed (and used) inside closures.
      const self = this;

      // START: Declare instance variables used in the ViewModel's view

      this.i18n = {
        checkboxes: {
          "showHiddenColumns": {id: "show-hidden-columns",
            label: oj.Translations.getTranslatedString("wrc-table.checkboxes.showHiddenColumns.label")
          }
        },
        buttons: {
          yes: {disabled: false,
            label: oj.Translations.getTranslatedString("wrc-common.buttons.yes.label")
          },
          no: {disabled: false,
            label: oj.Translations.getTranslatedString("wrc-common.buttons.no.label")
          },
          ok: {disabled: false,
            label: oj.Translations.getTranslatedString("wrc-common.buttons.ok.label")
          },
          cancel: {disabled: false,
            label: oj.Translations.getTranslatedString("wrc-common.buttons.cancel.label")
          }
        },
        prompts: {
          unsavedChanges: {
            needDownloading: {value: oj.Translations.getTranslatedString("wrc-unsaved-changes.prompts.unsavedChanges.needDownloading.value")}
          }
        },
        dialog: {
          title: ko.observable(""),
          instructions: ko.observable(""),
          prompt: ko.observable("")
        },
        dialogSync: {
          title: oj.Translations.getTranslatedString("wrc-sync-interval.dialogSync.title"),
          instructions: oj.Translations.getTranslatedString("wrc-sync-interval.dialogSync.instructions"),
          fields: {
            interval: {value: ko.observable(''),
              label: oj.Translations.getTranslatedString("wrc-sync-interval.dialogSync.fields.interval.label")
            }
          }
        },
        actionsDialog: {
          title: ko.observable(""),
          instructions: ko.observable(""),
          buttons: {
            ok: {disabled: ko.observable(true),
              label: ko.observable("")
            },
            cancel: {disabled: false,
              label: oj.Translations.getTranslatedString("wrc-table.actionsDialog.buttons.cancel.label")
            }
          }
        }
      };

      this.perspective = viewParams.perspective;

      this.introductionHTML = ko.observable();

      this.tableToolbarModuleConfig = ModuleElementUtils.createConfig({
        name: "content-area/body/table-toolbar",
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          perspective: viewParams.perspective,
          pageDefinitionActions: getPageDefinitionActions,
          newAction: newBean,
          onWriteModelFile: writeModelFile,
          isWdtTable: isWdtTable,
          onConnected: setFormContainerMaxHeight,
          onLandingPageSelected: selectLandingPage,
          onBeanPathHistoryToggled: toggleBeanPathHistory,
          onInstructionsToggled: toggleInstructions,
          onHelpPageToggled: toggleHelpPage,
          onShoppingCartViewed: viewShoppingCart,
          onShoppingCartDiscarded: discardShoppingCart,
          onSyncClicked: setSyncInterval,
          onSyncIntervalClicked: captureSyncInterval,
          onActionButtonClicked: renderActionsDialog
        }
      });

      this.columnDataProvider = ko.observable();
      this.rdjDataProvider = ko.observable();
      this.selectedRows = new keySet.ObservableKeySet();
      this.rowsPerPage = ko.observable(10);

      this.readonly = ko.observable(Runtime.isReadOnly());

      this.actionsDialog = {formLayout: { html: ko.observable({}) }};

      this.hasHiddenColumns = ko.observable(false);
      this.showHiddenColumns = ko.observableArray();

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
      this.confirmationMessage = ko.observable("");

      self.connected = function () {
        self.signalBindings.push(viewParams.signaling.readonlyChanged.add((newRO) => {
          self.readonly(newRO);
          renderPage();
        }));

        if (viewParams.perspective.state.name !== "active") {
          viewParams.signaling.perspectiveSelected.dispatch(viewParams.perspective);
        }

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
        return true;
      };

      this.showHiddenColumnsValueChanged = function (event) {
        renderPage();
      };

      function isWdtTable() {
        return (viewParams.perspective.id === "modeling");
      }

      function getPageDefinitionActions() {
        return self.pageDefinitionActions;
      }

      function viewShoppingCart() {
        viewParams.onShoppingCartViewed();
      }

      function discardShoppingCart() {
        // Only perform UI restore if we're in "configuration" perspective.
        if (self.perspective.id === "configuration") {
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
        if (typeof self.timerId !== "undefined") {
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
          data.field.setAttribute("on-chosen-items-changed", "[[chosenItemsChanged]]");
          data.field.setAttribute("readonly", dialogParams.isReadOnly);
          self.availableItems = data.availableItems;
          self.actionsDialog.formLayout.html({ view: HtmlUtils.stringToNodeArray(data.formLayout.outerHTML), data: self });
          self.chosenItems = [];
          return ActionsDialog.showActionsDialog(dialogParams, self.i18n)
            .then((result) => {
              result["chosenItems"] =  self.chosenItems;
              result["urls"] = data.urls;
              resolve(result);
            })
            .catch(cancelled => {
              Logger.log(`cancelBtn was clicked, or ESC key was pressed!`);
            });
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

      function setFormContainerMaxHeight(withHistoryVisible){
        const options = {withHistoryVisible: withHistoryVisible, withHelpVisible: self.showHelp()};
        const offsetMaxHeight = self.contentAreaContainerResizer.getOffsetMaxHeight("#table-container", options);
        Logger.log(`max-height=calc(100vh - ${offsetMaxHeight}px)`);
        const ele = document.querySelector(".cfe-table-form-content");
        if (ele !== null) ele.style["max-height"] = `calc(100vh - ${offsetMaxHeight}px)`;
      }

      function toggleBeanPathHistory (withHistoryVisible) {
        setFormContainerMaxHeight(withHistoryVisible);
        // Call function in perspective assigned to the
        // onBeanPathHistoryToggled field in viewParams.
        return viewParams.onBeanPathHistoryToggled();
      }

      function toggleInstructions (withInstructionsVisible, withHistoryVisible) {
        const ele = document.getElementById("intro");
        ele.style.display = (withInstructionsVisible ? "inline-block" : "none");
        self.showInstructions(withInstructionsVisible);
        setFormContainerMaxHeight(withHistoryVisible);
      }

      function toggleHelpPage(withHelpVisible, withHistoryVisible) {
        self.showHelp(withHelpVisible);
        setFormContainerMaxHeight(withHistoryVisible);
        if (!withHelpVisible) renderPage();
      }

      function selectLandingPage() {
        viewParams.onLandingPageSelected();
      }

      function newBean(event) {
        const createFormUrl = viewParams.parentRouter.data.rdjData().createForm.resourceData;
        DataOperations.mbean.new(createFormUrl)
          .then(reply => {
            Logger.log(`reply=${JSON.stringify(reply)}`);
            viewParams.parentRouter.data.pdjUrl(reply.body.data.get("pdjUrl"));
            viewParams.parentRouter.data.pdjData(reply.body.data.get("pdjData"));
            viewParams.parentRouter.data.rdjData(reply.body.data.get("rdjData"));
            viewParams.parentRouter.go("form");
          })
          .catch(response => {
            ViewModelUtils.failureResponseDefaultHandling(response);
          })
      }

      this.selectedListener = function (event) {
        var id = null;

        if (event.type === "selectedChanged") {
          if (this.selectedRows() != null && this.selectedRows().values().size > 0) {
            this.selectedRows().values().forEach(function (key) {
              id = key;
            });
          }

          // fix the navtree
          viewParams.signaling.navtreeSelectionCleared.dispatch();

          var path = id;

          if (path !== null) Router.rootInstance.go("/" + self.perspective.id + "/" + encodeURIComponent(path));
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

      function writeModelFile(eventType = "autoSave") {
        function downloadWdtModelFile() {
          self.wdtForm.getModelFileChanges()
            .then(reply => {
              if (reply.succeeded) {
                MessageDisplaying.displayMessage({
                  severity: 'confirmation',
                  summary: self.wdtForm.getSummaryMessage(ViewModelUtils.isElectronApiAvailable() ? "changesSaved": "changesDownloaded")
                }, 2500);
              }
              else {
                // This means wdtForm.getModelFileChanges() was
                // able to download, but not write out the model
                // file. Call writeModelFile passing in the
                // filepath and fileContents in reply.
                self.wdtForm.writeModelFile({filepath: reply.filepath, fileContents: reply.fileContents})
                  .then(reply => {
                    Logger.log(`[TABLE] self.wdtForm.writeModelFile(options) returned ${reply.succeeded}`);
                  });
              }
            })
            .catch(response => {
              ViewModelUtils.failureResponseDefaultHandling(response);
            });
        }

        if (!ViewModelUtils.isElectronApiAvailable()) {
          switch (eventType) {
            case "autoSave": {
              self.i18n.dialog.title(oj.Translations.getTranslatedString("wrc-unsaved-changes.titles.changesNeedDownloading.value"));
              self.i18n.dialog.prompt(self.i18n.prompts.unsavedChanges.needDownloading.value);
              UnsavedChangesDialog.showConfirmDialog("ChangesNotDownloaded", self.i18n)
                .then(reply => {
                  if (reply) downloadWdtModelFile(eventType);
                });
            }
              break;
            case "navigation":
            case "download":
              downloadWdtModelFile(eventType);
              break;
          }
        }
        else {
          downloadWdtModelFile(eventType);
        }
      }

      this.deleteListener = function (event) {
        // prevent row from being selected as a result of the delete button being clicked
        event.stopPropagation();

        self.selectedRows.clear();

        DataOperations.mbean.delete(event.currentTarget.id)
          .then((reply) => {
            if (CoreUtils.isNotUndefinedNorNull(reply.body.messages) && reply.body.messages.length > 0) {
              MessageDisplaying.displayResponseMessages(reply.body.messages);
            }
            else if (CoreUtils.isNotUndefinedNorNull(self.wdtForm)) {
              writeModelFile();
            }
          })
          .then(() => {
            viewParams.signaling.shoppingCartModified.dispatch("table", "delete", {isLockOwner: true, hasChanges: true, supportsChanges: true,}, event.srcElement.id);
            return {
              isEdit: false,
              path: decodeURIComponent(viewParams.parentRouter.data.rawPath()),
            };
          })
          .then((treeaction) => {
            if (typeof viewParams.parentRouter.data.breadcrumbs !== "undefined") {
              treeaction["breadcrumbs"] =
                viewParams.parentRouter.data.breadcrumbs();
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
              "table",
              "refresh",
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
              "table",
              "shoppingcart",
              false
            );
          });
      }.bind(this);

      function appendTableColumnMetadata(tableColumns, columnMetadata) {
        // Add the remaining table columns
        for (var i in tableColumns) {
          const column = tableColumns[i];
          // append some non-breaking spaces to the headertext so the sorting
          // arrows don't overlap.
          let cheaderText = column.label ? column.label: column.name;

          for (i = 1; i < 7; i++) {
            cheaderText += '\xa0';
          }

          const cname = column.name;
          columnMetadata.push({ headerText: cheaderText, name: cname, field: cname, headerStyle: "font-weight:bold;text-align:left;" });
        }

        return columnMetadata;
      }

      function getColumnMetadata(perspectiveId, displayedColumns, hiddenColumns) {
        let columnMetadata = [];

        // Add table column containing delete icon as the first column
        if (["configuration","modeling"].indexOf(perspectiveId) !== -1) {
          columnMetadata.push({ name: "_delete", field: "_delete", readonly: self.readonly, template: "deleteCellTemplate", sortable: "disabled" });
        }

        columnMetadata = appendTableColumnMetadata(displayedColumns, columnMetadata);

        self.hasHiddenColumns(typeof hiddenColumns !== "undefined");

        if (self.showHiddenColumns().length > 0) {
          // User put a check in the "Show hidden columns" checkbox
          columnMetadata = appendTableColumnMetadata(hiddenColumns, columnMetadata);
        }

        return columnMetadata;
      }

      function setRDJDataProvider(rdjData, perspectiveId, displayedColumns, hiddenColumns, columnMetadata) {
        function getColumnType(name) {
          let column = displayedColumns.find(column => column.name === name);
          return (typeof column !== "undefined" ? "displayed" : "hidden");
        }

        // Setup PDJ type information for display
        const pdjTypes1 = new PageDataTypes(displayedColumns, perspectiveId);
        const pdjTypes2 = new PageDataTypes(hiddenColumns, perspectiveId);

        let rows = [];

        for (var j in rdjData.data) {
          const row = rdjData.data[j];
          let rowObj = {}, displayValue;
          for (var r in row) {
            for (var s in columnMetadata) {
              const c = columnMetadata[s];
              if (c.name === r) {
                // Get the display value based on the type information
                switch (getColumnType(c.name)) {
                  case "displayed":
                    displayValue = pdjTypes1.getDisplayValue(r, row[r]);
                    break;
                  case "hidden":
                    displayValue = pdjTypes2.getDisplayValue(r, row[r]);
                    break;
                  default:
                    displayValue = null;
                    break;
                }
                if (displayValue !== null) rowObj[c.name] = displayValue;
              }
            }
          }

          if (CoreUtils.isNotUndefinedNorNull(row.identity)) {
            rowObj['_id'] = row.identity.value.resourceData;
            rowObj['_delete'] = { _id: rowObj['_id'], headerText: 'Delete', name: '_delete', field: '_delete', template: 'deleteCellTemplate', listener: self.deleteListener }
            rows.push(rowObj);
          }
        }

        const arrayDataProvider = new ArrayDataProvider(rows, { keyAttributes: '_id', implicitSort: [{ attribute: 'Name', direction: 'ascending' }] });
        const pagingDataProvider = new PagingDataProviderView(arrayDataProvider);

        self.rdjDataProvider(pagingDataProvider);
      }

      function renderPage() {
        const pdjData = viewParams.parentRouter.data.pdjData();
        const rdjData = viewParams.parentRouter.data.rdjData();

        // If the observable updates and no longer references a table
        // do nothing.. ${perspective.id}.js will route
        if (typeof pdjData.table === 'undefined') {
          return;
        }

        document.title = viewParams.parentRouter.data.pageTitle();

        const columnMetadata = getColumnMetadata(self.perspective.id, pdjData.table.displayedColumns, pdjData.table.hiddenColumns);
        self.columnDataProvider(columnMetadata);

        setRDJDataProvider(rdjData, self.perspective.id, pdjData.table.displayedColumns, pdjData.table.hiddenColumns, columnMetadata);

        const bindHtml = (typeof pdjData.introductionHTML !== 'undefined' ? pdjData.introductionHTML : "<p>");
        self.introductionHTML({ view: HtmlUtils.stringToNodeArray(bindHtml), data: self });

        let pdjActions;

        if (typeof pdjData.table.actions !== "undefined") pdjActions = pdjData.table.actions;
        self.pageDefinitionActions = new PageDefinitionActions(pdjActions, rdjData);

        self.actionsDialog.formLayout.html({ view: HtmlUtils.stringToNodeArray("<p>"), data: self });

        createHelp(pdjData, self.perspective.id);
      }

      function createHelp(pdjData, perspectiveId) {
        if (typeof pdjData === "undefined") {
          return;
        }

        let pdjTypes, helpData = [];

        const helpForm = new HelpForm(viewParams),
          column1 = helpForm.i18n.tables.help.columns.header.name,
          column2 = helpForm.i18n.tables.help.columns.header.description;

        self.tableHelpColumns(helpForm.tableHelpColumns);

        if (typeof pdjData.table.displayedColumns !== "undefined") {
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

        if (self.showHiddenColumns().length > 0) {
          if (typeof pdjData.table.hiddenColumns !== "undefined") {
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
        }

        self.helpDataSource(helpData);

        if (typeof pdjData.helpTopics !== "undefined") {
          const div = document.createElement("div");
          div.setAttribute("id", "cfe-help-footer");
          const title = document.createElement("p");
          title.innerHTML = "<b>Related Topics:</b>";
          div.append(title);
          const list = document.createElement("ul");
          div.append(list);

          for (const j in pdjData.helpTopics) {
            const topic = pdjData.helpTopics[j];
            const listElement = document.createElement("li");
            const ref = document.createElement("a");
            ref.setAttribute("href", topic.href);
            ref.setAttribute("target", "_blank");
            ref.setAttribute("rel", "noopener");
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