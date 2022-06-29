/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

/**
 * Module that functions as an HTTP client.
 * <p>Both synchronous and asynchronous methods are exported. The former provides a <code>callbacks</code> parameter that contains references to callback functions, while the latter uses promises.</p>
 * @module
 */
define(['ojs/ojcore', 'wrc-frontend/core/runtime'],
  function (oj, Runtime) {
    const USER_AGENT = Object.freeze('core/adapters/http-adapter');
    const APPLICATION_JSON = Object.freeze('application/json');

    function status(response) {
      if (response.status >=  200 && response.status < 300) {
        // Completed successfully, so just return a
        // fulfillment Promise containing the response
        return Promise.resolve(response);
      }
      else {
        // Some type of HTTP error happened, so return
        // a rejection Promise containing the HTTP status
        // code and text from the response, in a transport
        // object.
        return Promise.reject(response);
      }
    }

    function asJson(response) {
      return response.json()
        .then(responseJSON => {
          return responseJSON;
        });
    }

    /**
     * This method has no .catch(reason) because we
     * intentionally let Promise rejections bubble
     * up. The reject will either come from the
     * .then(status), a JavaScript error (made by
     * the developer) or the fetch call itself. In
     * the first case, the status code and text will
     * have been stashed in the reject. For all others,
     * there will be no status code or text in the
     * reject. This difference is what we use to
     * distinguish a reject caused by a JavaScript
     * Error from one caused by a CBE REST API call.
     * @param {string} url
     * @returns {Promise<Response | never>}
     */
    function get(url) {
      const reply = {};
      const headers = new Headers();
      headers.append('User-Agent', USER_AGENT);
      if (Runtime.getProperty('X-Session-Token'))
        headers.append('X-Session-Token', Runtime.getProperty('X-Session-Token'));
      return fetch(url, {
        method: 'get',
        credentials: 'include',
        headers: headers
      })
      .then(status)
      .then(response => {
        return response.json()
          .then(data => {
            reply['responseJSON'] = data;
            return reply;
          })
          .catch(error => {
            // Response body does not contain JSON and
            // reply is already an empty object, so just
            // return reply
             return reply;
          });
      });
    }

    function getPostHeaders(contentType, authorization) {
      const headers = new Headers();
      headers.append('Content-type', (contentType || APPLICATION_JSON));
      headers.append('User-Agent', USER_AGENT);
      if (typeof authorization !== 'undefined') {
        headers.append('Authorization', authorization);
      }
      return headers;
    }

    function post(url, content, contentType, authorization) {
      // Create the HTTP request headers
      const headers = getPostHeaders(contentType, authorization);
      if (Runtime.getProperty('X-Session-Token'))
        headers.append('X-Session-Token', Runtime.getProperty('X-Session-Token'));
      const reply = {};
      // Make the request using the specified url
      // and a string representation of content.
      // There is no .catch(reason) here, because
      // we intentionally want Promise rejections
      // to bubble up.
      return fetch(url, {
        method: 'post',
        credentials: 'include',
        headers: headers,
        body: JSON.stringify(content)
      })
        .then(status)
        .then(response => {
          // Add a "transport" property to the reply
          // and populate it with transport-specific
          // info, in case the microservices or UI
          // API need it.
          reply['transport'] = {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          };
          return asJson(response);
        })
        .then(data => {
          // Add "responseJSON" property to the reply
          // and assign the fulfillment value to it.
          reply['responseJSON'] = data;
          return reply;
        });
    }

    function _delete(url) {
      const reply = {};
      const headers = new Headers();
      headers.append('User-Agent', USER_AGENT);
      if (Runtime.getProperty('X-Session-Token'))
        headers.append('X-Session-Token', Runtime.getProperty('X-Session-Token'));
      return fetch(url, {
        method: 'delete',
        credentials: 'include',
        headers: headers
      })
        .then(status)
        .then(response => {
          // Add a "transport" property to the reply
          // and populate it with transport-specific
          // info, in case the microservices or UI
          // API need it.
          reply['transport'] = {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          };
          return asJson(response);
        })
        .then(data => {
          // Add "responseJSON" property to the reply
          // and assign the fulfillment value to it.
          reply['responseJSON'] = data;
          return reply;
        });
    }

    return {
      perform: function (method, url, model, callbacks) {
        switch (method) {
          case 'get':
            return oj.sync('read', model, callbacks);
          case 'post':
            return oj.sync('update', model, callbacks);
          case 'delete':
            return oj.sync('delete', model, callbacks);
        }
      },

      get: function (url) {
        return get(url);
      },

      post: function (url, content, contentType, authorization) {
        return post(url, content, contentType, authorization);
      },

      delete: function (url) {
        return _delete(url);
      }
    }
  }
);
