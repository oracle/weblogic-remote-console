/**
 * @license
 * Copyright (c) 2021, 2022, Oracle Corporation and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * Class representing the metadata for a data provider.
 * @module
 * @typedef {{type: string, name: "edit"|"serverConfig"|"domainRuntime", label?: string, navtreeUri?: string, changeManagerUri? : string, readOnly?: boolean}} BeanTree
 * @typedef {"adminserver"|"model"|"modelComposite"|"properties"} DataProviderType
 */
define(['wrc-frontend/core/runtime', 'wrc-frontend/core/utils', 'wrc-frontend/core/cfe-errors', 'wrc-frontend/core/types', 'wrc-frontend/core/cbe-types',  'ojs/ojlogger'],
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
      if (CoreUtils.isUndefinedOrNull(name) || name === '') throw new CfeErrors.InvalidParameterError('Parameter cannot be undefined: name');
      if (CoreUtils.isUndefinedOrNull(type) || type === '') throw new CfeErrors.InvalidParameterError('Parameter cannot be undefined: type');

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
            types = ['configuration', 'view', 'monitoring', 'security'];
            break;
          case DataProvider.prototype.Type.MODEL:
            types = ['modeling'];
            break;
          case DataProvider.prototype.Type.COMPOSITE:
            types = ['composite'];
            break;
          case DataProvider.prototype.Type.PROPERTIES:
            types = ['properties'];
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
          names = ['edit', 'serverConfig', 'domainRuntime', 'securityData'];
          break;
        case DataProvider.prototype.Type.MODEL:
          names = ['edit'];
          break;
        case DataProvider.prototype.Type.COMPOSITE:
          names = ['compositeConfig'];
          break;
        case DataProvider.prototype.Type.PROPERTIES:
          names = ['propertyList'];
          break;
      }
      return names;
    }

    function getBeanTreeNameByBeanTreeType(beanTreeType) {
      const nameSwitch = (value) => ({
        'configuration': 'edit',
        'monitoring': 'domainRuntime',
        'view': 'serverConfig',
        'security': 'securityData',
        'modeling': 'edit',
        'composite': 'compositeConfig',
        'properties': 'propertyList'
      })[value];
      return nameSwitch(beanTreeType);
    }

  // public:
    DataProvider.prototype = {
      Type: Object.freeze({
        ADMINSERVER: {name: 'adminserver'},
        MODEL: {name: 'model'},
        COMPOSITE: {name: 'modelComposite'},
        PROPERTIES: {name: 'properties'}
      }),
      typeFromName: function (name) {
        return Object.values(this.Type).find(type => type.name === name);
      },
      BeanTreeName: Object.freeze({
        CONFIGURATION: {name: 'edit'},
        MONITORING: {name: 'domainRuntime'},
        VIEW: {name: 'serverConfig'},
        SECURITY: {name: 'securityData'},
        MODELING: {name: 'edit'},
        COMPOSITE: {name: 'compositeConfig'},
        PROPERTIES: {name: 'propertyList'}
      }),
      /**
       *
       * @param {object} responsePayload
       */
      populateFromResponse: function(responsePayload) {
        switch(responsePayload.providerType) {
          case CbeTypes.ProviderType.ADMIN_SERVER_CONNECTION.name:
            this.putValue('name', this.name);
            this.putValue('type', DataProvider.prototype.Type.ADMINSERVER.name);
            this.putValue('url', responsePayload.domainUrl);
            this.putValue('connectTimeout', parseInt(responsePayload.connectTimeout || 10000));
            this.putValue('readTimeout', parseInt(responsePayload.readTimeout || 20000));
            this.putValue('mode', responsePayload.mode);
            this.putValue('anyConnectionAttemptSuccessful', responsePayload.anyConnectionAttemptSuccessful || false);
            this.putValue('lastConnectionAttemptSuccessful', responsePayload.lastConnectionAttemptSuccessful || false);
            this.putValue('state', responsePayload.state || CoreTypes.Domain.ConnectState.DISCONNECTED.name);
            this.putValue('connectivity', responsePayload.connectivity || CoreTypes.Console.RuntimeMode.DETACHED.name);
            this.putValue('domainVersion',responsePayload.domainVersion || '');
            this.putValue('domainName', responsePayload.domainName || '');
            if (CoreUtils.isNotUndefinedNorNull(responsePayload.links)){
              this.putValue('linkLabel', responsePayload.links[0].label);
              this.putValue('linkResourceData', responsePayload.links[0].resourceData);
            }else {
              this.putValue('linkLabel', '');
              this.putValue('linkResourceData', '');
            }
            if (CoreUtils.isNotUndefinedNorNull(responsePayload.roles)) this.putValue('userRoles', responsePayload.roles.join(','));
            if (this['state'] === CoreTypes.Domain.ConnectState.CONNECTED.name) this.putValue('activationDatetime', new Date());
            this.beanTrees = this.getBeanTreesFromRoots(responsePayload.roots);
            break;
          case CbeTypes.ProviderType.WDT_MODEL.name:
            this.putValue('name', this.name);
            this.putValue('type', DataProvider.prototype.Type.MODEL.name);
            this.putValue('state', responsePayload.state || CoreTypes.Domain.ConnectState.DISCONNECTED.name);
            this.putValue('connectivity', responsePayload.connectivity || CoreTypes.Console.RuntimeMode.DETACHED.name);
            this.putValue('mode', responsePayload.mode || CbeTypes.ConnectionMode.STANDALONE.name);
            if (this['state'] === CoreTypes.Domain.ConnectState.CONNECTED.name) this.putValue('activationDatetime', new Date());
            this.beanTrees = this.getBeanTreesFromRoots(responsePayload.roots);
            this.beanTrees[0]['type'] = 'modeling';
            break;
          case CbeTypes.ProviderType.WDT_COMPOSITE.name:
            this.putValue('name', this.name);
            this.putValue('type', DataProvider.prototype.Type.COMPOSITE.name);
            this.putValue('state', responsePayload.state || CoreTypes.Domain.ConnectState.DISCONNECTED.name);
            this.putValue('connectivity', responsePayload.connectivity || CoreTypes.Console.RuntimeMode.DETACHED.name);
            this.putValue('mode', responsePayload.mode || CbeTypes.ConnectionMode.STANDALONE.name);
            if (this['state'] === CoreTypes.Domain.ConnectState.CONNECTED.name) this.putValue('activationDatetime', new Date());
            this.beanTrees = this.getBeanTreesFromRoots(responsePayload.roots);
            break;
          case CbeTypes.ProviderType.PROPERTY_LIST.name:
            this.putValue('name', this.name);
            this.putValue('type', DataProvider.prototype.Type.PROPERTIES.name);
            this.putValue('state', responsePayload.state || CoreTypes.Domain.ConnectState.DISCONNECTED.name);
            this.putValue('connectivity', responsePayload.connectivity || CoreTypes.Console.RuntimeMode.DETACHED.name);
            this.putValue('mode', responsePayload.mode || CbeTypes.ConnectionMode.STANDALONE.name);
            if (this['state'] === CoreTypes.Domain.ConnectState.CONNECTED.name) this.putValue('activationDatetime', new Date());
            this.beanTrees = this.getBeanTreesFromRoots(responsePayload.roots);
            break;
        }
      },

      /**
       *
       * @returns {string}
       */
      getBackendProviderType: function() {
        const typeSwitch = (value) => ({
          'adminserver': CbeTypes.ProviderType.ADMIN_SERVER_CONNECTION.name,
          'model': CbeTypes.ProviderType.WDT_MODEL.name,
          'modelComposite': CbeTypes.ProviderType.WDT_COMPOSITE.name,
          'properties': CbeTypes.ProviderType.PROPERTY_LIST.name
        })[value];
        return typeSwitch(this.type);
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
       * @param {"configuration"|"monitoring"|"view"|"modeling"|"composite"} perspectiveId
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
       * @param {"edit"|"serverConfig"|"domainRuntime"|"securityData"|"compositeConfig"|"propertyList"} beanTreeName
       * @returns {undefined|string}
       */
      getBeanTreeNavtreeUri: function(beanTreeName) {
        const beanTree = this.beanTrees.find(beanTree => beanTree.name === beanTreeName);
        return (CoreUtils.isNotUndefinedNorNull(beanTree) ? beanTree.navtree : undefined);
      },

      /**
       *
       * @param {"edit"|"serverConfig"|"domainRuntime"|"securityData"|"compositeConfig"|"propertyList"} beanTreeName
       * @returns {undefined|string}
       */
      getBeanTreeChangeManagerUri: function(beanTreeName='edit') {
        const beanTree = this.beanTrees.find(beanTree => beanTree.name === beanTreeName);
        return (CoreUtils.isNotUndefinedNorNull(beanTree) ? beanTree.changeManager : undefined);
      },

      /**
       * Get the download URI from the provider bean tree
       * @returns {undefined|string}
       */
      getBeanTreeDownloadUri: function() {
        const beanTree = this.beanTrees.find(beanTree => CoreUtils.isNotUndefinedNorNull(beanTree.download));
        return (CoreUtils.isNotUndefinedNorNull(beanTree) ? beanTree.download : undefined);
      },

      getBeanTreesFromRoots: function(roots) {
        let rtnval = ['configuration', 'view', 'monitoring', 'security', 'modeling', 'composite', 'properties'];
        roots.forEach((root) => {
          const nameSwitch = (value) => ({
            'edit': 'configuration',
            'serverConfig': 'view',
            'domainRuntime': 'monitoring',
            'securityData': 'security',
            'compositeConfig': 'composite',
            'propertyList': 'properties'
          })[value];
          const index = rtnval.indexOf(nameSwitch(root.name));
          if (index !== -1) {
            const beanTree = {
              name: root.name,
              type: nameSwitch(root.name)
            };
            beanTree['provider'] = {id: this.id, name: this.name};
            if (CoreUtils.isNotUndefinedNorNull(root.download)) beanTree['download'] = root.download;
            if (CoreUtils.isNotUndefinedNorNull(root.navtree)) beanTree['navtree'] = root.navtree;
            if (CoreUtils.isNotUndefinedNorNull(root.changeManager)) beanTree['changeManager'] = root.changeManager;
            // Ensure readOnly is defined, when the value is unspecified in the root, the tree is set as not read only
            beanTree['readOnly'] = (CoreUtils.isNotUndefinedNorNull(root.readOnly) ?  root.readOnly : false);
            if (CoreUtils.isNotUndefinedNorNull(root.actionsEnabled)) beanTree['actionsEnabled'] = root.actionsEnabled;
            if (CoreUtils.isNotUndefinedNorNull(root.simpleSearch)) beanTree['simpleSearch'] = root.simpleSearch;
            rtnval[index] = beanTree;
          }
        });
        return rtnval.filter(item => typeof item !== 'string');
      },

      addField: function(name, value) {
        if (typeof value === 'number') value = value.toString();
        this.putValue(name, value || '');
      },

      removeField: function(name) {
        delete this[name];
      },

      putValue: function(name, value) {
        this[name] = value;
      }

    };

    return DataProvider;
  }
);
