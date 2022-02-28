/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * THIS IS ONLY PARTIALLY IMPLEMENTED AND NOT TESTED AT ALL!!
 * DO NOT TRY TO USE!!
 */
define(
  function() {
    /**
     * 
     * @param {*} varargs 
     */
    function Path(varargs){
      this.components = [];
      let argumentsArray;

      if (arguments.length === 0) {
        // no-arg constructor
      }
      else {
        argumentsArray = Array.prototype.slice.apply(arguments);
      }
  
      if (argumentsArray.length > 0) {
        if (!argumentsArray.isArray(varargs)) {
          throw new Error('varargs parameter must be a string or array of strings, if present.');
        } 
        
        if (varargs.indexOf('.') !== -1 ) {
          // Path(String dotSeparatedPath);
          // varargs.split(".")
          // var res = argumentsArray.join(\'.\');
        }  
        else if (varargs instanceof Path) {
          // Path(Path toClone)
          // varargs.getComponents()
        }
        else if (Array.isArray(varargs)) {
          // Path(String[] components)
          // addComponents(varargs);
        }
      }
    }

    Path.prototype = {
      /**
       * 
       * @param {string} component 
       */
      childPath: function(component){
        let c = new Path(this);
        c.addComponent(component);
        return c;
      },

      subPath: function(begin, end) {
        return new Path(this.components.slice(begin, end));
      },
  
      addComponents: function(components) {
        this.addComponent(components);
      },
    
      /**
       * 
       * @param {string} component 
       */
      addComponent: function(component) {
        if (component !== undefined && component.length > 0){
          this.components.push(component);
        }
      },

      getLastComponent: function(){
        return (this.components.length === 0 ? undefined : this.components.slice(-1));
      },

      getFirstComponent: function(){
        return (this.components.length === 0 ? undefined : this.components.slice(0));
      },
 
      /**
       * @return {String[]}
       */
      getComponents: function(){
        return this.components;
      },

      getParent: function(){
/*
    List<String> parentComponents = new ArrayList<>();
    Path parent = new Path();
    for (int i = 0; i < getComponents().size()-1; i++) {
      parent.addComponent(getComponents().get(i));
    }
*/
        return new Path();
      },

      getDotSeparatedPath: function(){
        return this.getPath('.');
      },
  
      getSlashSeparatedPath: function(){
        return this.getPath('/');
      },

      isEmpty: function(){
        return (this.components.length === 0);
      },

      size: function(){
        return this.components.length;
      },

      getPath: function(separator){
/*
        StringBuilder sb = new StringBuilder();
        boolean first = true;
        for (String component : getComponents()) {
          if (!first) {
            sb.append(separator);
          }
          sb.append(component);
          first = false;
        }
        return sb.toString();
*/
          return '';
      },

      toString: function(){
        return this.getDotSeparatedPath();
      }
    };

    return Path;
  }
);
