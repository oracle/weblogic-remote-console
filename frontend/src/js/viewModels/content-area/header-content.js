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
  'ojs/ojarraydataprovider',
  'ojs/ojmodule-element-utils',
  './header/header-title',
  'wrc-frontend/microservices/provider-management/data-provider-manager',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/runtime',
  'wrc-frontend/core/utils',
  'ojs/ojknockout',
  'ojs/ojmodule-element',
  'ojs/ojmodule'
],
  function(
    oj,
    ko,
    ArrayDataProvider,
    ModuleElementUtils,
    HeaderTitle,
    DataProviderManager,
    ViewModelUtils,
    Runtime,
    CoreUtils
  ) {
    function ContentAreaHeaderContentTemplate(viewParams){
      const self = this;

      this.title = new HeaderTitle();
      this.i18n = this.title.getI18N();
      this.headerTitle = this.title.getValue();

      // System messages
      this.messages = ko.observableArray([]);
      this.messagesDataProvider = new ArrayDataProvider(this.messages);

      this.messagePosition = ko.observable({
        my: { vertical: 'top', horizontal: 'center' },
        at: { vertical: 'top', horizontal: 'center' },
        of: '#content-area-container'
      });

      this.signalBindings = [];

      this.connected = function() {
        let binding = viewParams.signaling.beanTreeChanged.add(beanTree => {
          const onTimeout = (beanTree) => {
            this.shoppingCartMenuModuleConfig
              .then(moduleConfig => {
                moduleConfig.viewModel.onBeanTreeChanged(beanTree);
                this.title.change(beanTree);
                setHeaderTitleIconbarIconsState(beanTree);
              })
              .catch(response => {
                ViewModelUtils.failureResponseDefaultHandling(response.failure);
              });
          };
  
          setTimeout(onTimeout.bind(self, beanTree), 5);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.popupMessageSent.add((message, autoTimeout, cancelAffordance = 'autoTimeout') => {
          if (!message) {
            self.messages.removeAll();
          }
          else {
            if (CoreUtils.isNotUndefinedNorNull(message.severity) && ['confirmation', 'info'].includes(message.severity) ) {
              if (cancelAffordance !== 'userDismissed') {
                message.autoTimeout = autoTimeout || 1500;
                const value = parseInt(message.autoTimeout);
                if (isNaN(value) || message.autoTimeout < 1000 || message.autoTimeout > 60000) {
                  message.autoTimeout = 1500;
                }
              }
            }
            self.messages.push(message);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.backendConnectionLost.add(() => {
          self.title.setEmpty();
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            self.title.setEmpty();
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderLoadFailed.add((dataProvider) => {
          if (dataProvider.id === Runtime.getDataProviderId()) {
            self.title.setEmpty();
          }
        });

        self.signalBindings.push(binding);

      }.bind(this);

      this.disconnected = function () {
        self.signalBindings.forEach(binding => { binding.detach(); });

        self.signalBindings = [];
      }.bind(this);

      this.contentAreaHeaderToolbarModuleConfig = ModuleElementUtils.createConfig({
        name: 'content-area/header/header-toolbar',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          onShortcutIconVisibilityChanged: setShortcutIconVisibility,
          onToolbarButtonClicked: toolbarButtonClicked
        }
      });

      this.shoppingCartMenuModuleConfig = ModuleElementUtils.createConfig({
        name: 'content-area/header/shoppingcart-menu',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          onChangesDiscarded: discardChangeManagerChanges
        }
      });
      
      this.beanPathHistoryIconModuleConfig = ModuleElementUtils.createConfig({
        name: 'content-area/header/beanpath-history-icon',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling
        }
      });
      
      this.contentAreaHeaderIconbarModuleConfig = ModuleElementUtils.createConfig({
        name: 'content-area/header/header-iconbar',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling
        }
      });

      // noinspection JSUnusedLocalSymbols
      this.dataProviderIconClickHandler = function (event) {
        self.title.visibility(true);
        openDataProviderActionsPopup('headerTitleProviderActionsPopup', '#data-provider-get-info');
        viewParams.signaling.ancillaryContentItemCleared.dispatch('content-area-header');
      };

      this.connectionsModelsIconBarClickListener = function(event) {
        closeDataProviderActionsPopup('headerTitleProviderActionsPopup');
        const action = event.currentTarget.getAttribute('data-item-action');
        event.currentTarget.setAttribute('data-item-id', self.title.getValue().provider().id);
        if (action === 'info') {
          event.currentTarget.setAttribute('data-launcher-selector', '#data-provider-get-info');
        }
        viewParams.signaling.dataProviderActionClicked.dispatch('content-area-header', event);
      };

      function setHeaderTitleIconbarIconsState(beanTree) {
        if (CoreUtils.isNotUndefinedNorNull(beanTree.provider.id !== 'cahid')) {
          const dataProvider = DataProviderManager.getDataProviderById(beanTree.provider.id);
          if (CoreUtils.isNotUndefinedNorNull(dataProvider)) {
            self.title.setIconbarIconsState(
              {
                state: dataProvider?.state || 'connected',
                settings: {
                  local: dataProvider.settings?.local || false
                }
              }
            );
          }
        }
      }

      function toolbarButtonClicked(changedState) {
        if (changedState.id === 'home') {
          self.contentAreaHeaderIconbarModuleConfig
            .then(moduleConfig => {
              // Hide the "Dashboards" shortcut icon
              moduleConfig.viewModel.setShortcutIconVisibility('dashboards', false);
            });
          
          self.shoppingCartMenuModuleConfig
            .then(moduleConfig => {
              // Hide the "Shopping Cart" menu launcher icon
              moduleConfig.viewModel.setIconbarIconVisibility('shoppingcart', false);
            });
  
          self.beanPathHistoryIconModuleConfig
            .then(moduleConfig => {
              // Hide the "Bean Path History" icon
              moduleConfig.viewModel.setIconbarIconVisibility('recentpages', false);
            });

          // Go to "Home" page
          viewParams.parentRouter.go('home');

          const beanTree = {
            name: changedState.id,
            type: changedState.id,
            label: oj.Translations.getTranslatedString('wrc-content-area-header.title.home')
          };

          if (CoreUtils.isNotUndefinedNorNull(self.title.getValue().provider().id !== 'cahid')) {
            beanTree['provider'] = self.title.getValue().provider();
            viewParams.signaling.beanTreeSelected.dispatch(beanTree);
            viewParams.signaling.galleryItemSelected.dispatch(null);
            viewParams.signaling.ancillaryContentItemCleared.dispatch('content-area-header');
          }

          self.title.change(beanTree);
        }
      }

      function openDataProviderActionsPopup(popupElementId, launcherSelector) {
        const popup = closeDataProviderActionsPopup(popupElementId);
        if (popup !== null) {
          popup.open(launcherSelector);
        }
      }

      function closeDataProviderActionsPopup(popupElementId) {
        const popup = document.getElementById(popupElementId);
        if (popup !== null) {
          if (popup.isOpen()) popup.close();
        }
        return popup;
      }

      function setShortcutIconVisibility(iconId, visible) {
        self.contentAreaHeaderIconbarModuleConfig
          .then(moduleConfig => {
            moduleConfig.viewModel.setShortcutIconVisibility(iconId, visible);
          });
      }

      function discardChangeManagerChanges(event) {
        viewParams.signaling.backendDataReloaded.dispatch();
      }

    }

    return ContentAreaHeaderContentTemplate;
  }
);