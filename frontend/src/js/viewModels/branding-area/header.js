/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', '../../core/runtime', '../../microservices/preferences/preferences', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojmodule'],
  function(oj, ko, ModuleElementUtils, Runtime, Preferences) {
    function HeaderTemplate(viewParams){
      var self = this;

      this.i18n = {
        header: {
          app: {
            version: { value: Runtime.getProperty(Runtime.PropertyName.CFE_VERSION) }
          },
          keyPairs: {
            domain: {
              version: {label: "", value: ko.observable()},
              url: {label: "", value: ko.observable()}
            },
            connectedTo: {
              label: oj.Translations.getTranslatedString("wrc-header.keyPairs.connected.label"),
              value: ko.observable()
            },
            welcome: {
              label: oj.Translations.getTranslatedString("wrc-header.keyPairs.welcome.label", ""),
              value: ko.observable()
            },
            notConnected: {
              label: oj.Translations.getTranslatedString("wrc-header.keyPairs.disconnected.label"),
              value: ""
            },
            connectionType: {
              iconFile: ko.observable("connection-nonsecure-blk_24x24"),
              tooltip: ko.observable("")
            }
          },
          icons: {
            separator: {iconFile: "separator-vertical_10x24"},
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
            },
            connectionType: {
              nonsecure: {iconFile: "connection-nonsecure-blk_24x24",
                tooltip: oj.Translations.getTranslatedString("wrc-header.icons.connectionType.nonsecure.tooltip")
              },
              secure: {iconFile: "connection-secure-blk_24x24",
                tooltip: oj.Translations.getTranslatedString("wrc-header.icons.connectionType.secure.tooltip")
              }
            }
          },
          buttons: {
            connect: {image: "domain-connect2-icon-blk_24x24", disabled: false,
              label: oj.Translations.getTranslatedString("wrc-header.buttons.connect.label")
            },
            disconnect: {image: "domain-disconnect2-icon-blk_24x24", disabled: false,
              label: oj.Translations.getTranslatedString("wrc-header.buttons.disconnect.label")
            }
          },
          menus: {
            domain: {
              "url": {
                id: "domain-url", iconFile: "", disabled: false, visible: ko.observable(true),
                label: oj.Translations.getTranslatedString("wrc-header.menus.domain.url.label"),
                value: ko.observable("")
              },
              "version": {
                id: "domain-version", iconFile: "", disabled: false, visible: ko.observable(true),
                label: oj.Translations.getTranslatedString("wrc-header.menus.domain.version.label"),
                value: ko.observable("")
              }
            }
          },
        }
      };

      // Initialize instance-scope variables used in header.html
      this.appInfoTitleClass = (viewParams.smScreen ? "branding-area-title-sm" : "branding-area-title-md");
      this.appName = oj.Translations.getTranslatedString("wrc-header.text.appName");
      this.domainsConnectState = ko.observable();

      this.domainConnectionModuleConfig = ModuleElementUtils.createConfig({
        name: "branding-area/domain-connection",
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          onDomainConnectStateChanged: changedDomainConnectState
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

      this.connected = function () {
        setThemePreference(Preferences.general.themePreference());
      };

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

      /**
       * Called when user clicks the domain value field, to
       * launch the domainMenu
       * @param event
       */
      this.launchDomainMenu = function(event) {
        event.preventDefault();
        document.getElementById('domainMenu').open(event);
      };

      /**
       * Called when user clicks the "Connect" or "Disconnect" icon
       * in the branding area
       * @param event
       */
      this.domainConnectButtonClickHandler = function(event) {
        viewParams.signaling.domainConnectionInitiated.dispatch();
      };

      function changedDomainConnectState() {
        self.domainsConnectState(Runtime.getDomainConnectState());
        setDomainConnectState();
      }

      function setDomainConnectState() {
        if (self.domainsConnectState() === "DISCONNECTED") {
          const ele = document.getElementById("domains-connected-to-label");
          if (ele !== null) ele.innerHTML = self.i18n.header.keyPairs.notConnected.label;
        }
      }

      function setConnectionDomainInfo(domainInfo) {
        // Set connection type icon and tooltip based on scheme of domainInfo.url.
        if ((typeof domainInfo.url === 'undefined') || !domainInfo.url.toLowerCase().startsWith('https')) {
          self.i18n.header.keyPairs.connectionType.iconFile(self.i18n.header.icons.connectionType.nonsecure.iconFile);
          self.i18n.header.keyPairs.connectionType.tooltip(self.i18n.header.icons.connectionType.nonsecure.tooltip);
        }
        else {
          self.i18n.header.keyPairs.connectionType.iconFile(self.i18n.header.icons.connectionType.secure.iconFile);
          self.i18n.header.keyPairs.connectionType.tooltip(self.i18n.header.icons.connectionType.secure.tooltip);
        }

        self.i18n.header.menus.domain.version.value(domainInfo.version);
        self.i18n.header.menus.domain.url.value(domainInfo.url);

        self.i18n.header.keyPairs.connectedTo.value(domainInfo.name);
        if (domainInfo.name === "") {
          const ele = document.getElementById("connected-to-label");
          if (ele !== null) ele.innerHTML = "";
        }

        self.i18n.header.keyPairs.welcome.value(domainInfo.username);
        if (domainInfo.username === "") {
          const ele = document.getElementById("welcome-label");
          if (ele !== null) ele.innerHTML = "";
        }
      }

      function setDomainConsoleMode(newMode){
        let img;
        const canvas = document.getElementById("console-state-bar");
        if (canvas !== null) {
          canvas.setAttribute("title", newMode);
          const ctx = canvas.getContext("2d");
          switch(newMode){
            case "ONLINE":
              img = document.getElementById("online-icon");
              ctx.drawImage(img, 0, 0);
              break;
            case "OFFLINE":
              img = document.getElementById("offline-icon");
              ctx.drawImage(img, 0, 0);
              break;
            case "DETACHED":
              img = document.getElementById("detached-icon");
              ctx.drawImage(img, 0, 0);
              break;
          }
        }
      }

      viewParams.signaling.domainChanged.add((source, domainInfo) => {
        setConnectionDomainInfo(domainInfo);
      });

      viewParams.signaling.modeChanged.add((newMode) => {
        setDomainConsoleMode(newMode) ;
        self.domainsConnectState(Runtime.getDomainConnectState());
        if (newMode === "DETACHED") {
          setConnectionDomainInfo({name: "", username: ""});
        }
      });

      viewParams.signaling.themeChanged.add((newTheme) => {
        setThemePreference(newTheme);
      });

    }

    return HeaderTemplate;
  }
);