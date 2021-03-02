/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['cfe/binding/Property'],
  function (Property) {
    function Form(data) {
      if (data['properties'] !== undefined) {
        this.properties = [];
        data['properties'].forEach(element => {
          this.properties.push(new Property(element));
        });  
      }

      if (data['advancedProperties'] !== undefined) {
        this.advancedProperties = [];
        data['advancedProperties'].forEach(element => {
          this.advancedProperties.push(new Property(element));
        });
      }
    }

    Form.prototype = {
      /**
      * Returns an array of Property objects
      * @return {Property[]} 
      */
      getProperties: function(){
        return (this.properties ? this.properties : undefined);
      },

      /**
      * Returns the value of a given Form property, or undefined.
      * <p>undefined will be returned if any of the following are true:
      *   <ul>
      *     <li>Value of 'name' argument is undefined</li>
      *     <li>There is no property named 'name', in the Form's properties array.</li>
      *     <li>Value assigned to the Form's property named 'name', is undefined.</li>
      *   >/ul>
      * </p>
      * @param {String} name
      * @param {String} field
      * @return {*} 
      */
      getProperty: function(name, field){
        if (name !== undefined && this.properties) {
          let property = this.properties.find((property) => {
            return property['name'] === name;
          });
          return (property !== undefined ? property[field] : undefined);
        }
        else {
          return undefined;
        }        
      },

      /**
      * Returns an array of Property objects
      * @return {Property[]} 
      */
      getAdvancedProperties: function() {
        return (this.advancedProperties ? this.advancedProperties : undefined);
      },

      /**
      * Returns the value of a given Form advanced property, or undefined.
      * <p>undefined will be returned if any of the following are true:
      *   <ul>
      *     <li>Value of 'name' argument is undefined</li>
      *     <li>There is no advanced property named 'name', in the Form's advanced properties array.</li>
      *     <li>Value assigned to the Form's advanced property named 'name', is undefined.</li>
      *   >/ul>
      * </p>
      * @param {String} name
      * @param {String} field
      * @return {*} 
      */
      getAdvancedProperty: function(name, field) {
        if (name !== undefined && this.advancedProperties) {
          let property = this.advancedProperties.find((property) => {
            return property['name'] === name;
          });
          return (property !== undefined ? property[field] : undefined);
        }
        else {
          return undefined;
        }        
      }
    };

    // Return Form constructor function
    return Form;
  }
);