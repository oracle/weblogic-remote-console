/**
 * @license
 * Copyright (c) 2020, 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojarraydataprovider', 'ojs/ojmodule-element-utils', 'wrc-frontend/microservices/provider-management/data-provider-manager', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/runtime', 'wrc-frontend/core/utils', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojmodule'],
  function(oj, ko, ArrayDataProvider, ModuleElementUtils, DataProviderManager, ViewModelUtils, Runtime, CoreUtils) {
    function ContentAreaHeaderTemplate(viewParams){
      const self = this;

      this.i18n = {
        'icons': {
          'info': {
            iconFile: 'data-providers-info-icon-brn_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-data-providers.icons.info.tooltip')
          },
          'edit': {
            iconFile: 'data-providers-manage-icon-brn_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-data-providers.icons.edit.tooltip')
          },
          'deactivate': {
            iconFile: 'data-providers-deactivate-icon-brn_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-data-providers.icons.deactivate.tooltip')
          },
          'delete': {
            iconFile: 'data-providers-delete-icon-brn_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-data-providers.icons.delete.tooltip')
          }
        }
      };

      this.headerTitle = {
        visible: ko.observable(false),
        label: ko.observable(''),
        description: ko.observable(''),
        classList: ko.observable('cfe-provider-icon'),
        provider: ko.observable({type: 'adminserver', id: 'cahid'})
      };
  
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
          function changeContentAreaHeaderTitle(beanTree) {
            const title = createTitle(beanTree);
            setContentAreaHeaderBranding(title);
          }

          changeContentAreaHeaderTitle(beanTree);
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
          setContentAreaHeaderBranding(createTitleEmpty());
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            setContentAreaHeaderBranding(createTitleEmpty());
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderLoadFailed.add((dataProvider) => {
          if (dataProvider.id === Runtime.getDataProviderId()) {
            setContentAreaHeaderBranding(createTitleEmpty());
          }
        });

        self.signalBindings.push(binding);

      }.bind(this);

      this.disconnected = function () {
        self.signalBindings.forEach(binding => { binding.detach(); });

        self.signalBindings = [];
      }.bind(this);

      this.contentAreaHeaderButtonsToolbarModuleConfig = ModuleElementUtils.createConfig({
        name: 'content-area/header/buttons-toolbar',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          onToolbarButtonClicked: toolbarButtonClicked,
          onToolbarButtonToggled: toolbarButtonToggled
        }
      });

      this.dataProviderIconClickHandler = function (event) {
        self.headerTitle.visible(true);
        openDataProviderActionsPopup('headerTitleProviderActionsPopup', '#data-provider-get-info');
        viewParams.signaling.ancillaryContentItemCleared.dispatch('content-area-header');
      };

      this.connectionsModelsIconBarClickListener= function(event) {
        closeDataProviderActionsPopup('headerTitleProviderActionsPopup');
        const action = event.currentTarget.attributes['data-item-action'].value;
        event.currentTarget.setAttribute('data-item-id', self.headerTitle.provider().id);
        if (action === 'info') {
          event.currentTarget.setAttribute('data-launcher-selector', '#data-provider-get-info');
        }
        viewParams.signaling.dataProviderActionClicked.dispatch('content-area-header', event);
      };

      function toolbarButtonClicked(changedState) {
        switch(changedState.id) {
          case 'home': {
              viewParams.parentRouter.go('home');

              const beanTree = {
                name: changedState.id,
                type: changedState.id,
                label: oj.Translations.getTranslatedString('wrc-content-area-header.title.home')
              };

              if (CoreUtils.isNotUndefinedNorNull(self.headerTitle.provider().id !== 'cahid')) {
                beanTree['provider'] = self.headerTitle.provider();
                viewParams.signaling.beanTreeSelected.dispatch(beanTree);
                viewParams.signaling.galleryItemSelected.dispatch(null);
                viewParams.signaling.ancillaryContentItemCleared.dispatch('content-area-header');
              }

              const title = createTitle(beanTree);
              setContentAreaHeaderBranding(title);
            }
            break;
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

      function toolbarButtonToggled(changedState) {
        console.log(`[CONTENT-AREA-HEADER] toolbarButtonToggled - changedState=${JSON.stringify(changedState)}`);
      }

      function createTitle(beanTree) {
        const title = {
          label: (['ancillary','home'].includes(beanTree.type) ? oj.Translations.getTranslatedString('wrc-content-area-header.title.home') : oj.Translations.getTranslatedString(`wrc-content-area-header.title.${beanTree.type}`)),
          classList: 'cfe-provider-icon'
        };
        if (CoreUtils.isNotUndefinedNorNull(beanTree.provider)) {
          title.label = `${title.label} (`;
          title['provider'] = {
            type: beanTree.provider.type,
            id: beanTree.provider.id,
            name: beanTree.provider.name,
            state: 'connected'
          };
          title['description'] = `${title.provider.name} )`;
          title.classList = ViewModelUtils.getCustomCssProperty(`data-provider-${beanTree.provider.type}-classList`).replaceAll('\'', '');
        }
        else {
          title['description'] = '';
          title['provider'] = {
            type: 'adminserver',
            id: 'cahid'
          };
        }

        return title;
      }

      function createTitleEmpty() {
        return {
          label: '',
          description: '',
          classList: 'cfe-provider-icon',
          provider: {
            type: 'adminserver',
            id: 'cahid'
          }
        };
      }

      function setContentAreaHeaderBranding(title) {
        self.headerTitle.label(title.label);
        self.headerTitle.description(title.description);
        self.headerTitle.classList(title.classList);
        self.headerTitle.provider(title.provider);

        document.title = `${Runtime.getName()}  ${(title.label.length > 0 ? '-' : '')}${title.label}`;
      }

    }

    return ContentAreaHeaderTemplate;
  }
);