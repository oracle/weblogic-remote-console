/**
 * @license
 * Copyright (c) 2021, 2022,2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Module containing core utility methods for the CFE
 * @module
 */
define(
  function () {
    return {
      isEquivalent: function (a, b) {
        // Create arrays of property names
        const aProps = Object.getOwnPropertyNames(a);
        const bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length !== bProps.length) {
          return false;
        }

        for (let i = 0; i < aProps.length; i++) {
          const propName = aProps[i];

          // If values of same property are not equal,
          // objects are not equivalent
          if (a[propName] !== b[propName]) {
            return false;
          }
        }

        // If we made it this far, then the objects
        // are considered to be equivalent
        return true;
      },
      /**
       * Uses JSON.stringify() to determine if two objects are the same
       *@param {object} a
       *@param {object} b
       */
      isSame: function(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
      },
      getDifference: function(array1, array2, searchIn) {
        function array1Diff(searchIn) {
          return array1.filter(object1 => {
            return !array2.some(object2 => {
              if (searchIn)
                return object1[searchIn] === object2[searchIn];
              else
                return object1 === object2;
            });
          });
        }

        function array2Diff(searchIn) {
          return array2.filter(object2 => {
            return !array1.some(object1 => {
              if (searchIn)
                return object2[searchIn] === object1[searchIn];
              else
                return object2 === object1;
            });
          });
        }

        let diff = array1Diff(searchIn);
        if (!diff) {
          diff = array2Diff(searchIn);
        }
        return diff;
      },
      isNotUndefinedNorNull: function (value) {
        return (value != null);
      },
      isUndefinedOrNull: function (value) {
        return (value == null);
      },
      isEmpty: function (value) {
        let result = false;
        if (this.isNotUndefinedNorNull(value)) {
          if (Array.isArray(value)) {
            result = (value.length === 0);
          }
          else if (typeof value === 'string') {
            result = (value === '');
          }
        }
        return result;
      },
      getSubstring: function (value, searchFor) {
        let result = value;
        if (this.isNotUndefinedNorNull(value)) {
          const index = (value.indexOf(searchFor) !== -1 ? value.indexOf(searchFor) : value.length);
          result = value.substr(0, index);
        }
        return result;
      },
      isError: function (reason) {
        return (this.isNotUndefinedNorNull(reason) && reason instanceof Error);
      },
      getLastIndex: function(array, searchIn, searchValue) {
        const index = array.slice().reverse().findIndex(x => x[searchIn] === searchValue);
        const count = array.length - 1;
        return (index >= 0 ? count - index : index);
      },
      getValues: function(array, searchIn) {
        let values = [];
        const results = array.filter(x => typeof x[searchIn] !== 'undefined');
        results.forEach((result) => {
          values.push(result[searchIn]);
        });
        return values;
      },
      asyncForEach: async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      },
      removeLineBreaks: (value) => {
        return value.replace( /[\r\n]+/gm, '' );
      },
      shallowCopy: (array) => {
        if (array) return [...array];
        return [];
      },
      getFunctionNames: (obj) => Object.getOwnPropertyNames(obj).filter(item => typeof obj[item] === 'function')

    };

  }
);
