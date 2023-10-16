/**
 * @license
 * Copyright (c) 2020, 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/microservices/preferences/preferences', 'wrc-frontend/core/runtime', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojmodule'],
  function(oj, ko, ModuleElementUtils, ViewModelUtils, Preferences, Runtime, CoreTypes, CoreUtils) {
    function HeaderTemplate(viewParams){
      const self = this;

      this.i18n = {
        app: {
          version: { value: Runtime.getProperty(Runtime.PropertyName.CFE_VERSION) },
          name: ko.observable()
        },
        labels: {
          connectivity: {
            insecure: oj.Translations.getTranslatedString('wrc-connectivity.labels.insecure.value')
          }
        },
        icons: {
          wrcApp: {iconFile: 'wrc-app-icon-color_88x78'},
          messageCenter: {id: 'messageCenter', iconFile: 'notifications-icon-blk_24x24', visible: ko.observable(false),
            tooltip: oj.Translations.getTranslatedString('wrc-header.icons.messageCenter.tooltip')
          },
          help: {id: 'help', iconFile: 'toggle-help-on-blk_24x24', visible: ko.observable(true),
            tooltip: oj.Translations.getTranslatedString('wrc-header.icons.help.tooltip')
          },
          separator: {iconFile: 'separator-vertical_6x24',
            tooltip: oj.Translations.getTranslatedString('wrc-perspective.icons.separator.tooltip')
          },
          connectivity: {
            online: {iconFile: 'console-state-bar-grn_13x30',
              tooltip: oj.Translations.getTranslatedString('wrc-connectivity.icons.online.tooltip')
            },
            offline: {iconFile: 'console-state-bar-ylw_13x30',
              tooltip: oj.Translations.getTranslatedString('wrc-connectivity.icons.offline.tooltip')
            },
            detached: {iconFile: 'console-state-bar-red_13x30',
              tooltip: oj.Translations.getTranslatedString('wrc-connectivity.icons.detached.tooltip')
            },
            unattached: {iconFile: 'console-state-bar-clr_13x30',
              tooltip: oj.Translations.getTranslatedString('wrc-connectivity.icons.unattached.tooltip')
            },
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

      this.alerts = {count: ko.observable(5)};

      this.domainConnectionModuleConfig = ModuleElementUtils.createConfig({
        name: 'branding-area/console-backend-connection',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          onDataProvidersEmpty: viewParams.onDataProvidersEmpty
        }
      });

      this.navtreeTogglerModuleConfig = ModuleElementUtils.createConfig({
        name: 'branding-area/navtree-toggler',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling,
          perspective: viewParams.perspective,
          onResized: viewParams.onResized
        }
      });

      this.simpleSearchModuleConfig = ModuleElementUtils.createConfig({
        name: 'branding-area/simple-search',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling
        }
      });

      this.messageLineModuleConfig = ModuleElementUtils.createConfig({
        name: 'branding-area/message-line',
        params: {
          parentRouter: viewParams.parentRouter,
          signaling: viewParams.signaling
        }
      });

      this.signalBindings = [];

      this.connected = function () {
        notifyUnsavedChanges(false);
        setThemePreference(Preferences.general.themePreference());

        let binding = viewParams.signaling.modeChanged.add((newMode) => {
          setConsoleStateBar(newMode) ;
          changedDomainConnectState();
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.backendConnectionLost.add(() => {
          setConsoleStateBar(CoreTypes.Console.RuntimeMode.DETACHED.name) ;
          changedDomainConnectState();
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderSelected.add(dataProvider => {
          setConsoleConnectionInsecureState(dataProvider?.status?.insecure ? true : false);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.projectSwitched.add((fromProject) => {
          setConsoleStateBar(CoreTypes.Console.RuntimeMode.UNATTACHED.name);
          setConsoleConnectionInsecureState(false);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            setConsoleStateBar(CoreTypes.Console.RuntimeMode.UNATTACHED.name);
            setConsoleConnectionInsecureState(false);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.themeChanged.add((newTheme) => {
          setThemePreference(newTheme);
        });

        self.signalBindings.push(binding);
      }.bind(this);

      this.disconnected = function () {
        // Detach all signal "add" bindings
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];
      }.bind(this);

      this.brandingAreaIconbarClickListener = (event) => {
        console.log(`[HEADER] event.currentTarget.id=${event.currentTarget.id}`);
        switch (event.currentTarget.id) {
          case 'help':
            goToDocs();
            break;
        }
      };

      function goToDocs() {
        if (ViewModelUtils.isElectronApiAvailable()) {
          window.electron_api.ipc.invoke('external-url-opening', Runtime.getDocsURL())
        }
        else {
          window.open(Runtime.getDocsURL(), '_blank', 'noopener noreferrer');
        }
      }

      function setThemePreference(theme) {
        let ele = document.querySelector('header');
        if (ele !== null) {
          ele.style.backgroundColor = Runtime.getConfig()['preferences']['themes'][theme][0];
          switch(theme){
            case 'light':
              ele.style.color = 'black';
              break;
            case 'dark':
              ele.style.color = 'white';
              break;
          }
        }
      }

      function changedDomainConnectState() {
        self.domainsConnectState(Runtime.getDomainConnectState());
      }

      function setConsoleStateBar(newMode){
        let img;
        const canvas = document.getElementById('console-state-bar');
        if (canvas !== null) {
          canvas.setAttribute('title', newMode);
          const ctx = canvas.getContext('2d');
          switch(newMode){
            case CoreTypes.Console.RuntimeMode.ONLINE.name:
              img = document.getElementById('online-icon');
              ctx.drawImage(img, 0, 0);
              break;
            case CoreTypes.Console.RuntimeMode.OFFLINE.name:
              img = document.getElementById('offline-icon');
              ctx.drawImage(img, 0, 0);
              break;
            case CoreTypes.Console.RuntimeMode.DETACHED.name:
              img = document.getElementById('detached-icon');
              ctx.drawImage(img, 0, 0);
              break;
            case CoreTypes.Console.RuntimeMode.UNATTACHED.name:
              img = document.getElementById('unattached-icon');
              ctx.drawImage(img, 0, 0);
              break;
          }
        }
      }

      function setConsoleConnectionInsecureState(isDisplayed) {
        self.i18n.icons.connectivity.insecure.visible(isDisplayed);
      }

      function notifyUnsavedChanges(state) {
        window.electron_api?.ipc.invoke('unsaved-changes', state)
          .then()
          .catch(response => {
            ViewModelUtils.failureResponseDefaultHandling(response);
          });
      }
    }

    return HeaderTemplate;
  }
);
