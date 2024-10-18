/**
 * @license
 * Copyright (c) 2020, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojmodule-element-utils',
  'wrc-frontend/microservices/provider-management/data-provider-helper',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/runtime',
  'ojs/ojknockout',
  'ojs/ojmodule-element',
  'ojs/ojmodule'
],
  function(
    oj,
    ko,
    ModuleElementUtils,
    DataProviderHelper,
    ViewModelUtils,
    Runtime
  ) {
    function HeaderTemplate(viewParams){
      const self = this;

      this.i18n = {
        app: {
          version: { value: Runtime.getProperty(Runtime.PropertyName.CFE_VERSION) },
          name: ko.observable(),
          tooltip: { value: oj.Translations.getTranslatedString('wrc-header.tooltips.appName.value') },
          region: {
            ariaLabel: {value: oj.Translations.getTranslatedString('wrc-header.region.ariaLabel.value')}
          }
        },
        labels: {
          connectivity: {
            insecure: oj.Translations.getTranslatedString('wrc-connectivity.labels.insecure.value')
          }
        },
        icons: {
          whatsNew: {id: 'whatsNew', iconFile: 'whats-new-icon-blk_24x24', visible: ko.observable(!Runtime.getProperty('features.whatsNew.disabled')),
            tooltip: oj.Translations.getTranslatedString('wrc-header.icons.whatsNew.tooltip')
          },
          howDoI: {id: 'howDoI', iconFile: 'howdoi-icon-blk_24x24', visible: ko.observable(!Runtime.getProperty('features.howDoI.disabled')),
            label: oj.Translations.getTranslatedString('wrc-header.icons.howDoI.tooltip')
          },
          tips: {id: 'tips', iconFile: 'tips-icon-blk_24x24', visible: ko.observable(true),
            tooltip: oj.Translations.getTranslatedString('wrc-header.icons.tips.tooltip')
          },
          help: {id: 'help', iconFile: 'toggle-help-on-blk_24x24', visible: ko.observable(true),
            tooltip: oj.Translations.getTranslatedString('wrc-header.icons.help.tooltip')
          },
          separator: {iconFile: 'separator-vertical_6x24',
            tooltip: oj.Translations.getTranslatedString('wrc-perspective.icons.separator.tooltip')
          },
          connectivity: {
            insecure: {iconFile: 'alert-insecure-connection-blk_24x24', visible: ko.observable(false),
              tooltip: oj.Translations.getTranslatedString('wrc-connectivity.icons.insecure.tooltip')
            }
          }
        }
      };

      // Initialize instance-scope variables used in header.html
      this.appInfoTitleClass = (viewParams.smScreen ? 'branding-area-title-sm' : 'branding-area-title-md');
      this.appName = oj.Translations.getTranslatedString('wrc-header.text.appName');
      this.i18n.app.name(this.appName);
      this.domainsConnectState = ko.observable();
  
      this.domainConnectionModuleConfig = ModuleElementUtils.createConfig({
        name: 'branding-area/console-backend-connection',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          onDataProvidersEmpty: viewParams.onDataProvidersEmpty
        }
      });

      this.navtreeTogglerModuleConfig = ModuleElementUtils.createConfig({
        name: 'branding-area/togglers/navtree-toggler',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          perspective: viewParams.perspective,
          onResized: viewParams.onResized
        }
      });
  
      this.appMenuModuleConfig = ModuleElementUtils.createConfig({
        name: 'branding-area/menu/app-menu',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling
        }
      });
  
      this.appProfileModuleConfig = ModuleElementUtils.createConfig({
        name: 'branding-area/profile/app-profile',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          onAppProfileActivated: viewParams.onAppProfileActivated
        }
      });
      
      this.appThemeModuleConfig = ModuleElementUtils.createConfig({
        name: 'branding-area/theme/app-theme',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling
        }
      });
      
      this.appAlertsModuleConfig = ModuleElementUtils.createConfig({
        name: 'branding-area/alerts/app-alerts',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling
        }
      });
  
      this.simpleSearchModuleConfig = ModuleElementUtils.createConfig({
        name: 'branding-area/search/simple-search',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling
        }
      });
  
      this.messageLineModuleConfig = ModuleElementUtils.createConfig({
        name: 'branding-area/message-line/message-line',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          perspective: viewParams.perspective,
          onAlertsReceived: setAlertsProperties
        }
      });

      this.signalBindings = [];

      this.connected = function () {
        notifyUnsavedChanges(false);
        
        let binding = viewParams.signaling.modeChanged.add((newMode) => {
          changedDomainConnectState();
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.backendConnectionLost.add(() => {
          changedDomainConnectState();
        });

        self.signalBindings.push(binding);
  
        binding = viewParams.signaling.dataProviderSelected.add(newDataProvider => {
          self.appAlertsModuleConfig
            .then(moduleConfig => {
              moduleConfig.viewModel.onDataProviderSelected(newDataProvider);
              setConsoleConnectionInsecureState(DataProviderHelper.getStatusInsecure(newDataProvider));
            });
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.projectSwitched.add((fromProject) => {
          setConsoleConnectionInsecureState(false);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            setConsoleConnectionInsecureState(false);
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
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];
      }.bind(this);

      this.brandingAreaResetAppClickListener = () => {
        ViewModelUtils.abandonUnsavedChanges('exit', self.canExitCallback)
          .then(reply => {
            if (reply) {
              ViewModelUtils.resetApp();
            }
          });
      }

      this.brandingAreaIconbarClickListener = (event) => {
        ViewModelUtils.abandonUnsavedChanges('exit', self.canExitCallback)
          .then(reply => {
            if (reply) {
              switch (event.currentTarget.id) {
                case 'whatsNew':
                  ViewModelUtils.openExternalURL(Runtime.getWhatsNewURL());
                  break;
                case 'howDoI':
                  ViewModelUtils.abandonUnsavedChanges('exit', self.canExitCallback)
                    .then(reply => {
                      if (reply) {
                        console.log('[HEADER] howDoI icon was clicked!');
                      }
                    })
                    .catch(failure => {
                      ViewModelUtils.failureResponseDefaultHandling(failure);
                    });
                  break;
                case 'tips':
                  viewParams.signaling.ancillaryContentItemSelected.dispatch('header', event.currentTarget.id, {stealthEnabled: false, positionOf: `#${self.i18n.icons.tips.id}`});
                  break;
                case 'help':
                  ViewModelUtils.openExternalURL(Runtime.getDocsURL());
                  break;
              }
            }
          })
          .catch(failure => {
            ViewModelUtils.failureResponseDefaultHandling(failure);
          });
      };

      function setAlertsProperties(reply) {
        self.appAlertsModuleConfig
          .then(moduleConfig => {
            moduleConfig.viewModel.setAlertsProperties(reply);
          });
      }

      function changedDomainConnectState() {
        self.domainsConnectState(Runtime.getDomainConnectState());
      }

      function setConsoleConnectionInsecureState(isDisplayed) {
        self.i18n.icons.connectivity.insecure.visible(isDisplayed);
      }
  
      function setIconbarIconVisibility(iconId, visible) {
        self.i18n.icons[iconId].visible(visible);
      }
  
      function notifyUnsavedChanges(state) {
        if (ViewModelUtils.isElectronApiAvailable()) {
          window.electron_api.ipc.invoke('unsaved-changes', state)
            .then()
            .catch(response => {
              ViewModelUtils.failureResponseDefaultHandling(response);
            });
        }
      }
    }

    return HeaderTemplate;
  }
);