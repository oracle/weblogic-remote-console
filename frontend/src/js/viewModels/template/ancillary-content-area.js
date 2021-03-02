/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(["knockout", "ojs/ojmodule-element-utils", "../../cfe/common/types", "../../cfe/common/runtime", '../modules/change-manager', '../modules/ataglance-manager', "../modules/tooltip-helper", "ojs/ojlogger", "ojs/ojmodule-element", "ojs/ojknockout", "ojs/ojnavigationlist"],
  function(ko, ModuleElementUtils, Types, Runtime, ChangeManager, AtAGlanceManager, TooltipHelper, Logger) {
    function AncillaryContentAreaTemplate(viewParams){
      var self = this;

      this.i18n = {
        tabstrip: {
          tabs: [
            {id: "shoppingcart", label: "Shopping Cart", iconFile: "shopping-cart-empty-tabstrip_24x24", disabled: false, visible: true, isDefault: true},
            {id: "ataglance", label: "At-A-Glance", iconFile: "ataglance-tabstrip-icon_24x24", disabled: false, visible: true},
            {id: "notifications", label: "Notifications", iconFile: "notifications-tabstrip-icon_24x24", disabled: true, visible: false}
          ]
        },
        icons: {
          "changecenter": { iconFile: "change-center-icon-blk_24x24", tooltip: "Kiosk"},
          "expand": { iconFile: "slideup-expand-blk_24x24", tooltip: "Expand"},
          "collapse": { iconFile: "slideup-collapse-blk_24x24", tooltip: "Collapse"}
        }
      };

      this.ancillaryContentAreaVisible = ko.observable(false);
      this.ancillaryContentAreaToggleVisible = ko.observable(true);

      this.tabModuleConfig = ko.observable({ view: [], viewModel: null });

      this.connected = function() {
        this.ancillaryContentAreaVisible.subscribe((newValue) => {
          toggleAncillaryContentArea(newValue);
        });

        const ancillaryContentArea = document.getElementById("ancillary-content-area");
        if (ancillaryContentArea !== null) new TooltipHelper(ancillaryContentArea);

        computeAncillaryContentAreaToggleVisible()
        .then((visible) => {
          self.ancillaryContentAreaToggleVisible(visible);
        });
      }.bind(this);

      /**
       * Called when user clicks icon or label of sideways tabstrip item
       * @param event
       */
      this.tabstripButtonClickHandler = function(event) {
        let id;
        if (event.target.localName === "img") {
          id = event.target.nextElementSibling.id;
        }
        else if (event.target.id && event.target.id.length !== 0) {
          id = event.target.id;
        }
        else {
          return;
        }

        const tabNode = self.i18n.tabstrip.tabs.find(item => item.id === id);
        if (!tabNode.disabled) setTabModuleConfig(tabNode.id);
      }.bind(this);

      function setTabModuleConfig(value) {
        ModuleElementUtils.createConfig({
          name: "template/ancillary-content/" + value,
          params: {
            parentRouter: viewParams.parentRouter,
            signaling: viewParams.signaling,
            onTabStripContentChanged: changedTabStripContent,
            onTabStripContentHidden: setAncillaryContentAreaVisibility
          }
        })
        .then( function(moduleConfig) {
          self.tabModuleConfig(moduleConfig);
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
            if (!self.ancillaryContentAreaVisible()) toggleState = "expanded";
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
        if (Runtime.getDomainConnectState() === Types.Domain.ConnectState.DISCONNECTED.name) {
          // Veto the performance of the click event altogether
          event.preventDefault();
          // Return false as the function's return value
          return false;
        }
        setAncillaryContentAreaVisibility(!self.ancillaryContentAreaVisible());
      }.bind(this);

      function setAncillaryContentAreaVisibility(stateFlag){
        self.ancillaryContentAreaVisible(stateFlag);
        showAncillaryAreaSlideUp();
      }

      function toggleAncillaryContentArea(visible){
        const ele = document.getElementById("ancillary-content-area");
        if (ele !== null) {
          if (visible) {
            ele.style.display = "inline-flex";
            const tabNode = getDefaultTabNode();
            if (typeof tabNode !== "undefined" && !tabNode.disabled) {
              setTabModuleConfig(tabNode.id);
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
        if (Runtime.getDomainConnectState() !== Types.Domain.ConnectState.DISCONNECTED.name) {
          computeAncillaryContentAreaToggleVisible()
          .then((visible) => {
            self.ancillaryContentAreaToggleVisible(visible);
            const tabNode = self.i18n.tabstrip.tabs.find(item => item.id === tabId);
            if (!tabNode.disabled && visibility) setTabModuleConfig(tabNode.id);
            setAncillaryContentAreaVisibility(visibility);
          });
        }
      }

      viewParams.signaling.tabStripTabSelected.add((source, tabId, visibility) => {
        showTabStripContent(tabId, visibility);
      });

      viewParams.signaling.navtreeToggled.add((visible) => {
        if (visible) setAncillaryContentAreaVisibility(!visible);
      });

      viewParams.signaling.modeChanged.add((newMode) => {
        if (newMode === "OFFLINE") {
          setAncillaryContentAreaVisibility(false);
          self.ancillaryContentAreaToggleVisible(false);
        }
      });

      function computeAncillaryContentAreaToggleVisible() {
        return new Promise((resolve) => {
          ChangeManager.getLockState(viewParams.signaling.popupMessageSent)
          .then((data) => {
            const tabNode = self.i18n.tabstrip.tabs.find(item => item.id === ChangeManager.Entity.SHOPPING_CART.name);
            tabNode.visible = (data.changeManager.isLockOwner && data.changeManager.hasChanges);
            const tabNodes = self.i18n.tabstrip.tabs.filter(item => item.visible);
            return (tabNodes.length > 0 && data.changeManager.supportsChanges);
          })
          .then((visible) => {
            resolve(visible);
          });
        });
      }

    }

    return AncillaryContentAreaTemplate;
  }
);
