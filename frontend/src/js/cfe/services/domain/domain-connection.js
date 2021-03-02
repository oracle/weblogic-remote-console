/**
 * @license
 * Copyright (c) 2020, Oracle Corporation and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

/**
 * Class representing the metadata for a connection to a WebLogic REST API endpoint.
 */
define(
  function(){
    /**
     *  Create metadata for a connection to a WebLogic REST API endpoint.
     * @param {string} id - The unique identifier for the connection.
     * @param {string} name - The domain name associated with the connection.
     * @param {string} version - The domain version associated with the connection.
     * @param {string} username - The username associated with the connection.
     * @param {string} listenAddress - The hostname or IP associated with the connection.
     * @param {number} listenPort - The port associated with the connection.
     * @param {boolean} isDefault - Flag indicating if this metadata is for the default connection, or not.
     */
    function DomainConnection(id, name, version, username, listenAddress, listenPort, isDefault){
      this.id = id;
      this.name = name;
      this.version = version;
      this.username = username;
      this.listenAddress = listenAddress;
      this.listenPort = listenPort;
      this.isDefault = isDefault;
    }

    DomainConnection.prototype = {
      /**
       * Get the id associated with the connection.
       * @returns {string} The id associated with the connection.
       */
      id: function() { return this.id; },
      /**
       * Get the domain name associated with the connection.
       * @returns {string}
       */
      name: function() { return this.name; },
      /**
       * Get the domain version associated with the connection.
       * @returns {string}
       */
      version: function() { return this.version; },
      /**
       * Get the username associated with the connection.
       * @returns {string}
       */
      username: function() { return this.username; },
      /**
       * Get the hostname or IP associated with the connection.
       * @returns {string}
       */
      listenAddress: function() { return this.listenAddress; },
      /**
       * Get the port associated with the connection.
       * @returns {number}
       */
      listenPort: function() { return this.listenPort; },
      /**
       * Get flag indicating if this metadata is for the default connection, or not.
       * @returns {boolean}
       */
      isDefault: function() { return this.isDefault; }
    };

    return DomainConnection;
  }
);
