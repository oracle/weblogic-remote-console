/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['cfe/binding/Attribute'],
  function(Attribute) {
    function Property(data){
      // equivalent to super(data), in Java
      Attribute.call(this, data);
      if (data['legalValues'] !== undefined) this.legalValues = data['legalValues'];
      if (data['selectableValue'] !== undefined) this.selectableValue = data['selectableValue'];
    }

    // Allow properties of Attribute 'superclass' to be access 
    // by Property object 'subclass'
    Property.prototype = Object.create(Attribute.prototype);

    Property.prototype.getLegalValues = function() {
      return (this.legalValues ? this.legalValues : undefined);
    };

    Property.prototype.getSelectableValues = function(rdj) {
      if (this.selectableValue) {
        let key = this.selectableValue;
        return rdj['data'][key];
      }
      else {
        return undefined;
      }
    };
    
    // Return Property constructor function
    return Property;
  }
);