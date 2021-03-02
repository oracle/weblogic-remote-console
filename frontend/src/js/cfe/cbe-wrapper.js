/**
 * @license
 * Copyright (c) 2020 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

/**
 * This singleton is the top-level modules in the <code>cbe-wrapper</code>.
 * <p>It provides functions and methods that use other <code>cbe-wrapper</code> modules to accomplish tasks.</p>
 */
 define(['cfe/cbe-types', 'cfe/common/runtime', 'cfe/http/adapter', 'cfe/binding/RDJResource', 'cfe/model/Model', 'ojs/ojlogger'],
  function (CbeTypes, Runtime, HttpAdapter, RDJResource, Model, Logger) {
  //private:
    const model = new Model();

    function createRDJResource(data){
      return new RDJResource(data);
    }
    
  //public:
    return {
      view: function (serviceType, uri) {
        return model.populate(serviceType, uri)
          .then((composite) => {
            return composite;
          })
          .catch((err) => {
            Logger.error("Error",err);
          });
      },
      new: function (serviceType, uri) {
      return model.populate(serviceType, uri)
        .then((composite) => {
          return composite;
        })
        .catch((err) => {
          Logger.error("Error",err);
        });
      },
      create: function (serviceType, uri, data) {
      let url = Runtime.getBaseUrl() + Runtime.getPathUri(serviceType, CbeTypes.ServiceComponentType.DATA) + "/" + uri;
      return HttpAdapter.post(url, data)
        .then(createRDJResource)
        .catch((err) => {
          Logger.error("Error",err);
        });
      },
      update: function (serviceType, uri, data) {
      let url = Runtime.getBaseUrl() + Runtime.getPathUri(serviceType, CbeTypes.ServiceComponentType.DATA) + "/" + uri;
      return HttpAdapter.post(url, data)
        .then(createRDJResource)
        .catch((err) => {
          Logger.error("Error",err);
        });
      },
      clone: function (serviceType, uri, data) {
      let url = Runtime.getBaseUrl() + Runtime.getPathUri(serviceType, CbeTypes.ServiceComponentType.DATA) + "/" + uri;
      return HttpAdapter.post(url, data)
        .then(createRDJResource)
        .catch((err) => {
          Logger.error("Error",err);
        });
      },
      delete: function (serviceType, uri) {
      let url = Runtime.getBaseUrl() + Runtime.getPathUri(serviceType, CbeTypes.ServiceComponentType.DATA) + "/" + uri;
      return HttpAdapter.delete(url)
        .then(createRDJResource)
        .catch((err) => {
          Logger.error("Error",err);
        });
      }
    }
  }
);
