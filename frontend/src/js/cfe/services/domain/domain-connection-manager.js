/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

/**
 * Module used to manage CBE's connection to a WebLogic REST API endpoint.
 * @typedef {Object} DomainConnection
 */
define(['../../common/runtime','../../io/adapter', '../../http/adapter', './domain-connection', '../../common/types', 'ojs/ojlogger' ],
  function(Runtime, FileAdapter, HttpAdapter, DomainConnection, Types, Logger){
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
        "connectFailed": {detail: "Connect Failed: "},
        "badRequest":  {detail: "Please supply the WebLogic Domain URL and credentials"},
        "invalidCredentials":  {detail: "WebLogic Domain credentials are not valid"},
        "invalidUrl":  {detail: "WebLogic Domain URL is not reachable"},
        "notSupported":  {detail: "WebLogic Domain is not supported"},
        "unexpectedStatus":  {detail: "Unexpected result (status: {0})"},
        "connectionMessage":  {summary: "Connection Message"}
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

      console.log(`Number WebLogic REST API endpoint connections defined in config: ${connections.length}`);
    });

    function getEncoded(user, pass) {
      let basic = user + ":" + pass;
      return btoa(basic);
    }

    function processConnectionResponse(data) {
      if (typeof data !== 'undefined') {
        Runtime.setProperty(Runtime.PropertyName.CBE_MODE, data['mode']);
        Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_URL, data['domainUrl']);
        Runtime.setProperty(Runtime.PropertyName.CBE_WLS_USERNAME, data['username']);
        if (data['state'] === 'connected') {
          Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN, data['domainName']);
          Runtime.setProperty(Runtime.PropertyName.CBE_WLS_VERSION_ONLINE, data['domainVersion']);
          Runtime.setProperty(Runtime.PropertyName.CFE_MODE, "ONLINE");
          Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE, Types.Domain.ConnectState.CONNECTED.name);
        }
        else {
          Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE, Types.Domain.ConnectState.DISCONNECTED.name);
        }
      }
    }

    function processConnectionError(reply) {
      let rsp = null;
      let msg = i18n.messages.connectFailed.detail;

      // Create message to display for connection error
      switch (reply.status) {
        case 400:
          msg = msg + i18n.messages.badRequest.detail;
          break;
        case 401:
        case 403:
          msg = msg + i18n.messages.invalidCredentials.detail;
          break;
        case 404:
          msg = msg + i18n.messages.invalidUrl.detail;
          break;
        case 501:
          msg = msg + i18n.messages.notSupported.detail;
          break;
        default:
          msg = msg + i18n.messages.unexpectedStatus.detail.replace("{0}", reply.status);
          break;
      }

      // Check for response message to include in error message
      if (typeof reply.data !== 'undefined') {
        rsp = reply.data['message'];
      }
      if ((typeof rsp !== 'undefined') && (rsp != null)) {
        msg = msg + "; " + rsp;
      }

      // Return the error
      return new Error(msg);
    }

    return {
      /**
      * Add supplied ``DomainConnection`` instance to ``connections`` list
      * @param {DomainConnection} connection
      */
      add: function (connection) {
        if (this.getById(connection.id) === undefined) {
          connections.push(connection);
        }
      },

      /**
       * Get ``connections`` list
       * @returns {[DomainConnection]}
       */
      getAll: function(){
        return connections;
      },

      /**
       * Get connection metadata for connection with the given ``id``.
       * @param {string} id - he unique identifier for the connection.
       * @returns {DomainConnection}
       */
      getById: function(id) {
        return connections.find((connection) => {
          return connection.id === id;
        });
      },

      /**
       * Get connection metadata for connection with the given ``name``, which is assumed to be the name of a WebLogic domain.
       * @param {string} name - The domain name associated with the connection.
       * @returns {DomainConnection}
       */
      getByName: function(name) {
        return connections.find((connection) => {
          return connection.name === name;
        });
      },

      /**
       * Get connection metadata for connection marked as the default.
       * @returns {DomainConnection}
       */
      getDefault: function() {
        return connections.find((connection) => {
          return connection.isDefault;
        });
      },

      /**
       * Get information (e.g. name, version) about the current CBE connection.
       * @returns {Promise<string>} The version of the CBE the CFE is currently connected to.
       */
      getAboutInformation: function() {
        return new Promise((resolve) => {
          // Default values in event the CBE is not running
          Runtime.setProperty(Runtime.PropertyName.CBE_NAME, "Oracle WebLogic Console Backend Microprofile Server");
          Runtime.setProperty(Runtime.PropertyName.CBE_VERSION, "1.0");

          // Request the version information and update properties when information
          // is available then resolve the promise with the version...
          HttpAdapter.get(Runtime.getBaseUrl() + "/about")
          .then((data) => {
            if (typeof data !== 'undefined') {
              Runtime.setProperty(Runtime.PropertyName.CBE_NAME, data['about']['name']);
              Runtime.setProperty(Runtime.PropertyName.CBE_VERSION, data['about']['version']);
            }
            Runtime.setProperty(Runtime.PropertyName.CFE_MODE, "ONLINE");
            Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE,Types.Domain.ConnectState.CONNECTED.name);
            resolve(Runtime.getProperty(Runtime.PropertyName.CBE_VERSION));
          })
          .catch((reason) => {
            Logger.error(reason);
            Runtime.setProperty(Runtime.PropertyName.CFE_MODE, "OFFLINE");
            Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE,Types.Domain.ConnectState.DISCONNECTED.name);
            resolve(Runtime.getProperty(Runtime.PropertyName.CBE_VERSION));
          });
        })
      },

      /**
       * Get mode (e.g. "ONLINE", "OFFLINE") the CBE is currently operating in. This translates into (or sets) the mode the CFE is operating in.
       * @returns {Promise<string>} The mode (e.g. "CONNECTED", "DISCONNECTED") the CFE is currently operating in.
       */
      getConnection: function() {
        return new Promise((resolve) => {
          // Default behavior is to set mode to OFFLINE.
          Runtime.setProperty(Runtime.PropertyName.CFE_MODE,"OFFLINE");

          // Use the result of the CBE connection endpoint to
          // determine if CBE is in connected or disconnected state.
          HttpAdapter.get(Runtime.getBaseUrl() + "/connection")
          .then((data) => {
            processConnectionResponse(data);
            // Use current CFE_MODE as resolve data
            // for Promise
            resolve(Runtime.getProperty(Runtime.PropertyName.CFE_MODE));
          })
          .catch((reason) => {
            // Log error and use current CFE_MODE as
            // resolve data for Promise
            Logger.error(reason);
            resolve(Runtime.getProperty(Runtime.PropertyName.CFE_MODE));
          });
        })
      },

      // FortifyIssueSuppression Password Management: Password in Comment
      // This is not a password, but just a parameter
      /**
       * Ask CBE to make a connection to a WebLogic REST API endpoint, using the given WebLogic ``user``, WebLogic ``password`` and WebLogic admin ``url``.       *
       * @param {string} user - A username with the Administrator role, in the domain associated with the WebLogic REST API endpoint.
       * @param {string} pass - Password for user with the Administrator role.
       * @param {string} url - The admin URL for the WebLogic REST API endpoint.
       * @returns {Promise<string>} The mode (e.g. "CONNECTED", "DISCONNECTED") the CFE is currently operating in.
       */
      makeConnection: function(user, pass, url) {
        return new Promise((resolve, reject) => {
          // Create an Authorization header value and
          // reject the Promise if there is any error
          let authorization;
          try {
            authorization = "Basic " + getEncoded(user, pass);
          } catch (error) {
            Logger.log("Connect attempt failed: " + error.message);
            reject(new Error("Connect Failed: Some of the characters used are outside of the Latin character set"));
            return;
          }
          let payload = { "domainUrl": url };
          Logger.log("Connecting with user '" + user + "' to the WebLogic Domain at: " + JSON.stringify(payload));
          HttpAdapter.postReply(Runtime.getBaseUrl() + "/connection", payload, undefined, authorization)
          .then((reply) => {
            let messageInfo;
            if (reply.status >= 200 && reply.status < 300) {
              // Check and log any reply error (e.g. problem reading data)
              if (typeof reply.error !== 'undefined') {
                Logger.error(reply.error);
              }
              processConnectionResponse(reply.data);

              // Check for any message in the connection reply
              if (typeof reply.data['message'] !== 'undefined') {
                messageInfo = {
                  summary: i18n.messages.connectionMessage.summary,
                  detail: reply.data['message']
                };
              }
            }
            else {
              reject(processConnectionError(reply));
              return;
            }
            // Use current CFE_MODE as resolve data
            // for Promise
            let result = {newMode: Runtime.getProperty(Runtime.PropertyName.CFE_MODE)};
            if (typeof messageInfo !== 'undefined') {
              result['messageInfo'] = messageInfo;
            }
            resolve(result);
          })
          .catch((reason) => {
            // Log error and use current CFE_MODE as
            // resolve data for Promise
            Logger.error(reason);
            resolve({newMode: Runtime.getProperty(Runtime.PropertyName.CFE_MODE)});
          });
        })
      },

      /**
       * Ask CBE to disconnect from the WebLogic REST API endpoint it is currently connected to.
       * @returns {Promise<string>} The mode (e.g. "CONNECTED", "DISCONNECTED") the CFE is currently operating in.
       */
      deleteConnection: function() {
        return new Promise((resolve) => {
          // Results in setting mode to OFFLINE and DISCONNECTED
          Runtime.setProperty(Runtime.PropertyName.CFE_MODE, "OFFLINE");
          Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE,Types.Domain.ConnectState.DISCONNECTED.name);
          HttpAdapter.delete(Runtime.getBaseUrl() + "/connection")
          .then((data) => {
            resolve(Runtime.getProperty(Runtime.PropertyName.CFE_MODE));
          })
          .catch((reason) => {
            Logger.error(reason);
            resolve(Runtime.getProperty(Runtime.PropertyName.CFE_MODE));
          });
        })
      }

    };
  }
);
