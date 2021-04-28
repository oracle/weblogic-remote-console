/**
 * @license
 * Copyright (c) 2020, 2021, Oracle Corp and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojarraydataprovider', '../../core/runtime', "ojs/ojcontext", '../../microservices/perspective/perspective-manager', '../../microservices/perspective/perspective', '../../microservices/preferences/preferences', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojnavigationlist'],
  function(oj, ko, Router, ArrayDataProvider, Runtime, Context, PerspectiveManager, Perspective, Preferences, Logger){
    function NavStripTemplate(viewParams){
      var self = this;

      var builtIns = ko.observableArray();

      builtIns(loadBuiltInPerspectives(
        Preferences.general.themePreference(),
        Runtime.getDomainConnectState()
      ));

      setThemePreference(Preferences.general.themePreference());

      function loadBuiltInPerspectives(theme, connectState){
        let dataArray = PerspectiveManager.getByType(Perspective.prototype.Type.BUILT_IN.name);
        dataArray.forEach((perspective) => {
          if (connectState === "CONNECTED") {
            perspective["iconFile"] = perspective.iconFiles[theme];
          }
          else {
            perspective["iconFile"] = perspective.iconFiles["greyed"];
          }
          perspective["label"] = oj.Translations.getTranslatedString(`wrc-navstrip.icons.${perspective.id}.tooltip`);
        });
        return dataArray;
      }

      this.i18n = {
        icons: {
          "configuration": { iconFile: "navstrip-icon-readwrite-configuration-blk_48x48",
            tooltip: oj.Translations.getTranslatedString("wrc-navstrip.icons.configuration.tooltip")
          },
          "view": { iconFile: "navstrip-icon-readonly-configuration--blk_48x48",
            tooltip: oj.Translations.getTranslatedString("wrc-navstrip.icons.view.tooltip")
          },
          "monitoring": { iconFile: "navstrip-icon-monitoring-blk_48x48",
            tooltip: oj.Translations.getTranslatedString("wrc-navstrip.icons.monitoring.tooltip")
          }
        }
      };

      /**
       * Returns the NLS translated string for the tooltip of a navstrip item.
       * <p>It allows us to do two main things:
       * <ol>
       *   <li>Avoid putting oj.Translations.getTranlatedString() functions in the .html</li>
       *   <li>To restrict the use of the oj.Translations.getTranlatedString() function to the i18n object</li>
       * </ol>
       * @param {string} id
       * @returns {string}
       */
      this.getTooltip = function(id) {
        return self.i18n.icons[id].tooltip;
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
        const connectState = Runtime.getDomainConnectState();
        if (connectState === "DISCONNECTED") {
          event.preventDefault();
          return false;
        }
        else if (event.target.currentItem === "view") {
          const newPerspective = builtIns().find(item => item.id === event.target.currentItem);
          viewParams.signaling.perspectiveChanged.dispatch(newPerspective);
          event.preventDefault();
          return false;
        }

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
        else if (event.target.currentItem === "view") {
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
        const theme = Preferences.general.themePreference();

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
        if (newMode === "DETACHED") {
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
        setThemePreference(Preferences.general.themePreference());
      });

    }

    return NavStripTemplate;
  }
);