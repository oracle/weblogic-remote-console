/**
 * @license
 * Copyright (c) 2021, 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['js-yaml'],
  function (parser) {
    return {
      parse: function (data) {
        return new Promise((resolve, reject) => {
          try {
            resolve(parser.load(data));
          }
          catch (error) {
            reject(error);
          }
        });
      },
      dump: function (obj) {
        return new Promise((resolve, reject) => {
          try {
            resolve(parser.dump(obj));
          }
          catch (error) {
            reject(error);
          }
        });
      }

    }

  }
);
