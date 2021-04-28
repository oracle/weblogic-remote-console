/**
 * @license
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

/**
 * Class module for a temporary storage object, which holds the __instance variables__ for an instance of the ``FormViewModel``class.
 * @module
 * @class
 */
define(['../../../core/cfe-errors', '../../../core/utils'],
  function (CfeErrors, CoreUtils) {
    /**
     * No-arg constructor
     * @constructor
     * @param {string} name
     */
    function FormVariables(name) {
      this.name = name;
    }

  //public:
    FormVariables.prototype = {
      add: function (key, value) {
        this[key] = value;
        return this[key];
      },

      get: function (key) {
        if (typeof this[key] === "undefined") {
          throw new this.InvalidItemKeyError(`No storage item has "${key}" as the key.`);
        }
        return this[key];
      },

      put: function (key, value) {
        this[key] = value;
        return this[key];
      },

      remove: function (key) {
        if (typeof this[key] === "undefined") {
          throw new this.InvalidItemKeyError(`No storage item has "${key}" as the key.`);
        }
        delete this[key];
      }
    };

    // Return FormVariables constructor function.
    return FormVariables;
  }
);