/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Class module for a temporary storage object, which holds the __instance variables__ for an instance of the ``FormViewModel``class.
 * @module
 * @class
 */
define(['wrc-frontend/core/cfe-errors', 'wrc-frontend/core/utils'],
  function (CfeErrors, CoreUtils) {
    /**
     * Creates an instance of the ``FormVariables`` class using ``name`` as the key
     * @constructor
     * @param {string} name
     */
    function FormVariables(name) {
      if (CoreUtils.isUndefinedOrNull(name)) {
        throw new CfeErrors.InvalidParameterError('Parameter cannot be undefined or null: name');
      }
      else if (CoreUtils.isEmpty(name)) {
        throw new CfeErrors.InvalidParameterError('Parameter cannot be an empty string: name');
      }
      this.name = name;
    }

  //public:
    /**
     * Exposed functions and variables for the ``FormVariables`` module.
     * @type {{add: FormVariables.add, get: FormVariables.get, put: FormVariables.put, remove: FormVariables.remove}}
     */
    FormVariables.prototype = {
      /**
       * Add variable using ``key`` and ``value``.
       * @param {string} key - The key to associate with the variable.
       * @param {*} value - The value to associate with the variable.
       * @returns {*|undefined} - The value or undefined, if key is undefined, null or "".
       */
      add: function (key, value) {
        if (CoreUtils.isNotUndefinedNorNull(key) && !CoreUtils.isEmpty(key)) {
          this[key] = value;
          return this[key];
        }
        else {
          return undefined;
        }
      },
      /**
       * Returns variable with ``key`` as the key.
       * @param {string} key - The key for the variable to lookup.
       * @returns {*|undefined} - The value or undefined, if key is undefined, null or "".
       */
      get: function (key) {
        if (CoreUtils.isNotUndefinedNorNull(key) && !CoreUtils.isEmpty(key)) {
          return this[key];
        }
        else {
          return undefined;
        }
      },
      /**
       * Upsert variable using ``key`` and ``value``.
       * <p>A no-op happens if <code>key</code> is undefined, null or "".</p>
       * @param {string} key - The key to associate with the variable.
       * @param {*} value - The value to associate with the variable.
       */
      put: function (key, value) {
        if (CoreUtils.isNotUndefinedNorNull(key) && !CoreUtils.isEmpty(key)) {
          this[key] = value;
        }
      },
      /**
       * Delete variable with ``key`` as the key.
       * <p>A no-op happens if <code>key</code> is undefined, null or "".</p>
       * @param {string} key - The key for the variable to lookup.
       */
      remove: function (key) {
        if (CoreUtils.isNotUndefinedNorNull(key) && !CoreUtils.isEmpty(key)) {
          delete this[key];
        }
      }
    };

    // Return FormVariables constructor function.
    return FormVariables;
  }
);
