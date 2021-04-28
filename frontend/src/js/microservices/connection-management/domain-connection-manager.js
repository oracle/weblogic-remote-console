/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

/**
 * Module used to manage CBE's connection to a WebLogic REST API endpoint.
 * @module
 * @typedef {Object} DomainConnection
 */
define(['../../core/runtime','../../core/adapters/file-adapter', './domain-connection', '../../apis/data-operations', '../../core/types', '../../core/cfe-errors', '../../core/utils', 'ojs/ojlogger' ],
  function(Runtime, FileAdapter, DomainConnection, DataOperations, CoreTypes, CoreErrors, CoreUtils, Logger){
    // Not sure why we have this initial array item
    // hard-coded here, because the information is
    // in the src/config/domain-connections.yaml file,
    // which gets read using the FileAdapter...in
    // this very module. That is not new code...it
    // has been here in this module, for 8-9 months.
    var connections = [
      {
        id: "default",
        name: "domain1",
        version: "14.1.1.0.0",
        username: "weblogic",
        listenAddress: "localhost",
        listenPort: 7001,
        isDefault: true
      }
    ];

    const i18n = {
      messages: {
        "connectionMessage":  {summary: DataOperations.connection.messages.connectionMessage.summary}
      }
    };

    FileAdapter.readYaml('config/domain-connections.yaml')
      .then((config) => {
        let connection;
        config['domain-connections'].forEach((entry) => {
          Logger.log(`id=${entry.id}, label=${entry.name}`);
          connection = connections.find(existing => existing.isDefault);
          if (typeof connection === "undefined") {
            connection = new DomainConnection(entry.id, entry.name, entry.version, entry.username, entry.listenAddress, entry.listenPort, entry.isDefault);
            connections.push(connection);
          }
          else {
            connection.name = entry.name;
            connection.version = entry.version;
            connection.username = entry.username;
            connection.listenAddress = entry.listenAddress;
            connection.listenPort = entry.listenPort;
          }
        });

        // Must use console.log here (as opposed to
        // 'ojs/ojlogger') because this code executes
        // before requirejs has loaded the Logger
        console.log(`Number WebLogic REST API endpoint connections defined in config: ${connections.length}`);
      });

    function processConnectionResponse(data) {
      if (typeof data !== 'undefined') {
        Runtime.setProperty(Runtime.PropertyName.CBE_MODE, data['mode']);
        Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_URL, data['domainUrl']);
        Runtime.setProperty(Runtime.PropertyName.CBE_WLS_USERNAME, data['username']);
        if (data.state === "connected") {
          Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN, data['domainName']);
          Runtime.setProperty(Runtime.PropertyName.CBE_WLS_VERSION_ONLINE, data['domainVersion']);
          Runtime.setProperty(Runtime.PropertyName.CFE_MODE, "ONLINE");
          Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE, CoreTypes.Domain.ConnectState.CONNECTED.name);
        }
        else {
          Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE, CoreTypes.Domain.ConnectState.DISCONNECTED.name);
        }
      }
    }

    return {
      /**
       * Add supplied ``DomainConnection`` metadata to ``connections`` list
       * <p>Here, a connection is just state (not behavior), so it is possible to express it in a JSON or YAML file created elsewhere. A JS tool can then parse that JSON or YAML file, and use the results as arguments to this method.</p>
       * @param {DomainConnection} connection
       */
      add: function (connection) {
        if (this.getById(connection.id) === undefined) {
          connections.push(connection);
        }
      },

      /**
       * Get a copy of the ``connections`` list
       * @returns {[DomainConnection]}
       */
      getAll: function(){
        return [...connections];
      },

      /**
       * Get connection metadata for connection with the given ``id``.
       * @param {string} id - The unique identifier for the connection.
       * @returns {DomainConnection}
       */
      getById: function(id) {
        return connections.find((connection) => {
          return connection.id === id;
        });
      },

      /**
       * Get metadata for connection with the given ``name``, which is assumed to be the name of a WebLogic domain.
       * @param {string} name - The domain name associated with the connection.
       * @returns {DomainConnection} Object with properties for a domain connection.
       */
      getByName: function(name) {
        return connections.find((connection) => {
          return connection.name === name;
        });
      },

      /**
       * Get connection metadata for connection marked as the default.
       * @returns {DomainConnection} Object with properties for a domain connection.
       */
      getDefault: function() {
        return connections.find((connection) => {
          return connection.isDefault;
        });
      },

      /**
       * Get information (e.g. name, version) about the current CBE connection.
       * @returns {Promise<{cbeVersion: string}|{failureType: FailureType, failureReason?: any}|{Error}>} Fulfilled Promise containing the version of the CBE the CFE is currently connected to, or a rejected Promise containing a failure response.
       */
      getAboutInformation: function() {
        return new Promise((resolve, reject) => {
          if (Runtime.getDomainConnectState() !== CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
            DataOperations.connection.getAboutInformation()
              .then(reply => {
                Runtime.setProperty(Runtime.PropertyName.CBE_NAME, reply.body.data['about']['name']);
                Runtime.setProperty(Runtime.PropertyName.CBE_VERSION, reply.body.data['about']['version']);
                Runtime.setProperty(Runtime.PropertyName.CFE_MODE, "ONLINE");
                Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE, CoreTypes.Domain.ConnectState.CONNECTED.name);
                resolve({cbeVersion: Runtime.getProperty(Runtime.PropertyName.CBE_VERSION)});
              })
              .catch(response => {
                Runtime.setProperty(Runtime.PropertyName.CFE_MODE, "DETACHED");
                Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE, CoreTypes.Domain.ConnectState.DISCONNECTED.name);
                if (response.failureType === CoreTypes.FailureType.UNEXPECTED) {
                  Logger.error(response.failureReason);
                  resolve({cbeVersion: Runtime.getProperty(Runtime.PropertyName.CBE_VERSION)});
                }
                else {
                  reject(response);
                }
              });
          }
          else {
            return Promise.resolve({cbeVersion: Runtime.getProperty(Runtime.PropertyName.CBE_VERSION)});
          }
        });
      },

      /**
       * Returns the mode the CFE is currently operating in, based on whether it can connect to the CBE or not.
       * @returns {Promise<{newMode: string}|{failureType: FailureType, failureReason?: any}|{Error}>} Fulfilled Promise containing the connectivity mode (e.g. "ONLINE", "OFFLINE", "DETACHED") the CFE is currently operating in, or a rejected Promise containing a failure response.
       */
      getConnectivityMode: function() {
        // Default behavior is to set mode to DETACHED.
        Runtime.setProperty(Runtime.PropertyName.CFE_MODE, CoreTypes.Console.RuntimeMode.DETACHED.name);
        return new Promise((resolve, reject) => {
          DataOperations.connection.getConnectivityMode()
            .then(reply => {
              processConnectionResponse(reply.body.data);
              // Use current CFE_MODE as resolve data
              // for Promise
              resolve({newMode: Runtime.getMode()});
            })
            .catch(response => {
              // Catch to avoid getting an Uncaught (in Promise),
              // but rethrow so the consumer can handle it however
              // it sees fit.
              reject(response);
            });
        });
      },

      // FortifyIssueSuppression Password Management: Password in Comment
      // This is not a password, but just a parameter
      /**
       * Ask CBE to make a connection to a WebLogic REST API endpoint, using the given WebLogic ``user``, WebLogic ``password`` and WebLogic admin ``url``.
       * @param {string} user - A username with the Administrator role, in the domain associated with the WebLogic REST API endpoint.
       * @param {string} pass - Password for user with the Administrator role.
       * @param {string} url - The admin URL for the WebLogic REST API endpoint.
       * @returns {Promise<{newMode: string, messageInfo?: {severity:string, summary: string, detail: string}}|{failureType: FailureType, failureReason?: any}|{Error}>} Fulfilled Promise containing the connectivity mode (e.g. "ONLINE", "OFFLINE", "DETACHED") the CFE is currently operating in, or a rejected Promise containing a failure response.
       */
      makeConnection: function(user, pass, url) {
        Logger.log("Connecting with user '" + user + "' to the WebLogic Domain at: " + url);
        return new Promise((resolve, reject) => {
          DataOperations.connection.makeConnection({username: user, password: pass, adminUrl: url})
            .then(reply => {
              processConnectionResponse(reply.body.data);
              let messageInfo;
              // Check for any message in the connection reply
              if (typeof reply.body.data.message !== 'undefined') {
                messageInfo = {
                  severity: "warn",
                  summary: i18n.messages.connectionMessage.summary,
                  detail: reply.body.data.message
                };
              }
              return messageInfo;
            })
            .then(messageInfo => {
              // Use current CFE_MODE as fulfillment value of Promise
              let result = {newMode: Runtime.getProperty(Runtime.PropertyName.CFE_MODE)};
              if (CoreUtils.isNotUndefinedNorNull(messageInfo) && CoreUtils.isNotUndefinedNorNull(messageInfo.detail)) {
                result["messageInfo"] = messageInfo;
              }
              resolve(result);
            })
            .catch(response => {
              // Catch to avoid getting an Uncaught (in Promise),
              // but rethrow so the consumer can handle it however
              // it sees fit.
              reject(response);
            });
        });
      },

      /**
       * Ask CBE to disconnect from the WebLogic REST API endpoint it is currently connected to.
       * @returns {Promise<{newMode: string}|{failureType: FailureType, failureReason?: any}|{Error}>} Fulfilled Promise containing the connectivity mode (e.g. "ONLINE", "OFFLINE", "DETACHED") the CFE is currently operating in, or a rejected Promise containing a failure response.
       */
      removeConnection: function() {
        // Set runtime property for CFE_MODE to DETACHED
        Runtime.setProperty(Runtime.PropertyName.CFE_MODE, "DETACHED");
        // Set runtime property for CBE_DOMAIN_CONNECT_STATE to DISCONNECTED
        Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE,CoreTypes.Domain.ConnectState.DISCONNECTED.name);
        return new Promise((resolve, reject) => {
          // Use the DataOperations CFE API to delete the connection
          DataOperations.connection.removeConnection()
            .then(reply => {
              resolve({newMode: Runtime.getProperty(Runtime.PropertyName.CFE_MODE)});
            });
        });
      }

    };
  }
);
