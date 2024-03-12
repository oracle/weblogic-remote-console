/**
 * @license
 * Copyright (c) 2023,2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
    'ojs/ojcore',
    'knockout',
    'wrc-frontend/integration/viewModels/utils',
    'wrc-frontend/core/runtime',
    'wrc-frontend/core/utils',
    'wrc-frontend/core/types',
    'ojs/ojknockout',
  ],
  function(
    oj,
    ko,
    ViewModelUtils,
    Runtime,
    CoreUtils,
    CoreTypes
  ) {
    function AppAlertsTemplate(viewParams){
      const self = this;
  
      this.i18n = {
        icons: {
          alerts: {
            id: 'app-alerts', iconFile: ko.observable('notifications-icon-blk_24x24'), disabled: ko.observable(false), visible: ko.observable(!Runtime.getProperty('features.appAlerts.disabled')),
            tooltip: oj.Translations.getTranslatedString('wrc-header.icons.alerts.tooltip')
          }
        },
        'menus': {
          'alerts': {
            'error': {
              id: 'error-alerts', iconFile: 'alerts-error-icon_24x24', disabled: false,
              value: ko.observable('')
            },
            'warning': {
              id: 'warning-alerts', iconFile: 'alerts-warning-icon_24x24', disabled: false,
              value: ko.observable('')
            },
            'info': {
              id: 'info-alerts', iconFile: 'alerts-info-icon_24x24', disabled: false,
              value: ko.observable('')
            },
            'view': {
              id: 'view-alerts', iconFile: '', disabled: false,
              value: oj.Translations.getTranslatedString('wrc-alerts.menus.alerts.view.value')
            }
          },
          'labels': {
            'alerts': {
              'singular': {value: oj.Translations.getTranslatedString('wrc-alerts.labels.alerts.singular.value')},
              'plural': {value: oj.Translations.getTranslatedString('wrc-alerts.labels.alerts.plural.value')}
            }
          }
        }
      };

      this.dataProvider = undefined;
      this.resourceData = undefined;
  
      this.alerts = {
        counts: {
          error: ko.observable(0),
          warning: ko.observable(0),
          info: ko.observable(0),
          total: ko.observable(0)
        }
      };
  
      this.signalBindings = [];
  
      this.connected = function () {
        setAlertsIconDisabledState(true);
  
        let binding = viewParams.signaling.modeChanged.add((newMode) => {
          setAlertsIconDisabledState(newMode === CoreTypes.Console.RuntimeMode.DETACHED.name);
        });
  
        self.signalBindings.push(binding);
  
        binding = viewParams.signaling.backendConnectionLost.add(() => {
          setAlertsIconDisabledState(true);
          setAlertsIconVisibility(false);
        });
  
        self.signalBindings.push(binding);
  
        binding = viewParams.signaling.projectSwitched.add((fromProject) => {
          setAlertsIconDisabledState(true);
          setAlertsIconVisibility(false);
        });
  
        self.signalBindings.push(binding);
  
        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            setAlertsIconDisabledState(true);
            setAlertsIconVisibility(false);
            setAlertsCountBadge({errors: 0, warnings: 0, infos: 0});
          }
        });
  
        self.signalBindings.push(binding);
  
        binding = viewParams.signaling.unsavedChangesDetected.add((exitFormCallback) => {
          self.canExitCallback = exitFormCallback;
        });

        this.signalBindings.push(binding);
      }.bind(this);
  
      this.disconnected = function () {
        // Detach all signal "add" bindings
        self.signalBindings.forEach(binding => {
          binding.detach();
        });
    
        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];

      }.bind(this);
  
      this.onDataProviderSelected = (newDataProvider) => {
        self.dataProvider = newDataProvider;
        setAlertsIconDisabledState(false);
      };

      this.launchAlertsMenu = function (event) {
        event.preventDefault();
    
        const beanTree = getBeanTree('monitoring');
    
        if (CoreUtils.isNotUndefinedNorNull(beanTree) && self.alerts.counts.total() > 0) {
          let word = (self.alerts.counts.error() === 1 ? oj.Translations.getTranslatedString('wrc-alerts.labels.alerts.singular.value') : oj.Translations.getTranslatedString('wrc-alerts.labels.alerts.plural.value'));
            self.i18n.menus.alerts.error.value(
            oj.Translations.getTranslatedString('wrc-alerts.menus.alerts.error.value', self.alerts.counts.error(), word)
          );
          word = (self.alerts.counts.warning() === 1 ? oj.Translations.getTranslatedString('wrc-alerts.labels.alerts.singular.value') : oj.Translations.getTranslatedString('wrc-alerts.labels.alerts.plural.value'));
          self.i18n.menus.alerts.warning.value(
            oj.Translations.getTranslatedString('wrc-alerts.menus.alerts.warning.value', self.alerts.counts.warning(), word)
          );
          word = (self.alerts.counts.info() === 1 ? oj.Translations.getTranslatedString('wrc-alerts.labels.alerts.singular.value') : oj.Translations.getTranslatedString('wrc-alerts.labels.alerts.plural.value'));
          self.i18n.menus.alerts.info.value(
            oj.Translations.getTranslatedString('wrc-alerts.menus.alerts.info.value', self.alerts.counts.info(), word)
          );
      
          document.getElementById('alertsMenu').open(event);
        }
      };
  
      this.alertsMenuBeforeOpen = function (event) {
        const nodeList = event.target.querySelectorAll('.cfe-menu-item-no-link > .oj-menu-option-text-only');
        if (nodeList !== null) {
          $(nodeList).contents().unwrap();
        }
      };
  
      this.alertsMenuClickListener = function (event) {
        const menuItemId = event.target.value;
        switch (menuItemId) {
          case 'error-alerts':
          case 'warning-alerts':
          case 'info-alerts':
          case 'view-alerts':
            openMessageCenterAlerts(self.resourceData);
            break;
        }
      };
  
      this.setAlertsProperties = (reply) => {
        const hasAlertCounts = CoreUtils.isNotUndefinedNorNull(reply.alerts);
    
        setAlertsIconVisibility(hasAlertCounts);
        setAlertsCountBadge(reply.counts);
    
        if (hasAlertCounts) {
          self.resourceData = reply.alerts.resourceData;
        }
      };
  
      function openMessageCenterAlerts(resourceData) {
        if (CoreUtils.isNotUndefinedNorNull(resourceData)){
          const beanTree = getBeanTree('monitoring');
          if (CoreUtils.isNotUndefinedNorNull(beanTree)) {
            const path = encodeURIComponent(resourceData);
            viewParams['perspective'] = {id: 'monitoring'};
            viewParams['beanTree'] = beanTree;
            ViewModelUtils.goToRouterPath(viewParams.parentRouter, `/${viewParams.perspective.id}/${path}`, self.canExitCallback);
            viewParams.signaling.galleryItemSelected.dispatch('monitoring');
          }
        }
      }
  
      function getBeanTree(perspectiveId) {
        let beanTree;
        if (CoreUtils.isNotUndefinedNorNull(self.dataProvider)){
          beanTree = self.dataProvider.getBeanTreeByPerspectiveId(perspectiveId);
        }
        return beanTree;
      }
  
      function setAlertsIconDisabledState(state) {
        self.i18n.icons.alerts.disabled(state);
        self.i18n.icons.alerts.iconFile(state ? 'notifications-icon-gry_24x24' : 'notifications-icon-blk_24x24');
        const link =  document.getElementById('alertsMenuLauncher');
        if (link !== null) {
          link.style.cursor = (state ? 'default' : 'pointer');
        }
      }
  
      function setAlertsIconVisibility(visible) {
        self.i18n.icons.alerts.visible(visible);
      }
  
      function setAlertsCountBadge(counts) {
        self.alerts.counts.error(counts.errors);
        self.alerts.counts.warning(counts.warnings);
        self.alerts.counts.info(counts.infos);
        self.alerts.counts.total(counts.total);
      }
    }

    return AppAlertsTemplate;
  }
);