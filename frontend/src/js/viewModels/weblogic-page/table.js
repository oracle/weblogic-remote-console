/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['knockout', 'ojs/ojrouter', 'ojs/ojmodule-element-utils', 'ojs/ojarraydataprovider', 'ojs/ojpagingdataproviderview', 'ojs/ojhtmlutils', 'ojs/ojknockout-keyset', '../../cfe/common/runtime', '../../cfe/http/adapter', '../modules/pdj-types', '../modules/pdj-actions', '../modules/pdj-fields', '../modules/pdj-messages', '../../cfe/common/utils', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojbinddom', 'ojs/ojdialog', 'ojs/ojmodule-element', 'ojs/ojmodule', 'ojs/ojpagingcontrol', 'cfe-multi-select/loader'],
  function (ko, Router, ModuleElementUtils, ArrayDataProvider, PagingDataProviderView, HtmlUtils, keySet, Runtime, HttpAdapter, PageDataTypes, PageDefinitionActions, PageDefinitionFields, PageDefinitionMessages, Utils, Logger) {
    function TableViewModel(viewParams) {
      const self = this;

      this.i18n = {
        checkboxes: {
          "showHiddenColumns": {id: "show-hidden-columns", label: "Show hidden columns"}
        },
        dialogSync: {
          title: "Set Auto-Reload Interval",
          instructions: "How many seconds do you want for the auto-reloading interval?",
          fields: {
            interval: { label: "Auto-Reload Interval:", value: ko.observable('') }
          },
          buttons: {
            ok: { id: "dlgOkBtn1", label: "OK", disabled: false },
            cancel: { id: "dlgCancelBtn1", label: "Cancel", disabled: false }
          }
        },
        actionsDialog: {
          title: ko.observable(""),
          instructions: ko.observable(""),
          buttons: {
            ok: { id: "dlgOkBtn2", label: ko.observable(""), disabled: ko.observable(true) },
            cancel: { id: "dlgCancelBtn2", label: "Cancel", disabled: false }
          }
        }
      };

      // Need perspective declared here, because
      // expression in table.html refers to it.
      this.perspective = viewParams.perspective;

      this.columnDataProvider = ko.observable();
      this.rdjDataProvider = ko.observable();
      this.introductionHTML = ko.observable();
      this.selectedRows = new keySet.ObservableKeySet();
      this.rowsPerPage = ko.observable(10);

      this.readonly = ko.observable(Runtime.isReadOnly());

      this.signalBindings = [];

      this.tableToolbarModuleConfig = ModuleElementUtils.createConfig({
        name: "weblogic-page/table-toolbar",
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          perspective: viewParams.perspective,
          pageDefinitionActions: getPageDefinitionActions,
          deleteAction: deleteBean,
          newAction: newBean,
          onConnected: setFormMaxHeight,
          onLandingPageSelected: selectLandingPage,
          onBeanPathHistoryToggled: toggleBeanPathHistory,
          onInstructionsToggled: toggleInstructions,
          onHelpPageToggled: toggleHelpPage,
          onShoppingCartViewed: viewShoppingCart,
          onShoppingCartDiscarded: discardShoppingCart,
          onSyncClicked: setSyncInterval,
          onSyncIntervalClicked: showSetSyncInterval,
          onActionButtonClicked: renderActionsDialog
        }
      });

      this.syncTimerId = undefined;

      this.hasHiddenColumns = ko.observable(false);
      this.showHiddenColumns = ko.observableArray();

      this.showHelp = ko.observable(false);
      this.showInstructions = ko.observable(true);
      this.helpDataSource = ko.observableArray([]);
      this.helpDataProvider = new ArrayDataProvider(this.helpDataSource);
      this.helpFooterDom = ko.observable({});

      this.availableItems = [];
      this.chosenItems = [];
      this.pageDefinitionActions = undefined;
      this.actionsDialog = {formLayout: { html: ko.observable({}) }};
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
      };

      self.disconnected = function () {
        self.subscription.dispose();
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
        Logger.log(`[TABLE] reloadPageData() called!`);
        reloadRdjData();
        // Skip the render call as the RDJ reload will trigger observable subscription
        //renderPage();
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
                if (value <= 0)
                  syncInterval = "0";
                else
                  syncInterval = `${value}`;
              }
            }
            return syncInterval;
          }

          function okClickHandler() {
            const inputValue = self.i18n.dialogSync.fields.interval.value();
            const syncInterval = sanityCheckInput(inputValue);
            setSyncInterval(parseInt(syncInterval));
            resolve({ exitAction: self.i18n.dialogSync.buttons.ok.label, interval: syncInterval });
            dialogSync.close();
          }
          okBtn.addEventListener('click', okClickHandler);

          function cancelClickHandler() {
            reject({ exitAction: self.i18n.dialogSync.buttons.cancel.label, interval: currentValue });
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

      function showActionsDialog(dialogParams) {
        return new Promise(function (resolve, reject) {
          self.chosenItems = [];
          const okBtn = document.getElementById(self.i18n.actionsDialog.buttons.ok.id);
          const cancelBtn = document.getElementById(self.i18n.actionsDialog.buttons.cancel.id);
          const actionsDialog = document.getElementById("actionsDialog");

          self.i18n.actionsDialog.title(dialogParams.title);
          self.i18n.actionsDialog.instructions(dialogParams.instructions);
          self.i18n.actionsDialog.buttons.ok.label(dialogParams.label);
          self.i18n.actionsDialog.buttons.ok.disabled(true);

          function okClickHandler() {
            resolve({exitAction: self.i18n.actionsDialog.buttons.ok.label, chosenItems: self.chosenItems});
            actionsDialog.close();
          }
          okBtn.addEventListener('click', okClickHandler);

          function cancelClickHandler() {
            reject({exitAction: self.i18n.actionsDialog.buttons.cancel.label, chosenItems: self.chosenItems});
            actionsDialog.close();
          }
          cancelBtn.addEventListener('click', cancelClickHandler);

          function onKeyUp(event) {
            if (event.key === "Enter") {
              // Treat pressing the "Enter" key as clicking the "OK" button
              okClickHandler();
              // Suppress default handling of keyup event
              event.preventDefault();
              // Veto the keyup event
              return false;
            }
          }

          actionsDialog.addEventListener('ojClose', function (event) {
            okBtn.removeEventListener('click', okClickHandler);
            cancelBtn.removeEventListener('click', cancelClickHandler);
          });

          actionsDialog.open();
        });
      }

      function renderActionsDialog(dialogParams) {
        return new Promise(function (resolve, reject) {
          const data = self.pageDefinitionActions.createActionsDialog(dialogParams.action);
          data.field.setAttribute("on-chosen-items-changed", "[[chosenItemsChanged]]");
          data.field.setAttribute("readonly", dialogParams.isReadOnly);
          self.availableItems = data.availableItems;
          self.actionsDialog.formLayout.html({ view: HtmlUtils.stringToNodeArray(data.formLayout.outerHTML), data: self });
          showActionsDialog(dialogParams)
            .then((result) => {
              result["urls"] = data.urls;
              resolve(result);
            })
            .catch((cancel) => {
              Logger.log(`[TABLE] cancelBtn was clicked, or ESC key was pressed!`);
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

      function setFormMaxHeight(historyVisible){
        let newOffsetHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--table-container-offset-height"), 10);
        if (historyVisible) newOffsetHeight += 40;
        Logger.log(`[TABLE] max-height=calc(100vh - ${newOffsetHeight}px)`);
        document.documentElement.style.setProperty("--form-container-calc-max-height", `${newOffsetHeight}px`);
      }

      function toggleBeanPathHistory (historyVisible) {
        setFormMaxHeight(historyVisible);
        // Call function in perspective assigned to the
        // onBeanPathHistoryToggled field in viewParams.
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
        if (!helpVisible) renderPage();
      }

      function selectLandingPage() {
        viewParams.onLandingPageSelected();
      }

      // This will never be called, because there is no
      // "Delete" button in table-toolbar :-)
      function deleteBean(event) {
        Logger.log(event);
        Logger.log(viewParams.parentRouter);
      }

      function newBean(event) {
        var rdj;

        $.getJSON(viewParams.parentRouter.data.rdjUrl() + "?dataAction=new")
          .then(function (rdjData) {
            rdj = rdjData;
            Logger.log(rdj);
          })
          .then(
            function () {
              var pageDef = rdj.pageDefinition;

              var pdjUrl = Runtime.getBaseUrl() + "/" + self.perspective.id + "/pages/" + pageDef;

              $.getJSON(pdjUrl)
                .then(
                  function (pdjData) {
                    Logger.log(pdjData);

                    viewParams.parentRouter.data.pdjUrl(pdjUrl);
                    viewParams.parentRouter.data.pdjData(pdjData);
                    viewParams.parentRouter.data.rdjData(rdj);
                    viewParams.parentRouter.go("form");
                  })
            })

      }

      var deleting = false;

      this.selectedListener = function (event) {
        if (deleting)
          return;

        var id = null;

        if (event.type === 'selectedChanged') {
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
        $.getJSON(viewParams.parentRouter.data.rdjUrl())
          .then((rdjData) => {
            viewParams.parentRouter.data.rdjData(rdjData);
          }, (jqXHR, status, error) => {
            // failed to reload rdjData
            if (jqXHR.status === 404) {
              Logger.log("Table reload unable to find page data, goto landing page:" + jqXHR.responseText);

              // fix the navtree
              viewParams.signaling.navtreeUpdated.dispatch({
                isEdit: false,
                path: '/'
              });

              // goto the landing page
              viewParams.onLandingPageSelected();
            }
            else if (jqXHR.status === 503) {
              PageDefinitionMessages.displayResponseMessages(jqXHR.responseJSON.messages, viewParams.signaling.popupMessageSent);
            }
          });
      }

      this.deleteListener = function (event) {
        // Set module-scope variable for indicating that
        // we are in delete mode, to true
        deleting = true;

        const deleteUrl = Runtime.getBaseUrl() + "/" + self.perspective.id + "/data/" + event.srcElement.id;

        HttpAdapter.delete(deleteUrl, '{}')
          .then((response) => {
            let refreshCart = false;
            if (!response.ok) {
              refreshCart = true;
              response.json()
              .then((responseJSON) => {
                PageDefinitionMessages.displayResponseMessages(responseJSON.messages, viewParams.signaling.popupMessageSent);
              });
            }

            viewParams.signaling.shoppingCartModified.dispatch("table", "delete", { isLockOwner: true, hasChanges: true, supportsChanges: true }, event.srcElement.id);
            // refresh navtree
            let treeaction = {
              isEdit: false,
              path: decodeURIComponent(viewParams.parentRouter.data.rawPath())
            };
            if (typeof viewParams.parentRouter.data.breadcrumbs !== "undefined") {
              treeaction["breadcrumbs"] = viewParams.parentRouter.data.breadcrumbs();
            }

            // fix the navtree
            viewParams.signaling.navtreeUpdated.dispatch(treeaction);

            reloadRdjData();
            renderPage();
            self.tableToolbarModuleConfig
            .then((moduleConfig) => {
              moduleConfig.viewModel.changeManager({ isLockOwner: true, hasChanges: true, supportsChanges: true });

              // Signal a refresh to the cart when the delete reports an error as the removal might have been rolled back
              if (refreshCart) {
                viewParams.signaling.shoppingCartModified.dispatch("table", "refresh", undefined, event.srcElement.id);
              }
            });

            // signal that we're no longer deleting, so the
            // this.selectedListener function will execute
            deleting = false;
          });

        viewParams.signaling.tabStripTabSelected.dispatch("table", "shoppingcart", false);
      }.bind(this);

      function appendTableColumnMetadata(tableColumns, columnMetadata) {
        // Add the remaining table columns
        for (var i in tableColumns) {
          const column = tableColumns[i];
          // append some non-breaking spaces to the headertext so the sorting
          // arrows don't overlap.
          let cheaderText = column.label;

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
        if (perspectiveId === "configuration") columnMetadata.push({ name: "_delete", field: "_delete", template: "deleteCellTemplate", sortable: "disabled" });

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

          rowObj['_id'] = Utils.pathEncodedFromIdentity(row.identity);

          rowObj['_delete'] = { _id: rowObj['_id'], headerText: 'Delete', name: '_delete', field: '_delete', template: 'deleteCellTemplate' }
          rows.push(rowObj);
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

        if (typeof pdjData.table.displayedColumns !== "undefined") {
          pdjTypes = new PageDataTypes(pdjData.table.displayedColumns, perspectiveId);

          for (const i in pdjData.table.displayedColumns) {
            const name = pdjData.table.displayedColumns[i].name;
            const label = pdjTypes.getLabel(name);

            // Determine the help description for the property
            const fullHelp = pdjTypes.getFullHelp(name);
            const description = { view: HtmlUtils.stringToNodeArray(fullHelp) };

            helpData.push({ Name: label, Description: description });
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

              helpData.push({ Name: label, Description: description });
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
