/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['ojs/ojcore', 'knockout', 'wrc-frontend/microservices/connection-management/domain-connection-manager', './console-backend-connection-verifier', 'wrc-frontend/microservices/provider-management/data-provider', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/core/runtime', 'wrc-frontend/core/cbe-types', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojformlayout', 'ojs/ojlabel', 'ojs/ojlabelvalue', 'ojs/ojinputtext', 'ojs/ojradioset', 'ojs/ojdialog', 'ojs/ojbutton'],
  function (oj, ko, DomainConnectionManager, ConsoleBackendConnectionVerifier, DataProvider, MessageDisplaying, Runtime, CbeTypes, CoreTypes, CoreUtils, Context, Logger) {
    function ConsoleBackendConnectionTemplate(viewParams) {
      const self = this;

      var currentMode = CoreTypes.Console.RuntimeMode.DETACHED.name;

      this.domainsConnectState = Runtime.getDomainConnectState();

      this.connected = function() {
        // Establish heartbeat with CBE using values
        // returned from Runtime functions.
        ConsoleBackendConnectionVerifier.startPollingConnectionState(changedConsoleRuntimeMode);
      }.bind(this);

      function getConnectivityMode(){
        DomainConnectionManager.getAboutInformation()
          .then(result => {
            Logger.info(`Check connection setting currentMode to ${result.newMode}`);
            currentMode = result.newMode;
            processNewMode(result.newMode);
          })
          .catch(response => {
            // Catch to avoid getting an Uncaught (in Promise),
            // but rethrow so the consumer can handle it however
            // it sees fit.
            if (response.failureType === CoreTypes.FailureType.UNEXPECTED) {
              if (response.failureReason.message === "Failed to fetch") {
                MessageDisplaying.displayMessage({
                  severity: 'info',
                  summary: oj.Translations.getTranslatedString("wrc-domain-connection.messages.lostConnection.summary"),
                  detail: oj.Translations.getTranslatedString("wrc-domain-connection.messages.lostConnection.detail")
                }, 10000);
                // Send signal that will
                const ele = document.getElementById("ancillary-content-area-container");
                if (ele !== null) ele.style.display = "none";
                // Set runtime property for CBE_DOMAIN_CONNECT_STATE to "disconnected"
                Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE, CoreTypes.Domain.ConnectState.DISCONNECTED.name);
              }
            }
            currentMode = Runtime.getMode();
            changedConsoleRuntimeMode(currentMode);
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
        // Proceed based on the value of newMode.
        switch (newMode) {
          case CoreTypes.Console.RuntimeMode.OFFLINE.name: {
              // Display any message supplied during connection
              if (CoreUtils.isNotUndefinedNorNull(messageInfo)) {
                MessageDisplaying.displayMessage({
                  severity: 'info',
                  summary: messageInfo.summary,
                  detail: messageInfo.detail
                }, 10000);
              }
            }
            break;
          case CoreTypes.Console.RuntimeMode.DETACHED.name: {
              viewParams.signaling.modeChanged.dispatch(Runtime.getMode());
              changedConsoleRuntimeMode(newMode);
            }
            break;
        }
      }

      function changedConsoleRuntimeMode(newMode) {
        Logger.info(`[CONSOLEBACKENDCONNECTION] changedConsoleRuntimeMode(newMode) was called. newMode=${newMode}`);
        if (newMode === CoreTypes.Console.RuntimeMode.DETACHED.name) {
          sendDisconnectedStateSignals();
          if (self.domainsConnectState === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
            // Load dataproviders ViewModel module
            viewParams.onDataProvidersEmpty("domain-connection", "dataproviders");
          }
        }
      }

      function sendDisconnectedStateSignals() {
        Logger.info(`[CONSOLEBACKENDCONNECTION] sendDisconnectedStateSignals() was called`);
        viewParams.signaling.modeChanged.dispatch(CoreTypes.Console.RuntimeMode.DETACHED.name);
        viewParams.signaling.autoSyncCancelled.dispatch("domains-connection", "0");
      }

      Context.getPageContext().getBusyContext().whenReady()
        .then(function () {
          getConnectivityMode();
        });

    }

    return ConsoleBackendConnectionTemplate;
  }
);
