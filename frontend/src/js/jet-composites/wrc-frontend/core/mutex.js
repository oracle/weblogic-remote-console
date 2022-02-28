/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([],
  function () {

      function Mutex() {
          let self = this;
          this.busy = false;
          this.workQueue = [];

          this.runExclusive = function (func) {
              return new Promise(function (resolve, reject) {
                  self.workQueue.push({ func: func, resolve: resolve, reject: reject });
                  tryWork();
              });
          };

          function tryWork() {
              self.busy = true;

              let workItem = self.workQueue.shift();
              if (workItem) { execute(workItem); } else { self.busy = false; }
          }

          function execute(workItem) {

              let result = workItem.func();

              result.then(workItem.resolve, workItem.reject).then(function () {
                  tryWork();
              });
          }
      }
      return Mutex;

  }
);