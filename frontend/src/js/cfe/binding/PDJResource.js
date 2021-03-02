/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['cfe/binding/Resource', 'cfe/binding/Form', 'cfe/binding/Table', 'cfe/binding/Slice'],
  function (Resource, Form, Table, Slice) {
    function PDJResource(content) {
      Resource.call(this, content['weblogicVersion']);
      if (content['form'] !== undefined) {
        this.form = new Form(content['form']);
        if (content['slices'] != undefined) {
          this.slices = [];
          content['slices'].forEach(element => {
            this.slices.push(new Slice(element));
          });
        }
      }  
      else if (content['createForm'] !== undefined) {
        this.form = new Form(content['createForm']);
      }
      else if (content['table'] !== undefined) {
        this.table = new Table(content['table']);
      }    
      else {
        throw new Error("Value of 'content' argument does not contain a field named 'table' or 'form'");
      }
      if (content['helpPageTitle'] !== undefined) this.helpPageTitle = content['helpPageTitle'];
      if (content['helpTaskLabels'] !== undefined) this.helpTaskLabels = content['helpTaskLabels'];
      if (content['helpTopics'] !== undefined) this.helpTopics = content['helpTopics'];
      if (content['introductionHTML'] !== undefined) this.introductionHTML = content['introductionHTML'];
    }

    PDJResource.PageType = Object.freeze({
      FORM: {name: "form"},
      TABLE: {name: "table"}
    });

    // Allow properties of Resource 'superclass' to be access 
    // by PDJResource object 'subclass'
    PDJResource.prototype = Object.create(Resource.prototype);

    PDJResource.prototype.getPageType = function(){
      if (this.form) {
        return PDJResource.PageType.FORM;
      }  
      else if (this.table) {
        return PDJResource.PageType.TABLE;
      }  
      else {
        throw new Error("Value of 'content' argument does not contain a field named 'table' or 'form'");
      }  
    };

    PDJResource.prototype.getHelpPageTitle = function(){
      return (this.helpPageTitle ? this.helpPageTitle : undefined);
    };

    PDJResource.prototype.getHelpTaskLabels = function(){
      return (this.helpTaskLabels ? this.helpTaskLabels : undefined);
    };

    PDJResource.prototype.getHelpTopics = function(){
      return (this.helpTopics ? this.helpTopics : undefined);
    };

    PDJResource.prototype.getIntroductionHTML = function(){
      return (this.introductionHTML ? this.introductionHTML : undefined);
    };

    PDJResource.prototype.getForm = function(){
      if (this.getPageType() === PDJResource.PageType.FORM) {
        return this.form;
      }
      else {
        return undefined;
      }
    };

    PDJResource.prototype.getTable = function(){
      if (this.getPageType() === PDJResource.PageType.TABLE) {
        return this.table;
      }
      else {
        return undefined;
      }
    };

    /**
    * Returns an array of Slice objects
    * @return {Slice[]} 
    */
    PDJResource.prototype.getSlices = function() {
      return this.slices;
    };

    // Return PDJResource constructor function
    return PDJResource;
  }
);