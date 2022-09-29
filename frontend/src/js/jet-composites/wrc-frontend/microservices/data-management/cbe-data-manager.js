/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Module for retrieving data from the CBE using the CBE REST API.
 * <p>IMPORTANT: If you see, or are yourself putting any JET-related modules in the <code>define()</code> function, it is a violation of the SoC (separation of concerns) best practice. There should be no JET-related modules (not even the Logger) being imported into this module!!</p>
 * @module
 */
define(['jquery', 'wrc-frontend/core/adapters/http-adapter', 'wrc-frontend/core/runtime', './cbe-data-storage', 'wrc-frontend/core/cbe-types', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojlogger'],
  function ($, HttpAdapter, Runtime, CbeDataStorage, CbeTypes, CoreTypes, CoreUtils, Logger) {
    const i18n = {
      messages: {
        'cfeApi': {
          'serviceNotDefined': {detail: '\'{0}\' service not defined in console-frontend-jet.yaml file.'}
        }
      }
    };

    function getServiceConfigComponentURL(serviceType, serviceComponentType, uri){
      const serviceConfig = Runtime.getServiceConfig(serviceType);

      if (CoreUtils.isUndefinedOrNull(serviceConfig)) throw new this.ServiceTypeNotFoundError(i18n.messages.serviceNotDefined.detail.replace('{0}', serviceType.name));

      return Runtime.getBackendUrl() + uri; // BaseUrl() + uri; //serviceConfig.path + "/" + serviceComponentType.name + "/" + uri;
    }

    function getUriById (serviceType, serviceComponentType, id){
      const serviceConfig = Runtime.getServiceConfig(serviceType);
      if (CoreUtils.isUndefinedOrNull(serviceConfig)) throw new this.ServiceTypeNotFoundError(i18n.messages.serviceNotDefined.detail.replace('{0}', serviceType.name));
      const component = serviceConfig.components[serviceComponentType.name].find(item => item.id === id);
      let path = serviceConfig.path ;
      if (CoreUtils.isNotUndefinedNorNull(component.prefix)) {
        path = path + component.prefix;
      }
      return Runtime.getBaseUrl() + path + component.uri;
    }

    function getUrlBySelector (serviceType, serviceComponentType, selector) {
      let url;

      if (CoreUtils.isNotUndefinedNorNull(selector.id)) {
        url = getUriById.call(this, serviceType, serviceComponentType, selector.id);
      }
      else if (CoreUtils.isNotUndefinedNorNull(selector.uri)) {
        url = getServiceConfigComponentURL.call(this, serviceType, serviceComponentType, selector.uri);
      }

      return url;
    }

    function getUrlByServiceType(serviceType) {
      const serviceConfig = Runtime.getServiceConfig(serviceType);
      if (CoreUtils.isUndefinedOrNull(serviceConfig)) throw new this.ServiceTypeNotFoundError(i18n.messages.cfeApi.serviceNotDefined.detail.replace('{0}', serviceType.name));
      return Runtime.getBaseUrl() + serviceConfig.path;
    }

    /**
     * Returns a ``url`` based on the contents of the ``options`` parameter.
     * @param {{serviceType: ServiceType, serviceComponentType: ServiceComponentType, id: string}|{serviceType: ServiceType, serviceComponentType: ServiceComponentType, uri: string}|{url: string}} options
     * @returns {string|}
     */
    function getUrl(options) {
      let url;
      if (CoreUtils.isNotUndefinedNorNull(options.id)) {
        // Need to use .call(this, ...) here, because
        // getUrlById() uses the "this" variable inside
        // it's implementation
        url = getUriById.call(this, options.serviceType, options.serviceComponentType, options.id);
      }
      else if (CoreUtils.isNotUndefinedNorNull(options.url)) {
        const backendUrl = Runtime.getBackendUrl();
        const index = options.url.indexOf('/api');
        if (options.url.substring(0, index) !== backendUrl) {
          options.url = `${backendUrl}${options.url.substring(index)}`;
          Logger.info(`[CBE-DATA-MANAGER] options.url=${options.url}`);
        }
        url = options.url;
      }
      else {
        // Need to use .call(this, ...) here, because
        // getServiceConfigComponentURL uses the "this"
        // variable inside it's implementation
        url = getServiceConfigComponentURL.call(this, options.serviceType, options.serviceComponentType, options.uri);
      }
      return url;
    }

    /**
     * Returns the data or error returned from the CBE REST API
     * @param {*} options
     * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
     */
    function getData(options) {
      return new Promise((resolve, reject) => {
        const url = getUrl.call(this, options);
        HttpAdapter.get(url)
          .then(reply => {
            reply['body'] = {
              data: reply.responseJSON,
              messages: getResponseJSONMessages(reply.responseJSON)
            };
            delete reply.responseJSON;
            resolve(reply);
          })
          .catch(response => {
            const reply = {
              body: {
                data: {}
              }
            };
            if (CoreUtils.isNotUndefinedNorNull(response.status)) {
              // This means the reject was not from
              // a JavaScript Error being thrown
              reply['failureType'] = CoreTypes.FailureType.CBE_REST_API;
              reply['failureReason'] = response.statusText;
              reply['transport'] = {
                status: response.status,
                statusText: response.statusText
              };
              return response.json()
                .then(responseJSON => {
                  reply.body['messages'] = responseJSON.messages;
                  reject(reply);
                })
                .catch(error => {
                  // Response body does not contain JSON, so
                  // just set reply.body["messages"] = [] to
                  // honor the interface contract, when failure
                  // type is CBE_REST_API.
                  reply.body['messages'] = [];
                  // Rethrow for handling by upstream code
                  reject(reply);
                });
            }
            else {
              // Reject came from a JavaScript Error being thrown.
              // The response will be the JavaScript Error object
              const reply = {failureReason: response};
              if (response.message === CoreTypes.TypeErrors.FETCH_FAILURE) {
                reply['failureType'] = CoreTypes.FailureType.CONNECTION_REFUSED;
              }
              else {
                reply['failureType'] = CoreTypes.FailureType.UNEXPECTED;
              }
              // Rethrow for handling by upstream code
              reject(reply);
            }
          });
      });
    }

    /**
     * Deletes the data or error returned from the CBE REST API
     * @param {*} options
     * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
     */
     function deleteData(options) {
      return new Promise((resolve, reject) => {
        const url = getUrl.call(this, options);
        HttpAdapter.delete(url)
          .then(reply => {
            reply['body'] = {
              data: reply.responseJSON,
              messages: getResponseJSONMessages(reply.responseJSON)
            };
            delete reply.responseJSON;
            resolve(reply);
          })
          .catch(response => {
            const reply = {
              body: {
                data: {}
              }
            };
            if (CoreUtils.isNotUndefinedNorNull(response.status)) {
              // This means the reject was not from
              // a JavaScript Error being thrown
              reply['failureType'] = CoreTypes.FailureType.CBE_REST_API;
              reply['failureReason'] = response.statusText;
              reply['transport'] = {
                status: response.status,
                statusText: response.statusText
              };
              return response.json()
                .then(responseJSON => {
                  reply.body['messages'] = responseJSON.messages;
                  reject(reply);
                })
                .catch(error => {
                  // Response body does not contain JSON, so
                  // just set reply.body["messages"] = [] to
                  // honor the interface contract, when failure
                  // type is CBE_REST_API.
                  reply.body['messages'] = [];
                  // Rethrow for handling by upstream code
                  reject(reply);
                });
            }
            else {
              // Reject came from a JavaScript Error
              // being thrown.
              const reply = {
                failureType: CoreTypes.FailureType.UNEXPECTED,
                // The reply parameter passed to the
                // .catch link in the chain, will be
                // the JavaScript Error object
                failureReason: response
              };
              // Rethrow for handling by upstream code
              reject(reply);
            }
          });
      });
    }

    /**
     *
     * @param {{serviceType: ServiceType, serviceComponentType: ServiceComponentType, uri: string}|{url: string}} options
     * @param {object} dataPayload
     * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
     */
    function postData(options, dataPayload) {
      return new Promise((resolve, reject) => {
        const url = getUrl.call(this, options);
        HttpAdapter.post(url, dataPayload)
          .then(reply => {
            reply['body'] = {
              data: reply.responseJSON,
              messages: getResponseJSONMessages(reply.responseJSON)
            };
            delete reply.responseJSON;
            resolve(reply);
          })
          .catch(response => {
            const reply = {
              body: {
                data: {}
              }
            };
            if (CoreUtils.isNotUndefinedNorNull(response.status)) {
              // This means the reject was not from
              // a JavaScript Error being thrown
              reply['failureType'] = CoreTypes.FailureType.CBE_REST_API;
              reply['failureReason'] = response.statusText;
              reply['transport'] = {
                status: response.status,
                statusText: response.statusText
              };
              return response.json()
                .then(responseJSON => {
                  reply.body['messages'] = responseJSON.messages;
                  reject(reply);
                })
                .catch(error => {
                  // Response body does not contain JSON, so
                  // just set reply.body["messages"] = [] to
                  // honor the interface contract, when failure
                  // type is CBE_REST_API.
                  reply.body['messages'] = [];
                  // Rethrow for handling by upstream code
                  reject(reply);
                });
            }
            else {
              // Reject came from a JavaScript Error
              // being thrown.
              const reply = {
                failureType: CoreTypes.FailureType.UNEXPECTED,
                // The reply parameter passed to the
                // .catch link in the chain, will be
                // the JavaScript Error object
                failureReason: response
              };
              // Rethrow for handling by upstream code
              reject(reply);
            }
          });
      });
    }

    /**
     *
     * @param {object} dataPayload
     * @param {string} authorization
     * @param {string} url
     * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
     * @private
     */
    function postReplyConnectionData(dataPayload, authorization, url) {
      return HttpAdapter.post(
        url,
        dataPayload,
        undefined,
        authorization)
        .then(reply => {
          reply['body'] = {
            data: reply.responseJSON,
            messages: getResponseJSONMessages(reply.responseJSON)
          };
          delete reply.responseJSON;
          return Promise.resolve(reply);
        })
        .catch(response => {
          const reply = {
            body: {
              data: {}
            }
          };
          if (CoreUtils.isNotUndefinedNorNull(response.status)) {
            // This means the reject was not from
            // a JavaScript Error being thrown
            reply['failureType'] = CoreTypes.FailureType.CBE_REST_API;
            reply['failureReason'] = response.statusText;
            reply['transport'] = {
              status: response.status,
              statusText: response.statusText
            };
            return response.json()
              .then(responseJSON => {
                reply.body['messages'] = responseJSON.messages;
                return Promise.reject(reply);
              })
              .catch(error => {
                // Response body does not contain JSON, so
                // just set reply.body["messages"] = [] to
                // honor the interface contract, when failure
                // type is CBE_REST_API.
                reply.body['messages'] = [];
                // Rethrow for handling by upstream code
                return Promise.reject(reply);
              });
          }
          else {
            // Reject came from a JavaScript Error
            // being thrown.
            const reply = {
              failureType: CoreTypes.FailureType.UNEXPECTED,
              // The reply parameter passed to the
              // .catch link in the chain, will be
              // the JavaScript Error object
              failureReason: response
            };
            // Rethrow for handling by upstream code
            return Promise.reject(reply);
          }
        });
    }

    function getResponseJSONMessages(responseJSON) {
      let messages = [];
      if (typeof responseJSON !== 'undefined' && typeof responseJSON.messages !== 'undefined') {
        responseJSON.messages.forEach((message) => {
          if (typeof message.message !== 'undefined') {
            messages = [message];
          }
          else if (typeof message.property === 'undefined') {
            if (message.message.indexOf('{') !== -1)
              messages = JSON.parse(message.message);
            else
              messages.push(message);

            if (typeof messages.messages !== 'undefined') {
              messages = messages.messages;
            }
          }
        });
      }
      return messages;
    }

    function hasResponseMessages(data) {
      return (typeof data !== 'undefined' && typeof data.responseJSON !== 'undefined' && typeof data.responseJSON.messages !== 'undefined');
    }

    function getSessionToken(responseSessionToken) {
      let sessionToken = Runtime.getProperty('X-Session-Token');
      if (responseSessionToken) sessionToken = responseSessionToken;
      return sessionToken;
    }
  
  //public:
    return {
      /**
       *
       * @param {string} message - The error message
       * @param {object} [extra] - Optional data to associate with the error
       * @constructor
       * @extends Error
       * @type {{message: string, [extra]: object}}
       */
      ServiceTypeNotFoundError: function ServiceTypeNotFoundError(message, extra) {
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
        if (extra) this.extra = extra;
      },

      /**
       * Determine if any data will be retrieved for a given ``uri``
       * <p>There are scenarios (like cross-links) where the CFE needs to make sure the link to a page in a different perspective is actually going to call up that page, before the other perspective is even loaded. If you don't do this, you're going to end up with a blank content area when there is no data behind the URL.</p>
       * @param {string} uri
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      testUri: function (uri) {
        return getData.call(this, {url: `${Runtime.getBackendUrl()}${uri}` });
      },

      /**
       * Returns aggregation of data for a RDJ and it's associated PDJ.
       * @param {string} uri
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      getAggregatedData: function (uri) {
        return new Promise((resolve, reject) => {
          let rdjUrl = uri;
          if (!rdjUrl.startsWith(Runtime.getBackendUrl())) {
            rdjUrl = `${Runtime.getBackendUrl()}${uri}`;
          }
          getData.call(this, {url: rdjUrl})
            .then(reply => {
              return {rdjUrl: rdjUrl, rdjData: reply.body.data};
            })
            .then(reply => {
              const aggregatedData = new CbeDataStorage(uri);
              aggregatedData.add('rawPath', uri);
              aggregatedData.add('rdjUrl', reply.rdjUrl);
              aggregatedData.add('rdjData', reply.rdjData);
              aggregatedData.add('pdjUrl', Runtime.getBackendUrl()+reply.rdjData.pageDescription);
              return aggregatedData;
            })
            .then(aggregatedData => {
              return getData.call(this, {url: aggregatedData.get('pdjUrl')})
                .then((reply) => {
                  aggregatedData.add('pdjData', reply.body.data);
                  reply.body['data'] = aggregatedData;
                  reply.body['data'].add('pageTitle', `${Runtime.getName()} - ${reply.body.data.get('pdjData').helpPageTitle}`);
                  resolve(reply);
                });
            })
            .catch(response =>{
              if (response.failureType === CoreTypes.FailureType.UNEXPECTED) {
                response['failureReason'] = response.failureReason.stack;
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
              reject(response);
            });
        });
      },

      /**
       *
       * @param {string} uri
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      putData: function (uri) {
        return new Promise((resolve, reject) => {
          let rdjUrl = uri;
          if (!rdjUrl.startsWith(Runtime.getBackendUrl())) {
            rdjUrl = `${Runtime.getBackendUrl()}${uri}`;
          }
          getData.call(this, {url: rdjUrl})
            .then(reply => {
              return {rdjUrl: rdjUrl, rdjData: reply.body.data};
            })
            .then(reply => {
              const aggregatedData = new CbeDataStorage(uri);
              aggregatedData.add('rawPath', uri);
              aggregatedData.add('rdjUrl', reply.rdjUrl);
              aggregatedData.add('rdjData', reply.rdjData);
              aggregatedData.add('pdjUrl', Runtime.getBackendUrl()+reply.rdjData.pageDescription.replace('?view=table', '?view=createForm'));
              return aggregatedData;
            })
            .then(aggregatedData => {
              return getData.call(this, {url: aggregatedData.get('pdjUrl')})
                .then((reply) => {
                  aggregatedData.add('pdjData', reply.body.data);
                  reply.body['data'] = aggregatedData;
                  reply.body['data'].add('pageTitle', `${Runtime.getName()} - ${reply.body.data.get('pdjData').helpPageTitle}`);
                  resolve(reply);
                });
            })
            .catch(response =>{
              if (response.failureType === CoreTypes.FailureType.UNEXPECTED) {
                response['failureReason'] = response.failureReason.stack;
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
              reject(response);
            });
        });
      },

      /**
       *
       * @param {{serviceType: ServiceType, serviceComponentType: ServiceComponentType, uri: string}|{url: string}} options
       * @param {object} dataPayload
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      postData: function (options, dataPayload) {
        return postData.call(this, options, dataPayload);
      },

      /**
       *
       * @param {string} url
       * @param {object} dataPayload
       * @param {boolean} isFullPayload - Flag indicating whether ``dataPayload`` contains a JS property named "action", not not. Defaults to false.
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      postPayloadData: function (url, dataPayload, isFullPayload = false) {
        return new Promise((resolve, reject) => {
          if (!url.startsWith(Runtime.getBackendUrl())) {
            url = `${Runtime.getBackendUrl()}${url}`;
          }
          // Wrap dataPayload variable in a JS property named "data",
          // if isFullPayload is false.
          const data = (!isFullPayload ? JSON.stringify({ data: dataPayload }) : JSON.stringify(dataPayload));
          const jqXHR = $.ajax({
            type: 'POST',
            url: url,
            data: data,
            contentType: 'application/json',
            dataType: 'json',
            beforeSend: function ( jqXHR, settings) {
              const sessionToken = getSessionToken(Runtime.getProperty('X-Session-Token'));
              if (sessionToken) {
                jqXHR.setRequestHeader('X-Session-Token', sessionToken);
              }
            },
            xhrFields: { withCredentials: true },
          });
          // The data argument is what's in the response body,
          // while the jqXHR argument is the response metadata
          // and response body.
          jqXHR
            .then((data, textStatus, jqXHR) => {
              resolve({
                transport: {
                  status: jqXHR.status,
                  statusText: jqXHR.statusText
                },
                body: {
                  data: jqXHR.responseJSON,
                  messages: getResponseJSONMessages(jqXHR.responseJSON.data)
                }
              });
            })
            .fail((jqXHR, textStatus, errorThrown) => {
              // jqXHR is the main thing we need here.
              // jqXHR.responseJSON is the response body and
              // it's better to get the transport status
              // values from there, as well. errorThrown is
              // not a JavaScript Error. It is the statusText
              // for the status (e.g. "Bad Request" for 400)
              reject({
                transport: {
                  status: jqXHR.status,
                  statusText: jqXHR.statusText
                },
                body: {
                  data: {},
                  messages: getResponseJSONMessages(jqXHR.responseJSON)
                },
                failureType: (jqXHR.status === 0 && jqXHR.statusText === 'error' ? CoreTypes.FailureType.CONNECTION_REFUSED : CoreTypes.FailureType.CBE_REST_API),
                failureReason: errorThrown
              });
            });
        });
      },

      /**
       *
       * @param {string} uri
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      reloadData: function (uri) {
        var url = new URL(uri);
        url.searchParams.set('reload', 'true');
        const reloadUri = url.toString();
        return getData.call(this, {url: reloadUri});
      },

      /**
       *
       * @param {string} uri
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      getData: function (uri) {
        const url = `${Runtime.getBackendUrl()}${uri}`;
        return getData.call(this, {url: url});
      },

      /**
       *
       * @param {string} url
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      deleteData: function (url) {
        return new Promise(function (resolve, reject) {
          if (!url.startsWith(Runtime.getBackendUrl())) {
            url = `${Runtime.getBackendUrl()}${url}`;
          }
          HttpAdapter.delete(url, {})
            .then(reply => {
              reply['body'] = {
                data: reply.responseJSON,
                messages: getResponseJSONMessages(reply.responseJSON)
              };
              delete reply.responseJSON;
              resolve(reply);
            })
            .catch(response => {
              const reply = {
                body: {
                  data: {}
                }
              };
              if (CoreUtils.isNotUndefinedNorNull(response.status)) {
                // This means the reject was not from
                // a JavaScript Error being thrown
                reply['failureType'] = CoreTypes.FailureType.CBE_REST_API;
                reply['failureReason'] = response.statusText;
                reply['transport'] = {
                  status: response.status,
                  statusText: response.statusText
                };
                return response.json()
                  .then(responseJSON => {
                    reply.body['messages'] = responseJSON.messages;
                    reject(reply);
                  })
                  .catch(error => {
                    // Response body does not contain JSON, so
                    // just set reply.body["messages"] = [] to
                    // honor the interface contract, when failure
                    // type is CBE_REST_API.
                    reply.body['messages'] = [];
                    // Rethrow for handling by upstream code
                    reject(reply);
                  });
              }
              else {
                // Reject came from a JavaScript Error
                // being thrown.
                const reply = {
                  failureType: CoreTypes.FailureType.UNEXPECTED,
                  // The reply parameter passed to the
                  // .catch link in the chain, will be
                  // the JavaScript Error object
                  failureReason: response
                };
                // Rethrow for handling by upstream code
                reject(reply);
              }
            });
        });
      },

      /**
       * Returns information about the session the CBE has with a WLS domain it is connected to
       * @param {string} uri - Resource path sent to CBE REST API endpoint. This does not include the ``scheme://host:port`` portion of the URL.
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      getChangeManagerData: function (uri) {
        return getData.call(this, {url: `${Runtime.getBackendUrl()}${uri}`});
      },

      /**
       * Update edit session the CBE has with a WLS domain it is connected to.
       * <p>This method is used fot both committing and discarding previously saved changes.</p>
       * @param {string} uri - Resource path sent to CBE REST API endpoint. This does not include the ``scheme://host:port`` portion of the URL.
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      postChangeManagerData: function (uri) {
        return postData.call(this, {url: `${Runtime.getBackendUrl()}${uri}`}, {});
      },

      /**
       * Sends data pertaining to a lifecycle action to the CBE REST API.
       * @param {string} uri - Resource path sent to CBE REST API endpoint. This does not include the ``scheme://host:port`` portion of the URL.
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      postActionData: function (uri) {
        const actionUrl = `${Runtime.getBackendUrl()}${uri}`;
        return postData.call(this, {url: actionUrl}, {})
          .then(reply => {
            reply.body['data'] = {actionUrl: actionUrl};
            return Promise.resolve(reply);
          });
      },

      /**
       * Sends a ``multipart/form-data`` POST request to the CBE REST endpoint
       * @param {string} url - URL for endpoint accepting ``multipart/form-data`` POST requests
       * @param {object} formData - Data to use in ``multipart/form-data`` POST request sent to CBE REST API endpoint
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      postMultipartFormData: function (url, formData) {
        return new Promise((resolve, reject) => {
          const jqXHR = $.ajax({
            type: 'POST',
            enctype: 'multipart/form-data',
            url: url,
            beforeSend: function ( jqXHR, settings) {
              const sessionToken = getSessionToken(Runtime.getProperty('X-Session-Token'));
              if (sessionToken) {
                jqXHR.setRequestHeader('X-Session-Token', sessionToken);
              }
            },
            data: formData,
            processData: false,
            contentType: false,
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            cache: false
          });
          // The data argument is what's in the response body,
          // while the jqXHR argument is the response metadata
          // and response body.
          jqXHR
            .then((data, textStatus, jqXHR) => {
              const sessionToken = getSessionToken(jqXHR.getResponseHeader('X-Session-Token'));
              Runtime.setProperty('X-Session-Token', sessionToken);
              resolve({
                transport: {
                  status: jqXHR.status,
                  statusText: jqXHR.statusText
                },
                body: {
                  data: data,
                  messages: []
                }
              });
            })
            .fail((jqXHR, textStatus, errorThrown) => {
              // jqXHR is the main thing we need here.
              // jqXHR.responseJSON is the response body and
              // it's better to get the transport status
              // values from there, as well. errorThrown is
              // not a JavaScript Error. It is the statusText
              // for the status (e.g. "Bad Request" for 400)
              reject({
                transport: {
                  status: jqXHR.status,
                  statusText: jqXHR.statusText
                },
                body: {
                  data: jqXHR.responseJSON,
                  messages: getResponseJSONMessages(jqXHR.responseJSON)
                },
                failureType: CoreTypes.FailureType.CBE_REST_API,
                failureReason: errorThrown
              });
            });
        });
      },

      /**
       *
       * @param {string} url
       * @returns {{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}}
       */
      isNavTreeLeaf: function (url) {
        let response;
        $.ajax({
          type: 'GET',
          url: url,
          async: false,
          success: function (data, textStatus, jqXHR) {
            // The data argument is what's in the response body,
            // while the jqXHR argument is the response metadata
            // and response body.
            response = {
              transport: {
                status: jqXHR.status,
                statusText: jqXHR.statusText
              },
              body: {
                data: jqXHR.responseJSON.data,
                messages: getResponseJSONMessages(jqXHR.responseJSON.data)
              }
            };
          },
          error: function(jqXHR, textStatus, errorThrown) {
            // jqXHR is the main thing we need here.
            // jqXHR.responseJSON is the response body and
            // it's better to get the transport status
            // values from there, as well. errorThrown is
            // not a JavaScript Error. It is the statusText
            // for the status (e.g. "Bad Request" for 400)
            response = {
              transport: {
                status: jqXHR.status,
                statusText: jqXHR.statusText
              },
              body: {
                data: {},
                messages: getResponseJSONMessages(jqXHR.responseJSON)
              },
              failureType: CoreTypes.FailureType.CBE_REST_API,
              failureReason: errorThrown
            };
          }
        });
        return response;
      },

      /**
       * Returns navtree data for a given ``navtreeUri`` and ``navtreeData`` object.
       * <p>Note that this uses an HTTP POST to get data, not an HTTP GET. Assign ``{}`` (and empty JS object) to ``navtreeData`` to get the "root" nodes of a given navtree.</p>
       * @param {string} navtreeUri - Value assigned to ``navtree`` field of dataProvider.beanTrees[index] JS object
       * @param {object} treeModel - JS object representing the "parent" node in a navtree
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       * @example [POST /api/bob/edit/navtree {}]
       * const reply = {
       *   body: {
       *     data: {
       *       "contents": [
       *          {"name": "Environment", "label": "Environment", "expandable": true, "type": "group" },
       *          {"name": "Scheduling", "label": "Scheduling", "expandable": true, "type": "group" },
       *          {"name": "Deployments", "label": "Deployments", "expandable": true, "type": "group" },
       *          {"name": "Services", "label": "Services", "expandable": true, "type": "group" },
       *          {"name": "Security", "label": "Security", "expandable": true, "type": "group" },
       *          {"name": "Interoperability", "label": "Interoperability", "expandable": true, "type": "group" },
       *          {"name": "Diagnostics", "label": "Diagnostics", "expandable": true, "type": "group" },
       *       ]
       *     },
       *     messages: []
       *   }
       * }
       */
      getNavtreeData: function(navtreeUri, treeModel) {
        return postData.call(this, {url: Runtime.getBackendUrl() + navtreeUri}, treeModel);
      },

      /**
       *
       * @param {ServiceType} serviceType
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      getConnectionData: function (serviceType) {
        const url = getUrlByServiceType.call(this, serviceType);
        return getData.call(this, {url: url});
      },

      /**
       *
       * @param {object} dataPayload
       * @param {string} authorization
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       * @example:
       * POST /api/providers
       *
       *  dataPayload = {
       *    "name": <dataProvider.id>,
       *    "providerType": "AdminServerConnection",
       *    "domainUrl": <dataProvider.url>
       *  }
       */
      stageConnectionData: function (dataPayload, authorization) {
        const url = getUrlByServiceType.call(this, CbeTypes.ServiceType.PROVIDERS);
        return postReplyConnectionData(dataPayload, authorization, `${url}`);
      },

      /**
       *
       * @param {string} dataProviderId
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       * @example:
       * [GET /api/providers/<dataProviderId>?action=test]
       */
      useConnectionData: function (dataProviderId) {
        const url = getUrlByServiceType.call(this, CbeTypes.ServiceType.PROVIDERS);
        return new Promise((resolve, reject) => {
          const jqXHR = $.ajax({
            type: 'GET',
            url: `${url}/${dataProviderId}?action=test`,
            beforeSend: function ( jqXHR, settings) {
              const sessionToken = getSessionToken(Runtime.getProperty('X-Session-Token'));
              if (sessionToken) {
                jqXHR.setRequestHeader('X-Session-Token', sessionToken);
              }
            },
            xhrFields: { withCredentials: true },
            async: false
          });
          // The data argument is what's in the response body,
          // while the jqXHR argument is the response metadata
          // and response body.
          jqXHR
            .then((data, textStatus, jqXHR) => {
              resolve({
                transport: {
                  status: jqXHR.status,
                  statusText: jqXHR.statusText
                },
                body: {
                  data: jqXHR.responseJSON,
                  messages: []
                }
              });
            })
            .fail((jqXHR, textStatus, errorThrown) => {
              // jqXHR is the main thing we need here.
              // jqXHR.responseJSON is the response body and
              // it's better to get the transport status
              // values from there, as well. errorThrown is
              // not a JavaScript Error. It is the statusText
              // for the status (e.g. "Bad Request" for 400)
              resolve({
                transport: {
                  status: jqXHR.status,
                  statusText: jqXHR.statusText
                },
                body: {
                  data: jqXHR.responseJSON,
                  messages: []
                },
                failureType: CoreTypes.FailureType.CBE_REST_API,
                failureReason: errorThrown
              });
            });
        });
      },

      /**
       *
       * @param {string} dataProviderId
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       * @example:
       * DELETE /api/providers/AdminServerConnection/<dataProvider.id>
       */
      deleteConnectionData: function (dataProviderId) {
        const url = getUrlByServiceType.call(this, CbeTypes.ServiceType.PROVIDERS);
        return deleteData.call(this, {url: `${url}/AdminServerConnection/${dataProviderId}`});
      },

      getSliceData: function(uri) {
        return new Promise((resolve, reject) => {
          const rdjUrl = `${Runtime.getBackendUrl()}${uri}`;
          getData.call(this, {url: rdjUrl})
            .then(reply => {
              return {rdjUrl: rdjUrl, rdjData: reply.body.data};
            })
            .then(reply => {
              const aggregatedData = new CbeDataStorage(uri);
              aggregatedData.add('rawPath', uri);
              aggregatedData.add('rdjUrl', reply.rdjUrl);
              aggregatedData.add('rdjData', reply.rdjData);
              aggregatedData.add('pdjUrl', `${Runtime.getBackendUrl()}${reply.rdjData.pageDescription}`);
              return aggregatedData;
            })
            .then(aggregatedData => {
              return getData.call(this, {url: aggregatedData.get('pdjUrl')})
                .then((reply) => {
                  aggregatedData.add('pdjData', reply.body.data);
                  reply.body['data'] = aggregatedData;
                  reply.body['data'].add('pageTitle', `${Runtime.getName()} - ${reply.body.data.get('pdjData').helpPageTitle}`);
                  resolve(reply);
                });
            })
            .catch(response =>{
              if (response.failureType === CoreTypes.FailureType.UNEXPECTED) {
                response['failureReason'] = response.failureReason.stack;
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
              reject(response);
            });
        });
      },

      getBundle: function (url) {
        return new Promise((resolve, reject) => {
          const jqXHR = $.ajax({
            type: 'GET',
            url: url,
            async: false
          });
          // The data argument is what's in the response body,
          // while the jqXHR argument is the response metadata
          // and response body.
          jqXHR
            .then((data, textStatus, jqXHR) => {
              resolve({
                transport: {
                  status: jqXHR.status,
                  statusText: jqXHR.statusText
                },
                body: {
                  data: jqXHR.data,
                  messages: []
                }
              });
            })
            .fail((jqXHR, textStatus, errorThrown) => {
              // jqXHR is the main thing we need here.
              // jqXHR.responseJSON is the response body and
              // it's better to get the transport status
              // values from there, as well. errorThrown is
              // not a JavaScript Error. It is the statusText
              // for the status (e.g. "Bad Request" for 400)
              reject({
                transport: {
                  status: jqXHR.status,
                  statusText: jqXHR.statusText
                },
                body: {
                  data: {},
                  messages: getResponseJSONMessages(jqXHR.responseJSON)
                },
                failureType: CoreTypes.FailureType.CBE_REST_API,
                failureReason: errorThrown
              });
            });
        });
      },

      uploadProviderFormData: function(formData, providerType) {
        const url = getUrlByServiceType.call(this, CbeTypes.ServiceType.PROVIDERS);
        return this.postMultipartFormData(`${url}/${providerType}`, formData);
      },

      downloadProviderData: function(uri) {
        return new Promise((resolve, reject) => {
          const jqXHR = $.ajax({
            type: 'GET',
            url: `${Runtime.getBackendUrl()}${uri}`,
            beforeSend: function ( jqXHR, settings) {
              if (Runtime.getProperty('X-Session-Token')) {
                jqXHR.setRequestHeader('X-Session-Token', Runtime.getProperty('X-Session-Token'));
              }
            },
            xhrFields: { withCredentials: true }
          });

          jqXHR
            .then((data, textStatus, jqXHR) => {
              resolve({
                transport: {
                  status: jqXHR.status,
                  statusText: jqXHR.statusText
                },
                body: {
                  data: data,
                  messages: []
                }
              });
            })
            .fail((jqXHR, textStatus, errorThrown) => {
              // jqXHR is the main thing we need here.
              // jqXHR.responseJSON is the response body and
              // it's better to get the transport status
              // values from there, as well. errorThrown is
              // not a JavaScript Error. It is the statusText
              // for the status (e.g. "Bad Request" for 400)
              reject({
                transport: {
                  status: jqXHR.status,
                  statusText: jqXHR.statusText
                },
                body: {
                  data: jqXHR.responseJSON,
                  messages: []
                },
                failureType: CoreTypes.FailureType.CBE_REST_API,
                failureReason: errorThrown
              });
            });
        });
      },

      /**
       *
       * @param {string} dataProviderId
       * @param {string} providerType - CBE type for provider. See ``CbeTypes.ProviderType`` frozen object.
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       * @example:
       * GET /api/providers/WDTModel/<dataProvider.id>
       */
      useProviderData: function (dataProviderId, providerType) {
        const url = getUrlByServiceType.call(this, CbeTypes.ServiceType.PROVIDERS);
        return getData.call(this, {url: `${url}/${providerType}/${dataProviderId}`});
      },

      /**
       *
       * @param {string} dataProviderId
       * @param {string} providerType - CBE type for provider. See ``CbeTypes.ProviderType`` frozen object.
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       * @example:
       * DELETE /api/providers/WDTModel/<dataProvider.id>
       */
       deleteProviderData: function(dataProviderId, providerType) {
        const url = getUrlByServiceType.call(this, CbeTypes.ServiceType.PROVIDERS);
        return deleteData.call(this, {url: `${url}/${providerType}/${dataProviderId}`});
      },

      /**
       * Test the WDT Composite Model provider
       * @param {string} dataProviderId
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      useCompositeData: function (dataProviderId) {
        const url = getUrlByServiceType.call(this, CbeTypes.ServiceType.PROVIDERS);
        return getData.call(this, {url: `${url}/WDTCompositeModel/${dataProviderId}?action=test`});
      },

      /**
       * Delete the WDT Composite Model proivider
       * @param {string} dataProviderId
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      deleteCompositeData: function(dataProviderId) {
        const url = getUrlByServiceType.call(this, CbeTypes.ServiceType.PROVIDERS);
        return deleteData.call(this, {url: `${url}/WDTCompositeModel/${dataProviderId}`});
      },

      listDataProviders: function() {
        const url = getUrlByServiceType.call(this, CbeTypes.ServiceType.PROVIDERS);
        return getData.call(this, {url: url});
      }

    };

  }
);
