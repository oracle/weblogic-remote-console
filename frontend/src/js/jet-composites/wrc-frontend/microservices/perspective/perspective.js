/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Class representing the metadata for a perspective
 * @module
 * @class
 * @classdesc Class representing the metadata for a perspective.
 */
define(
  function(){
    /**
     * Create metadata for a perspective
     * @constructor
     * @param {string} id
     * @param {Type} type
     * @param {string} iconFiles
     * @param {string} beanTree
     * @typedef Perspective
     */
    function Perspective(id, type, iconFiles, beanTree){
      this.id = id;
      // Include the label and description member
      // variables, even though their values come
      // from a resource bundle. Doing this allows
      // us eliminate "typeof XXX 'undefined'"
      // checks, in downstream code that uses a
      // Perspective object.
      this.label = '';
      this.description = '';
      this.type = type || Perspective.prototype.Type.BUILT_IN.name;
      this.iconFiles = iconFiles;
      this.beanTree = beanTree;
      this.state = Perspective.prototype.State.INACTIVE;
    }

    Perspective.prototype = {
      Type: Object.freeze({
        BUILT_IN : {name: 'built-in'},
        ADD_IN : {name: 'add-in'}
      }),
      State: Object.freeze({
        INACTIVE : {name: 'inactive'},
        ACTIVE : {name: 'active'}
      }),
      id: function() { return this.id; },
      label: function() { return this.label; },
      description: function() { return this.description; },
      type: function() { return this.type; },
      iconFiles: function() { return (typeof this.iconFiles !== 'undefined' ? this.iconfiles : null) },
      beanTree: function() { return this.beanTree; },
      isReadOnly: function() { return this.beanTree || false; },
      state: function() { return this.state; }
    };

    return Perspective;
  }
);
