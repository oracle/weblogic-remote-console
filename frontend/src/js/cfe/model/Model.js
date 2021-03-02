/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['../cbe-types', '../common/runtime', '../http/adapter', '../binding/RDJResource', '../binding/PDJResource'],
  function (CbeTypes, Runtime, HttpAdapter, RDJResource, PDJResource ) {
    function Model() {
    }

  //private:
    function getRDJResource(serviceType, uri) {
      const service = Runtime.getService(serviceType, CbeTypes.ServiceComponentType.DATA);
      const url = Runtime.getBaseUrl() + Runtime.getPathUri(serviceType, CbeTypes.ServiceComponentType.DATA) + "/" + uri;
      return HttpAdapter.get(url);
    }

    function getPDJResource(serviceType, uri) {
      let url = Runtime.getBaseUrl() + Runtime.getPathUri(serviceType, Runtime.ServiceComponentType.PAGES) + "/" + uri;
      return HttpAdapter.get(url);
    }

  //public:
    Model.prototype.populate = function(serviceType, uri){
      var rdj;

      return getRDJResource(serviceType, uri)
      .then(function(content){
        // A little hack to set the correct 'pageDefinition'
        // query parameter for "new"
        if (uri.endsWith('dataAction=new')) {
          content['data'] = {};
          const str = content['pageDefinition'];
          content['pageDefinition'] = str.slice(0, str.indexOf("?")) + "?view=createForm";
        }
        rdj = new RDJResource(content);
        return content['pageDefinition'];
      })
      .then(function(uri){
        return getPDJResource(serviceType, uri);
      })
      .then(function(content){
        return { 
          RDJ: rdj, 
          PDJ: new PDJResource(content) 
        }
      })
      .catch(function (err){
        throw err;
      });
    };
    
    // Return Model constructor function
    return Model;
  }
);