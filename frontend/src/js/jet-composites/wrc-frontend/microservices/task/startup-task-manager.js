/**
 * @license
 * Copyright (c) 2022,2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

 'use strict';

 /**
  * @description This module contains functions for managing instances of the ``StartupTask`` class.
  * @module
  */
 define(['wrc-frontend/core/parsers/yaml', 'text!wrc-frontend/config/startup-tasks.yaml', './startup-task', 'ojs/ojlogger'],
   function(YamlParser, StartupTaskFileContents, StartupTask, Logger){
 
     var startupTasks = [];
 
     YamlParser.parse(StartupTaskFileContents)
       .then(config => {
         let startupTask;
         config['startup-tasks'].forEach((entry) => {
           startupTask = new StartupTask(entry.id, entry.iconFiles);
           startupTasks.push(startupTask);
         }); 
       })
       .catch((err) => {
           Logger.error(err);
       });
  
     return {
       /**
        *
        * @param {string} taskId
        * @returns {StartupTask}
        */
       getById: (taskId) => {
         return startupTasks.find((task) => {
           return task.id === taskId;
         });
       },
 
       /**
        *
        * @returns {StartupTask[]}
        */
       getAll: () => {
         return startupTasks;
       }
     };
   }
 );
 