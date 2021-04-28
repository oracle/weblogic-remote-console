/**
 * @license
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

/**
 * A Singleton class that represents a keyed stack for the instance variables in a ``FormViewModel`` instance
 * @module
 * @class
 * @classdesc A Singleton class that represents a keyed stack for the instance variables in a ``FormViewModel`` instance
 */
define(['form-variables', '../../../core/cfe-errors'],
  function (FormVariables, CfeErrors) {
    var instance;

    /**
     *
     * @constructor
     * @example <caption>Add a FormVariables instance to the stack</caption>
     * FormStack.push(viewParams.parentRouter.data.rawPath(), formVariables);
     * FormStack.pop();
     */
    function FormVariablesStack () {
      var _stack = {};
      this.getStack = function() { return _stack; };
    }

    FormVariablesStack.prototype = {
      push: function (key, formVariables) {
        if (typeof this.getStack()[key] === "undefined") {
          this.getStack()[key] = formVariables;
        }
      },
      pop: function (key) {
      },
      peek: function () {
      },
      clear: function (key) {
        if (typeof this.getStack()[key] !== "undefined") {
          delete this.getStack()[key];
        }
      }
    };

    return function FormVariablesStack () {
      // Returns existing FormVariablesStack singleton,
      // creating it beforehand if it doesn't exist yet.
      return (instance = (instance || new FormVariablesStack()));
    };
  }
);