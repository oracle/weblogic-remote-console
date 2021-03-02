/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['./perspective-manager', './perspective-memory'],
  function(PerspectiveManager, PerspectiveMemory){
    var perspectiveMemories = {};

    return {
      InvalidPerspectiveIdError: function(message) {
        function InvalidPerspectiveIdError(message) {
          Error.call(this, message);
        }
        // Allow properties of Error to be acessed by InvalidPerspectiveIdError
        InvalidPerspectiveIdError.prototype = Object.create(Error.prototype);
        // Return InvalidPerspectiveIdError constructor function
        return InvalidPerspectiveIdError;
      },

      /**
       *
       * @typedef {Object} PerspectiveMemory
       * @param {string} perspectiveId
       * @returns {PerspectiveMemory}
       * @throws {InvalidPerspectiveIdError} If ``perspectiveId`` provided is not associated with a perspective.
       */
      getPerspectiveMemory: function(perspectiveId) {
        const perspective = PerspectiveManager.getById(perspectiveId);
        if (typeof perspective === "undefined") throw new this.InvalidPerspectiveIdError(`${perspectiveId} is not the id for a currently supported perspective.`);

        if (typeof perspectiveMemories[perspectiveId] === "undefined") {
          perspectiveMemories[perspectiveId] = new PerspectiveMemory(perspectiveId);
        }
        return perspectiveMemories[perspectiveId];
      }
    };

  }
);