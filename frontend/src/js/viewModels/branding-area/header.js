/**
 * @license
 * Copyright (c) 2020, 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', 'wrc-frontend/core/runtime', 'wrc-frontend/microservices/preferences/preferences', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojmodule', 'wrc-frontend/integration/viewModels/utils'],
  function(oj, ko, ModuleElementUtils, Runtime, Preferences, CoreTypes, CoreUtils, ViewModelUtils) {
    function notifyUnsavedChanges(state) {
      window.electron_api?.ipc.invoke('unsaved-changes', state)
        .then()
        .catch(response => {
          ViewModelUtils.failureResponseDefaultHandling(response);
        });
    }
    function HeaderTemplate(viewParams){
      const self = this;

      this.i18n = {
        header: {
          app: {
            version: { value: Runtime.getProperty(Runtime.PropertyName.CFE_VERSION) },
            name: ko.observable()
          },
          icons: {
            wrcApp: {iconFile: 'wrc-app-icon-color_88x78'},
            connectivity: {
              online: {iconFile: 'console-state-bar-grn_13x30',
                tooltip: oj.Translations.getTranslatedString('wrc-header.icons.connectivity.online.tooltip')
              },
              offline: {iconFile: 'console-state-bar-ylw_13x30',
                tooltip: oj.Translations.getTranslatedString('wrc-header.icons.connectivity.offline.tooltip')
              },
              detached: {iconFile: 'console-state-bar-red_13x30',
                tooltip: oj.Translations.getTranslatedString('wrc-header.icons.connectivity.detached.tooltip')
              },
              unattached: {iconFile: 'console-state-bar-clr_13x30',
                tooltip: oj.Translations.getTranslatedString('wrc-header.icons.connectivity.unattached.tooltip')
              },
              insecure: {iconFile: 'alert-insecure-connection-blk_24x24',
                text: oj.Translations.getTranslatedString('wrc-header.icons.connectivity.insecure.text'),
                title: oj.Translations.getTranslatedString('wrc-data-providers.checkboxes.insecure.label')
              }
            }
          }
        }
      };

      // Initialize instance-scope variables used in header.html
      this.appInfoTitleClass = (viewParams.smScreen ? 'branding-area-title-sm' : 'branding-area-title-md');
      this.appName = oj.Translations.getTranslatedString('wrc-header.text.appName');
      this.i18n.header.app.name(this.appName);
      this.domainsConnectState = ko.observable();
      this.linkLabel = ko.observable();
      this.linkResourceData = ko.observable();

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

        binding = viewParams.signaling.projectSwitched.add((fromProject) => {
          setConsoleStateBar(CoreTypes.Console.RuntimeMode.UNATTACHED.name);
          setConsoleConnectionInsecureState(false);
          clearConsoleSecurityWarningLink();
        });

        self.signalBindings.push(binding);

        //setup for security warning link.
        binding = viewParams.signaling.dataProviderSelected.add(dataProvider => {
          setConsoleSecurityWarningLink(dataProvider);
          setConsoleConnectionInsecureState(dataProvider?.status?.insecure ? true : false);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.domainSecurityWarning.add(dataProvider => {
          setConsoleSecurityWarningLink(dataProvider);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            setConsoleStateBar(CoreTypes.Console.RuntimeMode.UNATTACHED.name);
            setConsoleConnectionInsecureState(false);
            clearConsoleSecurityWarningLink();
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

      function setThemePreference(theme) {
        let ele = document.querySelector('header');
        if (ele !== null) {
          ele.style.backgroundColor = Runtime.getConfig()['settings']['themes'][theme][0];
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

      this.securityWarningLinkClick = (event) => {
        const warningResourceData = self.linkResourceData();
        if (CoreUtils.isNotUndefinedNorNull(warningResourceData) && (warningResourceData.length > 0)) {
          viewParams.parentRouter.go('/monitoring/' + encodeURIComponent(warningResourceData));
        }
      };

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
        const div = document.getElementById('wrc-insecure-state');
        if (div !== null) div.style.display = (isDisplayed ? 'inline-flex' : 'none');
      }

      function setConsoleSecurityWarningLink(dataProvider) {
        self.linkLabel(dataProvider.linkLabel);
        self.linkResourceData(dataProvider.linkResourceData);
      }

      function clearConsoleSecurityWarningLink() {
        self.linkLabel('');
        self.linkResourceData('');
      }

    }

    return HeaderTemplate;
  }
);
