/**
 * @license
 * Copyright (c) 2021, 2025, Oracle and/or its affiliates.
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
define([
  'ojs/ojcore',
  'wrc-frontend/microservices/data-management/cbe-data-manager',
  'wrc-frontend/core/runtime',
  'wrc-frontend/core/types',
  'wrc-frontend/core/utils' ,
  'wrc-frontend/core/cfe-errors',
  'wrc-frontend/core/cbe-types'
],
  function (
    oj,
    CbeDataManager,
    Runtime,
    CoreTypes,
    CoreUtils,
    CfeErrors,
    CbeTypes
  ) {
    function getConnectionErrorMessage(response) {
      let msg = oj.Translations.getTranslatedString('wrc-data-operations.messages.connectFailed.detail');
      if (response?.body?.data?.messages) {
        if (response.body.data.messages.length > 0) msg = msg + response.body.data.messages[0].message;
      }
      else if (response?.body?.messages) {
        if (response.body.messages.length > 0) msg = msg + response.body.messages[0].message;
      }
      else {
        // Create message to display for connection error
        switch (response.transport.status) {
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
            msg = msg + oj.Translations.getTranslatedString('wrc-data-operations.messages.unexpectedStatus.detail', '{0}').replace('{0}', response.transport.status);
            break;
        }
      }
      return msg;
    }

    function processErrorResponse(response, messages) {
      // Don't assume that this is a CBE_REST_API failure type!! Check and see what failure
      // type it actually is, before you alter the response :-)
      if (response.failureType === CoreTypes.FailureType.UNEXPECTED) {
        if (CoreTypes.isConnectionResponseFailure(response)) {
          response['failureReason'] = messages.backendNotReachable.detail;
          response.failureType = CoreTypes.FailureType.CONNECTION_REFUSED;
        }
        else {
          response['failureReason'] = (response.failureReason.stack === '' ? response.failureReason.message : response.failureReason.stack);
        }
      }
      else if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
        response['failureReason'] = getConnectionErrorMessage.call(this, response);
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
        if (CoreTypes.isConnectionResponseFailure(response)) {
          response['failureReason'] = messages.backendNotReachable.detail;
          response.failureType = CoreTypes.FailureType.CONNECTION_REFUSED;
          response.body.messages.push({
            severity: 'warning',
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
          response['failureReason'] = getConnectionErrorMessage.call(this, response);
        }
      }
      return response;
    }

    async function createAuthorizationHeader(dataProvider) {
      // The authorization header is not used for sso token
      if (dataProvider?.settings?.sso) return undefined;
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
      profile: {
        getDefault: () => {
          return CbeDataManager.getDefaultAppProfile();
        },
        setCurrent: (id) => {
          return CbeDataManager.setCurrentAppProfile(id);
        },
        getList: (defaultImageDataUrl) => {
          return CbeDataManager.getAppProfilesList(defaultImageDataUrl);
        },
        create: (id, data) => {
          return CbeDataManager.createAppProfile(id, data);
        },
        update: (id, data) => {
          return CbeDataManager.updateAppProfile(id, data);
        },
        clearImage: (id) => {
          return CbeDataManager.clearAppProfileImage(id);
        },
        /**
         *
         * @param {string} id
         * @param {File} file
         * @returns {Promise<any>}
         * @example
         *  DataOperations.profile.replaceImage('mwooten', event.target.files[0])
         *    .then(reply => {
         *      const img = document.getElementById('current-profile-pic');
         *      if (img !== null) {
         *        img.src = reply.body.data.imageDataUrl;
         *      }
         *    })
         *    .catch(response => {
         *      ViewModelUtils.failureResponseDefaultHandling(response);
         *    });
         */
        replaceImage: (id, file) => {
          return CbeDataManager.replaceAppProfileImage(id, file);
        },
        remove: (id) => {
          return CbeDataManager.removeAppProfile(id);
        },
        activate: (id) => {
          return CbeDataManager.activateAppProfile(id);
        },
        load: (id) => {
          return CbeDataManager.loadAppProfile(id);
        },
        loadCurrent: () => {
          return CbeDataManager.loadCurrentAppProfile();
        },
        /**
         *
         * @param {string} id
         * @param {{id: string|null, general?: {account?: {organization?: string, name?: string, email?: string}}, role?: {isDefault?: boolean, isPrivate?: boolean}, settings?: {startup?: {taskChooserType?: 'use-dialog'|'use-cards'}},imageDataUrl?: string}} data
         * @returns {Promise<any>}
         */
        save: (id, data) => {
          return CbeDataManager.saveAppProfile(id, data);
        }
      },
      preferences: {
        getTheme: (id) => {
          return CbeDataManager.getThemePreference(id);
        },
        setTheme: (id, theme) => {
          return CbeDataManager.setThemePreference(id, theme);
        }
      },
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
          if (uri.endsWith('DomainRuntime/MessageCenter/Alerts')) {
            return CbeDataManager.mockupAlerts(uri)
              .then(reply => {
                return {
                  body: {data: reply.body.data.get('rdjData')},
                  messages: []
                };
              })
          }
          else {
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
          }
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

      messageCenter: {
        getData: function(messageCenterUri) {
          return CbeDataManager.getMessageCenterData(messageCenterUri);
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
            label: dataProvider.name,
            providerType: CbeTypes.ProviderType.ADMIN_SERVER_CONNECTION.name,
            domainUrl: dataProvider.url
          };

          // Add the dataProvider settings when any setting is supplied
          if (CoreUtils.isNotUndefinedNorNull(dataProvider.settings) && Object.keys(dataProvider.settings).length > 0) {
            dataPayload['settings'] = dataProvider.settings;
          }

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
                      if (CoreTypes.isConnectionResponseFailure(response)) {
                        response['failureReason'] = this.messages.backendNotReachable.detail;
                        response.failureType = CoreTypes.FailureType.CONNECTION_REFUSED;
                      }
                      else {
                        response['failureReason'] = (response.failureReason.stack === '' ? response.failureReason.message : response.failureReason.stack);
                      }
                    }
                    else if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
                      response['failureReason'] = getConnectionErrorMessage.call(this, response);
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
              if (CoreUtils.isUndefinedOrNull(response.body.data)) {
                response.body.data = {};
              }
              if (CoreUtils.isNotUndefinedNorNull(response.failureType)) {
                if (response.transport.status === 400) response.transport.status = 401;
                response['failureReason'] = getConnectionErrorMessage.call(this, response);
                response.body.data['connectivity'] = CoreTypes.Console.RuntimeMode.DETACHED.name;
              }
              else {
                response.body.data['connectivity'] = CoreTypes.Console.RuntimeMode.ONLINE.name;
              }
              return response;
            });

        },

        // FortifyIssueSuppression Password Management: Password in Comment
        // The comment below is not referencing a password
        /**
         * Check status of SSO token
         * @param {{string: id, name: string, type: "adminserver", url: string, username: string, password: string, beanTrees: [string], status?: string, class?: string} | {id:string, name:string, type: "model", file: string, beanTrees: [string], status?: string, class?: string}} dataProvider
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        pollConnectionToken: function (dataProvider) {
          return new Promise((resolve, reject) => {
            CbeDataManager.pollConnectionTokenData(dataProvider.status.ssoid)
              .then(reply => {
                reply.body.data['connectivity'] = CoreTypes.Console.RuntimeMode.DETACHED.name;
                resolve(reply);
              })
              .catch(response => {
                if (response.failureType !== CoreTypes.FailureType.CBE_REST_API) {
                  response['failureReason'] = this.messages.backendNotReachable.detail;
                }
                reject(response);
              })
          });
        },

        /**
         * Ask CBE to disconnect from the WebLogic REST API endpoint it is currently connected to.
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        removeConnection: function(dataProvider) {
          return CbeDataManager.deleteConnectionData(dataProvider.id)
            .catch(response =>{
              // A CBE_REST_API generated failure with a 403
              // (Forbidden) status code, is viewed as a
              // recoverable exception. JS debugging revealed
              // that this happens when a signal.add handler in
              // the UI layer, is passed a data provider that is
              // in the process of being deleted as part of a
              // Promise chain that make parallel executing async
              // calls to the CBE. The 403 happens because the CBE
              // side has finished removing the provider session,
              // but there is no way for the UI layer to know that
              // given the current design. The issue is that the CBE
              // is the place where the code involved in quiescing
              // or deleting data providers should be, not the CFE
              // and certainly not in the UI layer. This 403 workaround
              // can be removed once this and other aspects of data
              // provider management are moved to the CBE side.
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
            label: dataProvider.name,
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

      policy: {
        submitPolicyChange: function(rdjUrl, dataPayload) {
          return CbeDataManager.submitPolicy(rdjUrl, dataPayload);
        }
      },

      href: {
        /**
         * Wrapper that uses `fetch` to capture failures when downloading files.
         * <p>Intended to be used in scenarios where &lt;a> tag is used to trigger a download, programmatically.</p>
         * @param {{filepath: string, fileContents: string, href: string, target: string, download: string, mediaType: string}} options - JS object with properties containing data for the file to be downloaded.
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        downloadFile: (options) => {
          return CbeDataManager.downloadLog(options.href);
        }
      },

      actions: {
        getActionInputFormData: (uri) => {
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

        sendActionInputFormPostRequest: (uri, dataPayload) => {
          return CbeDataManager.postAggregatedData(uri, dataPayload)
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

        getActionData: (uri) => {
          return CbeDataManager.getActionData(uri);
        },

        postActionData: (uri, dataPayload) => {
          return CbeDataManager.postActionData(uri, dataPayload);
        }
      },

      logout: {
        exec: function () {
          return CbeDataManager.doLogout()
          .catch(response => {
            // Just set response.body.data to an empty
            // array, and convert to a Promise resolve.
            // Leave everything else in tact, so caller
            // has everything they need to treat it as
            // an error condition.
            response['body'] = { data: {} };
            return Promise.resolve(response);
          }); 
        }
      },
      about: {

        get: function () { 
          return CbeDataManager.about()
            .catch(response => {
              // Just set response.body.data to an empty
              // array, and convert to a Promise resolve.
              // Leave everything else in tact, so caller
              // has everything they need to treat it as
              // an error condition.
              response['body'] = { data: {} };
              return Promise.resolve(response);
            });
        },
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
        },
        /**
         *
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        help: function() {
          return CbeDataManager.getProviderHelpData()
            .then(reply => {
              reply.body.data = reply.body.data.data;
              return reply;
            });
        },

        domainStatus: function (dataProvider) {
          return CbeDataManager.pollDomainStatusData(dataProvider);
        }

      }
    }
  }
);
