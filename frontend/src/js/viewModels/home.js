/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', 'wrc-frontend/core/utils', 'ojs/ojmodule-element', 'ojs/ojknockout',  'ojs/ojnavigationlist'],
  function(oj, ko, ModuleElementUtils, CoreUtils) {
    function HomeViewModel(viewParams) {
      const self = this;

      this.i18n = {
        tabstrip: {
          tabs: [
            {id: 'gallery', iconFile: 'gallery-tabstrip-icon_24x24', disabled: false, visible: true, isDefault: true,
              label: oj.Translations.getTranslatedString('wrc-home.tabstrip.tabs.gallery.label')
            }
          ]
        }
      };

      this.tabModuleConfig = ko.observable({ view: [], viewModel: null });

      this.connected = function() {
        createHomeChildRouter();

        this.routerSubscription = this.router.currentValue.subscribe(function (value) {
          if (value) {
            ModuleElementUtils.createConfig({
              name: value,
              viewPath: 'views/' + value + '.html',
              modelPath: 'viewModels/' + value,
              params: {
                parentRouter: this.router,
                signaling: viewParams.signaling
              }
            })
            .then(moduleConfig => {
              this.tabModuleConfig(moduleConfig);
            });
          }
          else {
            this.tabModuleConfig({ view: [], viewModel: null });
          }
        }.bind(this));

        // The following line will trigger the currentValue subscription
        // on this.router.
        setTabNode(self.i18n.tabstrip.tabs[0]);

      }.bind(this);

      this.disconnected = function() {
        // Dispose of change subscriptions on knockout observables.
        self.routerSubscription.dispose();
      }.bind(this);

      /**
       * Called when user clicks icon or label of sideways tabstrip item
       * @param {CustomEvent} event
       */
      this.tabstripButtonClickHandler = function(event) {
        let id;
        if (event.target.localName === 'img') {
          id = event.target.nextElementSibling.id;
        }
        else if (event.target.id && event.target.id.length !== 0) {
          id = event.target.id;
        }
        else {
          return;
        }

        const tabNode = self.i18n.tabstrip.tabs.find(item => item.id === id);
        setTabNode(tabNode);
      };

      function createHomeChildRouter() {
        self.router = viewParams.parentRouter.getChildRouter('home');

        if (CoreUtils.isNotUndefinedNorNull(self.router)) self.router.dispose();

        self.router = viewParams.parentRouter.createChildRouter('home').configure({
          'gallery': {label: 'Gallery', value: 'gallery', isDefault: true}
        });
      }

      function setTabNode(tabNode) {
        if (!tabNode.disabled) {
          // This will trigger a change event that will cause
          // our self.routerSubscription() to be called.
          self.router.go(tabNode.id);
        }
      }

    }

    /*
    * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
    * return a constructor for the ViewModel so that the ViewModel is constructed
    * each time the view is displayed.
    */
    return HomeViewModel;
  }
);
