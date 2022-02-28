/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

/**
 * Module used to manage CBE's connection to a WebLogic REST API endpoint.
 * @module
 */
define(['wrc-frontend/core/runtime', 'wrc-frontend/apis/data-operations', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/core/cbe-types', 'wrc-frontend/core/types', 'wrc-frontend/core/cfe-errors', 'wrc-frontend/core/utils', 'ojs/ojlogger' ],
  function(Runtime, DataOperations, MessageDisplaying, CbeTypes, CoreTypes, CoreErrors, CoreUtils, Logger){
    const i18n = {
      messages: {
        'connectionMessage':  {summary: DataOperations.connection.messages.connectionMessage.summary}
      }
    };

    function processConnectionResponse(data) {
      if (CoreUtils.isNotUndefinedNorNull(data)) {

        if (data['connectionWarning']) {
          MessageDisplaying.displayMessages([
            {
              severity: 'WARNING',
              summary: data['connectionWarning'],
            },
          ]);
        }

        Runtime.setProperty(Runtime.PropertyName.CBE_MODE, data['mode']);
        // data will only contain 'domainUrl' and 'username'
        // properties, when this function is called from the
        // useConnection(dataProvider) function.
        Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_URL, data['domainUrl']);
        // data.state will only be "connected", if this function
        // is called from the useConnection(dataProvider) function.
        if (data.state === CoreTypes.Domain.ConnectState.CONNECTED.name) {
          Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN, data['domainName']);
          Runtime.setProperty(Runtime.PropertyName.CBE_WLS_VERSION_ONLINE, data['domainVersion']);
          Runtime.setProperty(Runtime.PropertyName.CFE_MODE, CbeTypes.Mode.ONLINE.name);
          Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE, CoreTypes.Domain.ConnectState.CONNECTED.name);
        }
        else {
          Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE, CoreTypes.Domain.ConnectState.DISCONNECTED.name);
        }
      }
    }

    return {
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
                Runtime.setProperty(Runtime.PropertyName.CFE_MODE, CoreTypes.Console.RuntimeMode.ONLINE.name);
                Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE, CoreTypes.Domain.ConnectState.CONNECTED.name);
                resolve({cbeVersion: Runtime.getProperty(Runtime.PropertyName.CBE_VERSION), newMode: Runtime.getMode()});
              })
              .catch(response => {
                Runtime.setProperty(Runtime.PropertyName.CFE_MODE, CoreTypes.Console.RuntimeMode.DETACHED.name);
                Runtime.setProperty(Runtime.PropertyName.CBE_DOMAIN_CONNECT_STATE, CoreTypes.Domain.ConnectState.DISCONNECTED.name);
                if (response.failureType === CoreTypes.FailureType.UNEXPECTED) {
                  Logger.error(response.failureReason);
                  resolve({cbeVersion: Runtime.getProperty(Runtime.PropertyName.CBE_VERSION), newMode: Runtime.getMode()});
                }
                else {
                  reject(response);
                }
              });
          }
          else {
            resolve({cbeVersion: Runtime.getProperty(Runtime.PropertyName.CBE_VERSION), newMode: Runtime.getMode()});
          }
        });
      },

      createConnection: function(dataProvider) {
        Logger.info(`[DOMAINCONNECTIONMANAGER] Creating connection: providerId='${dataProvider.id}', providerName='${dataProvider.name}', providerUrl='${dataProvider.url}'`);
        return new Promise((resolve, reject) => {
          DataOperations.connection.stageConnection(dataProvider)
            .then(reply => {
              const messages = [];
              // Check for any message in the connection reply
              if (CoreUtils.isNotUndefinedNorNull(reply.body.data.lastMessage)) {
                messages.push({
                  severity: 'error',
                  summary: i18n.messages.connectionMessage.summary,
                  detail: reply.body.data.lastMessage
                });
              }
              return messages;
            })
            .then(messages => {
              if (messages.length === 0) {
                DataOperations.connection.useConnection(dataProvider)
                  .then(reply => {
                    processConnectionResponse(reply.body.data);
                    // Check for any message in the connection reply
                    if (CoreUtils.isNotUndefinedNorNull(reply.body.data.lastMessage)) {
                      messages.push({
                        severity: 'error',
                        summary: i18n.messages.connectionMessage.summary,
                        detail: reply.body.data.lastMessage
                      });
                    }
                    reply.body.messages = messages;
                    resolve(reply);
                  })
                  .catch(response => {
                    // Catch to avoid getting an Uncaught (in Promise),
                    // but rethrow so the consumer can handle it however
                    // it sees fit.
                    reject(response);
                  });
              }
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
      // This is not a password, it's just a field name reference
      /**
       *
       * @param {{string: id, name: string, type: "adminserver", url: string, username: string, password: string, beanTrees: [string], status?: string, class?: string} | {id:string, name:string, type: "model", file: string, beanTrees: [string], status?: string, class?: string}} dataProvider
       * @returns {Promise<{newMode: string}|{failureType: FailureType, failureReason?: any}|{Error}>} Fulfilled Promise containing the connectivity mode (e.g. "ONLINE", "OFFLINE", "DETACHED") the CFE is currently operating in, or a rejected Promise containing a failure response.
       */
      removeConnection: function(dataProvider) {
        return DataOperations.connection.removeConnection(dataProvider);
      }

    };
  }
);
