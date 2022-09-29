/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', './utils', 'wrc-frontend/core/utils', 'ojs/ojlogger'],
  function (oj, PageDefinitionUtils, CoreUtils, Logger) {

    const i18n = {
      messages: {
        'noNotFoundMessage': {
          'summary': oj.Translations.getTranslatedString('wrc-pdj-crosslinks.messages.noNotFoundMessage.summary'),
          'detail': oj.Translations.getTranslatedString('wrc-pdj-crosslinks.messages.noNotFoundMessage.detail', '{0}')
        }
      }
    };

    function getBeanTreeType(resourceData, perspectiveId) {
      let beanTreeType;
      if (CoreUtils.isNotUndefinedNorNull(resourceData)) {
        const pathSegments = resourceData.split('/').filter(e => e);
        const nameSwitch = (value) => ({
          'edit': (perspectiveId !== 'modeling' ? 'configuration' : 'modeling'),
          'serverConfig': 'view',
          'domainRuntime': 'monitoring',
          'securityData': 'security',
          'compositeConfig': 'composite',
          'propertyList': 'properties'
        })[value];
        beanTreeType = nameSwitch(pathSegments[2]);
      }
      return beanTreeType;
    }

    function getRDJLinksData(links, perspectiveId, breadcrumbsLength) {
      const data = [];
      if (breadcrumbsLength > 0) {
        links.forEach((item) => {
          data.push({
            name: item.label,
            label: item.label,
            descriptionHTML: '<p/>',
            message: (CoreUtils.isNotUndefinedNorNull(item.notFoundMessage) ? item.notFoundMessage : i18n.messages.noNotFoundMessage.detail.replace('{0}', item.label)),
            identity: item.resourceData,
            beanTreeType: getBeanTreeType(item.resourceData, perspectiveId)
          });
        });
      }
      return data;
    }

  //public:
    return {
      getBreadcrumbsLinksData: function (rdjData, perspectiveId, breadcrumbsLength) {
        return new Promise((resolve) => {
          const data = getRDJLinksData(rdjData.links, perspectiveId, breadcrumbsLength);
          resolve(data);
        });
      }
    };
  }
);
