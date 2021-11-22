/**
 * @license
 * Copyright (c) 2021, Oracle Corporation and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

/**
 * Class representing the metadata for a data provider.
 * @module
 * @typedef {{type: string, name: "edit"|"serverConfig"|"domainRuntime", label?: string, navtreeUri?: string, changeManagerUri? : string, readOnly?: boolean}} BeanTree
 * @typedef {"adminserver"|"model"} DataProviderType
 */
define(['../../core/runtime', '../../core/utils', '../../core/cfe-errors', '../../core/types', '../../core/cbe-types',  'ojs/ojlogger'],
  function(Runtime, CoreUtils, CfeErrors, CoreTypes, CbeTypes, Logger){

    /**
     * Create an in-memory data provider.
     * @constructor
     * @param {string} id
     * @param {string} name
     * @param {string} type
     * @param {[BeanTree]} beanTrees
     * @throws {InvalidParameterError} If value of ``name`` or ``type`` parameters are ``undefined``, ``null`` or an empty string.
     */
    function DataProvider(id, name, type, beanTrees){
      if (CoreUtils.isUndefinedOrNull(name) || name === "") throw new CfeErrors.InvalidParameterError(`Parameter cannot be undefined: name`);
      if (CoreUtils.isUndefinedOrNull(type) || type === "") throw new CfeErrors.InvalidParameterError(`Parameter cannot be undefined: type`);

      this.id = id;
      this.name = name;
      this.type = type;
      this.beanTrees = beanTrees || [];
    }

    /**
     * @param {DataProviderType} type
     * @returns {[string]}
     * @private
     */
    function getTypesByType (type) {
      let types = [];
      if (CoreUtils.isNotUndefinedNorNull(type)) {
        switch(type) {
          case DataProvider.prototype.Type.ADMINSERVER:
            types = ["configuration", "view", "monitoring"];
            break;
          case DataProvider.prototype.Type.MODEL:
            types = ["modeling"];
            break;
        }
      }
      return types;
    }

    /**
     * @param {DataProviderType} type
     * @returns {[string]}
     * @private
     */
    function getNamesByType(type) {
      let names = [];
      switch(type) {
        case DataProvider.prototype.Type.ADMINSERVER:
          names = ["edit", "serverConfig", "domainRuntime"];
          break;
        case DataProvider.prototype.Type.MODEL:
          names = ["edit"];
          break;
      }
      return names;
    }

    function getBeanTreeNameByBeanTreeType(beanTreeType) {
      const nameSwitch = (value) => ({
        "configuration": "edit",
        "monitoring": "domainRuntime",
        "view": "serverConfig",
        "modeling": "edit"
      })[value];
      return nameSwitch(beanTreeType);
    }

  // public:
    DataProvider.prototype = {
      Type: Object.freeze({
        ADMINSERVER: {name: "adminserver"},
        MODEL: {name: "model"}
      }),
      typeFromName: function (name) {
        return Object.values(this.Type).find(type => type.name === name);
      },
      BeanTreeName: Object.freeze({
        CONFIGURATION: {name: "edit"},
        MONITORING: {name: "model"}
      }),
      /**
       *
       * @param {object} responsePayload
       */
      populateFromResponse: function(responsePayload) {
        switch(responsePayload.providerType) {
          case CbeTypes.ProviderType.ADMIN_SERVER_CONNECTION.name:
            this.putValue("name", this.name);
            this.putValue("type", DataProvider.prototype.Type.ADMINSERVER.name);
            this.putValue("url", responsePayload.domainUrl);
            this.putValue("connectTimeout", parseInt(responsePayload.connectTimeout || 10000));
            this.putValue("readTimeout", parseInt(responsePayload.readTimeout || 20000));
            this.putValue("mode", responsePayload.mode);
            this.putValue("anyConnectionAttemptSuccessful", responsePayload.anyConnectionAttemptSuccessful || false);
            this.putValue("lastConnectionAttemptSuccessful", responsePayload.lastConnectionAttemptSuccessful || false);
            this.putValue("state", responsePayload.state || CoreTypes.Domain.ConnectState.DISCONNECTED.name);
            this.putValue("connectivity", responsePayload.connectivity || CoreTypes.Console.RuntimeMode.DETACHED.name);
            this.putValue("domainVersion",responsePayload.domainVersion || "");
            this.putValue("domainName", responsePayload.domainName || "");
            if (this["state"] === CoreTypes.Domain.ConnectState.CONNECTED.name) this.putValue("activationDatetime", new Date());
            this.beanTrees = this.getBeanTreesFromRoots(responsePayload.roots);
            break;
          case CbeTypes.ProviderType.WDT_MODEL.name:
            this.putValue("name", this.name);
            this.putValue("type", DataProvider.prototype.Type.MODEL.name);
            this.putValue("state", responsePayload.state || CoreTypes.Domain.ConnectState.DISCONNECTED.name);
            this.putValue("connectivity", responsePayload.connectivity || CoreTypes.Console.RuntimeMode.DETACHED.name);
            this.putValue("mode", responsePayload.mode || CbeTypes.ConnectionMode.STANDALONE.name);
            if (this["state"] === CoreTypes.Domain.ConnectState.CONNECTED.name) this.putValue("activationDatetime", new Date());
            this.beanTrees = this.getBeanTreesFromRoots(responsePayload.roots);
            this.beanTrees[0]["type"] = "modeling";
            break;
        }
      },

      /**
       *
       * @param {DataProviderType} type
       * @returns {Array}
       */
      getBeanTreesByType: function(type) {
        let beanTrees = [];
        if (CoreUtils.isNotUndefinedNorNull(type)) {
          const types = getTypesByType(type);
          const names = getNamesByType(type);
          types.forEach((item, index) => {
            beanTrees.push({
              name: names[index],
              type: item
            });
          });
        }
        return beanTrees;
      },

      /**
       *
       * @param {"configuration"|"monitoring"|"view"|"modeling"} perspectiveId
       * @returns {BeanTree|undefined}
       */
      getBeanTreeByPerspectiveId: function (perspectiveId) {
        let beanTree;
        if (CoreUtils.isNotUndefinedNorNull(perspectiveId)) {
          beanTree = this.beanTrees.find(item => item.type === perspectiveId);
        }
        return beanTree;
      },

      /**
       *
       * @param {BeanTree} beanTree
       */
      addBeanTree: function(beanTree) {
        if (CoreUtils.isUndefinedOrNull(beanTree)) {
          this.beanTrees.push(beanTree);
        }
      },

      /**
       * @param {"edit"|"serverConfig"|"domainRuntime"} beanTreeName
       * @returns {undefined|string}
       */
      getBeanTreeNavtreeUri: function(beanTreeName) {
        const beanTree = this.beanTrees.find(beanTree => beanTree.name === beanTreeName);
        return (CoreUtils.isNotUndefinedNorNull(beanTree) ? beanTree.navtree : undefined);
      },

      /**
       *
       * @returns {undefined|string}
       */
      getBeanTreeChangeManagerUri: function() {
        const beanTree = this.beanTrees.find(beanTree => beanTree.name === "edit");
        return (CoreUtils.isNotUndefinedNorNull(beanTree) ? beanTree.changeManager : undefined);
      },

      /**
       *
       * @returns {undefined|string}
       */
      getBeanTreeDownloadUri: function() {
        const beanTree = this.beanTrees.find(beanTree => beanTree.type === "modeling");
        return (CoreUtils.isNotUndefinedNorNull(beanTree) ? beanTree.download : undefined);
      },

      getBeanTreesFromRoots: function(roots) {
        let rtnval = ["configuration", "view", "monitoring", "modeling"];
        roots.forEach((root) => {
          const nameSwitch = (value) => ({
            "edit": "configuration",
            "serverConfig": "view",
            "domainRuntime": "monitoring"
          })[value];
          const index = rtnval.indexOf(nameSwitch(root.name));
          if (index !== -1) {
            const beanTree = {
              name: root.name,
              type: nameSwitch(root.name)
            };
            if (CoreUtils.isNotUndefinedNorNull(root.download)) beanTree["download"] = root.download;
            if (CoreUtils.isNotUndefinedNorNull(root.navtree)) beanTree["navtree"] = root.navtree;
            if (CoreUtils.isNotUndefinedNorNull(root.changeManager)) beanTree["changeManager"] = root.changeManager;
            // Ensure readOnly is defined, when the value is unspecified in the root, the tree is set as not read only
            beanTree["readOnly"] = (CoreUtils.isNotUndefinedNorNull(root.readOnly) ?  root.readOnly : false);
            if (CoreUtils.isNotUndefinedNorNull(root.actionsEnabled)) beanTree["actionsEnabled"] = root.actionsEnabled;
            rtnval[index] = beanTree;
          }
        });
        return rtnval.filter(item => typeof item !== "string");
      },

      addField: function(name, value) {
        if (typeof value === "number") value = value.toString();
        this.putValue(name, value || '');
      },

      putValue: function(name, value) {
        this[name] = value;
      }

    };

    return DataProvider;
  }
);
