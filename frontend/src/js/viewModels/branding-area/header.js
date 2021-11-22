/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', '../../core/runtime', '../../microservices/preferences/preferences', '../../core/types', '../../core/utils', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojmodule', 'ojs/ojradioset'],
  function(oj, ko, ModuleElementUtils, Runtime, Preferences, CoreTypes) {
    function HeaderTemplate(viewParams){
      var self = this;

      this.i18n = {
        header: {
          app: {
            version: { value: Runtime.getProperty(Runtime.PropertyName.CFE_VERSION) }
          },
          icons: {
            wrcApp: {iconFile: "wrc-app-icon-color_88x78"},
            connectivity: {
              online: {iconFile: "console-state-bar-grn_13x30",
                tooltip: oj.Translations.getTranslatedString("wrc-header.icons.connectivity.online.tooltip")
              },
              offline: {iconFile: "console-state-bar-ylw_13x30",
                tooltip: oj.Translations.getTranslatedString("wrc-header.icons.connectivity.offline.tooltip")
              },
              detached: {iconFile: "console-state-bar-red_13x30",
                tooltip: oj.Translations.getTranslatedString("wrc-header.icons.connectivity.detached.tooltip")
              }
            }
          }
        }
      };

      // Initialize instance-scope variables used in header.html
      this.appInfoTitleClass = (viewParams.smScreen ? "branding-area-title-sm" : "branding-area-title-md");
      this.appName = oj.Translations.getTranslatedString("wrc-header.text.appName");
      this.domainsConnectState = ko.observable();

      this.domainConnectionModuleConfig = ModuleElementUtils.createConfig({
        name: "branding-area/console-backend-connection",
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          onDataProvidersEmpty: viewParams.onDataProvidersEmpty
        }
      });

      this.navtreeTogglerModuleConfig = ModuleElementUtils.createConfig({
        name: "branding-area/navtree-toggler",
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          perspective: viewParams.perspective,
          onResized: viewParams.onResized
        }
      });

      this.signalBindings = [];

      this.connected = function () {
        setThemePreference(Preferences.general.themePreference());

        let binding = viewParams.signaling.modeChanged.add((newMode) => {
          setConsoleStateBar(newMode) ;
          self.domainsConnectState(Runtime.getDomainConnectState());
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            setConsoleStateBar(CoreTypes.Console.RuntimeMode.DETACHED.name);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.themeChanged.add((newTheme) => {
          setThemePreference(newTheme);
        });

        self.signalBindings.push(binding);
      }.bind(this);

      this.disconnected = function () {
        // Detach all signal "add" bindings
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];
      }.bind(this);

      function setThemePreference(theme) {
        let ele = document.querySelector("header");
        if (ele !== null) {
          ele.style.backgroundColor = Runtime.getConfig()["settings"]["themes"][theme][0];
          switch(theme){
            case "light":
              ele.style.color = "black";
              ele = document.getElementById("oracleLogo");
              if (ele !== null) ele.src = "../images/oracle-logo-red_109x16.png";
              break;
            case "dark":
              ele.style.color = "white";
              ele = document.getElementById("oracleLogo");
              if (ele !== null) ele.src = "../images/oracle-logo-wht_109x16.png";
              break;
          }
        }
      }

      this.wrcAppIconClick = (event) => {
        viewParams.signaling.showStartupTasksTriggered.dispatch("triggered");
      };

      function changedDomainConnectState() {
        self.domainsConnectState(Runtime.getDomainConnectState());
      }

      function setConsoleStateBar(newMode){
        let img;
        const canvas = document.getElementById("console-state-bar");
        if (canvas !== null) {
          canvas.setAttribute("title", newMode);
          const ctx = canvas.getContext("2d");
          switch(newMode){
            case CoreTypes.Console.RuntimeMode.ONLINE.name:
              img = document.getElementById("online-icon");
              ctx.drawImage(img, 0, 0);
              break;
            case CoreTypes.Console.RuntimeMode.OFFLINE.name:
              img = document.getElementById("offline-icon");
              ctx.drawImage(img, 0, 0);
              break;
            case CoreTypes.Console.RuntimeMode.DETACHED.name:
              img = document.getElementById("detached-icon");
              ctx.drawImage(img, 0, 0);
              break;
          }
        }
      }

    }

    return HeaderTemplate;
  }
);