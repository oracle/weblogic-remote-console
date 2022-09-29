/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Module containing core constants for the CFE
 * @module
 */
define(
  function(){
    return {
      Console: {
        /** @type {{ONLINE: {name: string}, OFFLINE: {name: string}, DETACHED: {name: string}}} */
        RuntimeMode: Object.freeze({
          ONLINE: {name: 'ONLINE'},   // should make connectivity indicator "green"
          OFFLINE: {name: 'OFFLINE'}, // should make connectivity indicator "yellow"
          DETACHED: {name: 'DETACHED'},  // should make connectivity indicator "red"
          UNATTACHED: {name: 'UNATTACHED'}
        }),
        runtimeModeFromName: function(name) {
          return Object.values(this.RuntimeMode).find(runtimeMode => runtimeMode.name === name);
        },
        RuntimeRole: Object.freeze({
          APP: {name: 'app'},
          TOOL: {name: 'tool'}
        }),
        runtimeRoleFromName: function (name) {
          return Object.values(this.RuntimeRole).find(runtimeRole => runtimeRole.name === name);
        }
      },
      Domain: {
        /** @type {{CONNECTED: {name: string}, DISCONNECTED: {name: string}}} */
        ConnectState: Object.freeze({
          CONNECTED: {name: 'connected'},
          DISCONNECTED: {name: 'disconnected'}
        }),
        connectStateFromName: function (name) {
          return Object.values(this.ConnectState).find(connectState => connectState.name === name);
        }
      },
      /** @type {{TRANSPORT: {name: string}, NOT_FOUND: {name: string}, INCORRECT_CONTENT: {name: string}, CBE_REST_API: {name: string}, CONNECTION_REFUSED: {name: string}, UNEXPECTED: {name: string}}} */
      FailureType: Object.freeze({
        TRANSPORT: {name: 'TRANSPORT'},
        NOT_FOUND: {name: 'NOT_FOUND'},
        INCORRECT_CONTENT: {name: 'INCORRECT_CONTENT'},
        CBE_REST_API: {name: 'CBE_REST_API'},
        CONNECTION_REFUSED: {name: 'CONNECTION_REFUSED'},
        UNEXPECTED: {name: 'UNEXPECTED'}
      }),
      failureTypeFromName: function (name) {
        return Object.values(this.FailureType).find(failureType => failureType.name === name);
      },
      TypeErrors: Object.freeze({
        FETCH_FAILURE: 'Failed to fetch'
      }),
      Navtree: {
        /** @type {{DOCKED: {name: string}, FLOATING: {name: string}, MINIMIZED: {name: string}}} */
        Placement: Object.freeze({
          DOCKED: {name: 'docked'},
          FLOATING: {name: 'floating'},
          MINIMIZED: {name: 'minimized'},
          CLOSED: {name: 'closed'}
        }),
        placementFromName: function (name) {
          return Object.values(this.Placement).find(placement => placement.name === name);
        }
      }

    };
  });
