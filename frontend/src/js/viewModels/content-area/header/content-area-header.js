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

      this.headerTitle = {
        label: ko.observable(''),
        description: ko.observable(''),
        classList: ko.observable('cfe-provider-icon')
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
          setContentAreaHeaderBranding({label: '', description: ''});
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            const title = {
              label: '',
              description: '',
              classList: 'cfe-provider-icon'
            };
            setContentAreaHeaderBranding(title);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderLoadFailed.add((dataProvider) => {
          if (dataProvider.id === Runtime.getDataProviderId()) {
            setContentAreaHeaderBranding({label: '', description: ''});
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

      this.dataProviderInfoPopupModuleConfig = ModuleElementUtils.createConfig({
        name: 'content-area/dataproviders-popup',
        params: {}
      });

      this.dataProviderInfoIconClickHandler = function (event) {
        self.dataProviderInfoPopupModuleConfig
          .then(moduleConfig => {
            const dataProvider = DataProviderManager.getDataProviderById(self.headerTitle.provider.id);
            moduleConfig.viewModel.showInfoPopup('headerTitleInfoPopup', dataProvider, '#data-provider-get-info');
          });
      };

      function toolbarButtonClicked(options) {
        switch(options.id) {
          case 'home': {
              viewParams.parentRouter.go('home');

              const beanTree = {
                name: options.id,
                type: options.id,
                label: oj.Translations.getTranslatedString('wrc-content-area-header.title.home')
              };

              let title = {
                label: beanTree.label,
                description: ''
              };

              if (CoreUtils.isNotUndefinedNorNull(self.headerTitle.provider)) {
                beanTree['provider'] = self.headerTitle.provider;
                viewParams.signaling.beanTreeSelected.dispatch(beanTree);
                viewParams.signaling.galleryItemSelected.dispatch(null);
              }

              title = createTitle(beanTree);
              setContentAreaHeaderBranding(title);
            }
            break;
        }
      }

      function toolbarButtonToggled(options) {
        console.log(`[CONTENT-AREA-HEADER] toolbarButtonToggled - options=${JSON.stringify(options)}`);
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
            name: beanTree.provider.name
          };
          title['description'] = `${title.provider.name} )`;
          title.classList = ViewModelUtils.getCustomCssProperty(`data-provider-${beanTree.provider.type}-classList`).replaceAll('\'', '');
        }

        return title;
      }

      function setContentAreaHeaderBranding(title) {
        self.headerTitle.label(title.label);
        self.headerTitle.description(title.description);
        self.headerTitle.classList(title.classList);
        self.headerTitle['provider'] = title.provider;

        document.title = `${Runtime.getName()}  ${(title.label.length > 0 ? '-' : '')}${title.label}`;
      }

    }

    return ContentAreaHeaderTemplate;
  }
);    
