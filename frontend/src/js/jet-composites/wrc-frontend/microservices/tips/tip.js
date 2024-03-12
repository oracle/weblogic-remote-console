/**
 * @license
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Class representing the metadata for a tip
 * @module
 * @class
 * @classdesc Class representing the metadata for a tip.
 */
define(
  function(){
    /**
     * Create metadata for a tip
     * @constructor
     * @param {string} id
     * @param {string} category
     * @param {boolean} visible
     * @typedef Tip
     */
    function Tip(id, category = 'other', visible = true){
      this.id = id;
      this.category = category;
      this.visible = visible
    }
    
    Tip.prototype = {
      id: function () { return this.id; },
      category: function (value) { if (value) {this.category = value; } return this.category; },
      visible: function (value) { if (value && typeof value === 'boolean') {this.visible = value; } return this.visible; }
    };
    
    return Tip;
  }
);
