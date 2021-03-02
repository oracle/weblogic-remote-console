/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['knockout', 'ojs/ojhtmlutils', "../../cfe/common/runtime", '../modules/change-manager', '../modules/tooltip-helper', '../../cfe/services/perspective/perspective-memory-manager', '../modules/pdj-messages', '../../cfe/common/utils', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojcheckboxset'],
  function (ko, HtmlUtils, Runtime, ChangeManager, TooltipHelper, PerspectiveMemoryManager, PageDefinitionMessages, Utils, Logger) {
    function TableToolbar(viewParams) {
      const self = this;

      // Need perspective declared here, because
      // expression in table.html refers to it
      this.perspective = viewParams.perspective;

      this.i18n = {
        buttons: {
          "new": { id: "new", label: "New", iconFile: "new-icon-blk_24x24", disabled: false },
          "clone": { id: "clone", label: "Clone", iconFile: "clone-icon-blk_24x24", disabled: true },
          "delete": { id: "delete", label: "Delete", iconFile: "delete-icon-blk_24x24", disabled: true }
        },
        icons: {
          "landing": { iconFile: "home-icon-blk_24x24", tooltip: "Landing Page"},
          "history": { iconFile: "beanpath-history-icon-blk_24x24", tooltip: "Toggle visibility of history"},
          "instructions": { iconFile: "toggle-instructions-on-blk_24x24", tooltip: "Toggle visibility of instructions"},
          "help": { iconFile: "toggle-help-on-blk_24x24", tooltip: "Toggle visibility of Help page"},
          "sync": { iconFile: "sync-off-icon-blk_24x24", tooltip: "Reload", tooltipOn: "Stop Auto-Reload"},
          "syncInterval": { iconFile: "sync-interval-icon-blk_24x24", tooltip: "Set Auto-Reload Interval"},
          "shoppingcart": { iconFile: "commit-to-cart-icon_24x24", tooltip: "Click to view actions for cart"}
        },
        menus: {
          shoppingcart: {
            "view": { id: "view", label: "View Changes", iconFile: "", disabled: false, visible: ko.observable(true) },
            "discard": { id: "discard", label: "Discard Changes", iconFile: "discard-changes-blk_24x24", disabled: false, visible: ko.observable(true)},
            "commit": { id: "commit", label: "Commit Changes", iconFile: "commit-changes-blk_24x24", disabled: false, visible: ko.observable(true)}
          }
        },
        "instructions": {
          "selectItems": {value: "Select items you want to perform {0} operation on."}
        },
        "messages": {
          "action": {
            "cannotPerform": {
              summary: "Message",
              detail: "Cannot perform {0} action while auto-reload is running! Please click the 'Reload' icon to stop it, first."
            }
          }
        }
      };

      this.showHelp = ko.observable(false);

      // This instance-scope variable is used to determine which
      // sync-<state>-icon-blk_24x24.png is assigned to the
      // <img id="sync-icon">
      this.autoSyncEnabled = ko.observable(false);

      // Need initial values because table-toolbar.html has binding
      // expressions that reference changeManager
      this.changeManager = ko.observable({isLockOwner: false, hasChanges: false, supportsChanges: false});

      // This instance-scope variable is used to remember and
      // recall the value of the auto-sync interval
      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(self.perspective.id);
      this.showInstructions = ko.observable(true);
      this.showBeanPathHistory = ko.observable(this.perspectiveMemory.beanPathHistory.visibility);

      // This instance-scope variable is used to hold the
      // HTML for dynamic toolbar buttons
      this.actionButtons = {html: ko.observable({}), buttons: []};

      this.signalBindings=[];
      this.readonly = ko.observable(Runtime.isReadOnly());

      // autoSyncCancelled is for stopping auto-sync when the user presses the
      // "Disconnect" icon in the toolbar icon of domain.js, or
      // the CFE notices that the CBE process is stopped.
      this.disconnected = function () {
        viewParams.signaling.autoSyncCancelled.remove(autoSyncCancelledCallback);
        
        self.signalBindings.forEach(function (binding) {
          binding.detach();
        });
        self.signalBindings = [];
      };

      this.connected = function () {
        self.signalBindings.push(viewParams.signaling.readonlyChanged.add((newRO) => {
          self.readonly(newRO);
          self.i18n.menus.shoppingcart.discard.visible(!newRO);
          self.i18n.menus.shoppingcart.commit.visible(!newRO);
          updateActionButtonsState(newRO);
        }));

        // Get auto-sync interval from perspectiveMemory
        const syncInterval = self.perspectiveMemory.contentPage.syncInterval;
        if (syncInterval !== null) {
          const ele = document.getElementById("sync-icon");
          if (ele !== null) ele.setAttribute("data-interval", syncInterval);
        }

        viewParams.signaling.autoSyncCancelled.add(autoSyncCancelledCallback);

        // The establishment of this subscription will happen
        // BEFORE the Promise for ChangeManager.getLockState()
        // is resolved! The update of self.changeManager()
        // inside the Promise.then() block, will subsequently
        // trigger this subscription
        this.changeManager.subscribe((newValue) => {
          shoppingCartContentsChanged(newValue);
        });

        const tableToolbarContainer = document.getElementById("table-toolbar-container");
        if (tableToolbarContainer !== null) {
          new TooltipHelper(tableToolbarContainer);
          // Get value of changeManager properties asynchronously
          ChangeManager.getLockState(viewParams.signaling.popupMessageSent)
          .then((data) => {
            self.changeManager(data.changeManager);
          });
        }

        self.renderToolbarButtons();
        self.showBeanPathHistory(self.perspectiveMemory.beanPathHistory.visibility);
        self.showInstructions(self.perspectiveMemory.instructions.visibility);
        viewParams.onConnected(self.perspectiveMemory.beanPathHistory.visibility);
      };

      this.launchShoppingCartMenu = function(event) {
        event.preventDefault();
        document.getElementById('shoppingCartMenu').open(event);
      };

      this.shoppingCartMenuClickListener = function (event) {

        if (event.target.value === "view") {
          viewParams.signaling.tabStripTabSelected.dispatch("table-toolbar", ChangeManager.Entity.SHOPPING_CART.name, true);
        }
        else {
          switch (event.target.value){
            case "commit":
              ChangeManager.commitChanges(viewParams.signaling.popupMessageSent)
              .then((changeManager) => {
                self.changeManager(changeManager);
                viewParams.signaling.tabStripTabSelected.dispatch("table-toolbar", ChangeManager.Entity.SHOPPING_CART.name, false);
              });
              break;
            case "discard":
              ChangeManager.discardChanges(viewParams.signaling.popupMessageSent)
              .then((changeManager) => {
                self.changeManager(changeManager);
                viewParams.signaling.tabStripTabSelected.dispatch("table-toolbar", ChangeManager.Entity.SHOPPING_CART.name, false);
                viewParams.onShoppingCartDiscarded();
              });
              break;
          }
        }

      }.bind(this);

      function shoppingCartContentsChanged(changeManager) {
        let ele = document.getElementById("shoppingCartImage");
        if (ele !== null) {
          ele.src = "../../images/shopping-cart-" + (changeManager.isLockOwner && changeManager.hasChanges ? "non-empty" : "empty") + "-tabstrip_24x24.png";
        }
      }

      // can this move to connect function?
      viewParams.signaling.shoppingCartModified.add((source, eventType, changeManager) => {
        // For refresh event, issue a request to check then set the current state
        if (eventType === "refresh") {
          ChangeManager.getLockState(viewParams.signaling.popupMessageSent)
          .then((data) => {
            self.changeManager(data.changeManager);
          });
          return;
        }

        // Handle the event based on the supplied changeManager
        changeManager.supportsChanges = self.changeManager().supportsChanges;
        if (!Utils.isEquivalent(self.changeManager(), changeManager)) {
          ChangeManager.putMostRecent(changeManager);
          self.changeManager(changeManager);
          if (eventType === "discard") viewParams.onShoppingCartDiscarded();
        }
      });

      this.renderToolbarButtons = function () {
        const pageDefinitionActions = viewParams.pageDefinitionActions();
        const results = pageDefinitionActions.createActionsButtons();
        Logger.log(results.html.innerHTML);
        self.actionButtons.html({ view: HtmlUtils.stringToNodeArray(results.html.innerHTML), data: self });
        self.actionButtons.buttons = results.buttons;
        updateActionButtonsState(self.readonly());
      }.bind(this);

      function updateActionButtonsState(isReadOnly) {
        const pageDefinitionActions = viewParams.pageDefinitionActions();
        if (isReadOnly) {
          self.actionButtons.buttons = pageDefinitionActions.disableAllActionsButtons(self.actionButtons.buttons);
        }
        else {
          self.actionButtons.buttons = pageDefinitionActions.populateActionsButtonsStates(self.actionButtons.buttons);
        }
      }

      this.toggleHistoryClick = function (event) {
        // Call function in table.js assigned to the
        // onBeanPathHistoryToggled field in viewParams
        self.showBeanPathHistory(viewParams.onBeanPathHistoryToggled(!self.showBeanPathHistory()));
      };

      this.landingPageClick = function (event) {
        viewParams.onLandingPageSelected();
      };

      this.toggleInstructionsClick = function (event) {
        const instructionsVisible = !self.showInstructions();
        self.showInstructions(instructionsVisible);
        viewParams.onInstructionsToggled(instructionsVisible, self.showBeanPathHistory());
      };

      this.helpPageClick = function (event) {
        const helpVisible = !self.showHelp();
        self.showHelp(helpVisible);
        viewParams.onHelpPageToggled(helpVisible, self.showBeanPathHistory());
      };

      this.syncClick = function (event) {
        const autoSyncEnabled = self.autoSyncEnabled();
        let syncInterval = parseInt(event.target.attributes['data-interval'].value);
        if (syncInterval === 0) {
          // Just reload and ensure the sync state is not running.
          if (autoSyncEnabled) {
            self.autoSyncEnabled(false);
            updateActionButtonsState();
          }
        }
        else {
          // Toggle the sync state and no interval when currently enabled
          self.autoSyncEnabled(!autoSyncEnabled);
          if (autoSyncEnabled) syncInterval = 0;
        }
        setAutoSyncIcon();
        viewParams.onSyncClicked(syncInterval);
      };

      this.syncIntervalClick = function (event) {
        // Get <img id="sync-icon"> DOM element
        const ele = document.getElementById("sync-icon");
        // Get numeric representation of "data-interval"
        // attribute of DOM element.
        const currentValue = parseInt(ele.getAttribute("data-interval"));
        // Call function defined in table.js that returns a Promise, passing
        // in the numeric representation of current sync interval.
        viewParams.onSyncIntervalClicked(currentValue)
          .then((result) => {
            self.perspectiveMemory.contentPage.syncInterval = result.interval;
            // Update attributes of <img id="sync-icon"> DOM element
            ele.setAttribute("data-interval", result.interval);
            let syncInterval = parseInt(result.interval);
            if (syncInterval > 0) {
              self.autoSyncEnabled(true);
            }
            else {
              self.autoSyncEnabled(false);
            }
            setAutoSyncIcon();
          })
          .catch((cancel) => {
            // Change of the interval value was cancelled
            setAutoSyncIcon();
          });
      };

      function setAutoSyncIcon() {
        // Change tooltip to let end user know the state
        let syncIconElement = document.getElementById("sync-icon");
        if ((typeof syncIconElement !== "undefined") && (syncIconElement !== null))
          syncIconElement.setAttribute("data-title", (self.autoSyncEnabled() ? self.i18n.icons.sync.tooltipOn : self.i18n.icons.sync.tooltip));
      }

      this.cancelAutoSync = function () {
        self.autoSyncEnabled(false);
        setAutoSyncIcon();
      }.bind(this);

      function autoSyncCancelledCallback(source, newSyncInterval) {
        if (self.autoSyncEnabled()) {
          viewParams.onSyncClicked(0);
        }
        self.autoSyncEnabled(false);
      }

      // Neither this or the viewParams.deleteAction()
      // function will ever be called, because there is
      // no "Delete" button in the table-toolbar
      this.deleteAction = function (event) {
        viewParams.deleteAction(event);
      };

      this.newAction = function (event) {
        viewParams.newAction(event);
      };

      this.actionsDialogButtonClicked = function (result) {
        Logger.info(`[TABLE] okBtn was clicked, or ENTER key was pressed!`);
      };

      this.actionButtonClicked = function (event) {
        const dialogParams = {
          action: event.currentTarget.attributes['data-action'].value,
          title: event.currentTarget.innerText,
          instructions: self.i18n.instructions.selectItems.value.replace("{0}", event.currentTarget.id),
          label: event.currentTarget.id,
          isReadOnly: self.readonly()
        };

        viewParams.signaling.tabStripTabSelected.dispatch("table-toolbar", "shoppingcart", false);

        if (self.autoSyncEnabled()) {
          viewParams.signaling.popupMessageSent.dispatch({
            severity: 'warning',
            summary: self.i18n.messages.action.cannotPerform.summary,
            detail:  self.i18n.messages.action.cannotPerform.detail.replace("{0}", dialogParams.label)
          });
          return false;
        }

        viewParams.onActionButtonClicked(dialogParams)
        .then((result) => {
          const pageDefinitionActions = viewParams.pageDefinitionActions();
          pageDefinitionActions.performActionOnChosenItems(result.chosenItems, result.urls)
          .then((actionUrl) => {
            Logger.info(`[TABLETOOLBAR] actionUrl=${actionUrl}`);
            if (self.actionButtons.buttons[dialogParams.action].asynchronous) {
              self.syncClick({target: {attributes: {"data-interval": {
                value: "10"
              }}}});
            }
          }).catch((response) => {
            if (response.status === 503) {
              // This 503 is most likely a java.net.SocketTimeoutException: Read timed out
              // between the CBE and WLS REST. Treat it as a recoverable error and
              // do a one-time syncClick() call to update the table.
              self.syncClick({target: {attributes: {"data-interval": {
                value: "0"
              }}}});
            }
            else {
              PageDefinitionMessages.displayResponseMessages(response.responseJSON.messages, viewParams.signaling.popupMessageSent);
            }
          });
        })
        .catch((error) => {
          Logger.error(error);
        });
      };

      this.launchActionMenu = function(event) {
        event.preventDefault();
        const menuId = event.target.id.replace("Launcher", "");
        document.getElementById(menuId).open(event);
      };

      this.actionMenuClickListener = function (event) {
        event.preventDefault();
        self.actionButtonClicked({currentTarget: {id:  event.target.id, innerText: event.target.innerText, attributes: event.target.attributes}});
      };
    }

    return TableToolbar;
  }
);