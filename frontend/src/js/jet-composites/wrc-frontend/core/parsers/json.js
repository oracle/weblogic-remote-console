/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(
  function () {
    return {
      parse: function (data) {
        return new Promise((resolve, reject) => {
          try {
            resolve(JSON.parse(data));
          }
          catch (error) {
            reject(error);
          }
        });
      }

    }

  }
);
