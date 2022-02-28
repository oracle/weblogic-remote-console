/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['ojs/ojcore', 'knockout', './console-backend-connection-verifier', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/core/runtime', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojformlayout', 'ojs/ojlabel', 'ojs/ojlabelvalue', 'ojs/ojinputtext', 'ojs/ojradioset', 'ojs/ojdialog', 'ojs/ojbutton'],
  function (oj, ko, ConsoleBackendConnectionVerifier, MessageDisplaying, Runtime, CoreTypes, CoreUtils, Context, Logger) {
    function ConsoleBackendConnectionTemplate(viewParams) {
      const self = this;

      this.domainsConnectState = Runtime.getDomainConnectState();

      this.connected = function() {
        // Establish heartbeat with CBE using values
        // returned from Runtime functions.
        ConsoleBackendConnectionVerifier.startPollingConnectionState(changedConsoleRuntimeMode);
      }.bind(this);

      function changedConsoleRuntimeMode(source, newMode) {
        Logger.info(`[CONSOLEBACKENDCONNECTION] changedConsoleRuntimeMode(newMode) was called. newMode=${newMode}`);
        if (newMode === CoreTypes.Console.RuntimeMode.DETACHED.name) {
          sendDisconnectedStateSignals();
          if (source === 'external') {
            viewParams.signaling.backendConnectionLost.dispatch();
            showLostConnectionMessage();
          }
          else {
            if (self.domainsConnectState === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
              // Load dataproviders ViewModel module
              viewParams.onDataProvidersEmpty('domain-connection', 'dataproviders');
            }
          }
          // Set runtime property for CBE_DOMAIN_CONNECT_STATE to "disconnected"
          Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE, CoreTypes.Domain.ConnectState.DISCONNECTED.name);
        }
      }

      function sendDisconnectedStateSignals() {
        Logger.info('[CONSOLEBACKENDCONNECTION] sendDisconnectedStateSignals() was called');
        viewParams.signaling.modeChanged.dispatch(CoreTypes.Console.RuntimeMode.UNATTACHED.name);
        viewParams.signaling.autoSyncCancelled.dispatch('domains-connection', '0');
      }

      function showLostConnectionMessage() {
        MessageDisplaying.displayMessage({
          severity: 'info',
          summary: oj.Translations.getTranslatedString('wrc-domain-connection.messages.lostConnection.summary'),
          detail: oj.Translations.getTranslatedString('wrc-domain-connection.messages.lostConnection.detail')
        }, 10000);
      }

      Context.getPageContext().getBusyContext().whenReady()
        .then(function () {
          Runtime.setProperty(Runtime.PropertyName.CFE_MODE, CoreTypes.Console.RuntimeMode.UNATTACHED.name);
          // Load dataproviders ViewModel module
          viewParams.onDataProvidersEmpty('domain-connection', 'dataproviders');
        });

    }

    return ConsoleBackendConnectionTemplate;
  }
);
