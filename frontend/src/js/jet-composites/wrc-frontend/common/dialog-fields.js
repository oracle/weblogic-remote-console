/**
 * @license
 * Copyright (c) 2022, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(
  function () {
    /**
     * Class for setting and capturing the value of fields, used in a dialog box.
     * @returns {{addField: addField, putValue: putValue}}
     * @constructor
     */
    function DialogFields() {
    }

  //public:
    DialogFields.prototype = {
      addField: function(name, value) {
        if (typeof value === 'number') value = value.toString();
        this.putValue(name, value || '');
      },
      putValue: function(name, value) {
        this[name] = value;
      }
    };

    // Return the class constructor
    return DialogFields;
  }
);