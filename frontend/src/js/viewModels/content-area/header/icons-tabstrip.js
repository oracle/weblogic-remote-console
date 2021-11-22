/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['knockout', 'ojs/ojmodule-element-utils', '../../../apis/message-displaying', '../../../core/runtime', '../../../microservices/change-management/change-manager', '../../../microservices/ataglance/ataglance-manager', '../../utils', '../../../core/types', 'ojs/ojmodule-element', 'ojs/ojknockout', 'ojs/ojnavigationlist'],
  function(ko, ModuleElementUtils, MessageDisplaying, Runtime, ChangeManager, AtAGlanceManager, ViewModelUtils, CoreTypes) {
    function AncillaryContentAreaIconsTabstrip(viewParams){
      // Declare reference to instance of the ViewModel
      // that JET creates/manages the lifecycle of. This
      // reference is needed (and used) inside closures.
      const self = this;

      // START: Declare instance variables used in the ViewModel's view
      this.i18n = {
        tabstrip: {
          tabs: [
            {id: "ataglance", label: "At-A-Glance Panel", iconFile: "ataglance-tabstrip-icon_24x24", disabled: false, visible: ko.observable(true)},
            {id: "shoppingcart", label: "Shopping Cart Viewer", iconFile: "shopping-cart-empty-tabstrip_24x24", disabled: false, visible: ko.observable(true), isDefault: true}
          ]
        },
        icons: {
          "ataglance": { iconFile: "ataglance-tabstrip-icon_24x24", tooltip: "At-A-Glance Panel"},
          "shoppingcart": { iconFile: "shopping-cart-empty-tabstrip_24x24", tooltip: "Shopping Cart Viewer"}
        },
        dialog1: {
          position: {
            at: {horizontal: ko.observable("start"), vertical: ko.observable("top")},
            offset: {y: ko.observable(50)}
          },
          icons: {
            "detach": {id: "undock", iconFile: "overlay-detach-icon-blk_24x24", tooltip: "Detach"},
            "reattach": {id: "dock", iconFile: "overlay-reattach-icon-blk_24x24", tooltip: "Re-attach"},
            "close": {id: "close", iconFile: "close-icon-blk_24x24", tooltip: "Close"}
          }
        }
      };

      this.tabOverlayVisible = ko.observable(false);
      this.ancillaryContentAreaToggleVisible = ko.observable(true);

      this.tabOverlayModuleConfig = ko.observable({ view: [], viewModel: null });
      // END: Declare instance variables used in the ViewModel's view

      this.signalBindings = [];

      this.connected = function() {
        // Subscribe to the change event for the tabOverlayVisible
        // instance variable, which is a knockout observable.
        this.tabOverlayVisible.subscribe((newValue) => {
          toggleTabOverlay(newValue);
        });

        computeAncillaryContentAreaToggleVisible()
        .then((visible) => {
          self.ancillaryContentAreaToggleVisible(visible);
        });

        let binding = viewParams.signaling.tabStripTabSelected.add((source, tabId, visibility) => {
          showTabStripContent(tabId, visibility);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.navtreeToggled.add((visible) => {
          if (visible) setAncillaryContentAreaVisibility(!visible);
        });

        self.signalBindings.push(binding);
/*
//MLW
        binding = viewParams.signaling.modeChanged.add((newMode) => {
          if (newMode === CoreTypes.Console.RuntimeMode.DETACHED.name) {
            setAncillaryContentAreaVisibility(false);
            self.ancillaryContentAreaToggleVisible(false);
          }
        });

        self.signalBindings.push(binding);
*/
      }.bind(this);

      this.disconnected = function () {
        // Detach all signal "add" bindings
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];
      }.bind(this);

      /**
       * Called when user clicks icon in icons-tabstrip.
       * <p>There are 3 things (and 3 associated icons) that then controls the overlay that appears, when you click the icon in the tabstrip:</p>
       * <ul>
       *   <li><b>Detach</b>&nbsp;&nbsp;&nbsp;Clicking this icon causes the overlay to detach from its fixed position beneath the icon tabstrip. It then becomes something you can resize vertically and horizontally, and move it around on the screen, while still remaining modal.</li>
       *   <li><b>Re-attach</b>&nbsp;&nbsp;&nbsp;Clicking this icon causes the overlay to re-attach to its fixed position beneath the icon tabstrip. You can resize it vertically, but not horizontally.</li>
       *   <li><b>Close</b>&nbsp;&nbsp;&nbsp;Clicking this icon makes the overlay disappear.</li>
       * </ul>
       * @param event
       */
      this.iconsTabstripTabClickHandler = function(event) {
        switch(event.target.id) {
          case "detach":
            break;
          case "reattach":
            break;
          case "close":
            break;
        }
      }.bind(this);

      function setTabOverlayModuleConfig(value) {
        var viewPath = 'views/content-area/ancillary/' + value + '.html';
        var modelPath = 'viewModels/content-area/ancillary/' + value;
        ModuleElementUtils.createConfig({
          viewPath: viewPath,
          viewModelPath: modelPath,
          params: {
            parentRouter: viewParams.parentRouter,
            signaling: viewParams.signaling,
            onTabStripContentChanged: changedTabStripContent,
            onTabStripContentVisible: setAncillaryContentAreaVisibility
          }
        })
          .then( function(moduleConfig) {
            self.tabOverlayModuleConfig(moduleConfig);
          });
      }

      function getDefaultTabNode(){
        return self.i18n.tabstrip.tabs.find(item => item.isDefault);
      }

      function showAncillaryAreaSlideUp() {
        if (self.ancillaryContentAreaToggleVisible()) {
          const ele = document.getElementById("slideup-header");
          if (ele !== null) {
            let minHeight;
            let toggleState = ele.getAttribute("data-state");
            if (!self.tabOverlayVisible()) toggleState = "expanded";
            switch (toggleState) {
              case "collapsed":
                ele.setAttribute("data-state", "expanded");
                minHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--slideup-popup-offset-top"), 10);
                document.documentElement.style.setProperty("--slideup-popup-calc-min-height", `${minHeight}px`);
                break;
              case "expanded":
                ele.setAttribute("data-state", "collapsed");
                minHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--slideup-popup-min-height"), 10);
                document.documentElement.style.setProperty("--slideup-popup-calc-min-height", `${minHeight}px`);
                break;
            }
          }
        }
      }

      this.ancillaryContentAreaToggleClick = function(event) {
        if (Runtime.getDomainConnectState() === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
          // Veto the performance of the click event altogether
          event.preventDefault();
          // Return false as the function's return value
          return false;
        }
        setAncillaryContentAreaVisibility(!self.tabOverlayVisible());
      }.bind(this);

      function setAncillaryContentAreaVisibility(stateFlag){
        self.tabOverlayVisible(stateFlag);
        showAncillaryAreaSlideUp();
      }

      function toggleTabOverlay(visible){
        const ele = document.getElementById("ancillary-content-area");
        if (ele !== null) {
          if (visible) {
            ele.style.display = "inline-flex";
            const tabNode = getDefaultTabNode();
            if (typeof tabNode !== "undefined" && !tabNode.disabled) {
              setTabOverlayModuleConfig(tabNode.id);
            }
          }
          else {
            ele.style.display = "none";
          }
        }
      }

      this.ancillaryContentAreaCloseClick = function(event) {
        const ele = document.getElementById("ancillary-content-area");
        if (ele !== null) ele.style.display = "none";
      }.bind(this);

      function changedTabStripContent(tabId, visibility){
        showTabStripContent(tabId, visibility);
      }

      function showTabStripContent(tabId, visibility){
        if (Runtime.getDomainConnectState() !== CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
          computeAncillaryContentAreaToggleVisible()
          .then((visible) => {
            self.ancillaryContentAreaToggleVisible(visible);
            const tabNode = self.i18n.tabstrip.tabs.find(item => item.id === tabId);
            if (!tabNode.disabled && visibility) setTabOverlayModuleConfig(tabNode.id);
            setAncillaryContentAreaVisibility(visibility);
          });
        }
      }

      function computeAncillaryContentAreaToggleVisible() {
        return new Promise((resolve) => {
          ChangeManager.getLockState()
          .then(data => {
            const tabNode = self.i18n.tabstrip.tabs.find(item => item.id === ChangeManager.Entity.SHOPPING_CART.name);
            tabNode.visible((data.changeManager.isLockOwner && data.changeManager.hasChanges));
            const tabNodes = self.i18n.tabstrip.tabs.filter(item => item.visible());
            return (tabNodes.length > 0 && data.changeManager.supportsChanges);
          })
          .then(visible => {
            resolve(visible);
          })
          .catch(response => {
            ViewModelUtils.failureResponseDefaultHandling(response);
          });
        });
      }

      this.tabstripTabOverlayClickHandler = function(event) {
      }.bind(this);

      function showTabstripTabOverlayDialog(id) {
        const ele = document.getElementById(`${id}_ancillaryContentAreaTabstripTab`);
        if (ele !== null) {
          let minHeight;
          let toggleState = ele.getAttribute("data-state");
          if (!self.tabOverlayVisible()) toggleState = "expanded";
          switch (toggleState) {
            case "collapsed":
              ele.setAttribute("data-state", "expanded");
              minHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--slideup-popup-offset-top"), 10);
              document.documentElement.style.setProperty("--slideup-popup-calc-min-height", `${minHeight}px`);
              break;
            case "expanded":
              ele.setAttribute("data-state", "collapsed");
              minHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--slideup-popup-min-height"), 10);
              document.documentElement.style.setProperty("--slideup-popup-calc-min-height", `${minHeight}px`);
              break;
          }
        }
      }

    }

    return AncillaryContentAreaIconsTabstrip;
  }
);
