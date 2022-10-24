/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * UI API module for performing data CRUD operations via the `CbeDataManager` module.
 * <p>That module uses the CBE REST API to perform the actual CRUD operation(s).</p>
 * <p>There are several architectural principles being adhered to here:</p>
 * <uL>
 *   <li><b>Data being returned is <i>transport-agnostic.</i></b>&nbsp;&nbsp;&nbsp;Being a UI API means that the consumer is a UI (e.g. View/ViewModel combination), so it doesn't need to know "what" is providing the data, "how" it's providing it or "where" it's coming from. If the UI API returns things like "HTTP status code" or "HTTP response headers", then the consumer will end up having code in it that "knows how" the data is being obtained, and will 1) factor that into how responses are processed, and 2) not be a tier that focuses exclusively on UI layout, UI components and how to use them to offer the end-user the best UX.<br/><p>NOTE: If you have a scenario where the consumer needs/wants to use <i>transport-related</i> data, then use the CFE micro-services directly, instead of going through the CFE UI API.</p></li>
 *   <li><b>All successes result in Promise fulfillments, and all failures result in Promise rejections</b>&nbsp;&nbsp;&nbsp;There are no cases where an error is caught, and a Promise <code>resolve</code> is returned instead. The caught error (or response) is only being caught to determine if enhancements (e.g. then addition of more properties to it) can be done, before it is rethrown for handling by code in the API consumer.</l1>
 * </ul>
 * @module
 */
define(['ojs/ojcore', 'wrc-frontend/microservices/data-management/cbe-data-manager', 'wrc-frontend/core/runtime', 'wrc-frontend/core/types', 'wrc-frontend/core/utils' , 'wrc-frontend/core/cfe-errors', 'wrc-frontend/core/cbe-types'],
  function (oj, CbeDataManager, Runtime, CoreTypes, CoreUtils, CfeErrors, CbeTypes) {
    function getConnectionErrorMessage(status) {
      let msg = oj.Translations.getTranslatedString('wrc-data-operations.messages.connectFailed.detail');
      // Create message to display for connection error
      switch (status) {
        case 400:
          msg = msg + oj.Translations.getTranslatedString('wrc-data-operations.messages.badRequest.detail');
          break;
        case 401:
          msg = msg + oj.Translations.getTranslatedString('wrc-data-operations.messages.invalidCredentials.detail');
          break;
        case 403:
          msg = msg + oj.Translations.getTranslatedString('wrc-data-operations.messages.notInRole.detail');
          break;
        case 404:
          msg = msg + oj.Translations.getTranslatedString('wrc-data-operations.messages.invalidUrl.detail');
          break;
        case 501:
          msg = msg + oj.Translations.getTranslatedString('wrc-data-operations.messages.notSupported.detail');
          break;
        default:
          msg = msg + oj.Translations.getTranslatedString('wrc-data-operations.messages.unexpectedStatus.detail', '{0}').replace('{0}', status);
          break;
      }
      return msg;
    }

    function processErrorResponse(response, messages) {
      // Don't assume that this is a CBE_REST_API failure type!! Check and see what failure
      // type it actually is, before you alter the response :-)
      if (response.failureType === CoreTypes.FailureType.UNEXPECTED) {
        if (response.failureReason.message === 'Failed to fetch') {
          response['failureReason'] = messages.backendNotReachable.detail;
        }
        else {
          response['failureReason'] = (response.failureReason.stack === '' ? response.failureReason.message : response.failureReason.stack);
        }
      }
      else if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
        response['failureReason'] = getConnectionErrorMessage.call(this, response.transport.status);
      }
      return response;
    }

    function processUploadReply(reply, messages) {
      // The /api/providers API doesn't currently return
      // anything that will allow us to set the CFE runtime
      // mode to OFFLINE. For now, we'll just add a
      // "connectivity": "offline" field to the reply.
      reply.body.data['connectivity'] = CoreTypes.Console.RuntimeMode.OFFLINE.name;
      // The /api/providers API doesn't currently return
      // a "state" field, but we need that to set the CBE
      // connect state to "connected". The CBE connect
      // state drives a lot of the behavior in the CFE.
      reply.body.data['state'] = CoreTypes.Domain.ConnectState.CONNECTED.name;

      if (CoreUtils.isNotUndefinedNorNull(reply.body.message)) {
        const msg = [];
        msg.push({
          severity: 'warn',
          summary: messages.connectionMessage.summary,
          detail: reply.body.message
        });
        reply.body.messages = msg;
      }
      return reply;
    }

    function processUploadErrorResponse(response, messages) {
      if (response.failureType === CoreTypes.FailureType.UNEXPECTED) {
        if (response.failureReason.message === 'Failed to fetch') {
          response['failureReason'] = messages.backendNotReachable.detail;
          response.body.messages.push({
            severity: 'warn',
            summary: oj.Translations.getTranslatedString('wrc-data-operations.messages.cbeRestApi.requestUnsuccessful.summary'),
            detail: messages.backendNotReachable.detail
          });
        }
        else {
          response['failureReason'] = (response.failureReason.stack === '' ? response.failureReason.message : response.failureReason.stack);
        }
      }
      else if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
        if (CoreUtils.isNotUndefinedNorNull(response.body.messages) && response.body.messages.length > 0) {
          response['failureReason'] = response.body.messages[0].message;
        }
        else if (response.transport.status === 0 && response.transport.statusText === 'error') {
          response['failureReason'] = messages.backendNotReachable.detail;
        }
        else {
          response['failureReason'] = getConnectionErrorMessage.call(this, response.transport.status);
        }
      }
      return response;
    }

    async function createAuthorizationHeader(dataProvider) {
      // Check for token when creating connection
      if (CoreUtils.isNotUndefinedNorNull(dataProvider.token)) {
        return 'Bearer ' + dataProvider.token;
      }

      // Use built-in, global btoa() method to create
      // an Authorization HTTP request header.
      //
      // If btoa() throws an error, control will pass
      // to the ".catch(reason => {})" chain link below.
      // Otherwise, we just return the base64 encoded
      // value for the Authorization HTTP header.
      return 'Basic ' + btoa(dataProvider.username + ':' + dataProvider.password);
    }

    //public:
    return {
      mbean: {
        messages: {
          'cfeApi': {
            'serviceNotDefined': {detail: '\'{0}\' service not defined in console-frontend-jet.yaml file.'}
          },
          'cbeRestApi': {
            'requestUnsuccessful': {
              'summary': oj.Translations.getTranslatedString('wrc-cbe-data-manager.messages.cbeRestApi.requestUnsuccessful.summary'),
              'detail': oj.Translations.getTranslatedString('wrc-cbe-data-manager.messages.cbeRestApi.requestUnsuccessful.detail')
            }
          }
        },

        /**
         *
         * @param {string} uri
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        test: function(uri) {
          return CbeDataManager.testUri(uri)
            .then(reply => {
              // Here, we show how to remove fields from reply when
              // you need to adhere to SoC between the architectural
              // tiers. That adherence means removing all the
              // transport-related fields from the reply, before you
              // return it to the consumer.
              if (CoreUtils.isNotUndefinedNorNull(reply.transport)) {
                delete reply.transport['status'];
                delete reply.transport['statusText'];
                delete reply.transport['headers'];
              }
              return reply;
            });
        },
        /**
         *
         * @param {string} uri
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        get: function(uri) {
          return CbeDataManager.getAggregatedData(uri)
            .catch(response =>{
              if (response.failureType === CoreTypes.FailureType.UNEXPECTED) {
                response['failureReason'] = (response.failureReason.stack === '' ? response.failureReason.message : response.failureReason.stack);
              }
              else if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
                // Try to make FailureType more accurate, if
                // it was a CBE_REST_API generated failure
                if (response.transport.status === 404) {
                  // Switch it to FailureType.NOT_FOUND
                  response['failureType'] = CoreTypes.FailureType.NOT_FOUND;
                }
              }
              // Rethrow updated (or not updated) reject
              return Promise.reject(response);
            });
        },
        /**
         *
         * @param {string} uri
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        reload: function(uri) {
          return CbeDataManager.reloadData(uri)
            .catch(response =>{
              if (response.failureType === CoreTypes.FailureType.UNEXPECTED) {
                response['failureReason'] = (response.failureReason.stack === '' ? response.failureReason.message : response.failureReason.stack);
              }
              else if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
                // Try to make FailureType more accurate, if
                // it was a CBE_REST_API generated failure
                if (response.transport.status === 404) {
                  // Switch it to FailureType.NOT_FOUND
                  response['failureType'] = CoreTypes.FailureType.NOT_FOUND;
                }
              }
              // Rethrow updated (or not updated) reject
              return Promise.reject(response);
            });
        },
        /**
         *
         * @param {string} uri
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        new: function(uri) {
          return CbeDataManager.putData(uri);
        },
        /**
         * Use a ``multipart/form-data`` POST request to upload deployment-related files to a CBE REST endpoint
         * @param {string} uri - URI for endpoint accepting ``multipart/form-data`` POST requests
         * @param {object} formData - Data to use in ``multipart/form-data`` POST request sent to CBE REST API endpoint
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        upload: function (uri, formData) {
          return CbeDataManager.postMultipartFormData(uri, formData);
        },
        /**
         *
         * @param {string} url
         * @param {object} dataPayload
         * @param {boolean} isFullPayload - Flag indicating whether ``dataPayload`` contains a JS property named "action", not not.
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        save: function(url, dataPayload, isFullPayload) {
          return CbeDataManager.postPayloadData(url, dataPayload, isFullPayload);
        },
        /**
         *
         * @param {string} url
         * @param {string} searchValue
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        simpleSearch: function(url, searchValue) {
           const searchPayload = { contains: searchValue };
           return CbeDataManager.postPayloadData(url, searchPayload, true);
        },
        /**
         *
         * @param {string} url
         * @param {[string]} displayedColumns - array of column names in the order they are displayed
         * @param {boolean|undefined} reset - Flag indicating whether to reset the displayed columns, or not. Will be set to false, if not provided
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        customizeTable: function(url, displayedColumns, reset = false) {
          const customizePayload = reset ? {} : { displayedColumns: displayedColumns };
          return CbeDataManager.postPayloadData(url, customizePayload, true);
        },
       /**
         *
         * @param {string} uri
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        delete: function(uri) {
          return CbeDataManager.deleteData(uri)
            .catch(response =>{
              if (response.failureType === CoreTypes.FailureType.UNEXPECTED) {
                response['failureReason'] = (response.failureReason.stack === '' ? response.failureReason.message : response.failureReason.stack);
              }
              else if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
                // Try to make FailureType more accurate, if
                // it was a CBE_REST_API generated failure
                if (response.transport.status === 404) {
                  // Switch it to FailureType.NOT_FOUND
                  response['failureType'] = CoreTypes.FailureType.NOT_FOUND;
                }
              }
              // Rethrow updated (or not updated) reject
              return Promise.reject(response);
            });
        }
      },

      tabstrip: {
        getSlice: function(uri) {
          return CbeDataManager.getSliceData(uri);
        }
      },

      navtree: {
        /**
         * Returns navtree data for a given ``navtreeUri`` and ``navtreeData`` object.
         * <p>Note that this uses an HTTP POST to get data, not an HTTP GET. Assign ``{}`` (and empty JS object) to ``navtreeData`` to get the "root" nodes of a given navtree.</p>
         * @param {string} navtreeUri - Value assigned to ``navtree`` field of dataProvider.beanTrees[index] JS object
         * @param {object} treeModel - JS object representing the "parent" node in a navtree
         * @returns {Promise<{contents: [object]}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        refreshNavtreeData: function(navtreeUri, treeModel) {
          return CbeDataManager.getNavtreeData(navtreeUri, treeModel)
            .then(reply => {
              return reply.body.data;
            });
        },
        isNavTreeLeaf: function(url) {
          return CbeDataManager.isNavTreeLeaf(url)
            .then(reply => {
              return reply.body.data.navigation;
            });
        }
      },

      ataglance: {
        /**
         * @param {string} uri
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        getServersGlance: function(uri) {
          return CbeDataManager.getData(uri);
        }
      },

      changeManager: {
        SessionAction: Object.freeze({
          VIEW_CHANGES: {name: 'changes'},
          COMMIT_CHANGES: {name: 'commitChanges'},
          DISCARD_CHANGES: {name: 'discardChanges'}
        }),
        /**
         * Returns a Promise containing the lock state of the edit session the CBE has with WLS domain
         * @param {string} changeManagerUri
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        getLockState: function(changeManagerUri) {
          return CbeDataManager.getChangeManagerData(changeManagerUri);
        },
        /**
         *
         * @param {string} changeManagerUri
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        getData: function(changeManagerUri) {
          return CbeDataManager.getChangeManagerData(`${changeManagerUri}/${this.SessionAction.VIEW_CHANGES.name}`);
        },
        /**
         *
         * @param {string} changeManagerUri
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        commitChanges: function(changeManagerUri) {
          return CbeDataManager.postChangeManagerData(`${changeManagerUri}/${this.SessionAction.COMMIT_CHANGES.name}`);
        },
        /**
         *
         * @param {string} changeManagerUri
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        discardChanges: function(changeManagerUri) {
          return CbeDataManager.postChangeManagerData(`${changeManagerUri}/${this.SessionAction.DISCARD_CHANGES.name}`);
        }
      },

      connection: {
        messages: {
          'connectionMessage': {summary: oj.Translations.getTranslatedString('wrc-data-operations.messages.connectionMessage.summary')},
          'backendNotReachable': {detail: oj.Translations.getTranslatedString('wrc-data-operations.messages.backendNotReachable.detail')},
          'connectFailed': {detail: oj.Translations.getTranslatedString('wrc-data-operations.messages.connectFailed.detail')},
          'badRequest':  {detail: oj.Translations.getTranslatedString('wrc-data-operations.messages.badRequest.detail')},
          'invalidCredentials':  {detail: oj.Translations.getTranslatedString('wrc-data-operations.messages.invalidCredentials.detail')},
          'invalidUrl':  {detail: oj.Translations.getTranslatedString('wrc-data-operations.messages.invalidUrl.detail')},
          'notSupported':  {detail: oj.Translations.getTranslatedString('wrc-data-operations.messages.notSupported.detail')},
          'unexpectedStatus':  {detail: oj.Translations.getTranslatedString('wrc-data-operations.messages.unexpectedStatus.detail', '{0}')}
        },

        /**
         * Gets about information from the CBE
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        getAboutInformation: function() {
          return CbeDataManager.getConnectionData(CbeTypes.ServiceType.INFORMATION)
        },

        // FortifyIssueSuppression Password Management: Password in Comment
        // The comment below is not referencing a password
        /**
         * Ask CBE to make a connection to a WebLogic REST API endpoint, using the given WebLogic ``user``, WebLogic ``password`` and WebLogic admin ``url``.
         * @param {{string: id, name: string, type: "adminserver", url: string, username: string, password: string, beanTrees: [string], status?: string, class?: string} | {id:string, name:string, type: "model", file: string, beanTrees: [string], status?: string, class?: string}} dataProvider
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        stageConnection: function (dataProvider) {
          const dataPayload = {
            name: dataProvider.id,
            providerType: CbeTypes.ProviderType.ADMIN_SERVER_CONNECTION.name,
            domainUrl: dataProvider.url
          };

          // Use Promise chain to do the work
          return new Promise((resolve, reject) => {
            createAuthorizationHeader(dataProvider)
              .then(authorization => {
                // Creation of Authorization header succeeded, so
                // go ahead and make the call on the CbeDataManager
                // micro-service.
                CbeDataManager.stageConnectionData(dataPayload, authorization)
                  .then(reply => {
                    reply.body.data['connectivity'] = CoreTypes.Console.RuntimeMode.DETACHED.name;
                    resolve(reply);
                  })
                  .catch(response => {
                    // Don't assume that this is a CBE_REST_API
                    // failure type!! Check and see what failure
                    // type it actually is, before you alter the
                    // response :-)
                    if (response.failureType === CoreTypes.FailureType.UNEXPECTED) {
                      if (response.failureReason.message === 'Failed to fetch') {
                        response['failureReason'] = this.messages.backendNotReachable.detail;
                      }
                      else {
                        response['failureReason'] = (response.failureReason.stack === '' ? response.failureReason.message : response.failureReason.stack);
                      }
                    }
                    else if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
                      response['failureReason'] = getConnectionErrorMessage.call(this, response.transport.status);
                    }
                    reject(response);
                  });
              })
              .catch(reason => {
                reject({
                  failureType: CoreTypes.FailureType.UNEXPECTED,
                  failureReason: new CfeErrors.CfeError('Some of the characters used are outside of the Latin character set')
                });
              })

          });
        },

        useConnection: function (dataProvider) {
          return CbeDataManager.useConnectionData(dataProvider.id)
            .then(response => {
              response.body.data['connectivity'] = CoreTypes.Console.RuntimeMode.ONLINE.name;

              if (CoreUtils.isNotUndefinedNorNull(response.failureType)) {
                if (response.transport.status === 400) response.transport.status = 401;
                response['failureReason'] = getConnectionErrorMessage.call(this, response.transport.status);
                response.body.data['connectivity'] = CoreTypes.Console.RuntimeMode.DETACHED.name;
              }
              return response;
            });

        },

        /**
         * Ask CBE to disconnect from the WebLogic REST API endpoint it is currently connected to.
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        removeConnection: function(dataProvider) {
          return CbeDataManager.deleteConnectionData(dataProvider.id)
            .catch(response =>{
              // If it was a CBE_REST_API generated failure
              // with a 403 (Forbidden) status code, we
              // view this as a recoverable exception, likely
              // caused by the CBE not getting completely into
              // the state where the provider stuff works. This
              // "incomplete state" can be demostrated using
              // the curl commands in the bescen shell script.
              // The recovery action involves switching the
              // Promise reject to a Promise resolve.
              if (response.transport.status === 403) {
                const reply = { body: { data: {} } };
                return Promise.resolve(reply);
              }
              else {
                // Rethrow response as a reject Promise.
                return Promise.reject(response);
              }
            });
        }
      },

      model: {
        messages: {
          'connectionMessage': {summary: oj.Translations.getTranslatedString('wrc-data-operations.messages.connectionMessage.summary')},
          'backendNotReachable': {detail: oj.Translations.getTranslatedString('wrc-data-operations.messages.backendNotReachable.detail')}
        },

        createModel: function(dataProviderId, formData) {
          return new Promise((resolve, reject) => {
            CbeDataManager.uploadProviderFormData(formData, CbeTypes.ProviderType.WDT_MODEL.name)
              .then(reply => {
                CbeDataManager.useProviderData(dataProviderId, CbeTypes.ProviderType.WDT_MODEL.name)
                  .then(reply => {
                    reply = processUploadReply.call(this, reply, this.messages);
                    resolve(reply);
                  })
                  .catch(response => {
                    // Catch to avoid getting an Uncaught (in Promise),
                    // but rethrow so the consumer can handle it however
                    // it sees fit.
                    response = processErrorResponse.call(this, response, this.messages);
                    reject(response);
                  });
              })
              .catch(response => {
                // Catch to avoid getting an Uncaught (in Promise),
                // but rethrow so the consumer can handle it however
                // it sees fit.
                response = processUploadErrorResponse.call(this, response, this.messages);
                reject(response);
              });
          });
        },

        /**
         *
         * @param {string} dataProviderId
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        removeModel: function(dataProviderId) {
          return CbeDataManager.deleteProviderData(dataProviderId, CbeTypes.ProviderType.WDT_MODEL.name)
            .catch(response =>{
              // If it was a CBE_REST_API generated failure
              // with a 403 (Bad Request) status code, we
              // view this as a recoverable exception, likely
              // caused by the CBE not getting completely into
              // the state where the provider stuff works.
              // The recovery action involves switching the
              // Promise reject to a Promise resolve.
              if (response.transport.status === 403) {
                const reply = { body: { data: {} } };
                return Promise.resolve(reply);
              }
              else {
                // Rethrow response as a reject Promise.
                return Promise.reject(response);
              }
            });
        },

        downloadModel: function(dataProvider) {
          const uri = dataProvider.getBeanTreeDownloadUri();
          return CbeDataManager.downloadProviderData(uri);
        },

        updatePropertyList: function(dataProviderId, propertyListProviderId) {
          const dataPayload = {
            name: dataProviderId,
            providerType: CbeTypes.ProviderType.WDT_MODEL.name,
            propertyLists: [propertyListProviderId]
          };
          return CbeDataManager.stageConnectionData(dataPayload, undefined);
        }
      },

      composite: {
        messages: {
          'connectionMessage': {summary: oj.Translations.getTranslatedString('wrc-data-operations.messages.connectionMessage.summary')},
          'backendNotReachable': {detail: oj.Translations.getTranslatedString('wrc-data-operations.messages.backendNotReachable.detail')}
        },

        /**
         * Ask CBE to create a WDT Composite Model provider specifying the names of the model providers to use for the composite.
         * @param {{id: string, name: string, type: string, beanTrees?: [Array], state?: string, connectivity?: string, mode?: string}} dataProvider
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        createComposite: function (dataProvider) {
          const dataPayload = {
            name: dataProvider.id,
            providerType: CbeTypes.ProviderType.WDT_COMPOSITE.name,
            modelNames: dataProvider.modelProviders
          };

          // Use Promise chain to do the work
          return new Promise((resolve, reject) => {
            CbeDataManager.stageConnectionData(dataPayload, undefined)
              .then(reply => {
                // Add connectivity as "offline" to the reply.
                reply.body.data['connectivity'] = CoreTypes.Console.RuntimeMode.OFFLINE.name;
                // Add stated as "connected" which drives a lot of the behavior in the CFE.
                reply.body.data['state'] = CoreTypes.Domain.ConnectState.CONNECTED.name;
                resolve(reply);
              })
              .catch(response => {
                response = processErrorResponse.call(this, response, this.messages);
                reject(response);
              });
          })
        },

        /**
         * Ask CBE to use the WDT Composite Model provider.
         * @param {{id: string, name: string, type: string, beanTrees?: [Array], state?: string, connectivity?: string, mode?: string}} dataProvider
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        useComposite: function (dataProvider) {
          return new Promise((resolve, reject) => {
            CbeDataManager.useCompositeData(dataProvider.id)
              .then(reply => {
                // Add connectivity as "offline" to the reply.
                reply.body.data['connectivity'] = CoreTypes.Console.RuntimeMode.OFFLINE.name;
                // Add stated as "connected" which drives a lot of the behavior in the CFE.
                reply.body.data['state'] = CoreTypes.Domain.ConnectState.CONNECTED.name;
                resolve(reply);
              })
              .catch(response => {
                response = processErrorResponse.call(this, response, this.messages);
                reject(response);
              });
          })
        },

        /**
         * Ask the CBE to remnove the WDT Composite Model provider.
         * @param {string} dataProviderId
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        removeComposite: function(dataProviderId) {
          return CbeDataManager.deleteCompositeData(dataProviderId)
            .catch(response =>{
              // If it was a CBE_REST_API generated failure
              // with a 403 (Bad Request) status code, we
              // view this as a recoverable exception, likely
              // caused by the CBE not getting completely into
              // the state where the provider stuff works.
              // The recovery action involves switching the
              // Promise reject to a Promise resolve.
              if (response.transport.status === 403) {
                const reply = { body: { data: {} } };
                return Promise.resolve(reply);
              }
              else {
                // Rethrow response as a reject Promise.
                return Promise.reject(response);
              }
            });
        },
      },

      properties: {
        messages: {
          'connectionMessage': {summary: oj.Translations.getTranslatedString('wrc-data-operations.messages.connectionMessage.summary')},
          'backendNotReachable': {detail: oj.Translations.getTranslatedString('wrc-data-operations.messages.backendNotReachable.detail')}
        },

        createPropertyList: function(dataProviderId, formData) {
          return new Promise((resolve, reject) => {
            CbeDataManager.uploadProviderFormData(formData, CbeTypes.ProviderType.PROPERTY_LIST.name)
              .then(reply => {
                CbeDataManager.useProviderData(dataProviderId, CbeTypes.ProviderType.PROPERTY_LIST.name)
                  .then(reply => {
                    reply = processUploadReply.call(this, reply, this.messages);
                    resolve(reply);
                  })
                  .catch(response => {
                    response = processErrorResponse.call(this, response, this.messages);
                    reject(response);
                  });
              })
              .catch(response => {
                response = processUploadErrorResponse.call(this, response, this.messages);
                reject(response);
              });
          });
        },

        /**
         *
         * @param {string} dataProviderId
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
         removePropertyList: function(dataProviderId) {
          return CbeDataManager.deleteProviderData(dataProviderId, CbeTypes.ProviderType.PROPERTY_LIST.name)
            .catch(response =>{
              // If it was a CBE_REST_API generated failure
              // with a 403 (Bad Request) status code, we
              // view this as a recoverable exception, likely
              // caused by the CBE not getting completely into
              // the state where the provider stuff works.
              // The recovery action involves switching the
              // Promise reject to a Promise resolve.
              if (response.transport.status === 403) {
                const reply = { body: { data: {} } };
                return Promise.resolve(reply);
              }
              else {
                // Rethrow response as a reject Promise.
                return Promise.reject(response);
              }
            });
        },

        downloadPropertyList: function(dataProvider) {
          const uri = dataProvider.getBeanTreeDownloadUri();
          return CbeDataManager.downloadProviderData(uri);
        }
      },

      providers: {
        /**
         *
         * @returns {Promise<{body: {data: *, messages: [*]}} |{failureType: string, failureReason: *}>}
         */
        listing: function() {
          return CbeDataManager.listDataProviders()
            .catch(response => {
              // Just set response.body.data to an empty
              // array, and convert to a Promise resolve.
              // Leave everything else in tact, so caller
              // has everything they need to treat it as
              // an error condition.
              response['body'] = {data: []};
              return Promise.resolve(response);
            });
        },

        /**
         *
         * @param {string} dataProviderId
         * @param {string} providerType - CBE type for data provider. See ``CbeTypes.ProviderType`` frozen object.
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        quiesce: function(dataProviderId, providerType) {
          return CbeDataManager.deleteProviderData(dataProviderId, providerType)
            .catch(response =>{
              // If it was a CBE_REST_API generated failure
              // with a 403 (Bad Request) status code, we
              // view this as a recoverable exception, likely
              // caused by the CBE not getting completely into
              // the state where the provider stuff works.
              // The recovery action involves switching the
              // Promise reject to a Promise resolve.
              if (response.transport.status === 403) {
                const reply = { body: { data: {} } };
                return Promise.resolve(reply);
              }
              else {
                // Rethrow response as a reject Promise.
                return Promise.reject(response);
              }
            });
        }

      }
    }
  }
);
