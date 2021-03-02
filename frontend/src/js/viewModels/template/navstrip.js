/**
 * @license
 * Copyright (c) 2020, 2021, Oracle Corp and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojarraydataprovider', '../../cfe/common/runtime', "ojs/ojcontext", "../modules/tooltip-helper", "../../cfe/services/perspective/perspective-manager", "../../cfe/services/perspective/perspective", "../../cfe/services/preferences/preferences", "ojs/ojlogger", "ojs/ojknockout", "ojs/ojnavigationlist"],
  function(oj, ko, Router, ArrayDataProvider, Runtime, Context, TooltipHelper, PerspectiveManager, Perspective, Preferences, Logger){
    function NavStripTemplate(viewParams){
      var self = this;

      var builtIns = ko.observableArray();

      builtIns(loadBuiltInPerspectives(
        Preferences.themePreference(),
        Runtime.getDomainConnectState()
      ));

      setThemePreference(Preferences.themePreference());

      function loadBuiltInPerspectives(theme, connectState){
        let dataArray = PerspectiveManager.getByType(Perspective.prototype.Type.BUILT_IN.name);
        dataArray.forEach((perspective) => {
          if (connectState === "CONNECTED") {
            perspective["iconFile"] = perspective.iconFiles[theme];
          }
          else {
            perspective["iconFile"] = perspective.iconFiles["greyed"];
          }
        });
        return dataArray;
      }

      this.i18n = {
        icons: {
          "configuration": { iconFile: "configuration-icon-navstrip-blk_48x48", tooltip: "Configuration"},
          "monitoring": { iconFile: "monitoring-icon-navstrip-blk_48x48", tooltip: "Monitoring"}
        }
      };

      this.disconnected = function() {
        const navstripContainer = document.getElementById("navstrip-container");
        if (navstripContainer !== null) navstripContainer.removeEventListener("click", onNavigationListItemClick);
      };

      this.builtInsDataProvider = new ArrayDataProvider(
        builtIns, { keys: builtIns().map((value) => {
            return value.id;
          })
        });

      var addIns = PerspectiveManager.getByType(Perspective.prototype.Type.ADD_IN.name);

      this.addInsDataProvider = new ArrayDataProvider(
        addIns, { keys: addIns.map((value) => {
            return value.id;
          })
        });

      this.builtInsSelectedItem = ko.observable('');

      this.builtInsSelectedItemChanged = function(event) {
        if (event.detail.value !== '') {
          const newPerspective = builtIns().find(item => item.id === event.target.currentItem);
          // newPerspective can (and will) be undefined, if the user
          // clicks in the navstrip, but not on a navstrip icon
          if (typeof newPerspective !== "undefined") {
            // Signal that a new perspective was selected
            // from the builtIns navstrip
            viewParams.signaling.perspectiveSelected.dispatch(newPerspective);
            viewParams.signaling.perspectiveChanged.dispatch(newPerspective);

            // Unselect any selected addIns navstrip item
            self.addInsSelectedItem('');

            switch (viewParams.parentRouter.stateId()) {
              case "landing":
                viewParams.parentRouter.observableModuleConfig().params.ojRouter.parameters.perspectiveId(newPerspective.id);
                // Don't break, just fall through to case for "home" stateId
              case "home":
                viewParams.parentRouter.go("landing/" + newPerspective.id);
                break;
              default:
                if (viewParams.parentRouter.stateId() !== newPerspective.id) {
                  // Go to landing page for newPerspective.id
                  viewParams.parentRouter.go("landing/" + newPerspective.id);
                }
                break;
            }
          }
        }
      };

      function onNavigationListItemClick(event) {
        const connectState = Runtime.getDomainConnectState();
        if (connectState === "DISCONNECTED") {
          event.preventDefault();
          return false;
        }

        event = {
          detail: {value: event.target.parentNode.id},
          target: {currentItem: event.target.parentNode.id}
        };

        self.builtInsSelectedItemChanged(event);
      }

      this.builtInsBeforeSelectEventHandler = function(event) {
        const connectState = Runtime.getDomainConnectState();
        if (connectState === "DISCONNECTED") {
          event.preventDefault();
          return false;
        }
      };

      this.addInsSelectedItem = ko.observable('');

      this.addInsSelectedItemChanged = function(event) {
        event.preventDefault();
        if (event.detail.value !== '') {
          let newPerspective = addIns.find(item => item.id === event.target.currentItem);
          viewParams.signaling.perspectiveSelected.dispatch(newPerspective);
          self.builtInsSelectedItem('');
        }
      };

      viewParams.signaling.navtreeToggled.add((expanded) => {
        if (expanded) {
          clearBuiltInsSelection();
          clearAddInsSelection();
        }
      });

      viewParams.signaling.modeChanged.add((newMode) => {
        const theme = Preferences.themePreference();

        builtIns.valueWillMutate();
        builtIns().forEach(item => {
          item.iconFile = (newMode === "ONLINE" ? item.iconFiles[theme] : item.iconFiles["greyed"]);
        });
        builtIns.valueHasMutated();
/*
        addIns.valueWillMutate();
        addIns().forEach(item => {
          item.iconFile = (newMode === "ONLINE" ? item.iconFiles[theme] : item.iconFiles["greyed"]);
        });
        addIns.valueHasMutated();
*/
        if (newMode === "OFFLINE") {
          self.builtInsSelectedItem('');
        }
      });

      function clearBuiltInsSelection(){
        self.builtInsSelectedItem('');
      }

      function clearAddInsSelection(){
        self.addInsSelectedItem('');
      }

      viewParams.signaling.themeChanged.add((newTheme) => {
        setThemePreference(newTheme);
      });

      function setThemePreference(theme) {
        let ele = document.getElementById("navstrip-header");
        if (ele !== null) {
          ele.style.backgroundColor = Runtime.getConfig()["settings"]["themes"][theme][1];
          switch(theme){
            case "light":
              ele.style.color = "black";
              break;
            case "dark":
              ele.style.color = "white";
              break;
          }
        }
      }

      Context.getPageContext().getBusyContext().whenReady()
      .then(function () {
        const navstripContainer = document.getElementById("navstrip-container");
        if (navstripContainer !== null) navstripContainer.addEventListener("click", onNavigationListItemClick);
        setThemePreference(Preferences.themePreference());
        new TooltipHelper(navstripContainer);
      });

    }

    return NavStripTemplate;
  }
);