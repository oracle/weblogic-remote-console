/**
 * @license
 * Copyright (c) 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Class representing the metadata for a startup task
 * @module
 * @class
 * @classdesc Class representing the metadata for a startup task.
 */
define(
  function(){
    /**
     * Create metadata for a declarative action.
     * <p>This constructor provides default values for <code>undefined</code> base properties. Use public functions to set and get values of base and extended properties.</p>
     * @constructor
     * @param {string} id - Unique identifier for action
     * @param {string} [iconFile='action-empty-icon-blk_24x24'] - Name of image file (without the .png file extension), or iconFile class. (extended property)
     * @param {string} label - Label for action (extended property)
     * @param {'blank'|'none'|'one'|'multiple'} [rows='blank'] - (extended property)
     * @param {string} helpLabel - Label used for title on an action input form. Defaults to <code>undefined</code>, so PDJ author can see that they didn't provide a value. (extended property)
     * @param {string} [helpSummaryHTML='<p></p>'] (extended property)
     * @param {string} [detailedHelpHTML='<p></p>'] (extended property)
     * @typedef DeclarativeAction
     */
    function DeclarativeAction(id, iconFile = 'action-empty-icon-blk_24x24', label, rows = 'blank', helpLabel, helpSummaryHTML = '<p></p>', detailedHelpHTML= '<p></p>'){
      this.id = id;
      this.iconFile = iconFile;
      this.label = label;
      this.rows = rows;
      this.helpLabel = helpLabel;
      this.helpSummaryHTML = helpSummaryHTML;
      this.detailedHelpHTML = detailedHelpHTML;
    }
  
    DeclarativeAction.prototype = {
      RowSelectionType: Object.freeze({
        NONE: {name: 'none'},         // the action applies to the page (e.g. import jms messages from a file)
        ONE: {name: 'one'},           // the user must select exactly one row (e.g. display a jms message's details)
        MULTIPLE: {name: 'multiple'}  // the user must select one or more rows (e.g. start one or more servers)
      }),
      id: function () { return this.id; },
      iconFile: function (value) { if (value) { this.iconFile = value;} return this.iconFile;},
      label: function (value) { if (value) { this.label = value;} return this.label;},
      rows: function (value) { if (value) { this.rows = value;} return this.rows;},
      helpLabel: function (value) { if (value) { this.helpLabel = value;} return this.helpLabel;},
      helpSummaryHTML: function (value) { if (value) { this.helpSummaryHTML = value;} return this.helpSummaryHTML;},
      detailedHelpHTML: function (value) { if (value) { this.detailedHelpHTML = value;} return this.detailedHelpHTML;},
      /**
       *
       * @param {boolean} value
       * @returns {DeclarativeAction.affectsChangeManager|(function(*=))}
       */
      affectsChangeManager: function (value) {
        if (typeof this.affectsChangeManager === 'undefined') {
          value = false;
        }
        if (value) {
          this.affectsChangeManager = (typeof value === 'boolean' ? value : false);
        }
        return this.affectsChangeManager;
      },
      constraint: function (value) {
        if (value) {
          this.constraint = value;
        }
        return this.constraint;
      }
    };
    
    return DeclarativeAction;
  }
);