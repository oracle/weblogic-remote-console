/**
 * @license
 * Copyright (c) 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
*/

'use strict';

/**
 * Module that returns a Singleton object that functions as an HTTP client.
 * <p>Both synchronous and asynchronous methods are provided. The former provides a <code>callbacks</code> parameter that contains references to callback functions, while the latter uses promises.</p>
 */
define(['ojs/ojcore'],
  function (oj) {
    const USER_AGENT = "cfe/http/adapter";
    const APPLICATION_JSON = "application/json";

    function status(response) {
      if (response.status >=  200 && response.status < 300) {
        return Promise.resolve(response);
      }
      else {
        return Promise.reject(response);
      }
    }

    function asJson(response) {
      return response.json();
    }

    function asReply(response) {
      let status = response.status;
      return response.json()
      .then((data) => {
        let reply = {
          data: data,
          status: status
        };
        return reply;
      })
      .catch((error) => {
        let reply = {
          error: error,
          status: status
        };
        return reply;
      });
    }

    function get(url) {
      return fetch(url, {
        method: "get",
        credentials: "include",
        headers: {
          "User-Agent": USER_AGENT
        }
      })
      .then(status)
      .then(asJson)
      .then((data) => {
         return data;
      });
    }

    function getPostHeaders(contentType, authorization) {
      let headers = new Headers();
      let type = (typeof contentType === "undefined" ? APPLICATION_JSON : contentType);
      headers.append("Content-type", type);
      headers.append("User-Agent", USER_AGENT);
      if (typeof authorization !== "undefined")
        headers.append("Authorization", authorization);
      return headers;
    }

    function post(url, content, contentType, authorization) {
      // Create the headers based on parameters
      let headers = getPostHeaders(contentType, authorization);

      // Make the request using the url and content then return the data
      return fetch(url, {
        method: "post",
        credentials: "include",
        headers: headers,
        body: JSON.stringify(content)
      })
      .then(status)
      .then(asJson)
      .then(function(data) {
        return data;
      });
    }

    function postReply(url, content, contentType, authorization) {
      // Create the headers based on parameters
      let headers = getPostHeaders(contentType, authorization);

      // Make the request using the url and content then return a reply
      return fetch(url, {
        method: "post",
        credentials: "include",
        headers: headers,
        body: JSON.stringify(content)
      })
      .then(asReply)
      .then((reply) => {
        return reply;
      });
    }

    function _delete(url) {
      return fetch(url, {
        method: "delete",
        credentials: "include",
        headers: {
          "User-Agent": USER_AGENT
        }
      })
      .then(function(status) {
        return status;
      });
    }

    return {
      perform: function (method, url, model, callbacks) {
        switch (method) {
          case "get":
            return oj.sync('read', model, callbacks);
          case "post":
            return oj.sync('update', model, callbacks);
          case "delete":
            return oj.sync('delete', model, callbacks);
          }
      },

      get: function (url) {
        return get(url);
      },

      post: function (url, content, contentType, authorization) {
        return post(url, content, contentType, authorization);
      },

      postReply: function (url, content, contentType, authorization) {
        return postReply(url, content, contentType, authorization);
      },

      delete: function (url) {
        return _delete(url);
      }
    }
  }
);
