/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojarraydataprovider', 'ojs/ojmodule-element-utils', 'wrc-frontend/core/runtime', 'wrc-frontend/core/utils', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojmodule'],
  function(oj, ko, ArrayDataProvider, ModuleElementUtils, Runtime, CoreUtils) {
    function ContentAreaHeaderTemplate(viewParams){
      const self = this;

      this.headerTitle = {
        label: ko.observable(''),
        info: ko.observable('')
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
          const title = {
            label: oj.Translations.getTranslatedString(`wrc-content-area-header.title.${beanTree.type}`),
            info: (CoreUtils.isNotUndefinedNorNull(beanTree.provider) ? ` (${beanTree.provider.name})` : '')
          };
          setContentAreaHeaderBranding(title);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.popupMessageSent.add((message, autoTimeout) => {
          if (!message) {
            self.messages.removeAll();
          }
          else {
            if (CoreUtils.isNotUndefinedNorNull(message.severity) && ['confirmation', 'info'].includes(message.severity) ) {
              message.autoTimeout = autoTimeout || 1500;
              const value = parseInt(message.autoTimeout);
              if (isNaN(value) || message.autoTimeout < 1000 || message.autoTimeout > 60000) {
                message.autoTimeout = 1500;
              }
            }
            self.messages.push(message);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.backendConnectionLost.add(() => {
          setContentAreaHeaderBranding({label: '', info: ''});
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderLoadFailed.add((dataProvider) => {
          setContentAreaHeaderBranding({label: '', info: ''});
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
          onToolbarButtonClicked: setContentAreaHeaderBranding
        }
      });

      function setContentAreaHeaderBranding(title) {
        self.headerTitle.label(title.label);
        if (CoreUtils.isNotUndefinedNorNull(title.info)) {
          self.headerTitle.info(title.info);
        }
        document.title = `${Runtime.getName()}  ${(title.label.length > 0 ? '-' : '')}${title.label}`;
      }

    }

    return ContentAreaHeaderTemplate;
  }
);    
