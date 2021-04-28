/**
 * @license
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

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
define(['ojs/ojcore', '../microservices/data-management/cbe-data-manager', '../core/runtime', '../core/types', '../core/utils' , '../core/cfe-errors', '../core/cbe-types'],
  function (oj, CbeDataManager, Runtime, CoreTypes, CoreUtils, CfeErrors, CbeTypes) {
  //public:
    return {
      mbean: {
        messages: {
          "cfeApi": {
            "serviceNotDefined": {detail: "'{0}' service not defined in console-frontend-jet.yaml file."}
          },
          "cbeRestApi": {
            "requestUnsuccessful": {
              "summary": oj.Translations.getTranslatedString("wrc-cbe-data-manager.messages.cbeRestApi.requestUnsuccessful.summary"),
              "detail": oj.Translations.getTranslatedString("wrc-cbe-data-manager.messages.cbeRestApi.requestUnsuccessful.detail")
            }
          }
        },

      /**
       *
       * @param {string} url
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
        test: function(url) {
          return CbeDataManager.testUri({url: url})
            .then(reply => {
              // Here, we show how to remove fields from reply when
              // you need to adhere to SoC between the architectural
              // tiers. That adherence means removing all the
              // transport-related fields from the reply, before you
              // return it to the consumer.
              if (CoreUtils.isNotUndefinedNorNull(reply.transport)) {
                delete reply.transport["status"];
                delete reply.transport["statusText"];
                delete reply.transport["headers"];
              }
              return reply;
            });
        },
        /**
         *
         * @param {ServiceType} serviceType
         * @param {string} uri
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        get: function(serviceType, uri) {
          return CbeDataManager.getAggregatedData(serviceType, uri);
        },
        /**
         *
         * @param {string} url
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        reload: function(url) {
          return CbeDataManager.reloadData({url: url})
            .catch(response =>{
              // Try to make FailureType more accurate, if
              // it was a CBE_REST_API generated failure
              if (response.transport.status === 404) {
                // Switch it to FailureType.NOT_FOUND
                response["failureType"] = CoreTypes.FailureType.NOT_FOUND;
              }
              // Rethrow updated (or not updated) reject
              return Promise.reject(response);
            });
        },
        /**
         *
         * @param {ServiceType} serviceType
         * @param {string} uri
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        new: function(serviceType, uri) {
          return CbeDataManager.putData(serviceType, uri);
        },
        /**
         * Use a ``multipart/form-data`` POST request to upload deployment-related files to a CBE REST endpoint
         * @param {string} url - URL for resource at CBE REST endpoint
         * @param {object} formData - Data to use in ``multipart/form-data`` POST request sent to CBE REST API endpoint
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        upload: function (url, formData) {
          return CbeDataManager.postMultipartFormData(url, formData);
        },
        /**
         *
         * @param {string} url
         * @param {object} dataPayload
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        update: function(url, dataPayload) {
          return CbeDataManager.postData({url: url}, dataPayload);
        },
        /**
         *
         * @param {string} url
         * @param {object} dataPayload
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        save: function(url, dataPayload) {
          return CbeDataManager.postPayloadData({url: url}, dataPayload);
        },
        /**
         *
         * @param {string} url
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        delete: function(url) {
          return CbeDataManager.deleteData(url)
            .catch(response =>{
              // Try to make FailureType more accurate, if
              // it was a CBE_REST_API generated failure
              if (response.transport.status === 404) {
                // Switch it to FailureType.NOT_FOUND
                response["failureType"] = CoreTypes.FailureType.NOT_FOUND;
              }
              // Rethrow updated (or not updated) reject
              return Promise.reject(response);
            });
        }
      },

      ataglance: {
        /**
         *
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        getServersGlance: function() {
          return CbeDataManager.getData(CbeTypes.ServiceType.MONITORING, CbeTypes.ServiceComponentSubType.LIFECYCLE, {id: "view"});
        }
      },

      changeManager: {
        SessionAction: Object.freeze({
          EDIT: {name: "edit"},
          COMMIT: {name: "commit"},
          DISCARD: {name: "discard"}
        }),
        /**
         * Returns a Promise containing the lock state of the edit session the CBE has with WLS domain
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        getLockState: function() {
          return CbeDataManager.getChangeManagerData("view");
        },
        /**
         *
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        getData: function() {
          return CbeDataManager.getChangeManagerData("edit");
        },
        /**
         *
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        commitChanges: function() {
          return CbeDataManager.postChangeManagerData("commit");
        },
        /**
         *
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        discardChanges: function() {
          return CbeDataManager.postChangeManagerData("discard");
        }
      },

      connection: {
        messages: {
          "connectionMessage": {summary: oj.Translations.getTranslatedString("wrc-data-operations.messages.connectionMessage.summary")},
          "backendNotReachable": {detail: oj.Translations.getTranslatedString("wrc-data-operations.messages.backendNotReachable.detail")},
          "connectFailed": {detail: oj.Translations.getTranslatedString("wrc-data-operations.messages.connectFailed.detail")},
          "badRequest":  {detail: oj.Translations.getTranslatedString("wrc-data-operations.messages.badRequest.detail")},
          "invalidCredentials":  {detail: oj.Translations.getTranslatedString("wrc-data-operations.messages.invalidCredentials.detail")},
          "invalidUrl":  {detail: oj.Translations.getTranslatedString("wrc-data-operations.messages.invalidUrl.detail")},
          "notSupported":  {detail: oj.Translations.getTranslatedString("wrc-data-operations.messages.notSupported.detail")},
          "unexpectedStatus":  {detail: oj.Translations.getTranslatedString("wrc-data-operations.messages.unexpectedStatus.detail", "{0}")}
        },

        /**
         * Gets about information from the CBE
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        getAboutInformation: function() {
          return CbeDataManager.getConnectionData(CbeTypes.ServiceType.INFORMATION)
        },

        /**
         * Try to establish a connection to the CBE.
         * <p>It takes no parameters because the connectivity info is being (or has already been) gotten from elsewhere.</p>
         * <p>The possible choices for the state are:</p>
         * <ul>
         *   <li>CONNECTED>/li>
         *   <li>DISCONNECTED</li>
         * </ul>
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        getConnectivityMode: function () {
          return CbeDataManager.getConnectionData(CbeTypes.ServiceType.CONNECTING);
        },

        // FortifyIssueSuppression Password Management: Password in Comment
        // The comment below is not referencing a password
        /**
         * Ask CBE to make a connection to a WebLogic REST API endpoint, using the given WebLogic ``user``, WebLogic ``password`` and WebLogic admin ``url``.       *
         * @param {{username: string, password: string, adminUrl: string}} connectivityInfo user - Information to use when attempting to connect to the WebLogic REST API endpoint.
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        makeConnection: function (connectivityInfo) {
          function getErrorMessage(status) {
            let msg = this.messages.connectFailed.detail;
            // Create message to display for connection error
            switch (status) {
              case 400:
                msg = msg + this.messages.badRequest.detail;
                break;
              case 401:
              case 403:
                msg = msg + this.messages.invalidCredentials.detail;
                break;
              case 404:
                msg = msg + this.messages.invalidUrl.detail;
                break;
              case 501:
                msg = msg + this.messages.notSupported.detail;
                break;
              default:
                msg = msg + this.messages.unexpectedStatus.detail.replace("{0}", status);
                break;
            }
            return msg;
          }

          async function createAuthorizationHeader(connectivityInfo) {
            // Use built-in, global btoa() method to create
            // an Authorization HTTP request header.
            //
            // If btoa() throws an error, control will pass
            // to the ".catch(reason => {})" chain link below.
            // Otherwise, we just return the base64 encoded
            // value for the Authorization HTTP header.
            return "Basic " + btoa(connectivityInfo.username + ":" + connectivityInfo.password);
          }

          const dataPayload = {"domainUrl": connectivityInfo.adminUrl};

          // Use Promise chain to do the work
          return new Promise((resolve, reject) => {
            createAuthorizationHeader(connectivityInfo)
              .then(authorization => {
                // Creation of Authorization header succeeded, so
                // go ahead and make the call on the CbeDataManager
                // micro-service.
                CbeDataManager.postReplyConnectionData(dataPayload, authorization)
                  .then(reply => {
                    resolve(reply);
                  })
                  .catch(response => {
                    // Don't assume that this is a CBE_REST_API
                    // failure type!! Check and see what failure
                    // type it actually is, before you alter the
                    // response :-)
                    if (response.failureType === CoreTypes.FailureType.UNEXPECTED && response.failureReason.message === "Failed to fetch") {
                      response["failureReason"] = this.messages.backendNotReachable.detail;
                    }
                    else if (response.failureType === CoreTypes.FailureType.CBE_REST_API) {
                      response["failureReason"] = getErrorMessage.call(this, response.transport.status);
                    }
                    reject(response);
                  });
              })
              .catch(reason => {
                reject({
                  failureType: CoreTypes.FailureType.UNEXPECTED,
                  failureReason: new CfeErrors.CfeError("Some of the characters used are outside of the Latin character set")
                });
              })

          });
        },

        /**
         * Ask CBE to disconnect from the WebLogic REST API endpoint it is currently connected to.
         * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
         */
        removeConnection: function() {
          return CbeDataManager.deleteConnectionData();
        }
      }

    }
  }
);
