/**
 * @license
 * Copyright (c) 2021, 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'wrc-frontend/microservices/provider-management/data-provider', 'wrc-frontend/core/utils', 'wrc-frontend/core/types', 'ojs/ojknockout'],
  function (oj, ko, DataProvider, CoreUtils, CoreTypes) {
    function DataProvidersPopupTemplate(viewParams) {
      const self = this;

      this.i18n = {
        'popups': {
          'info': {
            'provider': {
              'id': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.provider.id.label')},
            },
            'domain': {
              'name': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.name.label')},
              'proxyOverride': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.proxyOverride.label')},
              'url': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.url.label')},
              'version': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.version.label')},
              'username': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.username.label')},
              'sso': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.sso.label')},
              'roles': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.roles.label')},
              'connectTimeout': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.connectTimeout.label')},
              'readTimeout': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.readTimeout.label')},
              'insecure': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.insecure.label')},
              'anyAttempt': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.anyAttempt.label')},
              'lastAttempt': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.domain.lastAttempt.label')}
            },
            'model': {
              'file': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.model.file.label')},
              'props': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.model.props.label')}
            },
            'composite': {
              'models': {'value': ko.observableArray([]),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.composite.models.label')}
            },
            'proplist': {
              'file': {'value': ko.observable(),
                'label': oj.Translations.getTranslatedString('wrc-data-providers.popups.info.proplist.file.label')}
            }
          }
        }
      };

      this.providerInfo = {type: ko.observable('adminserver'), state: ko.observable('disconnected')};

      this.setProjectData = function(data) {
        self.providerInfo['project'] = data;
      };

      this.showInfoPopup = function(popupElementId, dataProvider, launcherSelector) {
        if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
          const popup = document.getElementById(popupElementId);
          if (popup !== null) {
            if (popup.isOpen()) popup.close();
            else {
              self.providerInfo.type(dataProvider.type);
              self.providerInfo.state(dataProvider.state);
              showDataProviderInfo(dataProvider, popup, launcherSelector);
            }
          }
        }
      };

      function showDataProviderInfo(dataProvider, popup, launcherSelector) {
        self.i18n.popups.info.provider.id.value(dataProvider.id);
        switch(dataProvider.type){
          case DataProvider.prototype.Type.ADMINSERVER.name:
            self.i18n.popups.info.domain.name.value(dataProvider?.status?.domainName);
            self.i18n.popups.info.domain.url.value(dataProvider.url);
            if (dataProvider?.settings?.proxyOverride)
              self.i18n.popups.info.domain.proxyOverride.value(dataProvider?.settings?.proxyOverride);
            else
              self.i18n.popups.info.domain.proxyOverride.value('');
            self.i18n.popups.info.domain.version.value(dataProvider?.status?.domainVersion);
            self.i18n.popups.info.domain.username.value(dataProvider.username);
            self.i18n.popups.info.domain.roles.value(dataProvider?.status?.userRoles);
            self.i18n.popups.info.domain.connectTimeout.value(dataProvider?.status?.connectTimeout);
            self.i18n.popups.info.domain.readTimeout.value(dataProvider?.status?.readTimeout);
            if (dataProvider.state === CoreTypes.Domain.ConnectState.DISCONNECTED.name) {
              self.i18n.popups.info.domain.insecure.value(dataProvider?.settings?.insecure ? true : false);
              self.i18n.popups.info.domain.sso.value(dataProvider?.settings?.sso ? true : false);
            }
            else {
              self.i18n.popups.info.domain.insecure.value(dataProvider?.status?.insecure ? true : false);
              self.i18n.popups.info.domain.sso.value(dataProvider?.status?.sso ? true : false);
            }
            break;
          case DataProvider.prototype.Type.MODEL.name:
            self.i18n.popups.info.model.file.value(CoreUtils.isNotUndefinedNorNull(dataProvider.file) ? dataProvider.file : oj.Translations.getTranslatedString('wrc-data-providers.prompts.info.fileNotSet.value'));
            var propsSet = (CoreUtils.isNotUndefinedNorNull(dataProvider.properties) && CoreUtils.isNotUndefinedNorNull(dataProvider.properties[0])) ? true : false;
            self.i18n.popups.info.model.props.value(propsSet ? dataProvider.properties[0] : undefined);
            break;
          case DataProvider.prototype.Type.COMPOSITE.name:
            self.i18n.popups.info.composite.models.value(CoreUtils.isNotUndefinedNorNull(dataProvider.models) ? dataProvider.models : []);
            break;
          case DataProvider.prototype.Type.PROPERTIES.name:
            self.i18n.popups.info.proplist.file.value(CoreUtils.isNotUndefinedNorNull(dataProvider.file) ? dataProvider.file : oj.Translations.getTranslatedString('wrc-data-providers.prompts.info.fileNotSet.value'));
            break;
        }
        popup.open(launcherSelector);
      }

    }

    return DataProvidersPopupTemplate;
  }
);