/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(
  function() {
    /**
     * 
     * @param {string} weblogicVersion 
     */
    function Resource(weblogicVersion){
      this.weblogicVersion = weblogicVersion;
    }

    Resource.Type = Object.freeze({
      PDJ: {name: "PDJ"},
      RDJ: {name: "RDJ"}
    });

    Resource.prototype = {
      getWeblogicVersion: function() {
        return this.weblogicVersion;
      }
    };

    return Resource;
  }
);