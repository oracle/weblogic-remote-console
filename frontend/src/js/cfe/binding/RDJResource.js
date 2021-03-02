/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['cfe/binding/Resource'],
  function (Resource) {
    function RDJResource(content) {
      Resource.call(this, content['weblogicVersion']);
      if (content['data'] !== undefined) this.data = content['data'];
      if (content['messages'] !== undefined) this.messages = content['messages'];
      if (content['pageDefinition'] !== undefined) this.pageDefinition = content['pageDefinition'];
      if (content['save'] !== undefined) this.save = content['save'];
    }

    // Allow properties of Resource 'superclass' to be access 
    // by RDJResource object 'subclass'
    RDJResource.prototype = Object.create(Resource.prototype);

    RDJResource.prototype.getData = function() {
      return (this.data ? this.data : undefined);
    };

    RDJResource.prototype.getMessages = function() {
      return (this.messages ? this.messages : undefined);
    };

    RDJResource.prototype.getPageDefinition = function() {
      return (this.pageDefinition ? this.pageDefinition : undefined);
    };

    RDJResource.prototype.getSave = function() {
      return (this.save ? this.save : undefined);
    };

    // Return RDJResource constructor function
    return RDJResource;
  }
);