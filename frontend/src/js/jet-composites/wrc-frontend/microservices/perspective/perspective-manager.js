/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

/**
 * @description This module contains functions for managing instances of the ``Perspective`` class.
 * @module
 */
define(['wrc-frontend/core/parsers/yaml', 'text!wrc-frontend/config/perspectives.yaml', './perspective', 'wrc-frontend/core/cfe-errors', 'wrc-frontend/core/utils', 'ojs/ojlogger'],
  function(YamlParser, PerspectivesFileContents, Perspective, CfeErrors, CoreUtils, Logger){
    const i18n = {
      'errors': {
        'IsAlreadyActivatedError': {
          '0000': '{0} '
        }
      }
    };

    var perspectives = [];
    var activePerspectiveId;

    YamlParser.parse(PerspectivesFileContents)
      .then(config => {
        let perspective;
        config['perspectives'].forEach((entry) => {
          perspective = new Perspective(entry.id, entry.type, entry.iconFiles, entry.beanTree);
          perspectives.push(perspective);
        });

        Logger.log(`Number perspectives defined in config: ${perspectives.length}`);
      })
      .catch((err) => {
          Logger.error(err);
      });

    /**
     *
     * @param {["configuration" | "monitoring" | "view" | "security" | "modeling" | "composite" | "properties"]} beanTreeTypes
     * @returns {Perspective[]}
     * @private
     */
    function getByBeanTreeTypes(beanTreeTypes) {
      let rtnval = ['configuration', 'view', 'monitoring', 'security', 'modeling', 'composite', 'properties'];
      beanTreeTypes.forEach((beanTreeType) => {
        const perspective = this.getById(beanTreeType);
        const index = rtnval.indexOf(perspective.id);
        if (index !== -1) rtnval[index] = perspective;
      });
      return rtnval.filter(item => typeof item !== 'string');
    }

    return {
      /**
       * Custom error for indicating that a Perspective has already been activated.
       * @param {string} message
       * @param {object} [extra]
       * @constructor
       * @extends Error
       */
      IsAlreadyActivatedError: function IsAlreadyActivatedError(message, extra) {
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
        if (extra) this.extra = extra;
      },

      /**
       * Registers supplied instance of `Perspective`
       * @param {Perspective} perspective
       */
      register: function (perspective) {
        if (CoreUtils.isUndefinedOrNull(this.getById(perspective.id))) {
          perspectives.push(perspective);
        }
      },

      /**
       * Makes the perspective associated with the specified ``perspectiveId``, the active perspective.
       * <p>Only one perspective can be in the ``Perspective.State.ACTIVE`` state. This means that calling this method will indirectly cause any previously active perspective to be set to ``Perspective.State.INACTIVE``.</p>
       * <p>This method returns a reference to the ``Perspective`` object that was activated, as a convience.
       * @param {string} perspectiveId
       * @returns {Perspective} The perspective object that was activated.
       * @throws {IsAlreadyActivatedError} If ``perspectiveId`` provided is the same as the ``id`` for the  <i>active</i> perspective.
       */
      activate: function (perspectiveId){
        let result;
        if (CoreUtils.isNotUndefinedNorNull(this.activePerspectiveId) && this.activePerspectiveId === perspectiveId) {
          throw new this.IsAlreadyActivatedError(`${perspectiveId} has already been activated! Call the deactivate() method or select a different perspective.`);
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
       * @returns {Perspective[]}
       */
      getByType: function(type) {
        return perspectives.filter((perspective) => {
          return perspective.type === type;
        });
      },

      // FortifyIssueSuppression Password Management: Password in Comment
      // This is not a password, but just a parameter
      /**
       *
       * @param {{string: id, name: string, type: "adminserver", url: string, username: string, password: string, beanTrees: [string], status?: string, class?: string} | {id:string, name:string, type: "model", file: string, beanTrees: [string], status?: string, class?: string}} dataProvider
       * @returns {Perspective[]}
       */
      getByDataProvider: function(dataProvider) {
        // Extract bean tree types from beanTrees property of
        // dataProvider parameter.
        const beanTreeTypes = CoreUtils.getValues(dataProvider.beanTrees, 'type');
        // Use beanTreeTypes to load perspectives.
        return getByBeanTreeTypes.call(this, beanTreeTypes);
      },

      /**
       *
       * @param {string} beanTreeType
       * @returns {Perspective}
       */
      getByBeanTreeType: function(beanTreeType) {
        return this.getById(beanTreeType);
      },

      /**
       *
       * @returns {Perspective[]}
       */
      getAll: function(){
        return perspectives;
      },

      /**
       *
       * @returns {Perspective}
       */
      getDefault: function (){
        return perspectives[0];
      },

      /**
       *
       * @returns {Perspective}
       */
      current: function(){
        let active;
        if (CoreUtils.isNotUndefinedNorNull(activePerspectiveId)) {
          active = this.getById(activePerspectiveId);
        }
        return active;
      },

      /**
       * Returns whether the ``id`` property of the current perspective is the same as a given ``perspectiveId`.
       * @param {string} perspectiveId
       * @returns {boolean} Returns ``true`` if the ``id`` property of the current perspective is ``perspectiveId``. If not, or no perspective is currently activated, ``false`` is returned.
       */
      iscurrent: function (perspectiveId){
        let result = (CoreUtils.isNotUndefinedNorNull(activePerspectiveId));
        return (result ? perspectiveId === activePerspectiveId : false);
      }
    };
  }
);
