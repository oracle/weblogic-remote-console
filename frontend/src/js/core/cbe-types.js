/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(
  function(){
    return {
      /** @type {{CONFIGURATION: {name: string}, INFORMATION: {name: string}, CONTROLLING: {name: string}, MONITORING: {name: string}, SECURITY: {name: string}, CONNECTING: {name: string}}} */
      ServiceType: Object.freeze({
        CONFIGURATION: {name: "configuration"},
        MONITORING: {name: "monitoring"},
        CONTROLLING: {name: "controlling"},
        SECURITY: {name: "security"},
        INFORMATION: {name: "information"},
        CONNECTING: {name: "connecting"}
      }),
      serviceTypeFromName: function (name) {
        return Object.values(this.ServiceType).find(serviceType => serviceType.name === name);
      },
      /** @type {{PAGES: {name: string}, DATA: {name: string}, CHANGE_MANAGER: {name: string}}} */
      ServiceComponentType: Object.freeze({
        PAGES: {name: "pages"},
        DATA: {name: "data"},
        CHANGE_MANAGER: {name: "changeManager"}
      }),
      serviceComponentTypeFromName: function (name) {
        return Object.values(this.ServiceComponentType).find(serviceComponentType => serviceComponentType.name === name);
      },
      ServiceComponentSubType: Object.freeze({
        LIFECYCLE: {name: "lifecycle"}
      }),
      serviceComponentSubTypeFromName: function (name) {
        return Object.values(this.ServiceComponentSubType).find(serviceComponentSubType => serviceComponentSubType.name === name);
      },
      /** @type {{OFFLINE: {name: string}, ONLINE: {name: string}}} */
      Mode:  Object.freeze({
        OFFLINE: {name: "OFFLINE"},
        ONLINE: {name: "ONLINE"}
      }),
      modeFromName: function (name) {
        return Object.values(this.Mode).find(mode => mode.name === name);
      },
      /**
       * Base custom error for errors related to the CBE REST API
       * @param {string} message
       * @param {object} [extra]
       * @constructor
       * @extends Error
       */
      CbeApiError: function CbeApiError(message, extra) {
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
      },
      /**
       * Subclass of the `CbeApiError` custom error for an undefined service type
       * @param {string} message
       * @param {object} [extra]
       * @constructor
       * @extends CbeApiError
       */
      ServiceNotDefinedError: function ServiceNotDefinedError(message, extra) {
        this.CbeApiError.call(this, message, extra);
      }
    }
  }
);