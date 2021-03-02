/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define([],
function(){
  return {
    ServiceType: Object.freeze({
      CONFIGURING: {name: "configuring"},
      MONITORING: {name: "monitoring"},
      CONTROLLING: {name: "controlling"},
      SECURITY: {name: "security"},
      HELP: {name: "help"},
      CONNECT: {name: "connect"}
    }),
    ServiceComponentType: Object.freeze({
      PAGES: {name: "pages"},
      DATA: {name: "data"}
    }),
    Mode:  Object.freeze({
      OFFLINE: {name: "OFFLINE"},
      ONLINE: {name: "ONLINE"}
    }),
    CbeCliError: function(message) {
      function CbeCliError(message) {
        Error.call(this, message);
      }
      // Allow properties of Error to be accessed by CbeCliError
      CbeCliError.prototype = Object.create(Error.prototype);
      // Return CbeCliError constructor function
      return CbeCliError;
    }
  }
});