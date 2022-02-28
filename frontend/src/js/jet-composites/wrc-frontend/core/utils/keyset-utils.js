/**
 * @license
 * Copyright (c) 2020, 2022, Oracle Corporation and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([],
  function () {

  return {
    setToArray: function (set) {
      var arr = [];
      if (typeof set.values !== 'undefined') {
       set.values().forEach(function (key) {
        arr.push(key);
      });
    }
      return arr;
    }
  }
});
