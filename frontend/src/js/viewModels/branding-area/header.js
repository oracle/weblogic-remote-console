/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', 'wrc-frontend/apis/data-operations', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/runtime', 'wrc-frontend/microservices/preferences/preferences', 'wrc-frontend/core/types', 'wrc-frontend/core/utils', 'ojs/ojcontext', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojmodule', 'ojs/ojradioset', 'ojs/ojinputsearch'],
  function(oj, ko, ModuleElementUtils, DataOperations, MessageDisplaying, ViewModelUtils, Runtime, Preferences, CoreTypes, CoreUtils, Context) {
    function HeaderTemplate(viewParams){
      var self = this;

      this.i18n = {
        header: {
          app: {
            version: { value: Runtime.getProperty(Runtime.PropertyName.CFE_VERSION) }
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
              }
            }
          }
        }
      };

      // Initialize instance-scope variables used in header.html
      this.appInfoTitleClass = (viewParams.smScreen ? 'branding-area-title-sm' : 'branding-area-title-md');
      this.appName = oj.Translations.getTranslatedString('wrc-header.text.appName');
      this.domainsConnectState = ko.observable();
      this.linkLabel = ko.observable();
      this.linkResourceData = ko.observable();
      this.simpleSearchPerspective = ko.observable();
      this.simpleSearchResourceData = ko.observable();
      this.simpleSearchValue = ko.observable('');

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

      this.signalBindings = [];

      this.connected = function () {
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
        });

        self.signalBindings.push(binding);

        //setup for security warning link.
        binding = viewParams.signaling.dataProviderSelected.add(dataProvider => {
          this.linkLabel(dataProvider.linkLabel);
          this.linkResourceData(dataProvider.linkResourceData);
          // setup the simple search
          this.simpleSearchPerspective(dataProvider.beanTrees[0].type);
          this.simpleSearchResourceData(dataProvider.beanTrees[0].simpleSearch);
          setSimpleSerachState(CoreUtils.isNotUndefinedNorNull(this.simpleSearchResourceData()));
        });

        binding = viewParams.signaling.domainSecurityWarning.add(dataProvider => {
          this.linkLabel(dataProvider.linkLabel);
          this.linkResourceData(dataProvider.linkResourceData);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            setConsoleStateBar(CoreTypes.Console.RuntimeMode.UNATTACHED.name);
            // disable the simple search
            this.simpleSearchResourceData(null);
            setSimpleSerachState(false);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.beanTreeChanged.add(newBeanTree => {
          if (newBeanTree.type !== 'home') {
            // switch the simple search
            this.simpleSearchPerspective(newBeanTree.type);
            this.simpleSearchResourceData(newBeanTree.simpleSearch);
            setSimpleSerachState(CoreUtils.isNotUndefinedNorNull(this.simpleSearchResourceData()));
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

      this.wrcAppIconClick = (event) => {
        viewParams.signaling.showStartupTasksTriggered.dispatch('triggered');
      };

      this.securityWarningLinkClick = (event) => {
        const warningResourceData = self.linkResourceData();
        if (CoreUtils.isNotUndefinedNorNull(warningResourceData) && (warningResourceData.length > 0)) {
          viewParams.parentRouter.go('/monitoring/' + encodeURIComponent(warningResourceData));
        }
      };

      this.handleSimpleSearchAction = (event) => {
        const searchValue = event.detail.value;
        const searchUrl = self.simpleSearchResourceData();
        const searchPerspective = self.simpleSearchPerspective();
        if (CoreUtils.isNotUndefinedNorNull(searchUrl) && CoreUtils.isNotUndefinedNorNull(searchValue) && (searchValue.length > 0)) {
          DataOperations.mbean.simpleSearch(searchUrl, searchValue)
            .then(reply => {
              // Check for messages to display about the search
              if (CoreUtils.isNotUndefinedNorNull(reply.body.messages) && (reply.body.messages.length > 0)) {
                MessageDisplaying.displayResponseMessages(reply.body.messages);
              }
              // Route to the search results
              if (CoreUtils.isNotUndefinedNorNull(reply.body.data.resourceData)) {
                const encodedResouceData = encodeURIComponent(reply.body.data.resourceData.resourceData);
                viewParams.parentRouter.go('/' + searchPerspective + '/' + encodedResouceData);
              }
            })
            .catch(response => {
              if ((response.failureType === CoreTypes.FailureType.CBE_REST_API) &&
                  CoreUtils.isNotUndefinedNorNull(response.body.messages) && (response.body.messages.length > 0)) {
                MessageDisplaying.displayResponseMessages(response.body.messages);
              }
              else {
                ViewModelUtils.failureResponseDefaultHandling(response);
              }
            });
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

      // Perform the enable or disable of the simple search control in the header
      function setSimpleSerachState(enabled) {
        const ojDisabledClass = 'oj-disabled';
        const searchElement = '#cfe-simple-search';
        const ojInputSearch = document.querySelector(searchElement);
        const htmlInputText = document.querySelector(searchElement + ' input[type="text"]');
        if (enabled) {
          if (htmlInputText !== null) {
            htmlInputText.disabled = false;
          }
          if (ojInputSearch !== null) {
            ojInputSearch.classList.remove(ojDisabledClass);
          }
        }
        else {
          self.simpleSearchValue('');
          if (htmlInputText !== null) {
            htmlInputText.disabled = true;
          }
          if (ojInputSearch !== null) {
            ojInputSearch.classList.add(ojDisabledClass);
          }
        }
      }

      Context.getPageContext().getBusyContext().whenReady()
        .then(() => {
          setSimpleSerachState(CoreUtils.isNotUndefinedNorNull(this.simpleSearchResourceData()));
        });

    }

    return HeaderTemplate;
  }
);