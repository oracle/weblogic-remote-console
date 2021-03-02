/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['cfe/binding/Property'],
  function (Property) {
    function Table(data) {
      if (data['displayedColumns'] !== undefined) {
        this.displayedColumns = [];
        data['displayedColumns'].forEach(element => {
          this.displayedColumns.push(new Property(element));
        });
      }

      if (data['hiddenColumns'] !== undefined) {
        this.hiddenColumns = [];
        data['hiddenColumns'].forEach(element => {
          this.hiddenColumns.push(new Property(element));
        });
      }  
    }

    Table.prototype = {
      /**
       * 
       * @return {Property[]} 
       */
      getDisplayedColumns: function(){
        return (this.displayedColumns ? this.displayedColumns : undefined);
      },

      /**
      * Returns the value of a given Table displayed column, or undefined.
      * <p>undefined will be returned if any of the following are true:
      *   <ul>
      *     <li>Value of 'name' argument is undefined</li>
      *     <li>There is no desplayed column named 'name', in the Table's displayed columns array.</li>
      *     <li>Value assigned to the Table's displayed column named 'name', is undefined.</li>
      *   >/ul>
      * </p>
      * @param {String} name
      * @param {String} field
      * @return {*} 
      */
      getDisplayedColumn: function(name, field){
        if (name !== undefined && this.displayedColumns) {
          let column = this.displayedColumns.find((column) => {
            return column['name'] === name;
          });
          return (column !== undefined ? column[field] : undefined);
        }
        else {
          return undefined;
        }        
      },

      /**
       * 
       * @return {Property[]}
       */
      getHiddenColumns: function() {
        return (this.hiddenColumns ? this.hiddenColumns : undefined);
      },

      /**
      * Returns the value of a given Table hidden column, or undefined.
      * <p>undefined will be returned if any of the following are true:
      *   <ul>
      *     <li>Value of 'name' argument is undefined</li>
      *     <li>There is no hidden column named 'name', in the Table's hidden columns array.</li>
      *     <li>Value assigned to the Table's hidden column named 'name', is undefined.</li>
      *   >/ul>
      * </p>
      * @param {String} name
      * @param {String} field
      * @return {*} 
      */
      getHiddenColumn: function(name, field){
        if (name !== undefined && this.hiddenColumns) {
          let column = this.hiddenColumns.find((column) => {
            return column['name'] === name;
          });
          return (column !== undefined ? column[field] : undefined);
        }
        else {
          return undefined;
        }        
      }
    };

    // Return Table constructor function
    return Table;
  }
);