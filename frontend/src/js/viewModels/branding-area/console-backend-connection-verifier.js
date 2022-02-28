/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * CFE API module for managing domain connections
 * @module
 */
define(['wrc-frontend/microservices/connection-management/domain-connection-manager', 'wrc-frontend/core/runtime', 'wrc-frontend/core/utils', 'wrc-frontend/core/types', 'ojs/ojlogger'],
  function (DomainConnectionManager, Runtime, CoreUtils, CoreTypes, Logger) {
    let _currentMode = CoreTypes.Console.RuntimeMode.UNATTACHED.name,
      _timerId, _onConsoleRuntimeModeChanged;

    function checkDomainConnectionState() {
      DomainConnectionManager.getAboutInformation()
        .then(reply => {
          // Get mode the CFE is running in
          const newMode = Runtime.getMode();
          if (_currentMode !== newMode){
            Logger.info(`Setting _currentMode to ${newMode}`);
            _currentMode = newMode;
            if (CoreUtils.isNotUndefinedNorNull(_onConsoleRuntimeModeChanged)) {
              _onConsoleRuntimeModeChanged('external', newMode);
            }
          }
        })
        .catch(response => {
          Logger.log(response);
          // We don't need to do anything with the
          // reject, except catch it to prevent
          // the JavaScript engine from throwing
          // an UnhandledRejectionError :-)
        });
    }

    function endPollingConnectionState() {
      clearInterval(_timerId);
    }

  //public:
    return {
      /**
       * Start sending a heartbeat to CBE.
       * <p>Polling is used to implement the heartbeat. The polling interval is set from the value returned Runtime.getPollingMillis()</p>.
       * @param {function} changedConsoleRuntimeMode Callback function to invoke when CFE enters DETACHED mode
       */
      startPollingConnectionState: function(changedConsoleRuntimeMode) {
        _onConsoleRuntimeModeChanged = changedConsoleRuntimeMode;
        _timerId = setInterval(checkDomainConnectionState.bind(this), Runtime.getPollingMillis());
      },

      /**
       * Stops sending a heartbeat to CBE.
       */
      endPollingConnectionState: endPollingConnectionState

    };

  }
);
