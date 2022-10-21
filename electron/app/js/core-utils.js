/**
 * @license
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

/**
 *
 * See {@link https://stackabuse.com/javascripts-immediately-invoked-function-expressions/}
 * @type {{isNotUndefinedNorNull, isUndefinedOrNull, isSame, isEmpty}}
 */
const CoreUtils = (() => {
  return {
    /**
     * Uses JSON.stringify() to determine if two objects are the same
     *@param {object} a
     *@param {object} b
     */
    isSame: (a, b) => {
      return JSON.stringify(a) === JSON.stringify(b);
    },
    isNotUndefinedNorNull: (value) => {
      return (value != null);
    },
    isUndefinedOrNull: (value) => {
      return (value == null);
    },
    isEmpty: (value) => {
      let result = false;
      if (CoreUtils.isNotUndefinedNorNull(value)) {
        if (Array.isArray(value)) {
          result = (value.length === 0);
        }
        else if (typeof value === 'string') {
          result = (value === '');
        }
      }
      return result;
    }

  };
})();

module.exports = CoreUtils;