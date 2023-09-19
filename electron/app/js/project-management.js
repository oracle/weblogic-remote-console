/**
 * @license
 * Copyright (c) 2022, 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 * @ignore
 */

'use strict';

/**
 *
 * See {@link https://stackabuse.com/javascripts-immediately-invoked-function-expressions/}
 * @type {{UNNAMED_PROJECT, ResultReason, addNewProject, renameCurrentProject, deleteProject, readProjects, getDeletableProjects, selectProject, getCurrentProject, makeNewFromCurrent, setProjects, getSwitchableProjects, selectCurrentProject, setCurrentProject, processChangedProject, getProject}}
 */
const ProjectManagement = (() => {
  const fs = require('fs');
  const fsextra = require('fs-extra');
  const {log} = require('./console-logger');

  // Declare variable for IIFE class used to manage data
  // persisted in the user-projects.json file
  const UserProjects = require('./user-projects-json');
  const CoreUtils = require('./core-utils');
  let _projects;
  let _current_project;
  let timerId = 0;
  let _busy = false;

  /**
   * @private
   */
  function touchBusyFile() {
    const busyFile = `${UserProjects.getUserDataPath()}/busy-${_current_project.name}`;
    fsextra.ensureFileSync(busyFile);
    const now = new Date();
    fsextra.utimesSync(busyFile, now, now);
  }

  /**
   * @private
   */
  function keepTouchingBusyFile() {
    if (timerId != 0) {
      return;
    }
    try {
      timerId = setInterval(touchBusyFile, 1000);
    } catch(err) {
      log('error', `Failed to set the interval ${err}`);
    }
  }

  /**
   * @private
   */
  function stopTouchingBusyFile() {
    if (timerId != 0) {
      clearInterval(timerId);
      timerId = 0;
    }
  }

  /**
   * @private
   */
  function checkBusyFile() {
    // Just a little extra safety check
    if (timerId != 0) {
      stopTouchingBusyFile();
    }
    const busyFile = `${UserProjects.getUserDataPath()}/busy-${_current_project.name}`;
    if (!fs.existsSync(busyFile))
      return false;
    const stats = fs.statSync(busyFile);
    if (stats.mtime <= (new Date() - 1499)) {
      fs.rmSync(busyFile);
      return false;
    }
    return true;
  }

  return {
    ResultReason: Object.freeze({
      CANNOT_BE_NULL: {name: 'CANNOT_BE_NULL'},
      ALREADY_EXISTS: {name: 'ALREADY_EXISTS'},
      NAME_NOT_CHANGED: {name: 'NAME_NOT_CHANGED'},
      NAME_NOT_FOUND: {name: 'NAME_NOT_FOUND'}
    }),
    UNNAMED_PROJECT: {
      name: '(unnamed)',
      dataProviders: []
    },
    /**
     * Returns an array of projects that includes the one for the current project.
     * <p>It facilitates creating the submenu items for the ``Delete Project`` menu, under the ``File`` top-level menu.</p>
     * @returns {Array}
     */
    getDeletableProjects: () => {
      return UserProjects.getAll();
    },
    /**
     * Returns an array of projects that does not include the one for the current project.
     * <p>It facilitates creating the submenu items for the ``Switch To Project`` menu, under the ``File`` top-level menu.</p>
     * @returns {Array}
     */
    getSwitchableProjects: () => {
      return UserProjects.getAll().filter(project => CoreUtils.isUndefinedOrNull(project.current));
    },
    markProjectBusyState: (busy) => {
      _busy = busy;
      if (busy) {
        touchBusyFile();
        keepTouchingBusyFile();
      }
      else
        stopTouchingBusyFile();
    },
    isCurrentProjectBusy: () => {
      if (_busy)
        return true;
      return checkBusyFile();
    },
    getProject: (name) => {
      return UserProjects.get(name);
    },
    selectCurrentProject: () => {
      const project = UserProjects.getAll().find(item => typeof item.current !== 'undefined');
      if (project) _current_project = project;
    },
    /**
     * Removes the ``current`` field from the project that currently has it, and then adds the ``current`` field to the current project.
     * <p>NOTE: Zero or one of the projects can have the ``current`` field.</p>
     * @param {{name: string, current?: boolean, dataProviders: [{name: string, type: string, url: string, username: string, password: string}|{name: string, type: string, file: string}]}} project
     */
    setCurrentProject: (project) => {
      if (_current_project?.name !== project.name)
        _busy = false;
      _current_project = project;
      UserProjects.clean('current');
      _current_project.current = true;
      UserProjects.write();
    },
    /**
     *
     * @param {string} newName
     * @returns {{succeeded: boolean, resultReason?: ResultReason, previous_project: {name: string, current?: boolean, dataProviders: [{name: string, type: string, url: string, username: string, password: string}|{name: string, type: string, file: string}]}, current_project: {name: string, current?: boolean, dataProviders: [{name: string, type: string, url: string, username: string, password: string}|{name: string, type: string, file: string}]}}}
     */
    addNewProject: (newName) => {
      const results = {succeeded: false};
      if (CoreUtils.isUndefinedOrNull(newName)) {
        results['resultReason'] = ProjectManagement.ResultReason.CANNOT_BE_NULL;
      }
      else {
        UserProjects.clean('current');
        results['previous_project'] = JSON.parse(JSON.stringify(_current_project));
        const project = UserProjects.get(newName);
        _busy = false;
        if (CoreUtils.isUndefinedOrNull(project)) {
          _current_project = {
            name: newName,
            dataProviders: [],
            current: true
          };
          UserProjects.put(_current_project);
          results['current_project'] = _current_project;
          UserProjects.write();
          results.succeeded = true;
        }
        else {
          results['resultReason'] = ProjectManagement.ResultReason.ALREADY_EXISTS;
        }
      }
      return results;
    },
    /**
     * Change the name of the current project
     * @param {string} newName
     * @returns {{succeeded: boolean, resultReason?: ResultReason, renamed_project: {name: string, current?: boolean, dataProviders: [{name: string, type: string, url: string, username: string, password: string}|{name: string, type: string, file: string}]}, current_project: {name: string, current?: boolean, dataProviders: [{name: string, type: string, url: string, username: string, password: string}|{name: string, type: string, file: string}]}}}
     */
    renameCurrentProject: (newName) => {
      const results = {succeeded: false};
      if (CoreUtils.isUndefinedOrNull(newName)) {
        results['resultReason'] = ProjectManagement.ResultReason.CANNOT_BE_NULL;
      }
      else if (newName === _current_project.name) {
        results['resultReason'] = ProjectManagement.ResultReason.NAME_NOT_CHANGED;
      }
      else {
        const project = UserProjects.get(newName);
        if (CoreUtils.isUndefinedOrNull(project)) {
          if (_current_project.name === '(unnamed)') {
            _current_project.name = '(Unnamed Project)';
          }
          results['renamed_project'] = JSON.parse(JSON.stringify(_current_project));
          _current_project.name = newName;
          UserProjects.put(_current_project)
          ProjectManagement.setCurrentProject(_current_project);
          results['current_project'] = _current_project;
          results.succeeded = true;
        }
        else {
          results['resultReason'] = ProjectManagement.ResultReason.ALREADY_EXISTS;
        }
      }
      return results;
    },
    /**
     * Delete the project from projects array that has ``name`` as it's name. 
     * <p>This may or may not be the current project.</p>
     * @param {string} name 
     * @returns {{succeeded: boolean, resultReason?: ResultReason, deleted_project: {name: string, current?: boolean, dataProviders: [{name: string, type: string, url: string, username: string, password: string}|{name: string, type: string, file: string}]}, current_project: {name: string, current?: boolean, dataProviders: [{name: string, type: string, url: string, username: string, password: string}|{name: string, type: string, file: string}]}}}
     */
    deleteProject: (name) => {
      const results = {succeeded: false};
      // Attempt to get project to be deleted
      const deleted_project = UserProjects.get(name);
      _busy = false;
      if (CoreUtils.isUndefinedOrNull(deleted_project)) {
        // Didn't find a project in the projects array with
        // a name equal to name. Just assign the undefined
        // deleted_project constant to the result returned
        // from this function.
        results['deleted_project'] = deleted_project;
        results['resultReason'] = ProjectManagement.ResultReason.NAME_NOT_FOUND;
      }
      else {
        // Add deleted project to the result returned
        // from this function.
        results['deleted_project'] = JSON.parse(JSON.stringify(deleted_project));
        // Establish if deleted project is the current
        // project.
        const deleting_current_project = (deleted_project.name === _current_project.name);
        // Use UserProjects.replace() to replace deleted project
        // with first project in the projects array.
        UserProjects.replace(name);
        if (UserProjects.getAll().length === 0) {
          // The replace resulted in the projects array becoming
          // empty, so we need to make our current project '(unnamed)'
          _current_project = ProjectManagement.UNNAMED_PROJECT;
          // Tell UserProjects to add our current project to the
          // projects array.
          UserProjects.put(_current_project);
        }
        else if (deleting_current_project) {
          // The deleted project was the same as our current
          // project, but there is still at least one project
          // in the projects array. Set current project to
          // the first one.
          _current_project = UserProjects.getAll()[0];
        }
        // Set succeeded to true in the result returned from
        // this function.
        results.succeeded = true;
      }
      ProjectManagement.setCurrentProject(_current_project);
      results['current_project'] = _current_project;

      return results;
    },
    /**
     *
     * @param {string} name
     * @returns {{succeeded: boolean, previous_project: {name: string, current?: boolean, dataProviders: [{name: string, type: string, url: string, username: string, password: string}|{name: string, type: string, file: string}]}, current_project: {name: string, current?: boolean, dataProviders: [{name: string, type: string, url: string, username: string, password: string}|{name: string, type: string, file: string}]}}}
     */
    selectProject: (name) => {
      const results = {succeeded: false};
      const project = UserProjects.get(name);
      if (CoreUtils.isNotUndefinedNorNull(project)) {
        UserProjects.clean('current');
        results['previous_project'] = JSON.parse(JSON.stringify(_current_project));
        // We're not doing a UserProjects.write() here, because
        // the following ProjectManagement.setCurrentProject()
        // call is going to do that.
        ProjectManagement.setCurrentProject(project);
        results['current_project'] = _current_project;
        results.succeeded = true;
      }
      return results;
    },
    /**
     *
     * @param {[{name: string, current?: boolean, dataProviders: [{name: string, type: string, url: string, username: string, password: string}|{name: string, type: string, file: string}]}]} projects
     */
    setProjects: (projects) => {
      UserProjects.putAll(projects);
    },
    /**
     * Get a reference to the current project.
     * <p>A project with the name <code>(unnamed)</code> is returned, if no</p>
     * @returns {{name: string, current?: boolean, dataProviders: [{name: string, type: string, url: string, username: string, password: string}|{name: string, type: string, file: string}]}}
     */
    getCurrentProject: () => {
      const project = UserProjects.current();
      if (CoreUtils.isNotUndefinedNorNull(project)) {
        ProjectManagement.setCurrentProject(project);
      }
      else {
        ProjectManagement.setCurrentProject(ProjectManagement.UNNAMED_PROJECT);
      }
      return _current_project;
    },
    /**
     *
     */
    makeNewFromCurrent: () => {
      const existing_project = UserProjects.get(_current_project.name);
      if (CoreUtils.isNotUndefinedNorNull(existing_project)) {
        _current_project.dataProviders = UserProjects.getFilteredProviders(_current_project.dataProviders);
      }
      UserProjects.upsert(_current_project);
      ProjectManagement.setCurrentProject(_current_project);
    },
    /**
     * Add ``current_project`` to module-scoped ``projects`` variable, or simply update it if a project with the same ``id`` already exist.
     * @param {{name: string, current?: boolean, dataProviders: [{name: string, type: string, url: string, username: string, password: string}|{name: string, type: string, file: string}]}} project
     * @returns {{succeeded: boolean, process_action: 'new'|'updated'}}
     */
    processChangedProject: (project) => {
      /**
       * A closure that creates and returns a ``project`` using the specified ``entry`` JS object.
       * @param {{name: string, current?: boolean, dataProviders: [{name: string, type: "adminserver", url: string, username: string, password: string}|{name: string, type: "model", file: string}]}} entry
       * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures}
       * @private
       */
      function makeChanged(entry) {
        const changed_project = {
          name: entry.name,
          dataProviders: []
        };

        if (entry.name === '(Unnamed Project)') {
          changed_project.name = '(unnamed)';
        }

        if (CoreUtils.isUndefinedOrNull(entry.dataProviders)) {
          entry.dataProviders = [];
        }

        changed_project.dataProviders = UserProjects.getFilteredProviders(entry.dataProviders);

        return changed_project;
      }

      // Create a changed project from project 
      const changed_project = makeChanged(project);
      // The changed project may or may not be the same as one
      // with the same name, in the projects array. It also may
      // be one that needs to be add, because it's not in the
      // projects array yet.
      const result = UserProjects.upsert(changed_project);
      if (result.succeeded) {
        // Update module-scoped _current_project variable
        _current_project = changed_project;
        // Make changed project the new current project.
        ProjectManagement.setCurrentProject(_current_project);
      }
      return result;
    },
    readProjects: (userDataPath) => {
      UserProjects.read(userDataPath);
    }
  };

})();

module.exports = ProjectManagement;
