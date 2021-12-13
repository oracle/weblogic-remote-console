/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', 'wrc-frontend/microservices/perspective/perspective-memory-manager', 'wrc-frontend/core/runtime', 'wrc-frontend/microservices/change-management/change-manager', 'wrc-frontend/microservices/ataglance/ataglance-manager', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojmodule-element', 'ojs/ojknockout', 'ojs/ojnavigationlist'],
  function(oj, ko, ModuleElementUtils, PerspectiveMemoryManager, Runtime, ChangeManager, AtAGlanceManager, ViewModelUtils, CoreTypes, CoreUtils) {
    function ContentAreaAncillaryContent(viewParams){
      const self = this;

      this.i18n = {
        tabstrip: {
          tabs: [
            {id: "shoppingcart", iconFile: "shopping-cart-empty-tabstrip_24x24", disabled: false, visible: ko.observable(false), isDefault: false,
              label: oj.Translations.getTranslatedString("wrc-ancillary-content.tabstrip.tabs.shoppingcart.label")
            },
            {id: "dataproviders", iconFile: "project-management-tabstrip-icon_24x24", disabled: false, visible: ko.observable(true), isDefault: true,
              label: oj.Translations.getTranslatedString("wrc-ancillary-content.tabstrip.tabs.projectmanagement.label")
            },
            {id: "ataglance", iconFile: "ataglance-tabstrip-icon_24x24", disabled: true, visible: ko.observable(false), isDefault: false,
              label: oj.Translations.getTranslatedString("wrc-ancillary-content.tabstrip.tabs.ataglance.label")
            }
          ]
        },
        icons: {
          "ataglance": { iconFile: "ataglance-tabstrip-icon_24x24",
            tooltip: oj.Translations.getTranslatedString("wrc-ancillary-content.tabstrip.tabs.ataglance.label")
          },
          "shoppingcart": { iconFile: "shopping-cart-empty-tabstrip_24x24",
            tooltip: oj.Translations.getTranslatedString("wrc-ancillary-content.tabstrip.tabs.shoppingcart.label")
          },
          "projectmanagement": { iconFile: "project-management-tabstrip-icon_24x24",
            tooltip: oj.Translations.getTranslatedString("wrc-ancillary-content.tabstrip.tabs.projectmanagement.label")
          },
          "changecenter": { iconFile: "change-center-icon-blk_24x24",
            tooltip: oj.Translations.getTranslatedString("wrc-ancillary-content.icons.kiosk.tooltip")
          },
          "expand": { iconFile: "slideup-expand-blk_24x24",
            tooltip: oj.Translations.getTranslatedString("wrc-common.tooltips.expand.value")
          },
          "collapse": { iconFile: "slideup-collapse-blk_24x24",
            tooltip: oj.Translations.getTranslatedString("wrc-common.tooltips.collapse.value")
          }
        }
      };

      this.ancillaryContentAreaVisible = ko.observable(false);
      this.ancillaryContentAreaToggleVisible = ko.observable(true);

      this.tabModuleConfig = ko.observable({ view: [], viewModel: null });
      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory("ancillary");

      // Declare module-scoped variable for storing
      // bindings to "add" signal handlers.
      this.signalBindings = [];

      this.connected = function() {
        this.ancillaryContentAreaVisible.subscribe((newValue) => {
          toggleAncillaryContentArea(newValue);
        });

        // Be sure to create a binding for any signaling add in
        // this module. In fact, the code for the add needs to
        // be moved here physically.

        let binding = viewParams.signaling.ancillaryContentAreaToggled.add((source, visible) => {
          const currentlyVisible = self.ancillaryContentAreaToggleVisible();
          if (currentlyVisible !== visible) setAncillaryContentAreaVisibility(visible);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.tabStripTabSelected.add((source, tabId, visibility) => {
          showTabStripContent(tabId, visibility);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.navtreeToggled.add((source, visible) => {
          if (visible) setAncillaryContentAreaVisibility(!visible);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderSelected.add((dataProvider) => {
          const index = self.i18n.tabstrip.tabs.map(item => item.id).indexOf(ChangeManager.Entity.SHOPPING_CART.name);
          if (index !== -1) {
            self.i18n.tabstrip.tabs[index].visible(dataProvider.type !== "model");
          }
          if (dataProvider.type !== "model") {
            showTabStripContent("shoppingcart", false);
          }
        });

        self.signalBindings.push(binding);

        computeAncillaryContentAreaToggleVisible()
          .then((visible) => {
            self.ancillaryContentAreaToggleVisible(visible);
          });
      };

      this.disconnected = function () {
        // Dispose of change subscriptions on knockout observables.
        self.ancillaryContentAreaVisible.dispose();

        // Detach all signal "add" bindings
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];
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

        const changingTabModule = setTabModuleTabCachedState(id);
        if (changingTabModule) {
          setTabModuleConfig(id, self.perspectiveMemory.tabstrip.tab[id].cachedState);
        }
      };

      function setTabModuleTabCachedState(tabId) {
        let changingTabModule = true;
        const tabNode = self.i18n.tabstrip.tabs.find(item => item.id === tabId);
        if (self.tabModuleConfig().viewModel !== null) {
          const isSameTabNode = (self.tabModuleConfig().viewModel.tabNode && self.tabModuleConfig().viewModel.tabNode === tabNode.id);
          changingTabModule = (!tabNode.disabled && !isSameTabNode);
          changedTabModuleTabCachedState(self.tabModuleConfig().viewModel.tabNode, self.tabModuleConfig().viewModel.getCachedState());
        }
        return changingTabModule
      }

      function setTabModuleConfig(value, cachedState) {
        var viewPath = 'views/content-area/' + (value === "dataproviders" ? '' : 'ancillary/') + value + '.html';
        var modelPath = 'viewModels/content-area/' + (value === "dataproviders" ? '' : 'ancillary/') + value;
        ModuleElementUtils.createConfig({
          viewPath: viewPath,
          viewModelPath: modelPath,
          params: {
            parentRouter: viewParams.parentRouter,
            signaling: viewParams.signaling,
            cachedState: cachedState,
            onCachedStateChanged: changedTabModuleTabCachedState,
            onTabStripContentChanged: changedTabStripContent,
            onTabStripContentVisible: setAncillaryContentAreaVisibility,
            onTabStripContentHidden: getSlideUpVisibility
          }
        })
        .then( function(moduleConfig) {
          self.tabModuleConfig(moduleConfig);
        });
      }

      function changedTabModuleTabCachedState(tabId, cachedState) {
        const index = self.i18n.tabstrip.tabs.map(tab => tab.id).indexOf(tabId);
        if (index !== -1) {
          self.perspectiveMemory.tabstrip.tab[self.i18n.tabstrip.tabs[index].id] = {cachedState: cachedState};
        }
      }

      function getDefaultTabNode(){
        let tabNode = self.i18n.tabstrip.tabs.find(item => item.isDefault);
        if (tabNode.disabled) {
          tabNode["isDefault"] = false;
          tabNode = self.i18n.tabstrip.tabs.find(item => !item.disabled);
          if (CoreUtils.isNotUndefinedNorNull(tabNode)) tabNode["isDefault"] = true;
        }
        return tabNode;
      }

      function getSlideUpVisibility() {
        let visible = self.ancillaryContentAreaToggleVisible();
        const ele = document.getElementById("slideup-header");
        if (ele !== null) {
          const toggleState = ele.getAttribute("data-state");
          visible = (toggleState === "collapsed");
        }
        return visible;
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
                minHeight = parseInt(ViewModelUtils.getCustomCssProperty("slideup-popup-offset-top"), 10);
                ViewModelUtils.setCustomCssProperty("slideup-popup-calc-min-height", `${minHeight}px`);
                break;
              case "expanded":
                ele.setAttribute("data-state", "collapsed");
                minHeight = $(window).height() - parseInt(ViewModelUtils.getCustomCssProperty("slideup-popup-min-height"), 10);
                ViewModelUtils.setCustomCssProperty("slideup-popup-calc-min-height", `${minHeight}px`);
                break;
            }
          }
        }
      }

      this.ancillaryContentAreaToggleClick = function(event) {
        setAncillaryContentAreaVisibility(!self.ancillaryContentAreaVisible());
      };

      function setAncillaryContentAreaVisibility(stateFlag){
        self.ancillaryContentAreaVisible(stateFlag);
        showAncillaryAreaSlideUp();
      }

      function toggleAncillaryContentArea(visible){
        const ele = document.getElementById("ancillary-content-area");
        if (ele !== null) ele.style.display = (visible ? "inline-flex" : "none");
      }

      this.ancillaryContentAreaCloseClick = function(event) {
        const ele = document.getElementById("ancillary-content-area");
        if (ele !== null) ele.style.display = "none";
      };

      function changedTabStripContent(tabId, visibility){
        showTabStripContent(tabId, visibility);
      }

      /**
       *
       * @param {string} tabId
       * @param {boolean} visibility
       * @private
       */
      function showTabStripContent(tabId, visibility){
        computeAncillaryContentAreaToggleVisible()
          .then((visible) => {
            self.ancillaryContentAreaToggleVisible(visible);
            const tabNode = self.i18n.tabstrip.tabs.find(item => item.id === tabId);
            if (!tabNode.disabled && visibility) {
              setTabModuleTabCachedState(tabNode.id);
              setTabModuleConfig(tabNode.id, self.perspectiveMemory.tabstrip.tab[tabNode.id].cachedState);
            }
            else if (tabNode.id === "shoppingcart" && !visibility) {
              setTabModuleTabCachedState("dataproviders");
              setTabModuleConfig("dataproviders", self.perspectiveMemory.tabstrip.tab["dataproviders"].cachedState);
            }
            setAncillaryContentAreaVisibility(visibility);
          });
      }

      function computeAncillaryContentAreaToggleVisible() {
        return new Promise((resolve) => {
          ChangeManager.getLockState()
            .then((data) => {
              const tabNode = self.i18n.tabstrip.tabs.find(item => item.id === ChangeManager.Entity.SHOPPING_CART.name);
              tabNode.visible((data.changeManager.isLockOwner && data.changeManager.hasChanges));
              const tabNodes = self.i18n.tabstrip.tabs.filter(item => item.visible());
              return (tabNodes.length > 0);
            })
            .then(visible => {
              resolve(visible);
            })
            .catch(response => {
              resolve(false);
            });
        });
      }

    }

    return ContentAreaAncillaryContent;
  }
);
