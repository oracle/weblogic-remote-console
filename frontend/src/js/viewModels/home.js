/**
 * @license
 * Copyright (c) 2020, 2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['ojs/ojcore', 'knockout', 'ojs/ojmodule-element-utils', 'wrc-frontend/core/runtime', 'wrc-frontend/core/utils', 'ojs/ojmodule-element', 'ojs/ojknockout',  'ojs/ojnavigationlist'],
  function(oj, ko, ModuleElementUtils, Runtime, CoreUtils) {
    function HomeViewModel(viewParams) {
      const self = this;

      this.i18n = {
        tabstrip: {
          tabs: [
            {id: 'gallery', iconFile: 'gallery-tabstrip-icon_24x24', disabled: false, visible: ko.observable(false), isDefault: true,
              label: oj.Translations.getTranslatedString('wrc-home.tabstrip.tabs.gallery.label')
            },
            {id: 'startup-tasks', iconFile: 'tasks-tabstrip-icon_24x24', disabled: false, visible: ko.observable(false),
              label: oj.Translations.getTranslatedString('wrc-home.tabstrip.tabs.startup-tasks.label')
            }
          ]
        }
      };

      this.tabModuleConfig = ko.observable({ view: [], viewModel: null });

      this.signalBindings = [];
      this.subscriptions = [];

      this.connected = function() {
        createHomeChildRouter();

        let subscription = this.router.currentValue.subscribe(function (value) {
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
                showTabNodeExclusively(value);
              });
          }
          else {
            this.tabModuleConfig({ view: [], viewModel: null });
          }

        }.bind(this));
        this.subscriptions.push(subscription);

        let binding = viewParams.signaling.tabStripTabSelected.add((source, tabId, options) => {
          const tabNode = getTabNode(tabId);
          if (CoreUtils.isNotUndefinedNorNull(tabNode)) {
            if (tabNode.id === 'startup-tasks') {
              self.i18n.tabstrip.tabs[0].visible(false);
            }
            selectTabNode(tabNode);
          }
        });

        self.signalBindings.push(binding);

        // The following line will trigger the currentValue subscription
        // on this.router.
        selectTabNode(self.i18n.tabstrip.tabs[0]);
      };

      this.disconnected = function() {
        self.subscriptions.forEach((item) => {
          if (item.name) {
            item.subscription.dispose();
          }
          else {
            item.dispose();
          }
        });
        self.subscriptions = [];

        self.signalBindings.forEach(binding => { binding.detach(); });
        self.signalBindings = [];
      };

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
        selectTabNode(tabNode);
      };

      function createHomeChildRouter() {
        self.router = viewParams.parentRouter.getChildRouter('home');

        if (CoreUtils.isNotUndefinedNorNull(self.router)) self.router.dispose();

        self.router = viewParams.parentRouter.createChildRouter('home').configure({
          'gallery': {label: 'Gallery', value: 'gallery', isDefault: true},
          'startup-tasks': {label: 'Tasks', value: 'startup-tasks'}
        });
      }

      function selectTabNode(tabNode) {
        if (!tabNode.disabled) {
          showTabNodeExclusively(tabNode.id);
          // This will trigger a change event that will cause
          // our self.routerSubscription() to be called.
          self.router.go(tabNode.id);
          const ele = document.getElementById(`${tabNode.id}-container`);
          if (ele !== null) ele.focus();
        }
      }

      function showTabNodeExclusively(tabId) {
        self.i18n.tabstrip.tabs.forEach((tab) => {
          tab.visible(tab.id === tabId);
        })
      }

      /**
       *
       * @param {string} tabId
       * @returns {{isDefault: boolean, visible: *, iconFile: string, disabled: boolean, id: string, label: *}|{visible: *, iconFile: string, disabled: boolean, id: string, label: *}}
       */
      function getTabNode(tabId) {
        let tabNode;
        const index = self.i18n.tabstrip.tabs.map(tab => tab.id).indexOf(tabId);
        if (index !== -1) tabNode = self.i18n.tabstrip.tabs[index];
        return tabNode;
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
