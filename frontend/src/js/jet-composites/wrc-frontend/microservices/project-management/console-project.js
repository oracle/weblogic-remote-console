/**
 * @license
 * Copyright (c) 2021, 2022, Oracle Corporation and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Class representing the metadata for a connection to a WebLogic REST API endpoint.
 * @module
 */
define(['wrc-frontend/microservices/provider-management/data-provider-manager', 'wrc-frontend/microservices/provider-management/data-provider', 'wrc-frontend/core/utils', 'wrc-frontend/core/cfe-errors', 'wrc-frontend/core/types'],
  function(DataProviderManager, DataProvider, CoreUtils, CfeErrors, CoreTypes){

    /**
     * Create an in-memory console project.
     * @constructor
     * @param {string} id - The id associated with the project. The value null is assigned if not provided.
     * @param {string} [name=null] - The display name associated with the project. The value null is assigned if not provided.
     * @param {boolean} [isDefault=true] - Flag indicating if this is the user's default project, or not. The value false is assigned if not provided.
     * @param {[DataProvider]} [dataProviders=[]] - Array of data provider items associated with the project. An empty array is assigned if not provided.
     * @param {string} [filename=null] - The file name associated with a saved project. The value null is assigned if not provided.
     */
    function ConsoleProject(id, name=null, isDefault=true, dataProviders=[], filename=null){
      if (CoreUtils.isUndefinedOrNull(id)) throw new CfeErrors.InvalidParameterError('Parameter cannot be undefined: id');
      if (id === '') throw new CfeErrors.InvalidParameterError('Parameter cannot be an empty string: id');

      this.id = id;
      this.name = name;
      this.isDefault = isDefault;
      this.dataProviders = dataProviders;
      if (CoreUtils.isNotUndefinedNorNull(dataProviders)) {
        dataProviders.forEach((item) => {
          if (!(item instanceof DataProvider)) {
            this.addDataProvider(new DataProvider(item.id, item.name, item.type, item.beanTrees));
          }
        });
      }
      this.filename = filename;
    }

    function getAsDownloadFormatted() {
      const downloadFormatted = {};
      downloadFormatted['name'] = this.name;
      if (CoreUtils.isNotUndefinedNorNull(this.filename)) downloadFormatted['filename'] = this.filename;
      downloadFormatted['isDefault'] = this.isDefault;
      downloadFormatted['dataProviders'] = [];
      this.dataProviders.forEach((item) => {
        const dataProvider = {
          name: item.name,
          type: item.type,
        };
        switch(item.type) {
          case DataProvider.prototype.Type.ADMINSERVER.name:
            dataProvider['url'] = item.url;
            dataProvider['username'] = item.username;
            dataProvider['password'] = item.password;
            break;
          case DataProvider.prototype.Type.MODEL.name:
            dataProvider['properties'] = item.properties;
          case DataProvider.prototype.Type.PROPERTIES.name:
            dataProvider['file'] = item.file;
            break;
          case DataProvider.prototype.Type.COMPOSITE.name:
            dataProvider['models'] = item.models;
            break;
        }
        downloadFormatted['dataProviders'].push(dataProvider);
      });
      return downloadFormatted;
    }

    ConsoleProject.prototype = {
      UNNAMED_PROJECT: '(Unnamed Project)',
      /**
       * Returns all of the data providers associated with the project
       * @returns {[*|DataProvider]}
       */
      getDataProviders: function() {
        return this.dataProviders;
      },
      /**
       * Returns the data provider with the given ``id``, or undefined
       * @param {string} id - Unique identifier (within project) of the data provider
       * @returns {undefined | DataProvider} - Data provider for specified key
       */
      getDataProviderById: function(id) {
        return this.dataProviders.find(dataProvider => dataProvider.id === id);
      },
      /**
       * Returns the data provider with the given ``name``, or undefined
       * @param {string} name - Name of the data provider
       * @returns {undefined|DataProvider} - Data provider for specified key
       */
      getDataProviderByName: function(name) {
        return this.dataProviders.find(dataProvider => dataProvider.name === name);
      },
      /**
       * Adds given ``dataProvider`` to project, if a data provider with a matching id property doesn't exist.
       * @param {DataProvider} dataProvider
       */
      addDataProvider: function(dataProvider) {
        if (CoreUtils.isUndefinedOrNull(this.getDataProviderById(dataProvider.id))) {
          this.dataProviders.push(dataProvider);
        }
      },
      upsertDataProvider: function(dataProvider) {
        if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
          const index = this.dataProviders.map(item =>item.id).indexOf(dataProvider.id);
          if (index !== -1) {
            this.dataProviders[index] = dataProvider;
          }
          else {
            this.dataProviders.push(dataProvider);
          }
        }
      },
      /**
       * Remove ``dataProvider`` from project
       * @param {DataProvider} dataProvider
       */
      removeDataProvider: function(dataProvider) {
        if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
          if (CoreUtils.isNotUndefinedNorNull(dataProvider.id) && this.dataProviders.length > 0) {
            const index = this.dataProviders.map(item => item.id).indexOf(dataProvider.id);
            if (index !== -1) {
              // Do a physical removal of dataProvider
              // from project's dataProviders, This has
              // an intentional side-effect of also
              // removing it from the dataProviders any
              // reference to this ConsoleProject
              // instance (e.g. the one in the projects
              // array inside ConsoleProjectManager).
              this.dataProviders.splice(index, 1);
            }
          }
        }
      },
      /**
       * Remove all existing data providers from project
       */
      removeAllDataProviders: function() {
        this.dataProviders = [];
      },
      /**
       * Set ``filename`` property of project
       * @param {string} filename
       */
      setFileName: function(filename) {
        if (CoreUtils.isNotUndefinedNorNull(filename)) {
          this.filename = filename;
        }
      },

      /**
       * Returns JSON object representation of project.
       * @returns {object}
       */
       getAsJSONFormatted: function() {
        return getAsDownloadFormatted.call(this);
      },

      /**
       * Returns JSON string representation of project, containing only the properties that should be saved to a file.
       * @returns {string}
       */
      getAsDownloadFormatted: function() {
        return JSON.stringify(getAsDownloadFormatted.call(this));
      }
    };

    return ConsoleProject;
  }
);
