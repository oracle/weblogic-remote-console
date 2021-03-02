/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(["knockout", "../../cfe/common/runtime", '../modules/tooltip-helper', "../../cfe/services/preferences/preferences", "ojs/ojlogger", "ojs/ojknockout"],
  function(ko, Runtime, TooltipHelper, Preferences, Logger) {
    function HeaderTemplate(viewParams){
      var self = this;

      this.i18n = {
        brandingArea: {
          keyPairs: {
            domain: {
              version: {label: "", value: ko.observable()},
              url: {label: "", value: ko.observable()}
            },
            connectedTo: {label: "Connection to:", value: ko.observable()},
            welcome: {label: "as", value: ko.observable()},
            notConnected: {label: "Not Connected", value: ""}
          },
          icons: {
            separator: {iconFile: "separator-vertical_10x24"},
            connectivity: {
              online: {iconFile: "console-state-bar-grn_13x30", tooltip: "ONLINE"},
              offline: {iconFile: "console-state-bar-red_13x30", tooltip: "OFFLINE"},
              limited: {iconFile: "console-state-bar-ylw_13x30", tooltip: "LIMITED"}
            },
            connectionType: {
              nonsecure: {iconFile: "connection-nonsecure-blk_24x24", tooltip: "Nonsecure"},
              secure: {iconFile: "connection-secure-blk_24x24", tooltip: "Secure"}
            }
          },
          buttons: {
            connect: {label: "Connect", image: "domain-connect2-icon-blk_24x24", disabled: false},
            disconnect: {label: "Disconnect", image: "domain-disconnect2-icon-blk_24x24", disabled: false}
          }
        }
      };

      // Initialize instance-scope variables used in header.html
      this.appInfoTitleClass = (viewParams.smScreen ? "branding-area-title-sm" : "branding-area-title-md");
      this.appName = Runtime.getName();
      this.domainsConnectState = ko.observable();

      // Begin with navtree being invisible and disabled
      this.navtreeVisible = ko.observable(false);
      this.navtreeDisabled = ko.observable(true);

      this.connected = function () {
        setThemePreference(Preferences.themePreference());

        const appInfoContainer = document.getElementById("app-info-container");
        if (appInfoContainer !== null) {
          new TooltipHelper(appInfoContainer);
        }

        this.navtreeVisible.subscribe((visible) => {
          signalPerspectiveSelected(visible);
        });
      };

      this.disconnected = function () {
        this.navtreeVisible.dispose();
      };

      this.navTreeToggleThemeIcon = function(state){
        const theme = Preferences.themePreference();
        if (state === "on") {
          return (theme === "light" ? "navigation-icon-toggle-on-blk_24x24" : "navigation-icon-toggle-on-blk_24x24");
        }
        else {
          return (theme === "light" ? "navigation-icon-toggle-off-blk_24x24" : "navigation-icon-toggle-off-blk_24x24");
        }
      };

      this.navtreeToggleClick = function(event) {
        event.preventDefault();
        setNavTreeVisibility(!self.navtreeVisible());
      };

      function setNavTreeVisibility(visible){
        if (!self.navtreeDisabled()) {
          self.navtreeVisible(visible);
          viewParams.signaling.navtreeToggled.dispatch(visible);
        }
      }

      function signalPerspectiveSelected(visible) {
        let ele = document.getElementById("navtree-container");
        if (ele !== null) {
          if (visible) {
            ele.style.display = "inline-flex";
            signalNavTreeResized(visible, ele.offsetLeft, ele.offsetWidth);
          }
          else {
            signalNavTreeResized(visible, ele.offsetLeft, ele.offsetWidth);
            ele.style.display = "none";
          }
          setNavTreeVisibility(visible);
        }
      }

      function signalNavTreeResized(visible, offsetLeft, offsetWidth){
        viewParams.onResized((visible ? "opener": "closer") , offsetLeft, offsetWidth);
      }

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
       * Called when user clicks the "Connect" or "Disconnect" icon
       * in the branding area
       * @param event
       */
      this.domainConnectButtonClickHandler = function(event) {
        viewParams.signaling.domainConnectionInitiated.dispatch();
      };

      function setDomainConnectState() {
        if (self.domainsConnectState() === "DISCONNECTED") {
          const ele = document.getElementById("domains-connected-to-label");
          if (ele !== null) ele.innerHTML = self.i18n.toolbar.labels.disconnected.value;
        }
      }

      function setConnectionDomainInfo(domainInfo) {
        // Set connection type icon and tooltip based on scheme of domainInfo.url.
        const ele = document.getElementById("connection-type-image");
        if (ele !== null) {
          if ((typeof domainInfo.url !== 'undefined') && !domainInfo.url.toLowerCase().startsWith('https')) {
            ele.src = '../../images/' + self.i18n.brandingArea.icons.connectionType.nonsecure.iconFile + '.png';
            ele.setAttribute("data-title", self.i18n.brandingArea.icons.connectionType.nonsecure.tooltip);
          }
          else {
            ele.src = '../../images/' + self.i18n.brandingArea.icons.connectionType.secure.iconFile +'.png';
            ele.setAttribute("data-title", self.i18n.brandingArea.icons.connectionType.secure.tooltip);
          }
        }

        self.i18n.brandingArea.keyPairs.domain.version.value(domainInfo.version);
        self.i18n.brandingArea.keyPairs.domain.url.value(domainInfo.url);

        self.i18n.brandingArea.keyPairs.connectedTo.value(domainInfo.name);
        if (domainInfo.name === "") {
          const ele = document.getElementById("connected-to-label");
          if (ele !== null) ele.innerHTML = "";
        }

        self.i18n.brandingArea.keyPairs.welcome.value(domainInfo.username);
        if (domainInfo.username === "") {
          const ele = document.getElementById("welcome-label");
          if (ele !== null) ele.innerHTML = "";
        }
      }

      function setDomainConsoleMode(newMode){
        let img;
        const canvas = document.getElementById("console-state-bar");
        if (canvas !== null) {
          canvas.setAttribute("data-title", newMode);
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
            case "LIMITED":
              img = document.getElementById("limited-icon");
              ctx.drawImage(img, 0, 0);
              break;
          }
        }
      }

      viewParams.signaling.domainChanged.add((source, domainInfo) => {
        setConnectionDomainInfo(domainInfo);
      });

      viewParams.signaling.modeChanged.add((newMode) => {
        self.domainsConnectState(Runtime.getDomainConnectState());
        setDomainConsoleMode(newMode);

        if (newMode === "OFFLINE") {
          setConnectionDomainInfo({name: "", username: ""});
          self.navtreeDisabled(true);
          if (self.navtreeVisible()) self.navtreeVisible(false);
        }
      });

      viewParams.signaling.perspectiveSelected.add((newPerspective, showNavTree) => {
        if (typeof showNavTree === "undefined") showNavTree = true;
        if (showNavTree) self.navtreeVisible(true);
        // Enable the toggle navtree visibility icon
        self.navtreeDisabled(false);
      });

      viewParams.signaling.ancillaryContentAreaToggled.add((visible) => {
        setNavTreeVisibility(!visible);
      });

      viewParams.signaling.navtreeLoaded.add((newPerspective) => {
        self.navtreeDisabled(false);
      });

      viewParams.signaling.themeChanged.add((newTheme) => {
        setThemePreference(newTheme);
      });

    }

    return HeaderTemplate;
  }
);