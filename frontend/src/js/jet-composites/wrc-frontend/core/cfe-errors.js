/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Module containing core custom errors for the CFE
 * @module
 */
define(
  function(){
    return {
      /**
       * Base custom error for errors related to the CFE.
       * @param {string} message
       * @param {object} [extra]
       * @constructor
       * @extends Error
       */
      CfeError: function CfeError(message, extra) {
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
        if (extra) this.extra = extra;
      },
      /**
       * Custom error for indicating that an invalid parameter
       * @param {string} message
       * @param {object} [extra]
       * @constructor
       * @extends Error
       */
      InvalidParameterError: function InvalidParameterError(message, extra) {
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
        if (extra) this.extra = extra;
      },
      /**
       * Custom error for indicating that an invalid storage item key has been encountered
       * @param {string} message
       * @param {object} [extra]
       * @constructor
       * @extends Error
       */
      InvalidItemKeyError: function InvalidItemKeyError(message, extra) {
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
        if (extra) this.extra = extra;
      }

    }
  }
);
