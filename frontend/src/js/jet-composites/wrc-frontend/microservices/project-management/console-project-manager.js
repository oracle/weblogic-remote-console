/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

/**
 * Module used to manage console projects.
 * @module
 */
define(['wrc-frontend/core/parsers/yaml', 'wrc-frontend/core/parsers/json', 'text!wrc-frontend/config/wrc-projects.yaml', './console-project', 'wrc-frontend/microservices/provider-management/data-provider-manager', 'wrc-frontend/microservices/provider-management/data-provider', 'wrc-frontend/core/runtime', 'wrc-frontend/core/utils', 'wrc-frontend/core/types', 'wrc-frontend/core/cfe-errors', 'ojs/ojlogger' ],
  function(YamlParser, JsonParser, WrcProjectsFileContents, ConsoleProject, DataProviderManager, DataProvider, Runtime, CoreUtils, CoreTypes, CfeErrors, Logger){
    var projects = [];

    function createProject(entry) {
      let dataProvider;
      const project = new ConsoleProject(entry.id, entry.name, entry.isDefault, entry.dataProviders, entry.filename);
      entry.dataProviders.forEach((item, index) => {
        switch(item.type) {
          case DataProvider.prototype.Type.ADMINSERVER.name: {
            dataProvider = DataProviderManager.createAdminServerConnection({id: item.id, name: item.name, type: item.type, beanTrees: item.beanTrees || []  });
            if (CoreUtils.isNotUndefinedNorNull(item.url)) dataProvider.putValue('url', item.url);
            if (CoreUtils.isNotUndefinedNorNull(item.username)) dataProvider.putValue('username', item.username);
            // Use state="disconnected" as an indicator that
            // this domain connection data provider is from
            // a saved project, which was loaded.
            if (CoreUtils.isNotUndefinedNorNull(item.state)) {
              dataProvider.putValue('state', item.state);
            }
            else {
              dataProvider.putValue('state', CoreTypes.Domain.ConnectState.DISCONNECTED.name);
            }
            project.dataProviders[index] = dataProvider;
          }
            break;
          case DataProvider.prototype.Type.MODEL.name: {
            dataProvider = DataProviderManager.createWDTModel({id: item.id, name: item.name, type: item.type, beanTrees: item.beanTrees || [] });
            if (CoreUtils.isNotUndefinedNorNull(item.fileContents)) {
              dataProvider.putValue('fileContents', item.fileContents);
            }
            if (CoreUtils.isNotUndefinedNorNull(item.file)) dataProvider.putValue('file', item.file);
            if (CoreUtils.isNotUndefinedNorNull(item.properties)) dataProvider.putValue('properties', item.properties);
            // Use connectivity="DETACHED" as an indicator
            // that this WDT data provider is from a saved
            // project, which was loaded.
            if (CoreUtils.isNotUndefinedNorNull(item.connectivity)) {
              dataProvider.putValue('connectivity', item.connectivity);
            }
            else {
              dataProvider.putValue('connectivity', CoreTypes.Console.RuntimeMode.DETACHED.name);
            }
            // Use state="disconnected" as an indicator that
            // this domain connection data provider is from
            // a saved project, which was loaded.
            if (CoreUtils.isNotUndefinedNorNull(item.state)) {
              dataProvider.putValue('state', item.state);
            }
            else {
              dataProvider.putValue('state', CoreTypes.Domain.ConnectState.DISCONNECTED.name);
            }
            project.dataProviders[index] = dataProvider;
          }
            break;
          case DataProvider.prototype.Type.COMPOSITE.name: {
            dataProvider = DataProviderManager.createWDTCompositeModel({id: item.id, name: item.name, type: item.type, beanTrees: item.beanTrees || [] });
            if (CoreUtils.isNotUndefinedNorNull(item.models)) dataProvider.putValue('models', item.models);
            // Use connectivity="DETACHED" as an indicator
            // that this WDT composite provider is from a saved
            // project, which was loaded.
            if (CoreUtils.isNotUndefinedNorNull(item.connectivity)) {
              dataProvider.putValue('connectivity', item.connectivity);
            }
            else {
              dataProvider.putValue('connectivity', CoreTypes.Console.RuntimeMode.DETACHED.name);
            }
            // Use state="disconnected" as an indicator that
            // this domain connection data provider is from
            // a saved project, which was loaded.
            if (CoreUtils.isNotUndefinedNorNull(item.state)) {
              dataProvider.putValue('state', item.state);
            }
            else {
              dataProvider.putValue('state', CoreTypes.Domain.ConnectState.DISCONNECTED.name);
            }
            project.dataProviders[index] = dataProvider;
          }
            break;
          case DataProvider.prototype.Type.PROPERTIES.name: {
            dataProvider = DataProviderManager.createPropertyList({id: item.id, name: item.name, type: item.type, beanTrees: item.beanTrees || [] });
            if (CoreUtils.isNotUndefinedNorNull(item.fileContents)) {
              dataProvider.putValue('fileContents', item.fileContents);
            }
            if (CoreUtils.isNotUndefinedNorNull(item.file)) dataProvider.putValue('file', item.file);
            // Use connectivity="DETACHED" as an indicator
            // that this properties data provider is from a saved
            // project, which was loaded.
            if (CoreUtils.isNotUndefinedNorNull(item.connectivity)) {
              dataProvider.putValue('connectivity', item.connectivity);
            }
            else {
              dataProvider.putValue('connectivity', CoreTypes.Console.RuntimeMode.DETACHED.name);
            }
            // Use state="disconnected" as an indicator that
            // this domain connection data provider is from
            // a saved project, which was loaded.
            if (CoreUtils.isNotUndefinedNorNull(item.state)) {
              dataProvider.putValue('state', item.state);
            }
            else {
              dataProvider.putValue('state', CoreTypes.Domain.ConnectState.DISCONNECTED.name);
            }
            project.dataProviders[index] = dataProvider;
          }
            break;
        }
      });
      return project;
    }

    /**
     * Create ConsoleProject instance from specified ``entry`` object
     * @param {object|ConsoleProject} entry - JS object (or ``ConsoleProject`` instance) with properties needed to create a ``ConsoleProject`` instance
     * @returns {ConsoleProject}
     * @private
     */
    function addProject(entry) {
      let project;
      if (CoreUtils.isNotUndefinedNorNull(entry) && CoreUtils.isNotUndefinedNorNull(entry.name)) {
        // Ensure entry is an instance of the
        // ConsoleProject class.
        if (entry instanceof ConsoleProject) {
          project = entry;
        }
        else {
          project = new ConsoleProject(entry.id, entry.name, entry.isDefault, entry.dataProviders, entry.filename);
        }
        // Look for an existing project with the same 
        // id, inside the projects module-scoped 
        // variable.
        const index = projects.map(item => item.name).indexOf(project.name);
        if (index !== -1) {
          // Found one, so update it from project.
          project.id = projects[index].id;
          projects[index] = project;
        }
        else {
          // Didn't find one, so add project to 
          // the projects module-scoped variable
          projects.push(project);
        }
      }
      return project;
    }

    function removeProject(project) {
      function removeDataProvider(dataProvider) {
        switch (dataProvider.type) {
          case DataProvider.prototype.Type.ADMINSERVER.name:
            return DataProviderManager.removeAdminServerConnection(dataProvider);
          case DataProvider.prototype.Type.MODEL.name:
            return DataProviderManager.removeWDTModel(dataProvider);
          case DataProvider.prototype.Type.COMPOSITE.name:
            return DataProviderManager.removeWDTCompositeModel(dataProvider);
          case DataProvider.prototype.Type.PROPERTIES.name:
            return DataProviderManager.removePropertyList(dataProvider);
        }
      }

      if (CoreUtils.isNotUndefinedNorNull(project)) {
        // Initialize index and array used as
        // the return value.
        let i = 0, results = [];

        let nextPromise = () => {
          if (i >= project.dataProviders.length) {
            // We're done, so return the results
            // array in a Promise.resolve()
            return Promise.resolve(results);
          }

          let newPromise = Promise.resolve(removeDataProvider(project.dataProviders[i]))
            .then(result => {
              results.push(result);
            });
          i++;
          return newPromise.then(nextPromise);
        };

        // Kick off the chain by calling the
        // nextPromise function.
        return Promise.resolve().then(nextPromise);
      }
      else {
        return Promise.resolve([]);
      }
    }

    function removeProjectById(id) {
      const project = projects.find(item => item.id === id);
      return removeProject(project);
    }

    function removeProjectByName(name) {
      const project = projects.find(item => item.name === name);
      return removeProject(project);
    }

    return {
      /**
       * Create ConsoleProject instance from specified ``entry`` object
       * @param {object} entry - JS object with properties needed to create a ConsoleProject instance
       * @returns {ConsoleProject}
       */
      add: function (entry) {
        return addProject(entry);
      },

      /**
       * Remove project with a given id from in-memory structure, and optionally from persistent storage.
       * @param {string} id - Id associated with the project to remove
       * @returns {Promise<{(succeeded: boolean, data: *}>}
       */
      removeById: async function(id) {
        if (CoreUtils.isNotUndefinedNorNull(id)) {
          return removeProjectById(id);
        }
        else {
          return Promise.resolve({
            succeeded: false,
            data: CfeErrors.InvalidParameterError('Required parameter is missing or null: \'id\'')
          });
        }
      },

      removeByName: async function(name) {
        if (name === '(unnamed)') name = '(Unnamed Project)';
        if (CoreUtils.isNotUndefinedNorNull(name)) {
          return removeProjectByName(name);
        }
        else {
          return Promise.resolve({
            succeeded: false,
            data: CfeErrors.InvalidParameterError('Required parameter is missing or null: \'id\'')
          });
        }
      },

      erase: function(project) {
        if (CoreUtils.isNotUndefinedNorNull(project)) {
          const index = projects.map(item => item.name).indexOf(project.name);
          if (index !== -1) {
            projects[index].removeAllDataProviders();
            projects.splice(index, 1);
          }
        }
      },

      export: function(id) {
        //TODO: Save ConsoleProject associated with name
        //       to the "config/wrc-projects.yaml" file.
      },

      /**
       * Add an array of projects to in-memory structure, all at once
       * <p>This will replace all existing projects, not append to them.</p>
       * @param {[ConsoleProject]} values
       */
      putAll: function(values) {
        // Make sure parameter is not undefined and is
        // an array.
        if (CoreUtils.isNotUndefinedNorNull(values) && Array.isArray(values)) {
          projects = values;
        }
      },

      /**
       * Return a copy of the projects in in-memory structure
       * @returns {[ConsoleProject]}
       */
      getAll: function(){
        return [...projects];
      },

      /**
       * Return the project with a given id or undefined
       * @param {string} id
       * @returns {ConsoleProject|undefined}
       */
      getById: function(id) {
        return projects.find(project => project.id === id);
      },

      /**
       * Return the project with a given name or undefined
       * @param {string} name
       * @returns {ConsoleProject|undefined}
       */
      getByName: function(name) {
        if (name === '(unnamed)') name = '(Unnamed Project)';
        return projects.find(project => project.name === name);
      },

      /**
       * Return the first project with true assigned to the isDefault property, or undefined.
       * @returns {undefined | ConsoleProject}
       */
      getDefault: function() {
        return projects.find(project => project.isDefault);
      },

      getProjectId: function(name) {
        let projectId;

        if (name === '(unnamed)') name = '(Unnamed Project)';

        for (const index in projects) {
          // Ensure uniqueness of id property, for all known
          // projects.
          projects[index].id = `Project${index}`;
          // Set value of projectId variable, if the name of
          // the current project equals name parameter.
          if (projects[index].name === name) projectId = projects[index].id;
        }

        if (CoreUtils.isUndefinedOrNull(projectId)) projectId = `Project${projects.length}`;

        return projectId;
      },

      renameProject: function (oldName, newName) {
        if (oldName === '(unnamed)') oldName = '(Unnamed Project)';
        const index = projects.map(item => item.name).indexOf(oldName);
        if (index !== -1) {
          projects[index].name = newName;
        }
      },

      createFromEntry: function(entry) {
        if (entry.name === '(unnamed)') entry.name = '(Unnamed Project)';
        entry['id'] = this.getProjectId(entry.name);
        entry['isDefault'] = true;
        if (CoreUtils.isUndefinedOrNull(entry.dataProviders)) entry['dataProviders'] = [];
        let dataProviderType;
        // We know all the data providers, so go ahead and
        // generate the ids for them. We do this by calling
        // DataProviderManager.getNextId() in a tight loop,
        // so make sure you add the looping variable to the
        // result...to guarantee uniqueness.
        for (let i = 0; i < entry.dataProviders.length; i++) {
          if (CoreUtils.isUndefinedOrNull(entry.dataProviders[i].id)) {
            dataProviderType = DataProvider.prototype.typeFromName(entry.dataProviders[i].type);
            entry.dataProviders[i].id = `${DataProviderManager.getNextDataProviderId(dataProviderType) + i}`;
          }
        }
        if (CoreUtils.isUndefinedOrNull(entry.filename)) entry['filename'] = null;
        const project = createProject(entry);
        addProject(project);
        return project;
      },

      /**
       * Attempt to create a ``ConsoleProject`` instance from a given JSON string
       * @param {string} jsonString
       * @returns {Promise<ConsoleProject|*>}
       */
      createFromJSONString: function(jsonString) {
        return JsonParser.parse(jsonString)
          .then(entry => {
            if (CoreUtils.isNotUndefinedNorNull(entry.name)) {
              entry.isDefault = false;
              const project = this.createFromEntry(entry);
              return Promise.resolve(project);
            }
            else {
              const failure = {
                failureType: CoreTypes.FailureType.INCORRECT_CONTENT
              };
              return Promise.reject(failure);
            }
          });
      },

      loadConfigProjects: function() {
        return YamlParser.parse(WrcProjectsFileContents)
          .then(WrcProjects => {
            if (CoreUtils.isNotUndefinedNorNull(WrcProjects)){
              projects.forEach((project, index) => {
                if (project.isDefault) projects[index].isDefault = false;
              });
              WrcProjects.forEach((project) => {
                project.isDefault = true;
                this.createFromEntry(project);
              });
            }
            return Promise.resolve(this.getDefault());
          });
      }

    };
  }
);
