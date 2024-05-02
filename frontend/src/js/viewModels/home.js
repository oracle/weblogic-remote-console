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
  'wrc-frontend/common/keyup-focuser',
  'ojs/ojcontext',
  'wrc-frontend/microservices/perspective/perspective-memory-manager',
  'wrc-frontend/core/runtime',
  'wrc-frontend/core/utils',
  'ojs/ojmodule-element',
  'ojs/ojknockout',
  'ojs/ojnavigationlist'
],
  function(
    oj,
    ko,
    ModuleElementUtils,
    KeyUpFocuser,
    Context,
    PerspectiveMemoryManager,
    Runtime,
    CoreUtils
  ) {
    function HomeViewModel(viewParams) {
      const self = this;

      this.i18n = {
        tabstrip: {
          tabs: [
            {id: 'gallery', iconFile: 'gallery-tabstrip-icon_24x24', disabled: false, visible: ko.observable(false), isDefault: true,
              label: oj.Translations.getTranslatedString('wrc-home.tabstrip.tabs.gallery.label')
            },
            {id: 'startup-tasks', iconFile: 'startup-tasks-tabstrip-icon_24x24', disabled: false, visible: ko.observable(false),
              label: oj.Translations.getTranslatedString('wrc-home.tabstrip.tabs.startup-tasks.label')
            }
          ]
        }
      };

      this.tabModuleConfig = ko.observable({ view: [], viewModel: null });

      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory('home');

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
                targetTabNodeExclusively(value);
                Context.getPageContext().getBusyContext().whenReady()
                  .then(() => {
                    const result = getKeyUpFocusSelector();
                    if (result.selector !== null) {
                      const rule = KeyUpFocuser.getLastExecutedRule(result.selector);
                      if (rule.focusIndexValue !== -1 &&
                        CoreUtils.isNotUndefinedNorNull($(result.selector)[rule.focusIndexValue])
                      ) {
                        $(result.selector)[rule.focusIndexValue].focus();
                      }
                    }
                  });
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
              tabNode.visible(options.chooser === 'use-cards');
              if (tabNode.selected) {
                self.tabModuleConfig().viewModel.showStartupTasks({chooser: options.chooser});
              }
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

      function getKeyUpFocusSelector() {
        const result = {selector: null, hasFocusIndexValue: false};

        let card = document.querySelector('.startup-task-panel-card');

        if (card !== null) {
          result.selector = '.startup-task-panel-card';
          result.hasFocusIndexValue = true;
        }

        if (CoreUtils.isUndefinedOrNull(result.selector)) {
          card = document.querySelector('.gallery-panel-card');
          if (card !== null) {
            result.selector = '.gallery-panel-card';
            result.hasFocusIndexValue = true;
          }
        }

        return result;
      }

      function createHomeChildRouter() {
        self.router = viewParams.parentRouter.getChildRouter('home');

        if (CoreUtils.isNotUndefinedNorNull(self.router)) self.router.dispose();

        self.router = viewParams.parentRouter.createChildRouter('home').configure({
          'gallery': {label: 'Gallery', value: 'gallery', isDefault: true},
          'startup-tasks': {label: 'Startup Tasks', value: 'startup-tasks'}
        });
      }

      function selectTabNode(tabNode) {
        if (!tabNode.disabled) {
          targetTabNodeExclusively(tabNode.id);
          // This will trigger a change event that will cause
          // our self.routerSubscription() to be called.
          self.router.go(tabNode.id);
        }
      }

      function targetTabNodeExclusively(tabId) {
        self.i18n.tabstrip.tabs.forEach((tab) => {
          tab.visible(tab.id === tabId);
          tab.selected = (tab.id === tabId);
        })
      }

      /**
       *
       * @param {string} tabId
       * @returns {{isDefault: boolean, visible: *, iconFile: string, disabled: boolean, id: string, label: *}|{visible: *, iconFile: string, disabled: boolean, id: string, label: *}}
       */
      function getTabNode(tabId) {
        let tabNode;
        const index = self.i18n.tabstrip.tabs.findIndex(tab => tab.id === tabId);
        if (index !== -1) tabNode = self.i18n.tabstrip.tabs[index];
        return tabNode;
      }

      function getSelectedTabNode() {
        return self.i18n.tabstrip.tabs.find(tab => tab.selected);
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
