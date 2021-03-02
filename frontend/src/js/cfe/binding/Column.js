/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['cfe/binding/Attribute'],
  function(Attribute) {
    function Column(data){
      // equivalent to super(data), in Java
      Attribute.call(this, data);
      if (data['array'] != undefined) this.array = data['array'];
      if (data['usedIf'] != undefined) this.usedIf = data['usedIf'];
    }

    // Allow properties of Attribute 'superclass' to be access 
    // by Column object 'subclass'
    Column.prototype = Object.create(Attribute.prototype);

    Column.prototype.isArray = function() {
      return (this.array ? this.array : undefined);
    };

    Column.prototype.getUsedIf = function() {
      return (this.usedIf ? this.usedIf : undefined);
    };
 
    // Return RDJResource constructor function
    return Column;
  }
);