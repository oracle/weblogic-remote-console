/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * An Abstract Class used to create a Concrete Class that represents temporary storage.
 * @module
 * @class
 * @classdesc An Abstract Class used to create a Concrete Class that represents temporary storage.
 */
define(['./cfe-errors'],
  function (CfeErrors) {
    /**
     * No-arg constructor.
     * @constructor
     * @throws {CfeError} If an attempt is made to create an instance of this Abstract Class.
     */
    function DataStorage() {
      if (this.constructor === DataStorage) {
        throw new CfeErrors.CfeError('DataStorage is an Abstract Class and cannot be instantiated!');
      }
    }

  //public:
    /**
     * Adds item to data storage.
     * @param {string} key - Unique identifier for data storage item. The scope of the uniqueness is the data storage instance, itself
     * @param {any} value - The data of the data storage item.
     * @throws {Error} If an attempt is made to call this Abstract Method.
     */
    DataStorage.prototype.add = function (key, value) {
      throw new Error(`This is an Abstract Method on the DataStorage Abstract Class, which cannot be called: key=${key}, value=${value}`);
    };

    /**
     * Returns data storage item stored using a given ``key``.
     * @param {string} key - Unique identifier for data storage item. The scope of the uniqueness is the data storage instance, itself
     * @returns {any} - Data storage item associated with ``key``
     * @throws {InvalidItemKeyError} - If there is no data storage item associated with ``key``.
     * @throws {Error} - If an attempt is made to call this Abstract Method.
     */
    DataStorage.prototype.get = function (key) {
      throw new Error(`This is an Abstract Method on the DataStorage Abstract Class, which cannot be called. key=${key}`);
    };
    /**
     * Upserts (i.e. inserts or updates) data storage item associated with ``key``
     * @param {string} key - Unique identifier for data storage item. The scope of the uniqueness is the data storage instance, itself
     * @param {any} value - The data of the data storage item.
     * @throws {Error} - If an attempt is made to call this Abstract Method.
     */
    DataStorage.prototype.put = function (key, value) {
      throw new Error(`This is an Abstract Method on the DataStorage Abstract Class, which cannot be called: key=${key}, value=${value}`);
    };
    /**
     * Removes data storage item stored using a given ``key``.
     * @param {string} key - Unique identifier for data storage item. The scope of the uniqueness is the data storage instance, itself
     * @throws {InvalidItemKeyError} - If there is no storage item associated with ``key``.
     * @throws {Error} - If an attempt is made to call this Abstract Method.
     */
    DataStorage.prototype.remove = function (key) {
      throw new Error(`This is an Abstract Method on the DataStorage Abstract Class, which cannot be called. key=${key}`);
    };
    /**
     * Removes all data storage items.
     * @throws {Error} - If an attempt is made to call this Abstract Method.
     */
    DataStorage.prototype.clear = function () {
      throw new Error('This is an Abstract Method on the DataStorage Abstract Class, which cannot be called.');
    };

    // Return DataStorage constructor function.
    return DataStorage;
  }
);
