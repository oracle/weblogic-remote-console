/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

/**
 * Singleton module used to create id generators.
 * @module
 */
define(['wrc-frontend/core/utils'],
  function (CoreUtils) {

    class PrivateIdGenerator {
      constructor() {
        this.generators = {};
      }

      /**
       * Create a new generator for specified ``key``.
       * @param {string} key - Key for generator.
       */
      create(key) {
        if (CoreUtils.isNotUndefinedNorNull(key)) {
          this.generators[key] = '';
        }
      }

      remove(key) {
        delete this.generators[key];
      }

      removeAll() {
        for (const key of Object.keys(this.generators)) {
          delete this.generators[key];
        }
      }

      exists(key) {
        return (Object.keys(this.generators).includes(key));
      }

      /**
       * Generate a new id for generator with specified ``key``
       * @param {string} key - Key for generator.
       * @returns {number}
       */
      getNextId(key) {
        let nextId;
        if (CoreUtils.isNotUndefinedNorNull(this.generators[key])) {
          nextId = Date.now();
        }
        return nextId;
      }
    }

    class IdGenerator {
      constructor() {
        throw new Error('Use IdGenerator.getInstance()');
      }

      static getInstance(){
        if (!IdGenerator.instance) {
          IdGenerator.instance = new PrivateIdGenerator();
        }
        return IdGenerator.instance;
      }
    }

    // Returns the singleton instance of the PrivateIdGenerator class
    return IdGenerator.getInstance();
  });
