/**
 * @license
 * Copyright (c) 2020, 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['wrc-frontend/microservices/perspective/perspective-manager', 'wrc-frontend/microservices/perspective/perspective-memory', 'wrc-frontend/core/runtime'],
  function(PerspectiveManager, PerspectiveMemory, Runtime){
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
       * @param {string} [providerId='']
       * @returns {PerspectiveMemory}
       * @throws {InvalidPerspectiveIdError} If ``perspectiveId`` provided is not associated with a perspective.
       */
      getPerspectiveMemory: function(perspectiveId, providerId = Runtime.getDataProviderId()) {
        const perspective = PerspectiveManager.getById(perspectiveId);
        if (typeof perspective === 'undefined') throw new this.InvalidPerspectiveIdError(`${perspectiveId} is not the id for a currently supported perspective.`);

        if (providerId === '') {
          if (typeof perspectiveMemories[perspectiveId] === 'undefined') {
            perspectiveMemories[perspectiveId] = {};
            perspectiveMemories[perspectiveId] = new PerspectiveMemory(perspectiveId);
          }
          return perspectiveMemories[perspectiveId];
        }
        else {
          if (typeof perspectiveMemories[providerId] === 'undefined') {
            perspectiveMemories[providerId] = {};
          }
          if (typeof perspectiveMemories[providerId][perspectiveId] === 'undefined') {
            perspectiveMemories[providerId][perspectiveId] = new PerspectiveMemory(perspectiveId);
          }
          return perspectiveMemories[providerId][perspectiveId];
        }
      },

      addProviderPerspectiveBeanPathHistory: (providerId, perspectiveId, beanPathHistory) => {
        if (typeof perspectiveMemories[providerId] !== 'undefined' &&
          typeof perspectiveMemories[providerId][perspectiveId] !== 'undefined'
        ) {
          perspectiveMemories[providerId][perspectiveId].beanPathHistory.items = beanPathHistory.filter(item => item.perspective.id === perspectiveId);
        }
      },

      setProviderPerspectiveBeanPathHistory: (providerId, perspectiveId, beanPathHistory) => {
        if (typeof perspectiveMemories[providerId] !== 'undefined' &&
          typeof perspectiveMemories[providerId][perspectiveId] !== 'undefined'
        ) {
          perspectiveMemories[providerId][perspectiveId].beanPathHistory.items = beanPathHistory.filter(item => item.perspective.id === perspectiveId);
        }
      },

      getProviderPerspectivesBeanPathHistory: (providerId, options) => {
        const beanPathHistory = {};

        if (typeof perspectiveMemories[providerId] !== 'undefined') {
          if (typeof options === 'undefined') {
            options = {excludedPerspectiveIds: []};
          }

          if (typeof options.excludedPerspectiveIds === 'undefined') {
            options = {excludedPerspectiveIds: []};
          }

          const perspectiveIds = Object.keys(perspectiveMemories[providerId]).filter(key => key !== options.excludedPerspectiveIds[0]);
          for (const perspectiveId of perspectiveIds) {
            const beanPathHistoryItems = perspectiveMemories[providerId][perspectiveId].beanPathHistory.items;
            if (beanPathHistoryItems.length > 0) {
              beanPathHistory[perspectiveId] = beanPathHistoryItems;
            }
          }
        }

        return beanPathHistory;
      },
      getProviderPerspectivesHistoryVisibility: (providerId) => {
        let visible = false;
        if (typeof perspectiveMemories[providerId] !== 'undefined') {
          const filtered = Object.values(perspectiveMemories[providerId]).filter(perspectiveMemory => perspectiveMemory.beanPathHistory.visibility);
          visible = (filtered.length > 0);
        }
        return visible;
      },
      setProviderPerspectivesHistoryVisibility: (providerId, visible) => {
        if (typeof perspectiveMemories[providerId] !== 'undefined') {
          const perspectiveIds = Object.keys(perspectiveMemories[providerId]);
          for (const perspectiveId of perspectiveIds) {
            perspectiveMemories[providerId][perspectiveId].beanPathHistory.visibility = visible;
          }
        }
      },
      clearProviderPerspectivesBeanPathHistory: (options) => {
        if (typeof perspectiveMemories[options.provider.id] !== 'undefined') {
          for (const perspectiveId of Object.keys(perspectiveMemories[options.provider.id])) {
            perspectiveMemories[options.provider.id][perspectiveId].beanPathHistory.items = [];
          }
        }
      }

    };

  }
);