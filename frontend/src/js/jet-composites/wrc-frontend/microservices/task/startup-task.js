/**
 * @license
 * Copyright (c) 2022,2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
 'use strict';

 /**
  * Class representing the metadata for a startup task
  * @module
  * @class
  * @classdesc Class representing the metadata for a startup task.
  */
 define(
   function(){
     /**
      * Create metadata for a startup task
      * @constructor
      * @param {string} id
      * @param {string} iconFiles
      * @typedef StartupTask
      */
     function StartupTask(id, iconFiles){
       this.id = id;
       // Include the label and description member
       // variables, even though their values come
       // from a resource bundle. Doing this allows
       // us eliminate "typeof XXX 'undefined'"
       // checks, in downstream code that uses a
       // StartupTask object.
       this.label = '';
       this.description = '';
       this.iconFiles = iconFiles;
     }
  
     StartupTask.prototype = {
       id: () => { return this.id; },
       label: (value) => { if (value) {this.label = value; } return this.label; },
       description: (value) => { if (value) {this.description = value; } return this.description; },
       iconFiles: function() { return (typeof this.iconFiles !== 'undefined' ? this.iconfiles : null) }
     };
 
     return StartupTask;
   }
 );
 