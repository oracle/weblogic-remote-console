/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * A Singleton class that represents a keyed stack for the instance variables in a ``FormViewModel`` instance
 * @module
 * @class
 * @classdesc A Singleton class that represents a keyed stack for the instance variables in a ``FormViewModel`` instance
 */
define(['./form-variables', 'wrc-frontend/core/cfe-errors'],
  function (FormVariables, CfeErrors) {
    var instance;

    /**
     *
     * @constructor
     * @example <caption>Add a FormVariables instance to the stack</caption>
     * FormVariablesStack.push(viewParams.parentRouter.data.rawPath(), formVariables);
     * FormVariablesStack.pop();
     */
    function FormVariablesStack () {
      let _stack = {};
      this.getStack = function() { return _stack; };
      this.setStack = function(stack) {_stack = stack; };
    }

    /**
     *
     * @type {{pop: (function(): FormVariables|null), get: (function(string): FormVariables|null), clear: FormVariablesStack.clear, push: FormVariablesStack.push, peek: (function(): FormVariables|null)}}
     */
    FormVariablesStack.prototype = {
      /**
       *
       * @param {string} key
       * @param {FormVariables} variables
       */
      push: function (key, variables) {
        if (typeof this.getStack()[key] === 'undefined') {
          this.getStack()[key] = variables;
        }
      },
      /**
       * @param {string} key?
       * @returns {FormVariables|null}
       */
      pop: function (key) {
        let variables = null;
        const keys = Object.keys(this.getStack());
        if (keys.length > 0) {
          key = (typeof key === 'undefined' ? keys[keys.length - 1] : key);
          const { [key]: variables, ...rest } = this.getStack();
          this.setStack(rest);
        }
        return variables;
      },
      /**
       *
       * @param {string} key
       * @returns {FormVariables|null}
       */
      get: function (key) {
        let variables = null;
        if (typeof this.getStack()[key] !== 'undefined') {
          variables = this.getStack()[key];
        }
        return variables;
      },
      /**
       *
       * @returns {FormVariables|null}
       */
      peek: function () {
        let variables = null;
        const keys = Object.keys(this.getStack());
        if (keys.length > 0) {
          const key = keys[keys.length - 1];
          variables = this.getStack()[key];
        }
        return variables;
      },
      clear: function () {
        this.setStack({});
      }
    };

    return function getFormVariablesStack () {
      // Returns existing FormVariablesStack singleton,
      // creating it beforehand if it doesn't exist yet.
      return (instance = (instance || new FormVariablesStack()));
    };
  }
);
