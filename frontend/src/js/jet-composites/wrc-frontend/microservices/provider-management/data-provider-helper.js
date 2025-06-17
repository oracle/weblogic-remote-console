/**
 * @license
 * Copyright (c) 2023, 2025, Oracle Corporation and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
  'wrc-frontend/core/utils',
  'wrc-frontend/core/cbe-types'
],
  function (
    CoreUtils,
    CbeTypes
  ) {
    /**
     * @param {string} type
     * @returns {[string]}
     * @private
     */
    function getTypesByType (type) {
      let types = [];
      if (CoreUtils.isNotUndefinedNorNull(type)) {
        switch(type) {
          case 'adminserver':
            types = ['configuration', 'view', 'monitoring', 'security'];
            break;
          case 'model':
            types = ['modeling'];
            break;
          case 'modelComposite':
            types = ['composite'];
            break;
          case 'properties':
            types = ['properties'];
            break;
        }
      }
      return types;
    }

    /**
     * @param {string} type
     * @returns {[string]}
     * @private
     */
    function getNamesByType(type) {
      let names = [];
      switch(type) {
        case 'adminserver':
          names = ['edit', 'serverConfig', 'domainRuntime', 'securityData'];
          break;
        case 'model':
          names = ['edit'];
          break;
        case 'modelComposite':
          names = ['compositeConfig'];
          break;
        case 'properties':
          names = ['propertyList'];
          break;
      }
      return names;
    }

  //public:
    return {
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
      getStatusDomainName: function(dataProvider) {
        return (dataProvider && dataProvider.status && dataProvider.status.domainName ? dataProvider.status.domainName : undefined);
      },
      getStatusDomainVersion: function(dataProvider) {
        return (dataProvider && dataProvider.status && dataProvider.status.domainVersion ? dataProvider.status.domainVersion : undefined);
      },
      getStatusUserRoles: function(dataProvider) {
        return (dataProvider && dataProvider.status && dataProvider.status.userRoles ? dataProvider.status.userRoles : undefined);
      },
      getStatusConnectTimeout: function(dataProvider) {
        return (dataProvider && dataProvider.status && dataProvider.status.connectTimeout ? dataProvider.status.connectTimeout : undefined);
      },
      getStatusReadTimeout: function(dataProvider) {
        return (dataProvider && dataProvider.status && dataProvider.status.readTimeout ? dataProvider.status.readTimeout : undefined);
      },
      getStatusInsecure: function(dataProvider) {
        return (dataProvider && dataProvider.status && dataProvider.status.insecure ? dataProvider.status.insecure : undefined);
      },
      getStatusSso: function(dataProvider) {
        return (dataProvider && dataProvider.status && dataProvider.status.sso ? dataProvider.status.sso : false);
      },
      getStatusSsoId: function(dataProvider) {
        return (dataProvider && dataProvider.status && dataProvider.status.ssoid ? dataProvider.status.ssoid : undefined);
      },
      getSettingsProxyOverride: function(dataProvider) {
        return (dataProvider && dataProvider.settings && dataProvider.settings.proxyOverride ? dataProvider.settings.proxyOverride : '');
      },
      getSettingsInsecure: function(dataProvider) {
        return (dataProvider && dataProvider.settings && dataProvider.settings.insecure ? dataProvider.settings.insecure : undefined);
      },
      getSettingsSso: function(dataProvider) {
        return (dataProvider && dataProvider.settings && dataProvider.settings.sso ? dataProvider.settings.sso : undefined);
      },
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
       * @param {string} type
       * @returns {[string]}
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
       * @param {string} beanTreeType
       * @returns {string}
       */
      getProviderTypeByBeanTreeType: (beanTreeType) => {
        let type = '';
        if (['configuration', 'view', 'monitoring', 'security'].includes(beanTreeType)) {
          type = 'adminserver';
        }
        else if (beanTreeType === 'modeling') {
          type = 'model';
        }
        else if (beanTreeType === 'composite') {
          type = 'modelComposite';
        }
        else if (beanTreeType === 'properties') {
          type = 'properties';
        }
        return type;
      }

    };

  }
);