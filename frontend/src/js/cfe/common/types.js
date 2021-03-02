/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(
function(){
  return {
    Console: {
      RuntimeMode: Object.freeze({
        ONLINE: {name: "ONLINE"},   // should make connectivity indicator "green"
        LIMITED: {name: "LIMITED"}, // should make connectivity indicator "yellow"
        OFFLINE: {name: "OFFLINE"}  // should make connectivity indicator "red"
      }),
      // Need a way to get RuntimeMode from a string
      runtimeModeFromString: function(modeName) {
        let runtimeMode;
        switch (modeName) {
          case "ONLINE":
            runtimeMode = this.RuntimeMode.ONLINE;
            break;
          case "LIMITED":
            runtimeMode = this.RuntimeMode.LIMITED;
            break;
          case "OFFLINE":
            runtimeMode = this.RuntimeMode.OFFLINE;
            break;
        }
        return runtimeMode;
      }
    },
    Domain: {
      ConnectState: Object.freeze({
        CONNECTED: {name: "CONNECTED"},
        DISCONNECTED: {name: "DISCONNECTED"}
      }),
      // Need a way to get ConnectState from a string
      connectStateFromString: function(stateName) {
        let connectState;
        switch (stateName) {
          case "CONNECTED":
            connectState = this.ConnectState.CONNECTED;
            break;
          case "DISCONNECTED":
            connectState = this.ConnectState.DISCONNECTED;
            break;
        }
        return connectState;
      }
    },
    CfeError: function(message) {
      function CfeError(message) {
        Error.call(this, message);
      }
      // Allow properties of Error to be acessed by CfeError
      this.CfeError.prototype = Object.create(Error.prototype);
      // Return CfeError constructor function
      return CfeError;
    },
    InvalidParameterError: function(message) {
      function InvalidParameterError(message) {
        Error.call(this, message);
      }
      // Allow properties of CfeError to be acessed by InvalidParameterError
      InvalidParameterError.prototype = Object.create(this.CfeError.prototype);
      // Return InvalidParameterError constructor function
      return InvalidParameterError;
    }
  }
});