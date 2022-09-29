/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(
  function(){
    return {
      /** @type {{CONFIGURATION: {name: string}, INFORMATION: {name: string}, CONTROLLING: {name: string}, MONITORING: {name: string}, SECURITY: {name: string}, CONNECTING: {name: string}, PROVIDERS: {name: string}}} */
      ServiceType: Object.freeze({
        CONFIGURATION: {name: 'configuration'},
        MONITORING: {name: 'monitoring'},
        CONTROLLING: {name: 'controlling'},
        SECURITY: {name: 'security'},
        INFORMATION: {name: 'information'},
        CONNECTING: {name: 'connecting'},
        PROVIDERS: {name: 'providers'}
      }),
      serviceTypeFromName: function (name) {
        return Object.values(this.ServiceType).find(serviceType => serviceType.name === name);
      },
      /** @type {{PAGES: {name: string}, DATA: {name: string}, CHANGE_MANAGER: {name: string}}} */
      ServiceComponentType: Object.freeze({
        PAGES: {name: 'pages'},
        DATA: {name: 'data'},
        CHANGE_MANAGER: {name: 'changeManager'}
      }),
      serviceComponentTypeFromName: function (name) {
        return Object.values(this.ServiceComponentType).find(serviceComponentType => serviceComponentType.name === name);
      },
      /** @type {{LIFECYCLE: {name: string}}} */
      ServiceComponentSubType: Object.freeze({
        LIFECYCLE: {name: 'lifecycle'}
      }),
      serviceComponentSubTypeFromName: function (name) {
        return Object.values(this.ServiceComponentSubType).find(serviceComponentSubType => serviceComponentSubType.name === name);
      },
      /** @type {{OFFLINE: {name: string}, ONLINE: {name: string}}} */
      Mode:  Object.freeze({
        OFFLINE: {name: 'OFFLINE'},
        ONLINE: {name: 'ONLINE'}
      }),
      modeFromName: function (name) {
        return Object.values(this.Mode).find(mode => mode.name === name);
      },
      /** @type {{CREDENTIALS: {name: string}, STANDALONE: {name: string}}} */
      ConnectionMode:  Object.freeze({
        CREDENTIALS: {name: 'credentials'},
        STANDALONE: {name: 'standalone'}
      }),
      connectionModeFromName: function (name) {
        return Object.values(this.ConnectionMode).find(mode => mode.name === name);
      },
      /** @type {{EDIT: {name: string}, SERVER_CONFIG: {name: string}, DOMAIN_RUNTIME: {name: string}}} */
      BeanTreeType: Object.freeze({
        EDIT: {name: 'edit'},
        SERVER_CONFIG: {name: 'serverConfig'},
        DOMAIN_RUNTIME: {name: 'domainRuntime'},
        SECURITY_DATA: {name: 'securityData'}
      }),
      beanTreeTypeFromName: function (name) {
        return Object.values(this.BeanTreeType).find(type => type.name === name);
      },
      /** @type {{ADMIN_SERVER_CONNECTION: {name: string}, WDT_MODEL: {name: string}}} */
      ProviderType: Object.freeze({
        ADMIN_SERVER_CONNECTION: {name: 'AdminServerConnection'},
        WDT_MODEL: {name: 'WDTModel'},
        WDT_COMPOSITE: {name: 'WDTCompositeModel'},
        PROPERTY_LIST: {name: 'PropertyList'}
      }),
      providerTypeFromName: function (name) {
        return Object.values(this.ProviderType).find(type => type.name === name);
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
       * @extends Error
       */
      ServiceNotDefinedError: function ServiceNotDefinedError(message, extra) {
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
);