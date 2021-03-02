/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['knockout', "ojs/ojarraydataprovider", "ojs/ojknockout-keyset", "../../cfe/utils/keyset-utils", '../../cfe/common/types', '../../cfe/common/runtime', 'ojs/ojcontext', '../modules/tooltip-helper', 'ojs/ojlogger', '../../cfe/services/domain/domain-connection-manager', 'ojs/ojknockout', 'ojs/ojformlayout', 'ojs/ojlabel', 'ojs/ojlabelvalue', 'ojs/ojinputtext', 'ojs/ojcheckboxset', 'ojs/ojdialog', 'ojs/ojbutton'],
  function (ko, ArrayDataProvider, keySet, keySetUtils, Types, Runtime, Context, TooltipHelper, Logger, DomainConnectionManager) {
    function DomainsTemplate(viewParams) {
      const self = this;

      var currentMode = '';

      this.i18n = {
        toolbar : {
          labels: {
            connected: {value: "Connected to: "},
            connectedNonsecure :  { value: "Nonsecure connection to: "},
            disconnected: {value: "Not Connected"}
          },
          menu: {
            home: {id: "home", label: "Home", image: "home-icon-blk_24x24", disabled: false, visible: true},
            preferences: {id: "preferences", label: "Preferences", image: "preferences-icon-blk_24x24", disabled: false, visible: false}
          }
        },
        "labels": {
          runningAt: {value: "running at {0}"}
        },
        "messages": {
          "lostConnection": {
            summary: "Lost Connection",
            detail: "Lost connection to the remote console. Please close this web browser tab and restart the remote console."
          },
          "cannotConnect": {
            summary: "Connection Attempt Failed",
            detail: "Unable to connect to the WebLogic Domain {0}, please check that WebLogic is running."
          }
        },
        dialog1: {
          title: "Connect to WebLogic Domain",
          instructions: "Enter admin user credentials and URL for the WebLogic domain:",
          labels: {
            url: "URL:"
          },
          fields: {
            username: {id: "username", image: "connection-username-icon-grn_36x36", disabled: false, visible: true},
            password: {id: "password", image: "connection-password-icon-grn_36x36", disabled: false, visible: true},
            url: {id: "url", placeholder: ""}
          },
          buttons: {
            connect: {id: "connect", label: "Connect", image: "domain-connect2-icon-blk_24x24", disabled: false}
          }
        }
      };

      this.activeDomain = ko.observable();
      this.domainsConnectState = ko.observable();

      this.domainConnections = DomainConnectionManager.getAll();
      this.dataProvider = new ArrayDataProvider(this.domainConnections, { keyAttributes: 'id' });

      this.dialogEntry = {
        username: ko.observable(''),
        password: ko.observable(''),
        url: ko.observable('http://localhost:7001')
      };

      this.dialogText = { display: ko.observable('') };

      function checkDomainConnectionState() {
        DomainConnectionManager.getAboutInformation()
        .then((cbeVersion) => {
          // Get mode the CFE is running in
          const newMode = Runtime.getMode();
          if (currentMode !== newMode){
            Logger.info(`Setting currentMode to ${newMode}`);
            currentMode = newMode;
            if (newMode === "OFFLINE") {
              self.domainsConnectState(Runtime.getDomainConnectState());
              viewParams.signaling.popupMessageSent.dispatch({
                severity: "warning",
                summary: self.i18n.messages.lostConnection.summary,
                detail: self.i18n.messages.lostConnection.detail
              });
              setDomainConnectionCredentials("", "");
              viewParams.signaling.domainChanged.dispatch("domains", {username: ""});
              viewParams.signaling.modeChanged.dispatch(newMode);
              viewParams.signaling.autoSyncCancelled.dispatch("domains", "0");
            }
          }
        });
      }

      // Establish heartbeat with CBE using values returned from Runtime functions
      setInterval(checkDomainConnectionState, Runtime.getPollingMillis());

      function setDomainConnectionCredentials(username, password) {
        self.dialogEntry.username(username);
        self.dialogEntry.password(password);
      }

      function removeDomainConnection(){
        let backendMode = Runtime.getBackendMode();
        if (backendMode !== "credentials") {
          DomainConnectionManager.deleteConnection()
          .then((newMode) => {
            Logger.log(`Remove connection setting currentMode to ${newMode}`);
            currentMode = newMode;
          });
        }
      }

      function checkDomainConnection(){
        // DomainConnectionManager.getConnection() returns the connectivity state between
        // the CBE and WLS REST endpoint for a WebLogic domain
        DomainConnectionManager.getConnection()
        .then((newMode) => {
          Logger.log(`Check connection setting currentMode to ${newMode}`);
          currentMode = newMode;
          processNewMode(newMode);
        });
      }

      function makeDomainConnection() {
        // DomainConnectionManager.makeConnection() attempts the connection
        // at the specified WLS REST endpoint for a WebLogic domain
        // using the supplied credentials
        DomainConnectionManager.makeConnection(
          self.dialogEntry.username(),
          self.dialogEntry.password(),
          self.dialogEntry.url()
        )
          .then((result) => {
            Logger.log(`Make connection setting currentMode to ${result.newMode}`);
            currentMode = result.newMode;
            processNewMode(result.newMode, result.messageInfo);
          })
          .catch((error) => {
            self.dialogText.display(error.message);
            checkDisplayConnectionDialog(Runtime.getBackendMode());
          });
      }

      function processNewMode(newMode, messageInfo) {
        // The value that Runtime.getDomainConnectState() returns
        // is affected by the calls to connection endpoint, so we need
        // to update our self.domainsConnectState object with
        // the latest value because it is used in the test
        // attribute of <oj-bind-if> elements. We have to do
        // that first, or some of the DOM elements referenced
        // in later methods will be null.
        self.domainsConnectState(Runtime.getDomainConnectState());
        // The value that Runtime.getDomainVersion() returns
        // is affected by the calls to connection endpoint, so we need
        // to update our self.domainInfo object with the latest value.
        const domainInfo = {
          name: Runtime.getDomainName(),
          version: Runtime.getDomainVersion(),
          username: Runtime.getWebLogicUsername(),
          url: Runtime.getDomainUrl()
        };
        const backendMode = Runtime.getBackendMode();
        const url = domainInfo.url;
        let message;
        // Proceed based on the value of newMode.
        switch (newMode) {
          case "ONLINE":
            // Use updated self.domainInfo object to call
            // private activateDomain method.
            activateDomain(domainInfo);
            // Display any message supplied during connection
            if (typeof messageInfo !== 'undefined') {
              viewParams.signaling.popupMessageSent.dispatch({
                severity: 'info',
                summary: messageInfo.summary,
                detail: messageInfo.detail
              });
            }
          break;
          case "OFFLINE":
            deactivateDomain();
            if (backendMode === "credentials") {
              const message = self.i18n.messages.cannotConnect;
              if (typeof url !== "undefined") {
                const label = self.i18n.labels.runningAt.replace("{0}", url);
                message.detail = message.detail.replace("{0}", label);
              }
              else {
                message.detail = message.detail.replace("{0}", "");
              }
              viewParams.signaling.popupMessageSent.dispatch({
                severity: "warning",
                summary: message.summary,
                detail: message.detail
              });
            }
            checkDisplayConnectionDialog(backendMode);
            break;
        }
      }

      function activateDomain(domainInfo){
        // The change subscription on self.activeDomain() calls code
        // that updates the <span id="domain-variable"> DOM
        // element, so that's why you don't see that happening here.

        // Use updated self.domainInfo object to set self.activeDomain
        self.activeDomain(domainInfo);

        // !!IMPORTANT!!
        //
        // These have to be called in the order specified, or else
        // other signal listeners will not perform their "unlock
        // actions" correctly (or entirely).
        viewParams.signaling.domainChanged.dispatch("domains", domainInfo);
        viewParams.signaling.modeChanged.dispatch(Types.Console.RuntimeMode.ONLINE.name);
      }

      function deactivateDomain() {
        // !!IMPORTANT!!
        //
        // These have to be called in the order specified, or else
        // other signal listeners will not perform their "unlock
        // actions" correctly (or entirely).
        viewParams.signaling.domainChanged.dispatch("domains", {username: ""});
        viewParams.signaling.modeChanged.dispatch(Types.Console.RuntimeMode.OFFLINE.name);
      }

      this.activeDomain.subscribe(function (newDomainInfo) {
        Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN, newDomainInfo.name);
        Runtime.setProperty(Runtime.PropertyName.CBE_WLS_VERSION_ONLINE, newDomainInfo.version);

        setDomainsDomainVariable();
      });

      function setDomainsDomainVariable(){
        let ele = document.getElementById("domain-variable");
        if (ele !== null) {
          ele.innerHTML = Runtime.getDomainName();
          ele.setAttribute("data-title", Runtime.getDomainUrl());
        }
      }

      /**
       * Called when user clicks the "Connect" button in dialog1
       * @param event
       */
      this.domainsConnectClickListener = function(event) {
        // TBD: Add a different dialog for credentials mode or change dialog content
        let dialog = document.getElementById('dialog1');
        dialog.removeEventListener('keyup', onKeyUp);
        dialog.close();
        self.dialogText.display('');
        let backendMode = Runtime.getBackendMode();
        if (backendMode === "credentials") {
          checkDomainConnection();
        }
        else {
          makeDomainConnection();
        }
      };

      function onKeyUp(event) {
        if (event.key === "Enter") {
          self.domainsConnectClickListener(event);
          event.preventDefault();
          return false;
        }
      }

      function checkDisplayConnectionDialog(backendMode) {
        Logger.log("Display connection dialog: " + backendMode)
        if (backendMode !== "credentials") {
          if (self.domainsConnectState() === Types.Domain.ConnectState.DISCONNECTED.name) {
            showDomainConnectDialog();
          }
        }
      }

      function showDomainConnectDialog(){
        let dialog = document.getElementById('dialog1');
        dialog.addEventListener('keyup', onKeyUp);
        dialog.open();
      }

      viewParams.signaling.domainConnectionInitiated.add(() => {
        switch (self.domainsConnectState()) {
          case Types.Domain.ConnectState.DISCONNECTED.name:
            showDomainConnectDialog();
            break;
          case Types.Domain.ConnectState.CONNECTED.name:
            removeDomainConnection();
            Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE, Types.Domain.ConnectState.DISCONNECTED.name);
            self.domainsConnectState(Types.Domain.ConnectState.DISCONNECTED.name);
            viewParams.signaling.domainChanged.dispatch("domains", {username: ""});
            viewParams.signaling.modeChanged.dispatch(Types.Console.RuntimeMode.OFFLINE.name);
            viewParams.signaling.autoSyncCancelled.dispatch("domains", "0");
            break;
        }
      });

      /**
       * Called when user clicks the "Home" button in the content
       * area header's menubar
       * @param event
       */
      this.domainsHomeButtonClickHandler = function(event) {
        viewParams.parentRouter.go("home");
      };

      Context.getPageContext().getBusyContext().whenReady()
      .then(function () {
        const domainsToolbar = document.getElementById("domains-toolbar");
        if (domainsToolbar !== null) {
          checkDomainConnection();
          new TooltipHelper(domainsToolbar);
        }
      });

    }

    return DomainsTemplate;
  }
);
