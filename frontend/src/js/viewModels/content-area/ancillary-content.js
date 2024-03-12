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
  'wrc-frontend/microservices/perspective/perspective-memory-manager',
  'wrc-frontend/core/runtime',
  'wrc-frontend/microservices/ataglance/ataglance-manager',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/types',
  'wrc-frontend/core/utils',
  'ojs/ojmodule-element',
  'ojs/ojknockout',
  'ojs/ojnavigationlist'
],
  function(
    oj,
    ko,
    ModuleElementUtils,
    PerspectiveMemoryManager,
    Runtime,
    AtAGlanceManager,
    ViewModelUtils,
    CoreTypes,
    CoreUtils
  ) {
    function ContentAreaAncillaryContent(viewParams){
      const self = this;

      /** @type {Readonly<{RECENT: {name: string}, PROVIDER_MANAGEMENT: {name: string}, SHOPPING_CART: {name: string}, AT_A_GLANCE: {name: string}, TIPS: {name: string}}>} */
      const Tabs = Object.freeze({
        SHOPPING_CART: {name: 'shoppingcart'},
        AT_A_GLANCE: {name: 'ataglance'},
        PROVIDER_MANAGEMENT: {name: 'provider-management'},
        TIPS: {name: 'tips'}
      });
      const tabFromName = (name) => {return Object.values(Tabs).find(tab => tab.name === name); };

      this.tabModuleConfig = ko.observable({ view: [], viewModel: null });
      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory('ancillary');
      this.selectedItem = {id: ko.observable(''), state: 'closed', source: null, options: {}};

      // Declare module-scoped variable for storing
      // bindings to "add" signal handlers.
      this.signalBindings = [];
      this.subscriptions = [];

      this.connected = function() {
        // Reset data-elected-item attribute
        setDataSelectedItem('none');

        let subscription = this.selectedItem.id.subscribe(function (newValue){
          const itemId = getDataSelectedItem();

          if (CoreUtils.isNotUndefinedNorNull(itemId) && newValue !== itemId) {
            const viewPath = `views/content-area/ancillary/${newValue}.html`;
            const modelPath = `viewModels/content-area/ancillary/${newValue}`;
            ModuleElementUtils.createConfig({
              viewPath: viewPath,
              viewModelPath: modelPath,
              params: {
                parentRouter: viewParams.parentRouter,
                signaling: viewParams.signaling,
                cachedState: this.perspectiveMemory.tabstrip.tab[newValue].cachedState,
                options: this.selectedItem.options,
                canExitCallback: this.canExitCallback,
                onCachedStateChanged: changeTabModuleTabCachedState,
                onClose: closeAncillaryContentItem,
                onUnhide: openAncillaryContentItem
                }
              })
                .then(moduleConfig => {
                  // Assign fulfilled promise to tabModuleConfig
                  // knockout observable.
                  this.tabModuleConfig(moduleConfig);

                  const onTimeout = (newValue, options) => {
                    setDataSelectedItem(newValue);
                    openAncillaryContentItem(options);
                  };

                  // Call setTimeout passing in the callback function and the
                  // timeout milliseconds. Here, we use the bind() method to
                  // pass parameters to the callback.
                  setTimeout(onTimeout.bind(undefined, newValue, this.selectedItem.options), 5);
                  // DON'T PUT ANY CODE IN THIS FUNCTION AFTER THIS POINT !!!
                });
          }

        }.bind(this));
        this.subscriptions.push(subscription);

        // Be sure to create a binding for any signaling add in
        // this module. In fact, the code for the add needs to
        // be moved here physically.

        let binding = viewParams.signaling.ancillaryContentItemSelected.add((source, itemId, options = {}) => {
          const tab = tabFromName(itemId);

          if (CoreUtils.isNotUndefinedNorNull(tab)) {
            if (Object.keys(options).length > 0) self.selectedItem.options = options;

            if (source === 'perform-login') {
              // When login action is the source, update the list of dataproviders as well as
              // handling the tabstrip visibility. Note that use of dataProviderSelected will
              // have additional effects on the console and is signaled when login completes.
              setAncillaryContentItemCachedState(self.tabModuleConfig(), tab.name);
            }

            if (self.selectedItem.id() === '') {
              // Means this the first ancillary content item being accessed.
              // Set the selectedItem.source to source, in case the change
              // event needs it.
              self.selectedItem.source = source;
              // Set the selectedItem.id() observable, which will trigger a
              // change event.
              self.selectedItem.id(tab.name);
            }
            else if (self.selectedItem.id() !== tab.name) {
              // Means another ancillary content item was accessed earlier,
              // and it wasn't tab.name. First update the cached state for
              // the earlier accessed item.
              setAncillaryContentItemCachedState(self.tabModuleConfig(), self.selectedItem.id());
              // Then dispatch an ancillaryContentItemToggled(self.selectedItem.id(), "closed")
              // signal.
              closeAncillaryContentItem();
              // Then load tas.name into moduleConfig using the
              // change subscription on the id observable.
              self.selectedItem.id(tab.name);
            }
            else if (self.selectedItem.state === 'opened') {
              // Means tab.name is the same as selectedItem.id(),
              // and thw state equals "opened". This means we're
              // "toggling" the ancillary content item to the
              // "closed" state, but not changing the moduleConfig.
              setAncillaryContentItemCachedState(self.tabModuleConfig(), self.selectedItem.id());
              // Then dispatch an ancillaryContentItemToggled(self.selectedItem.id(), "closed")
              // signal.
              closeAncillaryContentItem();
            }
            else {
              if (Object.keys(options).length > 0) self.selectedItem.options = options;
              // Means this is not the first ancillary content item
              // being accessed, and tab.name is the same one already
              // loaded in a moduleConfig, and the state is either
              // "closed" or "hidden".
              openAncillaryContentItem(options);
            }
          }

        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.ancillaryContentItemCleared.add((source) => {
          closeAncillaryContentItem();
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.navtreeToggled.add((source, visible) => {
          if (visible) closeAncillaryContentItem();
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.navtreeSelectionChanged.add((source, node, beanTree) => {
          closeAncillaryContentItem();
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderSelected.add((dataProvider) => {
          self.canExitCallback = undefined;
          closeAncillaryContentItem();
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.unsavedChangesDetected.add((exitFormCallback) => {
          self.canExitCallback = exitFormCallback;
        });

        self.signalBindings.push(binding);

      }.bind(this);

      this.disconnected = function () {
        self.subscriptions.forEach((item) => {
          if (item.name) {
            item.subscription.dispose();
          }
          else {
            item.dispose();
          }
        });

        self.subscriptions = [];

        // Detach all signal "add" bindings
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];

      }.bind(this);

      function openAncillaryContentItem(options = {stealthEnabled: false}) {
        if (!options.stealthEnabled) {
          self.selectedItem.state = 'opened';
          viewParams.signaling.ancillaryContentItemToggled.dispatch('ancillary-content', {id: self.selectedItem.id(), state: self.selectedItem.state}, options);
        }
      }

      function closeAncillaryContentItem() {
        if (self.selectedItem.id() !== '') {
          self.selectedItem.state = 'closed';
          viewParams.signaling.ancillaryContentItemToggled.dispatch('ancillary-content', {id: self.selectedItem.id(), state: self.selectedItem.state}, {});
        }
      }

      function getDataSelectedItem() {
        let itemId;
        const div = document.querySelector('[data-selected-item]');
        if (div !== null) {
          itemId = div.getAttribute('data-selected-item');
        }
        return itemId;
      }

      function setDataSelectedItem(newValue) {
        const div = document.querySelector('[data-selected-item]');
        if (div !== null) {
          div.setAttribute('data-selected-item', newValue);
        }
      }

      function clearDataSelectedItem() {
        const dataSelectedItem = getDataSelectedItem();
      }

      function setAncillaryContentItemCachedState(moduleConfig, itemId) {
        if (moduleConfig.viewModel !== null &&
          CoreUtils.isNotUndefinedNorNull(moduleConfig.viewModel.tabNode) &&
          CoreUtils.isNotUndefinedNorNull(moduleConfig.viewModel.getCachedState)
        ) {
          changeTabModuleTabCachedState(itemId, moduleConfig.viewModel.getCachedState());
        }
      }

      function changeTabModuleTabCachedState(itemId, cachedState) {
        if (CoreUtils.isNotUndefinedNorNull(self.perspectiveMemory.tabstrip.tab[itemId])) {
          self.perspectiveMemory.tabstrip.tab[itemId] = {cachedState: cachedState};
        }
      }

    }

    return ContentAreaAncillaryContent;
  }
);
