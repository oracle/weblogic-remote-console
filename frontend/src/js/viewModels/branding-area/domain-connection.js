/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['ojs/ojcore', 'knockout', '../../microservices/connection-management/domain-connection-manager', '../../microservices/connection-management/domain-connection-verifier', '../../apis/message-displaying', '../../core/runtime', '../utils', '../../core/types', '../../core/utils', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojformlayout', 'ojs/ojlabel', 'ojs/ojlabelvalue', 'ojs/ojinputtext', 'ojs/ojcheckboxset', 'ojs/ojdialog', 'ojs/ojbutton'],
  function (oj, ko, DomainConnectionManager, DomainConnectionVerifier, MessageDisplaying, Runtime, ViewModelUtils, CoreTypes, CoreUtils, Context, Logger) {
    function DomainConnectionTemplate(viewParams) {
      const self = this;

      var currentMode = CoreTypes.Console.RuntimeMode.DETACHED.name;

      this.i18n = {
        "labels": {
            runningAt: {value: oj.Translations.getTranslatedString("wrc-domain-connection.labels.runningAt.value", "{0}")
          }
        },
        "messages": {
          "lostConnection": {
            summary: oj.Translations.getTranslatedString("wrc-domain-connection.messages.lostConnection.summary"),
            detail: oj.Translations.getTranslatedString("wrc-domain-connection.messages.lostConnection.detail")
          },
          "cannotConnect": {
            summary: oj.Translations.getTranslatedString("wrc-domain-connection.messages.cannotConnect.summary"),
            detail: oj.Translations.getTranslatedString("wrc-domain-connection.messages.cannotConnect.detail", "{0}")
          }
        },
        dialog1: {
          title: oj.Translations.getTranslatedString("wrc-domain-connection.dialog1.title"),
          instructions: oj.Translations.getTranslatedString("wrc-domain-connection.dialog1.instructions"),
          labels: {
            url: oj.Translations.getTranslatedString("wrc-domain-connection.dialog1.labels.url")
          },
          fields: {
            username: {id: "username", image: "connection-username-icon-grn_36x36", disabled: false, visible: true},
            password: {id: "password", image: "connection-password-icon-grn_36x36", disabled: false, visible: true},
            url: {id: "url", placeholder: ""}
          },
          buttons: {
            connect: {id: "connect", image: "domain-connect2-icon-blk_24x24", disabled: false,
              label: oj.Translations.getTranslatedString("wrc-domain-connection.dialog1.buttons.connect.label")
            }
          }
        }
      };

      this.activeDomain = ko.observable();

      this.domainsConnectState = Runtime.getDomainConnectState();

      this.dialogEntry = {
        username: ko.observable(''),
        password: ko.observable(''),
        url: ko.observable('http://localhost:7001')
      };

      this.dialogText = { display: ko.observable('') };

      // Establish heartbeat with CBE using values
      // returned from Runtime functions.
      DomainConnectionVerifier.startPollingConnectionState(changedConsoleRuntimeMode);

      function setDomainConnectionCredentials(username, password) {
        self.dialogEntry.username(username);
        self.dialogEntry.password(password);
      }

      function removeDomainConnection(){
        if (Runtime.getBackendMode() !== "credentials") {
          DomainConnectionManager.removeConnection()
            .then(result => {
              Logger.info(`Remove connection setting currentMode to ${result.newMode}`);
              currentMode = result.newMode;
            })
            .catch(response => {
              currentMode = Runtime.getMode();
              ViewModelUtils.failureResponseDefaultHandling(response);
            });
        }
      }

      function getConnectivityMode(){
        DomainConnectionManager.getConnectivityMode()
          .then(result => {
            Logger.info(`Check connection setting currentMode to ${result.newMode}`);
            currentMode = result.newMode;
            processNewMode(result.newMode);
          })
          .catch(response => {
            currentMode = Runtime.getMode();
            changedConsoleRuntimeMode(currentMode);
          });
      }

      function makeDomainConnection() {
        const connectivityInfo = {
          username: self.dialogEntry.username(),
          password: self.dialogEntry.password(),
          url: self.dialogEntry.url()
        };
        DomainConnectionManager.makeConnection(connectivityInfo.username, connectivityInfo.password, connectivityInfo.url)
          .then(result => {
            Logger.info(`Make connection setting currentMode to ${result.newMode}`);
            currentMode = result.newMode;
            processNewMode(result.newMode, result.messageInfo);
          })
          .catch(response => {
            let reasonText = response.failureReason;
            if (response.failureType === CoreTypes.FailureType.UNEXPECTED) {
              if (response.failureReason instanceof Error) {
                reasonText = response.failureReason.message;
              }
            }

            // Dynamically set the height of dialog1, based on
            // the length of reasonText.
            let minHeightVariable = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--dialog1-fixed-min-height"), 10);
            // Increase dialog1.height by 36px, for every 96
            // characters in reasonText.
            minHeightVariable += ((reasonText.length / 96) * 30);
            document.documentElement.style.setProperty("--dialog1-calc-height", `${minHeightVariable}px`);

            Logger.info(`[DOMAINCONNECTION] reasonText.length=${reasonText.length}`);
            self.dialogText.display(reasonText);
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
        self.domainsConnectState = Runtime.getDomainConnectState();
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
            if (CoreUtils.isNotUndefinedNorNull(messageInfo)) {
              MessageDisplaying.displayMessage({
                severity: 'info',
                summary: messageInfo.summary,
                detail: messageInfo.detail
              }, 10000);
            }
            break;
          case "DETACHED":
            deactivateDomain();
            if (backendMode === "credentials") {
              const message = self.i18n.messages.cannotConnect;
              if (CoreUtils.isNotUndefinedNorNull(url)) {
                const label = self.i18n.labels.runningAt.replace("{0}", url);
                message.detail = message.detail.replace("{0}", label);
              }
              else {
                message.detail = message.detail.replace("{0}", "");
              }
              MessageDisplaying.displayMessage({
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
        viewParams.signaling.domainChanged.dispatch("domains-connection", domainInfo);
//        viewParams.signaling.modeChanged.dispatch(CoreTypes.Console.RuntimeMode.ONLINE.name);
        viewParams.signaling.modeChanged.dispatch(Runtime.getMode());
      }

      function deactivateDomain() {
        // !!IMPORTANT!!
        //
        // These have to be called in the order specified, or else
        // other signal listeners will not perform their "unlock
        // actions" correctly (or entirely).
        viewParams.signaling.domainChanged.dispatch("domains-connection", {username: ""});
//        viewParams.signaling.modeChanged.dispatch(CoreTypes.Console.RuntimeMode.DETACHED.name);
        viewParams.signaling.modeChanged.dispatch(Runtime.getMode());
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
          ele.setAttribute("title", Runtime.getDomainUrl());
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
          getConnectivityMode();
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
        Logger.log("Display connection dialog: " + backendMode);
        if (backendMode !== "credentials") {
          if (self.domainsConnectState === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
            showDomainConnectDialog();
          }
        }
      }

      function showDomainConnectDialog(){
        let dialog = document.getElementById('dialog1');
        dialog.addEventListener('keyup', onKeyUp);
        dialog.open();
      }

      function changedConsoleRuntimeMode(newMode) {
        viewParams.onDomainConnectStateChanged();
        if (newMode === CoreTypes.Console.RuntimeMode.DETACHED.name) {
          MessageDisplaying.displayMessage({
            severity: "warning",
            summary: self.i18n.messages.lostConnection.summary,
            detail: self.i18n.messages.lostConnection.detail
          });
          setDomainConnectionCredentials("", "");
          sendDisconnectedStateSignals();
        }
      }

      function sendDisconnectedStateSignals() {
        viewParams.signaling.domainChanged.dispatch("domains-connection", {username: ""});
        viewParams.signaling.modeChanged.dispatch(CoreTypes.Console.RuntimeMode.DETACHED.name);
        viewParams.signaling.autoSyncCancelled.dispatch("domains-connection", "0");
      }

      viewParams.signaling.domainConnectionInitiated.add(() => {
        switch (self.domainsConnectState) {
          case CoreTypes.Domain.ConnectState.DISCONNECTED.name:
            showDomainConnectDialog();
            break;
          case CoreTypes.Domain.ConnectState.CONNECTED.name:
            removeDomainConnection();
            Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE, CoreTypes.Domain.ConnectState.DISCONNECTED.name);
            self.domainsConnectState = CoreTypes.Domain.ConnectState.DISCONNECTED.name;
            sendDisconnectedStateSignals();
            break;
        }
      });

      Context.getPageContext().getBusyContext().whenReady()
        .then(function () {
          getConnectivityMode();
        });

    }

    return DomainConnectionTemplate;
  }
);
