/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['wrc-frontend/microservices/perspective/perspective-manager', 'wrc-frontend/microservices/perspective/perspective-memory'],
  function(PerspectiveManager, PerspectiveMemory){
    var perspectiveMemories = {};
    var modeChanged;

    /**
     * Clear perspective memory when going into DETACHED mode.
     *
     * @param {string} newMode - The name of the new mode
     */
    function onModeChanged(newMode) {
/*
//MLW
      if (newMode === "DETACHED") {
        for (let id in perspectiveMemories) {
          perspectiveMemories[id] = new PerspectiveMemory(id);
        }
      }
*/
    }

    return {
      /**
       * @param message
       * @constructor
       * @extends Error
       * @type {{message: string, [extra]: object}}
       */
      InvalidPerspectiveIdError: function InvalidPerspectiveIdError(message) {
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
      },
      /**
       * Set signal used to announce that the CFE mode has changed.
       * <p>We use that announcement to clear the state of perspective memory instances, when the mode becomes DETACHED</p>
       * @param {Signal} signal - The signal used to announce that the CFE mode has changed
       */
      setModeChangedSignal: function(signal) {
        // Remove any notifications for the current signal
        if (modeChanged !== undefined) {
          modeChanged.remove(onModeChanged);
        }

        // Add the listener for events when the mode is changed
        modeChanged = signal;
        modeChanged.add(onModeChanged);
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
        if (typeof perspective === 'undefined') throw new this.InvalidPerspectiveIdError(`${perspectiveId} is not the id for a currently supported perspective.`);

        if (typeof perspectiveMemories[perspectiveId] === 'undefined') {
          perspectiveMemories[perspectiveId] = new PerspectiveMemory(perspectiveId);
        }
        return perspectiveMemories[perspectiveId];
      }
    };

  }
);
