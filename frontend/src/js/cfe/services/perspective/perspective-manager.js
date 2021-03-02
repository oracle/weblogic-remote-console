/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['../../io/adapter', './perspective', 'ojs/ojlogger'],
  function(FileAdapter, Perspective, Logger){
    var perspectives = [];
    var activePerspectiveId;

    FileAdapter.readYaml('config/perspectives.yaml')
      .then((config) => {
        let perspective;
        config['perspectives'].forEach((entry) => {
          Logger.log(`id=${entry.id}, label=${entry.label}`);
          perspective = new Perspective(entry.id, entry.label, entry.description, entry.type, entry.iconFiles);
          if (typeof entry.navtree !== 'undefined') {
            perspective.setNavTree(entry.navtree);
          }
          perspectives.push(perspective);
        });

        Logger.log(`Number perspectives defined in config: ${perspectives.length}`);
      });

    return {
      IsAlreadyActivatedError: function(message) {
        function IsAlreadyActivatedError(message) {
          Error.call(this, message);
        }
        // Allow properties of Error to be acessed by IsAlreadyActivatedError
        IsAlreadyActivatedError.prototype = Object.create(Error.prototype);
        // Return IsAlreadyActivatedError constructor function
        return IsAlreadyActivatedError;
      },

      /**
       * Registers supplied instance of `Perspective`
       * @param {Perspective} perspective
       */
      register: function (perspective) {
        if (this.getById(perspective.id) === undefined) {
          perspectives.push(perspective);
        }
      },

      /**
       * Makes the perspective associated with the specified ``perspectiveId``, the active perspective.
       * <p>Only one perspective can be in the ``Perspective.State.ACTIVE`` state. This means that calling this method will indirectly cause any previously active perspective to be set to ``Perspective.State.INACTIVE``.</p>
       * <p>This method returns a reference to the ``Perspective`` object that was activated, as a convience.
       * @param {string} perspectiveId
       * @returns {Perspective} The perspective object that was activated.
       * @throws {IsAlreadyActivated} If ``perspectiveId`` provided is the same as the ``id`` for the  <i>active</i> perspective.
       */
      activate: function (perspectiveId){
        let result;
        if (typeof this.activePerspectiveId !== "undefined" && this.activePerspectiveId === perspectiveId) {
          throw new this.IsAlreadyActivated(`${perspectiveId} has already been activated! Call the deactivate() method or select a different perspective.`);
        }

        perspectives.forEach((perspective) => {
          if (perspective.id === perspectiveId) {
            perspective.state = Perspective.prototype.State.ACTIVE;
            result = perspective;
            activePerspectiveId = perspectiveId;
          }
          else {
            perspective.state = Perspective.prototype.State.INACTIVE;
          }
        });
        return result;
      },

      /**
       * Set the state of perspective associated with specified id, to ``INACTIVE ``.
       * <p>If ``perspectiveId`` happens to be associated with the <i>active</i> perspective, then the <i>active</i> perspective will become ``undefined``.
       * @param {string} perspectiveId
       */
      deactivate: function(perspectiveId){
        activePerspectiveId = undefined;
      },

      /**
       *
       * @param {string} perspectiveId
       * @returns {Perspective}
       */
      getById: function(perspectiveId) {
        return perspectives.find((perspective) => {
          return perspective.id === perspectiveId;
        });
      },

      /**
       *
       * @param {string} type
       * @returns {[Perspective]}
       */
      getByType: function(type) {
        return perspectives.filter((perspective) => {
          return perspective.type === type;
        });
      },

      /**
       *
       * @returns {[Perspective]}
       */
      getAll: function(){
        return perspectives;
      },

      getDefault: function (){
        return perspectives[0];
      },

      current: function(){
        let active;
        if (typeof activePerspectiveId !== 'undefined') {
          active = this.getById(activePerspectiveId);
        }
        return active;
      },

      /**
       * Returns whether the ``id`` property of the current perspective is the same as a given ``perspectiveId`.
       * @param {string} perspectiveId
       * @returns {boolean} Returns ``true`` if the ``id`` property of the current perspective is ``perspectiveId``. If not, or
       * no perspective is currently activated, ``false`` is returned.
       */
      iscurrent: function (perspectiveId){
        let result = (typeof activePerspectiveId !== 'undefined');
        return (result ? perspectiveId === activePerspectiveId : false);
      }
    };
  }
);
