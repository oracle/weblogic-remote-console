/**
 * @license
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

/**
 * Module for retrieving data from the CBE using the CBE REST API.
 * <p>IMPORTANT: If you see, or are yourself putting any JET-related modules in the <code>define()</code> function, it is a violation of the SoC (separation of concerns) best practice. There should be no JET-related modules (not even the Logger) being imported into this module!!</p>
 * @module
 */
define(['jquery', '../../core/adapters/http-adapter', '../../core/runtime', './cbe-data-storage', '../../core/cbe-types', '../../core/cbe-utils' , '../../core/types', "../../core/utils"],
  function ($, HttpAdapter, Runtime, CbeDataStorage, CbeTypes, CbeUtils, CoreTypes, CoreUtils) {
    const i18n = {
      messages: {
        "cfeApi": {
          "serviceNotDefined": {detail: "'{0}' service not defined in console-frontend-jet.yaml file."}
        }
      }
    };

    function getServiceConfigComponentURL(serviceType, serviceComponentType, uri){
      const serviceConfig = Runtime.getServiceConfig(serviceType);
      if (typeof serviceConfig === "undefined") throw new this.ServiceTypeNotFoundError(i18n.messages.serviceNotDefined.detail.replace("{0}", serviceType.name));
      return Runtime.getBaseUrl() + serviceConfig.path + "/" + serviceComponentType.name + "/" + uri;
    }

    function getUriById (serviceType, serviceComponentType, id){
      const serviceConfig = Runtime.getServiceConfig(serviceType);
      if (typeof serviceConfig === "undefined") throw new this.ServiceTypeNotFoundError(i18n.messages.serviceNotDefined.detail.replace("{0}", serviceType.name));
      const component = serviceConfig.components[serviceComponentType.name].find(item => item.id === id);
      let path = serviceConfig.path ;
      if (typeof component.prefix !== "undefined") {
        path = path + component.prefix;
      }
      return Runtime.getBaseUrl() + path + component.uri;
    }

    function getUrlBySelector (serviceType, serviceComponentType, selector) {
      let url;

      if (typeof selector.id !== "undefined") {
        url = getUriById.call(this, serviceType, serviceComponentType, selector.id);
      }
      else if (typeof selector.uri !== "undefined") {
        url = getServiceConfigComponentURL.call(this, serviceType, serviceComponentType, selector.uri);
      }

      return url;
    }

    function getUrlByServiceType(serviceType) {
      const serviceConfig = Runtime.getServiceConfig(serviceType);
      if (typeof serviceConfig === "undefined") throw new this.ServiceTypeNotFoundError(i18n.messages.cfeApi.serviceNotDefined.detail.replace("{0}", serviceType.name));
      return Runtime.getBaseUrl() + serviceConfig.path;
    }

    /**
     * Returns a ``url`` based on the contents of the ``options`` parameter.
     * @param {{serviceType: ServiceType, serviceComponentType: ServiceComponentType, id: string}|{serviceType: ServiceType, serviceComponentType: ServiceComponentType, uri: string}|{url: string}} options
     * @returns {string|}
     */
    function getUrl(options) {
      let url;
      if (typeof options.id !== "undefined") {
        // Need to use .call(this, ...) here, because
        // getUrlById() uses the "this" variable inside
        // it's implementation
        url = getUriById.call(this, options.serviceType, options.serviceComponentType, options.id);
      }
      else if (typeof options.url !== "undefined") {
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
        HttpAdapter.get(getUrl.call(this, options))
          .then(reply => {
            reply["body"] = {
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
              reply["failureType"] = CoreTypes.FailureType.CBE_REST_API;
              reply["failureReason"] = response.statusText;
              reply["transport"] = {
                status: response.status,
                statusText: response.statusText
              };
              return response.json()
                .then(responseJSON => {
                  reply.body["messages"] = responseJSON.messages;
                  reject(reply);
                })
                .catch(error => {
                  // Response body does not contain JSON, so
                  // just set reply.body["messages"] = [] to
                  // honor the interface contract, when failure
                  // type is CBE_REST_API.
                  reply.body["messages"] = [];
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
            reply["body"] = {
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
              reply["failureType"] = CoreTypes.FailureType.CBE_REST_API;
              reply["failureReason"] = response.statusText;
              reply["transport"] = {
                status: response.status,
                statusText: response.statusText
              };
              return response.json()
                .then(responseJSON => {
                  reply.body["messages"] = responseJSON.messages;
                  reject(reply);
                })
                .catch(error => {
                  // Response body does not contain JSON, so
                  // just set reply.body["messages"] = [] to
                  // honor the interface contract, when failure
                  // type is CBE_REST_API.
                  reply.body["messages"] = [];
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

    function getResponseJSONMessages(responseJSON) {
      let messages = [];
      if (typeof responseJSON !== "undefined" && typeof responseJSON.messages !== "undefined") {
        responseJSON.messages.forEach((message) => {
          if (typeof message.message !== "undefined") {
            messages = [message];
          }
          else if (typeof message.property === 'undefined') {
            if (message.message.indexOf("{") !== -1)
              messages = JSON.parse(message.message);
            else
              messages.push(message);

            if (typeof messages.messages !== "undefined") {
              messages = messages.messages;
            }
          }
        });
      }
      return messages;
    }

    function hasResponseMessages(data) {
      return (typeof data !== "undefined" && typeof data.responseJSON !== "undefined" && typeof data.responseJSON.messages !== "undefined");
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
       * @param {{serviceType: ServiceType, serviceComponentType: ServiceComponentType, uri: string}|{url: string}} options
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      testUri: function (options) {
        const url = getUrl.call(this, options);
        return getData.call(this, {url: url});
      },

      /**
       * Returns aggregation of data for a RDJ and it's associated PDJ.
       * @param {ServiceType} serviceType
       * @param {string} uri
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      getAggregatedData: function (serviceType, uri) {
        return new Promise((resolve) => {
          const rdjUrl = getUrl.call(this, {
            serviceType: serviceType,
            serviceComponentType: CbeTypes.ServiceComponentType.DATA,
            uri: uri
          });
          getData.call(this, {url: rdjUrl})
            .then(reply => {
              return {rdjUrl: rdjUrl, rdjData: reply.body.data};
            })
            .then(reply => {
              const aggregatedData = new CbeDataStorage(uri);
              aggregatedData.add("rdjUrl", reply.rdjUrl);
              aggregatedData.add("rdjData", reply.rdjData);
              aggregatedData.add("pdjUrl", getUrlByServiceType.call(this, serviceType) + "/" + CbeTypes.ServiceComponentType.PAGES.name + "/" + reply.rdjData.pageDefinition);
              return aggregatedData;
            })
            .then(aggregatedData => {
              return getData.call(this, {url: aggregatedData.get("pdjUrl")})
                .then((reply) => {
                  aggregatedData.add("pdjData", reply.body.data);
                  reply.body["data"] = aggregatedData;
                  resolve(reply);
                });
            });
        });
      },

      /**
       *
       * @param {ServiceType} serviceType
       * @param {string} uri
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      putData: function (serviceType, uri) {
        return new Promise((resolve) => {
          const rdjUrl = getUrl.call(this, {
            serviceType: serviceType,
            serviceComponentType: CbeTypes.ServiceComponentType.DATA,
            uri: uri
          });
          getData.call(this, {url: rdjUrl})
            .then(reply => {
              return {rdjUrl: rdjUrl, rdjData: reply.body.data};
            })
            .then(reply => {
              const aggregatedData = new CbeDataStorage(uri);
              aggregatedData.add("rdjUrl", reply.rdjUrl);
              aggregatedData.add("rdjData", reply.rdjData);
              aggregatedData.add("pdjUrl", getUrlByServiceType.call(this, serviceType) + "/" + CbeTypes.ServiceComponentType.PAGES.name + "/" + reply.rdjData.pageDefinition);
              return aggregatedData;
            })
            .then(aggregatedData => {
              return getData.call(this, {url: aggregatedData.get("pdjUrl")})
                .then((reply) => {
                  aggregatedData.add("pdjData", reply.body.data);
                  reply.body["data"] = aggregatedData;
                  resolve(reply);
                });
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
        return postData(options, dataPayload);
      },

      /**
       *
       * @param {{serviceType: ServiceType, serviceComponentType: ServiceComponentType, uri: string}|{url: string}} options
       * @param {object} dataPayload
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      postPayloadData: function (options, dataPayload) {
        return new Promise((resolve, reject) => {
          const url = getUrl.call(this, options);
          const jqXHR = $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify({data: dataPayload}),
            contentType: "application/json",
            dataType: 'json'
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
                  data: jqXHR.responseJSON.data,
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
                  data: jqXHR.responseJSON.data,
                  messages: getResponseJSONMessages(jqXHR.responseJSON.data)
                },
                failureType: CoreTypes.FailureType.CBE_REST_API,
                failureReason: errorThrown
              });
            });
        });
      },

      /**
       *
       * @param {{serviceType: ServiceType, serviceComponentType: ServiceComponentType, uri: string}|{url: string}} options
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      reloadData: function (options) {
        return getData.call(this, options);
      },

      /**
       *
       * @param {ServiceType} serviceType
       * @param {ServiceComponentType} serviceComponentType
       * @param {{uri: string | id: string}} selector
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      getData: function (serviceType, serviceComponentType, selector) {
        const url = getUrlBySelector.call(this, serviceType, serviceComponentType, selector);
        return getData.call(this, {url: url});
      },

      /**
       *
       * @param {string} url
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      deleteData: function (url) {
        return new Promise(function (resolve, reject) {
          HttpAdapter.delete(url, {})
            .then(reply => {
              reply["body"] = {
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
                reply["failureType"] = CoreTypes.FailureType.CBE_REST_API;
                reply["failureReason"] = response.statusText;
                reply["transport"] = {
                  status: response.status,
                  statusText: response.statusText
                };
                return response.json()
                  .then(responseJSON => {
                    reply.body["messages"] = responseJSON.messages;
                    reject(reply);
                  })
                  .catch(error => {
                    // Response body does not contain JSON, so
                    // just set reply.body["messages"] = [] to
                    // honor the interface contract, when failure
                    // type is CBE_REST_API.
                    reply.body["messages"] = [];
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
       * @param {string} id - Identifier for type of session the information is for. The possible values are "edit".
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      getChangeManagerData: function (id) {
        const url = getUrlBySelector.call(this, CbeTypes.ServiceType.CONFIGURATION, CbeTypes.ServiceComponentType.CHANGE_MANAGER, {id: id});
        return getData.call(this, {url: url});
      },

      /**
       * Update edit session the CBE has with a WLS domain it is connected to
       * <p>This method is used fot both committing and discarding previously saved changes.</p>
       * @param {string} id - Identifier for type of update being done. The possible values are "commit" and "discard".
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      postChangeManagerData: function (id) {
        const url = getUriById.call(this, CbeTypes.ServiceType.CONFIGURATION, CbeTypes.ServiceComponentType.CHANGE_MANAGER, id);
        return postData.call(this, {url: url}, {});
      },

      /**
       *
       * @param {string} uri - Path segments used to create URL sent to CBE REST API endpoint
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      postActionData: function (uri) {
        const actionUrl = Runtime.getBaseUrl() + "/" + uri;
        return postData.call(this, {url: actionUrl}, {})
          .then(reply => {
            reply.body["data"] = {actionUrl: actionUrl};
            return Promise.resolve(reply);
          });
      },

      /**
       * Sends a ``multipart/form-data`` POST request to the CBE REST endpoint
       * @param {string} url - URL for resource at CBE REST endpoint
       * @param {object} formData - Data to use in ``multipart/form-data`` POST request sent to CBE REST API endpoint
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      postMultipartFormData: function (url, formData) {
        return new Promise((resolve, reject) => {
          const jqXHR = $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: url,
            data: formData,
            processData: false,
            contentType: false,
            cache: false,
            dataType: 'json'
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
                  data: jqXHR.responseJSON.data,
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
                  data: jqXHR.responseJSON.data,
                  messages: getResponseJSONMessages(jqXHR.responseJSON.data)
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
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      getNavTreeData: function (url) {
        return new Promise((resolve, reject) => {
          const jqXHR = $.ajax({
            type: "GET",
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
                  data: jqXHR.responseJSON.data,
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
                  data: jqXHR.responseJSON.data,
                  messages: getResponseJSONMessages(jqXHR.responseJSON.data)
                },
                failureType: CoreTypes.FailureType.CBE_REST_API,
                failureReason: errorThrown
              });
            });
        });
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
       */
      postReplyConnectionData: function (dataPayload, authorization) {
        const url = getUrlByServiceType.call(this, CbeTypes.ServiceType.CONNECTING);
        return HttpAdapter.post(url, dataPayload, undefined, authorization)
          .then(reply => {
            reply["body"] = {
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
              reply["failureType"] = CoreTypes.FailureType.CBE_REST_API;
              reply["failureReason"] = response.statusText;
              reply["transport"] = {
                status: response.status,
                statusText: response.statusText
              };
              return response.json()
                .then(responseJSON => {
                  reply.body["messages"] = responseJSON.messages;
                  return Promise.reject(reply);
                })
                .catch(error => {
                  // Response body does not contain JSON, so
                  // just set reply.body["messages"] = [] to
                  // honor the interface contract, when failure
                  // type is CBE_REST_API.
                  reply.body["messages"] = [];
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
      },

      /**
       *
       * @returns {Promise<{transport?: {status: number, statusText: string}, body: {data: any, messages?: any}}|{failureType: FailureType, failureReason?: any}|{Error}>}
       */
      deleteConnectionData: function () {
        const url = getUrlByServiceType.call(this, CbeTypes.ServiceType.CONNECTING);
        return HttpAdapter.delete(url)
          .then(reply => {
            reply["body"] = {
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
              reply["failureType"] = CoreTypes.FailureType.CBE_REST_API;
              reply["failureReason"] = response.statusText;
              reply["transport"] = {
                status: response.status,
                statusText: response.statusText
              };
              return response.json()
                .then(responseJSON => {
                  reply.body["messages"] = responseJSON.messages;
                  return Promise.reject(reply);
                })
                .catch(error => {
                  // Response body does not contain JSON, so
                  // just set reply.body["messages"] = [] to
                  // honor the interface contract, when failure
                  // type is CBE_REST_API.
                  reply.body["messages"] = [];
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
      },
      getBundle: function (url) {
        return new Promise((resolve, reject) => {
          const jqXHR = $.ajax({
            type: "GET",
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
                  messages: []
                },
                failureType: CoreTypes.FailureType.CBE_REST_API,
                failureReason: errorThrown
              });
            });
        });
      }

    };

  }
);